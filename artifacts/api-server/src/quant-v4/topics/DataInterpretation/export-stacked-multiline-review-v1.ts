import { writeFileSync } from "node:fs";
import { generateDi003StackedBarSet } from "./DI-003/stacked-bar-v1";
import { renderDi003StackedBarSvg } from "./DI-003/stacked-bar-svg-v1";
import { generateDi004MultiLineSet } from "./DI-004/multi-line-v1";
import { renderDi004MultiLineSvg } from "./DI-004/multi-line-svg-v1";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
const stacked=Array.from({length:5},(_,i)=>{const seed=`DI-003-STACKED-REVIEW-${i+1}`,set=generateDi003StackedBarSet({seed});return `<section><h2>Stacked Bar · ${esc(seed)}</h2>${renderDi003StackedBarSvg(set.stimulus)}${set.questions.map((q,j)=>`<article><h3>Q${j+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p></article>`).join("")}</section>`;}).join("");
const multi=Array.from({length:5},(_,i)=>{const seed=`DI-004-MULTI-REVIEW-${i+1}`,set=generateDi004MultiLineSet({seed});return `<section><h2>Three-Series Line · ${esc(seed)}</h2>${renderDi004MultiLineSvg(set.stimulus)}${set.questions.map((q,j)=>`<article><h3>Q${j+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p></article>`).join("")}</section>`;}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI Stacked Bar and Multi-Line Review</title><style>body{font-family:Arial,sans-serif;max-width:1100px;margin:30px auto}svg{max-width:100%;height:auto}article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0}</style></head><body><h1>DI Stacked Bar / Three-Series Line — Review V1</h1>${stacked}${multi}</body></html>`;
const out=process.argv[2]||"/tmp/DI-STACKED-MULTILINE-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
