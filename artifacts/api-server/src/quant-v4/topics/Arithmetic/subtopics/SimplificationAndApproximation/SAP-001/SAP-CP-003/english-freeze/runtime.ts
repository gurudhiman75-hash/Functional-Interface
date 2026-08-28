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
} from "../types";
import { SAP_CP003_EXPLANATION_POLICY } from "./explanation-policy";
import type {
  SapCp003EnglishExplanationCandidate,
  SapCp003ExplanationValidation,
  SapCp003FrozenExplanation,
} from "./types";

const BANNED_LEARNER_TERMS = /\b(?:AST|RPN|canonical|verifier|prototype|seed|payload|runtime|authority|fingerprint|package)\b/i;
const MALFORMED_SURFACE = /undefined|NaN|Evaluate\s+\*|\?\s*\.|\bnull\b/i;
const DIAGNOSIS_PROTOTYPE = "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP" as const;

function stripTerminalPunctuation(value: string): string {
  return value.trim().replace(/[.!?]+$/u, "");
}

function finalAnswerFor(base: SapCp003PermanentPackage): string {
  if (base.prototypeId === "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL") {
    return ensureSentence(`Therefore, the missing percentage is ${base.canonicalAnswer}`);
  }
  if (base.prototypeId === "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND") {
    return ensureSentence(`Therefore, the missing decimal value is ${base.canonicalAnswer}`);
  }
  if (base.prototypeId === DIAGNOSIS_PROTOTYPE && base.canonicalAnswer === "No error") {
    return "Therefore, no displayed step is incorrect, so the correct answer is No error.";
  }
  switch (base.taskDirection) {
    case "COMPARISON":
      return ensureSentence(`Therefore, the correct relation is ${base.canonicalAnswer}`);
    case "SELECTION":
      return ensureSentence(`Therefore, the correct option value is ${base.canonicalAnswer}`);
    case "DIAGNOSIS":
      return ensureSentence(`Therefore, the first incorrect step is ${base.canonicalAnswer}`);
    case "INVERSE":
      return ensureSentence(`Therefore, the missing value is ${base.canonicalAnswer}`);
    default:
      return ensureSentence(`Therefore, the value of the expression is ${base.canonicalAnswer}`);
  }
}

function afterLastEquals(line: string): string {
  const parts = line.split(" = ");
  return stripTerminalPunctuation(parts[parts.length - 1] ?? line);
}

function diagnosisSteps(base: SapCp003PermanentPackage): readonly string[] {
  const sourceSteps = base.explanation.steps.map(stripTerminalPunctuation);
  const lines = base.stem.split("\n");
  const step1Form = afterLastEquals(lines[1] ?? "Step 1");
  const step2Value = afterLastEquals(lines[2] ?? "Step 2");
  const step3Value = afterLastEquals(lines[3] ?? "Step 3");
  const answer = base.canonicalAnswer;
  const steps: string[] = [`Step 1: ${ensureSentence(sourceSteps[0] ?? "Convert the original expression exactly")}`];

  if (answer === "Step 1") {
    steps.push(`Step 2: The first displayed conversion gives ${step1Form}, whose computed value is ${step2Value}; it does not equal the original exact value.`);
  } else if (answer === "Step 2") {
    steps.push(`Step 2: Step 1 preserves the original value as ${step1Form}, but Step 2 changes it to ${step2Value}.`);
  } else if (answer === "Step 3") {
    steps.push(`Step 2: Steps 1 and 2 preserve the value ${step2Value}, but Step 3 changes it to ${step3Value}.`);
  } else {
    steps.push(`Step 2: The converted form ${step1Form}, the combined value ${step2Value}, and the final form ${step3Value} all preserve the original value.`);
  }

  steps.push(`Step 3: ${ensureSentence(sourceSteps[1] ?? `${answer} is the correct diagnosis`)}`);
  return Object.freeze(steps);
}

function buildExplanation(base: SapCp003PermanentPackage): SapCp003FrozenExplanation {
  const policy = SAP_CP003_EXPLANATION_POLICY[base.prototypeId];
  const stepByStep = base.prototypeId === DIAGNOSIS_PROTOTYPE
    ? diagnosisSteps(base)
    : Object.freeze(base.explanation.steps.map((step, index) =>
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
    finalAnswer: finalAnswerFor(base),
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
  const frozenSteps = normalizePayload(explanation.stepByStep.join(" "));
  const exactStepsPassed = base.explanation.steps.every((sourceStep) =>
    frozenSteps.includes(normalizePayload(stripTerminalPunctuation(sourceStep))),
  );
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
  if (!exactStepsPassed) errors.push("The explanation does not preserve every exact calculation statement.");
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
