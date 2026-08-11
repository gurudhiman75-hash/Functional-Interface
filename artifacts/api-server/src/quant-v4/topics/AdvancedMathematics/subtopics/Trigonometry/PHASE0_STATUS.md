# Trigonometry Phase 0 Status

Status: **IMPLEMENTED ON FEATURE BRANCH — DESIGN LOCK COMPLETE**

Branch: `feat/trg-phase0-design-lock`
Base: `New-main` at `43bd455ff6cd8bf50a7048b919b3f077d5db6c7d`

## Locked architecture

- `TRG-001` — 6 CPs — 144 English QLs.
- `TRG-002` — 4 CPs — 96 English QLs.
- Total — 10 CPs — 240 English QLs.
- QL numbering is package-local and contiguous.
- Degree/radian measure is explicitly owned by `TRG-CP-003`.
- Heights & Distances is explicitly owned by `TRG-002`.

## Phase 0 artifacts

- `TRIGONOMETRY_FAMILY_AUTHORITY_LOCK.md`
- `phase0.manifest.json`
- `TRG-001/archetype.md`
- `TRG-001/ql-ledger.md`
- `TRG-002/archetype.md`
- `TRG-002/ql-ledger.md`
- `CROSS_CHAPTER_AUTHORITY_MAP.md`
- `PHASE0_IMPLEMENTATION_PLAN.md`
- `PHASE0_STATUS.md`

## Safety state

- runtime implementation: **not started**;
- Question Studio registration: **false**;
- Test Builder registration: **false**;
- package activation: **false**;
- publishable runtime content: **none yet**;
- Hindi/Punjabi production content: **not started**.

## Authority decisions captured

- exact integer/rational/surd/rational-surd/pi-rational answers;
- exact-answer normalization/equivalence requirement;
- canonical angle model requirement;
- independent mathematical verifier requirement;
- canonical spatial state for Heights & Distances;
- deterministic diagram requirement for substantive `TRG-002` QLs;
- cross-chapter ownership boundaries;
- explicit initial advanced-topic exclusions;
- full 240-Ql primary English human-review target;
- explicit product-owner approval required before production activation.

## Phase 0 reconciliation

| Item | Locked value |
|---|---:|
| Packages | 2 |
| Canonical problems | 10 |
| TRG-001 QLs | 144 |
| TRG-002 QLs | 96 |
| Total English QLs | 240 |
| Primary English review target | 240 |
| Canonical deterministic cases at 12 seeds/QL | 2,880 |

## Next authorized work

**Phase 1 — Trigonometry mathematical foundation**:

1. exact-number primitives;
2. exact angle representation;
3. degree/radian conversion;
4. standard trig value authority;
5. exact expression model/evaluator;
6. mathematical normalization/equivalence;
7. independent verifier primitives.

Large-scale QL authoring should not begin until those mathematical foundations are proven.
