import { proofEvent, sriBucket, type SriProofEvent } from "../../../../shared/surds-indices";
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

export function buildSriOptions(
  seed: string,
  correct: SriCandidateAnswer,
  distractors: readonly SriDistractor[],
): { options: SriDiscoveryQuestion["options"]; correctIndex: 0 | 1 | 2 | 3 } {
  const unique = new Map<string, SriCandidateOption>();
  unique.set(correct.canonicalKey, { ...correct, misconceptionId: null });
  for (const distractor of distractors) {
    if (distractor.canonicalKey !== correct.canonicalKey && !unique.has(distractor.canonicalKey)) {
      unique.set(distractor.canonicalKey, distractor);
    }
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

export function finalizeSriDiscoveryQuestion(input: FinalizeSriDiscoveryInput): SriDiscoveryQuestion {
  const { options, correctIndex } = buildSriOptions(input.seed, input.answer, input.distractors);
  const solverVerifierAgree = input.canonicalSolverKey === input.independentVerifierKey;
  const exactlyOneCorrectOption = options.filter((option) => option.canonicalKey === input.answer.canonicalKey).length === 1;
  const domainValid = input.domainValid ?? true;
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
    explanation: input.explanation,
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
  return failures;
}
