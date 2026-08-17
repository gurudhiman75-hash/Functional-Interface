import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationLocalizedQuestionV1,
  type MensurationLocalizedQuestionV1,
} from "./mensuration-localization-runtime-v1";
import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v1";

function stripInternalIds(text: string) {
  return text.replace(/\[[A-Z0-9_:-]{3,}\]/g, " ");
}
function mathSignature(text: string) {
  const scrubbed = stripInternalIds(text);
  return (scrubbed.match(/\d+(?:\.\d+)?(?:\/\d+)?|\\frac\{[^}]+\}\{[^}]+\}|π|\\pi|√\d*|\\sqrt\{[^}]+\}|²|³|%|₹|°|[=+×÷−]/g) ?? []).join("|");
}
function fields(question: MensurationLocalizedQuestionV1) {
  return [
    ["stem", question.stem],
    ...question.options.map((value, index) => [`option-${index + 1}`, value] as const),
    ...question.explanation.steps.map((value, index) => [`step-${index + 1}`, value] as const),
    ["shortcut", question.explanation.shortcut] as const,
    ...question.explanation.traps.map((value, index) => [`trap-${index + 1}`, value] as const),
  ];
}

const languages: readonly MensurationLocalizedLanguage[] = ["hi", "pa"];
const mismatches: Array<Record<string, unknown>> = [];
for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const seed = `mensuration-localization-parity:${pattern.patternId}:${index}`;
    const english = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language: "en", examProfile: "SSC_CORE" });
    const englishFields = fields(english);
    for (const language of languages) {
      const localized = generateMensurationLocalizedQuestionV1({ patternId: pattern.patternId, seed, language, examProfile: "SSC_CORE" });
      const localizedFields = fields(localized);
      for (let fieldIndex = 0; fieldIndex < englishFields.length; fieldIndex += 1) {
        const [field, source] = englishFields[fieldIndex]!;
        const [, target] = localizedFields[fieldIndex]!;
        const sourceSignature = mathSignature(source);
        const targetSignature = mathSignature(target);
        if (sourceSignature !== targetSignature) {
          mismatches.push({
            language,
            cpId: pattern.cpId,
            patternId: pattern.patternId,
            seed,
            field,
            source,
            target,
            sourceSignature,
            targetSignature,
          });
        }
      }
    }
  }
}
console.log(JSON.stringify({ count: mismatches.length, first: mismatches.slice(0, 120) }, null, 2));
