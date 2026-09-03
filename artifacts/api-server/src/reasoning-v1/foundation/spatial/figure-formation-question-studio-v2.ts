import {
  generateFigureFormationQuestionStudioV1,
  type FigureFormationLanguageV1,
} from "./figure-formation-question-studio-v1";
import type { FigureFormationPermanentQlIdV10 } from "./spatial-permanent-ql-allocation-v10";

const HINDI_REGIONS: Readonly<Record<string, string>> = Object.freeze({
  "upper-left": "ऊपरी-बाएँ",
  "upper-right": "ऊपरी-दाएँ",
  "lower-left": "निचले-बाएँ",
  "lower-right": "निचले-दाएँ",
  upper: "ऊपरी",
  lower: "निचले",
  left: "बाएँ",
  right: "दाएँ",
  central: "बीच के",
  middle: "बीच के",
});

const PUNJABI_REGIONS: Readonly<Record<string, string>> = Object.freeze({
  "upper-left": "ਉੱਪਰਲੇ-ਖੱਬੇ",
  "upper-right": "ਉੱਪਰਲੇ-ਸੱਜੇ",
  "lower-left": "ਹੇਠਲੇ-ਖੱਬੇ",
  "lower-right": "ਹੇਠਲੇ-ਸੱਜੇ",
  upper: "ਉੱਪਰਲੇ",
  lower: "ਹੇਠਲੇ",
  left: "ਖੱਬੇ",
  right: "ਸੱਜੇ",
  central: "ਵਿਚਕਾਰਲੇ",
  middle: "ਵਿਚਕਾਰਲੇ",
});

function localizeRegionTerms(text: string, language: FigureFormationLanguageV1): string {
  if (language === "en") return text;
  const dictionary = language === "hi" ? HINDI_REGIONS : PUNJABI_REGIONS;
  return Object.entries(dictionary)
    .sort(([left], [right]) => right.length - left.length)
    .reduce((result, [source, target]) => result.replaceAll(source, target), text);
}

export function generateFigureFormationQuestionStudioV2(input: Readonly<{
  qlId: FigureFormationPermanentQlIdV10;
  seed: string;
  language?: FigureFormationLanguageV1;
}>) {
  const question = generateFigureFormationQuestionStudioV1(input);
  if (question.language === "en") return question;
  return Object.freeze({
    ...question,
    version: "SPA-FFM-001-QUESTION-STUDIO-V2" as const,
    explanation: Object.freeze({
      ...question.explanation,
      application: localizeRegionTerms(question.explanation.application, question.language),
    }),
    localization: Object.freeze({
      ...question.localization,
      authority: "SPA-FFM-001-MULTILINGUAL-RUNTIME-V2-FULL-REGION-LOCALIZATION" as const,
    }),
  });
}

export type FigureFormationQuestionStudioQuestionV2 = ReturnType<typeof generateFigureFormationQuestionStudioV2>;
