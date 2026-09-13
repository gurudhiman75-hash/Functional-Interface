# LP-004 — Conditional Depth Audit V1

Status: **AUDIT COMPLETE — targeted clue-family expansion required; no new QL justified.**

## Current frozen ownership

LP-004 already owns fixed-size subset / committee selection and permanent child-query authorities `LP-QL-013..016`. This audit does not reinterpret or renumber those QLs.

Current clue families in the generator are:

1. mandatory inclusion;
2. mandatory exclusion;
3. together / same selection status;
4. not together / at most one of a pair;
5. exactly one of a pair;
6. directional implication: if A is selected, B must be selected.

The current `only if` wording is semantically covered by the directional implication family. `A only if B` is the same selection constraint as `if A, then B`; it does not require a new clue kind.

## Exam-depth crosswalk

| Exam-facing conditional form | Current status | Decision |
|---|---|---|
| if A, then B | covered | retain |
| A only if B | covered by directional implication | retain; wording rotation only |
| A and B together | covered | retain |
| A and B cannot both be selected | covered | retain |
| exactly one of A and B | covered | retain |
| either A or B, but not both | covered by exactly-one | wording rotation only |
| at least one of A and B | logically derivable from pairwise not-both-unselected, but not represented directly | add explicit learner-facing clue family only if source-backed |
| at least one of A, B and C | **missing** | add clue family |
| exactly two of A, B and C | **missing** | add subset-cardinality clue family |
| at least two of A, B and C | **missing** | add subset-cardinality clue family |
| at most two of A, B and C | structurally weak in a four-of-seven committee unless combined with other constraints | support where source-backed |
| if A is not selected, B must be selected | **missing as a native clue** | add negative-antecedent implication if source-backed |
| if A is selected, exactly one of B/C is selected | **missing compound conditional** | discovery candidate; do not add until source proof justifies complexity |

## Main finding

LP-004 is not missing another child-query authority. Its weakness is **constraint depth inside the parent puzzle**.

The highest-value missing structural families are:

- `AT_LEAST_ONE_SUBSET` — one or more members from a named 3-person subset must be selected;
- `SUBSET_COUNT` — exactly / at least / at most N members from a named subset must be selected;
- `IF_NOT_SELECTED` — negative-antecedent implication, where source-backed.

These should extend LP-004 itself and continue to generate the existing QLs `013..016`. Creating new QLs for these constraints would fragment the taxonomy because the learner is still solving the same committee-selection hidden state and answering the same selection projections.

## Difficulty requirements

The retrofit must not make Hard questions difficult merely by adding more clues.

- Medium: direct inclusion/exclusion plus one relational or cardinality constraint; short inference chain.
- Hard: fewer direct anchors, at least two interacting relational/cardinality constraints, and at least one implication direction that matters to the solution.
- A cardinality clue that merely restates information already forced by three direct clues does not count as structural difficulty.

## Proof requirements for implementation

Before this audit can be closed, the retrofit must prove across a deterministic batch:

1. all generated committees contain exactly four of seven candidates;
2. every displayed clue is true of the hidden committee;
3. all displayed clues together leave exactly one committee;
4. each displayed clue is necessary, or any deliberate redundancy is separately governed;
5. each new clue family appears at non-trivial frequency;
6. Hard caselets contain interacting clue families rather than direct-answer accumulation;
7. child QLs `013..016` retain four distinct options and exactly one semantic answer;
8. answer-position balance remains intact;
9. learner explanations state the effect of cardinality/implication clues in ordinary language rather than solver jargon;
10. existing frozen LP-004 semantics and multilingual authorities are not silently overwritten before explicit approval.

## Lifecycle decision

**Do not allocate a new QL.**

Implement the missing clue families as an English review-only LP-004 depth extension first. After human review, decide whether to retrofit the frozen English authority and rebuild localization from the approved English source.
