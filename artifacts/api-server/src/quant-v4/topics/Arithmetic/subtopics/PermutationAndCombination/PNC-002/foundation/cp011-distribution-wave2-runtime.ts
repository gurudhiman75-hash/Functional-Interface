import questionLanguage from "../question-language.cp011-distribution-wave2.en.json";
import taskRegistry from "../task-registry.cp011-distribution-wave2.library.json";
import variableRanges from "../variable-ranges.cp011-distribution-wave2.library.json";
import explanationLibrary from "../explanation-by-ql.cp011-distribution-wave2.en.json";
import constraintProfiles from "../constraint-profiles.cp011-distribution-wave2.library.json";
import {
  countIdenticalAllNonEmptySpecifiedRecipientAtLeastExact,
  countIdenticalSpecifiedRecipientAtLeastExact,
  countIdenticalToAtMostIdenticalBoxesExact,
  countIdenticalToIdenticalBoxesExact,
  countIdenticalToLabelledBoxesAtLeastOneEmptyExact,
  countIdenticalToLabelledBoxesExactlyKNonEmptyExact,
  countIdenticalToLabelledBoxesExact,
  countIdenticalToLabelledBoxesNonEmptyExact,
  countIdenticalToLabelledBoxesWithMinimumExact,
  countIdenticalToLabelledBoxesWithUniformCapacityExact,
} from "./cp011-discovery-distribution";
import {
  enumerateIdenticalAllocations,
  enumerateIdenticalPartitionsExact,
} from "./cp011-discovery-enumerators";
import { createSeededRandom, hashSeed, pickSeeded, shuffleSeeded } from "./math";

export type Cp011DistributionWave2Difficulty = "Easy" | "Medium" | "Hard";
export type Cp011DistributionWave2SolveMode =
  | "countIdenticalObjectsToLabelledBoxes"
  | "countIdenticalObjectsToNonEmptyLabelledBoxes"
  | "countIdenticalObjectsUsingExactlyKLabelledBoxes"
  | "countIdenticalObjectsWithAtLeastOneEmptyLabelledBox"
  | "countIdenticalObjectsWithCommonMinimum"
  | "countIdenticalObjectsWithSpecifiedRecipientMinimum"
  | "countAllNonEmptyWithSpecifiedRecipientMinimum"
  | "countIdenticalObjectsWithUniformCapacity"
  | "countIdenticalObjectsToExactlyKIdenticalBoxes"
  | "countIdenticalObjectsToAtMostKIdenticalBoxes";

type GeneratedValue = number | number[];
type QlEntry = { qlId: string; difficulty: Cp011DistributionWave2Difficulty; template: string };
type RegistryEntry = {
  qlIds: string[];
  solveMode: Cp011DistributionWave2SolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  constraintProfile: string;
  distractorProfile: string;
  difficulty: Cp011DistributionWave2Difficulty;
};
type ExplanationRecord = { lines: string[] };

export interface Cp011DistributionWave2Entry extends QlEntry {
  solveMode: Cp011DistributionWave2SolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  constraintProfile: string;
  distractorProfile: string;
}

export interface Cp011DistributionWave2Parameters {
  packageId: "PNC-002";
  canonicalProblemId: "PNC-CP-011";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficulty: Cp011DistributionWave2Difficulty;
  taskKind: "groupingDistribution";
  solveMode: Cp011DistributionWave2SolveMode;
  scenarioFamily: string;
  constraintProfile: string;
  distractorProfile: string;
  values: Record<string, GeneratedValue>;
  renderVariables: Record<string, string | number>;
}

export type Cp011DistributionWave2Operation =
  | "IDENTICAL_TO_LABELLED_BOXES"
  | "IDENTICAL_TO_NONEMPTY_LABELLED_BOXES"
  | "IDENTICAL_TO_EXACTLY_K_LABELLED_BOXES"
  | "IDENTICAL_TO_LABELLED_BOXES_AT_LEAST_ONE_EMPTY"
  | "IDENTICAL_TO_LABELLED_BOXES_COMMON_MINIMUM"
  | "IDENTICAL_SPECIFIED_RECIPIENT_MINIMUM"
  | "IDENTICAL_ALL_NONEMPTY_SPECIFIED_MINIMUM"
  | "IDENTICAL_TO_LABELLED_BOXES_UNIFORM_CAPACITY"
  | "IDENTICAL_TO_EXACTLY_K_IDENTICAL_BOXES"
  | "IDENTICAL_TO_AT_MOST_K_IDENTICAL_BOXES";

