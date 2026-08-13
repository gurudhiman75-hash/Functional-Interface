import type { Trg002ProofQlId } from "./runtime-proof";
import type { Trg002DiagramStrategy } from "./spatial";

export interface Trg002VisualReviewCase {
  qlId: Trg002ProofQlId;
  strategy: Trg002DiagramStrategy;
  reviewSeed: string;
  mustShow: readonly string[];
  mustAvoid: readonly string[];
}

/**
 * One representative proof QL for every spatial diagram strategy currently
 * present in the 20-QL proof. BROKEN_TREE is intentionally absent because the
 * proof does not yet implement the broken-object family; it remains mandatory
 * for the 48-QL MVP expansion.
 */
export const TRG_002_SOLUTION_DIAGRAM_VISUAL_REVIEW_CASES: readonly Trg002VisualReviewCase[] = [
  {
    qlId: "TRG-002-QL-001",
    strategy: "SINGLE_ELEVATION",
    reviewSeed: "visual-single-elevation",
    mustShow: ["vertical object", "ground line", "sight line", "45/30/60 angle marker as generated", "target height annotation"],
    mustAvoid: ["target value in stem-stage figure", "sight line detached from observer"],
  },
  {
    qlId: "TRG-002-QL-015",
    strategy: "SINGLE_DEPRESSION",
    reviewSeed: "visual-single-depression",
    mustShow: ["observer roof/eye point", "eye-level horizontal", "downward sight line", "45° depression marker", "target pole height annotation"],
    mustAvoid: ["angle drawn below target", "pole top above observer eye level"],
  },
  {
    qlId: "TRG-002-QL-025",
    strategy: "SHADOW",
    reviewSeed: "visual-shadow",
    mustShow: ["vertical pole", "ground shadow segment", "solar elevation sight line", "shadow-length annotation", "target height annotation"],
    mustAvoid: ["shadow drawn vertically", "solar ray missing pole top"],
  },
  {
    qlId: "TRG-002-QL-036",
    strategy: "LADDER",
    reviewSeed: "visual-ladder",
    mustShow: ["vertical wall", "ground", "ladder hypotenuse", "ground angle", "target wall-height annotation"],
    mustAvoid: ["ladder rendered as vertical", "wall contact disconnected"],
  },
  {
    qlId: "TRG-002-QL-045",
    strategy: "GUY_WIRE",
    reviewSeed: "visual-guy-wire",
    mustShow: ["mast", "ground anchor", "wire", "ground angle", "wire-length target annotation"],
    mustAvoid: ["anchor above ground", "wire detached from mast top"],
  },
  {
    qlId: "TRG-002-QL-049",
    strategy: "TWO_OBSERVATIONS_SAME_SIDE",
    reviewSeed: "visual-two-same-side",
    mustShow: ["two same-side observation points", "two sight lines", "30° and 60° markers", "point-separation annotation", "target tower height"],
    mustAvoid: ["tower between the observation points", "near/far order reversed"],
  },
  {
    qlId: "TRG-002-QL-056",
    strategy: "OBSERVER_MOVES_CLOSER",
    reviewSeed: "visual-moves-closer",
    mustShow: ["far and near observation points", "movement segment toward tower", "two sight lines", "final-distance target annotation"],
    mustAvoid: ["movement arrow away from tower", "near point farther than far point"],
  },
  {
    qlId: "TRG-002-QL-061",
    strategy: "OBSERVER_MOVES_FARTHER",
    reviewSeed: "visual-moves-farther",
    mustShow: ["near and far observation points", "movement away from tower", "60° near sight line", "30° far sight line", "target height annotation"],
    mustAvoid: ["far point closer to tower", "original distance pre-solved in stem-stage figure"],
  },
  {
    qlId: "TRG-002-QL-073",
    strategy: "OBSERVER_HEIGHT",
    reviewSeed: "visual-observer-height",
    mustShow: ["1.5 m eye-height segment", "eye-level sight reference", "45° elevation", "full building-height target annotation"],
    mustAvoid: ["sight line starting at ground", "eye height added twice visually"],
  },
  {
    qlId: "TRG-002-QL-078",
    strategy: "OPPOSITE_SIDE_OBSERVATIONS",
    reviewSeed: "visual-opposite-sides",
    mustShow: ["tower between observers", "two 45° sight lines", "full observer separation", "target tower height"],
    mustAvoid: ["both observers on same side", "full separation shown as tower height"],
  },
  {
    qlId: "TRG-002-QL-083",
    strategy: "BUILDING_TO_BUILDING",
    reviewSeed: "visual-building-to-building",
    mustShow: ["two vertical buildings", "observer on first roof", "45° sight line to second roof", "first height", "second-height target"],
    mustAvoid: ["sight line to second building base", "target annotation showing only roof-level rise"],
  },
  {
    qlId: "TRG-002-QL-088",
    strategy: "ELEVATION_AND_DEPRESSION",
    reviewSeed: "visual-elevation-depression",
    mustShow: ["common observer point", "one upward sight line", "one downward sight line", "eye-level horizontal", "full target tower height"],
    mustAvoid: ["both sight lines classified as elevation", "observer horizontal missing"],
  },
  {
    qlId: "TRG-002-QL-092",
    strategy: "RIVER_WIDTH",
    reviewSeed: "visual-river-width",
    mustShow: ["bank tower", "opposite-bank point", "45° depression sight line", "horizontal river-width target annotation"],
    mustAvoid: ["river width drawn vertically", "opposite-bank point on tower bank"],
  },
] as const;

export const TRG_002_PROOF_REPRESENTED_DIAGRAM_STRATEGIES = [
  "SINGLE_ELEVATION",
  "SINGLE_DEPRESSION",
  "SHADOW",
  "LADDER",
  "GUY_WIRE",
  "TWO_OBSERVATIONS_SAME_SIDE",
  "OBSERVER_MOVES_CLOSER",
  "OBSERVER_MOVES_FARTHER",
  "OBSERVER_HEIGHT",
  "OPPOSITE_SIDE_OBSERVATIONS",
  "BUILDING_TO_BUILDING",
  "ELEVATION_AND_DEPRESSION",
  "RIVER_WIDTH",
] as const satisfies readonly Trg002DiagramStrategy[];
