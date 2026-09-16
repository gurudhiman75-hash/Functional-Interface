import { seededRandom, shuffle } from "../DI-001/exact";
import { generateDi005V2Set } from "./pie-set-v2";
import type { Di005V2ExamProfile, Di005V2Option, Di005V2Question, Di005V2QuestionSet } from "./pie-v2-types";

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;

function uniqueCandidates(answer: string, candidates: readonly Candidate[], needed: number) {
  const seen = new Set<string>();
  const retained: Di005V2Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared pie-chart stimulus." });
  candidates.forEach(add);
  if (retained.length < needed) throw new Error(`DI-005 V2 quality layer has only ${retained.length} options for ${answer}.`);
  return retained;
}

function rebuildOptions(set: Di005V2QuestionSet, question: Di005V2Question) {
  const optionCount = set.optionCount;
  const total = set.stimulus.totalValue;
  const countFor = (index: number) => (total * set.stimulus.slices[index]!.percent) / 100;
  const step = total / 20;
  let candidates: Candidate[] | undefined;

  if (question.kind === "SECTOR_COUNT_FROM_TOTAL") {
    const targetIndex = Number(question.evidence.categoryIndex);
    candidates = set.stimulus.slices
      .map((slice, index) => ({ slice, index }))
      .filter(({ index }) => index !== targetIndex)
      .map(({ slice, index }) => ({
        text: String(countFor(index)),
        misconceptionId: `READ_OTHER_SECTOR_COUNT_${index + 1}`,
        derivation: `Uses the count represented by ${slice.category} instead of the requested sector.`,
      }));
  }

  if (question.kind === "DIFFERENCE_IN_COUNTS") {
    const firstIndex = Number(question.evidence.firstIndex);
    const secondIndex = Number(question.evidence.secondIndex);
    const first = countFor(firstIndex);
    const second = countFor(secondIndex);
    const correct = Math.abs(first - second);
    candidates = [
      { text: String(first + second), misconceptionId: "ADD_COUNTS", derivation: "Adds the two category counts instead of finding their difference." },
      { text: String(Math.max(first, second)), misconceptionId: "USE_LARGER_COUNT_ONLY", derivation: "Reports the larger category count without subtracting." },
      { text: String(Math.min(first, second)), misconceptionId: "USE_SMALLER_COUNT_ONLY", derivation: "Reports the smaller category count without subtracting." },
      { text: String(correct + step), misconceptionId: "ONE_SCALE_STEP_HIGH", derivation: "Moves one five-percent count step above the correct difference." },
      { text: String(Math.max(0, correct - step)), misconceptionId: "ONE_SCALE_STEP_LOW", derivation: "Moves one five-percent count step below the correct difference." },
      { text: String(correct + 2 * step), misconceptionId: "TWO_SCALE_STEPS_HIGH", derivation: "Moves two five-percent count steps above the correct difference." },
    ];
  }

  if (!candidates) return question;
  const retained = uniqueCandidates(question.answer, candidates, optionCount);
  const shuffled = shuffle(seededRandom(`${set.seed}:${question.kind}:${set.examProfile}:quality-options`), retained.slice(0, optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error(`DI-005 V2 quality layer lost the answer for ${question.kind}.`);
  return {
    ...question,
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

/**
 * Review authority for DI-005 V2.
 * Keeps the deterministic core set state while hardening learner-facing option quality.
 */
export function generateDi005V2ReviewSet(input: { seed: string; examProfile: Di005V2ExamProfile }): Di005V2QuestionSet {
  const base = generateDi005V2Set(input);
  const questions = base.questions.map((question) => rebuildOptions(base, question));
  return { ...base, questions };
}
