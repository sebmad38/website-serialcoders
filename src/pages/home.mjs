import { buyerServiceDirectory } from './buyer-services.mjs';
import { sectionIcon } from '../templates/icons.mjs';
import {
  action,
  migrationAction,
  partner,
  figure,
  steps,
  faq,
  quoteFaq,
  databaseSection,
} from '../templates/editorial.mjs';
export const homePage = {
  title: 'Applications sur mesure & migration WinDev | Serial Coders',
  description:
    'Partenaire Gold PC SOFT, Serial Coders développe vos applications métier et accompagne leur migration vers des technologies adaptées à vos besoins. France et international.',
  body: /* HTML */ `<section class="hero hero-repositioned">
      <div class="hero-copy">
        <span class="eyebrow">APPLICATIONS MÉTIER · DÉVELOPPEMENT · MIGRATION</span>
        <h1>Votre logiciel métier.<br /><em>Libre d’évoluer.</em></h1>
        <p class="lead">
          Du développement sur mesure à la migration de vos applications, nous faisons le lien entre
          votre métier, votre existant et vos prochaines ambitions.
        </p>
        <p class="hero-expertise">
          La maîtrise de WinDev, WebDev et WinDev Mobile.<br />Une expertise multitechnologie,
          notamment en C# et JavaScript.
        </p>
        <div class="hero-actions">
          ${action()}<a class="secondary-button" href="/migration-applications-pcsoft/"
            >Étudier une migration</a
          >
        </div>
      </div>
      ${figure('hero-visual', true)}
      <div class="hero-meta">
        <span>PARTENAIRE GOLD PC SOFT</span><span>TOUS SECTEURS D’ACTIVITÉ</span
        ><span>FRANCE & INTERNATIONAL</span>
      </div>
    </section>
    <section class="section" id="domaines">
      <div class="section-heading">
        <span class="eyebrow section-marker"
          >${sectionIcon('domaines')}<span>01 / VOTRE PROJET</span></span
        >
        <h2>Construire, faire évoluer<br />ou changer de technologie.</h2>
        <p>
          Vos enjeux ne s’arrêtent pas au choix d’un langage. Nous vous accompagnons dans la
          conception de vos outils, leur évolution et les décisions qui engagent leur avenir.
        </p>
      </div>
      <div class="offer-grid">
        <article>
          <span class="number">01 / CRÉATION</span>
          <h3>Développer votre application métier</h3>
          <p>
            Remplacer des fichiers dispersés, structurer un processus ou créer un service interne :
            nous concevons une application autour des usages de vos équipes et des règles propres à
            votre activité.
          </p>
          <a class="text-link" href="#techno">Choisir une base technique ↗</a>
        </article>
        <article>
          <span class="number">02 / ÉVOLUTION</span>
          <h3>Faire grandir votre existant</h3>
          <p>
            Ajouter une fonction, relier un nouvel outil, revoir les parcours ou préparer un
            changement d’échelle. Nous partons de ce qui fonctionne déjà pour identifier les
            évolutions utiles.
          </p>
          <a class="text-link" href="/modernisation-logiciel-metier/"
            >Moderniser votre application ↗</a
          >
        </article>
        <article class="featured-offer">
          <span class="number">03 / MIGRATION</span>
          <h3>Préparer votre prochaine architecture</h3>
          <p>
            Vous envisagez de quitter tout ou partie d’un environnement PC SOFT ? Notre double
            expertise permet d’étudier une migration vers d’autres technologies, dont C# et
            JavaScript, en tenant compte de votre patrimoine métier.
          </p>
          <a class="text-link" href="/migration-applications-pcsoft/">Explorer la migration ↗</a>
        </article>
      </div>
      ${buyerServiceDirectory}
    </section>
    <section class="section migration-feature" id="double-expertise">
      <div>
        <span class="eyebrow section-marker"
          >${sectionIcon('double-expertise')}<span>02 / DOUBLE EXPERTISE</span></span
        >
        <h2>Comprendre d’où vous partez.<br /><em>Construire où vous allez.</em></h2>
        <p class="large">
          Une migration réussie préserve ce qui rend votre logiciel utile : ses données, ses règles
          métier et les habitudes essentielles de vos équipes.
        </p>
        <p>
          Notre connaissance des technologies PC SOFT nous aide à analyser l’application d’origine.
          Notre expertise dans d’autres langages et technologies, notamment C# et JavaScript, ouvre
          de nouvelles possibilités pour son évolution. Nous réunissons ces deux regards pour
          proposer une trajectoire adaptée à votre contexte.
        </p>
        ${migrationAction}
      </div>
      <div
        class="architecture-map"
        role="group"
        aria-label="Principe d’une migration : analyser l’existant, préserver le métier, choisir la cible"
      >
        <div class="map-node">
          <span class="eyebrow">VOTRE EXISTANT</span
          ><strong>WinDev · WebDev<br />WinDev Mobile</strong
          ><span>Applications, données, interfaces</span>
        </div>
        <div class="map-bridge">
          <span aria-hidden="true">↓</span><strong>Votre métier fait le lien</strong
          ><span>Règles · usages · continuité</span><span aria-hidden="true">↓</span>
        </div>
        <div class="map-node map-target">
          <span class="eyebrow">VOTRE TRAJECTOIRE</span
          ><strong>Des technologies adaptées<br />à votre projet</strong
          ><span>Une cible choisie, pas imposée</span>
        </div>
      </div>
    </section>
    <section class="section" id="techno">
      <div class="section-heading">
        <span class="eyebrow section-marker"
          >${sectionIcon('techno')}<span>03 / TECHNOLOGIES</span></span
        >
        <h2>Plusieurs technologies.<br />Un même objectif métier.</h2>
        <p>
          Les technologies présentées ici illustrent une partie de nos compétences. Nous choisissons
          les outils en fonction de votre application, de son exploitation et des compétences
          nécessaires pour la faire vivre.
        </p>
      </div>
      <div class="technology-grid">
        ${[
          [
            'WD',
            'WinDev',
            'Applications métier de bureau et évolution de votre parc logiciel.',
            '/developpement-windev/',
          ],
          [
            'WB',
            'WebDev',
            'Applications web, portails et accès aux outils depuis un navigateur.',
            '/developpement-webdev/',
          ],
          [
            'WM',
            'WinDev Mobile',
            'Applications mobiles adaptées aux usages des équipes sur le terrain.',
            '/developpement-windev-mobile/',
          ],
          [
            'C#',
            'C#',
            'Applications et services sur mesure, reprise de logique métier et projets de migration.',
            '/developpement-csharp/',
          ],
          [
            'JS',
            'JavaScript',
            'Interfaces web et applications conçues autour de vos parcours utilisateurs.',
            '/developpement-javascript/',
          ],
        ]
          .map(
            ([mark, title, text, href]) =>
              /* HTML */ `<a class="technology-card" href="${href}"
                ><span class="tech-monogram" aria-hidden="true">${mark}</span>
                <h3>${title}</h3>
                <p>${text}</p>
                <span class="text-link">En savoir plus ↗</span></a
              >`,
          )
          .join('')}
      </div>
    </section>
    ${databaseSection}
    <section class="section company" id="societe">
      <div>
        <span class="eyebrow section-marker"
          >${sectionIcon('societe')}<span>05 / LA SOCIÉTÉ</span></span
        >
        <h2>Une expertise PC SOFT.<br />Une vision ouverte.</h2>
        ${partner}
      </div>
      <div>
        <p class="large">
          Serial Coders est spécialisée dans le développement d’applications sur mesure pour tous
          les secteurs d’activité.
        </p>
        <p>
          Partenaire Gold de PC SOFT, nous maîtrisons WinDev, WebDev et WinDev Mobile. Nous
          continuons à accompagner les entreprises qui choisissent cet écosystème pour créer et
          faire évoluer leurs logiciels.
        </p>
        <p>
          Nos compétences couvrent également d’autres langages et technologies, notamment C# et
          JavaScript. Cette complémentarité nous permet d’accompagner les entreprises qui souhaitent
          diversifier leur environnement technique ou préparer une migration, sans perdre la
          connaissance accumulée dans leur application.
        </p>
        <p>
          Notre rôle : vous aider à prendre une décision argumentée en rapprochant les besoins
          métier, les contraintes techniques et le coût global de votre logiciel. Nous intervenons
          sur des projets en France et à l’international.
        </p>
      </div>
    </section>
    <section class="section" id="secteurs">
      <span class="eyebrow section-marker"
        >${sectionIcon('secteurs')}<span>06 / SECTEURS D’ACTIVITÉ</span></span
      >
      <h2>Le point commun :<br />un métier qui vous est propre.</h2>
      <p class="section-intro">
        Les exemples ci-dessous illustrent les types de besoins qu’une application sur mesure peut
        couvrir. Le périmètre est défini avec vos équipes, selon vos contraintes et votre activité.
      </p>
      <div class="sector-grid">
        ${[
          [
            'Industrie & production',
            'Suivi des opérations, traçabilité et circulation des informations entre les équipes.',
          ],
          [
            'Commerce & distribution',
            'Gestion des commandes, des catalogues, des stocks et des échanges avec vos autres outils.',
          ],
          [
            'Services & conseil',
            'Suivi des dossiers, organisation des missions et partage de l’information métier.',
          ],
          [
            'Logistique & interventions',
            'Préparation des opérations, saisie sur le terrain et consultation de données en mobilité.',
          ],
          [
            'Associations & organisations',
            'Gestion des activités, des adhésions et des processus propres à votre organisation.',
          ],
          [
            'Votre secteur',
            'Un besoin spécifique ne rentre pas toujours dans une catégorie. Décrivez-nous votre fonctionnement.',
          ],
        ]
          .map(
            ([name, text], i) =>
              /* HTML */ `<article>
                <span class="sector-index" aria-hidden="true">0${i + 1}</span>
                <h3>${name}</h3>
                <p>${text}</p>
              </article>`,
          )
          .join('')}
      </div>
    </section>
    <section class="section process" id="methode">
      <span class="eyebrow section-marker">${sectionIcon('methode')}<span>07 / MÉTHODE</span></span>
      <h2>Une trajectoire lisible.<br />Des décisions à chaque étape.</h2>
      ${steps()}
    </section>
    <section class="section home-faq" id="questions-devis" aria-labelledby="questions-devis-title">
      <div>
        <span class="eyebrow">AVANT DE DEMANDER UN DEVIS</span>
        <h2 id="questions-devis-title">Vos questions.<br />Des réponses concrètes.</h2>
        <p>
          Budget, choix technique, continuité d’activité et reprise de l’existant : les points à
          clarifier avant de vous engager.
        </p>
        ${action('Parlons de votre besoin')}
      </div>
      ${faq(quoteFaq)}
    </section>
    <section class="contact-band" id="contact">
      <span class="eyebrow">PARLONS DE VOTRE PROCHAINE ÉTAPE</span>
      <h2>
        Un nouveau projet ?<br /><em>Faisons évoluer<br />votre métier.</em>
      </h2>
      <p>
        Création, ajout de nouveaux modules ou migration : présentez-nous votre application, vos
        enjeux et vos ambitions. Définissons ensemble votre prochaine étape.
      </p>
      ${action('Échangeons sur votre besoin')}
    </section>`,
};
