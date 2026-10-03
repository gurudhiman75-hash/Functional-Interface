import { SEA002_CP008_LOCALIZED_REVIEW_SET_V2 } from "./localization-v2.ts";

process.stdout.write(`${JSON.stringify(SEA002_CP008_LOCALIZED_REVIEW_SET_V2.map((candidate) => ({
  locale: candidate.locale,
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
  sourceEnglishFingerprint: candidate.sourceEnglishFingerprint,
  localizedFingerprint: candidate.localizedFingerprint,
})), null, 2)}\n`);
