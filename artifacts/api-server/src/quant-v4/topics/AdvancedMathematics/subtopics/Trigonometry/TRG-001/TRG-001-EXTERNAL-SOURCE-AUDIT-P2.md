# TRG-001 External Source Audit P2

Status: **AUDIT EVIDENCE — NOT A PRODUCTION AUTHORITY — NOT FROZEN**

## Purpose

Uploaded books, guides, coaching material and other user-provided references are now treated as a formal external challenge corpus for TRG-001 rather than informal reading material.

Every extracted archetype must receive one of these labels:

- `DIRECTLY_COVERED` — current runtime already owns the construction;
- `COVERED_WITH_VARIATION` — underlying mathematics/family is owned, but the exact construction still deserves runtime sampling;
- `MISSING` — material recurring/relevant to target exams with no demonstrated runtime home;
- `ROUTE_TO_TRG_002` — Heights & Distances / line-of-sight application, not a TRG-001 gap;
- `OUT_OF_SCOPE` — unsuitable for the target exam domain or objective-mock product.

This evidence must not silently change production frequencies, QL counts, freeze state, or activation status.

## Source 1 — Disha SSC Mathematics Guide

Uploaded library source: `Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf`.

The trigonometry chapter contains standard ratios/identities as well as SSC question material spanning reciprocal/conjugate identities, complementary-angle constructions, power identities, extrema and Heights & Distances.

### First evidence wave

| Source item | External archetype | Audit result | Runtime/package home |
| --- | --- | --- | --- |
| Q39 | long consecutive-angle sine sum | COVERED_WITH_VARIATION | TRG-001 complementary/angle-relation family; needs explicit long-series sampling |
| Q40 | cubic trig sum/difference factorisation | DIRECTLY_COVERED | QL-143 P2 |
| Q41 | ratio reconstruction + complementary sine/sec expression | DIRECTLY_COVERED | existing reconstruction/cofunction families |
| Q42 | `cosec θ + cot θ` → cosec θ | DIRECTLY_COVERED | conjugate family / QL-112 |
| Q43 | `cos a + sec a` → cubic reciprocal expression | COVERED_WITH_VARIATION | reciprocal + algebra machinery exists; exact construction needs challenge sampling |
| Q44 | linear sin/cos relation → cot θ | DIRECTLY_COVERED | linear relation family |
| Q45 | changing tower shadow at 60°/45° | ROUTE_TO_TRG_002 | Heights & Distances |
| Level-I Q15 | `sec θ + tan θ = x` → sin θ | DIRECTLY_COVERED | conjugate family / QL-112 |
| Level-I Q16 | mixed cot/cosec × tan/sec composite | DIRECTLY_COVERED | reciprocal/conjugate composite family |
| Level-I Q17 | symmetric high even powers | COVERED_WITH_VARIATION | QL-126 higher-power family; exact symmetric construction to challenge-test |
| Q53 | `tan1° tan2° ... tan89°` complementary pairing | COVERED_WITH_VARIATION | complementary-angle family; long-product form needs explicit sampling |
| Q54 | minimum of weighted `tan²θ + cot²θ` | DIRECTLY_COVERED | CP-006 max/min / QL-142 |
| Q56 | `cosec θ − cot θ` → cosec θ | DIRECTLY_COVERED | conjugate family / QL-112 |
| Q57 | hill / two-angle line-of-sight | ROUTE_TO_TRG_002 | Heights & Distances |
| Q58 | `sec²θ + tan²θ` relation → acute standard angle | DIRECTLY_COVERED | sec/tan identity + acute-angle solve |

Initial wave totals:

- `DIRECTLY_COVERED`: 9
- `COVERED_WITH_VARIATION`: 4
- `MISSING`: 0
- `ROUTE_TO_TRG_002`: 2
- `OUT_OF_SCOPE`: 0

This first wave is **not** sufficient to claim complete book coverage. It demonstrates that the audit mechanism works and that the sampled Disha SSC families do not currently expose a confirmed TRG-001 structural hole.

## Important findings

### 1. Uploaded books are useful for a different purpose than whole-paper frequency evidence

Whole SSC sections estimate what appears frequently. Books/guides are better for **breadth challenge testing** because they deliberately collect more varieties than any one paper.

Therefore book evidence should influence:

- missing-archetype discovery;
- stem/construction diversity audits;
- edge-family sampling;
- explanation/distractor realism review.

It should **not** directly set production frequency weights.

### 2. `COVERED_WITH_VARIATION` is not the same as a pass

Before refreeze, the important variation cases should be generated from runtime and checked concretely. For this wave the highest-value challenges are:

1. long complementary-angle sum/product constructions;
2. reciprocal cubic form from `x + 1/x` style relation;
3. symmetric high-even-power reduction.

If current runtime cannot actually emit a comparable question, the status must be downgraded to `MISSING` and remediated.

### 3. TRG-001/TRG-002 boundary remains mandatory

Tower, hill, aircraft, tree, observer-height, angle-of-elevation/depression and changing-shadow problems are application geometry and belong to `TRG-002` even when the book places them in the same Trigonometry chapter.

Do not inflate TRG-001 coverage requirements with these forms.

## Reusable audit policy for future uploaded material

For each relevant uploaded source:

1. locate the chapter/section;
2. extract distinct **question archetypes**, not every numerical duplicate;
3. record source locator and exam tag when available;
4. map each archetype to package/QL/runtime evidence;
5. classify with the five statuses above;
6. runtime-sample every `COVERED_WITH_VARIATION` item;
7. remediate target-exam `MISSING` forms;
8. keep `OUT_OF_SCOPE` explicit so harder/non-target book material does not distort Examtree;
9. keep source evidence audit-only until human approval.

## Freeze implication

TRG-001 should not be refrozen merely because the initial Disha sample has zero confirmed missing forms.

Before freeze:

- expand this audit across the rest of the relevant uploaded SSC trigonometry material;
- challenge-test the `COVERED_WITH_VARIATION` families against actual runtime output;
- review the P2 multilingual samples;
- execute regression/TypeScript checks;
- then make the human freeze decision.
