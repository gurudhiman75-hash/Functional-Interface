import { CP002_AUTHORITIES } from "./CP002-authorities";
import { CP002_EXTENDED_CORE } from "./CP002-extended-core";
import { CP002_EXTENDED_HALVANT } from "./CP002-extended-halvant";
import { CP002_EXTENDED_VARG } from "./CP002-extended-varg";
import { CP002_EDITORIAL_VOWELS } from "./CP002-editorial-vowels";
import { CP002_EDITORIAL_MARKS } from "./CP002-editorial-marks";
import { CP002_EDITORIAL_LOAN_A } from "./CP002-editorial-loan-a";
import { CP002_EDITORIAL_LOAN_B } from "./CP002-editorial-loan-b";
import { CP002_EDITORIAL_CLUSTERS } from "./CP002-editorial-clusters";
import { hardenCP002Authority } from "./CP002-distractor-hardening";
import { hardenCP002LoanwordAuthority } from "./CP002-loanword-hardening";
import type { ExtendedSpellingCategory } from "./CP002-extended-types";

export type ActiveSpellingAuthority = {
  id: string;
  correct: string;
  incorrect: readonly [string, string, string];
  category: ExtendedSpellingCategory;
  explanationPa: string;
  contextPa?: string;
  provenance: "DONOR_CP002" | "DONOR_CP002_CURATED" | "EDITORIAL_CURATED";
  sourceStatus: "REVIEW_PENDING";
};

const RAW_CP002_ACTIVE_AUTHORITIES: readonly ActiveSpellingAuthority[] = [
  ...CP002_AUTHORITIES,
  ...CP002_EXTENDED_CORE,
  ...CP002_EXTENDED_VARG,
  ...CP002_EXTENDED_HALVANT,
  ...CP002_EDITORIAL_VOWELS,
  ...CP002_EDITORIAL_MARKS,
  ...CP002_EDITORIAL_LOAN_A,
  ...CP002_EDITORIAL_LOAN_B,
  ...CP002_EDITORIAL_CLUSTERS,
] as const;

export const CP002_ACTIVE_AUTHORITIES: readonly ActiveSpellingAuthority[] =
  RAW_CP002_ACTIVE_AUTHORITIES
    .map((authority) => hardenCP002Authority(authority))
    .map((authority) => hardenCP002LoanwordAuthority(authority));

export const CP002_CONTEXT_AUTHORITIES: readonly ActiveSpellingAuthority[] =
  CP002_ACTIVE_AUTHORITIES.filter((authority): authority is ActiveSpellingAuthority & { contextPa: string } =>
    typeof authority.contextPa === "string" && authority.contextPa.includes(authority.correct),
  );

export function getCP002CategoryCounts(): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const authority of CP002_ACTIVE_AUTHORITIES) {
    counts[authority.category] = (counts[authority.category] ?? 0) + 1;
  }
  return counts;
}
