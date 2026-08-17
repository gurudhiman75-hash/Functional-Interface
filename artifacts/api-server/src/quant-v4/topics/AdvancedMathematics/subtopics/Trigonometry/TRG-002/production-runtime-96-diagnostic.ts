function escapeWorkflowMessage(value: string) {
  return value
    .replace(/%/g, "%25")
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A");
}

try {
  await import("./production-runtime-96.test");
} catch (error) {
  const message = error instanceof Error
    ? `${error.message}${error.stack ? ` | ${error.stack.split("\n").slice(1, 4).join(" | ")}` : ""}`
    : String(error);
  console.error(`::error title=TRG-002 Phase 8 runtime gate::${escapeWorkflowMessage(message)}`);
  process.exitCode = 1;
}
