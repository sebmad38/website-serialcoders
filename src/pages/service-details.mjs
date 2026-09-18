import { migrationAction, partner } from '../templates/editorial.mjs';
export function renderServiceDetails(path) {
  const content = {
    '/developpement-windev/': [
      'WinDev',
      'Les écrans de saisie, les traitements, les éditions et les échanges avec vos autres outils forment un ensemble. Nous étudions les usages quotidiens pour distinguer les fonctions indispensables, les tâches répétitives et les points de friction.',
      'Des règles de validation aux traitements de données, les particularités de votre activité doivent être explicites et vérifiables. Nous préparons avec vos équipes les scénarios qui permettront de valider l’application.',
    ],
    '/developpement-webdev/': [
      'WebDev',
      'Un portail ou une application web doit prendre en compte plusieurs profils d’utilisateurs, leurs droits et les informations auxquelles ils accèdent. Le cadrage porte autant sur les parcours que sur les échanges avec le système d’information.',
      'Nous examinons les accès, les validations, les situations d’erreur et les conditions de déploiement. La recette s’appuie sur des scénarios métier représentatifs, avec les personnes qui utiliseront l’application.',
    ],
    '/developpement-windev-mobile/': [
      'WinDev Mobile',
      'Une utilisation sur le terrain impose des choix concrets : taille d’écran, conditions de saisie, qualité du réseau, appareils et informations à consulter. Le besoin de fonctionnement hors connexion, s’il existe, doit être étudié dès le départ.',
      'Nous définissons avec vous les échanges avec le système d’information et les comportements attendus lorsque le réseau ou une donnée manque. Les tests doivent refléter les conditions d’utilisation réelles.',
    ],
  }[path];
  if (!content) return '';
  const [technology, usage, validation] = content;
  const extra = /* HTML */ `<section class="section">
      <span class="eyebrow">DÉVELOPPEMENT SUR MESURE</span>
      <h2>Le fonctionnement métier<br />guide les choix techniques.</h2>
      <div class="editorial-columns">
        <p>${usage}</p>
        <p>${validation}</p>
      </div>
    </section>
    <section class="section company">
      <div>
        <span class="eyebrow">PARTENAIRE GOLD PC SOFT</span>
        <h2>Faire évoluer ${technology}.<br />Ou préparer une autre voie.</h2>
        ${partner}
      </div>
      <div>
        <p class="large">
          Nous accompagnons votre projet dans l’écosystème PC SOFT comme dans une réflexion de
          migration.
        </p>
        <p>
          Votre stratégie, vos besoins d’intégration ou vos coûts d’exploitation évoluent ? Nous
          pouvons étudier le maintien de l’existant, une modernisation progressive ou une migration
          vers d’autres technologies, notamment C# et JavaScript. Le choix repose sur votre
          contexte, vos contraintes et le périmètre réellement utile.
        </p>
        ${migrationAction}
      </div>
    </section>`;
  return extra;
}
