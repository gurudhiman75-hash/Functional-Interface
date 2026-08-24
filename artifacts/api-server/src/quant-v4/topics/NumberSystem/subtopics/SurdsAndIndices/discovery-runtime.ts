import {
  addRational,
  formatRational,
  multiplyRational,
  negateRational,
  proofEvent,
  rational,
  rationalKey,
  reciprocalRational,
  sriBucket,
  subtractRational,
  type SriProofEvent,
} from "../../../../shared/surds-indices";
import { describeSriGivenContext } from "./explanation-state";
import type {
  SriCandidateAnswer,
  SriCandidateOption,
  SriDiscoveryQuestion,
  SriHumanExplanation,
  SriCheckpointId,
} from "./discovery-types";

export interface SriDistractor extends SriCandidateAnswer {
  readonly misconceptionId: string;
}

export interface FinalizeSriDiscoveryInput {
  readonly packageId: "SRI-001" | "SRI-002";
  readonly checkpointId: SriCheckpointId;
  readonly candidateId: string;
  readonly seed: string;
  readonly state: Readonly<Record<string, string | number | boolean>>;
  readonly stem: string;
  readonly answer: SriCandidateAnswer;
  readonly canonicalSolverKey: string;
  readonly independentVerifierKey: string;
  readonly distractors: readonly SriDistractor[];
  readonly explanation: SriHumanExplanation;
  readonly proofEvents?: readonly SriProofEvent[];
  readonly domainValid?: boolean;
}

function canonicalFallbackDistractors(correct: SriCandidateAnswer): SriDistractor[] {
  if (correct.canonicalKey.startsWith("V:")) {
    const value = BigInt(correct.canonicalKey.slice(2));
    const candidates: readonly [bigint, string][] = [
      [value + 1n, "ARITHMETIC_OFF_BY_ONE"],
      [value - 1n, "ARITHMETIC_OFF_BY_ONE"],
      [value + 2n, "ARITHMETIC_OFF_BY_TWO"],
      [value - 2n, "ARITHMETIC_OFF_BY_TWO"],
      [value + 3n, "ARITHMETIC_OFF_BY_THREE"],
      [value - 3n, "ARITHMETIC_OFF_BY_THREE"],
      [value * 2n, "DOUBLE_RESULT"],
      [-value, "SIGN_ERROR"],
    ];
    return candidates.map(([candidate, misconceptionId]) => ({
      text: candidate.toString(),
      canonicalKey: `V:${candidate}`,
      misconceptionId,
    }));
  }

  if (correct.canonicalKey.startsWith("R:")) {
    const match = /^R:(-?\d+)\/(\d+)$/.exec(correct.canonicalKey);
    if (!match) return [];
    const value = rational(BigInt(match[1]!), BigInt(match[2]!));
    const candidates = [
      { value: addRational(value, rational(1)), misconceptionId: "ARITHMETIC_OFF_BY_ONE" },
      { value: subtractRational(value, rational(1)), misconceptionId: "ARITHMETIC_OFF_BY_ONE" },
      { value: addRational(value, rational(2)), misconceptionId: "ARITHMETIC_OFF_BY_TWO" },
      { value: subtractRational(value, rational(2)), misconceptionId: "ARITHMETIC_OFF_BY_TWO" },
      { value: addRational(value, rational(3)), misconceptionId: "ARITHMETIC_OFF_BY_THREE" },
      { value: subtractRational(value, rational(3)), misconceptionId: "ARITHMETIC_OFF_BY_THREE" },
      { value: multiplyRational(value, rational(2)), misconceptionId: "DOUBLE_RESULT" },
      { value: negateRational(value), misconceptionId: "SIGN_ERROR" },
      ...(value.numerator !== 0n ? [{ value: reciprocalRational(value), misconceptionId: "RECIPROCAL_ERROR" }] : []),
    ];
    return candidates.map(({ value: candidate, misconceptionId }) => ({
      text: formatRational(candidate),
      canonicalKey: `R:${rationalKey(candidate)}`,
      misconceptionId,
    }));
  }

  return [];
}

