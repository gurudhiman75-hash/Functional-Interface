# COD-001 Manifest Amendment — COD-CP-008

Status: **authoritative permanent identity allocation for COD-CP-008**.

This amendment operates under `cod-001-open-ql-discovery-amendment.md` and supersedes the revoked legacy CP-008 reservation in `cod-001-chapter-manifest.md`.

## Permanent allocation

| QL ID | Solve contract | Rule family | English maturity |
|---|---|---|---|
| `COD-QL-173` | direct renamed-label lookup | `DIRECT_RENAMED_LABEL` | runtime-proof |
| `COD-QL-174` | resolve semantic referent, then rename | `SEMANTIC_REFERENT_THEN_RENAME` | runtime-proof |

Open chain versus cycle, mapping length, context family and option wording are generated-instance properties rather than additional QLs.

## Identity effect

- stable chapter range becomes `COD-QL-001..174`;
- COD-CP-008 count becomes exactly **2**;
- next available chapter identity becomes `COD-QL-175`;
- the already-frozen CP-009 allocation must begin at `COD-QL-175` and continue sequentially according to its final solve-contract authority;
- COD-CP-010 count/range remains open until its own discovery freeze;
- the legacy chapter total of 260 remains revoked.

## Release boundary

These identities are permanent after merge, but remain English review-only:

- Question Studio visibility: false;
- public publishability: false;
- Hindi/Punjabi: not started;
- Question Bank and mock-test eligibility: disabled.
