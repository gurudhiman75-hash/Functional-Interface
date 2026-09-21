import { hashSeed, seededRandom, shuffle } from "../DI-001/exact";
import { buildDi009Stimulus } from "./histogram-shapes";
import { buildDi009Drafts, type Di009Candidate, type Di009Draft } from "./task-builders";
import type { Di009ExamProfile, Di009Option, Di009Question, Di009TaskKind } from "./types";

const OPTION_COUNT = 4 as const;

const DIFFICULTY_BY_TASK = {
  DIRECT_CLASS_FREQUENCY: "Easy",
  TOTAL_FREQUENCY: "Easy",
  COMBINED_RANGE_TOTAL: "Medium",
  ABOVE_BOUNDARY_TOTAL: "Medium",
  BELOW_BOUNDARY_TOTAL: "Medium",
  RANGE_RATIO: "Hard",
  CLASS_SHARE_OF_TOTAL: "Medium",
  FREQUENCY_DIFFERENCE_BETWEEN_CLASSES: "Medium",
  MODAL_CLASS_IDENTIFICATION: "Easy",
  MEDIAN_CLASS_IDENTIFICATION: "Hard",
  KTH_OBSERVATION_CLASS: "Hard",
  APPROX_GROUPED_MEAN_FROM_HISTOGRAM: "Hard",
  APPROX_GROUPED_MODE_FROM_HISTOGRAM: "Hard",
} as const satisfies Readonly<Record<Di009TaskKind, Di009Question["difficulty"]>>;

function formatOrdinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function normalizeDraft(draft: Di009Draft): Di009Draft {
  let next = { ...draft, difficulty: DIFFICULTY_BY_TASK[draft.kind] };
  if (next.kind === "KTH_OBSERVATION_CLASS") {
    const rank = Number(next.evidence.rank);
    if (Number.isSafeInteger(rank) && rank > 0) next = { ...next, stem: next.stem.replaceAll(`${rank}th`, formatOrdinal(rank)) };
  }
  return next;
}

function numericRescueCandidates(answer: string): Di009Candidate[] {
  if (/^-?\d+(?:\.\d+)?%$/.test(answer)) {
    const value = Number(answer.slice(0, -1));
    return [-10, -5, 5, 10]
      .map((shift) => value + shift)
      .filter((candidate) => candidate > 0 && candidate < 100)
      .map((candidate, index) => ({ text: `${Number(candidate.toFixed(2))}%`, misconceptionId: `NEARBY_PERCENTAGE_POINT_${index}`, derivation: "Uses a nearby percentage caused by a small numerator or denominator reading error." }));
  }
  if (/^-?\d+(?:\.\d+)?$/.test(answer)) {
    const value = Number(answer);
    const step = Number.isInteger(value) ? 5 : 1;
    return [-2, -1, 1, 2, 3]
      .map((shift) => value + shift * step)
      .filter((candidate) => candidate > 0)
      .map((candidate, index) => ({ text: Number(candidate.toFixed(2)).toString(), misconceptionId: `NEARBY_ARITHMETIC_${index}`, derivation: "Represents a nearby result from a small histogram reading or arithmetic error." }));
  }
  return [];
}

function hasDecimalToken(value: string) {
  return /\d+\.\d+/u.test(value);
}

function buildOptions(seed: string, answer: string, candidates: readonly Di009Candidate[]) {
  if (hasDecimalToken(answer)) throw new Error(`DI-009 ${seed} produced a decimal answer '${answer}' after the integer-only policy.`);
  const retained: Di009Option[] = [];
  const seen = new Set<string>();
  const add = (candidate: Di009Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || hasDecimalToken(candidate.text) || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the DI-009 histogram state." });
  candidates.forEach(add);
  numericRescueCandidates(answer).forEach(add);
  if (retained.length < OPTION_COUNT) throw new Error(`DI-009 ${seed} constructed only ${retained.length} unique options.`);
  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, OPTION_COUNT));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-009 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

const MAX_PERMANENT_TASK_ATTEMPTS = 128;

export function generateDi009PermanentQuestion(input: { seed: string; examProfile: Di009ExamProfile; taskKind: Di009TaskKind }) {
  const requestedSeed = input.seed.trim();
  if (!requestedSeed) throw new Error("DI-009 permanent generation requires a non-empty seed.");

  for (let attempt = 0; attempt < MAX_PERMANENT_TASK_ATTEMPTS; attempt += 1) {
    const sourceSeed = attempt === 0
      ? requestedSeed
      : `${requestedSeed}:PERM:${input.taskKind}:${attempt}`;
    const stimulus = buildDi009Stimulus(sourceSeed, input.examProfile);
    const draft = buildDi009Drafts(sourceSeed, stimulus).map(normalizeDraft).find((item) => item.kind === input.taskKind);
    if (!draft) continue;

    const built = buildOptions(`${sourceSeed}:${input.examProfile}:${draft.kind}`, draft.answer, draft.candidates);
    const setId = `DI-009-${input.examProfile}-${hashSeed(`${sourceSeed}:${input.examProfile}`).toString(16).padStart(8, "0")}`;
    const question: Di009Question = {
      questionId: `${setId}-PERM-${draft.kind}`,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stem: draft.stem,
      options: built.options,
      optionMetadata: built.optionMetadata,
      correctIndex: built.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
    return {
      packageId: "DI-009" as const,
      seed: requestedSeed,
      sourceSeed,
      generationAttempt: attempt,
      examProfile: input.examProfile,
      stimulus,
      question,
      traceability: {
        representation: "HISTOGRAM" as const,
        questionLogicVersion: "DI-009-QUESTION-LOGIC-V3" as const,
        setContractVersion: "DI-009-SET-CONTRACT-V3" as const,
        presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS" as const,
        permanentTaskMaterialization: "DETERMINISTIC_RETRY_IF_REQUIRED" as const,
        questionStudioDiscoverable: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
        automaticStudentPublication: false as const,
      },
    };
  }

  throw new Error(`DI-009 could not construct permanent task ${input.taskKind} within ${MAX_PERMANENT_TASK_ATTEMPTS} deterministic attempts.`);
}
