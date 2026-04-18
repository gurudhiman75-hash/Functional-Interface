import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import billingWebhookHandler from "./routes/billing-webhook";
import { webhookRateLimit } from "./middlewares/rateLimit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  }),
);
app.post("/api/billing/webhook", express.raw({ type: "application/json" }), webhookRateLimit, billingWebhookHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", router);

// ── Serve frontend static files ───────────────────────────────────────────────
// In production, serve the built Vite output so one Render service handles both.
if (process.env.NODE_ENV === "production") {
  const staticDir = path.resolve(__dirname, "../../examtree/dist/public");
  app.use(express.static(staticDir));
  // SPA fallback: all non-API routes return index.html
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
