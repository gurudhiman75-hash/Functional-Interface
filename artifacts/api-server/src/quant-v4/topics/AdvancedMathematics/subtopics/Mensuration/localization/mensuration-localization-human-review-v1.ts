import fs from "node:fs";
import path from "node:path";
import {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationLocalizedQuestionV1,
  type MensurationLocalizedQuestionV1,
} from "./mensuration-localization-runtime-v1";
import {
  hasGurmukhiScript,
  hasHindiScript,
  instructionalLatinLeaks,
} from "./mensuration-localization-foundation-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function learnerText(question: MensurationLocalizedQuestionV1) {
  return [
    question.stem,
    ...question.options,
    ...question.explanation.steps,
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].join("\n");
}

function evenlySpaced<T>(rows: readonly T[], count: number) {
  if (rows.length <= count) return [...rows];
  const indexes = new Set<number>();
  for (let i = 0; i < count; i += 1) {
    indexes.add(Math.round((i * (rows.length - 1)) / (count - 1)));
  }
  return [...indexes].sort((a, b) => a - b).map((index) => rows[index]!);
}

const languageLabels = {
  en: "English",
  hi: "हिन्दी",
  pa: "ਪੰਜਾਬੀ",
} as const;

const reviewItems: Array<{
  cpId: string;
  patternId: string;
  seed: string;
  difficulty: string;
  solveMode: string;
  english: MensurationLocalizedQuestionV1;
  hindi: MensurationLocalizedQuestionV1;
  punjabi: MensurationLocalizedQuestionV1;
}> = [];

function assertSimpleSolution(question: MensurationLocalizedQuestionV1) {
  assert(question.explanation.steps.length >= 1, `${question.patternId}/${question.language}: solution is empty.`);
  assert(question.explanation.steps.length <= 9, `${question.patternId}/${question.language}: solution is still too long.`);
  assert(question.explanation.shortcut === "", `${question.patternId}/${question.language}: shortcut surface must be removed.`);
  assert(question.explanation.traps.length === 0, `${question.patternId}/${question.language}: learner trap list must be removed.`);
  const joined = question.explanation.steps.join("\n");
  assert(!/Key Rule|Step-by-Step|Exam Speed|Common Traps|मुख्य नियम|चरण-दर-चरण|परीक्षा शॉर्टकट|सामान्य गलतियाँ|ਮੁੱਖ ਨਿਯਮ|ਕਦਮ-ਦਰ-ਕਦਮ|ਪ੍ਰੀਖਿਆ ਸ਼ਾਰਟਕੱਟ|ਆਮ ਗਲਤੀਆਂ/i.test(joined), `${question.patternId}/${question.language}: legacy explanation scaffold leaked.`);
  assert(!/\[[A-Z0-9_:-]{3,}\]/.test(joined), `${question.patternId}/${question.language}: internal misconception code leaked.`);
}

for (const cp of MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS) {
  const patterns = MENSURATION_QUESTION_STUDIO_PATTERNS.filter((pattern) => pattern.cpId === cp.cpId);
  assert(patterns.length > 0, `${cp.cpId}: no registered patterns available for human review.`);
  const selected = evenlySpaced(patterns, 4);
  for (const pattern of selected) {
    const seed = `mensuration-localization-human-review:${cp.cpId}:${pattern.patternId}`;
    const english = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language: "en", examProfile: "SSC_CORE" });
    const hindi = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language: "hi", examProfile: "SSC_CORE" });
    const punjabi = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language: "pa", examProfile: "SSC_CORE" });

    for (const localized of [hindi, punjabi]) {
      assert(localized.patternId === english.patternId, `${pattern.patternId}: pattern identity drift in review pack.`);
      assert(localized.correctIndex === english.correctIndex, `${pattern.patternId}: correct-index drift in review pack.`);
      assert(localized.options.length === english.options.length, `${pattern.patternId}: option-count drift in review pack.`);
      assert(localized.realism.numericalStateSignature === english.realism.numericalStateSignature, `${pattern.patternId}: numerical-state drift in review pack.`);
    }
    for (const question of [english, hindi, punjabi]) assertSimpleSolution(question);
    assert(hasHindiScript(learnerText(hindi)), `${pattern.patternId}: Hindi review surface has no Devanagari.`);
    assert(hasGurmukhiScript(learnerText(punjabi)), `${pattern.patternId}: Punjabi review surface has no Gurmukhi.`);

    reviewItems.push({
      cpId: cp.cpId,
      patternId: pattern.patternId,
      seed,
      difficulty: english.difficultyBand,
      solveMode: english.solveMode,
      english,
      hindi,
      punjabi,
    });
  }
}

