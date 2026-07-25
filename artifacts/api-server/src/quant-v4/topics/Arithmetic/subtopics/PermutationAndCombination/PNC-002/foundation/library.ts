import questionLanguageBase from "../question-language.en.json";
import questionLanguageSaturation from "../question-language.cp007-saturation.en.json";
import taskRegistryBase from "../task-registry.library.json";
import taskRegistrySaturation from "../task-registry.cp007-saturation.library.json";
import explanationLibraryBase from "../explanation-by-ql.en.json";
import explanationLibrarySaturation from "../explanation-by-ql.cp007-saturation.en.json";
import variableRangesBase from "../variable-ranges.library.json";
import variableRangesSaturation from "../variable-ranges.cp007-saturation.library.json";
import constraintProfilesBase from "../constraint-profiles.library.json";
import constraintProfilesSaturation from "../constraint-profiles.cp007-saturation.library.json";
import type {
  Pnc002QuestionEntry,
  Pnc002QuestionLanguageEntry,
  Pnc002RegistryGroup,
} from "./types";

type ExplanationRecord = { lines: string[] };
type VariableRanges = {
  packageId: string;
  answerCeiling: number;
  pools: typeof variableRangesBase.pools & typeof variableRangesSaturation.pools;
};
type ConstraintProfile = { orderMatters: boolean; linear: boolean; rule: string };

const qlEntries = [
  ...questionLanguageBase.entries,
  ...questionLanguageSaturation.entries,
] as Pnc002QuestionLanguageEntry[];
const registryGroups = [
  ...taskRegistryBase.groups,
  ...taskRegistrySaturation.groups,
] as Pnc002RegistryGroup[];
const explanations = {
  ...explanationLibraryBase.entries,
  ...explanationLibrarySaturation.entries,
} as Record<string, ExplanationRecord>;
const variableRanges: VariableRanges = {
  packageId: variableRangesBase.packageId,
  answerCeiling: variableRangesBase.answerCeiling,
  pools: {
    ...variableRangesBase.pools,
    ...variableRangesSaturation.pools,
  },
};
const constraintProfiles = {
  ...constraintProfilesBase.profiles,
  ...constraintProfilesSaturation.profiles,
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
  if (registry.cpId !== ql.cpId) throw new Error(`PNC-002 CP mismatch for ${ql.qlId}`);
  if (registry.difficulty !== ql.difficulty) throw new Error(`PNC-002 difficulty mismatch for ${ql.qlId}`);
  return {
    ...ql,
    taskKind: registry.taskKind,
    solveMode: registry.solveMode,
    answerType: registry.answerType,
    explanationId: registry.explanationId,
    requiredVariables: [...registry.requiredVariables],
    scenarioFamily: registry.scenarioFamily,
    constraintProfile: registry.constraintProfile,
    distractorProfile: registry.distractorProfile,
    active: registry.active,
  };
});

const qlIds = entries.map((entry) => entry.qlId);
if (new Set(qlIds).size !== qlIds.length) throw new Error("Duplicate PNC-002 question-language IDs");
for (const qlId of registryByQl.keys()) {
  if (!qlIds.includes(qlId)) throw new Error(`Registry record ${qlId} has no PNC-002 language entry`);
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

export function getPnc002QuestionLanguageIds(): string[] {
  return entries.map((entry) => entry.qlId);
}

export function getPnc002Explanation(qlId: string): ExplanationRecord {
  const explanation = explanations[qlId];
  if (!explanation) throw new Error(`Missing PNC-002 explanation for ${qlId}`);
  return { lines: [...explanation.lines] };
}

export function getPnc002VariableRanges(): VariableRanges {
  return variableRanges;
}

export function getPnc002ConstraintProfile(profileId: string): ConstraintProfile {
  const profile = constraintProfiles[profileId];
  if (!profile) throw new Error(`Unknown PNC-002 constraint profile: ${profileId}`);
  return { ...profile };
}

export function renderPnc002Template(
  template: string,
  variables: Record<string, string | number>,
): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.split(`{${key}}`).join(String(value));
  }
  const unresolved = [...rendered.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map((match) => match[1]);
  if (unresolved.length) throw new Error(`Unresolved PNC-002 placeholders: ${unresolved.join(", ")}`);
  return rendered;
}
