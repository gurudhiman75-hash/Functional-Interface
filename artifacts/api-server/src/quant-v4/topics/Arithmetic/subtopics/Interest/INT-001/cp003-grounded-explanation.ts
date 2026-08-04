import type { Rational } from "./cp003-exam-model";
import type { Cp003StudentExplanation } from "./cp003-exam-types";
import { explanationFor as baseExplanationFor } from "./cp003-exam-explanation";
import type { Cp003SolutionTrace, Cp003SolutionTraceStep } from "./cp003-grounded-solution-trace";
import {
  annualFactorText as legacyAnnualFactorText,
  fractionLatex,
  rateMath,
} from "./cp003-exam-support";
import { groundedAnnualFactorText } from "./cp003-grounded-factor-text";

function rational(step: Cp003SolutionTraceStep, key: string): Rational {
  const datum = step.data.find((entry) => entry.key === key);
  if (!datum || datum.kind !== "RATIONAL") throw new Error(`${step.id}: missing rational datum ${key}`);
  return datum.value;
}

function traceRate(trace: Cp003SolutionTrace): Rational | undefined {
  for (const step of [...trace.coreSteps, ...trace.foundationSteps, ...trace.verificationSteps]) {
    const datum = step.data.find((entry) => entry.key === "ratePercent");
    if (datum?.kind === "RATIONAL") return datum.value;
  }
  return undefined;
}

function polishText(text: string, trace: Cp003SolutionTrace): string {
  let polished = text.replace(/for the \$([0-9]+)\$ years? gap/gu, (_match, years: string) => `for the $${years}$-year gap`);
  const rate = traceRate(trace);
  if (rate) {
    const legacy = legacyAnnualFactorText(rate);
    const grounded = groundedAnnualFactorText(rate);
    if (legacy !== grounded) polished = polished.split(legacy).join(grounded);
  }
  return polished;
}

function polishBaseExplanation(
  base: Cp003StudentExplanation,
  trace: Cp003SolutionTrace,
): Cp003StudentExplanation {
  const polishSteps = (steps: readonly string[]): readonly string[] => Object.freeze(steps.map((step) => polishText(step, trace)));
  return Object.freeze({
    traceVersion: base.traceVersion,
    methodId: base.methodId,
    keyIdea: polishText(base.keyIdea, trace),
    steps: polishSteps(base.steps),
    sourceStepIds: base.sourceStepIds,
    finalAnswer: polishText(base.finalAnswer, trace),
    ...(base.shortcut ? {
      shortcut: Object.freeze({
        title: polishText(base.shortcut.title, trace),
        steps: polishSteps(base.shortcut.steps),
        sourceStepIds: base.shortcut.sourceStepIds,
      }),
    } : {}),
    ...(base.commonMistake ? { commonMistake: polishText(base.commonMistake, trace) } : {}),
    ...(base.verification ? {
      verification: Object.freeze({
        method: polishText(base.verification.method, trace),
        steps: polishSteps(base.verification.steps),
        sourceStepIds: base.verification.sourceStepIds,
      }),
    } : {}),
    depths: Object.freeze({
      exam: Object.freeze({ steps: polishSteps(base.depths.exam.steps), sourceStepIds: base.depths.exam.sourceStepIds }),
      student: Object.freeze({ steps: polishSteps(base.depths.student.steps), sourceStepIds: base.depths.student.sourceStepIds }),
      foundation: Object.freeze({ steps: polishSteps(base.depths.foundation.steps), sourceStepIds: base.depths.foundation.sourceStepIds }),
    }),
  });
}

export function explanationFor(trace: Cp003SolutionTrace): Cp003StudentExplanation {
  const base = polishBaseExplanation(baseExplanationFor(trace), trace);
  if (trace.methodId !== "NTH_YEAR_RATE_SUBSTITUTION") return base;

  const factorStep = trace.coreSteps.find((step) => step.operationId === "ANNUAL_FACTOR");
  const verificationStep = trace.coreSteps.find((step) => step.operationId === "VERIFY_NTH_YEAR_RATE");
  if (!factorStep || !verificationStep) throw new Error(`${trace.qlId}: incomplete option-substitution trace`);

  const rate = rational(factorStep, "ratePercent");
  const annualFactor = rational(factorStep, "annualFactor");
  const keyIdea = "Use the answer choices in the nth-year-interest relation. The option that reproduces the given yearly interest is the required rate.";
  const steps = Object.freeze([
    `Check the option ${rateMath(rate)}: its annual factor is $${fractionLatex(annualFactor)}$.`,
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
