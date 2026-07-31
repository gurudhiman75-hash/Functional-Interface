# SER-001 — Series open-discovery manifest

## Authority and maturity

```text
Chapter:                    SER-001 — Series
Product family:             REAS-SER
Runtime family:             SYMBOLIC_SEQUENCE
Manifest maturity:          OPEN_DISCOVERY
Permanent QLs:              0
Next available identity:    SER-QL-001
Active/public QLs:          0
Question Studio exposure:   disabled
Question Bank storage:      disabled
Test eligibility:           disabled
Public publication:         disabled
```

This is the first remote authority for the Reasoning Series chapter. It starts from the canonical Reasoning V1 architecture and master blueprint on `New-main`. It does not import, reconstruct, or claim any unpushed local experiment.

The chapter manifest is deliberately not frozen. Source saturation, checkpoint collision audits, merge/split decisions, permanent QL counts, final solve-mode counts, localization review and product integration are still open.

## Chapter purpose

SER-001 owns finite verbal or symbolic sequences in which the learner must infer a recurrence, difference pattern, interleaving rule, block grammar or ordered transformation and use that rule to identify a required term or anomaly.

Typical answer semantics include:

- next, previous or missing term;
- wrong displayed term;
- correct replacement for a wrong term;
- continuation block or cluster;
- matching sequence under an explicit rule.

## Boundary decisions

SER-001 includes:

- numeric term sequences;
- alphabetic term sequences;
- letter-cluster and token-block sequences;
- mixed alphanumeric or symbol sequences;
- next, previous, missing and wrong-term tasks when the decisive invariant is sequential.

SER-001 excludes:

- direct alphabet position, gap, rearrangement and scan questions owned by `ALP-001`;
- rule transfer between paired objects owned by `ANA-001`;
- encoding or decoding of an input owned by `COD-001`;
- arithmetic-property questions about one integer owned by Number System;
- tabular missing-number and matrix structures owned by their dedicated chapters;
- state-by-state sorting machines owned by Input-Output;
- visual transformation sequences owned by Figure Series.

A token may be a number or letter without moving ownership. Ownership follows the invariant required to solve the question.

## Provisional checkpoint hypotheses

These rows guide source collection. They do not allocate QLs or freeze counts.

| Checkpoint | Provisional ownership | Permanent QL count |
|---|---|---:|
| `SER-CP-001` | single uniform additive numeric sequences | open |
| `SER-CP-002` | multiplicative and affine numeric sequences | open |
| `SER-CP-003` | constant non-zero second- and third-difference sequences; higher orders open | open |
| `SER-CP-004` | primes, factorials, recurrences and special-number candidates after collision removal | open |
| `SER-CP-005` | alternating, interleaved and composite numeric sequences after representation compression | open |
| `SER-CP-006` | single-letter alphabetic sequences | open |
| `SER-CP-007` | letter clusters, word-like blocks and token grammars | open |
| `SER-CP-008` | mixed alphanumeric and symbol sequences | open |

Source and collision evidence may merge, split, reorder or remove these checkpoints.

## Open discovery protocol

A candidate becomes a permanent QL only after all of the following close:

1. direct and inverse source coverage;
2. task-direction and answer-semantic audit;
3. representation and renderer audit;
4. edge-domain and ambiguity audit;
5. cross-checkpoint and cross-chapter ownership audit;
6. candidate merge/split audit;
7. independent solver proof;
8. misconception-specific option proof;
9. English editorial review;
10. permanent identity approval.

Task direction, missing position, sequence length, sign, magnitude, answer position, difficulty and renderer are instance properties unless evidence proves a different solve authority.

## Current executable discovery

`SER-CP-001` currently contains one temporary candidate solve authority:

```text
UNIFORM_ADDITIVE_STEP
```

It is exercised through four temporary presentation/task templates:

```text
SER-CP-001-TMP-001  NEXT_TERM
SER-CP-001-TMP-002  MISSING_TERM
SER-CP-001-TMP-003  PREVIOUS_TERM
SER-CP-001-TMP-004  WRONG_TERM
```

These IDs are disposable discovery identities. They do not reserve `SER-QL-001..004`, and four task templates do not imply four permanent QLs.

The prototype proves deterministic positive and negative additive sequences, independent inference from displayed terms, ambiguity rejection, four unique misconception-oriented options, exact answer-position and difficulty reach, safe bounded integer domains, concise English worked reasoning and lifecycle locks that prevent accidental product exposure.

## SER-CP-002 executable discovery

