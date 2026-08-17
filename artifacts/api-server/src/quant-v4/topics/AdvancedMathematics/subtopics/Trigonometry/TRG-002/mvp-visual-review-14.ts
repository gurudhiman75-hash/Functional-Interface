import type { Trg002DiagramStrategy } from "./spatial";
import type { Trg002Mvp48Id } from "./mvp-48-registry";

export interface Trg002MvpVisualCase {
  qlId: Trg002Mvp48Id;
  strategy: Trg002DiagramStrategy;
  seed: string;
  mustShow: readonly string[];
  mustAvoid: readonly string[];
}

export const TRG_002_MVP_VISUAL_REVIEW_14: readonly Trg002MvpVisualCase[] = [
  { qlId: "TRG-002-QL-001", strategy: "SINGLE_ELEVATION", seed: "mvp-visual-elevation", mustShow: ["vertical object", "ground", "sight angle"], mustAvoid: ["automatic stem figure", "detached sight line"] },
  { qlId: "TRG-002-QL-015", strategy: "SINGLE_DEPRESSION", seed: "mvp-visual-depression", mustShow: ["eye-level reference", "downward sight line", "depression angle"], mustAvoid: ["angle at target", "target above eye level"] },
  { qlId: "TRG-002-QL-025", strategy: "SHADOW", seed: "mvp-visual-shadow", mustShow: ["vertical object", "ground shadow", "solar angle"], mustAvoid: ["vertical shadow", "detached ray"] },
  { qlId: "TRG-002-QL-036", strategy: "LADDER", seed: "mvp-visual-ladder", mustShow: ["wall", "ground", "ladder"], mustAvoid: ["vertical ladder", "disconnected contact"] },
  { qlId: "TRG-002-QL-041", strategy: "BROKEN_TREE", seed: "mvp-visual-broken", mustShow: ["stump", "break point", "ground touch point", "fallen part"], mustAvoid: ["intact full tree", "touch point above ground"] },
  { qlId: "TRG-002-QL-045", strategy: "GUY_WIRE", seed: "mvp-visual-wire", mustShow: ["mast", "anchor", "wire"], mustAvoid: ["anchor above ground", "detached wire"] },
  { qlId: "TRG-002-QL-049", strategy: "TWO_OBSERVATIONS_SAME_SIDE", seed: "mvp-visual-same-side", mustShow: ["two observation points", "two sight lines", "same-side order"], mustAvoid: ["object between observers", "reversed near/far"] },
  { qlId: "TRG-002-QL-056", strategy: "OBSERVER_MOVES_CLOSER", seed: "mvp-visual-closer", mustShow: ["far point", "near point", "movement toward object"], mustAvoid: ["arrow away", "near point farther"] },
  { qlId: "TRG-002-QL-061", strategy: "OBSERVER_MOVES_FARTHER", seed: "mvp-visual-farther", mustShow: ["near point", "far point", "movement away"], mustAvoid: ["arrow toward object", "far point closer"] },
  { qlId: "TRG-002-QL-073", strategy: "OBSERVER_HEIGHT", seed: "mvp-visual-eye-height", mustShow: ["eye-height segment", "eye-level reference", "sight line"], mustAvoid: ["sight line from ground", "double eye-height"] },
  { qlId: "TRG-002-QL-078", strategy: "OPPOSITE_SIDE_OBSERVATIONS", seed: "mvp-visual-opposite", mustShow: ["object between observers", "two sight lines", "full separation"], mustAvoid: ["same-side observers", "separation shown as height"] },
  { qlId: "TRG-002-QL-083", strategy: "BUILDING_TO_BUILDING", seed: "mvp-visual-buildings", mustShow: ["two buildings", "roof observer", "roof-to-roof sight line"], mustAvoid: ["sight line to wrong base", "missing first height"] },
  { qlId: "TRG-002-QL-088", strategy: "ELEVATION_AND_DEPRESSION", seed: "mvp-visual-up-down", mustShow: ["common observer", "upward sight line", "downward sight line", "eye-level reference"], mustAvoid: ["two elevation lines", "missing horizontal reference"] },
  { qlId: "TRG-002-QL-092", strategy: "RIVER_WIDTH", seed: "mvp-visual-river", mustShow: ["bank tower", "opposite-bank point", "horizontal width"], mustAvoid: ["vertical river width", "same-bank target"] },
] as const;
