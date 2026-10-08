// Standalone, scale-to-zero TRG-002 compute service. No DB, auth SDK, or API imports.
// Intended for Cloud Run with 2 GiB memory, concurrency=1 and min instances=0.
import { createHash, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { Worker } from "node:worker_threads";

const token = process.env.QUESTION_STUDIO_WORKER_TOKEN;
if (!token || token.length < 32) {
  throw new Error("QUESTION_STUDIO_WORKER_TOKEN must be a secret of at least 32 characters");
}
const expectedTokenHash = createHash("sha256").update(token).digest();
const port = Number(process.env.PORT ?? "8080");
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("Invalid PORT");
const workerFile = new URL("./question-studio-trg002-worker.mjs", import.meta.url);
const workerTimeoutMs = 120_000;
const maxBodyBytes = 64 * 1024;
const allowedCpIds = new Set(["TRG-CP-007", "TRG-CP-008", "TRG-CP-009", "TRG-CP-010"]);
let busy = false;

function send(res, status, value) {
  if (res.destroyed) return;
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(value));
}

function authorized(req) {
  const supplied = req.headers["x-examtree-worker-token"];
  if (typeof supplied !== "string") return false;
  const actualHash = createHash("sha256").update(supplied).digest();
  return timingSafeEqual(expectedTokenHash, actualHash);
}

async function readInput(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.byteLength;
    if (bytes > maxBodyBytes) {
      const error = new Error("Worker request too large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON");
    error.statusCode = 400;
    throw error;
  }
  const count = body?.count;
  const cps = body?.selectedCpIds;
  if (!Number.isInteger(count) || count < 1 || count > 50 ||
      body?.request?.packageId !== "TRG-002" ||
      body?.request?.engineId !== "quant-v4" ||
      body?.request?.count !== count ||
      !Array.isArray(cps) || cps.length > count ||
      cps.some((cp) => !allowedCpIds.has(cp)) ||
      !["en", "hi", "pa"].includes(body?.request?.language) ||
      !["Easy", "Medium", "Hard", "Mixed"].includes(body?.request?.difficulty)) {
    const error = new Error("Invalid TRG-002 generation request");
    error.statusCode = 400;
    throw error;
  }
  return body;
}

function runWorker(input) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerFile, { workerData: input });
    let settled = false;
    const settle = (error, batch) => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      void worker.terminate();
      if (error) reject(error);
      else resolve(batch);
    };
    const deadline = setTimeout(() => {
      const error = new Error("TRG-002 computation timed out");
      error.code = "TRG002_WORKER_TIMEOUT";
      error.statusCode = 503;
      settle(error);
    }, workerTimeoutMs);
    worker.once("message", (message) => {
      if (message?.ok && message.batch) settle(null, message.batch);
      else {
        const error = new Error(message?.error?.message || "TRG-002 generation failed");
        error.code = message?.error?.code || "TRG002_GENERATION_FAILED";
        error.statusCode = message?.error?.statusCode || 422;
        settle(error);
      }
    });
    worker.once("error", (error) => settle(error));
    worker.once("exit", (code) => {
      if (code !== 0) {
        const error = new Error("TRG-002 worker exited: " + code);
        error.code = "TRG002_WORKER_EXIT";
        error.statusCode = 503;
        settle(error);
      }
    });
  });
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    send(res, 200, { status: "ok", busy });
    return;
  }
  if (req.method !== "POST" || req.url !== "/internal/trg002/generate") {
    send(res, 404, { error: "Not found" });
    return;
  }
  if (!authorized(req)) {
    send(res, 401, { error: "Unauthorized" });
    return;
  }
  if (busy) {
    send(res, 429, { error: "Generation worker busy", code: "TRG002_WORKER_BUSY" });
    return;
  }

  // Set the lock before reading the body. Never run two heavy generators here.
  busy = true;
  const started = Date.now();
  try {
    const input = await readInput(req);
    console.log(JSON.stringify({ event: "generation_started", count: input.count, rssBytes: process.memoryUsage().rss }));
    const batch = await runWorker(input);
    if (!batch || !Array.isArray(batch.questions) || batch.questions.length !== input.count) {
      const error = new Error("Incomplete generation batch");
      error.statusCode = 422;
      error.code = "TRG002_GENERATION_COUNT_MISMATCH";
      throw error;
    }
    console.log(JSON.stringify({ event: "generation_finished", count: input.count, elapsedMs: Date.now() - started, rssBytes: process.memoryUsage().rss }));
    send(res, 200, { ok: true, batch });
  } catch (caught) {
    const status = Number(caught?.statusCode);
    const statusCode = Number.isInteger(status) && status >= 400 && status <= 599 ? status : 500;
    console.error(JSON.stringify({ event: "generation_failed", code: caught?.code ?? "TRG002_WORKER_FAILED", elapsedMs: Date.now() - started, rssBytes: process.memoryUsage().rss }));
    send(res, statusCode, { ok: false, error: String(caught?.message ?? "Worker failed"), code: caught?.code ?? "TRG002_WORKER_FAILED" });
  } finally {
    busy = false;
  }
});
server.requestTimeout = 135_000;
server.headersTimeout = 10_000;
server.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({ event: "worker_ready", port: server.address().port }));
});
