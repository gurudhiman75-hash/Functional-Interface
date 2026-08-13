# RNK-CP-001 — Source and Inverse Gap Audit

Status: **open executable discovery; no permanent QL allocation authorised**.

## 1. Purpose

This audit widens the first RNK-CP-001 executable foundation against the uploaded competitive-reasoning references and then checks the complete one-person inverse surface.

The first wave already proves:

- opposite-end rank from total and one known rank;
- total from two end-ranks;
- count before from start-rank;
- count after from total and start-rank;
- start-rank from count before;
- start-rank from total and count after.

That wave is mathematically sound but does not yet saturate the one-person rank/count domain.

## 2. Source evidence

The uploaded `reasoning_aggarwal.pdf` contains a dedicated Ranking chapter and directly supports:

- opposite-end rank conversion;
- total from two end-ranks;
- exact-middle position after reconstructing the total;
- position interchange;
- minimum/maximum totals with two ranked people and a stated gap.

The source solution around Ranking page `12-13` explicitly reconstructs a total of 39 from ranks 17 and 23, then places the middle person at rank 20. It separately treats interchange and two-person gap cases.

The uploaded `reasoning book.pdf` confirms that multi-attribute ranking embedded inside larger puzzles belongs to the puzzle/arrangement boundary rather than this arithmetic foundation.

## 3. Ownership decisions

### Retained in RNK-CP-001

The following are one-person exact-rank/count contracts over a single total order:

1. middle rank from an odd total;
2. odd total from a stated middle rank;
3. total from explicit counts before and after one person;
4. count before from total and rank from the end;
5. count after from rank from the end;
6. rank from the end from count after.

These are admitted as provisional executable prototypes. They are not permanent QLs.

### Deferred to RNK-CP-002

- number of people between two named persons;
- one person's position relative to another;
- minimum/maximum possible total when relative order is not fixed;
- two-person rank reconstruction from one or both ends.

### Deferred to RNK-CP-003

- position interchange;
- rank change after insertion, removal or movement;
- reconstructing total or final ranks after a swap.

### Excluded from RNK-001

- data-sufficiency answer semantics, owned by Data Sufficiency;
- full clue-based seating arrangements, owned by Seating Arrangement;
- profession/city/colour/floor attribute puzzles, owned by Logic Puzzles;
- dictionary order, owned by Word and Dictionary Order.

## 4. Provisional second-wave identities

```text
RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL
RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK
RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS
RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK
RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK
RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER
```

The identity count is intentionally provisional. Source presentation differences do not justify permanent QL splits by themselves.

## 5. Inverse-closure matrix

| Known evidence | Asked value | Formula | Discovery state |
|---|---|---|---|
| odd total, exact middle | middle rank | `(total + 1) / 2` | new executable wave |
| exact middle rank | odd total | `2 × rank − 1` | new executable wave |
| before count, after count | total | `before + after + 1` | new executable wave |
| total, end-rank | before count | `total − end-rank` | new executable wave |
| end-rank | after count | `end-rank − 1` | new executable wave |
| after count | end-rank | `after + 1` | new executable wave |

The existing wave already covers the corresponding start-side and opposite-end equations.

## 6. Merge/split questions left open

The later consolidation audit must determine whether:

- start-side and end-side count/rank forms are one parameterised authority;
- middle-rank direct and inverse tasks need distinct answer contracts;
- total from two end-ranks and total from before/after counts are separate QLs or evidence variants;
- row, queue and merit-list wording remain renderer/context variations only.

No decision may be made solely to reduce or increase the QL count.

## 7. Proof target

```text
6 provisional prototypes × 240 seeds = 1,440 second-wave questions
```

Required proof:

- deterministic replay;
- canonical and independent solver agreement;
- normalized-order invariants;
- odd-total middle validity;
- first/last boundary coverage where applicable;
- all three contexts;
- all difficulty bands;
- all four answer positions;
- four unique options and one correct answer;
- number-agreement-safe English;
- complete lifecycle locks.

Combined with the first executable wave, CP-001 will have 2,880 generated discovery cases and still zero permanent QLs.

## 8. Release boundary

```text
permanent QLs:              0
frozen solve modes:         0
Question Studio:            disabled
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
Hindi/Punjabi:              not started
```
