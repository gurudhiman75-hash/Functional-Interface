export type ExtendedSpellingCategory =
  | "SIHARI_BIHARI"
  | "AUNKAR_DULANKAR"
  | "HA_PAIRIN_SOUND"
  | "TIPPI_BINDI"
  | "ADDAK_OMISSION"
  | "LOANWORD_PHONETICS"
  | "VARG_CONFUSION"
  | "HALVANT_PAIRIN";

export interface ExtendedSpellingAuthority {
  id: string;
  donorId: string;
  donorSection: "CORE" | "VARG_CONFUSION" | "HALVANT_PAIRIN";
  correct: string;
  incorrect: readonly [string, string, string];
  category: ExtendedSpellingCategory;
  explanationPa: string;
  provenance: "DONOR_CP002_CURATED";
  sourceStatus: "REVIEW_PENDING";
}

export function extendedAuthority(
  donorSection: ExtendedSpellingAuthority["donorSection"],
  donorId: string,
  correct: string,
  incorrect: readonly [string, string, string],
  category: ExtendedSpellingCategory,
): ExtendedSpellingAuthority {
  return {
    id: `EXT-${donorSection}-${donorId}`,
    donorId,
    donorSection,
    correct,
    incorrect,
    category,
    explanationPa: `ਸਹੀ ਸ਼ਬਦ-ਜੋੜ ‘${correct}’ ਹੈ।`,
    provenance: "DONOR_CP002_CURATED",
    sourceStatus: "REVIEW_PENDING",
  };
}
