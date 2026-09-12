import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4 } from "./com002-hi-pa-localization-machine-lock-v4";
import { localizeCom002QuestionV4 } from "./com002-localization-v4";
import { generateCom002ReviewQuestionV5 } from "./com002-review-synthesis-v5";

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

function renderOptions(question: {
  options: readonly string[];
  correctIndex: number;
}) {
  return question.options
    .map((option, index) => {
      const correct = index === question.correctIndex;
      return `<li class="option${correct ? " correct" : ""}"><span class="letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span>${correct ? '<span class="answer-tag">Correct</span>' : ""}</li>`;
    })
    .join("");
}

function renderLanguagePanel(input: {
  label: string;
  lang: "en" | "hi" | "pa";
  question: {
    stem: string;
    options: readonly string[];
    correctIndex: number;
    canonicalAnswer: string;
    explanation: string;
  };
}) {
  return `
    <section class="language-panel" data-lang="${input.lang}">
      <div class="language-label">${input.label}</div>
      <div class="stem">${escapeHtml(input.question.stem).replaceAll("\n", "<br>")}</div>
      <ol class="options">${renderOptions(input.question)}</ol>
      <div class="explanation"><strong>Explanation:</strong> ${escapeHtml(input.question.explanation)}</div>
    </section>`;
}

const rows = qlIds.map((qlId, index) => {
  const seed = `localization-human-review-v4:${qlId}`;
  const english = generateCom002ReviewQuestionV5({ qlId, seed });
  const hindi = localizeCom002QuestionV4({ qlId, seed, language: "hi" });
  const punjabi = localizeCom002QuestionV4({ qlId, seed, language: "pa" });

  const searchText = [
    qlId,
    english.surfaceMode,
    english.stem,
    hindi.stem,
    punjabi.stem,
    ...english.options,
    ...hindi.options,
    ...punjabi.options,
  ].join(" ").toLowerCase();

  return `
  <article class="question-card" data-ql="${qlId}" data-search="${escapeHtml(searchText)}">
    <header class="question-header">
      <div>
        <span class="question-no">${String(index + 1).padStart(2, "0")}</span>
        <strong>${qlId}</strong>
        <span class="mode">${escapeHtml(english.surfaceMode)}</span>
      </div>
      <label class="reviewed"><input type="checkbox" data-review="${qlId}"> Reviewed</label>
    </header>
    <div class="language-grid">
      ${renderLanguagePanel({ label: "English reference", lang: "en", question: english })}
      ${renderLanguagePanel({ label: "हिन्दी", lang: "hi", question: hindi })}
      ${renderLanguagePanel({ label: "ਪੰਜਾਬੀ", lang: "pa", question: punjabi })}
    </div>
    <details class="provenance">
      <summary>Provenance</summary>
      <div><strong>Seed:</strong> ${escapeHtml(seed)}</div>
      <div><strong>Target fact:</strong> ${escapeHtml(english.targetFactId ?? "—")}</div>
      <div><strong>Sources:</strong> ${escapeHtml(english.sourceIds.join(", "))}</div>
      <div><strong>Facts:</strong> ${escapeHtml(english.sourceFactIds.join(", "))}</div>
    </details>
    <label class="notes-label">Reviewer notes
      <textarea data-note="${qlId}" placeholder="Write Hindi/Punjabi wording notes here…"></textarea>
    </label>
  </article>`;
}).join("\n");

