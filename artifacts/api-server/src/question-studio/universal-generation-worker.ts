import { parentPort, workerData } from "node:worker_threads";
import { executeUniversalStudioCompute } from "./universal-executor";
import type { UniversalStudioComputeInput } from "./universal-executor";

if (!parentPort) throw new Error("Universal generator must run in an isolated worker thread");

try {
  const batch = await executeUniversalStudioCompute(workerData as UniversalStudioComputeInput);
  parentPort.postMessage({ ok: true, batch });
} catch (error) {
  const failure = error as { code?: unknown; statusCode?: unknown; message?: unknown };
  parentPort.postMessage({
    ok: false,
    error: {
      code: typeof failure.code === "string" ? failure.code : "UNIVERSAL_GENERATION_FAILED",
      statusCode: Number.isInteger(failure.statusCode) ? failure.statusCode : 422,
      message: error instanceof Error ? error.message : "Universal generation failed",
    },
  });
}
