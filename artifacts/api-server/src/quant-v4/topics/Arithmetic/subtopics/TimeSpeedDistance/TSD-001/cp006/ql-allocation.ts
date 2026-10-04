import { TSD_CP006_APPROVED_LEARNER_AUTHORITIES } from "./approved-authority-registry";

export interface TsdCp006PermanentQlAllocation {
  readonly authorityKey: string;
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly status: "PERMANENT_QL_ALLOCATED";
}

const ids = Object.freeze([
  "TSD-QL-071", "TSD-QL-072", "TSD-QL-073", "TSD-QL-074", "TSD-QL-075",
  "TSD-QL-076", "TSD-QL-077", "TSD-QL-078", "TSD-QL-079", "TSD-QL-080",
  "TSD-QL-081", "TSD-QL-082", "TSD-QL-083",
] as const);

export const TSD_CP006_PERMANENT_QL_ALLOCATIONS: readonly TsdCp006PermanentQlAllocation[] = Object.freeze(
  TSD_CP006_APPROVED_LEARNER_AUTHORITIES.map((authority, index) => Object.freeze({
    authorityKey: authority.authorityKey,
    permanentQlId: ids[index]!,
    status: "PERMANENT_QL_ALLOCATED" as const,
  })),
);

export const TSD_CP006_PERMANENT_QL_IDS = Object.freeze(TSD_CP006_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.permanentQlId));
export const TSD_CP006_NEXT_PERMANENT_QL_ID = "TSD-QL-084" as const;

export function cp006QlForAuthority(authorityKey: string): TsdCp006PermanentQlAllocation {
  const allocation = TSD_CP006_PERMANENT_QL_ALLOCATIONS.find((entry) => entry.authorityKey === authorityKey);
  if (!allocation) throw new Error(`CP006 authority ${authorityKey} has no permanent QL allocation`);
  return allocation;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(TSD_CP006_PERMANENT_QL_ALLOCATIONS.length === 13, "CP006 must allocate exactly thirteen permanent QLs");
assert(TSD_CP006_PERMANENT_QL_IDS[0] === "TSD-QL-071", "CP006 QL allocation must begin at TSD-QL-071");
assert(TSD_CP006_PERMANENT_QL_IDS[12] === "TSD-QL-083", "CP006 QL allocation must end at TSD-QL-083");
assert(new Set(TSD_CP006_PERMANENT_QL_IDS).size === 13, "CP006 permanent QL allocation contains duplicate IDs");
assert(new Set(TSD_CP006_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.authorityKey)).size === 13, "CP006 permanent QL allocation contains duplicate authorities");
