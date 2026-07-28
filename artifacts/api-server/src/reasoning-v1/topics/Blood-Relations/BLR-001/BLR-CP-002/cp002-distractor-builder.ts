import {
  defaultDistractorPool,
  genderSwap,
} from "../foundation/relation-ontology";
import type { SeededRandom } from "../foundation/prng";
import type { BlrRelationId } from "../foundation/types";
import type { BlrCp002AnswerId } from "./cp002-types";

export interface BlrCp002Distractor {
  answerId: BlrCp002AnswerId;
  errorLabel: string;
}

const SELF_FALLBACKS: readonly BlrRelationId[] = [
  "SISTER",
  "DAUGHTER",
  "WIFE",
  "MOTHER",
  "BROTHER",
  "SON",
];

const GENERAL_FALLBACKS: readonly BlrRelationId[] = [
  "BROTHER",
  "SISTER",
  "FATHER",
  "MOTHER",
  "SON",
  "DAUGHTER",
  "UNCLE",
  "AUNT",
  "NEPHEW",
  "NIECE",
  "COUSIN",
  "GRANDFATHER",
  "GRANDMOTHER",
  "GRANDSON",
  "GRANDDAUGHTER",
];

export function buildBlrCp002Distractors(
  correctAnswerId: BlrCp002AnswerId,
  reverseAnswerId: BlrCp002AnswerId | null,
  random: SeededRandom,
): readonly BlrCp002Distractor[] {
  const result: BlrCp002Distractor[] = [];
  const seen = new Set<BlrCp002AnswerId>([correctAnswerId]);

  const add = (answerId: BlrCp002AnswerId | null, errorLabel: string): void => {
    if (!answerId || seen.has(answerId)) return;
    seen.add(answerId);
    result.push({ answerId, errorLabel });
  };

  if (correctAnswerId === "SELF") {
    for (const relationId of random.shuffle(SELF_FALLBACKS)) {
      add(relationId, "IGNORED_SELF_IDENTITY_COLLAPSE");
      if (result.length === 3) return result;
    }
  } else {
    add(reverseAnswerId, "REVERSED_QUERY_DIRECTION");
    add(genderSwap(correctAnswerId), "WRONG_GENDER");
    for (const relationId of random.shuffle(defaultDistractorPool(correctAnswerId))) {
      add(relationId, "ROLE_CHAIN_NEAR_RELATION");
      if (result.length === 3) return result;
    }
  }

  for (const relationId of random.shuffle(GENERAL_FALLBACKS)) {
    add(relationId, "ROLE_CHAIN_NEAR_RELATION");
    if (result.length === 3) return result;
  }

  throw new Error("Unable to construct three unique CP-002 distractors.");
}
