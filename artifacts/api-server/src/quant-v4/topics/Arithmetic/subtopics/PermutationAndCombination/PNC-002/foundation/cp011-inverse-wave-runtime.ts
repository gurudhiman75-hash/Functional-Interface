import questionLanguage from "../question-language.cp011-inverse-wave.en.json";
import taskRegistry from "../task-registry.cp011-inverse-wave.library.json";
import variableRanges from "../variable-ranges.cp011-inverse-wave.library.json";
import explanationLibrary from "../explanation-by-ql.cp011-inverse-wave.en.json";
import constraintProfiles from "../constraint-profiles.cp011-inverse-wave.library.json";
import { countUnlabelledPrescribedGroupsExact } from "./cp011-discovery-core";
import {
  countDistinctToLabelledBoxesExact,
  countIdenticalToLabelledBoxesExact,
} from "./cp011-discovery-distribution";
import {
  enumerateIdenticalAllocations,
  enumerateLabelledAssignments,
  enumerateUnlabelledSetPartitions,
} from "./cp011-discovery-enumerators";
import { createSeededRandom, hashSeed, pickSeeded, shuffleSeeded } from "./math";

export type Cp011InverseDifficulty = "Medium" | "Hard";
export type Cp011InverseSolveMode =
  | "recoverTotalObjectsFromTwoUnnamedEqualGroups"
  | "recoverLabelledReceiverCountForDistinctObjects"
  | "recoverLabelledReceiverCountForIdenticalObjects";

type GeneratedValue = number | number[];
type QlEntry = { qlId: string; difficulty: Cp011InverseDifficulty; template: string };
type RegistryEntry = {
  qlIds: string[];
  solveMode: Cp011InverseSolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  constraintProfile: string;
  distractorProfile: string;
  difficulty: Cp011InverseDifficulty;
};
type ExplanationRecord = { lines: string[] };

export interface Cp011InverseEntry extends QlEntry {
  solveMode: Cp011InverseSolveMode;
  scenarioFamily: string;
  requiredVariables: string[];
  constraintProfile: string;
  distractorProfile: string;
}

export interface Cp011InverseParameters {
  packageId: "PNC-002";
  canonicalProblemId: "PNC-CP-011";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficulty: Cp011InverseDifficulty;
  taskKind: "groupingDistribution";
  solveMode: Cp011InverseSolveMode;
  scenarioFamily: string;
  constraintProfile: string;
  distractorProfile: string;
  values: Record<string, GeneratedValue>;
  renderVariables: Record<string, string | number>;
}

export interface Cp011InverseEvidence {
  operation: "INVERSE_UNNAMED_EQUAL_GROUPS" | "INVERSE_DISTINCT_LABELLED_RECEIVERS" | "INVERSE_IDENTICAL_LABELLED_RECEIVERS";
  target: number;
  solution: number;
  searchMinimum: number;
  searchMaximum: number;
  candidateValues: number[];
  candidateCounts: number[];
  objectCount?: number;
  groupCount?: number;
}

export interface Cp011InverseSolverResult {
  exactAnswer: string;
  answer: string;
  numericAnswer: number;
  equation: string;
  mathJax: string;
  evidence: Cp011InverseEvidence;
}

export interface Cp011InverseQuestionPackage {
  packageId: "PNC-002";
  archetypeId: "PNC-002";
  canonicalProblemId: "PNC-CP-011";
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficultyBand: Cp011InverseDifficulty;
  taskKind: "groupingDistribution";
  solveMode: Cp011InverseSolveMode;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Cp011InverseParameters;
  solver: Cp011InverseSolverResult;
  independentVerification: { supported: true; answer: number; method: string; candidateCounts: number[] };
  explanation: { explanationId: string; lines: string[] };
  validation: { valid: boolean; checks: { name: string; passed: boolean; message: string }[] };
  maturity: "RUNTIME_PROOF";
  publiclyPublishable: false;
  mathematicalFingerprint: string;
  traceability: Record<string, unknown>;
}

export interface Cp011InverseCoverageAudit {
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
    if (registryByQl.has(qlId)) throw new Error(`Duplicate CP-011 inverse registry ownership for ${qlId}`);
    registryByQl.set(qlId, group);
  }
}

