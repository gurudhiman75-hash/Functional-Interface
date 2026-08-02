import type { Rational } from "../foundation/types";

export const INT_CP_002_ID = "INT-CP-002" as const;

export type IntCp002ContributionKind =
  | "INDEPENDENT_DEPOSIT"
  | "RATE_INTERVAL"
  | "OUTSTANDING_BALANCE_SEGMENT"
  | "COUNTERFACTUAL_STATE";

export type IntCp002DayCountBasis =
  | "NOT_APPLICABLE"
  | "ACTUAL_365"
  | "COMMERCIAL_360"
  | "EXPLICIT_DENOMINATOR";

export interface IntCp002Contribution {
  contributionId: string;
  principal: Rational;
  annualRatePercent: Rational;
  durationYears: Rational;
  startsAtYears: Rational;
  endsAtYears: Rational;
  sourceKind: IntCp002ContributionKind;
}

export interface IntCp002PrincipalEvent {
  eventId: string;
  atYears: Rational;
  kind: "PARTIAL_REPAYMENT" | "WITHDRAWAL";
  amount: Rational;
}

export interface IntCp002LedgerState {
  contributions: IntCp002Contribution[];
  dayCountBasis: IntCp002DayCountBasis;
  explicitDayCountDenominator?: Rational;
  totalPrincipal?: Rational;
  totalInterest?: Rational;
  interestDifference?: Rational;
  comparisonOperator?: "EQUAL" | "GREATER_BY" | "LESS_BY" | "RATIO";
}

export interface IntCp002OutstandingBalanceRequest {
  openingPrincipal: Rational;
  annualRatePercent: Rational;
  horizonYears: Rational;
  events: IntCp002PrincipalEvent[];
}

export interface IntCp002ContributionResult {
  contributionId: string;
  interest: Rational;
}

export interface IntCp002LedgerResult {
  contributions: IntCp002ContributionResult[];
  totalInterest: Rational;
}

export interface IntCp002VerificationResult {
  ok: boolean;
  errors: string[];
  reconstructedTotalInterest: Rational;
}
