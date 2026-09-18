import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { buildSite } from '../src/lib/build.mjs';

test('Production build is indexable without altering the preview', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'serialcoders-build-'));
  try {
    const config = JSON.parse(await readFile('site.config.json', 'utf8'));
    config.production = true;
    await writeFile(join(directory, 'site.config.json'), JSON.stringify(config));
    await buildSite({ outputDirectory: join(directory, 'dist'), config });
    const robots = await readFile(join(directory, 'dist/robots.txt'), 'utf8');
    assert.match(robots, /Allow: \//);
    assert.doesNotMatch(robots, /Disallow:/);
    const sitemap = await readFile(join(directory, 'dist/sitemap.xml'), 'utf8');
    const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) =>
      new URL(match[1]).pathname.slice(1),
    );
    assert.equal(routes.length, 15);
    assert.ok(routes.includes('mentions-legales/'));
    assert.doesNotMatch(sitemap, /zones-intervention/);
    for (const route of routes) {
      const html = await readFile(join(directory, `dist/${route}index.html`), 'utf8');
      assert.match(html, /name="robots"\s+content="index, follow"/);
      assert.doesNotMatch(html, /noindex/);
      assert.doesNotMatch(html, /zones-intervention/);
    }
  } finally {
    // Only this test's newly created temporary directory may be removed.
    const target = resolve(directory);
    assert.ok(target.startsWith(resolve(tmpdir()) + (process.platform === 'win32' ? '\\' : '/')));
    assert.ok(target.split(/[\\/]/).at(-1).startsWith('serialcoders-build-'));
    await rm(target, { recursive: true, force: true });
  }
});
