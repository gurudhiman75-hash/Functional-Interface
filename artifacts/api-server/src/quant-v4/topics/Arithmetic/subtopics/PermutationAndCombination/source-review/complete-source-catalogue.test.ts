import assert from 'node:assert/strict';
import {completeSourceCatalogue} from './complete-source-catalogue';
const rows=completeSourceCatalogue();assert.equal(rows.length,699);
for(const language of ['en','hi','pa']){
 const subset=rows.filter(q=>q.language===language);assert.equal(subset.length,233);
 for(const q of subset){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options[q.correctIndex],q.answer);assert.ok(q.explanation.length>=2);assert.ok(q.stem.length>15);assert.ok(!/\{[A-Za-z_]+\}/.test(q.stem));if(language==='hi')assert.ok(/[\u0900-\u097f]/.test(q.stem));if(language==='pa')assert.ok(/[\u0a00-\u0a7f]/.test(q.stem));assert.doesNotThrow(()=>JSON.stringify(q));}
}
assert.equal(rows.find(q=>q.id==='III-045')!.answer,'46663107721972076340849619428133350245357984132190810734296481947608799996614957804470731988078259143126848960413611879125592605458432000000000000000000000000');
assert.equal(rows.find(q=>q.id==='WORKED-028')!.answer,'30');assert.equal(rows.find(q=>q.id==='III-031')!.answer,'4371');
assert.deepEqual(rows,completeSourceCatalogue());
console.log(JSON.stringify({status:'PASS',sourceExerciseSurfaces:561,workedSurfaces:138,rows:rows.length}));
