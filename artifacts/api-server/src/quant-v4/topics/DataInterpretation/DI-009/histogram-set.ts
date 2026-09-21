import { hashSeed, seededRandom, shuffle } from "../DI-001/exact";
import { buildDi009Stimulus } from "./histogram-shapes";
import { buildDi009Drafts, type Di009Candidate, type Di009Draft } from "./task-builders";
import type {
  Di009Difficulty,
  Di009ExamProfile,
  Di009Option,
  Di009Question,
  Di009QuestionSet,
  Di009TaskKind,
  Di009ValidationCheck,
} from "./types";

const OPTION_COUNT = 4 as const;
const QUESTIONS_PER_SET = 5 as const;

const ALL_TASK_KINDS: readonly Di009TaskKind[] = [
  "DIRECT_CLASS_FREQUENCY",
  "TOTAL_FREQUENCY",
  "COMBINED_RANGE_TOTAL",
  "ABOVE_BOUNDARY_TOTAL",
  "BELOW_BOUNDARY_TOTAL",
  "RANGE_RATIO",
  "CLASS_SHARE_OF_TOTAL",
  "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES",
  "MODAL_CLASS_IDENTIFICATION",
  "MEDIAN_CLASS_IDENTIFICATION",
  "KTH_OBSERVATION_CLASS",
  "APPROX_GROUPED_MEAN_FROM_HISTOGRAM",
  "APPROX_GROUPED_MODE_FROM_HISTOGRAM",
];

const TASK_DIFFICULTY: Readonly<Record<Di009TaskKind, Di009Difficulty>> = {
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
};

function applyDifficultyPolicy(draft: Di009Draft): Di009Draft {
  return { ...draft, difficulty: TASK_DIFFICULTY[draft.kind] };
}

function formatOrdinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function applyEditorialPolicy(draft: Di009Draft): Di009Draft {
  if (draft.kind !== "KTH_OBSERVATION_CLASS") return draft;
  const rank = Number(draft.evidence.rank);
  if (!Number.isSafeInteger(rank) || rank < 1) return draft;
  return { ...draft, stem: draft.stem.replaceAll(`${rank}th`, formatOrdinal(rank)) };
}

function hasCorrectKthLanguage(question: Di009Question): boolean {
  if (question.kind !== "KTH_OBSERVATION_CLASS") return true;
  const rank = Number(question.evidence.rank);
  if (!Number.isSafeInteger(rank) || rank < 1) return false;
  return question.stem.includes(formatOrdinal(rank)) || question.stem.includes(`observation number ${rank}`);
}

function numericRescueCandidates(answer: string): Di009Candidate[] {
  if (/^-?\d+(?:\.\d+)?%$/.test(answer)) {
    const value = Number(answer.slice(0, -1));
    return [-10, -5, 5, 10]
      .map((shift) => value + shift)
      .filter((candidate) => candidate > 0 && candidate < 100)
      .map((candidate, index) => ({
        text: `${Number(candidate.toFixed(2))}%`,
        misconceptionId: `NEARBY_PERCENTAGE_POINT_${index}`,
        derivation: "Uses a nearby percentage caused by a small numerator or denominator reading error.",
      }));
  }
  if (/^-?\d+(?:\.\d+)?$/.test(answer)) {
    const value = Number(answer);
    const step = Number.isInteger(value) ? 5 : 1;
    return [-2, -1, 1, 2, 3]
      .map((shift) => value + shift * step)
      .filter((candidate) => candidate > 0)
      .map((candidate, index) => ({
        text: Number(candidate.toFixed(2)).toString(),
        misconceptionId: `NEARBY_ARITHMETIC_${index}`,
        derivation: "Represents a nearby result from a small histogram reading or arithmetic error.",
      }));
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
  if (retained.length < OPTION_COUNT) {
    throw new Error(`DI-009 ${seed} constructed only ${retained.length} unique options for answer ${answer}.`);
  }
  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, OPTION_COUNT));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-009 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function chooseQuestionMix(seed: string, drafts: readonly Di009Draft[]): Di009Draft[] {
  const byDifficulty = (difficulty: Di009Difficulty) => drafts.filter((draft) => draft.difficulty === difficulty);
  const easy = shuffle(seededRandom(`${seed}:mix:easy`), byDifficulty("Easy"));
  const medium = shuffle(seededRandom(`${seed}:mix:medium`), byDifficulty("Medium"));
  const hard = shuffle(seededRandom(`${seed}:mix:hard`), byDifficulty("Hard"));
  if (easy.length < 1 || medium.length < 2 || hard.length < 2) {
    throw new Error("DI-009 V2 could not satisfy the 1 Easy + 2 Medium + 2 Hard set contract.");
  }
  return shuffle(seededRandom(`${seed}:mix:order`), [easy[0]!, medium[0]!, medium[1]!, hard[0]!, hard[1]!]);
}

function hasDecimalLearnerSurface(question: Di009Question) {
  const table = question.explanation.workingTable;
  const text = [
    question.stem,
    ...question.options,
    question.answer,
    question.explanation.keyIdea,
    ...question.explanation.steps,
    ...(table?.headers ?? []),
    ...(table?.rows.flat() ?? []),
  ].join(" ");
  return /\d+\.\d+/u.test(text);
}

