// Each service answers a distinct buying decision. Migration keeps its existing URL.
const services = [
  {
    path:'/audit-application-windev/', label:'Audit d’une application WinDev',
    title:'Audit WinDev : code, risques et feuille de route | Serial Coders',
    description:'Évaluez votre application WinDev avant une reprise ou une migration : analyse du code, des données, des dépendances et plan d’action priorisé.',
    heading:'Comprendre votre application WinDev.<br><em>Décider sur des bases claires.</em>',
    intro:'Votre logiciel est devenu difficile à faire évoluer, son développeur est parti ou vous envisagez une migration ? Notre audit vous aide à identifier les risques et à choisir entre maintien, modernisation et changement de technologie.',
    needs:['Vous ne connaissez plus les dépendances ni les conditions de compilation de votre application.','Les anomalies ou lenteurs s’accumulent, sans diagnostic partagé.','Vous devez arbitrer un investissement et souhaitez une vision du périmètre avant de vous engager.'],
    steps:[['Cadrer la décision','Nous identifions les utilisateurs, les fonctions critiques et les questions auxquelles l’audit doit répondre.'],['Examiner un périmètre convenu','Nous étudions les sources accessibles, la structure des données, les interfaces et les conditions d’exploitation. Les lenteurs font l’objet de mesures sur des scénarios représentatifs.'],['Restituer et prioriser','Nous rapprochons les constats techniques des risques métier pour comparer les actions possibles et leurs dépendances.']],
    deliverables:['Une cartographie des composants et des dépendances examinés.','Un relevé des risques et des constats, avec leurs limites de vérification.','Un plan d’action priorisé et les hypothèses d’une éventuelle reprise ou migration.'],
    scope:'Le périmètre de l’audit est défini avant intervention. Il ne constitue ni une certification de sécurité ni une garantie d’absence de défaut ; les correctifs et développements éventuels font l’objet d’un périmètre distinct.',
    cost:'Le volume et l’organisation du code, le nombre d’applications et d’interfaces, l’accès à un environnement de test et la profondeur des investigations déterminent la charge. Un audit ciblé peut précéder une analyse plus large.',
    prepare:'Indiquez la version de WinDev, les difficultés observées, les fonctions critiques et les sources disponibles. Préparez la documentation et un environnement de test ; ne transmettez pas de mots de passe via le formulaire.',
    faq:[['Peut-on auditer sans le code source ?','Une analyse des usages, des données et de l’exploitation reste envisageable. Elle ne permet pas de conclure sur les traitements internes non accessibles ; ces limites seront explicitées.'],['L’audit impose-t-il une migration ?','Non. Il peut recommander des correctifs ciblés, une meilleure documentation ou le maintien de l’application lorsque cela répond au besoin.']],
    cta:'Préparer mon audit WinDev'
  },
  {
    path:'/reprise-maintenance-windev/', label:'Reprise et maintenance WinDev',
    title:'Reprise et maintenance d’application WinDev | Serial Coders',
    description:'Reprenez la maîtrise de votre logiciel WinDev : analyse de l’existant, correction d’anomalies, maintenance évolutive et transmission technique.',
    heading:'Votre application WinDev continue.<br><em>Sa maintenance aussi.</em>',
    intro:'Votre prestataire n’est plus disponible ou votre logiciel dépend d’une seule personne ? Serial Coders étudie la reprise de votre application pour organiser sa maintenance et faire évoluer les fonctions utiles à vos équipes.',
    needs:['Le développeur historique a quitté l’entreprise ou ne peut plus intervenir.','Des incidents perturbent les utilisateurs et les demandes d’évolution restent en attente.','Vous souhaitez documenter le logiciel et sécuriser les prochaines livraisons.'],
    steps:[['Vérifier la reprise','Nous examinons les sources, les droits d’utilisation, les composants et la possibilité de reconstruire une version de référence.'],['Organiser les interventions','Nous qualifions les anomalies, distinguons corrections et évolutions, puis convenons des priorités et du circuit de validation.'],['Livrer et transmettre','Les modifications sont testées sur des scénarios convenus. Nous documentons les changements et préparons le déploiement ainsi que le retour arrière lorsque nécessaire.']],
    deliverables:['Un état des lieux de reprise et les prérequis manquants.','Un suivi priorisé des anomalies et des demandes d’évolution.','Les modifications prévues au périmètre, leur compte rendu de validation et la documentation de livraison.'],
    scope:'Les horaires de support, délais de réponse, modalités d’accès et responsabilités sont définis dans la proposition. Une reprise ne signifie pas une astreinte permanente ni une résolution immédiate de toute anomalie.',
    cost:'L’état du code et de la documentation, la reproductibilité des incidents, les versions utilisées et la criticité de l’exploitation influencent l’effort. Les engagements de support et le volume d’évolutions sont cadrés séparément.',
    prepare:'Précisez les versions utilisées, les sources et sauvegardes disponibles, les anomalies prioritaires et votre organisation actuelle. Identifiez une personne capable de valider les parcours métier.',
    faq:[['Pouvez-vous reprendre le travail d’un autre prestataire ?','Oui, après étude des éléments disponibles et des droits permettant l’intervention. La faisabilité dépend notamment des sources et des composants nécessaires.'],['Faut-il changer de version de WinDev ?','Pas systématiquement. La compatibilité des composants et de l’environnement est examinée avant de proposer une montée de version.']],
    cta:'Étudier la reprise de mon application'
  },
  {
    path:'/migration-applications-pcsoft/', label:'Migration WinDev vers d’autres technologies',
    summary:'Préserver les règles métier et choisir une nouvelle architecture, notamment en C# ou JavaScript.'
  },
  {
    path:'/migration-hfsql-postgresql/', label:'Migration HFSQL vers PostgreSQL',
    title:'Migration HFSQL vers PostgreSQL | Serial Coders',
    description:'Préparez la migration de vos données HFSQL vers PostgreSQL : correspondances, adaptation des accès applicatifs, contrôles de reprise et bascule.',
    heading:'De HFSQL à PostgreSQL.<br><em>Vos données, avec méthode.</em>',
    intro:'Vous souhaitez faire évoluer le moteur de données de votre application ? Nous étudions la migration de HFSQL vers PostgreSQL en tenant compte des traitements existants, de la qualité des données et des contraintes d’exploitation.',
    needs:['Vous envisagez PostgreSQL pour une nouvelle architecture ou pour faciliter les échanges entre applications.','Vous souhaitez dissocier l’évolution de la base de données de celle des interfaces utilisateur.','Vous avez besoin d’un plan de reprise vérifiable avant de basculer les données de production.'],
    steps:[['Cartographier les données et leurs usages','Nous recensons tables, relations, volumes, traitements et accès applicatifs. Les types, encodages et règles métier doivent être rapprochés de la cible.'],['Préparer et tester la reprise','Nous définissons les correspondances, préparons les scripts de transfert et adaptons les accès sur un environnement de test. Les requêtes et transactions critiques font partie du périmètre de validation.'],['Contrôler et préparer la bascule','Nous comparons les volumes et les résultats métier, puis définissons les sauvegardes, la fenêtre de transfert et les conditions d’un retour arrière.']],
    deliverables:['Un document de correspondance des données et une liste des adaptations applicatives.','Les scripts de reprise et les contrôles convenus sur le périmètre retenu.','Un bilan de répétition de migration et une procédure de bascule avec responsabilités identifiées.'],
    scope:'Remplacer HFSQL ne se résume pas à copier des tables. La compatibilité des modes d’accès, les connecteurs et leurs conditions de licence sont vérifiés pour vos versions. Une économie ou un gain de performance ne sont pas présumés.',
    cost:'Les volumes, la qualité des données, les dépendances aux fonctions du moteur et la durée d’interruption acceptable déterminent le travail. L’hébergement, les sauvegardes et l’exploitation de PostgreSQL doivent aussi être prévus.',
    prepare:'Précisez le mode HFSQL utilisé, les versions, les volumes approximatifs, les applications connectées et vos contraintes de disponibilité. Un échantillon anonymisé pourra être convenu dans un cadre d’échange adapté.',
    faq:[['Peut-on conserver l’application WinDev ?','C’est une option à étudier. Il faut vérifier les accès aux données et adapter les traitements dépendants de HFSQL ; conserver les écrans ne supprime pas ce travail.'],['La migration peut-elle se faire sans interruption ?','Cela dépend des volumes et des mécanismes de synchronisation envisageables. La durée et les conditions de bascule sont établies après essais, sans promesse de continuité absolue.']],
    cta:'Étudier ma migration de données'
  },
  {
    path:'/modernisation-logiciel-metier/', label:'Modernisation d’un logiciel métier',
    title:'Modernisation de logiciel métier et WinDev | Serial Coders',
    description:'Faites évoluer votre logiciel métier sans imposer une réécriture complète : parcours utilisateurs, performances, architecture et modernisation progressive.',
    heading:'Faire évoluer votre logiciel.<br><em>Conserver ce qui fonctionne.</em>',
    intro:'Votre application répond encore au métier, mais ses limites deviennent gênantes ? Nous définissons une modernisation progressive autour des usages à améliorer, qu’il s’agisse de WinDev, WebDev ou d’une architecture associant plusieurs technologies.',
    needs:['Les écrans multiplient les manipulations ou ne correspondent plus aux usages.','Certains traitements sont trop lents ou difficiles à faire évoluer.','Vous souhaitez ouvrir un accès web ou repenser un module sans remplacer immédiatement tout le logiciel.'],
    steps:[['Observer les usages','Nous identifions les parcours prioritaires avec les utilisateurs, les difficultés mesurables et les contraintes à préserver.'],['Choisir un premier périmètre','Nous comparons amélioration de l’existant, refonte d’un module et évolution d’architecture. Un prototype ou un pilote peut aider à valider le choix.'],['Avancer par livraisons','Chaque étape comporte des critères de recette. Nous préparons la coexistence des fonctions, l’accompagnement des utilisateurs et les étapes suivantes.']],
    deliverables:['Une feuille de route organisée par bénéfice attendu et dépendance technique.','Les parcours ou prototypes prévus au cadrage et les critères d’acceptation.','Les modules convenus, les résultats de validation et les consignes de déploiement.'],
    scope:'Une modernisation peut rester dans l’écosystème PC SOFT ou intégrer d’autres technologies, notamment C# et JavaScript. Une refonte visuelle seule ne corrige pas les problèmes d’architecture ou de qualité des données.',
    cost:'Le nombre de parcours, les dépendances entre modules, les objectifs de performance et la coexistence avec l’existant conditionnent le budget. Les priorités sont arbitrées pour éviter une refonte plus large que le besoin.',
    prepare:'Décrivez trois difficultés concrètes, les utilisateurs concernés et les résultats attendus. Des captures sans données confidentielles et des exemples de parcours faciliteront le premier échange.',
    faq:[['Modernisation et migration désignent-elles la même chose ?','Non. La modernisation améliore le logiciel et peut conserver sa technologie. La migration change tout ou partie de son socle technique ; elle peut être une étape de modernisation.'],['Comment mesurer le résultat ?','Nous définissons des critères adaptés au projet : temps d’un parcours, durée d’un traitement, erreurs de saisie ou adoption d’une fonction. Les objectifs sont confrontés à une situation de départ.']],
    cta:'Préparer la modernisation de mon logiciel'
  },
  {
    path:'/integration-api-windev/', label:'Connexion WinDev à des API',
    title:'Intégration API WinDev : connecter vos applications | Serial Coders',
    description:'Connectez votre application WinDev à vos outils : étude des API, échanges de données, authentification, gestion des erreurs et suivi des synchronisations.',
    heading:'Votre application WinDev.<br><em>Connectée à vos autres outils.</em>',
    intro:'Les ressaisies et les exports manuels ralentissent vos équipes ? Nous étudions les connexions entre votre application WinDev et vos autres logiciels, via leurs API ou des interfaces à concevoir selon les possibilités de chaque système.',
    needs:['Vous devez échanger des données avec un CRM, un ERP, un site marchand ou un service externe.','Les mêmes informations sont saisies dans plusieurs outils et deviennent incohérentes.','Vous souhaitez exposer certaines fonctions métier à une autre application avec des accès maîtrisés.'],
    steps:[['Définir les échanges','Nous identifions les données, le système de référence, le sens des flux et la fréquence attendue. La documentation, les droits et les limites des API sont examinés.'],['Construire une intégration contrôlée','Nous préparons les correspondances et l’authentification, puis traitons les erreurs, les doublons et les reprises. Les règles d’accès sont limitées aux besoins de l’échange.'],['Tester et organiser le suivi','La validation couvre les cas métier, les indisponibilités et les limites de débit connues. Nous définissons les traces utiles et le traitement des échanges en échec.']],
    deliverables:['Une description des flux, des correspondances et des responsabilités entre systèmes.','Les connecteurs ou points d’accès prévus au périmètre et leur configuration documentée.','Les scénarios de test et les procédures de surveillance et de reprise des erreurs.'],
    scope:'La connexion dépend des API réellement disponibles, de leurs droits d’accès et des conditions du fournisseur. Un abonnement, une adaptation de version ou une autre méthode d’échange peuvent être nécessaires. Les identifiants ne doivent pas être intégrés au code source.',
    cost:'Le nombre de flux, les volumes, la fréquence, les règles de transformation et la qualité des API influencent la charge. Les contraintes de disponibilité et les évolutions futures des services externes sont à intégrer au cadrage.',
    prepare:'Nommez les outils à connecter, les données concernées et le sens des échanges. Partagez les liens vers leurs documentations publiques, sans communiquer de clés API ni de secrets dans le formulaire.',
    faq:[['Peut-on synchroniser dans les deux sens ?','Oui si les interfaces et les règles métier le permettent. Il faut définir la source de vérité et le traitement des modifications simultanées pour éviter les conflits.'],['Que se passe-t-il si le service distant est indisponible ?','Le comportement est défini selon le flux : attente, nouvelle tentative contrôlée ou signalement à un opérateur. Les mécanismes de reprise doivent éviter de créer des doublons.']],
    cta:'Étudier la connexion de mes outils'
  }
];

