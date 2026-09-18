import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createContactHandler } from './contact/handler.mjs';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
};

export function createPreviewServer({ root = resolve('dist'), contactOptions } = {}) {
  root = resolve(root);
  const contactHandler = createContactHandler(contactOptions);
  return createServer(
    { requestTimeout: 30000, headersTimeout: 10000 },
    async (request, response) => {
      if (request.url === '/api/contact') return contactHandler(request, response);
      if (!['GET', 'HEAD'].includes(request.method))
        return response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      try {
        const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        if (path.split(/[\\/]/).some((part) => part.startsWith('.')))
          return response.writeHead(403).end();
        let file = resolve(root, `.${path}`);
        if (!file.startsWith(root + sep) && file !== root) return response.writeHead(403).end();
        if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
        const body = await readFile(file);
        response
          .writeHead(200, {
            'Content-Type': types[extname(file)] || 'application/octet-stream',
            'X-Content-Type-Options': 'nosniff',
          })
          .end(request.method === 'HEAD' ? undefined : body);
      } catch (error) {
        const status =
          error instanceof URIError
            ? 400
            : error.code === 'ENOENT' || error.code === 'ENOTDIR'
              ? 404
              : 500;
        const body =
          status === 404
            ? await readFile(resolve(root, '404.html')).catch(() => 'Page introuvable')
            : 'Requête indisponible';
        response
          .writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' })
          .end(request.method === 'HEAD' ? undefined : body);
      }
    },
  );
}
