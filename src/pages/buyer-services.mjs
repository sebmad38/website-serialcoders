import { services } from '../content/buyer-services.mjs';
const link = (service) =>
  /* HTML */ `<a class="text-link" href="${service.path}">${service.label} ↗</a>`;
export const buyerServiceDirectory = /* HTML */ `<div class="buyer-services">
  <h3>Un besoin précis ?</h3>
  <p>Explorez l’accompagnement adapté à votre situation.</p>
  <div class="offer-grid">
    ${services
      .map(
        (service) =>
          /* HTML */ `<article>
            <h4>${service.label}</h4>
            <p>${service.summary || service.description}</p>
            ${link(service)}
          </article>`,
      )
      .join('')}
  </div>
</div>`;
const list = (entries) =>
  /* HTML */ `<ul class="needs">
    ${entries.map((entry) => /* HTML */ `<li>${entry}</li>`).join('')}
  </ul>`;
const action = (label) =>
  /* HTML */ `<a class="button" href="/contact/">${label} <span aria-hidden="true">↗</span></a>`;

export const buyerServicePages = services
  .filter((service) => service.heading)
  .map((service) => ({
    path: service.path,
    title: service.title,
    description: service.description,
    body: /* HTML */ `<section class="detail-hero">
        <a class="back" href="/#domaines">← Votre projet</a
        ><span class="eyebrow">${service.label}</span>
        <h1>${service.heading}</h1>
        <p class="lead">${service.intro}</p>
        ${action(service.cta)}
      </section>
      <section class="section detail-grid">
        <div>
          <span class="eyebrow">VOTRE SITUATION</span>
          <h2>Quand faire appel à nous ?</h2>
        </div>
        ${list(service.needs)}
      </section>
      <section class="section">
        <span class="eyebrow">NOTRE DÉMARCHE</span>
        <h2>Du cadrage à la validation</h2>
        <div class="offer-grid">
          ${service.steps
            .map(
              ([title, text], index) =>
                /* HTML */ `<article>
                  <span class="number">0${index + 1}</span>
                  <h3>${title}</h3>
                  <p>${text}</p>
                </article>`,
            )
            .join('')}
        </div>
      </section>
      <section class="section detail-grid">
        <div>
          <span class="eyebrow">LES LIVRABLES</span>
          <h2>Ce que prévoit l’accompagnement</h2>
          <p>
            Le contenu et le niveau de détail sont précisés dans la proposition, selon le périmètre
            retenu.
          </p>
        </div>
        ${list(service.deliverables)}
      </section>
      <section class="section company">
        <div>
          <h2>Un périmètre explicite.<br />Un budget construit.</h2>
        </div>
        <div>
          <h3>Ce qui doit être cadré</h3>
          <p>${service.scope}</p>
          <h3>Ce qui détermine le coût et le délai</h3>
          <p>${service.cost}</p>
          <p>
            Le chiffrage suit la qualification du besoin. Si des inconnues importantes subsistent,
            une phase d’étude peut être proposée avant les travaux.
          </p>
        </div>
      </section>
      <section class="section">
        <h2>Vos questions avant de commencer</h2>
        <div class="faq-list">
          ${service.faq
            .map(
              ([question, answer]) =>
                /* HTML */ `<details>
                  <summary>${question}</summary>
                  <p>${answer}</p>
                </details>`,
            )
            .join('')}
        </div>
      </section>
      <section class="section company">
        <div><h2>Préparer notre premier échange</h2></div>
        <div>
          <p class="large">${service.prepare}</p>
          ${action(service.cta)}
        </div>
      </section>
      <section class="section">
        <h2>Selon la suite de votre projet</h2>
        <ul class="needs">
          ${services
            .filter((other) => other.path !== service.path)
            .map((other) => /* HTML */ `<li>${link(other)}</li>`)
            .join('')}
        </ul>
      </section>`,
  }));

/** Keep the established migration page and add buying details rather than a competing URL. */
export function enrichMigrationOffer(page) {
  if (page.path !== '/migration-applications-pcsoft/') return page;
  const section = /* HTML */ `<section class="section detail-grid">
      <div>
        <span class="eyebrow">LES LIVRABLES</span>
        <h2>Une trajectoire documentée</h2>
        <p>Les livrables sont précisés dans la proposition selon les phases retenues.</p>
      </div>
      ${list(['Une cartographie des fonctions, des données et des dépendances de l’application WinDev.', 'Une comparaison des architectures cibles, notamment C# ou JavaScript, et un découpage des étapes.', 'Les composants et scripts de reprise convenus, accompagnés des résultats de recette.', 'Les procédures de bascule, de retour arrière et les éléments de transmission aux équipes.'])}
    </section>
    <section class="section company">
      <div><h2>Quel budget pour votre migration WinDev ?</h2></div>
      <div>
        <p class="large">
          Le coût dépend du patrimoine à reprendre et des contraintes de continuité.
        </p>
        <p>
          Les fonctions réellement conservées, la documentation des règles métier, les composants
          tiers, la qualité des données et les interfaces influencent la charge. La coexistence
          entre ancienne et nouvelle application ainsi que la recette avec vos utilisateurs doivent
          être intégrées au calendrier.
        </p>
        <p>
          Nous qualifions ces points avant le chiffrage ; une étude ou un pilote peut être
          nécessaire pour lever les inconnues. Aucune conversion automatique intégrale, économie
          garantie ou absence d’interruption n’est promise.
        </p>
        <h3>Pour préparer l’échange</h3>
        <p>
          Indiquez vos versions WinDev, les sources disponibles, le nombre d’utilisateurs, les
          interfaces externes et les raisons du changement. Décrivez les périodes pendant lesquelles
          l’application ne peut pas être interrompue.
        </p>
        ${action('Étudier ma migration WinDev')}
      </div>
    </section>
    <section class="section">
      <h2>Avant ou pendant votre migration</h2>
      <ul class="needs">
        ${services
          .filter((service) => service.path !== page.path)
          .map((service) => /* HTML */ `<li>${link(service)}</li>`)
          .join('')}
      </ul>
    </section>`;
  return { ...page, body: page.body + section };
}
