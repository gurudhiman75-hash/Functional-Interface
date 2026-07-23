# AVG-001 CP-001 to CP-004 Solver-Mode and QL Gap Audit

## Audit basis

Current English runtime footprint:

| CP | Current QLs | Current solve modes |
|---|---:|---:|
| AVG-CP-001 | 72 | 4 |
| AVG-CP-002 | 50 | 4 |
| AVG-CP-003 | 86 | 7 |
| AVG-CP-004 | 65 | 6 |
| **Total** | **273** | **21** |

The audit asks whether a structurally distinct SSC, Banking, RRB, or Punjab-exam Average family can be generated without forcing it into an inaccurate existing mode. It does not recommend expansion merely to increase QL count.

## Executive verdict

CP-001 to CP-004 are strong but not yet coverage-complete. A targeted expansion is recommended before chapter freeze.

- **Required new solve modes:** 8
- **Recommended new QLs:** 52
- **Optional QL-only additions under existing modes:** 12
- **Recommended CP-001 to CP-004 total after required expansion:** 325 QLs
- **Recommended full AVG-001 total after required expansion:** 425 QLs

The existing 273 QLs should remain stable. Add new IDs after `AVG-QL-373`; do not renumber or rewrite approved QLs unless a defect is found.

---

## CP-001 — Foundational Sum-Count Mapping

### Current coverage

- find total from average and count;
- find average from total and count;
- find count from total and average;
- find one missing value from the required total and known subtotal.

### Verdict

**One required new solve mode. Existing QL count is otherwise sufficient.**

### Required mode

#### `findAverageAfterUniformTransformation`

Covers the property that when every observation is changed in the same way, the average changes in the same way.

Required operation families:

- each value increases or decreases by a constant;
- each value is multiplied or divided by a constant;
- two-step transformation such as `2x + 3` for higher difficulty.

This is a common foundational exam family and is not an add/remove/replace problem because the count and membership do not change.

**Recommended allocation:** 8 QLs.

### QL-only additions under existing modes

Add 4 list-form variants to `findMissingValueFromAverage`, where individual known observations are displayed rather than only their subtotal. The solver mode need not change, but the rendered problem should feel like a real missing-number question.

### CP-001 recommendation

- Current: 72 QLs / 4 modes
- Required addition: 8 QLs / 1 mode
- Optional addition: 4 QLs / existing mode
- Required post-audit target: **80 QLs / 5 modes**

---

## CP-002 — Symmetric AP Properties

### Current coverage

- average of consecutive or equally spaced terms;
- middle term from average;
- extreme term from average and count;
- average of consecutive odd or even terms.

### Verdict

**Two reverse modes are required. The forward AP coverage is already strong.**

### Required modes

#### `findTermCountFromAverageAndExtreme`

Examples:

- the mean and greatest term of consecutive integers are known; find the number of terms;
- the mean and least term of consecutive odd/even terms are known; find the count;
- fixed common difference is supplied for a general AP.

This is structurally different from finding an extreme when the count is known.

**Recommended allocation:** 6 QLs.

#### `findCommonDifferenceFromAverageCountAndExtreme`

Examples:

- mean, number of terms, and greatest term are given; find the common difference;
- mean, number of terms, and least term are given; find the interval.

This is a genuine reverse-symmetry family and should not be hidden inside `findExtremeFromAverageAndCount`.

**Recommended allocation:** 6 QLs.

### QL-only additions under existing modes

Add 4 direct exam variants for:

- first `n` natural numbers;
- first `n` odd numbers;
- first `n` even numbers;
- consecutive multiples of a number.

These can remain under the existing consecutive/fixed-interval modes.

### CP-002 recommendation

- Current: 50 QLs / 4 modes
- Required addition: 12 QLs / 2 modes
- Optional addition: 4 QLs / existing modes
- Required post-audit target: **62 QLs / 6 modes**

---

## CP-003 — Increment, Decrement and Replacement

### Current coverage

