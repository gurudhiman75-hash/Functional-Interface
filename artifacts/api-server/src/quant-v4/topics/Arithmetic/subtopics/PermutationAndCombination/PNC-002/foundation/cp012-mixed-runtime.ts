import questionLanguage from "../question-language.cp012-mixed.en.json";
import taskRegistry from "../task-registry.cp012-mixed.library.json";
import variableRanges from "../variable-ranges.cp012-mixed.library.json";
import explanationLibrary from "../explanation-by-ql.cp012-mixed.en.json";
import { createSeededRandom, hashSeed, pickSeeded, shuffleSeeded } from "./math";

export type Cp012Difficulty = "Easy" | "Medium" | "Hard";
export type Cp012SolveMode =
  | "countQuotaCommitteeWithTwoRoles"
  | "countQuotaCommitteeWomanChair"
  | "countQuotaCommitteeWomanChairManSecretary"
  | "countCompulsoryCommitteeWithTwoRoles"
  | "countQuotaCommitteeCategorySpecificThreeRoles"
  | "countSelectIncludePairThenLinearArrange"
  | "countSelectExcludePairThenLinearArrange"
  | "countCategoryQuotaThenLinearArrange"
  | "countCategoryQuotaThenCircularArrange"
  | "countQuotaCircularSpecifiedCrossPairTogether"
  | "countSpecifiedIncludedReversibleRing"
  | "countDerangements"
  | "countExactlyKFixedPoints"
  | "countAtLeastOneFixedPoint"
  | "countExactlyOneOfTwoSpecifiedFixed"
  | "countNeitherOfTwoSpecifiedFixed"
  | "countMonotoneGridPaths"
  | "countGridPathsThroughPoint"
  | "countGridPathsAvoidPoint"
  | "countGridPathsThroughAtLeastOneOfTwoPoints"
  | "countIdenticalObjectsNonUniformUpperCapacities"
  | "countIdenticalObjectsNonUniformLowerUpperBounds"
  | "countDistinctObjectsNonUniformCapacities"
  | "countTwoIdenticalColoursToLabelledBoxes"
  | "countTwoIdenticalColoursEveryBoxNonEmpty"
  | "countNamedEqualTeamsWithCaptainEach"
  | "countUnnamedEqualTeamsWithCaptainEach"
  | "countTwoNamedQuotaTeamsWithCaptains";

type GeneratedValue = number | number[];
type QlEntry = { qlId: string; difficulty: Cp012Difficulty; template: string };
type RegistryEntry = {
  qlIds: string[];
  solveMode: Cp012SolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  difficulty: Cp012Difficulty;
  distractorProfile: string;
};
type ExplanationRecord = { lines: string[] };

export interface Cp012Entry extends QlEntry {
  solveMode: Cp012SolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  distractorProfile: string;
}

export interface Cp012Parameters {
  packageId: "PNC-002";
  canonicalProblemId: "PNC-CP-012";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficulty: Cp012Difficulty;
  taskKind: "mixedAdvancedCounting";
  solveMode: Cp012SolveMode;
  scenarioFamily: string;
  distractorProfile: string;
  values: Record<string, GeneratedValue>;
  renderVariables: Record<string, string | number>;
}

export interface Cp012SolverResult {
  exactAnswer: string;
  answer: string;
  numericAnswer: number;
  equation: string;
  mathJax: string;
  evidence: {
    authority: string;
    stages: string[];
    distractors: number[];
    details: Record<string, number | number[] | string>;
  };
}

export interface Cp012ValidationCheck { name: string; passed: boolean; message: string }

export interface Cp012QuestionPackage {
  packageId: "PNC-002";
  archetypeId: "PNC-002";
  canonicalProblemId: "PNC-CP-012";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficultyBand: Cp012Difficulty;
  taskKind: "mixedAdvancedCounting";
  solveMode: Cp012SolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Cp012Parameters;
  solver: Cp012SolverResult;
  independentVerification: { supported: true; answer: number; method: string };
  explanation: { explanationId: string; lines: string[] };
  validation: { valid: boolean; checks: Cp012ValidationCheck[] };
  maturity: "RUNTIME_PROOF";
  publiclyPublishable: false;
  mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}

const qlEntries = questionLanguage.entries as QlEntry[];
const registryEntries = taskRegistry.groups as RegistryEntry[];
const explanations = explanationLibrary.entries as Record<string, ExplanationRecord>;
const answerCeiling = variableRanges.answerCeiling;
const registryByQl = new Map<string, RegistryEntry>();
for (const registry of registryEntries) {
  for (const qlId of registry.qlIds) {
    if (registryByQl.has(qlId)) throw new Error(`Duplicate CP-012 registry ownership for ${qlId}`);
    registryByQl.set(qlId, registry);
  }
}
const entries: Cp012Entry[] = qlEntries.map((ql) => {
  const registry = registryByQl.get(ql.qlId);
  if (!registry) throw new Error(`Missing CP-012 registry entry for ${ql.qlId}`);
  if (registry.difficulty !== ql.difficulty) throw new Error(`Difficulty mismatch for ${ql.qlId}`);
  if (!explanations[ql.qlId]) throw new Error(`Missing CP-012 explanation for ${ql.qlId}`);
  return { ...ql, solveMode: registry.solveMode, scenarioFamily: registry.scenarioFamily, requiredVariables: [...registry.requiredVariables], distractorProfile: registry.distractorProfile };
});
if (new Set(entries.map((entry) => entry.qlId)).size !== entries.length) throw new Error("Duplicate CP-012 QL IDs");
if (Object.keys(explanations).length !== entries.length) throw new Error("CP-012 explanation parity mismatch");

