import { TSD_CP005_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";

export interface TsdCp005PermanentQlAllocation {
  readonly authorityKey: string;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly status: "PERMANENT_QL_ALLOCATED";
}

const ids = Object.freeze([
  "TSD-QL-058", "TSD-QL-059", "TSD-QL-060", "TSD-QL-061", "TSD-QL-062",
  "TSD-QL-063", "TSD-QL-064", "TSD-QL-065", "TSD-QL-066", "TSD-QL-067",
  "TSD-QL-068", "TSD-QL-069", "TSD-QL-070",
] as const);

export const TSD_CP005_PERMANENT_QL_ALLOCATIONS: readonly TsdCp005PermanentQlAllocation[] = Object.freeze(
  TSD_CP005_APPROVED_LEARNER_AUTHORITIES.map((authority, index) => Object.freeze({
    authorityKey: authority.authorityKey,
    permanentQlId: ids[index]!,
    status: "PERMANENT_QL_ALLOCATED" as const,
  })),
);

export const TSD_CP005_PERMANENT_QL_IDS = Object.freeze(TSD_CP005_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.permanentQlId));
export const TSD_CP005_NEXT_PERMANENT_QL_ID = "TSD-QL-071" as const;

export function cp005QlForAuthority(authorityKey: string): TsdCp005PermanentQlAllocation {
  const allocation = TSD_CP005_PERMANENT_QL_ALLOCATIONS.find((entry) => entry.authorityKey === authorityKey);
  if (!allocation) throw new Error(`CP005 authority ${authorityKey} has no permanent QL allocation`);
  return allocation;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP005_PERMANENT_QL_ALLOCATIONS.length === 13, "CP005 must allocate exactly thirteen permanent QLs");
assert(TSD_CP005_PERMANENT_QL_IDS[0] === "TSD-QL-058", "CP005 QL allocation must begin at TSD-QL-058");
assert(TSD_CP005_PERMANENT_QL_IDS[12] === "TSD-QL-070", "CP005 QL allocation must end at TSD-QL-070");
assert(new Set(TSD_CP005_PERMANENT_QL_IDS).size === 13, "CP005 permanent QL allocation contains duplicate IDs");
assert(new Set(TSD_CP005_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.authorityKey)).size === 13, "CP005 permanent QL allocation contains duplicate authorities");
