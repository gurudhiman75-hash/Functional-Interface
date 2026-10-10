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
      !(url.hostname.endsWith(".run.app") || url.origin === LEGACY_API_ORIGIN)) {
    throw new Error("Cloudflare API upstream must be an HTTPS Cloud Run service origin");
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
  const url = new URL(incoming.pathname + incoming.search, upstreamOrigin);
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
      const redirect = new URL(location, upstreamOrigin);
      if (redirect.origin === upstreamOrigin) {
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
