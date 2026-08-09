import { generateOutwardCaselet } from "../../cp004/generator.ts";
import type { OutwardBlueprintId } from "../../cp004/types.ts";

export const SEA_CP004_BLUEPRINT_CONTRACTS: Readonly<Record<OutwardBlueprintId, string>> = Object.freeze({
  "SEA-PBA-013": "outward-facing opposite-anchor cycle",
  "SEA-PBA-014": "outward left/right reversal-intensive chain",
  "SEA-PBA-015": "outward gap and neighbour mix",
  "SEA-PBA-016": "outward external-landmark anchor and reversal",
});

export { generateOutwardCaselet };
