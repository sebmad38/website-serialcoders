# Audit du code — 17 septembre 2026

## Verdict

Le choix d'un site statique généré avec une petite API Node.js convient au besoin. Le découpage interne et la chaîne de livraison doivent toutefois être consolidés : ils ne sont pas optimaux pour maintenir et faire évoluer le site. Une migration vers un framework ou des microservices n'est pas justifiée par les problèmes observés.

Audit du dépôt au commit `cd50769a`, initialement sans modification locale. Examen des générateurs, JavaScript navigateur, CSS, API, tests et scripts de déploiement. Aucun changement du code applicatif ni action sur le serveur distant.

## Vérifications exécutées

- `npm test`, sous Node.js v24.15.0 : **16 tests réussis, aucun échec**, environ 22 secondes. Le test de production construit et vérifie les 2 402 pages dans un dossier temporaire.
- Compilation isolée supplémentaire à partir des scripts, de la configuration et d'un référentiel réduit à une commune : compilation réussie, mais les fichiers `contact.js`, `site.js`, `style.css` et `fonts/fonts.css` sont absents du résultat.
- Ajout d'une page témoin obsolète dans cette sortie temporaire, puis recompilation : la page subsiste. Le dossier temporaire a été supprimé après vérification.
- Inspection des tests : les contrôles HTML courants lisent le `dist/` existant ; le test de compilation isolée vérifie l'indexation, sans contrôler les ressources de la sortie.

Ces résultats ne constituent pas une recette navigateur, un test de délivrabilité SMTP ou une validation de la configuration réellement déployée.

## Constats prioritaires

### 1. P1 — Activation de la version avant validation du déploiement

**Référence :** `deploy/install-release.sh:12`, puis lignes 13–28.

Le lien `current` est remplacé avant l'installation de l'API, la validation `nginx -t` et les redémarrages. Si une de ces étapes échoue, `set -e` arrête le script mais ne rétablit pas la version précédente. Le site peut donc déjà servir les nouveaux fichiers avec une API ancienne ou indisponible. La configuration Nginx sur disque peut également rester remplacée après une validation échouée.

**Correction :** préparer et vérifier la version avant activation ; conserver les versions précédentes des éléments remplacés ; basculer le lien de manière atomique ; vérifier la santé des services et rétablir l'ensemble en cas d'échec. Séparer la livraison des pages des modifications de configuration d'infrastructure.

### 2. P2 — Sources et artefacts générés mélangés dans `dist/`

**Référence :** `scripts/build.mjs:32`, `scripts/build.mjs:52`, `README.md`, fichiers suivis dans `dist/`.

Les CSS, JavaScript, images et polices sont des sources conservées dans le même dossier que les pages générées. Le build ne les copie pas depuis un répertoire source et ne retire pas les anciennes pages. Un nettoyage classique de `dist/` détruirait donc des sources ; une reconstruction dans un dossier vide annonce un succès avec des ressources manquantes. Une route retirée du générateur reste servable dans une compilation incrémentale.

Les deux comportements ont été reproduits dans un dossier temporaire. Les tests actuels peuvent détecter un surplus de pages après compilation, mais le build seul n'assure pas une sortie propre.

**Correction :** déplacer les sources dans `src/` et les ressources statiques dans `public/`, produire un `dist/` entièrement jetable, copier les ressources et générer les pages dans une sortie temporaire complète avant remplacement. Arrêter de versionner les HTML générés une fois le processus de livraison adapté.

### 3. P2 — Le contrôle distant oublie le JavaScript du formulaire

**Référence :** `scripts/check-deployment.mjs:20` et `scripts/build.mjs:30`.

La liste des ressources vérifiées est codée manuellement. Elle inclut `site.js` mais omet `/contact.js`, chargé par la page de contact. Le contrôle peut donc annoncer une version conforme alors que le formulaire charge un script absent ou ancien. Le script Python de vérification locale parcourt tous les fichiers, mais cela ne corrige pas l'angle mort du contrôle public.

**Correction :** construire un manifeste des fichiers livrés avec leurs empreintes, ou parcourir la sortie de compilation pour vérifier chaque ressource. Ajouter un cas de test où seul `contact.js` diffère et exiger un échec.

### 4. P2 — Construction des pages dépendante de remplacements de chaînes HTML

**Référence :** `scripts/build.mjs:37–54`, `scripts/editorial.mjs:136–146`, `scripts/buyer-services.mjs`.

