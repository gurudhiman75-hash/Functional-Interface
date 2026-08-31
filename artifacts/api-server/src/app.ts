import express, { type Express } from "express";
import cors, { type CorsOptions } from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import billingWebhookHandler from "./routes/billing-webhook";
import adminCurrentAffairsProductionOpsRouter from "./routes/admin-current-affairs-production-ops";
import adminCurrentAffairsEditorialActivationRouter from "./routes/admin-current-affairs-editorial-activation";
import { webhookRateLimit } from "./middlewares/rateLimit";
import { adminRequestObservability } from "./middlewares/admin-request-observability";

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
const localhostOriginPattern = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/;
const defaultAllowedOrigins = [
  "https://examtree-new.onrender.com",
  "https://sarbedutech.web.app",
  "https://sarbedutech.firebaseapp.com",
  "https://examtree.in",
  "https://www.examtree.in",
];
const configuredAllowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([
  ...defaultAllowedOrigins,
  ...configuredAllowedOrigins,
]);
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || localhostOriginPattern.test(origin) || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Examtree-Device", "X-Correlation-Id"],
  exposedHeaders: ["X-Correlation-Id"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("/api/{*splat}", cors(corsOptions));
app.post("/api/billing/webhook", express.raw({ type: "application/json" }), webhookRateLimit, billingWebhookHandler);

app.use(
  express.json({
    limit: "25mb",
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "25mb",
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Production-activation mounts stay separate from the large legacy router so
// only the validated Current Affairs operations and bounded editorial surfaces
// are exposed here.
app.use("/api/admin/current-affairs", adminRequestObservability, adminCurrentAffairsProductionOpsRouter);
app.use("/api/admin/current-affairs", adminRequestObservability, adminCurrentAffairsEditorialActivationRouter);
app.use("/api", adminRequestObservability, router);

// ── Serve frontend static files ───────────────────────────────────────────────
// In production, serve both built Vite applications so one Render service can
// handle the student site, the complete admin panel, and the API.
if (process.env.NODE_ENV === "production") {
  const staticDir = path.resolve(__dirname, "../../examtree/dist/public");
  const studentIndex = path.join(staticDir, "index.html");
  const adminIndex = path.join(staticDir, "admin", "index.html");

  app.use(express.static(staticDir));

  // React Router owns every deep admin URL below /admin. Return the dedicated
  // admin document instead of the student SPA document on direct navigation.
  app.get(/^\/admin(?:\/.*)?$/, (_req, res) => {
    res.sendFile(adminIndex);
  });

  // Student SPA fallback for all remaining non-API routes.
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(studentIndex);
  });
}

export default app;
