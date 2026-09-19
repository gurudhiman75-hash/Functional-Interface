import { COA_CP001_ENGLISH_REVIEW_V2 } from "./cp001-editorial-v2.ts";
import { COA_CP002_ENGLISH_REVIEW_V2 } from "./cp002-editorial-v2.ts";
import { COA_CP003_ENGLISH_REVIEW_V2 } from "./cp003-editorial-v2.ts";
import { COA_CP004_ENGLISH_REVIEW_V2 } from "./cp004-editorial-v2.ts";
import { COA_CP006_ENGLISH_REVIEW_V2 } from "./cp006-editorial-v2.ts";
import { COA_CP007_ENGLISH_REVIEW_V2 } from "./cp007-editorial-v2.ts";
import type { CoaQlId, CoaScenarioAuthority } from "./types.ts";

/**
 * Current English semantic authority.
 *
 * CP001-CP006 reviewed English checkpoints are approved/frozen. CP005 changed
 * presentation architecture only and added no semantic scenarios. CP007 additively
 * expands QL009 integrated exam-grade reasoning without rewriting earlier authority.
 */
export const COA_CURRENT_ENGLISH_AUTHORITIES: readonly CoaScenarioAuthority[] = Object.freeze([
  ...COA_CP001_ENGLISH_REVIEW_V2,
  ...COA_CP002_ENGLISH_REVIEW_V2,
  ...COA_CP003_ENGLISH_REVIEW_V2,
  ...COA_CP004_ENGLISH_REVIEW_V2,
  ...COA_CP006_ENGLISH_REVIEW_V2,
  ...COA_CP007_ENGLISH_REVIEW_V2,
]);

export function coaEnglishAuthoritiesForQl(qlId: CoaQlId): readonly CoaScenarioAuthority[] {
  return COA_CURRENT_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId === qlId);
}

export const COA_CP002_OWNED_QL_IDS = ["COA-QL-001", "COA-QL-002"] as const;
export type CoaCp002OwnedQlId = (typeof COA_CP002_OWNED_QL_IDS)[number];

export const COA_CP003_OWNED_QL_IDS = ["COA-QL-003", "COA-QL-004"] as const;
export type CoaCp003OwnedQlId = (typeof COA_CP003_OWNED_QL_IDS)[number];

export const COA_CP004_OWNED_QL_IDS = ["COA-QL-005", "COA-QL-006"] as const;
export type CoaCp004OwnedQlId = (typeof COA_CP004_OWNED_QL_IDS)[number];

export const COA_CP006_OWNED_QL_IDS = ["COA-QL-008"] as const;
export type CoaCp006OwnedQlId = (typeof COA_CP006_OWNED_QL_IDS)[number];

export const COA_CP007_OWNED_QL_IDS = ["COA-QL-009"] as const;
export type CoaCp007OwnedQlId = (typeof COA_CP007_OWNED_QL_IDS)[number];
