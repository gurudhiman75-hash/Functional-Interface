import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  generateVen001NumericalBatch,
  NUMERICAL_CP_IDS,
} from "./ven-001-numerical.ts";
const names = [
  "Two-set counts",
  "Three-set counts",
  "Percentages and ratios",
  "Find x",
  "Five-question caselet",
  "Minimum and maximum overlap",
];
const counts = [7, 17, 7, 4, 5, 8];
const escape = (s: unknown) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
let body = "";
const questions = [];
for (const language of ["en", "hi", "pa"] as const) {
  body += `<section class="language" data-language="${language}"><h2>${{ en: "English", hi: "हिन्दी", pa: "ਪੰਜਾਬੀ" }[language]}</h2>`;
  for (let j = 0; j < NUMERICAL_CP_IDS.length; j++) {
    const cp = NUMERICAL_CP_IDS[j],
      batch = generateVen001NumericalBatch({
        packageId: "VEN-001",
        patternId: cp,
        count: counts[j],
        seed: "numerical-review-v1",
        language,
      });
    questions.push(...batch.questions);
    body += `<h3 id="${language}-${cp}">${cp} · ${names[j]}</h3>`;
    for (const [i, q] of batch.questions.entries()) {
      const meta = q.semanticMetadata as Record<string, unknown>;
      const opts = q.options as string[];
      body += `<article data-search="${escape(q.stem)}"><p class="meta">${i + 1} · ${escape(meta.scenarioId)} · ${escape(meta.queryKey)} · ${escape(q.difficulty)}</p><p class="stem">${escape(q.stem)}</p><ol type="A">${opts.map((o) => `<li>${escape(o)}</li>`).join("")}</ol><details><summary>Answer and step-by-step explanation</summary><p><strong>${escape(q.answer)}. ${escape(q.canonicalAnswer)}</strong></p><p>${escape(q.explanation)}</p>${(q.explanationSvgs as string[]).map((svg) => `<div class="diagram">${svg}</div>`).join("")}<p class="formula">LaTeX: <code>${escape(meta.formulaLatex)}</code></p></details></article>`;
    }
  }
  body += "</section>";
}
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Numerical Venn — CP005–CP010 Review</title><style>body{font:18px/1.65 system-ui,sans-serif;max-width:1050px;margin:auto;padding:24px;color:#17324d;background:#f6f8fa}header{background:white;border:1px solid #ddd;padding:24px;border-radius:14px}h1{font-size:28px}h3{padding-top:25px;border-bottom:2px solid #d9e2ee}article{background:white;border:1px solid #d9e2ee;border-radius:12px;padding:22px;margin:20px 0;break-inside:avoid}.meta,.formula{font-size:14px;color:#526475}.stem{font-weight:600}li{padding:5px 0}details{border-top:1px solid #ddd;padding-top:14px}summary{cursor:pointer;font-weight:600}.diagram{max-width:560px;margin:20px auto}.diagram svg{width:100%;height:auto}select,input,button{font:inherit;padding:8px;margin:4px}code{white-space:pre-wrap}nav a{display:inline-block;margin:4px 12px 4px 0}[hidden]{display:none!important}@media print{body{background:white}header .controls{display:none}article{break-inside:avoid}}</style><header><h1>Numerical Venn Diagrams</h1><p>CP005–CP010 · 48 representative questions per language · English, Hindi and Punjabi. These are new review candidates; language approval is pending.</p><p>Word problems appear without a diagram. Solved region diagrams are inside the explanations. Bounds questions show a feasible range rather than an arbitrary distribution.</p><div class="controls"><label>Language <select id="locale"><option value="en">English</option><option value="hi">हिन्दी</option><option value="pa">ਪੰਜਾਬੀ</option></select></label><input id="search" placeholder="Search a scenario or question"><button id="answers">Show all explanations</button><nav>${NUMERICAL_CP_IDS.map((cp) => `<a data-cp="${cp}" href="#en-${cp}">${cp}</a>`).join("")}</nav></div></header>${body}<script>const locale=document.querySelector('#locale'),search=document.querySelector('#search');function filter(){document.querySelectorAll('.language').forEach(s=>s.hidden=s.dataset.language!==locale.value);document.querySelectorAll('article').forEach(a=>a.hidden=!a.dataset.search.toLowerCase().includes(search.value.toLowerCase()));document.querySelectorAll('nav a').forEach(a=>a.href='#'+locale.value+'-'+a.dataset.cp)}locale.onchange=filter;search.oninput=filter;document.querySelector('#answers').onclick=()=>document.querySelectorAll('details').forEach(d=>d.open=true);filter();</script></html>`;
writeFileSync(
  fileURLToPath(new URL("./VEN-001-NUMERICAL-REVIEW-V1.html", import.meta.url)),
  html,
);
writeFileSync(
  fileURLToPath(new URL("./VEN-001-NUMERICAL-REVIEW-V1.json", import.meta.url)),
  JSON.stringify({ reviewOnly: true, counts, questions }, null, 2),
);
console.log(
  `Exported ${questions.length} localized review questions (${counts.reduce((a, b) => a + b, 0)} per language).`,
);
