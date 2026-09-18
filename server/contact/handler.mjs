import { validateContact } from './validation.mjs';
import { deliverContact } from './transport.mjs';
import { createRateLimiter } from './rate-limit.mjs';
import { contactPolicy } from './policy.mjs';
export const maxBodyBytes = contactPolicy.maxBodyBytes;
export function createContactHandler({
  deliver = deliverContact,
  origin = process.env.CONTACT_ORIGIN || 'http://127.0.0.1:4173',
} = {}) {
  const allowAttempt = createRateLimiter();
  return async (request, response) => {
    const reply = (status, message) =>
      response
        .writeHead(status, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        })
        .end(JSON.stringify({ message }));
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST');
      return reply(405, 'Méthode non autorisée.');
    }
    if (request.headers.origin !== origin) return reply(403, 'Origine non autorisée.');
    if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json')
      return reply(415, 'Format non accepté.');
    // Nginx overwrites this header; the API is bound to loopback only.
    const ip = request.headers['x-real-ip'] || request.socket.remoteAddress;
    if (!allowAttempt(ip)) return reply(429, 'Trop de tentatives. Réessayez dans dix minutes.');
    try {
      const chunks = [];
      let size = 0;
      // Drain excess bytes without retaining them. Closing during upload can hide the 413
      // behind a connection reset in browsers. The HTTP server bounds upload duration.
      for await (const chunk of request) {
        size += chunk.length;
        if (size > maxBodyBytes) chunks.length = 0;
        else chunks.push(chunk);
      }
      if (size > maxBodyBytes) return reply(413, 'Message trop volumineux.');
      let data;
      try {
        const body = Buffer.concat(chunks, size);
        chunks.length = 0;
        data = validateContact(JSON.parse(body.toString('utf8')));
      } catch (error) {
        return reply(
          400,
          error.message === 'attachments'
            ? `Documents invalides : ${contactPolicy.maxFiles} fichiers maximum, ${contactPolicy.maxAttachmentBytes / 1024 / 1024} Mo au total, aux formats ${Object.keys(
                contactPolicy.types,
              )
                .map((extension) => extension.toUpperCase())
                .join(', ')}.`
            : `Vérifiez vos coordonnées et décrivez votre projet en au moins ${contactPolicy.minMessageLength} caractères.`,
        );
      }
      if (data.website) return reply(400, 'Le formulaire ne peut pas être envoyé.');
      await deliver(data);
      return reply(
        200,
        'Votre demande a été transmise. Merci, nous reviendrons vers vous pour échanger sur votre projet.',
      );
    } catch {
      return reply(
        503,
        'L’envoi est momentanément indisponible. Votre texte est conservé dans le formulaire. Contactez-nous par email ou par téléphone.',
      );
    }
  };
}
