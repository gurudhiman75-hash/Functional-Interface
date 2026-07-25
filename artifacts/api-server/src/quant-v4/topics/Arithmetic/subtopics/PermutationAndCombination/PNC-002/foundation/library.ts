import questionLanguageBase from "../question-language.en.json";
import questionLanguageSaturation from "../question-language.cp007-saturation.en.json";
import questionLanguageCp008 from "../question-language.cp008.en.json";
import questionLanguageCp008Saturation from "../question-language.cp008-saturation.en.json";
import questionLanguageCp009 from "../question-language.cp009.en.json";
import questionLanguageCp009Saturation from "../question-language.cp009-saturation.en.json";
import questionLanguageCp010 from "../question-language.cp010.en.json";
import questionLanguageCp010Saturation from "../question-language.cp010-saturation.en.json";
import taskRegistryBase from "../task-registry.library.json";
import taskRegistrySaturation from "../task-registry.cp007-saturation.library.json";
import taskRegistryCp008 from "../task-registry.cp008.library.json";
import taskRegistryCp008Saturation from "../task-registry.cp008-saturation.library.json";
import taskRegistryCp009 from "../task-registry.cp009.library.json";
import taskRegistryCp009Saturation from "../task-registry.cp009-saturation.library.json";
import taskRegistryCp010 from "../task-registry.cp010.library.json";
import taskRegistryCp010Saturation from "../task-registry.cp010-saturation.library.json";
import explanationLibraryBase from "../explanation-by-ql.en.json";
import explanationLibrarySaturation from "../explanation-by-ql.cp007-saturation.en.json";
import explanationLibraryCp008 from "../explanation-by-ql.cp008.en.json";
import explanationLibraryCp008Saturation from "../explanation-by-ql.cp008-saturation.en.json";
import explanationLibraryCp009 from "../explanation-by-ql.cp009.en.json";
import explanationLibraryCp009Saturation from "../explanation-by-ql.cp009-saturation.en.json";
import explanationLibraryCp010 from "../explanation-by-ql.cp010.en.json";
import explanationLibraryCp010Editorial from "../explanation-by-ql.cp010-editorial.en.json";
import explanationLibraryCp010Saturation from "../explanation-by-ql.cp010-saturation.en.json";
import variableRangesBase from "../variable-ranges.library.json";
import variableRangesSaturation from "../variable-ranges.cp007-saturation.library.json";
import variableRangesCp008 from "../variable-ranges.cp008.library.json";
import variableRangesCp008Saturation from "../variable-ranges.cp008-saturation.library.json";
import variableRangesCp009 from "../variable-ranges.cp009.library.json";
import variableRangesCp009Saturation from "../variable-ranges.cp009-saturation.library.json";
import variableRangesCp010 from "../variable-ranges.cp010.library.json";
import constraintProfilesBase from "../constraint-profiles.library.json";
import constraintProfilesSaturation from "../constraint-profiles.cp007-saturation.library.json";
import constraintProfilesCp008 from "../constraint-profiles.cp008.library.json";
import constraintProfilesCp008Saturation from "../constraint-profiles.cp008-saturation.library.json";
import constraintProfilesCp009 from "../constraint-profiles.cp009.library.json";
import constraintProfilesCp009Saturation from "../constraint-profiles.cp009-saturation.library.json";
import constraintProfilesCp010 from "../constraint-profiles.cp010.library.json";
import constraintProfilesCp010Saturation from "../constraint-profiles.cp010-saturation.library.json";
import type {
  Pnc002QuestionEntry,
  Pnc002QuestionLanguageEntry,
  Pnc002RegistryGroup,
} from "./types";

interface ExplanationRecord { lines: string[] }
type VariableRanges = {
  packageId: string;
  answerCeiling: number;
  pools: typeof variableRangesBase.pools
    & typeof variableRangesSaturation.pools
    & typeof variableRangesCp008.pools
    & typeof variableRangesCp008Saturation.pools
    & typeof variableRangesCp009.pools
    & typeof variableRangesCp009Saturation.pools
    & typeof variableRangesCp010.pools;
};
type ConstraintProfile = { orderMatters: boolean; linear: boolean; rule: string };
type RegistryOverride = Partial<Pick<
  Pnc002RegistryGroup,
  "difficulty" | "explanationId" | "requiredVariables" | "scenarioFamily" | "constraintProfile" | "distractorProfile" | "solveMode" | "taskKind"
>>;

