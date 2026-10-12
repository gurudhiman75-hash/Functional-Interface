// Opt-in, fail-closed transport to the dedicated universal compute service.
// The API retains auth/RBAC, package validation and all Neon persistence.
import type { QuestionStudioEngineId } from "./engine-types";
import type { UniversalStudioComputeInput, UniversalStudioComputeResult } from "./universal-executor";

const endpoint = "/internal/question-studio/universal/generate";
const maxResultBytes = 16 * 1024 * 1024;

export function universalStudioRemoteConfigured() {
  return Boolean(process.env.QUESTION_STUDIO_UNIVERSAL_WORKER_URL?.trim());
}

export async function runUniversalStudioRemote(input: UniversalStudioComputeInput): Promise<UniversalStudioComputeResult> {
  const origin = process.env.QUESTION_STUDIO_UNIVERSAL_WORKER_URL?.trim();
  const token = process.env.QUESTION_STUDIO_WORKER_TOKEN?.trim();
  if (!origin || !token || token.length < 32) {
    throw Object.assign(new Error("Universal worker configuration is incomplete"), {
      statusCode: 503, code: "UNIVERSAL_WORKER_NOT_CONFIGURED",
    });
  }
  let url;
  try { url = new URL(endpoint, origin.endsWith("/") ? origin : origin + "/"); }
  catch { throw Object.assign(new Error("Invalid universal worker origin"), {
    statusCode: 503, code: "UNIVERSAL_WORKER_INVALID_URL",
  }); }
  if (url.protocol !== "https:" &&
      !(url.protocol === "http:" && ["127.0.0.1", "localhost"].includes(url.hostname))) {
    throw Object.assign(new Error("Universal worker requires HTTPS"), {
      statusCode: 503, code: "UNIVERSAL_WORKER_INSECURE_URL",
    });
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 125_000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Examtree-Worker-Token": token },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    if (!response.body) throw new Error("Empty universal worker response");
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    for await (const chunk of response.body) {
      bytes += chunk.byteLength;
      if (bytes > maxResultBytes) {
        await response.body.cancel().catch(() => undefined);
        throw Object.assign(new Error("Universal worker response exceeds 16 MiB"), {
          statusCode: 502, code: "UNIVERSAL_WORKER_RESPONSE_TOO_LARGE",
        });
      }
      chunks.push(chunk);
    }
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
      ok?: boolean; batch?: UniversalStudioComputeResult; code?: string; error?: string;
    };
    if (!response.ok || !data.ok || !data.batch) {
      throw Object.assign(new Error(data.error || "Universal worker failed"), {
        statusCode: response.status >= 400 && response.status < 600 ? response.status : 502,
        code: data.code || "UNIVERSAL_WORKER_FAILED",
      });
    }
    if (data.batch.packageId !== input.request.packageId ||
        data.batch.engineId !== input.request.engineId ||
        !Array.isArray(data.batch.questions) || data.batch.questions.length !== input.count ||
        !Array.isArray(data.batch.generationContexts) ||
        (data.batch.engineId === "quant-v4" && !data.batch.quantPlan)) {
      throw Object.assign(new Error("Universal worker returned a mismatched generation batch"), {
        statusCode: 502, code: "UNIVERSAL_WORKER_BATCH_MISMATCH",
      });
    }
    return data.batch;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw Object.assign(new Error("Universal worker timed out"), {
        statusCode: 503, code: "UNIVERSAL_WORKER_TIMEOUT",
      });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
