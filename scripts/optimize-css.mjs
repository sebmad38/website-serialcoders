import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import postcss from 'postcss';

/** Remove only earlier declarations guaranteed to lose to an identical later selector. */
export function removeShadowedDeclarations(css) {
  const root = postcss.parse(css);
  let removed = 0;
  function optimize(container) {
    const winners = new Map();
    for (const node of [...container.nodes].reverse()) {
      if (node.type === 'atrule' && node.nodes) optimize(node);
      if (node.type !== 'rule') continue;
      for (const declaration of [...node.nodes].reverse()) {
        if (declaration.type !== 'decl' || declaration.prop.startsWith('--')) continue;
        // Preserve fallbacks for variables and newer CSS functions/vendor values.
        if (/[()]/.test(declaration.value) || /(?:^|\s)-[a-z]+-/.test(declaration.value)) continue;
        const key = `${node.selector}|${declaration.prop}|${Boolean(declaration.important)}`;
        if (winners.has(key)) {
          declaration.remove();
          removed++;
        } else winners.set(key, true);
      }
      if (!node.nodes.length) node.remove();
    }
  }
  optimize(root);
  return { css: root.toString(), removed };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = 'src/styles/proposal-b.css';
  const result = removeShadowedDeclarations(await readFile(file, 'utf8'));
  await writeFile(file, result.css);
  console.log(`${result.removed} déclarations écrasées supprimées.`);
}
