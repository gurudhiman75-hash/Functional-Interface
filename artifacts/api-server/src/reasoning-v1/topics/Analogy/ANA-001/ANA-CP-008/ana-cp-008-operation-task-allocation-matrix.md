# ANA-CP-008 Operation-by-Task Allocation Matrix

Status: **PROVISIONAL ALLOCATION MODEL — NO IDS OR COUNTS FROZEN**

## 1. Purpose

This matrix translates the green ANA-CP-008 pilot into candidate permanent design units without allowing the inherited 16-QL reservation to dictate the taxonomy.

It separates three dimensions that must not be conflated:

1. **solve contract** — the reasoning operation performed by the student;
2. **typed representation** — the order and shape of letters and numbers;
3. **presentation task** — what the question asks the student to select or complete.

A shared helper function does not prove one solve contract. A different token order does not automatically prove a different solve contract. A mechanically viable presentation does not automatically deserve a permanent QL.

## 2. Allocation principles

A permanent solve contract should split when at least one of these changes materially:

- the arithmetic sequence used by the student;
- the alphabet operation;
- the dependency between letters and numbers;
- the explanation sequence;
- the dominant misconception set;
- the acceptance domain;
- the inverse or validation logic.

A permanent solve contract may remain unified when only these vary:

- signed magnitude;
- source-safe parameter value;
- specific letters or numbers;
- answer position;
- token order, provided the student operation is identical and the QL grammar can represent both orders cleanly.

No Cartesian product of solve contracts and presentation tasks is assumed. Every candidate QL must independently pass source, realism, collision, yield, localization, and editorial audits.

## 3. Presentation-task status

| Task | Current status | Permanent-allocation consequence |
|---|---|---|
| Direct completion | source-backed and mechanically green | eligible for candidate permanent QLs |
| Odd/incorrect pair selection | source-backed by recurring mixed SSC forms and mechanically green | eligible for candidate permanent QLs after editorial fixture review |
| Equivalent-pair selection | mechanically green; exact official mixed fixture still pending | pilot-only; do not allocate permanently yet |
| Inverse/original-token recovery | unsourced for this checkpoint | deferred |
| Double-missing completion | unsourced and high ambiguity | deferred |
| Verbal-rule selection | overlaps meta reasoning and pedagogy | excluded from current allocation |

## 4. Candidate solve-contract matrix

### 4.1 Letter-derived scalar and letter outputs

| Candidate solve contract | Pilot authority/context | Student operation | Typed input → output | Split/merge decision | Direct completion | Odd-pair selection |
|---|---|---|---|---|---|---|
| Ordinary-position sum to scalar | `MIXED_LETTER_GROUP_SCALAR_AGGREGATE / SUM` | convert each letter to ordinary position and add | `LETTER_GROUP → NUMBER` | keep separate from product | candidate | candidate |
| Ordinary-position product to scalar | `MIXED_LETTER_GROUP_SCALAR_AGGREGATE / PRODUCT` | convert each letter to ordinary position and multiply | `LETTER_GROUP → NUMBER` | keep separate from sum | candidate | candidate |
| Ordinary-position sum to derived letter | `MIXED_LETTER_GROUP_DERIVED_LETTER / SUM` | add positions, then map the result back to A–Z without modulo | `LETTER_GROUP → LETTER` | separate output and explanation contract | candidate | candidate |
| Single-letter position square | `MIXED_SINGLE_LETTER_POSITION_POWER / exponent 2` | square the ordinary alphabet position | `LETTER → NUMBER` | separate power contract | candidate | candidate |

#### Decision notes

Sum and product must not be collapsed merely because both use `aggregateOrdinaryPositions`. Their calculations, misconception labels, output distributions, and explanation language differ.

Sum-to-letter remains separate from sum-to-number because the student performs an additional representation step and the answer type changes.

### 4.2 Independent mixed single-letter token