- new average after one member joins;
- new average after one member leaves;
- new average after one replacement;
- value of a joining member from the average shift;
- value of a leaving member from the average shift;
- value of the incoming replacement;
- cricket next-innings target.

### Verdict

**Two reverse modes are required. Single-member forward and value-target coverage is already extensive.**

### Required modes

#### `findOriginalCountFromJoiningMemberShift`

Examples:

- a person with known age/marks/salary joins;
- the average rises or falls by a stated amount;
- find the original number of members.

This is one of the most common reverse-average questions and is not covered by CP-005's correction-count mode.

**Recommended allocation:** 6 QLs.

#### `findOriginalCountFromLeavingMemberShift`

Examples:

- a member with known value leaves;
- the average changes;
- find the original group size.

The algebra and count convention differ from the joining case, so it should remain a separate mode and audit target.

**Recommended allocation:** 6 QLs.

### No new mode required for outgoing replacement value

The existing `findReplacementValueFromShift` contract already has a `replacementTarget` field. Extend its QL/runtime coverage so some questions ask for the outgoing value and others ask for the incoming value. Do not add a duplicate solve mode unless the current runtime proves unable to support both targets cleanly.

### Optional QL-only additions

Add 4 variants involving several members joining or leaving with a known group average. These may be implemented through CP-004 weighted merging if the runtime and traceability remain clearer there.

### CP-003 recommendation

- Current: 86 QLs / 7 modes
- Required addition: 12 QLs / 2 modes
- Optional addition: 4 QLs / existing or CP-004 modes
- Required post-audit target: **98 QLs / 9 modes**

---

## CP-004 — Weighted and Combined Aggregation

### Current coverage

- combined average of two groups;
- combined average of three or four groups;
- missing group count from a known count and combined average;
- missing group average;
- average speed for equal distances;
- average speed for equal times.

### Verdict

**Three distinct exam families are missing. CP-004 has the highest-value expansion need.**

### Required modes

#### `findGroupCountRatioFromCombinedAverage`

Covers alligation-style questions where two group averages and the combined average are known and the ratio of group sizes is required.

Examples:

- boys' and girls' average marks with the class average;
- permanent and contract salary averages with the overall average;
- two mixtures or production groups represented as counts.

The answer type should be `RATIO`. This should not be simulated by inventing one known group count.

**Recommended allocation:** 8 QLs.

#### `findAverageSpeedForUnequalDistances`

Covers two or three legs with explicitly unequal distances. The average speed must use total distance divided by total time.

This is distinct from the equal-distance harmonic-mean shortcut.

**Recommended allocation:** 6 QLs.

#### `findAverageSpeedForUnequalTimes`

Covers two or three legs with explicitly unequal travel durations. The average speed is the time-weighted mean of speeds.

This is distinct from the equal-time arithmetic-mean shortcut.

**Recommended allocation:** 6 QLs.

### No immediate expansion required

The existing two-group, three/four-group, missing-average, and one-missing-count modes are sufficiently represented. Three-group reverse questions may be deferred to CP-006 unless a clear non-hierarchical exam pattern is identified during human review.

### CP-004 recommendation

- Current: 65 QLs / 6 modes
- Required addition: 20 QLs / 3 modes
- Required post-audit target: **85 QLs / 9 modes**

---

## Priority order

1. `findGroupCountRatioFromCombinedAverage`
2. `findOriginalCountFromJoiningMemberShift`
3. `findOriginalCountFromLeavingMemberShift`
4. `findAverageAfterUniformTransformation`
5. `findAverageSpeedForUnequalDistances`
6. `findAverageSpeedForUnequalTimes`
7. `findTermCountFromAverageAndExtreme`
8. `findCommonDifferenceFromAverageCountAndExtreme`

## Freeze decision

Do not freeze CP-001 through CP-004 at their current solve-mode coverage. Implement the required targeted expansion first. Do not reopen or renumber the 273 approved QLs; append new QLs after `AVG-QL-373`, add dedicated mode-count and state-validity audits, and repeat human review only for the new rows plus any existing row changed by necessity.
