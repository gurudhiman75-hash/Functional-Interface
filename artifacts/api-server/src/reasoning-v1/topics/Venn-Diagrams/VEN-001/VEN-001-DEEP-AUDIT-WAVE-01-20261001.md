# VEN-001 — Deep Audit Wave 01

Date: 2026-10-01

Status: `PERMANENT_QL_ALLOCATION_IMPLEMENTED__FULL_LIVE_SURFACE_GATE_ADDED__FINAL_CLOSURE_PENDING`

## Scope audited

Wave 01 audits the live VEN-001 generator surface rather than the older provisional checkpoint plan.

Observed live checkpoints:

- VEN-CP001 — two-set relation → diagram
- VEN-CP002 — three-set relation → diagram
- VEN-CP003 — category sets ↔ diagram
- VEN-CP004 — numbered region identification
- VEN-CP005 — two-set numerical counts
- VEN-CP006 — three-set numerical counts
- VEN-CP007 — percentage / ratio
- VEN-CP008 — solve unknown
- VEN-CP009 — shared numerical caselet counts
- VEN-CP010 — overlap bounds
- VEN-CP011 — geometric region count

The chapter therefore has eleven implemented checkpoints but ten distinct learner contracts.

## Permanent QL allocation

Authority: `VEN_001_PERMANENT_QL_REGISTRY_V1`

- VEN-QL-001 — relation(s) → Venn topology
- VEN-QL-002 — categories → diagram
- VEN-QL-003 — diagram → categories
- VEN-QL-004 — region identification
- VEN-QL-005 — set / region count
- VEN-QL-006 — percentage / ratio
- VEN-QL-007 — solve unknown
- VEN-QL-008 — shared caselet count
- VEN-QL-009 — overlap bounds
- VEN-QL-010 — geometric region count

`VEN-QL-011` remains the next unallocated ID.

### Compression decision

VEN-CP005 and VEN-CP006 are not separate QLs. Both test the same learner contract — deriving a required set/region count — with two-set versus three-set structural breadth. This audit does not inflate permanent taxonomy merely because implementation uses separate checkpoints.

Likewise, VEN-CP001 and VEN-CP002 share VEN-QL-001 because two-set and three-set relation-to-diagram items test the same semantic operation.

## Runtime wiring

Every live generation path now emits both:

- `qlId`
- `permanentQlId`

against the permanent registry.

Covered paths:

- `question-studio-integration.ts`
- `ven-001-next-checkpoints.ts`
- `ven-001-numerical.ts`
- `ven-001-shape-regions.ts`

The Question Studio package metadata now declares the permanent QL authority, count and QL IDs.

## Audit-gate correction

The previous VEN workflow did not execute the numerical CP005–CP010 proof, CP011 shape-region proof, or the permanent-QL integration proof.

Wave 01 adds all three to `.github/workflows/reasoning-ven-001-topology.yml`.

Final closure remains pending the executable gate result plus a second-pass editorial/source/difficulty audit. No learner release is authorized by Wave 01.

## Lifecycle

- review-only: true
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false

