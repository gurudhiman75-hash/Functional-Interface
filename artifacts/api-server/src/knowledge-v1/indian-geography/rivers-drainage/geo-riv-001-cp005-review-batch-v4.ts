import { GEO_RIV_001_CP005_REVIEW_BATCH_V3, auditGeoRiv001Cp005ReviewBatchV3 } from "./geo-riv-001-cp005-review-batch-v3";
import type { GeoRiv001Cp005ReviewQuestion } from "./geo-riv-001-cp005-review-types";

function polish(question: GeoRiv001Cp005ReviewQuestion): GeoRiv001Cp005ReviewQuestion {
  const clean = (value: string) => value
    .replaceAll("left bank tributary", "left-bank tributary")
    .replaceAll("right bank tributary", "right-bank tributary")
    .replaceAll("Mahabaleshwar is linked with the Krishna source.", "The Krishna rises near Mahabaleshwar.");
  return {
    ...question,
    questionId: question.questionId.replace("CP005-V3", "CP005-V4"),
    stem: clean(question.stem),
    explanation: clean(question.explanation),
  };
}

export const GEO_RIV_001_CP005_REVIEW_BATCH_V4: GeoRiv001Cp005ReviewQuestion[] =
  GEO_RIV_001_CP005_REVIEW_BATCH_V3.map(polish);

export function auditGeoRiv001Cp005ReviewBatchV4() {
  const base = auditGeoRiv001Cp005ReviewBatchV3();
  const issues = [...base.issues];
  for (const q of GEO_RIV_001_CP005_REVIEW_BATCH_V4) {
    const visible = `${q.stem}\n${q.explanation}`;
    if (/\bleft bank tributary\b|\bright bank tributary\b|linked with the Krishna source|associated with|matches the reviewed relation|exam trap|shortcut/i.test(visible)) {
      issues.push(`V4_EDITORIAL_LANGUAGE:${q.questionId}`);
    }
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`V4_ANSWER_MISMATCH:${q.questionId}`);
  }
  return {
    ...base,
    valid: issues.length === 0,
    questionCount: GEO_RIV_001_CP005_REVIEW_BATCH_V4.length,
    semanticUniqueCount: new Set(GEO_RIV_001_CP005_REVIEW_BATCH_V4.map((q) => [q.qlId, q.stem, [...q.options].sort().join("|"), q.canonicalAnswer].join("|"))).size,
    issues,
  };
}
