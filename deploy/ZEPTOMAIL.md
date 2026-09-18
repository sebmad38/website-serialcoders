# Configuration ZeptoMail préparée localement

Le relais prévu est désormais `smtp.zeptomail.eu:587`, avec TLS et vérification du certificat, utilisateur `emailapikey`, expéditeur `noreply@serialcoders.fr` et destinataire `contact@serialcoders.fr`.

Aucun identifiant secret n’est enregistré dans le dépôt. Remplacer le jeton communiqué dans la conversation et saisir le nouveau jeton uniquement dans l’invite masquée du script serveur.

Lors du prochain déploiement, installer la version actuelle de `configure-smtp.py` sous `/root/serialcoders-configure-smtp.py`, puis exécuter `sudo python3 /root/serialcoders-configure-smtp.py` dans une session SSH interactive. Vérifier auparavant le domaine et l’expéditeur dans ZeptoMail. Le script configure le relais Postfix déjà utilisé par l’application ; Nodemailer n’est pas nécessaire.

Cette préparation ne modifie pas le serveur. Les anciennes mentions Mailjet dans STATUS.md décrivent le déploiement précédent. Après activation, vérifier un envoi du formulaire jusqu’à réception, y compris les pièces jointes et l’adresse de réponse du visiteur.
