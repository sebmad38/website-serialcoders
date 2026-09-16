import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const emailPattern = /^[^\s<>@\r\n]+@[^\s<>@\r\n]+\.[^\s<>@\r\n]+$/;
export function validateContact(data) {
  const limits = { name: 120, email: 254, company: 160, phone: 40, message: 6000, website: 200 };
  const clean = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof data?.[key] !== 'string' || data[key].length > limit) throw new Error('invalid');
    clean[key] = data[key].trim();
  }
  if (!clean.name || !emailPattern.test(clean.email) || clean.message.length < 20) throw new Error('invalid');
  return clean;
}

// The local mail relay owns SMTP credentials and queues accepted messages.
export function deliverContact(data) {
  const sender = process.env.CONTACT_FROM;
  const recipient = process.env.CONTACT_TO;
  const executable = process.env.CONTACT_SENDMAIL;
  if (!sender || !recipient || !executable || !emailPattern.test(sender) || !emailPattern.test(recipient)) return Promise.reject(new Error('unconfigured'));
  const message = `From: ${sender}\nTo: ${recipient}\nReply-To: ${data.email}\nSubject: Nouveau contact Serial Coders\nMIME-Version: 1.0\nContent-Type: text/plain; charset=UTF-8\nContent-Transfer-Encoding: 8bit\n\nNom : ${data.name}\nEntreprise : ${data.company}\nEmail : ${data.email}\nTelephone : ${data.phone}\n\n${data.message}\n`;
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
        if (size > 32000) return reply(413, 'Message trop volumineux.');
        chunks.push(chunk);
      }
      let data;
      try { data = validateContact(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { return reply(400, 'Vérifiez vos coordonnées et décrivez votre projet en au moins 20 caractères.'); }
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
