# Notes Studio NS-013 — Governed source-pack proposals

NS-013 reduces manual source-pack assembly by proposing already-governed sources that can fill missing NS-011 Source Policy requirements.

## Inputs

A proposal is derived only from:
- the target job's canonical taxonomy node/code/topic label;
- its current Source Policy template and missing requirements;
- existing `content.source_documents` records;
- prior included Notes Studio source usage;
- prior job-specific source roles;
- approved/materialized prior-use signals;
- existing rights/retention/extraction status.

There is no external network discovery in NS-013.

## Role safety

The proposal engine does not guess source roles from titles, publishers or URLs.

A source can fill a missing role only when that same governed source has previously been used in an allowed Notes Studio research role. This keeps role assignment evidence-based and reviewable.

Generation-ready Source Policy requirements additionally reject metadata-only/reference-only candidates.

## Ranking

Eligible candidates are ranked deterministically using:
1. canonical taxonomy/topic relevance inherited from NS-010;
2. strength of prior use in an allowed research role;
3. approved/materialized prior-use bonus;
4. a small publisher-diversity bonus inside the proposed pack.

One source cannot fill multiple missing slots in the same proposal.

## Review and apply boundary

`GET /admin/notes-studio/jobs/:id/source-pack-proposal` is read-only and returns a reviewable proposal.

`POST /admin/notes-studio/jobs/:id/source-pack-proposal/apply`:
- requires `content.questions.update`;
- is allowed only in `brief` / `sources_ready`;
- recomputes the proposal server-side at apply time;
- inserts only `content.note_authoring_sources` membership rows;
- preserves existing source-document rights, retention and extraction state;
- records one audit event for the editor-approved apply operation.

The browser never supplies trusted source IDs or roles for the apply operation.

## Explicit non-goals

NS-013 does not:
- search the public web;
- fetch/refetch URLs;
- upload or copy source bodies;
- create `content.source_documents` during proposal apply;
- invent research roles;
- accept claims/evidence;
- rebuild evidence;
- generate sections;
- approve/localize/materialize/publish learner content.

## Admin

The Notes Studio hub adds **Pack proposals** after Source diagnostics. Editors can inspect:
- current Source Policy state;
- candidate count;
- each proposed governed source;
- suggested research role and requirement filled;
- deterministic relevance reason/score;
- unresolved requirements that still need manual source work.

Applying a proposal is always an explicit editor action.

## Schema

No migration. NS-013 composes existing governed sources into existing source-pack memberships.
