import type { MalCp001FreezeCandidateId } from "./cp001-freeze-candidate-ledger";

export type MalCp001SourceEvidenceStrength =
  | "DIRECT_EXTERNAL"
  | "ANALOGOUS_EXTERNAL"
  | "LEGACY_EXECUTABLE";

export type MalCp001FreezeReadiness =
  | "SUPPORTED"
  | "SUPPORTED_WITH_VARIANT_GAP"
  | "BLOCKED_SOURCE_GAP";

export type MalCp001RepresentationKind =
  | "DIRECT_PROSE"
  | "RATIO_INPUT"
  | "EXPLICIT_QUANTITIES"
  | "MULTI_COMPONENT"
  | "PREBLEND_OR_TWO_STAGE"
  | "TOTAL_SCALE_CONSTRAINT"
  | "DIFFERENCE_SCALE_CONSTRAINT"
  | "COUPLED_RELATION_CONSTRAINT";

export interface MalCp001SourceFixture {
  fixtureId: string;
  sourceLabel: string;
  evidenceStrength: MalCp001SourceEvidenceStrength;
  sourcePattern: string;
  representedUnknown: string;
  representations: readonly MalCp001RepresentationKind[];
  legacyFamilyIds: readonly string[];
}

export interface MalCp001SourceFixtureLedgerEntry {
  freezeCandidateId: MalCp001FreezeCandidateId;
  readiness: MalCp001FreezeReadiness;
  sourceConclusion: string;
  fixtures: readonly MalCp001SourceFixture[];
}

/**
 * Source evidence is recorded as short pattern descriptions rather than copied
 * question text. Uploaded reference books are not runtime dependencies and the
 * legacy Quant V2 material remains prior art rather than production authority.
 */
