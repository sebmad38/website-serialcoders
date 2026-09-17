# Déploiement Lightsail — 17 septembre 2026

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
