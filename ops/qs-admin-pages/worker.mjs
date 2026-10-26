import { onRequest as serveAdminDocument } from "../../functions/admin/[[path]].js";

// Keep the admin-only site on the reviewed 0%-traffic production API revision
// while student traffic remains pinned to its current baseline revision.
const API_ORIGIN = "https://qs-chapter-ef518db5---examtree-api-ttnfjefqka-el.a.run.app";
const API_PREFIXES = ["/api/admin/session", "/api/admin/question-studio"];
const API_METHODS = new Set(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"]);

function isQuestionStudioApi(pathname) {
  return API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function errorResponse(status, code, message) {
  return Response.json({ code, error: message }, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

async function proxyQuestionStudio(request, url) {
  if (!API_METHODS.has(request.method)) {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD, POST, PUT, PATCH, DELETE", "Cache-Control": "no-store" },
    });
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) {
    return errorResponse(403, "CROSS_ORIGIN_NOT_ALLOWED", "Cross-origin API requests are not permitted.");
  }

  const upstreamUrl = new URL(`${url.pathname}${url.search}`, API_ORIGIN);
  const headers = new Headers(request.headers);
  for (const name of [
    "host", "origin", "referer", "cookie", "connection", "content-length",
    "x-forwarded-host", "x-forwarded-proto", "x-forwarded-for", "x-real-ip",
    "cf-connecting-ip", "cf-ray", "cf-ipcountry", "cf-visitor",
    "if-none-match", "if-modified-since",
  ]) headers.delete(name);

  try {
    const upstream = await fetch(new Request(upstreamUrl, {
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

    const location = responseHeaders.get("location");
    if (location) {
      const redirect = new URL(location, API_ORIGIN);
      if (redirect.origin === API_ORIGIN) {
        responseHeaders.set("location", `${url.origin}${redirect.pathname}${redirect.search}${redirect.hash}`);
      }
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch {
    return errorResponse(503, "QUESTION_STUDIO_API_UNAVAILABLE", "Question Studio is temporarily unavailable.");
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      if (!isQuestionStudioApi(url.pathname)) {
        return errorResponse(404, "ADMIN_MODULE_NOT_CONFIGURED", "This admin module is not configured yet.");
      }
      return proxyQuestionStudio(request, url);
    }

    if (url.pathname === "/admin/index.html" || url.pathname.startsWith("/admin/assets/")) {
      return env.ASSETS.fetch(request);
    }

    if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
      return serveAdminDocument({ request, env });
    }

    if (url.pathname === "/") {
      return Response.redirect(new URL("/admin/", url), 302);
    }

    return env.ASSETS.fetch(request);
  },
};
