# Corrections ciblées — 17 septembre 2026

- **Navigation** : comportement du menu et dimensions de ses icônes partagés entre les thèmes ; palette distincte conservée. Tests navigateur sur les deux thèmes, avec ouverture, fermeture, retour du focus et passage au bureau.
- **Cache** : le modèle Nginx demande la revalidation des CSS et JavaScript (`expires -1`), tandis que les images et polices gardent leur cache. Il faut reporter et recharger cette configuration sur le serveur. Un cache créé avant cette modification peut conserver son ancien délai pendant une heure au maximum.
- **Intégrité** : `bundle-manifest.json` couvre les fichiers du site et de l'API. Le paquet extrait est contrôlé avant activation ; une modification de l'API est désormais rejetée. Un précontrôle démarre l'API sur un port local temporaire et teste le contact avec un transport factice sous le compte du service, sans email réel.
- **Formulaire** : limites de champs, nombre/taille des documents et formats définis dans `server/contact/policy.mjs`, utilisés par l'API, le HTML et le JavaScript navigateur généré.
- **Mémoire** : MIME produit par blocs de moins de 64 Kio, avec régulation du débit vers le relais ; validation UTF-8 sans copies intégrales ; libération des blocs HTTP après assemblage. Le diagnostic reproductible `node scripts/profile-contact.mjs` utilise une API séparée et une sortie simulée lente.

Validation locale : 25 tests Node.js, 5 tests Python de livraison et 8 tests Edge sur les deux thèmes passent. ESLint et Prettier passent. L'archive a été extraite et son précontrôle exécuté localement ; l'altération d'un fichier API a été détectée.

Pour deux requêtes concurrentes contenant chacune 10 Mio, le diagnostic avec sortie simulée a mesuré environ 258 Mio de RSS avant suppression des copies de validation et environ 169 Mio après. Il s'agit d'une mesure locale sous Windows, pas d'une garantie de mémoire du groupe systemd. La validation Linux avec les processus sendmail/Postfix et le contrôle réel de la configuration Nginx restent à réaliser sur l'instance.

Aucun serveur distant, DNS, certificat ni compte de messagerie n'a été modifié. La procédure de publication reste décrite dans `deploy/README.md`.