function assertInteger(value: number, label: string): void {
  if (!Number.isInteger(value)) throw new Error(`${label} must be an integer`);
}
function factorialExact(value: number): bigint {
  assertInteger(value, "factorial value");
  if (value < 0) throw new Error("factorial value must be non-negative");
  let result = 1n;
  for (let index = 2; index <= value; index += 1) result *= BigInt(index);
  return result;
}
function combinationExact(total: number, selected: number): bigint {
  assertInteger(total, "combination total");
  assertInteger(selected, "combination selected");
  if (total < 0 || selected < 0 || selected > total) return 0n;
  const reduced = Math.min(selected, total - selected);
  let numerator = 1n;
  let denominator = 1n;
  for (let index = 1; index <= reduced; index += 1) {
    numerator *= BigInt(total - reduced + index);
    denominator *= BigInt(index);
  }
  if (numerator % denominator !== 0n) throw new Error("Combination division was not exact");
  return numerator / denominator;
}
function permutationExact(total: number, selected: number): bigint {
  if (selected < 0 || selected > total) return 0n;
  let result = 1n;
  for (let index = 0; index < selected; index += 1) result *= BigInt(total - index);
  return result;
}
function powerExact(base: number, exponent: number): bigint {
  assertInteger(base, "power base");
  assertInteger(exponent, "power exponent");
  if (exponent < 0) throw new Error("power exponent must be non-negative");
  return BigInt(base) ** BigInt(exponent);
}
function exactDivide(numerator: bigint, denominator: bigint, label: string): bigint {
  if (denominator <= 0n || numerator % denominator !== 0n) throw new Error(`${label} division was not exact`);
  return numerator / denominator;
}
export function derangementExact(objectCount: number): bigint {
  assertInteger(objectCount, "object count");
  if (objectCount < 0) return 0n;
  if (objectCount === 0) return 1n;
  if (objectCount === 1) return 0n;
  let previousTwo = 1n;
  let previousOne = 0n;
  for (let n = 2; n <= objectCount; n += 1) {
    const current = BigInt(n - 1) * (previousOne + previousTwo);
    previousTwo = previousOne;
    previousOne = current;
  }
  return previousOne;
}
export function gridPathExact(rightSteps: number, upSteps: number): bigint {
  return combinationExact(rightSteps + upSteps, rightSteps);
}
function weakCompositionExact(objectCount: number, boxCount: number): bigint {
  if (boxCount === 0) return objectCount === 0 ? 1n : 0n;
  return combinationExact(objectCount + boxCount - 1, boxCount - 1);
}
function popcount(value: number): number {
  let count = 0;
  for (let current = value; current > 0; current >>= 1) count += current & 1;
  return count;
}
export function boundedIdenticalExact(objectCount: number, capacities: readonly number[]): bigint {
  let total = 0n;
  const boxCount = capacities.length;
  for (let mask = 0; mask < 2 ** boxCount; mask += 1) {
    let residual = objectCount;
    for (let index = 0; index < boxCount; index += 1) if ((mask & (1 << index)) !== 0) residual -= capacities[index]! + 1;
    const term = weakCompositionExact(residual, boxCount);
    total += popcount(mask) % 2 === 0 ? term : -term;
  }
  return total;
}
function boundedIdenticalWithMinimumsExact(objectCount: number, minimums: readonly number[], capacities: readonly number[]): bigint {
  const residual = objectCount - minimums.reduce((sum, value) => sum + value, 0);
  const shiftedCaps = capacities.map((capacity, index) => capacity - minimums[index]!);
  if (residual < 0 || shiftedCaps.some((value) => value < 0)) return 0n;
  return boundedIdenticalExact(residual, shiftedCaps);
}
function multinomialExact(occupancies: readonly number[]): bigint {
  const total = occupancies.reduce((sum, value) => sum + value, 0);
  const denominator = occupancies.reduce((product, value) => product * factorialExact(value), 1n);
  return exactDivide(factorialExact(total), denominator, "multinomial");
}
export function distinctCapacityExact(objectCount: number, capacities: readonly number[]): bigint {
  let total = 0n;
  const occupancies = Array(capacities.length).fill(0) as number[];
  const visit = (box: number, remaining: number): void => {
    if (box === capacities.length - 1) {
      if (remaining <= capacities[box]!) {
        occupancies[box] = remaining;
        total += multinomialExact(occupancies);
      }
      return;
    }
    for (let value = 0; value <= Math.min(remaining, capacities[box]!); value += 1) {
      occupancies[box] = value;
      visit(box + 1, remaining - value);
    }
  };
  visit(0, objectCount);
  return total;
}
export function twoColourEveryBoxNonEmptyExact(redCount: number, blueCount: number, boxCount: number): bigint {
  let total = 0n;
  for (let excluded = 0; excluded <= boxCount; excluded += 1) {
    const remainingBoxes = boxCount - excluded;
    const term = combinationExact(boxCount, excluded)
      * weakCompositionExact(redCount, remainingBoxes)
      * weakCompositionExact(blueCount, remainingBoxes);
    total += excluded % 2 === 0 ? term : -term;
  }
  return total;
}

function numberValue(values: Record<string, GeneratedValue>, key: string): number {
  const value = values[key];
  if (typeof value !== "number") throw new Error(`CP-012 value ${key} is not numeric`);
  return value;
}
function numberArrayValue(values: Record<string, GeneratedValue>, key: string): number[] {
  const value = values[key];
  if (!Array.isArray(value) || !value.every(Number.isInteger)) throw new Error(`CP-012 value ${key} is not an integer array`);
  return [...value];
}
function toSafeCount(value: bigint, label: string): number {
  if (value < 0n || value > BigInt(answerCeiling) || value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`${label} exceeds the configured answer range`);
  return Number(value);
}
function renderTemplate(template: string, variables: Record<string, string | number>): string {
  const placeholders = [...template.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]!);
  let rendered = template;
  for (const key of placeholders) {
    if (!(key in variables)) throw new Error(`Missing CP-012 render variable ${key}`);
    rendered = rendered.split(`{${key}}`).join(String(variables[key]));
  }
  for (const key of placeholders) if (rendered.includes(`{${key}}`)) throw new Error(`Unresolved CP-012 placeholder ${key}`);
  return rendered;
}