export interface Cp011DistributionWave2Evidence {
  operation: Cp011DistributionWave2Operation;
  objectCount: number;
  boxCount: number;
  receiverIdentity: "LABELLED" | "IDENTICAL";
  unrestrictedCount?: number;
  nonEmptyCount?: number;
  nonEmptyBoxCount?: number;
  maximumNonEmptyBoxes?: number;
  minimumPerBox?: number;
  specifiedMinimum?: number;
  reservedObjects?: number;
  residualObjects?: number;
  capacity?: number;
  capacityPlusOne?: number;
  exactPartitionCount?: number;
  partitionTerms?: number[];
}

export interface Cp011DistributionWave2SolverResult {
  exactAnswer: string;
  answer: string;
  numericAnswer: number;
  equation: string;
  mathJax: string;
  evidence: Cp011DistributionWave2Evidence;
}

export interface Cp011DistributionWave2ValidationCheck {
  name: string;
  passed: boolean;
  message: string;
}

export interface Cp011DistributionWave2QuestionPackage {
  packageId: "PNC-002";
  archetypeId: "PNC-002";
  canonicalProblemId: "PNC-CP-011";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficultyBand: Cp011DistributionWave2Difficulty;
  taskKind: "groupingDistribution";
  solveMode: Cp011DistributionWave2SolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Cp011DistributionWave2Parameters;
  solver: Cp011DistributionWave2SolverResult;
  independentVerification: { supported: true; answer: number; method: string };
  explanation: { explanationId: string; lines: string[] };
  validation: { valid: boolean; checks: Cp011DistributionWave2ValidationCheck[] };
  maturity: "RUNTIME_PROOF";
  publiclyPublishable: false;
  mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}

export interface Cp011DistributionWave2CoverageAudit {
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
    if (registryByQl.has(qlId)) throw new Error(`Duplicate CP-011 distribution wave 2 registry ownership for ${qlId}`);
    registryByQl.set(qlId, group);
  }
}

const entries: Cp011DistributionWave2Entry[] = qlEntries.map((ql) => {
  const registry = registryByQl.get(ql.qlId);
  if (!registry) throw new Error(`Missing CP-011 distribution wave 2 registry record for ${ql.qlId}`);
  if (registry.difficulty !== ql.difficulty) throw new Error(`CP-011 distribution wave 2 difficulty mismatch for ${ql.qlId}`);
  if (!constraints[registry.constraintProfile]) throw new Error(`Missing CP-011 distribution wave 2 constraint profile ${registry.constraintProfile}`);
  if (!explanations[ql.qlId]) throw new Error(`Missing CP-011 distribution wave 2 explanation for ${ql.qlId}`);
  return {
    ...ql,
    solveMode: registry.solveMode,
    scenarioFamily: registry.scenarioFamily,
    requiredVariables: [...registry.requiredVariables],
    constraintProfile: registry.constraintProfile,
    distractorProfile: registry.distractorProfile,
  };
});
if (new Set(entries.map((entry) => entry.qlId)).size !== entries.length) throw new Error("Duplicate CP-011 distribution wave 2 QL IDs");
if (Object.keys(explanations).length !== entries.length) throw new Error("CP-011 distribution wave 2 explanation parity mismatch");

function renderTemplate(template: string, variables: Record<string, string | number>): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) rendered = rendered.split(`{${key}}`).join(String(value));
  const unresolved = [...rendered.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]);
  if (unresolved.length) throw new Error(`Unresolved CP-011 distribution wave 2 placeholders: ${unresolved.join(", ")}`);
  return rendered;
}

function numberValue(values: Record<string, GeneratedValue>, key: string): number {
  const value = values[key];
  if (typeof value !== "number") throw new Error(`CP-011 distribution wave 2 value ${key} is not numeric`);
  return value;
}

function toSafeCount(value: bigint, label: string): number {
  if (value < 0n || value > BigInt(answerCeiling) || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`${label} exceeds the configured answer range`);
  }
  return Number(value);
}

