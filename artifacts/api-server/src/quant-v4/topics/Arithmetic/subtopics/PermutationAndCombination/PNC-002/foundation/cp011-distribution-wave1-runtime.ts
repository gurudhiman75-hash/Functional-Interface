import questionLanguage from "../question-language.cp011-distribution-wave1.en.json";
import taskRegistry from "../task-registry.cp011-distribution-wave1.library.json";
import variableRanges from "../variable-ranges.cp011-distribution-wave1.library.json";
import explanationLibrary from "../explanation-by-ql.cp011-distribution-wave1.en.json";
import constraintProfiles from "../constraint-profiles.cp011-distribution-wave1.library.json";
import {
  bellNumberExact,
  countDistinctExactOccupanciesExact,
  countDistinctSpecifiedBoxExactExact,
  countDistinctSpecifiedBoxExactOthersNonEmptyExact,
  countDistinctToAtMostIdenticalBoxesExact,
  countDistinctToIdenticalBoxesExact,
  countDistinctToLabelledBoxesAtLeastOneEmptyExact,
  countDistinctToLabelledBoxesExactlyKNonEmptyExact,
  countDistinctToLabelledBoxesExact,
  countDistinctToLabelledBoxesNonEmptyExact,
  stirlingSecondKindExact,
} from "./cp011-discovery-distribution";
import {
  combinationExact,
  factorialExact,
  powerExact,
} from "./cp011-discovery-core";
import {
  enumerateLabelledAssignments,
  enumerateUnlabelledSetPartitions,
} from "./cp011-discovery-enumerators";
import { createSeededRandom, hashSeed, pickSeeded, shuffleSeeded } from "./math";

export type Cp011DistributionWave1Difficulty = "Easy" | "Medium" | "Hard";
export type Cp011DistributionWave1SolveMode =
  | "countDistinctObjectsToLabelledBoxes"
  | "countDistinctObjectsToNonEmptyLabelledBoxes"
  | "countDistinctObjectsUsingExactlyKLabelledBoxes"
  | "countDistinctObjectsWithAtLeastOneEmptyLabelledBox"
  | "countDistinctObjectsByExactOccupancyVector"
  | "countDistinctObjectsWithSpecifiedBoxOccupancy"
  | "countSpecifiedBoxOccupancyWithOtherBoxesNonEmpty"
  | "countDistinctObjectsToExactlyKIdenticalBoxes"
  | "countDistinctObjectsToAtMostKIdenticalBoxes"
  | "countAllUnlabelledSetPartitions";

type GeneratedValue = number | number[];
type QlEntry = { qlId: string; difficulty: Cp011DistributionWave1Difficulty; template: string };
type RegistryEntry = {
  qlIds: string[];
  solveMode: Cp011DistributionWave1SolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  constraintProfile: string;
  distractorProfile: string;
  difficulty: Cp011DistributionWave1Difficulty;
};
type ExplanationRecord = { lines: string[] };

export interface Cp011DistributionWave1Entry extends QlEntry {
  solveMode: Cp011DistributionWave1SolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  constraintProfile: string;
  distractorProfile: string;
}

export interface Cp011DistributionWave1Parameters {
  packageId: "PNC-002";
  canonicalProblemId: "PNC-CP-011";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficulty: Cp011DistributionWave1Difficulty;
  taskKind: "groupingDistribution";
  solveMode: Cp011DistributionWave1SolveMode;
  scenarioFamily: string;
  constraintProfile: string;
  distractorProfile: string;
  values: Record<string, GeneratedValue>;
  renderVariables: Record<string, string | number>;
}

export type Cp011DistributionWave1Operation =
  | "DISTINCT_TO_LABELLED_BOXES"
  | "DISTINCT_TO_NONEMPTY_LABELLED_BOXES"
  | "DISTINCT_TO_EXACTLY_K_LABELLED_BOXES"
  | "DISTINCT_TO_LABELLED_BOXES_AT_LEAST_ONE_EMPTY"
  | "DISTINCT_EXACT_OCCUPANCY_VECTOR"
  | "DISTINCT_SPECIFIED_BOX_EXACT"
  | "DISTINCT_SPECIFIED_BOX_EXACT_OTHERS_NONEMPTY"
  | "DISTINCT_TO_EXACTLY_K_IDENTICAL_BOXES"
  | "DISTINCT_TO_AT_MOST_K_IDENTICAL_BOXES"
  | "ALL_UNLABELLED_SET_PARTITIONS";

export interface Cp011DistributionWave1Evidence {
  operation: Cp011DistributionWave1Operation;
  objectCount: number;
  boxCount: number;
  receiverIdentity: "LABELLED" | "IDENTICAL";
  unrestrictedAssignmentCount?: number;
  nonEmptyAssignmentCount?: number;
  nonEmptyBoxCount?: number;
  maximumNonEmptyBoxes?: number;
  selectedReceiverSetCount?: number;
  ontoAssignmentCount?: number;
  stirlingCount?: number;
  stirlingTerms?: number[];
  occupancies?: number[];
  specifiedOccupancy?: number;
  remainingObjects?: number;
  remainingBoxes?: number;
  specifiedObjectSelectionCount?: number;
  remainingAssignmentCount?: number;
}

export interface Cp011DistributionWave1SolverResult {
  exactAnswer: string;
  answer: string;
  numericAnswer: number;
  equation: string;
  mathJax: string;
  evidence: Cp011DistributionWave1Evidence;
}

