/* eslint no-control-regex: off -- Input validation deliberately rejects control characters. */
(() => {
  const policy = window.SERIAL_CODERS_CONTACT_POLICY;
  const form = document.getElementById('project-contact');
  if (!form) return;
  const status = document.getElementById('contact-status');
  const button = form.querySelector('button[type="submit"]');
  const isPublicDemo = location.hostname.endsWith('.chatgpt.site');
  if (isPublicDemo) {
    const notice = document.createElement('p');
    notice.className = 'form-note';
    notice.textContent =
      'Version de démonstration : vous pouvez explorer ce formulaire, mais l’envoi des messages et des documents n’est pas activé. Pour nous contacter, utilisez l’email ou le téléphone indiqués ci-dessus.';
    form.prepend(notice);
    button.disabled = true;
    button.textContent = 'Envoi désactivé sur la démonstration';
  }
  const picker = document.getElementById('contact-documents');
  const list = document.getElementById('document-list');
  const feedback = document.getElementById('document-feedback');
  let documents = [];
  const renderDocuments = () => {
    list.replaceChildren();
    documents.forEach((file, index) => {
      const item = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${file.name} — ${(file.size / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} Mo`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Retirer';
      remove.setAttribute('aria-label', `Retirer ${file.name}`);
      remove.disabled = button.disabled;
      remove.addEventListener('click', () => {
        documents.splice(index, 1);
        renderDocuments();
        picker.focus();
      });
      item.append(label, remove);
      list.append(item);
    });
  };
  picker.addEventListener('change', () => {
    const additions = Array.from(picker.files);
    const combined = [...documents, ...additions];
    const invalid = additions.some(
      (file) =>
        !Object.hasOwn(policy.types, file.name.split('.').at(-1).toLowerCase()) ||
        !file.size ||
        file.name.length > policy.maxFilenameLength ||
        /[\x00-\x1f\x7f/\\]/.test(file.name),
    );
    if (
      invalid ||
      combined.length > policy.maxFiles ||
      combined.reduce((size, file) => size + file.size, 0) > policy.maxAttachmentBytes
    ) {
      feedback.textContent = `Sélection non ajoutée : choisissez des fichiers non vides aux formats indiqués, ${policy.maxFiles} maximum et ${policy.maxAttachmentBytes / 1024 / 1024} Mo au total.`;
    } else {
      documents = combined;
      feedback.textContent = `${documents.length} document(s) sélectionné(s).`;
      renderDocuments();
    }
    picker.value = '';
  });
  const encodeDocument = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, content: reader.result.split(',')[1] });
      reader.onerror = () => reject(new Error('file-read'));
      reader.readAsDataURL(file);
    });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    const payload = Object.fromEntries(new FormData(form));
    // Freeze editable values so a successful response cannot erase newer, unsent text.
    const editableFields = [...form.querySelectorAll('input, textarea')];
    const previousDisabled = editableFields.map((field) => field.disabled);
    editableFields.forEach((field) => {
      field.disabled = true;
    });
    button.disabled = true;
    picker.disabled = true;
    renderDocuments();
    button.textContent = 'Envoi en cours…';
    status.textContent = 'Transmission de votre demande…';
    status.dataset.state = 'pending';
    try {
      payload.attachments = await Promise.all(documents.map(encodeDocument));
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000),
      });
      const result = await response.json();
      if (typeof result?.message !== 'string') throw new Error('invalid-response');
      status.textContent = result.message;
      status.dataset.state = response.ok ? 'success' : 'error';
      if (response.ok) {
        form.reset();
        documents = [];
        feedback.textContent = '';
      }
    } catch {
      status.dataset.state = 'error';
      status.textContent =
        'Impossible de confirmer l’envoi. Votre texte est conservé ; contactez-nous par email ou téléphone si le problème persiste.';
    } finally {
      button.disabled = false;
      picker.disabled = false;
      editableFields.forEach((field, index) => {
        field.disabled = previousDisabled[index];
      });
      renderDocuments();
      button.textContent = 'Envoyer ma demande';
    }
  });
})();
