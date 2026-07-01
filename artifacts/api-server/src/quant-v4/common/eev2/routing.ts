import {
  compareShadowExecutions,
  serializeShadowFailure,
  type ShadowComparisonMetadata,
  type V1EngineSnapshot,
  type V2EngineSnapshot,
  type V2ShadowExecution,
} from "./shadow-comparator";

export type EEV2RoutingMode = "v1" | "shadow" | "v2";

export interface ExplanationEngineExecutors<TInput, TV1Output, TV2Output> {
  executeV1: (
    input: TInput,
  ) => V1EngineSnapshot<TV1Output> | Promise<V1EngineSnapshot<TV1Output>>;
  executeV2: (
    input: TInput,
  ) => V2EngineSnapshot<TV2Output> | Promise<V2EngineSnapshot<TV2Output>>;
}

export interface ExplanationRoutingRequest<TInput> {
  mode: EEV2RoutingMode;
  input: TInput;
  comparisonTimestamp: string;
}

export type ExplanationRoutingResult<TV1Output, TV2Output> =
  | { mode: "v1"; publicEngine: "v1"; publicOutput: TV1Output }
  | {
      mode: "shadow";
      publicEngine: "v1";
      publicOutput: TV1Output;
      shadow: {
        v2Output: TV2Output | null;
        comparison: ShadowComparisonMetadata;
      };
    }
  | { mode: "v2"; publicEngine: "v2"; publicOutput: TV2Output };

function clone<T>(value: T): T {
  return structuredClone(value);
}

async function executeV1<TInput, TOutput>(
  executor: ExplanationEngineExecutors<TInput, TOutput, never>["executeV1"],
  input: TInput,
): Promise<V1EngineSnapshot<TOutput>> {
  return clone(await executor(clone(input)));
}

async function executeV2<TInput, TOutput>(
  executor: ExplanationEngineExecutors<TInput, never, TOutput>["executeV2"],
  input: TInput,
): Promise<V2EngineSnapshot<TOutput>> {
  return clone(await executor(clone(input)));
}

export async function routeExplanationExecution<TInput, TV1Output, TV2Output>(
  request: ExplanationRoutingRequest<TInput>,
  executors: ExplanationEngineExecutors<TInput, TV1Output, TV2Output>,
): Promise<ExplanationRoutingResult<TV1Output, TV2Output>> {
  if (request.mode === "v1") {
    const v1 = await executeV1(executors.executeV1, request.input);
    return { mode: "v1", publicEngine: "v1", publicOutput: clone(v1.output) };
  }
  if (request.mode === "v2") {
    const v2 = await executeV2(executors.executeV2, request.input);
    return { mode: "v2", publicEngine: "v2", publicOutput: clone(v2.output) };
  }
  const v1 = await executeV1(executors.executeV1, request.input);
  let v2Execution: V2ShadowExecution<TV2Output>;
  try {
    v2Execution = {
      status: "succeeded",
      snapshot: await executeV2(executors.executeV2, request.input),
    };
  } catch (error) {
    v2Execution = {
      status: "failed",
      failure: serializeShadowFailure(error),
    };
  }
  return {
    mode: "shadow",
    publicEngine: "v1",
    publicOutput: clone(v1.output),
    shadow: {
      v2Output:
        v2Execution.status === "succeeded"
          ? clone(v2Execution.snapshot.output)
          : null,
      comparison: compareShadowExecutions(
        v1,
        v2Execution,
        request.comparisonTimestamp,
      ),
    },
  };
}

