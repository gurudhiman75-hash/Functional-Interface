# Current Affairs Studio CP026 — On-demand yesterday generation

CP026 makes the latest completed India-day Current Affairs materializable from the admin UI even when the scheduled morning pipeline was missed.

## Operator action

`Content → CA Production Readiness → Generate Yesterday Now`

The action targets `previousIndiaDate(now)` and executes the canonical pipeline in order:

1. refresh all configured active official feed/listing sources;
2. run bounded primary-page fact enrichment (up to three 100-candidate passes);
3. preserve manual fact authority and reconcile enriched existing events;
4. rerun clustering, promotion and strict verification (up to three bounded passes);
5. reconcile newly promoted events against primary-page enrichment;
6. invoke CP025 draft-only recovery to author/localize and materialize missing SSC/Banking/Punjab EN/HI/PA daily packs plus BANK_ONLY review questions;
7. reload readiness and return the concrete artifacts created or already present.

## Slot forcing without history deletion

Scheduled source/enrichment/intelligence jobs use three-hour run keys. Before an on-demand pass, CP026 preserves an already-finished current-slot row by renaming its technical run key with a `superseded:on_demand` suffix and annotating its stats. The normal scheduled runtime can then execute again using the canonical slot key.

A currently `running` scheduled stage is never superseded. The admin receives a clear error and can retry after the active job completes.

The same rule is applied to CP025 manual recovery so a recovery executed earlier in the slot cannot prevent newly refreshed data from being materialized.

## Safety boundary

Generate Yesterday Now has no learner-publication authority. It does not:

- approve Current Affairs questions;
- approve a CP014 release;
- promote questions into the canonical Question Bank;
- change BANK_ONLY/test/mock eligibility;
- publish learning resources or learner quiz deliveries;
- send notifications.

It stops at draft notes/localizations and review questions. Existing CP014–CP016 explicit editorial actions remain mandatory for learner publication.

## Result visibility

After the action finishes, the production-readiness page shows candidate/event counts and EN/HI/PA pack presence by SSC, Banking and Punjab. Generated packs remain visible under `Content → Learning Resources` as Current Affairs drafts.
