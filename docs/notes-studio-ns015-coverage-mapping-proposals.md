# Notes Studio NS-015 — Reviewed Coverage Mapping Proposals

## Goal

Reduce the manual step of placing accepted evidence-grounded claims into the syllabus coverage plan without giving the model authority to change claim state, rewrite evidence, or advance learner content automatically.

NS-015 proposes claim-to-coverage links. The proposals remain stateless until an administrator explicitly selects and applies individual links.

## Model input boundary

The proposal model receives only:

- accepted claim IDs and claim text;
- non-excluded coverage item IDs;
- coverage title, syllabus reference, priority, planned depth and exam rationale; and
- note title/language metadata.

Claims are eligible only when they still have active supporting evidence from an included source.

Raw source excerpts, source documents, source-library bodies and learner section drafts are not sent to this model.

## Scope and batching

V1 proposes initial placement only for accepted claims that currently have no `content.note_coverage_item_claims` rows.

This makes repeated proposal runs naturally work through the unmapped backlog while leaving existing editor mappings untouched.

Operational bounds:

- at most 120 unmapped accepted claims per generation batch;
- at most 80 active coverage items per note;
- at most 4 proposed coverage targets per claim; and
- at most 300 reviewed links per apply request.

A coverage plan larger than 80 active targets is rejected for model-assisted mapping rather than silently truncating the syllabus context.

## Structured proposal contract

Prompt version: `notes-coverage-proposals-v1`.

For each clearly mappable claim the model returns:

- `claimId`;
- one to four `coverageItemIds`;
- mapping confidence; and
- a short editorial rationale.

The server rejects any claim ID outside the accepted input set and any coverage ID outside the supplied plan.

Weak or ambiguous claims may be omitted rather than force-mapped.

## Generation endpoint

`POST /admin/notes-studio/jobs/:jobId/coverage-proposals/generate`

Requirements:

- `content.questions.update`;
- job state `evidence_ready` or `outline_ready`;
- accepted claim with active supporting evidence; and
- at least one non-excluded coverage item.

Generation is read-only with respect to coverage mappings. It writes only an audit event and returns the proposal payload to the editor.

## Apply endpoint

`POST /admin/notes-studio/jobs/:jobId/coverage-proposals/apply`

The browser submits only the individual links the editor reviewed and selected.

Before writing, the server revalidates every selected claim and coverage target:

- claim belongs to the authoring job;
- claim is still `accepted`;
- claim still has active supporting evidence;
- coverage item belongs to the authoring job; and
- coverage item is not excluded.

Approved links are inserted into the existing `content.note_coverage_item_claims` table with normal uniqueness protection. Readiness is then recomputed by the existing Notes Studio lifecycle helper.

## Lifecycle boundary

NS-015 is available in `evidence_ready` and `outline_ready` only.

Once section drafting begins, coverage research is frozen for that authoring version. New factual/coverage work should use the existing successor-revision workflow.

## Audit

Generation event: `notes_studio.coverage_proposals.generated`

It records provider/model, response/usage metadata, prompt version, stable input/output fingerprints, batch/backlog sizes, proposal count and explicit flags confirming:

- accepted-claims-only input;
- no raw source text;
- no automatic application; and
- no learner publication.

Apply event: `notes_studio.coverage_proposals.applied`

It records reviewed/created/duplicate link counts and explicitly confirms:

- editor-applied links;
- no automatic model application;
- no claim-state change; and
- no learner publication.

## Admin workflow

The Notes Studio hub adds **Coverage proposals** after Candidate claims and before Evidence & coverage.

Editors can:

1. choose an evidence/outline-ready authoring job;
2. see accepted-supported and currently-unmapped claim counts;
3. generate bounded placement suggestions;
4. inspect claim text, proposed syllabus target, confidence and rationale;
5. select individual links; and
6. apply only the reviewed links.

Existing manual Evidence & coverage controls remain authoritative for refinements or multi-target additions after initial placement.

## Explicit non-goals

NS-015 does not:

- discover or fetch sources;
- inspect raw source text in the mapping model;
- create or modify claims;
- accept/reject/conflict claims;
- create coverage items;
- remove or replace existing coverage mappings;
- generate sections;
- run QA;
- approve/localize/materialize notes; or
- publish learner content.

## Configuration

The provider uses `NOTES_STUDIO_COVERAGE_MODEL` when configured and otherwise falls back to `NOTES_STUDIO_MODEL`, with the existing Notes Studio/OpenAI credential chain.
