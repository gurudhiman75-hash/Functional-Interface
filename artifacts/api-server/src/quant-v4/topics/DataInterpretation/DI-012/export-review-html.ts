import { writeFileSync } from "node:fs";
import { generateDi012Set } from "./advanced-missing-set";
import { renderDi012TableHtml } from "./render-table";

function esc(value: unknown) {
  return String(value).replace(/[&<>"]/g, (ch) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[ch]!));
}
const seeds=Array.from({length:14},(_,i)=>`DI-012-REVIEW-${String(i+1).padStart(2,"0")}`);
const blocks=seeds.map(seed=>{
  const set=generateDi012Set({seed,examProfile:"BANKING_MAINS"});
  return `<section><h2>${esc(set.stimulus.modelKind)} · ${esc(seed)}</h2>${renderDi012TableHtml(set.stimulus)}${set.questions.map((q,i)=>`<article><h3>Q${i+1} · ${esc(q.difficulty)} · ${esc(q.kind)}</h3><p>${esc(q.stem)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join("")}</ol><p><b>Answer:</b> ${esc(q.answer)}</p><p><b>Explanation:</b> ${esc([q.explanation.keyIdea,...q.explanation.steps].join(" "))}</p></article>`).join("")}</section>`;
}).join("");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>DI-012 Advanced Variable Multi-Missing Review</title><style>body{font-family:Arial,sans-serif;max-width:1000px;margin:30px auto;line-height:1.45}table{border-collapse:collapse;width:100%;max-width:650px}th,td{border:1px solid #bbb;padding:8px;text-align:center}section{border-bottom:2px solid #ddd;padding:20px 0}article{margin:15px 0;padding:12px;border:1px solid #ddd;border-radius:8px}</style></head><body><h1>DI-012 Advanced Variable / Multi-Missing DI — Review V1</h1><p>English controlled-review candidate.</p>${blocks}</body></html>`;
const output=process.argv[2]||"/tmp/DI-012-REVIEW-V1.html";writeFileSync(output,html);console.log(output);
