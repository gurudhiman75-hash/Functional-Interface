import fs from "node:fs";
import path from "node:path";
import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationLocalizedQuestionV1,
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

function learnerFields(question: ReturnType<typeof generateMensurationLocalizedQuestionV1>) {
  return [
    ["stem", question.stem],
    ...question.options.map((value, index) => [`option-${index + 1}`, value] as const),
    ...question.explanation.steps.map((value, index) => [`step-${index + 1}`, value] as const),
    ["shortcut", question.explanation.shortcut] as const,
    ...question.explanation.traps.map((value, index) => [`trap-${index + 1}`, value] as const),
  ] as const;
}

const languages: readonly MensurationLocalizedLanguage[] = ["hi", "pa"];
const mixedTokenPattern = /[A-Za-z][\u0900-\u097F\u0A00-\u0A7F]|[\u0900-\u097F\u0A00-\u0A7F][A-Za-z]/u;
const internalIdPattern = /\[[A-Z0-9_:-]{3,}\]/;
let crossScriptLeakage = 0;
let mixedTokenCorruption = 0;
let internalIdLeakage = 0;
let questionsWithResidualLatin = 0;
let optionFieldsWithResidualLatin = 0;
const latinQuestionCounts = new Map<string, number>();
const latinFieldOccurrences = new Map<string, number>();
const fieldLatinOccurrences = new Map<string, number>();
const optionLatinOccurrences = new Map<string, number>();
const examples = new Map<string, Array<Record<string, string>>>();
const fieldExamples = new Map<string, Array<Record<string, string>>>();
const worstQuestions: Array<Record<string, unknown>> = [];
const hardGateExamples = {
  crossScriptLeakage: [] as Array<Record<string, string>>,
  mixedTokenCorruption: [] as Array<Record<string, string>>,
  internalIdLeakage: [] as Array<Record<string, string>>,
};

function pushHardGateExample(
  bucket: Array<Record<string, string>>,
  row: Record<string, string>,
) {
  if (bucket.length < 100) bucket.push(row);
}

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const seed = `mensuration-localization-editorial:${pattern.patternId}:${index}`;
    for (const language of languages) {
      const question = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language, examProfile: "SSC_CORE" });
      const fieldsForQuestion = learnerFields(question);
      const text = fieldsForQuestion.map(([, value]) => value).join("\n");
      const hasWrongScript = language === "hi" ? hasGurmukhiScript(text) : hasHindiScript(text);
      if (hasWrongScript) {
        crossScriptLeakage += 1;
        for (const [field, value] of fieldsForQuestion) {
          const fieldHasWrongScript = language === "hi" ? hasGurmukhiScript(value) : hasHindiScript(value);
          if (fieldHasWrongScript) {
            pushHardGateExample(hardGateExamples.crossScriptLeakage, {
              language,
              cpId: question.cpId,
              patternId: question.patternId,
              seed,
              field,
              text: value,
            });
          }
        }
      }
      if (mixedTokenPattern.test(text)) {
        mixedTokenCorruption += 1;
        for (const [field, value] of fieldsForQuestion) {
          if (mixedTokenPattern.test(value)) {
            pushHardGateExample(hardGateExamples.mixedTokenCorruption, {
              language,
              cpId: question.cpId,
              patternId: question.patternId,
              seed,
              field,
              text: value,
            });
          }
        }
      }
      const trapText = question.explanation.traps.join("\n");
      if (internalIdPattern.test(trapText)) {
        internalIdLeakage += 1;
        question.explanation.traps.forEach((value, trapIndex) => {
          if (internalIdPattern.test(value)) {
            pushHardGateExample(hardGateExamples.internalIdLeakage, {
              language,
              cpId: question.cpId,
              patternId: question.patternId,
              seed,
              field: `trap-${trapIndex + 1}`,
              text: value,
            });
          }
        });
      }

      const questionLeaks = new Set<string>();
      for (const [field, value] of fieldsForQuestion) {
        const leaks = instructionalLatinLeaks(value);
        if (field.startsWith("option-") && leaks.length) optionFieldsWithResidualLatin += 1;
        for (const leak of leaks) {
          questionLeaks.add(leak);
          latinFieldOccurrences.set(leak, (latinFieldOccurrences.get(leak) ?? 0) + 1);
          fieldLatinOccurrences.set(field, (fieldLatinOccurrences.get(field) ?? 0) + 1);
          if (field.startsWith("option-")) optionLatinOccurrences.set(leak, (optionLatinOccurrences.get(leak) ?? 0) + 1);
          const fieldKey = `${field}:${leak}`;
          const bucket = fieldExamples.get(fieldKey) ?? [];
          if (bucket.length < 3) bucket.push({ language, cpId: question.cpId, patternId: question.patternId, field, text: value });
          fieldExamples.set(fieldKey, bucket);
        }
      }

      const leaks = [...questionLeaks].sort();
      if (leaks.length) questionsWithResidualLatin += 1;
      for (const leak of leaks) {
        latinQuestionCounts.set(leak, (latinQuestionCounts.get(leak) ?? 0) + 1);
        const bucket = examples.get(leak) ?? [];
        if (bucket.length < 3) bucket.push({ language, cpId: question.cpId, patternId: question.patternId, stem: question.stem });
        examples.set(leak, bucket);
      }
      if (leaks.length >= 4 && worstQuestions.length < 150) {
        worstQuestions.push({ language, cpId: question.cpId, patternId: question.patternId, stem: question.stem, leaks });
      }
    }
  }
}

