// Cloudflare Pages: serve the dedicated admin Vite SPA on hard refreshes of
// /admin/... deep links. Pages _redirects "200" rewrites to /admin/index.html
// are rejected as infinite loops due to automatic clean URL canonicalization.
//
// This function is invoked for admin document routes only; /admin/assets/* and
// /admin/index.html are excluded in _routes.json and remain static/free.
export async function onRequest({ request, env }) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/admin/")) {
    return new Response("Not found", { status: 404 });
  }
  // Never serve the SPA document in place of a missing JS/CSS/image asset.
  if (url.pathname.startsWith("/admin/assets/") || /\.[a-zA-Z0-9]{1,8}$/.test(url.pathname)) {
    return new Response("Asset not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  // The /admin/ directory is an actual Pages asset route backed by
  // /admin/index.html. Never fetch /admin/index.html: Pages can redirect that
  // to its extension-less form.
  const shell = await env.ASSETS.fetch(new URL("/admin/", url));
  if (!shell.ok) return new Response("Admin shell unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
  // Check against misrouting to root /index.html before sending HTML to users.
  const html = await shell.text();
  if (!html.includes("/admin/assets/")) {
    return new Response("Admin bundle unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return new Response(request.method === "HEAD" ? null : html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
