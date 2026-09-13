import { hashSeed, pick, seededRandom, shuffle } from "../shared/exact";
import type {
  Stat002ContractId,
  Stat002Difficulty,
  Stat002ExamProfile,
  Stat002Explanation,
  Stat002Option,
  Stat002Question,
  Stat002SolveMode,
  Stat002State,
  Stat002ValidationCheck,
} from "./types";

export const STAT002_CONTRACTS: readonly Stat002ContractId[] = [
  "STAT-002-TEMP-001-RAW-SD",
  "STAT-002-TEMP-002-MEAN-SQUARES-SD",
  "STAT-002-TEMP-003-TRANSLATION-INVARIANCE",
  "STAT-002-TEMP-004-SCALE-TRANSFORMATION",
  "STAT-002-TEMP-005-REVERSE-SCALE",
  "STAT-002-TEMP-006-AFFINE-FROM-MOMENTS",
] as const;

const EXACT_SD_TEMPLATES = [
  { deviations: [-3, -1, 0, 1, 3] as const, baseSd: 2 },
  { deviations: [-3, -2, 0, 1, 1, 3] as const, baseSd: 2 },
  { deviations: [-4, -4, 0, 2, 3, 3] as const, baseSd: 3 },
  { deviations: [-3, -2, -1, 0, 1, 2, 3] as const, baseSd: 2 },
] as const;

const CONTRACT_META: Record<Stat002ContractId, { solveMode: Stat002SolveMode; difficulty: Stat002Difficulty }> = {
  "STAT-002-TEMP-001-RAW-SD": { solveMode: "DIRECT_POPULATION_SD", difficulty: "Easy" },
  "STAT-002-TEMP-002-MEAN-SQUARES-SD": { solveMode: "SD_FROM_MEAN_AND_MEAN_SQUARES", difficulty: "Medium" },
  "STAT-002-TEMP-003-TRANSLATION-INVARIANCE": { solveMode: "TRANSLATION_INVARIANCE", difficulty: "Easy" },
  "STAT-002-TEMP-004-SCALE-TRANSFORMATION": { solveMode: "SCALE_STANDARD_DEVIATION", difficulty: "Medium" },
  "STAT-002-TEMP-005-REVERSE-SCALE": { solveMode: "INFER_SCALE_FROM_STANDARD_DEVIATION", difficulty: "Medium" },
  "STAT-002-TEMP-006-AFFINE-FROM-MOMENTS": { solveMode: "AFFINE_SD_FROM_MOMENTS", difficulty: "Hard" },
};

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
type Draft = Readonly<{
  state: Stat002State;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Stat002Explanation;
}>;

type ExactData = Readonly<{
  values: readonly number[];
  mean: number;
  standardDeviation: number;
}>;

