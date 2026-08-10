import { generateMixedCircleCaselet } from "../../cp005/generator.ts";
import type { MixedCircleBlueprintId } from "../../cp005/types.ts";

export const SEA_CP005_BLUEPRINT_CONTRACTS: Readonly<Record<MixedCircleBlueprintId, string>> = Object.freeze({
  "SEA-PBA-017": "known-direction mixed-facing ring",
  "SEA-PBA-018": "inferred-direction mixed-facing ring",
  "SEA-PBA-019": "mixed-facing opposite and gap chain",
  "SEA-PBA-020": "conditional orientation mixed-facing ring",
});

export { generateMixedCircleCaselet };
