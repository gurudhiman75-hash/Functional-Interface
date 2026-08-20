# ExamTree Quant V4 — Geometry
## Revision 3 Solution-Diagram Dimension Policy Addendum

**Status:** `AUTHORITY_ADDENDUM_ACTIVE`  
**Effective date:** 20 August 2026  
**Parent authority:** Geometry Revision 3 Diagram Policy Amendment  
**Scope:** learner-facing solution diagrams, solve-relevant dimensions, derived annotations, staged disclosure, clarity and QA  
**Precedence:** this addendum supplements Revision 3 Section D/G/H for solution diagrams only. It does not weaken stem anti-leak rules.

---

# A. Core distinction

Geometry uses two intentionally different learner projections:

```text
STEM DIAGRAM = minimal semantic evidence required to solve
SOLUTION DIAGRAM = teaching projection required to understand the solve
```

A fact hidden from the stem for anti-leak reasons may appear in the solution diagram **after** it has been established by the written/theorem solution.

A solution diagram must never be treated as if all of its annotations were original givens.

---

# B. Default dimension rule

If a Geometry item has `REQUIRED_SOLUTION_DIAGRAM` or `REQUIRED_BOTH`, the solution diagram should normally display:

1. every **solve-relevant given length or angle** used by the explanation;
2. every **key derived length or angle** that is needed for a later step;
3. the **target quantity/value** once it has been solved;
4. theorem-derived equality, midpoint, parallel, perpendicular or congruence evidence when that visual relation materially improves comprehension.

Dimensions that are irrelevant to the actual solve should remain omitted.

A solution diagram with no dimensions is acceptable only when the problem is genuinely non-metric (for example pure identification/classification) or when numeric annotation would add no instructional value.

---

# C. Staged disclosure

Solution annotations must respect proof order.

```text
given dimension
→ theorem-derived relation
→ derived intermediate value
→ solved target value
```

The runtime may render one final consolidated solution figure, but every derived annotation on that figure must be supported by an earlier or accompanying explanation step.

If stepwise solution figures are used, a later step may add annotations but must not retroactively present a derived value as an original given.

---

# D. Given-versus-derived clarity

The learner must be able to distinguish original evidence from solution consequences through at least one governed mechanism:

- explanation order immediately surrounding the figure;
- explicit text such as `Given:`, `Therefore`, `Hence`, `By CPCT`, `Midpoint`, etc.;
- approved visual treatment for derived annotations when the renderer supports it;
- stepwise solution figures.

Do not rely on colour alone to distinguish given and derived information.

---

# E. What to show

Prefer annotations with high teaching value:

```text
given side/angle used in the first computation
derived equal segments used in the next computation
midpoint halves after midpoint is proved
corresponding sides after congruence/similarity is proved
radius/chord/tangent dimensions used in a length relation
derived angle values reused later in an angle chase
the final target value
```

For a derived equality with numeric consequence, prefer an instructional form such as:

```text
OR = RN
ON = 12 cm
OR = RN = 6 cm
```

over showing only the final answer without the relation that produced it.

---

# F. What not to show

A solution diagram must not become a solver dump.

Do not add:

- every true dimension in the canonical state;
- unused intermediate values;
- duplicate numeric labels that do not improve understanding;
- internal theorem IDs, verifier coordinates or debug data;
- overlapping semantic marks;
- labels whose association with a segment/angle is ambiguous;
- answer values before the solution has established them.

If two relation marks would occupy the same visual location, keep the higher-value mark in the figure and carry the other fact in nearby governed solution text/annotation.

---

# G. Stem/solution parity

`REQUIRED_BOTH` means the stem and solution share the same intended topology but **not necessarily the same disclosure set**.

Required invariants:

- point identities are preserved unless the solution intentionally isolates a subfigure;
- no contradiction between stem and solution;
- every stem-visible given remains true in the solution;
- solution-only derived evidence uses `disclosure = SOLUTION`;
- solution annotations may be richer than stem annotations;
- solution dimensions do not retroactively alter the stem evidence contract.

A solution diagram may simplify the visible construction when that improves teaching, provided the topology needed for the explanation remains faithful.

---

# H. Dimension placement and readability

Numeric/symbolic dimensions are mathematical labels and must satisfy the same visual QA as point and angle labels.

Reject a solution diagram when:

- a dimension touches/crosses a segment so closely that association is unclear;
- a dimension collides with a point label, angle arc, relation mark or another dimension;
- a full-side value is visually confused with a subsegment value;
- equal-length and parallel marks visually merge;
- the final target value cannot be associated confidently with the target object;
- mobile rendering makes dimensions unreadable.

Prefer concise units (`12 cm`, `60°`) and avoid repeating units multiple times inside one compound annotation when doing so creates clutter.

---

# I. Accessibility and localisation

Accessible solution descriptions must include the same solve-relevant dimensions and derived relations communicated visually.

They must also preserve proof status, for example:

```text
Given ON = 12 cm.
After congruence, OR = RN.
Therefore OR = RN = 6 cm.
```

Across `en-IN`, `hi-IN` and `pa-IN`:

- numeric values and mathematical symbols remain invariant;
- point identities remain invariant;
- prose annotations may be localized;
- localised text expansion must not create collisions or clipping.

---

# J. Fingerprints and QA gates

For any retained `REQUIRED_SOLUTION_DIAGRAM` or `REQUIRED_BOTH` representation:

- stem and solution semantic fingerprints must be recorded separately;
- deterministic fingerprints must change when the solution disclosure set changes materially;
- Renderer V2 collision scores must be zero for both figures;
- representative/worst-case seed visual review must cover both figures;
- regression tests should assert required given dimensions and key derived dimensions are present;
- regression tests should assert forbidden stem leaks remain absent.

Before permanent QL freeze, solution-diagram dimension coverage is part of diagram readiness evidence.

---

# K. Geometry V1 default

For metric Geometry questions with a retained solution figure:

```text
show solve-relevant dimensions by default
hide irrelevant dimensions by default
show derived dimensions only after derivation
prioritise comprehension over decorative completeness
```

This policy does not require a solution diagram for every Geometry question. It governs the content of a solution diagram when the representation contract requires one.
