import { TSD_CP003_NEXT_PERMANENT_QL_ID } from "../cp003/ql-allocation";
import { TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";

export interface TsdCp004PermanentQlAllocation {
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-004";
  readonly underlyingSolveModes: readonly string[];
  readonly allocationStatus: "PERMANENT_QL_ALLOCATED";
  readonly englishFreezeStatus: "UNFROZEN";
  readonly questionStudioUnlocked: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

const FIRST_CP004_QL_NUMBER = 48;

if (TSD_CP003_NEXT_PERMANENT_QL_ID !== "TSD-QL-048") {
  throw new Error(`CP-004 QL allocation expected TSD-QL-048 after CP-003, received ${TSD_CP003_NEXT_PERMANENT_QL_ID}`);
}

export const TSD_CP004_PERMANENT_QL_ALLOCATIONS: readonly TsdCp004PermanentQlAllocation[] = Object.freeze(
  TSD_CP004_FINAL_NEW_AUTHORITY_CANDIDATES.map((authority, index) => Object.freeze({
    permanentQlId: `TSD-QL-${String(FIRST_CP004_QL_NUMBER + index).padStart(3, "0")}` as const,
    authorityKey: authority.authorityKey,
    checkpointId: "TSD-CP-004" as const,
    underlyingSolveModes: Object.freeze([...authority.underlyingSolveModes]),
    allocationStatus: "PERMANENT_QL_ALLOCATED" as const,
    englishFreezeStatus: "UNFROZEN" as const,
    questionStudioUnlocked: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  })),
);

export const TSD_CP004_PERMANENT_QL_IDS = Object.freeze(TSD_CP004_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.permanentQlId));
export const TSD_CP004_NEXT_PERMANENT_QL_ID = "TSD-QL-058" as const;

export function cp004PermanentQlForAuthority(authorityKey: string): TsdCp004PermanentQlAllocation {
  const allocation = TSD_CP004_PERMANENT_QL_ALLOCATIONS.find((entry) => entry.authorityKey === authorityKey);
  if (!allocation) throw new Error(`No CP-004 permanent QL allocation for authority ${authorityKey}`);
  return allocation;
}

export function cp004PermanentQlForSolveMode(solveMode: string): TsdCp004PermanentQlAllocation {
  const allocation = TSD_CP004_PERMANENT_QL_ALLOCATIONS.find((entry) => entry.underlyingSolveModes.includes(solveMode));
  if (!allocation) throw new Error(`No CP-004 permanent QL allocation for retained solve mode ${solveMode}`);
  return allocation;
}
