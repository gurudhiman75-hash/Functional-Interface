import{mkdirSync,writeFileSync}from'node:fs';import{resolve}from'node:path';
import{generateMisCp025Question}from'./generator';
const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]??ch));
const nl=(v:string)=>esc(v).replace(/\n/g,'<br>');
const dir=resolve(process.cwd(),'dist/reasoning-v1/mis-001'),path=resolve(dir,'MIS-CP-025-REVIEW.html');mkdirSync(dir,{recursive:true});
const cards:string[]=[];
for(let n=1;n<=8;n++){const q=generateMisCp025Question('MIS-CAND-109','MIS-CP-025-REVIEW:'+n);
 const figs=q.figures.map((f,i)=>'<div class="figure"><b>Figure '+String.fromCharCode(65+i)+'</b>'+f.svg+'</div>').join('');
 const opts=q.options.map((o,i)=>'<li class="'+(i===q.correctIndex?'correct':'')+'">'+String.fromCharCode(65+i)+'. '+esc(o.value)+(i===q.correctIndex?' ✓':'')+'</li>').join('');
 cards.push('<section><h2>Sample '+n+'</h2><div class="visual">'+figs+'</div><ol>'+opts+'</ol><details open><summary>Explanation</summary><p>'+nl(q.explanation)+'</p></details><small>Canonical authority: MIS-CAND-003 · REUSES PRODUCT · '+esc(q.sourceNote)+'</small></section>');
}
const html='<!doctype html><html><head><meta charset="utf-8"><title>MIS-CP-025 Review</title><style>body{font-family:Arial;background:#f5f6f8;margin:0;color:#18181b}main{max-width:1000px;margin:auto;padding:24px}section{background:#fff;border:1px solid #ddd;border-radius:12px;padding:20px;margin:18px 0}.visual{display:flex;gap:16px;flex-wrap:wrap}.figure{width:240px;border:1px solid #ddd;padding:8px;border-radius:8px}.figure svg{width:100%;height:auto}ol{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(100px,1fr));gap:8px;max-width:500px}li{border:1px solid #ddd;padding:8px;border-radius:7px}.correct{font-weight:700}</style></head><body><main><h1>MIS-CP-025 — RRB Linked-Product Figure</h1><p>Renderer/query variant of the existing PRODUCT semantic authority.</p>'+cards.join('')+'</main></body></html>';
writeFileSync(path,html);console.log(path);