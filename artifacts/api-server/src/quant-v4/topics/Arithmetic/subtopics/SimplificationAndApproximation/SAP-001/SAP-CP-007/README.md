# SAP-CP-007 — Rounding, Place Value and Precision Control

**Branch:** `feat/sap-cp007-rounding-foundation`  
**Base:** inactive CP-006 human-review candidate  
**Lifecycle:** provisional / inactive / no permanent QL allocation

## Frozen learner boundary

CP-007 owns the mechanics and direct consequences of one explicitly declared rounding rule. It does not own free estimation, option-led competing estimates, general measurement conventions or applied approximation stories.

The chapter tie rule for this provisional foundation is machine-declared as:

`HALF_AWAY_FROM_ZERO`

All rounding decisions use exact integer/fixed-point arithmetic. JavaScript binary floating-point equality is not used to decide a tie or a rounding direction. Required trailing zeroes are preserved when the requested precision is part of the learner task.

## Foundation solve identities — 12

Candidate coordinates only:

1. `SAP-QL-113` — round an integer to nearest ten/hundred/thousand;
2. `SAP-QL-114` — round a decimal to nearest integer;
3. `SAP-QL-115` — round a decimal to declared decimal places;
4. `SAP-QL-116` — negative exact-half case under the explicit tie rule;
5. `SAP-QL-117` — identify the deciding place-value digit;
6. `SAP-QL-118` — choose the correctly rounded precision representation, including required trailing zeroes;
7. `SAP-QL-119` — reconstruct the integer interval that rounds to a target;
8. `SAP-QL-120` — reconstruct the decimal interval that rounds to a target;
9. `SAP-QL-121` — least integer that rounds to a target;
10. `SAP-QL-122` — greatest integer that rounds to a target;
11. `SAP-QL-123` — missing deciding digit consistent with a rounded result;
12. `SAP-QL-124` — absolute error after one declared rounding step.

## Source guard

The source/ownership audit explicitly admits **place-value rounding** to CP-007. The broader scope mentions significant figures only "where exam evidence supports it", but the current source audit does not register a concrete significant-figure fixture.

Therefore significant-figure QLs are **not admitted in this foundation**. They remain source-guarded until exam evidence is registered and verified.

## Independent proof gate

The v2 foundation authority executes **100 seeds × 12 identities = 1,200 deterministic cases** and independently checks:

- integer rounding from neighbouring multiples;
- fixed-point decimal rounding without floating-point tie decisions;
- exact negative halfway states under half-away-from-zero;
- deciding place-value digit;
- required two-decimal representation and trailing zero preservation;
- reverse integer and decimal interval endpoints;
- least/greatest admissible integers;
- displayed missing-digit options by direct substitution;
- absolute rounding error on a common exact scale;
- four unique options with exactly one correct answer;
- answer-position balance;
- payload and identity diversity;
- candidate QL range `SAP-QL-113..124`;
- inactive lifecycle and no Question Studio/bank/test/public exposure;
- no significant-figure leakage.

## Deliberately deferred

Still to be implemented after this foundation is green:

- comparison of results at different precisions;
- maximum possible rounding error;
- simple relative/percentage rounding error directly tied to the rounding interval;
- premature-rounding diagnosis;
- significant figures only if source evidence is found.

## Lifecycle lock

Every package remains:

- `permanentQlId: null`;
- `contentStatus: "ENGLISH_REVIEW_CANDIDATE"`;
- `active: false`;
- `questionStudioDiscoverable: false`;
- `questionBankWritable: false`;
- `testEligible: false`;
- `publiclyPublishable: false`.

No permanent QL allocation or activation is permitted while CP-004, CP-005 and CP-006 semantic gates remain unresolved.
