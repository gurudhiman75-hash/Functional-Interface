import {
  COM003_HINDI_LOCALIZATION_WAVE2_V1,
  COM003_LOCALIZATION_WAVE2_AUTHORITY_V1,
  COM003_PUNJABI_LOCALIZATION_WAVE2_V1,
} from "./com003-localization-wave2-v1";
import type { Com003LocalizedQuestionV1 } from "./com003-localization-wave1-v1";

const REPLACEMENTS = {
  hi: {
    "column label": "Column label (स्तंभ लेबल)",
    "row number": "Row number (पंक्ति संख्या)",
  },
  pa: {
    "column label": "Column label (ਕਾਲਮ ਲੇਬਲ)",
    "row number": "Row number (ਕਤਾਰ ਨੰਬਰ)",
  },
} as const;

function replaceText(value: string, language: "hi" | "pa") {
  let output = value;
  for (const [from, to] of Object.entries(REPLACEMENTS[language])) {
    output = output.replaceAll(from, to);
  }
  return output;
}

function refine(item: Com003LocalizedQuestionV1): Com003LocalizedQuestionV1 {
  const language = item.language;
  const options = item.options.map((option) => replaceText(option, language));
  const stem = replaceText(item.stem, language);
  const explanation = replaceText(item.explanation, language);
  return {
    ...item,
    localizationId: item.localizationId.replace("AUTHORED-W2-V1", "AUTHORED-W2-V2"),
    stem,
    options,
    canonicalAnswer: options[item.correctIndex]!,
    explanation,
  };
}

export const COM003_HINDI_LOCALIZATION_WAVE2_V2 = Object.freeze(COM003_HINDI_LOCALIZATION_WAVE2_V1.map(refine));
export const COM003_PUNJABI_LOCALIZATION_WAVE2_V2 = Object.freeze(COM003_PUNJABI_LOCALIZATION_WAVE2_V1.map(refine));

export const COM003_LOCALIZATION_WAVE2_AUTHORITY_V2 = Object.freeze({
  ...COM003_LOCALIZATION_WAVE2_AUTHORITY_V1,
  authorityId: "COM-003-LOCALIZATION-WAVE2-AUTHORED-V2" as const,
  hindiQuestionCount: COM003_HINDI_LOCALIZATION_WAVE2_V2.length,
  punjabiQuestionCount: COM003_PUNJABI_LOCALIZATION_WAVE2_V2.length,
  totalLocalizedQuestionCount: COM003_HINDI_LOCALIZATION_WAVE2_V2.length + COM003_PUNJABI_LOCALIZATION_WAVE2_V2.length,
  remediation: Object.freeze({
    excelColumnLabelLocalized: true,
    excelRowNumberLocalized: true,
  }),
  nextGate: "COM003_LOCALIZATION_WAVE2_SEMANTIC_EDITORIAL_AUDIT_V2" as const,
});
