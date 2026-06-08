# NS-DIV-001 File Inventory

Date: 2026-06-03

Scope: `artifacts/api-server/src/quant-v3/topics/NumberSystem/subtopics/Divisibility/archetypes/NS-DIV-001`

Classification meanings:

| Classification | Meaning |
|---|---|
| ACTIVE | Current implementation, current human-owned library, or current source-of-truth specification. |
| SUPERSEDED | Replaced by a later library, implementation, or specification, but retained for review history. |
| HISTORICAL | Audit, review, planning, or phase evidence that is no longer a runtime source of truth. |
| REDUNDANT | Temporary or duplicated asset that can be considered for deletion or archival after human approval. |

## Root Files

| File | Classification | Notes |
|---|---:|---|
| `archetype.md` | ACTIVE | Archetype-level definition for NS-DIV-001. |
| `canonical-problems.md` | ACTIVE | Canonical problem register and CP ownership overview. |
| `difficulty-spec.md` | SUPERSEDED | Superseded by `realism-library/difficulty-bands.library.json` for registered difficulty bands. |
| `distractor-spec.md` | HISTORICAL | Distractor generation remains out of scope for the implemented CP-001 and CP-002 pipelines. |
| `explanation-renderer.ts` | ACTIVE | Runtime explanation rendering for CP-001 and CP-002. |
| `explanation-spec.md` | SUPERSEDED | Superseded for runtime control by `explanation-variants.library.json`, `explanation-styles.library.json`, and `explanation-renderer.ts`. |
| `index.ts` | ACTIVE | Public export surface for NS-DIV-001. |
| `instance-generator.ts` | ACTIVE | Structural-pattern instance generation and fixed-template fixture instance support. |
| `language-contract.ts` | ACTIVE | Runtime question-language rendering and forbidden-language enforcement. |
| `localization-spec.md` | HISTORICAL | Localization is not implemented in the current CP-001/CP-002 scope. |
| `number-pattern-expansion-report.md` | HISTORICAL | Phase report for fixed-template expansion before structural patterns became the production path. |
| `parameter-generator.ts` | ACTIVE | Runtime parameter generation for CP-001 and CP-002. |
| `parameter-spec.md` | ACTIVE | Parameter contract reference for the implemented archetype pipeline. |
| `pattern-system-v2-implementation-plan.md` | SUPERSEDED | Planning document superseded by the current implementation and migration policy. |
| `pattern-system-v2-migration-spec.md` | ACTIVE | Source-of-truth policy for fixed-template reclassification and structural-pattern production. |
| `pattern-system-v2-review-summary.md` | HISTORICAL | Human review summary retained as decision history. |
| `pattern-system-v2-spec.md` | ACTIVE | Structural Pattern Model specification. |
| `pipeline-spec.md` | ACTIVE | Pipeline architecture reference. |
| `pipeline.ts` | ACTIVE | Runtime CP-001 and CP-002 end-to-end pipelines. |
| `realism-library.ts` | ACTIVE | Runtime loading, validation, selection, and audit support for human-owned libraries. |
| `realism-rules.md` | SUPERSEDED | Superseded for runtime control by files under `realism-library/`. |
| `reasoning-graph-spec.md` | ACTIVE | CP-001 reasoning graph specification. |
| `reasoning-graph.ts` | ACTIVE | Runtime reasoning graph builders for CP-001 and CP-002. |
| `reasoning-patterns.md` | ACTIVE | Human-owned reasoning pattern references. |
| `solver-spec.md` | ACTIVE | Solver contract reference. |
| `solver.ts` | ACTIVE | Runtime solver logic for CP-001 and CP-002. |
| `stem-spec.md` | SUPERSEDED | Superseded for runtime wording by `question-language.library.json` and `language-contract.ts`. |
| `structural-pattern-registry.ts` | ACTIVE | Runtime structural pattern registry and validation. |
| `types.ts` | ACTIVE | Runtime type and ID contracts. |
| `validation-spec.md` | ACTIVE | Archetype-level validation specification. |
| `validator.ts` | ACTIVE | Runtime validation for answer contracts, final packages, traceability, language, and structural instances. |

## CP-002 Package

| File | Classification | Notes |
|---|---:|---|
| `CP-002/audit-spec.md` | ACTIVE | CP-002 audit contract reference. |
| `CP-002/candidate-rules.md` | ACTIVE | CP-002 candidate universe and leading-zero rules. |
| `CP-002/capability-matrix.md` | ACTIVE | CP-002 capability and implementation readiness reference. |
| `CP-002/cp-002-spec.md` | ACTIVE | CP-002 canonical problem specification. |
| `CP-002/domain-rules.md` | ACTIVE | CP-002 domain constraints. |
| `CP-002/explanation-behavior.md` | ACTIVE | CP-002 explanation behavior requirements. |
| `CP-002/implementation-traceability.md` | ACTIVE | CP-002 implementation-to-spec mapping. |
| `CP-002/reasoning-graph-spec.md` | ACTIVE | CP-002 reasoning graph specification. |
| `CP-002/selection-rules.md` | ACTIVE | CP-002 largest-valid digit selection rules. |
| `CP-002/validation-spec.md` | ACTIVE | CP-002 validation specification. |

