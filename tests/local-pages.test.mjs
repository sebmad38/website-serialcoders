import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createLocalPages, selectCities, cityPath, slugify} from '../scripts/local-pages.mjs';

const dataset = JSON.parse(await readFile('data/communes.json','utf8'));
test('Strict population threshold, unique codes and safe accented names', () => {
  const city = dataset.communes[0];
  assert.equal(selectCities([{...city,population:5000}]).length,0);
  assert.equal(selectCities([{...city,population:5001}]).length,1);
  assert.equal(selectCities([{...city,population:null}]).length,0);
  assert.throws(()=>selectCities([city,city]),/dupliquée/);
  assert.throws(()=>selectCities([{...city,code:'../..'}]),/invalide/);
  assert.equal(slugify('L’Haÿ-les-Roses'), 'l-hay-les-roses');
  assert.equal(slugify('Schœlcher'), 'schoelcher');
});
test('Coverage includes requested examples, homonyms and overseas territories', () => {
  const cities = selectCities(dataset.communes);
  assert.equal(cities.length,dataset.communes.length);
  for (const code of ['42187','69123','75056','13055','97411','97611','98735','98818']) assert.ok(cities.some(city=>city.code===code),code);
  assert.ok(!cities.some(city=>/^(751\d\d|132\d\d|6938\d)$/.test(city.code)), 'No duplicated municipal arrondissements');
  const paths=cities.map(cityPath);
  assert.equal(new Set(paths).size,cities.length);
  assert.ok(cities.filter(city=>city.nom==='Saint-Denis').length>1);
});
test('Every city has a crawlable parent and honest Service / breadcrumb data', async () => {
  const pages=createLocalPages(dataset);
  for (const city of dataset.communes) {
    const path=cityPath(city);
    assert.ok(pages.some(page=>page.path!==path && page.body.includes(`href="${path}"`)),path);
  }
  for (const code of ['42187','69123','97411']) {
    const city=dataset.communes.find(city=>city.code===code);
    const html=await readFile(`dist${cityPath(city)}index.html`,'utf8');
    const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
    assert.equal(schemas.find(schema=>schema['@type']==='Service').areaServed.identifier,code);
    assert.equal(schemas.find(schema=>schema['@type']==='BreadcrumbList').itemListElement.length,3);
    assert.ok(!schemas.some(schema=>schema['@type']==='LocalBusiness'));
    assert.match(html,/ne désigne pas une agence/);
    assert.match(html,/migration-applications-pcsoft/);
  }
});
