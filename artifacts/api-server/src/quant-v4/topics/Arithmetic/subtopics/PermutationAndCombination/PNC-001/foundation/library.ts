import questionLanguageBase from "../question-language.en.json";
import questionLanguageCp003 from "../question-language.cp003.en.json";
import questionLanguageCp004 from "../question-language.cp004.en.json";
import questionLanguageCp005 from "../question-language.cp005.en.json";
import questionLanguageCp006 from "../question-language.cp006.en.json";
import questionLanguageEditorialRepairs from "../question-language.editorial-repairs.en.json";
import taskRegistryBase from "../task-registry.library.json";
import taskRegistryCp003 from "../task-registry.cp003.library.json";
import taskRegistryCp004 from "../task-registry.cp004.library.json";
import taskRegistryCp005 from "../task-registry.cp005.library.json";
import taskRegistryCp006 from "../task-registry.cp006.library.json";
import variableRanges from "../variable-ranges.library.json";
import constraintProfiles from "../constraint-profiles.library.json";
import explanationLibrary from "../explanation.en.json";
import explanationLibraryCp004 from "../explanation.cp004.en.json";
import explanationLibraryCp006 from "../explanation.cp006.en.json";
import qlSpecificExplanationLibrary from "../explanation-by-ql.en.json";
import qlSpecificExplanationLibraryCp005Rank from "../explanation-by-ql.cp005-rank.en.json";
import qlSpecificExplanationEditorialRepairs from "../explanation-by-ql.editorial-repairs.en.json";
import type {
  Pnc001Difficulty,
  Pnc001QuestionEntry,
  Pnc001QuestionLanguageEntry,
  Pnc001RegistryGroup,
  Pnc001SolveMode,
} from "./types";

type ExplanationStrategy = { solveMode: Pnc001SolveMode; concept: string; lines: string[] };
type QlSpecificExplanation = { lines: string[] };
type QuestionLanguageRepair = { template: string };
type VariableRanges = {
  packageId: "PNC-001";
  answerCeiling: number;
  ranges: Record<Pnc001Difficulty, {
    twoStage: number[]; threeStage: number[]; invalid: number[]; recovered: number[];
    factorial: number[]; factorialGap: number[];
    permutationN: number[]; permutationR: number[];
    combinationN: number[]; combinationR: number[];
    multisetTotal: number[]; multisetRepeat: number[];
    digitMaximum: number[]; digitLength: number[];
    letterChoices: number[]; digitChoices: number[]; codeSlots: number[];
    mixedPool: number[]; mixedSelection: number[]; mixedRoles: number[];
  }>;
  generation: {
    maxAttempts: number; minimumAnswer: number; preferDistinctStageCounts: boolean;
    maximumFactorialArgument: number; maximumPermutationObjects: number; maximumCombinationObjects: number;
    maximumMultisetObjects: number; maximumMultisetMultiplicity: number;
    maximumDigit: number; maximumCodeLength: number; maximumCodeSymbols: number;
    maximumMixedPool: number; maximumMixedSelection: number; maximumMixedRoles: number;
  };
};

const rawQlEntries = [
  ...(questionLanguageBase.entries as Pnc001QuestionLanguageEntry[]),
  ...(questionLanguageCp003.entries as Pnc001QuestionLanguageEntry[]),
  ...(questionLanguageCp004.entries as Pnc001QuestionLanguageEntry[]),
  ...(questionLanguageCp005.entries as Pnc001QuestionLanguageEntry[]),
  ...(questionLanguageCp006.entries as Pnc001QuestionLanguageEntry[]),
];
const questionRepairs = questionLanguageEditorialRepairs.entries as Record<string, QuestionLanguageRepair>;
const rawQlIds = new Set(rawQlEntries.map((entry) => entry.qlId));
for (const qlId of Object.keys(questionRepairs)) {
  if (!rawQlIds.has(qlId)) throw new Error(`PNC-001 editorial stem override references unknown QL ${qlId}`);
}
const qlEntries = rawQlEntries.map((entry) => {
  const repair = questionRepairs[entry.qlId];
  return repair ? { ...entry, template: repair.template } : entry;
});

