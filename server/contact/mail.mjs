import { randomUUID } from 'node:crypto';
export function* contactMailChunks(data, sender, recipient) {
  const boundary = `serialcoders-${randomUUID()}`;
  function* encodedLines(value) {
    // Bound each temporary string and respect stream backpressure for large attachments.
    const blockSize = 76 * 512;
    for (let offset = 0; offset < value.length; offset += blockSize) {
      yield value
        .slice(offset, offset + blockSize)
        .match(/.{1,76}/g)
        .join('\r\n') + '\r\n';
    }
  }
  const text = `Nom : ${data.name}\nEntreprise : ${data.company}\nEmail : ${data.email}\nTelephone : ${data.phone}\n\n${data.message}\n`;
  const parts = [
    `From: ${sender}`,
    `To: ${recipient}`,
    `Reply-To: ${data.email}`,
    'Subject: Nouveau contact Serial Coders',
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
  ];
  yield parts.join('\r\n') + '\r\n';
  yield* encodedLines(Buffer.from(text).toString('base64'));
  for (const file of data.attachments || []) {
    const filename = encodeURIComponent(file.name).replace(
      /['()*]/g,
      (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    );
    yield [
      `--${boundary}`,
      `Content-Type: ${file.type}`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename*=UTF-8''${filename}`,
      '',
    ].join('\r\n') + '\r\n';
    yield* encodedLines(file.content);
  }
  yield `--${boundary}--\r\n`;
}

// Convenience for small test fixtures; production sends the generator as a stream.
export function composeContactMail(data, sender, recipient) {
  return [...contactMailChunks(data, sender, recipient)].join('');
}
