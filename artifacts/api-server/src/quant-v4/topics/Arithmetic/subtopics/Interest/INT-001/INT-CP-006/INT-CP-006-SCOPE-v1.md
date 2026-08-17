# INT-CP-006 — SI–CI Differences and Successive-Interest Relations

Status: **English product-owner approved; freeze validation in progress; inactive delivery boundary**

## Approval authority

The 52-question English review artifact was approved by the product owner on **2026-08-17**.

Approved learner source:
- source head: `a1179b6e584a7ce8c1e842a290a3cb8fccc47068`
- review workflow run: `31959447968` — PASS
- review artifact: `9266878505` (`int-cp006-v1-english-review`)
- artifact digest: `sha256:2d3516a3fa308f4e85d1673218b65be4647fd13a406e1cf949a9d67a15aa4f90`
- freeze authority: `INT-CP-006-EN-v1-frozen`

The freeze wrapper must preserve the approved English learner projection exactly. Hindi/Punjabi localization is a later checkpoint.

## Permanent learner QLs

The following 13 identities are approved for the CP006 English authority.

| QL | Contract | Given → answer |
|---|---|---|
| INT-QL-096 | Two-year SI–CI difference | principal + rate → difference |
| INT-QL-097 | Three-year SI–CI difference | principal + rate → difference |
| INT-QL-098 | Principal from two-year difference | difference + rate → principal |
| INT-QL-099 | Rate from two-year difference | difference + principal → annual rate |
| INT-QL-100 | Rate from two-year SI and CI | SI + CI → annual rate |
| INT-QL-101 | Principal from two-year SI and CI | SI + CI → principal |
| INT-QL-102 | Cross-duration SI–CI difference | rate + D2/D3 → the other difference |
| INT-QL-103 | Rate from two- and three-year differences | D2 + D3 → annual rate |
| INT-QL-104 | Principal from two- and three-year differences | D2 + D3 → principal |
| INT-QL-105 | Rate from consecutive yearly CI interests | J_k + J_(k+1) → annual rate |
| INT-QL-106 | Principal from consecutive yearly CI interests | J_k + J_(k+1) → principal |
| INT-QL-107 | First SI–CI-difference threshold year | principal + rate + target delta → first year |
| INT-QL-108 | First-year CI interest from second-year excess | J2−J1 + rate → J1 |

## Source recovery

Legacy CP006 leads recovered:
- `int_ci_si_difference_2_years`
- `int_ci_si_difference_3_years`
- `int_rate_from_ci_si_diff_2y`
- `int_principal_from_ci_si_diff_2y`
- `int_si_ci_amount_difference` (presentation variant only; no separate QL)

Design-backed inverse/relationship closure recovered from `INT-001-END-TO-END-DESIGN.md`:
- rate/principal recovery from SI and CI observations;
- ratio/cross-duration difference relations;
- consecutive yearly-interest reconstruction;
- first threshold year;
- first-year interest from second-year excess.

## Collision decisions

CP003 remains sole owner of:
- direct specified/nth-year compound interest from principal/rate (`INT-QL-059`);
- principal/rate inverse from one specified-year interest (`INT-QL-060/061`);
- later yearly interest from an earlier yearly interest with the rate already supplied (`INT-QL-066`).

CP006 owns only relations in which SI-vs-CI comparison or **two yearly-interest observations / their excess** are decisive.

## Mathematical authority

For principal `P`, annual rate as decimal `r`, annual compounding:

- `SI_n = Pnr`
- `CI_n = P[(1+r)^n−1]`
- `D_n = CI_n−SI_n`
- `D_2 = Pr^2`
- `D_3 = P(3r^2+r^3) = D_2(3+r)`
- yearly CI interest `J_k = Pr(1+r)^(k−1)`
- `J_(k+1)/J_k = 1+r`
- `J_2−J_1 = Pr^2 = D_2`

Shortcut identities are learner conveniences, not verifier authority. The independent verifier must rebuild simple interest and compound balances period by period.

## Editorial rules

- ordinary principals should remain exam-manageable;
- no real-bank/product claims or current rates;
- three genuine authored stem frames per QL;
- distractors must correspond to identifiable misconception calculations, not arbitrary nearby values;
- money should be exact or show at most two decimal places;
- inverse-rate questions use exact relations / bounded admissible rates, never floating roots;
- explanations must show the decisive relation and then connect it to the supplied values.

## Delivery boundary

This checkpoint does not authorize Question Studio or learner delivery:
- `enabled: false`
- `stagingStatus: NOT_STAGED`
- `registrationStatus: NOT_REGISTERED`
- `questionStudioDiscoverable: false`
- Question Bank: `NOT_STORED`
- tests: `INELIGIBLE`
- public publication: `false`
