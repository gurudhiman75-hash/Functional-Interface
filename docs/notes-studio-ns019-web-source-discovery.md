# Notes Studio NS-019 — Governed Web Source Discovery

## Purpose

NS-019 removes the remaining manual-search bottleneck in the Notes Studio research loop without turning web search into factual authority.

It answers one bounded question:

> Which public source URLs look worth editorial review for this note or research gap?

Discovery is a lead-generation step only. A search result is not evidence, a claim, an accepted fact, a source-pack member or learner content.

## Provider

NS-019 reuses the existing Notes Studio OpenAI Responses client and API-key configuration.

The research model is resolved from:

1. `NOTES_STUDIO_RESEARCH_MODEL`, when configured; otherwise
2. the existing `NOTES_STUDIO_MODEL`.

The API key remains `NOTES_STUDIO_OPENAI_API_KEY` with the existing `OPENAI_API_KEY` fallback.

The provider enables the Responses API web-search tool and requests the web-search call's source list. Model prose is deliberately discarded. Only URLs returned by the web-search tool call enter the discovery result.

## Query construction

The editor may supply a focused research phrase. The server combines that with the existing Notes Studio brief and emits at most four bounded queries:

- explicit editor focus;
- topic + syllabus emphasis;
- topic + official-government-source intent;
- topic + authoritative-reference intent.

Duplicate or empty queries are removed.

## Candidate URL boundary

Only public HTTP/HTTPS candidates are retained.

The deterministic filter rejects:

- localhost / loopback;
- `.local` hosts;
- RFC1918-style private IPv4 ranges;
- link-local IPv4;
- non-web schemes such as `file:`.

Fragments and common tracking parameters are removed before deduplication.

Results are bounded to twenty candidate URLs.

## Discovery ranking

Ranking is intentionally simple and deterministic because it is a discovery aid, not a source-trust verdict.

- Government-domain candidates receive the highest discovery rank.
- University / institutional domains receive the next rank.
- Other public web references remain visible at a lower rank.

This ranking never assigns a Notes Studio research role such as `primary_authority`, and it never decides rights, factual reliability or evidence acceptance.

## Governed-source enrichment

After web discovery, Notes Studio checks the canonical `content.source_documents` library by exact source URL.

When a candidate is already governed, the UI shows its existing source identity and whether it is already attached to the current job. An editor can explicitly reuse the existing governed record while the source pack is editable.

A new candidate URL is not inserted into `content.source_documents` by discovery.

## Explicit intake and rights

For a new candidate, the editor must:

1. open/review the source page;
2. choose the applicable rights basis;
3. explicitly invoke the existing URL source-intake action.

Rights are never inferred from a government, university or institutional domain.

The existing intake pipeline remains responsible for public-URL validation, bounded fetching, readable-text extraction, content-hash duplicate protection and retention behavior. `reference_only` remains available when retained evidence text is not authorized.

## Lifecycle

Discovery is available for unapproved authoring states, including progressed jobs whose source pack is already frozen.

- In `brief` / `sources_ready`, the editor may explicitly attach or reuse a reviewed candidate.
- After evidence work begins, discovery remains read-only with respect to the source pack. NS-018 research restart is required before a new source can be attached.
- Approved or materialized work cannot run new discovery in place; it must use the successor-revision lifecycle.

## Audit

Every successful discovery run writes only an audit event containing bounded operational metadata such as provider/model, prompt version, query/search-call counts and candidate domains.

The audit contract explicitly records that discovery did not:

- return raw source bodies;
- create source documents;
- attach sources automatically;
- create evidence;
- create facts or claims;
- generate learner content.

## Admin workspace

Notes Studio adds **Web discovery** alongside the existing source workflow.

The workspace exposes:

- authoring-job selection;
- optional research focus;
- the exact queries sent;
- candidate domains/URLs and discovery authority class;
- already-governed / already-attached status;
- source-page opening for human review;
- explicit governed-source reuse;
- explicit new-URL intake with chosen rights basis;
- frozen-source-pack guidance to the NS-018 restart path.

## Schema and CI

NS-019 requires no database migration.

No new GitHub Actions workflow is added. The existing NS-008 cumulative Notes Studio production-readiness workflow already runs for changes under Notes Studio model/route/admin paths. Its existing `production-readiness.test.ts` now also verifies the NS-019 lifecycle, query bounds, URL safety, ranking and web-search-source extraction contract, after which the workflow builds the API server and typechecks the full admin app.

## Safety invariants

- search-result URLs are leads, not facts;
- model prose from discovery is discarded;
- no raw source body is returned by discovery;
- no source is automatically governed or attached;
- no rights basis is inferred;
- no evidence or claim is automatically accepted;
- no coverage mapping is created;
- no section is generated;
- no approval, localization, materialization or publication authority is added.
