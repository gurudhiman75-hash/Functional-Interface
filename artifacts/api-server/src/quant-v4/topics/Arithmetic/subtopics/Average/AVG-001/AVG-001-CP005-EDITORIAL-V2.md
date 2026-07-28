# AVG-001 CP-005 Editorial V2 Candidate

## Status

**IMPLEMENTED AS A REVIEW CANDIDATE — NOT WIRED INTO THE FROZEN ENGLISH RELEASE**

This wave upgrades all 56 `AVG-CP-005` question-language units while preserving the current `AVG-001-EN-v1` production pipeline.

## Coverage

- QL range: `AVG-QL-274` through `AVG-QL-329`;
- eight correction solve modes;
- examination marks, salaries, ages, production, sales, innings, parcel weights and abstract records;
- natural competitive-exam stems with explicit targets;
- semantic answer units and Indian currency grouping;
- misconception-derived distractors rather than nearby-number filler;
- exact four-tier explanations;
- value-to-misconception traceability for every wrong option;
- unchanged solver state, exact answer and mathematical fingerprint.

## Distractor policy

The candidate generates wrong options from the actual error path for each solve mode, including:

- ignoring the correction;
- reversing the correction sign;
- using count plus or minus one;
- failing to scale an average shift by the count;
- applying only one of two corrections;
- multiplying where division is required.

Fallback arithmetic distractors are used only when two misconception calculations collapse to the same displayed value.

## Validation

The dedicated audit generates five deterministic instances for each QL, producing 280 candidate packages. It checks:

- exact-answer and mathematical-fingerprint preservation;
- resolved, contextual stems;
- four unique, positive and consistently qualified options;
- correct-index integrity;
- explicit misconception trace for all three wrong options;
- four-tier explanation structure and answer evidence;
- absence of known mechanical correction phrasing;
- cross-QL rendered-stem uniqueness.

## Release boundary

The candidate is applied only by the CP-005 v2 audit and review export. Production wiring and `AVG-001-EN-v2` publication remain deferred until the remaining editorial waves pass review.
