# CLS-CP-006 — Source-Gap and Preliminary Merge/Split Audit

Status: `INITIAL_SOURCE_GAP_CLOSED__PERMANENT_QL_FREEZE_NOT_AUTHORISED`

## Scope

This audit checks the first executable CP-006 registry against the recovered letter-classification source forms and against plausible neighbouring alphabet descriptions. It asks whether any materially distinct learner contract or bounded rule family remains uncovered.

It does not allocate permanent QLs. The executable wave remains discovery-only.

## Source forms exercised

The recovered source material contains CP-006-compatible forms including:

- one consonant among vowels;
- one letter whose alphabet position has different parity;
- one ordered letter-pair with a different fixed position gap;
- one pair that is not an opposite-letter pair;
- equivalent pair-gap wording expressed through positions or letters lying between endpoints.

Three- and four-letter structures involving repeated gaps, alternating movements, position equations, cluster sums or opposite-cluster transformations are excluded from this audit because their answer object belongs to `CLS-CP-007`.

## Executable source exemplars

The audit records representative source-shaped states without copying source prose:

```text
A, E, O, V
  -> vowel/consonant class
  -> V is the unique outlier
  -> position parity also identifies V, so the answer remains stable

W, N, P, B
  -> printed source intends alphabet-position parity and answer W
  -> complete-registry audit also identifies B as the alphabet-half outlier
  -> REJECTED_AS_AMBIGUOUS_SOURCE_STATE

W, N, P, R
  -> controlled parity-safe remediation
  -> W is the unique odd-position letter; every option lies in the second alphabet half

U–X, O–R, W–Z, F–G
  -> common signed/absolute gap of 3
  -> F–G is the unique outlier

J–R, L–O, C–X, E–V
  -> three pairs have position sum 27
  -> J–R is the unique outlier

E–S, B–O, C–P, D–Q
  -> three pairs have signed gap 13
  -> E–S is the unique outlier
```

Every accepted exemplar is independently solved against the complete compatible CP-006 registry. Multiple supporting rules are accepted only when they identify the same answer. A printed answer key is never sufficient to override a competing-answer proof.

## Source ambiguity finding

The source option set `W, N, P, B` is not safe for a complete-registry generator:

```text
position parity:
  W = 23, odd
  N = 14, even
  P = 16, even
  B = 2, even
  -> W is the outlier

alphabet half:
  W, N and P lie in N–Z
  B lies in A–M
  -> B is the outlier
```

Decision: preserve the intended parity pattern only through controlled state reconstruction. Do not ingest the printed option set unchanged.

## Compression results

### Reverse-position parity

Reverse position is `27 - forward position`. Because 27 is odd, reverse-position parity swaps the labels `ODD` and `EVEN` but preserves exactly the same partition of A–Z.

Decision: `MERGE_AS_RULE_LABEL_VARIANT` into `LETTER_POSITION_PARITY`.

### Reverse alphabet half

Forward first-half letters A–M become reverse second-half positions, and N–Z become reverse first-half positions. The labels swap, but the partition is unchanged.

Decision: `MERGE_AS_RULE_LABEL_VARIANT` into `LETTER_ALPHABET_HALF`.

### Reverse signed gap

For pair `X–Y`:

```text
reversePosition(Y) - reversePosition(X)
= (27 - position(Y)) - (27 - position(X))
= position(X) - position(Y)
```

This is the negative of the existing signed gap. Equal-gap groups remain identical.

Decision: `MERGE_AS_RULE_LABEL_VARIANT` into `PAIR_SIGNED_POSITION_GAP`.

### Reverse absolute gap

Taking the absolute value removes the sign, so forward-position and reverse-position absolute gaps are identical.

Decision: `MERGE_AS_RULE_LABEL_VARIANT` into `PAIR_ABSOLUTE_POSITION_GAP`.

### Inclusive/exclusive gap wording

For distinct letters:

```text
letters lying between endpoints = absolute position gap - 1
```

Subtracting one from every gap value preserves the same equality classes and therefore the same outlier answer.

Decision: `MERGE_AS_PRESENTATION_VARIANT` into `PAIR_ABSOLUTE_POSITION_GAP`. Learner explanations must state whether they use position difference or intervening-letter count to prevent off-by-one confusion.

### Opposite-letter wording

Opposite letters satisfy forward-position sum `27`. This is a source-salient named relation but not a different mathematical partition from the `PAIR_POSITION_SUM` value 27.

Decision: retain `PAIR_OPPOSITE_STATUS` as a governed source rule label for natural explanations and source tracing, but merge it into the same eventual ordered-pair learner contract. It does not justify another QL.

## Candidate families not admitted

### Prime/composite alphabet position

This is mathematically bounded, but the recovered CP-006 source pass does not establish repeated exam ownership. Position 1 is neither prime nor composite, creating a third class that requires explicit source governance.

Decision: `DEFER_FOR_SOURCE_EVIDENCE`.

### Pair position-parity composition

Patterns such as odd–even, even–odd, odd–odd and even–even are executable, but no repeated CP-006 source authority has yet been established.

Decision: `DEFER_FOR_SOURCE_EVIDENCE`.

### Pair alphabet-half composition

First-half/second-half ordered compositions are executable but currently source-thin.

Decision: `DEFER_FOR_SOURCE_EVIDENCE`.

### Exact position products, ratios and arbitrary modular classes

A finite option set can often be described post hoc through products, ratios or moduli. Without repeated conventional source support these expand ambiguity rather than meaningful coverage.

Decision: `REJECT_FOR_SOURCE_GAP_AND_EDITORIAL_RISK`.

### Visual letter-shape classes

Curves, straight lines, symmetry and enclosure depend on font, case and renderer.

Decision: `REJECT_UNLESS_SEPARATE_RENDERER_SAFE_PROOF`.

## Preliminary solve-contract compression

The current evidence supports two learner-contract hypotheses:

```text
A. find the odd single letter
B. find the odd complete ordered letter-pair
```

All rules inside A share one answer object and one option-local class proof. All rules inside B share one complete ordered-pair answer object and one internal-relation proof. Exact rule, direction, option count, answer position and difficulty remain instance variables.

Single letters and ordered pairs should not yet be merged because the answer object and evidence topology differ. This is a preliminary conclusion, not a permanent QL allocation.

## Gap decision

```text
Meaningful uncovered CP-006 source contracts: 0
New rules admitted by this audit:             0
Rule-label/presentation compressions:         6
Ambiguous printed source states rejected:     1
Controlled source remediations proved:        1
Candidate families deferred:                  3
Candidate families rejected:                  2
Permanent QLs allocated:                      0
```

The next gate is a broader generated-state editorial and ambiguity audit followed by a human review of the 64-question artifact. Permanent QL identities remain open until that proof confirms that the two contract hypotheses are exhaustive and stable.

## Lifecycle lock

```text
permanentQlId:              null
reviewStatus:               UNREVIEWED_DISCOVERY
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```
