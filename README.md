# Serial Coders — refonte

Site statique français destiné à générer des demandes de développement sur mesure et de migration. Double expertise : WinDev, WebDev et WinDev Mobile d’une part, C# et JavaScript d’autre part. Cible : tous secteurs, France entière et projets internationaux. Le partenariat Gold PC SOFT est confirmé par l’utilisateur. Le formulaire utilise une petite API Node.js sans dépendance npm, avec un relais mail local. Les pages sont rendues en HTML pour rester accessibles aux moteurs et fonctionner sans JavaScript.

## Référencement

Les 2 388 pages géographiques automatiques ont été retirées à la demande de l’utilisateur. Le site conserve 14 pages principales, leurs métadonnées, leurs URL canoniques et leur présence dans le sitemap. Voir [SEO-LOCAL.md](SEO-LOCAL.md) pour les consignes de retrait au déploiement.

## Prestations et questions avant devis

Les six besoins sont accessibles depuis « Votre projet » sur l’accueil : audit WinDev, reprise et maintenance, migration vers d’autres technologies, migration HFSQL vers PostgreSQL, modernisation du logiciel métier et intégration API. Cinq pages sont ajoutées par `src/pages/buyer-services.mjs` ; la page de migration existante est enrichie pour conserver son URL. Le total est de 14 pages. Le bloc `/#questions-devis` répond aux cinq questions de préparation d’un devis et renvoie vers ces prestations. Les contenus ne fixent aucun tarif ni engagement de service non validé.

## Développement

Le thème est sélectionné par `design` dans `site.config.json` : `editorial` active la proposition claire, noir et or (`dist/proposal-b.css`), `modern` restaure la proposition sombre/dorée (`dist/modern.css`). Relancer `npm run build` après le choix. Les deux versions sont conservées ; un seul thème est chargé par page. La proposition claire utilise aussi Georgia en italique pour l’accent des grands titres. Space Grotesk et Manrope sont servies localement en WOFF2 variable (`dist/fonts/`). Les licences OFL sont incluses ; aucune requête vers Google Fonts n’est émise par le site. Les effets de survol respectent la préférence de réduction des animations.

Node.js 22.13 ou supérieur (Node 24 conseillé pour reproduire la CI), Python 3.10+ pour les outils de livraison.

```sh
npm ci
npm run check
npm run test:browser
npm start
```

`npm start` reconstruit le site puis le sert sur http://127.0.0.1:4173. Sous Windows, les tests navigateur utilisent Edge installé. Sous Linux, installer Chromium de test avec `npx playwright install --with-deps chromium` ; `PLAYWRIGHT_CHANNEL` permet de choisir un autre canal installé.

- `npm run build` crée une sortie complète et remplace `dist/` après génération réussie.
- `npm test` construit une sortie temporaire et y vérifie l'API, les métadonnées, les liens, les ressources et le consentement.
- `npm run lint`, `npm run format` et `npm run format:check` contrôlent la qualité et la présentation du code.
- `npm run test:browser` vérifie menu mobile, consentement, sélection de documents, succès et échec d'envoi simulés.
- `python -m unittest discover -s tests/deploy -v` teste les protections de l'archive et le retour arrière.

`dist/` est désormais entièrement généré, jetable et ignoré par Git. Ne jamais y éditer les sources. Les contenus sont dans `src/content/`, les pages dans `src/pages/`, les modèles communs dans `src/templates/`, le JavaScript navigateur dans `src/client/`, les CSS dans `src/styles/`, les images/polices dans `public/` et l'API dans `server/`. Les ressources de conception abandonnées restent dans `archive/design/`. Les outils de développement sont verrouillés dans `package-lock.json` ; aucune dépendance npm n'est requise pour servir les pages ou exécuter l'API.

## Déploiement Lightsail

Voir [deploy/README.md](deploy/README.md) pour le conditionnement, la migration initiale et les livraisons suivantes. La nouvelle archive réunit `site/` et `server/`. Elle exige une adaptation initiale de la racine Nginx et de l'unité systemd ; elle ne doit pas être installée avec l'ancienne procédure de copie du seul fichier API.

```sh
npm run build
python scripts/package-release.py
```

L'archive est produite dans `artifacts/serialcoders-release.tar.gz`. Le contrôle public `node scripts/check-deployment.mjs https://serialcoders.fr` compare la totalité des fichiers avec la livraison locale, y compris `contact.js`, puis vérifie la page 404. La réception email, les redirections HTTPS/www et le rendu final sur le domaine sont à vérifier séparément.

La refonte du code ne déploie rien sur Lightsail et ne modifie pas les DNS, les certificats ou les comptes Google. La version publique reste à contrôler indépendamment ; les états historiques se trouvent dans `deploy/STATUS.md`.

## Google

Configurer `googleAnalyticsId` avec le vrai identifiant `G-…`. Sans identifiant, aucun script ni bandeau Analytics n’est chargé. `googleSiteVerification` accepte le jeton de validation HTML d’une propriété URL ; pour une propriété Domaine, utiliser le TXT DNS fourni par Google.