## Fixtures

| File | Classification | Notes |
|---|---:|---|
| `fixtures/fixed-template-fixtures.json` | ACTIVE | Fixed templates reclassified for regression fixtures, audit fixtures, reference examples, and solver validation cases. |

## Human-Owned Libraries

| File | Classification | Notes |
|---|---:|---|
| `realism-library/audit-contract.library.json` | ACTIVE | Audit reporting contract. |
| `realism-library/cp-capability-matrix.library.json` | ACTIVE | CP status registry. |
| `realism-library/difficulty-bands.library.json` | ACTIVE | Registered difficulty bands. |
| `realism-library/distribution-rules.library.json` | ACTIVE | Batch distribution limits. |
| `realism-library/distribution-strategy.library.json` | ACTIVE | Distribution target strategy. |
| `realism-library/divisor-capabilities.library.json` | ACTIVE | Approved divisor capability source. |
| `realism-library/explanation-styles.library.json` | ACTIVE | Approved explanation styles and target usage. |
| `realism-library/explanation-variants.library.json` | ACTIVE | Approved explanation variant structures. |
| `realism-library/number-patterns.library.json` | SUPERSEDED | Fixed-template library retained for legacy validation and review; not the production generation source. |
| `realism-library/question-language.library.json` | ACTIVE | Approved question wording source. |
| `realism-library/stem-families-expanded.library.json` | ACTIVE | Approved stem family registry. |
| `realism-library/structural-pattern-library.json` | ACTIVE | Production structural pattern source. |

## Test Files Outside Archetype Directory

| File | Classification | Notes |
|---|---:|---|
| `src/quant-v3/tests/ns-div-001-cp001-vertical-slice.test.ts` | ACTIVE | CP-001 pipeline verification. |
| `src/quant-v3/tests/ns-div-001-cp002-largest-valid-digit.test.ts` | ACTIVE | CP-002 pipeline verification. |
| `src/quant-v3/tests/ns-div-001-realism-library.test.ts` | ACTIVE | Library validation and realism enforcement verification. |
| `src/quant-v3/tests/pattern-system-v2.test.ts` | ACTIVE | Structural pattern, fixture, compatibility, audit, and traceability verification. |

## Redundancy And Deletion Recommendation List

No file was deleted in this stabilization pass.

Recommended deletion or archival candidates, pending human approval:

| File | Reason | Recommendation |
|---|---|---|
| `pattern-system-v2-implementation-plan.md` | Superseded by current implementation and migration policy. | Archive after reviewer confirms no unique decisions remain only in this file. |
| `pattern-system-v2-review-summary.md` | Decision history superseded by the current spec and migration spec. | Archive after reviewer confirms historical trace is no longer needed in the active package. |
| `number-pattern-expansion-report.md` | Historical fixed-template expansion report. | Archive with prior audit evidence; keep out of active implementation references. |
| `difficulty-spec.md` | Superseded by registered difficulty-band library. | Archive if the library is accepted as the sole source of truth. |
| `realism-rules.md` | Superseded by human-owned realism libraries. | Archive if the JSON libraries are accepted as the sole runtime source. |
| `stem-spec.md` | Superseded by question-language library. | Archive after confirming no active wording rule depends on it. |
| `explanation-spec.md` | Superseded by explanation style and variant libraries. | Archive after confirming no active renderer rule depends on it. |
| `distractor-spec.md` | Distractors are not implemented or active for CP-001/CP-002. | Retain as historical until distractor work is explicitly approved, or archive. |
| `localization-spec.md` | Localization is not implemented in current NS-DIV-001 scope. | Retain as historical until localization work is explicitly approved, or archive. |
| `cp001-human-review.csv` | Temporary production-audit export outside the archetype package. | Archive or delete after human review is complete. |
| `cp002-human-review.csv` | Temporary production-audit export outside the archetype package. | Archive or delete after human review is complete. |
| `ns-div-001-production-audit-report.md` | Temporary production-audit report outside the archetype package. | Archive or delete after human review is complete. |
| `ns-div-001-repetition-distribution-report.md` | Temporary repetition/distribution report outside the archetype package. | Archive or delete after human review is complete. |

## Cleanup Notes

- CP-001 does not currently exist as a dedicated folder package. It exists through root-level specifications and implementation files.
- CP-002 exists as an explicit package under `CP-002/`.
- Fixed templates are no longer classified as production generation inputs. They remain active only as fixtures and reference cases.
- `number-patterns.library.json` remains present because it is still imported by `realism-library.ts` for legacy library validation and audit/reference support.
