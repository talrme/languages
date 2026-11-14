import {languages} from './phrases.js';

const exact={2:'en',3:'es',9:'ht',12:'it',15:'pt',18:'de',24:'el',27:'ru',30:'pl',48:'hi',51:'ur',54:'pa',57:'bn',69:'ta',78:'ja',81:'ko',87:'vi',105:'ar',108:'he',c2:'en',c3:'es',c18:'ko',c24:'vi',c33:'ar'};
const examples={6:['fr'],42:['fa'],75:['zh','yue'],99:['tl'],c6:['fr','ht'],c9:['de'],c12:['ru','pl'],c21:['zh','yue'],c27:['tl']};
const regional={
 es:['pt','en','fr','it','de','zh','ar','ja','he','ru','ko'],
 fr:['ar','en','pt','es','it','de','tr','zh','vi','ru','ht'],
 de:['tr','ar','en','ru','pl','it','ro','fr','es','uk','fa'],
 it:['ro','ar','en','fr','de','es','zh','bn','ur','ru','pt'],
 pt:['es','en','fr','de','it','ja','zh','ar','ru','hi','ko'],
 ja:['zh','ko','vi','en','pt','tl','id','th','fr','es','hi'],
 ko:['zh','en','vi','ja','th','ru','tl','id','fr','es','hi'],
 zh:['yue','en','ja','ko','vi','id','ms','th','fr','ru','es'],
 yue:['zh','en','tl','id','hi','ur','ja','ko','vi','th','fr'],
 hi:['bn','ta','ur','pa','en','gu','te','mr','ar','zh','fr','ja'],
 he:['ar','ru','en','fr','es','uk','fa','de','it','pt','ro'],
 ar:['fr','en','ur','hi','bn','pa','fa','tr','ta','id','sw'],
 tr:['ar','en','de','fa','ru','fr','uk','es','ur','hi','zh'],
 vi:['en','zh','ko','ja','fr','th','tl','id','ms','ru','hi'],
 th:['zh','en','ja','ko','vi','ms','hi','ta','id','tl','fr'],
 tl:['en','zh','yue','ja','ko','ar','es','id','ms','hi','vi'],
 id:['en','zh','ms','ja','ar','ko','nl','hi','ta','vi','th'],
 ms:['zh','ta','en','id','yue','ar','hi','th','ja','ko','vi'],
 ru:['uk','en','ta','ar','de','zh','tr','fr','hi','fa','pl'],
 uk:['ru','en','pl','ro','de','tr','ar','fr','he','zh','es'],
 nl:['en','de','ar','tr','fr','pl','es','it','pt','zh','ru'],
 sv:['ar','en','fa','de','pl','es','fr','tr','ru','hi','zh'],
 el:['en','ar','ru','de','fr','ro','tr','uk','it','es','fa'],
 pl:['uk','en','ru','de','fr','es','it','ro','ar','zh','hi'],
 ro:['en','de','it','fr','ru','uk','tr','es','ar','zh','el'],
 ur:['pa','en','ar','fa','hi','bn','ta','tr','zh','ms','fr'],
 bn:['en','ar','hi','ur','pa','ta','zh','ja','ko','ms','fr'],
 fa:['ar','tr','en','ur','ru','hi','de','fr','pa','zh','ta'],
 sw:['en','ar','fr','hi','pa','ur','pt','zh','de','it','ta'],
 ht:['fr','es','en','pt','ar','zh','de','it','ja','hi','ru'],
 en:['es','zh','fr','ar','hi','pa','pt','vi','yue','ko','ja','ta']
};

export function selectLanguages(p,snapshot,locations){
 const output=[],seen=new Set();
 function add(id,extra={}){if(!languages[id]||seen.has(id))return;seen.add(id);output.push({id,name:languages[id].name,category:id,kind:'suggestion',...extra});}
 function census(source,local){
  for(const [code,count,moe] of source.values||[]){
   const category=String(code),label=snapshot.categories[category];
   if(exact[category])add(exact[category],local?{kind:'estimate',count,moe,percent:count/source.total*100,sourceName:source.name,sourceCategory:label,total:source.total}:{kind:'regional',sourceName:source.name});
   else for(const id of examples[category]||[])add(id,{kind:local?'local-example':'regional',sourceName:source.name,sourceCategory:label});
  }
 }
 if(p.values)census(p,true);
 else if(p.stats)for(const [id,percent] of p.stats)add(id,{kind:'estimate',percent,sourceName:p.name});
 else for(const id of p.ids||[])add(id,{kind:'country',sourceName:p.name});
 if(p.kind==='city'){
  const parent=locations.find(row=>row.id===p.id.slice(0,5));if(parent)census(parent,false);
 }
 if(p.values){const national=locations.find(row=>row.id==='us-national');if(national&&national!==p)census(national,false);}
 const first=p.ids?.[0]||p.stats?.[0]?.[0]||output.find(row=>row.id!=='en')?.id||'en';
 for(const id of regional[first]||regional.en)add(id,{kind:'suggestion',sourceName:'Additional learning selection'});
 // A full useful phrasebook everywhere, without manufacturing local speaker counts.
 for(const id of Object.keys(languages))add(id,{kind:'suggestion',sourceName:'Additional learning selection'});
 return output;
}
