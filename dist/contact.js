(() => {
  const form = document.getElementById('project-contact');
  if (!form) return;
  const status = document.getElementById('contact-status');
  const button = form.querySelector('button[type="submit"]');
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
      remove.addEventListener('click', () => { documents.splice(index, 1); renderDocuments(); picker.focus(); });
      item.append(label, remove);
      list.append(item);
    });
  };
  picker.addEventListener('change', () => {
    const additions = Array.from(picker.files);
    const combined = [...documents, ...additions];
    const invalid = additions.some(file => !/\.(pdf|docx|xlsx|pptx|txt|png|jpe?g)$/i.test(file.name) || !file.size || file.name.length > 180 || /[\x00-\x1f\x7f/\\]/.test(file.name));
    if (invalid || combined.length > 5 || combined.reduce((size, file) => size + file.size, 0) > 10 * 1024 * 1024) {
      feedback.textContent = 'Sélection non ajoutée : choisissez des fichiers non vides aux formats indiqués, cinq maximum et 10 Mo au total.';
    } else {
      documents = combined;
      feedback.textContent = `${documents.length} document(s) sélectionné(s).`;
      renderDocuments();
    }
    picker.value = '';
  });
  const encodeDocument = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, content: reader.result.split(',')[1] });
    reader.onerror = () => reject(new Error('file-read'));
    reader.readAsDataURL(file);
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    button.disabled = true;
    picker.disabled = true;
    renderDocuments();
    button.textContent = 'Envoi en cours…';
    status.textContent = 'Transmission de votre demande…';
    status.dataset.state = 'pending';
    try {
      const payload = Object.fromEntries(new FormData(form));
      payload.attachments = await Promise.all(documents.map(encodeDocument));
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000)
      });
      const result = await response.json();
      status.textContent = result.message;
      status.dataset.state = response.ok ? 'success' : 'error';
      if (response.ok) { form.reset(); documents = []; feedback.textContent = ''; }
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Impossible de confirmer l’envoi. Votre texte est conservé ; contactez-nous par email ou téléphone si le problème persiste.';
    } finally {
      button.disabled = false;
      picker.disabled = false;
      renderDocuments();
      button.textContent = 'Envoyer ma demande';
    }
  });
})();
