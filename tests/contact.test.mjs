import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createContactHandler } from '../server/contact/handler.mjs';

const payload = {
  name: 'Test',
  email: 'test@example.com',
  company: '',
  phone: '',
  website: '',
  message: 'Un projet de migration à étudier.',
};
test('Contact validates, rejects abuse and only confirms accepted delivery', async () => {
  let deliveries = 0;
  const server = createServer(
    createContactHandler({
      deliver: async () => {
        deliveries++;
      },
      origin: 'https://example.com',
    }),
  );
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const send = (body, origin = 'https://example.com') =>
    fetch(`http://127.0.0.1:${server.address().port}`, {
      method: 'POST',
      headers: { origin, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  try {
    assert.equal((await send(payload, 'https://other.example')).status, 403);
    assert.equal(
      (await send({ ...payload, email: 'a@example.com\nBcc: other@example.com' })).status,
      400,
    );
    assert.equal((await send({ ...payload, website: 'spam' })).status, 400);
    assert.equal((await send({ ...payload, message: 'short' })).status, 400);
    assert.equal((await send(payload)).status, 200);
    assert.equal(deliveries, 1);
    await send(payload);
    assert.equal((await send(payload)).status, 429);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test('Delivery failure is reported without a false success', async () => {
  const server = createServer(
    createContactHandler({
      deliver: async () => {
        throw new Error('offline');
      },
      origin: 'https://example.com',
    }),
  );
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const result = await fetch(`http://127.0.0.1:${server.address().port}`, {
      method: 'POST',
      headers: { origin: 'https://example.com', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    assert.equal(result.status, 503);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
import { validateAttachments, validateContact } from '../server/contact/validation.mjs';
import { composeContactMail } from '../server/contact/mail.mjs';
const document = {
  name: 'cahier-des-charges.txt',
  content: Buffer.from('Description du projet').toString('base64'),
};
test('Attachments enforce count, combined size, names, encoding and file types', () => {
  assert.equal(validateAttachments([document])[0].type, 'text/plain');
  for (const files of [
    Array(6).fill(document),
    [{ ...document, name: 'app.exe' }],
    [{ ...document, name: '../secret.txt' }],
    [{ ...document, name: 'a\r\nBcc.txt' }],
    [{ ...document, content: '!!' }],
    [{ ...document, content: '' }],
    [{ ...document, name: 'fake.pdf' }],
    [
      { ...document, content: Buffer.alloc(6 * 1024 * 1024, 65).toString('base64') },
      { ...document, content: Buffer.alloc(5 * 1024 * 1024, 65).toString('base64') },
    ],
  ]) {
    assert.throws(() => validateAttachments(files), /attachments/);
  }
});
test('Mail includes original attachment contents with safe MIME filenames', () => {
  const data = validateContact({
    ...payload,
    attachments: [document, { ...document, name: 'spécifications.txt' }],
  });
  const mail = composeContactMail(data, 'sender@example.com', 'recipient@example.com');
  assert.match(mail, /multipart\/mixed/);
  assert.equal((mail.match(/Content-Disposition: attachment/g) || []).length, 2);
  assert.ok(mail.includes(document.content));
  assert.match(mail, /sp%C3%A9cifications.txt/);
  assert.equal(validateContact(payload).attachments.length, 0);
});
