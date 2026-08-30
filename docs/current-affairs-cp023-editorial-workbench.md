# Current Affairs Studio CP023 — Editorial Workbench

CP023 adds the editor-facing workbench behind the CP022 Current Affairs control center.

## Purpose

Editors can move from the Current Affairs Studio editorial queues into a single event workspace that keeps learner wording anchored to canonical verified facts and evidence.

## Read model

`GET /admin/current-affairs/editorial/events/:id`

The endpoint is authenticated with `content.questions.read` and is deliberately read-only. It returns:

- canonical event state and verification confidence
- current immutable English authoring version
- all evidence-source links and trust metadata
- canonical facts and reconciliation state
- factual conflicts
- current Hindi/Punjabi localizations tied to the current English version
- recent English authoring history
- explicit read-only/editorial gate flags

No workbench-specific database table is introduced.

## Editing

The admin workbench uses the existing canonical mutation routes:

- English: `POST /admin/current-affairs/events/:id/authoring/manual`
- Hindi/Punjabi: `POST /admin/current-affairs/events/:id/localization/:languageCode/manual`

Therefore CP023 inherits the CP009 source-title originality gate, immutable English versioning, audit reason requirements, CP010 target-script/parity checks, and localization linkage to a specific English authoring version.

Saving English creates a new immutable authoring version. Existing Hindi/Punjabi localizations belong to the previous English version and are intentionally not treated as current; the workbench reloads canonical state and requires them to be reviewed again.

## Safety boundaries

- open factual conflicts make the editor read-only
- unverified events or events without verified facts are read-only
- source evidence is visible for verification, not copied into learner wording
- no direct DB mutation exists in the workbench read route or frontend page
- no release approval, publication or BANK_ONLY unlock is added
- all learner publication remains behind CP014+ release gates

## Admin UX

CP022 English/Hindi/Punjabi queue cards now deep-link to:

`/admin/content/current-affairs/editorial/:eventId`

The workbench shows a verified fact sheet, evidence sources, conflict state, English/Hindi/Punjabi editor tabs, current quality status and English authoring history.

## Validation

The CP023 workflow reruns CP001–CP021 policy contracts, verifies the workbench read model is read-only, confirms the UI reuses CP009/CP010 guarded mutation APIs, validates immutable schema assumptions, builds the API, typechecks the admin app and builds the production admin bundle.
