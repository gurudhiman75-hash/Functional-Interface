import express, { type Express, type RequestHandler } from "express";
import cors, { type CorsOptions } from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./lib/logger";
import billingWebhookHandler from "./routes/billing-webhook";
import cashfreeWebhookHandler from "./routes/cashfree-webhook";
import adminSessionRouter from "./routes/admin-session";
import { webhookRateLimit } from "./middlewares/rateLimit";
import { adminRequestObservability } from "./middlewares/admin-request-observability";
import { mountQuestionStudioAsyncTaskReceiver } from "./question-studio/async-task-receiver-mount";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

function lazyRouter(loader: () => Promise<{ default: RequestHandler }>): RequestHandler {
  let routerPromise: Promise<RequestHandler> | null = null;
  return (req, res, next) => {
    routerPromise ??= loader().then((module) => module.default);
    void routerPromise.then((router) => router(req, res, next)).catch(next);
  };
}

const adminCurrentAffairsProductionOpsRouter = lazyRouter(
  () => import("./routes/admin-current-affairs-production-ops"),
);
const adminCurrentAffairsEditorialActivationRouter = lazyRouter(
  () => import("./routes/admin-current-affairs-editorial-activation"),
);
const adminCurrentAffairsSelectedProcessingRouter = lazyRouter(
  () => import("./routes/admin-current-affairs-selected-processing"),
);
const adminCurrentAffairsPackEditorialRouter = lazyRouter(
  () => import("./routes/admin-current-affairs-pack-editorial"),
);

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
  "https://functional-interface.pages.dev",
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
  allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key", "X-Examtree-Device", "X-Correlation-Id"],
  exposedHeaders: ["X-Correlation-Id"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("/api/{*splat}", cors(corsOptions));
// During a production Cloud Run cutover without live merchant credentials,
// block ALL known new-order entrypoints BEFORE authentication, database writes,
// provider API calls, or legacy fallback handlers. Existing purchase reads,
// refund reconciliation, and signed provider webhook callbacks remain routed.
// Old payment orders continue to be reconciled by the existing Render webhook
// until the financial migration is explicitly approved.
const salesCreationPaths = new Set([
  "/api/commerce/orders",
  "/api/packages/create-order",
  "/api/billing/razorpay/create-order",
  "/api/billing/mock-unlock",
]);
app.use((req, res, next) => {
  if (process.env.EXAMTREE_SALES_DISABLED === "true" &&
      req.method === "POST" && salesCreationPaths.has(req.path)) {
    res.status(503).json({
      code: "SALES_TEMPORARILY_UNAVAILABLE",
      error: "New purchases are temporarily paused. Your existing packages remain available.",
    });
    return;
  }
  next();
});

// The temporary no-AI student cutover is safe only if admin work stays on
// Render. Never let a direct Cloud Run URL bypass the Cloudflare bridge and
// invoke AI/admin routes without configured production provider credentials.
app.use((req, res, next) => {
  const delegated = process.env.EXAMTREE_API_RUNTIME === "cloud-run" &&
    process.env.EXAMTREE_API_STAGING === "false" &&
    process.env.EXAMTREE_SALES_DISABLED === "true" &&
    process.env.EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER === "true";
  if (delegated && (req.path === "/api/admin" || req.path.startsWith("/api/admin/"))) {
    res.status(503).json({
      code: "ADMIN_HANDLED_BY_RENDER_DURING_CUTOVER",
      error: "Use the primary Examtree website for administrator tools during the migration.",
    });
    return;
  }
  next();
});
// A deliberate no-provider admin pilot is limited to session/bootstrap and
// deterministic Question Studio. Block all other direct Cloud Run admin paths
// so a direct *.run.app URL cannot bypass the same-origin Render routing.
// This is separate from the full admin phase with configured AI credentials.
app.use((req, res, next) => {
  const deterministicOnly = process.env.EXAMTREE_API_RUNTIME === "cloud-run" &&
    process.env.EXAMTREE_API_STAGING === "false" &&
    process.env.EXAMTREE_SALES_DISABLED === "true" &&
    process.env.EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER === "false" &&
    process.env.EXAMTREE_ADMIN_DETERMINISTIC_ONLY === "true";
  if (!deterministicOnly) { next(); return; }
  if (req.path === "/api/admin/commerce" || req.path.startsWith("/api/admin/commerce/")) {
    next(); // The existing financial 503 guard owns these requests.
    return;
  }
  const safeAdmin = ["/api/admin/session", "/api/admin/question-studio"]
    .some((prefix) => req.path === prefix || req.path.startsWith(prefix + "/"));
  if ((req.path === "/api/admin" || req.path.startsWith("/api/admin/")) && !safeAdmin) {
    res.status(503).json({
      code: "ADMIN_FEATURE_HANDLED_BY_RENDER_DURING_CUTOVER",
      error: "This administrator feature remains on Render until its own migration passes.",
    });
    return;
  }
  next();
});

// During the separate admin handover, financial admin operations must still
// reach Render. Deny direct Cloud Run /api/admin/commerce requests even when
// administrator auth succeeds, until the merchant handover is complete.
app.use((req, res, next) => {
  const financeHandoverVerified =
    process.env.EXAMTREE_FINANCE_CLOUDRUN_APPROVED === "true" &&
    process.env.EXAMTREE_PAYMENT_PROVIDER === "cashfree" &&
    process.env.EXAMTREE_SALES_DISABLED === "false" &&
    process.env.EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER === "false";
  if (process.env.EXAMTREE_API_RUNTIME === "cloud-run" &&
      process.env.EXAMTREE_API_STAGING === "false" &&
      !financeHandoverVerified &&
      (req.path === "/api/admin/commerce" || req.path.startsWith("/api/admin/commerce/"))) {
    res.status(503).json({
      code: "FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER",
      error: "Use the primary Examtree website for finance administration during migration.",
    });
    return;
  }
  next();
});

app.post("/api/billing/webhook", express.raw({ type: "application/json" }), webhookRateLimit, billingWebhookHandler);
app.post("/api/billing/cashfree/webhook", express.raw({ type: "application/json" }), webhookRateLimit, cashfreeWebhookHandler);

// Internal Cloud Tasks receiver is a STAGING-ONLY, opt-in route. Keep it
// before the general 25mb JSON parser and cap task payloads at 2kb. No normal
// production or Render runtime can activate this callback; no public task
// processing occurs just because this code was merged.
const questionStudioAsyncTaskReceiver=lazyRouter(
  ()=>import("./routes/internal-question-studio-async-task"),
);
mountQuestionStudioAsyncTaskReceiver(app,questionStudioAsyncTaskReceiver);

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

// NUM-001 compute is opt-in: without this URL the established local route
// remains fully unchanged. When configured, errors fail closed rather than
// falling back to a 512 MiB/0.15-CPU Render generation attempt.
const num001RemoteRouter = lazyRouter(
  () => import("./routes/admin-question-studio-num001-remote"),
);
app.use("/api/admin/question-studio", adminRequestObservability, (req, res, next) => {
  if (req.method !== "POST" || req.path !== "/runs" || req.body?.packageId !== "NUM-001"
      || !process.env.QUESTION_STUDIO_SHARED_WORKER_URL?.trim()) {
    next();
    return;
  }
  num001RemoteRouter(req, res, next);
});

// TRG-002 generation is CPU-heavy on a 0.15-CPU Render Free instance.
// Handle only that package in an isolated worker-backed endpoint, before
// importing the legacy API graph. All other Question Studio paths stay intact.
const trg002OffThreadRouter = lazyRouter(
  () => import("./routes/admin-question-studio-trg002-worker"),
);
app.use("/api/admin/question-studio", adminRequestObservability, (req, res, next) => {
  if (req.method !== "POST" || req.path !== "/runs" || req.body?.packageId !== "TRG-002") {
    next();
    return;
  }
  trg002OffThreadRouter(req, res, next);
});

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
if (process.env.NODE_ENV === "production" && process.env.EXAMTREE_API_RUNTIME !== "cloud-run") {
  const staticDir = path.resolve(__dirname, "../../examtree/dist/public");
  const studentIndex = path.join(staticDir, "index.html");
  const adminIndex = path.join(staticDir, "admin", "index.html");

  app.use(express.static(staticDir, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }));

  // React Router owns every deep admin URL below /admin. Return the dedicated
  // admin document instead of the student SPA document on direct navigation.
  app.get(/^\/admin(?:\/.*)?$/, (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.sendFile(adminIndex);
  });

  // Student SPA fallback for all remaining non-API routes.
  app.get("/{*splat}", (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.sendFile(studentIndex);
  });
}

export default app;