export const MAL_CP001_SOURCE_FIXTURE_LEDGER:
  readonly MalCp001SourceFixtureLedgerEntry[] = [
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TARGET-RATIO",
      readiness: "SUPPORTED",
      sourceConclusion:
        "Multiple SSC and quantitative-aptitude references directly ask for the mixing ratio from two source values and a target mean.",
      fixtures: [
        {
          fixtureId: "SRC-CP001-RATIO-PRICE-GRADES",
          sourceLabel:
            "R.S. Aggarwal quantitative-aptitude alligation chapter, direct price-blend exercises",
          evidenceStrength: "DIRECT_EXTERNAL",
          sourcePattern:
            "Two commodity grades have stated per-unit prices and must produce a stated mean price; find the lower-grade to higher-grade ratio.",
          representedUnknown: "component ratio",
          representations: ["DIRECT_PROSE"],
          legacyFamilyIds: [
            "mix_two_price_blend_ratio",
            "mix_two_items_find_ratio",
            "alligation_cheaper_dearer_ratio",
          ],
        },
      ],
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-FINAL-MEAN",
      readiness: "SUPPORTED",
      sourceConclusion:
        "References directly cover final mean from a quantity ratio, explicit quantities and three-component weighted blending.",
      fixtures: [
        {
          fixtureId: "SRC-CP001-MEAN-RATIO",
          sourceLabel:
            "R.S. Aggarwal quantitative-aptitude alligation chapter, mixture-value worked examples",
          evidenceStrength: "DIRECT_EXTERNAL",
          sourcePattern:
            "Two varieties are mixed in a known ratio and their per-unit prices are known; find the resulting mixture price.",
          representedUnknown: "final mean value",
          representations: ["DIRECT_PROSE", "RATIO_INPUT"],
          legacyFamilyIds: [
            "alligation_mean_price_given",
            "mix_average_value_ratio_given",
          ],
        },
        {
          fixtureId: "SRC-CP001-MEAN-MULTI-COMPONENT",
          sourceLabel:
            "Disha SSC Mathematics Guide, Alligations chapter, weighted concentration example",
          evidenceStrength: "DIRECT_EXTERNAL",
          sourcePattern:
            "Known quantities from sources with different component percentages are combined; find the final component percentage or ratio.",
          representedUnknown: "final mean or final component fraction",
          representations: ["EXPLICIT_QUANTITIES", "MULTI_COMPONENT"],
          legacyFamilyIds: [
            "mix_three_items_weighted_average",
            "concentration_mixing_three_solutions",
          ],
        },
      ],
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-SOURCE-VALUE",
      readiness: "SUPPORTED",
      sourceConclusion:
        "Direct worked examples recover an unknown commodity price from the known source price, target mean and mixing ratio.",
      fixtures: [
        {
          fixtureId: "SRC-CP001-UNKNOWN-SOURCE-WHEAT",
          sourceLabel:
            "R.S. Aggarwal quantitative-aptitude alligation chapter, reverse price example",
          evidenceStrength: "DIRECT_EXTERNAL",
          sourcePattern:
            "One source price, the target mixture price and the source ratio are known; solve the second source price.",
          representedUnknown: "source per-unit value",
          representations: ["DIRECT_PROSE", "RATIO_INPUT"],
          legacyFamilyIds: [
            "mix_two_items_find_missing_price",
            "alligation_find_cost_price",
            "mix_reverse_alligation",
          ],
        },
      ],
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-UNKNOWN-COMPONENT-QUANTITY",
      readiness: "SUPPORTED",
      sourceConclusion:
        "Direct exercises recover one unknown component quantity from a known counterpart quantity and the alligation ratio; addition wording is only a framing variant.",
      fixtures: [
        {
          fixtureId: "SRC-CP001-UNKNOWN-QUANTITY-KNOWN-COUNTERPART",
          sourceLabel:
            "R.S. Aggarwal quantitative-aptitude alligation chapter, known-quantity exercise",
          evidenceStrength: "DIRECT_EXTERNAL",
          sourcePattern:
            "The required mixing ratio is derived from prices, one component quantity is given, and the other quantity is requested.",
          representedUnknown: "one component quantity",
          representations: ["DIRECT_PROSE", "EXPLICIT_QUANTITIES"],
          legacyFamilyIds: [
            "mix_two_items_find_quantity",
            "alligation_target_mean_quantity_added",
          ],
        },
      ],
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE",
      readiness: "SUPPORTED_WITH_VARIANT_GAP",
      sourceConclusion:
        "External references directly support scaling an alligation ratio from a total or one known quantity. The difference-as-scale presentation is executable and legacy-attested but lacks a direct uploaded-book fixture, so it remains a merged variant rather than a separate contract.",
      fixtures: [
        {
          fixtureId: "SRC-CP001-RATIO-SCALE-TOTAL",
          sourceLabel:
            "SSC mathematics and quantitative-aptitude alligation exercises, ratio-to-quantity examples",
          evidenceStrength: "DIRECT_EXTERNAL",
          sourcePattern:
            "A reduced component ratio and total mixture quantity determine one or both component quantities.",
          representedUnknown: "one share or ordered quantity pair",
          representations: ["RATIO_INPUT", "TOTAL_SCALE_CONSTRAINT"],
          legacyFamilyIds: [
            "mix_two_items_find_quantity",
            "mix_final_component_quantity",
          ],
        },
        {
          fixtureId: "SRC-CP001-RATIO-SCALE-DIFFERENCE",
          sourceLabel:
            "Quant V2 Mixture & Alligation family registry and executable-discovery prototype",
          evidenceStrength: "LEGACY_EXECUTABLE",
          sourcePattern:
            "A reduced alligation ratio and the difference between component quantities determine the common scale.",
          representedUnknown: "ordered quantity pair",
          representations: ["RATIO_INPUT", "DIFFERENCE_SCALE_CONSTRAINT"],
          legacyFamilyIds: ["mix_difference_based_quantity"],
        },
      ],
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-FINAL-MEAN",
      readiness: "SUPPORTED",
      sourceConclusion:
        "Compound blend references require an intermediate blend value before the final weighted mean, supporting a distinct two-stage forward task.",
      fixtures: [
        {
          fixtureId: "SRC-CP001-TWO-STAGE-MEAN",
          sourceLabel:
            "R.S. Aggarwal quantitative-aptitude alligation chapter, compound three-variety example",
          evidenceStrength: "DIRECT_EXTERNAL",
          sourcePattern:
            "Two sources first form an intermediate blend; that blend is then combined with another source and the final value is determined.",
          representedUnknown: "second-stage final mean",
          representations: ["MULTI_COMPONENT", "PREBLEND_OR_TWO_STAGE"],
          legacyFamilyIds: [
            "alligation_successive_mixing",
            "alligation_two_stage_mean",
            "mix_compound_alligation_two_steps",
          ],
        },
      ],
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-TWO-STAGE-UNKNOWN-QUANTITY",
      readiness: "SUPPORTED_WITH_VARIANT_GAP",
      sourceConclusion:
        "Uploaded references directly combine pre-blended mixtures and scale their required quantities, but the exact second-stage added-quantity framing is only analogous externally. Keep the inverse task provisional until one direct source fixture is attached.",
      fixtures: [
        {
          fixtureId: "SRC-CP001-TWO-STAGE-INVERSE-PREBLENDS",
          sourceLabel:
            "R.S. Aggarwal quantitative-aptitude alligation chapter, two-vessel pre-blend example",
          evidenceStrength: "ANALOGOUS_EXTERNAL",
          sourcePattern:
            "Two mixtures with known internal compositions are treated as equivalent source values, mixed to a target composition and scaled to a stated total.",
          representedUnknown: "quantity of a pre-blended source",
          representations: [
            "PREBLEND_OR_TWO_STAGE",
            "TOTAL_SCALE_CONSTRAINT",
          ],
          legacyFamilyIds: [
            "vessel_two_vessels_different_ratio",
            "mix_compound_alligation_two_steps",
          ],
        },
      ],
    },
    {
      freezeCandidateId: "MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY",
      readiness: "BLOCKED_SOURCE_GAP",
      sourceConclusion:
        "Three-component blending is directly sourced, but no recovered reference fixture yet matches the exact coupled quantity relation plus total plus target unknown. Executable correctness alone is insufficient for permanent allocation.",
      fixtures: [
        {
          fixtureId: "SRC-CP001-THREE-WAY-RELATION-LEGACY",
          sourceLabel:
            "Quant V2 three-way alligation family and current executable prototype",
          evidenceStrength: "LEGACY_EXECUTABLE",
          sourcePattern:
            "Three source values, a total quantity, a relation between two quantities and a target mean determine the third quantity.",
          representedUnknown: "one quantity in a coupled three-component system",
          representations: [
            "MULTI_COMPONENT",
            "COUPLED_RELATION_CONSTRAINT",
          ],
          legacyFamilyIds: [
            "mix_alligation_three_way_blend",
            "mix_high_difficulty_constraint_system",
          ],
        },
      ],
    },
  ] as const;

const sourceLedgerByCandidate = new Map<
  MalCp001FreezeCandidateId,
  MalCp001SourceFixtureLedgerEntry
>(MAL_CP001_SOURCE_FIXTURE_LEDGER.map((entry) => [entry.freezeCandidateId, entry]));

export function getMalCp001SourceFixtureLedgerEntry(
  freezeCandidateId: MalCp001FreezeCandidateId,
): MalCp001SourceFixtureLedgerEntry {
  const entry = sourceLedgerByCandidate.get(freezeCandidateId);
  if (!entry) {
    throw new Error(`Missing MAL-CP-001 source fixture ledger entry for ${freezeCandidateId}.`);
  }
  return entry;
}