const lock = COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4;
const fp = lock.fingerprints;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>COM-002 Hindi/Punjabi V4 Review Pack</title>
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;background:#f5f7fb}*{box-sizing:border-box}body{margin:0}.top{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.96);border-bottom:1px solid #dfe5ef;padding:16px 20px;backdrop-filter:blur(8px)}.top-inner{max-width:1500px;margin:auto}.title-row{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.title{font-size:22px;font-weight:800;margin:0}.sub{margin:4px 0 0;color:#5b6474;font-size:13px}.status{font-size:12px;padding:7px 10px;border-radius:999px;background:#fff4d6;color:#6b4b00;border:1px solid #f0d990;white-space:nowrap}.controls{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.controls input,.controls select{border:1px solid #ccd5e3;border-radius:9px;padding:9px 11px;background:white;font:inherit}.controls input{min-width:280px;flex:1}.progress{font-size:13px;align-self:center;color:#3d4758}.wrap{max-width:1500px;margin:20px auto;padding:0 16px 48px}.evidence{background:white;border:1px solid #dde4ee;border-radius:12px;padding:12px 14px;margin-bottom:16px;font-size:12px;color:#4a5568}.evidence code{word-break:break-all}.question-card{background:white;border:1px solid #dfe5ef;border-radius:14px;margin:0 0 18px;box-shadow:0 2px 10px rgba(20,33,61,.04);overflow:hidden}.question-header{display:flex;justify-content:space-between;align-items:center;padding:12px 15px;border-bottom:1px solid #e7ebf1;background:#fafbfe}.question-no{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:8px;background:#172033;color:white;font-weight:800;margin-right:9px}.mode{margin-left:9px;color:#667085;font-size:12px}.reviewed{font-size:13px}.language-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.language-panel{padding:16px;border-right:1px solid #e7ebf1}.language-panel:last-child{border-right:0}.language-label{text-transform:uppercase;letter-spacing:.06em;font-size:11px;font-weight:800;color:#667085;margin-bottom:10px}.stem{font-size:16px;font-weight:700;line-height:1.5;min-height:50px}.options{list-style:none;padding:0;margin:12px 0}.option{display:flex;align-items:flex-start;gap:8px;padding:8px 9px;margin:6px 0;border:1px solid #e1e6ef;border-radius:9px;line-height:1.35;font-size:14px}.option.correct{border-color:#97d5ad;background:#f0fbf4}.letter{font-weight:800;min-width:18px}.answer-tag{margin-left:auto;font-size:10px;font-weight:800;text-transform:uppercase;color:#15733a}.explanation{font-size:13px;line-height:1.5;background:#f7f9fc;padding:9px 10px;border-radius:8px;color:#394356}.provenance{border-top:1px solid #edf0f5;padding:10px 15px;font-size:12px;color:#596273}.provenance div{margin:4px 0}.notes-label{display:block;border-top:1px solid #edf0f5;padding:10px 15px;font-size:12px;font-weight:700;color:#596273}.notes-label textarea{display:block;width:100%;min-height:60px;margin-top:7px;border:1px solid #d7deea;border-radius:8px;padding:8px;font:inherit;font-weight:400;resize:vertical}.hidden{display:none!important}@media(max-width:980px){.language-grid{grid-template-columns:1fr}.language-panel{border-right:0;border-bottom:1px solid #e7ebf1}.language-panel:last-child{border-bottom:0}.title-row{flex-direction:column}.controls input{min-width:100%}}
</style>
</head>
<body>
<div class="top"><div class="top-inner">
  <div class="title-row"><div><h1 class="title">COM-002 · Hindi/Punjabi Localization V4 Review</h1><p class="sub">13 QLs · 26 localized surfaces · English V5 frozen reference · exact deterministic V4 sampler</p></div><div class="status">Human approval required — not frozen</div></div>
  <div class="controls"><input id="search" placeholder="Search QL, English, Hindi or Punjabi…"><select id="ql"><option value="">All QLs</option>${qlIds.map(q => `<option>${q}</option>`).join("")}</select><span class="progress" id="progress"></span></div>
</div></div>
<main class="wrap">
  <div class="evidence"><strong>Machine-lock evidence:</strong> canonical run #${lock.canonicalExecution.workflowRunNumber} (${lock.canonicalExecution.conclusion}) · head <code>${lock.canonicalExecution.featureHeadSha}</code><br>Terminology <code>${fp.terminologyFingerprint}</code><br>Localized corpus <code>${fp.localizedCorpusFingerprint}</code><br>Review sampler <code>${fp.reviewSamplerFingerprint}</code><br>Combined <code>${fp.combinedFingerprint}</code></div>
  ${rows}
</main>
<script>
const KEY='com002-hi-pa-v4-review';const state=JSON.parse(localStorage.getItem(KEY)||'{}');const cards=[...document.querySelectorAll('.question-card')];
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateProgress()}
document.querySelectorAll('[data-review]').forEach(el=>{const id=el.dataset.review;el.checked=!!state[id]?.reviewed;el.addEventListener('change',()=>{state[id]={...(state[id]||{}),reviewed:el.checked};save()})});
document.querySelectorAll('[data-note]').forEach(el=>{const id=el.dataset.note;el.value=state[id]?.note||'';el.addEventListener('input',()=>{state[id]={...(state[id]||{}),note:el.value};save()})});
function updateProgress(){const n=cards.filter(c=>state[c.dataset.ql]?.reviewed).length;document.getElementById('progress').textContent='Reviewed '+n+'/'+cards.length}
function filter(){const q=document.getElementById('search').value.trim().toLowerCase();const ql=document.getElementById('ql').value;cards.forEach(c=>c.classList.toggle('hidden',!!((ql&&c.dataset.ql!==ql)||(q&&!c.dataset.search.includes(q))))) }
document.getElementById('search').addEventListener('input',filter);document.getElementById('ql').addEventListener('change',filter);updateProgress();
</script>
</body></html>`;

const outputDir = join(process.cwd(), "dist", "review-artifacts");
await mkdir(outputDir, { recursive: true });
const outputPath = join(outputDir, "COM002-Hindi-Punjabi-V4-Review-Pack.html");
await writeFile(outputPath, html, "utf8");

const json = qlIds.map((qlId) => {
  const seed = `localization-human-review-v4:${qlId}`;
  return {
    qlId,
    seed,
    english: generateCom002ReviewQuestionV5({ qlId, seed }),
    hindi: localizeCom002QuestionV4({ qlId, seed, language: "hi" }),
    punjabi: localizeCom002QuestionV4({ qlId, seed, language: "pa" }),
  };
});
await writeFile(join(outputDir, "COM002-Hindi-Punjabi-V4-Review-Pack.json"), JSON.stringify({ machineLock: lock, questions: json }, null, 2), "utf8");
console.log(`[COM002-LOCALIZATION-V4-EXPORT] wrote ${outputPath} qls=${qlIds.length} localizedSurfaces=${qlIds.length * 2}`);
