// Production-mode Cloud Run API startup check with intentionally UNREACHABLE
// local PostgreSQL and NO AI provider secrets. This exercises the compiled
// Express entrypoint and verifies /health binds before Neon reconciliation.
// It must not access the live Neon DB, Firebase data or Cashfree.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const host = "127.0.0.1";
const port = await new Promise((resolve, reject) => {
  const s = createServer();
  s.once("error", reject);
  s.listen(0, host, () => {
    const p = s.address()?.port;
    s.close(error => error ? reject(error) : resolve(p));
  });
});
const env = { ...process.env };
for (const key of [
  "OPENAI_API_KEY", "DEEPSEEK_API_KEY", "GEMINI_API_KEY",
  "GOOGLE_API_KEY", "ANTHROPIC_API_KEY", "AI_EXTRACTION_PROVIDER",
  "AI_EXTRACTION_REQUIRED", "OPENAI_EXTRACTION_REQUIRED",
  "FIREBASE_SERVICE_ACCOUNT_KEY", "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
]) delete env[key];
Object.assign(env, {
  NODE_ENV: "production",
  EXAMTREE_API_RUNTIME: "cloud-run",
  EXAMTREE_CLOUDRUN_STAGING: "true",
  PORT: String(port),
  FIREBASE_PROJECT_ID: "sarbedutech",
  FIREBASE_STORAGE_BUCKET: "sarbedutech.firebasestorage.app",
  DATABASE_URL: "postgresql://example:example@127.0.0.1:1/no_database",
  GENERATION_JOB_WORKER_ENABLED: "false",
  OUTBOX_PUBLISHER_ENABLED: "false",
});
const child = spawn(process.execPath, [
  "--import=" + path.join(root, "artifacts/api-server/cloud-run-preload.mjs"),
  path.join(root, "artifacts/api-server/dist/index.mjs"),
], {cwd: root, env, stdio: ["ignore", "pipe", "pipe"]});
let output = "";
for (const stream of [child.stdout, child.stderr]) {
  stream.on("data", bytes => { output = (output + bytes.toString()).slice(-14000); });
}
let exit = null;
child.once("exit", (code, signal) => { exit = { code, signal }; });
const deadline = Date.now() + 25000;
let passed = false;
try {
  while (Date.now() < deadline) {
    if (exit) throw new Error("API exited before binding (code=" + exit.code + ")\n" + output);
    try {
      const response = await fetch("http://" + host + ":" + port + "/health", {
        signal: AbortSignal.timeout(1500),
      });
      const body = await response.json();
      assert.equal(response.status, 200);
      assert.equal(body.status, "ok");
      passed = true;
      break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  if (!passed) throw new Error("API failed to bind within 25s\n" + output);
  console.log("PASS: production-mode Cloud Run HTTP /health binds with no AI key and unreachable Neon");
} finally {
  child.kill("SIGTERM");
  await Promise.race([
    new Promise(resolve => child.once("exit", resolve)),
    new Promise(resolve => setTimeout(resolve, 1200)),
  ]);
  if (!child.killed) child.kill("SIGKILL");
}
