# Réorganisation du code — 17 septembre 2026

La refonte répond aux six constats de `AUDIT-CODE-2026-09-17.md`. La suppression des pages locales, confirmée pendant le travail, est conservée : 14 pages principales sont générées.

## Changements

- Sources séparées : contenus dans `src/content`, pages dans `src/pages`, composants et cadre HTML dans `src/templates`, navigateur dans `src/client`, styles dans `src/styles`, ressources dans `public`, API dans `server`.
- Modèles HTML formatés sur plusieurs lignes. Les sections de prestations et les illustrations de migration sont composées explicitement ; les recherches/remplacements de structure HTML ont été supprimés du build.
- Compilation autonome en dossier temporaire : copie des ressources, génération, manifeste puis remplacement de la sortie. Restauration de l'ancienne sortie si son remplacement échoue ; refus d'écraser un dossier existant non reconnu. Les pages supprimées ne persistent plus.
- API répartie entre validation, MIME, transport, limitation et HTTP ; expiration des compteurs sans parcours complet de la table à chaque requête. Contrôle du type JSON et gestion des corps dépassant 15 Mio avec mémoire bornée.
- Formulaire protégé contre la perte de modifications pendant une requête. Les données sont conservées lors d'un échec.
- Styles formatés ; suppression de 53 déclarations devenues inopérantes. Deux anciens visuels sont conservés dans `archive/design` et exclus de la livraison, soit 3 642 775 octets de ressources inutilisées retirés du dossier public.
- Vérification de livraison basée sur le manifeste complet, plus une liste manuelle de ressources.
- Livraison contenant pages et API, validation préalable, bascule atomique du lien et retour arrière en cas d'échec d'activation. Configuration d'infrastructure séparée du déploiement courant.
- ESLint, Prettier, dépendances de développement verrouillées, règles de fin de ligne et CI. Le site et l'API n'ont toujours aucune dépendance npm à l'exécution.

## Validation

Les vérifications comprennent compilation isolée, intégrité des ressources, suppression des anciennes routes, conservation de la sortie en cas de configuration invalide, consentement, protocole HTTP, limites et pièces jointes, détection d'un `contact.js` distant obsolète, ainsi que tests navigateur du menu, du consentement et du formulaire.

La comparaison dans Edge des propriétés CSS calculées sur chaque élément de quatre pages (accueil, contact, migration, WinDev), aux largeurs 390, 768 et 1 440 pixels, n'a montré aucun écart après nettoyage CSS et mise en forme des modèles HTML. Les captures de contrôle sont locales dans `artifacts/visual/` et ne sont pas versionnées.

Les tests de déploiement simulent les opérations système : aucun serveur distant ni email réel n'a été utilisé. La CI est ajoutée mais son exécution sur GitHub n'est pas attestée par ces contrôles locaux. La migration initiale de structure sur Lightsail reste à effectuer selon `deploy/README.md`.
