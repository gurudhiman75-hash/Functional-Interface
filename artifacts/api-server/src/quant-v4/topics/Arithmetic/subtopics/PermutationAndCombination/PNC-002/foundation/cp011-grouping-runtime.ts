import questionLanguage from "../question-language.cp011-grouping.en.json";
import taskRegistry from "../task-registry.cp011-grouping.library.json";
import variableRanges from "../variable-ranges.cp011-grouping.library.json";
import explanationLibrary from "../explanation-by-ql.cp011-grouping.en.json";
import constraintProfiles from "../constraint-profiles.cp011-grouping.library.json";
import {
  countLabelledPrescribedGroupsExact,
  countSpecifiedPairDifferentLabelledEqualGroupsExact,
  countSpecifiedPairDifferentUnlabelledEqualGroupsExact,
  countSpecifiedPairSameLabelledEqualGroupsExact,
  countSpecifiedPairSameUnlabelledEqualGroupsExact,
  countUnlabelledPrescribedGroupsExact,
  countUnnamedEqualGroupsExact,
  countUnnamedPairsExact,
  factorialExact,
} from "./cp011-discovery-core";
import { createSeededRandom, hashSeed, pickSeeded, shuffleSeeded } from "./math";

export type Cp011GroupingDifficulty = "Easy" | "Medium" | "Hard";
export type Cp011GroupingSolveMode =
  | "countLabelledPrescribedGroups"
  | "countUnlabelledPrescribedGroups"
  | "countUnlabelledEqualGroups"
  | "countSpecifiedPairSameLabelledEqualGroup"
  | "countSpecifiedPairDifferentLabelledEqualGroups"
  | "countSpecifiedPairSameUnlabelledEqualGroup"
  | "countSpecifiedPairDifferentUnlabelledEqualGroups";

type GeneratedValue = number | number[];

type QlEntry = {
  qlId: string;
  difficulty: Cp011GroupingDifficulty;
  template: string;
};

type RegistryEntry = {
  qlIds: string[];
  solveMode: Cp011GroupingSolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  constraintProfile: string;
  distractorProfile: string;
  difficulty: Cp011GroupingDifficulty;
};

type ExplanationRecord = { lines: string[] };

export interface Cp011GroupingEntry extends QlEntry {
  solveMode: Cp011GroupingSolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  constraintProfile: string;
  distractorProfile: string;
}

export interface Cp011GroupingParameters {
  packageId: "PNC-002";
  canonicalProblemId: "PNC-CP-011";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficulty: Cp011GroupingDifficulty;
  taskKind: "groupingDistribution";
  solveMode: Cp011GroupingSolveMode;
  scenarioFamily: string;
  constraintProfile: string;
  distractorProfile: string;
  values: Record<string, GeneratedValue>;
  renderVariables: Record<string, string | number>;
}

export type Cp011GroupingOperation =
  | "LABELLED_PRESCRIBED_GROUPS"
  | "UNLABELLED_PRESCRIBED_GROUPS"
  | "UNLABELLED_EQUAL_GROUPS"
  | "PAIR_SAME_LABELLED_EQUAL_GROUP"
  | "PAIR_DIFFERENT_LABELLED_EQUAL_GROUPS"
  | "PAIR_SAME_UNLABELLED_EQUAL_GROUP"
  | "PAIR_DIFFERENT_UNLABELLED_EQUAL_GROUPS";

export interface Cp011GroupingEvidence {
  operation: Cp011GroupingOperation;
  totalObjects: number;
  groupSizes: number[];
  groupCount: number;
  groupSize?: number;
  labelledGroups: boolean;
  labelledPrecursorCount: number;
  interchangeDivisor: number;
  unrestrictedCount: number;
  sameGroupCount?: number;
  differentGroupCount?: number;
  samePartnerSlots?: number;
  remainingPartnerSlots?: number;
}

export interface Cp011GroupingSolverResult {
  exactAnswer: string;
  answer: string;
  numericAnswer: number;
  equation: string;
  mathJax: string;
  evidence: Cp011GroupingEvidence;
}

export interface Cp011GroupingValidationCheck {
  name: string;
  passed: boolean;
  message: string;
}

