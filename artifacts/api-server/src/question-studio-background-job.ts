import { sqlClient } from "./lib/db";
import { drainBackgroundBatches } from "./question-studio/background-batch-worker";

try {
  await drainBackgroundBatches();
} catch (error) {
  console.error("Question Studio background batch job failed", error);
  process.exitCode = 1;
} finally {
  await sqlClient.end({ timeout: 5 });
}
