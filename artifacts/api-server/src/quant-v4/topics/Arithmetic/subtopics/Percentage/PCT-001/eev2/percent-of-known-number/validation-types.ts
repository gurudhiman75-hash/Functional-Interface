export type EEV2FailureSeverity = "CRITICAL" | "MAJOR" | "MINOR";

export interface EEV2ValidationFailure {
  code: string;
  severity: EEV2FailureSeverity;
  layer:
    | "TRACE"
    | "GRAPH"
    | "PLAN"
    | "BLOCK"
    | "EDUCATIONAL"
    | "COMPATIBILITY";
  message: string;
  subjectId?: string;
}

export interface EEV2ValidationResult {
  valid: boolean;
  failures: readonly EEV2ValidationFailure[];
}

export function validationResult(
  failures: readonly EEV2ValidationFailure[],
): EEV2ValidationResult {
  return {
    valid: failures.length === 0,
    failures,
  };
}
