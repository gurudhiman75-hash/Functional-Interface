# Quant V4 Education Layer Migration Plan

## Migration principle

PLATFORM-INF-002 is additive. Existing chapters should continue unchanged until a chapter-specific migration phase is scheduled.

## Phase 0 — Platform foundation

Completed in this task:

- Create `shared/education/`.
- Add shared educational libraries.
- Add TypeScript contracts.
- Add optional traceability adapter.
- Add documentation and authoring guidance.

## Phase 1 — New package adoption

All new Quant V4 packages should:

1. select relevant strategy IDs during package design;
2. tag known shortcuts and traps in renderer metadata;
3. use realism IDs for context selection;
4. use terminology entries while writing explanation lines;
5. cite pedagogy rules in human-review/audit notes;
6. emit optional `education` references in traceability.

## Phase 2 — Existing package soft migration

For each existing package:

1. Map canonical problem IDs to strategy IDs.
2. Map known shortcut opportunities to shortcut IDs.
3. Map known misconceptions to trap IDs.
4. Map semantic/context assets to realism IDs.
5. Replace inconsistent explanation wording with terminology entries.
6. Add education traceability through `buildQuantV4EducationTraceability()` or `mergeQuantV4EducationTraceability()`.

No math, solver, or validator changes are required.

## Phase 3 — Audit integration

Education-aware auditors should report:

- strategy coverage by CP;
- shortcut coverage where applicable;
- trap coverage for known trap-prone CPs;
- realism diversity;
- terminology violations;
- pedagogy-rule violations.

These reports can later feed CONTENT_READY or PRODUCTION_READY maturity decisions.

## Phase 4 — Enforcement

Only after enough packages adopt the layer:

- require valid education IDs for new production packages;
- block invalid references;
- require trap coverage for trap-prone CPs;
- include realism and pedagogy coverage in maturity gates;
- add multilingual alignment checks for terminology and pedagogy.

## Rollback

Because this layer is additive and currently not required by chapter runtime, rollback is simple: stop importing it in future consumers or remove education references from traceability. Existing package generation is unaffected.
