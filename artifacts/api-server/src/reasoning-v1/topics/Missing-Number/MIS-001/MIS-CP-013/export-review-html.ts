import{mkdirSync,writeFileSync}from'node:fs';import{resolve}from'node:path';
import{generateMisCp013Question,MIS_CP013_CANDIDATE_IDS}from'./generator';
import{misCp013RuleByCandidateId}from'./rule-definitions';
function esc(v:unknown):string{return String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]??ch));}
function nl(v:string){return esc(v).replace(/\n/g,'<br>');}
const dir=resolve(process.cwd(),'dist/reasoning-v1/mis-001'),path=resolve(dir,'MIS-CP-013-REVIEW.html');mkdirSync(dir,{recursive:true});
const cards:string[]=[];
for(const id of MIS_CP013_CANDIDATE_IDS){const rule=misCp013RuleByCandidateId(id),samples:string[]=[];
 for(let n=1;n<=6;n++){const q=generateMisCp013Question(id,'MIS-CP-013-REVIEW:'+id+':S'+n);
 const opts=q.options.map((o,i)=>'<li class="'+(i===q.correctIndex?'correct':'')+'">'+String.fromCharCode(65+i)+'. '+esc(o.value)+(i===q.correctIndex?' ✓':'')+'</li>').join('');
 samples.push('<section><h3>Sample '+n+'</h3><pre>'+esc(q.stem)+'</pre><ol>'+opts+'</ol><details open><summary>Explanation</summary><p>'+nl(q.explanation)+'</p></details><small>Rule: '+esc(q.ruleId)+' · Source-backed: yes · '+esc(q.sourceNote)+' · '+esc(q.structuralFingerprint)+'</small></section>');
 }
 cards.push('<article><h2>'+esc(id)+' — '+esc(rule.label)+'</h2><p>'+esc(rule.sourceNote)+'</p>'+samples.join('')+'</article>');
}
const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MIS-CP-013 Source-Discovered Review</title><style>body{font-family:Arial;margin:0;background:#f5f6f8;color:#18181b}main{max-width:980px;margin:auto;padding:24px}article{background:#fff;border:1px solid #ddd;border-radius:12px;padding:20px;margin:20px 0}section{border-top:1px solid #ddd;padding:18px 0}pre{font-size:17px;line-height:1.6;background:#fafafa;padding:14px;border-radius:8px;white-space:pre-wrap}ol{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(100px,1fr));gap:8px;max-width:500px}li{border:1px solid #ddd;padding:8px;border-radius:7px}.correct{font-weight:700}details p{line-height:1.6;background:#fafafa;padding:12px;border-radius:7px}small{color:#666}</style></head><body><main><h1>MIS-CP-013 — Source-Discovered Arithmetic Gaps</h1><p>These two patterns were added only after SSC previous-paper source discovery exposed gaps in the blueprint-derived inventory.</p>'+cards.join('')+'</main></body></html>';
writeFileSync(path,html);console.log(path);
