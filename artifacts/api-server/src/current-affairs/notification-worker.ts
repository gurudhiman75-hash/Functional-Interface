import { sqlClient } from "../lib/db";
import { runScheduledCurrentAffairsNotifications } from "./notification-runtime";

async function main() {
  const result = await runScheduledCurrentAffairsNotifications(new Date());
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if ("status" in result && result.status === "failed") process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error("Current Affairs in-app notification scheduler failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
