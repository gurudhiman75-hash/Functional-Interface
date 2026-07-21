import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';

import { runProductionSmoke } from './verify-multilingual-production.mjs';

function json(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
}

async function createFixtureServer() {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1');
    const origin = req.headers.origin;

    if (req.method === 'OPTIONS' && url.pathname === '/api/admin/translations/overview') {
      res.writeHead(204, {
        'access-control-allow-origin': origin || '',
        'access-control-allow-credentials': 'true',
        'access-control-allow-headers': 'Content-Type,Authorization,X-Examtree-Device',
        'access-control-allow-methods': 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
      });
      res.end();
      return;
    }

    if (url.pathname === '/health') {
      json(res, 200, { status: 'ok' });
      return;
    }

    if (url.pathname === '/admin/settings/languages') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><html><body><div id="root"></div></body></html>');
      return;
    }

    if (url.pathname.startsWith('/api/admin/translations')) {
      const authorization = req.headers.authorization;
      if (!authorization) {
        json(res, 401, { error: 'No token provided' });
        return;
      }
      if (authorization !== 'Bearer fixture-admin-token') {
        json(res, 401, { error: 'Invalid token' });
        return;
      }
    }

    if (url.pathname === '/api/admin/translations/overview') {
      json(res, 200, {
        generatedAt: new Date().toISOString(),
        languages: [
          { code: 'en', scriptCode: 'Latn', direction: 'ltr' },
          { code: 'hi', scriptCode: 'Deva', direction: 'ltr' },
          { code: 'pa', scriptCode: 'Guru', direction: 'ltr' },
        ],
        queue: [{ questionVersionId: 'question-version-1', languageCode: 'pa' }],
        examMappings: [],
        reviewers: [],
        terms: [],
        tests: [{ testVersionId: 'test-version-1', languageCodes: ['en', 'pa'] }],
        metrics: { eligiblePairs: 1, missing: 1, draft: 0, inReview: 0, needsFix: 0, approved: 0, testsBlocked: 1 },
      });
      return;
    }

    if (url.pathname === '/api/admin/translations/questions/question-version-1/languages/pa') {
      json(res, 200, {
        source: { questionVersionId: 'question-version-1' },
        language: { code: 'pa' },
        target: null,
      });
      return;
    }

    if (url.pathname === '/api/admin/translations/tests/test-version-1/languages/pa') {
      json(res, 200, {
        source: { testVersionId: 'test-version-1' },
        language: { code: 'pa' },
        target: null,
        readiness: { ready: false, languageCodes: ['en', 'pa'], languages: [], issues: [] },
      });
      return;
    }

    json(res, 404, { error: 'Not found' });
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  };
}

test('production synthetic validates public, protected and authenticated multilingual journeys', async () => {
  const fixture = await createFixtureServer();
  try {
    const report = await runProductionSmoke({
      baseUrl: fixture.baseUrl,
      allowedOrigin: 'https://sarbedutech.web.app',
      adminToken: 'fixture-admin-token',
      outputPath: null,
      attempts: 1,
      initialDelayMs: 1,
    });

    assert.equal(report.ok, true);
    assert.equal(report.checks.health.status, 'passed');
    assert.equal(report.checks.unauthorisedProtection.status, 'passed');
    assert.equal(report.checks.invalidTokenProtection.status, 'passed');
    assert.equal(report.checks.cors.status, 'passed');
    assert.equal(report.checks.adminSpa.status, 'passed');
    assert.equal(report.checks.authenticatedTranslationReads.status, 'passed');
    assert.equal(report.checks.authenticatedTranslationReads.questionDetail, 'passed');
    assert.equal(report.checks.authenticatedTranslationReads.testDetail, 'passed');
  } finally {
    await fixture.close();
  }
});

test('production synthetic remains useful without an admin token', async () => {
  const fixture = await createFixtureServer();
  try {
    const report = await runProductionSmoke({
      baseUrl: fixture.baseUrl,
      allowedOrigin: 'https://sarbedutech.web.app',
      adminToken: '',
      outputPath: null,
      attempts: 1,
      initialDelayMs: 1,
    });

    assert.equal(report.ok, true);
    assert.equal(report.checks.authenticatedTranslationReads.status, 'skipped');
  } finally {
    await fixture.close();
  }
});
