import { escapeHtml as escape } from '../lib/html.mjs';
import { header, footer } from './layout.mjs';

export function renderDocument(page, config) {
  const origin = new URL(config.origin);
  const themeStylesheet = config.design === 'editorial' ? '/proposal-b.css' : '/modern.css';
  const url = new URL(page.path, origin).href;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Serial Coders',
    url: origin.origin,
    email: 'contact@serialcoders.fr',
    telephone: '+33428292600',
  };
  return /* HTML */ `<!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${escape(page.title)}</title>
        <meta name="description" content="${escape(page.description)}" />
        <meta
          name="robots"
          content="${config.production ? 'index, follow' : 'noindex, nofollow'}"
        />
        <link rel="canonical" href="${escape(url)}" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:title" content="${escape(page.title)}" />
        <meta property="og:description" content="${escape(page.description)}" />
        <meta property="og:url" content="${escape(url)}" />
        ${config.googleSiteVerification ? /* HTML */ `<meta name="google-site-verification" content="${escape(config.googleSiteVerification)}" />` : ''}
        <link rel="icon" href="/favicon.ico?v=serial-coders-1" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png?v=serial-coders-1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/editorial.css" />
        <link rel="stylesheet" href="${themeStylesheet}" />
        <script type="application/ld+json">
          ${JSON.stringify(schema).replace(/</g, '\\u003c')}
        </script>
      </head>
      <body>
        ${header}
        <main id="contenu">${page.body}</main>
        ${footer}
      </body>
    </html>`;
}
