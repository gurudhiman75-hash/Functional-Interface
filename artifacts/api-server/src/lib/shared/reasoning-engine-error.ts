import {
  getGenerationContext,
} from "./randomness";

export type ReasoningEnginePhase =
  | "topology"
  | "constraint-generation"
  | "optimization"
  | "validation"
  | "realization";

export type ReasoningEngineErrorShape = {
  code: string;
  phase: ReasoningEnginePhase;
  metadata?: Record<
    string,
    unknown
  >;
};

export class ReasoningEngineError
  extends Error
  implements ReasoningEngineErrorShape
{
  code: string;

  phase: ReasoningEnginePhase;

  metadata?: Record<
    string,
    unknown
  >;

  constructor(
    input: ReasoningEngineErrorShape & {
      message: string;
      cause?: unknown;
    },
  ) {
    super(input.message);
    this.name =
      "ReasoningEngineError";
    this.code = input.code;
    this.phase = input.phase;
    this.metadata =
      input.metadata;

    if ("cause" in input) {
      Object.defineProperty(
        this,
        "cause",
        {
          value: input.cause,
          enumerable: false,
          configurable: true,
        },
      );
    }
  }
}

export function buildReasoningErrorMetadata(
  metadata?: Record<
    string,
    unknown
  >,
) {
  const context =
    getGenerationContext();

  return {
    seed: context?.seed,
    generationId:
      context?.generationId,
    generationTimestamp:
      context?.timestamp,
    ...metadata,
  };
}

export function isReasoningEngineError(
  error: unknown,
): error is ReasoningEngineError {
  return (
    error instanceof
    ReasoningEngineError
  );
}

export function toReasoningEngineError(
  error: unknown,
  fallback: {
    code: string;
    phase: ReasoningEnginePhase;
    message: string;
    metadata?: Record<
      string,
      unknown
    >;
  },
) {
  if (
    isReasoningEngineError(error)
  ) {
    return error;
  }

  return new ReasoningEngineError({
    code: fallback.code,
    phase: fallback.phase,
    message: fallback.message,
    metadata:
      buildReasoningErrorMetadata(
        fallback.metadata,
      ),
    cause: error,
  });
}
