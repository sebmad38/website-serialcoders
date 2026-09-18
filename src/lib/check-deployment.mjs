import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { listFiles, sha256 } from './files.mjs';

export async function checkDeployment({
  base,
  directory,
  production,
  fetcher = fetch,
  report = console.log,
}) {
  const origin = new URL(base);
  if (
    !['http:', 'https:'].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash
  )
    throw new Error('Origine HTTP(S) sans chemin ni identifiants requise.');
  if (production && origin.protocol !== 'https:')
    throw new Error('La production doit être vérifiée en HTTPS.');
  const manifest = JSON.parse(await readFile(join(directory, 'release-manifest.json'), 'utf8'));
  const actualFiles = await listFiles(directory);
  assert.deepEqual(
    Object.keys(manifest.files).sort(),
    actualFiles.filter((file) => file !== 'release-manifest.json').sort(),
    'Manifeste incomplet',
  );
  let failures = 0;
  const get = (path) =>
    fetcher(new URL(path, origin), { signal: AbortSignal.timeout(15000), redirect: 'manual' });
  for (const file of actualFiles) {
    if (file === '404.html') continue;
    const route =
      '/' + (file === 'index.html' ? '' : file.endsWith('/index.html') ? file.slice(0, -10) : file);
    try {
      const expected = await readFile(join(directory, file));
      if (file !== 'release-manifest.json')
        assert.equal(
          sha256(expected),
          manifest.files[file],
          'Fichier local différent du manifeste',
        );
      const response = await get(route);
      assert.equal(response.status, 200, `HTTP ${response.status}`);
      assert.ok(
        Buffer.from(await response.arrayBuffer()).equals(expected),
        'Contenu servi différent',
      );
      if (route.endsWith('/')) {
        assert.match(response.headers.get('content-type') || '', /text\/html/i);
        if (production)
          assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /noindex|none/i);
      }
      report(`OK ${route}`);
    } catch (error) {
      failures++;
      report(`ÉCHEC ${route} : ${error.message}`);
    }
  }
  try {
    const response = await get('/verification-page-absente-serialcoders/');
    assert.equal(response.status, 404);
    assert.ok(
      Buffer.from(await response.arrayBuffer()).equals(await readFile(join(directory, '404.html'))),
      'Page 404 différente',
    );
  } catch (error) {
    failures++;
    report(`ÉCHEC page absente : ${error.message}`);
  }
  return failures;
}
