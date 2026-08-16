import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationLocalizedQuestionV1,
  type MensurationStudioLanguage,
} from "./mensuration-localization-runtime-v1";

const languages: readonly MensurationStudioLanguage[] = ["en", "hi", "pa"];
const findings: Array<Record<string, unknown>> = [];
for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const seed = `mensuration-localization-parity:${pattern.patternId}:${index}`;
    for (const language of languages) {
      const q = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language, examProfile: "SSC_CORE" });
      const fields: Array<[string, string]> = [
        ["stem", q.stem],
        ...q.options.map((value, optionIndex) => [`option-${optionIndex + 1}`, value] as [string, string]),
        ...q.explanation.steps.map((value, stepIndex) => [`step-${stepIndex + 1}`, value] as [string, string]),
        ["shortcut", q.explanation.shortcut],
        ...q.explanation.traps.map((value, trapIndex) => [`trap-${trapIndex + 1}`, value] as [string, string]),
      ];
      for (const [field, text] of fields) {
        const dollarCount = (text.match(/\$/g) ?? []).length;
        const pih = /\\pih\b/.test(text);
        if (dollarCount % 2 !== 0 || pih) findings.push({ language, cpId: q.cpId, patternId: q.patternId, seed, field, dollarCount, pih, text });
      }
    }
  }
}
console.log(JSON.stringify({
  languageCount: languages.length,
  generatedQuestionCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length * 4 * languages.length,
  count: findings.length,
  findings,
}, null, 2));
if (findings.length) process.exitCode = 2;
