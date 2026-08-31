# Notes Studio NS-020 — Governed Bulk Coverage Plan Import

## Why

The Punjab River System production pilot exposed a real operator-scale gap: a comprehensive note can have a reviewed syllabus plan with many coverage targets, while the existing Evidence & Coverage workspace creates them one at a time.

NS-020 adds a generic bulk-import path. It is not a Punjab-specific feature and it does not generate a coverage plan by itself.

## Endpoint

`POST /admin/notes-studio/jobs/:jobId/coverage/bulk`

Body:

```json
{
  "items": [
    {
      "title": "Core syllabus concept",
      "syllabusRef": "Subject → Topic → Concept",
      "priority": "required",
      "plannedDepth": "standard",
      "examRationale": "Why this target matters for the exam.",
      "sortOrder": 0
    }
  ]
}
```

## Bounds

- 1–50 targets per import.
- Allowed priorities: `required`, `high`, `supporting`, `exclude`.
- Allowed depths: `brief`, `standard`, `deep`.
- Missing priority defaults to `required`.
- Missing depth defaults to `standard`.
- Missing sort order defaults to payload order.
- Duplicate title + syllabus-reference pairs inside the payload are rejected.
- A target that duplicates an existing title + syllabus-reference pair in the job is rejected.
- Validation happens before the transaction; inserts and the audit record are written atomically.

## Lifecycle

Bulk import is available only while the coverage scope can still be established safely:

- `brief`
- `sources_ready`
- `evidence_ready`
- `outline_ready`

It is blocked once section drafting starts (`drafting`, `qa_required`, `review_ready`, `approved`, `materialized`) so existing section/QA work cannot silently become stale.

This checkpoint does not change the existing one-at-a-time coverage editor. Small editorial corrections can continue to use that surface.

## Admin

Adds **Coverage Import** to Notes Studio.

The workspace:

- selects an authoring job;
- shows lifecycle/editability state and current coverage count;
- accepts either a raw JSON array or `{ "items": [...] }`;
- previews the parsed item count/content client-side;
- submits the plan to the server for authoritative validation;
- makes the atomic append-only behavior explicit.

## Safety invariants

Coverage import creates only `content.note_coverage_plan_items` and one audit event. It does not:

- attach or mutate sources;
- rebuild evidence;
- create candidate claims;
- accept/reject claims;
- map claims to coverage;
- generate sections;
- run QA;
- approve/localize/materialize/publish.

The audit metadata records those automatic actions as false.

## CI

No new GitHub Actions workflow is added. The cumulative NS-008 production-readiness contract now covers:

- allowed/blocked lifecycle states;
- normalization/defaulting;
- order preservation;
- duplicate detection;
- count limits;
- invalid priority rejection.

The existing production-readiness workflow then builds the API server and typechecks the full admin app.
