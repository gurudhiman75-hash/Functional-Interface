import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import { COA_CP002_ENGLISH_REVIEW_V2 } from "./cp002-editorial-v2.ts";
import { COA_CP003_ENGLISH_REVIEW_V2 } from "./cp003-editorial-v2.ts";
import type { CoaQlId, CoaScenarioAuthority } from "./types.ts";

/**
 * Current English semantic authority.
 *
 * CP001 Editorial V2 and CP002 Editorial V2 are explicitly approved immutable
 * baselines. CP003 Editorial V2 is additive and expands only QL003/QL004.
 * Later checkpoints must add authorities without rewriting approved surfaces.
 */
export const COA_CURRENT_ENGLISH_AUTHORITIES: readonly CoaScenarioAuthority[] = Object.freeze([
  ...COA_CP001_ENGLISH_REVIEW_V2,
  ...COA_CP002_ENGLISH_REVIEW_V2,
  ...COA_CP003_ENGLISH_REVIEW_V2,
]);

export function coaEnglishAuthoritiesForQl(qlId: CoaQlId): readonly CoaScenarioAuthority[] {
  return COA_CURRENT_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId === qlId);
}

export const COA_CP002_OWNED_QL_IDS = ["COA-QL-001", "COA-QL-002"] as const;
export type CoaCp002OwnedQlId = (typeof COA_CP002_OWNED_QL_IDS)[number];

export const COA_CP003_OWNED_QL_IDS = ["COA-QL-003", "COA-QL-004"] as const;
export type CoaCp003OwnedQlId = (typeof COA_CP003_OWNED_QL_IDS)[number];
