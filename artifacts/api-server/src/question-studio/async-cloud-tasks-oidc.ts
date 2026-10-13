// Standalone Google-signed OIDC token verification for future Cloud Tasks
// receiver. NOT mounted in app.ts; exporting this module cannot start work.
// Cloud Tasks spoofable HTTP headers (e.g. X-CloudTasks-TaskName) are NEVER
// treated as authentication. This validates a Google signature, fixed issuer,
// exact Cloud Run audience, and an allowlisted service-account email.
import { createPublicKey, verify } from "node:crypto";

const GOOGLE_JWKS = "https://www.googleapis.com/oauth2/v3/certs";
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_JWT_LENGTH = 12_000;
const MAX_JWKS_BYTES = 64_000;
const KEY_CACHE_MS = 5 * 60_000;

export class QuestionStudioTaskAuthError extends Error {
  readonly code: string;
  readonly statusCode: number;
  constructor(code: string, message: string, statusCode = 401) {
    super(message);
    this.name = "QuestionStudioTaskAuthError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export type VerifiedQuestionStudioTaskIdentity = {
  serviceAccountEmail: string;
  subject: string;
};

export type QuestionStudioTaskOidcConfig = {
  audience: string;
  serviceAccount: string;
};

type PublicJwk = {
  kid?: unknown;
  kty?: unknown;
  alg?: unknown;
  use?: unknown;
  n?: unknown;
  e?: unknown;
};

export function getQuestionStudioTaskOidcConfig(
  env: Record<string,string|undefined> = process.env,
): QuestionStudioTaskOidcConfig {
  const audience = env.EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE?.trim() ?? "";
  const serviceAccount = env.EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT?.trim() ?? "";
  let url: URL;
  try { url = new URL(audience); }
  catch { throw new QuestionStudioTaskAuthError("TASK_OIDC_CONFIG_INVALID", "Invalid Cloud Run OIDC audience", 503); }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".run.app") ||
      url.pathname !== "/" || url.search || url.hash ||
      url.username || url.password ||
      !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.iam\.gserviceaccount\.com$/.test(serviceAccount)) {
    throw new QuestionStudioTaskAuthError("TASK_OIDC_CONFIG_INVALID", "Cloud Tasks OIDC configuration is incomplete", 503);
  }
  return {audience: url.origin,serviceAccount};
}

function decodeJwtPart(encoded: string): Record<string,unknown> {
  let value: unknown;
  try { value = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")); }
  catch { throw new QuestionStudioTaskAuthError("TASK_OIDC_INVALID", "Invalid task identity token"); }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new QuestionStudioTaskAuthError("TASK_OIDC_INVALID", "Invalid task identity token");
  }
  return value as Record<string,unknown>;
}

function extractToken(authHeader: string | undefined): string {
  if (!authHeader || typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")) {
    throw new QuestionStudioTaskAuthError("TASK_OIDC_REQUIRED", "Google-signed task identity required");
  }
  const token = authHeader.slice("Bearer ".length);
  if (token.length > MAX_JWT_LENGTH || !JWT_PATTERN.test(token)) {
    throw new QuestionStudioTaskAuthError("TASK_OIDC_INVALID", "Invalid task identity token");
  }
  return token;
}

export function validateQuestionStudioTaskBody(body: unknown): {runId:string;queueVersion:1} {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new QuestionStudioTaskAuthError("TASK_PAYLOAD_INVALID", "Invalid generation task payload", 400);
  }
  const data = body as Record<string,unknown>;
  if (Object.keys(data).sort().join(",") !== "queueVersion,runId" ||
      data.queueVersion !== 1 || typeof data.runId !== "string" ||
      !UUID.test(data.runId)) {
    throw new QuestionStudioTaskAuthError("TASK_PAYLOAD_INVALID", "Invalid generation task payload", 400);
  }
  return {runId:data.runId,queueVersion:1};
}

