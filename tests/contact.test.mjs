import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createContactHandler } from '../scripts/contact-api.mjs';

const payload = { name: 'Test', email: 'test@example.com', company: '', phone: '', website: '', message: 'Un projet de migration à étudier.' };
test('Contact validates, rejects abuse and only confirms accepted delivery', async () => {
  let deliveries = 0;
  const server = createServer(createContactHandler({ deliver: async () => { deliveries++; }, origin: 'https://example.com' }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const send = (body, origin = 'https://example.com') => fetch(`http://127.0.0.1:${server.address().port}`, { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await send(payload, 'https://other.example')).status, 403);
    assert.equal((await send({ ...payload, email: 'a@example.com\nBcc: other@example.com' })).status, 400);
    assert.equal((await send({ ...payload, website: 'spam' })).status, 400);
    assert.equal((await send({ ...payload, message: 'short' })).status, 400);
    assert.equal((await send(payload)).status, 200);
    assert.equal(deliveries, 1);
    await send(payload);
    assert.equal((await send(payload)).status, 429);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
test('Delivery failure is reported without a false success', async () => {
  const server = createServer(createContactHandler({ deliver: async () => { throw new Error('offline'); }, origin: 'https://example.com' }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const result = await fetch(`http://127.0.0.1:${server.address().port}`, { method: 'POST', headers: { origin: 'https://example.com', 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    assert.equal(result.status, 503);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