const registryGroups = [
  ...(taskRegistryBase.groups as Pnc001RegistryGroup[]),
  ...(taskRegistryCp003.groups as Pnc001RegistryGroup[]),
  ...(taskRegistryCp004.groups as Pnc001RegistryGroup[]),
  ...(taskRegistryCp005.groups as Pnc001RegistryGroup[]),
  ...(taskRegistryCp006.groups as Pnc001RegistryGroup[]),
];
const qlById = new Map(qlEntries.map((entry) => [entry.qlId, entry]));
const expandedEntries: Pnc001QuestionEntry[] = registryGroups.flatMap((group) => group.qlIds.map((qlId) => {
  const languageEntry = qlById.get(qlId);
  if (!languageEntry) throw new Error(`PNC-001 registry references missing English QL ${qlId}`);
  if (languageEntry.cpId !== group.cpId) throw new Error(`PNC-001 CP mismatch for ${qlId}`);
  if (languageEntry.difficulty !== group.difficulty) throw new Error(`PNC-001 difficulty mismatch for ${qlId}`);
  if (!group.distractorProfile) throw new Error(`PNC-001 registry missing distractorProfile for ${qlId}`);
  return {
    ...languageEntry,
    taskKind: group.taskKind,
    solveMode: group.solveMode as Pnc001SolveMode,
    answerType: group.answerType,
    explanationId: group.explanationId,
    requiredVariables: [...group.requiredVariables],
    scenarioFamily: group.scenarioFamily,
    constraintProfile: group.constraintProfile,
    distractorProfile: group.distractorProfile,
    active: group.active,
  };
}));

const entryIds = expandedEntries.map((entry) => entry.qlId);
if (new Set(entryIds).size !== entryIds.length) throw new Error("Duplicate PNC-001 QL ids in task registry");
if (entryIds.length !== qlEntries.length) throw new Error(`PNC-001 registry/language count mismatch: ${entryIds.length}/${qlEntries.length}`);
for (const ql of qlEntries) if (!entryIds.includes(ql.qlId)) throw new Error(`PNC-001 English QL missing from registry: ${ql.qlId}`);

const entries = expandedEntries.filter((entry) => entry.active).sort((a, b) => a.qlId.localeCompare(b.qlId));
const entryById = new Map(entries.map((entry) => [entry.qlId, entry]));
const strategies = {
  ...(explanationLibrary.strategies as Record<string, ExplanationStrategy>),
  ...(explanationLibraryCp004.strategies as Record<string, ExplanationStrategy>),
  ...(explanationLibraryCp006.strategies as Record<string, ExplanationStrategy>),
};
const expectedStrategyCount = Object.keys(explanationLibrary.strategies).length
  + Object.keys(explanationLibraryCp004.strategies).length
  + Object.keys(explanationLibraryCp006.strategies).length;
if (Object.keys(strategies).length !== expectedStrategyCount) throw new Error("Duplicate PNC-001 explanation strategy ids across libraries");

