import { GEO_IND_001_NATIVE_HI_PA_V1 } from "./geo-ind-001-native-hi-pa-v1";
import { indianGeoNativeSourceHashV1, type IndianGeoNativeRecordsV1 } from "./native-record-v1";

const RECORDS: readonly IndianGeoNativeRecordsV1[] = [GEO_IND_001_NATIVE_HI_PA_V1];
const BY_ID: ReadonlyMap<string, IndianGeoNativeRecordsV1[string]> = new Map(
  RECORDS.flatMap((records) => Object.entries(records)),
);

export const INDIAN_GEO_NATIVE_AUTHORITY_V1 = "INDIAN_GEO_NATIVE_HI_PA_V1_CANDIDATE" as const;

export function hasIndianGeoNativeRecordV1(questionId: string): boolean {
  return BY_ID.has(questionId);
}

export function localizeIndianGeoNativeV1(
  question: Readonly<{ questionId: string; stem: string; options: readonly string[]; correctIndex: number }>,
  language: "hi" | "pa",
) {
  const record = BY_ID.get(question.questionId);
  if (!record) return null;
  const hash = indianGeoNativeSourceHashV1(question.stem, question.options);
  if (hash !== record.h) {
    throw new Error(`${question.questionId}: English changed since its native ${language} translation (hash ${hash} ≠ ${record.h}); retranslate`);
  }
  const [stem, options, explanation] = record[language];
  if (options.length !== question.options.length) throw new Error(`${question.questionId}: ${language} option count mismatch`);
  return Object.freeze({
    stem,
    options: Object.freeze([...options]),
    canonicalAnswer: options[question.correctIndex]!,
    explanation,
  });
}
