import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile, readdir, access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createLocalPages} from '../scripts/local-pages.mjs';
const dataset = JSON.parse(await readFile('data/communes.json', 'utf8'));
const expectedPageCount = 9 + createLocalPages(dataset).length;

const source = await readFile('dist/site.js','utf8');
const config = JSON.parse(await readFile('site.config.json', 'utf8'));
function harness({id='G-TEST123',stored=null,unavailable=false}={}) {
  const appended=[];
  const element = dataset => ({dataset,hidden:true,events:{},addEventListener(n,f){this.events[n]=f;},focus(){}});
  const buttons=[element({consent:'denied'}),element({consent:'granted'})];
  const links=[element({event:'contact_email_click'}),element({event:'contact_phone_click'})];
  const settings=element({});
  const banner={hidden:true,querySelectorAll:()=>buttons,querySelector:()=>buttons[0]};
  const window={SERIAL_CODERS_CONFIG:{googleAnalyticsId:id},addEventListener(){}};
  const document={querySelector:()=>null,title:'Contact',cookie:'',activeElement:settings,getElementById:n=>n==='consent'?banner:settings,querySelectorAll:()=>links,createElement:()=>({}),head:{append:s=>appended.push(s)}};
  const localStorage={getItem(){if(unavailable)throw Error('storage disabled');return stored},setItem(k,v){if(unavailable)throw Error('storage disabled');stored=v}};
  vm.runInNewContext(source,{window,document,localStorage,location:{origin:'https://serialcoders.fr',pathname:'/contact/',hostname:'serialcoders.fr'},Date,encodeURIComponent});
  return {window,appended,banner,settings,buttons,links};
}
test('No Google request before consent or after refusal',()=>{
  const h=harness();assert.equal(h.appended.length,0);assert.equal(h.banner.hidden,false);
  h.buttons[0].events.click();h.links[0].events.click();assert.equal(h.appended.length,0);assert.equal(h.window.dataLayer,undefined);
});
test('Consent loads one tag, records contacts, and withdrawal stops events',()=>{
  const h=harness();h.buttons[1].events.click();assert.equal(h.appended.length,1);
  assert.match(h.appended[0].src,/id=G-TEST123$/);
  const commands=()=>h.window.dataLayer.map(item=>Array.from(item));
  assert.equal(commands()[0][0],'consent');
  h.links[0].events.click();assert.equal(commands().at(-1)[1],'contact_email_click');
  h.buttons[0].events.click();const count=commands().length;
  h.links[0].events.click();assert.equal(commands().length,count);assert.equal(h.window['ga-disable-G-TEST123'],true);
  h.buttons[1].events.click();assert.equal(h.appended.length,1);
});
test('Missing configuration disables consent and tracking',()=>{
  const h=harness({id:''});assert.equal(h.appended.length,0);assert.equal(h.settings.hidden,true);assert.equal(h.banner.hidden,true);
});
test('Expired consent is not silently reused',()=>{
  const h=harness({stored:JSON.stringify({value:'granted',expires:Date.now()-1000})});assert.equal(h.appended.length,0);assert.equal(h.banner.hidden,false);
});
test('Unavailable browser storage does not break consent',()=>{
  const h=harness({unavailable:true});h.buttons[1].events.click();assert.equal(h.appended.length,1);
});
test('Saved refusal stays silent',()=>{
  const h=harness({stored:JSON.stringify({value:'denied',expires:Date.now()+60000})});assert.equal(h.appended.length,0);assert.equal(h.banner.hidden,true);
});
test('All pages have unique SEO metadata and resolvable internal links',async()=>{
  const files=await readdir('dist',{recursive:true});const titles=new Set();
  const htmlFiles=files.filter(p=>p.endsWith('.html')&&p!=='404.html');assert.equal(htmlFiles.length,expectedPageCount);
  for(const file of htmlFiles){
    const html=await readFile(resolve('dist',file),'utf8');
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file);
    const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
    assert.match(html,/<meta name="description" content="[^"]+"/);
    assert.ok(html.includes(`<meta name="robots" content="${config.production ? 'index, follow' : 'noindex, nofollow'}">`));
    assert.ok(!html.includes('href="#"'));
    for(const match of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)){
      const path=match[1];await access(resolve('dist',`.${path}${path.endsWith('/')?'index.html':''}`));
    }
    const json=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1];assert.equal(JSON.parse(json)['@type'],'Organization');
  }
});
test('Robots and sitemap match the release mode and canonical URLs', async () => {
  const robots = await readFile('dist/robots.txt', 'utf8');
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  const origin = new URL(config.origin).origin;
  assert.equal(robots, config.production ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.equal(urls.length, expectedPageCount);
  assert.equal(new Set(urls).size, expectedPageCount);
  for (const url of urls) {
    assert.equal(new URL(url).origin, origin);
    const html = await readFile(resolve('dist', `.${new URL(url).pathname}index.html`), 'utf8');
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
  }
  assert.match(await readFile('dist/404.html', 'utf8'), /name="robots" content="noindex"/);
});
