import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
fs.copyFileSync(path.join(root,'tools/page.html'),path.join(root,'index.html'));
fs.writeFileSync(path.join(root,'manifest.webmanifest'),JSON.stringify({id:'./',name:'Languages',short_name:'Languages',start_url:'./',scope:'./',display:'standalone',background_color:'#f5f8fc',theme_color:'#1760c3',icons:[{src:'assets/icon-192.png',sizes:'192x192',type:'image/png'},{src:'assets/icon-512.png',sizes:'512x512',type:'image/png'}]},null,2));
fs.writeFileSync(path.join(root,'sw.js'),`const CACHE='languages-metro-v2';self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith('languages-')&&name!==CACHE)await caches.delete(name);await self.clients.claim();})()));self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(cache=>cache.put(e.request,copy)).catch(()=>{}));}return response;}).catch(()=>caches.match(e.request).then(cached=>cached||Response.error())));});`);
console.log('Built Languages production app: Metro Lines.');
