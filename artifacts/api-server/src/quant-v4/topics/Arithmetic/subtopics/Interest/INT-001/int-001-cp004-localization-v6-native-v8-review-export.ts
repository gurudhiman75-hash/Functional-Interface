import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { INT_CP004_QL_IDS, type IntCp004QlId } from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenV2Question } from "./cp004-english-frozen-runtime-v2";
import { generateIntCp004V6NativeEditorialV8Question } from "./cp004-localization-v6-native-editorial-v8";
import type { IntCp004V6Locale, IntCp004V6LocalizedQuestion } from "./cp004-localization-v6-types";

const fail = (message: string): never => { throw new Error(message); };
const hasTable = (text: string): boolean => /^\|.+\|$/mu.test(text) && /^\|\s*[-:]+/mu.test(text);
const directStem = (locale: IntCp004V6Locale, text: string): boolean => (locale === "hi-IN" ? /(?:ज्ञात कीजिए|निकालिए)[।?]?$/u : /(?:ਪਤਾ ਕਰੋ|ਕੱਢੋ)[।?]?$/u).test(text);
const serializable = (value: unknown): unknown => JSON.parse(JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item));

function outsideMath(text: string): string {
  return text.replace(/\\\([\s\S]*?\\\)/gu, "").replace(/\\\[[\s\S]*?\\\]/gu, "");
}

function questionForFrame(qlId: IntCp004QlId, frame: number, locale: IntCp004V6Locale, used: Set<string>): IntCp004V6LocalizedQuestion {
  let targetCorrectIndex: number | null = null;
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const seed = `int-cp004-v5-review:${qlId}:frame-${frame}:attempt-${attempt}`;
    const source = generateIntCp004EnglishFrozenV2Question(qlId, seed);
    if (!source.stemFamilyId.endsWith(`FRAME-${frame}`)) continue;
    const q = generateIntCp004V6NativeEditorialV8Question(qlId, seed, locale);
    if (targetCorrectIndex === null) targetCorrectIndex = q.correctIndex;
    if (q.correctIndex !== targetCorrectIndex || used.has(q.stem)) continue;
    used.add(q.stem);
    return q;
  }
  throw new Error(`${qlId}/${locale}: unique learner-facing frame ${frame} unavailable.`);
}

function answerDisplay(q: IntCp004V6LocalizedQuestion): string {
  return q.explanation.finalAnswer.replace(/^(?:उत्तर:|ਉੱਤਰ:)\s*/u, "").replace(/[।.]$/u, "");
}

function markdown(locale: IntCp004V6Locale, questions: readonly IntCp004V6LocalizedQuestion[]): string {
  const lines = [locale === "hi-IN" ? "# INT-CP-004 — हिंदी पूर्ण समीक्षा — V8 Final" : "# INT-CP-004 — ਪੰਜਾਬੀ ਪੂਰੀ ਸਮੀਖਿਆ — V8 Final", ""];
  questions.forEach((q, index) => {
    const answer = answerDisplay(q);
    lines.push(`## ${locale === "hi-IN" ? "प्रश्न" : "ਪ੍ਰਸ਼ਨ"} ${index + 1} — ${q.qlId}`, "", q.stem, "");
    q.options.forEach((o) => lines.push(`**${o.id}.** ${o.text}`));
    lines.push("", `**${locale === "hi-IN" ? "उत्तर" : "ਉੱਤਰ"}:** ${answer}`, "", `### ${locale === "hi-IN" ? "हल" : "ਹੱਲ"}`, "", q.explanation.whatAsked, "");
    q.explanation.steps.forEach((step, i) => lines.push(`${i + 1}. ${step}`));
    lines.push("", `**${locale === "hi-IN" ? "अंतिम उत्तर" : "ਅੰਤਿਮ ਉੱਤਰ"}:** ${answer}`, "", `**${locale === "hi-IN" ? "ध्यान रखें" : "ਧਿਆਨ ਰੱਖੋ"}:** ${q.explanation.commonMistake}`, "", "---", "");
  });
  return `${lines.join("\n")}\n`;
}

