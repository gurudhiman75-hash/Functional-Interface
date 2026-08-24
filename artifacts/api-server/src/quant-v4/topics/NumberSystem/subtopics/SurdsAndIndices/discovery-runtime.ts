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
import { describeSriGivenState } from "./explanation-state";
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

function normalizeExplanation(
  explanation: SriHumanExplanation,
  stem: string,
  state: Readonly<Record<string, string | number | boolean>>,
): SriHumanExplanation {
  const repeatsStem = normalizeComparableText(explanation.given) === normalizeComparableText(stem);
  return repeatsStem ? { ...explanation, given: describeSriGivenState(state) } : explanation;
}

export function finalizeSriDiscoveryQuestion(input: FinalizeSriDiscoveryInput): SriDiscoveryQuestion {
  const { options, correctIndex } = buildSriOptions(input.seed, input.answer, input.distractors);
  const solverVerifierAgree = input.canonicalSolverKey === input.independentVerifierKey;
  const exactlyOneCorrectOption = options.filter((option) => option.canonicalKey === input.answer.canonicalKey).length === 1;
  const domainValid = input.domainValid ?? true;
  const explanation = normalizeExplanation(input.explanation, input.stem, input.state);
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
    stem: input.stem,
    answer: input.answer,
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
