export function createPrivacyPage(config) {
  return {
    path: '/confidentialite/',
    title: 'Confidentialité et cookies | Serial Coders',
    description:
      'Informations sur les contacts et les préférences de mesure d’audience du site Serial Coders.',
    body: /* HTML */ `<section class="section legal">
      <h1>Confidentialité<br />et cookies</h1>
      <h2>Prendre contact</h2>
      <p>
        Le formulaire transmet votre nom, votre email, votre message et, si vous les renseignez,
        votre entreprise, votre téléphone et les documents joints à Serial Coders par email pour
        traiter votre demande et vous recontacter. Les champs facultatifs peuvent rester vides. Les
        documents joints sont transmis en pièces jointes par email, sans stockage dans un répertoire
        public du site. Le formulaire n’inscrit à aucune newsletter. Une protection contre les
        envois abusifs conserve temporairement un compteur de tentatives par adresse IP en mémoire
        du serveur pendant dix minutes. Les liens de contact direct ouvrent votre messagerie ou
        votre application téléphonique. Pour toute question sur les informations communiquées lors
        d’un échange, écrivez à
        <a href="mailto:contact@serialcoders.fr">contact@serialcoders.fr</a>.
      </p>
      <h2>Mesure d’audience</h2>
      <p>
        ${config.googleAnalyticsId ? 'Google Analytics est configuré pour mesurer les visites et les clics sur les liens de contact uniquement après votre accord. Aucune fonction publicitaire n’est activée. Les messages et coordonnées que vous adressez à Serial Coders ne sont pas transmis par ce suivi.' : 'La mesure d’audience Google Analytics n’est pas activée sur cette version du site.'}
      </p>
      <h2>Votre choix</h2>
      <p>
        Lorsque la mesure d’audience est disponible, vous pouvez l’accepter ou la refuser. Le lien «
        Gérer les cookies » permet de changer votre choix. Cette préférence est conservée dans votre
        navigateur pendant six mois. Sans accès au stockage du navigateur, elle s’applique seulement
        à la page en cours.
      </p>
    </section>`,
  };
}
