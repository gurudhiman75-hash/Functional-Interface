import { writeFileSync } from "node:fs";
import { renderDiLineSvg } from "../visuals/line-svg";
import { DI004_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi004PermanentQuestion } from "./permanent-question-generator";
import { generateDi004LocalizedReviewQuestion, type Di004LocalizationLocale } from "./localization-review-v1";

function esc(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function workingTable(table: { headers: readonly string[]; rows: readonly (readonly string[])[] } | undefined) {
  if (!table) return "";
  return `<div class="work-table"><table><thead><tr>${table.headers.map((cell) => `<th>${esc(cell)}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function questionCard(input: {
  qlId: string;
  taskKind: string;
  difficulty: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: { keyIdea: string; steps: readonly string[]; workingTable?: { headers: readonly string[]; rows: readonly (readonly string[])[] } };
}) {
  const options = input.options.map((option, index) => `<li><span class="letter">${String.fromCharCode(65 + index)}.</span><span>${esc(option)}</span></li>`).join("");
  const steps = input.explanation.steps.map((step, index) => `<li><span class="step-no">${index + 1}</span><span>${esc(step)}</span></li>`).join("");
  return `<article class="question">
    <div class="qmeta"><strong>${esc(input.qlId)}</strong><span class="difficulty ${esc(input.difficulty.toLowerCase())}">${esc(input.difficulty)}</span><code>${esc(input.taskKind)}</code></div>
    <p class="stem">${esc(input.stem)}</p>
    <ol class="options">${options}</ol>
    <details open><summary>Answer & explanation</summary>
      <p class="answer"><strong>Answer:</strong> ${String.fromCharCode(65 + input.correctIndex)}. ${esc(input.answer)}</p>
      <p class="idea">${esc(input.explanation.keyIdea)}</p>
      <ol class="steps">${steps}</ol>
      ${workingTable(input.explanation.workingTable)}
    </details>
  </article>`;
}

function lineSvg(stimulus: {
  title: string;
  yAxisLabel: string;
  unitLabel: string;
  series: readonly [{ label: string }, { label: string }];
  points: readonly { period: string; seriesA: number; seriesB: number }[];
}) {
  return renderDiLineSvg({
    title: stimulus.title,
    yAxisLabel: stimulus.yAxisLabel,
    unitLabel: stimulus.unitLabel,
    seriesALabel: stimulus.series[0].label,
    seriesBLabel: stimulus.series[1].label,
    points: stimulus.points,
  });
}

function englishSection(profile: "SSC_CGL_TIER_I" | "BANKING_PRELIMS") {
  const cards = DI004_PERMANENT_QLS.map((descriptor) => {
    const source = generateDi004PermanentQuestion({
      seed: `DI004-V2-HTML-REVIEW:${profile}:${descriptor.qlId}`,
      examProfile: profile,
      taskKind: descriptor.taskKind,
    });
    return `<section class="review-item">
      <div class="item-head"><div><div class="eyebrow">${esc(descriptor.qlId)}</div><h3>${esc(descriptor.label)}</h3></div><span class="badge">${esc(profile.replaceAll("_", " "))}</span></div>
      <p class="instruction">${esc(source.stimulus.instruction)}</p>
      <div class="chart">${lineSvg(source.stimulus)}</div>
      ${questionCard({
        qlId: descriptor.qlId,
        taskKind: source.question.kind,
        difficulty: source.question.difficulty,
        stem: source.question.stem,
        options: source.question.options,
        correctIndex: source.question.correctIndex,
        answer: source.question.answer,
        explanation: source.question.explanation,
      })}
    </section>`;
  }).join("");
  return `<section class="language-block"><h2>${esc(profile.replaceAll("_", " "))} — English</h2>${cards}</section>`;
}

function localizedSection(locale: Di004LocalizationLocale) {
  const title = locale === "hi-IN" ? "Hindi (hi-IN)" : "Punjabi (pa-IN)";
  const cards = DI004_PERMANENT_QLS.map((descriptor, index) => {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "BANKING_PRELIMS" as const;
    const source = generateDi004LocalizedReviewQuestion({
      seed: `DI004-HTML-LOCALIZATION-REVIEW:${locale}:${descriptor.qlId}`,
      examProfile,
      taskKind: descriptor.taskKind,
      locale,
    });
    return `<section class="review-item">
      <div class="item-head"><div><div class="eyebrow">${esc(descriptor.qlId)}</div><h3>${esc(descriptor.taskKind)}</h3></div><span class="badge">${esc(examProfile.replaceAll("_", " "))}</span></div>
      <p class="instruction">${esc(source.stimulus.instruction)}</p>
      <div class="chart">${lineSvg(source.stimulus)}</div>
      ${questionCard({
        qlId: descriptor.qlId,
        taskKind: source.question.kind,
        difficulty: source.question.difficulty,
        stem: source.question.stem,
        options: source.question.options,
        correctIndex: source.question.correctIndex,
        answer: source.question.answer,
        explanation: source.question.explanation,
      })}
    </section>`;
  }).join("");
  return `<section class="language-block"><h2>${title}</h2>${cards}</section>`;
}

const outputPath = process.argv[2] ?? "DI-004-REVIEW-V2.html";
const sections = [
  englishSection("SSC_CGL_TIER_I"),
  englishSection("BANKING_PRELIMS"),
  localizedSection("hi-IN"),
  localizedSection("pa-IN"),
].join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>DI-004 Line Graph V2 — Visual Review</title>
<style>
:root{font-family:Inter,"Nirmala UI","Noto Sans Devanagari","Noto Sans Gurmukhi",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#172033;background:#f5f7fa}*{box-sizing:border-box}body{margin:0}.shell{max-width:1120px;margin:0 auto;padding:30px 18px 72px}.hero,.review-item{background:#fff;border:1px solid #e4e7ec;border-radius:18px;box-shadow:0 5px 22px rgba(16,24,40,.05)}.hero{padding:26px 28px;margin-bottom:28px}.hero h1{font-size:29px;margin:0 0 8px}.hero p{color:#475467;line-height:1.6;margin:7px 0}.notice{margin-top:14px;padding:12px 14px;border-radius:10px;background:#fff8e6;color:#7a4b00;font-size:14px}.language-block>h2{font-size:24px;margin:34px 0 14px}.review-item{padding:24px;margin:20px 0}.item-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:1px solid #eaecf0;padding-bottom:14px}.item-head h3{font-size:19px;margin:4px 0 0}.eyebrow{font-size:11px;font-weight:800;letter-spacing:.09em;color:#667085}.badge{background:#f2f4f7;border-radius:999px;padding:6px 9px;font-size:11px;color:#475467;font-weight:700}.instruction{color:#475467;margin:14px 0}.chart{border:1px solid #e4e7ec;border-radius:14px;padding:8px;background:#fff;overflow-x:auto}.chart svg{display:block;width:100%;height:auto;min-width:720px}.question{padding-top:20px}.qmeta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.qmeta code{font-size:11px;background:#f2f4f7;color:#475467;border-radius:6px;padding:4px 6px}.difficulty{font-size:11px;font-weight:700;border-radius:999px;padding:4px 7px}.difficulty.easy{background:#ecfdf3;color:#027a48}.difficulty.medium{background:#fffaeb;color:#b54708}.difficulty.hard{background:#fef3f2;color:#b42318}.stem{font-size:16px;font-weight:700;line-height:1.55;margin:13px 0}.options{list-style:none;padding:0;margin:10px 0 16px;display:grid;gap:8px}.options li{display:flex;gap:10px;border:1px solid #e4e7ec;border-radius:10px;padding:10px 12px;background:#fcfcfd}.letter{font-weight:700;min-width:22px}details{border-left:3px solid #98a2b3;padding:4px 0 4px 15px}summary{cursor:pointer;font-weight:700}.answer{margin:12px 0 6px}.idea{margin:7px 0;color:#344054}.steps{list-style:none;padding:0;margin:9px 0;display:grid;gap:7px}.steps li{display:flex;gap:9px;line-height:1.5}.step-no{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:#f2f4f7;font-size:12px;font-weight:700}.work-table{overflow-x:auto;margin-top:12px}.work-table table{border-collapse:collapse;width:100%;font-size:13px}.work-table th,.work-table td{border:1px solid #e4e7ec;padding:8px 10px;text-align:center}.work-table th{background:#f8fafc;color:#475467}@media(max-width:720px){.shell{padding:16px 9px 48px}.hero,.review-item{padding:16px;border-radius:14px}.item-head{display:block}.badge{display:inline-block;margin-top:8px}.chart svg{min-width:680px}}@media print{body{background:#fff}.hero,.review-item{box-shadow:none}.chart svg{min-width:0}}
</style>
</head>
<body><main class="shell">
<section class="hero"><h1>DI-004 Line Graph — Visual Review</h1><p>This is the primary human-review surface for DI-004. Each question is shown with the actual line graph generated from the same semantic stimulus used by the question engine.</p><p>The Markdown data tables remain only as a textual/debug representation and are not the intended learner presentation.</p><div class="notice"><strong>Review only.</strong> Hindi/Punjabi remain HI_PA_REVIEW_CANDIDATE until human approval. Question Bank, tests, mocks and public/student publication remain locked.</div></section>
${sections}
</main></body></html>`;

writeFileSync(outputPath, html, "utf8");
console.log(JSON.stringify({
  status: "EXPORTED_DI_004_VISUAL_REVIEW_HTML",
  outputPath,
  renderer: "EXAMTREE_DI_LINE_CLEAN_V1",
  qls: DI004_PERMANENT_QLS.length,
  languageSurfaces: 4,
}));
