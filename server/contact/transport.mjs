import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import { emailPattern } from './validation.mjs';
import { contactMailChunks } from './mail.mjs';
// The local mail relay owns SMTP credentials and queues accepted messages.
export async function deliverContact(data) {
  const sender = process.env.CONTACT_FROM;
  const recipient = process.env.CONTACT_TO;
  const executable = process.env.CONTACT_SENDMAIL;
  if (
    !sender ||
    !recipient ||
    !executable ||
    !emailPattern.test(sender) ||
    !emailPattern.test(recipient)
  )
    return Promise.reject(new Error('unconfigured'));
  // Keep the envelope sender aligned with the provider-verified From address.
  const child = spawn(executable, ['-i', '-t', '-f', sender], {
    stdio: ['pipe', 'ignore', 'ignore'],
    timeout: 10000,
  });
  const exited = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code) => (code === 0 ? resolve() : reject(new Error('delivery'))));
  });
  try {
    await Promise.all([
      exited,
      pipeline(
        Readable.from(contactMailChunks(data, sender, recipient), { objectMode: false }),
        child.stdin,
      ),
    ]);
  } catch (error) {
    child.kill();
    throw error;
  }
}
