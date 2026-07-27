import type { MalCp001PrototypeId } from "./types";

export const MAL_CP001_CANDIDATE_CONTRACT_IDS = [
  "MAL-CP001-CAND-TARGET-RATIO",
  "MAL-CP001-CAND-FINAL-MEAN",
  "MAL-CP001-CAND-UNKNOWN-SOURCE-VALUE",
  "MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY",
  "MAL-CP001-CAND-TWO-QUANTITIES-FROM-TOTAL",
] as const;

export type MalCp001CandidateContractId =
  (typeof MAL_CP001_CANDIDATE_CONTRACT_IDS)[number];

export type MalCp001DiscoveryDisposition =
  | "RETAIN"
  | "MERGE"
  | "SPLIT"
  | "DEFER"
  | "REASSIGN";

export interface MalCp001DiscoveryClassification {
  prototypeId: MalCp001PrototypeId;
  disposition: MalCp001DiscoveryDisposition;
  candidateContractId: MalCp001CandidateContractId;
  rationale: string;
}

/**
 * Executable-discovery prototypes are evidence, not permanent QLs.
 * This ledger records which prototypes represent distinct learner contracts and
 * which are only evidence, component-count, or temporal-framing variants.
 */
export const MAL_CP001_DISCOVERY_CLASSIFICATION:
  readonly MalCp001DiscoveryClassification[] = [
    {
      prototypeId: "MAL-CP001-PROT-RATIO-FROM-TARGET",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-TARGET-RATIO",
      rationale:
        "Distinct inverse task and ratio answer semantic; the alligation-cross representation is instructionally material.",
    },
    {
      prototypeId: "MAL-CP001-PROT-MEAN-FROM-QUANTITIES",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-FINAL-MEAN",
      rationale:
        "Anchor prototype for the general weighted-blend mean contract when component-blend semantics, rather than generic group averaging, are essential.",
    },
    {
      prototypeId: "MAL-CP001-PROT-MEAN-FROM-RATIO",
      disposition: "MERGE",
      candidateContractId: "MAL-CP001-CAND-FINAL-MEAN",
      rationale:
        "Ratio evidence changes the source representation but not the unknown, answer semantic, invariant, or canonical equation.",
    },
    {
      prototypeId: "MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-UNKNOWN-SOURCE-VALUE",
      rationale:
        "Distinct inverse unknown and source-value answer semantic; it cannot be collapsed into a quantity reconstruction.",
    },
    {
      prototypeId: "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY",
      rationale:
        "Anchor prototype for solving a missing component quantity from weighted conservation.",
    },
    {
      prototypeId: "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET",
      disposition: "MERGE",
      candidateContractId: "MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY",
      rationale:
        "Adding a source to reach a target is a temporal framing of the same missing-quantity balance, not a new mathematical contract.",
    },
    {
      prototypeId: "MAL-CP001-PROT-THREE-COMPONENT-MEAN",
      disposition: "MERGE",
      candidateContractId: "MAL-CP001-CAND-FINAL-MEAN",
      rationale:
        "A third component changes instance complexity, not the weighted-mean task contract by itself.",
    },
    {
      prototypeId: "MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY",
      disposition: "MERGE",
      candidateContractId: "MAL-CP001-CAND-UNKNOWN-COMPONENT-QUANTITY",
      rationale:
        "Multiple known contributions increase equation length but preserve the same unknown-quantity invariant and answer semantic.",
    },
    {
      prototypeId: "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-TWO-QUANTITIES-FROM-TOTAL",
      rationale:
        "The stated total adds an independent constraint and the answer is an ordered quantity pair rather than one missing quantity.",
    },
  ] as const;

const classificationByPrototype = new Map<
  MalCp001PrototypeId,
  MalCp001DiscoveryClassification
>(MAL_CP001_DISCOVERY_CLASSIFICATION.map((entry) => [entry.prototypeId, entry]));

export function getMalCp001DiscoveryClassification(
  prototypeId: MalCp001PrototypeId,
): MalCp001DiscoveryClassification {
  const classification = classificationByPrototype.get(prototypeId);
  if (!classification) {
    throw new Error(`Missing MAL-CP-001 discovery classification for ${prototypeId}.`);
  }
  return classification;
}
