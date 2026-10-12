// Universal deterministic Question Studio compute ONLY. All DB writes and
// review-lifecycle transitions remain in the authorized API server.
import { createHash, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { Worker } from "node:worker_threads";

const token = process.env.QUESTION_STUDIO_WORKER_TOKEN;
if (!token || token.length < 32) throw new Error("Missing QUESTION_STUDIO_WORKER_TOKEN");
const tokenHash = createHash("sha256").update(token).digest();
const port = Number(process.env.PORT ?? 8080);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("Invalid PORT");

const endpoint = "/internal/question-studio/universal/generate";
const workerFile = new URL("./question-studio-universal-worker.mjs", import.meta.url);
const bodyLimit = 64 * 1024;
const responseLimit = 16 * 1024 * 1024;
let busy = false;

function respond(res, status, data) {
  if (res.destroyed) return;
  const body = JSON.stringify(data);
  if (Buffer.byteLength(body) > responseLimit) {
    respond(res, 502, { ok: false, code: "UNIVERSAL_RESPONSE_TOO_LARGE", error: "Worker response too large" });
    return;
  }
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

function authorized(req) {
  const supplied = req.headers["x-examtree-worker-token"];
  return typeof supplied === "string" &&
    timingSafeEqual(tokenHash, createHash("sha256").update(supplied).digest());
}

async function readInput(req) {
  let bytes = 0;
  const chunks = [];
  for await (const chunk of req) {
    bytes += chunk.byteLength;
    if (bytes > bodyLimit) throw Object.assign(new Error("Request too large"), {
      statusCode: 413, code: "UNIVERSAL_REQUEST_TOO_LARGE",
    });
    chunks.push(chunk);
  }
  let input;
  try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw Object.assign(new Error("Invalid JSON"), { statusCode: 400, code: "INVALID_JSON" }); }
  if (!input || typeof input !== "object" || !input.request || typeof input.request !== "object" ||
      typeof input.request.packageId !== "string" ||
      !Number.isInteger(input.count) || input.count < 1 || input.count > 50 ||
      input.request.count !== input.count || !Array.isArray(input.selectedCpIds) ||
      input.selectedCpIds.length > input.count || input.selectedCpIds.length > 50) {
    throw Object.assign(new Error("Invalid universal worker request"), {
      statusCode: 400, code: "INVALID_UNIVERSAL_GENERATION_REQUEST",
    });
  }
  return input;
}

function execute(input) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerFile, {
      workerData: input,
      resourceLimits: { maxOldGenerationSizeMb: 1536 },
    });
    let finished = false;
    const settle = (err, batch) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      void worker.terminate();
      err ? reject(err) : resolve(batch);
    };
    const timer = setTimeout(() => settle(Object.assign(new Error("Generation exceeded 120 seconds"), {
      statusCode: 503, code: "UNIVERSAL_GENERATION_TIMEOUT",
    })), 120_000);
    worker.once("message", (message) => {
      if (message?.ok && message.batch) settle(null, message.batch);
      else settle(Object.assign(new Error(message?.error?.message || "Generation failed"), {
        statusCode: message?.error?.statusCode ?? 422,
        code: message?.error?.code ?? "UNIVERSAL_GENERATION_FAILED",
      }));
    });
    worker.once("error", (error) => settle(error));
    worker.once("exit", (code) => {
      if (code !== 0) settle(Object.assign(new Error("Generator worker exited unexpectedly"), {
        statusCode: 503, code: "UNIVERSAL_GENERATION_WORKER_EXIT",
      }));
    });
  });
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    respond(res, 200, { status: "ok", busy, engineFamilies: ["quant-v4", "reasoning-v1", "language-v1", "knowledge-v1"] });
    return;
  }
  if (req.method !== "POST" || req.url !== endpoint) {
    respond(res, 404, { code: "NOT_FOUND", error: "Not found" });
    return;
  }
  if (!authorized(req)) { respond(res, 401, { code: "UNAUTHORIZED", error: "Unauthorized" }); return; }
  if (busy) { respond(res, 429, { code: "UNIVERSAL_WORKER_BUSY", error: "Worker busy" }); return; }
  busy = true;
  const startedAt = Date.now();
  let packageId = "unknown";
  try {
    const input = await readInput(req);
    packageId = input.request.packageId;
    console.info(JSON.stringify({ event: "universal_generation_started", packageId, count: input.count }));
    const batch = await execute(input);
    if (!Array.isArray(batch?.questions) || batch.questions.length !== input.count ||
        batch.packageId !== packageId || !["quant-v4", "reasoning-v1", "language-v1", "knowledge-v1"].includes(batch.engineId)) {
      throw Object.assign(new Error("Incomplete or mismatched batch"), { statusCode: 422, code: "UNIVERSAL_GENERATION_INCOMPLETE_BATCH" });
    }
    console.info(JSON.stringify({ event: "universal_generation_finished", packageId, count: input.count, durationMs: Date.now()-startedAt }));
    respond(res, 200, { ok: true, batch });
  } catch (error) {
    const status = Number(error?.statusCode);
    const safeStatus = Number.isInteger(status) && status >= 400 && status < 600 ? status : 500;
    console.error(JSON.stringify({ event: "universal_generation_failed", packageId, code: error?.code ?? "UNIVERSAL_GENERATION_FAILED" }));
    respond(res, safeStatus, {
      ok: false, code: error?.code ?? "UNIVERSAL_GENERATION_FAILED",
      error: String(error?.message ?? "Generation failed"),
    });
  } finally {
    busy = false;
  }
});
server.requestTimeout = 135_000;
server.headersTimeout = 10_000;
server.listen(port, "0.0.0.0", () =>
  console.info(JSON.stringify({ event: "universal_worker_ready", port: server.address().port })));
