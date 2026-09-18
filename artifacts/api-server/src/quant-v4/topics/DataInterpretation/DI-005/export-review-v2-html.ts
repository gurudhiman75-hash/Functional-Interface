import { writeFileSync } from "node:fs";
import { renderDiPieSvg } from "../visuals/pie-svg";
import { generateDi005V2Set, DI005_V2_TASK_KINDS } from "./pie-set-v2";
import type { Di005V2ExamProfile, Di005V2QuestionSet } from "./pie-v2-types";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function selectReviewSets(): Di005V2QuestionSet[] {
  const uncovered = new Set(DI005_V2_TASK_KINDS);
  const selected: Di005V2QuestionSet[] = [];
  for (let index = 1; index <= 200 && (uncovered.size > 0 || selected.length < 6); index += 1) {
    const profile: Di005V2ExamProfile = index % 2 === 0 ? "BANKING_PRELIMS" : "SSC_CGL_TIER_I";
    const set = generateDi005V2Set({ seed: `DI005-V2-REVIEW-${String(index).padStart(3, "0")}`, examProfile: profile });
    const introduces = set.questions.some((question) => uncovered.has(question.kind));
    if (introduces || selected.length < 2) {
      selected.push(set);
      set.questions.forEach((question) => uncovered.delete(question.kind));
    }
  }
  if (uncovered.size > 0) throw new Error(`DI-005 V2 review export did not cover: ${[...uncovered].join(", ")}`);
  return selected;
}

function questionHtml(set: Di005V2QuestionSet, index: number) {
  const q = set.questions[index]!;
  const options = q.options.map((option, optionIndex) => `<li><span class="letter">${String.fromCharCode(65 + optionIndex)}</span>${escapeHtml(option)}</li>`).join("");
  const steps = q.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  return `<article class="question">
    <div class="qmeta"><span>Q${index + 1}</span><span>${escapeHtml(q.kind)}</span><span>${q.difficulty}</span><span>${q.stemSurfaceId}</span></div>
    <div class="stem">${escapeHtml(q.stem)}</div>
    <ol class="options">${options}</ol>
    <details>
      <summary>Answer & explanation</summary>
      <div class="answer">${String.fromCharCode(65 + q.correctIndex)}. ${escapeHtml(q.answer)}</div>
      <p>${escapeHtml(q.explanation.keyIdea)}</p>
      <ol class="steps">${steps}</ol>
    </details>
  </article>`;
}

const sets = selectReviewSets();
const output = process.argv[2] ?? "DI-005-REVIEW-V2.html";
const coverage = new Set(sets.flatMap((set) => set.questions.map((question) => question.kind)));
const setHtml = sets.map((set, setIndex) => `<section class="set">
  <div class="sethead">
    <div><div class="eyebrow">SET ${setIndex + 1}</div><h2>${escapeHtml(set.stimulus.title)}</h2></div>
    <div class="badges"><span>${set.examProfile}</span><span>1E · 2M · 2H</span></div>
  </div>
  <div class="visual">${renderDiPieSvg(set.stimulus)}</div>
  <div class="instruction">${escapeHtml(set.stimulus.instruction)}</div>
  <div class="questions">${set.questions.map((_, index) => questionHtml(set, index)).join("")}</div>
</section>`).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>DI-005 Pie Chart V2 Review</title>
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;background:#f4f6f9}*{box-sizing:border-box}body{margin:0}.wrap{max-width:1180px;margin:0 auto;padding:28px 18px 70px}.hero{background:#fff;border:1px solid #e4e7ec;border-radius:20px;padding:26px 28px;margin-bottom:24px;box-shadow:0 8px 28px rgba(16,24,40,.05)}.hero h1{margin:4px 0 10px;font-size:30px}.hero p{margin:0;color:#667085;line-height:1.6}.hero .grid{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.pill,.badges span,.qmeta span{border:1px solid #d0d5dd;background:#f9fafb;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:700;color:#475467}.warning{margin-top:15px;padding:12px 14px;border-radius:12px;background:#fff7ed;color:#9a3412;font-size:13px}.set{background:#fff;border:1px solid #e4e7ec;border-radius:20px;padding:22px;margin:24px 0;box-shadow:0 8px 28px rgba(16,24,40,.045)}.sethead{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.sethead h2{font-size:21px;margin:4px 0 0}.eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;color:#667085}.badges{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.visual{margin:18px auto 6px;max-width:940px;border:1px solid #eaecf0;border-radius:16px;overflow:hidden;background:#fff}.visual svg{display:block;width:100%;height:auto}.instruction{max-width:940px;margin:12px auto 22px;color:#475467;font-size:14px}.questions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.question{border:1px solid #eaecf0;border-radius:14px;padding:16px;background:#fff}.qmeta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}.qmeta span{padding:5px 8px;font-size:10px}.stem{font-size:15px;font-weight:700;line-height:1.5;margin-bottom:12px}.options{list-style:none;padding:0;margin:0;display:grid;gap:8px}.options li{display:flex;align-items:flex-start;gap:9px;padding:9px 10px;border:1px solid #eaecf0;border-radius:10px;font-size:14px;line-height:1.4}.letter{width:22px;height:22px;display:inline-grid;place-items:center;border-radius:6px;background:#f2f4f7;font-size:11px;font-weight:800;flex:0 0 auto}details{margin-top:12px;border-top:1px dashed #d0d5dd;padding-top:10px}summary{cursor:pointer;font-size:13px;font-weight:800;color:#475467}.answer{font-weight:800;margin:10px 0 6px}.question p,.steps{font-size:13px;line-height:1.55;color:#475467}.steps{padding-left:20px}@media(max-width:800px){.questions{grid-template-columns:1fr}.sethead{display:block}.badges{justify-content:flex-start;margin-top:12px}.hero h1{font-size:25px}.wrap{padding:16px 10px 50px}.set{padding:14px}}
</style>
</head>
<body><main class="wrap">
<section class="hero"><div class="eyebrow">EXAMTREE · DATA INTERPRETATION</div><h1>DI-005 Pie Chart — V2 Review Pack</h1><p>Rebuilt learner surface with broader pie-chart coverage, profile-correct options, semantic-only question state and a shared presentation renderer.</p><div class="grid"><span class="pill">${sets.length} review sets</span><span class="pill">${sets.length * 5} questions</span><span class="pill">${coverage.size}/${DI005_V2_TASK_KINDS.length} task families</span><span class="pill">SSC + Banking</span><span class="pill">1 Easy · 2 Medium · 2 Hard</span></div><div class="warning">Review-only. No Question Studio discovery, Question Bank writes, test/mock eligibility or public/student publication authority.</div></section>
${setHtml}
</main></body></html>`;

writeFileSync(output, html, "utf8");
console.log(JSON.stringify({ status: "PASS_DI_005_REVIEW_V2_HTML", output, sets: sets.length, questions: sets.length * 5, taskFamilies: coverage.size }));
