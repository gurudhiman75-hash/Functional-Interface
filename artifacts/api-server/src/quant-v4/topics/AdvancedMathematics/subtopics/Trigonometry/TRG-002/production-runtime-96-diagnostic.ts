import { TRG_002_PRODUCTION_EXPANSION_48_IDS } from "./production-96-registry";
import { generateTrg002Production96Question } from "./production-runtime-96";

function escapeWorkflowMessage(value: string) {
  return value
    .replace(/%/g, "%25")
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A");
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

const failures = new Map<string, { qlId: string; seed: string; message: string }>();
const roleSeeds = TRG_002_PRODUCTION_EXPANSION_48_IDS.map((qlId, index) => ({
  qlId,
  seed: `trg002-production-expansion-role-${String(index + 1).padStart(2, "0")}`,
}));
const sweepSeeds = Array.from({ length: 12 }, (_, index) => `trg002-production-sweep-${String(index + 1).padStart(2, "0")}`);

for (const { qlId, seed } of roleSeeds) {
  try {
    generateTrg002Production96Question(qlId, seed);
  } catch (error) {
    const message = errorMessage(error);
    failures.set(`${qlId}|${message}`, { qlId, seed, message });
  }
}

for (const qlId of TRG_002_PRODUCTION_EXPANSION_48_IDS) {
  for (const seed of sweepSeeds) {
    try {
      generateTrg002Production96Question(qlId, seed);
    } catch (error) {
      const message = errorMessage(error);
      failures.set(`${qlId}|${message}`, { qlId, seed, message });
    }
  }
}

if (failures.size > 0) {
  for (const failure of failures.values()) {
    console.error(`::error title=TRG-002 ${failure.qlId} generator::${escapeWorkflowMessage(`${failure.message} [seed=${failure.seed}]`)}`);
  }
  console.error(`::error title=TRG-002 Phase 8 generator preflight::${failures.size} distinct expansion generator failure(s) detected.`);
  process.exitCode = 1;
} else {
  try {
    await import("./production-runtime-96.test");
  } catch (error) {
    const message = error instanceof Error
      ? `${error.message}${error.stack ? ` | ${error.stack.split("\n").slice(1, 4).join(" | ")}` : ""}`
      : String(error);
    console.error(`::error title=TRG-002 Phase 8 runtime gate::${escapeWorkflowMessage(message)}`);
    process.exitCode = 1;
  }
}
