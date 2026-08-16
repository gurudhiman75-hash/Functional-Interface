import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";
import { validateAIProviderStartup } from "./lib/ai-providers";

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

app.listen(port, "0.0.0.0", () => {
  logger.info(`API server running on http://0.0.0.0:${port}`);

  // The generation worker imports the full generation engine. Keep that heavy
  // graph off the critical startup path so Render can bind the web port and
  // serve health checks before background generation code is initialized.
  setImmediate(() => {
    void import("./lib/generation-jobs")
      .then(({ startGenerationJobWorker }) => {
        startGenerationJobWorker();
      })
      .catch((error) => {
        logger.error({ error }, "Generation job worker failed to initialize");
      });
  });
});
