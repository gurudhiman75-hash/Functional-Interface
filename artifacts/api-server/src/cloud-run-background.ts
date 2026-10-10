// Single bounded invocation for Cloud Run Jobs / Cloud Scheduler.
// Running this outside an HTTP process avoids request-throttled background
// timers. The scheduled job must not be activated until the Render loops are
// decommissioned, otherwise campaigns could be claimed by both runtimes.
import "dotenv/config";
import { runOutboxPublisherOnce } from "./lib/outbox-publisher";
import { runMobileNotificationDelivery } from "./lib/mobile-notification-delivery";
import { sqlClient } from "./lib/db";
import { logger } from "./lib/logger";

if (process.env.EXAMTREE_API_RUNTIME !== "cloud-run") {
  throw new Error("Cloud Run background job requires EXAMTREE_API_RUNTIME=cloud-run");
}

try {
  await runOutboxPublisherOnce();
  for (let i = 0; i < 5; i++) {
    const result = await runMobileNotificationDelivery();
    logger.info({ status: result.status }, "Cloud Run scheduled notification iteration");
    if (result.status === "failed") throw new Error("Notification campaign delivery failed");
    if (result.status === "provider_unavailable") throw new Error("Firebase Messaging provider unavailable");
    if (result.status === "idle") break;
  }
} finally {
  await sqlClient.end({ timeout: 5 });
}
