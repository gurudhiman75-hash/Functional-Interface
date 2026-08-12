import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS, type IntCp004QlId } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import {
  generateIntCp004V6LocalizedQuestion,
  INT_CP004_V6_LOCALIZED_LOCALES,
} from "./cp004-localization-v6-runtime";
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
    return generateIntCp004V6LocalizedQuestion(qlId, seed, locale);
  }
  throw new Error(`${qlId}/${locale}: could not regenerate frame ${frame}.`);
}

function renderMarkdown(locale: IntCp004V6Locale, questions: readonly IntCp004V6LocalizedQuestion[]): string {
  const lines: string[] = [
    locale === "hi-IN" ? "# INT-CP-004 — हिंदी प्रश्न और हल" : "# INT-CP-004 — ਪੰਜਾਬੀ ਪ੍ਰਸ਼ਨ ਅਤੇ ਹੱਲ",
    "",
  ];
  questions.forEach((question, index) => {
    lines.push(`## ${locale === "hi-IN" ? "प्रश्न" : "ਪ੍ਰਸ਼ਨ"} ${index + 1}`, "", question.stem, "");
    question.options.forEach((option) => lines.push(`**${option.id}.** ${option.text}`));
    lines.push(
      "",
      `**${locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ"}:** ${question.correctAnswer}`,
      "",
      `### ${locale === "hi-IN" ? "हल" : "ਹੱਲ"}`,
      "",
      question.explanation.whatAsked,
      "",
    );
    question.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push(
      "",
      `**${locale === "hi-IN" ? "अंतिम उत्तर" : "ਅੰਤਿਮ ਉੱਤਰ"}:** ${question.correctAnswer}`,
      "",
      `**${locale === "hi-IN" ? "ध्यान रखें" : "ਧਿਆਨ ਰੱਖੋ"}:** ${question.explanation.commonMistake}`,
      "",
      "---",
      "",
    );
  });
  return `${lines.join("\n")}\n`;
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-localization-review");
mkdirSync(outputDirectory, { recursive: true });

const summary: Record<string, unknown> = {
  canonicalFreezeId: "INT-CP-004-EN-v2-frozen",
  qlCount: INT_CP004_QL_IDS.length,
  locales: {},
};

for (const locale of INT_CP004_V6_LOCALIZED_LOCALES) {
  const questions = INT_CP004_QL_IDS.flatMap((qlId) => [1, 2, 3, 4].map((frame) => questionForFrame(qlId, frame, locale)));
  if (questions.length !== 76) fail(`${locale}: review count changed to ${questions.length}.`);
  const answerPositions = [0, 0, 0, 0];
  let tableQuestions = 0;
  let formulaFirst = 0;
  const fingerprints = new Set<string>();
  for (const question of questions) {
    answerPositions[question.correctIndex] += 1;
    if (hasTable(question.stem)) tableQuestions += 1;
    const prefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
    if (question.explanation.steps[0]?.startsWith(prefix)) formulaFirst += 1;
    fingerprints.add(`${question.qlId}|${question.seed}|${question.stemFamilyId}`);
  }
  const proseQuestions = questions.length - tableQuestions;
  if (answerPositions.some((count) => count !== 19)) fail(`${locale}: answer positions are not 19/19/19/19: ${answerPositions.join("/")}.`);
  if (tableQuestions > 12) fail(`${locale}: too many tables in review pack: ${tableQuestions}/76.`);
  if (proseQuestions < 64) fail(`${locale}: prose share fell below the V6 standard: ${proseQuestions}/76.`);
  if (formulaFirst !== 76) fail(`${locale}: formula-first coverage changed: ${formulaFirst}/76.`);
  if (fingerprints.size !== 76) fail(`${locale}: review pack contains repeated frame identities.`);

  const markdown = renderMarkdown(locale, questions);
  const baseName = locale === "hi-IN" ? "INT-CP-004-Hindi-V6-Review" : "INT-CP-004-Punjabi-V6-Review";
  writeFileSync(join(outputDirectory, `${baseName}.md`), markdown);
  writeFileSync(join(outputDirectory, `${baseName}.json`), `${JSON.stringify(serializable(questions), null, 2)}\n`);
  (summary.locales as Record<string, unknown>)[locale] = {
    questions: questions.length,
    proseQuestions,
    tableQuestions,
    formulaFirst,
    answerPositions,
    distinctFrameIdentities: fingerprints.size,
  };
}

writeFileSync(join(outputDirectory, "int-cp004-hi-pa-v6-review-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_REVIEW_EXPORT");
