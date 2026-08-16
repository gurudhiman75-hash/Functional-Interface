import fs from "node:fs";
import path from "node:path";
import {
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationLocalizedQuestionV1,
  type MensurationLocalizedQuestionV1,
} from "./mensuration-localization-runtime-v1";
import {
  hasGurmukhiScript,
  hasHindiScript,
  instructionalLatinLeaks,
  type MensurationLocalizedLanguage,
} from "./mensuration-localization-foundation-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stripInternalIds(text: string) {
  return text.replace(/\[[A-Z0-9_:-]{3,}\]/g, " ");
}

function mathSignature(text: string) {
  const scrubbed = stripInternalIds(text);
  return (scrubbed.match(/\d+(?:\.\d+)?(?:\/\d+)?|\\frac\{[^}]+\}\{[^}]+\}|π|\\pi|√\d*|\\sqrt\{[^}]+\}|²|³|%|₹|°|[=+×÷−]/g) ?? []).join("|");
}

function variableSignature(text: string) {
  const scrubbed = stripInternalIds(text);
  const values: string[] = [];
  for (const match of scrubbed.matchAll(/\b([A-Za-z])\b(?=\s*(?:[²³^=+×÷−\-*/)]))/g)) values.push(match[1]!);
  for (const match of scrubbed.matchAll(/(?:[(=+×÷−\-*/]\s*)([A-Za-z])\b/g)) values.push(match[1]!);
  return values.sort().join("|");
}

function learnerFields(question: MensurationLocalizedQuestionV1) {
  return [
    question.stem,
    ...question.options,
    ...question.explanation.steps,
    question.explanation.shortcut,
    ...question.explanation.traps,
  ];
}

function questionMathSignature(question: MensurationLocalizedQuestionV1) {
  return learnerFields(question).map(mathSignature).join("||");
}

function questionVariableSignature(question: MensurationLocalizedQuestionV1) {
  return [question.stem, ...question.explanation.steps, question.explanation.shortcut, ...question.explanation.traps]
    .map(variableSignature)
    .join("||");
}

const languages: readonly MensurationLocalizedLanguage[] = ["hi", "pa"];
let localizedPairCount = 0;
let mathParityFailures = 0;
let variableParityFailures = 0;
let scriptFailures = 0;
let internalIdFailures = 0;
const residualLatinByProfile = new Map<string, Map<string, number>>();
const failureExamples: Array<Record<string, unknown>> = [];

for (const examProfile of MENSURATION_QUESTION_STUDIO_EXAM_PROFILES) {
  const profileLeaks = new Map<string, number>();
  residualLatinByProfile.set(examProfile, profileLeaks);
  for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
    const seed = `mensuration-localization-exam-profile:${examProfile}:${pattern.patternId}`;
    const english = generateMensurationLocalizedQuestionV1({
      patternId: pattern.patternId,
      seed,
      language: "en",
      examProfile,
    });

    for (const language of languages) {
      const localized = generateMensurationLocalizedQuestionV1({
        patternId: pattern.patternId,
        seed,
        language,
        examProfile,
      });
      localizedPairCount += 1;

      assert(localized.patternId === english.patternId, `${examProfile}/${pattern.patternId}/${language}: pattern drift.`);
      assert(localized.qlId === english.qlId, `${examProfile}/${pattern.patternId}/${language}: QL drift.`);
      assert(localized.cpId === english.cpId, `${examProfile}/${pattern.patternId}/${language}: CP drift.`);
      assert(localized.correctIndex === english.correctIndex, `${examProfile}/${pattern.patternId}/${language}: correct-index drift.`);
      assert(localized.options.length === english.options.length, `${examProfile}/${pattern.patternId}/${language}: option-count drift.`);
      assert(localized.options[localized.correctIndex] === localized.answer, `${examProfile}/${pattern.patternId}/${language}: answer parity failed.`);
      assert(localized.realism.numericalStateSignature === english.realism.numericalStateSignature, `${examProfile}/${pattern.patternId}/${language}: numerical-state drift.`);
      assert(localized.realism.examProfile === english.realism.examProfile, `${examProfile}/${pattern.patternId}/${language}: exam-profile metadata drift.`);

      const englishMath = questionMathSignature(english);
      const localizedMath = questionMathSignature(localized);
      if (englishMath !== localizedMath) {
        mathParityFailures += 1;
        if (failureExamples.length < 60) failureExamples.push({ examProfile, patternId: pattern.patternId, language, kind: "MATH", englishMath, localizedMath, stem: localized.stem });
      }

      const englishVariables = questionVariableSignature(english);
      const localizedVariables = questionVariableSignature(localized);
      if (englishVariables !== localizedVariables) {
        variableParityFailures += 1;
        if (failureExamples.length < 60) failureExamples.push({ examProfile, patternId: pattern.patternId, language, kind: "VARIABLE", englishVariables, localizedVariables, stem: localized.stem });
      }

      const text = learnerFields(localized).join("\n");
      if (language === "hi" ? !hasHindiScript(text) : !hasGurmukhiScript(text)) scriptFailures += 1;
      if (/\[[A-Z0-9_:-]{3,}\]/.test(localized.explanation.traps.join("\n"))) internalIdFailures += 1;
      for (const leak of instructionalLatinLeaks(text)) profileLeaks.set(leak, (profileLeaks.get(leak) ?? 0) + 1);
    }
  }
}

