const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
(async()=>{
 const root=path.resolve(__dirname,'..'),snapshot=JSON.parse(fs.readFileSync(path.join(root,'data/us.json')));
 assert.equal(snapshot.locations.length,new Set(snapshot.locations.map(p=>p.id)).size,'Unique source geographies');
 for(const p of snapshot.locations){assert(p.total>0);assert.equal(p.values.reduce((sum,v)=>sum+v[1],0),p.total,'Categories sum to population '+p.name);assert(p.values.every((r,i,a)=>i===0||a[i-1][1]>=r[1]));}
 assert(snapshot.locations.find(p=>p.id==='us-0653000'),'Actual Oakland source record');
 const server=spawn(process.execPath,['tools/serve.cjs'],{cwd:root,stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Server exited '+code)));});
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  for(let design=1;design<=10;design++){
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
   await page.addInitScript(()=>{window.__spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};window.speechSynthesis.getVoices=()=>[{lang:'es-MX',name:'Test Spanish',localService:true},{lang:'zh-CN',name:'Test Mandarin',localService:true}];window.speechSynthesis.speak=u=>{window.__spoken.push(u.text);u.onend?.();};window.speechSynthesis.cancel=()=>{};});
   await page.goto(`http://127.0.0.1:5198/staging/${design}/`);await page.locator('#app-content').waitFor({state:'visible'});
   assert.equal(await page.locator('#place-label').innerText(),'Oakland');assert.equal(await page.locator('.phrase-section').count(),3);
   assert((await page.locator('#english-label').innerText()).includes('hidden'));
   await page.screenshot({path:path.join(root,'previews',design+'.png'),fullPage:false});
   await page.locator('[data-speak="thanks"][data-language="es"]').first().click();assert.deepEqual(await page.evaluate(()=>window.__spoken),['Gracias']);
   await page.locator('[data-bookmark]').first().click();await page.locator('[data-view=saved]').click();assert(await page.locator('.saved-section').isVisible());
   await page.reload();await page.locator('#app-content').waitFor({state:'visible'});assert(await page.locator('.saved-section').isVisible());
   await page.locator('[data-view=language]').click();assert.equal(await page.locator('.language-section').count(),5);
   await page.locator('#language-count').selectOption('8');assert.equal(await page.locator('.language-section').count(),8);
   await page.locator('#phrase-count').selectOption('8');assert.equal(await page.locator('.phrase-row').count(),64);
   await page.locator('[data-view=phrase]').click();await page.locator('#practice').click();assert((await page.locator('.unrevealed').count())>0);await page.locator('[data-reveal]').first().click();assert(!(await page.locator('[data-reveal]').first().innerText()).includes('Reveal'));
   await page.locator('#practice').click();await page.locator('#phrase-count').selectOption('3');await page.locator('#language-count').selectOption('5');
   await page.locator('#location').fill('California');await page.locator('[data-place="us-06"]').click();assert.equal(await page.locator('#place-label').innerText(),'California');
   await page.locator('#location').fill('Japan');await page.locator('[data-place="country-japan"]').click();assert.equal(await page.locator('#data-label').innerText(),'Learning selection · not ranked');assert(!(await page.locator('.phrase-row').first().innerText()).includes('%'));
   await page.locator('#location').fill('Oakland');await page.locator('[data-place="us-0653000"]').click();
   await page.locator('[data-settings]').click();assert(await page.locator('#modal').isVisible());
   for(const theme of ['design','light','dark','sunset']){
    await page.locator(`button[data-theme=${theme}]`).click();assert.equal(await page.locator('body').getAttribute('data-theme'),theme);
    for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`page overflow ${design}/${theme}/${width}`);assert(await page.locator('#modal').evaluate(e=>e.scrollWidth<=e.clientWidth),`modal overflow ${design}/${theme}/${width}`);}
   }
   await page.locator('button[data-theme=design]').click();await page.mouse.click(1,1);assert(!(await page.locator('#modal').isVisible()));
   await page.setViewportSize({width:390,height:844});await page.locator('[data-share]').click();assert((await page.locator('#share-link').inputValue()).includes('place=us-0653000'));assert.equal(await page.locator('#qr-code img').count(),1);await page.keyboard.press('Escape');
   await page.locator('[data-sources]').last().click();assert((await page.locator('#modal-body').innerText()).includes('not measured top-five rankings'));await page.locator('#modal-footer [data-close]').click();
   await page.locator('[data-library]').click();assert((await page.locator('[data-library-language]').count())>=30);await page.locator('[data-library-language=he]').click();assert((await page.locator('#modal-body').innerText()).includes('תודה'));await page.locator('#modal-footer [data-close]').click();
   await page.setViewportSize({width:1280,height:900});await page.screenshot({path:`/tmp/languages-${design}-desktop.png`});
   await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/tmp/languages-${design}-phone.png`});
   assert.deepEqual(errors,[],`Browser errors ${design}`);await context.close();console.log(`PASS ${design}: real data, search, both views, bookmarks/reload, audio, practice, all palettes at 320/390/1280, modal dismissal, sharing/QR and library`);
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto('http://127.0.0.1:5198/');assert.equal(await page.locator('.design-card').count(),10);await page.screenshot({path:'/tmp/languages-gallery-phone.png',fullPage:true});await page.close();
  console.log('PASS all ten variants and gallery; zero production services needed.');
 }finally{await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
