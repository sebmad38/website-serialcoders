import { buildSite } from '../src/lib/build.mjs';
const result = await buildSite();
console.log(
  `${result.pageCount} pages générées — ${result.config.production ? 'production indexable' : 'préproduction non indexable'}.`,
);
