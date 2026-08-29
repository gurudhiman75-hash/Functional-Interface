import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4 } from "./com002-hi-pa-localization-machine-lock-v4";
import {
  COM002_LOCALIZATION_VERSION_V5,
  localizeCom002QuestionV5,
} from "./com002-localization-v5";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V6,
  generateCom002ReviewQuestionV6,
} from "./com002-review-synthesis-v6";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderOptions(question: { options: readonly string[]; correctIndex: number }) {
  return question.options.map((option, index) => {
    const correct = index === question.correctIndex;
    return `<li class="option${correct ? " correct" : ""}"><b>${String.fromCharCode(65 + index)}.</b><span>${escapeHtml(option)}</span>${correct ? '<em>Correct</em>' : ""}</li>`;
  }).join("");
}

function panel(label: string, lang: "en" | "hi" | "pa", question: {
  stem: string;
  options: readonly string[];
  correctIndex: number;
  explanation: string;
}) {
  return `<section class="panel" data-lang="${lang}"><h3>${label}</h3><div class="stem">${escapeHtml(question.stem).replaceAll("\n", "<br>")}</div><ol>${renderOptions(question)}</ol><p class="exp"><b>Explanation:</b> ${escapeHtml(question.explanation)}</p></section>`;
}

const reviewRows = qlIds.map((qlId, index) => {
  // Intentionally reuse the V4 review seed to create a true before/after
  // editorial comparison rather than changing the sampled semantic item.
  const seed = `localization-human-review-v4:${qlId}`;
  const english = generateCom002ReviewQuestionV6({ qlId, seed });
  const hindi = localizeCom002QuestionV5({ qlId, seed, language: "hi" });
  const punjabi = localizeCom002QuestionV5({ qlId, seed, language: "pa" });
  const searchText = [qlId, english.surfaceMode, english.stem, hindi.stem, punjabi.stem, ...english.options, ...hindi.options, ...punjabi.options].join(" ").toLowerCase();

  return `<article class="card" data-ql="${qlId}" data-search="${escapeHtml(searchText)}">
    <header><div><span class="num">${String(index + 1).padStart(2, "0")}</span><strong>${qlId}</strong><small>${escapeHtml(english.surfaceMode)}</small></div><label><input type="checkbox" data-review="${qlId}"> Reviewed</label></header>
    <div class="grid">${panel("English V6 reference", "en", english)}${panel("हिन्दी", "hi", hindi)}${panel("ਪੰਜਾਬੀ", "pa", punjabi)}</div>
    <details><summary>Provenance</summary><p><b>Seed:</b> ${escapeHtml(seed)}</p><p><b>Target fact:</b> ${escapeHtml(english.targetFactId ?? "—")}</p><p><b>Sources:</b> ${escapeHtml(english.sourceIds.join(", "))}</p><p><b>Facts:</b> ${escapeHtml(english.sourceFactIds.join(", "))}</p></details>
    <label class="notes">Reviewer notes<textarea data-note="${qlId}" placeholder="Record Hindi/Punjabi wording or parity issues…"></textarea></label>
  </article>`;
}).join("\n");