function cleanSriLearnerText(value: string): string {
  return value
    .replace(/\b[A-Z][A-Z0-9_]{2,}:\s*/g, "")
    .replace(/Normalize each visible base to the common prime base and compare canonical values\./gi, "Rewrite each given base as a power of the common base, then compare the exact values.")
    .replace(/\bNormalize\b/g, "Rewrite")
    .replace(/\bnormalize\b/g, "rewrite")
    .replace(/\bCanonical result\b/gi, "Simplified result")
    .replace(/\bcanonical values?\b/gi, "exact values")
    .replace(/\bcanonical surd form\b/gi, "simplest surd form")
    .replace(/\bcanonical coefficients?\b/gi, "standard-form coefficients")
    .replace(/\bcanonical form\b/gi, "standard form")
    .replace(/\bprime base\b/gi, "common base")
    .replace(/\bdenominator-th root\b/gi, "root indicated by the denominator")
    .replace(/\bsupported denested form\b/gi, "requested denested form")
    .replace(/the visible base was reverse-constructed as a perfect qth power\./gi, "the base is a perfect qth power, so its qth root is exact.")
    .replace(/\breverse-constructed\b/gi, "chosen")
    .replace(/\bvisible base\b/gi, "given base")
    .replace(/\b1th\b/g, "1st")
    .replace(/\b2th\b/g, "2nd")
    .replace(/\b3th\b/g, "3rd")
    .replace(/The exact denesting test succeeds\./g, "The condition is satisfied, so denesting is possible.")
    .replace(/The exact denesting test fails\./g, "The condition is not satisfied, so this form cannot be denested into integer-radicand square roots.")
    .replace(/\b1\\sqrt/g, "\\sqrt");
}

export function buildSriOptions(
  seed: string,
  correct: SriCandidateAnswer,
  distractors: readonly SriDistractor[],
): { options: SriDiscoveryQuestion["options"]; correctIndex: 0 | 1 | 2 | 3 } {
  const unique = new Map<string, SriCandidateOption>();
  unique.set(correct.canonicalKey, { ...correct, misconceptionId: null });
  for (const distractor of [...distractors, ...canonicalFallbackDistractors(correct)]) {
    if (distractor.canonicalKey !== correct.canonicalKey && !unique.has(distractor.canonicalKey)) {
      unique.set(distractor.canonicalKey, distractor);
    }
    if (unique.size >= 4) break;
  }
  if (unique.size < 4) throw new Error(`SRI discovery option pool requires four unique canonical answers; found ${unique.size}`);
  const selected = [...unique.values()].slice(0, 4);
  const rotation = sriBucket(`${seed}:option-rotation`, 4);
  const rotated = [...selected.slice(rotation), ...selected.slice(0, rotation)] as SriCandidateOption[];
  const correctIndex = rotated.findIndex((option) => option.canonicalKey === correct.canonicalKey);
  if (correctIndex < 0 || correctIndex > 3) throw new Error("Correct option missing after deterministic rotation");
  return {
    options: rotated as SriDiscoveryQuestion["options"],
    correctIndex: correctIndex as 0 | 1 | 2 | 3,
  };
}

function normalizeComparableText(value: string): string {
  return value.trim().replace(/[?.!]+$/g, "").replace(/\s+/g, " ").toLowerCase();
}

function hasStructuredStateLeak(given: string): boolean {
  const stateAssignmentDump = given.startsWith("Given ") && /\s=\s/.test(given);
  const internalEnumToken = /\b[A-Z][A-Z0-9_]{2,}\b/.test(given);
  return stateAssignmentDump || internalEnumToken;
}

function normalizeExplanation(
  explanation: SriHumanExplanation,
  stem: string,
  checkpointId: SriCheckpointId,
): SriHumanExplanation {
  const cleaned: SriHumanExplanation = {
    given: cleanSriLearnerText(explanation.given),
    asked: cleanSriLearnerText(explanation.asked),
    method: cleanSriLearnerText(explanation.method),
    working: explanation.working.map(cleanSriLearnerText),
    answer: cleanSriLearnerText(explanation.answer),
  };
  const repeatsStem = normalizeComparableText(cleaned.given) === normalizeComparableText(stem);
  const unsafeGiven = repeatsStem || hasStructuredStateLeak(cleaned.given);
  return unsafeGiven ? { ...cleaned, given: describeSriGivenContext(checkpointId, stem) } : cleaned;
}