export interface Cp011GroupingQuestionPackage {
  packageId: "PNC-002";
  archetypeId: "PNC-002";
  canonicalProblemId: "PNC-CP-011";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficultyBand: Cp011GroupingDifficulty;
  taskKind: "groupingDistribution";
  solveMode: Cp011GroupingSolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Cp011GroupingParameters;
  solver: Cp011GroupingSolverResult;
  independentVerification: { supported: true; answer: number; method: string };
  explanation: { explanationId: string; lines: string[] };
  validation: { valid: boolean; checks: Cp011GroupingValidationCheck[] };
  maturity: "RUNTIME_PROOF";
  publiclyPublishable: false;
  mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}

const qlEntries = questionLanguage.entries as QlEntry[];
const registryGroups = taskRegistry.groups as RegistryEntry[];
const explanations = explanationLibrary.entries as Record<string, ExplanationRecord>;
const constraints = constraintProfiles.profiles as Record<string, Record<string, string>>;
const answerCeiling = variableRanges.answerCeiling;

const registryByQl = new Map<string, RegistryEntry>();
for (const group of registryGroups) {
  for (const qlId of group.qlIds) {
    if (registryByQl.has(qlId)) throw new Error(`Duplicate CP-011 grouping registry ownership for ${qlId}`);
    registryByQl.set(qlId, group);
  }
}

const entries: Cp011GroupingEntry[] = qlEntries.map((ql) => {
  const registry = registryByQl.get(ql.qlId);
  if (!registry) throw new Error(`Missing CP-011 grouping registry record for ${ql.qlId}`);
  if (registry.difficulty !== ql.difficulty) throw new Error(`CP-011 grouping difficulty mismatch for ${ql.qlId}`);
  if (!constraints[registry.constraintProfile]) throw new Error(`Missing CP-011 constraint profile ${registry.constraintProfile}`);
  if (!explanations[ql.qlId]) throw new Error(`Missing CP-011 explanation for ${ql.qlId}`);
  return {
    ...ql,
    solveMode: registry.solveMode,
    scenarioFamily: registry.scenarioFamily,
    requiredVariables: [...registry.requiredVariables],
    constraintProfile: registry.constraintProfile,
    distractorProfile: registry.distractorProfile,
  };
});

if (new Set(entries.map((entry) => entry.qlId)).size !== entries.length) throw new Error("Duplicate CP-011 grouping QL IDs");
if (Object.keys(explanations).length !== entries.length) throw new Error("CP-011 grouping explanation parity mismatch");

function renderTemplate(template: string, variables: Record<string, string | number>): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) rendered = rendered.split(`{${key}}`).join(String(value));
  const unresolved = [...rendered.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]);
  if (unresolved.length) throw new Error(`Unresolved CP-011 placeholders: ${unresolved.join(", ")}`);
  return rendered;
}

function numberValue(values: Record<string, GeneratedValue>, key: string): number {
  const value = values[key];
  if (typeof value !== "number") throw new Error(`CP-011 value ${key} is not numeric`);
  return value;
}

function numberArrayValue(values: Record<string, GeneratedValue>, key: string): number[] {
  const value = values[key];
  if (!Array.isArray(value) || !value.every(Number.isInteger)) throw new Error(`CP-011 value ${key} is not an integer array`);
  return [...value];
}

function toSafeCount(value: bigint, label: string): number {
  if (value < 0n || value > BigInt(answerCeiling) || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`${label} exceeds the configured answer range`);
  }
  return Number(value);
}

function groupMultiplicityDivisor(groupSizes: readonly number[]): bigint {
  const multiplicities = new Map<number, number>();
  for (const size of groupSizes) multiplicities.set(size, (multiplicities.get(size) ?? 0) + 1);
  return [...multiplicities.values()].reduce((product, count) => product * factorialExact(count), 1n);
}

function combinationExactBigInt(total: number, selected: number): bigint {
  if (!Number.isInteger(total) || !Number.isInteger(selected) || selected < 0 || selected > total) return 0n;
  const reduced = Math.min(selected, total - selected);
  let numerator = 1n;
  let denominator = 1n;
  for (let index = 1; index <= reduced; index += 1) {
    numerator *= BigInt(total - reduced + index);
    denominator *= BigInt(index);
  }
  if (numerator % denominator !== 0n) throw new Error("Independent combination division was not exact");
  return numerator / denominator;
}

