# COD-001 Manifest Amendment — COD-CP-007

Status: **authoritative permanent identity allocation for COD-CP-007**.

This amendment operates under `cod-001-open-ql-discovery-amendment.md` and supersedes the revoked legacy CP-007 reservation in `cod-001-chapter-manifest.md`.

## Permanent allocation

| QL ID | Solve contract | Rule family | English maturity |
|---|---|---|---|
| `COD-QL-169` | explicit forward application | `UNIFORM_MODULAR_DIGIT_TRANSLATION` | runtime-proof |
| `COD-QL-170` | inverse decode | `UNIFORM_MODULAR_DIGIT_TRANSLATION` | runtime-proof |
| `COD-QL-171` | recover missing code digit | `UNIFORM_MODULAR_DIGIT_TRANSLATION` | runtime-proof |
| `COD-QL-172` | infer shift and apply forward | `UNIFORM_MODULAR_DIGIT_TRANSLATION` | runtime-proof |

`CHOOSE_MATCHING_CODE` is a presentation variant of `COD-QL-172`, not a fifth QL.

## Identity effect

- stable chapter range becomes `COD-QL-001..172`;
- COD-CP-007 count becomes exactly **4**;
- next available chapter identity becomes `COD-QL-173`;
- COD-CP-008, COD-CP-009 and COD-CP-010 counts/ranges remain open until their own sequential allocation;
- the legacy chapter total of 260 remains revoked.

## Release boundary

These identities are permanent after merge, but remain English review-only:

- Question Studio visibility: false;
- public publishability: false;
- Hindi/Punjabi: not started;
- Question Bank and mock-test eligibility: disabled.
