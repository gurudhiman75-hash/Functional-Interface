import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import { COA_CP002_ENGLISH_EXPANSION } from "./cp002-direct-preventive-expansion.ts";
import type { CoaQlId, CoaScenarioAuthority } from "./types.ts";

/**
 * Current English semantic authority.
 *
 * CP001 Editorial V2 is the explicitly approved immutable calibration baseline.
 * CP002 is additive and expands only QL001/QL002. Later checkpoints should add
 * authorities here without rewriting historical approved checkpoint surfaces.
 */
export const COA_CURRENT_ENGLISH_AUTHORITIES: readonly CoaScenarioAuthority[] = Object.freeze([
  ...COA_CP001_ENGLISH_REVIEW_V2,
  ...COA_CP002_ENGLISH_EXPANSION,
]);

export function coaEnglishAuthoritiesForQl(qlId: CoaQlId): readonly CoaScenarioAuthority[] {
  return COA_CURRENT_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId === qlId);
}

export const COA_CP002_OWNED_QL_IDS = ["COA-QL-001", "COA-QL-002"] as const;

export type CoaCp002OwnedQlId = (typeof COA_CP002_OWNED_QL_IDS)[number];
