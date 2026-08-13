# RNK-CP-002 English Manual Review

Status: **approved for English discovery freeze**.

Review pack: **48 questions** — eight authorities × six representative records.

Approved learner-facing projection:

```text
sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
```

## Review scope

Every reviewed record was checked for:

- mathematical agreement with the normalized two-person state or valid-order branch analysis;
- correct distinction between positional gap and people strictly between;
- correct start/end normalization;
- correct directional offset arithmetic;
- validity of high-total and reversed-order total branches;
- exact-total versus indeterminate answers;
- proposed-total compatibility and impossible outcomes;
- unique answer and plausible misconception-owned options;
- merit-list, row and queue terminology;
- question-specific rules, steps, shortcuts and conclusions;
- internal identifier leakage;
- zero/one grammar and contextual end wording.

## Findings remediated

1. `start end` and `end end` were replaced with physical context language:
   - top / bottom;
   - left end / right end;
   - front / back.
2. Generic `first person` and `second person` answers were replaced with the actual names.
3. `top end` and `front end` were simplified to natural exam language.
4. `the the ...` article duplication was removed.
5. `with no people/candidates between them` became `with no one between them`.
6. Generic conclusions such as `required answer` and `required count` were replaced with the concrete result.
7. Earlier discovery review removed distant, exam-unrealistic distractors while preserving valid alternative-order totals where conceptually necessary.

## Preservation boundary

The English review layer may change learner-facing text and contextual categorical labels only. It must preserve:

- displayed evidence;
- normalized state;
- correct option index;
- canonical mathematical answer/status in review metadata;
- canonical option values/statuses in review metadata;
- mathematical fingerprint;
- difficulty and context;
- complete release locks.

## Approval decision

```text
reviewed questions:             48 / 48
accepted authorities:            8 / 8
open editorial blockers:             0
open CP-002 source dimensions:       0
verdict: APPROVED_FOR_ENGLISH_DISCOVERY_FREEZE
```

This approval grants stable English review identity only. It does not grant Question Studio, Question Bank, mock-test, localisation or publication eligibility.
