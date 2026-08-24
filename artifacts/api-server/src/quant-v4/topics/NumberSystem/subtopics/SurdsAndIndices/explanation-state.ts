import type { SriCheckpointId } from "./discovery-types";

const CHECKPOINT_CONTEXT: Readonly<Record<SriCheckpointId, string>> = {
  "SRI-CP-001": "The question gives an expression built from integer powers.",
  "SRI-CP-002": "The question gives a power whose zero, negative, or fractional exponent must be interpreted over the real numbers.",
  "SRI-CP-003": "The given powers use related bases that can be rewritten using one common base.",
  "SRI-CP-004": "One or more exact power values are provided for a related transformation or parameter.",
  "SRI-CP-005": "An exponential equation or exact power relation is given.",
  "SRI-CP-006": "Power expressions or index-law statements are given for exact comparison.",
  "SRI-CP-007": "A radical expression is given for simplification or classification.",
  "SRI-CP-008": "A surd expression is given for exact arithmetic or classification.",
  "SRI-CP-009": "The given expression contains a radical denominator that can be rationalised.",
  "SRI-CP-010": "A nested or repeating radical relation is given.",
  "SRI-CP-011": "Surd expressions, bounds, or a radical equation are given for exact analysis.",
  "SRI-CP-012": "The given expression combines radical and fractional-index notation.",
};

/**
 * Discovery state contains solver internals as well as learner givens, so it must never
 * be dumped into the learner explanation. Keep the given section concise and semantic;
 * the concrete values are then shown naturally in the working lines.
 */
export function describeSriGivenContext(checkpointId: SriCheckpointId): string {
  return CHECKPOINT_CONTEXT[checkpointId];
}
