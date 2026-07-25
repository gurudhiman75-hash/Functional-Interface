import type { FundamentalSolveRequest } from "./solver";
import { solveFundamental } from "./solver";
import { renderFundamentalExplanation } from "./explanation-renderer";
import { validateFundamentalInput } from "./validator";

export function runFundamentalPipeline(request: FundamentalSolveRequest) {
  const validation = validateFundamentalInput(request);
  if (!validation.ok) {
    throw new Error(`Invalid PNL-001 request: ${validation.errors.join(" ")}`);
  }
  const result = solveFundamental(request);
  return {
    request,
    result,
    explanation: renderFundamentalExplanation(request, result),
  } as const;
}
