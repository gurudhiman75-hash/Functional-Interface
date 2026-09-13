import { CP002_AUTHORITIES } from "./CP002-authorities";
import { CP002_EXTENDED_CORE } from "./CP002-extended-core";
import { CP002_EXTENDED_HALVANT } from "./CP002-extended-halvant";
import { CP002_EXTENDED_VARG } from "./CP002-extended-varg";
import type { ExtendedSpellingCategory } from "./CP002-extended-types";

export type ActiveSpellingAuthority = {
  id: string;
  correct: string;
  incorrect: readonly [string, string, string];
  category: ExtendedSpellingCategory;
  explanationPa: string;
  contextPa?: string;
  provenance: "DONOR_CP002" | "DONOR_CP002_CURATED";
  sourceStatus: "REVIEW_PENDING";
};

export const CP002_ACTIVE_AUTHORITIES: readonly ActiveSpellingAuthority[] = [
  ...CP002_AUTHORITIES,
  ...CP002_EXTENDED_CORE,
  ...CP002_EXTENDED_VARG,
  ...CP002_EXTENDED_HALVANT,
] as const;

export const CP002_CONTEXT_AUTHORITIES: readonly ActiveSpellingAuthority[] = CP002_AUTHORITIES;

export function getCP002CategoryCounts(): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const authority of CP002_ACTIVE_AUTHORITIES) {
    counts[authority.category] = (counts[authority.category] ?? 0) + 1;
  }
  return counts;
}
