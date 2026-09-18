/** Validate configuration before producing any files or activating a release. */
export function validateConfig(input) {
  const config = { ...input, design: input.design || 'modern' };
  if (!['modern', 'editorial'].includes(config.design)) throw new Error('Design inconnu.');
  const origin = new URL(config.origin);
  if (
    origin.protocol !== 'https:' ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash ||
    origin.username ||
    origin.password
  )
    throw new Error('Origine HTTPS sans chemin ni identifiants requise.');
  if (typeof config.production !== 'boolean') throw new Error('production doit être un booléen.');
  if (config.googleAnalyticsId && !/^G-[A-Z0-9]+$/.test(config.googleAnalyticsId))
    throw new Error('Identifiant GA4 invalide.');
  if (config.googleSiteVerification && typeof config.googleSiteVerification !== 'string')
    throw new Error('Jeton Google invalide.');
  return config;
}
