# RNK-CP-002 — Two-Person Positions

Status: **English discovery frozen; eight permanent review-only QLs allocated; release surfaces locked**.

Freeze version: `RNK_CP002_ENGLISH_DISCOVERY_FREEZE_V1`

Permanent range: `RNK-QL-010..017`  
Next available RNK-001 identity: `RNK-QL-018`

## Frozen QLs

| QL | Authority |
|---|---|
| `RNK-QL-010` | people strictly between two normalized positions |
| `RNK-QL-011` | positional gap between two normalized positions |
| `RNK-QL-012` | target rank from a reference rank and directional separation |
| `RNK-QL-013` | compare normalized positions toward a requested end |
| `RNK-QL-014` | total from mixed-end ranks, between-count and known order |
| `RNK-QL-015` | minimum or maximum valid total under unknown order |
| `RNK-QL-016` | exact total or indeterminate outcome under unknown order |
| `RNK-QL-017` | order status compatible with a proposed total |

Same-end versus mixed-end evidence, person-role reversal, requested physical end, direct offset versus people-between representation and minimum versus maximum remain generated-instance parameters.

## Construction model

```text
construct two distinct valid positions
  -> derive both start/end ranks, gap and between-count
  -> expose only the intended evidence
  -> solve displayed evidence independently
  -> evaluate high/low order branches when total is unknown
  -> reject impossible reversed-order states
  -> construct misconception-owned options
  -> render reviewed context-specific teaching
```

## Completed discovery sequence

```text
foundation wave                      6 prototypes / 1,440 questions
source and inverse wave              7 prototypes / 1,680 questions
combined discovery                  13 prototypes / 3,120 questions
13→8 consolidation replay                         3,120 checks
authority English review runtime     8 × 320      = 2,560 questions
approved English review pack         8 × 6        =    48 questions
permanent runtime                    8 × 192      = 1,536 questions
open CP-002 source dimensions                              0
```

## Mixed-end validity model

For start rank `a`, end rank `b`, and `k` people between:

```text
high-order total = a + b + k
low-order total  = a + b - k - 2
```

The low-order branch is valid only when both supplied ranks are at least `k + 2`.

- one valid branch → unique total;
- two valid branch totals → exact total cannot be determined;
- proposed total matching the high branch → start-ranked person is nearer the start end;
- proposed total matching a valid low branch → end-ranked person is nearer the start end;
- no branch match → proposed total is impossible.

## English review

Approved learner-facing projection:

```text
sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
```

The reviewed layer uses candidate terminology for merit lists, natural top/bottom, left/right and front/back phrasing, named-person categorical answers and question-specific conclusions. Canonical mathematical statuses remain in review metadata.

## Authoritative records

1. `RNK-CP-002-SOURCE-SATURATION-AUDIT.md`;
2. `RNK-CP-002-ENGLISH-MANUAL-REVIEW.md`;
3. `RNK-CP-002-FINAL-DISCOVERY-FREEZE.md`;
4. `../RNK-001-MANIFEST-AMENDMENT-CP002.md`;
5. `cp002-final-discovery-freeze.test.ts`;
6. `cp002-permanent-runtime.ts`;
7. `cp002-permanent-runtime.test.ts`.

## Ownership boundary

- CP-001: one-person rank arithmetic;
- CP-002: relationships between two fixed positions;
- CP-003: movement, overtaking, insertion/removal and interchange;
- CP-004: three-or-more-person ordering;
- CP-005: shared ranking passages;
- CP-007: multi-person partial-order possibility and uncertainty.

## Release lock

```text
English review-only:             true
Hindi/Punjabi:                   not started
Question Studio:                 disabled
Question Bank:                   NOT_STORED
mock-test eligibility:           INELIGIBLE
public publication:              false
```
