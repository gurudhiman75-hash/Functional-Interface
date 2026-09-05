import fs from "node:fs";
import path from "node:path";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import { COM003_HINDI_LOCALIZATION_V2_WAVE3, COM003_PUNJABI_LOCALIZATION_V2_WAVE3 } from "./com003-localization-v2-wave3";
const QLS=["COM-003-QL-010","COM-003-QL-011","COM-003-QL-012","COM-003-QL-013","COM-003-QL-014"];
const EN=COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter(q=>QLS.includes(q.qlId));
const hi=new Map(COM003_HINDI_LOCALIZATION_V2_WAVE3.map(q=>[q.sourceQuestionId,q]));
const pa=new Map(COM003_PUNJABI_LOCALIZATION_V2_WAVE3.map(q=>[q.sourceQuestionId,q]));
const esc=(v:unknown)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
function block(label:string,q:any){return `<div class="lang"><h4>${label}</h4><p class="stem">${esc(q.stem)}</p><ol>${q.options.map((o:string,i:number)=>`<li class="${i===q.correctIndex?'correct':''}">${esc(o)}</li>`).join('')}</ol><p><b>Explanation:</b> ${esc(q.explanation)}</p></div>`;}
export function build(){return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;background:#f5f6f8;color:#172033}.wrap{max-width:1200px;margin:auto;padding:22px}.q{background:white;border:1px solid #ddd;border-radius:12px;padding:16px;margin:12px 0}.meta{font-size:12px;color:#667}.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}.lang{background:#f8f9fb;padding:12px;border-radius:8px}.correct{font-weight:700}.stem{font-weight:700}@media(max-width:900px){.grid{grid-template-columns:1fr}}</style></head><body><main class="wrap"><h1>COM-003 Localization V2 Wave 3 Review</h1><p>QL-010..014 · 60 English · 60 Hindi · 60 Punjabi · REVIEW ONLY</p>${EN.map((e,i)=>`<section class="q"><div class="meta">#${i+1} · ${esc(e.qlId)} · ${esc(e.examSurfaceFamily)} · ${esc(e.targetFactId)}</div><div class="grid">${block('English',e)}${block('Hindi',hi.get(e.questionId))}${block('Punjabi',pa.get(e.questionId))}</div></section>`).join('')}</main></body></html>`;}
export function write(output=path.resolve("dist/com003-localization-v2-wave3/COM-003-Localization-V2-Wave3-Review.html")){fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,build(),"utf8");return output;}
if(process.argv[1]?.includes("wave3-review-file")) console.log(write());
