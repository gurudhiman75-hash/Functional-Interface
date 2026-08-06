# CLS-CP-006 — Hindi and Punjabi Localisation Review

Status: `EXECUTABLE_REVIEW_REQUIRED`

This layer localises the frozen English learner-facing text for:

- `CLS-QL-010 — Find the odd single letter`;
- `CLS-QL-011 — Find the odd ordered letter-pair`.

English remains the only mathematical, state-generation and solver authority.

## Localised learner surfaces

- question stems;
- the common-rule explanation;
- one explicit reason for every option;
- alphabet-position calculations;
- match/failure conclusions;
- step-by-step solution wording;
- exam-speed shortcuts;
- trap warnings.

## Canonical fields preserved exactly

- checkpoint, QL and solve-contract identity;
- source prototype and source seed;
- displayed letters and ordered letter-pairs;
- option order and option count;
- correct answer and answer index;
- intended rule and rule value;
- complete eight-rule ambiguity result;
- difficulty and difficulty features;
- English runtime traceability;
- every release lock.

## Coverage

```text
Permanent QLs:                      2
Single-letter rules:                3
Ordered letter-pair rules:          5
Complete rule authority:            8
Locales:               hi-IN and pa-IN
Option counts:                 4 and 5
Parity questions:                 2880
Reviewer questions:                 32
```

The executable audit replays 720 seeds for each QL in each translated locale. It proves exact parity for items, options, answers, rule identity, ambiguity evidence, difficulty, source traceability and lifecycle locks.

The reviewer includes every rule in both locales and in both four- and five-option form:

```text
8 rules × 2 locales × 2 option counts = 32 questions
```

## Language policy

Hindi and Punjabi use short teacher-style exam wording. The localisation must not expose English developer terminology, internal QL/prototype identifiers, registry language or lifecycle metadata.

Ordered pairs remain ordered. Direction-sensitive subtraction and vowel/consonant order must not be flattened during translation.

## Lifecycle

```text
English runtime:          FROZEN_ENGLISH_RUNTIME_PROOF
Hindi runtime:            LOCALIZED_REVIEW_REQUIRED
Punjabi runtime:          LOCALIZED_REVIEW_REQUIRED
Question Studio:          disabled
Question Bank:            NOT_STORED
Test eligibility:         INELIGIBLE
Public publication:       false
```

Editorial approval and multilingual freeze are separate explicit checkpoints after artifact review.
