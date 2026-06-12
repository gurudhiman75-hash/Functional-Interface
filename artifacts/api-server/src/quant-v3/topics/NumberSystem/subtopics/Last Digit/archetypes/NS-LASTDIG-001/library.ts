import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_LASTDIG_001_MATHJAX_KEYS } from "./math";
import type { NsLastdig001CanonicalProblemId, NsLastdig001QuestionPackage } from "./types";

export const NS_LASTDIG_001_ACTIVE_CP_IDS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005"] as const;

export function getNsLastdig001ActiveCanonicalProblemIds() {
  return [...NS_LASTDIG_001_ACTIVE_CP_IDS] as NsLastdig001CanonicalProblemId[];
}

export function validateNsLastdig001Libraries() {
  const failures: string[] = [];
  for (const lib of [questionLanguageLibrary, explanationLibrary, variableRangesLibrary, coverageTargetsLibrary, distributionTargetsLibrary]) {
    if (lib.archetypeId !== "NS-LASTDIG-001") failures.push(`${lib.libraryId} archetype mismatch.`);
  }
  const cpIds = questionLanguageLibrary.canonicalProblems.map((cp) => cp.cpId);
  if (JSON.stringify(cpIds) !== JSON.stringify(NS_LASTDIG_001_ACTIVE_CP_IDS)) failures.push("Active CP list must be CP-001 through CP-005.");
  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  if (qlIds.length !== 58) failures.push("QL count must be 58.");
  for (let i = 1; i <= 58; i += 1) {
    const id = `QL-${String(i).padStart(3, "0")}`;
    if (!qlIds.includes(id)) failures.push(`Missing ${id}.`);
  }
  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(["ES-001", "ES-002", "ES-003", "ES-004", "ES-005"])) failures.push("ES IDs must be ES-001 through ES-005.");
  for (const key of NS_LASTDIG_001_MATHJAX_KEYS) {
    if (!explanationLibrary.mathJaxSupport.supportedPlaceholders.includes(key)) failures.push(`Missing MathJax placeholder ${key}.`);
  }
  return { valid: failures.length === 0, failures };
}

export function getQuestionLanguageEntries(cpId: NsLastdig001CanonicalProblemId) {
  const cp = questionLanguageLibrary.canonicalProblems.find((entry) => entry.cpId === cpId);
  if (!cp) throw new Error(`Missing question language for ${cpId}.`);
  return cp.entries;
}

export function getExplanationFamily(cpId: NsLastdig001CanonicalProblemId) {
  const family = explanationLibrary.families.find((entry) => entry.appliesTo.includes(cpId));
  if (!family) throw new Error(`Missing explanation family for ${cpId}.`);
  return family;
}

export function renderQuestion(cpId: NsLastdig001CanonicalProblemId, questionLanguageId: string, values: Record<string, string | number | undefined>) {
  const entry = getQuestionLanguageEntries(cpId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ${questionLanguageId} not approved for ${cpId}.`);
  return replacePlaceholders(entry.text, values);
}

export function renderExplanation(cpId: NsLastdig001CanonicalProblemId, explanationId: string, values: Record<string, string | number | undefined>) {
  const family = getExplanationFamily(cpId);
  const entry = family.entries.find((item) => item.id === explanationId);
  if (!entry) throw new Error(`Explanation ${explanationId} not approved for ${cpId}.`);
  return { familyId: family.familyId, lines: replacePlaceholders(entry.text, values).split("\n") };
}

export function auditNsLastdig001Batch(packages: readonly NsLastdig001QuestionPackage[]) {
  const cpId = packages[0]?.canonicalProblemId;
  const qlIds = cpId ? getQuestionLanguageEntries(cpId).map((entry) => entry.id) : [];
  const esIds = cpId ? getExplanationFamily(cpId).entries.map((entry) => entry.id) : [];
  const ql = countBy(packages.map((item) => item.questionLanguageId));
  const es = countBy(packages.map((item) => item.explanationId));
  return {
    questionCount: packages.length,
    generationFailures: 0,
    validationFailures: packages.filter((item) => !item.validation.valid).length,
    traceabilityFailures: packages.filter((item) => item.traceability.questionId !== item.questionId || item.traceability.answer !== item.answer).length,
    mathJaxFailures: packages.filter((item) => !NS_LASTDIG_001_MATHJAX_KEYS.every((key) => item[key].length > 0)).length,
    unusedQuestionLanguageIds: qlIds.filter((id) => !ql[id]),
    unusedExplanationIds: esIds.filter((id) => !es[id]),
    difficultyDistribution: countBy(packages.map((item) => item.difficultyBand)),
    canonicalProblemDistribution: countBy(packages.map((item) => item.canonicalProblemId)),
    questionLanguageDistribution: ql,
    explanationDistribution: es,
    baseLastDigitCoverage: countBy(packages.map((item) => item.solver.baseLastDigit ?? "not-applicable")),
    cycleLengthCoverage: countBy(packages.map((item) => item.parameters.cycleLengthBucket ?? "not-applicable")),
    exponentMagnitudeCoverage: countBy(packages.map((item) => item.parameters.exponentMagnitude ?? "not-applicable")),
    termCountCoverage: countBy(packages.map((item) => item.parameters.termCountBucket ?? "not-applicable")),
    cycleMixCoverage: countBy(packages.map((item) => item.parameters.cycleMixBucket ?? "not-applicable")),
    towerHeightCoverage: countBy(packages.map((item) => item.parameters.towerHeightBucket ?? "not-applicable")),
    towerReductionCoverage: countBy(packages.map((item) => item.parameters.towerReductionBucket ?? "not-applicable")),
    cycleTypeCoverage: countBy(packages.map((item) => item.parameters.cycleTypeBucket ?? "not-applicable")),
    questionStyleCoverage: countBy(packages.map((item) => item.parameters.questionStyleBucket ?? "not-applicable")),
    optionCountCoverage: countBy(packages.map((item) => item.parameters.optionCountBucket ?? "not-applicable")),
    distractorCoverage: countBy(packages.map((item) => item.parameters.distractorBucket ?? "not-applicable")),
    mathJaxUsage: Object.fromEntries(NS_LASTDIG_001_MATHJAX_KEYS.map((key) => [key, packages.filter((item) => item[key].length > 0).length])),
  };
}

export function replacePlaceholders(text: string, values: Record<string, string | number | undefined>) {
  return text.replaceAll(/\{([A-Za-z]+)\}/g, (_match, key: string) => {
    const value = values[key];
    if (typeof value !== "string" && typeof value !== "number") throw new Error(`Missing placeholder ${key}.`);
    return String(value);
  });
}

function countBy(values: readonly (string | number | boolean)[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    const key = String(value);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
