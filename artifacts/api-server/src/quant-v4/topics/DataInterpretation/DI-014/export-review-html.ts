import { writeFileSync } from "node:fs";
import { generateDi014RadarPieSet } from "./radar-pie-set";
import { renderDi014RadarSvg } from "./radar-svg";
import { renderDiPieSvg } from "../visuals/pie-svg";
function esc(v:unknown){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");}
const blocks=Array.from({length:8},(_,i)=>`DI-014-REVIEW-${i+1}`).map(seed=>{const set=generateDi014RadarPieSet({seed});return `<section><h2>${esc(seed)}</h2><div class="pair"><div>${renderDi014RadarSvg(set.radar)}</div><div>${renderDiPieSvg(set.pie)}</div></div>${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Explanation:</b> ${esc([q.explanation.keyIdea,...q.explanation.steps].join(" "))}</p></article>`).join("")}</section>`;}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-014 Radar Pie Review</title><style>body{font-family:Arial,sans-serif;max-width:1250px;margin:30px auto}.pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}.pair svg{max-width:100%;height:auto}article{border:1px solid #ddd;border-radius:8px;padding:12px;margin:12px 0}@media(max-width:850px){.pair{grid-template-columns:1fr}}</style></head><body><h1>DI-014 Radar + Pie Hybrid — Review V1</h1>${blocks}</body></html>`;
const out=process.argv[2]||"/tmp/DI-014-RADAR-PIE-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
