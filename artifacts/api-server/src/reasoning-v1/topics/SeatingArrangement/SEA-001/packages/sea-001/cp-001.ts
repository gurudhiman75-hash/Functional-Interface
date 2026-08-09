import type { SeatingBlueprintId } from "../../types.ts";
import { generateSeaCp001Caselet } from "../../generation/caselet-assembler.ts";

export const SEA_CP001_BLUEPRINT_CONTRACTS: Readonly<Record<SeatingBlueprintId, string>> = Object.freeze({
  "SEA-PBA-001": "end anchor plus linked consecutive block",
  "SEA-PBA-002": "middle anchor plus exact-gap chain",
  "SEA-PBA-003": "two-end constraints plus adjacency elimination",
  "SEA-PBA-004": "negative adjacency plus only-remaining placement",
});

export { generateSeaCp001Caselet };
