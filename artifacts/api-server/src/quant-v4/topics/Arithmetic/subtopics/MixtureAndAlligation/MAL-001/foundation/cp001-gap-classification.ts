import type { MalCp001DiscoveryDisposition } from "./cp001-discovery-classification";
import type { MalCp001GapPrototypeId } from "./cp001-gap-types";

export const MAL_CP001_GAP_CANDIDATE_CONTRACT_IDS = [
  "MAL-CP001-CAND-COMPONENT-SHARE-FROM-TOTAL",
  "MAL-CP001-CAND-DIFFERENCE-BASED-QUANTITIES",
  "MAL-CP001-CAND-TWO-STAGE-FINAL-MEAN",
  "MAL-CP001-CAND-TWO-STAGE-UNKNOWN-QUANTITY",
  "MAL-CP001-CAND-THREE-WAY-RELATION-QUANTITY",
] as const;

export type MalCp001GapCandidateContractId =
  | "MAL-CP001-CAND-UNKNOWN-SOURCE-VALUE"
  | (typeof MAL_CP001_GAP_CANDIDATE_CONTRACT_IDS)[number];

export interface MalCp001GapDiscoveryClassification {
  prototypeId: MalCp001GapPrototypeId;
  disposition: MalCp001DiscoveryDisposition;
  candidateContractId: MalCp001GapCandidateContractId;
  rationale: string;
  ownershipBoundary: string;
}

/**
 * Second-wave executable classifications remain provisional learner-contract
 * evidence. They do not allocate permanent QLs or freeze the CP inventory.
 */
export const MAL_CP001_GAP_DISCOVERY_CLASSIFICATION:
  readonly MalCp001GapDiscoveryClassification[] = [
    {
      prototypeId: "MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO",
      disposition: "MERGE",
      candidateContractId: "MAL-CP001-CAND-UNKNOWN-SOURCE-VALUE",
      rationale:
        "A stated quantity ratio changes the evidence representation but preserves the missing source value, answer semantic and weighted-balance invariant.",
      ownershipBoundary:
        "Remains MAL-CP-001 because the unknown is a component value inside a blend; no generic Average group aggregation is required.",
    },
    {
      prototypeId: "MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-COMPONENT-SHARE-FROM-TOTAL",
      rationale:
        "The total quantity and target determine one requested component share; the single-quantity answer semantic is distinct from returning the complete ordered pair.",
      ownershipBoundary:
        "No addition, removal, replacement or conserved-solute transformation occurs, so this does not move to CP-002 or CP-004.",
    },
    {
      prototypeId: "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-DIFFERENCE-BASED-QUANTITIES",
      rationale:
        "A quantity-difference constraint fixes the scale of an alligation ratio and produces an ordered quantity-pair answer without a stated total.",
      ownershipBoundary:
        "The scale is reconstructed within one static blend; it is neither an Average deviation problem nor a vessel-transfer ledger.",
    },
    {
      prototypeId: "MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-TWO-STAGE-FINAL-MEAN",
      rationale:
        "The learner must first replace a uniform first-stage blend by its equivalent mean component and then perform a second weighted blend.",
      ownershipBoundary:
        "It remains CP-001 only when a homogeneous portion is transferred without replacement, concentration decay or multi-vessel equalisation; those features belong to CP-002, CP-004 or CP-006.",
    },
    {
      prototypeId: "MAL-CP001-PROT-TWO-STAGE-UNKNOWN",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-TWO-STAGE-UNKNOWN-QUANTITY",
      rationale:
        "The inverse second-stage quantity requires deriving the first-stage mean before balancing deviations around the final target.",
      ownershipBoundary:
        "No material is repeatedly removed or replaced, so the mode stays outside the conserved-concentration CPs.",
    },
    {
      prototypeId: "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION",
      disposition: "RETAIN",
      candidateContractId: "MAL-CP001-CAND-THREE-WAY-RELATION-QUANTITY",
      rationale:
        "A relation among two component quantities plus total quantity and target mean creates a determined three-component inverse system.",
      ownershipBoundary:
        "This is a static multi-component weighted blend, not a multi-vessel transfer or equalisation process owned by CP-006.",
    },
  ] as const;

const classificationByPrototype = new Map<
  MalCp001GapPrototypeId,
  MalCp001GapDiscoveryClassification
>(MAL_CP001_GAP_DISCOVERY_CLASSIFICATION.map((entry) => [entry.prototypeId, entry]));

export function getMalCp001GapDiscoveryClassification(
  prototypeId: MalCp001GapPrototypeId,
): MalCp001GapDiscoveryClassification {
  const classification = classificationByPrototype.get(prototypeId);
  if (!classification) {
    throw new Error(`Missing MAL-CP-001 gap classification for ${prototypeId}.`);
  }
  return classification;
}
