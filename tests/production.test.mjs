import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, copyFile, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

test('Production build is indexable without altering the preview', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'serialcoders-build-'));
  try {
    await mkdir(join(directory, 'scripts'));
    await copyFile('scripts/build.mjs', join(directory, 'scripts/build.mjs'));
    await copyFile('scripts/editorial.mjs', join(directory, 'scripts/editorial.mjs'));
    await copyFile('scripts/local-pages.mjs', join(directory, 'scripts/local-pages.mjs'));
    await mkdir(join(directory, 'data'));
    await copyFile('data/communes.json', join(directory, 'data/communes.json'));
    const config = JSON.parse(await readFile('site.config.json', 'utf8'));
    config.production = true;
    await writeFile(join(directory, 'site.config.json'), JSON.stringify(config));
    execFileSync(process.execPath, ['scripts/build.mjs'], {cwd:directory, stdio:'pipe'});
    const robots = await readFile(join(directory, 'dist/robots.txt'), 'utf8');
    assert.match(robots, /Allow: \//);
    assert.doesNotMatch(robots, /Disallow:/);
    const sitemap = await readFile(join(directory, 'dist/sitemap.xml'), 'utf8');
    const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname.slice(1));
    for (const route of routes) {
      const html = await readFile(join(directory, `dist/${route}index.html`), 'utf8');
      assert.match(html, /name="robots" content="index, follow"/);
      assert.doesNotMatch(html, /noindex/);
    }
  } finally {
    // Only this test's newly created temporary directory may be removed.
    const target = resolve(directory);
    assert.ok(target.startsWith(resolve(tmpdir()) + (process.platform === 'win32' ? '\\' : '/')));
    assert.ok(target.split(/[\\/]/).at(-1).startsWith('serialcoders-build-'));
    await rm(target, {recursive:true, force:true});
  }
});
