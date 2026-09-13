# Quant V4 — TRG Runtime-Role Audit, Checkpoint 2 (P2)

Authority: `QUANT-V4-TRG-RUNTIME-ROLE-AUDIT-CHECKPOINT2-P2`

## Scope

This checkpoint continues the external real-exam audit after `QUANT-V4-TRG-REAL-EXAM-COVERAGE-MATRIX-P2`.

The purpose is to replace broad design-language assumptions with proof from the active `TRG-001` runtime chain on current `New-main`.

This is an audit record only. It does not activate Question Studio, change production-frequency weights or open any publication gate.

## Runtime authority inspected

The current TRG final surface identifies `production-final-editorial-runtime.ts` as the active English review runtime, wrapping the diversity-remediated and audit-remediated authority chain.

The permanent authority remains 144 QLs, with `TRG-001-QL-142...144` assigned to `EQUIVALENCE_VERIFICATION_COMPOSITE`.

## Finding 1 — 2024 tan-to-sin-cos-product form is explicitly covered

Real evidence:

- SSC CGL Tier-I, 17 Sep 2024 Shift 1, Q22
- given `tan A = 1` for acute `A`
- evaluate `4 sin A cos A`
- evidence representation: `TAN_TO_SIN_COS_PRODUCT_MCQ`

Concrete runtime proof:

- `TRG-001-QL-094`
- active orientation/diversity runtime solve mode: `evaluateSinCosProductFromTanOriented`
- the final editorial status explicitly records QL-094 as `sinθ cosθ` reconstructed from a tangent ratio and calibrates it to Medium difficulty.

Decision:

- change audit classification from `COVERED_BROAD` to **`COVERED`**;
- no new QL is needed for this real-exam form;
- the SSC item with `tan A = 1` is a special numerical instance of an already more general engine role.

## Finding 2 — power identity from an imposed cosine relation is missing

Real evidence:

- SSC CGL Tier-I, 26 Jul 2023 Shift 1, Q62
- relation: `cos A + cos² A = 1`
- target form: `sin⁴ A + sin⁶ A`
- real reduction: `sin² A = cos A`, therefore `sin⁴ A + sin⁶ A = cos² A(1 + cos A) = cos A`
- evidence representation: `TRIG_POWER_IDENTITY_FROM_COS_RELATION_MCQ`

The previous matrix marked this `COVERED_BROAD` under the broad CP-006 mixed-identity authority.

Direct runtime inspection does not support that classification.

The active authority contains:

- fundamental `sin²+cos²=1` roles;
- expression-from-known-ratio roles;
- mixed fundamental-identity products and ratios;
- fourth-power results created from reciprocal Pythagorean identities;
- controlled angle-sum/difference and double-angle roles;
- terminal composite/equivalence roles.

However, no explicit role was located that:

1. accepts a non-standard imposed relation such as `cos A + cos² A = 1`;
2. derives a substitution such as `sin² A = cos A` from that relation plus `sin² A + cos² A = 1`;
3. propagates that substitution through fourth/sixth powers; and
4. asks for the resulting expression/value in the SSC form observed here.

Broad wording such as “mixed identity expressions” is not runtime proof.

Decision:

- change audit classification from `COVERED_BROAD` to **`MISSING`**;
- proposed solve-role family: `deriveTrigPowerExpressionFromImposedRelation`;
- do not fake coverage by treating an unrelated fourth-power identity role as equivalent.

## Finding 3 — the cubic factorisation gap remains missing

The 9 Sep 2024 Shift 2 form

`(sin³ A − cos³ A)/(sin A − cos A)`

still has no explicit runtime role.

Required reasoning is materially distinct:

1. use `a³−b³=(a−b)(a²+ab+b²)`;
2. cancel the common factor where defined;
3. use `sin² A + cos² A = 1`;
4. obtain the reduced expression.

Status remains **`MISSING`**.

Proposed solve role: `simplifyTrigDifferenceOfCubes`.

## Finding 4 — QL-142...144 are not safe replacement slots

The earlier coverage matrix proposed inspecting the terminal composite slots before adding any permanent role. That inspection is now complete.

### QL-142

Active audit-remediated role:

- `verifySecTanCompositeEquivalence` / `verifyCosecCotCompositeEquivalence`
- combines reciprocal-plus-quotient rewriting, a conjugate-style product and the Pythagorean identity.

This role is already specifically hardened and has localization regression coverage for both sec/tan and cosec/cot variants.

### QL-143

Authority source role:

- composite tangent/cotangent with secant/cosecant identity simplification;
- semantically distinct from QL-142 and from the two newly identified PYQ gaps.

### QL-144

Custom authority role:

- `identifyCompositeDoubleAngleEquivalence`
- simplifies `(1−cos2θ)/sin2θ` to `tanθ` using controlled double-angle identities.

This is also distinct.

Decision:

- **do not replace QL-142, QL-143 or QL-144 merely to preserve the number 144**;
- doing so would trade a demonstrated role for a different demonstrated role and would make the audit less exhaustive, not more exhaustive.

## Authority-amendment decision

Do not patch the permanent ledger piecemeal yet.

There are now at least two externally demonstrated missing TRG-001 archetypes:

1. cubic trigonometric difference-of-cubes factorisation;
2. power-expression derivation from an imposed trig relation.

The correct sequence is:

1. finish the remaining TRG real-PYQ runtime-role classification;
2. finish stem/distractor/explanation realism review for represented roles;
3. collect every externally proven missing archetype found in this TRG pass;
4. amend the permanent authority once, deliberately, with explicit new family counts/IDs rather than repeatedly reshuffling the 144 envelope.

If no further missing roles are found, the current evidence would justify expanding the CP-006 authority by two explicit roles rather than deleting unrelated terminal coverage. The exact permanent IDs are intentionally not assigned in this checkpoint so that one complete external-gap decision can be made after the TRG audit closes.

## Updated real-PYQ classification deltas

| Real-exam form | Previous status | Runtime-proven status |
|---|---|---|
| `tan A` -> `sin A cos A` product | `COVERED_BROAD` | `COVERED` via QL-094 |
| imposed `cos A + cos²A = 1` -> higher sine powers | `COVERED_BROAD` | `MISSING` |
| cubic trig difference-of-cubes | `MISSING` | `MISSING` |
| pole/ground physical right triangle | `MISCLASSIFIED` | `TRG-002`, correction retained |

## Next checkpoint

Continue TRG-001 with **quality realism**, not frequency tuning:

1. sample the real-PYQ-matched QLs on the active final runtime;
2. compare stem wording against SSC style;
3. inspect distractors for plausible mathematical failure modes;
4. inspect explanations for beginner-readable, step-by-step reasoning without shortcut-only solutions;
5. check whether difficulty labels reflect actual reasoning depth rather than cosmetic complexity;
6. identify repeated/synthetic stem structures and low-novelty roles;
7. only after this quality pass, finalize the one-time TRG authority amendment for all externally proven missing archetypes.

## Gate state

Unchanged:

- whole-section frequency profile remains audit-only;
- `productionPromotionAuthorized=false`;
- no production weighting is authorized;
- no Question Studio/Test Builder/public activation is authorized by this audit checkpoint;
- execution/CI is not claimed by this document.