const output = join(process.cwd(), "dist", "quant-v4", "int-cp004-hi-pa-v6-native-v8-review");
mkdirSync(output, { recursive: true });
const summary: Record<string, unknown> = { canonicalFreezeId: "INT-CP-004-EN-v2-frozen", editorialVersion: "INT-CP-004-HI-PA-V6-NATIVE-EDITORIAL-v8", qlCount: 19, locales: {} };

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const questions: IntCp004V6LocalizedQuestion[] = [];
  for (const qlId of INT_CP004_QL_IDS) {
    const used = new Set<string>();
    for (const frame of [1, 2, 3, 4]) questions.push(questionForFrame(qlId, frame, locale, used));
  }
  if (questions.length !== 76) fail(`${locale}: review count ${questions.length}.`);

  const answerPositions = [0, 0, 0, 0];
  const seen = new Set<string>();
  let tables = 0, formulaFirst = 0, directStems = 0, duplicateStems = 0, wrapperViolations = 0;
  let uglyDecimals = 0, wholeRupeeDotZero = 0, malformedPercentFraction = 0, rejectedPunjabiTerms = 0, approximationAnswers = 0;

  for (const q of questions) {
    answerPositions[q.correctIndex] += 1;
    if (hasTable(q.stem)) tables += 1;
    if ((q.explanation.steps[0] ?? "").startsWith(locale === "hi-IN" ? "सूत्र:" : "ਸੂਤਰ:")) formulaFirst += 1;
    if (directStem(locale, q.stem)) directStems += 1;
    if (seen.has(q.stem)) duplicateStems += 1;
    seen.add(q.stem);
    if (q.explanation.finalAnswer.includes(locale === "hi-IN" ? "लगभग" : "ਲਗਭਗ")) approximationAnswers += 1;

    const visible = [q.stem, ...q.options.map((o) => o.text), q.correctAnswer, q.explanation.whatAsked, ...q.explanation.steps, q.explanation.finalAnswer, q.explanation.commonMistake];
    const joined = visible.join("\n");
    if (locale === "pa-IN" && /ਚੱਕਰਵੱਧੀ ਵਿਆਜ/u.test(joined)) rejectedPunjabiTerms += 1;
    if (/₹\s*[\d,]+\.00(?!\d)/u.test(joined)) wholeRupeeDotZero += 1;
    if (/\\frac\{\\%\}\{100\}/u.test(joined)) malformedPercentFraction += 1;
    for (const text of visible) for (const m of text.matchAll(/\d[\d,]*\.(\d+)/gu)) if ((m[1] ?? "").length > 2) uglyDecimals += 1;
    for (const step of q.explanation.steps) {
      const outside = outsideMath(step);
      if (step.includes("$") || /[=×÷−^]/u.test(outside) || /\\(?:frac|dfrac|times|div)/u.test(outside)) wrapperViolations += 1;
    }
  }

  if (answerPositions.some((n) => n !== 19)) fail(`${locale}: answer positions ${answerPositions.join("/")}.`);
  if (tables !== 10 || 76 - tables !== 66) fail(`${locale}: prose/table mix ${76 - tables}/${tables}.`);
  if (formulaFirst !== 76 || directStems || duplicateStems || wrapperViolations || uglyDecimals || wholeRupeeDotZero || malformedPercentFraction || rejectedPunjabiTerms) {
    fail(`${locale}: review guard failed: formula=${formulaFirst}, direct=${directStems}, dup=${duplicateStems}, wrapper=${wrapperViolations}, ugly=${uglyDecimals}, rupee00=${wholeRupeeDotZero}, malformed=${malformedPercentFraction}, Punjabi=${rejectedPunjabiTerms}.`);
  }
  if (approximationAnswers === 0) fail(`${locale}: approximation case missing.`);

  const fileBase = locale === "hi-IN" ? "INT-CP-004-Hindi-V8-Full-Review" : "INT-CP-004-Punjabi-V8-Full-Review";
  writeFileSync(join(output, `${fileBase}.md`), markdown(locale, questions));
  writeFileSync(join(output, `${fileBase}.json`), `${JSON.stringify(serializable(questions), null, 2)}\n`);
  (summary.locales as Record<string, unknown>)[locale] = { questions: 76, proseQuestions: 66, tableQuestions: 10, formulaFirst, directStems, duplicateStems, wrapperViolations, uglyDecimals, wholeRupeeDotZero, malformedPercentFraction, rejectedPunjabiTerms, approximationAnswers, answerPositions };
}

writeFileSync(join(output, "int-cp004-hi-pa-v6-native-v8-review-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_HI_PA_V6_NATIVE_V8_REVIEW_EXPORT");
