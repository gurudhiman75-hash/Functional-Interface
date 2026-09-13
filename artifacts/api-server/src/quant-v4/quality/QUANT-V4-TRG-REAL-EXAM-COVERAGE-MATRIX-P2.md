# Quant V4 — Trigonometry Real-Exam Coverage Matrix (P2)

Authority: `QUANT-V4-TRG-REAL-EXAM-COVERAGE-MATRIX-P2`

## Purpose

This checkpoint compares real SSC CGL trigonometry observations in the whole-section audit corpus against the current Trigonometry family authority on `New-main`.

This is an external-realism audit. A package is not treated as complete merely because its internal QL count is complete.

Status vocabulary:

- `COVERED` — the real-paper form has an explicit CP/family home in the current authority.
- `COVERED_BROAD` — the form fits an authorized family, but the family description is broad enough that runtime-role verification is still desirable.
- `MISCLASSIFIED` — the evidence observation was assigned to the wrong package.
- `AMBIGUOUS` — the design language is broad enough to possibly allow the form, but no explicit role/runtime evidence was located.
- `MISSING` — no defensible authority/runtime home was found.

## Family boundary correction

Current Trigonometry authority is explicit:

- `TRG-001` — trigonometric ratios, exact values, identities and controlled symbolic relations.
- `TRG-002` — Heights & Distances / physical line-of-sight applications.

Therefore the 10 Sep 2024 Shift 1 pole-against-ground problem belongs to `TRG-002`, not `TRG-001`.

The evidence observation has been corrected. Consequences at the 300-question Wave-12 corpus:

- `TRG-001`: 33 -> 32
- `TRG-002`: 0 -> 1
- package coverage: 28 -> 29
- top-three concentration: 29.00% -> 28.67%

This demonstrates that frequency calibration must follow package authority, not superficial mathematical similarity.

## Real-paper archetype matrix

| Real-exam form | Representative evidence | Correct package | Current authority home | Status | Audit note |
|---|---|---|---|---|---|
| Direct standard-angle expression | 2022-12-01 S1 Q56 | TRG-001 | CP-002 standard exact values / mixed standard expressions | COVERED | Direct authority match. |
| Right-triangle sine/cosine reconstruction | 2022-12-01 S1 Q65 | TRG-001 | CP-001 right-triangle ratios and side recovery | COVERED | Direct authority match. |
| `tan²/cot²/sec²/cosec²` identity simplification | 2022-12-01 S1 Q72 | TRG-001 | CP-004 fundamental identities | COVERED | Direct authority match. |
| `sec A ± tan A` reciprocal relation | 2023-07-27 S2 Q50 | TRG-001 | CP-005 `sec(theta) ± tan(theta)` | COVERED | Explicitly named family. |
| Secant–tangent Pythagorean identity with parameters | 2023-07-27 S2 Q35 | TRG-001 | CP-004 `sec²-tan²=1` | COVERED | Explicitly named identity family. |
| Angle addition exact value (`cosec 75°`) | 2023-07-25 S1 Q52 | TRG-001 | CP-006 controlled angle-sum/difference | COVERED | Explicit CP-006 family. |
| `tan -> sec` reconstruction | 2023-07-25 S1 Q62 / 2024-09-09 S2 Q1 | TRG-001 | CP-004 / CP-005 expression from known ratio | COVERED | Repeated real-paper form. |
| Composite angle-addition trig evaluation | 2023-07-25 S1 Q74 | TRG-001 | CP-006 angle-sum/difference / composite exam forms | COVERED | Direct authority match. |
| Identity relation producing higher powers (`cos A + cos²A = 1`) | 2023-07-26 S1 Q62 | TRG-001 | CP-006 mixed identity expressions | COVERED_BROAD | The family is broad enough, but an explicit permanent role should be verified. |
| Standard-value difference (`cosec30° - cos60°`) | 2023-07-26 S1 Q67 | TRG-001 | CP-002 sums/differences | COVERED | Direct authority match. |
| Right-triangle complementary-angle simplification | 2023-07-26 S2 Q59 | TRG-001 | CP-003 complementary relations + CP-001 ratio recovery | COVERED | Legitimate cross-family construction within TRG-001. |
| Linear sine/cosine relation -> cotangent | 2023-07-26 S2 Q64 | TRG-001 | CP-005 `a sin(theta)=b cos(theta)` | COVERED | Explicitly named family. |
| `sin -> cos` Pythagorean recovery | 2023-07-26 S2 Q68 | TRG-001 | CP-001/CP-005 derived ratios | COVERED | Direct authority match. |
| Given `tan`, derive `sec` | 2024-09-09 S2 Q1 | TRG-001 | CP-004 sec/tan identity | COVERED | Direct authority match. |
| Trigonometric cubic factorization `(sin³A-cos³A)/(sinA-cosA)` | 2024-09-09 S2 Q12 | TRG-001 | No explicit cubic trig role located | MISSING | The current identity authority enumerates quadratic/reciprocal identities. Broad "composite" wording is insufficient proof of runtime coverage. Repository search found no explicit cubic trig role. |
| Sec/cosec with tan/cot identity expression | 2024-09-10 S1 Q6 | TRG-001 | CP-004 fundamental identities / rational simplification | COVERED | Direct authority match. |
| Pole against ground / physical right-triangle scene | 2024-09-10 S1 Q11 | TRG-002 | TRG-002 Heights & Distances | MISCLASSIFIED | Evidence corrected from TRG-001 to TRG-002. |
| `sin theta` vs `cos theta` interval ordering | 2024-09-10 S1 Q16 | TRG-001 | CP-002 comparison/ranking | COVERED | The archetype explicitly authorizes comparison/ranking. |
| Complementary cosecant/cosine transformation | 2024-09-17 S1 Q1 | TRG-001 | CP-003 complementary relations | COVERED | Direct authority match. |
| Given secant, reconstruct cosecant/cotangent expression | 2024-09-17 S1 Q21 | TRG-001 | CP-001 derived ratios / CP-005 derived expression | COVERED | Supported by exact right-triangle reconstruction. |
| Given tangent, evaluate `sin A cos A` product | 2024-09-17 S1 Q22 | TRG-001 | CP-005 derived ratio expression / CP-006 composite expression | COVERED_BROAD | Correct package/family, but explicit permanent-role verification remains useful. |

