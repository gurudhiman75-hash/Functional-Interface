import {
  adulterantPercentQuestionV2,
  adulterantQuantityQuestionV2,
  freeProfitQuestionV2,
  freeRatioFromProfitQuestionV2,
  profitFromAdulterantPercentQuestionV2,
  pureQuantityQuestionV2,
} from "./cp005-exam-ready-v2-free";
import {
  freeCommercialProfitQuestionV2,
  freeCommercialRatioQuestionV2,
  freeCommercialSellingRateQuestionV2,
} from "./cp005-exam-ready-v2-commercial";
import {
  cheaperProfitQuestionV2,
  cheaperRatioQuestionV2,
  cheaperSellingRateQuestionV2,
} from "./cp005-exam-ready-v2-cheaper";
import { selectMalCp005ExamSetV2 } from "./cp005-exam-ready-v2-core";
import { verifyMalCp005Solution } from "./cp005-independent-verifier";
import type { MalCp005DiscoveryPrototypeId } from "./cp005-types";
import type {
  MalCp005ExamReadyQuestionV2,
  MalCp005ExamSetSelectionResultV2,
} from "./cp005-exam-ready-v2-types";

function buildQuestion(
  prototypeId: MalCp005DiscoveryPrototypeId,
  requestedSeed: string,
  selectedSeed: string,
  selectionAttempt: number,
): MalCp005ExamReadyQuestionV2 {
  const input = { requestedSeed, selectedSeed, selectionAttempt };
  switch (prototypeId) {
    case "MAL-CP005-PROT-PROFIT-FROM-FREE-ADULTERANT-QUANTITIES":
      return freeProfitQuestionV2(input);
    case "MAL-CP005-PROT-RATIO-FROM-TARGET-PROFIT-AT-PURE-COST":
      return freeRatioFromProfitQuestionV2(input);
    case "MAL-CP005-PROT-ADULTERANT-QUANTITY-FROM-PURE-AND-TARGET-PROFIT":
      return adulterantQuantityQuestionV2(input);
    case "MAL-CP005-PROT-PURE-QUANTITY-FROM-ADULTERANT-AND-TARGET-PROFIT":
      return pureQuantityQuestionV2(input);
    case "MAL-CP005-PROT-ADULTERANT-PERCENT-FROM-TARGET-PROFIT":
      return adulterantPercentQuestionV2(input);
    case "MAL-CP005-PROT-PROFIT-FROM-ADULTERANT-PERCENT":
      return profitFromAdulterantPercentQuestionV2(input);
    case "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE":
      return freeCommercialProfitQuestionV2(input);
    case "MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT":
      return freeCommercialRatioQuestionV2(input);
    case "MAL-CP005-PROT-FREE-BLEND-SELLING-RATE-FROM-RATIO-AND-TARGET-PROFIT":
      return freeCommercialSellingRateQuestionV2(input);
    case "MAL-CP005-PROT-PROFIT-FROM-CHEAPER-IMPURITY-BLEND":
      return cheaperProfitQuestionV2(input);
    case "MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT":
      return cheaperRatioQuestionV2(input);
    case "MAL-CP005-PROT-CHEAPER-IMPURITY-SELLING-RATE-FROM-TARGET-PROFIT":
      return cheaperSellingRateQuestionV2(input);
  }
}

function learnerFacingText(question: MalCp005ExamReadyQuestionV2): string {
  return JSON.stringify({
    stem: question.stem,
    answer: question.answer,
    options: question.options,
    explanation: question.explanation,
  });
}

function optionSurfaceIsExamNatural(question: MalCp005ExamReadyQuestionV2): boolean {
  return question.options.every(
    (option) =>
      !/^\s*-/u.test(option) &&
      !/\/(?:6|7|9|11|12|13|14|15|16|17|18|19|20)(?:\D|$)/u.test(option),
  );
}

export function generateMalCp005ExamReadyV2Question(
  prototypeId: MalCp005DiscoveryPrototypeId,
  requestedSeed = `mal-cp005-exam-ready-v2:${prototypeId}:default`,
): MalCp005ExamReadyQuestionV2 {
  const failures: string[] = [];
  for (let attempt = 0; attempt < 512; attempt += 1) {
    const selectedSeed =
      attempt === 0 ? requestedSeed : `${requestedSeed}:exam-ready-attempt:${attempt}`;
    try {
      const question = buildQuestion(
        prototypeId,
        requestedSeed,
        selectedSeed,
        attempt,
      );
      if (!question.validation.ok) {
        failures.push(question.validation.errors.join("; "));
        continue;
      }
      if (/\b1 litres\b/iu.test(learnerFacingText(question))) {
        failures.push("Learner-facing output contains the singular-unit defect '1 litres'.");
        continue;
      }
      if (!optionSurfaceIsExamNatural(question)) {
        failures.push("A displayed option is negative or uses an awkward fraction denominator.");
        continue;
      }
      const independent = verifyMalCp005Solution(
        question.request,
        question.solution,
      );
      if (!independent.ok) {
        failures.push(independent.errors.join("; "));
        continue;
      }
      return question;
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(
    `${prototypeId}/${requestedSeed}: failed to select an exam-ready state after 512 attempts. Last errors: ${failures.slice(-5).join(" | ")}`,
  );
}

export function verifyMalCp005ExamReadyV2Question(
  question: MalCp005ExamReadyQuestionV2,
): { ok: boolean; errors: string[] } {
  const errors = [...question.validation.errors];
  if (/\b1 litres\b/iu.test(learnerFacingText(question))) {
    errors.push("Learner-facing output contains the singular-unit defect '1 litres'.");
  }
  if (!optionSurfaceIsExamNatural(question)) {
    errors.push("A displayed option is negative or uses an awkward fraction denominator.");
  }
  const independent = verifyMalCp005Solution(question.request, question.solution);
  errors.push(...independent.errors);
  return { ok: errors.length === 0, errors };
}

export function selectMalCp005ExamSetForDeliveryV2(
  candidates: readonly MalCp005ExamReadyQuestionV2[],
): MalCp005ExamSetSelectionResultV2 {
  return selectMalCp005ExamSetV2(candidates);
}

export function cp005ExamReadyV2Stable(
  question: MalCp005ExamReadyQuestionV2,
): string {
  return JSON.stringify(
    {
      prototypeId: question.prototypeId,
      selectedSeed: question.selectedSeed,
      selectionAttempt: question.selectionAttempt,
      stateKey: question.stateKey,
      siblingStateKey: question.siblingStateKey,
      difficulty: question.difficulty,
      request: question.request,
      solution: question.solution,
      exactState: question.exactState,
      stem: question.stem,
      answer: question.answer,
      options: question.options,
      correctIndex: question.correctIndex,
      optionAudit: question.optionAudit,
      explanation: question.explanation,
      numberProvenance: question.numberProvenance,
      validation: question.validation,
    },
    (_key, value) => (typeof value === "bigint" ? `${value}n` : value),
  );
}
