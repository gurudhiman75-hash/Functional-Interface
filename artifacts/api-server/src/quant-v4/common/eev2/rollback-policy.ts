import type { EEV2Metadata } from "./contracts";
import type {
  ActivationRollbackMetadata,
  TaskKindActivationPolicy,
} from "./activation-metadata";

export const CRITICAL_ACTIVATION_FAILURE_CODES = [
  "WRONG_ANSWER",
  "MISSING_ONE_UNIT_DERIVATION",
  "FORMULA_FIRST_REGRESSION",
  "ANSWER_JUMP",
  "TEACHER_RENDERER_FALLBACK",
  "BLOCK_CORRUPTION",
  "PARITY_BREAK",
  "NONDETERMINISM",
] as const;

export type CriticalActivationFailureCode =
  (typeof CRITICAL_ACTIVATION_FAILURE_CODES)[number];

export interface CriticalActivationFailure {
  taskKind: string;
  methodFamily: string;
  code: CriticalActivationFailureCode;
  message: string;
  timestamp: string;
  audit: EEV2Metadata;
}

export interface TaskKindRollbackResult {
  policies: readonly TaskKindActivationPolicy[];
  rollback: ActivationRollbackMetadata;
}

export function applyTaskKindRollback(
  policies: readonly TaskKindActivationPolicy[],
  failure: CriticalActivationFailure,
): TaskKindRollbackResult {
  if (!CRITICAL_ACTIVATION_FAILURE_CODES.includes(failure.code)) {
    throw new Error(`Unsupported critical rollback trigger: ${failure.code}`);
  }
  const target = policies.find(
    (policy) =>
      policy.taskKind === failure.taskKind &&
      policy.methodFamily === failure.methodFamily,
  );
  if (!target) {
    throw new Error(
      `No activation policy for rollback: ${failure.taskKind}/${failure.methodFamily}`,
    );
  }
  if (!failure.timestamp.trim()) throw new Error("Rollback timestamp is required.");
  const rollback: ActivationRollbackMetadata = {
    rollbackId: [
      "rollback",
      target.policyId,
      failure.taskKind,
      failure.code,
      failure.timestamp,
    ].join(":"),
    taskKind: target.taskKind,
    methodFamily: target.methodFamily,
    previousState: target.state,
    newState: "DISABLED",
    failureCode: failure.code,
    failureMessage: failure.message,
    rollbackTimestamp: failure.timestamp,
    audit: structuredClone(failure.audit),
  };
  return {
    policies: policies.map((policy) =>
      policy.policyId === target.policyId
        ? { ...policy, state: "DISABLED", lastRollback: rollback }
        : policy,
    ),
    rollback,
  };
}

