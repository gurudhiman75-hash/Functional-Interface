import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { generateVen001ShapeRegionBatch } from "./ven-001-shape-regions.ts";

const perLanguage = 20;
const seed = "shape-regions-review-v2";
const languages = ["en", "hi", "pa"] as const;
const questions = languages.flatMap(
  (language) =>
    generateVen001ShapeRegionBatch({
      packageId: "VEN-001",
      patternId: "VEN-CP011",
      count: perLanguage,
      language,
      seed,
    }).questions,
);
const escape = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const langNames = { en: "English", hi: "हिन्दी", pa: "ਪੰਜਾਬੀ" };
let body = "";
for (const language of languages) {
  body += `<section class="language" data-language="${language}"><h2>${langNames[language]}</h2>`;
  for (const q of questions.filter((item) => item.language === language)) {
    const meta = q.semanticMetadata as Record<string, unknown>;
    const options = q.options as string[];
    body += `<article data-search="${escape(q.stem)}"><p class="meta">${escape(meta.shapeLayoutId)} · ${escape(meta.scenarioId)} · ${escape(meta.queryKey)}</p><p class="stem">${escape(q.stem)}</p><div class="diagram">${q.stimulusSvgs?.[0] ?? ""}</div><ol type="A">${options.map((option) => `<li>${escape(option)}</li>`).join("")}</ol><details><summary>Answer and explanation</summary><p><strong>${escape(q.answer)}. ${escape(q.canonicalAnswer)}</strong></p><p>${escape(q.explanation)}</p></details></article>`;
  }
  body += "</section>";
}
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VEN-CP011 Shape Region Review V2</title><style>body{font:17px/1.6 system-ui,sans-serif;max-width:1050px;margin:auto;padding:24px;color:#17324d;background:#f6f8fa}header{background:white;border:1px solid #ddd;padding:22px;border-radius:14px}h1{font-size:27px}h3{padding-top:24px;border-bottom:2px solid #d9e2ee}article{background:white;border:1px solid #d9e2ee;border-radius:12px;padding:20px;margin:18px 0;break-inside:avoid}.meta{font-size:13px;color:#526475}.stem{font-weight:600}.diagram{max-width:640px;margin:16px auto}.diagram svg{width:100%;height:auto}li{padding:4px 0}details{border-top:1px solid #ddd;padding-top:12px}summary{cursor:pointer;font-weight:600}select,input,button{font:inherit;padding:8px;margin:4px}nav a{display:inline-block;margin:4px 12px 4px 0}[hidden]{display:none!important}@media print{body{background:white}header .controls{display:none}article{break-inside:avoid}}</style><header><h1>Geometric shape region questions</h1><p>VEN-CP011 · 20 scenarios per language; shapes cycle through all nine layouts. The pack includes circle, ellipse, rectangle, square, triangle, right-angled triangle, diamond, trapezoid and pentagon combinations. All items are review-only.</p><div class="controls"><label>Language <select id="locale"><option value="en">English</option><option value="hi">हिन्दी</option><option value="pa">ਪੰਜਾਬੀ</option></select></label><input id="search" placeholder="Search a question or scenario"><button id="answers">Show all explanations</button></div></header>${body}<script>const locale=document.querySelector('#locale'),search=document.querySelector('#search');function filter(){document.querySelectorAll('.language').forEach(s=>s.hidden=s.dataset.language!==locale.value);document.querySelectorAll('article').forEach(a=>a.hidden=!a.dataset.search.toLowerCase().includes(search.value.toLowerCase()))}locale.onchange=filter;search.oninput=filter;document.querySelector('#answers').onclick=()=>document.querySelectorAll('details').forEach(d=>d.open=true);filter();</script></html>`;
const layouts = new Set(
  questions.map(
    (question) =>
      (question.semanticMetadata as Record<string, unknown>).shapeLayoutId,
  ),
);
const scenarioIds = new Set(
  questions.map(
    (question) =>
      (question.semanticMetadata as Record<string, unknown>).scenarioId,
  ),
);
const queryKeys = new Set(
  questions.map(
    (question) =>
      (question.semanticMetadata as Record<string, unknown>).queryKey,
  ),
);
const json = JSON.stringify(
  {
    checkpointId: "VEN-CP011",
    title: "Geometric Shape Region Inspection",
    status: "TRILINGUAL_REVIEW_CANDIDATE",
    runtimeMode: "review-only",
    seed,
    layoutCount: layouts.size,
    scenarioCount: scenarioIds.size,
    queryTypeCount: queryKeys.size,
    questions,
  },
  null,
  2,
);
for (const version of ["V1", "V2"]) {
  writeFileSync(
    fileURLToPath(
      new URL(
        `./VEN-001-SHAPE-REGIONS-REVIEW-${version}.html`,
        import.meta.url,
      ),
    ),
    html,
  );
  writeFileSync(
    fileURLToPath(
      new URL(
        `./VEN-001-SHAPE-REGIONS-REVIEW-${version}.json`,
        import.meta.url,
      ),
    ),
    json,
  );
}
console.log(
  `Exported ${questions.length} shape-region questions across ${layouts.size} layouts and ${languages.length} languages.`,
);
