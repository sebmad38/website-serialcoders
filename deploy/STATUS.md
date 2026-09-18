# Déploiement Lightsail — 18 septembre 2026

- Version active : `20260918-113843` ; précédente conservée : `20260917-162522`.
- 15 pages, mentions légales et favicon inclus ; aucun lien « Villes et territoires ».
- Archive SHA-256 : `0efeb72dd4ca655ee674905c0086d70163d35127bc5aef3ce06b331918afb226`.
- Vérification publique HTTPS complète réussie : tous les fichiers correspondent au manifeste local ; ancienne route géographique en 404.
- 26 tests applicatifs, 8 tests navigateur et 5 tests Python réussis ; lint et formatage conformes.
- API saine après activation ; configuration HTTPS et SMTP conservée, unités systemd rechargées.
- Aucun email de test envoyé : la réception réelle reste à vérifier séparément.
- Les informations d’identité juridique complète et de téléphone AWS restent à finaliser dans les mentions légales.

# Déploiement Lightsail — 17 septembre 2026

## Formulaire : SMTP non configuré

Après le signalement d'un échec d'envoi, diagnostic serveur :
`/etc/serialcoders-contact.env` contient seulement `CONTACT_ORIGIN`, aucun
fichier d'identifiants Postfix n'existe et l'authentification SMTP est désactivée.
Le relais pointe encore vers Mailjet. Le transport applicatif rejette donc
l'envoi faute de `CONTACT_FROM`, `CONTACT_TO` et `CONTACT_SENDMAIL`.

Le script ZeptoMail du dépôt est maintenant installé, syntaxe vérifiée, sous
`/root/serialcoders-configure-smtp.py` (mode 700). Sa configuration reste à
exécuter dans une session SSH interactive avec le jeton saisi dans l'invite
masquée. Aucun secret n'a été demandé dans la conversation et aucun email
n'a été envoyé pendant le diagnostic.

## HTTPS public vérifié à 16:34 UTC (18:34 Paris)

Le propriétaire a ouvert le port 443 dans Lightsail. Le contrôle public
`node scripts/check-deployment.mjs https://serialcoders.fr` réussit : tous les
fichiers servis correspondent à la version locale et la page absente répond 404.
Les redirections HTTP et HTTPS www répondent 301 vers le domaine canonique,
en conservant le chemin. Le certificat est accepté sans désactiver sa validation.
Le cache CSS reste `no-cache` et le proxy API est accessible en HTTPS
(405 attendu pour HEAD). La réception des emails n'a pas été testée.

## Installation HTTPS et contrôles préalables

- Ancien AAAA supprimé par le propriétaire ; absence confirmée via le DNS public.
- Certificat Let’s Encrypt émis et installé pour `serialcoders.fr` et
  `www.serialcoders.fr`, expiration le 16 décembre 2026.
- Renouvellement automatique : `certbot.timer` activé et
  `certbot renew --dry-run` réussi.
- HTTPS répond 200 en local avec validation du certificat ; CSS/JS conservent
  `Cache-Control: no-cache`. Le proxy API répond 405 aux méthodes non autorisées.
- Redirections HTTP et www configurées vers `https://serialcoders.fr`.
- Contrôle public bloqué : connexion TCP 443 expirée même en forçant l'IPv4
  `13.39.55.229`. Nginx écoute sur 443 et UFW autorise Nginx Full ; l'ouverture
  HTTPS dans le pare-feu Lightsail a été demandée au propriétaire du compte.
  Ce blocage a été résolu par le propriétaire ; contrôle public réussi ci-dessus.
- Aucun email de test envoyé.

## Historique : premier essai bloqué par le DNS (résolu)

La tentative Certbot pour `serialcoders.fr` et `www.serialcoders.fr` échoue :
Let’s Encrypt utilise l'enregistrement AAAA
`2001:bc8:1210:221b:dc00:ff:fe42:717f`, qui répond 404 au challenge ACME sur
l'ancien hébergement. Aucun certificat n'a été émis. Le site HTTP reste actif.

La zone est déléguée aux serveurs AWS DNS. Elle n'apparaît ni dans Route 53 ni
dans les domaines Lightsail (`us-east-1`) du profil AWS local `default`.
Identifier le compte qui gère cette zone, retirer l'ancien AAAA (ou le remplacer
par une IPv6 Lightsail effectivement configurée), attendre la propagation puis
relancer Certbot. Préserver les MX et TXT. Sauvegarde Nginx avant tentative :
`/var/backups/serialcoders/https-20260917/nginx-before.conf`.

## Mise à jour vérifiée à 16:25 UTC (18:25 Paris)

- Version active : `20260917-162522`, 14 pages principales, sans pages géographiques.
- Site : `/var/www/serialcoders/current/site` ; API :
  `/var/www/serialcoders/current/server/index.mjs`.
- Archive SHA-256 : `a41bbbeba0d139d083629bafdc0e1ad0225f5bb2713b8f1255d3d07df3d79222`.
- Nginx validé puis rechargé : CSS/JS en `Cache-Control: no-cache` sur le domaine
  et l'aperçu IP ; images et polices du domaine avec un cache d'une heure.
