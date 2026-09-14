import { hashSeed, seededRandom, shuffle } from "../DI-001/exact";
import { buildDi010Stimulus } from "./frequency-polygon-state";
import { buildDi010Drafts, type Di010Candidate, type Di010Draft } from "./task-builders";
import type { Di010Difficulty, Di010ExamProfile, Di010Option, Di010Question, Di010QuestionSet, Di010TaskKind, Di010ValidationCheck } from "./types";

const OPTION_COUNT = 4 as const;
const QUESTIONS_PER_SET = 5 as const;

export const DI010_TASK_KINDS: readonly Di010TaskKind[] = [
  "GRAPH_TYPE_IDENTIFICATION",
  "CLASS_MARK_FROM_INTERVAL",
  "POINT_COORDINATE_FOR_CLASS",
  "READ_FREQUENCY_AT_CLASS_MARK",
  "ZERO_CLOSING_ENDPOINTS",
  "TOTAL_FREQUENCY_FROM_POLYGON",
  "MODAL_CLASS_FROM_POLYGON",
  "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES",
  "COMBINED_RANGE_TOTAL_FROM_POLYGON",
];

export const DI010_DIFFICULTY_BY_TASK: Readonly<Record<Di010TaskKind, Di010Difficulty>> = {
  GRAPH_TYPE_IDENTIFICATION: "Easy",
  CLASS_MARK_FROM_INTERVAL: "Easy",
  POINT_COORDINATE_FOR_CLASS: "Medium",
  READ_FREQUENCY_AT_CLASS_MARK: "Easy",
  ZERO_CLOSING_ENDPOINTS: "Hard",
  TOTAL_FREQUENCY_FROM_POLYGON: "Medium",
  MODAL_CLASS_FROM_POLYGON: "Easy",
  FREQUENCY_DIFFERENCE_BETWEEN_CLASSES: "Medium",
  COMBINED_RANGE_TOTAL_FROM_POLYGON: "Hard",
};

function numericRescue(answer: string): Di010Candidate[] {
  if (!/^-?\d+(?:\.\d+)?$/.test(answer)) return [];
  const value = Number(answer);
  const step = Number.isInteger(value) ? 5 : 1;
  return [-2, -1, 1, 2, 3]
    .map((shift) => value + shift * step)
    .filter((candidate) => candidate > 0)
    .map((candidate, index) => ({ text: String(Number(candidate.toFixed(2))), misconceptionId: `NEARBY_NUMERIC_${index}`, derivation: "Represents a nearby result from a small reading or arithmetic error." }));
}

function intervalRescue(answer: string): Di010Candidate[] {
  const match = answer.match(/^(-?\d+(?:\.\d+)?)–(-?\d+(?:\.\d+)?)$/);
  if (!match) return [];
  const lower = Number(match[1]);
  const upper = Number(match[2]);
  const width = upper - lower;
  if (!(width > 0)) return [];
  return [-2, -1, 1, 2]
    .map((shift) => ({ lower: lower + shift * width, upper: upper + shift * width }))
    .map((item, index) => ({ text: `${Number(item.lower.toFixed(2))}–${Number(item.upper.toFixed(2))}`, misconceptionId: `NEARBY_CLASS_RESCUE_${index}`, derivation: "Chooses a nearby class interval instead of the class represented by the required polygon point." }));
}

function buildOptions(seed: string, answer: string, candidates: readonly Di010Candidate[]) {
  const retained: Di010Option[] = [];
  const seen = new Set<string>();
  const add = (candidate: Di010Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the DI-010 semantic frequency-polygon state." });
  candidates.forEach(add);
  numericRescue(answer).forEach(add);
  intervalRescue(answer).forEach(add);
  if (retained.length < OPTION_COUNT) throw new Error(`DI-010 ${seed} constructed only ${retained.length} unique options for '${answer}'.`);
  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, OPTION_COUNT));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-010 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function chooseQuestionMix(seed: string, drafts: readonly Di010Draft[]) {
  const byDifficulty = (difficulty: Di010Difficulty) => drafts.filter((draft) => draft.difficulty === difficulty);
  const easy = shuffle(seededRandom(`${seed}:mix:easy`), byDifficulty("Easy"));
  const medium = shuffle(seededRandom(`${seed}:mix:medium`), byDifficulty("Medium"));
  const hard = shuffle(seededRandom(`${seed}:mix:hard`), byDifficulty("Hard"));
  if (easy.length < 1 || medium.length < 2 || hard.length < 2) throw new Error("DI-010 cannot satisfy the 1 Easy + 2 Medium + 2 Hard set contract.");
  return shuffle(seededRandom(`${seed}:mix:order`), [easy[0]!, medium[0]!, medium[1]!, hard[0]!, hard[1]!]);
}

