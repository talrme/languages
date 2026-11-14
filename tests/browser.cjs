const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),{spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['tools/serve.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'5298'},stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Test server exited '+code)));});
 const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
  await page.addInitScript(()=>{window.__spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};window.speechSynthesis.getVoices=()=>[{lang:'es-MX',name:'Test Spanish'}];window.speechSynthesis.speak=u=>{window.__spoken.push(u.text);u.onend?.();};window.speechSynthesis.cancel=()=>{};});
  await page.goto('http://127.0.0.1:5298/');await page.locator('#app-content').waitFor();
  assert.equal(await page.locator('body').getAttribute('data-design'),'7');assert.equal(await page.locator('[data-view]').first().innerText(),'By language');
  assert.equal(await page.locator('[data-view=language]').getAttribute('aria-selected'),'true');assert.equal(await page.locator('.language-section').count(),5);
  assert(!(await page.locator('#results').innerText()).match(/Multiple languages|Other Asian|unspecified|grouped/i));
  assert.equal(await page.locator('.back-gallery,.design-link').count(),0);
  await page.locator('[data-speak=thanks][data-language=es]').first().click();assert.deepEqual(await page.evaluate(()=>window.__spoken),['Gracias']);
  await page.locator('[data-bookmark]').first().click();await page.locator('[data-view=saved]').click();assert(await page.locator('.saved-section').isVisible());
  await page.reload();await page.locator('#app-content').waitFor();assert(await page.locator('.saved-section').isVisible());
  await page.locator('[data-view=language]').click();await page.locator('#language-count').selectOption('10');assert.equal(await page.locator('.language-section').count(),10);
  await page.locator('#location').fill('Japan');await page.locator('[data-place=country-japan]').click();assert.equal(await page.locator('.language-section').count(),10);
  assert(!(await page.locator('#results').innerText()).includes('%'));
  await page.locator('#location').fill('South Africa');await page.locator('[data-place=country-south-africa]').click();assert.equal(await page.locator('.language-section').count(),10);
  await page.locator('#location').fill('Oakland');await page.locator('[data-place=us-0653000]').click();await page.locator('#language-count').selectOption('5');
  await page.locator('.data-info').click();assert.equal(await page.locator('#modal-title').innerText(),'Languages spoken here');assert((await page.locator('#modal-body').innerText()).includes('regional and wider learning suggestions'));await page.mouse.click(1,1);assert(!(await page.locator('#modal').isVisible()));
  await page.locator('[data-view=phrase]').click();await page.locator('#phrase-count').selectOption('8');assert.equal(await page.locator('.phrase-section').count(),8);
  await page.locator('#practice').click();assert(await page.locator('.unrevealed').count()>0);await page.locator('[data-reveal]').first().click();assert(!(await page.locator('[data-reveal]').first().innerText()).includes('Reveal'));await page.locator('#practice').click();
  await page.locator('#phrase-count').selectOption('3');await page.locator('[data-view=language]').click();
  await page.locator('[data-settings]').click();
  for(const theme of ['design','light','dark','sunset']){
   await page.locator(`button[data-theme=${theme}]`).click();assert.equal(await page.locator('body').getAttribute('data-theme'),theme);
   await page.locator('#modal-footer [data-close]').click();
   for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),theme+'/'+width);}
   await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/tmp/languages-metro-${theme}-phone.png`,animations:'disabled'});await page.locator('[data-settings]').click();
  }
  await page.locator('button[data-theme=design]').click();await page.locator('#modal-footer [data-close]').click();
  await page.locator('[data-share]').click();assert((await page.locator('#share-link').inputValue()).includes('/?place=us-0653000'));assert(!(await page.locator('#share-link').inputValue()).includes('staging'));assert.equal(await page.locator('#qr-code img').count(),1);await page.keyboard.press('Escape');
  await page.locator('[data-library]').click();await page.locator('[data-library-language=he]').click();assert((await page.locator('#modal-body').innerText()).includes('תודה'));await page.locator('#modal-footer [data-close]').click();
  await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/languages-metro-desktop.png',animations:'disabled'});
  assert.deepEqual(errors,[]);await context.close();
  const migration=await browser.newContext();const old=await migration.newPage();await old.addInitScript(()=>{if(!localStorage.getItem('languages-v1'))localStorage.setItem('languages-v1',JSON.stringify({view:'phrase',favorites:['es:thanks'],place:'us-0653000',theme:'dark',examples:{c30:'ja'}}));});await old.goto('http://127.0.0.1:5298/');await old.locator('#app-content').waitFor();assert.equal(await old.locator('[data-view=language]').getAttribute('aria-selected'),'true');assert.equal(await old.locator('body').getAttribute('data-theme'),'dark');await old.locator('[data-view=saved]').click();assert((await old.locator('.saved-section').innerText()).includes('Gracias'));await migration.close();
  console.log('PASS Metro production app: language-first migration, no group placeholders, 5/10 language options, short-country padding, truthful information, search, audio, bookmarks/reload, practice, all themes/320/390/1280, root sharing/QR, dialogs and preserved old preferences');
 }finally{await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