function validateSet(set: Omit<Di009QuestionSet, "validation">) {
  const checks: Di009ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const bins = set.stimulus.bins;

  add("HISTOGRAM_KIND", set.stimulus.kind === "HISTOGRAM", "DI-009 must expose genuine histogram semantics.");
  add("SEMANTIC_STIMULUS_ONLY", !("svg" in set.stimulus), "DI-009 stimulus must not embed presentation markup.");
  add("VARIABLE_CLASS_COUNT", bins.length >= 5 && bins.length <= 9, "DI-009 V2 requires 5–9 continuous class intervals.");
  add("CONTIGUOUS_CLASSES", bins.every((bin, index) => index === 0 || bins[index - 1]!.upper === bin.lower), "Histogram classes must be contiguous.");
  add("EQUAL_CLASS_WIDTH", bins.every((bin) => bin.upper - bin.lower === set.stimulus.classWidth), "DI-009 V2 currently requires equal class widths.");
  add("POSITIVE_FREQUENCIES", bins.every((bin) => Number.isSafeInteger(bin.frequency) && bin.frequency > 0), "All histogram frequencies must be positive integers.");
  add("FIVE_QUESTION_MIX", set.questions.length === QUESTIONS_PER_SET, "Each histogram set must contain exactly five questions.");
  add("NO_REPEATED_TASK", new Set(set.questions.map((question) => question.kind)).size === set.questions.length, "A set must not repeat the same task family.");
  add("KNOWN_TASKS", set.questions.every((question) => ALL_TASK_KINDS.includes(question.kind)), "Every question must belong to the DI-009 V2 contract library.");
  add("DIFFICULTY_POLICY", set.questions.every((question) => question.difficulty === TASK_DIFFICULTY[question.kind]), "Every task family must use the calibrated DI-009 V2 difficulty policy.");
  add("ORDINAL_LANGUAGE", set.questions.every(hasCorrectKthLanguage), "Kth-observation stems must use a grammatically correct ordinal or the neutral observation-number surface.");
  add("DIFFICULTY_MIX", set.questions.filter((question) => question.difficulty === "Easy").length === 1 && set.questions.filter((question) => question.difficulty === "Medium").length === 2 && set.questions.filter((question) => question.difficulty === "Hard").length === 2, "Each set must contain 1 Easy, 2 Medium and 2 Hard questions.");
  add("FOUR_UNIQUE_OPTIONS", set.questions.every((question) => question.options.length === 4 && new Set(question.options).size === 4), "Every question must expose four unique options.");
  add("ANSWER_INDEX_VALID", set.questions.every((question) => question.options[question.correctIndex] === question.answer), "Correct-index metadata must point to the exact answer.");
  add("NO_DECIMAL_LEARNER_SURFACE", set.questions.every((question) => !hasDecimalLearnerSurface(question)), "DI-009 learner-facing questions, options and explanations must use integer values only.");
  add("MISCONCEPTION_OWNED_DISTRACTORS", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId !== "CORRECT").every((option) => option.misconceptionId.length > 3 && option.derivation.length > 12)), "Every distractor must carry a misconception id and derivation.");
  add("EXPLANATION_PRESENT", set.questions.every((question) => question.explanation.keyIdea.length > 10 && question.explanation.steps.length >= 1), "Every question needs a concise question-specific explanation.");
  add("WORKING_TABLE_SHAPE", set.questions.every((question) => !question.explanation.workingTable || question.explanation.workingTable.rows.every((row) => row.length === question.explanation.workingTable!.headers.length)), "Explanation working tables must be rectangular.");
  add("REVIEW_ONLY", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.mockTestEligible && !set.traceability.publiclyPublishable && !set.traceability.automaticStudentPublication, "DI-009 must remain fully review-only before explicit approval.");

  return { valid: checks.every((check) => check.passed), checks } as const;
}

export function generateDi009HistogramSet(input: {
  seed: string;
  examProfile: Di009ExamProfile;
}): Di009QuestionSet {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-009 requires a non-empty deterministic seed.");
  const stimulus = buildDi009Stimulus(seed, input.examProfile);
  const drafts = buildDi009Drafts(seed, stimulus).map(applyDifficultyPolicy).map(applyEditorialPolicy);
  const selected = chooseQuestionMix(seed, drafts);
  const setId = `DI-009-${input.examProfile}-${hashSeed(`${seed}:${input.examProfile}`).toString(16).padStart(8, "0")}`;

  const questions: Di009Question[] = selected.map((draft, index) => {
    const questionSeed = `${seed}:${input.examProfile}:${draft.kind}:${index}`;
    const built = buildOptions(questionSeed, draft.answer, draft.candidates);
    return {
      questionId: `${setId}-Q${index + 1}-${draft.kind}`,
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
  });

  const base = {
    packageId: "DI-009" as const,
    setId,
    seed,
    language: "en" as const,
    examProfile: input.examProfile,
    optionCount: OPTION_COUNT,
    setDifficulty: "HISTOGRAM_MIXED" as const,
    stimulus,
    questions,
    traceability: {
      packageId: "DI-009" as const,
      representation: "HISTOGRAM" as const,
      groupedBarSibling: "DI-003" as const,
      statisticsSibling: "STAT-003" as const,
      frequencyPolygonSibling: "DI-010_PLANNED" as const,
      presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS" as const,
      questionLogicVersion: "DI-009-QUESTION-LOGIC-V2" as const,
      setContractVersion: "DI-009-SET-CONTRACT-V3" as const,
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL" as const,
      reviewStatus: "UNREVIEWED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    },
  };
  const validation = validateSet(base);
  if (!validation.valid) {
    throw new Error(`DI-009 V2 validation failed: ${validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ")}`);
  }
  return { ...base, validation };
}