const entries: Cp011InverseEntry[] = qlEntries.map((ql) => {
  const registry = registryByQl.get(ql.qlId);
  if (!registry) throw new Error(`Missing CP-011 inverse registry record for ${ql.qlId}`);
  if (registry.difficulty !== ql.difficulty) throw new Error(`CP-011 inverse difficulty mismatch for ${ql.qlId}`);
  if (!constraints[registry.constraintProfile]) throw new Error(`Missing CP-011 inverse constraint profile ${registry.constraintProfile}`);
  if (!explanations[ql.qlId]) throw new Error(`Missing CP-011 inverse explanation for ${ql.qlId}`);
  return {
    ...ql,
    solveMode: registry.solveMode,
    scenarioFamily: registry.scenarioFamily,
    requiredVariables: [...registry.requiredVariables],
    constraintProfile: registry.constraintProfile,
    distractorProfile: registry.distractorProfile,
  };
});
if (new Set(entries.map((entry) => entry.qlId)).size !== entries.length) throw new Error("Duplicate CP-011 inverse QL IDs");
if (Object.keys(explanations).length !== entries.length) throw new Error("CP-011 inverse explanation parity mismatch");

function renderTemplate(template: string, variables: Record<string, string | number>): string {
  const placeholders = [...template.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]!);
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) rendered = rendered.split(`{${key}}`).join(String(value));
  const unresolved = placeholders.filter((key) => rendered.includes(`{${key}}`));
  if (unresolved.length) throw new Error(`Unresolved CP-011 inverse placeholders: ${unresolved.join(", ")}`);
  return rendered;
}

function numberValue(values: Record<string, GeneratedValue>, key: string): number {
  const value = values[key];
  if (typeof value !== "number") throw new Error(`CP-011 inverse value ${key} is not numeric`);
  return value;
}

function toSafeCount(value: bigint, label: string): number {
  if (value < 0n || value > BigInt(answerCeiling) || value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`${label} exceeds the configured answer range`);
  return Number(value);
}

function countTwoUnnamedEqualGroups(totalObjects: number): bigint {
  if (!Number.isInteger(totalObjects) || totalObjects < 4 || totalObjects % 2 !== 0) return 0n;
  const size = totalObjects / 2;
  return countUnlabelledPrescribedGroupsExact([size, size]);
}

function boundedCandidates(mode: Cp011InverseSolveMode, minimum: number, maximum: number): number[] {
  const values: number[] = [];
  for (let candidate = minimum; candidate <= maximum; candidate += 1) {
    if (mode === "recoverTotalObjectsFromTwoUnnamedEqualGroups" && candidate % 2 !== 0) continue;
    values.push(candidate);
  }
  return values;
}

function recoverUnique(candidates: readonly number[], target: bigint, evaluator: (candidate: number) => bigint): { solution: number; counts: bigint[] } {
  const counts = candidates.map(evaluator);
  const matches = candidates.filter((_, index) => counts[index] === target);
  if (matches.length !== 1) throw new Error(`CP-011 inverse expected one bounded match, found ${matches.length}`);
  return { solution: matches[0]!, counts };
}

function buildValues(entry: Cp011InverseEntry, seed: string): Record<string, GeneratedValue> {
  const random = createSeededRandom(`${seed}:${entry.qlId}:cp011-inverse-parameters`);
  const pools = variableRanges.pools;
  switch (entry.scenarioFamily) {
    case "inverseTwoUnnamedEqualGroups": {
      const state = pickSeeded(pools.inverseTwoUnnamedEqualGroups, random);
      const target = countTwoUnnamedEqualGroups(state.solution);
      return { ...state, target: toSafeCount(target, "inverse equal-group target") };
    }
    case "inverseDistinctLabelledReceiverCount": {
      const state = pickSeeded(pools.inverseDistinctLabelledReceiverCount, random);
      const target = countDistinctToLabelledBoxesExact(state.objectCount, state.solution);
      return { ...state, target: toSafeCount(target, "inverse distinct receiver target") };
    }
    case "inverseIdenticalLabelledReceiverCount": {
      const state = pickSeeded(pools.inverseIdenticalLabelledReceiverCount, random);
      const target = countIdenticalToLabelledBoxesExact(state.objectCount, state.solution);
      return { ...state, target: toSafeCount(target, "inverse identical receiver target") };
    }
    default: throw new Error(`Unsupported CP-011 inverse scenario family: ${entry.scenarioFamily}`);
  }
}

