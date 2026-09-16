import {mkdir, writeFile, rename} from 'node:fs/promises';
import {selectCities} from './local-pages.mjs';

const source = 'https://geo.api.gouv.fr/communes?fields=nom,code,population,departement,region,codesPostaux';
const response = await fetch(source, {signal:AbortSignal.timeout(60000)});
if (!response.ok) throw new Error(`Référentiel indisponible : HTTP ${response.status}`);
const records = await response.json();
const communes = selectCities(records);
if (communes.length < 2000) throw new Error('Source incomplète : vérifier avant de remplacer le référentiel.');
const dataset = {source, retrievedAt:new Date().toISOString(), populationVintage:null, threshold:5000, totalSourceRecords:records.length, missingPopulation:records.filter(city => !Number.isInteger(city.population)).map(({code,nom}) => ({code,nom})), communes};
await mkdir(new URL('../data/', import.meta.url), {recursive:true});
const target = new URL('../data/communes.json', import.meta.url);
const temporary = new URL('../data/communes.json.tmp', import.meta.url);
await writeFile(temporary, JSON.stringify(dataset,null,2) + '\n');
await rename(temporary,target);
console.log(`${communes.length} communes importées ; ${dataset.missingPopulation.length} territoires sans population renseignée.`);
