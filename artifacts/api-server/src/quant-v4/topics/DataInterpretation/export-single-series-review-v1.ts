import { writeFileSync } from "node:fs";
import { generateDi003SingleBarSet } from "./DI-003/single-bar-v1";
import { renderDi003SingleBarSvg } from "./DI-003/single-bar-svg-v1";
import { generateDi004SingleLineSet } from "./DI-004/single-line-v1";
import { renderDi004SingleLineSvg } from "./DI-004/single-line-svg-v1";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
const bars=Array.from({length:5},(_,i)=>{const seed=`DI-003-SINGLE-REVIEW-${i+1}`,set=generateDi003SingleBarSet({seed,examProfile:"SSC_CGL_TIER_I"});return `<section><h2>Single Bar · ${esc(seed)}</h2>${renderDi003SingleBarSvg(set.stimulus)}${set.questions.map((q,j)=>`<article><h3>Q${j+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p></article>`).join("")}</section>`;}).join("");
const lines=Array.from({length:5},(_,i)=>{const seed=`DI-004-SINGLE-REVIEW-${i+1}`,set=generateDi004SingleLineSet({seed,examProfile:"BANKING_PRELIMS"});return `<section><h2>Single Line · ${esc(seed)}</h2>${renderDi004SingleLineSvg(set.stimulus)}${set.questions.map((q,j)=>`<article><h3>Q${j+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p></article>`).join("")}</section>`;}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI Single Series Review</title><style>body{font-family:Arial,sans-serif;max-width:1050px;margin:30px auto}svg{max-width:100%;height:auto}article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0}</style></head><body><h1>DI-003 / DI-004 Single-Series Review V1</h1>${bars}${lines}</body></html>`;
const out=process.argv[2]||"/tmp/DI-SINGLE-SERIES-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
