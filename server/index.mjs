import { createServer } from 'node:http';
import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createContactHandler } from './contact/handler.mjs';
export function createApiServer(options) {
  const handler = createContactHandler(options);
  return createServer({ requestTimeout: 30000, headersTimeout: 10000 }, (request, response) => {
    if (request.url === '/health' && request.method === 'GET')
      return response.writeHead(200, { 'Content-Type': 'application/json' }).end('{"status":"ok"}');
    return request.url === '/api/contact'
      ? handler(request, response)
      : response.writeHead(404).end();
  });
}
// Node resolves module symlinks; systemd starts through the current release link.
if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href)
  createApiServer().listen(4180, '127.0.0.1');
