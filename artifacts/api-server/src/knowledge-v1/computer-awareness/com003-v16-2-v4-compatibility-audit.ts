import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

const STRUCTURAL_FIELDS = [
  "qlId",
  "cpId",
  "surfaceMode",
  "targetFactId",
  "correctIndex",
  "canonicalAnswer",
  "versionScoped",
  "solverAuthority",
] as const;

const ARRAY_FIELDS = ["options", "sourceIds", "sourceFactIds"] as const;

export function auditCom003V162V4Compatibility() {
  const issues: string[] = [];
  const legacy = COM003_ENGLISH_REVIEW_CORPUS_V4;
  const current = COM003_ENGLISH_REVIEW_CORPUS_V16_2;

  if (legacy.length !== 228) issues.push(`V4_COUNT:${legacy.length}`);
  if (current.length !== 228) issues.push(`V16_2_COUNT:${current.length}`);
  if (legacy.length !== current.length) issues.push(`COUNT_DRIFT:${legacy.length}:${current.length}`);

  const mappings: Array<{
    index: number;
    legacyQuestionId: string;
    currentQuestionId: string;
    qlId: string;
    targetFactId: string;
  }> = [];

  const count = Math.min(legacy.length, current.length);
  for (let index = 0; index < count; index += 1) {
    const before = legacy[index]!;
    const after = current[index]!;
    for (const field of STRUCTURAL_FIELDS) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) {
        issues.push(`STRUCTURAL_DRIFT:${index + 1}:${field}:${before.questionId}:${after.questionId}`);
      }
    }
    for (const field of ARRAY_FIELDS) {
      if (JSON.stringify(before[field]) !== JSON.stringify(after[field])) {
        issues.push(`ARRAY_DRIFT:${index + 1}:${field}:${before.questionId}:${after.questionId}`);
      }
    }
    mappings.push({
      index,
      legacyQuestionId: before.questionId,
      currentQuestionId: after.questionId,
      qlId: after.qlId,
      targetFactId: after.targetFactId,
    });
  }

  return {
    valid: issues.length === 0,
    questions: current.length,
    legacyAuthority: "COM003_ENGLISH_REVIEW_CORPUS_V4" as const,
    currentAuthority: "COM003_ENGLISH_REVIEW_CORPUS_V16_2" as const,
    compatibility: "STRUCTURAL_AND_SEMANTIC_INDEX_EQUIVALENCE" as const,
    learnerSurfaceChangesAllowed: ["questionId", "stem", "explanation", "stemAuthority", "editorialAuthority", "explanationAuthority"] as const,
    localizationLineageReusable: issues.length === 0,
    mappings,
    issues,
  };
}

export const COM003_V16_2_V4_COMPATIBILITY = auditCom003V162V4Compatibility();
