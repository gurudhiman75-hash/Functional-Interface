import type { VerificationResult } from "./types";
import type { ConditionalPromotionRequest, ConditionalPromotionResult } from "./conditional-promotion-solver";
import { solveConditionalPromotion } from "./conditional-promotion-solver";

export function verifyConditionalPromotionResult(
  request: ConditionalPromotionRequest,
  claimed: ConditionalPromotionResult,
): VerificationResult {
  const errors: string[] = [];
  if (claimed.mode !== request.mode) errors.push("Claimed result mode does not match request mode.");

  try {
    const expected = solveConditionalPromotion(request);
    if (JSON.stringify(expected, (_, value) => typeof value === "bigint" ? value.toString() : value) !==
        JSON.stringify(claimed, (_, value) => typeof value === "bigint" ? value.toString() : value)) {
      errors.push("Claimed result does not match independently recomputed result.");
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Conditional promotion verification failed.");
  }

  return { ok: errors.length === 0, errors };
}
