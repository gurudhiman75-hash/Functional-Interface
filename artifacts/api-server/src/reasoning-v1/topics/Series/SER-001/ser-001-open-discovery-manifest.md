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

`SER_001_OPEN_DISCOVERY_SER_CP001_ADDITIVE_PROTOTYPE`
