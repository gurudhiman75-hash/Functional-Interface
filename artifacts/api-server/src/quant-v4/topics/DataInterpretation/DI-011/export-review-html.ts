import { writeFileSync } from "node:fs";
import { generateDi011MixedSet } from "./mixed-set";
import { renderDi011MixedSvg } from "./mixed-svg";

const seeds=Array.from({length:10},(_,i)=>`DI-011-REVIEW-${String(i+1).padStart(2,"0")}`);
const blocks=seeds.map(seed=>{
  const set=generateDi011MixedSet({seed,examProfile:"BANKING_MAINS"});
  return `<section><h2>${set.stimulus.pairKind} · ${seed}</h2><div class="stimulus">${renderDi011MixedSvg(set.stimulus)}</div>${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${q.difficulty} · ${q.kind}</h3><p>${q.stem}</p><ol type="A">${q.options.map(o=>`<li>${o}</li>`).join("")}</ol><p><b>Answer:</b> ${q.answer}</p><p><b>Explanation:</b> ${[q.explanation.keyIdea,...q.explanation.steps].join(" ")}</p></article>`).join("")}</section>`;
}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-011 Mixed Multi-Chart Review V1</title><style>body{font-family:Arial,sans-serif;max-width:1100px;margin:30px auto;line-height:1.45}section{border-bottom:2px solid #ddd;padding:20px 0}article{margin:18px 0;padding:12px;border:1px solid #ddd;border-radius:8px}.stimulus{overflow:auto}svg{max-width:100%;height:auto}</style></head><body><h1>DI-011 Mixed / Multi-Chart DI — Review V1</h1><p>English review candidate. Actual learner-facing two-panel stimuli are shown below.</p>${blocks}</body></html>`;
const output=process.argv[2]||"/tmp/DI-011-REVIEW-V1.html"; writeFileSync(output,html); console.log(output);
