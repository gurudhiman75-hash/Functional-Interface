import {
  placeGeoAgrOptions,
  type GeoAgr001Difficulty,
  type GeoAgr001Question,
} from "./geo-agr-001-review-types";
import {
  GEO_AGR_001_CP001_REVIEW_BATCH_V1,
  auditGeoAgr001Cp001ReviewBatchV1,
} from "./geo-agr-001-cp001-review-batch-v1";
import {
  GEO_AGR_001_CP002_REVIEW_BATCH_V1,
  auditGeoAgr001Cp002ReviewBatchV1,
} from "./geo-agr-001-cp002-review-batch-v1";
import {
  GEO_AGR_001_CP003_REVIEW_BATCH_V1,
  auditGeoAgr001Cp003ReviewBatchV1,
} from "./geo-agr-001-cp003-review-batch-v1";
import {
  GEO_AGR_001_CP004_REVIEW_BATCH_V1,
  auditGeoAgr001Cp004ReviewBatchV1,
} from "./geo-agr-001-cp004-review-batch-v1";
import {
  GEO_AGR_001_CP005_REVIEW_BATCH_V1,
  auditGeoAgr001Cp005ReviewBatchV1,
} from "./geo-agr-001-cp005-review-batch-v1";

const STEM_STYLE_BANNED = /strongest (?:fit|match)|more naturally suited|points most strongly|which comparison is accurate|which regional comparison is accurate|which climate pairing is accurate|which statement captures|which chain is most logical|best describes|associated with|\bmainly\b|\bbroad(?:ly)?\b|given in NCERT|\bNCERT\b|\btextbook\b|review-only|runtimeRegistered|sourceFact|\bCP\d{3}\b|GEO-AGR-001-QL-/i;

export type GeoAgr001MasteryQuestion = GeoAgr001Question & Readonly<{
  sourceOwningQuestionId: string;
}>;

export const GEO_AGR_001_OWNING_POOL_V1: readonly GeoAgr001Question[] = Object.freeze([
  ...GEO_AGR_001_CP001_REVIEW_BATCH_V1,
  ...GEO_AGR_001_CP002_REVIEW_BATCH_V1,
  ...GEO_AGR_001_CP003_REVIEW_BATCH_V1,
  ...GEO_AGR_001_CP004_REVIEW_BATCH_V1,
  ...GEO_AGR_001_CP005_REVIEW_BATCH_V1,
]);

function qlNumber(qlId: string): number {
  const match = /GEO-AGR-001-QL-(\d{3})$/.exec(qlId);
  if (!match) throw new Error("Invalid QL id: " + qlId);
  return Number(match[1]);
}

function targetDifficultyForQl(n: number): GeoAgr001Difficulty {
  const blockStart = Math.floor((n - 1) / 9) * 9 + 1;
  const blockQls = Array.from({ length: 9 }, (_, index) => blockStart + index);
  const hardCapable = blockQls.filter((qlNo) => {
    const qlId = "GEO-AGR-001-QL-" + String(qlNo).padStart(3, "0");
    return GEO_AGR_001_OWNING_POOL_V1.some((q) => q.qlId === qlId && q.difficulty === "Hard");
  });
  if (!hardCapable.length) throw new Error("No Hard-capable QL in block starting " + blockStart);

  const hardQl = hardCapable[hardCapable.length - 1];
  if (n === hardQl) return "Hard";

  const easyQls = blockQls.filter((qlNo) => qlNo !== hardQl).slice(0, 3);
  if (easyQls.includes(n)) return "Easy";
  return "Medium";
}

function selectOwningRepresentative(n: number): GeoAgr001Question {
  const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
  const desired = targetDifficultyForQl(n);
  const candidates = GEO_AGR_001_OWNING_POOL_V1.filter(
    (q) => q.qlId === qlId && q.difficulty === desired,
  );
  if (!candidates.length) {
    throw new Error("No " + desired + " representative found for " + qlId);
  }
  const block = Math.floor((n - 1) / 9);
  return candidates[block % candidates.length];
}

