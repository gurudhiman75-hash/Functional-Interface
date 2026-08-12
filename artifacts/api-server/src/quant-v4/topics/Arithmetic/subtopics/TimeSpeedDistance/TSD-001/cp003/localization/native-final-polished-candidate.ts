import {
  cp003EnglishSourceObjectKey,
  cp003ExpectedNativeContext,
  cp003ExpectedNativeObject,
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

function contextBeforeSubject(context: string, language: TsdCp003NativeLanguage): string {
  if (language === "hi") {
    return context.replace(/^अपनी /u, "").replace(/^अपने /u, "");
  }
  return context.replace(/^ਆਪਣੀ /u, "").replace(/^ਆਪਣੇ /u, "");
}

function preserveEnglishContext(
  row: TsdCp003FinalNativeReviewRow,
  stem: string,
): string {
  const { source, presentation } = row;
  const language = presentation.language;
  const context = cp003ExpectedNativeContext(source.stem, language);
  if (context === null || stem.includes(context)) return stem;

  const key = cp003EnglishSourceObjectKey(source.stem);
  if (key === null) {
    const prefix = contextBeforeSubject(context, language);
    if (language === "hi" && stem.startsWith("एक ही मार्ग को ")) {
      return `${prefix} ${stem.replace(/^एक ही मार्ग को /u, "")}`;
    }
    if (language === "pa" && stem.startsWith("ਇੱਕੋ ਰਸਤਾ ")) {
      return `${prefix} ${stem.replace(/^ਇੱਕੋ ਰਸਤਾ /u, "")}`;
    }
    return `${prefix} ${stem}`;
  }

  const actor = `${language === "hi" ? "एक" : "ਇੱਕ"} ${cp003ExpectedNativeObject(key, language)}`;
  const actorIndex = stem.indexOf(actor);
  if (actorIndex >= 0) {
    const actorEnd = actorIndex + actor.length;
    const afterActor = stem.slice(actorEnd);

    if (language === "hi" && afterActor.startsWith(" को")) {
      return `${stem.slice(0, actorEnd)} को ${context}${afterActor.slice(3)}`;
    }
    if (language === "pa" && afterActor.startsWith(" ਨੂੰ")) {
      return `${stem.slice(0, actorEnd)} ਨੂੰ ${context}${afterActor.slice(4)}`;
    }

    const unsafePostposition = language === "hi"
      ? /^(?: के| का| की| से| में| पर)/u.test(afterActor)
      : /^(?: ਕੋਲ| ਦਾ| ਦੀ| ਦੇ| ਨਾਲ| ਵਿੱਚ| ਉੱਤੇ)/u.test(afterActor);

    if (!unsafePostposition) {
      return `${stem.slice(0, actorEnd)} ${context}${afterActor}`;
    }
  }

  return `${contextBeforeSubject(context, language)} ${stem}`;
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
