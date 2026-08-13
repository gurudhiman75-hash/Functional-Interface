# RNK-001 Manifest Amendment — CP-001

Amendment: `RNK_001_MANIFEST_AMENDMENT_CP001_V1`  
Applies to: `RNK-CP-001 — One-person Rank Arithmetic`  
Freeze authority: `RNK_CP001_ENGLISH_DISCOVERY_FREEZE_V1`

## Permanent identity allocation

| QL ID | Authority ID | Answer semantic |
|---|---|---|
| `RNK-QL-001` | `RNK-CP001-AUTH-01-CONVERT-RANK-BETWEEN-ENDS` | Rank |
| `RNK-QL-002` | `RNK-CP001-AUTH-02-TOTAL-FROM-BOTH-END-RANKS` | Total |
| `RNK-QL-003` | `RNK-CP001-AUTH-03-SIDE-COUNT-FROM-SAME-SIDE-RANK` | Count |
| `RNK-QL-004` | `RNK-CP001-AUTH-04-OPPOSITE-SIDE-COUNT-FROM-TOTAL-AND-RANK` | Count |
| `RNK-QL-005` | `RNK-CP001-AUTH-05-SAME-SIDE-RANK-FROM-SIDE-COUNT` | Rank |
| `RNK-QL-006` | `RNK-CP001-AUTH-06-OPPOSITE-END-RANK-FROM-TOTAL-AND-SIDE-COUNT` | Rank |
| `RNK-QL-007` | `RNK-CP001-AUTH-07-EXACT-MIDDLE-RANK-FROM-ODD-TOTAL` | Rank |
| `RNK-QL-008` | `RNK-CP001-AUTH-08-ODD-TOTAL-FROM-EXACT-MIDDLE-RANK` | Total |
| `RNK-QL-009` | `RNK-CP001-AUTH-09-TOTAL-FROM-BEFORE-AND-AFTER-COUNTS` | Total |

Next available RNK-001 ID: `RNK-QL-010`.

## Identity policy

The permanent IDs represent solver and answer contracts, not wording templates. The following remain parameters and must not create new QLs by themselves:

- top/bottom, left/right and front/back wording;
- merit-list, row and queue presentation;
- start-side versus end-side mirror direction;
- person or candidate names;
- totals, ranks and side-counts;
- zero/one boundary cases;
- difficulty band;
- source prototype used to instantiate a merged authority;
- reviewed wording variation.

## Locales

- English: discovery frozen and review-only;
- Hindi: not started;
- Punjabi: not started.

Locale work must preserve the frozen identity, evidence, answer, options, misconception ownership, mathematical fingerprint and lifecycle locks for the same seed.

## Product lifecycle

This amendment does not register RNK-001 in any production capability registry.

```text
Question Studio discoverable: false
Question Bank writable:       false
test eligible:                 false
publicly publishable:          false
```

Any future product registration requires a separate manifest amendment and explicit integration proof.