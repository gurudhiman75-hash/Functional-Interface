import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS, type IntCp004QlId } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { generateIntCp004V6NativeEditorialQuestion } from "./cp004-localization-v6-native-editorial";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

function serializable(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item));
}

function fail(message: string): never {
  throw new Error(message);
}

function hasTable(text: string): boolean {
  return /^\|.+\|$/mu.test(text) && /^\|\s*[-:]+/mu.test(text);
}

function questionForFrame(qlId: IntCp004QlId, frame: number, locale: IntCp004V6Locale): IntCp004V6LocalizedQuestion {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const seed = `int-cp004-review:${qlId}:frame-${frame}:attempt-${attempt}`;
    const source = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    if (!source.stemFamilyId.endsWith(`FRAME-${frame}`)) continue;
    return generateIntCp004V6NativeEditorialQuestion(qlId, seed, locale);
  }
  throw new Error(`${qlId}/${locale}: could not regenerate frame ${frame}.`);
}

function render(locale: IntCp004V6Locale, questions: readonly IntCp004V6LocalizedQuestion[]): string {
  const lines: string[] = [locale === "hi-IN" ? "# INT-CP-004 — हिंदी प्रश्न और हल — V6" : "# INT-CP-004 — ਪੰਜਾਬੀ ਪ੍ਰਸ਼ਨ ਅਤੇ ਹੱਲ — V6", ""];
  questions.forEach((question, index) => {
    lines.push(`## ${locale === "hi-IN" ? "प्रश्न" : "ਪ੍ਰਸ਼ਨ"} ${index + 1}`, "", question.stem, "");
    question.options.forEach((option) => lines.push(`**${option.id}.** ${option.text}`));
    lines.push("", `**${locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ"}:** ${question.correctAnswer}`, "", `### ${locale === "hi-IN" ? "हल" : "ਹੱਲ"}`, "", question.explanation.whatAsked, "");
    question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push("", `**${locale === "hi-IN" ? "अंतिम उत्तर" : "ਅੰਤਿਮ ਉੱਤਰ"}:** ${question.correctAnswer}`, "", `**${locale === "hi-IN" ? "ध्यान रखें" : "ਧਿਆਨ ਰੱਖੋ"}:** ${question.explanation.commonMistake}`, "", "---", "");
  });
  return `${lines.join("\n")}\n`;
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-native-review");
mkdirSync(outputDirectory, { recursive: true });
const summary: Record<string, unknown> = { canonicalFreezeId: "INT-CP-004-EN-v2-frozen", editorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v2", qlCount: 19, locales: {} };

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const questions = INT_CP004_QL_IDS.flatMap((qlId) => [1, 2, 3, 4].map((frame) => questionForFrame(qlId, frame, locale)));
  if (questions.length !== 76) fail(`${locale}: expected 76 questions; received ${questions.length}.`);
  const answerPositions = [0, 0, 0, 0];
  let tables = 0;
  let formulaFirst = 0;
  for (const question of questions) {
    answerPositions[question.correctIndex] += 1;
    if (hasTable(question.stem)) tables += 1;
    const prefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
    if (question.explanation.steps[0]?.startsWith(prefix)) formulaFirst += 1;
  }
  const prose = 76 - tables;
  if (answerPositions.some((count) => count !== 19)) fail(`${locale}: answer positions changed: ${answerPositions.join("/")}.`);
  if (tables !== 10 || prose !== 66) fail(`${locale}: expected 66 prose / 10 tables, received ${prose}/${tables}.`);
  if (formulaFirst !== 76) fail(`${locale}: formula-first coverage is ${formulaFirst}/76.`);

  const name = locale === "hi-IN" ? "INT-CP-004-Hindi-V6-Native-Review" : "INT-CP-004-Punjabi-V6-Native-Review";
  writeFileSync(join(outputDirectory, `${name}.md`), render(locale, questions));
  writeFileSync(join(outputDirectory, `${name}.json`), `${JSON.stringify(serializable(questions), null, 2)}\n`);
  (summary.locales as Record<string, unknown>)[locale] = { questions: 76, proseQuestions: prose, tableQuestions: tables, formulaFirst, answerPositions };
}

writeFileSync(join(outputDirectory, "int-cp004-hi-pa-v6-native-review-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_NATIVE_REVIEW_EXPORT");
