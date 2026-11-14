const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),{spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['tools/serve.cjs'],{cwd:path.resolve(__dirname,'..'),stdio:['ignore','pipe','pipe']});await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const c=await browser.newContext({viewport:{width:390,height:844},geolocation:{latitude:37.8044,longitude:-122.2712},permissions:['geolocation']}),p=await c.newPage(),external=[];
  p.on('request',r=>{if(new URL(r.url()).origin!=='http://127.0.0.1:5198')external.push(r.url());});
  await p.goto('http://127.0.0.1:5198/staging/1/');await p.locator('#app-content').waitFor();
  assert.equal(await p.locator('.topbar').count(),1);
  await p.locator('[data-locate]').click();await p.getByRole('heading',{name:'Nearby covered location'}).waitFor();assert((await p.locator('#modal-body').innerText()).includes('Oakland'));await p.locator('#modal-footer [data-place]').click();assert.equal(await p.locator('#place-label').innerText(),'Oakland');
  await p.locator('#location').fill('Paris');assert((await p.locator('#suggestions').innerText()).includes('Country overview, not city data'));await p.locator('[data-place=country-france]').click();assert.equal(await p.locator('#place-label').innerText(),'France');
  await p.locator('#location').fill('zzzz-not-covered');assert((await p.locator('#suggestions').innerText()).includes('No covered location'));await p.keyboard.press('Escape');
  await p.locator('#location').fill('Oakland');await p.keyboard.press('ArrowDown');await p.keyboard.press('Enter');assert.equal(await p.locator('#place-label').innerText(),'Oakland');
  await p.locator('[data-category=c30]').first().click();await p.locator('#category-example').selectOption('ja');assert((await p.locator('.phrase-row').nth(2).innerText()).includes('Japanese'));
  await p.reload();await p.locator('#app-content').waitFor();assert((await p.locator('.phrase-row').nth(2).innerText()).includes('Japanese'));
  await p.locator('[data-settings]').click();await p.locator('[data-setting=hideEnglish]').uncheck();await p.locator('#modal-footer [data-close]').click();assert((await p.locator('.phrase-row').first().innerText()).includes('English'));
  await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload();await p.locator('#app-content').waitFor();await p.waitForTimeout(300);
  await c.setOffline(true);await p.reload();await p.locator('#app-content').waitFor();assert.equal(await p.locator('#place-label').innerText(),'Oakland');await c.setOffline(false);
  assert.deepEqual(external,[],'No third-party requests during ordinary app use/geolocation comparison');
  await c.close();
  const denied=await browser.newContext();const page=await denied.newPage();await page.addInitScript(()=>{navigator.geolocation.getCurrentPosition=(_,error)=>error({code:1});window.speechSynthesis.getVoices=()=>[];});await page.goto('http://127.0.0.1:5198/staging/2/');await page.locator('#app-content').waitFor();await page.locator('[data-locate]').click();assert((await page.locator('#toast').innerText()).includes('Could not get your location'));assert(await page.locator('[data-speak]').first().isDisabled());
  for(const d of [1,4,5,6,9,10]){await page.goto(`http://127.0.0.1:5198/staging/${d}/`);await page.locator('#app-content').waitFor();await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/tmp/languages-${d}-desktop-top.png`,animations:'disabled'});await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/tmp/languages-${d}-phone-clean.png`,animations:'disabled'});}
  await denied.close();console.log('PASS permission/nearest-place confirmation, explicit country fallback, unsupported search, keyboard selection, grouped examples/reload, English toggle, offline revisit, zero external data calls and unavailable voices');
 }finally{await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
