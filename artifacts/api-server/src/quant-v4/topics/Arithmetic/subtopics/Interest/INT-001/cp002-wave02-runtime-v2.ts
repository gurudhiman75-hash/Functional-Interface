import {
  formatExact,
  multiplyRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import type { Rational } from "./foundation/types";
import { generateIntCp002Wave02Question as generateV1 } from "./cp002-wave02-runtime";
import type {
  IntCp002Wave02PrototypeId,
  IntCp002Wave02Question,
} from "./cp002-wave02-types";

const raw = String.raw;
const ONE_HUNDRED = rational(100);

export const INT_CP002_WAVE02_RUNTIME_V2 = Object.freeze({
  id: "INT-CP-002-WAVE02-INVERSE-SATURATION-V2",
  supersedes: "INT-CP-002-WAVE02-INVERSE-SATURATION-V1",
  reason: "Expand partial-repayment-time algebra through coefficient collection and final division.",
  permanentQlCount: 0,
  frozenSolveContractCount: 0,
  enabled: false,
  stagingStatus: "NOT_STAGED",
  registrationStatus: "NOT_REGISTERED",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
});

function readRational(question: IntCp002Wave02Question, key: string): Rational {
  const value = question.state.values[key] as Rational | undefined;
  if (!value || typeof value.numerator !== "bigint" || typeof value.denominator !== "bigint") {
    throw new Error(`Wave 2 V2 explanation value '${key}' is missing.`);
  }
  return value;
}

function expandRepaymentTimeExplanation(
  question: IntCp002Wave02Question,
): IntCp002Wave02Question {
  if (question.prototypeId !== "INT-CP002-W02-PARTIAL-REPAYMENT-TIME") return question;

  const openingPrincipal = readRational(question, "openingPrincipal");
  const repaymentAmount = readRational(question, "repaymentAmount");
  const rate = readRational(question, "rate");
  const horizon = readRational(question, "horizon");
  const totalInterest = readRational(question, "totalInterest");
  const repaymentTime = readRational(question, "repaymentTime");
  const remainingPrincipal = subtractRational(openingPrincipal, repaymentAmount);
  const openingRateCoefficient = multiplyRational(openingPrincipal, rate);
  const remainingRateCoefficient = multiplyRational(remainingPrincipal, rate);
  const constantTerm = multiplyRational(remainingRateCoefficient, horizon);
  const timeCoefficient = subtractRational(openingRateCoefficient, remainingRateCoefficient);
  const equationLeft = multiplyRational(totalInterest, ONE_HUNDRED);
  const isolatedRight = subtractRational(equationLeft, constantTerm);

  return {
    ...question,
    explanation: {
      ...question.explanation,
      workedSteps: [
        raw`Remaining principal: $$P_2=${formatExact(openingPrincipal)}-${formatExact(repaymentAmount)}=${formatExact(remainingPrincipal)}$$`,
        raw`Let repayment time be $t$. Then $$I=\frac{${formatExact(openingPrincipal)}\times${formatExact(rate)}\times t}{100}+\frac{${formatExact(remainingPrincipal)}\times${formatExact(rate)}\times(${formatExact(horizon)}-t)}{100}$$`,
        raw`Substitute total interest and multiply by 100: $$${formatExact(equationLeft)}=${formatExact(openingRateCoefficient)}t+${formatExact(remainingRateCoefficient)}(${formatExact(horizon)}-t)$$`,
        raw`Expand: $$${formatExact(equationLeft)}=${formatExact(openingRateCoefficient)}t+${formatExact(constantTerm)}-${formatExact(remainingRateCoefficient)}t=${formatExact(constantTerm)}+${formatExact(timeCoefficient)}t$$`,
        raw`Collect terms and divide: $$${formatExact(timeCoefficient)}t=${formatExact(equationLeft)}-${formatExact(constantTerm)}=${formatExact(isolatedRight)},\qquad t=\frac{${formatExact(isolatedRight)}}{${formatExact(timeCoefficient)}}=${formatExact(repaymentTime)}$$`,
      ],
    },
    mathematicalFingerprint: `${question.mathematicalFingerprint}|W02-EXPLANATION-V2`,
  };
}

export function generateIntCp002Wave02QuestionV2(request: {
  prototypeId: IntCp002Wave02PrototypeId;
  seed: string;
}): IntCp002Wave02Question {
  return expandRepaymentTimeExplanation(generateV1(request));
}
