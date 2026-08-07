import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const webOrigin = String(process.env.EXAMTREE_WEB_ORIGIN || 'https://sarbedutech.web.app').replace(/\/$/, '');
const apiOrigin = String(process.env.EXAMTREE_API_ORIGIN || 'https://examtree-new.onrender.com').replace(/\/$/, '');
const reportPath = process.env.EXAMTREE_RECOVERY_REPORT_PATH || 'artifacts/reports/account-recovery-production-smoke.json';
const attempts = Math.max(1, Number(process.env.EXAMTREE_RECOVERY_SMOKE_ATTEMPTS || 8));
const initialDelayMs = Math.max(0, Number(process.env.EXAMTREE_RECOVERY_SMOKE_INITIAL_DELAY_MS || 4000));

const report = {
  checkedAt: new Date().toISOString(),
  webOrigin,
  apiOrigin,
  passed: false,
  checks: [],
};

function record(name, passed, details = {}) {
  report.checks.push({ name, passed, ...details });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    return await fetch(url, { redirect: 'follow', ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function retry(label, operation) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(initialDelayMs * attempt);
    }
  }
  throw new Error(`${label} failed after ${attempts} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

function scriptUrlsFromHtml(html, pageUrl) {
  const urls = [];
  const pattern = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  for (const match of html.matchAll(pattern)) {
    urls.push(new URL(match[1], pageUrl).toString());
  }
  return [...new Set(urls)];
}

function referencedJavascriptUrls(source, baseUrl) {
  const urls = new Set();
  const patterns = [
    /["'`](\/assets\/[^"'`\s?#]+\.js(?:\?[^"'`\s]*)?)["'`]/g,
    /["'`](assets\/[^"'`\s?#]+\.js(?:\?[^"'`\s]*)?)["'`]/g,
    /["'`](\.\/[^"'`\s?#]+\.js(?:\?[^"'`\s]*)?)["'`]/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const resolved = new URL(match[1], baseUrl);
      if (resolved.origin === webOrigin && resolved.pathname.endsWith('.js')) {
        urls.add(resolved.toString());
      }
    }
  }
  return [...urls];
}

async function collectJavascriptBundles(initialUrls) {
  const queue = [...initialUrls];
  const visited = new Set();
  const texts = [];
  const maxAssets = 150;

  while (queue.length > 0 && visited.size < maxAssets) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    const response = await fetchWithTimeout(url, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    if (!response.ok) throw new Error(`Asset ${url} returned HTTP ${response.status}`);
    const text = await response.text();
    texts.push(text);

    for (const referencedUrl of referencedJavascriptUrls(text, url)) {
      if (!visited.has(referencedUrl)) queue.push(referencedUrl);
    }
  }

  return { text: texts.join('\n'), assetUrls: [...visited] };
}

async function writeReport() {
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

async function main() {
  const recoveryUrl = `${webOrigin}/account-recovery`;
  const page = await retry('Recovery page request', async () => {
    const response = await fetchWithTimeout(recoveryUrl, {
      headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { response, html: await response.text() };
  });

  record('recovery-page-http', page.response.status === 200, {
    status: page.response.status,
    finalUrl: page.response.url,
  });

  const scriptUrls = scriptUrlsFromHtml(page.html, page.response.url || recoveryUrl);
  record('recovery-page-assets-discovered', scriptUrls.length > 0, {
    initialAssetCount: scriptUrls.length,
  });

  let bundleText = '';
  let assetUrls = [];
  if (scriptUrls.length > 0) {
    const bundles = await collectJavascriptBundles(scriptUrls);
    bundleText = bundles.text;
    assetUrls = bundles.assetUrls;
  }

  const expectedUiMarkers = [
    'Recover your ExamTree account',
    'Reset password',
    'Old account unavailable',
    'Send password reset email',
    'Submit verified recovery request',
  ];
  const missingMarkers = expectedUiMarkers.filter((marker) => !bundleText.includes(marker));
  record('recovery-v2-ui-bundle', missingMarkers.length === 0, {
    crawledAssetCount: assetUrls.length,
    expectedMarkers: expectedUiMarkers,
    missingMarkers,
  });

  const health = await retry('API health request', async () => {
    const response = await fetchWithTimeout(`${apiOrigin}/health`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  });
  record('api-health', health.ok, { status: health.status });

  const invalidRecovery = await retry('Recovery API validation request', async () => {
    const response = await fetchWithTimeout(`${apiOrigin}/api/account-recovery/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: webOrigin,
      },
      body: JSON.stringify({ identifier: '', contactEmail: 'invalid', explanation: '' }),
    });
    const text = await response.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }
    if (response.status >= 500) throw new Error(`HTTP ${response.status}`);
    return { response, body, text };
  });

  record('recovery-api-mounted', invalidRecovery.response.status === 400, {
    status: invalidRecovery.response.status,
    responseCode: invalidRecovery.body?.code ?? null,
    responsePreview: invalidRecovery.text.slice(0, 240),
  });
  record('recovery-api-validation-contract', invalidRecovery.body?.code === 'RECOVERY_IDENTIFIER_REQUIRED', {
    responseCode: invalidRecovery.body?.code ?? null,
  });

  const allowedOrigin = invalidRecovery.response.headers.get('access-control-allow-origin');
  record('recovery-api-cors', allowedOrigin === webOrigin, {
    expectedOrigin: webOrigin,
    allowedOrigin,
  });

  report.passed = report.checks.length > 0 && report.checks.every((check) => check.passed);
  if (!report.passed) {
    report.error = `Failed checks: ${report.checks.filter((check) => !check.passed).map((check) => check.name).join(', ')}`;
    process.exitCode = 1;
  }
}

try {
  await main();
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error);
  record('smoke-execution', false, { message: report.error });
  process.exitCode = 1;
} finally {
  report.checkedAt = new Date().toISOString();
  await writeReport();
  console.log(JSON.stringify(report, null, 2));
}