const baseQlSpecificExplanations = qlSpecificExplanationLibrary.entries as Record<string, QlSpecificExplanation>;
const rankQlSpecificExplanations = qlSpecificExplanationLibraryCp005Rank.entries as Record<string, QlSpecificExplanation>;
const originalQlSpecificExplanations: Record<string, QlSpecificExplanation> = {
  ...baseQlSpecificExplanations,
  ...rankQlSpecificExplanations,
};
const expectedOriginalCount = Object.keys(baseQlSpecificExplanations).length + Object.keys(rankQlSpecificExplanations).length;
if (Object.keys(originalQlSpecificExplanations).length !== expectedOriginalCount) {
  throw new Error("Duplicate PNC-001 base QL-specific explanation ids across libraries");
}
const explanationRepairs = qlSpecificExplanationEditorialRepairs.entries as Record<string, QlSpecificExplanation>;
for (const qlId of Object.keys(explanationRepairs)) {
  if (!Object.prototype.hasOwnProperty.call(originalQlSpecificExplanations, qlId)) {
    throw new Error(`PNC-001 editorial explanation override references unknown QL ${qlId}`);
  }
}
const qlSpecificExplanations: Record<string, QlSpecificExplanation> = {
  ...originalQlSpecificExplanations,
  ...explanationRepairs,
};
const qlSpecificIds = Object.keys(qlSpecificExplanations).sort();
const activeIds = entries.map((entry) => entry.qlId);
if (JSON.stringify(qlSpecificIds) !== JSON.stringify(activeIds)) {
  throw new Error(`PNC-001 QL-specific explanation parity mismatch: ${qlSpecificIds.length}/${activeIds.length}`);
}
const normalizedExplanationTexts = qlSpecificIds.map((qlId) => qlSpecificExplanations[qlId]!.lines.join(" ").trim().replace(/\s+/g, " ").toLowerCase());
if (new Set(normalizedExplanationTexts).size !== normalizedExplanationTexts.length) {
  throw new Error("Duplicate PNC-001 QL-specific explanation text");
}
for (const qlId of qlSpecificIds) {
  const lines = qlSpecificExplanations[qlId]!.lines;
  if (lines.length < 3 || lines.some((line) => !line.trim())) throw new Error(`PNC-001 explanation ${qlId} must contain at least three non-empty lines`);
}

export function getPnc001QuestionEntries(): Pnc001QuestionEntry[] { return entries.map((e) => ({ ...e, requiredVariables: [...e.requiredVariables] })); }
export function getPnc001QuestionEntry(qlId: string): Pnc001QuestionEntry {
  const entry = entryById.get(qlId); if (!entry) throw new Error(`Unknown active PNC-001 QL: ${qlId}`);
  return { ...entry, requiredVariables: [...entry.requiredVariables] };
}
export function getPnc001QuestionLanguageIds(): string[] { return entries.map((e) => e.qlId); }
export function getPnc001QlIdsForSolveMode(mode: Pnc001SolveMode): string[] { return entries.filter((e) => e.solveMode === mode).map((e) => e.qlId); }
export function getPnc001ExplanationStrategy(explanationId: string): ExplanationStrategy {
  const strategy = strategies[explanationId]; if (!strategy) throw new Error(`Unknown PNC-001 explanation strategy: ${explanationId}`);
  return { ...strategy, lines: [...strategy.lines] };
}
export function getPnc001QlSpecificExplanation(qlId: string): QlSpecificExplanation {
  const explanation = qlSpecificExplanations[qlId];
  if (!explanation) throw new Error(`Unknown PNC-001 QL-specific explanation: ${qlId}`);
  return { lines: [...explanation.lines] };
}
export function getPnc001VariableRanges(): VariableRanges { return variableRanges as VariableRanges; }
export function getPnc001ConstraintProfile(profileId: string): Record<string, unknown> {
  const profile = (constraintProfiles.profiles as Record<string, Record<string, unknown>>)[profileId];
  if (!profile) throw new Error(`Unknown PNC-001 constraint profile: ${profileId}`); return { ...profile };
}
export function renderPnc001Template(template: string, variables: Record<string, string | number>): string {
  const unresolved: string[] = [];
  const rendered = template.replace(/\{([A-Za-z0-9_]+)\}/g, (_, key: string) => {
    if (Object.prototype.hasOwnProperty.call(variables, key)) return String(variables[key]);
    unresolved.push(key); return `{${key}}`;
  });
  if (unresolved.length) throw new Error(`Unresolved PNC-001 placeholders: ${unresolved.join(", ")}`);
  return rendered;
}