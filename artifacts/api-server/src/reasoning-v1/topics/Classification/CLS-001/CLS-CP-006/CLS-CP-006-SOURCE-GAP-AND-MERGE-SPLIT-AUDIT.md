# CLS-CP-006 — Source-Gap and Final Merge/Split Audit

Status: `SOURCE_GAP_CLOSED__TWO_PERMANENT_CONTRACTS_FROZEN`

## Scope

This audit checks the executable CP-006 registry against the recovered letter-classification source forms and plausible neighbouring alphabet descriptions. It determines whether any materially distinct learner contract or bounded rule family remains uncovered and whether the admitted source prototypes merge or split at the permanent QL boundary.

Final authority is recorded in `CLS-CP-006-FINAL-ENGLISH-FREEZE.md`.

## Source forms exercised

The recovered source material contains CP-006-compatible forms including:

- one consonant among vowels;
- one letter whose alphabet position has different parity;
- one ordered letter-pair with a different fixed position gap;
- one pair that is not an opposite-letter pair;
- equivalent pair-gap wording expressed through positions or letters lying between endpoints.

Three- and four-letter structures involving repeated gaps, alternating movements, position equations, cluster sums or opposite-cluster transformations are excluded because their answer object belongs to `CLS-CP-007`.

## Executable source exemplars

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
  -> common signed and absolute gap of 3
  -> F–G is the unique outlier

J–R, L–O, C–X, E–V
  -> three pairs have position sum 27
  -> J–R is the unique outlier

E–S, B–O, C–P, D–Q
  -> three pairs have signed gap 13
  -> E–S is the unique outlier
```

Every accepted exemplar is independently solved against the complete compatible CP-006 registry. Multiple supporting rules are accepted only when they identify the same answer. A printed answer key never overrides a competing-answer proof.

## Source ambiguity finding

The source option set `W, N, P, B` is unsafe:

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

Decision: reject the printed option set and preserve the intended parity pattern only through controlled state reconstruction.

## Compression results

### Reverse-position parity

Reverse position is `27 - forward position`. The labels swap, but the A–Z partition is identical.

Decision: `MERGE_AS_RULE_LABEL_VARIANT` into `LETTER_POSITION_PARITY`.

### Reverse alphabet half

Forward A–M and N–Z become reverse second and first halves respectively. The labels swap, but the partition is identical.

Decision: `MERGE_AS_RULE_LABEL_VARIANT` into `LETTER_ALPHABET_HALF`.

### Reverse signed gap

```text
reversePosition(second) - reversePosition(first)
= position(first) - position(second)
```

This negates the existing signed gap without changing equality groups.

Decision: `MERGE_AS_RULE_LABEL_VARIANT` into `PAIR_SIGNED_POSITION_GAP`.

### Reverse absolute gap

The absolute forward and reverse gaps are identical.

Decision: `MERGE_AS_RULE_LABEL_VARIANT` into `PAIR_ABSOLUTE_POSITION_GAP`.

### Intervening-letter wording

For distinct letters:

```text
letters lying between endpoints = absolute position gap - 1
```

Subtracting one preserves the equality partition and outlier answer.

Decision: `MERGE_AS_PRESENTATION_VARIANT` into `PAIR_ABSOLUTE_POSITION_GAP`.

### Opposite-letter wording

Opposite letters have position sum `27`. This is a source-salient label but not a separate learner contract from pair-position relations.

Decision: retain `PAIR_OPPOSITE_STATUS` as a governed rule label and merge it into the permanent ordered-pair QL.

## Candidate families not admitted

### Prime/composite alphabet position

Position 1 forms a third class and repeated CP-006 source authority was not established.

Decision: `DEFER_FOR_SOURCE_EVIDENCE`.

### Pair position-parity composition

The four ordered parity compositions are executable but source-thin.

Decision: `DEFER_FOR_SOURCE_EVIDENCE`.

### Pair alphabet-half composition

The four ordered half compositions are executable but source-thin.

Decision: `DEFER_FOR_SOURCE_EVIDENCE`.

### Products, ratios and arbitrary modular classes

These permit post-hoc descriptions without repeated conventional source support.

Decision: `REJECT_FOR_SOURCE_GAP_AND_EDITORIAL_RISK`.

### Visual letter-shape classes

These depend on font, case and renderer.

Decision: `REJECT_UNLESS_SEPARATE_RENDERER_SAFE_PROOF`.

## Final merge/split decision

The evidence supports exactly two permanent learner contracts:

### CLS-QL-010

```text
find the odd single letter
```

All three single-letter rules merge because they share one displayed-letter answer object, option-local class evaluation and mismatch proof.

### CLS-QL-011

```text
find the odd complete ordered letter-pair
```

All five ordered-pair rules merge because they share one complete-pair answer object, internal-relation evaluation and mismatch proof. Exact rule and direction remain instance variables.

The two contracts remain split because a single letter and a complete ordered pair have different answer semantics and evidence topology.

No source-backed reference-pair matching direction was established. It is therefore not reserved.

## Gap decision

```text
Meaningful uncovered CP-006 source contracts: 0
New rules admitted by the gap audit:          0
Rule-label or presentation compressions:      6
Ambiguous printed source states rejected:     1
Controlled source remediations proved:        1
Candidate families deferred:                  3
Candidate families rejected:                  2
Permanent QLs allocated:                      2
```

## Lifecycle lock

```text
permanentQlIds:             CLS-QL-010, CLS-QL-011
reviewStatus:               FROZEN_ENGLISH_RUNTIME_PROOF
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

Hindi and Punjabi localisation, product storage, test eligibility and publication remain separate future phases.