function sum(values: readonly number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function mean(values: readonly number[]) {
  const total = sum(values);
  if (total % values.length !== 0) throw new Error("STAT-002 exact data requires an integral mean.");
  return total / values.length;
}

function exactPopulationVariance(values: readonly number[]) {
  const m = mean(values);
  const squaredDeviationTotal = values.reduce((total, value) => total + (value - m) ** 2, 0);
  if (squaredDeviationTotal % values.length !== 0) {
    throw new Error("STAT-002 exact data requires an integral population variance.");
  }
  return squaredDeviationTotal / values.length;
}

function exactPopulationSd(values: readonly number[]) {
  const variance = exactPopulationVariance(values);
  const root = Math.sqrt(variance);
  if (!Number.isInteger(root)) throw new Error("STAT-002 generated variance is not a perfect square.");
  return root;
}

function list(values: readonly number[]) {
  return values.join(", ");
}

function surface(seed: string): 0 | 1 | 2 {
  return (hashSeed(`${seed}:surface`) % 3) as 0 | 1 | 2;
}

function affineExpression(multiplier: number, additiveConstant: number) {
  if (additiveConstant === 0) return `${multiplier}x`;
  return additiveConstant > 0
    ? `${multiplier}x + ${additiveConstant}`
    : `${multiplier}x - ${Math.abs(additiveConstant)}`;
}

function generateExactData(seed: string, profile: Stat002ExamProfile): ExactData {
  const random = seededRandom(`${seed}:${profile}:exact-data`);
  const pool = profile === "SSC_CGL_JSO" ? EXACT_SD_TEMPLATES.slice(1) : EXACT_SD_TEMPLATES;
  const template = pick(random, pool);
  const scale = pick(random, profile === "SSC_CGL_JSO" ? [1, 2, 3, 4] : [1, 2, 3]);
  const minimumCenter = Math.abs(Math.min(...template.deviations)) * scale + 12;
  const center = pick(random, [minimumCenter + 8, minimumCenter + 18, minimumCenter + 28, minimumCenter + 38]);
  const values = shuffle(
    seededRandom(`${seed}:${profile}:visible-order`),
    template.deviations.map((deviation) => center + deviation * scale),
  );
  const standardDeviation = template.baseSd * scale;
  if (mean(values) !== center || exactPopulationSd(values) !== standardDeviation) {
    throw new Error("STAT-002 exact-data construction lost its certified mean/SD invariant.");
  }
  return { values, mean: center, standardDeviation };
}

function buildOptions(seed: string, answer: string, candidates: readonly Candidate[]) {
  const retained: Stat002Option[] = [];
  const seen = new Set<string>();
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };
  add({ text: answer, misconceptionId: "CORRECT", derivation: "Independent recomputation from the displayed STAT-002 mathematical state." });
  candidates.forEach(add);
  if (retained.length < 4) throw new Error(`STAT-002 constructed only ${retained.length} unique options.`);
  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, 4));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("STAT-002 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildRawSd(seed: string, profile: Stat002ExamProfile): Draft {
  const data = generateExactData(`${seed}:raw`, profile);
  const variance = data.standardDeviation ** 2;
  const squaredDeviationTotal = variance * data.values.length;
  const s = surface(`${seed}:raw`);
  const stems = [
    `Find the standard deviation of the observations ${list(data.values)}.`,
    `The values are ${list(data.values)}. What is their standard deviation?`,
    `Calculate the standard deviation of the data set ${list(data.values)}.`,
  ] as const;
  return {
    state: { kind: "RAW_POPULATION_SD", values: data.values },
    stem: stems[s],
    answer: String(data.standardDeviation),
    candidates: [
      { text: String(variance), misconceptionId: "REPORT_VARIANCE", derivation: "Stops after finding the variance and does not take its square root." },
      { text: String(data.standardDeviation * 2), misconceptionId: "DOUBLE_STANDARD_DEVIATION", derivation: "Doubles the correctly obtained standard deviation before reporting the answer." },
      { text: String(data.standardDeviation + 1), misconceptionId: "ADD_ONE_AFTER_ROOT", derivation: "Adds one after obtaining the square root of the variance." },
      { text: String(Math.max(1, data.standardDeviation - 1)), misconceptionId: "SUBTRACT_ONE_AFTER_ROOT", derivation: "Subtracts one after obtaining the square root of the variance." },
      { text: String(data.values.length), misconceptionId: "REPORT_OBSERVATION_COUNT", derivation: "Reports the number of observations instead of measuring their spread." },
    ],
    explanation: {
      keyIdea: "For these observations, use the population standard deviation: find the mean, average the squared deviations from the mean, and then take the square root.",
      steps: [
        `Mean = ${sum(data.values)} ÷ ${data.values.length} = ${data.mean}.`,
        `Sum of squared deviations from ${data.mean} = ${squaredDeviationTotal}, so variance = ${squaredDeviationTotal} ÷ ${data.values.length} = ${variance}.`,
        `Standard deviation = √${variance} = ${data.standardDeviation}.`,
      ],
    },
  };
}

