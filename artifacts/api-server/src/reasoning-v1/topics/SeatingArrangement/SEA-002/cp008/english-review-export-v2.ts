import { SEA002_CP008_ENGLISH_REVIEW_SET_V2 } from "./production-review-v2.ts";

process.stdout.write(`${JSON.stringify(SEA002_CP008_ENGLISH_REVIEW_SET_V2.map((candidate) => ({
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
})), null, 2)}\n`);
