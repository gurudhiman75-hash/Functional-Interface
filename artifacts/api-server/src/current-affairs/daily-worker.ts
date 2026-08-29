import { sqlClient } from "../lib/db";
import { runSourceIndependentAuthoring } from "./authoring-runtime";
import {
  runDailyDraftGeneration,
  runScheduledIntelligenceProcessing,
} from "./daily-orchestration";
import { reconcilePrimaryEnrichedEvents } from "./enriched-event-reconciliation";
import {
  createLocalizedDailyCompilations,
  runCurrentAffairsLocalization,
} from "./localization-runtime";
import { holdManualAuthorityEventsForReview } from "./manual-enrichment-guard";
import { previousIndiaDate, shouldBuildDailyDrafts } from "./orchestration-policy";
import { runCurrentAffairsQuestionLocalization } from "./question-localization-runtime";

const DAILY_EXAM_FAMILIES = ["ssc", "banking", "punjab"] as const;

async function main() {
  const now = new Date();
  const manualAuthority = await holdManualAuthorityEventsForReview(100);
  const enrichedEvents = await reconcilePrimaryEnrichedEvents(100);
  const intelligence = await runScheduledIntelligenceProcessing(now);
  const authoring = await runSourceIndependentAuthoring(200);
  const localization = await runCurrentAffairsLocalization(200);
  const localizedDaily = await createLocalizedDailyCompilations(previousIndiaDate(now), DAILY_EXAM_FAMILIES);
  const daily = shouldBuildDailyDrafts(now)
    ? await runDailyDraftGeneration(now)
    : null;
  const questionLocalization = await runCurrentAffairsQuestionLocalization(500);
  process.stdout.write(`${JSON.stringify({
    manualAuthority,
    enrichedEvents,
    intelligence,
    authoring,
    localization,
    localizedDaily,
    daily,
    questionLocalization,
  })}\n`);
}

main()
  .catch((error) => {
    console.error("Current Affairs daily orchestration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sqlClient.end({ timeout: 5 });
  });
