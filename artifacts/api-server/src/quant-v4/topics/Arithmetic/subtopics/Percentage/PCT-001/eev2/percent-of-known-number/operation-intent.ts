import type { PercentOfKnownNumberRealismModel } from "./context-realism";

export interface OperationIntentValues {
  knownUnitCount: number;
  targetUnitCount: number;
}

export interface OperationIntent {
  equalRate: boolean;
  divisionPurpose: string;
  multiplicationPurpose: string;
  oneUnitMeaning: string;
}

export function buildOperationIntent(
  values: OperationIntentValues,
  model: PercentOfKnownNumberRealismModel,
): OperationIntent {
  const knownRate = String(values.knownUnitCount);
  const targetRate = String(values.targetUnitCount);
  const context = model.contextObject;
  return {
    equalRate: values.knownUnitCount === values.targetUnitCount,
    divisionPurpose:
      `${knownRate}% represents ${knownRate} equal 1% parts together. ` +
      `Dividing the known value by ${knownRate} tells us the value of one such part.`,
    multiplicationPurpose:
      `Once we know 1% of ${context}, multiplying that value by ${targetRate} ` +
      `gives ${targetRate}% of ${context}.`,
    oneUnitMeaning: `One such percentage part is 1% of ${context}.`,
  };
}

