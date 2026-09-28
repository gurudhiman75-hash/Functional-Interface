import { writeFileSync } from "node:fs";
import { generateDi005ComparativePieSet } from "./comparative-pie-v1";
import { renderDiPieSvg } from "../visuals/pie-svg";
function esc(value:unknown){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
const seeds=Array.from({length:10},(_,i)=>`DI-005-COMP-REVIEW-${String(i+1).padStart(2,"0")}`);
const sections=seeds.map(seed=>{
  const set=generateDi005ComparativePieSet({seed,examProfile:"BANKING_MAINS"});
  return `<section><h2>${esc(seed)}</h2><div class="pies"><div>${renderDiPieSvg(set.left)}</div><div>${renderDiPieSvg(set.right)}</div></div>${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Explanation:</b> ${esc([q.explanation.keyIdea,...q.explanation.steps].join(" "))}</p></article>`).join("")}</section>`;
}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-005 Comparative Pie Review</title><style>body{font-family:Arial,sans-serif;max-width:1200px;margin:30px auto;line-height:1.45}.pies{display:grid;grid-template-columns:1fr 1fr;gap:10px}.pies svg{max-width:100%;height:auto}article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0}@media(max-width:800px){.pies{grid-template-columns:1fr}}</style></head><body><h1>DI-005 Comparative / Double Pie — Review V1</h1>${sections}</body></html>`;
const out=process.argv[2]||"/tmp/DI-005-COMPARATIVE-PIE-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
