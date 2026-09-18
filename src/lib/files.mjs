import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

export async function listFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isSymbolicLink())
      throw new Error(`Lien symbolique interdit dans la livraison : ${relative}`);
    if (entry.isDirectory())
      files.push(...(await listFiles(join(directory, entry.name), relative + '/')));
    else if (entry.isFile()) files.push(relative);
  }
  return files.sort();
}

export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

/** The manifest describes every deployed file, including client scripts and fonts. */
export async function createManifest(directory) {
  const files = {};
  for (const file of await listFiles(directory)) {
    if (file === 'release-manifest.json') continue;
    files[file] = sha256(await readFile(join(directory, file)));
  }
  return { version: 1, files };
}
