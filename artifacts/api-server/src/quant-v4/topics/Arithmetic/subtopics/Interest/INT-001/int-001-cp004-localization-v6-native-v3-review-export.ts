import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS, type IntCp004QlId } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { generateIntCp004V6NativeEditorialV3Question } from "./cp004-localization-v6-native-editorial-v3";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

const fail = (message: string): never => { throw new Error(message); };
const hasTable = (text: string): boolean => /^\|.+\|$/mu.test(text) && /^\|\s*[-:]+/mu.test(text);
const serializable = (value: unknown): unknown => JSON.parse(JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item));

function questionForFrame(qlId: IntCp004QlId, frame: number, locale: IntCp004V6Locale): IntCp004V6LocalizedQuestion {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const seed = `int-cp004-review:${qlId}:frame-${frame}:attempt-${attempt}`;
    const source = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    if (source.stemFamilyId.endsWith(`FRAME-${frame}`)) return generateIntCp004V6NativeEditorialV3Question(qlId, seed, locale);
  }
  throw new Error(`${qlId}/${locale}: frame ${frame} unavailable.`);
}

function markdown(locale: IntCp004V6Locale, questions: readonly IntCp004V6LocalizedQuestion[]): string {
  const lines = [locale === "hi-IN" ? "# INT-CP-004 — हिंदी प्रश्न और हल — V6 Native" : "# INT-CP-004 — ਪੰਜਾਬੀ ਪ੍ਰਸ਼ਨ ਅਤੇ ਹੱਲ — V6 Native", ""];
  questions.forEach((q, index) => {
    lines.push(`## ${locale === "hi-IN" ? "प्रश्न" : "ਪ੍ਰਸ਼ਨ"} ${index + 1}`, "", q.stem, "");
    q.options.forEach((option) => lines.push(`**${option.id}.** ${option.text}`));
    lines.push("", `**${locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ"}:** ${q.correctAnswer}`, "", `### ${locale === "hi-IN" ? "हल" : "ਹੱਲ"}`, "", q.explanation.whatAsked, "");
    q.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    lines.push("", `**${locale === "hi-IN" ? "अंतिम उत्तर" : "ਅੰਤਿਮ ਉੱਤਰ"}:** ${q.correctAnswer}`, "", `**${locale === "hi-IN" ? "ध्यान रखें" : "ਧਿਆਨ ਰੱਖੋ"}:** ${q.explanation.commonMistake}`, "", "---", "");
  });
  return `${lines.join("\n")}\n`;
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-native-v3-review");
mkdirSync(outputDirectory, { recursive: true });
const summary: Record<string, unknown> = { canonicalFreezeId: "INT-CP-004-EN-v2-frozen", editorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v3", qlCount: 19, locales: {} };

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const questions = INT_CP004_QL_IDS.flatMap((qlId) => [1, 2, 3, 4].map((frame) => questionForFrame(qlId, frame, locale)));
  if (questions.length !== 76) fail(`${locale}: review count ${questions.length}.`);
  const answerPositions = [0, 0, 0, 0];
  let tables = 0;
  let formulaFirst = 0;
  questions.forEach((q) => {
    answerPositions[q.correctIndex] += 1;
    if (hasTable(q.stem)) tables += 1;
    const prefix = locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:";
    if (q.explanation.steps[0]?.startsWith(prefix)) formulaFirst += 1;
  });
  if (answerPositions.some((count) => count !== 19)) fail(`${locale}: answer positions ${answerPositions.join("/")}.`);
  if (tables !== 10 || 76 - tables !== 66) fail(`${locale}: prose/table mix ${76 - tables}/${tables}.`);
  if (formulaFirst !== 76) fail(`${locale}: formula first ${formulaFirst}/76.`);
  const fileBase = locale === "hi-IN" ? "INT-CP-004-Hindi-V6-Native-V3-Review" : "INT-CP-004-Punjabi-V6-Native-V3-Review";
  writeFileSync(join(outputDirectory, `${fileBase}.md`), markdown(locale, questions));
  writeFileSync(join(outputDirectory, `${fileBase}.json`), `${JSON.stringify(serializable(questions), null, 2)}\n`);
  (summary.locales as Record<string, unknown>)[locale] = { questions: 76, proseQuestions: 66, tableQuestions: 10, formulaFirst, answerPositions };
}
writeFileSync(join(outputDirectory, "int-cp004-hi-pa-v6-native-v3-review-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_NATIVE_V3_REVIEW_EXPORT");
