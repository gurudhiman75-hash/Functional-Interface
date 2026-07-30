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
| `SER-CP-004` | powers, primes, recurrences and special-number sequences | open |
| `SER-CP-005` | alternating, interleaved and composite numeric sequences | open |
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

The prototype proves:

- deterministic positive and negative additive sequences;
- independent inference from displayed terms;
- ambiguity rejection;
- four unique misconception-oriented options;
- exact answer-position and difficulty reach;
- safe bounded integer domains;
- concise English worked reasoning;
- lifecycle locks that prevent accidental product exposure.

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

The committed audit contract covers 960 deterministic questions, balanced across both authorities, all four task directions, answer positions and three difficulty levels. It also checks parameter reconstruction, complete-pool ambiguity, bounded values, explanation completeness and all lifecycle locks.

Remote evidence is still pending: the current Series workflow protects the existing repository build and CP-001/CP-002 audits but does not yet execute `ser-cp-003.test.ts`. The workflow-file edit was blocked by the authenticated browser security policy, so no CP-003 pass count or artifact digest is claimed.

## Required next evidence

Before any permanent allocation:

- extend the Series workflow to execute and upload CP-003 audit and review evidence;
- saturate textbook, SSC, Banking, Railways and Punjab-exam sources;
- audit zero-step, descending, signed, fractional and decimal ownership;
- determine whether wrong-term detection shares the same authority as completion;
- test sparse displays, multiple blanks and alternate answer semantics;
- prove collisions with alternating-series, powers and recurrence candidates;
- decide whether fourth- and higher-order differences remain in CP-003;
- define Hindi and Punjabi localization modes;
- review exact exported English samples.

## Status

`SER_001_OPEN_DISCOVERY_CP001_CP003_NUMERIC_FOUNDATION_AUDIT_PENDING`
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
| `SER-CP-003` | first-, second- and higher-difference sequences | open |
| `SER-CP-004` | powers, primes, recurrences and special-number sequences | open |
| `SER-CP-005` | alternating, interleaved and composite numeric sequences | open |
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

The prototype proves:

- deterministic positive and negative additive sequences;
- independent inference from displayed terms;
- ambiguity rejection;
- four unique misconception-oriented options;
- exact answer-position and difficulty reach;
- safe bounded integer domains;
- concise English worked reasoning;
- lifecycle locks that prevent accidental product exposure.

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

## Required next evidence

Before any permanent allocation:

- saturate textbook, SSC, Banking, Railways and Punjab-exam sources;
- audit zero-step, descending, signed, fractional and decimal ownership;
- determine whether wrong-term detection shares the same authority as completion;
- test sparse displays, multiple blanks and alternate answer semantics;
- prove collisions with difference-hierarchy and alternating-series candidates;
- define Hindi and Punjabi localization modes;
- review exact exported English samples.

## Status

`SER_001_OPEN_DISCOVERY_CP001_CP002_NUMERIC_FOUNDATION`
