import { TSD_CP007_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";

export interface TsdCp007PermanentQlAllocation {
  readonly authorityKey: string;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly status: "PERMANENT_QL_ALLOCATED";
}

const ids = Object.freeze([
  "TSD-QL-084", "TSD-QL-085", "TSD-QL-086", "TSD-QL-087", "TSD-QL-088",
  "TSD-QL-089", "TSD-QL-090", "TSD-QL-091", "TSD-QL-092", "TSD-QL-093",
  "TSD-QL-094",
] as const);

export const TSD_CP007_PERMANENT_QL_ALLOCATIONS: readonly TsdCp007PermanentQlAllocation[] = Object.freeze(
  TSD_CP007_APPROVED_LEARNER_AUTHORITIES.map((authority, index) => Object.freeze({
    authorityKey: authority.authorityKey,
    permanentQlId: ids[index]!,
    status: "PERMANENT_QL_ALLOCATED" as const,
  })),
);

export const TSD_CP007_PERMANENT_QL_IDS = Object.freeze(TSD_CP007_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.permanentQlId));
export const TSD_CP007_NEXT_PERMANENT_QL_ID = "TSD-QL-095" as const;

export function cp007QlForAuthority(authorityKey: string): TsdCp007PermanentQlAllocation {
  const allocation = TSD_CP007_PERMANENT_QL_ALLOCATIONS.find((entry) => entry.authorityKey === authorityKey);
  if (!allocation) throw new Error(`CP007 authority ${authorityKey} has no permanent QL allocation`);
  return allocation;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP007_PERMANENT_QL_ALLOCATIONS.length === 11, "CP007 must allocate exactly eleven permanent QLs");
assert(TSD_CP007_PERMANENT_QL_IDS[0] === "TSD-QL-084", "CP007 QL allocation must begin at TSD-QL-084");
assert(TSD_CP007_PERMANENT_QL_IDS[10] === "TSD-QL-094", "CP007 QL allocation must end at TSD-QL-094");
assert(new Set(TSD_CP007_PERMANENT_QL_IDS).size === 11, "CP007 permanent QL allocation contains duplicate IDs");
assert(new Set(TSD_CP007_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.authorityKey)).size === 11, "CP007 permanent QL allocation contains duplicate authorities");
