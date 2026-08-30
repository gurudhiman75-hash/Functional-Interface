# Current Affairs Studio CP022 — Admin Control Center

CP022 adds the first unified operator workspace for the Current Affairs pipeline. It does not create a second Current Affairs lifecycle; it surfaces the canonical CP001–CP021 state and reuses the existing guarded mutation endpoints.

## Admin route

The separate ExamTree admin application exposes:

`/admin/content/current-affairs`

The workspace is visible to administrators with `content.questions.read`.

## Control-center read model

`GET /admin/current-affairs/control-center`

The endpoint is authenticated, permission-gated and read-only. It aggregates:

- registered/active/scheduled/failing source counts
- queued ingestion candidates and open clusters
- review/verified event counts
- open factual conflicts
- English authoring work
- Hindi and Punjabi localization work
- draft compilation count
- release-ready vs blocked packages
- approved/revoked release counts
- published learner Current Affairs quizzes
- active BANK_ONLY Question Bank promotions
- learners with Current Affairs attempts
- unread Current Affairs in-app notifications
- latest automation run for each Current Affairs job type
- latest CP021 notification-materialization run

No summary state is materialized in a new table. The UI always reflects the canonical source, event, release, delivery and learner tables.

## Workspace tabs

### Overview

Shows high-level health and the live progression:

`queued → clusters → verified → conflicts/editorial → HI/PA → draft packs → release`

Learner-delivery cards show Question Bank promotions, published Current Affairs quizzes, learner usage and inbox state.

### Sources

Uses the existing source-health endpoint. Operators see trust, ingestion mode, primary-source status, last ingestion and queued candidate counts.

`Pull now` is deliberately available only for active `feed` / `feed_and_pdf` sources with a registered feed URL, because the canonical manual-pull API currently supports feed ingestion. Curated listing sources remain scheduler-managed and cannot be forced through an incompatible feed route.

Source pulls require `content.questions.update` and use the pre-existing `/admin/current-affairs/ingestion/pull/:sourceKey` endpoint.

### Editorial

Surfaces the existing English authoring and Hindi/Punjabi localization queues. It is a triage view, not a parallel authoring engine. Existing authoring/localization endpoints retain their originality, fact-parity, script and editorial-reason gates.

The workspace links into existing Content Review, Learning Resources and Question Studio surfaces where appropriate.

### Releases

Loads the CP014 release queue and release history. Ready packages show the canonical readiness decision and blocked packages show their actual blockers.

Approval/revocation remains explicit and permission-gated by the existing release-control APIs:

- `POST /admin/current-affairs/release-control/approve`
- `POST /admin/current-affairs/release-control/:id/revoke`

Both require `content.questions.publish` and an editorial reason of at least eight characters. CP022 does not write release rows directly.

### Automation

Shows recent Current Affairs automation runs and the latest CP021 in-app notification worker result. Job retry/cancel remains in the existing System Health workspace rather than creating another operational-job control model.

## Release and publication boundaries

CP022 does not change any existing lifecycle rule:

- scheduled workers still cannot approve Current Affairs releases
- Question Bank promotions remain BANK_ONLY
- learner quiz publication remains separately controlled
- EN/HI/PA release parity remains mandatory
- revocation continues to propagate through the existing CP014–CP021 guards
- no external push/email/SMS notification channel is introduced

## Validation

The focused CP022 workflow runs CP001–CP021 policy contracts, verifies the control-center API is read-only, confirms UI mutations use existing guarded endpoints, checks canonical migration assumptions, builds the API, typechecks the admin app and performs a full admin production build.
