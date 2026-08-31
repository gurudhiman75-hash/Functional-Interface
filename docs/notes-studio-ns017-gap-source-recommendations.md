# Notes Studio NS-017 — Gap → Source Recommendations

## Purpose

NS-017 closes the editorial research loop between unresolved syllabus coverage and the governed Notes Studio source library.

It answers one bounded question:

> Which already-governed sources have previously produced accepted, actively-supported claims for the same or closely related Notes Studio syllabus coverage?

The checkpoint does not browse the web, create facts, attach sources, rebuild evidence, accept claims, generate sections or publish learner content.

## Target gaps

The recommendation endpoint considers only current coverage-plan items that are:

- `required` or `high` priority; and
- currently `uncovered`, `partial` or `blocked` under the existing accepted-claim / active-support coverage calculation.

Covered core targets are excluded.

## Historical eligibility

A historical source can contribute recommendation evidence only when all of the following are true:

1. the historical claim is `accepted`;
2. the claim is linked to a Notes Studio coverage item;
3. the claim has a `supports` relationship to an evidence block;
4. that evidence block comes from a source that was `included` in the historical job;
5. the source is still generation-ready under the existing retention/extraction contract:
   - `retention_mode = 'extracted_text'`
   - `extraction_status = 'processed'`
   - at least 100 retained characters.

Candidate, rejected and conflict claims do not contribute source-yield evidence.

## Ranking signals

For every unresolved core gap, eligible governed sources are scored using deterministic signals:

1. exact historical syllabus-reference matches;
2. token-overlap similarity between historical and target coverage text;
3. prior use on the same canonical taxonomy node;
4. prior use on the same canonical taxonomy code;
5. number of accepted claims historically supported by the source;
6. number of prior Notes Studio jobs in which it produced relevant accepted evidence;
7. prior approved/materialized use;
8. a small bonus when the source adds a publisher/domain identity not already present in the target source pack.

A source whose content hash duplicates a source already attached to the target job is excluded. Non-generation-ready sources are excluded from research-gap recommendations.

The result is bounded to five recommendations per coverage gap and fifty recommendations per request.

## Research-role signal

NS-017 never invents a source role from a title, URL or publisher.

`recommendedRole` is derived only from the role(s) that the same governed source previously held when it produced accepted evidence. The UI presents this as historical guidance rather than new factual authority.

## Read-only recommendation boundary

`GET /admin/notes-studio/jobs/:jobId/gap-source-recommendations` is read-only.

It returns source metadata and scoring evidence but does not:

- return unrestricted retained source bodies;
- fetch external URLs;
- insert `content.source_documents`;
- insert `content.note_authoring_sources`;
- accept or change claims;
- create evidence blocks;
- create coverage mappings;
- generate learner sections;
- approve, localize, materialize or publish learner content.

An editor may explicitly preview a governed source using the existing bounded source-preview endpoint.

## Source-pack immutability hardening

Earlier Notes Studio policy already froze source-pack templates and source research roles when evidence work began. NS-017 closes the remaining lower-level mutation path.

Migration `20260831_notes_studio_ns017_source_pack_freeze.sql` adds a fail-closed trigger on `content.note_authoring_sources`.

Source membership, inclusion state, research role and source identity can change only while the authoring job is:

- `brief`; or
- `sources_ready`.

Once the job progresses to evidence work or later, a source-pack mutation raises a database error. Additional research must use the existing successor-revision lifecycle, which rebuilds evidence and QA rather than silently changing an established evidence base.

## Editor workflow

For an unresolved coverage gap:

1. review the NS-016 coverage-gap research brief;
2. inspect NS-017 governed historical source recommendations;
3. preview candidate governed sources;
4. if the job is still pre-evidence, use the existing explicit Source Library / source-pack workflow to attach a reviewed source;
5. if the job has progressed beyond source collection, create a successor revision first;
6. rebuild evidence and continue through candidate-claim review, coverage mapping, synthesis and QA.

## Production readiness

The ordered Notes Studio migration manifest includes the NS-017 source-pack freeze migration and schema inspection requires the new trigger `note_authoring_sources_pre_evidence_freeze`.

The existing NS-008 fresh-PostgreSQL workflow therefore applies the new migration as part of the cumulative Notes Studio chain.

## Safety invariants

- historical success is recommendation evidence, not factual truth for the new note;
- accepted facts still require evidence in the current authoring job;
- no source is automatically attached;
- no claim is automatically accepted;
- no coverage link is automatically created;
- no learner wording is generated by NS-017;
- no publication authority is added.
