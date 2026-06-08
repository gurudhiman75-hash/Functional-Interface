import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import type {
  NsPf001Answer,
  NsPf001CanonicalProblemId,
  NsPf001DifficultyBand,
  NsPf001QuestionPackage,
  NsPf001Topology,
} from "./types";

export const NS_PF_001_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007"] as const;

export function getNsPf001ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsPf001CanonicalProblemId[];
}

export function validateNsPf001Libraries() {
  const failures: string[] = [];
  if (variableRangesLibrary.archetypeId !== "NS-PF-001") failures.push("Variable range library archetype ID mismatch.");
  if (questionLanguageLibrary.archetypeId !== "NS-PF-001") failures.push("Question language library archetype ID mismatch.");
  if (explanationLibrary.archetypeId !== "NS-PF-001") failures.push("Explanation library archetype ID mismatch.");

  const cpIds = variableRangesLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Variable range CP IDs must be CP-001 through CP-007.");

  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  const expectedQlIds = Array.from({ length: 18 }, (_value, index) => `QL-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(qlIds) !== JSON.stringify(expectedQlIds)) failures.push("Question language IDs must be QL-001 through QL-018.");

  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  const expectedEsIds = Array.from({ length: 7 }, (_value, index) => `ES-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(esIds) !== JSON.stringify(expectedEsIds)) failures.push("Explanation IDs must be ES-001 through ES-007.");

  for (const cp of questionLanguageLibrary.canonicalProblems) {
    const required = requiredVisibleFields(cp.cpId as NsPf001CanonicalProblemId);
    for (const entry of cp.entries) {
      for (const field of required) {
        if (!entry.text.includes(`{${field}}`)) failures.push(`${entry.id} is missing required placeholder {${field}}.`);
      }
    }
  }

  const ql015 = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries).find((entry) => entry.id === "QL-015");
  if (ql015?.text.toLowerCase().includes("exponent")) failures.push("QL-015 must ask for prime power, not exponent.");

  const ql017 = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries).find((entry) => entry.id === "QL-017");
  if (!ql017?.text.toLowerCase().includes("exponent")) failures.push("QL-017 must ask for exponent.");

  const explanations = explanationLibrary.families.flatMap((family) => family.entries);
  for (const entry of explanations) {
    if (!entry.text.includes("{factorization}")) failures.push(`${entry.id} must include factorization evidence.`);
  }

  if (!coverageTargetsLibrary.targets.primeInputCoverage?.required) failures.push("primeInputCoverage must be required.");
  if (!coverageTargetsLibrary.targets.compositeInputCoverage?.required) failures.push("compositeInputCoverage must be required.");
  if (!coverageTargetsLibrary.targets.selectedExponentCoverage) failures.push("selectedExponentCoverage must exist.");

  return { valid: failures.length === 0, failures };
}

export function getDifficultyBandConfig(difficultyBand: NsPf001DifficultyBand) {
  const band = variableRangesLibrary.difficultyBands.find((entry) => entry.name === difficultyBand);
  if (!band) throw new Error(`NS-PF-001 difficulty band is not approved: ${difficultyBand}`);
  return band;
}

export function assertCanonicalProblemActive(canonicalProblemId: string): asserts canonicalProblemId is NsPf001CanonicalProblemId {
  if (!(ACTIVE_CP_IDS as readonly string[]).includes(canonicalProblemId)) {
    throw new Error(`NS-PF-001 canonical problem is not active: ${canonicalProblemId}`);
  }
}

export function getCanonicalProblemConfig(canonicalProblemId: NsPf001CanonicalProblemId) {
  const config = variableRangesLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!config) throw new Error(`NS-PF-001 CP config is missing: ${canonicalProblemId}`);
  return config;
}

export function getTopology(canonicalProblemId: NsPf001CanonicalProblemId) {
  return getCanonicalProblemConfig(canonicalProblemId).topology as NsPf001Topology;
}

