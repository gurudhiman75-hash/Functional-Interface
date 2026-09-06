import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

function norm(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function sortedNorm(values: readonly string[]) {
  return [...values].map(norm).sort();
}

function sameJson(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function sameOrderedOptions(a: readonly string[], b: readonly string[]) {
  return sameJson(a.map(norm), b.map(norm));
}

function sameOptionVocabulary(a: readonly string[], b: readonly string[]) {
  return sameJson(sortedNorm(a), sortedNorm(b));
}

function exactQuestionSurfaceKey(q: (typeof COM003_ENGLISH_REVIEW_CORPUS_V4)[number] | (typeof COM003_ENGLISH_REVIEW_CORPUS_V16_2)[number]) {
  return JSON.stringify({
    qlId: q.qlId,
    cpId: q.cpId,
    surfaceMode: q.surfaceMode,
    targetFactId: q.targetFactId,
    stem: norm(q.stem),
    options: q.options.map(norm),
    correctIndex: q.correctIndex,
    canonicalAnswer: norm(q.canonicalAnswer),
    explanation: norm(q.explanation),
    sourceIds: [...q.sourceIds].sort(),
    sourceFactIds: [...q.sourceFactIds].sort(),
    versionScoped: q.versionScoped,
  });
}

function factRelationKey(q: (typeof COM003_ENGLISH_REVIEW_CORPUS_V4)[number] | (typeof COM003_ENGLISH_REVIEW_CORPUS_V16_2)[number]) {
  return JSON.stringify({
    qlId: q.qlId,
    targetFactId: q.targetFactId,
    canonicalAnswer: norm(q.canonicalAnswer),
  });
}

function targetFactKey(q: (typeof COM003_ENGLISH_REVIEW_CORPUS_V4)[number] | (typeof COM003_ENGLISH_REVIEW_CORPUS_V16_2)[number]) {
  return `${q.qlId}:${q.targetFactId}`;
}

function groupBy<T>(items: readonly T[], key: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const arr = map.get(k) ?? [];
    arr.push(item);
    map.set(k, arr);
  }
  return map;
}

export type Com003LocalizationMigrationClassV1 =
  | "FULL_ARTIFACT_REUSE_SAFE"
  | "FACT_RELATION_REMAP_OPTIONS_ORDERED"
  | "FACT_RELATION_REMAP_OPTION_VOCABULARY"
  | "FACT_RELATION_REMAP_NEW_OPTIONS"
  | "TARGET_FACT_REMAP_REVIEW_REQUIRED"
  | "MUST_RELOCALIZE_NEW_OR_CHANGED_FACT";

export type Com003LocalizationMigrationRowV1 = {
  currentQuestionId: string;
  qlId: string;
  targetFactId: string;
  canonicalAnswer: string;
  classification: Com003LocalizationMigrationClassV1;
  legacyQuestionId: string | null;
  stemCanReuse: boolean;
  explanationCanReuse: boolean;
  orderedOptionsCanReuse: boolean;
  optionVocabularyCanReuse: boolean;
  answerTermCanReuse: boolean;
  wholeLocalizedArtifactCanReuse: boolean;
  localizationAction: "REUSE_FULL_ARTIFACT" | "REAUTHOR_STEM_AND_EXPLANATION_REUSE_OPTIONS" | "REAUTHOR_STEM_EXPLANATION_AND_REORDER_OPTIONS" | "REAUTHOR_FULL_QUESTION";
};

function bestLegacyMatch(current: (typeof COM003_ENGLISH_REVIEW_CORPUS_V16_2)[number]) {
  const exact = COM003_ENGLISH_REVIEW_CORPUS_V4.find((legacy) => exactQuestionSurfaceKey(legacy) === exactQuestionSurfaceKey(current));
  if (exact) return { legacy: exact, classification: "FULL_ARTIFACT_REUSE_SAFE" as const };

  const relation = COM003_ENGLISH_REVIEW_CORPUS_V4.filter((legacy) => factRelationKey(legacy) === factRelationKey(current));
  const ordered = relation.find((legacy) => sameOrderedOptions(legacy.options, current.options) && legacy.correctIndex === current.correctIndex);
  if (ordered) return { legacy: ordered, classification: "FACT_RELATION_REMAP_OPTIONS_ORDERED" as const };
  const vocabulary = relation.find((legacy) => sameOptionVocabulary(legacy.options, current.options));
  if (vocabulary) return { legacy: vocabulary, classification: "FACT_RELATION_REMAP_OPTION_VOCABULARY" as const };
  if (relation.length) return { legacy: relation[0]!, classification: "FACT_RELATION_REMAP_NEW_OPTIONS" as const };

  const target = COM003_ENGLISH_REVIEW_CORPUS_V4.find((legacy) => targetFactKey(legacy) === targetFactKey(current));
  if (target) return { legacy: target, classification: "TARGET_FACT_REMAP_REVIEW_REQUIRED" as const };
  return { legacy: null, classification: "MUST_RELOCALIZE_NEW_OR_CHANGED_FACT" as const };
}

export const COM003_LOCALIZATION_MIGRATION_ROWS_V1: readonly Com003LocalizationMigrationRowV1[] = Object.freeze(
  COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((current) => {
    const match = bestLegacyMatch(current);
    const legacy = match.legacy;
    const full = match.classification === "FULL_ARTIFACT_REUSE_SAFE";
    const orderedOptions = !!legacy && sameOrderedOptions(legacy.options, current.options) && legacy.correctIndex === current.correctIndex;
    const optionVocabulary = !!legacy && sameOptionVocabulary(legacy.options, current.options);
    const answerTerm = !!legacy && norm(legacy.canonicalAnswer) === norm(current.canonicalAnswer);
    const action: Com003LocalizationMigrationRowV1["localizationAction"] = full
      ? "REUSE_FULL_ARTIFACT"
      : orderedOptions && answerTerm
        ? "REAUTHOR_STEM_AND_EXPLANATION_REUSE_OPTIONS"
        : optionVocabulary && answerTerm
          ? "REAUTHOR_STEM_EXPLANATION_AND_REORDER_OPTIONS"
          : "REAUTHOR_FULL_QUESTION";
    return {
      currentQuestionId: current.questionId,
      qlId: current.qlId,
      targetFactId: current.targetFactId,
      canonicalAnswer: current.canonicalAnswer,
      classification: match.classification,
      legacyQuestionId: legacy?.questionId ?? null,
      stemCanReuse: full,
      explanationCanReuse: full,
      orderedOptionsCanReuse: orderedOptions,
      optionVocabularyCanReuse: optionVocabulary,
      answerTermCanReuse: answerTerm,
      wholeLocalizedArtifactCanReuse: full,
      localizationAction: action,
    };
  }),
);

function countBy<T extends string>(values: readonly T[]) {
  const out: Record<string, number> = {};
  for (const value of values) out[value] = (out[value] ?? 0) + 1;
  return out;
}

export function auditCom003LocalizationMigrationDeltaV1() {
  const rows = COM003_LOCALIZATION_MIGRATION_ROWS_V1;
  const perQl = COM003_PERMANENT_QLS.map((ql) => {
    const qlRows = rows.filter((row) => row.qlId === ql.qlId);
    return {
      qlId: ql.qlId,
      questions: qlRows.length,
      fullArtifactReuse: qlRows.filter((row) => row.wholeLocalizedArtifactCanReuse).length,
      orderedOptionReuse: qlRows.filter((row) => row.orderedOptionsCanReuse).length,
      vocabularyOptionReuse: qlRows.filter((row) => row.optionVocabularyCanReuse).length,
      answerTermReuse: qlRows.filter((row) => row.answerTermCanReuse).length,
      fullReauthor: qlRows.filter((row) => row.localizationAction === "REAUTHOR_FULL_QUESTION").length,
    };
  });
  const issues: string[] = [];
  if (rows.length !== 228) issues.push(`ROW_COUNT:${rows.length}`);
  if (perQl.some((item) => item.questions !== 12)) issues.push("QL_COUNT_DRIFT");
  if (new Set(rows.map((row) => row.currentQuestionId)).size !== 228) issues.push("CURRENT_ID_DUPLICATE");

  const actionCounts = countBy(rows.map((row) => row.localizationAction));
  const classCounts = countBy(rows.map((row) => row.classification));
  const fullArtifactReuse = rows.filter((row) => row.wholeLocalizedArtifactCanReuse).length;
  const orderedOptionReuse = rows.filter((row) => row.orderedOptionsCanReuse).length;
  const vocabularyOptionReuse = rows.filter((row) => row.optionVocabularyCanReuse).length;
  const answerTermReuse = rows.filter((row) => row.answerTermCanReuse).length;

  return {
    valid: issues.length === 0,
    sourceAuthority: "COM003_ENGLISH_REVIEW_CORPUS_V4" as const,
    targetAuthority: "COM003_ENGLISH_REVIEW_CORPUS_V16_2" as const,
    questions: rows.length,
    localizedArtifactsAffected: rows.length * 2,
    fullArtifactReuse,
    fullLocalizedArtifactsReusable: fullArtifactReuse * 2,
    localizedArtifactsRequiringNewStemOrMore: (rows.length - fullArtifactReuse) * 2,
    orderedOptionReuse,
    vocabularyOptionReuse,
    answerTermReuse,
    actionCounts,
    classCounts,
    perQl,
    rows,
    policy: "NO_LEGACY_LOCALIZED_ARTIFACT_IS_REUSED_UNLESS_FULL_ENGLISH_SURFACE_AND_SEMANTICS_MATCH" as const,
    issues,
  };
}

export const COM003_LOCALIZATION_MIGRATION_DELTA_V1 = auditCom003LocalizationMigrationDeltaV1();
