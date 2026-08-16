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

function learnerText(question: ReturnType<typeof generateMensurationLocalizedQuestionV1>) {
  return learnerFields(question).map(([, value]) => value).join("\n");
}

const languages: readonly MensurationLocalizedLanguage[] = ["hi", "pa"];
let crossScriptLeakage = 0;
let mixedTokenCorruption = 0;
let internalIdLeakage = 0;
const latinCounts = new Map<string, number>();
const fieldLatinCounts = new Map<string, number>();
const optionLatinCounts = new Map<string, number>();
const examples = new Map<string, Array<Record<string, string>>>();
const fieldExamples = new Map<string, Array<Record<string, string>>>();
const worstQuestions: Array<Record<string, unknown>> = [];

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const seed = `mensuration-localization-editorial:${pattern.patternId}:${index}`;
    for (const language of languages) {
      const question = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language, examProfile: "SSC_CORE" });
      const text = learnerText(question);
      if (language === "hi" ? hasGurmukhiScript(text) : hasHindiScript(text)) crossScriptLeakage += 1;
      if (/[A-Za-z][\u0900-\u097F\u0A00-\u0A7F]|[\u0900-\u097F\u0A00-\u0A7F][A-Za-z]/u.test(text)) mixedTokenCorruption += 1;
      if (/\[[A-Z0-9_:-]{3,}\]/.test(question.explanation.traps.join("\n"))) internalIdLeakage += 1;

      const questionLeaks = new Set<string>();
      for (const [field, value] of learnerFields(question)) {
        const leaks = instructionalLatinLeaks(value);
        for (const leak of leaks) {
          questionLeaks.add(leak);
          fieldLatinCounts.set(field, (fieldLatinCounts.get(field) ?? 0) + 1);
          if (field.startsWith("option-")) optionLatinCounts.set(leak, (optionLatinCounts.get(leak) ?? 0) + 1);
          const fieldKey = `${field}:${leak}`;
          const bucket = fieldExamples.get(fieldKey) ?? [];
          if (bucket.length < 3) bucket.push({ language, cpId: question.cpId, patternId: question.patternId, field, text: value });
          fieldExamples.set(fieldKey, bucket);
        }
      }

      const leaks = [...questionLeaks].sort();
      for (const leak of leaks) {
        latinCounts.set(leak, (latinCounts.get(leak) ?? 0) + 1);
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

const top = [...latinCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const topOption = [...optionLatinCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const fields = [...fieldLatinCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
assert(crossScriptLeakage === 0, `${crossScriptLeakage} localized questions contain the wrong Indic script.`);
assert(mixedTokenCorruption === 0, `${mixedTokenCorruption} localized questions contain joined Latin/Indic token corruption.`);
assert(internalIdLeakage === 0, `${internalIdLeakage} localized questions expose internal misconception IDs.`);

const report = {
  authority: "MENSURATION-HI-PA-EDITORIAL-AUDIT-V1",
  localizedQuestionCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length * 4 * 2,
  crossScriptLeakage,
  mixedTokenCorruption,
  internalIdLeakage,
  residualInstructionalLatinUnique: top.length,
  residualInstructionalLatinOccurrences: top.reduce((sum, [, count]) => sum + count, 0),
  topResidualInstructionalLatin: top.slice(0, 250).map(([token, count]) => ({ token, count, examples: examples.get(token) ?? [] })),
  residualInstructionalLatinByField: fields.map(([field, count]) => ({ field, count })),
  topOptionResidualInstructionalLatin: topOption.slice(0, 150).map(([token, count]) => ({
    token,
    count,
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
  `- Residual instructional Latin: **${report.residualInstructionalLatinUnique} unique / ${report.residualInstructionalLatinOccurrences} question-level occurrences**`,
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
