# ANA-CP-008 Allocation Proposal

Status: **COUNT-BEARING PROPOSAL — NO PERMANENT IDS ASSIGNED**

## 1. Derived proposal

The completed source, ownership, misconception, English, Hindi, Punjabi and presentation audits derive:

```text
Student solve contracts: 13
Multilingual QL-template families: 14
Source-eligible presentation tasks per template: 2
Candidate permanent QLs: 28
Permanent QL IDs assigned: 0
```

The count is evidence-derived. It is not the inherited quota and is not frozen by this document.

## 2. Why solve contracts, templates and QLs have different counts

### Thirteen solve contracts

The cluster-first and number-first exact-multiplier forms use the same student reasoning:

1. identify the two letter shifts;
2. identify the exact numeric multiplier;
3. apply both operations;
4. preserve the displayed token order.

They therefore share one solve contract.

### Fourteen multilingual templates

The exact-multiplier token orders require separate QL templates because:

- `CLUSTER_NUMBER` and `NUMBER_CLUSTER` have different typed answer shapes;
- stems and explanations must name the order naturally;
- Hindi and Punjabi require different order-sensitive wording;
- one conditional template would introduce fragile placeholder and rendering branches.

Every other admitted operation family has one solve contract and one template family.

### Twenty-eight candidate QLs

Each of the 14 template families supports two materially different source-backed tasks:

- direct completion;
- odd/incorrect-pair selection.

They must not be one QL with a presentation switch because the following change:

- evidence topology;
- option contract;
- answer semantic;
- misconception strategy;
- explanation sequence;
- validation logic.

Therefore:

```text
14 template families × 2 task contracts = 28 candidate QLs
```

## 3. Proposed solve-contract and template matrix

| # | Proposed solve contract | QL-template family | Token order | Direct | Odd pair |
|---:|---|---|---|---|---|
| 1 | `POSITION_SUM_TO_SCALAR` | Position sum → number | n/a | candidate | candidate |
| 2 | `POSITION_PRODUCT_TO_SCALAR` | Position product → number | n/a | candidate | candidate |
| 3 | `POSITION_SUM_TO_DERIVED_LETTER` | Position sum → letter | n/a | candidate | candidate |
| 4 | `SINGLE_LETTER_POSITION_SQUARE` | Letter position squared | n/a | candidate | candidate |
| 5 | `INDEPENDENT_LETTER_NUMBER_DELTA` | Independent letter/number changes | letter-first | candidate | candidate |
| 6 | `SHARED_CLUSTER_NUMBER_DELTA` | Shared cluster/number delta | cluster-first | candidate | candidate |
| 7 | `INDEPENDENT_CLUSTER_VECTOR_DELTA` | Independent cluster vector + number delta | cluster-first | candidate | candidate |
| 8 | `EXACT_MULTIPLIER_WITH_LETTER_VECTOR` | Exact multiplier — cluster-first | cluster-first | candidate | candidate |
| 8 | `EXACT_MULTIPLIER_WITH_LETTER_VECTOR` | Exact multiplier — number-first | number-first | candidate | candidate |
| 9 | `DIRECT_CUBE_WITH_LETTER_VECTOR` | Direct cube — cluster-first | cluster-first | candidate | candidate |
| 10 | `PERFECT_SQUARE_BASE_TO_CUBE` | Square base → cube | cluster-first | candidate | candidate |
| 11 | `CUBE_ROOT_OF_SUCCESSOR_WITH_VECTOR` | Cube root of successor | cluster-first | candidate | candidate |
| 12 | `SQUARE_ROOT_OF_SUCCESSOR_WITH_VECTOR` | Square root of successor | number-first | candidate | candidate |
| 13 | `DIGIT_SUM_SQUARE_SUCCESSOR` | Digit-sum-square successor | number-letter | candidate | candidate |

## 4. Candidate QL task contract

Every direct-completion QL must define:

- one complete source pair;
- one target input with the output missing;
- a typed answer validator;
- four unique complete-token options;
- source calculation trace;
- target calculation trace;
- one closest misconception rejection.

Every odd-pair QL must define:

- four complete pairs;
- exactly three pairs following the same complete relation;
- one pair violating that relation;
- canonical option equality;
- demonstrations for all three valid pairs;
- explicit expected output for the odd input;
- one correct option index.

## 5. Non-allocated tasks

No candidate QL is proposed for:

- equivalent-pair selection;
- missing-first or missing-second inverse recovery;
- two blanks;
- dual analogy completion;
- verbal-rule selection;
- semantic-only format variants;
- progressive pair-index-dependent rules;
- unrestricted number-to-letter formulas;
- code-table recovery.

## 6. Difficulty policy

Difficulty remains instance-derived within each QL.

Typical centre:

- direct position sum/product and position square: Easy–Medium;
- direct independent/shared delta: Medium;
- direct multiplier, power, root and coupled invariant: Medium–Hard;
- odd-pair variants: generally one level above their direct counterpart because the student must infer and validate a common rule across four complete pairs.

No QL should be labelled Hard solely because its displayed token is long.

## 7. Range consequence if approved

The inherited reservation `ANA-QL-223..238` contains 16 IDs and is insufficient for the derived 28-Ql proposal.

If the proposal is approved without further split or merge:

```text
CP-008 provisional range: ANA-QL-223..250
CP-008 provisional count: 28
```

If CP-009 retains its currently planned 24-Ql inventory, its provisional downstream range would move to:

```text
CP-009 provisional range: ANA-QL-251..274
```

These ranges are consequences, not assignments. They must not be written into the manifest until the allocation proposal is manually approved and the downstream CP-009 ownership review confirms that no IDs are already frozen or implemented.

## 8. Required approval gates before ID freeze

1. approve or revise the 13 solve-contract model;
2. approve separate cluster-first and number-first multiplier templates;
3. approve direct and odd-pair separation for all 14 templates;
4. confirm no deferred family should be admitted now;
5. run the executable 14/13/28 allocation audit;
6. complete a downstream CP-009 range-impact review;
7. amend the ANA manifest and ownership documents;
8. only then assign permanent QL IDs and begin production-grade runtime.

## 9. Safety

Until the manifest amendment is approved:

```text
permanentQlId: null
publiclyPublishable: false
Question Studio exposure: disabled
Question Bank storage: disabled
test eligibility: disabled
```

The proposal is ready for review, not publication.
