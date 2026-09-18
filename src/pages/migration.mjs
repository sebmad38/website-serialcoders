import { action, partner, figure, steps, faq, migrationFaq } from '../templates/editorial.mjs';
export function createMigrationPage(design) {
  return {
    path: '/migration-applications-pcsoft/',
    title: 'Migration d’applications PC SOFT | Serial Coders',
    description:
      'Préparez la migration de vos applications PC SOFT avec Serial Coders : expertise multitechnologie, audit, choix de la cible, données et bascule.',
    body: /* HTML */ `<section class="detail-hero migration-hero">
        <a class="back" href="/">← Serial Coders</a
        ><span class="eyebrow">MIGRATION D’APPLICATIONS PC SOFT</span>
        <h1>Changer de technologie.<br /><em>Préserver votre métier.</em></h1>
        <p class="lead">
          Votre application WinDev, WebDev ou WinDev Mobile concentre des années de fonctionnement
          métier. Nous vous aidons à préparer son évolution vers les technologies adaptées à votre
          projet en identifiant ce qu’il faut conserver, repenser et sécuriser.
        </p>
        ${action('Parlons de votre migration')}${design === 'editorial' ? '<figure class="proposal-panorama"><img src="/migration-code.png" width="2060" height="763" alt="Migration du code et des données d’une application métier vers une interface modernisée." decoding="async"></figure>' : ''}
      </section>
      <section class="section migration-feature">
        <div>
          <span class="eyebrow">UN CHOIX D’ENTREPRISE</span>
          <h2>Pourquoi envisager<br />une migration ?</h2>
          <p>
            Votre contexte évolue : nouveaux usages, besoin d’interopérabilité, compétences
            disponibles ou recherche d’une meilleure visibilité sur les coûts. La technologie
            choisie hier mérite parfois d’être réévaluée.
          </p>
          <p>
            Les conditions de licence et de déploiement font partie de cette réflexion. Nous
            examinons avec vous les conditions applicables à votre projet, le nombre d’utilisateurs,
            les perspectives de croissance et les coûts d’exploitation. L’objectif est de comparer
            des scénarios réalistes, pas de remplacer un outil par principe.
          </p>
          <p>
            Maintenir, moderniser ou migrer : chaque option doit être évaluée au regard de ce
            qu’elle apporte à votre entreprise.
          </p>
        </div>
        ${design === 'editorial' ? '' : figure()}
      </section>
      <section class="section company">
        <div>
          <span class="eyebrow">NOTRE ATOUT</span>
          <h2>La connaissance<br />des deux environnements.</h2>
          ${partner}
        </div>
        <div>
          <p class="large">
            Comprendre l’application d’origine est aussi important que maîtriser la technologie
            cible.
          </p>
          <p>
            Notre expertise PC SOFT permet d’aborder les traitements, les écrans et les dépendances
            de votre existant avec les bons repères. Notre expertise multitechnologie, qui comprend
            notamment C# et JavaScript, permet d’envisager une autre architecture et de
            réimplémenter les fonctions qui comptent.
          </p>
          <p>
            Nous restons partenaire Gold de PC SOFT. Une migration est un choix lié à votre contexte
            ; elle ne remet pas en cause la pertinence de cet écosystème pour d’autres projets.
          </p>
        </div>
      </section>
      <section class="section">
        <span class="eyebrow">LA MÉTHODE</span>
        <h2>De l’état des lieux<br />à une bascule préparée.</h2>
        ${steps()}
      </section>
      <section class="section scenario-section">
        <span class="eyebrow">TROIS TRAJECTOIRES À COMPARER</span>
        <h2>Il n’y a pas qu’une façon<br />de faire évoluer un logiciel.</h2>
        <div class="offer-grid">
          <article>
            <h3>Conserver et optimiser</h3>
            <p>
              Lorsque l’application répond au besoin, des évolutions ciblées peuvent être plus
              pertinentes qu’une réécriture. Nous examinons les limites réelles avant de proposer un
              changement de socle.
            </p>
          </article>
          <article>
            <h3>Migrer progressivement</h3>
            <p>
              Remplacer un module ou ouvrir une interface permet parfois de répartir l’effort. La
              coexistence exige une gestion explicite des données, des échanges et des
              responsabilités de chaque composant.
            </p>
          </article>
          <article>
            <h3>Reconstruire le périmètre</h3>
            <p>
              Une nouvelle base peut se justifier lorsque les contraintes s’accumulent. Le périmètre
              utile, les données à reprendre et les critères de recette doivent alors être définis
              avant la réalisation.
            </p>
          </article>
        </div>
      </section>
      <section class="section detail-grid">
        <div>
          <span class="eyebrow">UNE DÉCISION DOCUMENTÉE</span>
          <h2>Comparer le coût total,<br />pas seulement les licences.</h2>
          <p>
            Les coûts varient selon la version, les contrats, l’architecture et les composants
            retenus. Aucun montant ni gain n’est présumé avant l’étude.
          </p>
        </div>
        <ul class="needs">
          <li>
            <strong>Investissement initial :</strong> analyse, développement, reprise des données et
            validation.
          </li>
          <li>
            <strong>Coûts récurrents :</strong> licences applicables, hébergement, maintenance et
            exploitation.
          </li>
          <li>
            <strong>Transition :</strong> coexistence, accompagnement des utilisateurs et
            éventuelles interruptions.
          </li>
          <li>
            <strong>Durée de vie :</strong> facilité d’évolution, disponibilité des compétences et
            dépendances techniques.
          </li>
        </ul>
      </section>
      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">LES POINTS À SÉCURISER</span>
          <h2>Votre activité continue.<br />La migration doit en tenir compte.</h2>
        </div>
        <div class="sector-grid">
          <article>
            <h3>Les règles métier</h3>
            <p>
              Recenser les cas particuliers et les traitements essentiels pour éviter qu’une
              nouvelle interface masque une régression fonctionnelle.
            </p>
          </article>
          <article>
            <h3>Les données</h3>
            <p>
              Préparer les correspondances, les contrôles de cohérence et les reprises à blanc avant
              de déplacer des informations en production.
            </p>
          </article>
          <article>
            <h3>Les interfaces</h3>
            <p>
              Identifier les échanges avec les autres logiciels, les fichiers, les services et les
              équipements qui dépendent de l’application.
            </p>
          </article>
          <article>
            <h3>La recette</h3>
            <p>
              Définir avec vos utilisateurs des scénarios représentatifs et des critères
              d’acceptation vérifiables.
            </p>
          </article>
          <article>
            <h3>La bascule</h3>
            <p>
              Planifier la mise en service, les sauvegardes, les éventuelles fenêtres d’intervention
              et un scénario de retour arrière.
            </p>
          </article>
          <article>
            <h3>La transmission</h3>
            <p>
              Préparer les éléments de documentation et les modalités de maintenance pour faire
              vivre le logiciel après la migration.
            </p>
          </article>
        </div>
      </section>
      <section class="section home-faq">
        <div>
          <span class="eyebrow">QUESTIONS FRÉQUENTES</span>
          <h2>Préparer le projet<br />sans idée préconçue.</h2>
        </div>
        ${faq(migrationFaq)}
      </section>
      <section class="contact-band">
        <span class="eyebrow">LE PREMIER ÉCHANGE</span>
        <h2>Décrivez-nous votre existant.</h2>
        <p>
          Technologies et versions utilisées, nombre d’utilisateurs, interfaces, difficultés
          rencontrées et objectifs : ces éléments nous aideront à cadrer la discussion.
        </p>
        ${action('Étudier mon projet de migration')}
      </section>`,
  };
}
