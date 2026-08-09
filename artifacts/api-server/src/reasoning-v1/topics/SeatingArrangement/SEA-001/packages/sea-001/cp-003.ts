import type { CircularBlueprintId } from "../../cp003/types.ts";
import { generateCircularCaselet } from "../../cp003/generator.ts";

export const SEA_CP003_BLUEPRINT_CONTRACTS: Readonly<Record<CircularBlueprintId, string>> = Object.freeze({
  "SEA-PBA-009": "centre-facing opposite-anchor cycle",
  "SEA-PBA-010": "centre-facing linked clockwise block",
  "SEA-PBA-011": "centre-facing gap and adjacency mix",
  "SEA-PBA-012": "centre-facing external-landmark anchor with elimination",
});

export { generateCircularCaselet };
