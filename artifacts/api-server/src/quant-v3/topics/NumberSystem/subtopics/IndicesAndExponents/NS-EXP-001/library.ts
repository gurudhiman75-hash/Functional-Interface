import questionLanguageLibrary from "./question-language.library.json";
import explanationLibrary from "./explanation.library.json";
import variableRangesLibrary from "./variable-ranges.library.json";
import coverageTargetsLibrary from "./coverage-targets.library.json";
import distributionTargetsLibrary from "./distribution-targets.library.json";
import { NS_EXP_001_MATHJAX_KEYS } from "./math";
import type { NsExp001CanonicalProblemId, NsExp001QuestionPackage } from "./types";

export const NS_EXP_001_ACTIVE_CP_IDS = ["CP01", "CP02", "CP03", "CP04", "CP05", "CP06", "CP07", "CP09"] as const;

export function getNsExp001ActiveCanonicalProblemIds() {
  return [...NS_EXP_001_ACTIVE_CP_IDS] as NsExp001CanonicalProblemId[];
}

export function validateNsExp001Libraries() {
  const failures: string[] = [];
  for (const lib of [questionLanguageLibrary, explanationLibrary, variableRangesLibrary, coverageTargetsLibrary, distributionTargetsLibrary]) {
    if (lib.archetypeId !== "NS-EXP-001") failures.push(`${lib.libraryId} archetype mismatch.`);
  }
  const qlIds = questionLanguageLibrary.canonicalProblems.flatMap((cp) => cp.entries.map((entry) => entry.id));
  if (qlIds.length !== 190) failures.push("QL count must be 190.");
  for (let i = 1; i <= 190; i += 1) {
    const id = `QL-${String(i).padStart(3, "0")}`;
    if (!qlIds.includes(id)) failures.push(`Missing ${id}.`);
  }
  const esIds = explanationLibrary.families.flatMap((family) => family.entries.map((entry) => entry.id));
  if (JSON.stringify(esIds) !== JSON.stringify(["ES-001", "ES-002", "ES-003", "ES-004", "ES-005", "ES-006", "ES-007", "ES-008"])) failures.push("ES IDs must be ES-001 through ES-008.");
  return { valid: failures.length === 0, failures };
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

export function renderQuestion(cpId: NsExp001CanonicalProblemId, questionLanguageId: string) {
  const entry = getQuestionLanguageEntries(cpId).find((item) => item.id === questionLanguageId);
  if (!entry) throw new Error(`Question language ${questionLanguageId} not approved for ${cpId}.`);
  return entry.text;
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
