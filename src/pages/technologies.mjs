import { action, migrationAction } from '../templates/editorial.mjs';
export const newTechnologyPages = [
  {
    path: '/developpement-csharp/',
    title: 'Développement C# sur mesure & migration | Serial Coders',
    description:
      'Serial Coders développe vos applications et services en C# et accompagne la migration de votre logique métier depuis un environnement PC SOFT.',
    body: /* HTML */ `<section class="detail-hero">
        <a class="back" href="/#techno">← Nos technologies</a
        ><span class="eyebrow">DÉVELOPPEMENT C#</span>
        <h1>Une autre base technique.<br /><em>Toujours votre métier.</em></h1>
        <p class="lead">
          Nous développons en C# pour créer des applications sur mesure, faire évoluer votre système
          d’information ou reconstruire un périmètre métier issu d’une application PC SOFT.
        </p>
        ${action()}
      </section>
      <section class="section detail-grid">
        <div>
          <h2>Du besoin fonctionnel<br />à l’architecture.</h2>
          <p>
            Le choix de C# prend son sens lorsqu’il répond aux usages, aux interfaces et aux
            conditions d’exploitation de votre projet.
          </p>
        </div>
        <ul class="needs">
          <li>Concevoir une application adaptée à vos processus internes.</li>
          <li>Développer des services qui structurent et exposent votre logique métier.</li>
          <li>Reprendre des traitements existants avec des critères de validation explicites.</li>
          <li>Préparer une maintenance et des évolutions cohérentes avec votre organisation.</li>
        </ul>
      </section>
      <section class="section company">
        <div>
          <span class="eyebrow">DE WINDEV À C#</span>
          <h2>Transmettre la logique.<br />Repenser l’implémentation.</h2>
        </div>
        <div>
          <p class="large">
            Migrer une application ne consiste pas à transcrire ses lignes de code.
          </p>
          <p>
            Nous identifions les règles métier, les dépendances, les échanges et les besoins des
            utilisateurs avant de définir la structure cible. Certains parcours peuvent être
            conservés, d’autres repensés. Les tests et la recette doivent vérifier que le résultat
            attendu reste au rendez-vous.
          </p>
          ${migrationAction}
        </div>
      </section>
      <section class="section">
        <h2>Les décisions à prendre ensemble.</h2>
        <div class="offer-grid">
          <article>
            <h3>Les usages</h3>
            <p>
              Application de bureau, service ou composant d’un système plus large : préciser le rôle
              du logiciel avant de choisir son architecture.
            </p>
          </article>
          <article>
            <h3>Les données et interfaces</h3>
            <p>
              Étudier les échanges, les accès, les formats et la reprise des informations
              indispensables à l’activité.
            </p>
          </article>
          <article>
            <h3>L’exploitation</h3>
            <p>
              Définir l’hébergement, la maintenance, les composants nécessaires et leurs conditions
              d’utilisation.
            </p>
          </article>
        </div>
      </section>
      <section class="contact-band">
        <h2>Un projet C# à construire<br />ou une migration à préparer ?</h2>
        ${action()}
      </section>`,
  },
  {
    path: '/developpement-javascript/',
    title: 'Développement JavaScript sur mesure | Serial Coders',
    description:
      'Applications web et interfaces métier en JavaScript : Serial Coders accompagne vos développements sur mesure et vos projets de migration PC SOFT.',
    body: /* HTML */ `<section class="detail-hero">
        <a class="back" href="/#techno">← Nos technologies</a
        ><span class="eyebrow">DÉVELOPPEMENT JAVASCRIPT</span>
        <h1>Vos usages métier.<br /><em>Une expérience web adaptée.</em></h1>
        <p class="lead">
          Nous utilisons JavaScript pour concevoir des interfaces et des applications web sur
          mesure, en lien avec les services et les données de votre système d’information.
        </p>
        ${action()}
      </section>
      <section class="section detail-grid">
        <div>
          <h2>Faire du navigateur<br />un outil de travail.</h2>
          <p>
            L’enjeu est de rendre les parcours utiles, compréhensibles et adaptés aux contextes
            d’utilisation.
          </p>
        </div>
        <ul class="needs">
          <li>Créer des interfaces de consultation et de saisie adaptées à vos équipes.</li>
          <li>Construire un portail autour d’un processus propre à votre activité.</li>
          <li>
            Relier une interface aux services et aux données nécessaires à son fonctionnement.
          </li>
          <li>Repenser des parcours existants dans le cadre d’une migration vers le Web.</li>
        </ul>
      </section>
      <section class="section company">
        <div>
          <span class="eyebrow">MIGRATION & MODERNISATION</span>
          <h2>Revoir l’interface.<br />Respecter le fonctionnement métier.</h2>
        </div>
        <div>
          <p class="large">Une nouvelle interface doit s’intégrer à une architecture cohérente.</p>
          <p>
            Nous étudions la répartition entre les traitements exécutés dans le navigateur et les
            services côté serveur, les droits d’accès, les échanges de données et les situations
            d’erreur. Notre connaissance de l’existant PC SOFT permet de replacer ces choix dans le
            fonctionnement de votre application.
          </p>
          ${migrationAction}
        </div>
      </section>
      <section class="section">
        <h2>Un projet web se prépare<br />au-delà de ses écrans.</h2>
        <div class="offer-grid">
          <article>
            <h3>Les parcours</h3>
            <p>
              Identifier les tâches prioritaires, les utilisateurs et les appareils utilisés pour
              concevoir une interface adaptée.
            </p>
          </article>
          <article>
            <h3>Les échanges</h3>
            <p>
              Définir les interfaces avec vos données et les autres applications, ainsi que les
              droits associés.
            </p>
          </article>
          <article>
            <h3>La pérennité</h3>
            <p>
              Choisir les bibliothèques et composants en considérant leur maintenance, leurs
              licences et les compétences nécessaires.
            </p>
          </article>
        </div>
      </section>
      <section class="contact-band">
        <h2>Votre prochain outil métier<br />sera-t-il accessible sur le Web ?</h2>
        ${action()}
      </section>`,
  },
];