function exactDivide(numerator: bigint, denominator: bigint, label: string): bigint {
  if (denominator <= 0n || numerator % denominator !== 0n) throw new Error(`${label} division was not exact`);
  return numerator / denominator;
}

function independentLabelledPrescribed(groupSizes: readonly number[]): bigint {
  let remaining = groupSizes.reduce((sum, size) => sum + size, 0);
  let result = 1n;
  for (const size of groupSizes) {
    result *= combinationExactBigInt(remaining, size);
    remaining -= size;
  }
  return result;
}

function buildValues(entry: Cp011GroupingEntry, seed: string): Record<string, GeneratedValue> {
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp011-grouping-parameters`);
  const pools = variableRanges.pools;
  switch (entry.scenarioFamily) {
    case "labelledTwoUnequalGroups": {
      const state = pickSeeded(pools.labelledTwoUnequalGroups, random);
      return { ...state, totalObjects: state.firstGroupSize + state.secondGroupSize, groupSizes: [state.firstGroupSize, state.secondGroupSize] };
    }
    case "labelledEqualGroups": {
      const state = pickSeeded(pools.labelledEqualGroups, random);
      return { ...state, totalObjects: state.groupCount * state.groupSize, groupSizes: Array.from({ length: state.groupCount }, () => state.groupSize) };
    }
    case "unlabelledThreeDistinctSizes": {
      const state = pickSeeded(pools.unlabelledThreeDistinctSizes, random);
      return { ...state, totalObjects: state.firstGroupSize + state.secondGroupSize + state.thirdGroupSize, groupSizes: [state.firstGroupSize, state.secondGroupSize, state.thirdGroupSize] };
    }
    case "unlabelledEqualGroups": {
      const state = pickSeeded(pools.unlabelledEqualGroups, random);
      return { ...state, totalObjects: state.groupCount * state.groupSize, groupSizes: Array.from({ length: state.groupCount }, () => state.groupSize) };
    }
    case "unlabelledMixedRepeatedSizes": {
      const state = pickSeeded(pools.unlabelledMixedRepeatedSizes, random);
      const groupSizes = [
        ...Array.from({ length: state.smallGroupCount }, () => state.smallGroupSize),
        ...Array.from({ length: state.largeGroupCount }, () => state.largeGroupSize),
      ];
      return { ...state, totalObjects: groupSizes.reduce((sum, size) => sum + size, 0), groupSizes };
    }
    case "unnamedPairs": {
      const pairCount = pickSeeded(pools.unnamedPairCounts, random);
      return { pairCount, totalObjects: pairCount * 2, groupCount: pairCount, groupSize: 2, groupSizes: Array.from({ length: pairCount }, () => 2) };
    }
    case "specifiedPairLabelledEqualGroups": {
      const state = pickSeeded(pools.specifiedPairLabelledEqualGroups, random);
      return { ...state, totalObjects: state.groupCount * state.groupSize, groupSizes: Array.from({ length: state.groupCount }, () => state.groupSize) };
    }
    case "specifiedPairUnlabelledEqualGroups": {
      const state = pickSeeded(pools.specifiedPairUnlabelledEqualGroups, random);
      return { ...state, totalObjects: state.groupCount * state.groupSize, groupSizes: Array.from({ length: state.groupCount }, () => state.groupSize) };
    }
    default: throw new Error(`Unsupported CP-011 grouping scenario family: ${entry.scenarioFamily}`);
  }
}

function generateParameters(entry: Cp011GroupingEntry, seed: string): Cp011GroupingParameters {
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

function result(answer: bigint, equation: string, mathJax: string, evidence: Cp011GroupingEvidence): Cp011GroupingSolverResult {
  const numericAnswer = toSafeCount(answer, "CP-011 grouping answer");
  return { exactAnswer: answer.toString(), answer: String(numericAnswer), numericAnswer, equation, mathJax, evidence };
}

function groupBase(groupSizes: number[], labelledGroups: boolean): Omit<Cp011GroupingEvidence, "operation"> {
  const totalObjects = groupSizes.reduce((sum, size) => sum + size, 0);
  const labelledPrecursor = countLabelledPrescribedGroupsExact(groupSizes);
  const interchangeDivisor = labelledGroups ? 1n : groupMultiplicityDivisor(groupSizes);
  const unrestricted = labelledGroups ? labelledPrecursor : exactDivide(labelledPrecursor, interchangeDivisor, "group-base interchange");
  return {
    totalObjects,
    groupSizes,
    groupCount: groupSizes.length,
    groupSize: groupSizes.every((size) => size === groupSizes[0]) ? groupSizes[0] : undefined,
    labelledGroups,
    labelledPrecursorCount: toSafeCount(labelledPrecursor, "labelled precursor"),
    interchangeDivisor: toSafeCount(interchangeDivisor, "interchange divisor"),
    unrestrictedCount: toSafeCount(unrestricted, "unrestricted grouping count"),
  };
}

export function solveCp011Grouping(parameters: Cp011GroupingParameters): Cp011GroupingSolverResult {
  const groupSizes = numberArrayValue(parameters.values, "groupSizes");
  const totalObjects = numberValue(parameters.values, "totalObjects");
  switch (parameters.solveMode) {
    case "countLabelledPrescribedGroups": {
      const answer = countLabelledPrescribedGroupsExact(groupSizes);
      const denominator = groupSizes.map((size) => `${size}!`).join("\\,");
      const mathJax = `\\frac{${totalObjects}!}{${denominator}} = ${answer}`;
      return result(answer, `${totalObjects}! divided by the prescribed group-size factorials = ${answer}`, mathJax, {
        operation: "LABELLED_PRESCRIBED_GROUPS",
        ...groupBase(groupSizes, true),
      });
    }
    case "countUnlabelledPrescribedGroups": {
      const answer = countUnlabelledPrescribedGroupsExact(groupSizes);
      const divisor = groupMultiplicityDivisor(groupSizes);
      const denominator = groupSizes.map((size) => `${size}!`).join("\\,");
      const mathJax = `\\frac{${totalObjects}!}{${denominator}\\,${divisor}} = ${answer}`;
      return result(answer, `${totalObjects}! divided by group-size factorials and interchangeable-group divisor ${divisor} = ${answer}`, mathJax, {
        operation: "UNLABELLED_PRESCRIBED_GROUPS",
        ...groupBase(groupSizes, false),
      });
    }
    case "countUnlabelledEqualGroups": {
      const groupCount = numberValue(parameters.values, "groupCount");
      const groupSize = numberValue(parameters.values, "groupSize");
      const answer = parameters.scenarioFamily === "unnamedPairs"
        ? countUnnamedPairsExact(groupCount)
        : countUnnamedEqualGroupsExact(groupSize, groupCount);
      const mathJax = `\\frac{${totalObjects}!}{(${groupSize}!)^{${groupCount}}\\,${groupCount}!} = ${answer}`;
      return result(answer, `${totalObjects}! divided by within-group and whole-group reorderings = ${answer}`, mathJax, {
        operation: "UNLABELLED_EQUAL_GROUPS",
        ...groupBase(groupSizes, false),
      });
    }
    case "countSpecifiedPairSameLabelledEqualGroup": {
      const groupCount = numberValue(parameters.values, "groupCount");
      const groupSize = numberValue(parameters.values, "groupSize");
      const answer = countSpecifiedPairSameLabelledEqualGroupsExact(totalObjects, groupCount);
      const unrestricted = countLabelledPrescribedGroupsExact(groupSizes);
      const mathJax = `${unrestricted}\\times\\frac{${groupSize - 1}}{${totalObjects - 1}} = ${answer}`;
      return result(answer, `${unrestricted} multiplied by the same-group placement fraction = ${answer}`, mathJax, {
        operation: "PAIR_SAME_LABELLED_EQUAL_GROUP",
        ...groupBase(groupSizes, true),
        sameGroupCount: toSafeCount(answer, "same labelled count"),
        differentGroupCount: toSafeCount(unrestricted - answer, "different labelled count"),
        samePartnerSlots: groupSize - 1,
        remainingPartnerSlots: totalObjects - 1,
      });
    }
    case "countSpecifiedPairDifferentLabelledEqualGroups": {
      const groupCount = numberValue(parameters.values, "groupCount");
      const answer = countSpecifiedPairDifferentLabelledEqualGroupsExact(totalObjects, groupCount);
      const unrestricted = countLabelledPrescribedGroupsExact(groupSizes);
      const same = countSpecifiedPairSameLabelledEqualGroupsExact(totalObjects, groupCount);
      const mathJax = `${unrestricted}-${same} = ${answer}`;
      return result(answer, `${unrestricted} minus ${same} same-group divisions = ${answer}`, mathJax, {
        operation: "PAIR_DIFFERENT_LABELLED_EQUAL_GROUPS",
        ...groupBase(groupSizes, true),
        sameGroupCount: toSafeCount(same, "same labelled count"),
        differentGroupCount: toSafeCount(answer, "different labelled count"),
      });
    }
    case "countSpecifiedPairSameUnlabelledEqualGroup": {
      const groupCount = numberValue(parameters.values, "groupCount");
      const groupSize = numberValue(parameters.values, "groupSize");
      const answer = countSpecifiedPairSameUnlabelledEqualGroupsExact(totalObjects, groupCount);
      const unrestricted = countUnnamedEqualGroupsExact(groupSize, groupCount);
      const mathJax = `${unrestricted}\\times\\frac{${groupSize - 1}}{${totalObjects - 1}} = ${answer}`;
      return result(answer, `${unrestricted} unlabelled divisions multiplied by the same-group fraction = ${answer}`, mathJax, {
        operation: "PAIR_SAME_UNLABELLED_EQUAL_GROUP",
        ...groupBase(groupSizes, false),
        sameGroupCount: toSafeCount(answer, "same unlabelled count"),
        differentGroupCount: toSafeCount(unrestricted - answer, "different unlabelled count"),
        samePartnerSlots: groupSize - 1,
        remainingPartnerSlots: totalObjects - 1,
      });
    }
    case "countSpecifiedPairDifferentUnlabelledEqualGroups": {
      const groupCount = numberValue(parameters.values, "groupCount");
      const groupSize = numberValue(parameters.values, "groupSize");
      const answer = countSpecifiedPairDifferentUnlabelledEqualGroupsExact(totalObjects, groupCount);
      const unrestricted = countUnnamedEqualGroupsExact(groupSize, groupCount);
      const same = countSpecifiedPairSameUnlabelledEqualGroupsExact(totalObjects, groupCount);
      const mathJax = `${unrestricted}-${same} = ${answer}`;
      return result(answer, `${unrestricted} minus ${same} same-group divisions = ${answer}`, mathJax, {
        operation: "PAIR_DIFFERENT_UNLABELLED_EQUAL_GROUPS",
        ...groupBase(groupSizes, false),
        sameGroupCount: toSafeCount(same, "same unlabelled count"),
        differentGroupCount: toSafeCount(answer, "different unlabelled count"),
      });
    }
  }
}

export function verifyCp011GroupingIndependently(parameters: Cp011GroupingParameters): { supported: true; answer: number; method: string } {
  const sizes = numberArrayValue(parameters.values, "groupSizes");
  const totalObjects = numberValue(parameters.values, "totalObjects");
  const labelled = independentLabelledPrescribed(sizes);
  const symmetry = groupMultiplicityDivisor(sizes);
  let answer: bigint;
  let method: string;
  switch (parameters.solveMode) {
    case "countLabelledPrescribedGroups":
      answer = labelled;
      method = "sequential subset selection for each labelled group";
      break;
    case "countUnlabelledPrescribedGroups":
    case "countUnlabelledEqualGroups":
      answer = exactDivide(labelled, symmetry, "independent unlabelled grouping");
      method = "sequential subset selection followed by size-multiplicity quotient";
      break;
    case "countSpecifiedPairSameLabelledEqualGroup": {
      const groupSize = numberValue(parameters.values, "groupSize");
      answer = exactDivide(labelled * BigInt(groupSize - 1), BigInt(totalObjects - 1), "independent same labelled relation");
      method = "labelled sequential selection with pair-placement probability";
      break;
    }
    case "countSpecifiedPairDifferentLabelledEqualGroups": {
      const groupSize = numberValue(parameters.values, "groupSize");
      const same = exactDivide(labelled * BigInt(groupSize - 1), BigInt(totalObjects - 1), "independent same labelled relation");
      answer = labelled - same;
      method = "complement of independently counted same-group labelled divisions";
      break;
    }
    case "countSpecifiedPairSameUnlabelledEqualGroup": {
      const groupSize = numberValue(parameters.values, "groupSize");
      const sameLabelled = exactDivide(labelled * BigInt(groupSize - 1), BigInt(totalObjects - 1), "independent same labelled relation");
      answer = exactDivide(sameLabelled, symmetry, "independent same unlabelled relation");
      method = "same-group labelled selection followed by whole-group symmetry quotient";
      break;
    }
    case "countSpecifiedPairDifferentUnlabelledEqualGroups": {
      const groupSize = numberValue(parameters.values, "groupSize");
      const sameLabelled = exactDivide(labelled * BigInt(groupSize - 1), BigInt(totalObjects - 1), "independent same labelled relation");
      answer = exactDivide(labelled - sameLabelled, symmetry, "independent different unlabelled relation");
      method = "different-group labelled complement followed by whole-group symmetry quotient";
      break;
    }
  }
  return { supported: true, answer: toSafeCount(answer, "independent CP-011 grouping answer"), method };
}

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

function buildOptions(parameters: Cp011GroupingParameters, solver: Cp011GroupingSolverResult): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const e = solver.evidence;
  const factorialTotal = toSafeCount(factorialExact(e.totalObjects), "factorial distractor");
  let distractors: number[];
  if (parameters.solveMode === "countLabelledPrescribedGroups") {
    distractors = uniquePositive([
      factorialTotal,
      Math.floor(correct / Math.max(2, e.groupCount)),
      Math.floor(correct / Math.max(2, e.interchangeDivisor)),
      e.groupSizes.length > 0 ? toSafeCount(combinationExactBigInt(e.totalObjects, e.groupSizes[0]!), "first-group choice distractor") : 1,
    ], correct);
  } else if (
    parameters.solveMode === "countUnlabelledPrescribedGroups"
    || parameters.solveMode === "countUnlabelledEqualGroups"
  ) {
    distractors = uniquePositive([
      e.labelledPrecursorCount,
      factorialTotal,
      correct * Math.max(2, e.groupCount),
      Math.floor(e.labelledPrecursorCount / Math.max(2, e.groupCount)),
    ], correct);
  } else {
    const complement = parameters.solveMode.includes("Same") ? e.differentGroupCount : e.sameGroupCount;
    distractors = uniquePositive([
      e.unrestrictedCount,
      complement ?? 0,
      e.labelledGroups ? Math.floor(correct / Math.max(2, e.groupCount)) : correct * Math.max(2, e.interchangeDivisor),
      e.labelledPrecursorCount,
    ], correct);
  }
  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }
  const numeric = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp011-grouping-options`),
  );
  return { options: numeric.map(String), correctIndex: numeric.indexOf(correct) };
}

