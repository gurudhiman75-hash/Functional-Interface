# Notes Studio NS-016 — Coverage-Gap Research Briefs

## Goal

Turn unresolved required/high syllabus coverage into a concrete editorial research queue without asking the model to answer factual questions or silently creating new evidence/claims.

This checkpoint closes the loop after candidate extraction and reviewed coverage mapping:

1. accepted claims are mapped to the syllabus;
2. required/high targets that remain uncovered, partial or blocked are identified from the canonical coverage state;
3. the model produces neutral questions and evidence needs; and
4. editors use the existing governed source/evidence workflow to research those gaps.

## Gap selection

The server targets only `required` and `high` coverage items whose canonical computed state is:

- `uncovered`;
- `partial`; or
- `blocked`.

Covered targets are excluded.

Research generation is available only while the authoring job is `evidence_ready` or `outline_ready`. Once section drafting starts, new factual research belongs in a successor revision.

## Model input boundary

For each gap the model receives:

- coverage item ID/title;
- syllabus reference;
- priority and planned depth;
- exam rationale;
- computed gap status; and
- only already-accepted claims with active supporting evidence that are currently linked to that coverage item.

The model does **not** receive:

- raw source excerpts;
- full source documents;
- candidate/rejected/conflict claim text;
- learner section drafts; or
- unrestricted web content.

## Output contract

Prompt version: `notes-coverage-gap-research-v1`.

Each research brief contains:

- one supplied coverage item ID;
- 1–6 neutral research questions;
- 1–6 evidence-need descriptions;
- a preferred governed source role for each evidence need; and
- 1–5 suggested search-query phrases.

Allowed source roles are the existing Notes Studio roles:

- `primary_authority`;
- `core_reference`;
- `exam_context`; and
- `supplemental`.

The server rejects any output coverage ID outside the supplied gap batch.

## Non-factual authoring boundary

The prompt explicitly tells the model:

- do not answer research questions;
- do not invent factual claims, dates, numbers, names, definitions, examples, exceptions, comparisons, causes or conclusions;
- use accepted claims only to avoid redundant research questions;
- describe what must be verified rather than what the true answer is;
- do not browse or cite URLs; and
- do not claim an external source exists.

The output is editorial planning metadata only.

## Operational bounds

- at most 30 core coverage gaps per generation batch;
- at most 20 existing accepted claim texts supplied per gap;
- at most 6 research questions per gap;
- at most 6 evidence needs per gap; and
- at most 5 search phrases per gap.

The response includes total gap count and batch gap count so editors can see when another planning pass is needed.

## API

`POST /admin/notes-studio/jobs/:jobId/coverage-gap-research/generate`

Permission: `content.questions.update`.

This endpoint is stateless with respect to source, evidence, claim and coverage tables. It writes only an audit event.

## Audit

Successful generation emits:

`notes_studio.coverage_gap_research.generated`

with provider/model, response/usage metadata, prompt version, stable input/output fingerprints, gap counts and explicit safety flags:

- `acceptedClaimTextOnly: true`;
- `rawSourceTextSent: false`;
- `factualAnswersRequested: false`;
- `automaticSourceDiscovery: false`;
- `automaticClaimCreation: false`;
- `automaticCoverageMutation: false`; and
- `learnerPublished: false`.

## Admin workflow

The Notes Studio hub adds **Coverage-gap research** after Coverage proposals.

Editors can:

1. choose an evidence/outline-ready authoring job;
2. generate the current unresolved core research queue;
3. see target status, priority, depth and already-accepted facts;
4. review questions to resolve;
5. review the evidence/source role needed; and
6. use the existing Source library, Pack proposals and Brief & sources workspaces to gather governed material.

After evidence is rebuilt, editors can use Candidate claims / Evidence & coverage again.

## Explicit non-goals

NS-016 does not:

- browse or search the web;
- fetch or attach a source;
- change source policy;
- build evidence blocks;
- create/edit/accept/reject claims;
- change coverage mappings;
- generate learner sections;
- run QA;
- approve/localize/materialize notes; or
- publish learner content.

## Configuration

The provider checks `NOTES_STUDIO_RESEARCH_MODEL`, then `NOTES_STUDIO_COVERAGE_MODEL`, then `NOTES_STUDIO_MODEL`, and uses the existing Notes Studio/OpenAI credential chain.
