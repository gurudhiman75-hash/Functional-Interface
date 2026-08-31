# Notes Studio NS-014 — Candidate Claim Extraction

## Goal

Reduce the manual step between a governed evidence index and atomic claim review without weakening Notes Studio's evidence or editorial boundaries.

NS-014 lets an editor select bounded evidence blocks and ask the existing Notes Studio model provider to propose atomic factual claims. Every proposal is persisted as `candidate` and must still pass the existing editorial claim-review workflow before it can support coverage or section synthesis.

## Input boundary

The browser selects 1–40 active evidence block IDs from the existing `content.note_source_evidence_blocks` index.

The server independently revalidates that every selected block:

- belongs to the target authoring job;
- comes from an `included` source;
- comes from a source whose retention mode is `extracted_text`; and
- remains successfully processed.

The source-pack policy is recomputed server-side before model execution and must still be ready, including independent-content and publisher/domain requirements.

The model receives only the selected bounded excerpts plus source titles and stable evidence IDs. It does not receive unrestricted source documents, source-library bodies, learner drafts, accepted sections, or external web content.

## Model contract

Prompt version: `notes-claim-extraction-v1`.

The model must return strict structured JSON containing at most 60 candidate claims. Each claim contains:

- one atomic `claimText`;
- a support-directness confidence value from 0–1;
- an optional contradiction key; and
- 1–8 evidence block IDs from the editor-selected input set.

The server rejects any model output that references an evidence ID outside that exact set.

## Persistence

New output is written only to the existing evidence model:

- `content.note_source_claims` with `state='candidate'`;
- `content.note_source_claim_evidence` with `relation='supports'`.

Existing `(job_id, claim_hash)` uniqueness remains authoritative. Equivalent claims are skipped rather than overwritten.

No new database migration is required.

## Audit

Successful extraction writes `notes_studio.claim_candidates.extracted` to `platform.audit_events`, including:

- provider/model;
- prompt version;
- model response ID and bounded usage metadata;
- stable input/output fingerprints;
- selected block count;
- generated/created/duplicate counts; and
- explicit automation-off flags.

## Lifecycle boundary

V1 extraction is allowed only while the authoring job is in `evidence_ready`. Once downstream outline/drafting work begins, additional factual research should happen through the existing successor-revision lifecycle rather than silently changing the evidence base underneath drafted learner copy.

## Explicit non-goals

NS-014 does not:

- discover or fetch sources;
- change source rights/retention;
- accept or reject a claim;
- resolve contradictions;
- link claims to coverage items;
- create coverage items;
- generate sections;
- run QA;
- approve/localize/materialize notes; or
- publish learner content.

## Admin workflow

The Notes Studio hub adds **Candidate claims** between Pack proposals and Evidence & coverage.

Editors can:

1. choose an evidence-ready job;
2. verify source-policy readiness;
3. search active evidence excerpts;
4. select up to 40 blocks;
5. extract candidate claims; and
6. continue claim review in **Evidence & coverage**.

## Configuration

The provider uses `NOTES_STUDIO_EVIDENCE_MODEL` when configured, otherwise it falls back to `NOTES_STUDIO_MODEL`. It uses the existing Notes Studio/OpenAI credential chain.
