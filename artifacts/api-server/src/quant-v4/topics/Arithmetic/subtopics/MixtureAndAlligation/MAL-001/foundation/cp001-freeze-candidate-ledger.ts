import type { MalCp001DiscoveryPrototypeId } from "./cp001-gap-registry";

export const MAL_CP001_FREEZE_CANDIDATE_IDS = [
  "MAL-CP001-FREEZE-TARGET-RATIO",
  "MAL-CP001-FREEZE-FINAL-MEAN",
  "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
  "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
  "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
  "MAL-CP001-FREEZE-TWO-STAGE-FINAL-MEAN",
  "MAL-CP001-FREEZE-TWO-STAGE-UNKNOWN-QUANTITY",
  "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY",
] as const;

export type MalCp001FreezeCandidateId =
  (typeof MAL_CP001_FREEZE_CANDIDATE_IDS)[number];

export type MalCp001FreezeDisposition = "ANCHOR" | "MERGE";

export interface MalCp001FreezeClassification {
  prototypeId: MalCp001DiscoveryPrototypeId;
  freezeCandidateId: MalCp001FreezeCandidateId;
  disposition: MalCp001FreezeDisposition;
  rationale: string;
}

/**
 * Freeze-preparation classification.
 *
 * This is deliberately separate from the historical first- and second-wave
 * discovery ledgers. It records the latest consolidation after executable,
 * source-format and ownership review. It still does not allocate permanent QLs.
 */
export const MAL_CP001_FREEZE_CLASSIFICATION:
  readonly MalCp001FreezeClassification[] = [
    {
      prototypeId: "MAL-CP001-PROT-RATIO-FROM-TARGET",
      freezeCandidateId: "MAL-CP001-FREEZE-TARGET-RATIO",
      disposition: "ANCHOR",
      rationale:
        "The alligation cross and ratio answer semantic form a distinct flagship learner task.",
    },
    {
      prototypeId: "MAL-CP001-PROT-MEAN-FROM-QUANTITIES",
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      disposition: "ANCHOR",
      rationale:
        "Anchor for a final blend mean derived from exact component contributions.",
    },
    {
      prototypeId: "MAL-CP001-PROT-MEAN-FROM-RATIO",
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      disposition: "MERGE",
      rationale:
        "Ratio input changes the representation but not the weighted-mean unknown or invariant.",
    },
    {
      prototypeId: "MAL-CP001-PROT-UNKNOWN-SOURCE-VALUE",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
      disposition: "ANCHOR",
      rationale:
        "The missing per-unit source value is a distinct inverse answer semantic.",
    },
    {
      prototypeId: "MAL-CP001-PROT-SOURCE-VALUE-FROM-RATIO",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
      disposition: "MERGE",
      rationale:
        "A stated source ratio changes evidence parsing but preserves the same inverse weighted equation.",
    },
    {
      prototypeId: "MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      disposition: "ANCHOR",
      rationale:
        "One missing component quantity is isolated directly from weighted conservation.",
    },
    {
      prototypeId: "MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      disposition: "MERGE",
      rationale:
        "Addition wording is a temporal framing of the same missing-quantity equation.",
    },
    {
      prototypeId: "MAL-CP001-PROT-THIRD-COMPONENT-QUANTITY",
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      disposition: "MERGE",
      rationale:
        "A third known contribution lengthens the equation without changing the single unknown quantity task.",
    },
    {
      prototypeId: "MAL-CP001-PROT-THREE-COMPONENT-MEAN",
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      disposition: "MERGE",
      rationale:
        "Component count changes instance complexity, not the final-mean learner contract.",
    },
    {
      prototypeId: "MAL-CP001-PROT-TWO-QUANTITIES-FROM-TOTAL",
      freezeCandidateId: "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
      disposition: "ANCHOR",
      rationale:
        "After deriving the alligation ratio, a stated total fixes its common scale.",
    },
    {
      prototypeId: "MAL-CP001-PROT-COMPONENT-SHARE-FROM-TARGET",
      freezeCandidateId: "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
      disposition: "MERGE",
      rationale:
        "Returning one projected share rather than both quantities does not change ratio scaling from a total constraint.",
    },
    {
      prototypeId: "MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES",
      freezeCandidateId: "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
      disposition: "MERGE",
      rationale:
        "A stated difference fixes the same common ratio scale through the difference between reduced parts rather than their sum.",
    },
    {
      prototypeId: "MAL-CP001-PROT-TWO-STAGE-BLEND-MEAN",
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-FINAL-MEAN",
      disposition: "ANCHOR",
      rationale:
        "The learner must collapse a completed first blend to an equivalent mean before a second weighted blend.",
    },
    {
      prototypeId: "MAL-CP001-PROT-TWO-STAGE-UNKNOWN",
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-UNKNOWN-QUANTITY",
      disposition: "ANCHOR",
      rationale:
        "The inverse second-stage quantity requires deriving the intermediate mean before target balancing.",
    },
    {
      prototypeId: "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION",
      freezeCandidateId: "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY",
      disposition: "ANCHOR",
      rationale:
        "A relation between two component quantities plus total and target creates a coupled three-component inverse system.",
    },
  ] as const;

const freezeClassificationByPrototype = new Map<
  MalCp001DiscoveryPrototypeId,
  MalCp001FreezeClassification
>(MAL_CP001_FREEZE_CLASSIFICATION.map((entry) => [entry.prototypeId, entry]));

export function getMalCp001FreezeClassification(
  prototypeId: MalCp001DiscoveryPrototypeId,
): MalCp001FreezeClassification {
  const classification = freezeClassificationByPrototype.get(prototypeId);
  if (!classification) {
    throw new Error(`Missing MAL-CP-001 freeze classification for ${prototypeId}.`);
  }
  return classification;
}
