(() => {
  const form = document.getElementById('project-contact');
  if (!form) return;
  const status = document.getElementById('contact-status');
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    button.disabled = true;
    button.textContent = 'Envoi en cours…';
    status.textContent = 'Transmission de votre demande…';
    status.dataset.state = 'pending';
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(15000)
      });
      const result = await response.json();
      status.textContent = result.message;
      status.dataset.state = response.ok ? 'success' : 'error';
      if (response.ok) form.reset();
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Impossible de confirmer l’envoi. Votre texte est conservé ; contactez-nous par email ou téléphone si le problème persiste.';
    } finally {
      button.disabled = false;
      button.textContent = 'Envoyer ma demande';
    }
  });
})();
