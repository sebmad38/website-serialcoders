import { resolve } from 'node:path';

if (!process.env.SITE_TEST_DIST)
  throw new Error('Exécuter npm test pour tester une compilation isolée.');
export const outputDirectory = resolve(process.env.SITE_TEST_DIST);
export const outputPath = (path) => resolve(outputDirectory, path);
