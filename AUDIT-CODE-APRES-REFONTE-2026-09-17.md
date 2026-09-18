# Contrôle après refonte — 17 septembre 2026

## Verdict

Le découpage est désormais cohérent et proportionné à ce site de 14 pages. Les principales responsabilités sont séparées, le code est lisible et la compilation est reconstruisible. Il n'y a pas de raison démontrée de remplacer cette architecture par un framework ou de multiplier davantage les couches.

En revanche, les bonnes pratiques ne sont pas entièrement couvertes : deux problèmes fonctionnels restent à corriger et la validation de livraison peut être renforcée. Le passage des tests ne suffit pas à déclarer l'ensemble optimal.

Contrôle effectué sur l'état de travail de la branche `codex/source-optimization`, avec la refonte préparée dans l'index Git. Les modifications non commitées ont bien été examinées. Aucun code applicatif n'a été corrigé pendant cet audit et aucune action n'a été exécutée sur Lightsail.

## Vérifications réalisées

- `npm run check` : ESLint et Prettier réussis, **20 tests Node.js réussis**.
- Tests Python de déploiement : **4 tests réussis**, avec simulation des commandes système.
- `npm run test:browser` : **4 tests Edge réussis** sur le thème configuré, couvrant menu mobile, consentement et formulaire.
- Compilation temporaire du thème `modern`, puis inspection réelle du menu dans Edge à 390 pixels : défaut reproduit ci-dessous.
- Deux requêtes HTTP concurrentes avec chacune un document TXT valide de 10 Mio : réponses 200 avec un transport factice composant les emails MIME, sans envoi réel. Mémoire RSS observée du processus API : environ 193 Mio puis 233 Mio.
- Extraction temporaire de l'archive et modification du handler serveur pour refuser les envois : `verify_release` et `node --check` acceptent encore cette version, car le manifeste porte uniquement sur le site et le second contrôle vérifie la syntaxe.

Les dossiers temporaires des reproductions ont été supprimés. Les tests ne valident ni la configuration Nginx réellement chargée en production, ni Postfix, ni la réception des emails, ni l'exécution de la CI sur GitHub.

## Problèmes à corriger

### P2 — Le comportement du menu commun dépend du thème clair

**Références :** `src/styles/proposal-b.css:1554`, `src/client/navigation.js:19`, `src/templates/document.mjs:6`.

La configuration autorise les thèmes `editorial` et `modern`. Le JavaScript active le même menu dans les deux cas, mais les règles `.menu-enhanced`, `.menu-open` et `.menu-toggle` n'existent que dans `proposal-b.css`.

**Reproduction :** avec `design: modern` et une largeur de 390 pixels, le menu a `aria-expanded="false"` tout en restant visible (`display: flex`, hauteur d'environ 502 pixels). Après clic, `aria-expanded` devient `true`, sans changement de visibilité ni de hauteur. Le bouton ne commande donc pas réellement la navigation dans ce thème.

**Correction :** déplacer les règles de comportement et d'accessibilité du menu vers la feuille commune, conserver les couleurs et la présentation propres à chaque thème, puis exécuter le parcours navigateur sur les deux thèmes. Autre choix possible si le thème sombre est abandonné : le retirer explicitement de la configuration et de la documentation.

### P2 — Les ressources peuvent rester anciennes après une livraison

**Références :** `deploy/nginx.conf:38–42`, `src/templates/layout.mjs:73`, `src/pages/contact.mjs:122`.

Le modèle Nginx applique `expires 1h` aux CSS et JavaScript. Les pages chargent toujours `/site.js`, `/contact.js` et les mêmes noms de feuilles de style. Aucune empreinte de version n'est ajoutée à leurs URL.

**Conséquence :** si ce modèle est utilisé, un visiteur ayant déjà ces ressources en cache peut recevoir les nouvelles pages avec l'ancien code navigateur pendant la durée de fraîcheur restante. Une évolution du formulaire ou du menu peut alors échouer malgré une livraison dont les fichiers sont corrects côté serveur. Le manifeste de livraison ne purge pas le cache des visiteurs.

**Correction :** produire des noms ou URL de ressources contenant une empreinte du contenu et les injecter dans les modèles. À défaut, demander la revalidation des CSS/JS avec `Cache-Control: no-cache`. Tester une navigation avec cache déjà rempli entre deux versions. L'application effective de ce modèle sur le serveur distant reste à vérifier.

## Découpage et bonnes pratiques

| Domaine | Évaluation |
| --- | --- |
| `src/content`, `src/pages`, `src/templates` | Séparation adaptée. Les enrichissements HTML sont composés explicitement. Quelques textes restent dans les pages, ce qui est acceptable à cette taille. |
| `src/lib/build.mjs` | Orchestration identifiable, validation préalable, sortie temporaire, restauration et contrôle du dossier remplacé. |
| `server/contact` | Validation, composition MIME, transport, quota et HTTP séparés. Injection du transport adaptée aux tests. |
| `src/client` | Consentement, navigation et formulaire isolés. Les valeurs du formulaire sont protégées pendant l'envoi. |
| Styles | Lisibles et nettoyés, mais le comportement du menu est encore placé dans un thème. |
| Qualité | Lint, formatage, dépendances verrouillées, tests et CI présents. La couverture doit inclure les variantes de configuration et la transition entre versions. |
| Sécurité des entrées | Contrôles serveur de taille, encodage, noms et signatures ; contrôle d'origine et limitation des tentatives. Les signatures ne constituent pas un antivirus, comme le précise déjà la documentation. |

## Points à renforcer sans nouvelle refonte

**Intégrité du serveur livré.** `deploy/release.py:47` vérifie le manifeste de `site/`, puis ne contrôle que la présence de l'entrée API et la syntaxe des modules. Le cas modifié dans le dossier temporaire passe ces contrôles. Cela ne démontre pas une compromission ; cela montre leur périmètre. Ajouter un manifeste de livraison couvrant aussi `server/` et un test de démarrage/import de l'API avant activation. La comparaison manuelle de l'empreinte de l'archive documentée protège le transfert si elle est effectivement réalisée.

**Mémoire avec pièces jointes.** Les deux requêtes maximales ont fonctionné, mais les 233 Mio de RSS observés sont proches des 256 Mio de `MemoryMax` dans `deploy/contact.service:15`. Le test tournait sous Windows avec composition MIME et transport factice ; ce n'est pas une mesure du groupe de processus systemd Linux avec sendmail. Mesurer ce dernier cas avant de valider la marge. Selon le résultat, réduire les copies base64/MIME, utiliser un encodage en flux ou ajuster explicitement les limites.

**Contrat du formulaire.** Le nombre de documents, leurs extensions et leurs tailles maximales sont répétés dans `src/client/contact.js`, `server/contact/validation.mjs` et le HTML. Ils sont actuellement cohérents, mais une modification peut les désynchroniser. Centraliser une description commune ou ajouter un test de cohérence serait suffisant ; aucune couche métier supplémentaire n'est nécessaire.

Priorité recommandée : corriger le menu sur les deux thèmes et la stratégie de cache, puis renforcer l'intégrité de l'archive et vérifier la mémoire sur la cible. Conserver le découpage général actuel.
