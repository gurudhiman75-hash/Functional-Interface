import { TSD_CP002_LEARNER_AUTHORITIES } from "./discovery-registry";
import { TSD_CP002_LEARNER_SOLVE_MODES, type TsdCp002LearnerSolveMode } from "./types";

export interface TsdCp002FrozenAuthority {
  readonly permanentQlId: `TSD-QL-${string}`;
  readonly provisionalAuthorityId: `TSD-CP002-DISC-${string}`;
  readonly solveMode: TsdCp002LearnerSolveMode;
  readonly englishFreezeStatus: "FROZEN";
  readonly reviewedStates: 3;
  readonly publiclyPublishable: false;
}

export const TSD_CP002_FROZEN_AUTHORITIES: readonly TsdCp002FrozenAuthority[] = Object.freeze(
  TSD_CP002_LEARNER_SOLVE_MODES.map((solveMode, index) => {
    const authority = TSD_CP002_LEARNER_AUTHORITIES.find((entry) => entry.solveMode === solveMode);
    if (!authority) throw new Error(`Missing CP-002 learner authority for ${solveMode}`);
    return Object.freeze({
      permanentQlId: `TSD-QL-${String(index + 24).padStart(3, "0")}`,
      provisionalAuthorityId: authority.provisionalId,
      solveMode,
      englishFreezeStatus: "FROZEN" as const,
      reviewedStates: 3 as const,
      publiclyPublishable: false as const,
    });
  }),
);

export const TSD_CP002_NEXT_PERMANENT_QL_ID = "TSD-QL-038" as const;

export function frozenCp002Authority(mode: TsdCp002LearnerSolveMode): TsdCp002FrozenAuthority {
  const authority = TSD_CP002_FROZEN_AUTHORITIES.find((entry) => entry.solveMode === mode);
  if (!authority) throw new Error(`No frozen CP-002 authority for ${mode}`);
  return authority;
}
