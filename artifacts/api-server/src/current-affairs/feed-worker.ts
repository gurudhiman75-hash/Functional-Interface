import { runScheduledFeedIngestion } from "./automation";
import { sqlClient } from "../lib/db";

async function main() {
  const result = await runScheduledFeedIngestion(new Date());
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (!result.skipped && "status" in result && result.status === "failed") {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error("Current Affairs scheduled feed ingestion failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