export function getQuestionLanguageEntries(canonicalProblemId: NsPf001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-PF-001 question language is missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function getExplanationEntries(canonicalProblemId: NsPf001CanonicalProblemId) {
  return getExplanationFamily(canonicalProblemId).entries;
}

export function getExplanationFamily(canonicalProblemId: NsPf001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(canonicalProblemId));
  if (!family) throw new Error(`NS-PF-001 explanation family is missing for ${canonicalProblemId}.`);
  return family;
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsPf001CanonicalProblemId;
  questionLanguageId: string;
  values: Record<string, number | undefined>;
}) {
  const entry = getQuestionLanguageEntries(input.canonicalProblemId).find((item) => item.id === input.questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${input.questionLanguageId} is not approved for ${input.canonicalProblemId}.`);
  return replacePlaceholders(entry.text, input.values);
}

export function renderExplanationLanguage(input: {
  canonicalProblemId: NsPf001CanonicalProblemId;
  styleId: string;
  answer: NsPf001Answer;
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

export function requiredVisibleFields(canonicalProblemId: NsPf001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
    case "CP-002":
    case "CP-003":
    case "CP-004":
    case "CP-005":
      return ["number"] as const;
    case "CP-006":
    case "CP-007":
      return ["number", "prime"] as const;
  }
}

export function countBy(values: readonly (number | string | boolean)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function factorSizeBucket(value: number | undefined) {
  if (typeof value !== "number") return "not-applicable";
  if (value <= 13) return "small";
  if (value <= 47) return "medium";
  return "large";
}

export function exponentBucket(value: number | undefined) {
  if (typeof value !== "number") return "not-applicable";
  if (value <= 1) return "1";
  if (value === 2) return "2";
  if (value === 3) return "3";
  return "4+";
}

export function auditNsPf001Batch(questionPackages: readonly NsPf001QuestionPackage[], generationFailures = 0) {
  return {
    questionCount: questionPackages.length,
    generationFailures,
    validationFailures: questionPackages.filter((item) => !item.validation.valid).length,
    traceabilityFailures: questionPackages.filter((item) => traceabilityMissing(item)).length,
    mathJaxFailures: questionPackages.filter((item) => !item.factorizationLatex.includes("\\times") && item.solver.factorization.terms.length > 1).length,
    difficultyDistribution: countBy(questionPackages.map((item) => item.difficultyBand)),
    primeInputCoverage: countBy(questionPackages.map((item) => item.solver.inputClass === "Prime")),
    compositeInputCoverage: countBy(questionPackages.map((item) => item.solver.inputClass === "Composite")),
    repeatedPrimeCoverage: countBy(questionPackages.map((item) => item.solver.factorization.terms.some((term) => term.exponent > 1))),
    primePowerCoverage: countBy(questionPackages.map((item) => item.solver.factorization.terms.some((term) => term.exponent >= 2))),
    mixedPrimeCoverage: countBy(questionPackages.map((item) => item.solver.factorization.distinctPrimeFactorCount >= 2)),
    largestPrimeFactorCoverage: countBy(questionPackages.map((item) => factorSizeBucket(item.solver.factorization.largestPrimeFactor))),
    smallestPrimeFactorCoverage: countBy(questionPackages.map((item) => factorSizeBucket(item.solver.factorization.smallestPrimeFactor))),
    selectedPrimeCoverage: countBy(questionPackages.map((item) => factorSizeBucket(item.solver.selectedPrime))),
    selectedExponentCoverage: countBy(questionPackages.map((item) => exponentBucket(item.solver.selectedExponent))),
    questionLanguageDistribution: countBy(questionPackages.map((item) => item.questionLanguageId)),
    explanationDistribution: countBy(questionPackages.map((item) => item.explanationStyleId)),
    topologyDistribution: countBy(questionPackages.map((item) => item.topology)),
    factorizationTextSamples: unique(questionPackages.map((item) => item.factorizationText)).slice(0, 5),
    factorizationLatexSamples: unique(questionPackages.map((item) => item.factorizationLatex)).slice(0, 5),
  };
}

function traceabilityMissing(item: NsPf001QuestionPackage) {
  return (
    !item.questionId ||
    !item.questionLanguageId ||
    !item.explanationStyleId ||
    !item.difficultyBand ||
    !item.factorizationText ||
    !item.factorizationLatex ||
    item.traceability.factorizationLatex !== item.factorizationLatex
  );
}

function replacePlaceholders(text: string, values: Record<string, number | string | undefined>) {
  return text.replaceAll(/\{([A-Za-z]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "number" && typeof value !== "string") throw new Error(`Missing value for placeholder: ${key}`);
    return String(value);
  });
}

function unique(values: readonly string[]) {
  return [...new Set(values)];
}