function buildMeanSquares(seed: string, profile: Stat002ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:mean-squares`);
  const m = pick(random, profile === "SSC_CGL_JSO" ? [12, 18, 24, 30, 36] : [8, 12, 16, 20, 24]);
  const sd = pick(random, profile === "SSC_CGL_JSO" ? [2, 3, 4, 5, 6] : [2, 3, 4, 5]);
  const variance = sd ** 2;
  const meanOfSquares = m ** 2 + variance;
  const s = surface(`${seed}:mean-squares`);
  const stems = [
    `The mean of a set of observations is ${m}, and the mean of their squares is ${meanOfSquares}. Find the standard deviation.`,
    `For a data set, mean = ${m} and mean of squares = ${meanOfSquares}. What is its standard deviation?`,
    `If x̄ = ${m} and the mean of x² is ${meanOfSquares}, determine the standard deviation of the observations.`,
  ] as const;
  return {
    state: { kind: "MEAN_AND_MEAN_SQUARES", mean: m, meanOfSquares },
    stem: stems[s],
    answer: String(sd),
    candidates: [
      { text: String(variance), misconceptionId: "REPORT_VARIANCE", derivation: `Computes ${meanOfSquares} - ${m}² = ${variance} but reports the variance instead of its square root.` },
      { text: String(meanOfSquares - m), misconceptionId: "SUBTRACT_MEAN_NOT_MEAN_SQUARE", derivation: "Subtracts the mean instead of the square of the mean from the mean of squares." },
      { text: String(m), misconceptionId: "REPORT_MEAN", derivation: "Reports the arithmetic mean rather than the standard deviation." },
      { text: String(sd + 1), misconceptionId: "ADD_ONE_AFTER_ROOT", derivation: "Adds one after taking the correct square root." },
      { text: String(sd * 2), misconceptionId: "DOUBLE_ROOT", derivation: "Doubles the correct square root before reporting the standard deviation." },
    ],
    explanation: {
      keyIdea: "Use variance = mean of squares − (mean)², then take the square root to obtain the standard deviation.",
      steps: [
        `Variance = ${meanOfSquares} - (${m})² = ${meanOfSquares} - ${m ** 2} = ${variance}.`,
        `Standard deviation = √${variance} = ${sd}.`,
      ],
    },
  };
}

function buildTranslation(seed: string, profile: Stat002ExamProfile): Draft {
  const data = generateExactData(`${seed}:translation`, profile);
  const random = seededRandom(`${seed}:${profile}:translation-constant`);
  const constant = pick(random, [5, 7, 9, 11, 13, 15]);
  const s = surface(`${seed}:translation`);
  const stems = [
    `The standard deviation of the observations ${list(data.values)} is ${data.standardDeviation}. If ${constant} is added to every observation, what will be the new standard deviation?`,
    `A data set has standard deviation ${data.standardDeviation}. Every value is increased by ${constant}. Find the standard deviation of the new data set.`,
    `Each observation in ${list(data.values)} is replaced by x + ${constant}. If the original standard deviation is ${data.standardDeviation}, determine the new standard deviation.`,
  ] as const;
  return {
    state: { kind: "TRANSLATED_DATA", values: data.values, additiveConstant: constant },
    stem: stems[s],
    answer: String(data.standardDeviation),
    candidates: [
      { text: String(data.standardDeviation + constant), misconceptionId: "ADD_CONSTANT_TO_SD", derivation: "Adds the common translation constant directly to the standard deviation." },
      { text: String(constant), misconceptionId: "REPORT_TRANSLATION_CONSTANT", derivation: "Reports the amount added to each observation instead of the spread of the transformed data." },
      { text: String(data.standardDeviation * constant), misconceptionId: "TREAT_TRANSLATION_AS_SCALING", derivation: "Treats adding a constant as if every observation had been multiplied by that constant." },
      { text: String(Math.abs(constant - data.standardDeviation)), misconceptionId: "SUBTRACT_CONSTANT_FROM_SD", derivation: "Subtracts the translation constant from the original standard deviation." },
    ],
    explanation: {
      keyIdea: "Adding the same constant to every observation shifts the whole data set but does not change any deviation from the mean, so the standard deviation stays unchanged.",
      steps: [
        `Every observation and the mean increase by the same amount, ${constant}.`,
        "Therefore each value's deviation from the mean remains exactly the same.",
        `So the new standard deviation remains ${data.standardDeviation}.`,
      ],
    },
  };
}

function buildScale(seed: string, profile: Stat002ExamProfile): Draft {
  const data = generateExactData(`${seed}:scale`, profile);
  const random = seededRandom(`${seed}:${profile}:multiplier`);
  const multiplier = pick(random, profile === "SSC_CGL_JSO" ? [2, 3, 4, 5] : [2, 3, 4]);
  const answer = data.standardDeviation * multiplier;
  const s = surface(`${seed}:scale`);
  const stems = [
    `A data set has standard deviation ${data.standardDeviation}. If every observation is multiplied by ${multiplier}, what is the standard deviation of the new data set?`,
    `The standard deviation of ${list(data.values)} is ${data.standardDeviation}. Each value is replaced by ${multiplier}x. Find the new standard deviation.`,
    `Every observation of a data set with standard deviation ${data.standardDeviation} is multiplied by ${multiplier}. Determine the resulting standard deviation.`,
  ] as const;
  return {
    state: { kind: "SCALED_DATA", values: data.values, multiplier },
    stem: stems[s],
    answer: String(answer),
    candidates: [
      { text: String(data.standardDeviation), misconceptionId: "KEEP_SD_UNCHANGED", derivation: "Incorrectly applies translation invariance to multiplication and keeps the spread unchanged." },
      { text: String(data.standardDeviation * multiplier ** 2), misconceptionId: "SCALE_SD_BY_SQUARE", derivation: "Uses the variance scaling factor on the standard deviation, multiplying by the square of the constant." },
      { text: String(data.standardDeviation + multiplier), misconceptionId: "ADD_MULTIPLIER_TO_SD", derivation: "Adds the multiplier to the standard deviation instead of multiplying by its absolute value." },
      { text: String(answer + data.standardDeviation), misconceptionId: "ADD_EXTRA_ORIGINAL_SD", derivation: "Scales the standard deviation correctly and then adds the original standard deviation once more." },
      { text: String(multiplier), misconceptionId: "REPORT_MULTIPLIER", derivation: "Reports only the transformation factor rather than the transformed spread." },
    ],
    explanation: {
      keyIdea: "When every observation is multiplied by a constant k, every deviation from the mean is multiplied by k, so the standard deviation is multiplied by |k|.",
      steps: [
        `Original standard deviation = ${data.standardDeviation}.`,
        `New standard deviation = ${multiplier} × ${data.standardDeviation} = ${answer}.`,
      ],
    },
  };
}

function buildReverseScale(seed: string, profile: Stat002ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:reverse-scale`);
  const originalStandardDeviation = pick(random, profile === "SSC_CGL_JSO" ? [3, 4, 5, 6, 8] : [2, 3, 4, 5, 6]);
  const multiplier = pick(random, profile === "SSC_CGL_JSO" ? [2, 3, 4, 5] : [2, 3, 4]);
  const transformedStandardDeviation = originalStandardDeviation * multiplier;
  const s = surface(`${seed}:reverse-scale`);
  const stems = [
    `The standard deviation of a data set is ${originalStandardDeviation}. After every observation is multiplied by the same positive number, the standard deviation becomes ${transformedStandardDeviation}. Find the multiplier.`,
    `Multiplying every value in a data set by k changes its standard deviation from ${originalStandardDeviation} to ${transformedStandardDeviation}. Find k.`,
    `A common positive scale factor changes the standard deviation of a set from ${originalStandardDeviation} to ${transformedStandardDeviation}. What is the scale factor?`,
  ] as const;
  return {
    state: { kind: "REVERSE_SCALE", originalStandardDeviation, transformedStandardDeviation },
    stem: stems[s],
    answer: String(multiplier),
    candidates: [
      { text: String(multiplier ** 2), misconceptionId: "USE_VARIANCE_SCALE_FACTOR", derivation: "Squares the required standard-deviation scale factor as though the question asked for the variance factor." },
      { text: String(multiplier + 1), misconceptionId: "ADD_ONE_TO_RATIO", derivation: "Finds the scale ratio and then incorrectly increases it by one." },
      { text: String(Math.max(1, multiplier - 1)), misconceptionId: "SUBTRACT_ONE_FROM_RATIO", derivation: "Finds the scale ratio and then incorrectly decreases it by one." },
      { text: String(transformedStandardDeviation - originalStandardDeviation), misconceptionId: "USE_DIFFERENCE_NOT_RATIO", derivation: "Uses the difference between the two standard deviations instead of their ratio." },
      { text: String(originalStandardDeviation), misconceptionId: "REPORT_ORIGINAL_SD", derivation: "Reports the original standard deviation instead of the multiplier." },
    ],
    explanation: {
      keyIdea: "A positive multiplication factor changes standard deviation by the same factor, so divide the new standard deviation by the old standard deviation.",
      steps: [
        `k = ${transformedStandardDeviation} ÷ ${originalStandardDeviation}.`,
        `Therefore k = ${multiplier}.`,
      ],
    },
  };
}

