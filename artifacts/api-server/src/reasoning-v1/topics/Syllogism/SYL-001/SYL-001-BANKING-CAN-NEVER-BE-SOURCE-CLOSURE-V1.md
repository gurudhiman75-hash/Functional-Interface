# SYL-001 Banking `can never be` — source closure V1

Status: `PROTOTYPE_SOURCE_CLOSURE_NOT_REGISTERED`

This checkpoint closes the previously unresolved negative-modal semantics without changing any registered QL or enabling delivery.

## Evidence boundary

Reviewed source families include Banking preparation/transcription material that explicitly uses `can never be` alongside ordinary and possibility conclusions. The evidence is adequate to define a safe prototype semantic contract, but it is still secondary evidence rather than a completed direct official-paper/answer-key census.

Representative external evidence reviewed on 2026-08-12 includes Banking-oriented examples from PracticeMock, BankersAdda, Studylib question transcriptions, AmbitiousBaba and Unacademy concept coverage.

## Semantic closure

Two surface families are modeled separately.

### `All A can never be B`

Interpretation: it is impossible for **all A to be B**.

Executable rule:

```text
underlying conclusion = ALL(A, B)
can-never-be follows iff canBeTrue === false
```

Equivalently, the premises force at least one `A` outside `B`.

### `Some A can never be B`

Interpretation: at least one `A` is definitely outside `B`.

Executable rule:

```text
underlying conclusion = SOME_NOT(A, B)
can-never-be follows iff classification === ENTAILED
```

This is deliberately not treated as an open possibility claim.

## Why the forms are not collapsed

`All A can never be B` tests impossibility of a universal relation. `Some A can never be B` tests a forced negative witness. They therefore use different canonical solver queries even though the English surface shares `can never be`.

## Answer-position calibration

The corrected Banking possibility V2 population previously measured:

```text
A 69 / B 39 / C 51 / D 39 / E 42
```

The follow-up balance wrapper uses a versioned deterministic target position:

```text
correctIndex = abs(seed) % 5
```

For the standard 80-seed × 3-locale audit this yields exactly:

```text
A 48 / B 48 / C 48 / D 48 / E 48
```

Only option order and `correctIndex` change. Statements, conclusions, semantic answer, explanations, option labels and lifecycle metadata remain unchanged.

## Lifecycle locks

```text
legacy QL changed:          false
registered QL created:      false
profile planner connected:  false
Question Studio visible:    false
question bank writable:     false
test eligible:              false
public:                     false
activation permitted:       false
```

## Remaining after this checkpoint

1. Run exact-head automated proof for both the negative-modal shell and V2 balance wrapper.
2. Produce a human-review candidate for the new negative-modal wording and explanations in English, Hindi and Punjabi.
3. Expand direct official/independently archived source evidence before final production weighting.
4. After human/product approval, perform compatibility-safe QL registration and inactive profile-planner integration proof.
