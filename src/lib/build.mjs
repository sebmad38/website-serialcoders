import { contactPolicy } from '../../server/contact/policy.mjs';
import {
  readFile,
  writeFile,
  mkdir,
  cp,
  mkdtemp,
  rename,
  rm,
  lstat,
  readdir,
} from 'node:fs/promises';
import { dirname, join, resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { validateConfig } from './config.mjs';
import { escapeHtml } from './html.mjs';
import { createManifest } from './files.mjs';
import { createPages } from '../pages/index.mjs';
import { renderDocument } from '../templates/document.mjs';
import { renderNotFound } from '../templates/not-found.mjs';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));

async function moveDirectory(source, target) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await rename(source, target);
    } catch (error) {
      // Windows antivirus/indexing can briefly retain a directory handle after a move.
      if (
        process.platform !== 'win32' ||
        !['EPERM', 'EBUSY', 'EACCES'].includes(error.code) ||
        attempt >= 4
      )
        throw error;
      await delay(100 * (attempt + 1));
    }
  }
}

function validateRoutes(pages) {
  const paths = new Set();
  for (const page of pages) {
    if (!/^\/(?:[a-zA-Z0-9-]+\/)*$/.test(page.path) || paths.has(page.path))
      throw new Error(`Route invalide ou dupliquée : ${page.path}`);
    if (!page.title || !page.description || typeof page.body !== 'string')
      throw new Error(`Page incomplète : ${page.path}`);
    paths.add(page.path);
  }
}

/** Build in isolation; a rendering failure must not damage the last usable output. */
export async function buildSite({
  outputDirectory = join(projectRoot, 'dist'),
  config: override,
} = {}) {
  const output = resolve(outputDirectory);
  const fromOutput = relative(output, resolve(projectRoot));
  const insideProject = relative(resolve(projectRoot), output);
  if (
    fromOutput === '' ||
    (!fromOutput.startsWith('..') && !isAbsolute(fromOutput)) ||
    (insideProject &&
      !insideProject.startsWith('..') &&
      !isAbsolute(insideProject) &&
      insideProject !== 'dist')
  )
    throw new Error('La sortie doit être dist/ ou un dossier extérieur au projet.');
  const existing = await lstat(output).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  if (existing && (!existing.isDirectory() || existing.isSymbolicLink()))
    throw new Error('La sortie doit être un répertoire réel.');
  if (existing && (await readdir(output)).length) {
    const manifest = await readFile(join(output, 'release-manifest.json'), 'utf8')
      .then(JSON.parse)
      .catch(() => null);
    if (manifest?.version !== 1 || !manifest.files)
      throw new Error('Refus de remplacer un dossier non identifié comme sortie de compilation.');
  }
  const config = validateConfig(
    override || JSON.parse(await readFile(join(projectRoot, 'site.config.json'), 'utf8')),
  );
  const pages = createPages(config);
  validateRoutes(pages);
  const parent = dirname(output);
  await mkdir(parent, { recursive: true });
  const staging = await mkdtemp(join(parent, '.serialcoders-build-'));
  if (
    !staging.startsWith(parent + sep) ||
    !relative(parent, staging).startsWith('.serialcoders-build-')
  )
    throw new Error('Chemin de nettoyage invalide.');
  const next = join(staging, 'next');
  const previous = join(staging, 'previous');
  let oldMoved = false;
  let published = false;
  try {
    await cp(join(projectRoot, 'public'), next, { recursive: true });
    await cp(join(projectRoot, 'src/styles'), next, { recursive: true });
    await writeFile(
      join(next, 'contact.js'),
      `window.SERIAL_CODERS_CONTACT_POLICY = ${JSON.stringify(contactPolicy)};\n` +
        (await readFile(join(projectRoot, 'src/client/contact.js'), 'utf8')),
    );
    // Concatenation keeps the public URL stable and requires no runtime bundler.
    const client = await Promise.all(
      ['consent.js', 'navigation.js'].map((file) =>
        readFile(join(projectRoot, 'src/client', file), 'utf8'),
      ),
    );
    await writeFile(join(next, 'site.js'), client.join('\n'));
    for (const page of pages) {
      const directory = join(next, page.path.slice(1));
      await mkdir(directory, { recursive: true });
      await writeFile(join(directory, 'index.html'), renderDocument(page, config));
    }
    const origin = new URL(config.origin).origin;
    await writeFile(
      join(next, 'config.js'),
      `window.SERIAL_CODERS_CONFIG = ${JSON.stringify({ googleAnalyticsId: config.googleAnalyticsId })};\n`,
    );
    await writeFile(
      join(next, 'robots.txt'),
      config.production
        ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
        : 'User-agent: *\nDisallow: /\n',
    );
    await writeFile(
      join(next, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${escapeHtml(new URL(page.path, origin).href)}</loc></url>`).join('')}</urlset>`,
    );
    await writeFile(join(next, '404.html'), renderNotFound(config));
    await writeFile(
      join(next, 'release-manifest.json'),
      JSON.stringify(await createManifest(next), null, 2) + '\n',
    );
    if (existing) {
      await moveDirectory(output, previous);
      oldMoved = true;
    }
    try {
      await moveDirectory(next, output);
      published = true;
    } catch (error) {
      if (oldMoved) {
        await moveDirectory(previous, output);
        oldMoved = false;
      }
      throw error;
    }
    return { outputDirectory: output, pageCount: pages.length, config };
  } finally {
    // Only this build's staging directory may be removed. Keep a backup if restoration failed.
    if (!oldMoved || published) await rm(staging, { recursive: true, force: true });
  }
}
