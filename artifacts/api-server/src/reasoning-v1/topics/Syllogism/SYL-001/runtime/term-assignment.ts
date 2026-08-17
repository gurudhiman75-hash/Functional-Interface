import type { TermId } from "../foundation/types";
import { createPrng, shuffle } from "./prng";
import { SYL_CATEGORY_TERMS } from "./terms";
import type { TermAssignment } from "./localization";

export function assignTerms(
  qlId: string,
  seed: number,
  termOrder: readonly TermId[],
): TermAssignment {
  const random = createPrng(`${qlId}:${seed}:terms`);
  const selected = shuffle(SYL_CATEGORY_TERMS, random).slice(0, termOrder.length);
  if (selected.length !== termOrder.length) throw new Error("Insufficient category terms.");
  return Object.fromEntries(termOrder.map((termId, index) => [termId, selected[index]]));
}
