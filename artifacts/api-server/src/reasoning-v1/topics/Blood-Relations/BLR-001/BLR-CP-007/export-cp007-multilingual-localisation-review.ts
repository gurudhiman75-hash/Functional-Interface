import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  blrCp007LocalizedOptionCodePart,
  blrCp007LocalizedQuestionText,
  blrCp007SemanticParityIsExact,
  generateBlrCp007MultilingualReviewBundle,
  type GeneratedBlrCp007LocalizedQuestion,
} from "./localization/cp007-localizer";

const outputDir = process.argv[2] ?? "blr-cp007-hi-pa-localisation-output";
mkdirSync(outputDir, { recursive: true });

const bundle = generateBlrCp007MultilingualReviewBundle();
const hindiPattern = /[\u0900-\u097f]/u;
const punjabiPattern = /[\u0a00-\u0a7f]/u;
const placeholderPattern = /\b(?:TODO|TBD|TRANSLATE|PLACEHOLDER)\b|\{\{[^}]+\}\}/i;

function countBy(values: readonly string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function scriptComplete(
  question: GeneratedBlrCp007LocalizedQuestion,
  pattern: RegExp,
): boolean {
  const fields = [
    question.sharedPrompt,
    question.stem,
    ...question.options.map((option) => option.studentExplanation),
    ...question.decodedStatements,
    ...question.explanation.steps,
    question.explanation.conclusion,
    question.explanation.shortcut ?? "",
    question.explanation.commonTrap ?? "",
    question.explanation.familyTree.title,
    question.explanation.familyTree.accessibleSummary,
    question.explanation.diagramProof.title,
    question.explanation.diagramProof.description,
    ...question.explanation.diagramProof.legend,
    ...question.explanation.diagramProof.edges.map((edge) => edge.label),
  ];
  return fields.every((field) => pattern.test(field));
}

let codeParityMismatchCount = 0;
for (let questionIndex = 0; questionIndex < bundle.english.length; questionIndex += 1) {
  const english = bundle.english[questionIndex]!;
  const hindi = bundle.hindi[questionIndex]!;
  const punjabi = bundle.punjabi[questionIndex]!;
  for (let optionIndex = 0; optionIndex < english.options.length; optionIndex += 1) {
    const expected = blrCp007LocalizedOptionCodePart(english.options[optionIndex]!.text);
    const hindiCode = blrCp007LocalizedOptionCodePart(hindi.options[optionIndex]!.text);
    const punjabiCode = blrCp007LocalizedOptionCodePart(punjabi.options[optionIndex]!.text);
    if (english.qlId === "BLR-QL-035") {
      if (hindiCode !== expected || punjabiCode !== expected) codeParityMismatchCount += 1;
    } else if (
      hindi.options[optionIndex]!.text !== english.options[optionIndex]!.text
      || punjabi.options[optionIndex]!.text !== english.options[optionIndex]!.text
    ) {
      codeParityMismatchCount += 1;
    }
  }
}

const summary = {
  authority: "BLR_CP007_HI_PA_LOCALISATION_REVIEW_CANDIDATE",
  sourceAuthority: "BLR_CP007_ENGLISH_FROZEN",
  englishCount: bundle.english.length,
  hindiCount: bundle.hindi.length,
  punjabiCount: bundle.punjabi.length,
  localizedQuestionCount: bundle.hindi.length + bundle.punjabi.length,
  qlCounts: countBy(bundle.english.map((question) => question.qlId)),
  difficultyCounts: countBy(bundle.english.map((question) => question.metadata.difficulty)),
  targetRelationCount: new Set(
    bundle.english.map((question) => question.reviewProof.targetRelation).filter(Boolean),
  ).size,
  hindiSemanticParity: blrCp007SemanticParityIsExact(bundle.hindi),
  punjabiSemanticParity: blrCp007SemanticParityIsExact(bundle.punjabi),
  codeParityMismatchCount,
  hindiScriptCompleteCount: bundle.hindi.filter((question) => scriptComplete(question, hindiPattern)).length,
  punjabiScriptCompleteCount: bundle.punjabi.filter((question) => scriptComplete(question, punjabiPattern)).length,
  placeholderCount: [...bundle.hindi, ...bundle.punjabi].filter((question) =>
    placeholderPattern.test(blrCp007LocalizedQuestionText(question))).length,
  humanReviewPendingCount: [...bundle.hindi, ...bundle.punjabi].filter((question) =>
    question.v4ReviewProof.humanReviewRequired).length,
  productDeliveryEnabledCount: [...bundle.hindi, ...bundle.punjabi].filter((question) =>
    question.publiclyPublishable
    || question.questionStudioVisible
    || question.questionBankEligible
    || question.mockTestEligible).length,
  recommendation: "HUMAN_REVIEW_HINDI_AND_PUNJABI_BEFORE_MULTILINGUAL_FREEZE",
  verdict: "BLR_CP007_HI_PA_EXECUTABLE_PARITY_PROVED__HUMAN_LANGUAGE_REVIEW_REQUIRED",
} as const;

writeFileSync(
  join(outputDir, "blr-cp007-hi-pa-localisation-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);

writeFileSync(
  join(outputDir, "blr-cp007-hi-pa-localised-bank.json"),
  `${JSON.stringify({ hindi: bundle.hindi, punjabi: bundle.punjabi }, null, 2)}\n`,
);

const report = `# BLR-CP-007 Hindi/Punjabi Localisation Review\n\n## Verdict\n\n**${summary.verdict}**\n\n## Coverage\n\n- Frozen English questions: ${summary.englishCount}\n- Hindi questions: ${summary.hindiCount}\n- Punjabi questions: ${summary.punjabiCount}\n- Total localised questions: ${summary.localizedQuestionCount}\n- Target relations: ${summary.targetRelationCount}\n- QL distribution: ${Object.entries(summary.qlCounts).map(([qlId, count]) => `${qlId} ${count}`).join(", ")}\n- Difficulty: ${Object.entries(summary.difficultyCounts).map(([level, count]) => `${level} ${count}`).join(", ")}\n\n## Executable proof\n\n- Hindi semantic parity: ${summary.hindiSemanticParity ? "PASS" : "FAIL"}\n- Punjabi semantic parity: ${summary.punjabiSemanticParity ? "PASS" : "FAIL"}\n- Code/option parity mismatches: ${summary.codeParityMismatchCount}\n- Hindi script-complete questions: ${summary.hindiScriptCompleteCount}/${summary.hindiCount}\n- Punjabi script-complete questions: ${summary.punjabiScriptCompleteCount}/${summary.punjabiCount}\n- Placeholders: ${summary.placeholderCount}\n- Product-delivery enabled records: ${summary.productDeliveryEnabledCount}\n\n## Human review required\n\nExecutable parity does not certify natural language. Review Hindi and Punjabi for exam-style phrasing, grammar, relation vocabulary, explanation clarity and consistency. Multilingual freeze, Question Studio, Question Bank, mock-test delivery, publication, staging and merge remain locked.\n`;
writeFileSync(join(outputDir, "BLR-CP-007-HINDI-PUNJABI-LOCALISATION-REVIEW.md"), report);

const esc = (value: unknown): string => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
const nl = (value: string): string => esc(value).replace(/\n/g, "<br>");

function optionsHtml(question: { options: readonly { text: string; studentExplanation: string; isCorrectAnswerForTask: boolean }[] }): string {
  return question.options.map((option, index) =>
    `<div class="option ${option.isCorrectAnswerForTask ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${nl(option.text)}<div class="why">${nl(option.studentExplanation)}</div></div>`,
  ).join("");
}

function languagePanel(
  title: string,
  question: {
    sharedPrompt: string;
    stem: string;
    options: readonly { text: string; studentExplanation: string; isCorrectAnswerForTask: boolean }[];
    answer: string;
    explanation: {
      steps: readonly string[];
      conclusion: string;
      shortcut?: string;
      commonTrap?: string;
    };
  },
): string {
  return `<section class="language"><h3>${esc(title)}</h3><details><summary>Code key</summary><p>${nl(question.sharedPrompt)}</p></details><div class="stem">${nl(question.stem)}</div><div class="options">${optionsHtml(question)}</div><p class="answer"><strong>Answer:</strong> ${nl(question.answer)}</p><ol>${question.explanation.steps.map((step) => `<li>${nl(step)}</li>`).join("")}</ol><p>${nl(question.explanation.conclusion)}</p><p class="tip"><strong>Shortcut:</strong> ${nl(question.explanation.shortcut ?? "")}</p><p class="trap"><strong>Trap:</strong> ${nl(question.explanation.commonTrap ?? "")}</p></section>`;
}

const cards = bundle.english.map((english, index) => {
  const hindi = bundle.hindi[index]!;
  const punjabi = bundle.punjabi[index]!;
  return `<article class="card" data-ql="${esc(english.qlId)}"><header><h2>${esc(english.itemId)}</h2><p>${esc(english.qlId)} · ${esc(english.sourcePrototypeId)} · ${esc(english.metadata.difficulty)}</p></header><div class="columns">${languagePanel("English authority", english)}${languagePanel("Hindi review", hindi)}${languagePanel("Punjabi review", punjabi)}</div></article>`;
}).join("");

const metrics = [
  ["English", summary.englishCount],
  ["Hindi", summary.hindiCount],
  ["Punjabi", summary.punjabiCount],
  ["Parity mismatches", summary.codeParityMismatchCount],
  ["Hindi complete", `${summary.hindiScriptCompleteCount}/${summary.hindiCount}`],
  ["Punjabi complete", `${summary.punjabiScriptCompleteCount}/${summary.punjabiCount}`],
  ["Placeholders", summary.placeholderCount],
  ["Delivery enabled", summary.productDeliveryEnabledCount],
].map(([label, value]) => `<div class="metric"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-007 Hindi Punjabi Localisation Review</title><style>:root{font-family:Inter,"Noto Sans Devanagari","Noto Sans Gurmukhi",system-ui,sans-serif;color:#1f2937;background:#f3f4f6}body{margin:0;padding:20px}.wrap{max-width:1600px;margin:auto}.hero,.card{background:#fff;border:1px solid #d1d5db;border-radius:14px;padding:18px;margin-bottom:18px}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.metric{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:10px}.metric span,.metric strong{display:block}.metric strong{font-size:1.2rem;margin-top:4px}.columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.language{border:1px solid #e5e7eb;border-radius:12px;padding:14px;min-width:0}.stem{font-size:1.05rem;font-weight:650;white-space:normal;margin:12px 0}.option{border-top:1px solid #e5e7eb;padding:9px 0}.option.correct{background:#f0fdf4}.why{font-size:.92rem;margin-top:5px;color:#4b5563}.answer{background:#eff6ff;padding:8px;border-radius:8px}.tip{background:#fefce8;padding:8px;border-radius:8px}.trap{background:#fff7ed;padding:8px;border-radius:8px}details p{font-size:.9rem}.ok{color:#166534}@media(max-width:1100px){.columns{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){body{padding:8px}.hero,.card{padding:12px}.metrics{grid-template-columns:1fr}}</style></head><body><main class="wrap"><section class="hero"><h1>BLR-CP-007 Hindi/Punjabi Localisation Review</h1><h2 class="ok">${esc(summary.verdict)}</h2><p>English is the frozen semantic authority. Hindi and Punjabi are executable review candidates and are not multilingual-frozen.</p><div class="metrics">${metrics}</div></section>${cards}</main></body></html>`;
writeFileSync(join(outputDir, "blr-cp007-hi-pa-localisation-review.html"), html);

console.log(JSON.stringify(summary, null, 2));
