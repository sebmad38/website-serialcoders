# Retrait des pages locales — 17 septembre 2026

À la demande de l’utilisateur, les 2 280 pages de communes, 107 pages de territoires et l’annuaire ont été retirés du site généré. Les 14 pages principales sont conservées. Le générateur ne charge plus le référentiel de communes et n’ajoute plus les liens géographiques, ni leurs données structurées ou URL dans le sitemap.

Lors du déploiement, livrer une nouvelle version complète de `dist/` : ne pas superposer les fichiers sur une ancienne version contenant `zones-intervention/`. Les anciennes URL doivent retourner une véritable réponse HTTP 404, comme prévu par le serveur local et la configuration Nginx. Vérifier notamment `/zones-intervention/` et `/zones-intervention/roanne-42187/` après publication. Ne pas les rediriger en masse vers l’accueil.

La suppression locale ne prouve pas le retrait sur le serveur public ni dans les résultats de recherche. Après déploiement, soumettre le sitemap actualisé dans Search Console et suivre le retrait des anciennes URL.

Les scripts historiques de génération et le référentiel restent archivés dans le dépôt, sans être utilisés par la compilation.