function validateSet(set: Omit<Di010QuestionSet, "validation">) {
  const checks: Di010ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  const classes = set.stimulus.classes;
  add("FREQUENCY_POLYGON_KIND", set.stimulus.kind === "FREQUENCY_POLYGON", "DI-010 must expose frequency-polygon semantics.");
  add("SEMANTIC_STIMULUS_ONLY", !("svg" in set.stimulus), "DI-010 stimulus must not embed presentation markup.");
  add("VARIABLE_CLASS_COUNT", classes.length >= 5 && classes.length <= 8, "DI-010 requires 5–8 continuous classes.");
  add("CONTIGUOUS_CLASSES", classes.every((item, index) => index === 0 || classes[index - 1]!.upper === item.lower), "Frequency-polygon source classes must be contiguous.");
  add("EQUAL_CLASS_WIDTH", classes.every((item) => item.upper - item.lower === set.stimulus.classWidth), "DI-010 currently requires equal class widths.");
  add("CLASS_MARKS_CORRECT", classes.every((item) => item.classMark === (item.lower + item.upper) / 2), "Every plotted x-value must be the class midpoint.");
  add("POSITIVE_FREQUENCIES", classes.every((item) => Number.isSafeInteger(item.frequency) && item.frequency > 0), "All source frequencies must be positive integers.");
  add("FIVE_QUESTION_MIX", set.questions.length === QUESTIONS_PER_SET, "Each DI-010 set must contain exactly five questions.");
  add("NO_REPEATED_TASK", new Set(set.questions.map((question) => question.kind)).size === set.questions.length, "A set must not repeat a task family.");
  add("KNOWN_TASKS", set.questions.every((question) => DI010_TASK_KINDS.includes(question.kind)), "Every question must belong to the DI-010 task library.");
  add("DIFFICULTY_POLICY", set.questions.every((question) => question.difficulty === DI010_DIFFICULTY_BY_TASK[question.kind]), "Every task family must use the DI-010 difficulty policy.");
  add("DIFFICULTY_MIX", set.questions.filter((question) => question.difficulty === "Easy").length === 1 && set.questions.filter((question) => question.difficulty === "Medium").length === 2 && set.questions.filter((question) => question.difficulty === "Hard").length === 2, "Each set must contain 1 Easy, 2 Medium and 2 Hard questions.");
  add("FOUR_UNIQUE_OPTIONS", set.questions.every((question) => question.options.length === 4 && new Set(question.options).size === 4), "Every question must expose four unique options.");
  add("ANSWER_INDEX_VALID", set.questions.every((question) => question.options[question.correctIndex] === question.answer), "Correct-index metadata must point to the exact answer.");
  add("MISCONCEPTION_OWNED_DISTRACTORS", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId !== "CORRECT").every((option) => option.misconceptionId.length > 3 && option.derivation.length > 12)), "Every distractor must carry misconception ownership.");
  add("EXPLANATION_PRESENT", set.questions.every((question) => question.explanation.keyIdea.length > 15 && question.explanation.steps.length >= 1), "Every question needs a beginner-readable explanation.");
  add("REVIEW_ONLY", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && !set.traceability.questionBankWritable && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.testEligible && !set.traceability.mockTestEligible && !set.traceability.publiclyPublishable && !set.traceability.automaticStudentPublication && !set.traceability.productionReleaseAuthorized, "DI-010 P0 must remain fully review-only.");
  return { valid: checks.every((check) => check.passed), checks } as const;
}

export function generateDi010FrequencyPolygonSet(input: { seed: string; examProfile: Di010ExamProfile }): Di010QuestionSet {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-010 requires a non-empty deterministic seed.");
  const stimulus = buildDi010Stimulus(seed, input.examProfile);
  const drafts = buildDi010Drafts(seed, stimulus);
  const selected = chooseQuestionMix(seed, drafts);
  const setId = `DI-010-${input.examProfile}-${hashSeed(`${seed}:${input.examProfile}`).toString(16).padStart(8, "0")}`;
  const questions: Di010Question[] = selected.map((draft, index) => {
    const built = buildOptions(`${seed}:${input.examProfile}:${draft.kind}:${index}`, draft.answer, draft.candidates);
    return { questionId: `${setId}-Q${index + 1}-${draft.kind}`, setId, kind: draft.kind, difficulty: draft.difficulty, stem: draft.stem, options: built.options, optionMetadata: built.optionMetadata, correctIndex: built.correctIndex, answer: draft.answer, explanation: draft.explanation, evidence: draft.evidence };
  });
  const base = {
    packageId: "DI-010" as const,
    setId,
    seed,
    language: "en" as const,
    examProfile: input.examProfile,
    optionCount: OPTION_COUNT,
    setDifficulty: "FREQUENCY_POLYGON_MIXED" as const,
    stimulus,
    questions,
    traceability: {
      packageId: "DI-010" as const,
      representation: "FREQUENCY_POLYGON" as const,
      histogramSibling: "DI-009" as const,
      statisticsSibling: "STAT-003" as const,
      presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS" as const,
      questionLogicVersion: "DI-010-QUESTION-LOGIC-P0" as const,
      setContractVersion: "DI-010-SET-CONTRACT-P0" as const,
      arithmeticAuthority: "EXACT_INTEGER_MIDPOINT" as const,
      reviewStatus: "UNREVIEWED" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };
  const validation = validateSet(base);
  if (!validation.valid) throw new Error(`DI-010 P0 validation failed: ${validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ")}`);
  return { ...base, validation };
}
