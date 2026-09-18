import { migrationSteps } from '../content/editorial.mjs';
export const action = (label = 'Parlons de votre projet') =>
  /* HTML */ `<a class="button" href="/contact/">${label} <span aria-hidden="true">↗</span></a>`;
export const migrationAction =
  '<a class="text-link" href="/migration-applications-pcsoft/">Comprendre notre accompagnement migration <span aria-hidden="true">↗</span></a>';
export const partner =
  '<img class="partner-logo" src="/pcsoft-partner.png" width="250" height="68" loading="lazy" alt="PC SOFT — Gold Partner">';
export const figure = (className = '', eager = false) =>
  /* HTML */ `<figure class="architecture-figure ${className}">
    <img
      src="/migration-code.png"
      width="2060"
      height="763"
      alt="Migration du code et des données d’une application métier vers une interface modernisée."
      decoding="async"
      ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}
    />
    <figcaption>Préserver la logique métier. Faire évoluer l’architecture.</figcaption>
  </figure>`;
export const steps = () =>
  /* HTML */ `<ol class="migration-steps">
    ${migrationSteps
      .map(
        ([title, text, output], index) =>
          /* HTML */ `<li>
            <span class="step-number">0${index + 1}</span>
            <div>
              <h3>${title}</h3>
              <p>${text}</p>
              <p class="deliverable"><strong>Objectif :</strong> ${output}</p>
            </div>
          </li>`,
      )
      .join('')}
  </ol>`;
export const faq = (entries) =>
  /* HTML */ `<div class="faq-list">
    ${entries
      .map(
        ([question, answer]) =>
          /* HTML */ `<details>
            <summary>${question}</summary>
            <p>${answer}</p>
          </details>`,
      )
      .join('')}
  </div>`;
