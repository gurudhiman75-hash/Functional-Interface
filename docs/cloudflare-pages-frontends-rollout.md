# Examtree Cloudflare Pages rollout — student + admin frontend

This stage separates the **static web frontends** from the 512 MiB Render Free Node API. It does **not** eliminate Render API cold starts. Keep the live custom domain unchanged until the preview passes browser integration tests.

## Components

- Student site: Vite output from `artifacts/examtree/dist/public`, including pre-rendered public SEO routes.
- Admin site: Vite output copied to `artifacts/examtree/dist/public/admin/`, using Vite base `/admin/`.
- API: existing Render backend `https://examtree-new.onrender.com`; POST /api/admin/question-studio/runs uses remote Cloud Run compute for TRG-002 only when explicitly configured.
- Cloudflare Pages Function `functions/api/[[path]].js`: forwards only `/api/*` to Render. It preserves method, Firebase Authorization, body, and query parameters; rejects foreign browser Origins and disables edge caching for all API responses.
- `_routes.json`: only /api/* invokes Pages Functions. Static pages, index, public exam information, scripts and assets do not consume Workers Free requests.

## Connect to Cloudflare Pages in dashboard

Cloudflare currently needs permission to access the private GitHub repository. Open **Workers & Pages → Create application → Pages → Connect to Git**, and authorize the Examtree GitHub repo if prompted.

| Setting | Value |
| --- | --- |
| GitHub repository | `gurudhiman75-hash/Functional-Interface` |
| Production branch | `New-main` |
| Framework preset | None |
| Root directory | `/` (repository root) |
| Build command | `bash scripts/build-cloudflare-pages.sh` |
| Build output directory | `artifacts/examtree/dist/public` |
| Node version | 22 (Pages V3 build image) |
| PNPM | Script pins `pnpm@10.33.0` via Corepack |

**Do not** use `pnpm run build` at the repository root: that executes unrelated backend/test/content builds. No PostgreSQL or Firebase service-account secrets are required for the Pages build. Frontend's existing public Firebase client configuration is bundled by Vite from checked-in production env; the Pages script forcibly overrides the direct Render API URL with same-origin `/api`.

Cloudflare should discover root `functions/` automatically when building with Git. Deploy initially to its `*.pages.dev` URL. Static traffic is free and unlimited at the Pages layer; Pages Functions count against Cloudflare Workers free quotas, which are shared across the account. This proxy does not guarantee low-latency authenticated requests when Render is asleep.

## Before switching custom domain

1. Visit Pages staging home and verify hero, official exam/category icons, login screen, footer, CSS and JS all load fast even when Render is sleeping.
2. Verify `/admin`, `/admin/login`, `/admin/question-studio`, and any deep admin route returns the **admin app** HTML and its `/admin/assets/*` chunks (not student HTML).
3. Verify student public routes `/ssc-cgl`, `/ibps-po`, `/terms-and-conditions`, sitemap, robots.txt and pre-rendered metadata. Watch for unintended rewrites caused by `_redirects`; a preview must confirm existing prerender pages are respected.
4. Add the exact Pages preview hostname under **Firebase Authentication → Settings → Authorized domains** before testing Google login and phone/OTP verification. Only add domains owned by Examtree. If Firebase Storage uses a restrictive CORS origin list for uploads, explicitly add the preview host there too before admin image uploads.
5. Test  `/api/health` via the Pages domain. The proxy should return backend's 404 for /api/health if not implemented; **/health** belongs to Render, so use an existing lightweight API route instead. Test logged-out product listings, authenticated exam feeds, attempts, resume, login/profile, purchases/checkout, webhook verification, admin Question Studio read/write, and error/retry behavior. Verify `Authorization` survives the edge and no API payload is cached.
6. Review Cashfree return URLs and Firebase Google/OAuth redirect origins; keep external provider webhooks pointing directly at the Render API endpoint.
7. Inspect Cloudflare Pages Functions usage and confirm it only increments for /api calls, not CSS/JS/exam landing pages. Free Workers request allowance can be exhausted with heavy API polling.
8. Verify browser CORS/CSRF behavior on Pages origin, especially form POSTs and image uploads. Do not approve cutover just because the homepage loads.
9. When satisfied, attach `examtree.in` and `www.examtree.in` using **Cloudflare Pages Custom Domains**; check DNS and HTTPS certificates. Switch `EXAMTREE_PUBLIC_ORIGIN` to canonical final origin in Pages build settings, rebuild sitemap and meta tags and add production domain to Firebase authorized domains.
10. Only after cutover, consider removing Render's static SPA serving to save build/CPU—keep rollback capacity until stability is proven.

## Rollback and caveats

- Keep Render's current full-stack endpoint as a temporary rollback URL. No DNS or webhook changes occur when this branch merges.
- Static frontends get CDN latency and no origin cold-start. Dynamic data still relies on the Render Free backend, which may hibernate. To remove that backend delay reliably, deploy an appropriately sized always-on API or migrate read paths/API separately; Cloudflare Pages cannot keep Render running.
- This edge proxy strips incoming browser Origin only after rejecting cross-site Origin headers; Render continues handling authentication and authorization. Do not treat the proxy itself as authentication.
- Cloudflare Pages Functions Free requests count against the Workers daily cap (100,000/day on the standard free plan at the time of this rollout), even though static file serving is unlimited. Do not proxy images or CDN assets through the function.
- For compliance, preserve exact payment webhooks, auth redirect domains, Content-Security-Policy and SEO canonical URLs.