export function createQuestionStudioTaskOidcVerifier(deps: {
  request?: typeof fetch;
  now?: () => number;
} = {}) {
  const request = deps.request ?? fetch;
  const now = deps.now ?? Date.now;
  let cache: Map<string,PublicJwk> = new Map();
  let lastFetchedAt = 0;

  async function refreshJwks(): Promise<void> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5_000);
    try {
      const response = await request(GOOGLE_JWKS, {signal:controller.signal});
      if (!response.ok) throw new Error("Google JWKS unavailable");
      const text = await response.text();
      if (text.length > MAX_JWKS_BYTES) throw new Error("Google JWKS oversized");
      const document = JSON.parse(text) as {keys?: unknown};
      if (!Array.isArray(document.keys) || document.keys.length > 30) throw new Error("Google JWKS invalid");
      const next = new Map<string,PublicJwk>();
      for (const item of document.keys) {
        if (!item || typeof item !== "object") continue;
        const jwk=item as PublicJwk;
        if (jwk.kty !== "RSA" || typeof jwk.kid !== "string" ||
            !/^[A-Za-z0-9_-]{1,180}$/.test(jwk.kid) ||
            typeof jwk.n !== "string" || typeof jwk.e !== "string" ||
            (jwk.alg !== undefined && jwk.alg !== "RS256") ||
            (jwk.use !== undefined && jwk.use !== "sig")) continue;
        next.set(jwk.kid,jwk);
      }
      if (!next.size) throw new Error("Google JWKS had no usable signing keys");
      cache=next;
      lastFetchedAt=now();
    } catch {
      throw new QuestionStudioTaskAuthError("TASK_OIDC_KEYS_UNAVAILABLE","Unable to verify Google task identity",503);
    } finally {
      clearTimeout(timeout);
    }
  }

  return async function verifyTaskOidc(
    authorization: string | undefined,
    config: QuestionStudioTaskOidcConfig,
  ): Promise<VerifiedQuestionStudioTaskIdentity> {
    const token = extractToken(authorization);
    const [head,claims,sig] = token.split(".") as [string,string,string];
    const header = decodeJwtPart(head);
    const payload = decodeJwtPart(claims);
    if (header.alg !== "RS256" || typeof header.kid !== "string" ||
        !/^[A-Za-z0-9_-]{1,180}$/.test(header.kid) ||
        header.crit !== undefined) {
      throw new QuestionStudioTaskAuthError("TASK_OIDC_INVALID","Unsupported Google task identity signature");
    }

    // Validate required claims independently from signature, and then verify
    // the signature below. Do not use claims for authorization before that.
    const current = Math.floor(now()/1000);
    const exp=payload.exp;
    const iat=payload.iat;
    if (!["https://accounts.google.com","accounts.google.com"].includes(String(payload.iss)) ||
        payload.aud !== config.audience ||
        payload.email !== config.serviceAccount ||
        (payload.email_verified !== true && payload.email_verified !== "true") ||
        typeof payload.sub !== "string" || !/^[0-9]{8,25}$/.test(payload.sub) ||
        typeof exp !== "number" || !Number.isInteger(exp) ||
        typeof iat !== "number" || !Number.isInteger(iat) ||
        exp <= current || exp > current + 4200 ||
        iat > current + 60 || iat < current - 4200 ||
        exp - iat > 4200) {
      throw new QuestionStudioTaskAuthError("TASK_OIDC_CLAIMS_INVALID","Task identity claims are invalid");
    }
    if (now() - lastFetchedAt > KEY_CACHE_MS || !cache.has(header.kid)) await refreshJwks();
    const jwk=cache.get(header.kid);
    if (!jwk) throw new QuestionStudioTaskAuthError("TASK_OIDC_SIGNING_KEY_UNKNOWN","Unknown Google task signing key");
    let signatureOk=false;
    try {
      const key=createPublicKey({key:{
        kty:"RSA",n:jwk.n as string,e:jwk.e as string,
      },format:"jwk"});
      signatureOk=verify("RSA-SHA256",Buffer.from(`${head}.${claims}`),key,Buffer.from(sig,"base64url"));
    } catch {
      signatureOk=false;
    }
    if (!signatureOk) throw new QuestionStudioTaskAuthError("TASK_OIDC_SIGNATURE_INVALID","Invalid Google task signature");
    return {serviceAccountEmail:config.serviceAccount,subject:String(payload.sub)};
  };
}
