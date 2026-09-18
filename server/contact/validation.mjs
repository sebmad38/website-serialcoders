/* eslint no-control-regex: off -- Input validation deliberately rejects control characters. */
import { contactPolicy } from './policy.mjs';
import { isUtf8 } from 'node:buffer';
const attachmentTypes = contactPolicy.types;
export function validateAttachments(files = []) {
  if (!Array.isArray(files) || files.length > contactPolicy.maxFiles)
    throw new Error('attachments');
  let total = 0;
  return files.map((file) => {
    if (
      typeof file?.name !== 'string' ||
      !file.name.isWellFormed() ||
      file.name.length > contactPolicy.maxFilenameLength ||
      /[\x00-\x1f\x7f/\\]/.test(file.name)
    )
      throw new Error('attachments');
    const extension = file.name.split('.').at(-1).toLowerCase();
    if (
      !Object.hasOwn(attachmentTypes, extension) ||
      typeof file.content !== 'string' ||
      file.content.length > Math.ceil(contactPolicy.maxAttachmentBytes / 3) * 4
    )
      throw new Error('attachments');
    const bytes = Buffer.from(file.content, 'base64');
    if (bytes.toString('base64') !== file.content) throw new Error('attachments');
    total += bytes.length;
    if (!bytes.length || total > contactPolicy.maxAttachmentBytes) throw new Error('attachments');
    // Reject obvious extension disguises; this is not an antivirus scanner.
    const starts = (signature) =>
      bytes.subarray(0, signature.length).equals(Buffer.from(signature));
    if (
      (extension === 'pdf' && !starts([37, 80, 68, 70, 45])) ||
      (extension === 'png' && !starts([137, 80, 78, 71, 13, 10, 26, 10])) ||
      (['jpg', 'jpeg'].includes(extension) && !starts([255, 216, 255])) ||
      (['docx', 'xlsx', 'pptx'].includes(extension) && !starts([80, 75, 3, 4])) ||
      (extension === 'txt' && (bytes.includes(0) || !isUtf8(bytes)))
    )
      throw new Error('attachments');
    return { name: file.name, content: file.content, type: attachmentTypes[extension] };
  });
}

export const emailPattern = /^[^\s<>@\r\n]+@[^\s<>@\r\n]+\.[^\s<>@\r\n]+$/;
export function validateContact(data) {
  const limits = contactPolicy.fields;
  const clean = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof data?.[key] !== 'string' || data[key].length > limit) throw new Error('invalid');
    clean[key] = data[key].trim();
  }
  if (
    !clean.name ||
    !emailPattern.test(clean.email) ||
    clean.message.length < contactPolicy.minMessageLength
  )
    throw new Error('invalid');
  clean.attachments = validateAttachments(data.attachments);
  return clean;
}
