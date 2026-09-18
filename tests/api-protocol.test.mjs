import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { createApiServer } from '../server/index.mjs';
import { maxBodyBytes } from '../server/contact/handler.mjs';

test('API rejects wrong methods, invalid media types, broken JSON and oversized chunked bodies', async () => {
  const server = createApiServer({
    origin: 'https://example.com',
    deliver: async () => assert.fail('No delivery expected'),
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(base + '/health')).status, 200);
    const method = await fetch(base + '/api/contact');
    assert.equal(method.status, 405);
    assert.equal(method.headers.get('allow'), 'POST');
    const send = (body, type = 'application/json') =>
      fetch(base + '/api/contact', {
        method: 'POST',
        headers: { origin: 'https://example.com', 'content-type': type },
        body,
      });
    assert.equal((await send('{}', 'application/json-fake')).status, 415);
    assert.equal((await send('{')).status, 400);
    assert.equal((await send('x'.repeat(maxBodyBytes + 1))).status, 413);
    const status = await new Promise((resolve, reject) => {
      const req = request(
        base + '/api/contact',
        {
          method: 'POST',
          headers: {
            origin: 'https://example.com',
            'content-type': 'application/json',
            'transfer-encoding': 'chunked',
          },
        },
        (res) => {
          res.resume();
          resolve(res.statusCode);
        },
      );
      req.on('error', reject);
      req.end(Buffer.alloc(maxBodyBytes + 1, 65));
    });
    assert.equal(status, 413);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
