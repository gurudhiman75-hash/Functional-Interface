import { sqlClient } from "../lib/db";
import { runSourceIndependentAuthoring } from "./authoring-runtime";
import {
  runDailyDraftGeneration,
  runScheduledIntelligenceProcessing,
} from "./daily-orchestration";
import { reconcilePrimaryEnrichedEvents } from "./enriched-event-reconciliation";
import { runCurrentAffairsLocalization } from "./localization-runtime";
import { holdManualAuthorityEventsForReview } from "./manual-enrichment-guard";
import { shouldBuildDailyDrafts } from "./orchestration-policy";

async function main() {
  const now = new Date();
  const manualAuthority = await holdManualAuthorityEventsForReview(100);
  const enrichedEvents = await reconcilePrimaryEnrichedEvents(100);
  const intelligence = await runScheduledIntelligenceProcessing(now);
  const authoring = await runSourceIndependentAuthoring(200);
  const localization = await runCurrentAffairsLocalization(200);
  const daily = shouldBuildDailyDrafts(now)
    ? await runDailyDraftGeneration(now)
    : null;
  process.stdout.write(`${JSON.stringify({ manualAuthority, enrichedEvents, intelligence, authoring, localization, daily })}\n`);
}

main()
  .catch((error) => {
    console.error("Current Affairs daily orchestration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