function buildValues(entry: Cp011DistributionWave2Entry, seed: string): Record<string, GeneratedValue> {
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp011-distribution-wave2-parameters`);
  const pools = variableRanges.pools;
  switch (entry.scenarioFamily) {
    case "identicalLabelledUnrestricted": return { ...pickSeeded(pools.identicalLabelledUnrestricted, random) };
    case "identicalLabelledNonEmpty": return { ...pickSeeded(pools.identicalLabelledNonEmpty, random) };
    case "identicalLabelledExactlyKUsed": return { ...pickSeeded(pools.identicalLabelledExactlyKUsed, random) };
    case "identicalLabelledAtLeastOneEmpty": return { ...pickSeeded(pools.identicalLabelledAtLeastOneEmpty, random) };
    case "identicalLabelledCommonMinimum": return { ...pickSeeded(pools.identicalLabelledCommonMinimum, random) };
    case "identicalSpecifiedRecipientMinimum": return { ...pickSeeded(pools.identicalSpecifiedRecipientMinimum, random) };
    case "identicalAllNonEmptySpecifiedMinimum": return { ...pickSeeded(pools.identicalAllNonEmptySpecifiedMinimum, random) };
    case "identicalLabelledUniformCapacity": return { ...pickSeeded(pools.identicalLabelledUniformCapacity, random) };
    case "identicalObjectsIdenticalExactlyK": {
      const state = pickSeeded(pools.identicalObjectsIdenticalExactlyK, random);
      return { ...state, boxCount: state.nonEmptyBoxCount };
    }
    case "identicalObjectsIdenticalAtMostK": {
      const state = pickSeeded(pools.identicalObjectsIdenticalAtMostK, random);
      return { ...state, boxCount: state.maximumNonEmptyBoxes };
    }
    default: throw new Error(`Unsupported CP-011 distribution wave 2 scenario family: ${entry.scenarioFamily}`);
  }
}

function generateParameters(entry: Cp011DistributionWave2Entry, seed: string): Cp011DistributionWave2Parameters {
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

function result(answer: bigint, equation: string, mathJax: string, evidence: Cp011DistributionWave2Evidence): Cp011DistributionWave2SolverResult {
  const numericAnswer = toSafeCount(answer, "CP-011 distribution wave 2 answer");
  return { exactAnswer: answer.toString(), answer: String(numericAnswer), numericAnswer, equation, mathJax, evidence };
}

export function solveCp011DistributionWave2(parameters: Cp011DistributionWave2Parameters): Cp011DistributionWave2SolverResult {
  const objectCount = numberValue(parameters.values, "objectCount");
  const boxCount = numberValue(parameters.values, "boxCount");
  switch (parameters.solveMode) {
    case "countIdenticalObjectsToLabelledBoxes": {
      const answer = countIdenticalToLabelledBoxesExact(objectCount, boxCount);
      const mathJax = String.raw`\binom{${objectCount + boxCount - 1}}{${boxCount - 1}} = ${answer}`;
      return result(answer, `${objectCount} identical objects into ${boxCount} labelled receivers with empties allowed = ${answer}`, mathJax, {
        operation: "IDENTICAL_TO_LABELLED_BOXES", objectCount, boxCount, receiverIdentity: "LABELLED", unrestrictedCount: toSafeCount(answer, "unrestricted count"),
      });
    }
    case "countIdenticalObjectsToNonEmptyLabelledBoxes": {
      const answer = countIdenticalToLabelledBoxesNonEmptyExact(objectCount, boxCount);
      const unrestricted = countIdenticalToLabelledBoxesExact(objectCount, boxCount);
      const mathJax = String.raw`\binom{${objectCount - 1}}{${boxCount - 1}} = ${answer}`;
      return result(answer, `positive compositions of ${objectCount} into ${boxCount} labelled parts = ${answer}`, mathJax, {
        operation: "IDENTICAL_TO_NONEMPTY_LABELLED_BOXES", objectCount, boxCount, receiverIdentity: "LABELLED", unrestrictedCount: toSafeCount(unrestricted, "unrestricted count"), nonEmptyCount: toSafeCount(answer, "non-empty count"),
      });
    }
    case "countIdenticalObjectsUsingExactlyKLabelledBoxes": {
      const nonEmptyBoxCount = numberValue(parameters.values, "nonEmptyBoxCount");
      const answer = countIdenticalToLabelledBoxesExactlyKNonEmptyExact(objectCount, boxCount, nonEmptyBoxCount);
      const mathJax = String.raw`\binom{${boxCount}}{${nonEmptyBoxCount}}\binom{${objectCount - 1}}{${nonEmptyBoxCount - 1}} = ${answer}`;
      return result(answer, `choose ${nonEmptyBoxCount} receivers and distribute positively = ${answer}`, mathJax, {
        operation: "IDENTICAL_TO_EXACTLY_K_LABELLED_BOXES", objectCount, boxCount, receiverIdentity: "LABELLED", nonEmptyBoxCount,
      });
    }
    case "countIdenticalObjectsWithAtLeastOneEmptyLabelledBox": {
      const unrestricted = countIdenticalToLabelledBoxesExact(objectCount, boxCount);
      const nonEmpty = countIdenticalToLabelledBoxesNonEmptyExact(objectCount, boxCount);
      const answer = countIdenticalToLabelledBoxesAtLeastOneEmptyExact(objectCount, boxCount);
      const mathJax = String.raw`\binom{${objectCount + boxCount - 1}}{${boxCount - 1}}-\binom{${objectCount - 1}}{${boxCount - 1}} = ${answer}`;
      return result(answer, `${unrestricted} unrestricted minus ${nonEmpty} all-non-empty distributions = ${answer}`, mathJax, {
        operation: "IDENTICAL_TO_LABELLED_BOXES_AT_LEAST_ONE_EMPTY", objectCount, boxCount, receiverIdentity: "LABELLED", unrestrictedCount: toSafeCount(unrestricted, "unrestricted count"), nonEmptyCount: toSafeCount(nonEmpty, "non-empty count"),
      });
    }
    case "countIdenticalObjectsWithCommonMinimum": {
      const minimumPerBox = numberValue(parameters.values, "minimumPerBox");
      const reservedObjects = boxCount * minimumPerBox;
      const residualObjects = objectCount - reservedObjects;
      const answer = countIdenticalToLabelledBoxesWithMinimumExact(objectCount, boxCount, minimumPerBox);
      const mathJax = String.raw`\binom{${residualObjects + boxCount - 1}}{${boxCount - 1}} = ${answer}`;
      return result(answer, `reserve ${reservedObjects}, then weakly compose ${residualObjects} = ${answer}`, mathJax, {
        operation: "IDENTICAL_TO_LABELLED_BOXES_COMMON_MINIMUM", objectCount, boxCount, receiverIdentity: "LABELLED", minimumPerBox, reservedObjects, residualObjects,
      });
    }
    case "countIdenticalObjectsWithSpecifiedRecipientMinimum": {
      const specifiedMinimum = numberValue(parameters.values, "specifiedMinimum");
      const residualObjects = objectCount - specifiedMinimum;
      const answer = countIdenticalSpecifiedRecipientAtLeastExact(objectCount, boxCount, specifiedMinimum);
      const mathJax = String.raw`\binom{${residualObjects + boxCount - 1}}{${boxCount - 1}} = ${answer}`;
      return result(answer, `reserve ${specifiedMinimum} for one receiver and weakly compose the remainder = ${answer}`, mathJax, {
        operation: "IDENTICAL_SPECIFIED_RECIPIENT_MINIMUM", objectCount, boxCount, receiverIdentity: "LABELLED", specifiedMinimum, reservedObjects: specifiedMinimum, residualObjects,
      });
    }
    case "countAllNonEmptyWithSpecifiedRecipientMinimum": {
      const specifiedMinimum = numberValue(parameters.values, "specifiedMinimum");
      const reservedObjects = specifiedMinimum + boxCount - 1;
      const residualObjects = objectCount - reservedObjects;
      const answer = countIdenticalAllNonEmptySpecifiedRecipientAtLeastExact(objectCount, boxCount, specifiedMinimum);
      const mathJax = String.raw`\binom{${objectCount - specifiedMinimum}}{${boxCount - 1}} = ${answer}`;
      return result(answer, `reserve the specified minimum and one for each other receiver = ${answer}`, mathJax, {
        operation: "IDENTICAL_ALL_NONEMPTY_SPECIFIED_MINIMUM", objectCount, boxCount, receiverIdentity: "LABELLED", specifiedMinimum, reservedObjects, residualObjects,
      });
    }
    case "countIdenticalObjectsWithUniformCapacity": {
      const capacity = numberValue(parameters.values, "capacity");
      const answer = countIdenticalToLabelledBoxesWithUniformCapacityExact(objectCount, boxCount, capacity);
      const mathJax = String.raw`\sum_{j=0}^{${boxCount}}(-1)^j\binom{${boxCount}}{j}\binom{${objectCount}-j(${capacity + 1})+${boxCount - 1}}{${boxCount - 1}} = ${answer}`;
      return result(answer, `equal-capacity inclusion-exclusion = ${answer}`, mathJax, {
        operation: "IDENTICAL_TO_LABELLED_BOXES_UNIFORM_CAPACITY", objectCount, boxCount, receiverIdentity: "LABELLED", capacity, capacityPlusOne: capacity + 1,
      });
    }
    case "countIdenticalObjectsToExactlyKIdenticalBoxes": {
      const nonEmptyBoxCount = numberValue(parameters.values, "nonEmptyBoxCount");
      const answer = countIdenticalToIdenticalBoxesExact(objectCount, nonEmptyBoxCount);
      const mathJax = String.raw`p_{${nonEmptyBoxCount}}(${objectCount}) = ${answer}`;
      return result(answer, `integer partitions of ${objectCount} into exactly ${nonEmptyBoxCount} parts = ${answer}`, mathJax, {
        operation: "IDENTICAL_TO_EXACTLY_K_IDENTICAL_BOXES", objectCount, boxCount, receiverIdentity: "IDENTICAL", nonEmptyBoxCount, exactPartitionCount: toSafeCount(answer, "exact partition count"),
      });
    }
    case "countIdenticalObjectsToAtMostKIdenticalBoxes": {
      const maximumNonEmptyBoxes = numberValue(parameters.values, "maximumNonEmptyBoxes");
      const terms = Array.from({ length: maximumNonEmptyBoxes }, (_, index) => countIdenticalToIdenticalBoxesExact(objectCount, index + 1));
      const answer = countIdenticalToAtMostIdenticalBoxesExact(objectCount, maximumNonEmptyBoxes);
      const mathJax = String.raw`\sum_{j=1}^{${maximumNonEmptyBoxes}}p_j(${objectCount}) = ${answer}`;
      return result(answer, `sum integer-partition counts through ${maximumNonEmptyBoxes} parts = ${answer}`, mathJax, {
        operation: "IDENTICAL_TO_AT_MOST_K_IDENTICAL_BOXES", objectCount, boxCount, receiverIdentity: "IDENTICAL", maximumNonEmptyBoxes, partitionTerms: terms.map((term) => toSafeCount(term, "partition term")),
      });
    }
  }
}

export function verifyCp011DistributionWave2Independently(parameters: Cp011DistributionWave2Parameters): { supported: true; answer: number; method: string } {
  const objectCount = numberValue(parameters.values, "objectCount");
  const boxCount = numberValue(parameters.values, "boxCount");
  let answer: bigint;
  let method: string;
  switch (parameters.solveMode) {
    case "countIdenticalObjectsToLabelledBoxes":
      answer = enumerateIdenticalAllocations(objectCount, boxCount, () => true);
      method = "exhaustive weak-composition enumeration";
      break;
    case "countIdenticalObjectsToNonEmptyLabelledBoxes":
      answer = enumerateIdenticalAllocations(objectCount, boxCount, (occupancies) => occupancies.every((value) => value > 0));
      method = "exhaustive positive-composition enumeration";
      break;
    case "countIdenticalObjectsUsingExactlyKLabelledBoxes": {
      const nonEmptyBoxCount = numberValue(parameters.values, "nonEmptyBoxCount");
      answer = enumerateIdenticalAllocations(objectCount, boxCount, (occupancies) => occupancies.filter((value) => value > 0).length === nonEmptyBoxCount);
      method = "exhaustive occupancy enumeration with exact used-receiver count";
      break;
    }
    case "countIdenticalObjectsWithAtLeastOneEmptyLabelledBox":
      answer = enumerateIdenticalAllocations(objectCount, boxCount, (occupancies) => occupancies.some((value) => value === 0));
      method = "exhaustive occupancy enumeration with an empty receiver";
      break;
    case "countIdenticalObjectsWithCommonMinimum": {
      const minimumPerBox = numberValue(parameters.values, "minimumPerBox");
      answer = enumerateIdenticalAllocations(objectCount, boxCount, (occupancies) => occupancies.every((value) => value >= minimumPerBox));
      method = "exhaustive occupancy enumeration with a common lower bound";
      break;
    }
    case "countIdenticalObjectsWithSpecifiedRecipientMinimum": {
      const specifiedMinimum = numberValue(parameters.values, "specifiedMinimum");
      answer = enumerateIdenticalAllocations(objectCount, boxCount, (occupancies) => occupancies[0]! >= specifiedMinimum);
      method = "exhaustive occupancy enumeration with one specified lower bound";
      break;
    }
    case "countAllNonEmptyWithSpecifiedRecipientMinimum": {
      const specifiedMinimum = numberValue(parameters.values, "specifiedMinimum");
      answer = enumerateIdenticalAllocations(objectCount, boxCount, (occupancies) => occupancies[0]! >= specifiedMinimum && occupancies.every((value) => value > 0));
      method = "exhaustive occupancy enumeration with combined lower bounds";
      break;
    }
    case "countIdenticalObjectsWithUniformCapacity": {
      const capacity = numberValue(parameters.values, "capacity");
      answer = enumerateIdenticalAllocations(objectCount, boxCount, (occupancies) => occupancies.every((value) => value <= capacity));
      method = "exhaustive occupancy enumeration under a uniform capacity";
      break;
    }
    case "countIdenticalObjectsToExactlyKIdenticalBoxes": {
      const nonEmptyBoxCount = numberValue(parameters.values, "nonEmptyBoxCount");
      answer = enumerateIdenticalPartitionsExact(objectCount, nonEmptyBoxCount);
      method = "independent nondecreasing integer-partition enumeration";
      break;
    }
    case "countIdenticalObjectsToAtMostKIdenticalBoxes": {
      const maximumNonEmptyBoxes = numberValue(parameters.values, "maximumNonEmptyBoxes");
      answer = Array.from({ length: maximumNonEmptyBoxes }, (_, index) => enumerateIdenticalPartitionsExact(objectCount, index + 1)).reduce((sum, value) => sum + value, 0n);
      method = "sum of independent exact-part integer-partition enumerations";
      break;
    }
  }
  return { supported: true, answer: toSafeCount(answer, "independent CP-011 distribution wave 2 answer"), method };
}

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct && value <= answerCeiling))];
}

function buildOptions(parameters: Cp011DistributionWave2Parameters, solver: Cp011DistributionWave2SolverResult): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const e = solver.evidence;
  const unrestricted = toSafeCount(countIdenticalToLabelledBoxesExact(e.objectCount, Math.max(1, e.boxCount)), "unrestricted distractor");
  const nonEmpty = e.objectCount >= e.boxCount ? toSafeCount(countIdenticalToLabelledBoxesNonEmptyExact(e.objectCount, e.boxCount), "non-empty distractor") : 0;
  let distractors: number[];
  switch (parameters.solveMode) {
    case "countIdenticalObjectsToLabelledBoxes":
      distractors = uniquePositive([nonEmpty, e.boxCount ** e.objectCount, e.objectCount ** e.boxCount, correct - e.boxCount], correct);
      break;
    case "countIdenticalObjectsToNonEmptyLabelledBoxes":
      distractors = uniquePositive([unrestricted, e.boxCount ** e.objectCount, correct * e.boxCount, correct + e.objectCount], correct);
      break;
    case "countIdenticalObjectsUsingExactlyKLabelledBoxes": {
      const k = e.nonEmptyBoxCount ?? 1;
      const omitReceiverChoice = toSafeCount(countIdenticalToLabelledBoxesNonEmptyExact(e.objectCount, k), "omit receiver choice distractor");
      distractors = uniquePositive([omitReceiverChoice, unrestricted, nonEmpty, correct * k], correct);
      break;
    }
    case "countIdenticalObjectsWithAtLeastOneEmptyLabelledBox":
      distractors = uniquePositive([unrestricted, nonEmpty, unrestricted + nonEmpty, Math.abs(unrestricted - 2 * nonEmpty)], correct);
      break;
    case "countIdenticalObjectsWithCommonMinimum":
      distractors = uniquePositive([unrestricted, nonEmpty, toSafeCount(countIdenticalSpecifiedRecipientAtLeastExact(e.objectCount, e.boxCount, e.minimumPerBox ?? 1), "single minimum distractor"), correct * e.boxCount], correct);
      break;
    case "countIdenticalObjectsWithSpecifiedRecipientMinimum":
      distractors = uniquePositive([unrestricted, nonEmpty, toSafeCount(countIdenticalToLabelledBoxesWithMinimumExact(e.objectCount, e.boxCount, e.specifiedMinimum ?? 1), "common minimum distractor"), correct - (e.specifiedMinimum ?? 1)], correct);
      break;
    case "countAllNonEmptyWithSpecifiedRecipientMinimum":
      distractors = uniquePositive([unrestricted, nonEmpty, toSafeCount(countIdenticalSpecifiedRecipientAtLeastExact(e.objectCount, e.boxCount, e.specifiedMinimum ?? 1), "specified-only distractor"), correct * e.boxCount], correct);
      break;
    case "countIdenticalObjectsWithUniformCapacity":
      distractors = uniquePositive([unrestricted, nonEmpty, correct + e.boxCount, Math.max(1, unrestricted - correct)], correct);
      break;
    case "countIdenticalObjectsToExactlyKIdenticalBoxes": {
      const k = e.nonEmptyBoxCount ?? 1;
      const labelledPositive = toSafeCount(countIdenticalToLabelledBoxesNonEmptyExact(e.objectCount, k), "labelled receiver distractor");
      const atMost = toSafeCount(countIdenticalToAtMostIdenticalBoxesExact(e.objectCount, k), "at-most partition distractor");
      distractors = uniquePositive([labelledPositive, atMost, unrestricted, correct * Math.max(2, k)], correct);
      break;
    }
    case "countIdenticalObjectsToAtMostKIdenticalBoxes": {
      const k = e.maximumNonEmptyBoxes ?? 1;
      const exact = toSafeCount(countIdenticalToIdenticalBoxesExact(e.objectCount, k), "exact partition distractor");
      const labelledPositive = toSafeCount(countIdenticalToLabelledBoxesNonEmptyExact(e.objectCount, k), "labelled positive distractor");
      distractors = uniquePositive([exact, labelledPositive, unrestricted, correct - exact], correct);
      break;
    }
  }
  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }
  const numeric = shuffleSeeded([correct, ...distractors.slice(0, 3)], createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp011-distribution-wave2-options`));
  return { options: numeric.map(String), correctIndex: numeric.indexOf(correct) };
}

