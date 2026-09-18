import { sectionIcon } from './icons.mjs';

const navigationSections = [
  ['domaines', 'Votre projet'],
  ['double-expertise', 'Double expertise'],
  ['techno', 'Technologies'],
  ['bases-de-donnees', 'Bases de données'],
  ['societe', 'La société'],
  ['secteurs', 'Secteurs d’activité'],
  ['methode', 'Méthode'],
];
export const header = /* HTML */ `<a class="skip" href="#contenu">Aller au contenu</a>
  <header>
    <a class="brand" href="/" aria-label="Serial Coders — accueil"
      ><span class="brand-symbol" aria-hidden="true"
        ><img src="/logo.png" width="1000" height="1486" alt="" /></span
      ><span class="brand-wordmark"
        ><span class="brand-name">serial<span>coders</span><i aria-hidden="true">.</i></span
        ><span class="brand-descriptor">LOGICIELS SUR MESURE</span></span
      ></a
    >
    <p class="brand-baseline"><span>Le code au cœur</span><strong>de vos valeurs.</strong></p>
    <a class="nav-contact" href="/contact/"
      >Parlons de votre projet <span aria-hidden="true">↗</span></a
    ><button
      class="menu-toggle"
      type="button"
      aria-expanded="false"
      aria-controls="main-navigation"
    >
      <span class="menu-icon" aria-hidden="true"></span><span>Menu</span>
    </button>
    <nav id="main-navigation" aria-label="Navigation principale">
      ${navigationSections.map(([id, label], index) => /* HTML */ `<a href="/#${id}">${sectionIcon(id)}<span class="nav-number" aria-hidden="true">0${index + 1}</span>${label}</a>`).join('')}<a
        class="mobile-contact"
        href="/contact/"
        >Parlons de votre projet <span aria-hidden="true">↗</span></a
      >
    </nav>
  </header>`;
export const footer = /* HTML */ `<footer class="site-footer">
    <div class="footer-main">
      <div class="footer-identity">
        <a class="footer-brand" href="/" aria-label="Serial Coders — accueil"
          ><span class="footer-symbol" aria-hidden="true"
            ><img src="/logo.png" width="1000" height="1486" alt="" loading="lazy" /></span
          ><span>serial<span>coders</span><i aria-hidden="true">.</i></span></a
        >
        <p class="footer-baseline">Le code au cœur<br />de vos valeurs.</p>
        <p class="footer-reach">Applications sur mesure · France &amp; international</p>
      </div>
      <nav class="footer-expertise" aria-label="Nos expertises">
        <h2>Vos projets, notre expertise</h2>
        <a href="/#domaines">Développement sur mesure <span aria-hidden="true">↗</span></a>
        <a href="/migration-applications-pcsoft/"
          >Migration d’applications <span aria-hidden="true">↗</span></a
        >
        <a href="/#bases-de-donnees">Bases de données <span aria-hidden="true">↗</span></a>
      </nav>
      <div class="footer-contact">
        <h2>Faisons avancer votre projet</h2>
        <a class="footer-phone" href="tel:+33428292600" data-event="contact_phone_click"
          >04 28 29 26 00</a
        >
        <a
          class="footer-email"
          href="mailto:contact@serialcoders.fr"
          data-event="contact_email_click"
          >contact@serialcoders.fr</a
        >
        <a class="footer-cta" href="/contact/"
          >Parlons de votre besoin <span aria-hidden="true">↗</span></a
        >
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Serial Coders</span>
      <nav class="footer-legal" aria-label="Informations légales">
        <a href="/mentions-legales/">Mentions légales</a>
        <a href="/confidentialite/">Confidentialité</a>
        <button type="button" id="cookie-settings">Gérer les cookies</button>
      </nav>
      <a class="footer-top" href="#contenu">Haut de page <span aria-hidden="true">↑</span></a>
    </div>
  </footer>
  <section id="consent" class="consent" aria-labelledby="consent-title" hidden>
    <div>
      <h2 id="consent-title">Mesure d’audience</h2>
      <p>
        Avec votre accord, Google Analytics nous aide à comprendre les visites et les clics de
        contact. Votre choix peut être modifié à tout moment.
      </p>
    </div>
    <div class="consent-actions">
      <button type="button" data-consent="denied">Refuser</button
      ><button type="button" data-consent="granted">Accepter</button>
    </div>
  </section>
  <script src="/config.js" defer></script>
  <script src="/site.js" defer></script>`;
