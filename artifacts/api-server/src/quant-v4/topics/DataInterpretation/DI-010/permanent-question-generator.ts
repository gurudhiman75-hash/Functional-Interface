import { hashSeed, seededRandom, shuffle } from "../DI-001/exact";
import { buildDi010Stimulus } from "./frequency-polygon-state";
import { DI010_DIFFICULTY_BY_TASK } from "./frequency-polygon-set";
import { buildDi010DraftsV3, type Di010Candidate, type Di010Draft } from "./task-builders-v3";
import type { Di010ExamProfile, Di010Option, Di010Question, Di010TaskKind } from "./types";

const OPTION_COUNT = 4 as const;

function numericRescue(answer: string): Di010Candidate[] {
  if (!/^-?\d+(?:\.\d+)?$/.test(answer)) return [];
  const value = Number(answer);
  const step = Number.isInteger(value) ? 5 : 1;
  return [-2, -1, 1, 2, 3].map((shift) => value + shift * step).filter((candidate) => candidate > 0).map((candidate, index) => ({ text: String(Number(candidate.toFixed(2))), misconceptionId: `NEARBY_NUMERIC_${index}`, derivation: "Represents a nearby result from a small reading or arithmetic error." }));
}

function intervalRescue(answer: string): Di010Candidate[] {
  const match = answer.match(/^(-?\d+(?:\.\d+)?)–(-?\d+(?:\.\d+)?)$/);
  if (!match) return [];
  const lower = Number(match[1]), upper = Number(match[2]), width = upper - lower;
  if (!(width > 0)) return [];
  return [-2, -1, 1, 2].map((shift) => ({ lower: lower + shift * width, upper: upper + shift * width })).map((item, index) => ({ text: `${Number(item.lower.toFixed(2))}–${Number(item.upper.toFixed(2))}`, misconceptionId: `NEARBY_CLASS_RESCUE_${index}`, derivation: "Chooses a nearby class interval instead of the required class." }));
}

function endpointRescue(answer: string): Di010Candidate[] {
  const match = answer.match(/^\((-?\d+(?:\.\d+)?), 0\) and \((-?\d+(?:\.\d+)?), 0\)$/);
  if (!match) return [];
  const left = Number(match[1]), right = Number(match[2]);
  return [5, 10].map((shift, index) => ({ text: `(${Number((left - shift).toFixed(2))}, 0) and (${Number((right + shift).toFixed(2))}, 0)`, misconceptionId: `OVEREXTEND_CLOSURE_${index}`, derivation: "Moves the zero-frequency endpoints too far beyond the required adjoining-class positions." }));
}

function ratioRescue(answer: string): Di010Candidate[] {
  const match = answer.match(/^(\d+):(\d+)$/);
  if (!match) return [];
  const left = Number(match[1]), right = Number(match[2]);
  return [
    { text: `${right}:${left}`, misconceptionId: "RATIO_RESCUE_REVERSED", derivation: "Reverses the requested order of the two range totals." },
    { text: `${left + 1}:${right}`, misconceptionId: "RATIO_RESCUE_LEFT_NEARBY", derivation: "Uses a nearby first ratio term after a small reading error." },
    { text: `${left}:${right + 1}`, misconceptionId: "RATIO_RESCUE_RIGHT_NEARBY", derivation: "Uses a nearby second ratio term after a small reading error." },
  ];
}

function percentageRescue(answer: string): Di010Candidate[] {
  const match = answer.match(/^(\d+(?:\.\d+)?)%$/);
  if (!match) return [];
  const value = Number(match[1]);
  return [-10, -5, 5, 10].map((shift) => value + shift).filter((candidate) => candidate > 0 && candidate < 100).map((candidate, index) => ({ text: `${Number(candidate.toFixed(2))}%`, misconceptionId: `NEARBY_PERCENT_${index}`, derivation: "Represents a nearby percentage caused by using the wrong class frequency or denominator." }));
}

function hasDecimalToken(value: string) {
  return /\d+\.\d+/u.test(value);
}

function buildOptions(seed: string, answer: string, candidates: readonly Di010Candidate[]) {
  if (hasDecimalToken(answer)) throw new Error(`DI-010 ${seed} produced decimal answer '${answer}' after the no-decimal policy.`);
  const retained: Di010Option[] = [];
  const seen = new Set<string>();
  const add = (candidate: Di010Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || hasDecimalToken(candidate.text) || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the certified DI-010 semantic state." });
  candidates.forEach(add);
  numericRescue(answer).forEach(add);
  intervalRescue(answer).forEach(add);
  endpointRescue(answer).forEach(add);
  ratioRescue(answer).forEach(add);
  percentageRescue(answer).forEach(add);
  if (retained.length < OPTION_COUNT) throw new Error(`DI-010 permanent ${seed} constructed only ${retained.length} unique options for '${answer}'.`);
  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, OPTION_COUNT));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-010 permanent generation lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function normalizeDraft(draft: Di010Draft): Di010Draft {
  return { ...draft, difficulty: DI010_DIFFICULTY_BY_TASK[draft.kind] };
}

export function generateDi010PermanentQuestion(input: { seed: string; examProfile: Di010ExamProfile; taskKind: Di010TaskKind }) {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-010 permanent generation requires a non-empty seed.");
  const stimulus = buildDi010Stimulus(seed, input.examProfile);
  const draft = buildDi010DraftsV3(seed, stimulus).map(normalizeDraft).find((item) => item.kind === input.taskKind);
  if (!draft) throw new Error(`DI-010 could not construct permanent task ${input.taskKind}.`);
  const built = buildOptions(`${seed}:${input.examProfile}:${draft.kind}`, draft.answer, draft.candidates);
  const setId = `DI-010-${input.examProfile}-${hashSeed(`${seed}:${input.examProfile}`).toString(16).padStart(8, "0")}`;
  const question: Di010Question = {
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
    packageId: "DI-010" as const,
    seed,
    examProfile: input.examProfile,
    stimulus,
    question,
    traceability: {
      representation: "FREQUENCY_POLYGON" as const,
      questionLogicVersion: "DI-010-QUESTION-LOGIC-P3" as const,
      setContractVersion: "DI-010-SET-CONTRACT-P2" as const,
      presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
  };
}
