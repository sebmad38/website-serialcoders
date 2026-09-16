# Couverture locale PC SOFT

La génération ajoute 2 280 pages de communes ou subdivisions de plus de 5 000 habitants, 107 pages de départements ou territoires et un annuaire national : 2 397 pages au total avec les neuf pages existantes. Une page locale regroupe WinDev, WebDev, WinDev Mobile et migration vers C# ; aucune déclinaison artificielle par mot-clé n’est créée.

## Données et reproductibilité

Source officielle : https://geo.api.gouv.fr/decoupage-administratif/communes. L’extraction du 16 septembre 2026 est conservée dans `data/communes.json`. Le seuil porte sur le champ `population`, strictement supérieur à 5 000. Le code géographique rend les URL uniques même en cas d’homonymie. Paris, Lyon et Marseille sont représentées par leur commune, sans duplication des arrondissements.

La source inclut l’outre-mer et certaines subdivisions territoriales. Six territoires sans population renseignée sont consignés dans `missingPopulation` ; aucun chiffre n’est inventé. La réponse de l’API ne précise pas le millésime de population : la date d’extraction n’est pas l’année du recensement. Le résultat décrit exactement le référentiel téléchargé, pas une estimation démographique en temps réel.

`node scripts/update-communes.mjs` actualise les données avec validation avant remplacement. `npm run build` fonctionne ensuite hors ligne. Contrôler les différences de codes et de population avant de publier une actualisation, notamment les fusions et changements de noms. Les anciens fichiers ne sont pas supprimés automatiquement : traiter les anciennes URL avec des redirections pertinentes lors d’un changement de référentiel, puis retirer leurs fichiers de la version déployée. Ne jamais supprimer tout `dist/` : ce dossier contient aussi les sources graphiques.

## Indexation et limites

Chaque page dispose d’un titre, d’une description, d’une canonique propre, d’un H1, de liens vers son territoire et les services détaillés. Le sitemap contient toutes les routes. Les pages locales portent des données structurées Service et BreadcrumbList, avec une zone desservie ; aucune agence, adresse locale, certification supplémentaire ou référence client n’est inventée.

La préproduction reste en `noindex, nofollow`, avec exploration bloquée dans robots.txt. Le mode `production: true` rend toutes les pages indexables. Il ne les publie pas et ne déclenche pas leur indexation. Les contrôles de mise en production du README restent applicables.

La génération n’est pas une garantie de classement. Les pages partagent une offre et une trame communes ; les seules données géographiques ne constituent pas une preuve d’expertise locale. Google peut ignorer ces pages ou considérer leur multiplication comme des pages satellites si elles n’apportent pas suffisamment de valeur : https://developers.google.com/search/docs/essentials/spam-policies?hl=fr.

Avant une diffusion massive, enrichir les villes prioritaires avec des éléments validés : cas client publiable, problème métier traité, modalités de collaboration effectivement proposées et témoignage autorisé. Éviter les variantes de texte artificielles destinées à masquer les répétitions. Dans Search Console, suivre indexation, requêtes locales, clics et demandes réelles après lancement ; regrouper ou retirer de l’index les pages sans valeur propre. Roanne et Lyon sont des points de départ, pas des implantations déclarées.

## Vérification

`npm test` contrôle le seuil, les homonymes, les exemples Roanne/Lyon, l’outre-mer, les métadonnées, les liens internes, les schémas et l’indexabilité de toutes les pages dans une compilation production isolée. Les tests du formulaire et du consentement restent exécutés. Le script de contrôle de déploiement parcourt automatiquement les routes du sitemap.

Exemples locaux :

- http://127.0.0.1:4173/zones-intervention/
- http://127.0.0.1:4173/zones-intervention/roanne-42187/
- http://127.0.0.1:4173/zones-intervention/lyon-69123/
