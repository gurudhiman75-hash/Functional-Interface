import fs from "node:fs";
import path from "node:path";
import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationLocalizedQuestionV1,
  type MensurationLocalizedQuestionV1,
} from "./mensuration-localization-runtime-v1";
import {
  hasGurmukhiScript,
  hasHindiScript,
  instructionalLatinLeaks,
  type MensurationLocalizedLanguage,
} from "./mensuration-localization-foundation-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function mathSignature(text: string) {
  return (text.match(/\d+(?:\.\d+)?(?:\/\d+)?|\\frac\{[^}]+\}\{[^}]+\}|π|\\pi|√\d*|\\sqrt\{[^}]+\}|²|³|%|₹|°|[=+×÷−]/g) ?? []).join("|");
}

function questionMathSignature(question: MensurationLocalizedQuestionV1) {
  return [
    question.stem,
    ...question.options,
    ...question.explanation.steps,
    question.explanation.shortcut,
    ...question.explanation.traps,
  ].map(mathSignature).join("||");
}

function formulaVariableSignature(text: string) {
  const values: string[] = [];
  for (const match of text.matchAll(/\b([A-Za-z])\b(?=\s*(?:[²³^=+×÷−\-*/)]))/g)) values.push(match[1]!);
  for (const match of text.matchAll(/(?:[(=+×÷−\-*/]\s*)([A-Za-z])\b/g)) values.push(match[1]!);
  return values.sort().join("|");
}

function questionVariableSignature(question: MensurationLocalizedQuestionV1) {
  return [question.stem, ...question.explanation.steps, question.explanation.shortcut, ...question.explanation.traps]
    .map(formulaVariableSignature)
    .join("||");
}

function dollarsBalanced(text: string) {
  return (text.match(/\$/g) ?? []).length % 2 === 0;
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

const locales: readonly MensurationLocalizedLanguage[] = ["hi", "pa"];
let pairCount = 0;
let scriptFailures = 0;
let mathParityFailures = 0;
let formulaVariableFailures = 0;
let misconceptionParityFailures = 0;
let visibleInternalIds = 0;
let malformedMath = 0;
let unchangedLocalizedStems = 0;
const latinLeakCounts = new Map<string, number>();
const leakExamples = new Map<string, Array<Record<string, string>>>();
const reviewRows: Array<Record<string, unknown>> = [];
const perCpLanguageReviewCount = new Map<string, number>();

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const seed = `mensuration-localization-parity:${pattern.patternId}:${index}`;
    const english = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language: "en", examProfile: "SSC_CORE" });
    assert(english.language === "en" && english.locale === "en-IN", `${pattern.patternId}: English authority changed locale.`);
    assert(english.options[english.correctIndex] === english.answer, `${pattern.patternId}: English answer parity failed.`);

    for (const language of locales) {
      const localized = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language, examProfile: "SSC_CORE" });
      pairCount += 1;
      assert(localized.patternId === english.patternId, `${pattern.patternId}/${language}: pattern identity drift.`);
      assert(localized.qlId === english.qlId, `${pattern.patternId}/${language}: QL identity drift.`);
      assert(localized.cpId === english.cpId, `${pattern.patternId}/${language}: CP identity drift.`);
      assert(localized.packageId === english.packageId, `${pattern.patternId}/${language}: package identity drift.`);
      assert(localized.correctIndex === english.correctIndex, `${pattern.patternId}/${language}: correct index drift.`);
      assert(localized.options.length === english.options.length, `${pattern.patternId}/${language}: option count drift.`);
      assert(localized.options[localized.correctIndex] === localized.answer, `${pattern.patternId}/${language}: localized answer parity failed.`);
      assert(localized.difficultyBand === english.difficultyBand, `${pattern.patternId}/${language}: difficulty drift.`);
      assert(localized.solveMode === english.solveMode, `${pattern.patternId}/${language}: solve-mode drift.`);
      assert(localized.realism.numericalStateSignature === english.realism.numericalStateSignature, `${pattern.patternId}/${language}: numerical-state drift.`);
      assert(localized.realism.frequencyBand === english.realism.frequencyBand, `${pattern.patternId}/${language}: frequency-band drift.`);
      assert(localized.realism.selectionWeight === english.realism.selectionWeight, `${pattern.patternId}/${language}: selection-weight drift.`);
      assert(localized.realism.sourceSeed === english.realism.sourceSeed, `${pattern.patternId}/${language}: source-seed drift.`);
      assert(localized.validation.valid === english.validation.valid, `${pattern.patternId}/${language}: validation status drift.`);
      assert(localized.localization?.mathematicalStatePreserved === true, `${pattern.patternId}/${language}: localization contract missing.`);

      const englishMisconceptions = english.optionDetails.map((option) => option.misconceptionId ?? null);
      const localizedMisconceptions = localized.optionDetails.map((option) => option.misconceptionId ?? null);
      if (JSON.stringify(englishMisconceptions) !== JSON.stringify(localizedMisconceptions)) misconceptionParityFailures += 1;

      const englishMath = questionMathSignature(english);
      const localizedMath = questionMathSignature(localized);
      if (englishMath !== localizedMath) mathParityFailures += 1;

      const englishVariables = questionVariableSignature(english);
      const localizedVariables = questionVariableSignature(localized);
      if (englishVariables !== localizedVariables) formulaVariableFailures += 1;

      const text = learnerText(localized);
      if (!dollarsBalanced(text) || /\\pih\b/.test(text)) malformedMath += 1;
      if (/\[[A-Z0-9_:-]{3,}\]/.test(localized.explanation.traps.join("\n"))) visibleInternalIds += 1;
      if (localized.stem === english.stem) unchangedLocalizedStems += 1;
      if (language === "hi" ? !hasHindiScript(text) : !hasGurmukhiScript(text)) scriptFailures += 1;

      const leaks = instructionalLatinLeaks(text);
      for (const leak of leaks) {
        latinLeakCounts.set(leak, (latinLeakCounts.get(leak) ?? 0) + 1);
        if (!leakExamples.has(leak)) leakExamples.set(leak, []);
        const examples = leakExamples.get(leak)!;
        if (examples.length < 3) examples.push({ language, cpId: localized.cpId, patternId: localized.patternId, stem: localized.stem });
      }

      const reviewKey = `${localized.cpId}:${language}`;
      const reviewCount = perCpLanguageReviewCount.get(reviewKey) ?? 0;
      if (reviewCount < 3 && index === reviewCount % 4) {
        reviewRows.push({
          language,
          locale: localized.locale,
          cpId: localized.cpId,
          patternId: localized.patternId,
          difficulty: localized.difficultyBand,
          stem: localized.stem,
          options: localized.options,
          correctIndex: localized.correctIndex,
          answer: localized.answer,
          explanation: localized.explanation,
          residualInstructionalLatin: leaks,
        });
        perCpLanguageReviewCount.set(reviewKey, reviewCount + 1);
      }
    }
  }
}

