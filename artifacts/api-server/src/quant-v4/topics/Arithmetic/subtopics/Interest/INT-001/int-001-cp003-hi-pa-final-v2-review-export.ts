import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP003_QL_IDS } from "./cp003-exam-model";
import { generateIntCp003FinalLocalizedQuestionV2 } from "./cp003-localized-final-runtime-v2";
import type { IntCp003LocalizedLocale, IntCp003LocalizedQuestion } from "./cp003-localization-types";

const OUTPUT_DIR = process.argv[2] ?? "review-artifacts/int-cp003-hi-pa-final-v2";
const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const satisfies readonly IntCp003LocalizedLocale[]);

function selectQuestion(
  qlId: (typeof INT_CP003_QL_IDS)[number],
  locale: IntCp003LocalizedLocale,
  frame: number,
): IntCp003LocalizedQuestion {
  const desiredIndex = frame;
  for (let attempt = 0; attempt < 320; attempt += 1) {
    const seed = `int-cp003-final-review:${qlId}:frame-${frame}:attempt-${attempt}`;
    const question = generateIntCp003FinalLocalizedQuestionV2(qlId, seed, locale);
    if (question.correctIndex === desiredIndex) return question;
  }
  throw new Error(`${qlId}/${locale}/frame-${frame}: could not find desired answer position ${desiredIndex}.`);
}

function markdownQuestion(question: IntCp003LocalizedQuestion, number: number): string {
  const letters = ["A", "B", "C", "D"];
  const lines: string[] = [];
  lines.push(`## Q${number} — ${question.qlId}`);
  lines.push("");
  lines.push(question.presentation.markdown);
  lines.push("");
  question.options.forEach((option, index) => lines.push(`${letters[index]}. ${option.text}`));
  lines.push("");
  lines.push(`**Answer:** ${letters[question.correctIndex]}. ${question.correctAnswer}`);
  lines.push("");
  lines.push(question.locale === "hi-IN" ? `**मुख्य विचार:** ${question.explanation.keyIdea}` : `**ਮੁੱਖ ਵਿਚਾਰ:** ${question.explanation.keyIdea}`);
  lines.push("");
  question.explanation.steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step}`);
  });
  if (question.explanation.shortcut) {
    lines.push("");
    lines.push(`**${question.explanation.shortcut.title}:** ${question.explanation.shortcut.steps.join(" ")}`);
  }
  if (question.explanation.commonMistake) {
    lines.push("");
    lines.push(question.locale === "hi-IN" ? `**सामान्य गलती:** ${question.explanation.commonMistake}` : `**ਆਮ ਗਲਤੀ:** ${question.explanation.commonMistake}`);
  }
  lines.push("");
  return lines.join("\n");
}

function outsideMath(text: string): string {
  return text.replace(/\\\([^]*?\\\)/gu, "").replace(/\\\[[^]*?\\\]/gu, "");
}

function validateReview(locale: IntCp003LocalizedLocale, questions: readonly IntCp003LocalizedQuestion[]): void {
  if (questions.length !== 56) throw new Error(`${locale}: expected 56 review questions, got ${questions.length}.`);
  const counts = [0, 0, 0, 0];
  const byQl = new Map<string, number>();
  const stemSets = new Map<string, Set<string>>();
  let prose = 0;
  let tables = 0;
  for (const question of questions) {
    counts[question.correctIndex] += 1;
    byQl.set(question.qlId, (byQl.get(question.qlId) ?? 0) + 1);
    const stems = stemSets.get(question.qlId) ?? new Set<string>();
    if (stems.has(question.presentation.markdown)) throw new Error(`${locale}/${question.qlId}: duplicate learner-facing review stem.`);
    stems.add(question.presentation.markdown);
    stemSets.set(question.qlId, stems);
    if (question.presentation.representation === "STANDARD_PROSE") prose += 1;
    else tables += 1;

    const strings = [
      question.presentation.markdown,
      ...question.options.flatMap((option) => [option.text, option.studentFeedback]),
      question.explanation.keyIdea,
      ...question.explanation.steps,
      question.explanation.finalAnswer,
      ...(question.explanation.commonMistake ? [question.explanation.commonMistake] : []),
    ];
    const joined = strings.join("\n");
    if (/\$/u.test(joined)) throw new Error(`${locale}/${question.qlId}: legacy dollar math delimiter in review.`);
    if (/\d[\d,]*\.\d{3,}/u.test(joined)) throw new Error(`${locale}/${question.qlId}: ugly >2-place decimal in review.`);
    if (/₹\s*\d[\d,]*\.00\b/u.test(joined)) throw new Error(`${locale}/${question.qlId}: whole-rupee .00 in review.`);
    if (/ज्ञात कीजिए|ਪਤਾ ਕਰੋ/gu.test(joined)) throw new Error(`${locale}/${question.qlId}: direct command wording in review.`);
    if (locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/gu.test(joined)) throw new Error(`${locale}/${question.qlId}: rejected Punjabi compound-interest term in review.`);
    if (!question.explanation.steps[0]?.match(locale === "hi-IN" ? /^सूत्र: .*\\\(.+\\\)/u : /^ਸੂਤਰ: .*\\\(.+\\\)/u)) {
      throw new Error(`${locale}/${question.qlId}: formula-first review explanation missing.`);
    }
    for (const text of strings) {
      if (/[=×÷^]|\\(?:frac|times|div|left|right|%)/u.test(outsideMath(text))) {
        throw new Error(`${locale}/${question.qlId}: raw math outside wrappers in review: ${text}`);
      }
    }
  }
  for (const qlId of INT_CP003_QL_IDS) {
    if (byQl.get(qlId) !== 4) throw new Error(`${locale}/${qlId}: expected four review frames.`);
  }
  if (counts.some((count) => count !== 14)) throw new Error(`${locale}: answer positions are not 14/14/14/14: ${counts.join("/")}.`);
  console.log(JSON.stringify({ locale, questions: 56, prose, tables, answerPositions: counts, duplicateStems: 0, uglyDecimals: 0, formulaFirst: 56, legacyDollarMath: 0 }, null, 2));
}

mkdirSync(OUTPUT_DIR, { recursive: true });
for (const locale of LOCALES) {
  const questions: IntCp003LocalizedQuestion[] = [];
  for (const qlId of INT_CP003_QL_IDS) {
    for (let frame = 0; frame < 4; frame += 1) questions.push(selectQuestion(qlId, locale, frame));
  }
  validateReview(locale, questions);
  const languageName = locale === "hi-IN" ? "Hindi" : "Punjabi";
  const markdown = [
    `# INT-CP-003 ${languageName} Final V2 Review — 56 Questions`,
    "",
    `Authority: ${questions[0]!.freezeId}`,
    `Final runtime: INT-CP-003-HI-PA-FINAL-RUNTIME-v2`,
    "",
    ...questions.map((question, index) => markdownQuestion(question, index + 1)),
  ].join("\n");
  writeFileSync(join(OUTPUT_DIR, `INT-CP-003-${languageName}-Final-V2-Review.md`), markdown, "utf8");
  writeFileSync(join(OUTPUT_DIR, `INT-CP-003-${languageName}-Final-V2-Review.json`), JSON.stringify(questions, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2), "utf8");
}