const link = service => `<a class="text-link" href="${service.path}">${service.label} ↗</a>`;
export const buyerServiceDirectory = `<div class="buyer-services"><h3>Un besoin précis ?</h3><p>Explorez l’accompagnement adapté à votre situation.</p><div class="offer-grid">${services.map(service=>`<article><h4>${service.label}</h4><p>${service.summary || service.description}</p>${link(service)}</article>`).join('')}</div></div>`;
const list = entries => `<ul class="needs">${entries.map(entry=>`<li>${entry}</li>`).join('')}</ul>`;
const action = label => `<a class="button" href="/contact/">${label} <span aria-hidden="true">↗</span></a>`;

export const buyerServicePages = services.filter(service=>service.heading).map(service=>({
  path:service.path, title:service.title, description:service.description,
  body:`<section class="detail-hero"><a class="back" href="/#domaines">← Votre projet</a><span class="eyebrow">${service.label}</span><h1>${service.heading}</h1><p class="lead">${service.intro}</p>${action(service.cta)}</section>
  <section class="section detail-grid"><div><span class="eyebrow">VOTRE SITUATION</span><h2>Quand faire appel à nous ?</h2></div>${list(service.needs)}</section>
  <section class="section"><span class="eyebrow">NOTRE DÉMARCHE</span><h2>Du cadrage à la validation</h2><div class="offer-grid">${service.steps.map(([title,text],index)=>`<article><span class="number">0${index+1}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>
  <section class="section detail-grid"><div><span class="eyebrow">LES LIVRABLES</span><h2>Ce que prévoit l’accompagnement</h2><p>Le contenu et le niveau de détail sont précisés dans la proposition, selon le périmètre retenu.</p></div>${list(service.deliverables)}</section>
  <section class="section company"><div><h2>Un périmètre explicite.<br>Un budget construit.</h2></div><div><h3>Ce qui doit être cadré</h3><p>${service.scope}</p><h3>Ce qui détermine le coût et le délai</h3><p>${service.cost}</p><p>Le chiffrage suit la qualification du besoin. Si des inconnues importantes subsistent, une phase d’étude peut être proposée avant les travaux.</p></div></section>
  <section class="section"><h2>Vos questions avant de commencer</h2><div class="faq-list">${service.faq.map(([question,answer])=>`<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}</div></section>
  <section class="section company"><div><h2>Préparer notre premier échange</h2></div><div><p class="large">${service.prepare}</p>${action(service.cta)}</div></section>
  <section class="section"><h2>Selon la suite de votre projet</h2><ul class="needs">${services.filter(other=>other.path!==service.path).map(other=>`<li>${link(other)}</li>`).join('')}</ul></section>`
}));

/** Keep the established migration page and add buying details rather than a competing URL. */
export function enrichMigrationOffer(page) {
  if (page.path !== '/migration-applications-pcsoft/') return page;
  const section = `<section class="section detail-grid"><div><span class="eyebrow">LES LIVRABLES</span><h2>Une trajectoire documentée</h2><p>Les livrables sont précisés dans la proposition selon les phases retenues.</p></div>${list(['Une cartographie des fonctions, des données et des dépendances de l’application WinDev.','Une comparaison des architectures cibles, notamment C# ou JavaScript, et un découpage des étapes.','Les composants et scripts de reprise convenus, accompagnés des résultats de recette.','Les procédures de bascule, de retour arrière et les éléments de transmission aux équipes.'])}</section><section class="section company"><div><h2>Quel budget pour votre migration WinDev ?</h2></div><div><p class="large">Le coût dépend du patrimoine à reprendre et des contraintes de continuité.</p><p>Les fonctions réellement conservées, la documentation des règles métier, les composants tiers, la qualité des données et les interfaces influencent la charge. La coexistence entre ancienne et nouvelle application ainsi que la recette avec vos utilisateurs doivent être intégrées au calendrier.</p><p>Nous qualifions ces points avant le chiffrage ; une étude ou un pilote peut être nécessaire pour lever les inconnues. Aucune conversion automatique intégrale, économie garantie ou absence d’interruption n’est promise.</p><h3>Pour préparer l’échange</h3><p>Indiquez vos versions WinDev, les sources disponibles, le nombre d’utilisateurs, les interfaces externes et les raisons du changement. Décrivez les périodes pendant lesquelles l’application ne peut pas être interrompue.</p>${action('Étudier ma migration WinDev')}</div></section><section class="section"><h2>Avant ou pendant votre migration</h2><ul class="needs">${services.filter(service=>service.path!==page.path).map(service=>`<li>${link(service)}</li>`).join('')}</ul></section>`;
  return {...page,body:page.body + section};
}
