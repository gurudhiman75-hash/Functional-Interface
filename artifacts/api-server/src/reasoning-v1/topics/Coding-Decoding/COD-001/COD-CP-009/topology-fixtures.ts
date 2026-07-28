import { derivePuzzleFromHiddenMapping } from "./topology";
import type { AbstractSentenceCodePuzzle } from "./types";

export const DIRECT_INTERSECTION_MAPPING = {
  moon: "la",
  is: "ka",
  satellite: "ha",
  bright: "ja",
  earth: "sa",
  has: "ma",
} as const;

export const DIRECT_INTERSECTION_PUZZLE: AbstractSentenceCodePuzzle = derivePuzzleFromHiddenMapping(
  [
    { rowId: "r1", wordIds: ["moon", "is", "satellite"], displayedTokenOrder: ["ka", "la", "ha"] },
    { rowId: "r2", wordIds: ["satellite", "is", "bright"], displayedTokenOrder: ["ja", "ha", "ka"] },
    { rowId: "r3", wordIds: ["earth", "has", "satellite"], displayedTokenOrder: ["ha", "ma", "sa"] },
  ],
  DIRECT_INTERSECTION_MAPPING,
);

export const GLOBAL_BIJECTION_MAPPING = {
  alpha: "ta",
  beta: "na",
  gamma: "pa",
  delta: "sa",
} as const;

export const GLOBAL_BIJECTION_PUZZLE: AbstractSentenceCodePuzzle = derivePuzzleFromHiddenMapping(
  [
    { rowId: "g1", wordIds: ["alpha", "gamma", "delta"], displayedTokenOrder: ["sa", "ta", "pa"] },
    { rowId: "g2", wordIds: ["alpha", "beta", "delta"], displayedTokenOrder: ["na", "sa", "ta"] },
    { rowId: "g3", wordIds: ["alpha", "beta", "gamma"], displayedTokenOrder: ["pa", "ta", "na"] },
  ],
  GLOBAL_BIJECTION_MAPPING,
);

export const PARTIAL_INFORMATION_MAPPING = {
  amber: "ka",
  blue: "mi",
  circle: "zo",
  square: "tu",
} as const;

export const PARTIAL_INFORMATION_PUZZLE: AbstractSentenceCodePuzzle = derivePuzzleFromHiddenMapping(
  [
    { rowId: "p1", wordIds: ["amber", "blue"], displayedTokenOrder: ["mi", "ka"] },
    { rowId: "p2", wordIds: ["circle", "square"], displayedTokenOrder: ["tu", "zo"] },
  ],
  PARTIAL_INFORMATION_MAPPING,
);
