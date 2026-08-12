# SAP-CP-007 — Rounding, Place Value and Precision Control

**Branch:** `feat/sap-cp007-rounding-foundation`  
**Base:** inactive CP-006 human-review candidate  
**Lifecycle:** provisional / inactive / no permanent QL allocation / human semantic review required

## Frozen learner boundary

CP-007 owns the mechanics and direct consequences of one explicitly declared rounding rule. It does not own free estimation, option-led competing estimates, general measurement conventions or applied approximation stories.

The chapter tie rule is machine-declared as:

`HALF_AWAY_FROM_ZERO`

All rounding decisions use exact integer/fixed-point arithmetic. JavaScript binary floating-point equality is not used to decide a tie or rounding direction. Required trailing zeroes are preserved when the requested precision is part of the learner task.

## Current candidate solve identities — 16

### Foundation — SAP-QL-113..124

1. `SAP-QL-113` — round an integer to nearest ten/hundred/thousand;
2. `SAP-QL-114` — round a decimal to nearest integer;
3. `SAP-QL-115` — round a decimal to declared decimal places;
4. `SAP-QL-116` — negative exact-half case under the explicit tie rule;
5. `SAP-QL-117` — identify the deciding place-value digit;
6. `SAP-QL-118` — choose the correctly rounded precision representation, including required trailing zeroes and carry-through-9 cases;
7. `SAP-QL-119` — reconstruct the integer interval that rounds to a target;
8. `SAP-QL-120` — reconstruct the decimal interval that rounds to a target;
9. `SAP-QL-121` — least integer that rounds to a target;
10. `SAP-QL-122` — greatest integer that rounds to a target;
11. `SAP-QL-123` — missing deciding digit consistent with a rounded result;
12. `SAP-QL-124` — absolute error after one declared rounding step.

### Rounding consequences wave two — SAP-QL-125..128

13. `SAP-QL-125` — compare the same exact value rounded to two different precisions;
14. `SAP-QL-126` — maximum possible absolute rounding error from the declared rounding unit;
15. `SAP-QL-127` — exact relative rounding error as a reduced fraction of the original value;
16. `SAP-QL-128` — diagnose premature rounding when inputs are rounded before the required final operation.

These are **candidate coordinates only**. The permanent SAP registry remains unchanged.

## Source guard — significant figures remain held

The source/ownership audit explicitly admits **place-value rounding** to CP-007. The broader frozen scope mentions significant figures only "where exam evidence supports it", but the current source audit does not register a concrete significant-figure fixture.

Therefore significant-figure QLs are **not admitted** to the current CP-007 candidate. They remain source-guarded until exam evidence is registered and independently verified. The current authorities explicitly reject significant-figure leakage.

## Executable proof status

### Foundation authority

Current v4 authority: **1,200 deterministic cases = 100 seeds × 12 identities**.

It independently proves:

- integer rounding from neighbouring multiples;
- fixed-point decimal rounding without floating-point tie decisions;
- exact negative halfway states under half-away-from-zero;
- deciding place-value digit;
- required two-decimal representation and trailing-zero preservation;
- reverse integer and decimal interval endpoints;
- least/greatest admissible integers;
- displayed missing-digit options by direct substitution;
- absolute rounding error on a common exact scale;
- 1,200 unique payloads and generation identities;
- exactly 300 correct answers in each A/B/C/D position;
- candidate range `SAP-QL-113..124`;
- inactive lifecycle and no Question Studio/bank/test/public exposure.

### Wave-two authority

Current v2 authority: **400 deterministic cases = 100 seeds × 4 identities**.

It independently proves:

- all three cross-precision relations `A < B`, `A = B`, `A > B`;
- 100 distinct student-facing stems for every wave-two identity;
- maximum possible error equals exactly half one rounding unit;
- relative error uses `absolute error / exact original`, not the rounded value;
- premature rounding actually changes the final rounded result in every generated diagnosis case;
- QL-128 supplies 100 distinct exact final answers;
- exactly 100 correct answers in each A/B/C/D position;
- candidate range `SAP-QL-125..128`;
- inactive lifecycle and no significant-figure leakage.

Combined executable proof: **16 identities / 1,600 deterministic cases**.

## 300-question human-review gate

A combined review selector now produces **300 unique English questions across all 16 identities**:

- foundation identities: 19 review questions each;
- wave-two identities: 18 review questions each;
- exactly **75 A / 75 B / 75 C / 75 D** correct positions;
- no three-answer-position streak;
- no duplicate payloads or duplicate visible stems within a QL.

The selector deliberately forces bounded-family coverage instead of trusting random sampling:

- nearest-ten/hundred/thousand coverage in direct/inverse integer families;
- 1/2/3 decimal-place coverage;
- both negative midpoint precisions;
- both carry and no-carry trailing-zero representations in QL-118;
- both missing-digit threshold directions;
- all five absolute error values `0.01..0.05`;
- all three QL-125 comparison relations;
- all four QL-126 maximum-error precision classes;
- ten/hundred/thousand coverage in QL-127;
- both `.49` and `.51` premature-rounding constructions in QL-128.

The final review authority independently reconstructs the mathematics for every selected record and is green.

## Editorial remediation already applied

Manual inspection of the generated review artifact led to a final review-facing remediation layer:

- QL-114 nearest-integer distractors are now nearby plausible integer errors rather than an obviously weak `+10` option;
- QL-118 alternates no-carry and carry-through-9 rounding while retaining the required trailing zero, e.g. `10.797 → 10.80`;
- QL-126 wording uses natural forms such as "to 1 decimal place";
- QL-127 uses normal exam language such as "nearest ten/hundred/thousand" rather than numeric place names;
- misconception analyses remain tied to specific rounding mistakes rather than arbitrary nearby values.

The remediated 300-question artifact was regenerated and the full authority remained green.

## Lifecycle lock

CP-007 is now an **inactive human-review candidate**, not a release candidate.

Every package remains:

- `permanentQlId: null`;
- `contentStatus: "ENGLISH_REVIEW_CANDIDATE"`;
- `active: false`;
- `questionStudioDiscoverable: false`;
- `questionBankWritable: false`;
- `testEligible: false`;
- `publiclyPublishable: false`.

Before permanent allocation or activation:

1. human semantic/exam-readiness approval of the CP-007 300-question review artifact;
2. dependent CP-004, CP-005 and CP-006 semantic gates must be resolved in order;
3. any future significant-figure identity requires registered source evidence first;
4. permanent QLs must be allocated through the registry;
5. Question Studio, bank, tests and publication surfaces must then be activated explicitly.
