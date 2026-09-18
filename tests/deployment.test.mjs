import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { checkDeployment } from '../src/lib/check-deployment.mjs';
import { outputDirectory, outputPath } from './helpers/output.mjs';

test('Nginx template requires revalidation for stable script and stylesheet URLs', async () => {
  const configuration = await readFile('deploy/nginx.conf', 'utf8');
  const rule = configuration.split('location ~* \\.(css|js)$ {')[1]?.split('}')[0];
  assert.ok(rule, 'CSS/JS need their own cache policy');
  assert.match(rule, /expires\s+-1;/);
  assert.doesNotMatch(rule, /expires\s+1h/);
});

test('Deployment verifies contact.js and rejects a stale copy', async () => {
  let corrupted = false;
  const fetcher = async (url) => {
    const path = url.pathname;
    if (path === '/verification-page-absente-serialcoders/')
      return new Response(await readFile(outputPath('404.html')), { status: 404 });
    if (corrupted && path === '/contact.js') return new Response('stale');
    return new Response(
      await readFile(outputPath(path.slice(1) + (path.endsWith('/') ? 'index.html' : ''))),
      {
        headers: { 'content-type': path.endsWith('/') ? 'text/html' : 'application/octet-stream' },
      },
    );
  };
  const options = {
    base: 'https://example.com',
    directory: outputDirectory,
    production: true,
    fetcher,
    report: () => {},
  };
  assert.equal(await checkDeployment(options), 0);
  corrupted = true;
  assert.equal(await checkDeployment(options), 1);
});
