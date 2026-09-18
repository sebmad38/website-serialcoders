import { contactPolicy as policy } from '../../server/contact/policy.mjs';
export const contactPage = {
  path: '/contact/',
  title: 'Parlons de votre projet logiciel | Serial Coders',
  description:
    'Contactez Serial Coders pour votre application sur mesure ou sa migration. Une expertise PC SOFT et multitechnologie au service de vos objectifs.',
  body: /* HTML */ `<section class="detail-hero">
      <span class="eyebrow">VOTRE PROJET COMMENCE ICI</span>
      <h1>Qu’aimeriez-vous<br /><em>faire avancer ?</em></h1>
      <p class="lead">
        Une nouvelle application, un logiciel à faire évoluer ou une migration à préparer :
        échangeons sur votre besoin et les technologies les plus adaptées.
      </p>
      <div class="contact-options">
        <a
          class="button"
          href="mailto:contact@serialcoders.fr?subject=Projet%20logiciel%20%E2%80%94%20Serial%20Coders"
          data-event="contact_email_click"
          >Écrire à Serial Coders ↗</a
        ><a class="phone" href="tel:+33428292600" data-event="contact_phone_click"
          >04 28 29 26 00</a
        >
      </div>
      <p>contact@serialcoders.fr</p>
    </section>
    <section class="section contact-form-section" aria-labelledby="form-title">
      <div>
        <span class="eyebrow">DÉCRIVEZ-NOUS VOTRE BESOIN</span>
        <h2 id="form-title">Votre projet commence ici.</h2>
        <p>
          Création, évolution, migration ou bases de données : quelques lignes suffisent pour
          préparer un premier échange.
        </p>
        <p>Les champs marqués d’un astérisque sont obligatoires.</p>
      </div>
      <form id="project-contact" action="/api/contact" method="post">
        <div class="form-fields">
          <div>
            <label for="contact-name">Nom et prénom *</label
            ><input
              id="contact-name"
              name="name"
              autocomplete="name"
              required
              maxlength="${policy.fields.name}"
            />
          </div>
          <div>
            <label for="contact-email">Email professionnel *</label
            ><input
              id="contact-email"
              name="email"
              type="email"
              autocomplete="email"
              required
              maxlength="${policy.fields.email}"
            />
          </div>
          <div>
            <label for="contact-company">Entreprise</label
            ><input
              id="contact-company"
              name="company"
              autocomplete="organization"
              maxlength="${policy.fields.company}"
            />
          </div>
          <div>
            <label for="contact-phone">Téléphone</label
            ><input
              id="contact-phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              maxlength="${policy.fields.phone}"
            />
          </div>
        </div>
        <div class="form-trap" aria-hidden="true">
          <label for="contact-website">Laisser ce champ vide</label
          ><input
            id="contact-website"
            name="website"
            tabindex="-1"
            autocomplete="off"
            maxlength="${policy.fields.website}"
          />
        </div>
        <label for="contact-message">Votre projet *</label
        ><textarea
          id="contact-message"
          name="message"
          rows="7"
          minlength="${policy.minMessageLength}"
          maxlength="${policy.fields.message}"
          required
          aria-describedby="message-help"
        ></textarea>
        <p id="message-help" class="form-note">
          Décrivez votre besoin, votre application existante et vos objectifs
          (${policy.minMessageLength} caractères minimum). N’indiquez aucun mot de passe ni donnée
          confidentielle.
        </p>
        <div class="document-upload">
          <label for="contact-documents"
            >Documents utiles à votre projet <span>(facultatif)</span></label
          >
          <p id="document-help" class="form-note">
            Cahier des charges, captures d’écran, présentation… Ajoutez jusqu’à ${policy.maxFiles}
            fichiers, pour 10 Mo au total. Formats :
            ${Object.keys(policy.types)
              .map((extension) => extension.toUpperCase())
              .join(', ')}.
          </p>
          <input
            id="contact-documents"
            type="file"
            multiple
            accept="${Object.keys(policy.types)
              .map((extension) => `.${extension}`)
              .join(',')}"
            aria-describedby="document-help document-feedback"
          />
          <ul id="document-list" aria-label="Documents sélectionnés"></ul>
          <p id="document-feedback" class="form-note" role="status" aria-live="polite"></p>
        </div>
        <p class="form-note">
          Vos coordonnées, vos documents et votre message servent à traiter votre demande et à vous
          recontacter. <a href="/confidentialite/">En savoir plus sur vos données</a>.
        </p>
        <button class="button" type="submit">Envoyer ma demande</button>
        <p id="contact-status" role="status" aria-live="polite" aria-atomic="true"></p>
        <noscript
          ><p>
            Activez JavaScript pour envoyer ce formulaire, ou écrivez à
            <a href="mailto:contact@serialcoders.fr">contact@serialcoders.fr</a>.
          </p></noscript
        >
      </form>
    </section>
    <script src="/contact.js" defer></script>
    <section class="section detail-grid">
      <div>
        <h2>Pour préparer<br />notre premier échange.</h2>
        <p>France et projets internationaux.</p>
      </div>
      <ul class="needs">
        <li>Votre activité et les personnes qui utiliseront l’application.</li>
        <li>Vos technologies actuelles, leurs versions et les difficultés rencontrées.</li>
        <li>Le résultat attendu, le nombre d’utilisateurs, vos contraintes et votre calendrier.</li>
      </ul>
    </section>`,
};
