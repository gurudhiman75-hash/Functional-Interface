import { writeFileSync } from "node:fs";
import { generateDi005DonutSet } from "./donut-v1";
import { renderDi005DonutSvg } from "./donut-svg-v1";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
const sections=Array.from({length:8},(_,i)=>`DI-005-DONUT-REVIEW-${i+1}`).map(seed=>{const set=generateDi005DonutSet({seed,examProfile:"BANKING_MAINS"});return `<section><h2>${esc(seed)}</h2>${renderDi005DonutSvg(set.stimulus)}${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Explanation:</b> ${esc([q.explanation.keyIdea,...q.explanation.steps].join(" "))}</p></article>`).join("")}</section>`;}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-005 Ring Donut Review</title><style>body{font-family:Arial,sans-serif;max-width:1000px;margin:30px auto}svg{max-width:100%;height:auto}article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0}</style></head><body><h1>DI-005 Ring / Donut — Review V1</h1>${sections}</body></html>`;
const out=process.argv[2]||"/tmp/DI-005-DONUT-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