export const GEO_AGR_001_CP006_MASTERY_V1: readonly GeoAgr001MasteryQuestion[] = Object.freeze(
  Array.from({ length: 108 }, (_, index) => {
    const qlNo = index + 1;
    const source = selectOwningRepresentative(qlNo);
    const distractors = source.options.filter((option) => option !== source.canonicalAnswer);
    if (distractors.length !== 3) throw new Error("Invalid option set: " + source.questionId);
    const correctIndex = index % 4;
    return Object.freeze({
      ...source,
      questionId: "GEO-AGR-001-CP006-Q" + String(qlNo).padStart(3, "0"),
      options: placeGeoAgrOptions(source.canonicalAnswer, distractors, correctIndex),
      correctIndex,
      sourceIds: Object.freeze([...source.sourceIds]),
      sourceFactIds: Object.freeze([...source.sourceFactIds]),
      sourceOwningQuestionId: source.questionId,
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

function semanticSignature(q: GeoAgr001Question) {
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

export function auditGeoAgr001Cp006MasteryV1() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoAgr001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();

  for (const q of GEO_AGR_001_CP006_MASTERY_V1) {
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

    const source = GEO_AGR_001_OWNING_POOL_V1.find((candidate) => candidate.questionId === q.sourceOwningQuestionId);
    if (!source) {
      issues.push("SOURCE_MISSING:" + q.questionId);
    } else if (semanticSignature(source) !== semanticSignature(q)) {
      issues.push("SEMANTIC_MUTATION:" + q.questionId);
    }
  }

  if (GEO_AGR_001_CP006_MASTERY_V1.length !== 108) issues.push("COUNT:" + GEO_AGR_001_CP006_MASTERY_V1.length);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 1) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 36 || difficultyCounts.Medium !== 60 || difficultyCounts.Hard !== 12) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (answerPositions.join(",") !== "27,27,27,27") {
    issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  }
  if (stems.size !== 108) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 108) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_AGR_001_CP006_MASTERY_V1.length,
    permanentQlCount: Object.keys(qlCounts).length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    explanationCount: explanations.size,
  });
}

export function auditGeoAgr001ChapterClosureV1() {
  const issues: string[] = [];
  const cpAudits = [
    auditGeoAgr001Cp001ReviewBatchV1(),
    auditGeoAgr001Cp002ReviewBatchV1(),
    auditGeoAgr001Cp003ReviewBatchV1(),
    auditGeoAgr001Cp004ReviewBatchV1(),
    auditGeoAgr001Cp005ReviewBatchV1(),
  ];
  cpAudits.forEach((audit, index) => {
    if (!audit.valid) issues.push("CP" + String(index + 1).padStart(3, "0") + ":" + audit.issues.join("|"));
  });

  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoAgr001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();

  for (const q of GEO_AGR_001_OWNING_POOL_V1) {
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
  }

  if (GEO_AGR_001_OWNING_POOL_V1.length !== 648) issues.push("COUNT:" + GEO_AGR_001_OWNING_POOL_V1.length);
  for (let n = 1; n <= 108; n += 1) {
    const qlId = "GEO-AGR-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 216 || difficultyCounts.Medium !== 360 || difficultyCounts.Hard !== 72) {
    issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  }
  if (answerPositions.join(",") !== "168,168,156,156") {
    issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  }
  if (stems.size !== 648) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 648) issues.push("EXPLANATION_COUNT:" + explanations.size);

  const mastery = auditGeoAgr001Cp006MasteryV1();
  if (!mastery.valid) issues.push("MASTERY:" + mastery.issues.join("|"));

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    owningQuestionCount: GEO_AGR_001_OWNING_POOL_V1.length,
    permanentQlCount: Object.keys(qlCounts).length,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    stemCount: stems.size,
    explanationCount: explanations.size,
    mastery,
    runtimeRegistered: false as const,
  });
}