export interface Cp011DistributionWave1ValidationCheck {
  name: string;
  passed: boolean;
  message: string;
}

export interface Cp011DistributionWave1QuestionPackage {
  packageId: "PNC-002";
  archetypeId: "PNC-002";
  canonicalProblemId: "PNC-CP-011";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficultyBand: Cp011DistributionWave1Difficulty;
  taskKind: "groupingDistribution";
  solveMode: Cp011DistributionWave1SolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Cp011DistributionWave1Parameters;
  solver: Cp011DistributionWave1SolverResult;
  independentVerification: { supported: true; answer: number; method: string };
  explanation: { explanationId: string; lines: string[] };
  validation: { valid: boolean; checks: Cp011DistributionWave1ValidationCheck[] };
  maturity: "RUNTIME_PROOF";
  publiclyPublishable: false;
  mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}

export interface Cp011DistributionWave1CoverageAudit {
  passed: boolean;
  activeQlCount: number;
  expectedQlCount: number;
  missingQlIds: string[];
  duplicateQlIds: string[];
  exactDuplicateTemplateGroups: string[][];
  difficultyCounts: Record<string, number>;
  solveModeCounts: Record<string, number>;
  invalidRuntimeSamples: string[];
}

const qlEntries = questionLanguage.entries as QlEntry[];
const registryGroups = taskRegistry.groups as RegistryEntry[];
const explanations = explanationLibrary.entries as Record<string, ExplanationRecord>;
const constraints = constraintProfiles.profiles as Record<string, Record<string, string>>;
const answerCeiling = variableRanges.answerCeiling;

const registryByQl = new Map<string, RegistryEntry>();
for (const group of registryGroups) {
  for (const qlId of group.qlIds) {
    if (registryByQl.has(qlId)) throw new Error(`Duplicate CP-011 distribution registry ownership for ${qlId}`);
    registryByQl.set(qlId, group);
  }
}

const entries: Cp011DistributionWave1Entry[] = qlEntries.map((ql) => {
  const registry = registryByQl.get(ql.qlId);
  if (!registry) throw new Error(`Missing CP-011 distribution registry record for ${ql.qlId}`);
  if (registry.difficulty !== ql.difficulty) throw new Error(`CP-011 distribution difficulty mismatch for ${ql.qlId}`);
  if (!constraints[registry.constraintProfile]) throw new Error(`Missing CP-011 distribution constraint profile ${registry.constraintProfile}`);
  if (!explanations[ql.qlId]) throw new Error(`Missing CP-011 distribution explanation for ${ql.qlId}`);
  return {
    ...ql,
    solveMode: registry.solveMode,
    scenarioFamily: registry.scenarioFamily,
    requiredVariables: [...registry.requiredVariables],
    constraintProfile: registry.constraintProfile,
    distractorProfile: registry.distractorProfile,
  };
});

if (new Set(entries.map((entry) => entry.qlId)).size !== entries.length) throw new Error("Duplicate CP-011 distribution QL IDs");
if (Object.keys(explanations).length !== entries.length) throw new Error("CP-011 distribution explanation parity mismatch");
const explanationSignatures = new Set<string>();
for (const [qlId, explanation] of Object.entries(explanations)) {
  if (explanation.lines.length < 4) throw new Error(`${qlId} needs at least four explanation lines`);
  const signature = explanation.lines.join(" ").toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
  if (explanationSignatures.has(signature)) throw new Error(`Duplicate CP-011 distribution explanation narrative at ${qlId}`);
  explanationSignatures.add(signature);
}

function renderTemplate(template: string, variables: Record<string, string | number>): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) rendered = rendered.split(`{${key}}`).join(String(value));
  const unresolved = [...rendered.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]);
  if (unresolved.length) throw new Error(`Unresolved CP-011 distribution placeholders: ${unresolved.join(", ")}`);
  return rendered;
}

function numberValue(values: Record<string, GeneratedValue>, key: string): number {
  const value = values[key];
  if (typeof value !== "number") throw new Error(`CP-011 distribution value ${key} is not numeric`);
  return value;
}

function numberArrayValue(values: Record<string, GeneratedValue>, key: string): number[] {
  const value = values[key];
  if (!Array.isArray(value) || !value.every(Number.isInteger)) throw new Error(`CP-011 distribution value ${key} is not an integer array`);
  return [...value];
}

function toSafeCount(value: bigint, label: string): number {
  if (value < 0n || value > BigInt(answerCeiling) || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`${label} exceeds the configured answer range`);
  }
  return Number(value);
}