`SER-CP-002` adds two temporary candidate solve authorities:

```text
UNIFORM_MULTIPLICATIVE_RATIO
AFFINE_MULTIPLY_THEN_ADD
```

Each authority is exercised through next, interior-missing, previous and wrong-term tasks:

```text
SER-CP-002-TMP-001..004  UNIFORM_MULTIPLICATIVE_RATIO
SER-CP-002-TMP-005..008  AFFINE_MULTIPLY_THEN_ADD
```

These eight temporary templates do not reserve permanent identities. They are audited through one complete independent candidate pool so a non-zero affine adjustment cannot be misclassified as uniform multiplication and a zero-adjustment case cannot inflate the affine authority.

The prototype covers bounded integer multipliers and adjustments, independent recurrence reconstruction, one-rule ambiguity acceptance, misconception-specific options, exact answer-position and difficulty reach, and the same inactive lifecycle boundary as CP-001.

## SER-CP-003 executable discovery

`SER-CP-003` adds two provisional candidate solve authorities:

```text
CONSTANT_NONZERO_SECOND_DIFFERENCE
CONSTANT_NONZERO_THIRD_DIFFERENCE
```

Each authority is represented by next, interior-missing, previous and wrong-term tasks:

```text
SER-CP-003-TMP-001..004  CONSTANT_NONZERO_SECOND_DIFFERENCE
SER-CP-003-TMP-005..008  CONSTANT_NONZERO_THIRD_DIFFERENCE
```

The independent solver fits integer finite-difference parameters from visible positions and evaluates both authorities in one complete candidate pool. Second-difference candidates require a constant non-zero second difference and zero third difference. Third-difference candidates require a constant non-zero third difference, preventing collapse into the lower-order family.

The committed audit passes 960 deterministic questions: 480 per authority and 240 for each of `NEXT_TERM`, `MISSING_TERM`, `PREVIOUS_TERM` and `WRONG_TERM`. All 960 questions pass deterministic replay, independent solving and complete-pool ambiguity checks. Answer positions are balanced at 240 each; every temporary template reaches 40 easy, 40 medium and 40 hard cases and at least 118 distinct fingerprints.

The workflow also exports 32 exact English review questions for CP-003. Question Studio discovery, Question Bank writes, test eligibility and public publication remain locked at zero. Across CP-001 through CP-003, the retained executable audit volume is 2,400 questions.

## SER-CP-004 executable discovery and collision audit

`SER-CP-004` begins with seven source-shaped candidate families, each exercised through next, interior-missing, previous and wrong-term tasks:

```text
CONSECUTIVE_SQUARES
CONSECUTIVE_CUBES
FIXED_BASE_CONSECUTIVE_POWERS
CONSECUTIVE_PRIMES
TRIANGULAR_NUMBERS
FACTORIAL_SEQUENCE
ADD_PREVIOUS_TWO_RECURRENCE
```

The 28 temporary templates are evaluated through one complete independent candidate pool. The executable ownership audit does not treat every familiar surface pattern as a new CP-004 authority.

Provisional collision dispositions are:

```text
CONSECUTIVE_SQUARES                -> SER-CP-003
CONSECUTIVE_CUBES                  -> SER-CP-003
TRIANGULAR_NUMBERS                 -> SER-CP-003
FIXED_BASE_CONSECUTIVE_POWERS      -> SER-CP-002
```

Squares and triangular numbers are constant non-zero second-difference sequences. Cubes are constant non-zero third-difference sequences. Fixed-base consecutive powers are uniform multiplicative sequences. Keeping separate permanent identities for those surfaces would duplicate already-discovered reasoning authorities.

The provisional CP-004-retained families are:

```text
CONSECUTIVE_PRIMES
FACTORIAL_SEQUENCE
ADD_PREVIOUS_TWO_RECURRENCE
```

These remain candidates, not frozen solve modes or permanent QLs. Prime successor, position-dependent factorial multiplication and two-term stateful recurrence require materially different inference from the current CP-002 and CP-003 authorities.

The CP-004 audit passes 3,360 deterministic English questions:

```text
Temporary templates:                     28
Candidate families:                       7
Questions per candidate family:         480
Questions per task direction:           840
Provisional CP-004-retained questions: 1,440
CP-003 collision-probe questions:      1,440
CP-002 collision-probe questions:        480
Answer positions:         [840, 840, 840, 840]
Permanent QLs:                             0
```

All questions pass deterministic replay, independent complete-pool inference, one-authority ambiguity rejection, Easy/Medium/Hard reach, four unique options, option-specific diagnostics and lifecycle locks. The workflow exports 56 exact English review questions for this wave.

