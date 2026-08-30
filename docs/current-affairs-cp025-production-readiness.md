# Current Affairs Studio CP025 — Production Readiness & Daily Operations

CP025 adds an operational answer to one question: **is the latest completed India-day Current Affairs package actually ready for learners?**

## Readiness gate

The target operating date is the previous complete India calendar day. Its daily readiness deadline is 07:00 IST on the following day.

The gate is red/amber/green and evaluates separate evidence layers:

- primary-source scheduled-poll coverage (minimum 80%)
- critical primary-source freshness (six-hour source SLA)
- successful feed/listing and intelligence worker freshness (four-hour worker SLA)
- discovery queue operating envelope
- open factual conflicts
- SSC/Banking/Punjab English daily drafts
- Hindi/Punjabi draft parity
- Current Affairs English question approval completion
- CP014 release readiness and explicit approval
- CP016 learner quiz publication

Green means all three default exam-family packages are learner ready. Amber means the pipeline is healthy but editorial/release work remains. Red means a source/pipeline/conflict SLA is broken or a post-deadline English daily pack is missing.

## Missing-day detection

The admin read model checks the latest seven days for verified, exam-relevant events that should have produced an English daily compilation but did not. Days with no verified relevant events are not falsely marked missing.

## Bounded automatic recovery

A new Render worker runs at minute 50 every three hours, after the canonical 0/10/20 discovery/enrichment/orchestration pipeline.

Recovery is idempotent and may only:

- rerun source-independent authoring on eligible verified events
- rerun note localization
- create a missing English daily draft for SSC/Banking/Punjab when eligible verified events exist
- create the associated BANK_ONLY review-question run
- backfill Hindi/Punjabi daily drafts
- backfill Hindi/Punjabi question-localization sidecars

Recovery never approves CP014 releases, publishes learning resources, promotes CP015 canonical Question Bank records, changes taxonomy, or sends notifications.

Failed official-source polls are not aggressively hammered by recovery; the normal three-hour ingestion schedule performs the next network retry. Operators can still use the existing guarded source-pull control when appropriate.

Every recovery pass is recorded in `content.current_affairs_ops_runs` with target date, trigger mode, counts, actions, failure state and timestamps.

## Admin operations

`GET /admin/current-affairs/production/readiness` is read-only and requires `content.questions.read`.

`GET /admin/current-affairs/production/recovery-runs` requires `jobs.read`.

`POST /admin/current-affairs/production/recover` requires `jobs.manage` and runs the same bounded draft-only recovery path manually.

The admin app exposes `/admin/content/current-affairs/production-readiness` with RAG status, SLA checks, per-family completeness, blockers/warnings, primary-source health, missing days and recent recovery history.
