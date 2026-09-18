import { readFile } from 'node:fs/promises';
import { checkDeployment } from '../src/lib/check-deployment.mjs';
if (!process.argv[2]) throw new Error('Usage: node scripts/check-deployment.mjs https://origine');
const config = JSON.parse(await readFile('site.config.json', 'utf8'));
const failures = await checkDeployment({
  base: process.argv[2],
  directory: 'dist',
  production: config.production,
});
process.exitCode = failures ? 1 : 0;
console.log(failures ? `${failures} contrôle(s) en échec.` : 'Version servie conforme.');
