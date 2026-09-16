# Serial Coders — refonte

Site statique français destiné à générer des demandes de développement sur mesure et de migration. Double expertise : WinDev, WebDev et WinDev Mobile d’une part, C# et JavaScript d’autre part. Cible : tous secteurs, France entière et projets internationaux. Le partenariat Gold PC SOFT est confirmé par l’utilisateur. Le formulaire utilise une petite API Node.js sans dépendance npm, avec un relais mail local. Les pages sont rendues en HTML pour rester accessibles aux moteurs et fonctionner sans JavaScript.

## Couverture locale PC SOFT

Voir [SEO-LOCAL.md](SEO-LOCAL.md) pour les 2 280 pages locales, les 107 pages de territoires, la provenance des populations et les limites de cette stratégie SEO. Le total est désormais de 2 397 pages, et non neuf : le contrôle de déploiement suit toutes les routes du sitemap. La préproduction reste non indexable.

## Développement

Le thème est sélectionné par `design` dans `site.config.json` : `editorial` active la proposition claire, noir et or (`dist/proposal-b.css`), `modern` restaure la proposition sombre/dorée (`dist/modern.css`). Relancer `npm run build` après le choix. Les deux versions sont conservées ; un seul thème est chargé par page. La proposition claire utilise aussi Georgia en italique pour l’accent des grands titres. Space Grotesk et Manrope sont servies localement en WOFF2 variable (`dist/fonts/`). Les licences OFL sont incluses ; aucune requête vers Google Fonts n’est émise par le site. Les effets de survol respectent la préférence de réduction des animations.

Node.js 22 ou supérieur. `npm run build` génère neuf pages depuis `scripts/build.mjs` et `scripts/editorial.mjs`. Le second fichier contient le positionnement commercial, la migration et les contenus C#/JavaScript. Les fichiers CSS, JavaScript et images de `dist/` sont des sources suivies dans Git : ne pas supprimer `dist` pour nettoyer une compilation. `npm test` vérifie les liens, les métadonnées et le comportement du consentement. `npm start` sert le site sur http://127.0.0.1:4173.

## Déploiement Lightsail

Le choix explicite de l’utilisateur est Lightsail ; aucune publication Sites n’est nécessaire. Une réservation privée Sites a été créée avant cette précision, sans version publiée ni bascule de domaine.

1. Préparer une instance et une IP statique Lightsail. Le modèle `deploy/nginx.conf` vise Ubuntu avec Nginx ; il ne doit pas être copié tel quel sur une image Bitnami/Apache.
2. Transférer uniquement le contenu de `dist/` dans un dossier de version sous `/var/www/serialcoders/releases/`. Ne pas exposer le dépôt ni les configurations de travail.
3. Faire pointer `/var/www/serialcoders/current` vers cette version et adapter le virtual host. Vérifier `nginx -t` avant de recharger Nginx.
4. Tester via une préproduction protégée ; conserver `production: false`. Ne pas basculer le domaine tant que les mentions légales et la configuration ne sont pas complètes.
5. Configurer un certificat TLS couvrant le domaine et son alias www, une redirection HTTP vers HTTPS et www vers le domaine canonique. Vérifier le renouvellement. Le modèle fourni n’inclut volontairement aucun faux chemin de certificat.
6. Pour la version publique prête : passer `production` à `true` dans `site.config.json`, relancer `npm run build` puis `npm test`, et transférer cette version. Les contrôles suivent automatiquement le mode configuré. Un test séparé vérifie aussi la génération indexable dans un répertoire temporaire sans modifier la préproduction.
7. Basculer les DNS web vers l’IP statique en conservant les MX/TXT de messagerie. Garder l’ancien serveur pour le retour arrière. Conserver les anciennes ancres ; traiter toute autre URL trouvée dans les journaux/Search Console par une redirection pertinente.
8. Exécuter `node scripts/check-deployment.mjs https://serialcoders.fr` : le contrôle compare les neuf pages et leurs ressources avec la version locale exacte, contrôle les réponses HTTP, la page absente et un éventuel en-tête de blocage d’indexation. Toute différence est un échec, pas un déploiement présumé réussi. Vérifier séparément les redirections HTTP/www, le rendu et la réception GA4 réelle. Soumettre le sitemap dans Search Console après validation DNS.

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
- Le serveur, son système, les accès de déploiement et le compte Google ne sont pas encore disponibles dans cette tâche.
- La préproduction demeure non indexable ; cela ne corrige pas encore la directive noindex du site actuel.

## Provenance

Audit : `AUDIT-REFONTE.md`, 16 septembre 2026. Logo : https://serialcoders.fr/wp-content/uploads/2026/04/logo-colonne-full.png.

## Formulaire de contact

Le formulaire /contact/ appelle POST /api/contact. Validation côté navigateur et serveur, taille limitée, champ piège et limite de cinq tentatives par IP sur dix minutes. Aucun message ni coordonnée n’est journalisé par l’API. La confirmation indique une acceptation par le relais local, pas une livraison garantie dans la boîte destinataire. Sans relais configuré, l’API retourne une indisponibilité et le navigateur conserve le texte.

Pour Lightsail : installer Node.js 22+, copier scripts/contact-api.mjs sous /opt/serialcoders/scripts (hors racine web), installer un relais local compatible sendmail (par exemple Postfix) et le configurer avec votre fournisseur SMTP authentifié. Les identifiants restent dans la configuration privée du relais. Éviter un envoi direct SMTP sans relais ; vérifier SPF/DKIM et la délivrabilité avec le fournisseur.

Créer /etc/serialcoders-contact.env (root, permissions 600) avec CONTACT_ORIGIN=https://serialcoders.fr, CONTACT_FROM et CONTACT_TO correspondant aux adresses validées, et CONTACT_SENDMAIL=/usr/sbin/sendmail. Adapter et installer deploy/contact.service, puis activer le service. Le modèle Nginx contient le proxy vers le port 4180, lié uniquement à 127.0.0.1. Ne pas exposer ce port. Le compte www-data doit être autorisé à soumettre au relais local. Vérifier les chemins Node et sendmail sur l’instance.

Avant publication : tester une demande réelle jusqu’à sa réception, la réponse au visiteur, les erreurs et la file d’attente du relais. Compléter la politique de confidentialité avec la durée de conservation, les droits, les destinataires et les informations légales validées. En développement, redémarrer npm start après modification de l’API ; sans variables de messagerie, l’envoi reste volontairement indisponible. Les tests injectent un transport factice et n’envoient aucun email.

### Documents joints

Le formulaire accepte cinq fichiers maximum et 10 Mio cumulés (PDF, DOCX, XLSX, PPTX, TXT UTF-8, PNG, JPEG). Le navigateur encode les fichiers en base64 ; Nginx et l’API limitent le corps JSON à 15 Mio. Le serveur vérifie noms, extensions, encodage, tailles et signatures élémentaires, puis produit un email MIME avec pièces jointes. Aucun fichier n’est écrit dans la racine web. Les signatures ne remplacent pas un antivirus : configurer l’analyse des pièces jointes sur le relais ou la messagerie destinataire. Le relais doit accepter au moins 15 Mio par message. Tester la réception des pièces jointes avec le fournisseur avant publication.
