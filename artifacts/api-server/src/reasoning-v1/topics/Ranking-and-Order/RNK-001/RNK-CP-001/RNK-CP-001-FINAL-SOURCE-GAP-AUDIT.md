# RNK-CP-001 — Final Source and Gap Audit

Status: **eligible for English manual review; permanent QL allocation remains blocked**.

## 1. Audited boundary

RNK-CP-001 owns exact one-person arithmetic over a total order:

- inclusive rank from either end;
- exclusive people-count before or after the person;
- total group size;
- exact middle position under an odd total;
- direct and inverse recovery among those values.

It does not own two-person relative-position questions, interchange, movement, clue-based ordering or Data Sufficiency labels.

## 2. Closed one-person dimensions

| Dimension | Provisional authority coverage | State |
|---|---|---|
| convert rank between opposite ends | AUTH-01 | covered |
| recover total from both inclusive end-ranks | AUTH-02 | covered |
| convert same-side rank to exclusive side-count | AUTH-03 | covered |
| convert total plus end-rank to opposite side-count | AUTH-04 | covered |
| convert exclusive side-count to same-side rank | AUTH-05 | covered |
| convert total plus side-count to opposite-end rank | AUTH-06 | covered |
| find exact middle rank from an odd total | AUTH-07 | covered |
| recover odd total from an exact middle rank | AUTH-08 | covered |
| recover total from before and after counts | AUTH-09 | covered |

## 3. Inverse closure

```text
AUTH-03  side-count = same-side rank − 1
AUTH-05  same-side rank = side-count + 1

AUTH-04  opposite side-count = total − supplied end-rank
AUTH-06  opposite-end rank = total − supplied side-count

AUTH-07  middle rank = (odd total + 1) / 2
AUTH-08  odd total = 2 × middle rank − 1
```

AUTH-01 is direction-parameterised and converts either end to the other. AUTH-02 and AUTH-09 reconstruct total from different evidence semantics and therefore remain distinct.

## 4. Representation closure

Every provisional authority is executable in:

- merit-list language: top/bottom and ranked above/below;
- horizontal-row language: left/right;
- queue language: front/back and ahead/behind.

These representations remain context parameters because they do not change the hidden order, solver, answer semantic or ambiguity boundary.

## 5. Edge closure

The executable corpus covers:

- first and last rank;
- zero people before or after;
- one person before or after;
- interior ranks;
- small and large totals;
- all four answer positions;
- Easy, Medium and Hard generated states;
- odd-total exact-middle states;
- both start/end variants of every merged authority.

## 6. Source-pattern disposition

| Recurring source pattern | Disposition |
|---|---|
| opposite-end rank | CP-001 covered |
| total from both end-ranks | CP-001 covered |
| exact middle rank/total | CP-001 covered |
| people before/after and inverse rank | CP-001 covered |
| people between two named persons | CP-002 |
| rank difference and mixed two-person recovery | CP-002 |
| minimum/maximum total with uncertain relative order | CP-002 |
| interchange and changed rank | CP-003 |
| multi-person comparison clues | CP-004 |
| shared ranking passage | CP-005 |
| statement-wise sufficiency labels | Data Sufficiency chapter |
| seating adjacency/facing/geometry | Seating Arrangement |

No recurring one-person arithmetic source pattern remains unassigned.

## 7. Executable evidence

```text
13 discovery prototypes                         3,120 cases
9-authority consolidation replay                3,120 checks
9-authority review runtime                      2,880 dispatches
English human-review corpus                        54 questions
```

The final source-gap gate replays every authority again across all contexts while confirming the coverage matrix, inverse closure, source disposition and lifecycle locks.

## 8. Verdict

```text
one-person source gaps:                    0
unowned CP-001 dimensions:                 0
provisional authorities:                   9
permanent QLs:                             0
English manual review:              REQUIRED
English discovery freeze:          NOT GRANTED
Question Studio:                    disabled
Question Bank:                      NOT_STORED
test eligibility:                   INELIGIBLE
public publication:                 false
```

Verdict: `ELIGIBLE_FOR_ENGLISH_MANUAL_REVIEW`.

Permanent identity may be considered only after explicit human review of the nine-authority corpus and a post-review no-new-gap confirmation.
