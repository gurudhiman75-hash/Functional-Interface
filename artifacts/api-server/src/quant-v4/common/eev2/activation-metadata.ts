import type { EEV2DetailMode, EEV2Metadata } from "./contracts";
import type { EEV2RoutingMode } from "./routing";

export const EEV2_ACTIVATION_POLICY_VERSION = "1.0.0" as const;
export type EEV2ActivationState =
  | "DISABLED"
  | "SHADOW"
  | "LIMITED"
  | "ACTIVE";

export interface ActivationLocaleParity {
  en: boolean;
  hi: boolean;
  pa: boolean;
}

export interface ActivationQualification {
  mathematicalParity: boolean;
  validatorSuccess: boolean;
  shadowStability: boolean;
  deterministicExecution: boolean;
  localeParity: ActivationLocaleParity;
  noCriticalFailures: boolean;
  blindReviewApproval: boolean;
  noEducationalRegressions: boolean;
}

export interface ActivationVersionSet {
  engineVersion: string;
  blockSchemaVersion: string;
  validatorVersion: string;
}

export interface ActivationRollbackMetadata {
  rollbackId: string;
  taskKind: string;
  methodFamily: string;
  previousState: EEV2ActivationState;
  newState: "DISABLED";
  failureCode: string;
  failureMessage: string;
  rollbackTimestamp: string;
  audit: EEV2Metadata;
}

export interface TaskKindActivationPolicy {
  policyId: string;
  policyVersion: typeof EEV2_ACTIVATION_POLICY_VERSION;
  packageId: string;
  taskKind: string;
  methodFamily: string;
  state: EEV2ActivationState;
  activatedLocales: readonly string[];
  versions: ActivationVersionSet;
  qualification: ActivationQualification;
  rolloutTimestamp: string | null;
  lastRollback: ActivationRollbackMetadata | null;
  audit: EEV2Metadata;
}

export interface ControlledActivationMetadata {
  policyId: string;
  policyVersion: typeof EEV2_ACTIVATION_POLICY_VERSION;
  taskKind: string;
  requestedTaskKind: string;
  methodFamily: string;
  activationState: EEV2ActivationState;
  locale: string;
  detailMode: EEV2DetailMode;
  routingMode: EEV2RoutingMode;
  engineVersion: string;
  blockSchemaVersion: string;
  validatorVersion: string;
  shadowStatus: "not-run" | "executed";
  rolloutTimestamp: string | null;
  rollbackMetadata: ActivationRollbackMetadata | null;
  audit: EEV2Metadata;
}

export function createControlledActivationMetadata(
  policy: TaskKindActivationPolicy,
  request: {
    taskKind: string;
    locale: string;
    detailMode: EEV2DetailMode;
    routingMode: EEV2RoutingMode;
  },
): ControlledActivationMetadata {
  return {
    policyId: policy.policyId,
    policyVersion: policy.policyVersion,
    taskKind: policy.taskKind,
    requestedTaskKind: request.taskKind,
    methodFamily: policy.methodFamily,
    activationState: policy.state,
    locale: request.locale,
    detailMode: request.detailMode,
    routingMode: request.routingMode,
    engineVersion: policy.versions.engineVersion,
    blockSchemaVersion: policy.versions.blockSchemaVersion,
    validatorVersion: policy.versions.validatorVersion,
    shadowStatus: request.routingMode === "shadow" ? "executed" : "not-run",
    rolloutTimestamp: policy.rolloutTimestamp,
    rollbackMetadata: policy.lastRollback
      ? structuredClone(policy.lastRollback)
      : null,
    audit: structuredClone(policy.audit),
  };
}

