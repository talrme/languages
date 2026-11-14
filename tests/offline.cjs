const {chromium}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path'),{spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['tools/serve.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'5299'},stdio:['ignore','pipe','pipe']});
 let browser;
 try{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Test server exited '+code)));});
  browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const context=await browser.newContext(),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:5299/languages/');await page.locator('#app-content').waitFor();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;await new Promise(resolve=>{if(navigator.serviceWorker.controller)resolve();else navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});});});
  await page.reload();await page.locator('#app-content').waitFor();
  await page.waitForFunction(async()=>{const cache=await caches.open('languages-metro-v2');const requests=await cache.keys();return requests.some(r=>r.url.endsWith('/data/us.json'))&&requests.some(r=>r.url.includes('/shared/selection.js'));});
  await context.setOffline(true);await page.reload();await page.locator('#app-content').waitFor();assert.equal(await page.locator('.language-section').count(),5);
  await page.locator('#location').fill('Japan');await page.locator('[data-place=country-japan]').click();assert.equal(await page.locator('.language-section').count(),5);
  assert.deepEqual(errors,[]);await context.close();console.log('PASS production subpath, service-worker caching, offline reload and offline country search');
 }finally{await browser?.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