assert(reviewItems.length >= MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.length * 3, "Human review sampling is too narrow.");

function renderOptions(question: MensurationLocalizedQuestionV1) {
  return question.options.map((option, index) => {
    const marker = String.fromCharCode(65 + index);
    const correct = index === question.correctIndex ? " correct" : "";
    return `<li class="option${correct}"><strong>${marker}.</strong> ${escapeHtml(option)}${correct ? " <span class=\"answer-tag\">correct</span>" : ""}</li>`;
  }).join("");
}

function renderLanguage(question: MensurationLocalizedQuestionV1) {
  const leaks = question.language === "en" ? [] : instructionalLatinLeaks(learnerText(question));
  return `<section class="language-card">
    <h4>${escapeHtml(languageLabels[question.language])} <span>${escapeHtml(question.locale)}</span></h4>
    <p class="stem">${escapeHtml(question.stem)}</p>
    <ol class="options">${renderOptions(question)}</ol>
    <div class="answer"><strong>Answer:</strong> ${escapeHtml(question.answer)}</div>
    <div class="solution">
      <div class="label">Solution</div>
      ${question.explanation.steps.map((step) => `<p>${escapeHtml(step)}</p>`).join("")}
    </div>
    ${question.language === "en" || leaks.length === 0 ? "" : `<details class="diagnostics"><summary>Localization diagnostic</summary><div>${escapeHtml(leaks.join(", "))}</div></details>`}
  </section>`;
}

