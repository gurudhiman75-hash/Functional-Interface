import { SEA002_CP008_ENGLISH_REVIEW_SET_V1 } from "./production-review-v1.ts";

const exportPayload = SEA002_CP008_ENGLISH_REVIEW_SET_V1.map((candidate) => ({
  permanentQlId: candidate.permanentQlId,
  authorityKey: candidate.authorityKey,
  signatureId: candidate.signatureId,
  variantIndex: candidate.variantIndex,
  difficulty: candidate.difficulty,
  examLineage: candidate.examLineage,
  stem: candidate.stem,
  question: candidate.question,
  options: candidate.options,
  correctOptionIndex: candidate.correctOptionIndex,
  answer: candidate.answer,
  explanation: candidate.explanation,
  reviewStatus: candidate.reviewStatus,
  fingerprint: candidate.fingerprint,
}));

process.stdout.write(`${JSON.stringify(exportPayload, null, 2)}\n`);