function renderExplanation(parameters: Cp011DistributionWave2Parameters, solver: Cp011DistributionWave2SolverResult, verificationMethod: string): { explanationId: string; lines: string[] } {
  const authored = explanations[parameters.questionLanguageId];
  if (!authored) throw new Error(`Missing authored CP-011 distribution wave 2 explanation for ${parameters.questionLanguageId}`);
  const variables: Record<string, string | number> = {
    answer: solver.answer,
    equation: String.raw`\(${solver.mathJax}\)`,
    nonEmptyBoxCount: solver.evidence.nonEmptyBoxCount ?? parameters.renderVariables.nonEmptyBoxCount ?? "",
    maximumNonEmptyBoxes: solver.evidence.maximumNonEmptyBoxes ?? parameters.renderVariables.maximumNonEmptyBoxes ?? "",
    reservedObjects: solver.evidence.reservedObjects ?? "",
    residualObjects: solver.evidence.residualObjects ?? "",
    capacityPlusOne: solver.evidence.capacityPlusOne ?? "",
    verification: verificationMethod,
  };
  return { explanationId: parameters.questionLanguageId, lines: authored.lines.map((line) => renderTemplate(line, variables)) };
}

function latexBalanced(value: string): boolean {
  return value.split("\\(").length - 1 === value.split("\\)").length - 1
    && value.split("\\[").length - 1 === value.split("\\]").length - 1;
}