## Main finding

The TRG-001 engine is not broadly deficient. Most observed SSC forms map cleanly to the six-CP authority.

The audit nevertheless found two material issues:

1. **taxonomy contamination** — one Heights & Distances question had been counted inside TRG-001 even though the family authority assigns it to TRG-002;
2. **real-PYQ coverage gap** — the cubic trigonometric factorization form is not explicitly represented by the authority/runtime evidence located so far.

The second point matters because the package already has 144 permanent QLs. Internal count completeness therefore masked an external-realism gap.

## Required remediation for cubic trig form

Do not add a 145th QL merely to patch the audit.

Preferred remediation:

1. retain the 144-QL permanent-ID envelope;
2. use one existing CP-006 `EQUIVALENCE_VERIFICATION_COMPOSITE` slot (`QL-142...144`) if semantic-duplication review shows one current role can be replaced without losing unique SSC-relevant coverage;
3. add an explicit solve role for cubic trig factorization, e.g. `simplifyTrigDifferenceOfCubes`;
4. generate at least two natural SSC-style stem surfaces;
5. use the algebraic factorization `a³-b³=(a-b)(a²+ab+b²)` followed by `sin²A+cos²A=1`;
6. construct distractors from real failure modes: sign error in factorization, dropping the `sinA cosA` term, using `1-sinA cosA`, or failing cancellation;
7. explanation must show factorization first and Pythagorean substitution second; no shortcut-only explanation;
8. add independent mathematical verification and seed-level option-uniqueness tests;
9. add a direct PYQ-coverage regression tying the role to the observed 2024-09-09 S2 form;
10. do not alter package frequency or production activation as part of this content fix.

If all three terminal composite roles are proven uniquely necessary, amend the Phase-0 subfamily allocation deliberately rather than silently moving a QL across locked families.

## Next TRG audit work

1. inspect the active authority roles for `QL-142...144` to choose a non-destructive replacement candidate;
2. verify the two `COVERED_BROAD` forms against actual runtime solve modes;
3. scan the remaining 2023/2022 TRG observations for any other family-boundary mistakes;
4. then perform stem/distractor/explanation quality review against the real-paper forms;
5. only after that should TRG-001 be considered externally exam-ready.

## Gate state

No production-frequency authorization is changed by this checkpoint.

- frequency profile remains audit-only;
- `productionPromotionAuthorized=false`;
- no Question Studio activation decision is implied;
- TypeScript/CI execution is not claimed.
