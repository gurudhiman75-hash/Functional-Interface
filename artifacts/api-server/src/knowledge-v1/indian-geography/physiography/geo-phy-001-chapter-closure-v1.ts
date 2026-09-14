import {
  GEO_PHY_001_CP013_REVIEW_BATCH_V1,
  GEO_PHY_001_CP013_SOURCE_BATCHES_V1,
  auditGeoPhy001Cp013ReviewBatchV1,
} from "./geo-phy-001-cp013-review-batch-v1";

export type GeoPhy001CheckpointOwnership = {
  checkpoint: string;
  firstQl: number;
  lastQl: number;
  newPermanentQls: boolean;
};

export const GEO_PHY_001_CHECKPOINT_OWNERSHIP_V1: readonly GeoPhy001CheckpointOwnership[] = Object.freeze([
  ...GEO_PHY_001_CP013_SOURCE_BATCHES_V1.map(({ checkpoint, firstQl, lastQl }) =>
    Object.freeze({ checkpoint, firstQl, lastQl, newPermanentQls: true }),
  ),
  Object.freeze({ checkpoint: "CP013", firstQl: 0, lastQl: 0, newPermanentQls: false }),
]);

export function auditGeoPhy001ChapterClosureV1() {
  const issues: string[] = [];
  const qlOwners = new Map<number, string[]>();
  const owningPayloadCounts = new Map<string, number>();
  const owningSemanticCounts = new Map<string, number>();
  let owningQuestionCount = 0;

  for (const batch of GEO_PHY_001_CP013_SOURCE_BATCHES_V1) {
    if (batch.questions.length !== 54) issues.push(`${batch.checkpoint}:COUNT:${batch.questions.length}`);
    owningQuestionCount += batch.questions.length;

    const qlCounts = new Map<string, number>();
    const semanticsByQl = new Map<string, Set<string>>();
    const answerPositions = [0, 0, 0, 0];

    for (const question of batch.questions) {
      const qlNumber = Number(question.qlId.slice(-3));
      if (!Number.isInteger(qlNumber) || qlNumber < batch.firstQl || qlNumber > batch.lastQl) {
        issues.push(`${batch.checkpoint}:OUT_OF_RANGE:${question.qlId}`);
      }
      const owners = qlOwners.get(qlNumber) ?? [];
      if (!owners.includes(batch.checkpoint)) owners.push(batch.checkpoint);
      qlOwners.set(qlNumber, owners);

      qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
      const semantics = semanticsByQl.get(question.qlId) ?? new Set<string>();
      semantics.add(`${question.stem.trim().toLowerCase()}::${question.canonicalAnswer.trim().toLowerCase()}`);
      semanticsByQl.set(question.qlId, semantics);
      answerPositions[question.correctIndex] += 1;

      if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`${batch.checkpoint}:OPTIONS:${question.questionId}`);
      if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`${batch.checkpoint}:ANSWER:${question.questionId}`);
      if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`${batch.checkpoint}:PROVENANCE:${question.questionId}`);
      if (!question.reviewOnly || question.runtimeRegistered) issues.push(`${batch.checkpoint}:LIFECYCLE:${question.questionId}`);
      if (/sourceFact|review-only|runtimeRegistered|generator|qualification gate|provenance/i.test(`${question.stem}\n${question.options.join("\n")}\n${question.explanation}`)) {
        issues.push(`${batch.checkpoint}:META_LANGUAGE:${question.questionId}`);
      }
    }

    if (qlCounts.size !== 9) issues.push(`${batch.checkpoint}:QL_BREADTH:${qlCounts.size}`);
    for (let ql = batch.firstQl; ql <= batch.lastQl; ql += 1) {
      const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
      const payloadCount = qlCounts.get(qlId) ?? 0;
      const semanticCount = semanticsByQl.get(qlId)?.size ?? 0;
      owningPayloadCounts.set(qlId, payloadCount);
      owningSemanticCounts.set(qlId, semanticCount);
      if (payloadCount !== 6) issues.push(`${batch.checkpoint}:QL_PAYLOAD_DEPTH:${qlId}:${payloadCount}`);
      if (semanticCount !== 6) issues.push(`${batch.checkpoint}:QL_SEMANTIC_DEPTH:${qlId}:${semanticCount}`);
    }
    if (answerPositions.join(",") !== "14,14,13,13") issues.push(`${batch.checkpoint}:ANSWER_BALANCE:${answerPositions.join(",")}`);
  }

  for (let ql = 1; ql <= 108; ql += 1) {
    const owners = qlOwners.get(ql) ?? [];
    if (owners.length !== 1) issues.push(`QL_OWNER:QL${String(ql).padStart(3, "0")}:${owners.join(",") || "NONE"}`);
  }
  for (const ql of qlOwners.keys()) {
    if (ql < 1 || ql > 108) issues.push(`OUT_OF_RANGE_PERMANENT_QL:${ql}`);
  }

  const cp013 = auditGeoPhy001Cp013ReviewBatchV1();
  if (!cp013.valid) issues.push(...cp013.issues.map((issue) => `CP013:${issue}`));
  if (GEO_PHY_001_CP013_REVIEW_BATCH_V1.some((question) => Number(question.qlId.slice(-3)) > 108)) issues.push("CP013_ADDS_NEW_PERMANENT_QL");
  if (owningQuestionCount !== 648) issues.push(`OWNING_QUESTION_TOTAL:${owningQuestionCount}`);
  if (owningPayloadCounts.size !== 108) issues.push(`PERMANENT_QL_TOTAL:${owningPayloadCounts.size}`);
  if ([...owningPayloadCounts.values()].some((count) => count !== 6)) issues.push("OWNING_PAYLOAD_DEPTH_NOT_EXHAUSTIVE");
  if ([...owningSemanticCounts.values()].some((count) => count !== 6)) issues.push("OWNING_SEMANTIC_DEPTH_NOT_EXHAUSTIVE");

  return {
    valid: issues.length === 0,
    issues,
    checkpointCount: 13,
    owningCheckpointCount: GEO_PHY_001_CP013_SOURCE_BATCHES_V1.length,
    permanentQlCount: owningPayloadCounts.size,
    firstQl: 1,
    lastQl: 108,
    owningQuestionCount,
    payloadsPerPermanentQl: 6,
    exhaustiveMasterQuestionCount: GEO_PHY_001_CP013_REVIEW_BATCH_V1.length,
    exhaustiveMasterQlBreadth: cp013.permanentQlBreadth,
    exhaustiveMasterDifficulty: cp013.difficultyCounts,
    exhaustiveMasterAnswerPositions: cp013.answerPositions,
    cp013AddsPermanentQls: false,
    readiness: issues.length === 0 ? "EXHAUSTIVE_AND_READY_TO_CLOSE" : "BLOCKED",
  };
}
