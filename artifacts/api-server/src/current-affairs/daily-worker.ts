import { sqlClient } from "../lib/db";
import {
  runDailyDraftGeneration,
  runScheduledIntelligenceProcessing,
} from "./daily-orchestration";
import { shouldBuildDailyDrafts } from "./orchestration-policy";

async function main() {
  const now = new Date();
  const intelligence = await runScheduledIntelligenceProcessing(now);
  const daily = shouldBuildDailyDrafts(now)
    ? await runDailyDraftGeneration(now)
    : null;
  process.stdout.write(`${JSON.stringify({ intelligence, daily })}\n`);
}

main()
  .catch((error) => {
    console.error("Current Affairs daily orchestration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