| Candidate solve contract | Pilot authority/context | Student operation | Typed input → output | Split/merge decision | Direct completion | Odd-pair selection |
|---|---|---|---|---|---|---|
| Independent letter shift plus fixed whole-number delta | `MIXED_TOKEN_INDEPENDENT_TRANSFORM` | apply one fixed nonzero letter shift and one fixed add/subtract operation | `LETTER_NUMBER → LETTER_NUMBER` | magnitudes and signs remain contexts | candidate | candidate |

#### Decision notes

Forward/backward letter direction and numeric add/subtract direction are parameters of one reasoning contract when the question always asks the student to identify two independent fixed operations.

A later opposite-letter or multiplication source must not be inserted as another parameter automatically; it requires a new operation audit.

### 4.3 Cluster plus whole-number fixed-delta contracts

| Candidate solve contract | Pilot authority/context | Student operation | Typed input → output | Split/merge decision | Direct completion | Odd-pair selection |
|---|---|---|---|---|---|---|
| Shared delta across letters and number | `MIXED_CLUSTER_NUMBER_SHARED_DELTA` | apply the same signed delta to every letter and the whole number | `CLUSTER_NUMBER → CLUSTER_NUMBER` | separate coupled/shared contract | candidate | candidate |
| Independent letter vector plus fixed numeric delta | `MIXED_CLUSTER_NUMBER_INDEPENDENT_VECTOR` | apply a fixed shift to each letter position and a separate fixed signed number delta | `CLUSTER_NUMBER → CLUSTER_NUMBER` | all source-backed vectors remain contexts | candidate | candidate |

#### Decision notes

The shared-delta contract must remain separate from the independent-vector contract even when one independent-vector context happens to use equal letter shifts. Ownership depends on the declared relationship across all components.

Large source-backed deltas such as `+294`, `−311`, and `+450` are contexts, not new solve contracts.

### 4.4 Exact multiplier contracts

| Candidate solve contract | Pilot authority/context | Student operation | Typed input → output | Split/merge decision | Direct completion | Odd-pair selection |
|---|---|---|---|---|---|---|
| Letter vector plus exact rational multiplier | `MIXED_CLUSTER_NUMBER_VECTOR_MULTIPLIER` | apply a fixed letter vector and multiply the whole number by an exact rational factor | `CLUSTER_NUMBER → CLUSTER_NUMBER` | one solve contract across integer and exact rational factors | candidate | candidate |
| Number-first letter vector plus exact multiplier | `MIXED_NUMBER_CLUSTER_VECTOR_MULTIPLIER` | same arithmetic and vector reasoning with number-first token order | `NUMBER_CLUSTER → NUMBER_CLUSTER` | representation variant of the exact-multiplier solve contract unless grammar audit forces a separate QL template | candidate representation | candidate representation |

#### Decision notes

`×5`, `×5/2`, and `×3/2` remain contexts of one exact-multiplier solve contract because the student performs the same operation and exact-divisibility check.

`NUMBER_CLUSTER` remains a separate runtime rule ID for typed-domain safety. This does not by itself require a separate solve mode. It may still require a separate QL template if one language template cannot render both orders naturally and safely.

### 4.5 Power and root contracts

| Candidate solve contract | Pilot authority/context | Student operation | Typed input → output | Split/merge decision | Direct completion | Odd-pair selection |
|---|---|---|---|---|---|---|
| Letter vector plus direct cube | `MIXED_CLUSTER_NUMBER_VECTOR_POWER / CUBE` | apply fixed letter vector and cube the displayed number | `CLUSTER_NUMBER → CLUSTER_NUMBER` | keep separate from square-to-cube | candidate | candidate |
| Letter vector plus perfect-square-to-cube | `MIXED_CLUSTER_NUMBER_VECTOR_POWER / PERFECT_SQUARE_TO_CUBE` | recognize `n = r²`, then output `r³` while applying the letter vector | `CLUSTER_NUMBER → CLUSTER_NUMBER` | separate multi-stage reasoning | candidate | candidate |
| Letter vector plus exact cube root of `n+1` | `MIXED_CLUSTER_NUMBER_VECTOR_ROOT / CUBE_ROOT_OF_SUCCESSOR` | add one, prove a perfect cube, then take the exact cube root | `CLUSTER_NUMBER → CLUSTER_NUMBER` | separate inverse-power contract | candidate | candidate |
| Number-first letter vector plus exact square root of `n+1` | `MIXED_NUMBER_CLUSTER_VECTOR_ROOT / SQUARE_ROOT_OF_SUCCESSOR` | add one, prove a perfect square, then take the exact square root | `NUMBER_CLUSTER → NUMBER_CLUSTER` | separate square-root contract; number-first shape retained | candidate | candidate |

