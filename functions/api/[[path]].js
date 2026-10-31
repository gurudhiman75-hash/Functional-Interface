// Same-origin Cloudflare Pages API forwarder. The default remains Render
// during staging. Once Cloud Run passes E2E checks, set the Pages environment
// variable EXAMTREE_API_UPSTREAM_ORIGIN to the validated Cloud Run API URL.
// Never take a destination from user headers or query parameters.
const LEGACY_API_ORIGIN = "https://examtree-new.onrender.com";
export function configuredApiOrigin(env = {}) {
  const candidate = env.EXAMTREE_API_UPSTREAM_ORIGIN?.trim();
  if (!candidate) return LEGACY_API_ORIGIN;
  let url;
  try { url = new URL(candidate); }
  catch { throw new Error("Cloudflare API upstream configuration is not a URL"); }
  if (url.protocol !== "https:" || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash ||
      !((url.hostname.startsWith("examtree-api-") &&
          !url.hostname.startsWith("examtree-api-staging-") &&
          (url.hostname.endsWith(".asia-south1.run.app") || url.hostname.endsWith(".a.run.app")))
        || url.origin === LEGACY_API_ORIGIN)) {
    throw new Error("Cloudflare API upstream must be the dedicated production ExamTree Cloud Run service, never staging");
  }
  return url.origin;
}
// Optional Question Studio pilot on the EXISTING Cloudflare Pages frontend.
// Only the admin session and Question Studio paths may use the dedicated
// isolated API. No student, billing, webhook or other admin route is changed.
export function configuredQsAdminOrigin(env = {}) {
  const raw = env.EXAMTREE_QS_ADMIN_UPSTREAM_ORIGIN;
  if (typeof raw !== "string" || !raw.trim()) return null;
  let url;
  try { url = new URL(raw.trim()); } catch { throw new Error("Invalid QS admin origin"); }
  if (url.protocol !== "https:" || url.username || url.password ||
      (url.pathname !== "/" && url.pathname !== "") || url.search || url.hash ||
      !/^examtree-qs-admin-api-staging-[a-z0-9-]+\.(?:asia-south1\.run\.app|a\.run\.app)$/.test(url.hostname)) {
    throw new Error("QS admin origin must be the isolated staging API service");
  }
  return url.origin;
}
// Opt-in admin canary: route only non-financial admin endpoints to the
// verified zero-normal-traffic revision via its Cloud Run tag. No other
// Cloudflare environment variable may supply a destination.
export function configuredAdminCanaryOrigin(env = {}) {
  const raw = env.EXAMTREE_ADMIN_CANARY_ORIGIN;
  if (typeof raw !== "string" || !raw.trim()) return null;
  let url;
  try { url = new URL(raw.trim()); } catch { throw new Error("Invalid tagged admin Cloud Run origin"); }
  if (url.protocol !== "https:" || url.username || url.password ||
      url.pathname !== "/" || url.search || url.hash ||
      !/^admin-candidate---examtree-api-[a-z0-9-]+\\.a\\.run\\.app$/.test(url.hostname)) {
    throw new Error("Admin canary must be the dedicated tagged production ExamTree API revision");
  }
  return url.origin;
}
const METHODS = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);

