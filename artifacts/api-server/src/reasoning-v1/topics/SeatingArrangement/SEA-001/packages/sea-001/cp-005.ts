import { generateMixedCircleCaselet, generateMixedCircularCaselet } from "../../cp005/generator.ts";
import type { MixedCircularBlueprintId } from "../../cp005/types.ts";

export const SEA_CP005_BLUEPRINT_CONTRACTS: Readonly<Record<MixedCircularBlueprintId, string>> = Object.freeze({
  "SEA-PBA-017": "mixed-facing known-direction ring",
  "SEA-PBA-018": "mixed-facing inferred-direction ring",
  "SEA-PBA-019": "mixed-facing opposite and gap chain",
  "SEA-PBA-020": "mixed-facing conditional orientation",
});

export { generateMixedCircleCaselet, generateMixedCircularCaselet };