const top = [...latinQuestionCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const topFields = [...latinFieldOccurrences.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const topOption = [...optionLatinOccurrences.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const fields = [...fieldLatinOccurrences.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

const report = {
  authority: "MENSURATION-HI-PA-EDITORIAL-AUDIT-V1",
  localizedQuestionCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length * 4 * 2,
  crossScriptLeakage,
  mixedTokenCorruption,
  internalIdLeakage,
  hardGateExamples,
  questionsWithResidualLatin,
  optionFieldsWithResidualLatin,
  residualInstructionalLatinUnique: top.length,
  residualInstructionalLatinQuestionOccurrences: top.reduce((sum, [, count]) => sum + count, 0),
  residualInstructionalLatinFieldOccurrences: topFields.reduce((sum, [, count]) => sum + count, 0),
  topResidualInstructionalLatin: top.slice(0, 250).map(([token, questionCount]) => ({
    token,
    questionCount,
    fieldOccurrences: latinFieldOccurrences.get(token) ?? 0,
    examples: examples.get(token) ?? [],
  })),
  residualInstructionalLatinByField: fields.map(([field, occurrences]) => ({ field, occurrences })),
  topOptionResidualInstructionalLatin: topOption.slice(0, 150).map(([token, occurrences]) => ({
    token,
    occurrences,
    examples: [...fieldExamples.entries()]
      .filter(([key]) => key.startsWith("option-") && key.endsWith(`:${token}`))
      .flatMap(([, rows]) => rows)
      .slice(0, 5),
  })),
  worstQuestions,
};
const outputDir = path.resolve(process.cwd(), "artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "mensuration-localization-editorial-audit-v1.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outputDir, "mensuration-localization-editorial-audit-v1.md"), [
  "# Mensuration Hindi/Punjabi Editorial Audit V1",
  "",
  `- Localized questions: **${report.localizedQuestionCount}**`,
  `- Wrong-script leakage: **${crossScriptLeakage}**`,
  `- Joined Latin/Indic corruption: **${mixedTokenCorruption}**`,
  `- Internal learner ID leakage: **${internalIdLeakage}**`,
  `- Questions with residual instructional Latin: **${questionsWithResidualLatin}**`,
  `- Residual instructional Latin: **${report.residualInstructionalLatinUnique} unique / ${report.residualInstructionalLatinQuestionOccurrences} question occurrences / ${report.residualInstructionalLatinFieldOccurrences} field occurrences**`,
  `- Option fields with residual Latin: **${optionFieldsWithResidualLatin}**`,
  `- Option-specific residual Latin tokens: **${topOption.length} unique**`,
  "",
  "Residual Latin is reported by field for editorial remediation; technical abbreviations and unit symbols are filtered by the controlled allow-list.",
  "",
].join("\n"));
console.log(JSON.stringify({
  ...report,
  topResidualInstructionalLatin: report.topResidualInstructionalLatin.slice(0, 80),
  topOptionResidualInstructionalLatin: report.topOptionResidualInstructionalLatin.slice(0, 60),
  worstQuestions: report.worstQuestions.slice(0, 30),
}, null, 2));

assert(crossScriptLeakage === 0, `${crossScriptLeakage} localized questions contain the wrong Indic script.`);
assert(mixedTokenCorruption === 0, `${mixedTokenCorruption} localized questions contain joined Latin/Indic token corruption.`);
assert(internalIdLeakage === 0, `${internalIdLeakage} localized questions expose internal misconception IDs.`);
