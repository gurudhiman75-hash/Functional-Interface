import type { Cp003StudentExplanation } from "./cp003-exam-types";

const FORBIDDEN_TECHNICAL_LANGUAGE = /\b(?:annual factor|growth factor|compound-interest factor|year-specific interest factor|yearly-interest multiplier|geometric progression|observed ratio|solution relation|rate substitution|reverse all annual growth factors|accumulated multiplier|inverse relation|reconstruct|growth)\b/iu;
const FORBIDDEN_AWKWARD_WORDING = /(?:There are 1 year|Applying the same yearly increase 1 time|carry the earlier amount back to year 0|move the earlier interest forward)/iu;

function words(value: string): number {
  return value.match(/[A-Za-z₹0-9]+/gu)?.length ?? 0;
}

export function assertCp003ExplanationStyle(
  qlId: string,
  explanation: Cp003StudentExplanation,
): void {
  const mainText = [explanation.keyIdea, ...explanation.steps].join(" ");
  const allLearnerText = [
    explanation.keyIdea,
    ...explanation.steps,
    explanation.finalAnswer,
    ...(explanation.shortcut?.steps ?? []),
    ...(explanation.commonMistake ? [explanation.commonMistake] : []),
    ...(explanation.verification?.steps ?? []),
  ].join(" ");

  if (!explanation.keyIdea.startsWith("We need to find")) {
    throw new Error(`${qlId}: explanation does not begin by stating what the question asks`);
  }
  if (words(mainText) < 45) {
    throw new Error(`${qlId}: explanation is too concise to teach the calculation clearly`);
  }
  if (explanation.steps.length < 2) {
    throw new Error(`${qlId}: explanation does not show enough intermediate calculation steps`);
  }
  if (!explanation.steps.some((step) => step.includes("="))) {
    throw new Error(`${qlId}: explanation does not show an intermediate numerical calculation`);
  }
  if (FORBIDDEN_TECHNICAL_LANGUAGE.test(allLearnerText)) {
    throw new Error(`${qlId}: prohibited technical wording reached the student explanation`);
  }
  if (FORBIDDEN_AWKWARD_WORDING.test(allLearnerText)) {
    throw new Error(`${qlId}: awkward template wording reached the student explanation`);
  }
}
