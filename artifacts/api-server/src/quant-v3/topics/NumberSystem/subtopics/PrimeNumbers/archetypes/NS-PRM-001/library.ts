import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import type {
  NsPrm001Answer,
  NsPrm001CanonicalProblemId,
  NsPrm001DifficultyBand,
  NsPrm001QuestionPackage,
  NsPrm001Topology,
} from "./types";

export const NS_PRM_001_LIBRARY_REGISTRY = {
  variableRanges: variableRangesLibrary,
  coverageTargets: coverageTargetsLibrary,
  questionLanguage: questionLanguageLibrary,
  explanation: explanationLibrary,
  distributionTargets: distributionTargetsLibrary,
} as const;

const ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006", "CP-007", "CP-008"] as const;

export function getNsPrm001ActiveCanonicalProblemIds() {
  return [...ACTIVE_CP_IDS] as NsPrm001CanonicalProblemId[];
}

export function validateNsPrm001Libraries() {
  const failures: string[] = [];
  if (variableRangesLibrary.archetypeId !== "NS-PRM-001") failures.push("Variable range library archetype ID mismatch.");
  if (questionLanguageLibrary.archetypeId !== "NS-PRM-001") failures.push("Question language library archetype ID mismatch.");
  if (explanationLibrary.archetypeId !== "NS-PRM-001") failures.push("Explanation library archetype ID mismatch.");

  const cpIds = variableRangesLibrary.canonicalProblems.map((entry) => entry.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(ACTIVE_CP_IDS)) failures.push("Variable range CP IDs must be CP-001 through CP-008.");

  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  const expectedQlIds = Array.from({ length: 18 }, (_value, index) => `QL-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(qlIds) !== JSON.stringify(expectedQlIds)) failures.push("Question language IDs must be QL-001 through QL-018.");

  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  const expectedEsIds = Array.from({ length: 9 }, (_value, index) => `ES-${String(index + 1).padStart(3, "0")}`);
  if (JSON.stringify(esIds) !== JSON.stringify(expectedEsIds)) failures.push("Explanation IDs must be ES-001 through ES-009.");

  for (const cp of questionLanguageLibrary.canonicalProblems) {
    const required = requiredVisibleFields(cp.cpId as NsPrm001CanonicalProblemId);
    for (const entry of cp.entries) {
      for (const field of required) {
        if (!entry.text.includes(`{${field}}`)) failures.push(`${entry.id} is missing required placeholder {${field}}.`);
      }
    }
  }

  const ql017 = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries).find((entry) => entry.id === "QL-017");
  if (ql017?.text !== "Find the prime number at position {position}.") failures.push("QL-017 must use repaired position wording.");

  const answerTargets = coverageTargetsLibrary.targets.cp001AnswerDistribution.answers;
  if (!answerTargets.some((entry) => entry.answer === "Prime" && entry.targetPercent === 50)) failures.push("CP-001 Prime target must be 50%.");
  if (!answerTargets.some((entry) => entry.answer === "Composite" && entry.targetPercent === 50)) failures.push("CP-001 Composite target must be 50%.");

  const rangeBuckets = coverageTargetsLibrary.targets.rangeCoverage.buckets.map((entry) => `${entry.bucket}:${entry.rangeWidth.min}-${entry.rangeWidth.max}`);
  if (rangeBuckets.join(",") !== "small:5-50,medium:51-250,large:251-1000") failures.push("Range buckets must be small 5-50, medium 51-250, large 251-1000.");

  return { valid: failures.length === 0, failures };
}

export function getDifficultyBandConfig(difficultyBand: NsPrm001DifficultyBand) {
  const band = variableRangesLibrary.difficultyBands.find((entry) => entry.name === difficultyBand);
  if (!band) throw new Error(`NS-PRM-001 difficulty band is not approved: ${difficultyBand}`);
  return band;
}

export function assertCanonicalProblemActive(canonicalProblemId: string): asserts canonicalProblemId is NsPrm001CanonicalProblemId {
  if (!(ACTIVE_CP_IDS as readonly string[]).includes(canonicalProblemId)) {
    throw new Error(`NS-PRM-001 canonical problem is not active: ${canonicalProblemId}`);
  }
}

export function getCanonicalProblemConfig(canonicalProblemId: NsPrm001CanonicalProblemId) {
  const config = variableRangesLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!config) throw new Error(`NS-PRM-001 CP config is missing: ${canonicalProblemId}`);
  return config;
}

export function getTopology(canonicalProblemId: NsPrm001CanonicalProblemId) {
  return getCanonicalProblemConfig(canonicalProblemId).topology as NsPrm001Topology;
}

export function getQuestionLanguageEntries(canonicalProblemId: NsPrm001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === canonicalProblemId);
  if (!cp) throw new Error(`NS-PRM-001 question language is missing for ${canonicalProblemId}.`);
  return cp.entries;
}

export function getExplanationEntries(canonicalProblemId: NsPrm001CanonicalProblemId, answer: NsPrm001Answer) {
  const families = explanationLibrary.families.filter((entry) => entry.appliesTo.includes(canonicalProblemId));
  const family = canonicalProblemId === "CP-001" ? families.find((entry) => entry.answerClass === answer) : families[0];
  if (!family) throw new Error(`NS-PRM-001 explanation family is missing for ${canonicalProblemId}.`);
  return family.entries;
}

export function getExplanationFamily(canonicalProblemId: NsPrm001CanonicalProblemId, answer: NsPrm001Answer) {
  const families = explanationLibrary.families.filter((entry) => entry.appliesTo.includes(canonicalProblemId));
  const family = canonicalProblemId === "CP-001" ? families.find((entry) => entry.answerClass === answer) : families[0];
  if (!family) throw new Error(`NS-PRM-001 explanation family is missing for ${canonicalProblemId}.`);
  return family;
}

export function renderQuestionLanguage(input: {
  canonicalProblemId: NsPrm001CanonicalProblemId;
  questionLanguageId: string;
  values: Record<string, number | undefined>;
}) {
  const entry = getQuestionLanguageEntries(input.canonicalProblemId).find((item) => item.id === input.questionLanguageId);
  if (!entry) throw new Error(`Question language ID ${input.questionLanguageId} is not approved for ${input.canonicalProblemId}.`);
  return replacePlaceholders(entry.text, input.values);
}

export function renderExplanationLanguage(input: {
  canonicalProblemId: NsPrm001CanonicalProblemId;
  styleId: string;
  answer: NsPrm001Answer;
  values: Record<string, number | string | undefined>;
}) {
  const family = getExplanationFamily(input.canonicalProblemId, input.answer);
  const entry = family.entries.find((item) => item.id === input.styleId);
  if (!entry) throw new Error(`Explanation ID ${input.styleId} is not approved for ${input.canonicalProblemId}.`);
  return {
    familyId: family.familyId,
    lines: replacePlaceholders(entry.text, { ...input.values, answer: input.answer }).split("\n"),
  };
}

export function requiredVisibleFields(canonicalProblemId: NsPrm001CanonicalProblemId) {
  switch (canonicalProblemId) {
    case "CP-001":
    case "CP-006":
    case "CP-007":
      return ["number"] as const;
    case "CP-002":
    case "CP-003":
    case "CP-004":
    case "CP-005":
      return ["lowerBound", "upperBound"] as const;
    case "CP-008":
      return ["position"] as const;
  }
}

export function countBy(values: readonly (number | string)[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    const key = String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

export function rangeBucket(rangeWidth: number | undefined) {
  if (typeof rangeWidth !== "number") return "not-applicable";
  const bucket = coverageTargetsLibrary.targets.rangeCoverage.buckets.find(
    (entry) => rangeWidth >= entry.rangeWidth.min && rangeWidth <= entry.rangeWidth.max,
  );
  return bucket?.bucket ?? "out-of-range";
}

export function positionBucket(position: number | undefined) {
  if (typeof position !== "number") return "not-applicable";
  const bucket = coverageTargetsLibrary.targets.positionCoverage.buckets.find((entry) => {
    const [min, max] = entry.split("-").map(Number);
    return position >= min && position <= max;
  });
  return bucket ?? "out-of-range";
}

export function auditNsPrm001Batch(questionPackages: readonly NsPrm001QuestionPackage[], generationFailures = 0) {
  return {
    questionCount: questionPackages.length,
    generationFailures,
    validationFailures: questionPackages.filter((item) => !item.validation.valid).length,
    traceabilityFailures: questionPackages.filter(
      (item) => !item.questionId || !item.questionLanguageId || !item.explanationStyleId || !item.difficultyBand || !item.reasoningPatternId,
    ).length,
    difficultyDistribution: countBy(questionPackages.map((item) => item.difficultyBand)),
    primeCompositeDistribution: countBy(questionPackages.map((item) => item.solver.answerClass ?? item.answer)),
    rangeBucketDistribution: countBy(questionPackages.map((item) => rangeBucket(item.parameters.rangeWidth))),
    positionBucketDistribution: countBy(questionPackages.map((item) => positionBucket(item.parameters.position))),
    questionLanguageDistribution: countBy(questionPackages.map((item) => item.questionLanguageId)),
    explanationDistribution: countBy(questionPackages.map((item) => item.explanationStyleId)),
    topologyDistribution: countBy(questionPackages.map((item) => item.topology)),
  };
}

function replacePlaceholders(text: string, values: Record<string, number | string | undefined>) {
  return text.replaceAll(/\{([A-Za-z]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "number" && typeof value !== "string") throw new Error(`Missing value for placeholder: ${key}`);
    return String(value);
  });
}
