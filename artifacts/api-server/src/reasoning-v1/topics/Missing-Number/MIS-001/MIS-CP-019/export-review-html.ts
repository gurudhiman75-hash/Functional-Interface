import{mkdirSync,writeFileSync}from'node:fs';import{resolve}from'node:path';
import{generateMisCp019Question,MIS_CP019_CANDIDATE_IDS}from'./generator';
import{misCp019RuleByCandidateId}from'./rule-definitions';
function esc(v:unknown):string{return String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]??ch));}
function nl(v:string){return esc(v).replace(/\n/g,'<br>');}
const dir=resolve(process.cwd(),'dist/reasoning-v1/mis-001'),path=resolve(dir,'MIS-CP-019-REVIEW.html');mkdirSync(dir,{recursive:true});
const cards:string[]=[];
for(const id of MIS_CP019_CANDIDATE_IDS){const rule=misCp019RuleByCandidateId(id),samples:string[]=[];
 for(let n=1;n<=5;n++){const q=generateMisCp019Question(id,'MIS-CP-019-REVIEW:'+id+':'+n);
 const opts=q.options.map((o,i)=>'<li class="'+(i===q.correctIndex?'correct':'')+'">'+String.fromCharCode(65+i)+'. '+esc(o.value)+(i===q.correctIndex?' ✓':'')+'</li>').join('');
 samples.push('<section><h3>Sample '+n+' · '+esc(q.difficulty)+'</h3><pre>'+esc(q.stem)+'</pre><ol>'+opts+'</ol><details open><summary>Explanation</summary><p>'+nl(q.explanation)+'</p></details><small>Canonical authority: '+esc(q.semanticAuthorityCandidateId)+' · '+(q.createsNewSemanticAuthority?'NEW authority':'REUSES earlier authority')+' · '+esc(q.sourceNote)+'</small></section>');
 }
 cards.push('<article><h2>'+esc(id)+' — '+esc(rule.label)+'</h2>'+samples.join('')+'</article>');
}
const html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MIS-CP-019 SSC CGL Source Review</title><style>body{font-family:Arial;background:#f5f6f8;color:#18181b;margin:0}main{max-width:1000px;margin:auto;padding:24px}article{background:#fff;border:1px solid #ddd;border-radius:12px;padding:20px;margin:20px 0}section{border-top:1px solid #ddd;padding:18px 0}pre{font-size:17px;line-height:1.6;background:#fafafa;padding:14px;border-radius:8px;white-space:pre-wrap}ol{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(100px,1fr));gap:8px;max-width:500px}li{border:1px solid #ddd;padding:8px;border-radius:7px}.correct{font-weight:700}details p{line-height:1.6;background:#fafafa;padding:12px;border-radius:7px}small{color:#666}</style></head><body><main><h1>MIS-CP-019 — SSC CGL Source-Discovered Relations</h1><p>MIS-CAND-097 reuses canonical MIS-CAND-059 because the stable subtraction constant is a rule parameter, not a separate semantic family.</p>'+cards.join('')+'</main></body></html>';
writeFileSync(path,html);console.log(path);
