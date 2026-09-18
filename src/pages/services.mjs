import { services } from '../content/services.mjs';
import { renderServiceDetails } from './service-details.mjs';
const contactLink =
  '<a class="button" href="/contact/">Parlons de votre projet <span aria-hidden="true">↗</span></a>';
export const servicePages = services.map((s) => ({
  path: `/${s.slug}/`,
  title: `Développement ${s.name} sur mesure | Serial Coders`,
  description: s.description,
  body: /* HTML */ `<section class="detail-hero">
      <a class="back" href="/#domaines">← Toutes les expertises</a>
      <div class="eyebrow">DÉVELOPPEMENT ${s.name.toUpperCase()}</div>
      <h1>${s.title}</h1>
      <p class="lead">${s.intro}</p>
      ${contactLink}
    </section>
    <section class="section detail-grid">
      <div>
        <span class="eyebrow">VOS BESOINS</span>
        <h2>Une application pensée<br />pour vos usages.</h2>
      </div>
      <ul class="needs">
        ${s.needs.map((n) => /* HTML */ `<li>${n}</li>`).join('')}
      </ul>
    </section>
    <section class="section company">
      <h2>Commençons par<br />les bonnes questions.</h2>
      <div>
        <p class="large">${s.detail}</p>
        <p>
          Vous disposez déjà d’une application ${s.name} ? Décrivez son fonctionnement et les
          évolutions souhaitées pour que nous puissions étudier votre besoin.
        </p>
      </div>
    </section>
    ${renderServiceDetails(`/${s.slug}/`)}
    <section class="contact-band">
      <h2>Parlons de votre application ${s.name}.</h2>
      ${contactLink}
    </section>`,
}));
