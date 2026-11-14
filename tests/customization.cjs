const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),{spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['tools/serve.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'5300'},stdio:['ignore','pipe','pipe']});
 let browser;
 try{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Test server exited '+code)));});
  browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',serviceWorkers:'block'}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{window.__spoken=[];window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};window.speechSynthesis.getVoices=()=>[{lang:'es-MX',name:'Test Spanish'}];window.speechSynthesis.speak=u=>{window.__spoken.push(u.text);u.onend?.();};window.speechSynthesis.cancel=()=>{};});
  await page.goto('http://127.0.0.1:5300/');await page.locator('#app-content').waitFor();
  await page.locator('#phrase-count').selectOption('50');assert.equal(await page.locator('.language-section').first().locator('.phrase-row').count(),50);
  await page.locator('[data-speak=coffee][data-language=es]').click();assert.deepEqual(await page.evaluate(()=>window.__spoken),['Café']);
  await page.locator('[data-bookmark="es:coffee"]').click();await page.locator('[data-view=saved]').click();assert((await page.locator('.saved-section').innerText()).includes('Café'));await page.locator('[data-view=language]').click();
  for(const count of [15,20,25,30]){await page.locator('#language-count').selectOption(String(count));assert.equal(await page.locator('.language-section').count(),count);}
  const before=Date.now();await page.locator('#language-count').selectOption('99');assert.equal(await page.locator('.phrase-row').count(),35*50);console.log('All 35 non-English languages × 50 phrases rendered in',Date.now()-before,'ms');
  await page.locator('#language-count').selectOption('5');await page.locator('#phrase-count').selectOption('3');
  await page.locator('#phrase-count').selectOption('custom');await page.locator('[data-pick-clear]').click();assert(await page.locator('[data-pick-apply]').isDisabled());
  await page.locator('#picker-search').fill('coffee');assert.equal(await page.locator('.selection-item:visible').count(),1);await page.locator('[data-pick-key=coffee]').check();
  await page.locator('#picker-search').fill('');await page.locator('[data-pick-key=hello]').check();await page.locator('[data-pick-key=thanks]').check();await page.locator('[data-pick-apply]').click();
  assert.equal(await page.locator('#phrase-count').inputValue(),'custom');assert.equal(await page.locator('.language-section').first().locator('.phrase-row').count(),3);assert(await page.locator('[data-pick=phrases]').isVisible());
  await page.locator('#language-count').selectOption('custom');await page.locator('[data-pick-clear]').click();
  for(const id of ['es','he','en']){await page.locator('[data-pick-key='+id+']').check();}
  await page.locator('[data-pick-apply]').click();assert.equal(await page.locator('.language-section').count(),3);assert((await page.locator('.language-section h2').allTextContents()).includes('English'));
  await page.reload();await page.locator('#app-content').waitFor();assert.equal(await page.locator('#phrase-count').inputValue(),'custom');assert.equal(await page.locator('#language-count').inputValue(),'custom');assert.equal(await page.locator('.phrase-row').count(),9);
  await page.locator('#phrase-count').selectOption('50');await page.locator('#language-count').selectOption('20');
  await page.locator('#phrase-count').selectOption('custom');assert.equal(await page.locator('[data-pick-key]:checked').count(),3);await page.locator('[data-pick-apply]').click();
  await page.locator('#language-count').selectOption('custom');assert.equal(await page.locator('[data-pick-key]:checked').count(),3);await page.locator('[data-pick-apply]').click();assert.equal(await page.locator('.phrase-row').count(),9);
  await page.locator('[data-pick=phrases]').click();await page.locator('[data-pick-all]').click();assert.equal(await page.locator('[data-pick-key]:checked').count(),50);await page.locator('#modal-footer [data-close]').click();assert.equal(await page.locator('.phrase-row').count(),9);
  await page.locator('[data-pick=languages]').click();await page.locator('[data-pick-clear]').click();await page.mouse.click(1,1);assert.equal(await page.locator('.language-section').count(),3);
  await page.locator('[data-view=phrase]').click();assert.equal(await page.locator('.phrase-section').count(),3);assert.equal(await page.locator('.phrase-row').count(),9);await page.locator('[data-view=language]').click();
  for(const theme of ['design','light','dark','sunset']){
   await page.locator('[data-settings]').click();await page.locator(`button[data-theme=${theme}]`).click();await page.locator('#modal-footer [data-close]').click();
   for(const width of [320,390,1280]){
    await page.setViewportSize({width,height:844});await page.evaluate(()=>scrollTo(0,0));
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),theme+'/'+width);
    const boxes=await page.locator('.display-options > *').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {left:r.left,right:r.right};}));
    assert(boxes[0].right<=boxes[1].left+1&&boxes[1].right<=boxes[2].left+1,'Controls must not overlap');
    if(width===390)await page.screenshot({path:`/tmp/languages-custom-${theme}-phone.png`,animations:'disabled'});
    await page.locator('[data-pick=phrases]').click();await page.locator('#picker-search').fill('zzzz');assert(await page.locator('#picker-empty').isVisible());await page.locator('#picker-search').fill('');assert(await page.evaluate(()=>document.querySelector('#modal').scrollWidth<=document.querySelector('#modal').clientWidth));
    if(width===390)await page.screenshot({path:`/tmp/languages-picker-${theme}-phone.png`,animations:'disabled'});await page.keyboard.press('Escape');
   }
  }
  assert.deepEqual(errors,[]);await context.close();console.log('PASS 50 phrases, intermediate counts, custom sets, filters, clear/all, empty protection, cancel/outside/Escape, English selection, persistence, both views and every palette at phone/desktop sizes');
 }finally{await browser?.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
