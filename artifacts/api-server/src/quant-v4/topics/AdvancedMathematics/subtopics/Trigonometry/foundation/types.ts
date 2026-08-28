export type TrigFunction = "SIN" | "COS" | "TAN" | "COT" | "SEC" | "COSEC";

export type ExactRational = {
  kind: "RATIONAL";
  numerator: bigint;
  denominator: bigint;
};

export type ExactRadicalTerm = {
  /** Square-free positive integer. radicand=1 is the rational term. */
  radicand: bigint;
  coefficient: ExactRational;
};

/**
 * Canonical exact real number used by Trigonometry.
 *
 * The number is a reduced sum of rational multiples of square roots:
 *   a + b√m + c√n + ...
 *
 * This covers rationals, simple surds, rational+surd values and the
 * multiquadratic values produced by standard-angle identities.
 */
export type ExactTrigNumber = {
  kind: "RADICAL_SUM";
  terms: ExactRadicalTerm[];
};

export type ExactUndefinedReason =
  | "DIVISION_BY_ZERO"
  | "TRIG_UNDEFINED"
  | "UNSUPPORTED_EXACT_ANGLE"
  | "RADICAL_FIELD_TOO_LARGE";

export type ExactUndefined = {
  kind: "UNDEFINED";
  reason: ExactUndefinedReason;
  detail?: string;
};

export type ExactTrigResult = ExactTrigNumber | ExactUndefined;

export type ExactNumberClass =
  | "RATIONAL"
  | "SURD"
  | "RATIONAL_SURD"
  | "MULTI_SURD";

export type DegreeAngle = {
  kind: "ANGLE";
  unit: "DEGREE";
  value: ExactRational;
};

export type RadianPiAngle = {
  kind: "ANGLE";
  unit: "RADIAN_PI";
  coefficient: ExactRational;
};

export type AngleMeasure = DegreeAngle | RadianPiAngle;

export type Quadrant = "I" | "II" | "III" | "IV" | "AXIS";

export type TrigExpression =
  | { kind: "CONST"; value: ExactTrigNumber }
  | { kind: "TRIG"; fn: TrigFunction; angle: AngleMeasure }
  | { kind: "ADD"; terms: TrigExpression[] }
  | { kind: "SUBTRACT"; left: TrigExpression; right: TrigExpression }
  | { kind: "MULTIPLY"; factors: TrigExpression[] }
  | { kind: "DIVIDE"; numerator: TrigExpression; denominator: TrigExpression }
  | { kind: "POWER"; base: TrigExpression; exponent: number }
  | { kind: "NEGATE"; operand: TrigExpression };

export type IndependentVerification = {
  valid: boolean;
  method: string;
  expectedKey: string;
  reconstructedKey: string;
  numericDelta: number | null;
  note?: string;
};
