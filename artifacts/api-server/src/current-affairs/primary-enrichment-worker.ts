import { sqlClient } from "../lib/db";
import { runScheduledPrimaryFactEnrichment } from "./primary-enrichment";

async function main() {
  const result = await runScheduledPrimaryFactEnrichment(new Date(), 50);
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

main()
  .catch((error) => {
    console.error("Current Affairs primary-source fact enrichment failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
