import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

const attachmentTypes = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', txt: 'text/plain', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
export function validateAttachments(files = []) {
  if (!Array.isArray(files) || files.length > 5) throw new Error('attachments');
  let total = 0;
  return files.map(file => {
    if (typeof file?.name !== 'string' || file.name.length > 180 || /[\x00-\x1f\x7f/\\]/.test(file.name)) throw new Error('attachments');
    const extension = file.name.split('.').at(-1).toLowerCase();
    if (!Object.hasOwn(attachmentTypes, extension) || typeof file.content !== 'string' || file.content.length > 13981016) throw new Error('attachments');
    const bytes = Buffer.from(file.content, 'base64');
    if (bytes.toString('base64') !== file.content) throw new Error('attachments');
    total += bytes.length;
    if (!bytes.length || total > 10 * 1024 * 1024) throw new Error('attachments');
    // Reject obvious extension disguises; this is not an antivirus scanner.
    const starts = signature => bytes.subarray(0, signature.length).equals(Buffer.from(signature));
    if ((extension === 'pdf' && !starts([37,80,68,70,45])) || (extension === 'png' && !starts([137,80,78,71,13,10,26,10])) || (['jpg','jpeg'].includes(extension) && !starts([255,216,255])) || (['docx','xlsx','pptx'].includes(extension) && !starts([80,75,3,4])) || (extension === 'txt' && (bytes.includes(0) || !Buffer.from(bytes.toString('utf8')).equals(bytes)))) throw new Error('attachments');
    return { name: file.name, content: file.content, type: attachmentTypes[extension] };
  });
}

export function composeContactMail(data, sender, recipient) {
  const boundary = `serialcoders-${randomUUID()}`;
  const wrap = value => value.match(/.{1,76}/g)?.join('\r\n') || '';
  const text = `Nom : ${data.name}\nEntreprise : ${data.company}\nEmail : ${data.email}\nTelephone : ${data.phone}\n\n${data.message}\n`;
  const parts = [`From: ${sender}`, `To: ${recipient}`, `Reply-To: ${data.email}`, 'Subject: Nouveau contact Serial Coders', 'MIME-Version: 1.0', `Content-Type: multipart/mixed; boundary="${boundary}"`, '', `--${boundary}`, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', wrap(Buffer.from(text).toString('base64'))];
  for (const file of data.attachments || []) {
    const filename = encodeURIComponent(file.name).replace(/['()*]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
    parts.push(`--${boundary}`, `Content-Type: ${file.type}`, 'Content-Transfer-Encoding: base64', `Content-Disposition: attachment; filename*=UTF-8''${filename}`, '', wrap(file.content));
  }
  return [...parts, `--${boundary}--`, ''].join('\r\n');
}

const emailPattern = /^[^\s<>@\r\n]+@[^\s<>@\r\n]+\.[^\s<>@\r\n]+$/;
export function validateContact(data) {
  const limits = { name: 120, email: 254, company: 160, phone: 40, message: 6000, website: 200 };
  const clean = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof data?.[key] !== 'string' || data[key].length > limit) throw new Error('invalid');
    clean[key] = data[key].trim();
  }
  if (!clean.name || !emailPattern.test(clean.email) || clean.message.length < 20) throw new Error('invalid');
  clean.attachments = validateAttachments(data.attachments);
  return clean;
}

// The local mail relay owns SMTP credentials and queues accepted messages.
export function deliverContact(data) {
  const sender = process.env.CONTACT_FROM;
  const recipient = process.env.CONTACT_TO;
  const executable = process.env.CONTACT_SENDMAIL;
  if (!sender || !recipient || !executable || !emailPattern.test(sender) || !emailPattern.test(recipient)) return Promise.reject(new Error('unconfigured'));
  const message = composeContactMail(data, sender, recipient);
  return new Promise((resolve, reject) => {
    const child = spawn(executable, ['-i', '-t'], { stdio: ['pipe', 'ignore', 'ignore'], timeout: 10000 });
    child.on('error', reject);
    child.stdin.on('error', reject);
    child.on('close', code => code === 0 ? resolve() : reject(new Error('delivery')));
    child.stdin.end(message);
  });
}

export function createContactHandler({ deliver = deliverContact, origin = process.env.CONTACT_ORIGIN || 'http://127.0.0.1:4173' } = {}) {
  const attempts = new Map();
  return async (request, response) => {
    const reply = (status, message) => response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }).end(JSON.stringify({ message }));
    if (request.method !== 'POST') return reply(405, 'Méthode non autorisée.');
    if (request.headers.origin !== origin) return reply(403, 'Origine non autorisée.');
    if (!request.headers['content-type']?.startsWith('application/json')) return reply(415, 'Format non accepté.');
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
    // Nginx overwrites this header; the API is bound to loopback only.
    const ip = request.headers['x-real-ip'] || request.socket.remoteAddress;
    const entry = attempts.get(ip) || { count: 0, until: now + 600000 };
    if (++entry.count > 5 || attempts.size > 10000) return reply(429, 'Trop de tentatives. Réessayez dans dix minutes.');
    attempts.set(ip, entry);
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > 15 * 1024 * 1024) return reply(413, 'Message trop volumineux.');
        chunks.push(chunk);
      }
      let data;
      try { data = validateContact(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (error) { return reply(400, error.message === 'attachments' ? 'Documents invalides : cinq fichiers maximum, 10 Mo au total, aux formats PDF, DOCX, XLSX, PPTX, TXT, PNG ou JPEG.' : 'Vérifiez vos coordonnées et décrivez votre projet en au moins 20 caractères.'); }
      if (data.website) return reply(400, 'Le formulaire ne peut pas être envoyé.');
      await deliver(data);
      return reply(200, 'Votre demande a été transmise. Merci, nous reviendrons vers vous pour échanger sur votre projet.');
    } catch {
      return reply(503, 'L’envoi est momentanément indisponible. Votre texte est conservé dans le formulaire. Contactez-nous par email ou par téléphone.');
    }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const handler = createContactHandler();
  createServer((req, res) => req.url === '/api/contact' ? handler(req, res) : res.writeHead(404).end()).listen(4180, '127.0.0.1');
}
