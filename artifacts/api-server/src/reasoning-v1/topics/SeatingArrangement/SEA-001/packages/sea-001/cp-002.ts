import type { MixedFacingBlueprintId } from "../../cp002/types.ts";
import { generateMixedFacingCaselet } from "../../cp002/generator.ts";

export const SEA_CP002_BLUEPRINT_CONTRACTS: Readonly<Record<MixedFacingBlueprintId, string>> = Object.freeze({
  "SEA-PBA-005": "stated mixed facings plus relative chain",
  "SEA-PBA-006": "inferred facing from directional consistency",
  "SEA-PBA-007": "mixed-facing block placement",
  "SEA-PBA-008": "exact-gap relations under mixed facing",
});

export { generateMixedFacingCaselet };
