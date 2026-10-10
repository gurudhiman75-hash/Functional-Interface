
import "dotenv/config";
import app from "./app";
import { startGenerationJobWorker } from "./lib/generation-jobs";
import { startMobileNotificationWorker } from "./lib/mobile-notification-delivery";
import { startOutboxPublisher } from "./lib/outbox-publisher";
import { logger } from "./lib/logger";
import { validateAIProviderStartup } from "./lib/ai-providers";
import { ensureApprovedExamCatalogue } from "./lib/approved-exam-catalogue";
import { ensureApprovedExamTestSeries } from "./lib/approved-test-series-catalogue";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

validateAIProviderStartup();

// Cloud Run must bind PORT promptly. Running Neon writes on every autoscaled
// replica startup adds network latency, startup failures and duplicate writes.
// The separate, review-gated schema/catalogue bootstrap owns these writes.
// Retain Render's original startup behavior for rollback compatibility.
if (process.env.EXAMTREE_API_RUNTIME === "cloud-run") {
  logger.info("Cloud Run API: catalogue bootstrapping skipped; run the approved out-of-band bootstrap");
} else {
  await ensureApprovedExamCatalogue().catch((error) => {
    logger.error({ error }, "Unable to ensure approved exam catalogue during startup");
  });
  await ensureApprovedExamTestSeries().catch((error) => {
    logger.error({ error }, "Unable to ensure approved exam test series during startup");
  });
}

// This legacy pattern-generation poller executes heavyweight work inside the
// API process. Keep it disabled on the 512 MiB production API by default.
// Deploy it as a separate worker and opt in with GENERATION_JOB_WORKER_ENABLED=true.
if (process.env.NODE_ENV !== "production" || process.env.GENERATION_JOB_WORKER_ENABLED === "true") {
  startGenerationJobWorker();
} else {
  logger.info("Legacy generation-job worker disabled in production API");
}
// Cloud Run request-based CPU stops outside incoming requests. Run background
// work via a separately scheduled Cloud Run Job, not timers in the API replica.
// Other environments retain the established always-on worker behavior.
if (process.env.EXAMTREE_API_RUNTIME === "cloud-run") {
  logger.info("Cloud Run API: in-process notification and outbox polling disabled; use the scheduled background job");
} else {
  startMobileNotificationWorker();
  startOutboxPublisher();
}

app.listen(port, "0.0.0.0", () => {
  logger.info(`API server running on http://0.0.0.0:${port}`);
});
