export function renderNotFound(config) {
  const themeStylesheet = config.design === 'editorial' ? '/proposal-b.css' : '/modern.css';
  return /* HTML */ `<!doctype html>
    <html lang="fr">
      <meta charset="utf-8" /><meta
        name="viewport"
        content="width=device-width,initial-scale=1"
      /><title>Page introuvable | Serial Coders</title
      ><meta name="robots" content="noindex" /><link
        rel="stylesheet"
        href="/fonts/fonts.css"
      /><link rel="stylesheet" href="/style.css" /><link
        rel="stylesheet"
        href="/editorial.css"
      /><link rel="stylesheet" href="${themeStylesheet}" />
      <main class="detail-hero">
        <h1>Cette page<br />n’existe pas.</h1>
        <a class="button" href="/">Revenir à l’accueil</a>
      </main>
    </html>`;
}
