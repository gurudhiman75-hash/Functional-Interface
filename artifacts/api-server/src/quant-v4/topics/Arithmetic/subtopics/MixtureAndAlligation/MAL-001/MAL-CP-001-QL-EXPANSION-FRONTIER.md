# MAL-CP-001 Provisional QL-Expansion Frontier

Status: **COUNT-BEARING EXECUTABLE FRONTIER — NOT FROZEN**

Approval authority: `ExamTree product owner`  
Approved mathematical scope: `2026-07-28`  
Permanent QL IDs assigned: `0`

## 1. Derived expansion result

The approved six-contract / twelve-prototype mathematical scope expands provisionally to:

```text
approved candidate contracts: 6
approved executable prototypes: 12
provisional solve modes: 7
provisional QL-template families: 11
English expansion-review rows: 48
permanent MAL-QL IDs: 0
```

These counts are derived from the current executable, source, ownership, answer-shape, validator, misconception and explanation evidence. They are not yet frozen.

## 2. Provisional solve modes

| Solve mode | Learner operation |
|---|---|
| `MAL-CP001-SM-TARGET-RATIO` | Find the required ratio from two source values and a target mean. |
| `MAL-CP001-SM-FINAL-MEAN` | Find the final weighted mean from complete source evidence. |
| `MAL-CP001-SM-UNKNOWN-SOURCE-WEIGHTED-BALANCE` | Recover an unknown source value from explicit quantities. |
| `MAL-CP001-SM-UNKNOWN-SOURCE-RATIO-EVIDENCE` | Recover an unknown source value from ratio evidence. |
| `MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY` | Recover one missing quantity from a target weighted balance. |
| `MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL` | Derive an alligation ratio and scale it from a total quantity. |
| `MAL-CP001-SM-TWO-STAGE-FINAL-MEAN` | Derive an intermediate blend mean and then a second-stage final mean. |

## 3. Provisional QL-template families

| # | QL-template family | Solve mode | Approved prototype representation |
|---:|---|---|---|
| 1 | `MAL-CP001-QLC-TARGET-RATIO` | target ratio | ratio from target |
| 2 | `MAL-CP001-QLC-FINAL-MEAN-EXPLICIT-TWO` | final mean | two explicit quantities |
| 3 | `MAL-CP001-QLC-FINAL-MEAN-RATIO` | final mean | stated source ratio |
| 4 | `MAL-CP001-QLC-FINAL-MEAN-MULTI-COMPONENT` | final mean | three or more complete components |
| 5 | `MAL-CP001-QLC-UNKNOWN-SOURCE-QUANTITY-EVIDENCE` | unknown source, weighted balance | explicit quantities |
| 6 | `MAL-CP001-QLC-UNKNOWN-SOURCE-RATIO-EVIDENCE` | unknown source, ratio evidence | stated source ratio |
| 7 | `MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN` | unknown component quantity | static or addition framing with one known source |
| 8 | `MAL-CP001-QLC-UNKNOWN-QUANTITY-MULTI-KNOWN` | unknown component quantity | two or more known contributions |
| 9 | `MAL-CP001-QLC-RATIO-SCALE-BOTH-QUANTITIES` | ratio scale from total | labelled ordered quantity pair |
| 10 | `MAL-CP001-QLC-RATIO-SCALE-REQUESTED-SHARE` | ratio scale from total | one named component share |
| 11 | `MAL-CP001-QLC-TWO-STAGE-FINAL-MEAN` | two-stage final mean | preblend portion plus final source |

## 4. Important merge decisions

### Addition framing does not create another QL template

`MAL-CP001-PROT-UNKNOWN-COMPONENT-QUANTITY` and `MAL-CP001-PROT-ADDED-QUANTITY-FOR-TARGET` share:

- one known weighted contribution;
- one unknown quantity at a known source value;
- the same target-balance equation;
- the same scalar quantity validator;
- the same principal misconception family.

The words “was used” and “must be added” are framing variants. They remain inside `MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN`.

### Final-mean representations share one solve mode but not one template

Explicit two-component quantities, a stated source ratio and a multi-component list all use weighted mean. They split into three templates because their evidence parsing, question-language requirements and misconception packages differ materially:

- two explicit quantities support swapped-weight traps;
- ratio evidence is order-sensitive;
- multi-component evidence needs stable list rendering and omission traps.

### Pair and requested share share one solve mode but not one template

Both ratio-scale tasks derive an alligation ratio and fix its common scale from the total quantity. They split because:

- one returns a labelled ordered pair;
- one returns a single named quantity;
- validators and distractor semantics differ.

### Unknown source value has two solve modes

Explicit-quantity evidence requires target weighted-total isolation. Ratio evidence requires reverse alligation or ratio-weighted isolation. The answer semantic is the same, but the learner equation and error model differ materially.

## 5. Explicit exclusions retained

The expansion frontier must not include:

```text
MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES
MAL-CP001-PROT-TWO-STAGE-UNKNOWN
MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
```

Their dispositions remain respectively:

```text
deferred representation
held topology
referred to MAL-CP-002
```

## 6. Review and safety status

```text
QL-template review statuses: 11 PENDING
question-row review statuses: 48 PENDING
QL-template count frozen: false
solve-mode count frozen: false
permanentQlId: null
publiclyPublishable: false
Question Studio exposure: disabled
Question Bank writes: disabled
student/test routing: disabled
Hindi/Punjabi: not started
```

Candidate-scope approval does not imply row-level English approval.

## 7. Required gate before a permanent allocation proposal

1. inspect all 48 grouped English review rows;
2. test whether any provisional template can be safely merged without conditional language, validator or distractor fragility;
3. search for source-backed task directions not represented by the eleven-template frontier;
4. audit inverse, edge-case, tabular and exam-presentation gaps without creating renderer-only identities;
5. verify ownership against Average, CP-002, CP-004 and CP-006;
6. expand misconception coverage for every proposed template;
7. decide whether template-family counts and solve-mode counts can be frozen;
8. only then derive a count-bearing permanent QL proposal and range impact.

This document does not allocate or reserve any `MAL-QL-*` identity.
