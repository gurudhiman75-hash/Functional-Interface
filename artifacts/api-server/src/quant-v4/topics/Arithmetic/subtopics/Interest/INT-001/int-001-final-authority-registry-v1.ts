export const INT_001_FINAL_AUTHORITY_REGISTRY_VERSION = "INT-001-FINAL-AUTHORITY-REGISTRY-v1" as const;
export const INT_001_PERMANENT_QL_COUNT = 130 as const;
export const INT_001_INTENTIONAL_VACANCY = "INT-QL-094" as const;
export const INT_001_NEXT_FREE_QL = "INT-QL-132" as const;

export type Int001Language = "en" | "hi" | "pa";
export type Int001CpId =
  | "INT-CP-001" | "INT-CP-002" | "INT-CP-003" | "INT-CP-004" | "INT-CP-005"
  | "INT-CP-006" | "INT-CP-007" | "INT-CP-008" | "INT-CP-009" | "INT-CP-010";

export interface Int001CheckpointAuthority {
  cpId: Int001CpId;
  qlIds: readonly string[];
  contentLanguages: readonly Int001Language[];
  currentQuestionStudioLanguages: readonly Int001Language[];
  authorityFrozen: true;
  questionBankWritable: false;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  notes: readonly string[];
}

function ql(number: number): string { return `INT-QL-${String(number).padStart(3, "0")}`; }
function range(start: number, end: number, exclusions: readonly number[] = []): readonly string[] {
  const excluded = new Set(exclusions);
  return Object.freeze(Array.from({ length: end - start + 1 }, (_, index) => start + index).filter((number) => !excluded.has(number)).map(ql));
}
function checkpoint(cpId: Int001CpId, qlIds: readonly string[], contentLanguages: readonly Int001Language[], currentQuestionStudioLanguages: readonly Int001Language[], notes: readonly string[] = []): Int001CheckpointAuthority {
  return Object.freeze({
    cpId, qlIds: Object.freeze([...qlIds]), contentLanguages: Object.freeze([...contentLanguages]), currentQuestionStudioLanguages: Object.freeze([...currentQuestionStudioLanguages]),
    authorityFrozen: true as const, questionBankWritable: false as const, testEligible: false as const, mockTestEligible: false as const, publiclyPublishable: false as const,
    notes: Object.freeze([...notes]),
  });
}
const ALL = ["en", "hi", "pa"] as const;

export const INT_001_FINAL_CHECKPOINT_AUTHORITIES: readonly Int001CheckpointAuthority[] = Object.freeze([
  checkpoint("INT-CP-001", range(1, 21), ALL, ALL, ["Approved multilingual authority is exposed through the registered review-only CP001 Question Studio adapter.", "Question Bank, tests, mocks and public delivery remain closed."]),
  checkpoint("INT-CP-002", range(22, 52), ["en"], ["en"], ["Current head contains cp002-final-registry.ts for INT-QL-022..052.", "Frozen English authority is exposed through the registered review-only CP002 Question Studio adapter; no Hindi/Punjabi CP002 learner authority is claimed.", "INT-QL-028..032 and INT-QL-042..045 remain simple-interest ledger ownership and must not drift into CP009."]),
  checkpoint("INT-CP-003", range(53, 66), ALL, ALL, ["Immutable English freeze and approved Hindi/Punjabi V3 freeze are exposed through the registered review-only CP003 Question Studio adapter.", "Question Bank, tests, mocks and public delivery remain closed."]),
  checkpoint("INT-CP-004", range(67, 85), ["hi", "pa"], ["hi", "pa"], ["Current native Question Studio registration is retained for certified Hindi/Punjabi surfaces.", "English is not chapter-registered until a remediated English learner surface is explicitly certified."]),
  checkpoint("INT-CP-005", range(86, 95, [94]), ALL, ALL, ["Frozen multilingual variable-growth/decay authority is exposed through the registered review-only CP005 Question Studio adapter.", "INT-QL-094 remains intentionally vacant: the migration/event-order family had no recovered Interest-family authority."]),
  checkpoint("INT-CP-006", range(96, 108), ALL, ALL, ["Frozen multilingual SI/CI-relations authority is exposed through the registered review-only CP006 Question Studio adapter.", "Punjabi CI terminology uses the approved native term."]),
  checkpoint("INT-CP-007", range(109, 115), ALL, ALL, ["Existing multilingual Question Studio review-only integration is retained."]),
  checkpoint("INT-CP-008", range(116, 124), ALL, ALL, ["Frozen multilingual instalment authority is exposed through the registered review-only CP008 Question Studio adapter."]),
  checkpoint("INT-CP-009", range(125, 129), ALL, ALL, ["Existing JSON-safe multilingual Question Studio review-only integration is retained.", "Owns compound/exact-periodic heterogeneous dated cash-flow authorities, not CP002 simple-interest ledgers."]),
  checkpoint("INT-CP-010", range(130, 131), ALL, ALL, ["Permanent multilingual authority frozen on the certified CP010 completion head.", "JSON-safe review-only Question Studio adapter and admin route are registered; downstream delivery remains closed."]),
]);

export const INT_001_FINAL_QL_IDS: readonly string[] = Object.freeze(INT_001_FINAL_CHECKPOINT_AUTHORITIES.flatMap((checkpointAuthority) => checkpointAuthority.qlIds));
const byQl = new Map<string, Int001CheckpointAuthority>();
for (const authority of INT_001_FINAL_CHECKPOINT_AUTHORITIES) for (const qlId of authority.qlIds) {
  if (byQl.has(qlId)) throw new Error(`Duplicate Interest permanent authority for ${qlId}`);
  byQl.set(qlId, authority);
}
export function getInt001CheckpointAuthorityByQl(qlId: string): Int001CheckpointAuthority {
  const authority = byQl.get(qlId);
  if (!authority) throw new Error(`No permanent Interest authority is registered for ${qlId}`);
  return authority;
}

export const INT_001_CHAPTER_LIFECYCLE = Object.freeze({
  contentAuthorityComplete: true as const,
  permanentQlCount: INT_001_PERMANENT_QL_COUNT,
  intentionalVacancy: INT_001_INTENTIONAL_VACANCY,
  nextFreeQl: INT_001_NEXT_FREE_QL,
  chapterQuestionStudioIntegrationComplete: true as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
});