function buildValues(entry: Cp012Entry, seed: string): Record<string, GeneratedValue> {
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp012-parameters`);
  const pools = variableRanges.pools;
  switch (entry.scenarioFamily) {
    case "quotaCommittee": {
      const state = pickSeeded(pools.quotaCommittee, random);
      return { ...state, committeeSize: state.selectedWomen + state.selectedMen };
    }
    case "compulsoryCommittee": return { ...pickSeeded(pools.compulsoryCommittee, random) };
    case "linearIncludeExclude": return { ...pickSeeded(pools.linearIncludeExclude, random) };
    case "quotaArrangement": {
      const state = pickSeeded(pools.quotaArrangement, random);
      return { ...state, arrangementCount: state.selectedWomen + state.selectedMen };
    }
    case "quotaCircularPair": {
      const state = pickSeeded(pools.quotaCircularPair, random);
      return { ...state, arrangementCount: state.selectedWomen + state.selectedMen };
    }
    case "specifiedReversibleRing": return { ...pickSeeded(pools.specifiedReversibleRing, random) };
    case "fixedPoints": {
      const state = pickSeeded(pools.fixedPoints, random);
      return entry.solveMode === "countExactlyKFixedPoints"
        ? { objectCount: state.objectCount, fixedCount: state.fixedCount }
        : { objectCount: state.objectCount };
    }
    case "gridBasic": return { ...pickSeeded(pools.gridBasic, random) };
    case "gridPoint": return { ...pickSeeded(pools.gridPoint, random) };
    case "gridTwoPoints": return { ...pickSeeded(pools.gridTwoPoints, random) };
    case "identicalCapacity": {
      const state = pickSeeded(pools.identicalCapacity, random);
      return { ...state, capacities: [...state.capacities] };
    }
    case "identicalBounds": {
      const state = pickSeeded(pools.identicalBounds, random);
      return { ...state, minimums: [...state.minimums], capacities: [...state.capacities] };
    }
    case "distinctCapacity": {
      const state = pickSeeded(pools.distinctCapacity, random);
      return { ...state, capacities: [...state.capacities] };
    }
    case "twoColourDistribution": return { ...pickSeeded(pools.twoColourDistribution, random) };
    case "equalTeamsCaptains": return { ...pickSeeded(pools.equalTeamsCaptains, random) };
    case "twoQuotaTeamsCaptains": return { ...pickSeeded(pools.twoQuotaTeamsCaptains, random) };
    default: throw new Error(`Unsupported CP-012 scenario family: ${entry.scenarioFamily}`);
  }
}

function generateParameters(entry: Cp012Entry, seed: string): Cp012Parameters {
  const values = buildValues(entry, seed);
  const renderVariables = Object.fromEntries(entry.requiredVariables.map((key) => [key, numberValue(values, key)]));
  return {
    packageId: "PNC-002",
    canonicalProblemId: "PNC-CP-012",
    questionLanguageId: entry.qlId,
    questionId: `${entry.qlId}-${hashSeed(`${seed}:${entry.qlId}`).toString(16).padStart(8, "0")}`,
    seed,
    language: "en",
    difficulty: entry.difficulty,
    taskKind: "mixedAdvancedCounting",
    solveMode: entry.solveMode,
    scenarioFamily: entry.scenarioFamily,
    distractorProfile: entry.distractorProfile,
    values,
    renderVariables,
  };
}

function solverResult(answer: bigint, equation: string, mathJax: string, authority: string, stages: string[], distractors: bigint[], details: Record<string, number | number[] | string>): Cp012SolverResult {
  const numericAnswer = toSafeCount(answer, "CP-012 answer");
  return {
    exactAnswer: answer.toString(),
    answer: String(numericAnswer),
    numericAnswer,
    equation,
    mathJax,
    evidence: {
      authority,
      stages,
      distractors: distractors.map((value) => toSafeCount(value < 0n ? -value : value, "CP-012 distractor evidence")),
      details,
    },
  };
}

export function solveCp012(parameters: Cp012Parameters): Cp012SolverResult {
  const v = parameters.values;
  switch (parameters.solveMode) {
    case "countQuotaCommitteeWithTwoRoles": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen"); const r = a + b;
      const selection = combinationExact(w, a) * combinationExact(m, b); const roles = permutationExact(r, 2); const answer = selection * roles;
      return solverResult(answer, `${selection} × ${roles} = ${answer}`, String.raw`\binom{${w}}{${a}}\binom{${m}}{${b}}\,{}^{${r}}P_{2}=${answer}`, "quota selection followed by ordered role assignment", ["select category quota", "assign two ordered offices"], [selection, selection * combinationExact(r, 2), factorialExact(r)], { committeeSize: r });
    }
    case "countQuotaCommitteeWomanChair": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen"); const r = a + b;
      const selection = combinationExact(w, a) * combinationExact(m, b); const answer = selection * BigInt(a) * BigInt(r - 1);
      return solverResult(answer, `${selection} × ${a} × ${r - 1} = ${answer}`, String.raw`\binom{${w}}{${a}}\binom{${m}}{${b}}(${a})(${r - 1})=${answer}`, "quota selection with category-restricted chair", ["select committee", "choose woman chair", "choose secretary"], [selection * permutationExact(r, 2), selection * BigInt(a), selection], { committeeSize: r });
    }
    case "countQuotaCommitteeWomanChairManSecretary": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen");
      const selection = combinationExact(w, a) * combinationExact(m, b); const answer = selection * BigInt(a) * BigInt(b);
      return solverResult(answer, `${selection} × ${a} × ${b} = ${answer}`, String.raw`\binom{${w}}{${a}}\binom{${m}}{${b}}(${a})(${b})=${answer}`, "quota selection with two category-specific offices", ["select committee", "choose woman chair", "choose man secretary"], [selection * permutationExact(a + b, 2), selection * BigInt(a + b), selection], { committeeSize: a + b });
    }
    case "countCompulsoryCommitteeWithTwoRoles": {
      const n = numberValue(v, "totalCount"); const r = numberValue(v, "committeeSize"); const selection = combinationExact(n - 1, r - 1); const roles = permutationExact(r, 2); const answer = selection * roles;
      return solverResult(answer, `${selection} × ${roles} = ${answer}`, String.raw`\binom{${n - 1}}{${r - 1}}\,{}^{${r}}P_{2}=${answer}`, "compulsory-member selection followed by roles", ["include specified member", "choose remaining committee", "assign roles"], [combinationExact(n, r) * roles, selection, combinationExact(n, r)], { committeeSize: r });
    }
    case "countQuotaCommitteeCategorySpecificThreeRoles": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen"); const selection = combinationExact(w, a) * combinationExact(m, b); const answer = selection * permutationExact(a, 2) * BigInt(b);
      return solverResult(answer, `${selection} × ${a * (a - 1)} × ${b} = ${answer}`, String.raw`\binom{${w}}{${a}}\binom{${m}}{${b}}\,{}^{${a}}P_{2}(${b})=${answer}`, "quota selection with three category-specific offices", ["select quota committee", "order two women into offices", "choose man secretary"], [selection * permutationExact(a + b, 3), selection * BigInt(a) * BigInt(b), selection], { committeeSize: a + b });
    }
    case "countSelectIncludePairThenLinearArrange": {
      const n = numberValue(v, "totalCount"); const r = numberValue(v, "arrangementCount"); const selection = combinationExact(n - 2, r - 2); const arrangement = factorialExact(r); const answer = selection * arrangement;
      return solverResult(answer, `${selection} × ${arrangement} = ${answer}`, String.raw`\binom{${n - 2}}{${r - 2}}${r}!=${answer}`, "compulsory-pair selection followed by linear arrangement", ["include pair", "choose remaining", "arrange selected set"], [permutationExact(n, r), selection, combinationExact(n, r) * arrangement], { arrangementFactor: toSafeCount(arrangement, "arrangement factor") });
    }
    case "countSelectExcludePairThenLinearArrange": {
      const n = numberValue(v, "totalCount"); const r = numberValue(v, "arrangementCount"); const selection = combinationExact(n - 2, r); const arrangement = factorialExact(r); const answer = selection * arrangement;
      return solverResult(answer, `${selection} × ${arrangement} = ${answer}`, String.raw`\binom{${n - 2}}{${r}}${r}!=${answer}`, "excluded-pair selection followed by linear arrangement", ["remove forbidden pair", "choose selected set", "arrange selected set"], [permutationExact(n, r), combinationExact(n, r) * arrangement, selection], { arrangementFactor: toSafeCount(arrangement, "arrangement factor") });
    }
    case "countCategoryQuotaThenLinearArrange": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen"); const r = a + b; const selection = combinationExact(w, a) * combinationExact(m, b); const answer = selection * factorialExact(r);
      return solverResult(answer, `${selection} × ${factorialExact(r)} = ${answer}`, String.raw`\binom{${w}}{${a}}\binom{${m}}{${b}}${r}!=${answer}`, "category quota followed by linear arrangement", ["select both category quotas", "arrange all selected people"], [selection, combinationExact(w + m, r) * factorialExact(r), factorialExact(r)], { arrangementFactor: toSafeCount(factorialExact(r), "arrangement factor") });
    }
    case "countCategoryQuotaThenCircularArrange": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen"); const r = a + b; const selection = combinationExact(w, a) * combinationExact(m, b); const answer = selection * factorialExact(r - 1);
      return solverResult(answer, `${selection} × ${factorialExact(r - 1)} = ${answer}`, String.raw`\binom{${w}}{${a}}\binom{${m}}{${b}}(${r - 1})!=${answer}`, "category quota followed by circular arrangement", ["select both categories", "factor out rotation"], [selection * factorialExact(r), selection, factorialExact(r - 1)], { arrangementFactor: toSafeCount(factorialExact(r - 1), "circular factor") });
    }
    case "countQuotaCircularSpecifiedCrossPairTogether": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen"); const r = a + b; const selection = combinationExact(w - 1, a - 1) * combinationExact(m - 1, b - 1); const answer = selection * 2n * factorialExact(r - 2);
      return solverResult(answer, `${selection} × 2 × ${factorialExact(r - 2)} = ${answer}`, String.raw`\binom{${w - 1}}{${a - 1}}\binom{${m - 1}}{${b - 1}}2(${r - 2})!=${answer}`, "specified cross-category circular block", ["force specified pair into selection", "form circular block", "allow two internal orders"], [selection * factorialExact(r - 1), selection * factorialExact(r - 2), 2n * factorialExact(r - 2)], { arrangementFactor: toSafeCount(2n * factorialExact(r - 2), "pair circular factor") });
    }
    case "countSpecifiedIncludedReversibleRing": {
      const n = numberValue(v, "totalCount"); const r = numberValue(v, "arrangementCount"); const selection = combinationExact(n - 1, r - 1); const circular = factorialExact(r - 1); const answer = exactDivide(selection * circular, 2n, "reversible ring");
      return solverResult(answer, `${selection} × ${circular} ÷ 2 = ${answer}`, String.raw`\binom{${n - 1}}{${r - 1}}\frac{(${r - 1})!}{2}=${answer}`, "specified inclusion with dihedral ring equivalence", ["include specified ornament", "factor rotation", "identify mirror pairs"], [selection * circular, combinationExact(n, r) * circular / 2n, circular / 2n], { arrangementFactor: toSafeCount(circular / 2n, "ring factor") });
    }
    case "countDerangements": {
      const n = numberValue(v, "objectCount"); const answer = derangementExact(n);
      return solverResult(answer, `D_${n} = ${answer}`, String.raw`D_{${n}}=(${n - 1})(D_{${n - 1}}+D_{${n - 2}})=${answer}`, "derangement recurrence", ["exclude every fixed position"], [factorialExact(n), factorialExact(n) - answer, derangementExact(n - 1)], {});
    }
    case "countExactlyKFixedPoints": {
      const n = numberValue(v, "objectCount"); const k = numberValue(v, "fixedCount"); const chooseFixed = combinationExact(n, k); const remainingDerangement = derangementExact(n - k); const answer = chooseFixed * remainingDerangement;
      return solverResult(answer, `${chooseFixed} × ${remainingDerangement} = ${answer}`, String.raw`\binom{${n}}{${k}}D_{${n - k}}=${answer}`, "choose fixed positions then derange the rest", ["choose exact fixed set", "derange remaining objects"], [chooseFixed, chooseFixed * factorialExact(n - k), derangementExact(n)], { fixedCount: k });
    }
    case "countAtLeastOneFixedPoint": {
      const n = numberValue(v, "objectCount"); const all = factorialExact(n); const deranged = derangementExact(n); const answer = all - deranged;
      return solverResult(answer, `${all} - ${deranged} = ${answer}`, String.raw`${n}!-D_{${n}}=${answer}`, "complement of derangements", ["count all permutations", "subtract no-fixed-point cases"], [deranged, all, derangementExact(n - 1)], {});
    }
    case "countExactlyOneOfTwoSpecifiedFixed": {
      const n = numberValue(v, "objectCount"); const oneChosen = factorialExact(n - 1) - factorialExact(n - 2); const answer = 2n * oneChosen;
      return solverResult(answer, `2 × (${factorialExact(n - 1)} - ${factorialExact(n - 2)}) = ${answer}`, String.raw`2\left[(${n - 1})!-(${n - 2})!\right]=${answer}`, "symmetric exactly-one event", ["choose which specified object is fixed", "exclude both-fixed overlap"], [oneChosen, 2n * factorialExact(n - 1), derangementExact(n)], {});
    }
    case "countNeitherOfTwoSpecifiedFixed": {
      const n = numberValue(v, "objectCount"); const answer = factorialExact(n) - 2n * factorialExact(n - 1) + factorialExact(n - 2);
      return solverResult(answer, `${factorialExact(n)} - 2 × ${factorialExact(n - 1)} + ${factorialExact(n - 2)} = ${answer}`, String.raw`${n}!-2(${n - 1})!+(${n - 2})!=${answer}`, "two-event inclusion-exclusion", ["exclude first fixed", "exclude second fixed", "restore both-fixed overlap"], [derangementExact(n), factorialExact(n) - 2n * factorialExact(n - 1), factorialExact(n)], {});
    }
    case "countMonotoneGridPaths": {
      const r = numberValue(v, "rightSteps"); const u = numberValue(v, "upSteps"); const answer = gridPathExact(r, u);
      return solverResult(answer, `C(${r + u}, ${r}) = ${answer}`, String.raw`\binom{${r + u}}{${r}}=${answer}`, "monotone move-sequence selection", ["choose right-move positions"], [BigInt(r * u), factorialExact(r + u), combinationExact(r + u, u - 1)], {});
    }
    case "countGridPathsThroughPoint": {
      const r = numberValue(v, "rightSteps"); const u = numberValue(v, "upSteps"); const x = numberValue(v, "pointX"); const y = numberValue(v, "pointY"); const first = gridPathExact(x, y); const second = gridPathExact(r - x, u - y); const answer = first * second;
      return solverResult(answer, `${first} × ${second} = ${answer}`, String.raw`\binom{${x + y}}{${x}}\binom{${r - x + u - y}}{${r - x}}=${answer}`, "path decomposition at a checkpoint", ["reach checkpoint", "continue to destination"], [first, second, gridPathExact(r, u)], {});
    }
    case "countGridPathsAvoidPoint": {
      const r = numberValue(v, "rightSteps"); const u = numberValue(v, "upSteps"); const x = numberValue(v, "pointX"); const y = numberValue(v, "pointY"); const all = gridPathExact(r, u); const through = gridPathExact(x, y) * gridPathExact(r - x, u - y); const answer = all - through;
      return solverResult(answer, `${all} - ${through} = ${answer}`, String.raw`\binom{${r + u}}{${r}}-\binom{${x + y}}{${x}}\binom{${r - x + u - y}}{${r - x}}=${answer}`, "checkpoint complement", ["count all shortest paths", "subtract paths through forbidden point"], [through, all, gridPathExact(x, y)], {});
    }
    case "countGridPathsThroughAtLeastOneOfTwoPoints": {
      const r = numberValue(v, "rightSteps"); const u = numberValue(v, "upSteps"); const ax = numberValue(v, "firstX"); const ay = numberValue(v, "firstY"); const bx = numberValue(v, "secondX"); const by = numberValue(v, "secondY");
      const throughA = gridPathExact(ax, ay) * gridPathExact(r - ax, u - ay); const throughB = gridPathExact(bx, by) * gridPathExact(r - bx, u - by); const throughBoth = gridPathExact(ax, ay) * gridPathExact(bx - ax, by - ay) * gridPathExact(r - bx, u - by); const answer = throughA + throughB - throughBoth;
      return solverResult(answer, `${throughA} + ${throughB} - ${throughBoth} = ${answer}`, String.raw`N(A)+N(B)-N(A\cap B)=${throughA}+${throughB}-${throughBoth}=${answer}`, "ordered-checkpoint inclusion-exclusion", ["count paths through first", "count paths through second", "subtract paths through both"], [throughA + throughB, throughBoth, gridPathExact(r, u)], {});
    }
    case "countIdenticalObjectsNonUniformUpperCapacities": {
      const n = numberValue(v, "objectCount"); const caps = numberArrayValue(v, "capacities"); const answer = boundedIdenticalExact(n, caps); const unbounded = weakCompositionExact(n, caps.length);
      return solverResult(answer, `bounded weak-composition sum = ${answer}`, String.raw`\sum_{S\subseteq\{1,2,3\}}(-1)^{|S|}\binom{${n}-\sum_{i\in S}(c_i+1)+2}{2}=${answer}`, "non-uniform bounded stars and bars", ["start from weak compositions", "apply capacity inclusion-exclusion"], [unbounded, unbounded - answer, factorialExact(caps.length)], { capacities: caps });
    }
    case "countIdenticalObjectsNonUniformLowerUpperBounds": {
      const n = numberValue(v, "objectCount"); const minimums = numberArrayValue(v, "minimums"); const caps = numberArrayValue(v, "capacities"); const residual = n - minimums.reduce((sum, value) => sum + value, 0); const shifted = caps.map((cap, index) => cap - minimums[index]!); const answer = boundedIdenticalWithMinimumsExact(n, minimums, caps); const shiftedUnbounded = weakCompositionExact(residual, caps.length);
      return solverResult(answer, `shift to residual ${residual}, then bounded count = ${answer}`, String.raw`y_i=x_i-m_i,\quad \sum y_i=${residual},\quad 0\le y_i\le c_i-m_i\Rightarrow ${answer}`, "lower-bound shift plus non-uniform capacity inclusion-exclusion", ["reserve minimums", "shift capacities", "count residual allocations"], [shiftedUnbounded, boundedIdenticalExact(n, caps), answer + 1n], { minimums, capacities: caps, shiftedCapacities: shifted });
    }
    case "countDistinctObjectsNonUniformCapacities": {
      const n = numberValue(v, "objectCount"); const caps = numberArrayValue(v, "capacities"); const answer = distinctCapacityExact(n, caps); const unrestricted = powerExact(caps.length, n); const identicalMistake = boundedIdenticalExact(n, caps);
      return solverResult(answer, `sum of feasible multinomial occupancies = ${answer}`, String.raw`\sum_{\substack{x_1+x_2+x_3=${n}\\0\le x_i\le c_i}}\frac{${n}!}{x_1!x_2!x_3!}=${answer}`, "finite multinomial occupancy sum", ["enumerate feasible occupancy vectors", "weight each by a multinomial"], [unrestricted, identicalMistake, unrestricted - answer], { capacities: caps });
    }
    case "countTwoIdenticalColoursToLabelledBoxes": {
      const red = numberValue(v, "redCount"); const blue = numberValue(v, "blueCount"); const boxes = numberValue(v, "boxCount"); const redWays = weakCompositionExact(red, boxes); const blueWays = weakCompositionExact(blue, boxes); const answer = redWays * blueWays;
      return solverResult(answer, `${redWays} × ${blueWays} = ${answer}`, String.raw`\binom{${red + boxes - 1}}{${boxes - 1}}\binom{${blue + boxes - 1}}{${boxes - 1}}=${answer}`, "product of independent colour compositions", ["distribute red", "distribute blue"], [weakCompositionExact(red + blue, boxes), redWays + blueWays, redWays], {});
    }
    case "countTwoIdenticalColoursEveryBoxNonEmpty": {
      const red = numberValue(v, "redCount"); const blue = numberValue(v, "blueCount"); const boxes = numberValue(v, "boxCount"); const answer = twoColourEveryBoxNonEmptyExact(red, blue, boxes); const unrestricted = weakCompositionExact(red, boxes) * weakCompositionExact(blue, boxes); const eachColourPositive = (red >= boxes && blue >= boxes) ? combinationExact(red - 1, boxes - 1) * combinationExact(blue - 1, boxes - 1) : 0n;
      return solverResult(answer, `two-colour empty-box inclusion-exclusion = ${answer}`, String.raw`\sum_{j=0}^{${boxes - 1}}(-1)^j\binom{${boxes}}{j}\binom{${red + boxes - 1}-j}{${boxes - 1}-j}\binom{${blue + boxes - 1}-j}{${boxes - 1}-j}=${answer}`, "inclusion-exclusion over boxes empty in both colours", ["count unrestricted colour compositions", "exclude jointly empty boxes"], [unrestricted, eachColourPositive, unrestricted - answer], {});
    }
    case "countNamedEqualTeamsWithCaptainEach": {
      const n = numberValue(v, "totalCount"); const k = numberValue(v, "teamCount"); const s = numberValue(v, "teamSize"); const grouping = exactDivide(factorialExact(n), powerExact(toSafeCount(factorialExact(s), "team factorial"), k), "named equal teams"); const captains = powerExact(s, k); const answer = grouping * captains;
      return solverResult(answer, `${grouping} × ${captains} = ${answer}`, String.raw`\frac{${n}!}{(${s}!)^{${k}}}\,${s}^{${k}}=${answer}`, "labelled equal grouping followed by one role per team", ["form named equal teams", "choose each captain"], [grouping, exactDivide(grouping, factorialExact(k), "unnamed mistake") * captains, captains], { teamSize: s, teamCount: k });
    }
    case "countUnnamedEqualTeamsWithCaptainEach": {
      const n = numberValue(v, "totalCount"); const k = numberValue(v, "teamCount"); const s = numberValue(v, "teamSize"); const namedGrouping = exactDivide(factorialExact(n), powerExact(toSafeCount(factorialExact(s), "team factorial"), k), "named equal teams"); const grouping = exactDivide(namedGrouping, factorialExact(k), "unnamed equal teams"); const captains = powerExact(s, k); const answer = grouping * captains;
      return solverResult(answer, `${namedGrouping} ÷ ${factorialExact(k)} × ${captains} = ${answer}`, String.raw`\frac{${n}!}{(${s}!)^{${k}}${k}!}\,${s}^{${k}}=${answer}`, "unlabelled equal grouping followed by one captain per group", ["form equal groups", "remove whole-team label symmetry", "choose captains"], [namedGrouping * captains, grouping, captains], { teamSize: s, teamCount: k });
    }
    case "countTwoNamedQuotaTeamsWithCaptains": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const s = numberValue(v, "teamSize"); const a = numberValue(v, "teamAWomen"); const selection = combinationExact(w, a) * combinationExact(m, s - a); const captainChoices = BigInt(s * s); const answer = selection * captainChoices;
      return solverResult(answer, `${selection} × ${s} × ${s} = ${answer}`, String.raw`\binom{${w}}{${a}}\binom{${m}}{${s - a}}${s}^{2}=${answer}`, "category quota across named teams followed by captain roles", ["construct Team A quota", "derive Team B", "choose both captains"], [selection, combinationExact(w + m, s) * captainChoices, captainChoices], { teamSize: s });
    }
  }
}

function combinationsOf(values: readonly number[], selected: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  const visit = (index: number): void => {
    if (current.length === selected) { result.push([...current]); return; }
    if (values.length - index < selected - current.length) return;
    for (let cursor = index; cursor < values.length; cursor += 1) { current.push(values[cursor]!); visit(cursor + 1); current.pop(); }
  };
  visit(0);
  return result;
}
function permutationCountByEnumeration(values: readonly number[], predicate: (permutation: readonly number[]) => boolean = () => true): bigint {
  const used = Array(values.length).fill(false) as boolean[];
  const current: number[] = [];
  let count = 0n;
  const visit = (): void => {
    if (current.length === values.length) { if (predicate(current)) count += 1n; return; }
    for (let index = 0; index < values.length; index += 1) if (!used[index]) { used[index] = true; current.push(values[index]!); visit(); current.pop(); used[index] = false; }
  };
  visit();
  return count;
}
function circularCount(selected: readonly number[], predicate: (cycle: readonly number[]) => boolean = () => true, reflectionEquivalent = false): bigint {
  const anchor = Math.min(...selected);
  const rest = selected.filter((value) => value !== anchor);
  let count = 0n;
  const used = Array(rest.length).fill(false) as boolean[];
  const current: number[] = [];
  const visit = (): void => {
    if (current.length === rest.length) {
      const cycle = [anchor, ...current];
      if (!predicate(cycle)) return;
      if (reflectionEquivalent) {
        const reverse = [anchor, ...[...current].reverse()];
        const forwardKey = cycle.join(","); const reverseKey = reverse.join(",");
        if (forwardKey > reverseKey) return;
      }
      count += 1n;
      return;
    }
    for (let index = 0; index < rest.length; index += 1) if (!used[index]) { used[index] = true; current.push(rest[index]!); visit(); current.pop(); used[index] = false; }
  };
  visit();
  return count;
}
function adjacentInCycle(cycle: readonly number[], first: number, second: number): boolean {
  const firstIndex = cycle.indexOf(first); const secondIndex = cycle.indexOf(second); const distance = Math.abs(firstIndex - secondIndex);
  return distance === 1 || distance === cycle.length - 1;
}
function enumerateCompositions(total: number, parts: number, predicate: (values: readonly number[]) => boolean): bigint {
  const values = Array(parts).fill(0) as number[];
  let count = 0n;
  const visit = (index: number, remaining: number): void => {
    if (index === parts - 1) { values[index] = remaining; if (predicate(values)) count += 1n; return; }
    for (let value = 0; value <= remaining; value += 1) { values[index] = value; visit(index + 1, remaining - value); }
  };
  visit(0, total);
  return count;
}
function enumerateGridPaths(right: number, up: number, predicate: (visited: ReadonlySet<string>) => boolean): bigint {
  let count = 0n;
  const visited = new Set<string>(["0,0"]);
  const visit = (x: number, y: number): void => {
    if (x === right && y === up) { if (predicate(visited)) count += 1n; return; }
    if (x < right) { visited.add(`${x + 1},${y}`); visit(x + 1, y); visited.delete(`${x + 1},${y}`); }
    if (y < up) { visited.add(`${x},${y + 1}`); visit(x, y + 1); visited.delete(`${x},${y + 1}`); }
  };
  visit(0, 0);
  return count;
}
function enumerateEqualUnlabelledTeams(total: number, teamSize: number): bigint {
  const remaining = Array.from({ length: total }, (_, index) => index);
  let count = 0n;
  const visit = (pool: number[]): void => {
    if (pool.length === 0) { count += 1n; return; }
    const anchor = pool[0]!;
    const partners = combinationsOf(pool.slice(1), teamSize - 1);
    for (const selectedPartners of partners) {
      const group = new Set([anchor, ...selectedPartners]);
      visit(pool.filter((value) => !group.has(value)));
    }
  };
  visit(remaining);
  return count;
}

export function verifyCp012Independently(parameters: Cp012Parameters): { supported: true; answer: number; method: string } {
  const v = parameters.values;
  let answer = 0n;
  let method = "";
  switch (parameters.solveMode) {
    case "countQuotaCommitteeWithTwoRoles":
    case "countQuotaCommitteeWomanChair":
    case "countQuotaCommitteeWomanChairManSecretary":
    case "countQuotaCommitteeCategorySpecificThreeRoles": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen"); const women = combinationsOf(Array.from({ length: w }, (_, i) => i), a); const men = combinationsOf(Array.from({ length: m }, (_, i) => w + i), b);
      for (const ws of women) for (const ms of men) {
        const committee = [...ws, ...ms];
        if (parameters.solveMode === "countQuotaCommitteeWithTwoRoles") answer += BigInt(committee.length * (committee.length - 1));
        else if (parameters.solveMode === "countQuotaCommitteeWomanChair") answer += BigInt(ws.length * (committee.length - 1));
        else if (parameters.solveMode === "countQuotaCommitteeWomanChairManSecretary") answer += BigInt(ws.length * ms.length);
        else answer += BigInt(ws.length * (ws.length - 1) * ms.length);
      }
      method = "explicit quota subsets followed by eligible ordered office loops";
      break;
    }
    case "countCompulsoryCommitteeWithTwoRoles": {
      const n = numberValue(v, "totalCount"); const r = numberValue(v, "committeeSize"); const others = Array.from({ length: n - 1 }, (_, i) => i + 1); const committees = combinationsOf(others, r - 1);
      for (const committee of committees) answer += BigInt((committee.length + 1) * committee.length);
      method = "explicit compulsory-member committees and office loops";
      break;
    }
    case "countSelectIncludePairThenLinearArrange":
    case "countSelectExcludePairThenLinearArrange": {
      const n = numberValue(v, "totalCount"); const r = numberValue(v, "arrangementCount"); const eligible = parameters.solveMode === "countSelectIncludePairThenLinearArrange" ? Array.from({ length: n - 2 }, (_, i) => i + 2) : Array.from({ length: n - 2 }, (_, i) => i + 2); const subsets = parameters.solveMode === "countSelectIncludePairThenLinearArrange" ? combinationsOf(eligible, r - 2).map((subset) => [0, 1, ...subset]) : combinationsOf(eligible, r);
      for (const subset of subsets) answer += permutationCountByEnumeration(subset);
      method = "explicit admissible subsets followed by permutation enumeration";
      break;
    }
    case "countCategoryQuotaThenLinearArrange": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen");
      for (const ws of combinationsOf(Array.from({ length: w }, (_, i) => i), a)) for (const ms of combinationsOf(Array.from({ length: m }, (_, i) => w + i), b)) answer += permutationCountByEnumeration([...ws, ...ms]);
      method = "category-subset enumeration followed by full row enumeration";
      break;
    }
    case "countCategoryQuotaThenCircularArrange": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen");
      for (const ws of combinationsOf(Array.from({ length: w }, (_, i) => i), a)) for (const ms of combinationsOf(Array.from({ length: m }, (_, i) => w + i), b)) answer += circularCount([...ws, ...ms]);
      method = "category subsets with reference-fixed cycle enumeration";
      break;
    }
    case "countQuotaCircularSpecifiedCrossPairTogether": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const a = numberValue(v, "selectedWomen"); const b = numberValue(v, "selectedMen"); const specifiedWoman = 0; const specifiedMan = w;
      for (const ws of combinationsOf(Array.from({ length: w - 1 }, (_, i) => i + 1), a - 1)) for (const ms of combinationsOf(Array.from({ length: m - 1 }, (_, i) => w + i + 1), b - 1)) answer += circularCount([specifiedWoman, specifiedMan, ...ws, ...ms], (cycle) => adjacentInCycle(cycle, specifiedWoman, specifiedMan));
      method = "forced cross-category selection with canonical circular adjacency enumeration";
      break;
    }
    case "countSpecifiedIncludedReversibleRing": {
      const n = numberValue(v, "totalCount"); const r = numberValue(v, "arrangementCount");
      for (const rest of combinationsOf(Array.from({ length: n - 1 }, (_, i) => i + 1), r - 1)) answer += circularCount([0, ...rest], () => true, true);
      method = "specified-inclusive subsets with canonical dihedral cycle representatives";
      break;
    }
    case "countDerangements":
    case "countExactlyKFixedPoints":
    case "countAtLeastOneFixedPoint":
    case "countExactlyOneOfTwoSpecifiedFixed":
    case "countNeitherOfTwoSpecifiedFixed": {
      const n = numberValue(v, "objectCount"); const k = v.fixedCount === undefined ? 0 : numberValue(v, "fixedCount"); const values = Array.from({ length: n }, (_, i) => i);
      answer = permutationCountByEnumeration(values, (permutation) => {
        const fixed = permutation.reduce((count, value, index) => count + (value === index ? 1 : 0), 0);
        if (parameters.solveMode === "countDerangements") return fixed === 0;
        if (parameters.solveMode === "countExactlyKFixedPoints") return fixed === k;
        if (parameters.solveMode === "countAtLeastOneFixedPoint") return fixed >= 1;
        const firstFixed = permutation[0] === 0; const secondFixed = permutation[1] === 1;
        return parameters.solveMode === "countExactlyOneOfTwoSpecifiedFixed" ? firstFixed !== secondFixed : !firstFixed && !secondFixed;
      });
      method = "complete permutation enumeration with fixed-position predicates";
      break;
    }
    case "countMonotoneGridPaths":
    case "countGridPathsThroughPoint":
    case "countGridPathsAvoidPoint":
    case "countGridPathsThroughAtLeastOneOfTwoPoints": {
      const r = numberValue(v, "rightSteps"); const u = numberValue(v, "upSteps");
      answer = enumerateGridPaths(r, u, (visited) => {
        if (parameters.solveMode === "countMonotoneGridPaths") return true;
        if (parameters.solveMode === "countGridPathsThroughPoint" || parameters.solveMode === "countGridPathsAvoidPoint") {
          const key = `${numberValue(v, "pointX")},${numberValue(v, "pointY")}`; const passes = visited.has(key); return parameters.solveMode === "countGridPathsThroughPoint" ? passes : !passes;
        }
        const first = `${numberValue(v, "firstX")},${numberValue(v, "firstY")}`; const second = `${numberValue(v, "secondX")},${numberValue(v, "secondY")}`; return visited.has(first) || visited.has(second);
      });
      method = "recursive shortest-path enumeration with visited-checkpoint predicates";
      break;
    }
    case "countIdenticalObjectsNonUniformUpperCapacities": {
      const n = numberValue(v, "objectCount"); const caps = numberArrayValue(v, "capacities"); answer = enumerateCompositions(n, caps.length, (occupancies) => occupancies.every((value, index) => value <= caps[index]!)); method = "complete weak-composition enumeration under individual capacities"; break;
    }
    case "countIdenticalObjectsNonUniformLowerUpperBounds": {
      const n = numberValue(v, "objectCount"); const minimums = numberArrayValue(v, "minimums"); const caps = numberArrayValue(v, "capacities"); answer = enumerateCompositions(n, caps.length, (occupancies) => occupancies.every((value, index) => value >= minimums[index]! && value <= caps[index]!)); method = "complete composition enumeration under lower and upper vectors"; break;
    }
    case "countDistinctObjectsNonUniformCapacities": {
      const n = numberValue(v, "objectCount"); const caps = numberArrayValue(v, "capacities"); const occupancies = Array(caps.length).fill(0) as number[]; let count = 0n;
      const visit = (object: number): void => { if (object === n) { count += 1n; return; } for (let box = 0; box < caps.length; box += 1) if (occupancies[box]! < caps[box]!) { occupancies[box]! += 1; visit(object + 1); occupancies[box]! -= 1; } };
      visit(0); answer = count; method = "explicit object-to-box assignment enumeration with live capacity checks"; break;
    }
    case "countTwoIdenticalColoursToLabelledBoxes":
    case "countTwoIdenticalColoursEveryBoxNonEmpty": {
      const red = numberValue(v, "redCount"); const blue = numberValue(v, "blueCount"); const boxes = numberValue(v, "boxCount"); const redCompositions: number[][] = [];
      const collect = (total: number, parts: number): number[][] => { const rows: number[][] = []; const current = Array(parts).fill(0) as number[]; const visit = (index: number, remaining: number): void => { if (index === parts - 1) { current[index] = remaining; rows.push([...current]); return; } for (let value = 0; value <= remaining; value += 1) { current[index] = value; visit(index + 1, remaining - value); } }; visit(0, total); return rows; };
      redCompositions.push(...collect(red, boxes)); const blueCompositions = collect(blue, boxes);
      for (const reds of redCompositions) for (const blues of blueCompositions) if (parameters.solveMode === "countTwoIdenticalColoursToLabelledBoxes" || reds.every((value, index) => value + blues[index]! > 0)) answer += 1n;
      method = "paired red/blue composition enumeration with total-occupancy predicate"; break;
    }
    case "countNamedEqualTeamsWithCaptainEach": {
      const n = numberValue(v, "totalCount"); const k = numberValue(v, "teamCount"); const s = numberValue(v, "teamSize"); const occupancies = Array(k).fill(0) as number[]; let assignments = 0n;
      const visit = (person: number): void => { if (person === n) { if (occupancies.every((value) => value === s)) assignments += 1n; return; } for (let team = 0; team < k; team += 1) if (occupancies[team]! < s) { occupancies[team]! += 1; visit(person + 1); occupancies[team]! -= 1; } };
      visit(0); answer = assignments * powerExact(s, k); method = "explicit labelled-team assignment enumeration followed by captain loops"; break;
    }
    case "countUnnamedEqualTeamsWithCaptainEach": {
      const n = numberValue(v, "totalCount"); const k = numberValue(v, "teamCount"); const s = numberValue(v, "teamSize"); answer = enumerateEqualUnlabelledTeams(n, s) * powerExact(s, k); method = "canonical smallest-member team partition enumeration followed by captain loops"; break;
    }
    case "countTwoNamedQuotaTeamsWithCaptains": {
      const w = numberValue(v, "womenCount"); const m = numberValue(v, "menCount"); const s = numberValue(v, "teamSize"); const a = numberValue(v, "teamAWomen"); const all = Array.from({ length: w + m }, (_, i) => i);
      for (const teamA of combinationsOf(all, s)) if (teamA.filter((value) => value < w).length === a) answer += BigInt(s * s);
      method = "explicit Team A quota subsets with two captain loops"; break;
    }
  }
  return { supported: true, answer: toSafeCount(answer, "independent CP-012 answer"), method };
}

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value <= answerCeiling && value !== correct))];
}
function buildOptions(parameters: Cp012Parameters, solver: Cp012SolverResult): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const distractors = uniquePositive(solver.evidence.distractors, correct);
  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate <= answerCeiling && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }
  const numeric = shuffleSeeded([correct, ...distractors.slice(0, 3)], createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp012-options`));
  return { options: numeric.map(String), correctIndex: numeric.indexOf(correct) };
}
function renderExplanation(parameters: Cp012Parameters, solver: Cp012SolverResult, verification: string): { explanationId: string; lines: string[] } {
  const authored = explanations[parameters.questionLanguageId];
  if (!authored) throw new Error(`Missing CP-012 explanation ${parameters.questionLanguageId}`);
  const variables: Record<string, string | number> = {
    ...parameters.renderVariables,
    answer: solver.answer,
    equation: String.raw`\(${solver.mathJax}\)`,
    verification,
    committeeSize: parameters.values.committeeSize === undefined ? "" : numberValue(parameters.values, "committeeSize"),
    arrangementFactor: typeof solver.evidence.details.arrangementFactor === "number" || typeof solver.evidence.details.arrangementFactor === "string"
      ? solver.evidence.details.arrangementFactor
      : "",
    fixedCount: parameters.values.fixedCount === undefined ? "" : numberValue(parameters.values, "fixedCount"),
    teamSize: parameters.values.teamSize === undefined ? "" : numberValue(parameters.values, "teamSize"),
    teamCount: parameters.values.teamCount === undefined ? "" : numberValue(parameters.values, "teamCount"),
    selectedWomen: parameters.values.selectedWomen === undefined ? "" : numberValue(parameters.values, "selectedWomen"),
  };
  return { explanationId: parameters.questionLanguageId, lines: authored.lines.map((line) => renderTemplate(line, variables)) };
}
function latexBalanced(value: string): boolean {
  return value.split("\\(").length - 1 === value.split("\\)").length - 1 && value.split("\\[").length - 1 === value.split("\\]").length - 1;
}
function check(name: string, passed: boolean, message: string): Cp012ValidationCheck { return { name, passed, message }; }
function validatePackage(pkg: Omit<Cp012QuestionPackage, "validation">): { valid: boolean; checks: Cp012ValidationCheck[] } {
  const entry = entries.find((candidate) => candidate.qlId === pkg.questionLanguageId);
  const visible = [pkg.stem, ...pkg.options, ...pkg.explanation.lines, pkg.solver.mathJax];
  const explanationText = pkg.explanation.lines.join(" ");
  const checks = [
    check("package", pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", "Package IDs must remain PNC-002"),
    check("cp", pkg.canonicalProblemId === "PNC-CP-012", "Runtime accepts CP-012 only"),
    check("entry", Boolean(entry), "QL must exist in the admitted CP-012 inventory"),
    check("mode", entry?.solveMode === pkg.solveMode, "QL and solve mode must agree"),
    check("difficulty", entry?.difficulty === pkg.difficultyBand, "QL and difficulty must agree"),
    check("solver", Number.isInteger(pkg.solver.numericAnswer) && pkg.solver.numericAnswer > 0, "Solver answer must be a positive integer"),
    check("ceiling", pkg.solver.numericAnswer <= answerCeiling, "Answer must remain below the ceiling"),
    check("independent", pkg.independentVerification.answer === pkg.solver.numericAnswer, "Independent verifier must agree"),
    check("options", pkg.options.length === 4 && new Set(pkg.options).size === 4, "Exactly four unique options are required"),
    check("positive-options", pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), "Options must be positive integers"),
    check("correct-index", pkg.options[pkg.correctIndex] === pkg.answer, "Correct index must point to the answer"),
    check("explanation-lines", pkg.explanation.lines.length >= 4, "At least four explanation lines are required"),
    check("explanation-answer", explanationText.includes(pkg.answer), "Explanation must state the answer"),
    check("latex", visible.every(latexBalanced), "Visible LaTeX delimiters must be balanced"),
    check("control-characters", visible.every((value) => !/[\u0000-\u001F\u007F]/.test(value)), "Visible content must contain no control characters"),
    check("tex-command", /\\(binom|frac|sum|left)|D_|!/.test(pkg.solver.mathJax), "MathJax must retain an explicit counting command"),
    check("not-public", pkg.publiclyPublishable === false, "Runtime-proof packages must remain unpublished"),
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export function getCp012Entries(): Cp012Entry[] { return entries.map((entry) => ({ ...entry, requiredVariables: [...entry.requiredVariables] })); }
export function runPnc002Cp012Pipeline(input: { questionLanguageId?: string; difficulty?: Cp012Difficulty; seed?: string; language?: "en" | "hi" | "pa" } = {}): Cp012QuestionPackage {
  const language = input.language ?? "en";
  if (language !== "en") throw new Error(`PNC-CP-012 language ${language} is not implemented`);
  const seed = input.seed ?? "pnc-cp012-default";
  let entry: Cp012Entry;
  if (input.questionLanguageId) {
    const found = entries.find((candidate) => candidate.qlId === input.questionLanguageId);
    if (!found) throw new Error(`Unknown CP-012 QL: ${input.questionLanguageId}`);
    if (input.difficulty && found.difficulty !== input.difficulty) throw new Error("Requested difficulty does not match selected CP-012 QL");
    entry = found;
  } else {
    const candidates = entries.filter((candidate) => !input.difficulty || candidate.difficulty === input.difficulty);
    if (!candidates.length) throw new Error("No admitted CP-012 QL matches the requested filters");
    entry = pickSeeded(candidates, createSeededRandom(`${seed}:cp012-entry`));
  }
  const parameters = generateParameters(entry, seed);
  const solver = solveCp012(parameters);
  const independentVerification = verifyCp012Independently(parameters);
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const options = buildOptions(parameters, solver);
  const explanation = renderExplanation(parameters, solver, independentVerification.method);
  const withoutValidation: Omit<Cp012QuestionPackage, "validation"> = {
    packageId: "PNC-002", archetypeId: "PNC-002", canonicalProblemId: "PNC-CP-012", questionLanguageId: entry.qlId, questionId: parameters.questionId, seed, language: "en", difficultyBand: entry.difficulty, taskKind: "mixedAdvancedCounting", solveMode: entry.solveMode, stem, options: options.options, correctIndex: options.correctIndex, answer: solver.answer, parameters, solver, independentVerification, explanation, maturity: "RUNTIME_PROOF", publiclyPublishable: false,
    mathematicalFingerprint: [entry.solveMode, ...Object.entries(parameters.values).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${Array.isArray(value) ? value.join("-") : value}`)].join("|"),
    traceability: { packageId: "PNC-002", canonicalProblemId: "PNC-CP-012", questionLanguageId: entry.qlId, formulaRendering: "LATEX_MATHJAX", sharedPackageIntegration: "DEFERRED_UNTIL_CP012_APPROVAL", ownershipReason: "COMBINES_MULTIPLE_MATURE_AUTHORITIES" },
  };
  return { ...withoutValidation, validation: validatePackage(withoutValidation) };
}

export function auditCp012Coverage(): { passed: boolean; activeQlCount: number; solveModeCount: number; difficultyCounts: Record<string, number>; missingIds: string[]; duplicateTemplates: string[][]; invalidSamples: string[] } {
  const expected = Array.from({ length: 28 }, (_, index) => `PNC-QL-${String(index + 242).padStart(3, "0")}`);
  const actual = entries.map((entry) => entry.qlId);
  const missingIds = expected.filter((id) => !actual.includes(id));
  const templateGroups = new Map<string, string[]>();
  for (const entry of entries) { const key = entry.template.toLowerCase().replace(/\{[A-Za-z][A-Za-z0-9_]*\}/g, "{value}").replace(/\s+/g, " ").trim(); templateGroups.set(key, [...(templateGroups.get(key) ?? []), entry.qlId]); }
  const duplicateTemplates = [...templateGroups.values()].filter((group) => group.length > 1);
  const invalidSamples: string[] = [];
  for (const entry of entries) {
    try { const sample = runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `cp012-audit:${entry.qlId}` }); if (!sample.validation.valid) invalidSamples.push(`${entry.qlId}:${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`); }
    catch (error) { invalidSamples.push(`${entry.qlId}:${error instanceof Error ? error.message : String(error)}`); }
  }
  const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
  const passed = entries.length === 28 && new Set(actual).size === 28 && missingIds.length === 0 && duplicateTemplates.length === 0 && invalidSamples.length === 0 && new Set(entries.map((entry) => entry.solveMode)).size === 28;
  return { passed, activeQlCount: entries.length, solveModeCount: new Set(entries.map((entry) => entry.solveMode)).size, difficultyCounts, missingIds, duplicateTemplates, invalidSamples };
}
