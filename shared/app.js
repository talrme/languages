import {languages,phraseKeys,phraseNames,notes} from './phrases.js';
import {countries,cityFallbacks} from './countries.js';
import {designs} from './designs.js';
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=new URL('../',import.meta.url),design=designs.find(d=>d.id===Number(document.body.dataset.design)),storeKey='languages-v1';
const icon=(name)=>`<i data-lucide="${name}" aria-hidden="true"></i>`;
let saved={};try{saved=JSON.parse(localStorage.getItem(storeKey)||'{}');}catch{}
let state={place:'us-0653000',view:'phrase',hideEnglish:true,count:5,phrases:3,roman:true,motion:true,theme:'design',favorites:[],examples:{},...saved},snapshot,locations=[],practice=false,revealed=new Set(),toastTimer,voices=[],returnFocus;
const persist=()=>{try{localStorage.setItem(storeKey,JSON.stringify(state));}catch{toast('This browser could not save your preferences.');}};
const icons=()=>window.lucide.createIcons();
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4200);}
const place=()=>locations.find(p=>p.id===state.place)||locations.find(p=>p.id==='us-0653000')||locations[0];
const displayName=p=>p.name.replace(/ city(?=,)| town(?=,)| CDP(?=,)| municipality(?=,)/g,'');
const categoryMap={2:'en',3:'es',6:'fr',9:'ht',12:'it',15:'pt',18:'de',24:'el',27:'ru',30:'pl',39:null,42:'fa',48:'hi',51:'ur',54:'pa',57:'bn',69:'ta',75:'zh',78:'ja',81:'ko',87:'vi',99:'tl',105:'ar',108:'he',c2:'en',c3:'es',c6:'fr',c9:'de',c12:'ru',c18:'ko',c21:'zh',c24:'vi',c27:'tl',c33:'ar'};
function populationRows(p=place()){
 if(p.curated)return p.ids.map(id=>({id,name:languages[id].name,category:id,note:'Learning selection'}));
 if(p.stats)return p.stats.map(([id,percent])=>({id,name:languages[id].name,category:id,percent}));
 return p.values.map(([code,count,moe])=>{
  const category=String(code),id=state.examples[category]||categoryMap[category]||null,name=snapshot.categories[category];
  return {id,name,category,count,moe,percent:count/p.total*100,grouped:!!id&&name!==languages[id].name&&id!=='en',note:id&&name!==languages[id].name?`Example: ${languages[id].name}`:''};
 });
}
function rows(){return populationRows().filter(r=>!(state.hideEnglish&&r.id==='en')).slice(0,Number(state.count)||99);}
function pct(row){return row.percent===undefined?'':row.percent<.1?'<0.1%':row.percent.toFixed(1)+'%';}
function voiceFor(id){
 const lang=languages[id].voice.toLowerCase(),exact=voices.find(v=>v.lang.toLowerCase()===lang);if(exact)return exact;
 if(id==='yue')return voices.find(v=>/^(yue(?:-|$)|zh-hk$)/i.test(v.lang));
 if(id==='zh')return voices.find(v=>/^zh(?:-|$)/i.test(v.lang)&&!/-hk(?:-|$)/i.test(v.lang));
 if(id==='tl')return voices.find(v=>/^(fil|tl)(?:-|$)/i.test(v.lang));
 return voices.find(v=>v.lang.toLowerCase().split('-')[0]===lang.split('-')[0]);
}
function refreshVoices(){voices=window.speechSynthesis?.getVoices()||[];document.querySelectorAll('[data-speak]').forEach(b=>{const ok=!!voiceFor(b.dataset.language);b.disabled=!ok;b.title=ok?'Listen':'No matching voice on this device';});}
function translation(row,key){
 if(!row.id)return `<button class="group-placeholder" data-category="${esc(row.category)}">${icon('layers')}<span>Multiple languages<small>Choose an example</small></span></button>`;
 const id=row.id,text=languages[id].phrases[key],bookmark=id+':'+key,isSaved=state.favorites.includes(bookmark),hidden=practice&&!revealed.has(bookmark);
 return `<div class="translation ${hidden?'unrevealed':''}"><button class="words" data-reveal="${bookmark}" data-language-info="${id}" ${hidden?'aria-label="Reveal translation"':''}><strong lang="${languages[id].voice}" dir="auto">${hidden?'Reveal':esc(text.native)}</strong>${state.roman&&text.roman&&!hidden?`<small>${esc(text.roman)}</small>`:''}</button><div class="word-actions"><button class="icon-button listen" data-speak="${key}" data-language="${id}" title="Listen" aria-label="Listen: ${esc(languages[id].name)} ${phraseNames[key]}" ${voiceFor(id)?'':'disabled'}>${icon('volume-2')}</button><button class="icon-button bookmark ${isSaved?'saved':''}" data-bookmark="${bookmark}" aria-pressed="${isSaved}" aria-label="${isSaved?'Unsave':'Save'} ${esc(languages[id].name)} ${phraseNames[key]}">${icon(isSaved?'bookmark-check':'bookmark')}</button></div></div>`;
}
function render(){
 const p=place();document.body.dataset.theme=state.theme;document.body.classList.toggle('reduce-motion',!state.motion);
 $('#location').value=displayName(p);$('#place-label').textContent=displayName(p).split(',')[0];
 $('#data-label').textContent=p.curated?'Learning selection · not ranked':p.stats?'2021 home-language estimates':'2020–2024 · home languages, age 5+';
 $('#english-label').textContent=state.hideEnglish?'English hidden':'English included';
 $('#language-count').value=String(state.count);$('#phrase-count').value=String(state.phrases);
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-selected',String(state.view===b.dataset.view)));
 $('#practice').setAttribute('aria-pressed',String(practice));$('#practice').classList.toggle('selected',practice);
 const active=rows(),keys=phraseKeys.slice(0,state.phrases),container=$('#results');
 if(state.view==='saved'){
  const favorites=state.favorites.map(value=>{const [id,key]=value.split(':');return languages[id]&&phraseNames[key]?{id,key}:null;}).filter(Boolean);
  container.innerHTML=favorites.length?`<section class="phrase-section saved-section"><header><span class="section-number">★</span><h2>Saved phrases</h2></header>${favorites.map(({id,key})=>`<article class="phrase-row"><div class="row-label"><span>${esc(languages[id].name)}</span><small>${phraseNames[key]}</small></div>${translation({id},key)}</article>`).join('')}</section>`:`<div class="empty-state">${icon('bookmark')}<h2>No saved phrases yet</h2><p>Your bookmarks will stay on this device.</p><button data-switch-explore>Explore phrases</button></div>`;
 }else if(state.view==='language'){
  container.innerHTML=active.map((row,i)=>`<section class="phrase-section language-section" style="--section-index:${i}"><header><span class="section-number">${String(i+1).padStart(2,'0')}</span><div><h2>${esc(row.name==='Speak only English'?'English':row.name)}</h2>${row.note?`<small>${esc(row.note)}</small>`:''}</div><button class="percent" data-category="${esc(row.category)}">${pct(row)||icon('info')}</button></header>${keys.map(key=>`<article class="phrase-row"><div class="row-label"><span>${phraseNames[key]}</span></div>${translation(row,key)}</article>`).join('')}</section>`).join('');
 }else{
  container.innerHTML=keys.map((key,i)=>`<section class="phrase-section" id="phrase-${key}" style="--section-index:${i}"><header><span class="section-number">${String(i+1).padStart(2,'0')}</span><h2>${phraseNames[key]}</h2><span class="section-symbol" aria-hidden="true">${['♡','☀','↗','✦','◌','↺','✓','×'][i]}</span></header>${active.map(row=>`<article class="phrase-row"><button class="row-label" data-category="${esc(row.category)}"><span>${esc(row.id?languages[row.id].name:row.name)}</span><small>${pct(row)}${row.grouped?' · grouped':''}</small></button>${translation(row,key)}</article>`).join('')}</section>`).join('');
 }
 if(!active.length&&state.view!=='saved')container.innerHTML='<div class="empty-state"><h2>English is hidden</h2><p>Include English or browse the full phrase library.</p><button data-library>All languages</button></div>';
 $('#phrase-nav').innerHTML=keys.map(key=>`<button data-jump="${key}">${phraseNames[key]}</button>`).join('');
 $('#phrase-nav').hidden=design.id!==8||state.view!=='phrase';
 icons();refreshVoices();persist();
}
function modal(title,body,footer='<button class="primary" data-close>Done</button>'){
 returnFocus=document.activeElement;$('#modal-title').textContent=title;$('#modal-body').innerHTML=body;$('#modal-footer').innerHTML=footer;icons();if(!$('#modal').open)$('#modal').showModal();
}
function close(){if($('#modal').open)$('#modal').close();returnFocus?.focus?.({preventScroll:true});}
function info(category){
 const row=populationRows().find(r=>r.category===category);if(!row)return;
 const p=place(),grouped=row.grouped||!row.id;
 const text=p.curated?p.basis:p.stats?p.basis:`${Number(row.count).toLocaleString()} estimated residents age 5+ (${pct(row)} of ${p.total.toLocaleString()}).${row.moe!==null?' Count margin of error: ±'+Number(row.moe).toLocaleString()+' at 90% confidence.':''} This is language spoken at home, not the ability to speak a language. Close estimates can change order within sampling uncertainty.`;
 modal(row.name==='Speak only English'?'English only at home':row.name,`<p>${esc(text)}</p>${grouped?'<p class="callout">This Census category combines languages. Its percentage cannot be attributed to a single language. Any translation shown is an example only.</p>':''}${row.id?`<p>${esc(notes[row.id]||notes.default)}</p>`:''}${!row.id?`<label>Example language<select id="category-example"><option value="">Choose a language</option>${Object.values(languages).filter(l=>l.id!=='en').map(l=>`<option value="${l.id}">${l.name}</option>`).join('')}</select></label><p class="fine">This is your learning choice, not evidence that the selected language accounts for this category.</p>`:''}<button class="text-button" data-sources>Sources & coverage</button>`);
 if($('#category-example'))$('#category-example').onchange=e=>{if(e.target.value){state.examples[category]=e.target.value;render();close();}};
}
function sources(){const p=place();modal('Sources & coverage',`<h3>${esc(displayName(p))}</h3><p>${esc(p.curated||p.stats?p.basis:snapshot.basis)}</p><p>U.S. cities use C16001 (broader categories). States and the U.S. use B16001 (more detail). Percentages use all residents age 5+, even when English is hidden. “English” counts English-only households, not everyone who knows English. Grouped categories remain grouped.</p><p>Countries marked “Learning selection” are curated starting points, <strong>not measured top-five rankings</strong>. They are incomplete and have no invented percentages. Australia uses its 2021 Census. Different country measures are not directly comparable.</p><p>${snapshot.locations.length.toLocaleString()} U.S. locations and ${countries.length} country/territory profiles are packaged with the app. Smaller or unlisted cities may need a state/country selection. Location lookup proposes the closest covered U.S. city, never silently substitutes it.</p><p>Phrase forms are a starter learning library, not certified translations. Politeness, dialect, gender and context matter; tap a phrase for notes. Romanization is a reading aid, not precise phonetics. Mandarin is only an example for the combined Chinese category. Audio uses matching device voices; availability, quality, accents and offline support vary.</p><ul class="source-links"><li><a target="_blank" rel="noreferrer" href="https://www.census.gov/topics/population/language-use/about.html">Census: language use methodology</a></li><li><a target="_blank" rel="noreferrer" href="${snapshot.source}">Official U.S. detailed table snapshot</a></li><li><a target="_blank" rel="noreferrer" href="https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/acsdt5y2024-c16001.dat">Official U.S. city-category snapshot</a></li><li><a target="_blank" rel="noreferrer" href="https://www.abs.gov.au/statistics/people/people-and-communities/cultural-diversity-census/2021">Australian Bureau of Statistics, 2021</a></li><li><a target="_blank" rel="noreferrer" href="https://en.wikivoyage.org/wiki/Phrasebooks">Phrasebook reference for further learning</a></li></ul>`);}
function settings(){modal('Settings',`<details open><summary>Appearance</summary><div class="settings-fields"><div class="swatches" role="group" aria-label="Color scheme">${[['design','This design','#44836a'],['light','Light','#e5e9e8'],['dark','Dark','#23252c'],['sunset','Sunset','#e59384']].map(([id,name,color])=>`<button data-theme="${id}" aria-pressed="${state.theme===id}" title="${name}" aria-label="${name}" style="--swatch:${color}"><span></span>${name}</button>`).join('')}</div><label class="toggle">Animations<input type="checkbox" data-setting="motion" ${state.motion?'checked':''}></label></div></details><details open><summary>Learning</summary><div class="settings-fields"><label class="toggle">Hide English<input type="checkbox" data-setting="hideEnglish" ${state.hideEnglish?'checked':''}></label><label class="toggle">Show romanization<input type="checkbox" data-setting="roman" ${state.roman?'checked':''}></label><label>Speaking speed<input id="speech-rate" type="range" min="0.5" max="1" step="0.1" value="${state.rate||.8}"></label><p class="fine">Device voices only. No audio is downloaded by this app. Your device may use a network voice.</p></div></details><details><summary>About & data</summary><div class="settings-fields"><button class="text-button" data-sources>Sources & coverage</button><a href="${root.href}">Compare all 10 designs</a><button class="text-button" data-reset>Reset local preferences</button></div></details>`);}
function library(){modal('All languages',`<div class="language-library">${Object.values(languages).filter(l=>!state.hideEnglish||l.id!=='en').map(l=>`<button data-library-language="${l.id}">${l.name}${icon('chevron-right')}</button>`).join('')}</div>`);}
function libraryLanguage(id){const row={id};modal(languages[id].name,`<p class="fine">${esc(notes[id]||notes.default)}</p>${phraseKeys.map(key=>`<article class="phrase-row"><div class="row-label"><span>${phraseNames[key]}</span></div>${translation(row,key)}</article>`).join('')}`);refreshVoices();}
function share(){const url=new URL(location.href);url.search='';url.searchParams.set('place',state.place);modal('Save / Share',`<div class="install-heading"><img src="${root}assets/icon-192.png" width="48" height="48" alt=""><div><h3>Save Languages</h3><small>${esc(displayName(place()))}</small></div></div><h4>iPhone</h4><p>In Safari, tap Share, then Add to Home Screen.</p><h4>Android</h4><p>In Chrome, open the menu, then Add to Home screen or Install app.</p><hr><label>Share this location<input id="share-link" readonly value="${esc(url.href)}"></label><div class="share-buttons"><button class="primary" data-copy>${icon('copy')}Copy link</button><button data-native-share>${icon('share-2')}Share</button></div><div id="qr-code" class="qr-code"></div>`);new window.QRCode($('#qr-code'),{text:url.href,width:160,height:160,colorDark:'#182f29',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});}
function choosePlace(id){const next=locations.find(p=>p.id===id);if(!next)return;state.place=id;practice=false;revealed.clear();$('#suggestions').hidden=true;render();}
const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function search(){const query=normalize($('#location').value.trim()),box=$('#suggestions');if(!query){box.hidden=true;return;}
 let matches=locations.filter(p=>normalize(displayName(p)).includes(query)).sort((a,b)=>(normalize(displayName(a)).startsWith(query)?0:1)-(normalize(displayName(b)).startsWith(query)?0:1)||displayName(a).length-displayName(b).length).slice(0,9);
 const fallback=cityFallbacks[query],country=fallback&&locations.find(p=>p.name===fallback);if(country&&!matches.some(p=>p.id===country.id))matches.unshift({...country,fallback:query});
 box.innerHTML=matches.length?matches.map(p=>`<button role="option" data-place="${p.id}"><span>${esc(displayName(p))}</span><small>${p.fallback?'Country overview, not city data':p.kind+(p.curated?' · learning selection':'')}</small></button>`).join(''):'<p>No covered location found. Try a state or country name.</p>';box.hidden=false;
}
async function locate(){
 if(!navigator.geolocation)return toast('Location is unavailable. Search for a place instead.');const button=$('[data-locate]');button.disabled=true;
 navigator.geolocation.getCurrentPosition(position=>{button.disabled=false;const {latitude:lat,longitude:lon}=position.coords;
  const rad=n=>n*Math.PI/180,distance=p=>{const [a,b]=p.coords;const h=Math.sin(rad(a-lat)/2)**2+Math.cos(rad(lat))*Math.cos(rad(a))*Math.sin(rad(b-lon)/2)**2;return 6371*2*Math.asin(Math.min(1,Math.sqrt(h)));};
  const cities=locations.filter(p=>p.kind==='city'&&p.coords).map(p=>({p,km:distance(p)})).sort((a,b)=>a.km-b.km);const nearest=cities[0];
  modal('Nearby covered location',`<p>${esc(displayName(nearest.p))}</p><p class="fine">About ${Math.round(nearest.km)} km from your device. This is a nearby covered city, not a determination of your city or its boundaries. Coordinates are compared on this device and are not stored or sent to our servers.</p>`,`<button data-close>Cancel</button><button class="primary" data-place="${nearest.p.id}" data-close>Use this city</button>`);
 },()=>{button.disabled=false;toast('Could not get your location. You can still search for a place.');},{timeout:12000,maximumAge:300000});
}
document.addEventListener('click',async event=>{
 const b=event.target.closest('button,a');if(!b)return;
 if(b.matches('[data-view]')){state.view=b.dataset.view;revealed.clear();render();}
 if(b.matches('[data-switch-explore]')){state.view='phrase';render();}
 if(b.matches('[data-settings]'))settings();if(b.matches('[data-sources]'))sources();if(b.matches('[data-share]'))share();if(b.matches('[data-locate]'))locate();
 if(b.matches('[data-close]'))close();if(b.matches('[data-library]'))library();if(b.matches('[data-library-language]'))libraryLanguage(b.dataset.libraryLanguage);
 if(b.matches('[data-category]'))info(b.dataset.category);
 if(b.matches('[data-theme]')){state.theme=b.dataset.theme;render();$('#modal-body').querySelectorAll('[data-theme]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));}
 if(b.matches('[data-place]'))choosePlace(b.dataset.place);
 if(b.matches('[data-bookmark]')){const key=b.dataset.bookmark;state.favorites=state.favorites.includes(key)?state.favorites.filter(x=>x!==key):[...state.favorites,key];b.setAttribute('aria-pressed',String(state.favorites.includes(key)));b.classList.toggle('saved',state.favorites.includes(key));b.innerHTML=icon(state.favorites.includes(key)?'bookmark-check':'bookmark');persist();if(state.view==='saved'&&!$('#modal').open)render();icons();}
 if(b.matches('[data-reveal]')){if(practice){revealed.add(b.dataset.reveal);render();}else{const id=b.dataset.languageInfo;modal(languages[id].name,`<p>${esc(notes[id]||notes.default)}</p><p class="fine">${esc(notes.default)}</p><button class="text-button" data-library-language="${id}">All phrases in ${esc(languages[id].name)}</button>`);}}
 if(b.matches('[data-speak]')&&!b.disabled){const id=b.dataset.language,voice=voiceFor(id);if(!voice)return;window.speechSynthesis.cancel();const text=languages[id].phrases[b.dataset.speak].native.split(' / ')[0],speech=new SpeechSynthesisUtterance(text);speech.lang=languages[id].voice;speech.voice=voice;speech.rate=state.rate||.8;b.classList.add('speaking');const done=()=>b.classList.remove('speaking');speech.onend=done;speech.onerror=()=>{done();toast('Audio could not play with this device voice.');};window.speechSynthesis.speak(speech);}
 if(b.id==='practice'){practice=!practice;revealed.clear();render();}
 if(b.matches('[data-jump]'))$('#phrase-'+b.dataset.jump)?.scrollIntoView({behavior:state.motion?'smooth':'instant',block:'nearest',inline:'start'});
 if(b.matches('[data-copy]')){try{await navigator.clipboard.writeText($('#share-link').value);toast('Link copied');}catch{$('#share-link').select();toast('Select and copy the link.');}}
 if(b.matches('[data-native-share]')){if(navigator.share){try{await navigator.share({title:'Languages',url:$('#share-link').value});}catch{}}else{try{await navigator.clipboard.writeText($('#share-link').value);toast('Link copied');}catch{toast('Select and copy the link.');}}}
 if(b.matches('[data-reset]'))modal('Reset preferences?', '<p>This removes bookmarks and settings from this browser only.</p>','<button data-close>Cancel</button><button class="primary" data-confirm-reset>Reset</button>');
 if(b.matches('[data-confirm-reset]')){localStorage.removeItem(storeKey);location.href=location.pathname;}
 if(!event.target.closest('.location-search'))$('#suggestions').hidden=true;
});
document.addEventListener('change',e=>{if(e.target.matches('[data-setting]')){state[e.target.dataset.setting]=e.target.checked;render();}if(e.target.id==='speech-rate'){state.rate=Number(e.target.value);persist();}});
$('#language-count').onchange=e=>{state.count=Number(e.target.value);render();};$('#phrase-count').onchange=e=>{state.phrases=Number(e.target.value);render();};
$('#location').addEventListener('input',search);$('#location').addEventListener('focus',()=>$('#location').select());
$('#location').addEventListener('keydown',e=>{if(e.key==='Escape')$('#suggestions').hidden=true;if(e.key==='ArrowDown'){e.preventDefault();$('#suggestions button')?.focus();}if(e.key==='Enter'){e.preventDefault();$('#suggestions button')?.click();}});
$('#suggestions').addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','Escape'].includes(e.key))return;e.preventDefault();if(e.key==='Escape'){$('#suggestions').hidden=true;$('#location').focus();return;}const buttons=[...$('#suggestions').querySelectorAll('button')],i=buttons.indexOf(document.activeElement);buttons[(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();});
$('#modal').addEventListener('click',e=>{if(e.target!==$('#modal'))return;const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();});
if(window.speechSynthesis)window.speechSynthesis.addEventListener('voiceschanged',refreshVoices);
async function start(){try{
 const response=await fetch(new URL('data/us.json',root));if(!response.ok)throw Error('Snapshot unavailable');snapshot=await response.json();locations=[...snapshot.locations,...countries];
 const requested=new URL(location.href).searchParams.get('place');if(locations.some(p=>p.id===requested))state.place=requested;
 $('#loading').hidden=true;$('#app-content').hidden=false;$('#design-name').textContent=design.name;refreshVoices();render();
 if('serviceWorker' in navigator)navigator.serviceWorker.register(new URL('sw.js',root),{scope:root.pathname}).catch(()=>{});
}catch{$('#loading').innerHTML='<p>The saved language data could not load.</p><button onclick="location.reload()">Try again</button>';}}
start();
