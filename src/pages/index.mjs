import { homePage } from './home.mjs';
import { legalPage } from './legal.mjs';
import { servicePages } from './services.mjs';
import { contactPage } from './contact.mjs';
import { createPrivacyPage } from './privacy.mjs';
import { createMigrationPage } from './migration.mjs';
import { newTechnologyPages } from './technologies.mjs';
import { buyerServicePages, enrichMigrationOffer } from './buyer-services.mjs';

export function createPages(config) {
  return [
    { path: '/', ...homePage },
    ...servicePages,
    contactPage,
    legalPage,
    createPrivacyPage(config),
    enrichMigrationOffer(createMigrationPage(config.design)),
    ...newTechnologyPages,
    ...buyerServicePages,
  ];
}
