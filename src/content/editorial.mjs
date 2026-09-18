export const migrationSteps = [
  [
    'Comprendre l’existant',
    'Code, données, règles métier, interfaces et usages : nous identifions ce qui fait fonctionner votre application, y compris les dépendances peu visibles.',
    'Une cartographie du périmètre et des points de vigilance.',
  ],
  [
    'Comparer les trajectoires',
    'Maintien, modernisation ciblée ou migration : nous rapprochons les besoins fonctionnels, les contraintes d’exploitation et les coûts de chaque scénario.',
    'Une cible technique et une feuille de route à arbitrer.',
  ],
  [
    'Valider sur un périmètre pilote',
    'Un premier module permet de confronter la nouvelle architecture à vos données, aux interfaces existantes et à des situations métier représentatives.',
    'Des résultats de validation avant d’élargir la migration.',
  ],
  [
    'Migrer et accompagner',
    'La reprise des données, la recette avec vos équipes et les conditions de bascule sont préparées ensemble. Une coexistence temporaire peut être étudiée.',
    'Un plan de déploiement, de retour arrière et de transmission.',
  ],
];
export const migrationFaq = [
  [
    'Faut-il obligatoirement réécrire toute l’application ?',
    'Non. Un audit peut conduire à conserver l’application, à moderniser certaines fonctions ou à reconstruire un périmètre plus large. Une réécriture complète n’est pertinente que si son intérêt est établi au regard des coûts, des risques et de la durée de vie attendue.',
  ],
  [
    'Peut-on conserver les données et les règles métier ?',
    'Leur préservation fait partie des objectifs de l’étude. Elle suppose de comprendre le modèle de données, les traitements, les historiques et les interfaces. Des contrôles de reprise et des scénarios de recette permettent de vérifier le résultat ; il ne s’agit pas d’une simple traduction de code.',
  ],
  [
    'Comment choisir les technologies cibles ?',
    'C#, JavaScript ou d’autres technologies : le choix dépend des usages, des postes ou navigateurs visés, des interfaces, des compétences de maintenance et des contraintes d’hébergement. Nous comparons ces critères avec vous avant de retenir une architecture ; un projet peut aussi combiner plusieurs technologies.',
  ],
  [
    'Une migration réduit-elle automatiquement les coûts ?',
    'Non. Les licences ne représentent qu’une partie du coût total. Il faut aussi considérer la réécriture, les tests, l’hébergement, les composants tiers, la maintenance, la formation et l’exploitation. Les conditions applicables à votre installation et à la solution cible doivent être examinées avant de conclure à une économie.',
  ],
  [
    'Pouvez-vous encore développer avec les outils PC SOFT ?',
    'Oui. Serial Coders est partenaire Gold PC SOFT et continue à développer et faire évoluer des applications WinDev, WebDev et WinDev Mobile. Cette connaissance de l’environnement d’origine complète notre expertise multitechnologie, notamment en C# et JavaScript, pour accompagner vos choix.',
  ],
  [
    'Peut-on migrer tout en continuant à utiliser l’application ?',
    'Une migration progressive avec coexistence peut être envisagée, selon les interfaces et la façon dont les données sont partagées. L’étude précise ce qui est réalisable, les synchronisations nécessaires et les éventuelles fenêtres d’interruption. Nous ne promettons pas une bascule sans interruption avant cette analyse.',
  ],
];

export const quoteFaq = [
  [
    'Combien coûte une migration d’application WinDev ?',
    'Il n’existe pas de tarif unique : le coût dépend des fonctions à conserver, du volume de code et de données, des interfaces externes, de la documentation disponible et des contraintes de continuité. Le budget doit aussi intégrer les tests métier, le déploiement et l’accompagnement des utilisateurs. Nous commençons par qualifier ces éléments ; un audit ou un pilote peut être proposé pour lever les inconnues avant un chiffrage détaillé. Pour préparer votre demande, indiquez les versions utilisées, les utilisateurs concernés et les objectifs du changement. <a href="/migration-applications-pcsoft/">Découvrir notre accompagnement migration</a>.',
  ],
  [
    'Faut-il conserver WinDev ou changer de technologie ?',
    'Conserver WinDev peut être pertinent si votre application répond aux usages, reste maintenable et s’intègre correctement à votre environnement. Un changement mérite d’être étudié lorsque vos besoins d’accès web, d’intégration ou d’exploitation évoluent, ou lorsque certaines dépendances deviennent trop contraignantes. Nous comparons maintien, modernisation ciblée et migration en tenant compte du coût global et des risques. C# et JavaScript sont des exemples de technologies possibles, pas des destinations imposées. <a href="/audit-application-windev/">Faire le point avec un audit</a> ou <a href="/modernisation-logiciel-metier/">étudier une modernisation</a>.',
  ],
  [
    'Peut-on migrer progressivement sans interrompre l’activité ?',
    'Une migration par modules peut permettre de conserver l’application actuelle pendant la construction de la nouvelle. Sa faisabilité dépend de la façon dont les fonctions et les données sont liées : il faut définir les responsabilités de chaque système, les échanges et les règles de synchronisation. Nous validons la démarche sur un périmètre pilote, préparons les sauvegardes, la recette et les conditions de retour arrière. Une fenêtre d’interruption peut rester nécessaire pour la bascule finale ; son besoin et sa durée se déterminent après essais. <a href="/migration-applications-pcsoft/">Comprendre les étapes d’une migration</a>.',
  ],
  [
    'Comment reprendre une application WinDev sans son développeur initial ?',
    'La première étape consiste à rassembler les sources, la version de WinDev, les composants tiers, la documentation et les éléments nécessaires à la compilation et au déploiement. Nous vérifions ensuite les droits permettant l’intervention et cherchons à reconstruire une version de référence dans un environnement de test. Les échanges avec les utilisateurs aident à retrouver les règles métier non documentées. Sans les sources ou certains composants, les possibilités de correction peuvent être limitées : nous explicitons ces limites avant de proposer un plan de reprise. Ne transmettez aucun mot de passe dans le formulaire de contact. <a href="/reprise-maintenance-windev/">Étudier une reprise et une maintenance</a>.',
  ],
  [
    'Comment préserver les données et les règles métier pendant une migration ?',
    'Nous commençons par inventorier les données, leurs relations et les traitements qui leur donnent un sens. Les règles métier sont documentées avec vos équipes, puis traduites en scénarios de recette. La reprise est répétée sur un environnement de test avec des contrôles de volumes, de cohérence, de totaux et de résultats métier ; copier les tables ne suffit pas. Les écarts doivent être analysés avant validation. Le plan de bascule prévoit les sauvegardes, le traitement des modifications récentes et les conditions d’un retour arrière. <a href="/migration-hfsql-postgresql/">Découvrir la démarche de migration des données HFSQL vers PostgreSQL</a>.',
  ],
];
