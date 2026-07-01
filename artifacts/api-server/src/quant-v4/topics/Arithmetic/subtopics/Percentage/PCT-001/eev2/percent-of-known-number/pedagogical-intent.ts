import type { PercentOfKnownNumberRealismModel } from "./context-realism";
import {
  buildOperationIntent,
  type OperationIntent,
  type OperationIntentValues,
} from "./operation-intent";

export const PERCENT_OF_KNOWN_NUMBER_INTENT_VERSION = "1.0.0" as const;

export interface PedagogicalIntent {
  intentVersion: typeof PERCENT_OF_KNOWN_NUMBER_INTENT_VERSION;
  methodFamily: "UNIT_VALUE";
  operation: OperationIntent;
  preserveContext: boolean;
  conciseEqualRate: boolean;
}

export function buildPercentOfKnownNumberPedagogicalIntent(
  values: OperationIntentValues,
  model: PercentOfKnownNumberRealismModel,
): PedagogicalIntent {
  const operation = buildOperationIntent(values, model);
  return {
    intentVersion: PERCENT_OF_KNOWN_NUMBER_INTENT_VERSION,
    methodFamily: "UNIT_VALUE",
    operation,
    preserveContext: model.policy.preserveContext,
    conciseEqualRate: operation.equalRate,
  };
}

