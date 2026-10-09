// Optional off-instance compute: keeps large question authorities out of the
// 512 MiB student API. Missing configuration means the existing local path.
const endpoint = "/internal/trg002/generate";
const maxResultBytes = 16 * 1024 * 1024;

export type RemoteTrg002Batch = {
  questions: Array<Record<string, unknown>>;
  generationContexts: Array<{ cpId?: string; difficulty: string; context: Record<string, unknown> }>;
  plan: {
    seed: string;
    profile: { id: string; label: string };
    trace: Record<string, unknown>;
    requestedDifficulty: string;
    difficultyPreset: string;
    difficultyDistribution: unknown;
    difficultyCounts: unknown;
    cpCounts: Record<string, number>;
    legacyExamProfile?: string;
  };
};

export function remoteTrg002Configured(): boolean {
  return Boolean(process.env.QUESTION_STUDIO_TRG002_WORKER_URL?.trim());
}

export async function runRemoteTrg002(input: Record<string, unknown>): Promise<RemoteTrg002Batch> {
  const origin = process.env.QUESTION_STUDIO_TRG002_WORKER_URL?.trim();
  const token = process.env.QUESTION_STUDIO_WORKER_TOKEN?.trim();
  if (!origin || !token || token.length < 32) {
    throw Object.assign(new Error("Remote Question Studio worker configuration is incomplete"), {
      statusCode: 503, code: "QUESTION_STUDIO_WORKER_NOT_CONFIGURED",
    });
  }
  const url = new URL(endpoint, origin.endsWith("/") ? origin : origin + "/");
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw Object.assign(new Error("Remote Question Studio worker must use HTTPS"), {
      statusCode: 503, code: "QUESTION_STUDIO_WORKER_INSECURE_URL",
    });
  }
  const controller = new AbortController();
  const deadline = setTimeout(() => controller.abort(), 125_000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Examtree-Worker-Token": token },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    // Do not allow a misconfigured worker/proxy to fill API memory with a response.
    const chunks: Uint8Array[] = [];
    let total = 0;
    if (!response.body) throw new Error("Remote worker returned an empty response");
    for await (const chunk of response.body) {
      total += chunk.byteLength;
      if (total > maxResultBytes) {
        await response.body.cancel().catch(() => undefined);
        throw Object.assign(new Error("Remote worker response exceeded 16 MiB"), {
          statusCode: 502, code: "QUESTION_STUDIO_WORKER_RESPONSE_TOO_LARGE",
        });
      }
      chunks.push(chunk);
    }
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
      ok?: boolean; batch?: RemoteTrg002Batch; error?: string; code?: string;
    };
    if (!response.ok || !data.ok || !data.batch) {
      throw Object.assign(new Error(data.error || "Remote Question Studio generation failed"), {
        statusCode: response.status >= 400 && response.status < 600 ? response.status : 502,
        code: data.code || "QUESTION_STUDIO_REMOTE_GENERATION_FAILED",
      });
    }
    return data.batch;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw Object.assign(new Error("Remote question generation timed out"), {
        statusCode: 503, code: "QUESTION_STUDIO_REMOTE_TIMEOUT",
      });
    }
    throw error;
  } finally {
    clearTimeout(deadline);
  }
}