Le consentement de base bloque tout chargement Google avant accord. Publicité désactivée ; événement `page_view` explicite, URL sans query ni fragment, événements `contact_email_click` et `contact_phone_click`. Un clic ne constitue pas un lead confirmé. Désactiver la mesure améliorée GA4 non souhaitée dans l’administration pour éviter une collecte supplémentaire. Valider le résultat avec Tag Assistant et DebugView/Temps réel avant lancement.

Le retrait active le coupe-circuit Analytics et supprime les cookies GA visibles à la racine sur les domaines parents. Il n’efface pas les données historiques déjà reçues par Google. Tester le réseau réel avec la propriété finale avant publication.

Voir `GOOGLE-SETUP.md` pour les actions qui nécessitent le propriétaire du compte.

## État et données manquantes

- Les contacts publics et le logo proviennent du site existant.
- Le partenariat Gold et les compétences C#/JavaScript sont confirmés par l’utilisateur. Aucune référence client, réalisation chiffrée ou économie garantie n’est inventée.
- La mesure GA4 est préparée mais non activée ; Search Console et la fiche d’entreprise ne sont pas créées.
- Les mentions légales complètes nécessitent la raison sociale, les coordonnées du siège, l’immatriculation, le responsable de publication et les informations d’hébergement validées. La page de confidentialité actuelle décrit le fonctionnement technique et doit être complétée avant lancement selon les traitements réels.
- L’état historique du serveur est décrit dans `deploy/STATUS.md` ; sa configuration actuelle et les comptes Google ne sont pas vérifiés par les tests locaux.
- L’indexation de la version générée est activée ; le site public doit encore recevoir cette version pour bénéficier du changement.

## Provenance

Audit : `AUDIT-REFONTE.md`, 16 septembre 2026. Logo : https://serialcoders.fr/wp-content/uploads/2026/04/logo-colonne-full.png.

## Formulaire de contact

Le formulaire /contact/ appelle POST /api/contact. Validation côté navigateur et serveur, taille limitée, champ piège et limite de cinq tentatives par IP sur dix minutes. Aucun message ni coordonnée n’est journalisé par l’API. La confirmation indique une acceptation par le relais local, pas une livraison garantie dans la boîte destinataire. Sans relais configuré, l’API retourne une indisponibilité et le navigateur conserve le texte.

Pour Lightsail : installer Node.js 22+, livrer le dossier `server/` avec les pages, suivant `deploy/README.md` (hors racine web `site/`), installer un relais local compatible sendmail (par exemple Postfix) et le configurer avec votre fournisseur SMTP authentifié. Les identifiants restent dans la configuration privée du relais. Éviter un envoi direct SMTP sans relais ; vérifier SPF/DKIM et la délivrabilité avec le fournisseur.

Créer /etc/serialcoders-contact.env (root, permissions 600) avec CONTACT_ORIGIN=https://serialcoders.fr, CONTACT_FROM et CONTACT_TO correspondant aux adresses validées, et CONTACT_SENDMAIL=/usr/sbin/sendmail. Adapter et installer deploy/contact.service, puis activer le service. Le modèle Nginx contient le proxy vers le port 4180, lié uniquement à 127.0.0.1. Ne pas exposer ce port. Le compte www-data doit être autorisé à soumettre au relais local. Vérifier les chemins Node et sendmail sur l’instance.

Avant publication : tester une demande réelle jusqu’à sa réception, la réponse au visiteur, les erreurs et la file d’attente du relais. Compléter la politique de confidentialité avec la durée de conservation, les droits, les destinataires et les informations légales validées. En développement, redémarrer npm start après modification de l’API ; sans variables de messagerie, l’envoi reste volontairement indisponible. Les tests injectent un transport factice et n’envoient aucun email.

### Documents joints

Le formulaire accepte cinq fichiers maximum et 10 Mio cumulés (PDF, DOCX, XLSX, PPTX, TXT UTF-8, PNG, JPEG). Le navigateur encode les fichiers en base64 ; Nginx et l’API limitent le corps JSON à 15 Mio. Le serveur vérifie noms, extensions, encodage, tailles et signatures élémentaires, puis produit un email MIME avec pièces jointes. Aucun fichier n’est écrit dans la racine web. Les signatures ne remplacent pas un antivirus : configurer l’analyse des pièces jointes sur le relais ou la messagerie destinataire. Le relais doit accepter au moins 15 Mio par message. Tester la réception des pièces jointes avec le fournisseur avant publication.

## Corrections ciblées après contrôle

Le menu est vérifié dans les deux thèmes. Les limites du formulaire sont définies dans `server/contact/policy.mjs`, reprises dans le HTML et intégrées au script navigateur généré. L'API émet les emails MIME par blocs avec régulation du débit ; la validation UTF-8 évite les copies intégrales inutiles.

Le paquet contient un manifeste global couvrant aussi l'API et un contrôle de démarrage sans email avant activation. La règle Nginx de cache CSS/JS doit être reportée sur le serveur réel ; voir `deploy/README.md`. Aucune de ces corrections locales ne constitue un déploiement.
