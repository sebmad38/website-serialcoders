import { pathToFileURL } from 'node:url';
import { createApiServer } from './index.mjs';

/** Exercise imports and routing before switching the live release; never send an email. */
export async function preflight() {
  let delivered = false;
  const server = createApiServer({
    origin: 'https://preflight.invalid',
    deliver: async () => {
      delivered = true;
    },
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(base + '/api/contact', {
      method: 'POST',
      headers: { origin: 'https://preflight.invalid', 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Preflight',
        email: 'test@example.com',
        company: '',
        phone: '',
        website: '',
        message: 'Internal release verification only.',
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (response.status !== 200 || !delivered) throw new Error('Contact preflight failed');
    await response.text();
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await preflight();
