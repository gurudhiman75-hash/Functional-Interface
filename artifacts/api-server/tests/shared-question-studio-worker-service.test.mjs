import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import test from "node:test";

const service = fileURLToPath(new URL("../shared-question-studio-worker-service.mjs", import.meta.url));
const secret = "a-long-test-only-shared-worker-token-not-for-production";

async function startServer() {
  const proc = spawn(process.execPath, [service], {
    env: { ...process.env, PORT: "0", QUESTION_STUDIO_WORKER_TOKEN: secret },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let printed = "";
  const port = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Worker startup timeout: " + printed)), 5000);
    proc.once("exit", (code) => { clearTimeout(timeout); reject(new Error("Worker exited: " + code)); });
    proc.stdout.on("data", (data) => {
      printed += data.toString();
      for (const line of printed.split("\n")) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.event === "worker_ready") {
            clearTimeout(timeout);
            resolve(parsed.port);
          }
        } catch {}
      }
    });
  });
  return { proc, url: "http://127.0.0.1:" + port };
}

test("shared worker fails closed for unauthorized and unknown generation packages", async () => {
  const { proc, url } = await startServer();
  const post = (value, withToken = true) => fetch(url + "/internal/question-studio/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(withToken ? { "X-Examtree-Worker-Token": secret } : {}) },
    body: JSON.stringify(value),
  });
  try {
    const health = await (await fetch(url + "/health")).json();
    assert.equal(health.status, "ok");
    assert.deepEqual(health.packages, ["TRG-002", "NUM-001"]);
    assert.equal((await post({ count: 1 }, false)).status, 401);
    const invalid = await post({ request: { packageId: "SYL-001", engineId: "reasoning-v1", count: 1 }, selectedCpIds: [], count: 1 });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).code, "INVALID_SHARED_GENERATION_REQUEST");
    const wrongCp = await post({ request: { packageId: "NUM-001", engineId: "quant-v4", language: "en", difficulty: "Mixed", count: 1 }, selectedCpIds: ["TRG-CP-007"], count: 1 });
    assert.equal(wrongCp.status, 400);
    const wrongLang = await post({ request: { packageId: "NUM-001", engineId: "quant-v4", language: "hi", difficulty: "Mixed", count: 1 }, selectedCpIds: ["NUM-CP-003"], count: 1 });
    assert.equal(wrongLang.status, 400);
    const wrongMode = await post({ request: { packageId: "NUM-001", engineId: "quant-v4", language: "en", difficulty: "Mixed", runtimeMode: "RELEASED", count: 1 }, selectedCpIds: ["NUM-CP-001"], count: 1 });
    assert.equal(wrongMode.status, 400);
    assert.equal((await (await fetch(url + "/health")).json()).busy, false);
    assert.equal((await fetch(url + "/internal/unknown")).status, 404);
  } finally {
    proc.kill();
    await once(proc, "exit").catch(() => undefined);
  }
});
