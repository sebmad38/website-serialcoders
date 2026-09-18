# Livraison Lightsail

La nouvelle livraison contient **ensemble** `site/` (sortie de compilation complète) et `server/` (API sans dépendances npm). Une seule cible `current` détermine la version des deux composants. Aucun secret, référentiel historique ou fichier de développement n'entre dans l'archive.

## Préparation locale

```sh
npm ci
npm run check
npm run test:browser
python -m unittest discover -s tests/deploy -v
npm run build
python scripts/package-release.py
```

L'archive produite est `artifacts/serialcoders-release.tar.gz`. Le manifeste SHA-256 du site est contrôlé avant création de l'archive. Un second manifeste `bundle-manifest.json` couvre tous les fichiers `site/` et `server/` dans l'archive. Conserver également une empreinte de l'archive pendant son transfert SSH afin de contrôler les fichiers serveur.

## Migration initiale de l'ancien déploiement

Cette migration de structure n'a pas été exécutée par la refonte du code. Elle nécessite une intervention coordonnée sur l'instance, avec une fenêtre de maintenance et la sauvegarde des configurations existantes.

- Ancienne racine web : `/var/www/serialcoders/current` ; nouvelle racine : `/var/www/serialcoders/current/site`.
- Ancien exécutable API : `/opt/serialcoders/scripts/contact-api.mjs` ; nouveau : `/var/www/serialcoders/current/server/index.mjs`.
- Préparer une première archive complète et conserver l'ancienne cible de `current`, l'ancienne unité systemd et le virtual host TLS pour le retour arrière initial.
- Adapter **le virtual host réellement utilisé**, en conservant les certificats, redirections et protections en place. Les fichiers `.conf` du dépôt sont des modèles ; le modèle HTTP ne remplace pas une configuration HTTPS active.
- Installer la nouvelle unité `contact.service`, exécuter `systemctl daemon-reload`, préparer la nouvelle racine Nginx et valider avec `nginx -t`.
- Activer la première version complète, recharger Nginx et vérifier HTTP/HTTPS, l'API et une réception email réelle. En cas d'échec initial, rétablir aussi l'unité et le virtual host sauvegardés : l'ancien dossier ne possède pas la nouvelle structure.

L'installateur refuse de fonctionner si la configuration sur disque ne mentionne pas la nouvelle racine et la nouvelle unité. Il ne modifie ni Nginx, ni les certificats, ni la configuration SMTP. Pour la première migration, son retour arrière de lien ne remplace pas la restauration des configurations mentionnée ci-dessus.

## Livraisons suivantes

Après la migration initiale et sa validation :

1. Transférer l'archive vers `/tmp/serialcoders-release.tar.gz` et les fichiers `release.py` / `install-release.sh` dans un dossier d'administration hors racine publique.
2. Vérifier l'empreinte SHA-256 de l'archive transférée.
3. Exécuter `sudo bash install-release.sh YYYYMMDD-HHMMSS` avec un identifiant inédit.

L'installateur prend un verrou, extrait dans un nouveau dossier, rejette les chemins traversants et liens symboliques, vérifie les manifestes et la syntaxe des modules serveur, teste l'import et une requête de contact avec un transport factice sous `www-data`, puis vérifie la configuration Nginx et systemd. Il bascule `current` par remplacement atomique du lien et redémarre l'API. Si le redémarrage ou `/health` échoue, il restaure la cible précédente et redémarre son API. Les versions et extractions incomplètes sont conservées pour inspection ; un identifiant déjà utilisé est refusé.

Le redémarrage de l'API peut provoquer une brève indisponibilité du formulaire. `/health` vérifie que l'API répond, pas la délivrabilité SMTP. L'échec du redémarrage de l'ancienne API reste une erreur nécessitant une intervention, même si le lien a été restauré.

Après activation :

```sh
node scripts/check-deployment.mjs https://serialcoders.fr
```

Ce contrôle public compare tous les fichiers du manifeste, y compris le formulaire, les styles, les polices et les images, ainsi que le corps et le statut de la page 404. Vérifier séparément la réception email, les redirections, le certificat et les anciennes URL `/zones-intervention/`, qui doivent répondre 404. Ne jamais superposer une livraison sur l'ancien dossier.

## Configuration privée

Conserver `/etc/serialcoders-contact.env` accessible à root uniquement (mode 600), avec `CONTACT_ORIGIN`, `CONTACT_FROM`, `CONTACT_TO` et `CONTACT_SENDMAIL`. Les identifiants SMTP restent dans les fichiers privés du relais Postfix. Le service utilise toujours l'interface locale sur le port 4180 ; Nginx remplace `X-Real-IP` et limite taille, fréquence et concurrence.

## Cache et diagnostic mémoire

Le modèle Nginx impose désormais `expires -1` pour CSS et JavaScript : les URL stables sont revalidées (`Cache-Control: no-cache`). Reporter ce changement dans le virtual host réel, exécuter `nginx -t` puis recharger Nginx. Les ressources déjà mises en cache avec l'ancienne règle peuvent rester fraîches jusqu'à l'expiration de leur ancien délai (au maximum une heure). Aucun serveur distant n'a été reconfiguré par cette correction.

`node scripts/profile-contact.mjs` mesure le RSS d'une API isolée recevant deux fichiers de 10 Mio en parallèle, avec une sortie MIME simulée lente. Il n'envoie pas d'email et ne mesure pas la mémoire de Postfix/sendmail. Sur Linux, compléter cette mesure avec la mémoire du groupe systemd pendant deux envois de test réels autorisés avant de valider `MemoryMax=256M`.
