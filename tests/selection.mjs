import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectLanguages} from '../shared/selection.js';
import {countries} from '../shared/countries.js';
import {languages,phraseKeys} from '../shared/phrases.js';
const snapshot=JSON.parse(fs.readFileSync(new URL('../data/us.json',import.meta.url))),locations=[...snapshot.locations,...countries];
assert.equal(new Set(locations.map(p=>p.id)).size,locations.length);
for(const place of locations){
 const rows=selectLanguages(place,snapshot,locations),nonEnglish=rows.filter(row=>row.id!=='en');
 assert(nonEnglish.length>=10,place.name);assert.equal(new Set(rows.map(row=>row.id)).size,rows.length);
 assert(rows.every(row=>languages[row.id]&&row.name===languages[row.id].name));
 for(const row of rows){
  for(const key of phraseKeys)assert(languages[row.id].phrases[key]?.native);
  if(row.kind!=='estimate')assert.equal(row.percent,undefined,'Never invent percentages for '+place.name+' '+row.name);
 }
 if(place.values)assert.equal(place.values.reduce((sum,row)=>sum+row[1],0),place.total);
}
const oakland=selectLanguages(locations.find(p=>p.id==='us-0653000'),snapshot,locations).filter(row=>row.id!=='en');
assert(oakland.slice(0,5).some(row=>row.id==='zh'));assert(oakland.slice(0,5).some(row=>row.id==='yue'));
assert.equal(oakland.find(row=>row.id==='zh').percent,undefined);
assert(oakland.find(row=>row.id==='es').percent>0);
assert(!fs.existsSync(new URL('../staging',import.meta.url)));assert(!fs.existsSync(new URL('../previews',import.meta.url)));
console.log(`PASS all ${locations.length} locations: >=10 individual languages, complete phrase coverage, unique names, honest percentages, preserved source totals and no staging leftovers`);
console.log('Oakland:',oakland.slice(0,10).map(row=>row.name).join(', '));
