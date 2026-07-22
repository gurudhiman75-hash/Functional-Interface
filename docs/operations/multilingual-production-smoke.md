# Multilingual production smoke monitor

The workflow `.github/workflows/multilingual-production-smoke.yml` runs a read-only synthetic against the production ExamTree origin after relevant `New-main` pushes, every six hours, and on manual dispatch.

## Always-on checks

The monitor verifies:

- `/health` returns the expected healthy response;
- Translation Operations rejects a missing bearer token;
- Translation Operations rejects an invalid bearer token;
- the approved production browser origin passes the API CORS preflight;
- `/admin/settings/languages` serves the admin SPA document.

These checks do not require credentials and do not mutate production records.

## Authenticated checks

Authenticated coverage is enabled by either of these configurations:

1. `EXAMTREE_ADMIN_ID_TOKEN` — a one-off Firebase ID token, useful for a manual run; or
2. a dedicated least-privilege smoke administrator configured with all three values:
   - `EXAMTREE_SMOKE_ADMIN_EMAIL` secret;
   - `EXAMTREE_SMOKE_ADMIN_PASSWORD` secret;
   - `EXAMTREE_FIREBASE_API_KEY` repository variable or secret.

The dedicated account should have only `content.translations.read`. The synthetic signs in at runtime to obtain a fresh Firebase ID token, then performs read-only checks for:

- Translation Operations overview shape;
- English, Hindi and Punjabi language/script metadata;
- one question-language detail when the queue contains a candidate;
- one test-language detail when a multilingual test is available.

Credentials, bearer tokens and Firebase API-key query parameters are never written to logs or artifacts.

## Evidence

Each production run uploads `multilingual-production-smoke.json` for 30 days. The report includes timestamps, response durations, HTTP statuses, language codes, queue/test counts and explicit `passed` or `skipped` states. It does not include translation text, user identity, credentials or tokens.

## Local verification

Run the contract tests without contacting production:

```bash
node --test scripts/verify-multilingual-production.test.mjs
```

Run the production checks manually:

```bash
EXAMTREE_BASE_URL=https://examtree-new.onrender.com \
node scripts/verify-multilingual-production.mjs
```

Authenticated local/manual runs may supply a short-lived `EXAMTREE_ADMIN_ID_TOKEN` or the dedicated smoke-account environment variables described above.
