import { writeFileSync } from "node:fs";
import { generateDi005FullyVisibleSet } from "./fully-visible-pie-v1";
import { renderDiPieSvg } from "../visuals/pie-svg";

function esc(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
const seeds=Array.from({length:10},(_,i)=>`DI-005-FV-REVIEW-${String(i+1).padStart(2,"0")}`);
const sections=seeds.map(seed=>{
  const set=generateDi005FullyVisibleSet({seed,examProfile:"BANKING_PRELIMS"});
  return `<section><h2>${esc(seed)}</h2><div class="chart">${renderDiPieSvg(set.stimulus)}</div>${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Explanation:</b> ${esc([q.explanation.keyIdea,...q.explanation.steps].join(" "))}</p></article>`).join("")}</section>`;
}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-005 Fully Visible Pie Review</title><style>body{font-family:Arial,sans-serif;max-width:1050px;margin:30px auto;line-height:1.45}section{border-bottom:2px solid #ddd;padding:20px 0}article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:14px 0}.chart{overflow:auto}svg{max-width:100%;height:auto}</style></head><body><h1>DI-005 Fully-Visible Pie — Review V1</h1><p>All five sector percentages are learner-visible. Existing hidden-sector DI remains unchanged.</p>${sections}</body></html>`;
const out=process.argv[2]||"/tmp/DI-005-FULLY-VISIBLE-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
