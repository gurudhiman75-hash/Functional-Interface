import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import {
  factorCountBucket,
  kBucket,
  positionBucket,
  positionClass,
  productDigitCountBucket,
} from "./math";
import type {
  NsFac001Answer,
  NsFac001CanonicalProblemId,
  NsFac001DifficultyBand,
  NsFac001MathJaxFields,
  NsFac001QuestionPackage,
  NsFac001Topology,
} from "./types";

export const NS_FAC_001_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007", "CP-008", "CP-009"] as const;
const MATHJAX_KEYS = [
  "primeFactorizationLatex",
  "factorCountFormulaLatex",
  "factorSumFormulaLatex",
  "factorProductFormulaLatex",
  "factorListLatex",
  "factorsIncreasingLatex",
  "factorsDecreasingLatex",
  "kPrimeFactorizationLatex",
  "divisibleFactorConstraintLatex",
  "complementFormulaLatex",
  "selectedPositionFormulaLatex",
  "greatestProperFactorFormulaLatex",
  "perfectSquareRuleLatex",
] as const;

export function getNsFac001ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsFac001CanonicalProblemId[];
}

export function validateNsFac001Libraries() {
  const failures: string[] = [];
  if (variableRangesLibrary.archetypeId !== "NS-FAC-001") failures.push("Variable range library archetype ID mismatch.");
  if (questionLanguageLibrary.archetypeId !== "NS-FAC-001") failures.push("Question language library archetype ID mismatch.");
  if (explanationLibrary.archetypeId !== "NS-FAC-001") failures.push("Explanation library archetype ID mismatch.");

  const cpIds = variableRangesLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Variable range CP IDs must be CP-001 through CP-009.");

  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  const expectedQlIds = Array.from({ length: 21 }, (_value, index) => `QL-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(qlIds) !== JSON.stringify(expectedQlIds)) failures.push("Question language IDs must be QL-001 through QL-021.");

  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  const expectedEsIds = Array.from({ length: 9 }, (_value, index) => `ES-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(esIds) !== JSON.stringify(expectedEsIds)) failures.push("Explanation IDs must be ES-001 through ES-009.");

  for (const cp of questionLanguageLibrary.canonicalProblems) {
    for (const entry of cp.entries) {
      for (const field of requiredVisibleFields(cp.cpId as NsFac001CanonicalProblemId)) {
        if (!entry.text.includes(`{${field}}`)) failures.push(`${entry.id} is missing required placeholder {${field}}.`);
      }
      if (entry.text.includes("{position}th")) failures.push(`${entry.id} must use ordinalDisplay, not {position}th.`);
    }
  }

  for (const family of explanationLibrary.families) {
    for (const entry of family.entries) {
      if (!entry.text.includes("{answer}")) failures.push(`${entry.id} must include {answer}.`);
      for (const placeholder of requiredExplanationPlaceholders(family.appliesTo[0] as NsFac001CanonicalProblemId)) {
        if (!entry.text.includes(`{${placeholder}}`)) failures.push(`${entry.id} is missing evidence placeholder {${placeholder}}.`);
      }
    }
  }

  if (!coverageTargetsLibrary.targets.highlyCompositeNumberCoverage?.required) failures.push("highlyCompositeNumberCoverage must be required.");
  if (!coverageTargetsLibrary.targets.edgePositionCoverage) failures.push("edgePositionCoverage must exist.");
  if (!coverageTargetsLibrary.targets.productDigitCountCoverage) failures.push("productDigitCountCoverage must exist.");
  return { valid: failures.length === 0, failures };
}

export function getDifficultyBandConfig(difficultyBand: NsFac001DifficultyBand) {
  const band = variableRangesLibrary.difficultyBands.find((entry) => entry.name === difficultyBand);
  if (!band) throw new Error(`NS-FAC-001 difficulty band is not approved: ${difficultyBand}`);
  return band;
}

export function getCanonicalProblemConfig(canonicalProblemId: NsFac001CanonicalProblemId) {
  const config = variableRangesLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!config) throw new Error(`NS-FAC-001 CP config is missing: ${canonicalProblemId}`);
  return config;
}

export function getTopology(canonicalProblemId: NsFac001CanonicalProblemId) {
  return getCanonicalProblemConfig(canonicalProblemId).topology as NsFac001Topology;
}

