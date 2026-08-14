import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP003_QL_IDS } from "./cp003-exam-model";
import { generateIntCp003FinalLocalizedQuestionV3 } from "./cp003-localized-final-runtime-v3";
import type { IntCp003LocalizedLocale, IntCp003LocalizedQuestion } from "./cp003-localization-types";

const OUTPUT_DIR = process.argv[2] ?? "review-artifacts/int-cp003-hi-pa-final-v3";
const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const satisfies readonly IntCp003LocalizedLocale[]);

function selectQuestion(qlId: (typeof INT_CP003_QL_IDS)[number], locale: IntCp003LocalizedLocale, frame: number): IntCp003LocalizedQuestion {
  for (let attempt = 0; attempt < 480; attempt += 1) {
    const seed = `int-cp003-final-v3-review:${qlId}:frame-${frame}:attempt-${attempt}`;
    const question = generateIntCp003FinalLocalizedQuestionV3(qlId, seed, locale);
    if (question.correctIndex === frame) return question;
  }
  throw new Error(`${qlId}/${locale}/frame-${frame}: no review question found for answer slot ${frame}.`);
}

function outsideMath(text: string): string {
  return text.replace(/\\\([^]*?\\\)/gu, "").replace(/\\\[[^]*?\\\]/gu, "");
}

