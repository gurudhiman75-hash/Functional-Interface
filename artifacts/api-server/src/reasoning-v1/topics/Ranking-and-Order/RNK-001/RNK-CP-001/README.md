# RNK-CP-001 — One-Person Rank Arithmetic

Status: **English discovery frozen; nine permanent review-only QLs allocated; release surfaces locked**.

Freeze version: `RNK_CP001_ENGLISH_DISCOVERY_FREEZE_V1`  
Permanent range: `RNK-QL-001..009`  
Next available RNK-001 ID: `RNK-QL-010`

## Frozen solve authorities

| QL | Authority |
|---|---|
| `RNK-QL-001` | convert rank between opposite ends |
| `RNK-QL-002` | recover total from ranks at both ends |
| `RNK-QL-003` | find a same-side exclusive count from rank |
| `RNK-QL-004` | find an opposite-side count from total and rank |
| `RNK-QL-005` | recover a same-side rank from a side-count |
| `RNK-QL-006` | recover an opposite-end rank from total and a side-count |
| `RNK-QL-007` | find the exact middle rank from an odd total |
| `RNK-QL-008` | recover the odd total from an exact middle rank |
| `RNK-QL-009` | recover total from counts before and after one person |

The nine permanent identities were frozen from thirteen exploratory prototypes. Mirror direction, context, values, names, boundary state, difficulty, source prototype and reviewed wording remain generated properties.

## Structural invariants

For total `N` and rank `r` from the start:

```text
rank from end = N - r + 1
before count  = r - 1
after count   = N - r
N             = rank from start + rank from end - 1
```

For exact middle questions:

```text
middle rank = (odd total + 1) / 2
odd total   = 2 × middle rank - 1
```

## Completed audit sequence

- 13 executable discovery prototypes;
- 3,120 deterministic questions with canonical and independent solver agreement;
- inverse, boundary and source-gap closure;
- merge/split audit into nine authorities;
- 2,880-question authority review runtime;
- learner-text hygiene and contextual-noun gates;
- full manual review of 54 English questions;
- zero/one edge remediation and all-seed regression;
- final reviewed-corpus hash freeze;
- permanent English runtime proof.

## Review authority

- `RNK-CP-001-ENGLISH-MANUAL-REVIEW.md`;
- `RNK-CP-001-FINAL-DISCOVERY-FREEZE.md`;
- `../RNK-001-MANIFEST-AMENDMENT-CP001.md`.

The approved 54-question English projection is frozen at:

```text
sha256:c927dfb888a0a49666df1d14ab660360be84516f3c24a96e835d314c944e5597
```

## Ownership boundary

- CP-001: one-person rank arithmetic and exact-middle reconstruction;
- CP-002: two-person positions, differences and people-between;
- CP-003: interchange, movement and changed ranks;
- CP-004: multi-person comparison order;
- later checkpoints: shared passages, partial orders and synthesis.

## Release lock

```text
English review-only:          true
Hindi/Punjabi:                not started
Question Studio:              disabled
Question Bank:                NOT_STORED
mock-test eligibility:        INELIGIBLE
public publication:           false
```

The permanent wrapper exposes `qlId` and `permanentQlId`; source-prototype identity is retained only inside review metadata.