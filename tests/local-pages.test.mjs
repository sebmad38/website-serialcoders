import { outputPath } from './helpers/output.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

test('Retired geographic pages are absent from the release and sitemap', async () => {
  await assert.rejects(access(outputPath('zones-intervention')), { code: 'ENOENT' });
  const sitemap = await readFile(outputPath('sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /zones-intervention/);
});
