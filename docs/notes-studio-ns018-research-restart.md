# Notes Studio NS-018 — Governed Research Restart

## Purpose

NS-018 closes the operational gap that appears after NS-017 recommends a better governed source for an authoring job whose source pack is already frozen by evidence work.

It adds one explicit pre-approval action:

> discard derived research/drafting artifacts, preserve the editorial coverage plan and current governed source pack, and return the same job to source collection so the editor can deliberately add or change sources and rebuild evidence from scratch.

This is not a rollback of approved learner content and it is not an automatic source-attachment feature.

## When restart is allowed

A research restart is available only for unapproved jobs in these progressed states:

- `evidence_ready`
- `outline_ready`
- `drafting`
- `qa_required`
- `review_ready`

Jobs in `brief` or `sources_ready` can already edit the source pack directly and therefore do not need a restart.

Jobs that have an approved version, or are already `approved` / `materialized`, remain immutable and must use the existing successor-revision lifecycle instead.

## What is preserved

A restart deliberately preserves:

- the same authoring job identity;
- the frozen syllabus / coverage-plan items;
- the existing governed source-pack membership and source roles;
- the optional gap and recommended-source intent that motivated the restart;
- immutable restart history.

The recommended source is recorded only as intent. It is never attached automatically.

## What is discarded

The restart removes derived work that would otherwise be stale after source-pack changes:

- evidence blocks;
- candidate / accepted / conflict claims;
- claim-to-coverage mappings;
- generated sections and their section-claim/block rows;
- QA runs/checks through section cascade;
- section-generation events.

The editor must rebuild evidence after completing the revised source pack.

## Target state

After the discard, the job returns to:

- `sources_ready` when at least one included generation-ready governed source remains; or
- `brief` when no generation-ready source remains.

Source-pack mutation is then legal again under the existing NS-017 database freeze rule.

## Immutable restart ledger

Migration `20260831_notes_studio_ns018_research_restart.sql` adds `content.note_research_restarts`.

Every restart records:

- monotonically increasing restart number per job;
- prior and target job states;
- editor reason;
- optional coverage-gap identity;
- optional governed recommended-source identity;
- snapshot counts of discarded derived records;
- preserved research intent;
- actor and timestamp.

A database trigger rejects UPDATE and DELETE on restart records.

## Admin workflow

The existing **Gap sources** workspace now supports the restart handoff.

For an unresolved core gap the editor can:

1. review the NS-016 research brief;
2. inspect NS-017 governed source recommendations;
3. preview the source;
4. enter a restart reason;
5. explicitly restart research for the gap, optionally recording a recommended source as intent;
6. move to the existing source-pack workflow and explicitly attach or change governed sources;
7. rebuild evidence and repeat claim review, coverage mapping, section synthesis and QA.

No source is attached by the restart action itself.

## Safety invariants

- no external URL is fetched by the restart endpoint;
- no new `source_documents` row is created;
- no `note_authoring_sources` row is inserted automatically;
- no evidence is accepted automatically;
- no claim is accepted automatically;
- no section is generated automatically;
- no approval, localization, materialization or learner publication authority is added;
- approved/materialized work cannot be restarted in place.

## Production readiness

NS-018 is part of the ordered Notes Studio migration manifest. Production schema inspection requires both:

- relation `content.note_research_restarts`;
- trigger `note_research_restarts_immutable`.

The existing fresh-PostgreSQL Notes Studio readiness workflow therefore exercises the cumulative migration chain including NS-018, while the dedicated NS-018 workflow checks restart-state rules, discard accounting, route safety boundaries, API build and admin typecheck.
