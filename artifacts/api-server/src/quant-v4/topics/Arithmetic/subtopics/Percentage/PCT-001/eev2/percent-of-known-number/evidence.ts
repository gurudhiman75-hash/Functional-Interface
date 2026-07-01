import type { EEV2Metadata } from "../../../../../../../common/eev2/contracts";

export const PERCENT_OF_KNOWN_NUMBER_EVIDENCE_VERSION = "1.0.0" as const;
export const PERCENT_OF_KNOWN_NUMBER_METHOD_FAMILY = "UNIT_VALUE" as const;

export interface ExactRationalValue {
  numerator: number;
  denominator: number;
}

export interface PercentOfKnownNumberEvidence {
  evidenceId: string;
  evidenceVersion: typeof PERCENT_OF_KNOWN_NUMBER_EVIDENCE_VERSION;
  taskKind: "percentOfKnownNumber";
  methodFamily: typeof PERCENT_OF_KNOWN_NUMBER_METHOD_FAMILY;
  sourceValues: {
    knownUnitCount: number;
    knownQuantity: number;
    targetUnitCount: number;
  };
  derivedValues: {
    singleUnitValue: number;
    targetQuantity: number;
  };
  exactValues: {
    singleUnitValue: ExactRationalValue;
    targetQuantity: ExactRationalValue;
  };
  units: {
    knownUnitCount: "percentage-point";
    knownQuantity: string;
    targetUnitCount: "percentage-point";
    singleUnitValue: string;
    targetQuantity: string;
  };
  metadata: EEV2Metadata & {
    exactness: "rational";
    roundingPolicy: "defer-to-presentation";
    countIntegrity: "required" | "not-required";
  };
}