- Tous les fichiers publiés comparés à la version locale via HTTP public ;
  page 404 et suppression des routes géographiques vérifiées sur le serveur.
- API saine sur la boucle locale ; prévalidation du contact sans envoi d'email.
- 26 tests Node, 5 tests de déploiement Python et 8 tests navigateur réussis.
- Correction du démarrage Node via le lien symbolique `current`, couverte par un
  nouveau test. Le premier essai a restauré automatiquement l'ancienne version
  avant le déploiement corrigé.
- Sauvegarde des deux configurations Nginx, du service systemd et de la cible
  précédente : `/var/backups/serialcoders/20260917-162522`. Version précédente :
  `/var/www/serialcoders/releases/20260917-155514`.
- Le domaine résout désormais vers `13.39.55.229`. Le site est accessible sur
  `http://serialcoders.fr`. HTTPS n'est pas configuré dans Nginx et le contrôle
  externe HTTPS expire ; le formulaire public reste bloqué par HTTP 503.
- Aucun changement DNS ou SMTP, aucun email envoyé pendant ce déploiement.
  La configuration actuelle d'envoi SMTP n'a pas été revalidée.

## Historique antérieur (les chemins et le DNS ci-dessous sont dépassés)

Serveur Ubuntu 24.04 : `13.39.55.229`, utilisateur `ubuntu`. L'ancienne IP
`13.37.227.84` reste uniquement l'alias de vérification de la clé d'hôte SSH.
Instance constatée : environ 909 Mio de RAM utilisable, disque racine 38 Gio.

## Réalisé

- Nginx, Node.js 24.21.0, Postfix, Certbot installés.
- Archive du site vérifiée par SHA-256 avant/après transfert.
- 2 423 fichiers servis identiquement ; page absente vérifiée en 404.
- 16 tests locaux réussis ; les 4 tests contact repassent après alignement
  de l'expéditeur SMTP d'enveloppe avec l'adresse From.
- Site : `/var/www/serialcoders/current`, versions dans `releases/`.
- API : `/opt/serialcoders/scripts/contact-api.mjs`, service `serialcoders-contact`.
- Pare-feu local : SSH, HTTP et HTTPS uniquement. SMTP et API en boucle locale.
- Aperçu HTTP par IP non indexable ; formulaire désactivé sur cet aperçu.
- Formulaire limité à deux requêtes simultanées dans Nginx. Les limites de pièces
  jointes restent à 5 fichiers et 10 Mio cumulés ; la proposition de 5 Mio n'est
  pas appliquée.
- Relais Mailjet préparé : `in-v3.mailjet.com:587`, TLS vérifié avec succès.
- Envoi désactivé tant que les identifiants ne sont pas configurés.
- Mémoire disponible mesurée après installation : environ 568 Mio au repos.

## À terminer

1. Confirmer que `13.39.55.229` est l'IP statique Lightsail.
2. Dans Mailjet, vérifier que `contact@serialcoders.fr` est un expéditeur validé.
   Exécuter `deploy/configure-mailjet.ps1` dans PowerShell pour saisir les deux
   clés dans la session SSH masquée. Les paramètres proposés utilisent cette
   adresse comme expéditeur et destinataire. Aucun secret n'est stocké ici.
3. Basculer le A de `serialcoders.fr` vers la nouvelle IP. Le CNAME `www` pointe
   déjà sur `serialcoders.fr`. Préserver les MX/TXT Zoho ; vérifier tout AAAA
   éventuel avant activation. Le dernier A observé est `51.159.183.220`.
4. Une fois le DNS effectif, obtenir le certificat couvrant les deux noms avec
   Certbot ; imposer HTTPS et le domaine canonique sans www. Vérifier aussi
   l'ouverture du port 443 dans le pare-feu Lightsail.
5. Vérifier le renouvellement TLS et exécuter le contrôle HTTPS complet
   `node scripts/check-deployment.mjs https://serialcoders.fr`.
6. Tester un formulaire avec pièce jointe jusqu'à réception dans la boîte,
   vérifier la file Postfix et l'état Mailjet. La réussite de la soumission à
   Postfix seule ne prouve pas la livraison finale.

Postfix peut conserver temporairement les pièces jointes dans sa file sur disque.
La désactivation du buffering Nginx ne constitue pas une garantie générale
d'absence d'écriture disque (système, relais, sauvegardes).

## Utilitaires

- `bootstrap.sh` prépare un hôte neuf ; ne pas relancer sur un relais actif,
  car il désactive volontairement l'envoi jusqu'à configuration.
- `install-release.sh` installe une version préalablement transférée dans `/tmp`.
  À adapter après activation TLS pour ne pas remplacer la configuration Certbot.
- `configure-smtp.py` est installé en `/root/serialcoders-configure-smtp.py`.
- `verify-release.py` vérifie la desserte HTTP locale avant activation TLS.

Les clés SSH et SMTP sont hors dépôt. L'original de la clé SSH n'a pas été modifié.
