import {
  cp003EnglishSourceObjectKey,
  cp003ExpectedNativeContext,
  generateCp003AllFinalNativeReviewCandidates as generateBaseAll,
  generateCp003FinalNativeReviewCandidate as generateBaseLanguage,
  type TsdCp003FinalNativeReviewRow,
  type TsdCp003SourceObjectKey,
} from "./native-final-candidate";
import type { TsdCp003NativeLanguage } from "./native-language-primitives";

const FEMININE_OBJECTS = new Set<TsdCp003SourceObjectKey>([
  "DELIVERY_VAN",
  "SCHOOL_BUS",
  "TAXI",
  "CAR",
  "BUS",
]);

function preserveEnglishContext(
  row: TsdCp003FinalNativeReviewRow,
  stem: string,
): string {
  const { source, presentation } = row;
  const context = cp003ExpectedNativeContext(source.stem, presentation.language);
  if (context === null || stem.includes(context)) return stem;

  if (cp003EnglishSourceObjectKey(source.stem) === null) {
    if (presentation.language === "hi" && stem.startsWith("एक ही मार्ग को ")) {
      return `${context} ${stem.replace(/^एक ही मार्ग को /u, "इस मार्ग को ")}`;
    }
    if (presentation.language === "pa" && stem.startsWith("ਇੱਕੋ ਰਸਤਾ ")) {
      return `${context} ${stem.replace(/^ਇੱਕੋ ਰਸਤਾ /u, "ਇਸ ਰਸਤੇ ਨੂੰ ")}`;
    }
  }

  return `${context} ${stem}`;
}

function fixDurationCase(stem: string, language: TsdCp003NativeLanguage): string {
  if (language === "hi") {
    return stem
      .replace(/1 घंटा का/gu, "1 घंटे का")
      .replace(/1 घंटा की/gu, "1 घंटे की")
      .replace(/1 घंटा के/gu, "1 घंटे के");
  }
  return stem
    .replace(/1 ਘੰਟਾ ਦਾ/gu, "1 ਘੰਟੇ ਦਾ")
    .replace(/1 ਘੰਟਾ ਦੀ/gu, "1 ਘੰਟੇ ਦੀ")
    .replace(/1 ਘੰਟਾ ਦੇ/gu, "1 ਘੰਟੇ ਦੇ");
}

function removeJourneyDuplication(stem: string, language: TsdCp003NativeLanguage): string {
  if (language === "hi") {
    return stem.replace(/(\d+(?:\.\d+)? km) की यात्रा में कुल/gu, "$1 की दूरी तय करते समय कुल");
  }
  return stem.replace(/(\d+(?:\.\d+)? km) ਦੇ ਸਫ਼ਰ ਵਿੱਚ ਕੁੱਲ/gu, "$1 ਦੀ ਦੂਰੀ ਤੈਅ ਕਰਦੇ ਸਮੇਂ ਕੁੱਲ");
}

function repairSubjectAgreement(row: TsdCp003FinalNativeReviewRow, stem: string): string {
  const key = cp003EnglishSourceObjectKey(row.source.stem);
  if (key === null) return stem;

  if (row.presentation.language === "pa") {
    if (FEMININE_OBJECTS.has(key)) {
      return stem.replace(/ਰਵਾਨਾ ਹੁੰਦਾ ਹੈ/gu, "ਰਵਾਨਾ ਹੁੰਦੀ ਹੈ");
    }
    if (key === "COACH") {
      return stem.replace(/ਰਵਾਨਾ ਹੁੰਦੀ ਹੈ/gu, "ਰਵਾਨਾ ਹੁੰਦਾ ਹੈ");
    }
  }
  return stem;
}

function polishStem(row: TsdCp003FinalNativeReviewRow): string {
  const language = row.presentation.language;
  let stem = row.presentation.stem;
  stem = repairSubjectAgreement(row, stem);
  stem = fixDurationCase(stem, language);
  stem = removeJourneyDuplication(stem, language);
  stem = preserveEnglishContext(row, stem);
  return stem.replace(/\s{2,}/gu, " ").trim();
}

function polishRow(row: TsdCp003FinalNativeReviewRow): TsdCp003FinalNativeReviewRow {
  const polishedStem = polishStem(row);
  return Object.freeze({
    ...row,
    presentation: Object.freeze({
      ...row.presentation,
      stem: polishedStem,
    }),
  });
}

export function generateCp003FinalNativeReviewCandidate(
  language: TsdCp003NativeLanguage,
): readonly TsdCp003FinalNativeReviewRow[] {
  return Object.freeze(generateBaseLanguage(language).map(polishRow));
}

export function generateCp003AllFinalNativeReviewCandidates(): readonly TsdCp003FinalNativeReviewRow[] {
  return Object.freeze(generateBaseAll().map(polishRow));
}

export type {
  TsdCp003FinalNativePresentation,
  TsdCp003FinalNativeReviewRow,
  TsdCp003SourceObjectKey,
} from "./native-final-candidate";
export {
  cp003EnglishSourceObjectKey,
  cp003ExpectedNativeContext,
  cp003ExpectedNativeObject,
  TSD_CP003_NATIVE_FINAL_REVIEW_STATUS,
} from "./native-final-candidate";
