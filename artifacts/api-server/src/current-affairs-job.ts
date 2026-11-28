// Single bounded invocation for the Current Affairs Cloud Run Job.
// CURRENT_AFFAIRS_JOB_MODE=ingest  refreshes sources and primary facts (every 3h).
// CURRENT_AFFAIRS_JOB_MODE=daily   builds yesterday's drafts (once each morning).
// Neither mode publishes to learners: publication stays an admin action.
import "dotenv/config";

import { runScheduledFeedIngestion } from "./current-affairs/automation";
import { runScheduledIntelligenceProcessing } from "./current-affairs/daily-orchestration";
import { generateYesterdayCurrentAffairsOnDemand } from "./current-affairs/on-demand-yesterday-runtime";
import { runCompletedPeriodicRollups } from "./current-affairs/periodic-rollup-runtime";
import { runScheduledPrimaryFactEnrichment } from "./current-affairs/primary-enrichment";
import { consolidateCurrentAffairsPeriodicDrafts } from "./current-affairs/story-rollup-consolidation";
import { sqlClient } from "./lib/db";
import { logger } from "./lib/logger";

if (process.env.EXAMTREE_API_RUNTIME !== "cloud-run") {
  throw new Error("Current Affairs job requires EXAMTREE_API_RUNTIME=cloud-run");
}
const mode = process.env.CURRENT_AFFAIRS_JOB_MODE;
if (mode !== "ingest" && mode !== "daily") {
  throw new Error("CURRENT_AFFAIRS_JOB_MODE must be 'ingest' or 'daily'");
}

try {
  const now = new Date();
  if (mode === "ingest") {
    const ingestion = await runScheduledFeedIngestion(now);
    const enrichment = await runScheduledPrimaryFactEnrichment(now, 50);
    const intelligence = await runScheduledIntelligenceProcessing(now);
    logger.info({ ingestion, enrichment, intelligence }, "Current Affairs ingest pass finished");
    if (!ingestion.skipped && "status" in ingestion && ingestion.status === "failed") {
      process.exitCode = 1;
    }
  } else {
    const daily = await generateYesterdayCurrentAffairsOnDemand(now);
    // Weekly and monthly drafts are only built once their period has completed.
    const periodicRollups = await runCompletedPeriodicRollups(now);
    const consolidation = await consolidateCurrentAffairsPeriodicDrafts(100);
    logger.info(
      { targetDate: daily.targetDate, summary: daily.summary, periodicRollups, consolidation },
      "Current Affairs daily pass finished",
    );
  }
} catch (error) {
  logger.error({ err: error, mode }, "Current Affairs job failed");
  process.exitCode = 1;
} finally {
  await sqlClient.end({ timeout: 5 });
}