assert(pairCount === MENSURATION_QUESTION_STUDIO_PATTERNS.length * 4 * 2, `Expected 3,192 localized parity pairs, got ${pairCount}.`);
assert(scriptFailures === 0, `Localization has ${scriptFailures} script-presence failures.`);
assert(mathParityFailures === 0, `Localization has ${mathParityFailures} numerical/math signature failures.`);
assert(formulaVariableFailures === 0, `Localization has ${formulaVariableFailures} formula-variable preservation failures.`);
assert(misconceptionParityFailures === 0, `Localization has ${misconceptionParityFailures} misconception-mapping failures.`);
assert(visibleInternalIds === 0, `Localization exposes ${visibleInternalIds} internal misconception IDs in learner traps.`);
assert(malformedMath === 0, `Localization has ${malformedMath} malformed math states.`);
assert(unchangedLocalizedStems === 0, `Localization left ${unchangedLocalizedStems} stems unchanged.`);

const topLeaks = [...latinLeakCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const outputDir = path.resolve(process.cwd(), "artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
const diagnostics = {
  authority: "MENSURATION-HI-PA-NATIVE-LOCALIZATION-V1",
  patternCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  englishQuestionCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length * 4,
  localizedQuestionCount: pairCount,
  totalGeneratedQuestionCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length * 4 * 3,
  structural: {
    scriptFailures,
    mathParityFailures,
    formulaVariableFailures,
    misconceptionParityFailures,
    visibleInternalIds,
    malformedMath,
    unchangedLocalizedStems,
  },
  residualInstructionalLatinUnique: topLeaks.length,
  residualInstructionalLatinOccurrences: topLeaks.reduce((sum, [, count]) => sum + count, 0),
  topResidualInstructionalLatin: topLeaks.slice(0, 200).map(([token, count]) => ({ token, count, examples: leakExamples.get(token) ?? [] })),
};
fs.writeFileSync(path.join(outputDir, "mensuration-localization-parity-v1.json"), JSON.stringify(diagnostics, null, 2));
fs.writeFileSync(path.join(outputDir, "mensuration-localization-review-v1.json"), JSON.stringify({ authority: diagnostics.authority, rows: reviewRows }, null, 2));
fs.writeFileSync(path.join(outputDir, "mensuration-localization-parity-v1.md"), [
  "# Mensuration Hindi/Punjabi Localization Parity V1",
  "",
  `- Patterns: **${MENSURATION_QUESTION_STUDIO_PATTERNS.length}**`,
  `- English authority questions: **${diagnostics.englishQuestionCount}**`,
  `- Hindi/Punjabi localized questions: **${pairCount}**`,
  `- Total generated across 3 languages: **${diagnostics.totalGeneratedQuestionCount}**`,
  `- Math parity failures: **${mathParityFailures}**`,
  `- Formula-variable failures: **${formulaVariableFailures}**`,
  `- Misconception-map failures: **${misconceptionParityFailures}**`,
  `- Visible internal IDs: **${visibleInternalIds}**`,
  `- Malformed math: **${malformedMath}**`,
  `- Script failures: **${scriptFailures}**`,
  `- Unchanged localized stems: **${unchangedLocalizedStems}**`,
  `- Residual instructional Latin tokens: **${topLeaks.length} unique / ${diagnostics.residualInstructionalLatinOccurrences} occurrences**`,
  "",
  "Residual Latin is diagnostic in this stage and must be editorially reduced before final freeze.",
  "",
].join("\n"));

console.log(JSON.stringify(diagnostics, null, 2));
