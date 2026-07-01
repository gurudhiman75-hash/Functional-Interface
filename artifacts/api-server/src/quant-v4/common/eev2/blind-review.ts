import {
  BLIND_REVIEW_DIMENSIONS,
  type BlindReviewAssignment,
  type BlindReviewBundle,
  type BlindReviewCandidateLabel,
  type BlindReviewDimensionPrompt,
  type BlindReviewPairInput,
  type BlindReviewPacket,
  type BlindReviewRecord,
  type BlindReviewScore,
  type BlindReviewSubmissionInput,
} from "./review-contracts";

export const BLIND_REVIEW_VERSION = "1.0.0" as const;
export const BLIND_REVIEW_DIMENSION_PROMPTS:
readonly BlindReviewDimensionPrompt[] = [
  { dimension: "TUTOR_REALISM", question: "Does this feel like a teacher explaining?" },
  { dimension: "COGNITIVE_LOAD", question: "Can a sincere but weak student follow this?" },
  { dimension: "METHOD_VISIBILITY", question: "Can the student explain why the one-unit value was found?" },
  { dimension: "CONCEPT_ISOLATION", question: "Can each step be understood individually?" },
  { dimension: "ANSWER_CONFIDENCE", question: "Does the final answer feel justified?" },
  { dimension: "SIMPLICITY", question: "Is this simpler than books?" },
];
export const BLIND_REVIEW_PREFERENCE_QUESTION =
  "Which explanation would you rather study from?";

function hash(value: string): string {
  let result = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 0x01000193);
  }
  return (result >>> 0).toString(16).padStart(8, "0");
}
function label(index: number): BlindReviewCandidateLabel {
  return index === 0 ? "A" : "B";
}
export function createBlindReview(input: BlindReviewPairInput): BlindReviewBundle {
  if (input.candidates[0].engine === input.candidates[1].engine) {
    throw new Error("Blind review requires one candidate from each engine.");
  }
  const v1 = input.candidates.find((candidate) => candidate.engine === "v1")!;
  const v2 = input.candidates.find((candidate) => candidate.engine === "v2")!;
  const key = [
    BLIND_REVIEW_VERSION, input.instanceId, input.locale, input.detailMode,
    v1.deterministicIdentity, v2.deterministicIdentity,
  ].join("|");
  const ordered = (Number.parseInt(hash(key), 16) & 1) === 0
    ? [v1, v2] as const : [v2, v1] as const;
  const reviewId = `blind-review:${BLIND_REVIEW_VERSION}:${hash(key)}`;
  const explanations = ordered.map((candidate, index) => ({
    label: `Explanation ${label(index)}` as const,
    candidateId: `candidate:${hash(`${reviewId}|${label(index)}|${candidate.deterministicIdentity}`)}`,
    lines: structuredClone(candidate.lines),
  })) as unknown as BlindReviewPacket["explanations"];
  const candidates = ordered.map((candidate, index) => ({
    label: label(index),
    candidateId: explanations[index]!.candidateId,
    engine: candidate.engine,
    deterministicIdentity: candidate.deterministicIdentity,
  })) as unknown as BlindReviewAssignment["candidates"];
  return {
    packet: {
      reviewId, instanceId: input.instanceId, locale: input.locale,
      detailMode: input.detailMode, explanations,
      dimensions: structuredClone(BLIND_REVIEW_DIMENSION_PROMPTS),
      preferenceQuestion: BLIND_REVIEW_PREFERENCE_QUESTION,
      metadata: structuredClone(input.metadata),
    },
    assignment: { reviewId, candidates },
  };
}
function assertScore(score: number): asserts score is BlindReviewScore {
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error(`Blind-review scores must be integers from 1 to 5: ${score}`);
  }
}
export function recordBlindReview(
  packet: BlindReviewPacket,
  submission: BlindReviewSubmissionInput,
): BlindReviewRecord {
  for (const dimension of BLIND_REVIEW_DIMENSIONS) {
    assertScore(submission.scores[dimension].A);
    assertScore(submission.scores[dimension].B);
  }
  if (!submission.timestamp.trim()) throw new Error("Blind-review timestamp is required.");
  return {
    reviewId: packet.reviewId, instanceId: packet.instanceId,
    locale: packet.locale, detailMode: packet.detailMode,
    scores: structuredClone(submission.scores),
    preference: submission.preference, notes: structuredClone(submission.notes),
    timestamp: submission.timestamp, metadata: structuredClone(submission.metadata),
  };
}

