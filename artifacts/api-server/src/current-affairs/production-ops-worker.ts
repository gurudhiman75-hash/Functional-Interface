import { sqlClient } from "../lib/db";
import { runCurrentAffairsProductionRecovery } from "./production-recovery-runtime";
import { loadCurrentAffairsProductionReadiness } from "./production-readiness-runtime";

async function main() {
  const now = new Date();
  const before = await loadCurrentAffairsProductionReadiness(now);
  const recovery = await runCurrentAffairsProductionRecovery({ now, triggerMode: "scheduled" });
  const after = await loadCurrentAffairsProductionReadiness(new Date());
  process.stdout.write(`${JSON.stringify({ before: before.evaluation, recovery, after: after.evaluation })}\n`);
}

main()
  .catch((error) => {
    console.error("Current Affairs production operations recovery failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
