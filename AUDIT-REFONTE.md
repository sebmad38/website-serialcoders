# Serial Coders — audit et cadrage de la refonte

Inspection publique du 16 septembre 2026 de https://serialcoders.fr/.
Ce document distingue les constats des propositions ; aucune modification du site en production n’a été effectuée.

## Constats vérifiés

| Priorité | Constat | Action prévue |
| --- | --- | --- |
| Critique | L’accueil renvoie une balise robots `noindex, nofollow`. | Vérifier le réglage de visibilité WordPress et les extensions SEO. Retirer le blocage sur le site public lorsqu’il est prêt ; le conserver sur la préproduction. |
| Haute | Les trois liens « Démarrer un projet », « Discuter de votre projet » et « Demander un devis gratuit » ciblent `#`. | Les relier au contact et tester le parcours jusqu’à une prise de contact réelle. |
| Haute | Le titre HTML est seulement `SerialCoders` ; aucune méta-description n’a été trouvée dans le DOM inspecté. | Rédiger des titres et descriptions propres à chaque page. |
| Haute | L’API publique WordPress retourne une seule page publiée, l’accueil. | Développer des pages de prestations répondant à des intentions distinctes. Cet inventaire ne prouve pas l’absence d’autres types de contenus. |
| Moyenne | `/wp-sitemap.xml` renvoie 404 ; `/robots.txt` répond 200 et ne déclare aucun sitemap. | Vérifier si une extension fournit un autre sitemap avant d’en configurer un. |
| Moyenne | Les mentions légales, la confidentialité et les CGV sont affichées comme texte, sans liens dans le DOM inspecté. | Rendre accessibles les pages applicables et renseigner les informations réelles de l’entreprise. |
| Moyenne | Le téléphone et l’adresse électronique ne sont pas des liens dans le DOM inspecté. | Ajouter `tel:+33663686865` et `mailto:contact@serialcoders.fr`. |

Technologie observée : WordPress, thème Hello Elementor, Elementor et Elementor Pro.
Identité visuelle observée : noir, doré, logo Serial Coders.
La canonique de l’accueil est déjà `https://serialcoders.fr/`.
Aucun script Google Analytics ou Tag Manager externe n’a été identifié dans la liste des scripts inspectés. Cela ne constitue pas un audit exhaustif du déclenchement conditionnel des balises.

## Contenus existants à préserver

- Développement de logiciels métier sur mesure avec WinDev, WebDev et WinDev Mobile.
- Accompagnement annoncé dans toute la France, de la conception à la maintenance.
- Téléphone public : +33 (0)6 63 68 68 65.
- Adresse électronique publique : contact@serialcoders.fr.
- Fondation en 2012 et statut PC SOFT Gold Partner : affirmations présentes sur le site, à confirmer avant republication comme arguments commerciaux actuels.
- Ancres existantes : `#societe`, `#domaines`, `#techno`, `#contact`.

## Proposition éditoriale à ajuster au positionnement commercial

| Page proposée | Intention | Titre proposé |
| --- | --- | --- |
| `/` | Présenter l’offre et orienter la demande | Développement WinDev, WebDev et mobile \| Serial Coders |
| `/developpement-windev/` | Projet de logiciel métier Windows | Développement WinDev sur mesure \| Serial Coders |
| `/developpement-webdev/` | Application métier accessible sur le Web | Développement WebDev \| Serial Coders |
| `/developpement-windev-mobile/` | Application métier mobile | Développement WinDev Mobile \| Serial Coders |
| `/maintenance-applicative/` | Reprise et évolution d’une application existante | Maintenance de vos applications PC SOFT \| Serial Coders |
| `/contact/` | Qualifier un besoin et contacter l’entreprise | Parlons de votre projet \| Serial Coders |

Ces URL sont proposées, pas encore créées. Ne pas inventer de références clients, de résultats chiffrés, d’avis ni d’implantations locales. Confirmer la prestation de reprise applicative avant sa publication.

## Intégrations Google prévues

1. Search Console : vérifier la propriété existante, idéalement une propriété Domaine validée par DNS ; examiner indexation et performances, soumettre le sitemap réel après mise en ligne.
2. Analytics 4 : réutiliser la propriété pertinente ; préparer les événements `contact_email_click` et `contact_phone_click`. Réserver `generate_lead` à un envoi confirmé côté serveur, sans assimiler un simple clic à un prospect acquis.
3. Consentement : chargement Analytics uniquement après accord, refus et retrait accessibles, publicité désactivée si non demandée. Vérifier le comportement réel avant accord, après refus, après accord et après retrait.
4. Tag Manager : à retenir si plusieurs balises sont réellement nécessaires ; éviter le doublon GA4 direct + GA4 via GTM.
5. Fiche d’entreprise : retrouver la fiche existante avant toute création, vérifier coordonnées, catégorie, services et URL ; ajouter un lien de site balisé UTM. L’éligibilité dépend notamment des contacts en personne avec les clients ; une activité exclusivement en ligne n’est pas éligible selon Google.

## Validation et bascule

- Préproduction distincte, non indexable ; aucun remplacement de production sans version testée.
- Conserver les URL existantes utiles et prévoir des redirections permanentes directes lorsqu’une URL change.
- Vérifier mobile, clavier, formulaires, liens, erreurs, titres, descriptions, canonique, données structurées et sitemap.
- Ne publier dans les données structurées que des faits vérifiés ; ne pas inventer d’adresse pour un balisage local.
- Mesurer les performances sur la version déployée ; aucun score ni classement garanti.
- Vérifier après bascule les réponses HTTP, l’absence de `noindex` sur les pages publiques et les événements Google effectivement reçus.

## Informations encore attendues

- Priorité commerciale, prestations prioritaires et zones réellement desservies.
- Choix de conserver WordPress/Elementor ou de changer de base technique.
- Accès existants à l’hébergement, au domaine, à WordPress et aux propriétés Google, sans mots de passe dans la conversation.
- Informations légales, statut partenaire actuel, références publiables et modalités de contact en personne pour la fiche d’entreprise.

## Sources officielles

- Migration et redirections : https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Consentement Google : https://developers.google.com/tag-platform/security/concepts/consent-mode
- Implémentation du consentement : https://developers.google.com/tag-platform/security/guides/consent
- Éligibilité fiche d’entreprise : https://support.google.com/business/answer/13763036?hl=fr