function buildValues(entry: Cp011DistributionWave1Entry, seed: string): Record<string, GeneratedValue> {
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp011-distribution-wave1-parameters`);
  const pools = variableRanges.pools;
  switch (entry.scenarioFamily) {
    case "distinctLabelledUnrestricted": return { ...pickSeeded(pools.distinctLabelledUnrestricted, random) };
    case "distinctLabelledNonEmpty": return { ...pickSeeded(pools.distinctLabelledNonEmpty, random) };
    case "distinctLabelledExactlyKUsed": return { ...pickSeeded(pools.distinctLabelledExactlyKUsed, random) };
    case "distinctLabelledAtLeastOneEmpty": return { ...pickSeeded(pools.distinctLabelledAtLeastOneEmpty, random) };
    case "distinctLabelledExactOccupancies": {
      const state = pickSeeded(pools.distinctLabelledExactOccupancies, random);
      return {
        ...state,
        occupancies: [...state.occupancies],
        objectCount: state.occupancies.reduce((sum, value) => sum + value, 0),
        boxCount: state.occupancies.length,
      };
    }
    case "distinctSpecifiedBoxExact": return { ...pickSeeded(pools.distinctSpecifiedBoxExact, random) };
    case "distinctSpecifiedBoxExactOthersNonEmpty": return { ...pickSeeded(pools.distinctSpecifiedBoxExactOthersNonEmpty, random) };
    case "distinctIdenticalExactlyK": return { ...pickSeeded(pools.distinctIdenticalExactlyK, random) };
    case "distinctIdenticalAtMostK": return { ...pickSeeded(pools.distinctIdenticalAtMostK, random) };
    case "distinctIdenticalAnyNonEmptyCount": {
      const objectCount = pickSeeded(pools.distinctIdenticalAnyNonEmptyCount, random);
      return { objectCount, boxCount: objectCount };
    }
    default: throw new Error(`Unsupported CP-011 distribution scenario family: ${entry.scenarioFamily}`);
  }
}

function generateParameters(entry: Cp011DistributionWave1Entry, seed: string): Cp011DistributionWave1Parameters {
  const values = buildValues(entry, seed);
  const renderVariables = Object.fromEntries(entry.requiredVariables.map((key) => [key, numberValue(values, key)]));
  const suffix = hashSeed(`${seed}:${entry.qlId}`).toString(16).padStart(8, "0");
  return {
    packageId: "PNC-002",
    canonicalProblemId: "PNC-CP-011",
    questionLanguageId: entry.qlId,
    questionId: `${entry.qlId}-${suffix}`,
    seed,
    language: "en",
    difficulty: entry.difficulty,
    taskKind: "groupingDistribution",
    solveMode: entry.solveMode,
    scenarioFamily: entry.scenarioFamily,
    constraintProfile: entry.constraintProfile,
    distractorProfile: entry.distractorProfile,
    values,
    renderVariables,
  };
}

function result(
  answer: bigint,
  equation: string,
  mathJax: string,
  evidence: Cp011DistributionWave1Evidence,
): Cp011DistributionWave1SolverResult {
  const numericAnswer = toSafeCount(answer, "CP-011 distribution answer");
  return { exactAnswer: answer.toString(), answer: String(numericAnswer), numericAnswer, equation, mathJax, evidence };
}

export function solveCp011DistributionWave1(parameters: Cp011DistributionWave1Parameters): Cp011DistributionWave1SolverResult {
  const objectCount = numberValue(parameters.values, "objectCount");
  const boxCount = numberValue(parameters.values, "boxCount");
  switch (parameters.solveMode) {
    case "countDistinctObjectsToLabelledBoxes": {
      const answer = countDistinctToLabelledBoxesExact(objectCount, boxCount);
      return result(answer, `${boxCount}^${objectCount} = ${answer}`, `${boxCount}^{${objectCount}} = ${answer}`, {
        operation: "DISTINCT_TO_LABELLED_BOXES",
        objectCount,
        boxCount,
        receiverIdentity: "LABELLED",
        unrestrictedAssignmentCount: toSafeCount(answer, "unrestricted labelled assignments"),
      });
    }
    case "countDistinctObjectsToNonEmptyLabelledBoxes": {
      const stirling = stirlingSecondKindExact(objectCount, boxCount);
      const answer = countDistinctToLabelledBoxesNonEmptyExact(objectCount, boxCount);
      return result(answer, `${boxCount}! × S(${objectCount}, ${boxCount}) = ${answer}`, `${boxCount}!\,S(${objectCount},${boxCount}) = ${answer}`, {
        operation: "DISTINCT_TO_NONEMPTY_LABELLED_BOXES",
        objectCount,
        boxCount,
        receiverIdentity: "LABELLED",
        unrestrictedAssignmentCount: toSafeCount(countDistinctToLabelledBoxesExact(objectCount, boxCount), "unrestricted labelled assignments"),
        nonEmptyAssignmentCount: toSafeCount(answer, "non-empty labelled assignments"),
        stirlingCount: toSafeCount(stirling, "Stirling count"),
        ontoAssignmentCount: toSafeCount(answer, "onto count"),
      });
    }
    case "countDistinctObjectsUsingExactlyKLabelledBoxes": {
      const nonEmptyBoxCount = numberValue(parameters.values, "nonEmptyBoxCount");
      const selectedReceiverSets = combinationExact(boxCount, nonEmptyBoxCount);
      const stirling = stirlingSecondKindExact(objectCount, nonEmptyBoxCount);
      const onto = factorialExact(nonEmptyBoxCount) * stirling;
      const answer = countDistinctToLabelledBoxesExactlyKNonEmptyExact(objectCount, boxCount, nonEmptyBoxCount);
      return result(answer, `C(${boxCount}, ${nonEmptyBoxCount}) × ${nonEmptyBoxCount}! × S(${objectCount}, ${nonEmptyBoxCount}) = ${answer}`, `\binom{${boxCount}}{${nonEmptyBoxCount}}${nonEmptyBoxCount}!\,S(${objectCount},${nonEmptyBoxCount}) = ${answer}`, {
        operation: "DISTINCT_TO_EXACTLY_K_LABELLED_BOXES",
        objectCount,
        boxCount,
        receiverIdentity: "LABELLED",
        nonEmptyBoxCount,
        selectedReceiverSetCount: toSafeCount(selectedReceiverSets, "selected receiver sets"),
        stirlingCount: toSafeCount(stirling, "Stirling count"),
        ontoAssignmentCount: toSafeCount(onto, "onto selected-receiver count"),
      });
    }
    case "countDistinctObjectsWithAtLeastOneEmptyLabelledBox": {
      const unrestricted = countDistinctToLabelledBoxesExact(objectCount, boxCount);
      const nonEmpty = countDistinctToLabelledBoxesNonEmptyExact(objectCount, boxCount);
      const answer = countDistinctToLabelledBoxesAtLeastOneEmptyExact(objectCount, boxCount);
      return result(answer, `${unrestricted} - ${nonEmpty} = ${answer}`, `${boxCount}^{${objectCount}}-${boxCount}!\,S(${objectCount},${boxCount}) = ${answer}`, {
        operation: "DISTINCT_TO_LABELLED_BOXES_AT_LEAST_ONE_EMPTY",
        objectCount,
        boxCount,
        receiverIdentity: "LABELLED",
        unrestrictedAssignmentCount: toSafeCount(unrestricted, "unrestricted labelled assignments"),
        nonEmptyAssignmentCount: toSafeCount(nonEmpty, "non-empty labelled assignments"),
      });
    }
    case "countDistinctObjectsByExactOccupancyVector": {
      const occupancies = numberArrayValue(parameters.values, "occupancies");
      const answer = countDistinctExactOccupanciesExact(occupancies);
      const denominator = occupancies.map((value) => `${value}!`).join("\,");
      return result(answer, `${objectCount}! divided by the prescribed occupancy factorials = ${answer}`, `\frac{${objectCount}!}{${denominator}} = ${answer}`, {
        operation: "DISTINCT_EXACT_OCCUPANCY_VECTOR",
        objectCount,
        boxCount: occupancies.length,
        receiverIdentity: "LABELLED",
        occupancies,
      });
    }
    case "countDistinctObjectsWithSpecifiedBoxOccupancy": {
      const specifiedOccupancy = numberValue(parameters.values, "specifiedOccupancy");
      const selectedObjects = combinationExact(objectCount, specifiedOccupancy);
      const remainingObjects = objectCount - specifiedOccupancy;
      const remainingAssignments = powerExact(boxCount - 1, remainingObjects);
      const answer = countDistinctSpecifiedBoxExactExact(objectCount, boxCount, specifiedOccupancy);
      return result(answer, `C(${objectCount}, ${specifiedOccupancy}) × ${boxCount - 1}^${remainingObjects} = ${answer}`, `\binom{${objectCount}}{${specifiedOccupancy}}(${boxCount - 1})^{${remainingObjects}} = ${answer}`, {
        operation: "DISTINCT_SPECIFIED_BOX_EXACT",
        objectCount,
        boxCount,
        receiverIdentity: "LABELLED",
        specifiedOccupancy,
        remainingObjects,
        remainingBoxes: boxCount - 1,
        specifiedObjectSelectionCount: toSafeCount(selectedObjects, "specified-box object selections"),
        remainingAssignmentCount: toSafeCount(remainingAssignments, "remaining unrestricted assignments"),
      });
    }
    case "countSpecifiedBoxOccupancyWithOtherBoxesNonEmpty": {
      const specifiedOccupancy = numberValue(parameters.values, "specifiedOccupancy");
      const selectedObjects = combinationExact(objectCount, specifiedOccupancy);
      const remainingObjects = objectCount - specifiedOccupancy;
      const remainingBoxes = boxCount - 1;
      const onto = countDistinctToLabelledBoxesNonEmptyExact(remainingObjects, remainingBoxes);
      const answer = countDistinctSpecifiedBoxExactOthersNonEmptyExact(objectCount, boxCount, specifiedOccupancy);
      return result(answer, `C(${objectCount}, ${specifiedOccupancy}) × ${remainingBoxes}! × S(${remainingObjects}, ${remainingBoxes}) = ${answer}`, `\binom{${objectCount}}{${specifiedOccupancy}}${remainingBoxes}!\,S(${remainingObjects},${remainingBoxes}) = ${answer}`, {
        operation: "DISTINCT_SPECIFIED_BOX_EXACT_OTHERS_NONEMPTY",
        objectCount,
        boxCount,
        receiverIdentity: "LABELLED",
        specifiedOccupancy,
        remainingObjects,
        remainingBoxes,
        specifiedObjectSelectionCount: toSafeCount(selectedObjects, "specified-box object selections"),
        remainingAssignmentCount: toSafeCount(onto, "remaining onto assignments"),
        ontoAssignmentCount: toSafeCount(onto, "remaining onto assignments"),
        stirlingCount: toSafeCount(stirlingSecondKindExact(remainingObjects, remainingBoxes), "remaining Stirling count"),
      });
    }
    case "countDistinctObjectsToExactlyKIdenticalBoxes": {
      const nonEmptyBoxCount = numberValue(parameters.values, "nonEmptyBoxCount");
      const answer = countDistinctToIdenticalBoxesExact(objectCount, nonEmptyBoxCount);
      return result(answer, `S(${objectCount}, ${nonEmptyBoxCount}) = ${answer}`, `S(${objectCount},${nonEmptyBoxCount}) = ${answer}`, {
        operation: "DISTINCT_TO_EXACTLY_K_IDENTICAL_BOXES",
        objectCount,
        boxCount: nonEmptyBoxCount,
        receiverIdentity: "IDENTICAL",
        nonEmptyBoxCount,
        stirlingCount: toSafeCount(answer, "exact unlabelled set partitions"),
      });
    }
    case "countDistinctObjectsToAtMostKIdenticalBoxes": {
      const maximumNonEmptyBoxes = numberValue(parameters.values, "maximumNonEmptyBoxes");
      const terms = Array.from({ length: maximumNonEmptyBoxes }, (_, index) => stirlingSecondKindExact(objectCount, index + 1));
      const answer = countDistinctToAtMostIdenticalBoxesExact(objectCount, maximumNonEmptyBoxes);
      return result(answer, `Sum of S(${objectCount}, j) for j = 1 to ${maximumNonEmptyBoxes} = ${answer}`, `\sum_{j=1}^{${maximumNonEmptyBoxes}}S(${objectCount},j) = ${answer}`, {
        operation: "DISTINCT_TO_AT_MOST_K_IDENTICAL_BOXES",
        objectCount,
        boxCount: maximumNonEmptyBoxes,
        receiverIdentity: "IDENTICAL",
        maximumNonEmptyBoxes,
        stirlingTerms: terms.map((term) => toSafeCount(term, "bounded Stirling term")),
      });
    }
    case "countAllUnlabelledSetPartitions": {
      const terms = Array.from({ length: objectCount }, (_, index) => stirlingSecondKindExact(objectCount, index + 1));
      const answer = bellNumberExact(objectCount);
      return result(answer, `Bell(${objectCount}) = sum of S(${objectCount}, j) = ${answer}`, `B_{${objectCount}}=\sum_{j=1}^{${objectCount}}S(${objectCount},j) = ${answer}`, {
        operation: "ALL_UNLABELLED_SET_PARTITIONS",
        objectCount,
        boxCount: objectCount,
        receiverIdentity: "IDENTICAL",
        maximumNonEmptyBoxes: objectCount,
        stirlingTerms: terms.map((term) => toSafeCount(term, "Bell-number Stirling term")),
      });
    }
  }
}

export function verifyCp011DistributionWave1Independently(
  parameters: Cp011DistributionWave1Parameters,
): { supported: true; answer: number; method: string } {
  const objectCount = numberValue(parameters.values, "objectCount");
  const boxCount = numberValue(parameters.values, "boxCount");
  let answer: bigint;
  let method: string;
  switch (parameters.solveMode) {
    case "countDistinctObjectsToLabelledBoxes":
      answer = enumerateLabelledAssignments(objectCount, boxCount, () => true);
      method = "exhaustive assignment of every distinct object to each labelled receiver";
      break;
    case "countDistinctObjectsToNonEmptyLabelledBoxes":
      answer = enumerateLabelledAssignments(objectCount, boxCount, (occupancies) => occupancies.every((value) => value > 0));
      method = "exhaustive labelled assignments filtered to non-empty receivers";
      break;
    case "countDistinctObjectsUsingExactlyKLabelledBoxes": {
      const nonEmptyBoxCount = numberValue(parameters.values, "nonEmptyBoxCount");
      answer = enumerateLabelledAssignments(objectCount, boxCount, (occupancies) => occupancies.filter((value) => value > 0).length === nonEmptyBoxCount);
      method = "exhaustive labelled assignments filtered by exact receiver-use count";
      break;
    }
    case "countDistinctObjectsWithAtLeastOneEmptyLabelledBox":
      answer = enumerateLabelledAssignments(objectCount, boxCount, (occupancies) => occupancies.some((value) => value === 0));
      method = "exhaustive labelled assignments retaining at least one empty receiver";
      break;
    case "countDistinctObjectsByExactOccupancyVector": {
      const occupancies = numberArrayValue(parameters.values, "occupancies");
      answer = enumerateLabelledAssignments(objectCount, occupancies.length, (candidate) => candidate.join(",") === occupancies.join(","));
      method = "exhaustive labelled assignments matched to the complete occupancy vector";
      break;
    }
    case "countDistinctObjectsWithSpecifiedBoxOccupancy": {
      const specifiedOccupancy = numberValue(parameters.values, "specifiedOccupancy");
      answer = enumerateLabelledAssignments(objectCount, boxCount, (occupancies) => occupancies[0] === specifiedOccupancy);
      method = "exhaustive labelled assignments filtered by the specified receiver occupancy";
      break;
    }
    case "countSpecifiedBoxOccupancyWithOtherBoxesNonEmpty": {
      const specifiedOccupancy = numberValue(parameters.values, "specifiedOccupancy");
      answer = enumerateLabelledAssignments(objectCount, boxCount, (occupancies) => occupancies[0] === specifiedOccupancy && occupancies.slice(1).every((value) => value > 0));
      method = "exhaustive labelled assignments filtered by exact specified occupancy and non-empty remaining receivers";
      break;
    }
    case "countDistinctObjectsToExactlyKIdenticalBoxes": {
      const nonEmptyBoxCount = numberValue(parameters.values, "nonEmptyBoxCount");
      answer = enumerateUnlabelledSetPartitions(objectCount, (groups) => groups.length === nonEmptyBoxCount);
      method = "restricted-growth enumeration of unlabelled set partitions with exact block count";
      break;
    }
    case "countDistinctObjectsToAtMostKIdenticalBoxes": {
      const maximumNonEmptyBoxes = numberValue(parameters.values, "maximumNonEmptyBoxes");
      answer = enumerateUnlabelledSetPartitions(objectCount, (groups) => groups.length <= maximumNonEmptyBoxes);
      method = "restricted-growth enumeration of unlabelled set partitions up to the block limit";
      break;
    }
    case "countAllUnlabelledSetPartitions":
      answer = enumerateUnlabelledSetPartitions(objectCount, () => true);
      method = "complete restricted-growth enumeration of all unlabelled set partitions";
      break;
  }
  return { supported: true, answer: toSafeCount(answer, "independent CP-011 distribution answer"), method };
}

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value <= answerCeiling && value !== correct))];
}

function buildOptions(
  parameters: Cp011DistributionWave1Parameters,
  solver: Cp011DistributionWave1SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const e = solver.evidence;
  const n = e.objectCount;
  const r = e.boxCount;
  let distractors: number[];
  switch (parameters.solveMode) {
    case "countDistinctObjectsToLabelledBoxes":
      distractors = uniquePositive([
        toSafeCount(powerExact(n, r), "reversed exponent distractor"),
        toSafeCount(powerExact(r, Math.max(0, n - 1)), "one-object-omitted distractor"),
        n * r,
      ], correct);
      break;
    case "countDistinctObjectsToNonEmptyLabelledBoxes":
      distractors = uniquePositive([
        e.unrestrictedAssignmentCount ?? 0,
        e.stirlingCount ?? 0,
        toSafeCount(combinationExact(n - 1, r - 1), "stars-and-bars distractor"),
      ], correct);
      break;
    case "countDistinctObjectsUsingExactlyKLabelledBoxes": {
      const k = e.nonEmptyBoxCount ?? 0;
      const stirling = e.stirlingCount ?? 0;
      const selectedSets = e.selectedReceiverSetCount ?? 0;
      distractors = uniquePositive([
        stirling,
        toSafeCount(factorialExact(k) * BigInt(stirling), "fixed selected receivers distractor"),
        selectedSets * stirling,
      ], correct);
      break;
    }
    case "countDistinctObjectsWithAtLeastOneEmptyLabelledBox":
      distractors = uniquePositive([
        e.nonEmptyAssignmentCount ?? 0,
        e.unrestrictedAssignmentCount ?? 0,
        Math.max(1, (e.unrestrictedAssignmentCount ?? 0) - toSafeCount(stirlingSecondKindExact(n, r), "unlabelled complement distractor")),
      ], correct);
      break;
    case "countDistinctObjectsByExactOccupancyVector": {
      const occupancies = e.occupancies ?? [];
      const first = occupancies[0] ?? 1;
      distractors = uniquePositive([
        toSafeCount(factorialExact(n), "linear arrangement distractor"),
        toSafeCount(combinationExact(n, first), "first-receiver-only distractor"),
        toSafeCount(factorialExact(n) / factorialExact(first), "partial occupancy correction distractor"),
      ], correct);
      break;
    }
    case "countDistinctObjectsWithSpecifiedBoxOccupancy": {
      const t = e.specifiedOccupancy ?? 0;
      const remaining = e.remainingObjects ?? 0;
      distractors = uniquePositive([
        e.specifiedObjectSelectionCount ?? 0,
        e.remainingAssignmentCount ?? 0,
        toSafeCount(combinationExact(n, t) * powerExact(r, remaining), "specified receiver still allowed distractor"),
      ], correct);
      break;
    }
    case "countSpecifiedBoxOccupancyWithOtherBoxesNonEmpty": {
      const t = e.specifiedOccupancy ?? 0;
      const remaining = e.remainingObjects ?? 0;
      const remainingBoxes = e.remainingBoxes ?? 0;
      distractors = uniquePositive([
        toSafeCount(countDistinctSpecifiedBoxExactExact(n, r, t), "other-receivers-may-be-empty distractor"),
        toSafeCount(combinationExact(n, t) * stirlingSecondKindExact(remaining, remainingBoxes), "forgot remaining receiver labels distractor"),
        e.ontoAssignmentCount ?? 0,
      ], correct);
      break;
    }
    case "countDistinctObjectsToExactlyKIdenticalBoxes": {
      const k = e.nonEmptyBoxCount ?? 0;
      distractors = uniquePositive([
        toSafeCount(factorialExact(k) * BigInt(correct), "labelled non-empty boxes distractor"),
        toSafeCount(powerExact(k, n), "unrestricted labelled boxes distractor"),
        toSafeCount(combinationExact(n - 1, k - 1), "identical-object composition distractor"),
      ], correct);
      break;
    }
    case "countDistinctObjectsToAtMostKIdenticalBoxes": {
      const k = e.maximumNonEmptyBoxes ?? 0;
      const exactK = toSafeCount(stirlingSecondKindExact(n, k), "exactly-k distractor");
      const bell = toSafeCount(bellNumberExact(n), "unbounded Bell distractor");
      const labelledSum = Array.from({ length: k }, (_, index) => index + 1)
        .reduce((sum, used) => sum + factorialExact(used) * stirlingSecondKindExact(n, used), 0n);
      distractors = uniquePositive([exactK, bell, toSafeCount(labelledSum, "labelled at-most distractor")], correct);
      break;
    }
    case "countAllUnlabelledSetPartitions": {
      const middle = Math.max(1, Math.floor(n / 2));
      distractors = uniquePositive([
        toSafeCount(stirlingSecondKindExact(n, middle), "single Stirling term distractor"),
        toSafeCount(powerExact(n, n), "labelled assignment distractor"),
        Math.max(1, correct - 1),
      ], correct);
      break;
    }
  }
  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate <= answerCeiling && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }
  const numeric = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp011-distribution-wave1-options`),
  );
  return { options: numeric.map(String), correctIndex: numeric.indexOf(correct) };
}

