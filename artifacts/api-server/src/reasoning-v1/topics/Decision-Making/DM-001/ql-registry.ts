import { DM_001_CHECKPOINT_IDS, DM_001_QL_IDS, type DmCheckpointId, type DmQlId } from "./types.ts";

export type DmQlEntry = Readonly<{
  qlId: DmQlId;
  checkpointId: DmCheckpointId;
  ruleFamily: string;
  solveMode: string;
  answerType: "DECISION_OUTCOME";
  renderer: "RULES_AND_CANDIDATE_PROFILE";
  localeMode: "TRANSLATABLE";
  status: "IMPLEMENTED_REVIEW_ONLY";
}>;

const QL_DEFINITIONS = [
  ["BASIC_AGE_QUALIFICATION_REGISTRATION", "CONJUNCTIVE_RULE_EVALUATION"],
  ["BASIC_MARKS_RESIDENCE_CREDENTIAL", "CONJUNCTIVE_RULE_EVALUATION"],
  ["BASIC_AGE_EXPERIENCE_CERTIFICATE", "CONJUNCTIVE_RULE_EVALUATION"],
  ["FIVE_RULE_SIMULTANEOUS_CHECK", "CONJUNCTIVE_RULE_EVALUATION"],
  ["SIX_RULE_SIMULTANEOUS_CHECK", "CONJUNCTIVE_RULE_EVALUATION"],
  ["SEVEN_RULE_SIMULTANEOUS_CHECK", "CONJUNCTIVE_RULE_EVALUATION"],
  ["SINGLE_CONDITIONAL_EXCEPTION", "PRIORITIZED_EXCEPTION_EVALUATION"],
  ["NESTED_AGE_RELAXATION", "PRIORITIZED_EXCEPTION_EVALUATION"],
  ["MARKS_AND_QUALIFICATION_EXCEPTION", "PRIORITIZED_EXCEPTION_EVALUATION"],
  ["DOCUMENT_REFERRAL", "ORDERED_ESCALATION_EVALUATION"],
  ["AGE_BASED_DIRECTOR_REFERRAL", "ORDERED_ESCALATION_EVALUATION"],
  ["BORDERLINE_COMMITTEE_REFERRAL", "ORDERED_ESCALATION_EVALUATION"],
  ["AGE_ON_CUTOFF_DATE", "DATE_DERIVED_AGE_EVALUATION"],
  ["QUALIFICATION_AND_RELEVANT_EXPERIENCE", "MULTI_FIELD_PROFILE_EVALUATION"],
  ["AGE_QUALIFICATION_EXPERIENCE_COMBINATION", "MULTI_FIELD_PROFILE_EVALUATION"],
] as const;

export const DM_001_QL_REGISTRY: readonly DmQlEntry[] = Object.freeze(
  DM_001_QL_IDS.map((qlId, index) => Object.freeze({
    qlId,
    checkpointId: DM_001_CHECKPOINT_IDS[Math.floor(index / 3)]!,
    ruleFamily: QL_DEFINITIONS[index]![0],
    solveMode: QL_DEFINITIONS[index]![1],
    answerType: "DECISION_OUTCOME" as const,
    renderer: "RULES_AND_CANDIDATE_PROFILE" as const,
    localeMode: "TRANSLATABLE" as const,
    status: "IMPLEMENTED_REVIEW_ONLY" as const,
  })),
);

export function assertContinuousDmQlIds(entries: readonly Pick<DmQlEntry, "qlId">[] = DM_001_QL_REGISTRY): void {
  const expected = DM_001_QL_IDS;
  const actual = entries.map((entry) => entry.qlId);
  if (actual.length !== expected.length || actual.some((id, index) => id !== expected[index])) {
    throw new Error("DM-001 QL IDs must be continuous and match the permanent chapter registry.");
  }
}

export function dmQlEntry(qlId: string): DmQlEntry {
  const entry = DM_001_QL_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error("Unknown DM-001 QL: " + qlId);
  return entry;
}

export function dmQlIdsForCheckpoint(checkpointId: DmCheckpointId): readonly DmQlId[] {
  return DM_001_QL_REGISTRY.filter((entry) => entry.checkpointId === checkpointId).map((entry) => entry.qlId);
}
