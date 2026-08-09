import { compareRational, rational } from "./rational";
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
  cheaperRatioQuestionV2,
  cheaperSellingRateQuestionV2,
} from "./cp005-exam-ready-v2-cheaper";
import { cheaperProfitQuestionScaledV2 } from "./cp005-exam-ready-v2-cheaper-profit-scaled";
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
      return cheaperProfitQuestionScaledV2(input);
    case "MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT":
      return cheaperRatioQuestionV2(input);
    case "MAL-CP005-PROT-CHEAPER-IMPURITY-SELLING-RATE-FROM-TARGET-PROFIT":
      return cheaperSellingRateQuestionV2(input);
  }
}

function capitalizeSentence(text: string): string {
  return text.replace(/^([a-z])/u, (_match, first: string) =>
    first.toUpperCase(),
  );
}

function normalizeLearnerPresentation(
  question: MalCp005ExamReadyQuestionV2,
): MalCp005ExamReadyQuestionV2 {
  question.explanation.visibleLines =
    question.explanation.visibleLines.map(capitalizeSentence);
  if (question.explanation.optionalHelp.verification) {
    question.explanation.optionalHelp.verification =
      question.explanation.optionalHelp.verification.map(capitalizeSentence);
  }
  question.explanation.optionalHelp.commonMistake = capitalizeSentence(
    question.explanation.optionalHelp.commonMistake,
  );
  return question;
}

function learnerFacingText(question: MalCp005ExamReadyQuestionV2): string {
  return JSON.stringify({
    stem: question.stem,
    answer: question.answer,
    options: question.options,
    explanation: question.explanation,
  });
}

function parseDisplayedNumber(text: string): number | null {
  const stripped = text.trim().replace(/^₹/u, "");
  const mixed = stripped.match(/^(-?\d+) (\d+)\/(\d+)/u);
  if (mixed) {
    const whole = Number(mixed[1]);
    const fraction = Number(mixed[2]) / Number(mixed[3]);
    return whole < 0 ? whole - fraction : whole + fraction;
  }
  const fraction = stripped.match(/^(-?\d+)\/(\d+)/u);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  const whole = stripped.match(/^(-?\d+(?:\.\d+)?)/u);
  return whole ? Number(whole[1]) : null;
}

function optionSurfaceIsExamNatural(
  question: MalCp005ExamReadyQuestionV2,
): boolean {
  if (
    !question.options.every(
      (option) =>
        !/^\s*-/u.test(option) &&
        !/\/(?:6|7|9|11|12|13|14|15|16|17|18|19|20)(?:\D|$)/u.test(
          option,
        ),
    )
  ) {
    return false;
  }

  const answerValue = parseDisplayedNumber(question.answer);
  if (!answerValue || answerValue <= 0) return true;
  const optionValues = question.options
    .map(parseDisplayedNumber)
    .filter((value): value is number => value !== null && value > 0);
  if (optionValues.length !== question.options.length) return false;

  if (
    question.answerSemantic === "ADULTERANT_QUANTITY" ||
    question.answerSemantic === "PURE_QUANTITY"
  ) {
    return optionValues.every(
      (value) => value >= answerValue / 20 && value <= answerValue * 20,
    );
  }
  if (question.answerSemantic === "SELLING_RATE") {
    return optionValues.every(
      (value) => value >= answerValue / 2.5 && value <= answerValue * 2.5,
    );
  }
  return true;
}

function directFreeStateIsExamNatural(
  question: MalCp005ExamReadyQuestionV2,
): boolean {
  const hundred = rational(100);
  switch (question.request.mode) {
    case "FREE_ADULTERANT_PROFIT_FROM_QUANTITIES":
      return (
        compareRational(
          question.request.adulterantQuantity,
          question.request.pureQuantity,
        ) <= 0
      );
    case "FREE_ADULTERANT_RATIO_FROM_TARGET_PROFIT":
    case "ADULTERANT_PERCENT_FROM_TARGET_PROFIT":
      return compareRational(question.request.targetProfitPercent, hundred) <= 0;
    case "FREE_ADULTERANT_QUANTITY_FROM_PURE_AND_TARGET":
    case "PURE_QUANTITY_FROM_FREE_ADULTERANT_AND_TARGET":
      return compareRational(question.request.targetProfitPercent, hundred) <= 0;
    case "TARGET_PROFIT_FROM_ADULTERANT_PERCENT":
      return (
        compareRational(
          question.request.adulterantPercentOfMixture,
          rational(50),
        ) <= 0
      );
    default:
      return true;
  }
}

export function generateMalCp005ExamReadyV2Question(
  prototypeId: MalCp005DiscoveryPrototypeId,
  requestedSeed = `mal-cp005-exam-ready-v2:${prototypeId}:default`,
): MalCp005ExamReadyQuestionV2 {
  const failures: string[] = [];
  for (let attempt = 0; attempt < 512; attempt += 1) {
    const selectedSeed =
      attempt === 0
        ? requestedSeed
        : `${requestedSeed}:exam-ready-attempt:${attempt}`;
    try {
      const question = normalizeLearnerPresentation(
        buildQuestion(
          prototypeId,
          requestedSeed,
          selectedSeed,
          attempt,
        ),
      );
      if (!question.validation.ok) {
        failures.push(question.validation.errors.join("; "));
        continue;
      }
      if (/\b1 litres\b/iu.test(learnerFacingText(question))) {
        failures.push(
          "Learner-facing output contains the singular-unit defect '1 litres'.",
        );
        continue;
      }
      if (!directFreeStateIsExamNatural(question)) {
        failures.push(
          "A direct free-adulterant state exceeds the exam-natural composition range.",
        );
        continue;
      }
      if (!optionSurfaceIsExamNatural(question)) {
        failures.push(
          "A displayed option is negative, extreme or uses an awkward fraction denominator.",
        );
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
    `${prototypeId}/${requestedSeed}: failed to select an exam-ready state after 512 attempts. Last errors: ${failures
      .slice(-5)
      .join(" | ")}`,
  );
}

export function verifyMalCp005ExamReadyV2Question(
  question: MalCp005ExamReadyQuestionV2,
): { ok: boolean; errors: string[] } {
  const errors = [...question.validation.errors];
  if (/\b1 litres\b/iu.test(learnerFacingText(question))) {
    errors.push(
      "Learner-facing output contains the singular-unit defect '1 litres'.",
    );
  }
  if (!directFreeStateIsExamNatural(question)) {
    errors.push(
      "A direct free-adulterant state exceeds the exam-natural composition range.",
    );
  }
  if (!optionSurfaceIsExamNatural(question)) {
    errors.push(
      "A displayed option is negative, extreme or uses an awkward fraction denominator.",
    );
  }
  const independent = verifyMalCp005Solution(
    question.request,
    question.solution,
  );
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
