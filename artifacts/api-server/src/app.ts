import express, { type Express } from "express";
import cors, { type CorsOptions } from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./lib/logger";
import billingWebhookHandler from "./routes/billing-webhook";
import adminCurrentAffairsProductionOpsRouter from "./routes/admin-current-affairs-production-ops";
import adminCurrentAffairsEditorialActivationRouter from "./routes/admin-current-affairs-editorial-activation";
import adminCurrentAffairsSelectedProcessingRouter from "./routes/admin-current-affairs-selected-processing";
import adminCurrentAffairsPackEditorialRouter from "./routes/admin-current-affairs-pack-editorial";
import adminSessionRouter from "./routes/admin-session";
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

// Lightweight admin bootstrap stays outside the large legacy router. The admin
// shell calls this before rendering any workspace; keeping it here prevents a
// Current Affairs visit from importing every legacy route and content registry.
app.use("/api/admin/session", adminRequestObservability, adminSessionRouter);

// Production-activation mounts stay separate from the large legacy router so
// only the validated Current Affairs operations and bounded editorial surfaces
// are exposed here.
app.use("/api/admin/current-affairs", adminRequestObservability, adminCurrentAffairsProductionOpsRouter);
app.use("/api/admin/current-affairs", adminRequestObservability, adminCurrentAffairsEditorialActivationRouter);
app.use("/api/admin/current-affairs", adminRequestObservability, adminCurrentAffairsSelectedProcessingRouter);
app.use("/api/admin/current-affairs", adminRequestObservability, adminCurrentAffairsPackEditorialRouter);

// The legacy API router pulls in Question Studio generators and large static
// content registries. Keep it out of the startup path so Render can bind /health
// within the 512 MiB service envelope. The router is loaded once, on the first
// request that actually needs the legacy API surface.
let legacyRouterPromise: Promise<typeof import("./routes").default> | null = null;
function loadLegacyRouter() {
  legacyRouterPromise ??= import("./routes").then((module) => module.default);
  return legacyRouterPromise;
}

app.use("/api", adminRequestObservability, (req, res, next) => {
  void loadLegacyRouter()
    .then((legacyRouter) => legacyRouter(req, res, next))
    .catch(next);
});

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
