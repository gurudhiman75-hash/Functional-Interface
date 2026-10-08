import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const service = fileURLToPath(new URL("../trg002-worker-service.mjs", import.meta.url));
const secret = "test-only-long-random-string-for-worker-contract-validation";
const startServer = async () => {
  const child = spawn(process.execPath, [service], {
    env: { ...process.env, PORT: "0", QUESTION_STUDIO_WORKER_TOKEN: secret },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  const port = await new Promise((resolve, reject) => {
    const deadline = setTimeout(() => reject(new Error("Worker service start timeout: " + output)), 5000);
    child.once("exit", (code) => { clearTimeout(deadline); reject(new Error("Worker service exited: " + code)); });
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
      for (const line of output.split("\n")) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.event === "worker_ready") {
            clearTimeout(deadline);
            resolve(parsed.port);
          }
        } catch {}
      }
    });
  });
  return { child, url: "http://127.0.0.1:" + port };
};

test("TRG-002 compute service rejects public/unauthenticated generation and invalid inputs", async () => {
  const { child, url } = await startServer();
  try {
    const health = await fetch(url + "/health");
    assert.equal(health.status, 200);
    assert.equal((await health.json()).status, "ok");
    const unauthorized = await fetch(url + "/internal/trg002/generate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 1 }),
    });
    assert.equal(unauthorized.status, 401);
    const invalid = await fetch(url + "/internal/trg002/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Examtree-Worker-Token": secret },
      body: JSON.stringify({ count: 1, request: { packageId: "ANOTHER_PACKAGE", engineId: "quant-v4", count: 1 }, selectedCpIds: [] }),
    });
    assert.equal(invalid.status, 400);
    const recovered = await fetch(url + "/health");
    assert.equal((await recovered.json()).busy, false);
    const missing = await fetch(url + "/internal/unknown", { method: "POST" });
    assert.equal(missing.status, 404);
  } finally {
    child.kill();
    await once(child, "exit").catch(() => undefined);
  }
});
