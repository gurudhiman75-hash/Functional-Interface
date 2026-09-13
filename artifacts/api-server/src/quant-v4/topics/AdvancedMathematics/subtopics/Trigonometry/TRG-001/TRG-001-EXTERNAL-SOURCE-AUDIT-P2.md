# TRG-001 External Source Audit P2

Status: **AUDIT EVIDENCE — NOT A PRODUCTION AUTHORITY — NOT FROZEN**

## Purpose

Uploaded books, guides, coaching material and other user-provided references are a formal external challenge corpus for TRG-001. They are not production authority and do not directly change frequency weights, freeze state, QL count or activation.

Every extracted archetype receives one of these labels:

- `DIRECTLY_COVERED` — current runtime already owns the construction;
- `COVERED_WITH_VARIATION` — mathematics/family is owned, but the exact construction needs runtime sampling;
- `MISSING_CANDIDATE` — target-exam material appears relevant but has no demonstrated runtime home yet;
- `ROUTE_TO_TRG_002` — Heights & Distances / line-of-sight application;
- `OUT_OF_SCOPE` — belongs outside TRG-001 or is unsuitable for the target objective-mock domain.

The machine-readable registry for this audit is `external-material-audit-p2.ts`.

## Source 1 — Disha SSC Mathematics Guide

Uploaded library source: `Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf`.

The audited trigonometry pages contain standard ratios and identities, complementary-angle products, higher-power forms, extrema, degree/radian conversion, SSC-labelled algebraic trigonometry, and Heights & Distances.

## Wave 1 — initial challenge sample

| Source item | External archetype | Audit result | Runtime/package home |
| --- | --- | --- | --- |
| Q39 | long consecutive-angle sine sum | COVERED_WITH_VARIATION | complementary/angle-relation family; explicit long-series proof still needed |
| Q40 | cubic trig sum/difference factorisation | DIRECTLY_COVERED | QL-143 P2 |
| Q41 | ratio reconstruction + complementary sine/sec expression | DIRECTLY_COVERED | reconstruction/cofunction families |
| Q42 | `cosec θ + cot θ` → cosec θ | DIRECTLY_COVERED | conjugate family / QL-112 |
| Q43 | `cos a + sec a` → cubic reciprocal expression | COVERED_WITH_VARIATION | reciprocal + algebra family; exact construction needs proof |
| Q44 | linear sin/cos relation → cot θ | DIRECTLY_COVERED | linear relation family |
| Q45 | changing tower shadow | ROUTE_TO_TRG_002 | Heights & Distances |
| Level-I Q15 | `sec θ + tan θ = x` → sin θ | DIRECTLY_COVERED | conjugate family / QL-112 |
| Level-I Q16 | mixed cot/cosec × tan/sec composite | DIRECTLY_COVERED | reciprocal/conjugate composite family |
| Level-I Q17 | symmetric high even powers | COVERED_WITH_VARIATION | higher-power family; exact symmetric form needs proof |
| Q53 | `tan1° tan2° ... tan89°` | COVERED_WITH_VARIATION | complementary-angle family; long-product proof needed |
| Q54 | weighted `tan²θ + cot²θ` minimum | DIRECTLY_COVERED | CP-006 max/min |
| Q56 | `cosec θ − cot θ` → cosec θ | DIRECTLY_COVERED | conjugate family / QL-112 |
| Q57 | hill / two-angle line-of-sight | ROUTE_TO_TRG_002 | Heights & Distances |
| Q58 | `sec²θ + tan²θ` relation → acute angle | DIRECTLY_COVERED | sec/tan identity + angle solve |

## Wave 2 — broader chapter sweep

The wider sweep confirms many existing families but adds higher-value stress tests.

### Strongly covered

- right-triangle ratio composites;
- sec/tan and cosec/cot identities;
- sum/difference-square relations;
- conjugate forms `sec±tan` and `cosec±cot`;
- linear sin/cos relation solving;
- mixed fundamental-identity simplification;
- higher-power relation of the QL-126 type;
- cubic factorisation of the QL-143 type;
- max/min forms such as weighted `tan²θ + cot²θ`.

### Route to TRG-002

Broken-tree, aircraft, kite, tower, chimney, shadow, two-observation, depression/elevation and observer-distance questions remain TRG-002 evidence, not TRG-001 gaps.

### Out of TRG-001 scope

Pure triangle-geometry questions whose final task is only an angle/radian measure are not grounds to expand the TRG-001 symbolic runtime.

## New challenge frontier

The following forms must be proved by actual runtime output before P2 refreeze:

1. **Triple-angle reduction** — SSC-style `3cosθ − 4cos³θ` construction. This is now a `MISSING_CANDIDATE`, not presumed covered.
2. **Long complementary products** — e.g. `tan1° tan2° ... tan89°` and multi-factor cotangent pairings.
3. **Long complementary sums/series** — consecutive-angle sine/cosine sums using symmetry.
4. **Symmetric high-even-power reductions** — combinations of sixth and fourth powers.
5. **Reciprocal cubic algebra** — `cosθ + secθ = k` leading to `cos³θ + sec³θ`.
6. **Multiple-angle chains** — cofunction conditions involving `2a`, `3a`, `6a` etc.
7. **DMS-to-radian conversion** — degree-minute-second precision rather than integer-degree conversion only.
8. **Inverse derived relation forms** — e.g. a difference of squared trig functions given and a related product requested.

`COVERED_WITH_VARIATION` is deliberately not considered a pass until a generated runtime sample demonstrates comparable mathematical structure.

## Audit-system policy for uploaded books

For each relevant uploaded source:

1. locate the chapter/section;
2. extract distinct question archetypes rather than every numerical duplicate;
3. record source locator and exam tag when available;
4. map each archetype to TRG-001, TRG-002, or another chapter;
5. classify with the audit verdicts above;
6. runtime-sample every `COVERED_WITH_VARIATION` form;
7. search the active runtime before declaring `MISSING_CANDIDATE` as a confirmed gap;
8. remediate only target-exam gaps;
9. keep harder/non-target material explicit rather than expanding scope automatically;
10. never use book frequency as production frequency authority.

## Freeze implication

TRG-001 P2 is **not ready to refreeze yet** solely on structural/PYQ evidence.

Before freeze:

- resolve the triple-angle `MISSING_CANDIDATE`;
- runtime-prove or downgrade the variation frontier;
- continue the audit across other uploaded SSC-relevant books/material where text can be recovered reliably;
- keep CAT/management-level material as secondary breadth evidence, not SSC difficulty authority;
- execute the targeted regression/TypeScript checks;
- then make the human freeze decision.