const cards = reviewItems.map((item, index) => `<article class="question-card">
  <header>
    <div><strong>#${index + 1}</strong> · ${escapeHtml(item.cpId)} · ${escapeHtml(item.patternId)}</div>
    <div>${escapeHtml(item.difficulty)} · ${escapeHtml(item.solveMode)}</div>
  </header>
  <div class="language-grid">
    ${renderLanguage(item.english)}
    ${renderLanguage(item.hindi)}
    ${renderLanguage(item.punjabi)}
  </div>
</article>`).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Mensuration Trilingual Final Human Review</title>
<script>
  window.MathJax = { tex: { inlineMath: [['\\\\(', '\\\\)']] } };
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<style>
  :root { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18202a; background: #f4f6f8; }
  body { margin: 0; padding: 20px; }
  main { max-width: 1680px; margin: 0 auto; }
  .summary, .question-card { background: white; border: 1px solid #d8dee6; border-radius: 12px; margin-bottom: 18px; }
  .summary { padding: 18px; }
  .summary h1 { margin: 0 0 8px; }
  .summary p { margin: 6px 0; }
  .question-card > header { display: flex; justify-content: space-between; gap: 16px; padding: 12px 16px; border-bottom: 1px solid #e3e7ec; background: #fafbfc; border-radius: 12px 12px 0 0; font-size: 13px; }
  .language-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .language-card { padding: 16px; min-width: 0; border-right: 1px solid #e3e7ec; }
  .language-card:last-child { border-right: 0; }
  .language-card h4 { margin: 0 0 12px; font-size: 18px; }
  .language-card h4 span { font-size: 12px; font-weight: 500; opacity: .6; margin-left: 6px; }
  .stem { font-size: 16px; line-height: 1.55; font-weight: 600; }
  .options { padding-left: 22px; margin: 10px 0 12px; }
  .option { padding: 6px 8px; margin: 4px 0; border-radius: 7px; }
  .option.correct { outline: 2px solid #9aa7b5; }
  .answer-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; margin-left: 6px; opacity: .6; }
  .answer { margin: 12px 0; padding: 9px 10px; border-radius: 8px; background: #f4f7f5; }
  .solution { margin-top: 12px; padding-top: 10px; border-top: 1px solid #e5e7eb; }
  .solution p { margin: 8px 0; line-height: 1.55; overflow-wrap: anywhere; }
  .label { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; font-weight: 700; opacity: .65; margin-bottom: 8px; }
  .diagnostics { margin-top: 14px; font-size: 11px; opacity: .7; }
  .diagnostics div { margin-top: 6px; overflow-wrap: anywhere; }
  @media (max-width: 1050px) { .language-grid { grid-template-columns: 1fr; } .language-card { border-right: 0; border-bottom: 1px solid #e3e7ec; } }
</style>
</head>
<body>
<main>
  <section class="summary">
    <h1>Mensuration Trilingual Final Human Review</h1>
    <p><strong>Coverage:</strong> ${reviewItems.length} question identities across all ${MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.length} CPs, shown in English, Hindi and Punjabi.</p>
    <p><strong>Review focus:</strong> natural question wording, correct options, clean formula/calculation, and a short complete solution.</p>
  </section>
  ${cards}
</main>
</body>
</html>`;

const report = {
  authority: "MENSURATION-HI-PA-HUMAN-EDITORIAL-REVIEW-V1",
  solutionAuthority: "MENSURATION-SIMPLE-HUMAN-SOLUTION-V1",
  status: "HUMAN_REVIEW_REQUIRED",
  cpCount: MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.length,
  reviewedQuestionIdentityCount: reviewItems.length,
  languageSurfaceCount: reviewItems.length * 3,
  sampling: "up to four evenly spaced registered patterns per canonical problem",
  items: reviewItems.map((item) => ({
    cpId: item.cpId,
    patternId: item.patternId,
    seed: item.seed,
    difficulty: item.difficulty,
    solveMode: item.solveMode,
    correctIndex: item.english.correctIndex,
    numericalStateSignature: item.english.realism.numericalStateSignature,
    english: { stem: item.english.stem, options: item.english.options, explanation: item.english.explanation },
    hindi: { stem: item.hindi.stem, options: item.hindi.options, explanation: item.hindi.explanation, residualInstructionalLatin: instructionalLatinLeaks(learnerText(item.hindi)) },
    punjabi: { stem: item.punjabi.stem, options: item.punjabi.options, explanation: item.punjabi.explanation, residualInstructionalLatin: instructionalLatinLeaks(learnerText(item.punjabi)) },
  })),
};

const outputDir = path.resolve(process.cwd(), "artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "mensuration-localization-human-review-v1.html"), html);
fs.writeFileSync(path.join(outputDir, "mensuration-localization-human-review-v1.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outputDir, "mensuration-localization-human-review-v1.md"), [
  "# Mensuration Trilingual Final Human Review",
  "",
  `- Canonical problems: **${report.cpCount}**`,
  `- Question identities: **${report.reviewedQuestionIdentityCount}**`,
  `- English/Hindi/Punjabi surfaces: **${report.languageSurfaceCount}**`,
  "- Explanation surface: **compact formula/calculation + answer only**",
  "- Status: **HUMAN_REVIEW_REQUIRED**",
  "",
].join("\n"));
console.log(JSON.stringify({
  authority: report.authority,
  solutionAuthority: report.solutionAuthority,
  cpCount: report.cpCount,
  reviewedQuestionIdentityCount: report.reviewedQuestionIdentityCount,
  languageSurfaceCount: report.languageSurfaceCount,
  status: report.status,
}, null, 2));
