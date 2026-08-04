import type { Rational } from "./cp003-exam-model";
import type { Cp003StudentExplanation } from "./cp003-exam-types";
import { explanationFor as baseExplanationFor } from "./cp003-exam-explanation";
import type { Cp003SolutionTrace, Cp003SolutionTraceStep } from "./cp003-grounded-solution-trace";
import { fractionLatex, rateMath } from "./cp003-exam-support";

function rational(step: Cp003SolutionTraceStep, key: string): Rational {
  const datum = step.data.find((entry) => entry.key === key);
  if (!datum || datum.kind !== "RATIONAL") throw new Error(`${step.id}: missing rational datum ${key}`);
  return datum.value;
}

export function explanationFor(trace: Cp003SolutionTrace): Cp003StudentExplanation {
  const base = baseExplanationFor(trace);
  if (trace.methodId !== "NTH_YEAR_RATE_SUBSTITUTION") return base;

  const factorStep = trace.coreSteps.find((step) => step.operationId === "ANNUAL_FACTOR");
  const verificationStep = trace.coreSteps.find((step) => step.operationId === "VERIFY_NTH_YEAR_RATE");
  if (!factorStep || !verificationStep) throw new Error(`${trace.qlId}: incomplete option-substitution trace`);

  const rate = rational(factorStep, "ratePercent");
  const annualFactor = rational(factorStep, "annualFactor");
  const keyIdea = "Use the answer choices in the nth-year-interest relation. The option that reproduces the given yearly interest is the required rate.";
  const steps = Object.freeze([
    `Check the option ${rateMath(rate)}: annual factor $=1+\\frac{${rate.numerator}}{${rate.denominator === 1n ? 100n : rate.denominator * 100n}}=${fractionLatex(annualFactor)}$.`,
    base.steps[1]!,
  ]);
  const sourceStepIds = Object.freeze([factorStep.id, verificationStep.id]);

  return Object.freeze({
    traceVersion: base.traceVersion,
    methodId: base.methodId,
    keyIdea,
    steps,
    sourceStepIds,
    finalAnswer: base.finalAnswer,
    ...(base.commonMistake ? { commonMistake: base.commonMistake } : {}),
    depths: Object.freeze({
      exam: Object.freeze({ steps, sourceStepIds }),
      student: Object.freeze({ steps: Object.freeze([keyIdea, ...steps]), sourceStepIds }),
      foundation: Object.freeze({ steps, sourceStepIds }),
    }),
  });
}
