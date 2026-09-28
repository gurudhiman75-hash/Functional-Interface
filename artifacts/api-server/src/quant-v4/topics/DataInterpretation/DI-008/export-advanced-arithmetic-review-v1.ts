import { writeFileSync } from "node:fs";
import { generateDi008AdvancedArithmeticSet } from "./advanced-arithmetic-v1";
import { renderDi008AdvancedTableHtml } from "./advanced-arithmetic-table";
function esc(value:unknown){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
const seeds=Array.from({length:12},(_,i)=>`DI-008-ADV-REVIEW-${String(i+1).padStart(2,"0")}`);
const sections=seeds.map(seed=>{
  const set=generateDi008AdvancedArithmeticSet({seed,examProfile:"BANKING_MAINS"});
  return `<section><h2>${esc(set.stimulus.domain)} · ${esc(seed)}</h2>${renderDi008AdvancedTableHtml(set.stimulus)}${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Explanation:</b> ${esc([q.explanation.keyIdea,...q.explanation.steps].join(" "))}</p></article>`).join("")}</section>`;
}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-008 Advanced Arithmetic Review</title><style>body{font-family:Arial,sans-serif;max-width:1050px;margin:30px auto;line-height:1.45}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;text-align:center}article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0}section{border-bottom:2px solid #ddd;padding:20px 0}</style></head><body><h1>DI-008 Advanced Arithmetic Domains — Review V1</h1>${sections}</body></html>`;
const out=process.argv[2]||"/tmp/DI-008-ADVANCED-ARITHMETIC-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
