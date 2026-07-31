# CLS-CP-007 — Executable Discovery Plan

Status: `OPEN_EXECUTABLE_DISCOVERY`

## Discovery objective

Build a deterministic review-only English runtime for direct odd-one-out classification among complete letter-clusters of length three to five.

The first wave must answer three questions with evidence rather than assumptions:

1. which source-backed cluster rule families remain stable under complete competing-rule enumeration;
2. whether all direct cluster outliers share one permanent learner contract;
3. which descriptions are true rules and which merely restate a narrower or broader existing relation.

No permanent QL identity is allocated by this plan.

## Temporary task direction

```text
FIND_ODD_LETTER_CLUSTER
```

Learner action:

```text
inspect every complete cluster
  -> recover the common internal alphabet structure
  -> verify that structure across all options
  -> select the complete cluster with the different structure
```

## Temporary prototype wave

| Prototype | Source-backed working family | Lengths |
|---|---|---|
| `CLS-CP007-PROT-001` | exact signed adjacent-gap vector | 3–5 |
| `CLS-CP007-PROT-002` | exact absolute adjacent-gap vector | 3–5 |
| `CLS-CP007-PROT-003` | normalized signed-gap ratio | 4 |
| `CLS-CP007-PROT-004` | adjacent-gap equality topology | 3–5 |
| `CLS-CP007-PROT-005` | vowel-count classification | 3–5 |
| `CLS-CP007-PROT-006` | repeated-letter equality pattern | 3–5 |
| `CLS-CP007-PROT-007` | complete position total | 3–5 |
| `CLS-CP007-PROT-008` | first two positions sum to the third | 3 |
| `CLS-CP007-PROT-009` | difference between half-cluster position totals | 4 |
| `CLS-CP007-PROT-010` | opposite pairing at indexes 1–3 and 2–4 | 4 |
| `CLS-CP007-PROT-011` | opposite pairing at indexes 1–2 and 3–4 | 4 |
| `CLS-CP007-PROT-012` | signed gaps inside adjacent pair-blocks | 4 |
| `CLS-CP007-PROT-013` | absolute central gap | 4 |

Prototype count is evidence inventory, not a QL quota.

## Canonical cluster model

```text
alphabet position: A=1, B=2, ... Z=26
signed adjacent gap i: position(letter[i+1]) - position(letter[i])
absolute adjacent gap i: |signed gap i|
normalized gap ratio: divide all signed gaps by their positive greatest common divisor
opposite letters: positions total 27
repeat pattern: assign the same label to equal letters in occurrence order
```

Examples of canonical patterns:

```text
CEG  -> signed gaps +2,+2
KQNT -> signed gaps +6,-3,+6 -> normalized ratio +2,-1,+2
ABBA -> repeat pattern 1-2-2-1
ABCA -> repeat pattern 1-2-3-1
```

## Valid-state-first generation

```text
select temporary prototype
  -> select admitted cluster length
  -> select one governed common rule value with enough cluster members
  -> choose three or four distinct matching clusters
  -> choose one controlled non-matching cluster of the same length
  -> place the answer deterministically
  -> parse the displayed clusters independently
  -> enumerate every compatible CP-007 rule
  -> reject competing-answer states
  -> render calculation-complete explanation
  -> emit review-only candidate
```

Arbitrary clusters followed by post-hoc rule invention are prohibited.

## Domain construction

The discovery domain is a deterministic union of:

- all uppercase three-letter clusters;
- source-shaped constant, alternating and multi-gap profiles translated across the alphabet;
- bounded normalized-ratio profiles;
- generated four- and five-letter clusters;
- repeated-letter topology controls;
- opposite-letter pairing controls;
- equation and pair-block controls.

The domain is versioned and contains no runtime LLM generation.

## Ambiguity model

For every compatible rule, the verifier groups the displayed options by exact rule value. A rule supports an outlier only when one value occurs once and another value occurs in every remaining option.

The state is accepted only when:

```text
- the intended rule supports the stored answer;
- at least one admitted rule supports an answer;
- every supporting rule points to the same answer index;
- displayed options are unique and use one cluster length;
- the independent parser and solver reproduce the result.
```

Same-answer overlap is allowed and recorded. Competing-answer overlap is rejected.

## Editorial contract

Every accepted question must include:

1. **Core Rule** — state the common cluster structure in natural exam language.
2. **Check the Options** — show the relevant alphabet positions and the active calculation for every option.
3. **Exam Speed Shortcut** — give an action-led screening order.
4. **Common Traps** — warn about direction, absolute versus signed gaps, cluster order, or overfitting.

Fixed statements such as “three clusters share the rule” are prohibited because both four- and five-option states are supported.

## Difficulty model

Difficulty is derived from generated properties:

- cluster length;
- number of adjacent relations inspected;
- arithmetic demand;
- direction sensitivity;
- one-layer versus multi-layer structure;
- four versus five options;
- same-answer supporting-rule count;
- answer position and surface similarity.

Difficulty is not permanently attached to a prototype.

## First executable proof target

The first gate must validate:

- deterministic replay;
- all thirteen temporary prototypes;
- every admitted rule;
- lengths three, four and five where declared;
- four- and five-option states;
- every answer position;
- Easy, Medium and Hard coverage;
- complete compatible-rule ambiguity enumeration;
- independent parsing and solving of displayed clusters;
- natural, cardinality-safe stems;
- one explicit check per option;
- no Series, Coding-Decoding, Analogy or Alphabet Test leakage;
- JSON and Markdown reviewer exports;
- complete lifecycle and publication locks.

## Follow-up audits

After the first executable wave:

- compare exact vector, ratio and equality-topology ownership;
- test whether whole position sum creates excessive accidental ambiguity;
- inspect source controls involving five-letter clusters and multi-pair opposite relations;
- search for a genuine reference-cluster matching task;
- audit repeated-letter patterns for source frequency and surface giveaways;
- perform a broader source-gap pass before allocating any permanent QL.

## Lifecycle boundary

```text
permanentQlId:              null
reviewStatus:               UNREVIEWED_DISCOVERY
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```