Across CP-001 through CP-004, the executable audit volume is 5,760 questions. No collision disposition is final until source saturation and the chapter-wide merge/split audit.

## SER-CP-005 executable discovery and representation compression

`SER-CP-005` tests ten source-shaped alternating, interleaved and composite families:

```text
ALTERNATING_ADDITIVE_STEPS
ALTERNATING_MULTIPLICATIVE_RATIOS
TWO_INTERLEAVED_ARITHMETIC
TWO_INTERLEAVED_GEOMETRIC
INTERLEAVED_ARITHMETIC_GEOMETRIC
ALTERNATING_ADD_THEN_MULTIPLY
ALTERNATING_MULTIPLY_THEN_ADD
PROGRESSIVE_MULTIPLY_PLUS_ADD
PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES
PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES
```

Each family is exercised through next, interior-missing, previous and wrong-term tasks. The 40 temporary templates are evaluated through one complete candidate pool that groups equivalent projected sequences by canonical authority.

The source-shaped inventory currently compresses to six provisional authorities:

```text
TWO_INTERLEAVED_ARITHMETIC
TWO_INTERLEAVED_GEOMETRIC
INTERLEAVED_ARITHMETIC_GEOMETRIC
ALTERNATING_FIXED_AFFINE_PHASE
PROGRESSIVE_MULTIPLY_PLUS_ADD
PROGRESSIVE_ALTERNATING_AFFINE_CYCLES
```

Executable collision decisions are:

```text
ALTERNATING_ADDITIVE_STEPS
  -> TWO_INTERLEAVED_ARITHMETIC

ALTERNATING_MULTIPLICATIVE_RATIOS
  -> TWO_INTERLEAVED_GEOMETRIC

ALTERNATING_ADD_THEN_MULTIPLY
ALTERNATING_MULTIPLY_THEN_ADD
  -> ALTERNATING_FIXED_AFFINE_PHASE

PROGRESSIVE_ADD_THEN_MULTIPLY_CYCLES
PROGRESSIVE_MULTIPLY_THEN_ADD_CYCLES
  -> PROGRESSIVE_ALTERNATING_AFFINE_CYCLES
```

Alternating fixed additions are two arithmetic position lanes, and alternating fixed multipliers are two geometric position lanes. The independent solver preserves both source representations as collision evidence while counting only one canonical projection. Operation order is currently treated as a phase parameter rather than a separate authority.

The CP-005 audit passes 4,800 deterministic English questions:

```text
Temporary templates:                         40
Source-shaped families:                      10
Provisional canonical authorities:            6
Questions per source family:                 480
Questions per task direction:              1,200
Alternating/interleaved collision proofs:    960
Provisional retained-family questions:     1,920
Interleaved-collapse questions:              960
Phase-variant merge questions:             1,920
Answer positions:             [1200, 1200, 1200, 1200]
Minimum distinct fingerprints/template:      70
Permanent QLs:                                 0
```

All questions pass deterministic replay, complete-pool independent solving, canonical ambiguity rejection, source-representation recovery, Easy/Medium/Hard reach, four unique options, option-specific diagnostics and lifecycle locks. The workflow exports 80 exact English review questions.

Across CP-001 through CP-005, the executable audit volume is 10,560 questions. The ten-to-six compression is provisional and remains open to source saturation, chapter-wide collision proof and editorial review.

## Required next evidence

Before any permanent allocation:

- saturate textbook, SSC, Banking, Railways and Punjab-exam sources;
- audit zero-step, descending, signed, fractional and decimal ownership;
- determine whether wrong-term detection shares the same authority as completion;
- test sparse displays, multiple blanks and alternate answer semantics;
- extend CP-005 to three-way and block interleaving, secondary-sequence differences and richer progressive grammars;
- prove cross-collisions among CP-003 finite differences, CP-004 recurrences and CP-005 composite authorities;
- decide whether fourth- and higher-order differences remain in CP-003;
- expand CP-004 source audit to prime-gap, composite-number, changing-power and richer recurrence patterns;
- begin CP-006 single-letter alphabetic discovery only after numeric boundaries remain stable under the next gap audit;
- define Hindi and Punjabi localization modes;
- review exact exported English samples;
- perform the candidate merge/split and permanent-identity decision only after those gates close.

## Status

`SER_001_OPEN_DISCOVERY_CP001_CP005_NUMERIC_FOUNDATION_AND_COMPRESSION_AUDIT_PASS`
