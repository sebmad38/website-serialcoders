# Mise en service des outils Google

État : préparation seulement. Aucun compte ni propriété créé ; aucun mot de passe requis dans les fichiers ou la conversation.

## 1. Compte détenu par l’entreprise

Utiliser un compte Google dont l’entreprise garde la maîtrise. La connexion et les éventuelles vérifications d’identité sont réalisées par le propriétaire. Éviter de créer une propriété détenue seulement par un prestataire.

## 2. Search Console

- Ouvrir https://search.google.com/search-console et vérifier d’abord les propriétés existantes.
- Ajouter si nécessaire la propriété Domaine `serialcoders.fr`.
- Copier le TXT exact fourni par Google chez le gestionnaire DNS ; préserver les autres enregistrements.
- Valider la propriété. Après lancement, soumettre `https://serialcoders.fr/sitemap.xml`.
- Inspecter l’accueil et les pages d’expertise ; suivre indexation, requêtes, impressions, clics et pages d’entrée. Ne pas demander l’indexation de la préproduction.

## 3. Analytics 4

- Ouvrir https://analytics.google.com, vérifier les comptes existants et créer si nécessaire le compte de l’entreprise puis une propriété GA4, fuseau Europe/Paris.
- Créer un flux Web pour le domaine final. Reporter uniquement l’identifiant public `G-…` dans `site.config.json`.
- Examiner et désactiver les fonctions de mesure améliorée inutiles, Google Signals et toute collecte publicitaire non demandée.
- Choisir une durée de conservation adaptée aux besoins réels ; mettre la notice de confidentialité en cohérence avec la configuration effectivement retenue.
- Vérifier les événements de visite et de contact après consentement. Les clics e-mail/téléphone sont des intentions de contact ; mesurer séparément les demandes effectivement reçues dans le suivi commercial.
- Tester refus, accord, retrait, retour sur le site et absence de données personnelles dans les événements. Les tests locaux avec simulation ne prouvent pas la réception par Google.
- Relier Search Console à GA4 lorsque les droits nécessaires sont disponibles.

## 4. Fiche d’entreprise

- Rechercher une fiche existante avant d’en créer une pour éviter les doublons.
- Confirmer l’éligibilité : Google exige normalement des contacts en personne avec les clients. Une activité uniquement en ligne n’est pas éligible. Ne pas inventer d’adresse ou d’agence pour viser un territoire.
- Renseigner le nom réel, la catégorie pertinente disponible, les coordonnées et les modalités réelles d’accueil ou d’intervention. Le ciblage commercial international ne suffit pas à justifier des zones locales fictives.
- La validation est effectuée selon les moyens proposés par Google au propriétaire.
- Lien proposé : `https://serialcoders.fr/?utm_source=google&utm_medium=organic&utm_campaign=business_profile` ; le suivi actuel supprime les query strings des événements pour éviter la collecte involontaire de données. L’attribution UTM devra être implémentée par liste autorisée avant d’être annoncée comme mesurée.

## 5. Mesurer les résultats

Établir une référence après lancement : pages indexées, impressions hors marque, clics organiques, intentions de contact et demandes qualifiées réellement reçues. Comparer sur une période suffisante ; ne pas promettre de classement ni confondre trafic et leads.

Sources consultées :
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/tag-platform/security/guides/consent
- https://support.google.com/business/answer/13763036?hl=fr
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
