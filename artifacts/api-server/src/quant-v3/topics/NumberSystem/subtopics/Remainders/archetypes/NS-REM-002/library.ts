import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import type { NsRem002CanonicalProblemId, NsRem002DifficultyBand, NsRem002QuestionPackage, NsRem002Topology } from "./types";

export const NS_REM_002_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007", "CP-008", "CP-009"] as const;
const REMOVED_CP_IDS = ["CP-010", "CP-011"] as const;

export function getNsRem002ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsRem002CanonicalProblemId[];
}

export function validateNsRem002Libraries() {
  const failures: string[] = [];
  if (variableRangesLibrary.archetypeId !== "NS-REM-002") failures.push("Variable range library archetype ID mismatch.");
  if (questionLanguageLibrary.archetypeId !== "NS-REM-002") failures.push("Question language library archetype ID mismatch.");
  if (explanationLibrary.archetypeId !== "NS-REM-002") failures.push("Explanation library archetype ID mismatch.");

  const cpIds = variableRangesLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Variable range CP IDs must be CP-001 through CP-009.");
  for (const removed of REMOVED_CP_IDS) {
    if (cpIds.includes(removed)) failures.push(`${removed} must not be runtime-active.`);
  }

  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  const expectedQlIds = Array.from({ length: 29 }, (_, index) => `QL-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(qlIds) !== JSON.stringify(expectedQlIds)) failures.push("Question language IDs must be QL-001 through QL-029.");

  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  const expectedEsIds = Array.from({ length: 10 }, (_, index) => `ES-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(esIds) !== JSON.stringify(expectedEsIds)) failures.push("Explanation IDs must be ES-001 through ES-010.");

  for (const cp of questionLanguageLibrary.canonicalProblems) {
    const required = requiredVisibleFields(cp.cpId as NsRem002CanonicalProblemId);
    for (const entry of cp.entries) {
      for (const field of required) {
        if (!entry.text.includes(`{${field}}`)) failures.push(`${entry.id} is missing required placeholder {${field}}.`);
      }
    }
  }

  return { valid: failures.length === 0, failures };
}

export function getDifficultyBandConfig(difficultyBand: NsRem002DifficultyBand) {
  const band = variableRangesLibrary.difficultyBands.find((entry) => entry.name === difficultyBand);
  if (!band) throw new Error(`NS-REM-002 difficulty band is not approved: ${difficultyBand}`);
  return band;
}

export function assertCanonicalProblemActive(canonicalProblemId: string): asserts canonicalProblemId is NsRem002CanonicalProblemId {
  if (!(ACTIVE_CP_IDS as readonly string[]).includes(canonicalProblemId)) {
    throw new Error(`NS-REM-002 canonical problem is not active: ${canonicalProblemId}`);
  }
}

export function getCanonicalProblemConfig(canonicalProblemId: NsRem002CanonicalProblemId) {
  const config = variableRangesLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!config) throw new Error(`NS-REM-002 CP config is missing: ${canonicalProblemId}`);
  return config;
}

export function getTopology(canonicalProblemId: NsRem002CanonicalProblemId) {
  return getCanonicalProblemConfig(canonicalProblemId).topology as NsRem002Topology;
}

export function getQuestionLanguageEntries(canonicalProblemId: NsRem002CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-REM-002 question language is missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsRem002CanonicalProblemId;
  questionLanguageId: string;
  values: Record<string, number | undefined>;
}) {
  const entry = getQuestionLanguageEntries(input.canonicalProblemId).find((item) => item.id === input.questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${input.questionLanguageId} is not approved for ${input.canonicalProblemId}.`);
  return replacePlaceholders(entry.text, input.values);
}

export function isRenderedQuestionLanguage(input: {
  canonicalProblemId: NsRem002CanonicalProblemId;
  questionLanguageId: string;
  stem: string;
  values: Record<string, number | undefined>;
}) {
  return renderQuestionLanguage(input) === input.stem;
}

export function getExplanationFamily(canonicalProblemId: NsRem002CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(canonicalProblemId));
  if (!family) throw new Error(`NS-REM-002 explanation family is missing for ${canonicalProblemId}.`);
  return family;
}

export function getExplanationEntries(canonicalProblemId: NsRem002CanonicalProblemId) {
  return getExplanationFamily(canonicalProblemId).entries;
}

export function renderExplanationLanguage(input: { canonicalProblemId: NsRem002CanonicalProblemId; styleId: string; answer: number }) {
  const family = getExplanationFamily(input.canonicalProblemId);
  const entry = family.entries.find((item) => item.id === input.styleId);
  if (!entry) throw new Error(`Explanation ID ${input.styleId} is not approved for ${input.canonicalProblemId}.`);
  return {
    familyId: family.familyId,
    lines: entry.text.replaceAll("{answer}", String(input.answer)).split("\n"),
  };
}

export function requiredVisibleFields(canonicalProblemId: NsRem002CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
    case "CP-009":
      return ["divisor", "quotient", "remainder"] as const;
    case "CP-002":
      return ["divisor", "remainder", "lowerBound"] as const;
    case "CP-003":
      return ["divisor", "remainder", "upperBound"] as const;
    case "CP-004":
    case "CP-005":
      return ["divisor", "remainder", "lowerBound", "upperBound"] as const;
    case "CP-006":
      return ["dividend", "quotient", "remainder"] as const;
    case "CP-007":
      return ["dividend", "divisor", "remainder"] as const;
    case "CP-008":
      return ["dividend", "divisor", "quotient"] as const;
  }
}

export function countBy(values: readonly (number | string)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function auditNsRem002Batch(questionPackages: readonly NsRem002QuestionPackage[], generationFailures = 0) {
  return {
    questionCount: questionPackages.length,
    difficultyDistribution: countBy(questionPackages.map((item) => item.difficultyBand)),
    divisorDistribution: countBy(questionPackages.map((item) => item.parameters.divisor ?? item.solver.divisor ?? "unknown")),
    questionLanguageDistribution: countBy(questionPackages.map((item) => item.questionLanguageId)),
    explanationDistribution: countBy(questionPackages.map((item) => item.explanationStyleId)),
    topologyDistribution: countBy(questionPackages.map((item) => item.topology)),
    generationFailures,
    validationFailures: questionPackages.filter((item) => !item.validation.valid).length,
    traceabilityFailures: questionPackages.filter((item) => !item.questionId || !item.questionLanguageId || !item.explanationStyleId || !item.difficultyBand).length,
  };
}

function replacePlaceholders(text: string, values: Record<string, number | undefined>) {
  return text.replaceAll(/\{([A-Za-z]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "number") throw new Error(`Missing value for question placeholder: ${key}`);
    return String(value);
  });
}