function commandContract(qlId: string, mathJax: string): boolean {
  if (["PNC-QL-229", "PNC-QL-230", "PNC-QL-231", "PNC-QL-232", "PNC-QL-233", "PNC-QL-234", "PNC-QL-235"].includes(qlId)) return mathJax.includes(String.raw`\binom`);
  if (qlId === "PNC-QL-236") return mathJax.includes(String.raw`\sum`) && mathJax.includes(String.raw`\binom`);
  if (qlId === "PNC-QL-237") return mathJax.includes("p_");
  if (qlId === "PNC-QL-238") return mathJax.includes(String.raw`\sum`) && mathJax.includes("p_");
  return false;
}

function check(name: string, passed: boolean, message: string): Cp011DistributionWave2ValidationCheck {
  return { name, passed, message };
}

function validatePackage(pkg: Omit<Cp011DistributionWave2QuestionPackage, "validation">): { valid: boolean; checks: Cp011DistributionWave2ValidationCheck[] } {
  const checks: Cp011DistributionWave2ValidationCheck[] = [];
  const entry = entries.find((candidate) => candidate.qlId === pkg.questionLanguageId);
  const explanationText = pkg.explanation.lines.join(" ");
  const visible = [pkg.stem, ...pkg.options, ...pkg.explanation.lines, pkg.solver.mathJax];
  checks.push(check("package", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must remain PNC-002"));
  checks.push(check("cp", pkg.canonicalProblemId === "PNC-CP-011", "Distribution wave 2 runtime accepts CP-011 only"));
  checks.push(check("entry", Boolean(entry), "QL must exist in the admitted distribution wave 2 inventory"));
  checks.push(check("mode", entry?.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("difficulty", entry?.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("task", pkg.taskKind === "groupingDistribution", "CP-011 distribution QLs must use groupingDistribution"));
  checks.push(check("solver", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Solver answer must be a positive integer"));
  checks.push(check("ceiling", pkg.solver.numericAnswer <= answerCeiling, "Answer must remain below the configured ceiling"));
  checks.push(check("independent", pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent enumeration must agree"));
  checks.push(check("options", pkg.options.length === 4 && new Set(pkg.options).size === 4, "Exactly four unique options are required"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  checks.push(check("correct-index", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to the answer"));
  checks.push(check("stem-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem), "Stem must resolve all placeholders"));
  checks.push(check("explanation-lines", pkg.explanation.lines.length >= 4, "Explanation must contain at least four lines"));
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the final answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(explanationText), "Explanation must resolve all placeholders"));
  checks.push(check("latex-balanced", visible.every(latexBalanced), "Visible LaTeX delimiters must be balanced"));
  checks.push(check("no-control-characters", visible.every((value) => !/[\u0000-\u001F\u007F]/.test(value)), "Learner-visible text and TeX must contain no control characters"));
  checks.push(check("tex-command-contract", commandContract(pkg.questionLanguageId, pkg.solver.mathJax), "Each solve contract must retain its required TeX commands"));
  checks.push(check("not-public", pkg.publiclyPublishable === false, "Runtime-proof questions must remain unpublished"));
  return { valid: checks.every((item) => item.passed), checks };
}

export function getCp011DistributionWave2Entries(): Cp011DistributionWave2Entry[] {
  return entries.map((entry) => ({ ...entry, requiredVariables: [...entry.requiredVariables] }));
}

export function runPnc002Cp011DistributionWave2Pipeline(input: { questionLanguageId?: string; difficulty?: Cp011DistributionWave2Difficulty; seed?: string; language?: "en" | "hi" | "pa" } = {}): Cp011DistributionWave2QuestionPackage {
  const language = input.language ?? "en";
  if (language !== "en") throw new Error(`PNC-CP-011 distribution wave 2 language ${language} is not implemented`);
  const seed = input.seed ?? "pnc-cp011-distribution-wave2-default";
  let entry: Cp011DistributionWave2Entry;
  if (input.questionLanguageId) {
    const found = entries.find((candidate) => candidate.qlId === input.questionLanguageId);
    if (!found) throw new Error(`Unknown CP-011 distribution wave 2 QL: ${input.questionLanguageId}`);
    if (input.difficulty && found.difficulty !== input.difficulty) throw new Error("Requested difficulty does not match selected CP-011 distribution wave 2 QL");
    entry = found;
  } else {
    const candidates = entries.filter((candidate) => !input.difficulty || candidate.difficulty === input.difficulty);
    if (!candidates.length) throw new Error("No admitted CP-011 distribution wave 2 QL matches the requested filters");
    entry = pickSeeded(candidates, createSeededRandom(`${seed}:cp011-distribution-wave2-entry`));
  }
  const parameters = generateParameters(entry, seed);
  const solver = solveCp011DistributionWave2(parameters);
  const independentVerification = verifyCp011DistributionWave2Independently(parameters);
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const optionBundle = buildOptions(parameters, solver);
  const explanation = renderExplanation(parameters, solver, independentVerification.method);
  const withoutValidation: Omit<Cp011DistributionWave2QuestionPackage, "validation"> = {
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
      receiverIdentityAudit: "EXPLICIT",
      sharedPackageIntegration: "DEFERRED_UNTIL_CP011_CHECKPOINT_APPROVAL",
    },
  };
  return { ...withoutValidation, validation: validatePackage(withoutValidation) };
}

export function auditCp011DistributionWave2Coverage(): Cp011DistributionWave2CoverageAudit {
  const expectedIds = Array.from({ length: 10 }, (_, index) => `PNC-QL-${String(index + 229).padStart(3, "0")}`);
  const activeIds = entries.map((entry) => entry.qlId);
  const missingQlIds = expectedIds.filter((id) => !activeIds.includes(id));
  const duplicateQlIds = [...new Set(activeIds.filter((id, index) => activeIds.indexOf(id) !== index))];
  const templates = new Map<string, string[]>();
  for (const entry of entries) {
    const normalized = entry.template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
    templates.set(normalized, [...(templates.get(normalized) ?? []), entry.qlId]);
  }
  const exactDuplicateTemplateGroups = [...templates.values()].filter((ids) => ids.length > 1);
  const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
  const solveModeCounts = Object.fromEntries([...new Set(entries.map((entry) => entry.solveMode))].map((mode) => [mode, entries.filter((entry) => entry.solveMode === mode).length]));
  const invalidRuntimeSamples: string[] = [];
  for (const entry of entries) {
    try {
      const sample = runPnc002Cp011DistributionWave2Pipeline({ questionLanguageId: entry.qlId, seed: `cp011-distribution-wave2-audit:${entry.qlId}` });
      if (!sample.validation.valid) invalidRuntimeSamples.push(`${entry.qlId}: ${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
    } catch (error) {
      invalidRuntimeSamples.push(`${entry.qlId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return {
    passed: missingQlIds.length === 0 && duplicateQlIds.length === 0 && exactDuplicateTemplateGroups.length === 0 && invalidRuntimeSamples.length === 0,
    activeQlCount: entries.length,
    expectedQlCount: expectedIds.length,
    missingQlIds,
    duplicateQlIds,
    exactDuplicateTemplateGroups,
    difficultyCounts,
    solveModeCounts,
    invalidRuntimeSamples,
  };
}