function validateQuestion(question: IntCp003LocalizedQuestion): void {
  const label = `${question.locale}/${question.qlId}/${question.seed}`;
  const strings = [
    question.presentation.markdown,
    ...question.options.flatMap((option) => [option.text, option.calculation, option.studentFeedback]),
    question.explanation.keyIdea,
    ...question.explanation.steps,
    question.explanation.finalAnswer,
    ...(question.explanation.shortcut?.steps ?? []),
    ...(question.explanation.commonMistake ? [question.explanation.commonMistake] : []),
    ...(question.explanation.verification?.steps ?? []),
  ];
  const joined = strings.join("\n");
  if (/\$/u.test(joined)) throw new Error(`${label}: legacy dollar math delimiter.`);
  if (/\d[\d,]*\.\d{3,}/u.test(joined)) throw new Error(`${label}: visible decimal exceeds two places.`);
  if (/₹\s*\d[\d,]*\.00\b/u.test(joined)) throw new Error(`${label}: whole-rupee .00.`);
  if (/ज्ञात कीजिए|ਪਤਾ ਕਰੋ/gu.test(joined)) throw new Error(`${label}: command-style prompt.`);
  if (/\\frac\{\d+\\frac\{/u.test(joined)) throw new Error(`${label}: nested mixed fraction.`);
  if (/\b1\s+वार्षिक वृद्धि-चरण हैं\b/u.test(joined) || /\b1\s+ਸਾਲਾਨਾ ਵਾਧੇ ਦੇ ਕਦਮ ਹਨ\b/u.test(joined)) throw new Error(`${label}: singular/plural defect.`);
  if (/\d+ ਸਾਲ ਬਾਅਦ ਮਿਆਦ ਦੇ ਅੰਤ ਵਿੱਚ/u.test(joined)) throw new Error(`${label}: repeated Punjabi duration.`);
  if (/दोनों चक्रवृद्धि राशियां|ਦੋਵੇਂ ਮਿਸ਼ਰਤ ਰਕਮਾਂ/gu.test(joined)) throw new Error(`${label}: mechanical QL065 wording.`);
  if (question.locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu.test(joined)) throw new Error(`${label}: rejected Punjabi terminology.`);
  for (const text of strings) {
    if (/[=×÷^]|\\(?:frac|times|div|left|right|%)/u.test(outsideMath(text))) throw new Error(`${label}: raw math outside wrappers: ${text}`);
  }
  const prefix = question.locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
  if (!question.explanation.steps[0]?.startsWith(prefix) || !/\\\(.+\\\)/u.test(question.explanation.steps[0]!)) throw new Error(`${label}: formula-first explanation missing.`);
  if (new Set(question.options.map((option) => option.text)).size !== 4) throw new Error(`${label}: duplicate visible options.`);
}

function render(question: IntCp003LocalizedQuestion, number: number): string {
  const letters = ["A", "B", "C", "D"];
  const parts: string[] = [`## Q${number} — ${question.qlId}`, "", question.presentation.markdown, ""];
  question.options.forEach((option, index) => parts.push(`${letters[index]}. ${option.text}`));
  parts.push("", `**Answer:** ${letters[question.correctIndex]}. ${question.correctAnswer}`, "");
  parts.push(question.locale === "hi-IN" ? `**मुख्य विचार:** ${question.explanation.keyIdea}` : `**ਮੁੱਖ ਵਿਚਾਰ:** ${question.explanation.keyIdea}`, "");
  question.explanation.steps.forEach((step, index) => parts.push(`${index + 1}. ${step}`));
  if (question.explanation.shortcut) parts.push("", `**${question.explanation.shortcut.title}:** ${question.explanation.shortcut.steps.join(" ")}`);
  if (question.explanation.commonMistake) parts.push("", question.locale === "hi-IN" ? `**सामान्य गलती:** ${question.explanation.commonMistake}` : `**ਆਮ ਗਲਤੀ:** ${question.explanation.commonMistake}`);
  parts.push("");
  return parts.join("\n");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
for (const locale of LOCALES) {
  const questions: IntCp003LocalizedQuestion[] = [];
  for (const qlId of INT_CP003_QL_IDS) {
    for (let frame = 0; frame < 4; frame += 1) questions.push(selectQuestion(qlId, locale, frame));
  }
  if (questions.length !== 56) throw new Error(`${locale}: expected 56 questions.`);
  const slots = [0, 0, 0, 0];
  const byQl = new Map<string, number>();
  const seenByQl = new Map<string, Set<string>>();
  let prose = 0;
  let table = 0;
  for (const question of questions) {
    validateQuestion(question);
    slots[question.correctIndex] += 1;
    byQl.set(question.qlId, (byQl.get(question.qlId) ?? 0) + 1);
    const seen = seenByQl.get(question.qlId) ?? new Set<string>();
    if (seen.has(question.presentation.markdown)) throw new Error(`${locale}/${question.qlId}: duplicate review stem.`);
    seen.add(question.presentation.markdown);
    seenByQl.set(question.qlId, seen);
    if (question.presentation.representation === "STANDARD_PROSE") prose += 1; else table += 1;
  }
  for (const qlId of INT_CP003_QL_IDS) if (byQl.get(qlId) !== 4) throw new Error(`${locale}/${qlId}: review count is not four.`);
  if (slots.some((slot) => slot !== 14)) throw new Error(`${locale}: answer slots ${slots.join("/")} are not 14/14/14/14.`);
  const name = locale === "hi-IN" ? "Hindi" : "Punjabi";
  const markdown = [
    `# INT-CP-003 ${name} Final V3 Review — 56 Questions`,
    "",
    "Runtime: `INT-CP-003-HI-PA-FINAL-RUNTIME-v3`",
    "Canonical English: `INT-CP-003-EN-v1-frozen`",
    "",
    ...questions.map((question, index) => render(question, index + 1)),
  ].join("\n");
  writeFileSync(join(OUTPUT_DIR, `INT-CP-003-${name}-Final-V3-Review.md`), markdown, "utf8");
  writeFileSync(join(OUTPUT_DIR, `INT-CP-003-${name}-Final-V3-Review.json`), JSON.stringify(questions, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2), "utf8");
  console.log(JSON.stringify({ status: "PASS_INT_CP003_HI_PA_FINAL_V3_REVIEW_EXPORT", locale, questions: 56, prose, table, answerPositions: slots, duplicateStems: 0, uglyDecimals: 0, wrapperViolations: 0, manualFindingRegressions: 0 }, null, 2));
}