Le build porte simultanément la configuration, le contenu de plusieurs pages, le cadre HTML, les métadonnées, les variantes de thème et l'écriture des fichiers. Certaines sections sont ensuite injectées par recherche de chaînes exactes comme `<section class="contact-band">`, ou en remplaçant le premier `</section>`.

Un changement de classe ou de structure peut supprimer silencieusement un enrichissement ou déplacer une illustration, sans erreur de compilation. Les modèles contiennent en outre de très longues lignes qui compliquent les différences Git et les revues.

**Correction :** rendre directement des composants de page à partir de données structurées et de paramètres de thème. Extraire le cadre commun, les composants partagés, les contenus et les métadonnées. Garder un script de build court qui orchestre ces modules. Aucun framework n'est nécessaire pour cela.

### 5. P2 — Les tests ne valident pas une livraison complète issue des sources

**Référence :** `tests/production.test.mjs:12–35`, `tests/site.test.mjs:11`, `tests/site.test.mjs:56`, `package.json:1`.

`npm test` n'exécute pas de compilation préalable pour les contrôles de liens et de métadonnées : ceux-ci peuvent tester les anciens HTML versionnés après une modification des générateurs. Le test isolé de production ne vérifie que robots et indexation. Les tests du consentement utilisent un DOM simulé qui ignore volontairement la navigation. Aucun test existant n'exécute `contact.js`.

**Correction :** construire une seule sortie complète isolée et faire porter les contrôles dessus. Ajouter quelques parcours navigateur ciblés : menu mobile, consentement, sélection/retrait de documents, succès et échec d'envoi avec conservation du texte. Ajouter à l'API les cas HTTP manquants, notamment corps trop volumineux, méthode et format refusés. Une CI doit exécuter cette chaîne sur chaque modification ; aucune configuration de CI n'a été trouvée dans le dépôt.

### 6. P3 — La feuille de thème accumule des corrections successives

**Référence :** `dist/proposal-b.css:6`, `:131`, `:163`, `:168`, `:182`, `:199`.

Le même en-tête et la même marque sont redéfinis dans plusieurs blocs successifs. Certaines règles sont annulées plus loin, par exemple le texte du pseudo-élément `.brand:after`. Le résultat dépend de l'ordre des correctifs, ce qui rend une modification responsive difficile à localiser et à vérifier.

**Correction :** regrouper les règles par composant et les variantes par breakpoint ; enlever les déclarations devenues inutiles après comparaison visuelle. Conserver les deux thèmes uniquement si leur maintenance reste un besoin réel. Mettre en place un formatage automatique et un lint minimal : aucun outil de ce type n'est configuré dans le dépôt.

## Pratiques correctement appliquées

- Génération statique adaptée, sans dépendances applicatives externes inutiles ; dépôt Git et historique de commits présents.
- Validation serveur des champs et documents, limites de taille et de fréquence, contrôle d'origine, API liée à l'interface locale et en-tête IP remplacé par Nginx.
- Transport mail injectable pour les tests ; pas d'envoi réel dans la suite ; appel du relais avec arguments séparés, sans shell.
- Secrets SMTP demandés séparément et stockés hors racine publique avec permissions restrictives dans les scripts examinés.
- Échappement des métadonnées et données territoriales ; validation des codes et détection de doublons.
- Consentement Analytics testé, JavaScript navigateur partiellement isolé par fonctions, commentaires expliquant plusieurs décisions et README substantiel.

L'API fait environ cent lignes : son regroupement actuel n'est pas, à lui seul, un défaut majeur. Extraire validation, composition MIME et transport sera utile si elle évolue ; cela passe après les problèmes de livraison et de génération. Les signatures de documents restent des contrôles élémentaires, comme l'indique déjà le README ; aucun antivirus n'a été validé par cet audit.

## Découpage cible proportionné

```text
src/
  content/             # Textes et données des prestations
  pages/               # Accueil, contact, services, pages locales
  templates/           # Cadre HTML et composants partagés
  lib/                 # Configuration, échappement, métadonnées
  client/              # Formulaire, consentement, navigation
  styles/              # Base, composants et thèmes
server/
  contact/             # Handler, validation et transport si nécessaire
public/                # Images, polices et licences
scripts/               # Build, référentiel et vérification de livraison
data/
tests/
deploy/
dist/                  # Sortie reconstruisible et non éditée
```

Priorité : sécuriser l'activation des versions, rendre le build autonome et complet, puis faire tester cette sortie. Ensuite remplacer les transformations HTML et consolider les styles. Préserver les URL, les contenus et le rendu pendant cette réorganisation, avec comparaison des sorties et recette navigateur.
