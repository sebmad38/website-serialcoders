// Shared by the API, generated browser script and form template.
export const contactPolicy = Object.freeze({
  maxFiles: 5,
  maxAttachmentBytes: 10 * 1024 * 1024,
  maxBodyBytes: 15 * 1024 * 1024,
  maxFilenameLength: 180,
  minMessageLength: 20,
  fields: { name: 120, email: 254, company: 160, phone: 40, message: 6000, website: 200 },
  types: {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
  },
});
