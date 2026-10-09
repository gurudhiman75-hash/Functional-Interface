// Shared isolated Question Studio compute. No database, Firebase, or admin
// credentials. Chapter-specific worker bundles are explicitly allowlisted.
import { createHash, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { Worker } from "node:worker_threads";

const token = process.env.QUESTION_STUDIO_WORKER_TOKEN;
if (!token || token.length < 32) throw new Error("Missing QUESTION_STUDIO_WORKER_TOKEN (min 32 characters)");
const tokenHash = createHash("sha256").update(token).digest();
const port = Number(process.env.PORT ?? 8080);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("Invalid port");
const maxBodyBytes = 64 * 1024;
const maxResponseBytes = 16 * 1024 * 1024;
const timeoutMs = 120_000;
const workers = Object.freeze({
  "TRG-002": new URL("./question-studio-trg002-worker.mjs", import.meta.url),
  "NUM-001": new URL("./question-studio-num001-worker.mjs", import.meta.url),
});
const cpByPackage = Object.freeze({
  "TRG-002": new Set(["TRG-CP-007", "TRG-CP-008", "TRG-CP-009", "TRG-CP-010"]),
  "NUM-001": new Set(["NUM-CP-001", "NUM-CP-003", "NUM-CP-004"]),
});
let busy = false;

function reply(res, status, data) {
  if (res.destroyed) return;
  const raw = JSON.stringify(data);
  if (Buffer.byteLength(raw) > maxResponseBytes) {
    res.writeHead(502, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end('{"ok":false,"code":"WORKER_RESPONSE_TOO_LARGE","error":"Response exceeded safety limit"}');
    return;
  }
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(raw);
}

function authorized(req) {
  const supplied = req.headers["x-examtree-worker-token"];
  if (typeof supplied !== "string") return false;
  return timingSafeEqual(tokenHash, createHash("sha256").update(supplied).digest());
}

async function readRequest(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.byteLength;
    if (bytes > maxBodyBytes) {
      throw Object.assign(new Error("Worker request exceeds size limit"), { statusCode: 413, code: "WORKER_BODY_TOO_LARGE" });
    }
    chunks.push(chunk);
  }
  let body;
  try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw Object.assign(new Error("Invalid JSON body"), { statusCode: 400, code: "INVALID_JSON" }); }
  const pkg = body?.request?.packageId;
  const cps = body?.selectedCpIds;
  const valid = typeof body === "object"
    && Object.hasOwn(workers, pkg)
    && Number.isInteger(body.count) && body.count >= 1 && body.count <= 50
    && body.request?.count === body.count
    && body.request?.engineId === "quant-v4"
    && ["en", "hi", "pa"].includes(body.request?.language)
    && ["Easy", "Medium", "Hard", "Mixed"].includes(body.request?.difficulty)
    && Array.isArray(cps) && cps.length <= body.count
    && new Set(cps).size === cps.length
    && cps.every((cp) => cpByPackage[pkg]?.has(cp))
    && (pkg !== "NUM-001" || (
      (!body.request?.runtimeMode || body.request.runtimeMode === "QUESTION_STUDIO_ACTIVE")
      && (body.request.language === "en" || cps.every((cp) => cp === "NUM-CP-001"))
    ));
  if (!valid) throw Object.assign(new Error("Unsupported Question Studio package or CP selection"), {
    statusCode: 400, code: "INVALID_SHARED_GENERATION_REQUEST",
  });
  return body;
}

function execute(file, input) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(file, { workerData: input });
    let settled = false;
    const finish = (error, batch) => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      void worker.terminate();
      if (error) reject(error);
      else resolve(batch);
    };
    const deadline = setTimeout(() => finish(Object.assign(new Error("Worker timed out"), {
      statusCode: 503, code: "SHARED_WORKER_TIMEOUT",
    })), timeoutMs);
    worker.once("message", (message) => {
      if (message?.ok && message.batch) finish(null, message.batch);
      else finish(Object.assign(new Error(message?.error?.message || "Chapter generation failed"), {
        statusCode: message?.error?.statusCode || 422,
        code: message?.error?.code || "SHARED_WORKER_GENERATION_FAILED",
      }));
    });
    worker.once("error", (error) => finish(error));
    worker.once("exit", (code) => {
      if (code !== 0) finish(Object.assign(new Error("Chapter worker exited unexpectedly"), {
        statusCode: 503, code: "SHARED_WORKER_EXIT",
      }));
    });
  });
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    reply(res, 200, { status: "ok", busy, packages: Object.keys(workers) });
    return;
  }
  if (req.method !== "POST" || req.url !== "/internal/question-studio/generate") {
    reply(res, 404, { error: "Not found" });
    return;
  }
  if (!authorized(req)) { reply(res, 401, { error: "Unauthorized" }); return; }
  if (busy) { reply(res, 429, { error: "Worker is busy", code: "SHARED_WORKER_BUSY" }); return; }
  busy = true;
  const started = Date.now();
  let packageId = "unknown";
  try {
    const input = await readRequest(req);
    packageId = input.request.packageId;
    console.info(JSON.stringify({ event: "shared_generation_started", packageId, count: input.count, rssBytes: process.memoryUsage().rss }));
    const batch = await execute(workers[packageId], input);
    if (!Array.isArray(batch?.questions) || batch.questions.length !== input.count || !batch.plan) {
      throw Object.assign(new Error("Incomplete or malformed generation batch"), {
        statusCode: 422, code: "SHARED_WORKER_INCOMPLETE_BATCH",
      });
    }
    console.info(JSON.stringify({ event: "shared_generation_finished", packageId, count: input.count, elapsedMs: Date.now()-started, rssBytes: process.memoryUsage().rss }));
    reply(res, 200, { ok: true, batch });
  } catch (err) {
    const status = Number(err?.statusCode);
    const httpStatus = Number.isInteger(status) && status >= 400 && status < 600 ? status : 500;
    console.error(JSON.stringify({ event: "shared_generation_failed", packageId, code: err?.code || "SHARED_WORKER_ERROR", elapsedMs: Date.now()-started }));
    reply(res, httpStatus, { ok: false, error: String(err?.message || "Worker failed"), code: err?.code || "SHARED_WORKER_ERROR" });
  } finally { busy = false; }
});
server.requestTimeout = 135_000;
server.headersTimeout = 10_000;
server.listen(port, "0.0.0.0", () => console.info(JSON.stringify({ event: "worker_ready", port: server.address().port })));
