const MAX_OFFICIAL_REDIRECTS = 5;
const MAX_HTTP_ATTEMPTS_PER_HOST = 2;
const ATTEMPT_TIMEOUT_MS = 12_000;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308]);

export type BoundedOfficialFetchArgs = {
  accept: string;
  maxBytes: number;
  label: string;
};

type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

type FetchAttemptResult = {
  response: Response;
  requestedUrl: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function canonicalOfficialHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "rbi.org.in" || host === "www.rbi.org.in" || host === "m.rbi.org.in") {
    return "rbi.org.in";
  }
  return host.replace(/^www\./, "");
}

function apexLikeOfficialHost(hostname: string) {
  const canonical = canonicalOfficialHost(hostname);
  const labels = canonical.split(".").filter(Boolean);
  // Covers government/public-service apex hosts such as punjab.gov.in,
  // pib.gov.in, sebi.gov.in, isro.gov.in and punjabrajbhavan.gov.in while
  // avoiding invented www aliases for nested hosts such as ipr.punjab.gov.in.
  return labels.length <= 3;
}

export function assertPublicHttpsSourceUrl(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("Source URL must be a valid HTTPS URL");
  }
  if (parsed.protocol !== "https:") throw new Error("Source URL must use HTTPS");
  const host = parsed.hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host === "169.254.169.254" ||
    host === "metadata.google.internal" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (blocked) throw new Error("Source URL cannot point to a private-network host");
  parsed.hash = "";
  return parsed.toString();
}

export function officialHostVariants(value: string): string[] {
  const safe = new URL(assertPublicHttpsSourceUrl(value));
  const variants = [safe.toString()];

  if (canonicalOfficialHost(safe.hostname) === "rbi.org.in") {
    for (const hostname of ["www.rbi.org.in", "rbi.org.in", "m.rbi.org.in"]) {
      if (hostname === safe.hostname.toLowerCase()) continue;
      const alternate = new URL(safe);
      alternate.hostname = hostname;
      variants.push(assertPublicHttpsSourceUrl(alternate.toString()));
    }
    return [...new Set(variants)];
  }

  if (!apexLikeOfficialHost(safe.hostname)) return variants;

  const alternate = new URL(safe);
  alternate.hostname = safe.hostname.toLowerCase().startsWith("www.")
    ? safe.hostname.slice(4)
    : `www.${safe.hostname}`;
  const candidate = assertPublicHttpsSourceUrl(alternate.toString());
  if (canonicalOfficialHost(new URL(candidate).hostname) === canonicalOfficialHost(safe.hostname)) {
    variants.push(candidate);
  }
  return [...new Set(variants)];
}

export function resolveSafeOfficialRedirect(currentUrl: string, location: string): string {
  const current = new URL(assertPublicHttpsSourceUrl(currentUrl));
  let candidate: URL;
  try {
    candidate = new URL(location, current);
  } catch {
    throw new Error("Official source returned an invalid redirect target");
  }
  const safe = new URL(assertPublicHttpsSourceUrl(candidate.toString()));
  if (canonicalOfficialHost(safe.hostname) !== canonicalOfficialHost(current.hostname)) {
    throw new Error(`Official source redirected outside its trusted host (${current.hostname} -> ${safe.hostname})`);
  }
  return safe.toString();
}

function networkFailureMessage(label: string, sourceUrl: string, error: unknown): string {
  const cause = (error as { cause?: Record<string, unknown> } | null)?.cause;
  const details = [cause?.code, cause?.errno, cause?.syscall, cause?.hostname]
    .filter((value) => value !== undefined && value !== null && String(value).trim().length > 0)
    .map((value) => String(value));
  const host = (() => {
    try {
      return new URL(sourceUrl).hostname;
    } catch {
      return "official source";
    }
  })();
  return `${label} fetch failed for ${host}${details.length > 0 ? ` (${details.join(", ")})` : ""}`;
}

async function fetchWithTransientRetry(
  fetchImpl: FetchLike,
  sourceUrl: string,
  args: BoundedOfficialFetchArgs,
): Promise<FetchAttemptResult> {
  const variants = officialHostVariants(sourceUrl);
  let lastError: unknown;
  let lastRetryableResponse: FetchAttemptResult | null = null;

  for (let variantIndex = 0; variantIndex < variants.length; variantIndex += 1) {
    const candidateUrl = variants[variantIndex]!;
    for (let attempt = 1; attempt <= MAX_HTTP_ATTEMPTS_PER_HOST; attempt += 1) {
      try {
        const response = await fetchImpl(candidateUrl, {
          headers: {
            accept: args.accept,
            "accept-language": "en-IN,en;q=0.9",
            "cache-control": "no-cache",
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
          },
          redirect: "manual",
          signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
        });

        if (!RETRYABLE_STATUS.has(response.status)) {
          return { response, requestedUrl: candidateUrl };
        }

        lastRetryableResponse = { response, requestedUrl: candidateUrl };
        if (attempt < MAX_HTTP_ATTEMPTS_PER_HOST) {
          await response.body?.cancel().catch(() => undefined);
          await sleep(250 * attempt);
          continue;
        }

        if (variantIndex < variants.length - 1) {
          await response.body?.cancel().catch(() => undefined);
        }
      } catch (error) {
        lastError = error;
        // A connect/DNS/TLS failure is frequently host-specific on public-sector
        // infrastructure. Try the canonical official aliases before spending a
        // second full timeout on the same host.
        if (variantIndex < variants.length - 1) break;
        if (attempt < MAX_HTTP_ATTEMPTS_PER_HOST) {
          await sleep(250 * attempt);
          continue;
        }
      }
    }
  }

  if (lastRetryableResponse) return lastRetryableResponse;
  throw new Error(networkFailureMessage(args.label, sourceUrl, lastError));
}

export async function fetchBoundedOfficialText(
  sourceUrl: string,
  args: BoundedOfficialFetchArgs,
  fetchImpl: FetchLike = fetch,
): Promise<string> {
  let currentUrl = assertPublicHttpsSourceUrl(sourceUrl);

  for (let redirectCount = 0; redirectCount <= MAX_OFFICIAL_REDIRECTS; redirectCount += 1) {
    let attemptResult: FetchAttemptResult;
    try {
      attemptResult = await fetchWithTransientRetry(fetchImpl, currentUrl, args);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith(`${args.label} fetch failed`)) throw error;
      throw new Error(networkFailureMessage(args.label, currentUrl, error));
    }

    const { response, requestedUrl } = attemptResult;
    if (REDIRECT_STATUS.has(response.status)) {
      const location = response.headers.get("location");
      await response.body?.cancel().catch(() => undefined);
      if (!location) throw new Error(`${args.label} returned HTTP ${response.status} without a redirect target`);
      if (redirectCount === MAX_OFFICIAL_REDIRECTS) throw new Error(`${args.label} exceeded the official-source redirect limit`);
      currentUrl = resolveSafeOfficialRedirect(requestedUrl, location);
      continue;
    }

    if (!response.ok) throw new Error(`${args.label} returned HTTP ${response.status}`);
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > args.maxBytes) throw new Error(`${args.label} is larger than the ingestion limit`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > args.maxBytes) throw new Error(`${args.label} is larger than the ingestion limit`);
    return buffer.toString("utf8");
  }

  throw new Error(`${args.label} exceeded the official-source redirect limit`);
}
