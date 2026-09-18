import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { contactPolicy } from '../server/contact/policy.mjs';
import { outputPath } from './helpers/output.mjs';
import { contactMailChunks } from '../server/contact/mail.mjs';
import { preflight } from '../server/preflight.mjs';
import { composeContactMail } from '../server/contact/mail.mjs';

test('Streaming MIME preserves attachment bytes across chunk boundaries', () => {
  const bytes = Buffer.alloc(100000, 67);
  const mail = composeContactMail(
    {
      name: 'Test',
      email: 'test@example.com',
      company: '',
      phone: '',
      message: 'Test',
      attachments: [{ name: 'project.txt', type: 'text/plain', content: bytes.toString('base64') }],
    },
    'from@example.com',
    'to@example.com',
  );
  const attachment = mail
    .split('Content-Disposition: attachment;')[1]
    .split('\r\n\r\n')[1]
    .split('\r\n--')[0];
  assert.deepEqual(Buffer.from(attachment.replaceAll('\r\n', ''), 'base64'), bytes);
});

test('Browser and form receive the API contact contract', async () => {
  const script = await readFile(outputPath('contact.js'), 'utf8');
  const embedded = script.match(/^window.SERIAL_CODERS_CONTACT_POLICY = (.*);/)[1];
  assert.deepEqual(JSON.parse(embedded), contactPolicy);
  const html = await readFile(outputPath('contact/index.html'), 'utf8');
  assert.match(html, new RegExp(`minlength="${contactPolicy.minMessageLength}"`));
  for (const [field, limit] of Object.entries(contactPolicy.fields)) {
    const tag = html.match(new RegExp(`<(?:input|textarea)\\b[^>]*name="${field}"[^>]*>`))[0];
    assert.ok(tag.includes(`maxlength="${limit}"`));
  }
  for (const extension of Object.keys(contactPolicy.types))
    assert.ok(html.includes(`.${extension}`));
});

test('MIME generator streams a maximum-size attachment in bounded chunks', () => {
  const content = Buffer.alloc(contactPolicy.maxAttachmentBytes, 65).toString('base64');
  let maximum = 0,
    bytes = 0;
  for (const chunk of contactMailChunks(
    {
      name: 'Test',
      email: 'test@example.com',
      company: '',
      phone: '',
      message: 'Test',
      attachments: [{ name: 'large.txt', type: 'text/plain', content }],
    },
    'from@example.com',
    'to@example.com',
  )) {
    maximum = Math.max(maximum, Buffer.byteLength(chunk));
    bytes += Buffer.byteLength(chunk);
  }
  assert.ok(maximum < 65536);
  assert.ok(bytes > content.length);
});

test('Release preflight imports the API and exercises contact without SMTP', preflight);
