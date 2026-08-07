import { ensureSentence, hash32, normalizePayload } from "../exact";
import {
  SAP_CP003_PERMANENT_QL_IDS,
  SAP_CP003_PROTOTYPE_TO_PERMANENT_QL,
  generateSapCp003PermanentPackage,
  type SapCp003PermanentPackage,
} from "../permanent-runtime/runtime";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003PrototypeId,
  type SapCp003TaskDirection,
} from "../types";
import { SAP_CP003_EXPLANATION_POLICY } from "./explanation-policy";
import type {
  SapCp003EnglishExplanationCandidate,
  SapCp003ExplanationValidation,
  SapCp003FrozenExplanation,
} from "./types";

const BANNED_LEARNER_TERMS = /\b(?:AST|RPN|canonical|verifier|prototype|seed|payload|runtime|authority|fingerprint|package)\b/i;
const MALFORMED_SURFACE = /undefined|NaN|Evaluate\s+\*|\?\s*\.|\bnull\b/i;

function stripTerminalPunctuation(value: string): string {
  return value.trim().replace(/[.!?]+$/u, "");
}

function finalAnswerFor(direction: SapCp003TaskDirection, answer: string): string {
  switch (direction) {
    case "INVERSE":
      return ensureSentence(`Therefore, the missing value is ${answer}`);
    case "COMPARISON":
      return ensureSentence(`Therefore, the correct relation is ${answer}`);
    case "SELECTION":
      return ensureSentence(`Therefore, the correct option value is ${answer}`);
    case "DIAGNOSIS":
      return ensureSentence(`Therefore, the first incorrect step is ${answer}`);
    default:
      return ensureSentence(`Therefore, the value of the expression is ${answer}`);
  }
}

function buildExplanation(base: SapCp003PermanentPackage): SapCp003FrozenExplanation {
  const policy = SAP_CP003_EXPLANATION_POLICY[base.prototypeId];
  const stepByStep = Object.freeze(base.explanation.steps.map((step, index) =>
    `Step ${index + 1}: ${ensureSentence(stripTerminalPunctuation(step))}`,
  ));
  return Object.freeze({
    coreConcept: ensureSentence(stripTerminalPunctuation(policy.coreConcept)),
    givenDataAndStrategy: ensureSentence(stripTerminalPunctuation(policy.givenDataAndStrategy)),
    stepByStep,
    whyThisWorks: ensureSentence(stripTerminalPunctuation(policy.whyThisWorks)),
    commonTraps: Object.freeze(policy.commonTraps.map((trap) =>
      ensureSentence(stripTerminalPunctuation(trap)),
    )) as readonly [string, string, string],
    finalAnswer: finalAnswerFor(base.taskDirection, base.canonicalAnswer),
  });
}

function validateExplanation(
  base: SapCp003PermanentPackage,
  explanation: SapCp003FrozenExplanation,
): SapCp003ExplanationValidation {
  const errors: string[] = [];
  const surface = [
    explanation.coreConcept,
    explanation.givenDataAndStrategy,
    ...explanation.stepByStep,
    explanation.whyThisWorks,
    ...explanation.commonTraps,
    explanation.finalAnswer,
  ].join(" ");

  const learnerLanguagePassed = !BANNED_LEARNER_TERMS.test(surface) && !MALFORMED_SURFACE.test(surface);
  const structurePassed = explanation.coreConcept.length >= 55
    && explanation.givenDataAndStrategy.length >= 70
    && explanation.stepByStep.length >= 2
    && explanation.stepByStep.every((step) => step.length >= 12)
    && explanation.whyThisWorks.length >= 55
    && explanation.finalAnswer.length >= 24;
  const exactStepsPassed = explanation.stepByStep.length === base.explanation.steps.length
    && base.explanation.steps.every((sourceStep, index) => {
      const source = normalizePayload(stripTerminalPunctuation(sourceStep));
      const frozen = normalizePayload(explanation.stepByStep[index] ?? "");
      return frozen.includes(source);
    });
  const trapQualityPassed = explanation.commonTraps.length === 3
    && new Set(explanation.commonTraps).size === 3
    && explanation.commonTraps.every((trap) => trap.length >= 28);
  const finalAnswerBindingPassed = explanation.finalAnswer.includes(base.canonicalAnswer);
  const lifecyclePassed = base.lifecycle.active === false
    && base.lifecycle.questionStudioDiscoverable === false
    && base.lifecycle.questionBankWritable === false
    && base.lifecycle.testEligible === false
    && base.lifecycle.publiclyPublishable === false;

  if (!learnerLanguagePassed) errors.push("The explanation contains technical or malformed learner-facing text.");
  if (!structurePassed) errors.push("The explanation does not satisfy the complete student-friendly structure.");
  if (!exactStepsPassed) errors.push("The frozen explanation does not preserve every exact calculation step.");
  if (!trapQualityPassed) errors.push("The explanation must contain three distinct, specific common traps.");
  if (!finalAnswerBindingPassed) errors.push("The final sentence is not bound to the approved answer.");
  if (!lifecyclePassed) errors.push("The permanent package lifecycle is not safely inactive.");

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    learnerLanguagePassed,
    structurePassed,
    exactStepsPassed,
    trapQualityPassed,
    finalAnswerBindingPassed,
    lifecyclePassed,
  });
}

export function generateSapCp003EnglishExplanationCandidate(
  prototypeId: SapCp003PrototypeId,
  seed: number,
): SapCp003EnglishExplanationCandidate {
  const base = generateSapCp003PermanentPackage(prototypeId, seed);
  const explanation = buildExplanation(base);
  const explanationFingerprint = `SAP_CP003_EXPLANATION_${hash32([
    base.permanentQlId,
    base.stem,
    ...explanation.stepByStep,
    explanation.finalAnswer,
  ].join("|"))}`;
  const explanationValidation = validateExplanation(base, explanation);
  const lifecycle = Object.freeze({
    permanentQlId: base.permanentQlId,
    identityStatus: "PERMANENT_ID_ALLOCATED" as const,
    contentStatus: "QUESTIONS_AND_ANSWERS_APPROVED_EXPLANATION_REVIEW_PENDING" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });

  return Object.freeze({
    ...base,
    explanation,
    explanationFingerprint,
    explanationReviewStatus: "CANDIDATE_READY_FOR_HUMAN_REVIEW" as const,
    explanationValidation,
    lifecycle,
  });
}

export function generateSapCp003EnglishExplanationSweep(
  seedsPerPrototype: number,
): readonly SapCp003EnglishExplanationCandidate[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-003 explanation sweep size must be a positive integer.");
  }
  const candidates: SapCp003EnglishExplanationCandidate[] = [];
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      candidates.push(generateSapCp003EnglishExplanationCandidate(prototypeId, seed));
    }
  }
  return Object.freeze(candidates);
}

export const SAP_CP003_EXPLANATION_REVIEW_STATE = Object.freeze({
  checkpointId: "SAP-CP-003" as const,
  permanentQlRange: "SAP-QL-034..SAP-QL-052" as const,
  permanentQlCount: SAP_CP003_PERMANENT_QL_IDS.length,
  prototypeCount: SAP_CP003_PROTOTYPE_IDS.length,
  mappingCount: Object.keys(SAP_CP003_PROTOTYPE_TO_PERMANENT_QL).length,
  questionsAndAnswers: "APPROVED" as const,
  explanationReview: "PENDING_HUMAN_APPROVAL" as const,
  localisation: "PENDING" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
