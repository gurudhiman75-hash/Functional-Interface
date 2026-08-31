# Current Affairs Studio CP-027 — Production Editorial Activation

## Purpose

CP-027 activates the already-built Current Affairs editorial review capabilities on the production admin surface without widening publication authority.

CP-026 made yesterday's Current Affairs generation genuinely on-demand. It can refresh official sources, extract and reconcile facts, verify events, generate learner-note drafts, localize drafts and produce BANK_ONLY question drafts. Those artifacts deliberately remain draft/editorial material.

CP-027 adds the missing production review layer:

- a verified-event editorial queue;
- a verified-event wording editor;
- Hindi and Punjabi event-localization review;
- a BANK_ONLY question editorial queue;
- English question revision;
- Hindi and Punjabi question-localization review;
- BANK_ONLY editorial approval.

It does **not** activate release approval, Question Bank promotion, learner quiz publication, personalization, notifications or any automatic student-facing authority.

## Production route boundary

The production API keeps Current Affairs activation separate from the large legacy route tree.

`/api/admin/current-affairs` mounts two bounded routers:

1. the existing production operations router for readiness, recovery and Generate Yesterday;
2. the new CP-027 editorial activation router.

The editorial router exposes only:

- `GET /editorial/queue`
- `GET /editorial/events/:eventId`
- `POST /editorial/events/:eventId/english`
- `POST /editorial/events/:eventId/localization/:languageCode`
- `GET /question-editorial/queue`
- `GET /question-editorial/:generationItemId`
- `POST /question-editorial/:generationItemId/english`
- `POST /question-editorial/:generationItemId/localization/:languageCode`
- `POST /question-editorial/:generationItemId/approve`

No release, promotion, learner, notification or personalization endpoint is mounted by CP-027.

## Event editorial gates

The event queue contains verified, auto-promoted Current Affairs events only.

Manual English wording reuses the existing source-independent authoring runtime and preserves the source-headline similarity gate:

- the event must be verified;
- a manual editorial reason is required;
- the learner title must remain below the `0.72` source-title similarity threshold;
- learner wording is generated from the verified fact set, not copied from an evidence headline.

The event detail workspace shows the canonical event, evidence sources, facts, conflicts, current authoring version, localization state and authoring history.

The UI blocks editing when there is an open fact conflict or no verified fact set.

## Event localization gates

Hindi and Punjabi manual localization reuses the existing CP-010 runtime.

The runtime requires:

- a verified event;
- a current accepted English authoring version;
- an editorial reason;
- shared translation-quality approval;
- canonical fact-value parity;
- the expected target-language script.

The route supports only `hi` and `pa`.

## Question editorial gates

Question review is limited to the existing BANK_ONLY Current Affairs generation lifecycle.

The queue/runtime already enforce:

- verified event context;
- BANK_ONLY generation context;
- conflict gates;
- current generation-version integrity;
- localization parity/readiness;
- edit locks after downstream promotion/release state where applicable.

English editorial revision changes only the stem and explanation; it does not provide an option/correct-answer mutation surface.

Hindi and Punjabi manual question localization reuses CP-011 validation for:

- source option count and order;
- correct-index preservation;
- canonical fact-value preservation;
- target-language script;
- family-specific canonical-option rules.

BANK_ONLY editorial approval is not Question Bank promotion and is not learner publication.

## Admin routes

CP-027 adds:

- `/admin/content/current-affairs` — combined event/question editorial queue;
- `/admin/content/current-affairs/events/:eventId` — verified event wording/localization review;
- `/admin/content/current-affairs/questions/:generationItemId` — BANK_ONLY question review;
- the existing `/admin/content/current-affairs/production-readiness` remains the operations/readiness view.

## Permissions

Read operations require `content.questions.read`.

Editorial writes and BANK_ONLY question approval require `content.questions.update` and an authenticated administrator session.

Generate Yesterday and bounded recovery remain separately protected by their existing `jobs.manage` authority.

## CI authority lock

CP-027 extends the existing `current-affairs-production-activation.yml` workflow rather than creating a new workflow.

The cumulative Current Affairs policy suite still runs, followed by:

- production schema-bootstrap checks;
- draft-only on-demand authority checks;
- CP-027 route/client authority-boundary checks;
- bundle validation for both Generate Yesterday and the editorial activation router;
- API server build;
- admin typecheck;
- admin build.

CI explicitly rejects editorial-client `/release`, `/promotion` and `/learner` endpoint exposure and rejects release/promotion/quiz/notification module wiring in the CP-027 backend router.

## Safety invariants

CP-027 adds no database migration and grants no new content authority.

It does not:

- publish Current Affairs notes automatically;
- approve a Current Affairs release;
- promote questions into the canonical Question Bank;
- publish learner quizzes;
- notify learners;
- personalize learner feeds;
- bypass event verification;
- bypass fact-conflict gates;
- bypass source-title independence checks;
- bypass Hindi/Punjabi parity checks;
- change CP-026 on-demand generation semantics.
