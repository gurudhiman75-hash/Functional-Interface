# Notes Studio NS-009 — syllabus-driven planning

## Purpose

NS-009 adds a governed planning layer before the existing Notes Studio authoring pipeline. Its job is to turn the canonical exam taxonomy into a bounded backlog of note briefs so editors can plan whole syllabus areas systematically instead of creating every authoring job by hand.

The planning layer is **not** a factual source. Taxonomy determines what should be covered; NS-002+ evidence still determines what may be stated in learner notes.

## Canonical inputs

A planning batch freezes:

- one active canonical exam;
- that exam's current `catalog.exam_versions` row;
- one active canonical taxonomy root;
- source language;
- note depth and learner level;
- selected note-worthy taxonomy unit types;
- the expansion policy used to select units.

V1 note-worthy unit types are `topic`, `subtopic`, and `chapter`. Subject/section nodes may be used as roots but are not emitted as note items by default. `canonical_problem` and `skill` remain Question Studio concepts rather than standalone note units in this checkpoint.

## Expansion policy

The API walks `catalog.taxonomy_edges` downward from the selected root and keeps only nodes that are inside an active `catalog.exam_taxonomy_nodes` mapping for the frozen exam version.

The default `leafOnly` policy keeps the deepest selected topic/subtopic/chapter units. This prevents a plan from simultaneously scheduling both a broad topic note and all of its selected child notes unless an editor explicitly asks for all selected levels.

Safety bounds:

- recursive traversal stops at depth 12 and prevents cycles;
- one plan may contain at most 250 note units;
- one bulk job-creation request may create at most 100 authoring jobs;
- the admin UI creates at most 50 jobs per click by default.

Selections larger than the plan cap must be narrowed by choosing a more specific canonical root.

## Frozen planning items

`content.note_planning_batches` stores the exam/version/root and planning policy.

`content.note_planning_items` stores one row per selected taxonomy unit together with a small taxonomy snapshot, coverage target, priority, position and lifecycle state.

Planning-item states are:

- `planned`
- `job_created`
- `skipped`

Once a planning item creates an authoring job, that linkage is one-to-one and cannot be changed into a different job. Taxonomy edits made later do not silently rewrite the frozen plan; editors create a new plan when they intentionally want a new syllabus snapshot.

## Target coverage

The canonical `exam_taxonomy_nodes.target_coverage` value is copied into the plan as a scheduling hint and used to derive a coarse authoring priority. It is **not** evidence, a factual confidence score, or permission to generate learner claims.

## Authoring-job handoff

Bulk creation creates normal `content.note_authoring_jobs` in `brief` state only. The brief records:

- canonical taxonomy node ID/code;
- planning batch and item IDs;
- frozen exam ID;
- requested depth and learner level;
- a short syllabus emphasis derived from the taxonomy snapshot.

After that point the existing Notes Studio gates remain unchanged:

`brief → sources → evidence → coverage → sections → QA → review → approval → localization → release handoff`

## Automation boundary

NS-009 does **not**:

- ingest sources automatically;
- accept evidence automatically;
- generate sections automatically;
- approve learner wording automatically;
- localize automatically;
- materialize learner resources automatically;
- publish learner content automatically.

Creating a planning batch is a backlog operation. Creating jobs from a batch is a brief-creation operation. Public publication remains the explicit canonical Learning Resources action.

## V1 scope choices

Planning is deliberately one exam/current-version at a time. Cross-exam note reuse/deduplication is deferred because two exams can share a taxonomy concept while requiring different depth, emphasis, examples or learner targeting. A later optimization layer can propose reuse only after the canonical single-exam planning behavior is established and auditable.

## Validation

The dedicated NS-009 workflow validates planning policy contracts, migration/readiness registration, API mounting, automation-off boundaries, API build and admin TypeScript. The existing NS-008 fresh-PostgreSQL workflow also applies the extended migration manifest so the planning schema is exercised on an empty database with only the minimal canonical dependencies bootstrapped for CI.
