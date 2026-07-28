import {
  defaultDistractorPool,
  genderSwap,
} from "../foundation/relation-ontology";
import { SeededRandom } from "../foundation/prng";
import type { BlrRelationId } from "../foundation/types";

export interface BlrCp001Distractor {
  relationId: BlrRelationId;
  errorLabel: string;
}

const ALL_RELATIONS: readonly BlrRelationId[] = [
  "FATHER", "MOTHER", "SON", "DAUGHTER", "BROTHER", "SISTER", "HUSBAND", "WIFE",
  "GRANDFATHER", "GRANDMOTHER", "GRANDSON", "GRANDDAUGHTER",
  "GREAT_GRANDFATHER", "GREAT_GRANDMOTHER", "GREAT_GRANDSON", "GREAT_GRANDDAUGHTER",
  "UNCLE", "AUNT", "NEPHEW", "NIECE", "COUSIN", "FATHER_IN_LAW", "MOTHER_IN_LAW",
  "SON_IN_LAW", "DAUGHTER_IN_LAW", "BROTHER_IN_LAW", "SISTER_IN_LAW",
] as const;

export function buildBlrCp001Distractors(
  correctRelationId: BlrRelationId,
  reverseRelationId: BlrRelationId | null,
  random: SeededRandom,
): readonly BlrCp001Distractor[] {
  const selected: BlrCp001Distractor[] = [];
  const add = (relationId: BlrRelationId | null, errorLabel: string): void => {
    if (!relationId || relationId === correctRelationId) return;
    if (selected.some((entry) => entry.relationId === relationId)) return;
    selected.push({ relationId, errorLabel });
  };

  add(reverseRelationId, "REVERSED_QUERY_DIRECTION");
  add(genderSwap(correctRelationId), "WRONG_GENDER");
  for (const relationId of random.shuffle(defaultDistractorPool(correctRelationId))) {
    add(relationId, "NEARBY_KINSHIP_CONFUSION");
  }
  for (const relationId of random.shuffle(ALL_RELATIONS)) {
    add(relationId, "RELATION_FAMILY_MISMATCH");
  }
  return selected.slice(0, 3);
}
