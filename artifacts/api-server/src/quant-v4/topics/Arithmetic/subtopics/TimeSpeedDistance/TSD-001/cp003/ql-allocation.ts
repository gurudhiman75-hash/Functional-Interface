import { TSD_CP002_NEXT_PERMANENT_QL_ID } from "../cp002/freeze-registry";
import { TSD_CP003_FINAL_NEW_AUTHORITY_CANDIDATES } from "./final-ownership-candidate";

export interface TsdCp003PermanentQlAllocation {
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly authorityKey: string;
  readonly checkpointId: "TSD-CP-003";
  readonly underlyingSolveModes: readonly string[];
  readonly allocationStatus: "PERMANENT_QL_ALLOCATED";
  readonly englishFreezeStatus: "UNFROZEN";
  readonly questionStudioUnlocked: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

const FIRST_CP003_QL_NUMBER = 38;

if (TSD_CP002_NEXT_PERMANENT_QL_ID !== "TSD-QL-038") {
  throw new Error(`CP-003 QL allocation expected TSD-QL-038 after CP-002, received ${TSD_CP002_NEXT_PERMANENT_QL_ID}`);
}

export const TSD_CP003_PERMANENT_QL_ALLOCATIONS: readonly TsdCp003PermanentQlAllocation[] = Object.freeze(
  TSD_CP003_FINAL_NEW_AUTHORITY_CANDIDATES.map((authority, index) => Object.freeze({
    permanentQlId: `TSD-QL-${String(FIRST_CP003_QL_NUMBER + index).padStart(3, "0")}` as const,
    authorityKey: authority.authorityKey,
    checkpointId: "TSD-CP-003" as const,
    underlyingSolveModes: Object.freeze([...authority.underlyingSolveModes]),
    allocationStatus: "PERMANENT_QL_ALLOCATED" as const,
    englishFreezeStatus: "UNFROZEN" as const,
    questionStudioUnlocked: false as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
  })),
);

export const TSD_CP003_PERMANENT_QL_IDS = Object.freeze(
  TSD_CP003_PERMANENT_QL_ALLOCATIONS.map((entry) => entry.permanentQlId),
);

export const TSD_CP003_NEXT_PERMANENT_QL_ID = "TSD-QL-048" as const;

export function cp003PermanentQlForAuthority(authorityKey: string): TsdCp003PermanentQlAllocation {
  const allocation = TSD_CP003_PERMANENT_QL_ALLOCATIONS.find((entry) => entry.authorityKey === authorityKey);
  if (!allocation) throw new Error(`No CP-003 permanent QL allocation for authority ${authorityKey}`);
  return allocation;
}

export function cp003PermanentQlForSolveMode(solveMode: string): TsdCp003PermanentQlAllocation {
  const allocation = TSD_CP003_PERMANENT_QL_ALLOCATIONS.find((entry) => entry.underlyingSolveModes.includes(solveMode));
  if (!allocation) throw new Error(`No CP-003 permanent QL allocation for solve mode ${solveMode}`);
  return allocation;
}
