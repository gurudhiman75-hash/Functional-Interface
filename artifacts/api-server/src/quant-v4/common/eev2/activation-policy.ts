import type { EEV2DetailMode, EEV2Metadata } from "./contracts";
import {
  EEV2_ACTIVATION_POLICY_VERSION,
  createControlledActivationMetadata,
  type ActivationQualification,
  type ActivationVersionSet,
  type ControlledActivationMetadata,
  type EEV2ActivationState,
  type TaskKindActivationPolicy,
} from "./activation-metadata";
import {
  routeExplanationExecution,
  type EEV2RoutingMode,
  type ExplanationEngineExecutors,
  type ExplanationRoutingResult,
} from "./routing";

const ACTIVATION_STATE_ORDER: readonly EEV2ActivationState[] = [
  "DISABLED",
  "SHADOW",
  "LIMITED",
  "ACTIVE",
];

export interface CreateTaskKindActivationPolicyInput {
  policyId: string;
  packageId: string;
  taskKind: string;
  methodFamily: string;
  activatedLocales: readonly string[];
  versions: ActivationVersionSet;
  qualification: ActivationQualification;
  audit: EEV2Metadata;
}

export interface ActivationTransitionRequest {
  nextState: EEV2ActivationState;
  transitionTimestamp: string;
  qualification: ActivationQualification;
}

export interface ControlledActivationRequest<TInput> {
  taskKind: string;
  locale: string;
  detailMode: EEV2DetailMode;
  input: TInput;
  comparisonTimestamp: string;
}

export interface ControlledActivationResult<TV1Output, TV2Output> {
  routing: ExplanationRoutingResult<TV1Output, TV2Output>;
  activation: ControlledActivationMetadata;
}

export function createTaskKindActivationPolicy(
  input: CreateTaskKindActivationPolicyInput,
): TaskKindActivationPolicy {
  return {
    policyId: input.policyId,
    policyVersion: EEV2_ACTIVATION_POLICY_VERSION,
    packageId: input.packageId,
    taskKind: input.taskKind,
    methodFamily: input.methodFamily,
    state: "DISABLED",
    activatedLocales: [...input.activatedLocales],
    versions: structuredClone(input.versions),
    qualification: structuredClone(input.qualification),
    rolloutTimestamp: null,
    lastRollback: null,
    audit: structuredClone(input.audit),
  };
}

export function activationRequirementsSatisfied(
  qualification: ActivationQualification,
): boolean {
  return (
    qualification.mathematicalParity &&
    qualification.validatorSuccess &&
    qualification.shadowStability &&
    qualification.deterministicExecution &&
    qualification.localeParity.en &&
    qualification.localeParity.hi &&
    qualification.localeParity.pa &&
    qualification.noCriticalFailures &&
    qualification.blindReviewApproval &&
    qualification.noEducationalRegressions
  );
}

export function transitionTaskKindActivation(
  policy: TaskKindActivationPolicy,
  request: ActivationTransitionRequest,
): TaskKindActivationPolicy {
  if (!request.transitionTimestamp.trim()) {
    throw new Error("Activation transition timestamp is required.");
  }
  const distance =
    ACTIVATION_STATE_ORDER.indexOf(request.nextState) -
    ACTIVATION_STATE_ORDER.indexOf(policy.state);
  if (distance !== 1) {
    throw new Error(
      `Activation transition must advance exactly one state: ${policy.state} -> ${request.nextState}`,
    );
  }
  if (
    (request.nextState === "LIMITED" || request.nextState === "ACTIVE") &&
    !activationRequirementsSatisfied(request.qualification)
  ) {
    throw new Error(
      `Activation requirements are not satisfied for ${request.nextState}.`,
    );
  }
  return {
    ...policy,
    state: request.nextState,
    qualification: structuredClone(request.qualification),
    rolloutTimestamp: request.transitionTimestamp,
  };
}

export function resolveActivationRoutingMode(
  policy: TaskKindActivationPolicy,
  taskKind: string,
  locale: string,
): EEV2RoutingMode {
  if (
    taskKind !== policy.taskKind ||
    !policy.activatedLocales.includes(locale)
  ) {
    return "v1";
  }
  if (policy.state === "DISABLED") return "v1";
  if (policy.state === "SHADOW") return "shadow";
  return "v2";
}

export async function executeControlledActivation<
  TInput,
  TV1Output,
  TV2Output,
>(
  policy: TaskKindActivationPolicy,
  request: ControlledActivationRequest<TInput>,
  executors: ExplanationEngineExecutors<TInput, TV1Output, TV2Output>,
): Promise<ControlledActivationResult<TV1Output, TV2Output>> {
  const routingMode = resolveActivationRoutingMode(
    policy,
    request.taskKind,
    request.locale,
  );
  const routing = await routeExplanationExecution(
    {
      mode: routingMode,
      input: request.input,
      comparisonTimestamp: request.comparisonTimestamp,
    },
    executors,
  );
  return {
    routing,
    activation: createControlledActivationMetadata(policy, {
      taskKind: request.taskKind,
      locale: request.locale,
      detailMode: request.detailMode,
      routingMode,
    }),
  };
}

