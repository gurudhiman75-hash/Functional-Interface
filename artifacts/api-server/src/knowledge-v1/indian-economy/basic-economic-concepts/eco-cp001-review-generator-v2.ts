import type { EcoCp001ReviewQuestion } from "./eco-cp001-review-types";
import { generateEcoCp001ReviewBatchV1 } from "./eco-cp001-review-generator-v1";

function reviseStem(question: EcoCp001ReviewQuestion) {
  let stem = question.stem.trim();

  stem = stem.replace(/^Which term means:\s*/i, "Which term means ");

  if (question.qlId === "ECO-001-QL-004") {
    const match = stem.match(/^The reward for (.+?) is:$/i);
    if (match) stem = `What is the reward for ${match[1]}?`;
  }

  if (question.qlId === "ECO-001-QL-005") {
    const match = stem.match(/^(.+?) is the reward for:$/i);
    if (match) stem = `Which factor of production earns ${match[1].toLowerCase()}?`;
  }

  if (question.qlId === "ECO-001-QL-007") {
    stem = stem.replace(/\s+This is an example of:$/i, " Which economic problem does this show?");
  }

  if (question.qlId === "ECO-001-QL-008") {
    stem = stem.replace(/\s+This is an example of:$/i, " Which economic activity does this describe?");
  }

  if (question.qlId === "ECO-001-QL-009") {
    stem = stem.replace(/\s+This is studied under:$/i, " Which branch of economics studies this?");
  }

  return stem;
}

export function generateEcoCp001ReviewBatchV2(): EcoCp001ReviewQuestion[] {
  return generateEcoCp001ReviewBatchV1().map((question) => ({
    ...question,
    questionId: question.questionId.replace("ECO-CP001-V1-", "ECO-CP001-V2-"),
    stem: reviseStem(question),
  }));
}

export const ECO_CP001_REVIEW_V2 = generateEcoCp001ReviewBatchV2();
