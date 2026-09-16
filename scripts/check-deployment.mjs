import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Check the exact release on its target server; never mistake the old website for success.
const argument = process.argv[2];
if (!argument) throw new Error('Usage: node scripts/check-deployment.mjs https://adresse-du-serveur');
const base = new URL(argument);
if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.pathname !== '/' || base.search || base.hash) {
  throw new Error('Indiquer une origine HTTP(S) sans identifiants, chemin ou paramètres.');
}
const config = JSON.parse(await readFile('site.config.json', 'utf8'));
if (config.production && base.protocol !== 'https:') throw new Error('La production doit être vérifiée en HTTPS.');
const localSitemap = await readFile('dist/sitemap.xml', 'utf8');
const routes = [...localSitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
async function get(path) {
  return fetch(new URL(path, base), {signal: AbortSignal.timeout(15000), redirect: 'manual'});
}
let failures = 0;
for (const route of [...routes, '/robots.txt', '/sitemap.xml', '/style.css', '/site.js', '/config.js', '/logo.png']) {
  try {
    const response = await get(route);
    assert.equal(response.status, 200, `HTTP ${response.status}`);
    const actual = Buffer.from(await response.arrayBuffer());
    const file = `dist${route}${route.endsWith('/') ? 'index.html' : ''}`;
    const expected = await readFile(file);
    assert.ok(actual.equals(expected), 'Le contenu servi diffère de la version locale.');
    if (route.endsWith('/')) {
      assert.match(response.headers.get('content-type') || '', /text\/html/i);
      if (config.production) assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /noindex|none/i);
    }
    console.log(`OK ${route}`);
  } catch (error) {
    failures++;
    console.error(`ÉCHEC ${route} : ${error.message}`);
  }
}
try {
  const response = await get('/verification-page-absente-serialcoders/');
  assert.equal(response.status, 404, 'Une page absente doit répondre HTTP 404.');
  console.log('OK statut 404');
} catch (error) {
  failures++;
  console.error(`ÉCHEC page absente : ${error.message}`);
}
process.exitCode = failures ? 1 : 0;
console.log(failures ? `${failures} contrôle(s) en échec.` : 'Version servie conforme. La réception Google et le rendu visuel restent à vérifier séparément.');