#### Decision notes

Direct cube and perfect-square-to-cube must split. The latter contains a recognition/root stage and has different invalid domains and misconceptions.

Square-root and cube-root successor transforms must not share one solve mode merely because they use the same helper signature. Their arithmetic, validation, examples, and traps differ.

### 4.6 Coupled number-letter invariant

| Candidate solve contract | Pilot authority/context | Student operation | Typed input → output | Split/merge decision | Direct completion | Odd-pair selection |
|---|---|---|---|---|---|---|
| Digit-sum-square successor | `MIXED_NUMBER_LETTER_DIGIT_SQUARE_SUCCESSOR` | verify the input invariant, increment the number, recompute digit sum, square it, and map to a letter | `NUMBER_LETTER → NUMBER_LETTER` | standalone coupled contract | candidate | candidate |

#### Decision notes

This is not an independent letter shift plus number increment. The output letter is recomputed from the output number. The dependency is the defining solve contract.

## 5. Runtime rule ID versus permanent solve contract

The current pilot has 12 runtime rule IDs. Permanent solve contracts do not map one-to-one automatically:

- the scalar aggregate runtime ID contains sum and product, which should remain separate student solve contracts;
- the power runtime ID contains direct cube and perfect-square-to-cube, which should remain separate student solve contracts;
- cluster-first and number-first exact multiplier runtime IDs may share one solve contract while retaining separate typed representations.

Therefore neither runtime-rule count nor context count may be reused as the permanent solve-mode count.

## 6. Candidate QL construction rule

For each admitted solve contract, evaluate QL need in this order:

1. Does direct completion require a distinct stem/answer/explanation template?
2. Does odd-pair selection require a materially different evidence and option contract?
3. Can cluster-first and number-first token orders share the same template without conditional placeholder complexity or unnatural wording?
4. Do output kinds require separate answer validators or explanation structures?
5. Does locale rendering remain natural in English, Hindi, and Punjabi?
6. Can one QL cover the full source-backed context domain without hidden branches that change student reasoning?

Create a separate QL only when the answer to one of these questions demonstrates a real contract boundary.

## 7. Non-allocation decisions

The following receive no permanent QL from this matrix:

- equivalent-pair selection, pending an exact official mixed fixture;
- inverse completion;
- double-missing completion;
- reverse-position aggregates;
- letter-pair gaps/differences;
- generic number-to-letter coding;
- number-driven letter movement;
- unrestricted coupled equations;
- pair-index-dependent progressive vectors delegated to CP-009;
- meaningful word-to-number forms owned by CP-007 or Coding-Decoding.

## 8. Remaining gates before an ID proposal

No IDs or counts may be proposed until all of these are complete:

1. recover or formally supersede the uploaded audited manifest;
2. finish cross-check bridges against CP-005, CP-006, numeric analogy, CP-007, and Coding-Decoding;
3. perform one final recurring-source gap audit;
4. build misconception ownership for each candidate solve contract;
5. audit whether token-order variants need separate language templates;
6. draft English stem/explanation prototypes for every candidate task unit;
7. audit Hindi and Punjabi structural naturalness;
8. rerun context, option, and presentation yield after any split or merge;
9. conduct a chapter-level ownership review with CP-009.

## 9. Current conclusion

The green pilot is sufficient to begin **allocation discovery**, but not to freeze allocation.

The current evidence supports a structured set of candidate solve contracts and two source-eligible presentation tasks. Final QL and solve-mode counts remain open and must emerge from the remaining bridge, language-template, localization, source-gap, and misconception audits.