function renderExplanation(
  parameters: Cp011DistributionWave1Parameters,
  solver: Cp011DistributionWave1SolverResult,
): { explanationId: string; lines: string[] } {
  const authored = explanations[parameters.questionLanguageId];
  if (!authored) throw new Error(`Missing authored CP-011 distribution explanation for ${parameters.questionLanguageId}`);
  const variables: Record<string, string | number> = {
    ...parameters.renderVariables,
    answer: solver.answer,
    equation: String.raw`\(${solver.mathJax}\)`,
  };
  return {
    explanationId: parameters.questionLanguageId,
    lines: authored.lines.map((line) => renderTemplate(line, variables)),
  };
}

const DELIMITED_MATH = /\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/g;
function stripDelimitedMath(value: string): string { return value.replace(DELIMITED_MATH, " "); }
function latexBalanced(value: string): boolean {
  return value.split("\\(").length - 1 === value.split("\\)").length - 1
    && value.split("\\[").length - 1 === value.split("\\]").length - 1;
}
function visibleFormulaIsFormatted(value: string): boolean {
  const plain = stripDelimitedMath(value);
  return !/\b\d+!/.test(plain) && !/[×÷≤≥]/.test(plain);
}
function check(name: string, passed: boolean, message: string): Cp011DistributionWave1ValidationCheck {
  return { name, passed, message };
}

