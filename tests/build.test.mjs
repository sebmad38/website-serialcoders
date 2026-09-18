import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { buildSite } from '../src/lib/build.mjs';
import { createManifest } from '../src/lib/files.mjs';
import { validateConfig } from '../src/lib/config.mjs';

test('Build restores all assets, removes retired routes and preserves output on invalid config', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'serialcoders-rebuild-'));
  try {
    const output = join(directory, 'dist');
    const config = JSON.parse(await readFile('site.config.json', 'utf8'));
    const unrelated = join(directory, 'personal-files');
    await mkdir(unrelated);
    await writeFile(join(unrelated, 'keep.txt'), 'keep');
    await assert.rejects(buildSite({ outputDirectory: unrelated, config }), /Refus de remplacer/);
    assert.equal(await readFile(join(unrelated, 'keep.txt'), 'utf8'), 'keep');
    await buildSite({ outputDirectory: output, config });
    for (const file of ['contact.js', 'site.js', 'style.css', 'fonts/fonts.css', 'index.html'])
      await access(join(output, file));
    const manifest = JSON.parse(await readFile(join(output, 'release-manifest.json'), 'utf8'));
    assert.deepEqual(manifest, await createManifest(output));
    await mkdir(join(output, 'obsolete'));
    await writeFile(join(output, 'obsolete/index.html'), 'obsolete');
    await buildSite({ outputDirectory: output, config });
    await assert.rejects(access(join(output, 'obsolete')), { code: 'ENOENT' });
    assert.deepEqual(await createManifest(output), manifest);
    await assert.rejects(
      buildSite({ outputDirectory: output, config: { ...config, design: 'invalid' } }),
    );
    assert.deepEqual(await createManifest(output), manifest);
    await buildSite({
      outputDirectory: output,
      config: { ...config, production: false, design: 'modern' },
    });
    assert.match(await readFile(join(output, 'robots.txt'), 'utf8'), /Disallow/);
    assert.match(await readFile(join(output, 'index.html'), 'utf8'), /href="\/modern.css"/);
  } finally {
    assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + sep));
    assert.ok(directory.split(sep).at(-1).startsWith('serialcoders-rebuild-'));
    await rm(directory, { recursive: true, force: true });
  }
});

test('Configuration rejects ambiguous release modes and unsafe origins', () => {
  const valid = { origin: 'https://example.com', production: false, design: 'modern' };
  for (const override of [
    { production: 'false' },
    { origin: 'http://example.com' },
    { origin: 'https://example.com/path' },
    { googleAnalyticsId: 'bad' },
  ])
    assert.throws(() => validateConfig({ ...valid, ...override }));
});