const expectedPairs = MENSURATION_QUESTION_STUDIO_PATTERNS.length * MENSURATION_QUESTION_STUDIO_EXAM_PROFILES.length * languages.length;
assert(localizedPairCount === expectedPairs, `Expected ${expectedPairs} cross-profile localized pairs, got ${localizedPairCount}.`);
assert(mathParityFailures === 0, `Cross-profile localization has ${mathParityFailures} math-signature failures.`);
assert(variableParityFailures === 0, `Cross-profile localization has ${variableParityFailures} formula-variable failures.`);
assert(scriptFailures === 0, `Cross-profile localization has ${scriptFailures} script-presence failures.`);
assert(internalIdFailures === 0, `Cross-profile localization exposes ${internalIdFailures} internal learner IDs.`);

const profiles = Object.fromEntries([...residualLatinByProfile.entries()].map(([profile, counts]) => {
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return [profile, {
    residualInstructionalLatinUnique: sorted.length,
    residualInstructionalLatinOccurrences: sorted.reduce((sum, [, count]) => sum + count, 0),
    topResidualInstructionalLatin: sorted.slice(0, 100).map(([token, count]) => ({ token, count })),
  }];
}));

const report = {
  authority: "MENSURATION-HI-PA-EXAM-PROFILE-LOCALIZATION-AUDIT-V1",
  patternCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  examProfiles: MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  localizedPairCount,
  mathParityFailures,
  variableParityFailures,
  scriptFailures,
  internalIdFailures,
  profiles,
  failureExamples,
};

const outputDir = path.resolve(process.cwd(), "artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "mensuration-localization-exam-profile-audit-v1.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outputDir, "mensuration-localization-exam-profile-audit-v1.md"), [
  "# Mensuration Hindi/Punjabi Exam-Profile Localization Audit V1",
  "",
  `- Patterns: **${report.patternCount}**`,
  `- Exam profiles: **${report.examProfiles.join(", ")}**`,
  `- Hindi/Punjabi parity pairs: **${localizedPairCount}**`,
  `- Math failures: **${mathParityFailures}**`,
  `- Formula-variable failures: **${variableParityFailures}**`,
  `- Script failures: **${scriptFailures}**`,
  `- Internal learner-ID failures: **${internalIdFailures}**`,
  "",
  "Residual instructional Latin is reported separately for each exam profile for editorial remediation.",
  "",
].join("\n"));
console.log(JSON.stringify(report, null, 2));
