import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_BASE_URL = 'https://examtree-new.onrender.com';
const DEFAULT_ALLOWED_ORIGIN = 'https://sarbedutech.web.app';
const DEFAULT_FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
const DEFAULT_REPORT_PATH = 'artifacts/reports/multilingual-production-smoke.json';

function normaliseBaseUrl(value) {
  const parsed = new URL((value || DEFAULT_BASE_URL).trim());
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Unsupported production URL protocol: ${parsed.protocol}`);
  }
  return parsed.toString().replace(/\/$/, '');
}

function safeUrlLabel(value) {
  const parsed = new URL(value);
  return `${parsed.origin}${parsed.pathname}`;
}

function elapsedMilliseconds(startedAt) {
  return Number((performance.now() - startedAt).toFixed(1));
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Expected JSON from ${safeUrlLabel(response.url)}, received: ${text.slice(0, 180)}`);
  }
}

async function requestWithRetry({
  url,
  init,
  acceptedStatuses,
  attempts,
  initialDelayMs,
  label,
}) {
  const requestLabel = label || safeUrlLabel(url);
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const startedAt = performance.now();
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(45_000),
        ...init,
      });
      const durationMs = elapsedMilliseconds(startedAt);
      if (acceptedStatuses.includes(response.status)) {
        return { response, durationMs, attempt };
      }
      const body = await response.text().catch(() => '');
      lastError = new Error(
        `${init?.method || 'GET'} ${requestLabel} returned ${response.status}; expected ${acceptedStatuses.join(', ')}. ${body.slice(0, 180)}`,
      );
      if (response.status < 500 && response.status !== 429) throw lastError;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < attempts) {
      const delayMs = initialDelayMs * attempt;
      process.stdout.write(`Retrying ${requestLabel} after attempt ${attempt}: ${lastError.message}\n`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError || new Error(`Request failed: ${requestLabel}`);
}

function assertOverviewShape(overview) {
  assert.ok(overview && typeof overview === 'object', 'Overview payload must be an object.');
  for (const key of ['languages', 'queue', 'examMappings', 'reviewers', 'terms', 'tests']) {
    assert.ok(Array.isArray(overview[key]), `Overview.${key} must be an array.`);
  }
  assert.ok(overview.metrics && typeof overview.metrics === 'object', 'Overview.metrics must be an object.');

  const languages = new Map(overview.languages.map((language) => [String(language.code).toLowerCase(), language]));
  for (const [code, scriptCode] of [['en', 'Latn'], ['hi', 'Deva'], ['pa', 'Guru']]) {
    const language = languages.get(code);
    assert.ok(language, `Production overview must include ${code}.`);
    assert.equal(language.scriptCode, scriptCode, `${code} must expose script ${scriptCode}.`);
    assert.equal(language.direction, 'ltr', `${code} must expose ltr direction.`);
  }
}

async function resolveAdminAuthentication(options, retryOptions) {
  const directToken = (options.adminToken ?? process.env.EXAMTREE_ADMIN_ID_TOKEN ?? '').trim();
  if (directToken) {
    return { token: directToken, mode: 'provided_id_token' };
  }

  const email = (options.adminEmail ?? process.env.EXAMTREE_SMOKE_ADMIN_EMAIL ?? '').trim();
  const password = options.adminPassword ?? process.env.EXAMTREE_SMOKE_ADMIN_PASSWORD ?? '';
  const apiKey = (options.firebaseApiKey ?? process.env.EXAMTREE_FIREBASE_API_KEY ?? '').trim();
  const configuredValues = [email, password, apiKey].filter(Boolean).length;
  if (configuredValues === 0) {
    return { token: '', mode: 'not_configured' };
  }
  if (configuredValues !== 3) {
    throw new Error(
      'Authenticated smoke configuration is incomplete. Configure EXAMTREE_SMOKE_ADMIN_EMAIL, EXAMTREE_SMOKE_ADMIN_PASSWORD and EXAMTREE_FIREBASE_API_KEY together.',
    );
  }

  const firebaseAuthUrl = new URL(
    options.firebaseAuthUrl || process.env.EXAMTREE_FIREBASE_AUTH_URL || DEFAULT_FIREBASE_AUTH_URL,
  );
  firebaseAuthUrl.searchParams.set('key', apiKey);

  const authResult = await requestWithRetry({
    url: firebaseAuthUrl.toString(),
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
    acceptedStatuses: [200],
    attempts: retryOptions.attempts,
    initialDelayMs: retryOptions.initialDelayMs,
    label: `${firebaseAuthUrl.origin}${firebaseAuthUrl.pathname}`,
  });
  const authPayload = await readJson(authResult.response);
  assert.ok(typeof authPayload?.idToken === 'string' && authPayload.idToken.length > 20, 'Firebase sign-in did not return an ID token.');
  return {
    token: authPayload.idToken,
    mode: 'firebase_password',
    durationMs: authResult.durationMs,
  };
}

async function writeReport(outputPath, report) {
  if (!outputPath) return;
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

export async function runProductionSmoke(options = {}) {
  const baseUrl = normaliseBaseUrl(options.baseUrl || process.env.EXAMTREE_BASE_URL);
  const allowedOrigin = (options.allowedOrigin || process.env.EXAMTREE_ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN).trim();
  const outputPath = options.outputPath === undefined
    ? (process.env.EXAMTREE_SMOKE_REPORT_PATH || DEFAULT_REPORT_PATH)
    : options.outputPath;
  const attempts = Number(options.attempts ?? process.env.EXAMTREE_SMOKE_ATTEMPTS ?? 8);
  const initialDelayMs = Number(options.initialDelayMs ?? process.env.EXAMTREE_SMOKE_INITIAL_DELAY_MS ?? 4_000);
  assert.ok(Number.isInteger(attempts) && attempts > 0, 'Smoke attempts must be a positive integer.');
  assert.ok(Number.isFinite(initialDelayMs) && initialDelayMs >= 0, 'Smoke retry delay must be non-negative.');

  const report = {
    ok: false,
    generatedAt: new Date().toISOString(),
    baseUrl,
    checks: {},
  };

  try {
    const healthResult = await requestWithRetry({
      url: `${baseUrl}/health`,
      acceptedStatuses: [200],
      attempts,
      initialDelayMs,
    });
    const health = await readJson(healthResult.response);
    assert.equal(health?.status, 'ok', 'Health endpoint must return { status: "ok" }.');
    report.checks.health = {
      status: 'passed',
      httpStatus: healthResult.response.status,
      durationMs: healthResult.durationMs,
      attempt: healthResult.attempt,
    };

    const unauthorisedResult = await requestWithRetry({
      url: `${baseUrl}/api/admin/translations/overview`,
      acceptedStatuses: [401],
      attempts,
      initialDelayMs,
    });
    const unauthorised = await readJson(unauthorisedResult.response);
    assert.equal(unauthorised?.error, 'No token provided');
    report.checks.unauthorisedProtection = {
      status: 'passed',
      httpStatus: unauthorisedResult.response.status,
      durationMs: unauthorisedResult.durationMs,
    };

    const invalidTokenResult = await requestWithRetry({
      url: `${baseUrl}/api/admin/translations/overview`,
      init: { headers: { Authorization: 'Bearer examtree-invalid-smoke-token' } },
      acceptedStatuses: [401],
      attempts,
      initialDelayMs,
    });
    const invalidToken = await readJson(invalidTokenResult.response);
    assert.equal(invalidToken?.error, 'Invalid token');
    report.checks.invalidTokenProtection = {
      status: 'passed',
      httpStatus: invalidTokenResult.response.status,
      durationMs: invalidTokenResult.durationMs,
    };

    const corsResult = await requestWithRetry({
      url: `${baseUrl}/api/admin/translations/overview`,
      init: {
        method: 'OPTIONS',
        headers: {
          Origin: allowedOrigin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'authorization',
        },
      },
      acceptedStatuses: [204],
      attempts,
      initialDelayMs,
    });
    assert.equal(corsResult.response.headers.get('access-control-allow-origin'), allowedOrigin);
    assert.equal(corsResult.response.headers.get('access-control-allow-credentials'), 'true');
    assert.match(corsResult.response.headers.get('access-control-allow-headers') || '', /authorization/i);
    report.checks.cors = {
      status: 'passed',
      httpStatus: corsResult.response.status,
      durationMs: corsResult.durationMs,
      allowedOrigin,
    };

    const adminSpaResult = await requestWithRetry({
      url: `${baseUrl}/admin/settings/languages`,
      acceptedStatuses: [200],
      attempts,
      initialDelayMs,
    });
    const adminHtml = await adminSpaResult.response.text();
    assert.match(adminSpaResult.response.headers.get('content-type') || '', /text\/html/i);
    assert.match(adminHtml, /id=["']root["']/i, 'Admin SPA document must contain the React root.');
    report.checks.adminSpa = {
      status: 'passed',
      httpStatus: adminSpaResult.response.status,
      durationMs: adminSpaResult.durationMs,
    };

    const authentication = await resolveAdminAuthentication(options, { attempts, initialDelayMs });
    report.checks.authenticationBootstrap = authentication.token
      ? { status: 'passed', mode: authentication.mode, durationMs: authentication.durationMs ?? null }
      : { status: 'skipped', mode: authentication.mode };

    if (authentication.token) {
      const authHeaders = { Authorization: `Bearer ${authentication.token}` };
      const overviewResult = await requestWithRetry({
        url: `${baseUrl}/api/admin/translations/overview`,
        init: { headers: authHeaders },
        acceptedStatuses: [200],
        attempts,
        initialDelayMs,
      });
      const overview = await readJson(overviewResult.response);
      assertOverviewShape(overview);

      const authenticated = {
        status: 'passed',
        httpStatus: overviewResult.response.status,
        durationMs: overviewResult.durationMs,
        languageCodes: overview.languages.map((language) => language.code),
        queueCount: overview.queue.length,
        testCount: overview.tests.length,
        questionDetail: 'not_available',
        testDetail: 'not_available',
      };

      const queueItem = overview.queue.find((item) => item?.questionVersionId && item?.languageCode);
      if (queueItem) {
        const questionResult = await requestWithRetry({
          url: `${baseUrl}/api/admin/translations/questions/${encodeURIComponent(queueItem.questionVersionId)}/languages/${encodeURIComponent(queueItem.languageCode)}`,
          init: { headers: authHeaders },
          acceptedStatuses: [200],
          attempts,
          initialDelayMs,
        });
        const questionDetail = await readJson(questionResult.response);
        assert.equal(questionDetail?.source?.questionVersionId, queueItem.questionVersionId);
        assert.equal(String(questionDetail?.language?.code).toLowerCase(), String(queueItem.languageCode).toLowerCase());
        authenticated.questionDetail = 'passed';
      }

      const testSummary = overview.tests.find((item) => item?.testVersionId && Array.isArray(item.languageCodes));
      const targetLanguage = testSummary?.languageCodes?.find((code) => String(code).toLowerCase() !== 'en');
      if (testSummary && targetLanguage) {
        const testResult = await requestWithRetry({
          url: `${baseUrl}/api/admin/translations/tests/${encodeURIComponent(testSummary.testVersionId)}/languages/${encodeURIComponent(targetLanguage)}`,
          init: { headers: authHeaders },
          acceptedStatuses: [200],
          attempts,
          initialDelayMs,
        });
        const testDetail = await readJson(testResult.response);
        assert.equal(testDetail?.source?.testVersionId, testSummary.testVersionId);
        assert.equal(String(testDetail?.language?.code).toLowerCase(), String(targetLanguage).toLowerCase());
        authenticated.testDetail = 'passed';
      }

      report.checks.authenticatedTranslationReads = authenticated;
    } else {
      report.checks.authenticatedTranslationReads = {
        status: 'skipped',
        reason: 'No smoke administrator credentials are configured.',
      };
    }

    report.ok = true;
    await writeReport(outputPath, report);
    return report;
  } catch (error) {
    report.error = error instanceof Error ? error.message : String(error);
    await writeReport(outputPath, report);
    throw error;
  }
}

async function main() {
  const report = await runProductionSmoke();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
