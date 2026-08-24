import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_EXP_001_MATHJAX_KEYS } from "./math";
import type { NsExp001CanonicalProblemId, NsExp001QuestionPackage, NsExp001VariableMap } from "./types";

export const NS_EXP_001_ACTIVE_CP_IDS = ["CP01", "CP02", "CP03", "CP04", "CP05", "CP06", "CP07", "CP09"] as const;
export const NS_EXP_001_CURRENT_QL_COUNT = 100;

export function getNsExp001ActiveCanonicalProblemIds() {
  return [...NS_EXP_001_ACTIVE_CP_IDS] as NsExp001CanonicalProblemId[];
}

export function validateNsExp001Libraries() {
  const failures: string[] = [];
  for (const lib of [questionLanguageLibrary, explanationLibrary, variableRangesLibrary, coverageTargetsLibrary, distributionTargetsLibrary]) {
    if (lib.archetypeId !== "NS-EXP-001") failures.push(`${lib.libraryId} archetype mismatch.`);
  }
  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  if (qlIds.length !== NS_EXP_001_CURRENT_QL_COUNT) failures.push(`Current runtime QL count must be ${NS_EXP_001_CURRENT_QL_COUNT}; found ${qlIds.length}.`);
  if (new Set(qlIds).size !== qlIds.length) failures.push("QL IDs must be unique.");
  for (const cpId of NS_EXP_001_ACTIVE_CP_IDS) {
    const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === cpId);
    if (!cp || cp.entries.length === 0) failures.push(`Active CP ${cpId} must own at least one QL.`);
  }
  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(["ES-001", "ES-002", "ES-003", "ES-004", "ES-005", "ES-006", "ES-007", "ES-008"])) failures.push("ES IDs must be ES-001 through ES-008.");
  return { valid: failures.length === 0, failures, qlCount: qlIds.length };
}

export function getQuestionLanguageEntries(cpId: NsExp001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === cpId);
  if (!cp) throw new Error(`Missing question language for ${cpId}.`);
  return cp.entries;
}

export function getExplanationFamily(cpId: NsExp001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(cpId));
  if (!family) throw new Error(`Missing explanation family for ${cpId}.`);
  return family;
}

export function renderQuestion(cpId: NsExp001CanonicalProblemId, questionLanguageId: string, variables: NsExp001VariableMap = {}) {
  const entry = getQuestionLanguageEntries(cpId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ${questionLanguageId} not approved for ${cpId}.`);
  const rendered = Object.keys(variables)
    .sort((a, b) => b.length - a.length)
    .reduce((text, key) => text.replace(new RegExp(`\\b${key}\\b`, "g"), String(variables[key])), entry.text);
  const unresolved = [
    "base", "firstExponent", "secondExponent", "thirdExponent", "innerExponent", "outerExponent", "resultExponent",
    "targetExponent", "coefficient", "constant", "divisor", "commonBase", "visibleBase1", "visibleBase2", "visibleBase3",
    "shift", "negativeExponent", "positiveExponent", "firstNegativeExponent", "secondNegativeExponent", "rootDegree",
    "fractionalExponentNumerator", "fractionalExponentDenominator", "divisorBase", "knownValue", "increment", "decrement", "multiplier",
  ].filter((token) => new RegExp(`\\b${token}\\b`).test(rendered));
  if (unresolved.length) throw new Error(`Unresolved NS-EXP-001 stem tokens for ${questionLanguageId}: ${unresolved.join(", ")}`);
  return rendered;
}

export function renderExplanation(cpId: NsExp001CanonicalProblemId, explanationId: string) {
  const family = getExplanationFamily(cpId);
  const entry = family.entries.find((item) => item.id === explanationId);
  if (!entry) throw new Error(`Explanation ${explanationId} not approved for ${cpId}.`);
  return { familyId: family.familyId, lines: entry.text.split("\n") };
}

export function auditNsExp001Batch(packages: readonly NsExp001QuestionPackage[]) {
  const cpId = packages[0]?.canonicalProblemId;
  const qlIds = cpId ? getQuestionLanguageEntries(cpId).map((entry) => entry.id) : [];
  const esIds = cpId ? getExplanationFamily(cpId).entries.map((entry) => entry.id) : [];
  const ql = countBy(packages.map((item) => item.questionLanguageId));
  const es = countBy(packages.map((item) => item.explanationId));
  return {
    questionCount: packages.length,
    generationFailures: 0,
    validationFailures: packages.filter((item) => !item.validation.valid).length,
    mathematicalVerificationFailures: packages.filter((item) => !item.solver.verification.independentlyVerified).length,
    unresolvedStemTokenFailures: packages.filter((item) => /\b(base|firstExponent|targetExponent|visibleBase1|negativeExponent|rootDegree|knownValue)\b/.test(item.stem)).length,
    traceabilityFailures: packages.filter((item) => item.traceability.questionId !== item.questionId || item.traceability.answer !== item.answer).length,
    mathJaxFailures: packages.filter((item) => !NS_EXP_001_MATHJAX_KEYS.some((key) => item[key].length > 0)).length,
    unusedQuestionLanguageIds: qlIds.filter((id) => !ql[id]),
    unusedExplanationIds: esIds.filter((id) => !es[id]),
    difficultyDistribution: countBy(packages.map((item) => item.difficultyBand)),
    canonicalProblemDistribution: countBy(packages.map((item) => item.canonicalProblemId)),
    questionLanguageDistribution: ql,
    explanationDistribution: es,
    coverageBucket: countBy(packages.map((item) => item.parameters.coverageBucket)),
    operationType: countBy(packages.map((item) => item.parameters.operationType ?? "not-applicable")),
    comparisonMode: countBy(packages.map((item) => item.parameters.comparisonMode ?? "not-applicable")),
    mathJaxUsage: Object.fromEntries(NS_EXP_001_MATHJAX_KEYS.map((key) => [key, packages.filter((item) => item[key].length > 0).length])),
  };
}

function countBy(values: readonly (string | number | boolean)[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    const key = String(value);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
