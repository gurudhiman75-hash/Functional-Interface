import type { StcModalClaim } from "./types.ts";

export function stcModalEntails(premise: StcModalClaim, conclusion: StcModalClaim): boolean {
  if (premise.atom !== conclusion.atom) return false;
  if (premise.polarity !== conclusion.polarity) return false;
  if (premise.strength === "CERTAIN") return true;
  return conclusion.strength === "POSSIBLE";
}

export const modalClaim = (
  atom: string,
  strength: StcModalClaim["strength"],
  polarity: StcModalClaim["polarity"] = "POSITIVE",
): StcModalClaim => ({ atom, strength, polarity });
