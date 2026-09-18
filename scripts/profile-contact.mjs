import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createApiServer } from '../server/index.mjs';
import { contactMailChunks } from '../server/contact/mail.mjs';
import { contactPolicy } from '../server/contact/policy.mjs';

// The API runs in a separate process so client payload allocations do not skew its RSS.
// A slow sink exercises backpressure; this does not measure Postfix or sendmail memory.
if (process.argv.includes('--worker')) {
  let peak = 0;
  const sample = () => {
    peak = Math.max(peak, process.memoryUsage().rss);
  };
  const timer = setInterval(sample, 5);
  const server = createApiServer({
    origin: 'https://profile.invalid',
    deliver: async (data) => {
      sample();
      await pipeline(
        Readable.from(contactMailChunks(data, 'from@example.com', 'to@example.com'), {
          objectMode: false,
        }),
        new Writable({
          write(_chunk, _encoding, callback) {
            sample();
            setTimeout(callback, 1);
          },
        }),
      );
      console.log(JSON.stringify({ peakRssMiB: Math.round(peak / 1048576) }));
    },
  });
  server.listen(0, '127.0.0.1', () => console.log('PORT=' + server.address().port));
  process.on('SIGTERM', () => {
    clearInterval(timer);
    server.closeAllConnections();
    server.close();
  });
} else {
  const worker = spawn(process.execPath, [process.argv[1], '--worker'], {
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  try {
    const lines = createInterface({ input: worker.stdout });
    const port = await new Promise((resolve, reject) => {
      worker.once('error', reject);
      worker.once('exit', (code) => reject(new Error(`Profile worker exited: ${code}`)));
      lines.on('line', (line) =>
        line.startsWith('PORT=') ? resolve(Number(line.slice(5))) : console.log(line),
      );
    });
    const body = JSON.stringify({
      name: 'Profile',
      email: 'test@example.com',
      company: '',
      phone: '',
      website: '',
      message: 'Local memory profile without sending mail.',
      attachments: [
        {
          name: 'maximum.txt',
          content: Buffer.alloc(contactPolicy.maxAttachmentBytes, 65).toString('base64'),
        },
      ],
    });
    const statuses = await Promise.all(
      [1, 2].map(async () => {
        const response = await fetch(`http://127.0.0.1:${port}/api/contact`, {
          method: 'POST',
          headers: { origin: 'https://profile.invalid', 'content-type': 'application/json' },
          body,
          signal: AbortSignal.timeout(30000),
        });
        await response.text();
        return response.status;
      }),
    );
    console.log(
      JSON.stringify({
        concurrentRequests: 2,
        attachmentMiB: contactPolicy.maxAttachmentBytes / 1048576,
        statuses,
        transport: 'MIME stream to slow sink; no email sent',
      }),
    );
    if (statuses.some((status) => status !== 200)) process.exitCode = 1;
  } finally {
    worker.kill();
  }
}
