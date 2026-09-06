import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";

function norm(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function semanticKey(q: (typeof COM003_ENGLISH_REVIEW_CORPUS_V4)[number] | (typeof COM003_ENGLISH_REVIEW_CORPUS_V16_2)[number]) {
  return JSON.stringify({
    qlId: q.qlId,
    targetFactId: q.targetFactId,
    canonicalAnswer: norm(q.canonicalAnswer),
    surfaceMode: q.surfaceMode,
  });
}

function weakerKey(q: (typeof COM003_ENGLISH_REVIEW_CORPUS_V4)[number] | (typeof COM003_ENGLISH_REVIEW_CORPUS_V16_2)[number]) {
  return JSON.stringify({
    qlId: q.qlId,
    targetFactId: q.targetFactId,
    canonicalAnswer: norm(q.canonicalAnswer),
  });
}

const bySemantic = new Map<string, (typeof COM003_ENGLISH_REVIEW_CORPUS_V4)[number][]>();
const byWeaker = new Map<string, (typeof COM003_ENGLISH_REVIEW_CORPUS_V4)[number][]>();
for (const q of COM003_ENGLISH_REVIEW_CORPUS_V4) {
  for (const [map, key] of [[bySemantic, semanticKey(q)], [byWeaker, weakerKey(q)]] as const) {
    const arr = map.get(key) ?? [];
    arr.push(q);
    map.set(key, arr);
  }
}

export const COM003_LOCALIZATION_SEMANTIC_REUSE_ROWS_V1 = Object.freeze(
  COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((q) => {
    const semantic = bySemantic.get(semanticKey(q)) ?? [];
    const weaker = byWeaker.get(weakerKey(q)) ?? [];
    return {
      questionId: q.questionId,
      qlId: q.qlId,
      targetFactId: q.targetFactId,
      surfaceMode: q.surfaceMode,
      exactSemanticCandidateIds: semantic.map((item) => item.questionId),
      weakerFactRelationCandidateIds: weaker.map((item) => item.questionId),
      status: semantic.length === 1
        ? "UNIQUE_SEMANTIC_SEED"
        : semantic.length > 1
          ? "AMBIGUOUS_SEMANTIC_SEED"
          : weaker.length > 0
            ? "FACT_RELATION_ONLY_REAUTHOR_SURFACE"
            : "NO_LEGACY_SEMANTIC_SEED",
    } as const;
  }),
);

export function auditCom003LocalizationSemanticReuseV1() {
  const rows = COM003_LOCALIZATION_SEMANTIC_REUSE_ROWS_V1;
  const counts = {
    uniqueSemanticSeed: rows.filter((r) => r.status === "UNIQUE_SEMANTIC_SEED").length,
    ambiguousSemanticSeed: rows.filter((r) => r.status === "AMBIGUOUS_SEMANTIC_SEED").length,
    factRelationOnly: rows.filter((r) => r.status === "FACT_RELATION_ONLY_REAUTHOR_SURFACE").length,
    noLegacySeed: rows.filter((r) => r.status === "NO_LEGACY_SEMANTIC_SEED").length,
  };
  const perQl = [...new Set(rows.map((r) => r.qlId))].sort().map((qlId) => {
    const ql = rows.filter((r) => r.qlId === qlId);
    return {
      qlId,
      questions: ql.length,
      uniqueSemanticSeed: ql.filter((r) => r.status === "UNIQUE_SEMANTIC_SEED").length,
      ambiguousSemanticSeed: ql.filter((r) => r.status === "AMBIGUOUS_SEMANTIC_SEED").length,
      factRelationOnly: ql.filter((r) => r.status === "FACT_RELATION_ONLY_REAUTHOR_SURFACE").length,
      noLegacySeed: ql.filter((r) => r.status === "NO_LEGACY_SEMANTIC_SEED").length,
    };
  });
  const issues: string[] = [];
  if (rows.length !== 228) issues.push(`COUNT:${rows.length}`);
  if (Object.values(counts).reduce((a,b)=>a+b,0) !== 228) issues.push("COUNT_PARTITION");
  if (perQl.some((q) => q.questions !== 12)) issues.push("QL_COUNT");
  return {
    valid: issues.length === 0,
    questions: rows.length,
    counts,
    perQl,
    policy: "SEMANTIC_SEEDS_REQUIRE_HUMAN_PARITY_REVIEW_AND_NEVER_OVERRIDE_V16_2_ENGLISH_AUTHORITY" as const,
    rows,
    issues,
  };
}

export const COM003_LOCALIZATION_SEMANTIC_REUSE_V1 = auditCom003LocalizationSemanticReuseV1();