function buildAffineFromMoments(seed: string, profile: Stat002ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:affine-from-moments`);
  const m = pick(random, profile === "SSC_CGL_JSO" ? [14, 18, 22, 28, 34] : [10, 14, 18, 22, 26]);
  const sd = pick(random, profile === "SSC_CGL_JSO" ? [3, 4, 5, 6] : [2, 3, 4, 5]);
  const variance = sd ** 2;
  const meanOfSquares = m ** 2 + variance;
  const multiplier = pick(random, profile === "SSC_CGL_JSO" ? [2, 3, 4, 5] : [2, 3, 4]);
  const additiveConstant = pick(random, [-13, -9, -5, 7, 11, 15]);
  const answer = sd * multiplier;
  const transform = affineExpression(multiplier, additiveConstant);
  const s = surface(`${seed}:affine-from-moments`);
  const stems = [
    `For a data set, x̄ = ${m} and the mean of x² is ${meanOfSquares}. If y = ${transform}, find the standard deviation of y.`,
    `The mean of x is ${m} and the mean of x² is ${meanOfSquares}. Each observation is transformed by y = ${transform}. Determine the standard deviation of the transformed data.`,
    `A variable x has mean ${m} and mean of squares ${meanOfSquares}. Under the transformation y = ${transform}, what is the standard deviation of y?`,
  ] as const;
  return {
    state: { kind: "AFFINE_FROM_MOMENTS", mean: m, meanOfSquares, multiplier, additiveConstant },
    stem: stems[s],
    answer: String(answer),
    candidates: [
      { text: String(sd), misconceptionId: "IGNORE_MULTIPLIER", derivation: "Finds the original standard deviation correctly but ignores the multiplicative part of the transformation." },
      { text: String(variance), misconceptionId: "REPORT_ORIGINAL_VARIANCE", derivation: "Computes the original variance but reports it instead of transforming the standard deviation." },
      { text: String(multiplier * variance), misconceptionId: "SCALE_VARIANCE_LINEarly", derivation: "Multiplies the original variance by the scale factor and reports that value as the standard deviation." },
      { text: String(answer + Math.abs(additiveConstant)), misconceptionId: "ADD_SHIFT_TO_SD", derivation: "Scales the standard deviation but then incorrectly adds the translation constant to the spread." },
      { text: String(sd * multiplier ** 2), misconceptionId: "SQUARE_SCALE_ON_SD", derivation: "Uses the variance scale factor k² directly on the standard deviation." },
    ],
    explanation: {
      keyIdea: "First recover the standard deviation of x from its moments. In y = ax + b, the shift b does not affect spread, while the scale a multiplies the standard deviation by |a|.",
      steps: [
        `Variance of x = ${meanOfSquares} - (${m})² = ${meanOfSquares} - ${m ** 2} = ${variance}.`,
        `So SD(x) = √${variance} = ${sd}.`,
        `For y = ${transform}, the additive term does not change standard deviation; SD(y) = ${multiplier} × ${sd} = ${answer}.`,
      ],
    },
  };
}

function buildDraft(contractId: Stat002ContractId, seed: string, profile: Stat002ExamProfile): Draft {
  switch (contractId) {
    case "STAT-002-TEMP-001-RAW-SD": return buildRawSd(seed, profile);
    case "STAT-002-TEMP-002-MEAN-SQUARES-SD": return buildMeanSquares(seed, profile);
    case "STAT-002-TEMP-003-TRANSLATION-INVARIANCE": return buildTranslation(seed, profile);
    case "STAT-002-TEMP-004-SCALE-TRANSFORMATION": return buildScale(seed, profile);
    case "STAT-002-TEMP-005-REVERSE-SCALE": return buildReverseScale(seed, profile);
    case "STAT-002-TEMP-006-AFFINE-FROM-MOMENTS": return buildAffineFromMoments(seed, profile);
  }
}

function solveState(state: Stat002State): string {
  switch (state.kind) {
    case "RAW_POPULATION_SD": return String(exactPopulationSd(state.values));
    case "MEAN_AND_MEAN_SQUARES": {
      const variance = state.meanOfSquares - state.mean ** 2;
      const sd = Math.sqrt(variance);
      if (!Number.isInteger(sd)) throw new Error("STAT-002 mean-squares state does not have an exact integer SD.");
      return String(sd);
    }
    case "TRANSLATED_DATA": return String(exactPopulationSd(state.values.map((value) => value + state.additiveConstant)));
    case "SCALED_DATA": return String(exactPopulationSd(state.values.map((value) => value * state.multiplier)));
    case "REVERSE_SCALE": {
      if (state.transformedStandardDeviation % state.originalStandardDeviation !== 0) throw new Error("STAT-002 reverse-scale state is not integral.");
      return String(state.transformedStandardDeviation / state.originalStandardDeviation);
    }
    case "AFFINE_FROM_MOMENTS": {
      const variance = state.meanOfSquares - state.mean ** 2;
      const sd = Math.sqrt(variance);
      if (!Number.isInteger(sd)) throw new Error("STAT-002 affine state does not have an exact integer source SD.");
      return String(sd * Math.abs(state.multiplier));
    }
  }
}

function validateQuestion(question: Omit<Stat002Question, "validation">) {
  const checks: Stat002ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  add("FOUR_OPTIONS", question.options.length === 4, "SSC STAT-002 review questions require exactly four options.");
  add("UNIQUE_OPTIONS", new Set(question.options).size === 4, "Displayed options must be unique.");
  add("ONE_CORRECT", question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer, "Exactly one option must be bound to the exact answer.");
  add("STATE_RECOMPUTATION", solveState(question.state) === question.answer, "The answer must independently recompute from the stored mathematical state.");
  add("MISCONCEPTION_PROVENANCE", question.optionMetadata.every((option) => option.derivation.length >= 24), "Each option requires a meaningful derivation or misconception provenance.");
  add("EXPLANATION_SPECIFICITY", question.explanation.keyIdea.length >= 60 && question.explanation.steps.length >= 2, "Explanation must state the governing idea and show the relevant calculation in simple steps.");
  add("STEM_NATURALNESS", question.stem.length >= 40 && !/template|generator|question library|ql[- ]?id|mock[- ]?test problem/iu.test(question.stem), "Stem must be direct learner-facing exam prose without generator metadata.");
  add("POSITIVE_RAW_VALUES", question.state.kind !== "RAW_POPULATION_SD" || question.state.values.every((value) => value > 0), "Direct raw-data states must use positive learner-facing observations.");
  add("HARD_REQUIRES_COMPOUND_REASONING", question.difficulty !== "Hard" || question.contractId === "STAT-002-TEMP-006-AFFINE-FROM-MOMENTS", "Hard STAT-002 questions must use the compound moments-plus-affine contract.");
  add("LIFECYCLE_LOCK", !question.traceability.questionStudioDiscoverable && question.traceability.questionBankStatus === "NOT_STORED" && question.traceability.testEligibility === "INELIGIBLE" && !question.traceability.mockTestEligible && !question.traceability.publiclyPublishable && !question.traceability.automaticStudentPublication, "STAT-002 Phase 0 must remain review-only and undiscoverable.");
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateStat002Question(input: {
  seed?: string;
  examProfile?: Stat002ExamProfile;
  contractId?: Stat002ContractId;
} = {}): Stat002Question {
  const seed = input.seed ?? "STAT-002:P0";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_II";
  const contractId = input.contractId ?? pick(seededRandom(`${seed}:${examProfile}:contract`), STAT002_CONTRACTS);
  const draft = buildDraft(contractId, seed, examProfile);
  const optionPackage = buildOptions(`${seed}:${examProfile}:${contractId}`, draft.answer, draft.candidates);
  const meta = CONTRACT_META[contractId];
  const withoutValidation: Omit<Stat002Question, "validation"> = {
    packageId: "STAT-002",
    questionId: `STAT-002-${hashSeed(`${seed}:${examProfile}:${contractId}`).toString(36)}`,
    seed,
    examProfile,
    contractId,
    solveMode: meta.solveMode,
    difficulty: meta.difficulty,
    language: "en",
    stem: draft.stem,
    options: optionPackage.options,
    optionMetadata: optionPackage.optionMetadata,
    correctIndex: optionPackage.correctIndex,
    answer: draft.answer,
    state: draft.state,
    explanation: draft.explanation,
    traceability: {
      packageId: "STAT-002",
      topic: "Statistics",
      subtopic: "Standard Deviation",
      officialScope: "SSC_CGL_PAPER_I_STANDARD_DEVIATION_FOUNDATION",
      contractStatus: "TEMPORARY_REVIEW_CONTRACT",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
  const validation = validateQuestion(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error(`STAT-002 validation failed: ${failed}`);
  }
  return { ...withoutValidation, validation };
}
