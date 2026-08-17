import {
  generateFigureAnalogyProofQuestion as generateSharedFigureAnalogyProofQuestion,
  type SpatialAnalogyProofGeneratorInput,
  type SpatialAnalogyProofQuestion,
} from "../../../../../foundation/spatial";

export const FIGURE_ANALOGY_PROOF_PROTOTYPE =
  "FAN-PROT-SEMANTIC-STATE-TRANSFORMATION" as const;

export type FigureAnalogyProofInput = Omit<
  SpatialAnalogyProofGeneratorInput,
  "prototypeId"
>;

export function generateFigureAnalogyProofQuestion(
  input: FigureAnalogyProofInput,
): SpatialAnalogyProofQuestion {
  return generateSharedFigureAnalogyProofQuestion({
    ...input,
    prototypeId: FIGURE_ANALOGY_PROOF_PROTOTYPE,
  });
}