const APPROVED_OPERATIONS = new Set<Cp011DistributionWave1Operation>([
  "DISTINCT_TO_LABELLED_BOXES",
  "DISTINCT_TO_NONEMPTY_LABELLED_BOXES",
  "DISTINCT_TO_EXACTLY_K_LABELLED_BOXES",
  "DISTINCT_TO_LABELLED_BOXES_AT_LEAST_ONE_EMPTY",
  "DISTINCT_EXACT_OCCUPANCY_VECTOR",
  "DISTINCT_SPECIFIED_BOX_EXACT",
  "DISTINCT_SPECIFIED_BOX_EXACT_OTHERS_NONEMPTY",
  "DISTINCT_TO_EXACTLY_K_IDENTICAL_BOXES",
  "DISTINCT_TO_AT_MOST_K_IDENTICAL_BOXES",
  "ALL_UNLABELLED_SET_PARTITIONS",
]);

function validatePackage(
  pkg: Omit<Cp011DistributionWave1QuestionPackage, "validation">,
): { valid: boolean; checks: Cp011DistributionWave1ValidationCheck[] } {
  const checks: Cp011DistributionWave1ValidationCheck[] = [];
  const entry = entries.find((candidate) => candidate.qlId === pkg.questionLanguageId);
  const explanationText = pkg.explanation.lines.join(" ");
  const visible = [pkg.stem, ...pkg.options, ...pkg.explanation.lines];
  const isIdenticalMode = [
    "countDistinctObjectsToExactlyKIdenticalBoxes",
    "countDistinctObjectsToAtMostKIdenticalBoxes",
    "countAllUnlabelledSetPartitions",
  ].includes(pkg.solveMode);
  checks.push(check("package", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must remain PNC-002"));
  checks.push(check("cp", pkg.canonicalProblemId === "PNC-CP-011", "Distribution runtime accepts CP-011 only"));
  checks.push(check("entry", Boolean(entry), "QL must exist in the admitted distribution inventory"));
  checks.push(check("mode", entry?.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("difficulty", entry?.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("task", pkg.taskKind === "groupingDistribution", "CP-011 distribution QLs must use groupingDistribution"));
  checks.push(check("operation", APPROVED_OPERATIONS.has(pkg.solver.evidence.operation), "Solver must expose an approved distribution operation"));
  checks.push(check("receiver-identity", pkg.solver.evidence.receiverIdentity === (isIdenticalMode ? "IDENTICAL" : "LABELLED"), "Receiver identity must match the solve contract"));
  checks.push(check("solver", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Solver answer must be a positive integer"));
  checks.push(check("ceiling", pkg.solver.numericAnswer <= answerCeiling, "Answer must remain below the configured ceiling"));
  checks.push(check("independent", pkg.independentVerification.supported && pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent enumeration must agree"));
  checks.push(check("options", pkg.options.length === 4 && new Set(pkg.options).size === 4, "Exactly four unique options are required"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  checks.push(check("correct-index", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to the answer"));
  checks.push(check("stem-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem), "Stem must resolve all placeholders"));
  checks.push(check("explanation-lines", pkg.explanation.lines.length >= 4, "Explanation must contain at least four lines"));
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the final answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(explanationText), "Explanation must resolve all placeholders"));
  checks.push(check("latex-balanced", visible.every(latexBalanced), "Visible LaTeX delimiters must be balanced"));
  checks.push(check("latex-no-raw-formulas", visible.every(visibleFormulaIsFormatted), "Visible formulas must be math-delimited"));
  checks.push(check("not-public", pkg.publiclyPublishable === false, "Runtime-proof questions must remain unpublished"));
  return { valid: checks.every((item) => item.passed), checks };
}

export function getCp011DistributionWave1Entries(): Cp011DistributionWave1Entry[] {
  return entries.map((entry) => ({ ...entry, requiredVariables: [...entry.requiredVariables] }));
}

export function runPnc002Cp011DistributionWave1Pipeline(input: {
  questionLanguageId?: string;
  difficulty?: Cp011DistributionWave1Difficulty;
  seed?: string;
  language?: "en" | "hi" | "pa";
} = {}): Cp011DistributionWave1QuestionPackage {
  const language = input.language ?? "en";
  if (language !== "en") throw new Error(`PNC-CP-011 distribution wave 1 language ${language} is not implemented`);
  const seed = input.seed ?? "pnc-cp011-distribution-wave1-default";
  let entry: Cp011DistributionWave1Entry;
  if (input.questionLanguageId) {
    const found = entries.find((candidate) => candidate.qlId === input.questionLanguageId);
    if (!found) throw new Error(`Unknown CP-011 distribution wave 1 QL: ${input.questionLanguageId}`);
    if (input.difficulty && found.difficulty !== input.difficulty) throw new Error("Requested difficulty does not match selected CP-011 distribution QL");
    entry = found;
  } else {
    const candidates = entries.filter((candidate) => !input.difficulty || candidate.difficulty === input.difficulty);
    if (!candidates.length) throw new Error("No admitted CP-011 distribution wave 1 QL matches the requested filters");
    entry = pickSeeded(candidates, createSeededRandom(`${seed}:cp011-distribution-wave1-entry`));
  }
  const parameters = generateParameters(entry, seed);
  const solver = solveCp011DistributionWave1(parameters);
  const independentVerification = verifyCp011DistributionWave1Independently(parameters);
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const optionBundle = buildOptions(parameters, solver);
  const explanation = renderExplanation(parameters, solver);
  const withoutValidation: Omit<Cp011DistributionWave1QuestionPackage, "validation"> = {
    packageId: "PNC-002",
    archetypeId: "PNC-002",
    canonicalProblemId: "PNC-CP-011",
    questionLanguageId: entry.qlId,
    questionId: parameters.questionId,
    seed,
    language: "en",
    difficultyBand: entry.difficulty,
    taskKind: "groupingDistribution",
    solveMode: entry.solveMode,
    stem,
    options: optionBundle.options,
    correctIndex: optionBundle.correctIndex,
    answer: solver.answer,
    parameters,
    solver,
    independentVerification,
    explanation,
    maturity: "RUNTIME_PROOF",
    publiclyPublishable: false,
    mathematicalFingerprint: [entry.solveMode, ...Object.entries(parameters.values).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${Array.isArray(value) ? value.join("-") : value}`)].join("|"),
    traceability: {
      packageId: "PNC-002",
      canonicalProblemId: "PNC-CP-011",
      questionLanguageId: entry.qlId,
      constraintProfile: entry.constraintProfile,
      distractorProfile: entry.distractorProfile,
      formulaRendering: "LATEX_MATHJAX",
      sharedPackageIntegration: "DEFERRED_UNTIL_CP011_DISTRIBUTION_REVIEW",
    },
  };
  return { ...withoutValidation, validation: validatePackage(withoutValidation) };
}

export function auditCp011DistributionWave1Coverage(): Cp011DistributionWave1CoverageAudit {
  const expectedIds = Array.from({ length: 10 }, (_, index) => `PNC-QL-${String(219 + index).padStart(3, "0")}`);
  const actualIds = entries.map((entry) => entry.qlId);
  const duplicateQlIds = actualIds.filter((qlId, index) => actualIds.indexOf(qlId) !== index);
  const normalizedGroups = new Map<string, string[]>();
  for (const entry of entries) {
    const signature = entry.template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
    normalizedGroups.set(signature, [...(normalizedGroups.get(signature) ?? []), entry.qlId]);
  }
  const exactDuplicateTemplateGroups = [...normalizedGroups.values()].filter((group) => group.length > 1);
  const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
  const solveModeCounts = Object.fromEntries([...new Set(entries.map((entry) => entry.solveMode))].map((solveMode) => [solveMode, entries.filter((entry) => entry.solveMode === solveMode).length]));
  const invalidRuntimeSamples: string[] = [];
  for (const entry of entries) {
    try {
      const sample = runPnc002Cp011DistributionWave1Pipeline({ questionLanguageId: entry.qlId, seed: `cp011-distribution-wave1-audit:${entry.qlId}` });
      if (!sample.validation.valid) invalidRuntimeSamples.push(`${entry.qlId}: ${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
    } catch (error) {
      invalidRuntimeSamples.push(`${entry.qlId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  const missingQlIds = expectedIds.filter((qlId) => !actualIds.includes(qlId));
  const passed = entries.length === 10
    && missingQlIds.length === 0
    && duplicateQlIds.length === 0
    && exactDuplicateTemplateGroups.length === 0
    && JSON.stringify(difficultyCounts) === JSON.stringify({ Easy: 1, Medium: 5, Hard: 4 })
    && Object.keys(solveModeCounts).length === 10
    && invalidRuntimeSamples.length === 0;
  return {
    passed,
    activeQlCount: entries.length,
    expectedQlCount: 10,
    missingQlIds,
    duplicateQlIds,
    exactDuplicateTemplateGroups,
    difficultyCounts,
    solveModeCounts,
    invalidRuntimeSamples,
  };
}
