import {
  placeGeoMinOptions,
  type GeoMin001Difficulty,
  type GeoMin001Question,
} from "./geo-min-001-review-types";
import {
  GEO_MIN_001_OWNING_POOL_V1,
  auditGeoMin001OwningPoolV1,
} from "./geo-min-001-owning-pool-v1";

const STEM_STYLE_BANNED = /best describes|\bbroad(?:ly)?\b|\bmainly\b|associated with|which of the following is associated|strongest (?:fit|match|clue)|points most strongly|given in NCERT|\bNCERT\b|\btextbook\b|review-only|runtimeRegistered|sourceFact|\bCP\d{3}\b/i;

export type GeoMin001MasteryQuestion = GeoMin001Question & Readonly<{
  sourceOwningQuestionId: string;
}>;

function semanticSignature(q: GeoMin001Question) {
  return JSON.stringify({
    qlId: q.qlId,
    qlName: q.qlName,
    difficulty: q.difficulty,
    stem: q.stem,
    canonicalAnswer: q.canonicalAnswer,
    explanation: q.explanation,
    sourceIds: [...q.sourceIds],
    sourceFactIds: [...q.sourceFactIds],
  });
}

const qlIds = Object.freeze([...new Set(GEO_MIN_001_OWNING_POOL_V1.map((q) => q.qlId))].sort());

function targetDifficulty(index: number): GeoMin001Difficulty {
  return (["Easy", "Medium", "Medium", "Hard"] as const)[index % 4];
}

function selectRepresentative(qlId: string, index: number): GeoMin001Question {
  const desired = targetDifficulty(index);
  const all = GEO_MIN_001_OWNING_POOL_V1.filter((q) => q.qlId === qlId);
  const preferred = all.filter((q) => q.difficulty === desired);
  const candidates = preferred.length ? preferred : all;
  if (!candidates.length) throw new Error("No owning questions for " + qlId);
  return candidates[index % candidates.length]!;
}

export const GEO_MIN_001_CP013_MASTERY_V1: readonly GeoMin001MasteryQuestion[] = Object.freeze(
  qlIds.map((qlId, index) => {
    const source = selectRepresentative(qlId, index);
    const distractors = source.options.filter((option) => option !== source.canonicalAnswer);
    if (distractors.length !== 3) throw new Error("Invalid option set: " + source.questionId);
    const correctIndex = index % 4;
    return Object.freeze({
      ...source,
      questionId: "GEO-MIN-001-CP013-Q" + String(index + 1).padStart(3, "0"),
      options: placeGeoMinOptions(source.canonicalAnswer, distractors, correctIndex),
      correctIndex,
      sourceIds: Object.freeze([...source.sourceIds]),
      sourceFactIds: Object.freeze([...source.sourceFactIds]),
      sourceOwningQuestionId: source.questionId,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

export function auditGeoMin001Cp013MasteryV1() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoMin001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();

  for (const q of GEO_MIN_001_CP013_MASTERY_V1) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;

    const stem = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    const explanation = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push("DUPLICATE_STEM:" + q.questionId);
    if (explanations.has(explanation)) issues.push("DUPLICATE_EXPLANATION:" + q.questionId);
    stems.add(stem);
    explanations.add(explanation);

    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
    if (STEM_STYLE_BANNED.test(q.stem)) issues.push("STEM_STYLE:" + q.questionId);

    const source = GEO_MIN_001_OWNING_POOL_V1.find((candidate) => candidate.questionId === q.sourceOwningQuestionId);
    if (!source) issues.push("SOURCE_MISSING:" + q.questionId);
    else if (semanticSignature(source) !== semanticSignature(q)) issues.push("SEMANTIC_MUTATION:" + q.questionId);
  }

  if (GEO_MIN_001_CP013_MASTERY_V1.length !== qlIds.length) issues.push("COUNT:" + GEO_MIN_001_CP013_MASTERY_V1.length);
  for (const qlId of qlIds) if (qlCounts[qlId] !== 1) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  if (stems.size !== qlIds.length) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== qlIds.length) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_MIN_001_CP013_MASTERY_V1.length,
    permanentQlCount: qlIds.length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    explanationCount: explanations.size,
  });
}

export function auditGeoMin001ChapterClosureV1() {
  const owning = auditGeoMin001OwningPoolV1();
  const mastery = auditGeoMin001Cp013MasteryV1();
  const issues: string[] = [];
  if (!owning.valid) issues.push("OWNING:" + owning.issues.join("|"));
  if (!mastery.valid) issues.push("MASTERY:" + mastery.issues.join("|"));

  const styleIssues = GEO_MIN_001_OWNING_POOL_V1
    .filter((q) => STEM_STYLE_BANNED.test(q.stem))
    .map((q) => "STEM_STYLE:" + q.questionId);
  issues.push(...styleIssues);

  const missingProvenance = GEO_MIN_001_OWNING_POOL_V1
    .filter((q) => !q.sourceIds.length || !q.sourceFactIds.length)
    .map((q) => "PROVENANCE:" + q.questionId);
  issues.push(...missingProvenance);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    owningQuestionCount: owning.questionCount,
    permanentQlCount: owning.permanentQlCount,
    stemCount: owning.stemCount,
    explanationCount: owning.explanationCount,
    difficultyCounts: owning.difficultyCounts,
    mastery,
    runtimeRegistered: false as const,
  });
}