const baseLock = COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>COM-002 Hindi/Punjabi V5 Review Pack</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f5f7fb}*{box-sizing:border-box}body{margin:0}.top{position:sticky;top:0;z-index:5;background:#fffffff2;border-bottom:1px solid #dde4ee;padding:15px 18px}.inner,.wrap{max-width:1500px;margin:auto}.title{display:flex;justify-content:space-between;gap:15px;align-items:flex-start}.title h1{font-size:22px;margin:0}.title p{margin:5px 0 0;color:#667085;font-size:13px}.badge{padding:7px 10px;border:1px solid #f0d990;background:#fff4d6;border-radius:999px;font-size:12px;color:#6b4b00;white-space:nowrap}.controls{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.controls input,.controls select{border:1px solid #ccd5e3;border-radius:9px;padding:9px 11px;background:#fff}.controls input{min-width:280px;flex:1}.wrap{padding:18px 15px 45px}.evidence{background:#fff;border:1px solid #dde4ee;border-radius:12px;padding:12px 14px;margin-bottom:15px;font-size:12px;line-height:1.5}.card{background:#fff;border:1px solid #dfe5ef;border-radius:14px;margin-bottom:17px;overflow:hidden}.card header{display:flex;justify-content:space-between;align-items:center;padding:11px 14px;background:#fafbfe;border-bottom:1px solid #e7ebf1}.num{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:8px;background:#172033;color:#fff;font-weight:800;margin-right:8px}.card small{margin-left:9px;color:#667085}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.panel{padding:15px;border-right:1px solid #e7ebf1}.panel:last-child{border-right:0}.panel h3{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#667085;margin:0 0 10px}.stem{font-size:16px;font-weight:700;line-height:1.5;min-height:50px}.panel ol{list-style:none;padding:0}.option{display:flex;gap:8px;padding:8px;border:1px solid #e1e6ef;border-radius:8px;margin:6px 0;font-size:14px;line-height:1.35}.option.correct{background:#f0fbf4;border-color:#97d5ad}.option em{margin-left:auto;color:#15733a;font-size:10px;text-transform:uppercase;font-style:normal;font-weight:800}.exp{font-size:13px;line-height:1.5;background:#f7f9fc;padding:9px;border-radius:8px}.card details,.notes{display:block;border-top:1px solid #edf0f5;padding:10px 14px;font-size:12px;color:#596273}.card details p{margin:4px 0}.notes{font-weight:700}.notes textarea{display:block;width:100%;min-height:60px;margin-top:7px;border:1px solid #d7deea;border-radius:8px;padding:8px;font:inherit;font-weight:400}.hidden{display:none!important}@media(max-width:980px){.grid{grid-template-columns:1fr}.panel{border-right:0;border-bottom:1px solid #e7ebf1}.title{flex-direction:column}.controls input{min-width:100%}}
</style></head><body><div class="top"><div class="inner"><div class="title"><div><h1>COM-002 · Hindi/Punjabi Localization V5 Review</h1><p>Same 13 V4 sampler seeds · English V6 errata reference · Localization V5 editorial/parity candidate</p></div><span class="badge">Human approval required — candidate only</span></div><div class="controls"><input id="search" placeholder="Search QL, English, Hindi or Punjabi…"><select id="ql"><option value="">All QLs</option>${qlIds.map(q => `<option>${q}</option>`).join("")}</select><span id="progress"></span></div></div></div><main class="wrap"><div class="evidence"><b>Historical baseline only:</b> V4 machine-lock run #${baseLock.canonicalExecution.workflowRunNumber} (${baseLock.canonicalExecution.conclusion}), head <code>${baseLock.canonicalExecution.featureHeadSha}</code>.<br><b>Current candidate:</b> ${COM002_ENGLISH_GENERATOR_VERSION_V6} + ${COM002_LOCALIZATION_VERSION_V5}. No V5 fingerprint/freeze or approval is claimed by this pack.</div>${reviewRows}</main><script>
const KEY='com002-hi-pa-v5-review';const state=JSON.parse(localStorage.getItem(KEY)||'{}');const cards=[...document.querySelectorAll('.card')];function save(){localStorage.setItem(KEY,JSON.stringify(state));progress()}document.querySelectorAll('[data-review]').forEach(el=>{const id=el.dataset.review;el.checked=!!state[id]?.reviewed;el.addEventListener('change',()=>{state[id]={...(state[id]||{}),reviewed:el.checked};save()})});document.querySelectorAll('[data-note]').forEach(el=>{const id=el.dataset.note;el.value=state[id]?.note||'';el.addEventListener('input',()=>{state[id]={...(state[id]||{}),note:el.value};save()})});function progress(){document.getElementById('progress').textContent='Reviewed '+cards.filter(c=>state[c.dataset.ql]?.reviewed).length+'/'+cards.length}function filter(){const q=document.getElementById('search').value.trim().toLowerCase();const ql=document.getElementById('ql').value;cards.forEach(c=>c.classList.toggle('hidden',!!((ql&&c.dataset.ql!==ql)||(q&&!c.dataset.search.includes(q)))))}document.getElementById('search').addEventListener('input',filter);document.getElementById('ql').addEventListener('change',filter);progress();
</script></body></html>`;

const outputDir = join(process.cwd(), "dist", "review-artifacts");
await mkdir(outputDir, { recursive: true });
const outputPath = join(outputDir, "COM002-Hindi-Punjabi-V5-Review-Pack.html");
await writeFile(outputPath, html, "utf8");

const questions = qlIds.map((qlId) => {
  const seed = `localization-human-review-v4:${qlId}`;
  return {
    qlId,
    seed,
    english: generateCom002ReviewQuestionV6({ qlId, seed }),
    hindi: localizeCom002QuestionV5({ qlId, seed, language: "hi" }),
    punjabi: localizeCom002QuestionV5({ qlId, seed, language: "pa" }),
  };
});
await writeFile(
  join(outputDir, "COM002-Hindi-Punjabi-V5-Review-Pack.json"),
  JSON.stringify({
    candidate: {
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
      localizationVersion: COM002_LOCALIZATION_VERSION_V5,
      humanApprovalRequired: true,
      fingerprintsPinned: false,
      frozen: false,
      sameHistoricalV4SamplerSeeds: true,
    },
    historicalBaseMachineLockV4: baseLock,
    questions,
  }, null, 2),
  "utf8",
);
console.log(`[COM002-LOCALIZATION-V5-EXPORT] wrote ${outputPath} qls=${qlIds.length} localizedSurfaces=${qlIds.length * 2}`);
