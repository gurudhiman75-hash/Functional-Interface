import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const tasks = [
  {
    name: "api",
    command: "pnpm",
    args: ["--dir", "artifacts/api-server", "dev"],
    env: { PORT: "3001", NODE_ENV: "development" },
  },
  {
    name: "web",
    command: "pnpm",
    args: ["--dir", "artifacts/examtree", "dev"],
    env: { PORT: "5173", NODE_ENV: "development" },
  },
];

const children = [];
let shuttingDown = false;

function startTask(task) {
  const child = spawn(task.command, task.args, {
    cwd: repoRoot,
    env: {
      ...process.env,
      ...task.env,
    },
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    console.log(`[${task.name}] exited ${signal ? `with signal ${signal}` : `with code ${code ?? 0}`}`);
    shutdown(code ?? 0);
  });

  child.on("error", (error) => {
    console.error(`[${task.name}] failed to start:`, error);
    shutdown(1);
  });

  children.push(child);
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(exitCode);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Starting local dev servers...");
console.log("API  -> http://localhost:3001");
console.log("Web  -> http://localhost:5173");

for (const task of tasks) {
  startTask(task);
}