export function getQuestionLanguageEntries(canonicalProblemId: NsFac001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-FAC-001 question language is missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function getExplanationEntries(canonicalProblemId: NsFac001CanonicalProblemId) {
  return getExplanationFamily(canonicalProblemId).entries;
}

export function getExplanationFamily(canonicalProblemId: NsFac001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(canonicalProblemId));
  if (!family) throw new Error(`NS-FAC-001 explanation family is missing for ${canonicalProblemId}.`);
  return family;
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsFac001CanonicalProblemId;
  questionLanguageId: string;
  values: Record<string, number | string | undefined>;
}) {
  const entry = getQuestionLanguageEntries(input.canonicalProblemId).find((item) => item.id === input.questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${input.questionLanguageId} is not approved for ${input.canonicalProblemId}.`);
  return replacePlaceholders(entry.text, input.values);
}

export function renderExplanationLanguage(input: {
  canonicalProblemId: NsFac001CanonicalProblemId;
  styleId: string;
  answer: NsFac001Answer;
  values: Record<string, number | string | undefined>;
}) {
  const family = getExplanationFamily(input.canonicalProblemId);
  const entry = family.entries.find((item) => item.id === input.styleId);
  if (!entry) throw new Error(`Explanation ID ${input.styleId} is not approved for ${input.canonicalProblemId}.`);
  return {
    familyId: family.familyId,
    lines: replacePlaceholders(entry.text, { ...input.values, answer: input.answer }).split("\n"),
  };
}

export function requiredVisibleFields(canonicalProblemId: NsFac001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
    case "CP-002":
    case "CP-003":
    case "CP-004":
    case "CP-005":
      return ["number"] as const;
    case "CP-006":
    case "CP-007":
      return ["number", "k"] as const;
    case "CP-008":
    case "CP-009":
      return ["number", "ordinalDisplay"] as const;
  }
}

export function requiredExplanationPlaceholders(canonicalProblemId: NsFac001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
      return ["primeFactorizationLatex", "factorCountFormulaLatex"] as const;
    case "CP-002":
      return ["primeFactorizationLatex", "factorSumFormulaLatex"] as const;
    case "CP-003":
      return ["factorCountFormulaLatex", "factorProductFormulaLatex"] as const;
    case "CP-004":
      return ["perfectSquareRuleLatex"] as const;
    case "CP-005":
      return ["factorListLatex", "greatestProperFactorFormulaLatex"] as const;
    case "CP-006":
      return ["divisibleFactorConstraintLatex"] as const;
    case "CP-007":
      return ["complementFormulaLatex"] as const;
    case "CP-008":
      return ["factorsIncreasingLatex", "ordinalDisplay", "selectedPositionFormulaLatex"] as const;
    case "CP-009":
      return ["factorsDecreasingLatex", "ordinalDisplay", "selectedPositionFormulaLatex"] as const;
  }
}

export function auditNsFac001Batch(questionPackages: readonly NsFac001QuestionPackage[], generationFailures = 0) {
  const allQlIds = questionPackages.length > 0 ? getQuestionLanguageEntries(questionPackages[0].canonicalProblemId).map((entry) => entry.id) : [];
  const allEsIds = questionPackages.length > 0 ? getExplanationEntries(questionPackages[0].canonicalProblemId).map((entry) => entry.id) : [];
  const qlDistribution = countBy(questionPackages.map((item) => item.questionLanguageId));
  const esDistribution = countBy(questionPackages.map((item) => item.explanationStyleId));
  const stemDistribution = countBy(questionPackages.map((item) => item.stem));
  const repeated = Object.entries(stemDistribution).filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1]);
  return {
    questionCount: questionPackages.length,
    generationFailures,
    validationFailures: questionPackages.filter((item) => !item.validation.valid).length,
    traceabilityFailures: questionPackages.filter((item) => traceabilityMissing(item)).length,
    mathJaxFailures: questionPackages.filter((item) => !mathJaxPresent(item)).length,
    bigIntSerializationFailures: questionPackages.filter((item) => !/^\d+$/.test(item.solver.factorProductString)).length,
    unusedQuestionLanguageIds: allQlIds.filter((id) => !qlDistribution[id]),
    unusedExplanationIds: allEsIds.filter((id) => !esDistribution[id]),
    maximumExactQuestionRepetition: repeated[0]?.[1] ?? 1,
    repeatedQuestionExamples: repeated.slice(0, 5).map(([stem, count]) => `${count}x ${stem}`),
    difficultyDistribution: countBy(questionPackages.map((item) => item.difficultyBand)),
    primeInputCoverage: countBy(questionPackages.map((item) => item.solver.isPrimeInput)),
    compositeInputCoverage: countBy(questionPackages.map((item) => item.solver.isCompositeInput)),
    primePowerCoverage: countBy(questionPackages.map((item) => item.solver.isPrimePower)),
    mixedPrimeCoverage: countBy(questionPackages.map((item) => item.solver.isMixedPrime)),
    perfectSquareCoverage: countBy(questionPackages.map((item) => item.solver.isPerfectSquare)),
    nonPerfectSquareCoverage: countBy(questionPackages.map((item) => !item.solver.isPerfectSquare)),
    highlyCompositeNumberCoverage: countBy(questionPackages.map((item) => item.solver.isHighlyCompositeNumber)),
    factorCountCoverage: countBy(questionPackages.map((item) => factorCountBucket(item.solver.factorCount))),
    kCoverage: countBy(questionPackages.map((item) => kBucket(item.k))),
    positionCoverage: countBy(questionPackages.map((item) => positionBucket(item.position))),
    edgePositionCoverage: countBy(questionPackages.map((item) => positionClass(item.position, item.solver.factorCount))),
    productDigitCountCoverage: countBy(questionPackages.map((item) => productDigitCountBucket(item.productDigitCount))),
    questionLanguageDistribution: qlDistribution,
    explanationDistribution: esDistribution,
    mathJaxObjectCoverage: Object.fromEntries(MATHJAX_KEYS.map((key) => [key, questionPackages.filter((item) => Boolean(item[key])).length])),
  };
}

export function mathJaxKeys() {
  return [...MATHJAX_KEYS];
}

function countBy(values: readonly (number | string | boolean)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function traceabilityMissing(item: NsFac001QuestionPackage) {
  return (
    !item.traceability.questionId ||
    !item.traceability.questionLanguageId ||
    !item.traceability.explanationStyleId ||
    !item.traceability.difficultyBand ||
    item.traceability.answer !== item.answer ||
    item.traceability.productDigitCount !== item.productDigitCount ||
    item.traceability.graphId !== item.reasoningGraph.graphId ||
    !mathJaxPresent(item.traceability)
  );
}

function mathJaxPresent(item: NsFac001MathJaxFields) {
  return MATHJAX_KEYS.every((key) => typeof item[key] === "string" && item[key].length > 0);
}

function replacePlaceholders(text: string, values: Record<string, number | string | undefined>) {
  return text.replaceAll(/\{([A-Za-z]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "number" && typeof value !== "string") throw new Error(`Missing value for placeholder: ${key}`);
    return String(value);
  });
}
