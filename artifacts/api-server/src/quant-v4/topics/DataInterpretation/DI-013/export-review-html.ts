import { writeFileSync } from "node:fs";
import { generateDi013RadarSet } from "./radar-set";
import { renderDi013RadarSvg } from "./radar-svg";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
const blocks=Array.from({length:10},(_,i)=>`DI-013-REVIEW-${i+1}`).map(seed=>{const set=generateDi013RadarSet({seed,examProfile:"BANKING_MAINS"});return `<section><h2>${esc(seed)}</h2><div>${renderDi013RadarSvg(set.stimulus)}</div>${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Explanation:</b> ${esc([q.explanation.keyIdea,...q.explanation.steps].join(" "))}</p></article>`).join("")}</section>`;}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-013 Radar Review</title><style>body{font-family:Arial,sans-serif;max-width:1000px;margin:30px auto}svg{max-width:100%;height:auto}article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0}</style></head><body><h1>DI-013 Radar / Web Chart — Review V1</h1>${blocks}</body></html>`;
const out=process.argv[2]||"/tmp/DI-013-RADAR-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
