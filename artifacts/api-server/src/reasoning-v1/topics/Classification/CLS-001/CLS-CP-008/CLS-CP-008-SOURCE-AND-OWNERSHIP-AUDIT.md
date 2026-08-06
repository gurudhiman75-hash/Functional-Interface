# CLS-CP-008 — Mixed-Token and Bounded-Synthesis Ownership Audit

Status: `SOURCE_AND_OWNERSHIP_AUDIT_COMPLETE__ZERO_NEW_QL_PROVISIONAL`

## Purpose

This checkpoint tests whether mixed letters, numbers, symbols, tables or cross-domain option groups create any materially new Classification learner contract after `CLS-CP-001` through `CLS-CP-007` have stabilised.

CP-008 is not a miscellaneous bucket. A candidate is retained only when:

1. every displayed option is a complete self-contained object;
2. the final learner action is classification rather than decoding, sequence continuation, equation evaluation, matrix completion or visual-figure comparison;
3. the property belongs to a bounded declared rule universe;
4. recurring source evidence proves that the learner contract is exam-relevant;
5. the contract cannot already be represented by a frozen Classification QL.

Permanent QL and solve-mode counts remain need-based. This audit allocates none.

## Sources re-audited

### `reasoning book.pdf`

The verbal Classification section contains one renderer-safe symbol control:

```text
,   ;   .   :   +
```

The four punctuation marks form one semantic class; `+` is an arithmetic operator. This is a direct semantic outlier task and does not require mixed-token synthesis.

The same book also contains figure-based Classification exercises, but those depend on visual arrangement and are owned by Figure Classification.

### `reasoning_aggarwal.pdf`

The verbal Classification chapter is saturated by words, numbers, number tuples, letters and letter clusters already covered by CP-001 through CP-007.

The Figure Classification chapter contains mixed visual controls such as:

- a letter with its alphabet position placed underneath;
- one alphabet glyph among non-alphabet symbols;
- boxes containing different counts of `+` and `×`;
- repeated letters or symbols arranged inside figures.

These are visual-layout questions. Their proof depends on two-dimensional placement, enclosure, count or figure structure and therefore remains outside textual Classification.

The Coding-Decoding chapter contains letters, numbers and symbols in code tables and conditional codes. Those states require hidden mapping inference or code application and remain Coding-Decoding.

## Candidate disposition

| Candidate family | Decision | Governing reason |
|---|---|---|
| Single displayed glyph classified by semantic function, such as punctuation versus operator | `MERGE_EXISTING_QL` → `CLS-QL-001` | Same direct semantic outlier contract; glyph is only an instance representation |
| Letter with alphabet value placed above/below it | `REASSIGN_TO_FIGURE_CLASSIFICATION` | Spatial alignment is essential to the proof |
| One letter among visual symbols | `REASSIGN_TO_FIGURE_CLASSIFICATION` | Printed source is a figure-comparison task |
| Symbol-count boxes or grids | `REASSIGN_TO_FIGURE_CLASSIFICATION` | Count and placement are properties of a rendered figure |
| Letter/number/symbol coding table | `REASSIGN_TO_CODING_DECODING` | Hidden mapping must be inferred or applied |
| Operator replacement or mixed-sign equation | `REASSIGN_TO_MATHEMATICAL_OPERATIONS` | Learner evaluates or restores an equation |
| Ordered mixed-token progression | `REASSIGN_TO_SERIES` | Term position and continuation/wrong-term logic are essential |
| Mixed-token row/column grid | `REASSIGN_TO_MATRIX` | Row-column synthesis, not option-local classification |
| Free-form letter-number odd groups | `REJECT_FOR_SOURCE_GAP` | No recurring bounded source authority after earlier checkpoints |
| Combined semantic plus structural multi-condition state | `REJECT_FOR_SOURCE_GAP` | No recurring source family; high post-hoc ambiguity risk |
| Classification caselet or table | `REJECT_FOR_SOURCE_GAP` | No stable recurring Classification contract in the reviewed corpus |

## Merge decision for the symbol control

The punctuation-versus-operator control does not create a symbol-specific QL.

`CLS-QL-001` already asks the learner to identify the item that does not share the common semantic class. Changing the visible item from a word such as `Lily` to a glyph such as `+` does not alter:

- the answer object;
- the final learner action;
- the semantic membership proof;
- the competing-class ambiguity model;
- the option-count contract;
- the explanation topology.

A future governed symbol dataset may extend `CLS-QL-001` after independent multilingual and renderer review. CP-008 does not modify the frozen CP-001 runtime in this branch.

## Explicit rejections

CP-008 must never be used to absorb:

- a pattern merely because it contains more than one token type;
- a visual figure expressed approximately in plain text;
- a code, equation, series or matrix whose natural owner already has a dedicated solver;
- an arbitrary rule invented after observing four mixed tokens;
- a one-off caselet or table with no recurring exam authority;
- a multi-condition state whose conditions can be freely combined to force one outlier;
- open-ended synthetic questions generated without a finite compatible-rule registry.

## Final provisional result

```text
Reviewed broad candidate families:  11
Renderer-safe textual source controls: 1
New permanent learner contracts:     0
New permanent QLs:                   0
New runtime generators:              0
Question Studio exposure:            0
Question Bank storage:               0
Test/publication eligibility:         0
```

The chapter inventory therefore remains `CLS-QL-001` through `CLS-QL-013` unless a later source corpus proves a genuinely new self-contained Classification contract.