export async function onRequest({ request, env = {} }) {
  const incoming = new URL(request.url);
  if (!(incoming.pathname === "/api" || incoming.pathname.startsWith("/api/"))) {
    return new Response("Not found", { status: 404 });
  }
  if (!METHODS.has(request.method)) {
    return new Response("Method not allowed", { status: 405 });
  }
  // Do not turn the public Pages hostname into an unrestricted cross-site
  // API relay. Reject foreign browser Origins before stripping CORS metadata.
  const origin = request.headers.get("Origin");
  if (origin && origin !== incoming.origin) {
    return new Response("Cross-origin API request not permitted", {
      status: 403, headers: { "Cache-Control": "no-store" },
    });
  }
  let upstreamOrigin;
  try { upstreamOrigin = configuredApiOrigin(env); }
  catch {
    return Response.json({ error: "The ExamTree API gateway is not configured correctly.", code: "API_GATEWAY_MISCONFIGURED" }, { status: 503 });
  }
  // During the sales-paused Cloud Run migration, existing provider callbacks
  // and in-flight payment confirmation MUST continue reaching the still-live
  // Render payment handler. Cloud Run production intentionally has no Cashfree
  // credentials. Never send payment webhooks into the staging database.
  // Remove this narrowly scoped exception only during the separately
  // approved production merchant/webhook handover.
  // Admin routes stay on Render by default. Only after Cloud Run passes its
  // separate admin acceptance gate may the admin-specific Pages flag move
  // non-financial admin requests. Finance stays on Render in every mode.
  const adminRenderBridge = incoming.pathname === "/api/admin" ||
    incoming.pathname.startsWith("/api/admin/");
  // Admin migration is a separate, explicit promotion from the student API
  // cutover. Default and unknown values keep ALL admin traffic on Render.
  // Financial admin endpoints NEVER join the admin migration: existing orders,
  // refunds, products, coupons, and entitlements retain their legacy handler.
  const adminCloudRunEnabled = env.EXAMTREE_ADMIN_UPSTREAM === "cloud-run";
  // Finance is an independent, explicitly approved final handover.
  // This switch is inert while sales or provider callbacks remain on Render.
  const financeCloudRunEnabled = adminCloudRunEnabled &&
    env.EXAMTREE_FINANCE_UPSTREAM === "cloud-run";
  // No-provider phase is intentionally much narrower than a complete admin
  // migration: only the authenticated admin shell + deterministic Question
  // Studio can use Cloud Run. Other admin areas (including ALL Notes Studio
  // and Current Affairs operations) continue on Render.
  const deterministicAdminEnabled = env.EXAMTREE_ADMIN_UPSTREAM === "cloud-run-deterministic";
  const deterministicAdminPath = [
    "/api/admin/session",
    "/api/admin/question-studio",
  ].some((prefix) => incoming.pathname === prefix || incoming.pathname.startsWith(prefix + "/"));
  const adminFinanceRenderBridge = incoming.pathname === "/api/admin/commerce" ||
    incoming.pathname.startsWith("/api/admin/commerce/");
  const adminUseCloudRun = adminCloudRunEnabled || (deterministicAdminEnabled && deterministicAdminPath);
  const financialHandoverPath =
    (adminRenderBridge && (!adminUseCloudRun || adminFinanceRenderBridge)) ||
    /^\/api\/billing\/(?:cashfree\/)?webhook$/.test(incoming.pathname) ||
    /^\/api\/commerce\/orders\/[^/]+\/(?:reconcile|confirm)$/.test(incoming.pathname) ||
    incoming.pathname === "/api/billing/razorpay/verify" ||
    incoming.pathname === "/api/packages/verify" ||
    incoming.pathname === "/api/admin/commerce/orders" ||
    incoming.pathname.startsWith("/api/admin/commerce/orders/");
  // This pilot is scoped to the same Cloudflare Pages deployment. The optional
  // origin must be an exact isolated QS API URL, otherwise reject the request
  // rather than silently writing to the legacy or production database.
  const qsAdminPath = ["/api/admin/session", "/api/admin/question-studio"]
    .some((prefix) => incoming.pathname === prefix || incoming.pathname.startsWith(prefix + "/"));
  let qsAdminOrigin;
  try { qsAdminOrigin = qsAdminPath ? configuredQsAdminOrigin(env) : null; }
  catch {
    return Response.json({ code: "QS_ADMIN_UPSTREAM_MISCONFIGURED",
      error: "Question Studio admin routing is not configured correctly." },
      { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  // Explicit canary is narrower than the normal admin migration: all
  // non-financial admin work may use the tagged revision for authenticated
  // acceptance, while student traffic and finance remain unchanged.
  let adminCanaryOrigin;
  try { adminCanaryOrigin = env.EXAMTREE_ADMIN_UPSTREAM === "cloud-run-deterministic"
    ? configuredAdminCanaryOrigin(env) : null; }
  catch {
    return Response.json({ code: "ADMIN_CANARY_UPSTREAM_MISCONFIGURED",
      error: "The tagged admin canary URL is not configured correctly." },
      { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const actualUpstream =
    (adminRenderBridge && !adminFinanceRenderBridge && adminCanaryOrigin ? adminCanaryOrigin : null) ||
    qsAdminOrigin ||
    (financialHandoverPath && !financeCloudRunEnabled ? LEGACY_API_ORIGIN : upstreamOrigin);
  const url = new URL(incoming.pathname + incoming.search, actualUpstream);
  const headers = new Headers(request.headers);
  for (const key of [
    "host", "origin", "referer", "connection", "content-length",
    "x-forwarded-host", "x-forwarded-proto", "x-forwarded-for", "x-real-ip",
    "cf-connecting-ip", "cf-ray", "cf-ipcountry", "cf-visitor",
    "if-none-match", "if-modified-since",
  ]) headers.delete(key);
  try {
    const upstream = await fetch(new Request(url, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "manual",
      duplex: "half",
    }));
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set("Cache-Control", "private, no-store");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.delete("Access-Control-Allow-Origin");
    responseHeaders.delete("Access-Control-Allow-Credentials");
    // Preserve same-origin browser navigation when the backend redirects to itself.
    const location = responseHeaders.get("location");
    if (location) {
      const redirect = new URL(location, actualUpstream);
      if (redirect.origin === actualUpstream) {
        responseHeaders.set("location", incoming.origin + redirect.pathname + redirect.search + redirect.hash);
      }
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { error: "The ExamTree API is temporarily unavailable. Please retry shortly.", code: "API_UPSTREAM_UNAVAILABLE" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