export function finalizeSriDiscoveryQuestion(input: FinalizeSriDiscoveryInput): SriDiscoveryQuestion {
  const cleanedAnswer: SriCandidateAnswer = { ...input.answer, text: cleanSriLearnerText(input.answer.text) };
  const cleanedDistractors: SriDistractor[] = input.distractors.map((item) => ({ ...item, text: cleanSriLearnerText(item.text) }));
  const { options, correctIndex } = buildSriOptions(input.seed, cleanedAnswer, cleanedDistractors);
  const solverVerifierAgree = input.canonicalSolverKey === input.independentVerifierKey;
  const exactlyOneCorrectOption = options.filter((option) => option.canonicalKey === cleanedAnswer.canonicalKey).length === 1;
  const domainValid = input.domainValid ?? true;
  const stem = cleanSriLearnerText(input.stem);
  const explanation = normalizeExplanation({ ...input.explanation, answer: cleanedAnswer.text }, stem, input.checkpointId);
  const proofEvents = [
    ...(input.proofEvents ?? []),
    proofEvent(
      "INDEPENDENT_VERIFY",
      "canonical solver must agree with materially independent verifier",
      { canonicalSolverKey: input.canonicalSolverKey },
      { independentVerifierKey: input.independentVerifierKey, agree: String(solverVerifierAgree) },
    ),
  ];

  const question: SriDiscoveryQuestion = {
    status: "PROVISIONAL_DISCOVERY",
    packageId: input.packageId,
    checkpointId: input.checkpointId,
    candidateId: input.candidateId,
    seed: input.seed,
    state: input.state,
    stem,
    answer: cleanedAnswer,
    options,
    correctIndex,
    explanation,
    proofEvents,
    verification: {
      canonicalSolverKey: input.canonicalSolverKey,
      independentVerifierKey: input.independentVerifierKey,
      solverVerifierAgree,
      exactlyOneCorrectOption,
      deterministic: true,
      domainValid,
    },
  };

  const failures = validateSriDiscoveryQuestion(question);
  if (failures.length > 0) {
    throw new Error(`Invalid SRI discovery question ${input.candidateId}: ${failures.join(" | ")}`);
  }
  return question;
}

export function validateSriDiscoveryQuestion(question: SriDiscoveryQuestion): string[] {
  const failures: string[] = [];
  if (question.status !== "PROVISIONAL_DISCOVERY") failures.push("question is not marked provisional discovery");
  if (!question.stem.trim()) failures.push("blank stem");
  if (!question.answer.text.trim() || !question.answer.canonicalKey.trim()) failures.push("blank answer");
  if (question.options.length !== 4) failures.push("question must have exactly four options");
  if (new Set(question.options.map((option) => option.canonicalKey)).size !== 4) failures.push("option canonical keys must be unique");
  const matching = question.options.filter((option) => option.canonicalKey === question.answer.canonicalKey);
  if (matching.length !== 1) failures.push(`expected exactly one correct canonical option; found ${matching.length}`);
  if (question.options[question.correctIndex]?.canonicalKey !== question.answer.canonicalKey) failures.push("correctIndex does not point to canonical answer");
  if (!question.verification.solverVerifierAgree) failures.push("canonical solver and independent verifier disagree");
  if (!question.verification.exactlyOneCorrectOption) failures.push("question verification did not prove exactly one correct option");
  if (!question.verification.domainValid) failures.push("question state is outside the declared real domain");
  if (!question.proofEvents.some((event) => event.kind === "INDEPENDENT_VERIFY")) failures.push("proof trace lacks independent verification");
  if (normalizeComparableText(question.explanation.given) === normalizeComparableText(question.stem)) failures.push("explanation repeats the complete stem");
  return failures;
}
