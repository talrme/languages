const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),{spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['tools/serve.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'5301'},stdio:['ignore','pipe','pipe']});let browser;
 try{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Test server exited '+code)));});
  browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:5301/');await page.locator('#app-content').waitFor();await page.locator('[data-worldwide]').click();
  assert.equal(await page.locator('[data-worldwide]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(await page.locator('.language-section h2').allTextContents(),['Mandarin','Hindi','Spanish','Arabic','French']);
  assert(!(await page.locator('#results').innerText()).includes('%'));
  await page.locator('#language-count').selectOption('99');assert.equal(await page.locator('.language-section').count(),22);
  await page.locator('.data-info').click();assert.equal(await page.locator('#modal-title').innerText(),'Worldwide languages');assert((await page.locator('#modal-body').innerText()).includes('native speakers plus'));await page.keyboard.press('Escape');
  await page.locator('.language-section').first().locator('[data-category]').click();assert((await page.locator('#modal-body').innerText()).includes('Worldwide rank 2'));await page.keyboard.press('Escape');
  await page.reload();await page.locator('#app-content').waitFor();assert.equal(await page.locator('#place-label').innerText(),'Worldwide');
  await page.locator('[data-share]').click();assert((await page.locator('#share-link').inputValue()).endsWith('?place=worldwide'));await page.keyboard.press('Escape');
  await page.locator('[data-worldwide]').click();assert.equal(await page.locator('#place-label').innerText(),'Oakland');
  await page.locator('#location').fill('global');await page.locator('[data-place=worldwide]').click();await page.locator('#language-count').selectOption('5');
  await page.locator('#language-count').selectOption('custom');await page.locator('[data-pick-clear]').click();await page.locator('[data-pick-key=he]').check();await page.locator('[data-pick-apply]').click();assert.equal(await page.locator('.language-section h2').innerText(),'Hebrew');
  await page.locator('.percent').click();assert((await page.locator('#modal-body').innerText()).includes('no worldwide rank'));await page.keyboard.press('Escape');await page.locator('#language-count').selectOption('5');
  for(const theme of ['design','light','dark','sunset']){
   await page.locator('[data-settings]').click();await page.locator(`button[data-theme=${theme}]`).click();await page.locator('[data-setting=hideEnglish]').uncheck();await page.locator('#modal-footer [data-close]').click();
   assert.equal((await page.locator('.language-section h2').allTextContents())[0],'English');
   for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});await page.evaluate(()=>scrollTo(0,0));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{scrollTo({top:0,behavior:'instant'});return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});await page.screenshot({path:`/tmp/languages-worldwide-${theme}-phone.png`,animations:'disabled'});
  }
  const fresh=await browser.newContext({serviceWorkers:'block'}),linked=await fresh.newPage();await linked.goto('http://127.0.0.1:5301/?place=worldwide');await linked.locator('#app-content').waitFor();assert.equal(await linked.locator('#place-label').innerText(),'Worldwide');await fresh.close();
  assert.deepEqual(errors,[]);await context.close();console.log('PASS worldwide order, supported-only ranking, English filter, counts, provenance, search/global alias, custom choices, persistence, location return, shared deep link and every palette at 320/390/1280');
 }finally{await browser?.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