const qlEntries = [
  ...questionLanguageBase.entries,
  ...questionLanguageSaturation.entries,
  ...questionLanguageCp008.entries,
  ...questionLanguageCp008Saturation.entries,
  ...questionLanguageCp009.entries,
  ...questionLanguageCp009Saturation.entries,
  ...questionLanguageCp010.entries,
  ...questionLanguageCp010Saturation.entries,
] as Pnc002QuestionLanguageEntry[];
const registryGroups = [
  ...taskRegistryBase.groups,
  ...taskRegistrySaturation.groups,
  ...taskRegistryCp008.groups,
  ...taskRegistryCp008Saturation.groups,
  ...taskRegistryCp009.groups,
  ...taskRegistryCp009Saturation.groups,
  ...taskRegistryCp010.groups,
  ...taskRegistryCp010Saturation.groups,
] as Pnc002RegistryGroup[];
const registryOverrides = {
  ...(taskRegistryCp009.perQlOverrides ?? {}),
  ...(taskRegistryCp009Saturation.perQlOverrides ?? {}),
} as Record<string, RegistryOverride>;
const explanations = {
  ...explanationLibraryBase.entries,
  ...explanationLibrarySaturation.entries,
  ...explanationLibraryCp008.entries,
  ...explanationLibraryCp008Saturation.entries,
  ...explanationLibraryCp009.entries,
  ...explanationLibraryCp009Saturation.entries,
  ...explanationLibraryCp010.entries,
  ...explanationLibraryCp010Editorial.entries,
  ...explanationLibraryCp010Saturation.entries,
} as Record<string, ExplanationRecord>;
const variableRanges: VariableRanges = {
  packageId: variableRangesBase.packageId,
  answerCeiling: variableRangesBase.answerCeiling,
  pools: {
    ...variableRangesBase.pools,
    ...variableRangesSaturation.pools,
    ...variableRangesCp008.pools,
    ...variableRangesCp008Saturation.pools,
    ...variableRangesCp009.pools,
    ...variableRangesCp009Saturation.pools,
    ...variableRangesCp010.pools,
  },
};
const constraintProfiles = {
  ...constraintProfilesBase.profiles,
  ...constraintProfilesSaturation.profiles,
  ...constraintProfilesCp008.profiles,
  ...constraintProfilesCp008Saturation.profiles,
  ...constraintProfilesCp009.profiles,
  ...constraintProfilesCp009Saturation.profiles,
  ...constraintProfilesCp010.profiles,
  ...constraintProfilesCp010Saturation.profiles,
} as Record<string, ConstraintProfile>;

const registryByQl = new Map<string, Pnc002RegistryGroup>();
for (const group of registryGroups) {
  if (!group.active) continue;
  for (const qlId of group.qlIds) {
    if (registryByQl.has(qlId)) throw new Error(`Duplicate PNC-002 registry ownership for ${qlId}`);
    registryByQl.set(qlId, group);
  }
}

const entries: Pnc002QuestionEntry[] = qlEntries.map((ql) => {
  const registry = registryByQl.get(ql.qlId);
  if (!registry) throw new Error(`Missing PNC-002 registry record for ${ql.qlId}`);
  const effective = { ...registry, ...(registryOverrides[ql.qlId] ?? {}) } as Pnc002RegistryGroup;
  if (effective.cpId !== ql.cpId) throw new Error(`PNC-002 CP mismatch for ${ql.qlId}`);
  if (effective.difficulty !== ql.difficulty) throw new Error(`PNC-002 difficulty mismatch for ${ql.qlId}`);
  return {
    ...ql,
    taskKind: effective.taskKind,
    solveMode: effective.solveMode,
    answerType: effective.answerType,
    explanationId: effective.explanationId,
    requiredVariables: [...effective.requiredVariables],
    scenarioFamily: effective.scenarioFamily,
    constraintProfile: effective.constraintProfile,
    distractorProfile: effective.distractorProfile,
    active: effective.active,
  };
});

const qlIds = entries.map((entry) => entry.qlId);
if (new Set(qlIds).size !== qlIds.length) throw new Error("Duplicate PNC-002 question-language IDs");
for (const qlId of registryByQl.keys()) {
  if (!qlIds.includes(qlId)) throw new Error(`Registry record ${qlId} has no PNC-002 language entry`);
}
for (const qlId of Object.keys(registryOverrides)) {
  if (!registryByQl.has(qlId)) throw new Error(`PNC-002 registry override ${qlId} has no group ownership`);
}
const explanationIds = Object.keys(explanations).sort();
if (JSON.stringify(explanationIds) !== JSON.stringify([...qlIds].sort())) {
  throw new Error("PNC-002 QL-specific explanation parity mismatch");
}
const explanationSignatures = new Set<string>();
for (const [qlId, explanation] of Object.entries(explanations)) {
  if (explanation.lines.length < 3) throw new Error(`${qlId} needs at least three explanation lines`);
  const signature = explanation.lines.join(" ").toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/\s+/g, " ").trim();
  if (explanationSignatures.has(signature)) throw new Error(`Duplicate PNC-002 explanation narrative at ${qlId}`);
  explanationSignatures.add(signature);
}

export function getPnc002QuestionEntries(): Pnc002QuestionEntry[] {
  return entries.map((entry) => ({ ...entry, requiredVariables: [...entry.requiredVariables] }));
}
export function getPnc002QuestionEntry(qlId: string): Pnc002QuestionEntry {
  const entry = entries.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown PNC-002 question language ID: ${qlId}`);
  return { ...entry, requiredVariables: [...entry.requiredVariables] };
}
export function getPnc002QuestionLanguageIds(): string[] { return entries.map((entry) => entry.qlId); }
export function getPnc002Explanation(qlId: string): ExplanationRecord {
  const explanation = explanations[qlId];
  if (!explanation) throw new Error(`Missing PNC-002 explanation for ${qlId}`);
  return { lines: [...explanation.lines] };
}
export function getPnc002VariableRanges(): VariableRanges { return variableRanges; }
export function getPnc002ConstraintProfile(profileId: string): ConstraintProfile {
  const profile = constraintProfiles[profileId];
  if (!profile) throw new Error(`Unknown PNC-002 constraint profile: ${profileId}`);
  return { ...profile };
}
export function renderPnc002Template(template: string, variables: Record<string, string | number>): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) rendered = rendered.split(`{${key}}`).join(String(value));
  const unresolved = [...rendered.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]);
  if (unresolved.length) throw new Error(`Unresolved PNC-002 placeholders: ${unresolved.join(", ")}`);
  return rendered;
}
