// Same-origin Cloudflare Pages API forwarder. Render remains the authoritative
// backend for authenticated state, payments, and test attempts; static never
// invokes this function (see _routes.json).
const API_ORIGIN = "https://examtree-new.onrender.com";
const METHODS = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);

export async function onRequest({ request }) {
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
  const url = new URL(incoming.pathname + incoming.search, API_ORIGIN);
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
    // Render or its gateway may return an HTML 502/503/504 during restarts.
    // Keep this API route JSON-only: otherwise the admin UI loses the HTTP
    // status and falls back to "Unable to create the generation run".
    const upstreamContentType = upstream.headers.get("Content-Type") || "";
    const isJSON = /\\b(?:application\\/json|[^;]+\\+json)\\b/i.test(upstreamContentType);
    if (upstream.status !== 204 && !isJSON) {
      const status = upstream.ok ? 502 : upstream.status;
      return Response.json({
        code: upstream.ok ? "API_UPSTREAM_NON_JSON_RESPONSE" : "API_UPSTREAM_HTTP_ERROR",
        error: `ExamTree API returned HTTP ${upstream.status} without JSON. The backend or gateway may be unavailable. Check the Review queue before retrying a generation run.`,
      }, {
        status,
        headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
      });
    }
    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set("Cache-Control", "private, no-store");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.delete("Access-Control-Allow-Origin");
    responseHeaders.delete("Access-Control-Allow-Credentials");
    // Keep the browser on the Pages origin if Render redirects to itself.
    const location = responseHeaders.get("location");
    if (location) {
      const redirect = new URL(location, API_ORIGIN);
      if (redirect.origin === API_ORIGIN) {
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
