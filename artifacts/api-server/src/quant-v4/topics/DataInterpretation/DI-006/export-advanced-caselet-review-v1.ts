import { writeFileSync } from "node:fs";
import { generateDi006AdvancedCaseletSet } from "./advanced-caselet-v1";

function esc(value:unknown){
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
}
const seeds=Array.from({length:10},(_,i)=>`DI-006-ADV-REVIEW-${String(i+1).padStart(2,"0")}`);
const blocks=seeds.map(seed=>{
  const set=generateDi006AdvancedCaseletSet({seed,examProfile:"BANKING_MAINS"});
  return `<section><h2>${esc(set.stimulus.topology)} · ${esc(seed)}</h2><div class="caselet"><h3>${esc(set.stimulus.title)}</h3><p>${esc(set.stimulus.learnerText)}</p></div>${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Explanation:</b> ${esc([q.explanation.keyIdea,...q.explanation.steps].join(" "))}</p></article>`).join("")}</section>`;
}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-006 Advanced Caselet Review</title><style>body{font-family:Arial,sans-serif;max-width:980px;margin:30px auto;line-height:1.5}.caselet,article{border:1px solid #ddd;border-radius:8px;padding:14px;margin:12px 0}section{border-bottom:2px solid #ddd;padding:20px 0}</style></head><body><h1>DI-006 Advanced Caselet Topologies — Review V1</h1>${blocks}</body></html>`;
const out=process.argv[2]||"/tmp/DI-006-ADVANCED-CASELET-REVIEW-V1.html";writeFileSync(out,html);console.log(out);