function renderExplanation(parameters: Cp011GroupingParameters, solver: Cp011GroupingSolverResult, verificationMethod: string): { explanationId: string; lines: string[] } {
  const authored = explanations[parameters.questionLanguageId];
  if (!authored) throw new Error(`Missing authored CP-011 explanation for ${parameters.questionLanguageId}`);
  const variables: Record<string, string | number> = {
    answer: solver.answer,
    equation: String.raw`\(${solver.mathJax}\)`,
    samePartnerSlots: solver.evidence.samePartnerSlots ?? "",
    remainingPartnerSlots: solver.evidence.remainingPartnerSlots ?? "",
    verification: verificationMethod,
  };
  return {
    explanationId: parameters.questionLanguageId,
    lines: authored.lines.map((line) => renderTemplate(line, variables)),
  };
}

function latexBalanced(value: string): boolean {
  return value.split("\\(").length - 1 === value.split("\\)").length - 1
    && value.split("\\[").length - 1 === value.split("\\]").length - 1;
}

function check(name: string, passed: boolean, message: string): Cp011GroupingValidationCheck {
  return { name, passed, message };
}

function validatePackage(pkg: Omit<Cp011GroupingQuestionPackage, "validation">): { valid: boolean; checks: Cp011GroupingValidationCheck[] } {
  const checks: Cp011GroupingValidationCheck[] = [];
  const entry = entries.find((candidate) => candidate.qlId === pkg.questionLanguageId);
  const explanationText = pkg.explanation.lines.join(" ");
  const visible = [pkg.stem, ...pkg.options, ...pkg.explanation.lines];
  checks.push(check("package", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must remain PNC-002"));
  checks.push(check("cp", pkg.canonicalProblemId === "PNC-CP-011", "Grouping runtime accepts CP-011 only"));
  checks.push(check("entry", Boolean(entry), "QL must exist in the admitted grouping inventory"));
  checks.push(check("mode", entry?.solveMode === pkg.solveMode, "QL and solve mode must agree"));
  checks.push(check("difficulty", entry?.difficulty === pkg.difficultyBand, "QL and difficulty must agree"));
  checks.push(check("task", pkg.taskKind === "groupingDistribution", "CP-011 grouping QLs must use groupingDistribution"));
  checks.push(check("solver", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Solver answer must be a positive integer"));
  checks.push(check("ceiling", pkg.solver.numericAnswer <= answerCeiling, "Answer must remain below the configured ceiling"));
  checks.push(check("independent", pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent derivation must agree"));
  checks.push(check("options", pkg.options.length === 4 && new Set(pkg.options).size === 4, "Exactly four unique options are required"));
  checks.push(check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"));
  checks.push(check("correct-index", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to the answer"));
  checks.push(check("stem-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem), "Stem must resolve all placeholders"));
  checks.push(check("explanation-lines", pkg.explanation.lines.length >= 4, "Explanation must contain at least four lines"));
  checks.push(check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the final answer"));
  checks.push(check("explanation-placeholders", !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(explanationText), "Explanation must resolve all placeholders"));
  checks.push(check("latex", visible.every(latexBalanced), "Visible LaTeX delimiters must be balanced"));
  checks.push(check("not-public", pkg.publiclyPublishable === false, "Runtime-proof questions must remain unpublished"));
  return { valid: checks.every((item) => item.passed), checks };
}

export function getCp011GroupingEntries(): Cp011GroupingEntry[] {
  return entries.map((entry) => ({ ...entry, requiredVariables: [...entry.requiredVariables] }));
}

export function runPnc002Cp011GroupingPipeline(input: { questionLanguageId?: string; difficulty?: Cp011GroupingDifficulty; seed?: string; language?: "en" | "hi" | "pa" } = {}): Cp011GroupingQuestionPackage {
  const language = input.language ?? "en";
  if (language !== "en") throw new Error(`PNC-CP-011 grouping language ${language} is not implemented`);
  const seed = input.seed ?? "pnc-cp011-grouping-default";
  let entry: Cp011GroupingEntry;
  if (input.questionLanguageId) {
    const found = entries.find((candidate) => candidate.qlId === input.questionLanguageId);
    if (!found) throw new Error(`Unknown CP-011 grouping QL: ${input.questionLanguageId}`);
    if (input.difficulty && found.difficulty !== input.difficulty) throw new Error("Requested difficulty does not match selected CP-011 grouping QL");
    entry = found;
  } else {
    const candidates = entries.filter((candidate) => !input.difficulty || candidate.difficulty === input.difficulty);
    if (!candidates.length) throw new Error("No admitted CP-011 grouping QL matches the requested filters");
    entry = pickSeeded(candidates, createSeededRandom(`${seed}:cp011-grouping-entry`));
  }
  const parameters = generateParameters(entry, seed);
  const solver = solveCp011Grouping(parameters);
  const independentVerification = verifyCp011GroupingIndependently(parameters);
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const optionBundle = buildOptions(parameters, solver);
  const explanation = renderExplanation(parameters, solver, independentVerification.method);
  const withoutValidation: Omit<Cp011GroupingQuestionPackage, "validation"> = {
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
      sharedPackageIntegration: "DEFERRED_UNTIL_GROUPING_CHECKPOINT_APPROVAL",
    },
  };
  return { ...withoutValidation, validation: validatePackage(withoutValidation) };
}