function generateParameters(entry: Cp011InverseEntry, seed: string): Cp011InverseParameters {
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

export function solveCp011Inverse(parameters: Cp011InverseParameters): Cp011InverseSolverResult {
  const target = numberValue(parameters.values, "target");
  const searchMinimum = numberValue(parameters.values, "searchMinimum");
  const searchMaximum = numberValue(parameters.values, "searchMaximum");
  const candidates = boundedCandidates(parameters.solveMode, searchMinimum, searchMaximum);
  let recovered: { solution: number; counts: bigint[] };
  let mathJax: string;
  let equation: string;
  let operation: Cp011InverseEvidence["operation"];
  let objectCount: number | undefined;
  switch (parameters.solveMode) {
    case "recoverTotalObjectsFromTwoUnnamedEqualGroups":
      recovered = recoverUnique(candidates, BigInt(target), countTwoUnnamedEqualGroups);
      mathJax = String.raw`\frac{\binom{${recovered.solution}}{${recovered.solution / 2}}}{2}=${target}\Rightarrow n=${recovered.solution}`;
      equation = `the unique even total producing ${target} unnamed equal divisions is ${recovered.solution}`;
      operation = "INVERSE_UNNAMED_EQUAL_GROUPS";
      break;
    case "recoverLabelledReceiverCountForDistinctObjects":
      objectCount = numberValue(parameters.values, "objectCount");
      recovered = recoverUnique(candidates, BigInt(target), (candidate) => countDistinctToLabelledBoxesExact(objectCount!, candidate));
      mathJax = String.raw`${recovered.solution}^{${objectCount}}=${target}\Rightarrow b=${recovered.solution}`;
      equation = `the unique receiver count whose assignment power is ${target} is ${recovered.solution}`;
      operation = "INVERSE_DISTINCT_LABELLED_RECEIVERS";
      break;
    case "recoverLabelledReceiverCountForIdenticalObjects":
      objectCount = numberValue(parameters.values, "objectCount");
      recovered = recoverUnique(candidates, BigInt(target), (candidate) => countIdenticalToLabelledBoxesExact(objectCount!, candidate));
      mathJax = String.raw`\binom{${objectCount + recovered.solution - 1}}{${recovered.solution - 1}}=${target}\Rightarrow b=${recovered.solution}`;
      equation = `the unique receiver count whose weak-composition count is ${target} is ${recovered.solution}`;
      operation = "INVERSE_IDENTICAL_LABELLED_RECEIVERS";
      break;
  }
  const numericCounts = recovered.counts.map((count) => toSafeCount(count, "inverse candidate count"));
  return {
    exactAnswer: String(recovered.solution),
    answer: String(recovered.solution),
    numericAnswer: recovered.solution,
    equation,
    mathJax,
    evidence: {
      operation,
      target,
      solution: recovered.solution,
      searchMinimum,
      searchMaximum,
      candidateValues: candidates,
      candidateCounts: numericCounts,
      objectCount,
      groupCount: parameters.solveMode === "recoverTotalObjectsFromTwoUnnamedEqualGroups" ? 2 : undefined,
    },
  };
}

export function verifyCp011InverseIndependently(parameters: Cp011InverseParameters): { supported: true; answer: number; method: string; candidateCounts: number[] } {
  const target = numberValue(parameters.values, "target");
  const searchMinimum = numberValue(parameters.values, "searchMinimum");
  const searchMaximum = numberValue(parameters.values, "searchMaximum");
  const candidates = boundedCandidates(parameters.solveMode, searchMinimum, searchMaximum);
  let counts: bigint[];
  let method: string;
  switch (parameters.solveMode) {
    case "recoverTotalObjectsFromTwoUnnamedEqualGroups":
      counts = candidates.map((candidate) => enumerateUnlabelledSetPartitions(candidate, (groups) => groups.length === 2 && groups.every((group) => group.length === candidate / 2)));
      method = "bounded restricted-growth enumeration of two unnamed equal set partitions";
      break;
    case "recoverLabelledReceiverCountForDistinctObjects": {
      const objectCount = numberValue(parameters.values, "objectCount");
      counts = candidates.map((candidate) => enumerateLabelledAssignments(objectCount, candidate, () => true));
      method = "bounded exhaustive assignment enumeration for distinct objects";
      break;
    }
    case "recoverLabelledReceiverCountForIdenticalObjects": {
      const objectCount = numberValue(parameters.values, "objectCount");
      counts = candidates.map((candidate) => enumerateIdenticalAllocations(objectCount, candidate, () => true));
      method = "bounded exhaustive weak-composition enumeration for identical objects";
      break;
    }
  }
  const matches = candidates.filter((_, index) => counts[index] === BigInt(target));
  if (matches.length !== 1) throw new Error(`Independent CP-011 inverse expected one match, found ${matches.length}`);
  return { supported: true, answer: matches[0]!, method, candidateCounts: counts.map((count) => toSafeCount(count, "independent inverse candidate count")) };
}

function renderExplanation(parameters: Cp011InverseParameters, solver: Cp011InverseSolverResult): { explanationId: string; lines: string[] } {
  const authored = explanations[parameters.questionLanguageId];
  if (!authored) throw new Error(`Missing authored CP-011 inverse explanation for ${parameters.questionLanguageId}`);
  const variables: Record<string, string | number> = {
    answer: solver.answer,
    equation: String.raw`\(${solver.mathJax}\)`,
  };
  return { explanationId: parameters.questionLanguageId, lines: authored.lines.map((line) => renderTemplate(line, variables)) };
}

function latexBalanced(value: string): boolean {
  return value.split("\\(").length - 1 === value.split("\\)").length - 1
    && value.split("\\[").length - 1 === value.split("\\]").length - 1;
}

function commandContract(qlId: string, mathJax: string): boolean {
  if (qlId === "PNC-QL-239") return mathJax.includes(String.raw`\binom`) && mathJax.includes(String.raw`\frac`) && mathJax.includes(String.raw`\Rightarrow`);
  if (qlId === "PNC-QL-240") return mathJax.includes("^") && mathJax.includes(String.raw`\Rightarrow`);
  if (qlId === "PNC-QL-241") return mathJax.includes(String.raw`\binom`) && mathJax.includes(String.raw`\Rightarrow`);
  return false;
}

function validatePackage(pkg: Omit<Cp011InverseQuestionPackage, "validation">): { valid: boolean; checks: { name: string; passed: boolean; message: string }[] } {
  const entry = entries.find((candidate) => candidate.qlId === pkg.questionLanguageId);
  const explanationText = pkg.explanation.lines.join(" ");
  const visible = [pkg.stem, ...pkg.options, ...pkg.explanation.lines, pkg.solver.mathJax];
  const checks = [
    { name: "package", passed: pkg.packageId === "PNC-002" && pkg.archetypeId === "PNC-002", message: "Package IDs must remain PNC-002" },
    { name: "cp", passed: pkg.canonicalProblemId === "PNC-CP-011", message: "Inverse runtime accepts CP-011 only" },
    { name: "entry", passed: Boolean(entry), message: "QL must exist in the admitted inverse inventory" },
    { name: "mode", passed: entry?.solveMode === pkg.solveMode, message: "QL and solve mode must agree" },
    { name: "difficulty", passed: entry?.difficulty === pkg.difficultyBand, message: "QL and difficulty must agree" },
    { name: "task", passed: pkg.taskKind === "groupingDistribution", message: "CP-011 inverse QLs must use groupingDistribution" },
    { name: "unique-bounded-match", passed: pkg.solver.evidence.candidateCounts.filter((count) => count === pkg.solver.evidence.target).length === 1, message: "Production bounded search must have one target match" },
    { name: "independent", passed: pkg.independentVerification.answer === pkg.solver.numericAnswer && pkg.independentVerification.candidateCounts.join(",") === pkg.solver.evidence.candidateCounts.join(","), message: "Independent bounded enumeration must agree" },
    { name: "options", passed: pkg.options.length === 4 && new Set(pkg.options).size === 4, message: "Exactly four unique bounded options are required" },
    { name: "positive-options", passed: pkg.options.every((option) => Number.isInteger(Number(option)) && Number(option) > 0), message: "Options must be positive integers" },
    { name: "correct-index", passed: pkg.options[pkg.correctIndex] === pkg.answer, message: "Correct index must point to the answer" },
    { name: "stem-placeholders", passed: !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(pkg.stem), message: "Stem must resolve all placeholders" },
    { name: "explanation-lines", passed: pkg.explanation.lines.length >= 4, message: "Explanation must contain at least four lines" },
    { name: "explanation-answer", passed: explanationText.includes(pkg.answer), message: "Explanation must state the final answer" },
    { name: "explanation-placeholders", passed: !/\{[A-Za-z][A-Za-z0-9_]*\}/.test(explanationText), message: "Explanation must resolve all placeholders" },
    { name: "latex-balanced", passed: visible.every(latexBalanced), message: "Visible LaTeX delimiters must be balanced" },
    { name: "no-control-characters", passed: visible.every((value) => !/[\u0000-\u001F\u007F]/.test(value)), message: "Learner-visible text and TeX must contain no control characters" },
    { name: "tex-command-contract", passed: commandContract(pkg.questionLanguageId, pkg.solver.mathJax), message: "Each inverse contract must retain required TeX commands" },
    { name: "not-public", passed: pkg.publiclyPublishable === false, message: "Runtime-proof questions must remain unpublished" },
  ];
  return { valid: checks.every((item) => item.passed), checks };
}

export function getCp011InverseEntries(): Cp011InverseEntry[] {
  return entries.map((entry) => ({ ...entry, requiredVariables: [...entry.requiredVariables] }));
}

export function runPnc002Cp011InversePipeline(input: { questionLanguageId?: string; difficulty?: Cp011InverseDifficulty; seed?: string; language?: "en" | "hi" | "pa" } = {}): Cp011InverseQuestionPackage {
  const language = input.language ?? "en";
  if (language !== "en") throw new Error(`PNC-CP-011 inverse language ${language} is not implemented`);
  const seed = input.seed ?? "pnc-cp011-inverse-default";
  let entry: Cp011InverseEntry;
  if (input.questionLanguageId) {
    const found = entries.find((candidate) => candidate.qlId === input.questionLanguageId);
    if (!found) throw new Error(`Unknown CP-011 inverse QL: ${input.questionLanguageId}`);
    if (input.difficulty && found.difficulty !== input.difficulty) throw new Error("Requested difficulty does not match selected CP-011 inverse QL");
    entry = found;
  } else {
    const candidates = entries.filter((candidate) => !input.difficulty || candidate.difficulty === input.difficulty);
    if (!candidates.length) throw new Error("No admitted CP-011 inverse QL matches the requested filters");
    entry = pickSeeded(candidates, createSeededRandom(`${seed}:cp011-inverse-entry`));
  }
  const parameters = generateParameters(entry, seed);
  const solver = solveCp011Inverse(parameters);
  const independentVerification = verifyCp011InverseIndependently(parameters);
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const numericOptions = shuffleSeeded([...solver.evidence.candidateValues], createSeededRandom(`${seed}:${entry.qlId}:cp011-inverse-options`));
  const options = numericOptions.map(String);
  const correctIndex = numericOptions.indexOf(solver.numericAnswer);
  const explanation = renderExplanation(parameters, solver);
  const withoutValidation: Omit<Cp011InverseQuestionPackage, "validation"> = {
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
    options,
    correctIndex,
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
      solveDirection: "BOUNDED_INVERSE",
      sharedPackageIntegration: "DEFERRED_UNTIL_CP011_CHECKPOINT_APPROVAL",
    },
  };
  return { ...withoutValidation, validation: validatePackage(withoutValidation) };
}

export function auditCp011InverseCoverage(): Cp011InverseCoverageAudit {
  const expectedIds = ["PNC-QL-239", "PNC-QL-240", "PNC-QL-241"];
  const activeIds = entries.map((entry) => entry.qlId);
  const missingQlIds = expectedIds.filter((id) => !activeIds.includes(id));
  const duplicateQlIds = [...new Set(activeIds.filter((id, index) => activeIds.indexOf(id) !== index))];
  const templates = new Map<string, string[]>();
  for (const entry of entries) {
    const normalized = entry.template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
    templates.set(normalized, [...(templates.get(normalized) ?? []), entry.qlId]);
  }
  const exactDuplicateTemplateGroups = [...templates.values()].filter((ids) => ids.length > 1);
  const difficultyCounts = Object.fromEntries(["Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
  const solveModeCounts = Object.fromEntries(entries.map((entry) => [entry.solveMode, 1]));
  const invalidRuntimeSamples: string[] = [];
  for (const entry of entries) {
    try {
      const sample = runPnc002Cp011InversePipeline({ questionLanguageId: entry.qlId, seed: `cp011-inverse-audit:${entry.qlId}` });
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
