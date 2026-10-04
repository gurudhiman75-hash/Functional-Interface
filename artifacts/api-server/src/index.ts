
import "dotenv/config";
import app from "./app";
import { startGenerationJobWorker } from "./lib/generation-jobs";
import { startMobileNotificationWorker } from "./lib/mobile-notification-delivery";
import { logger } from "./lib/logger";
import { validateAIProviderStartup } from "./lib/ai-providers";
import { ensureApprovedExamCatalogue } from "./lib/approved-exam-catalogue";

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

await ensureApprovedExamCatalogue().catch((error) => {
  logger.error({ error }, "Unable to ensure approved exam catalogue during startup");
});

startGenerationJobWorker();
startMobileNotificationWorker();

app.listen(port, "0.0.0.0", () => {
  logger.info(`API server running on http://0.0.0.0:${port}`);
});
