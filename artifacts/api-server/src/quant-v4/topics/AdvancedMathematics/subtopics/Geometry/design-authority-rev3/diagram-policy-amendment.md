# ExamTree Quant V4 — Geometry
## Revision 3 Diagram Policy Amendment

**Status:** `AUTHORITY_AMENDMENT_ACTIVE`  
**Amends:** Geometry End-to-End Design Authority Revision 2  
**Effective date:** 18 August 2026  
**Scope:** Diagram selection, learner-visible geometry, accessibility, layout, localisation and diagram freeze gates  
**Precedence:** This amendment supersedes Revision-2 Section 20 where the two differ. All other Revision-2 sections remain authoritative.

---

# A. Executive diagram policy

Geometry diagrams are **selective semantic evidence**, not decoration and not a default requirement for every Geometry question.

The generator must decide diagram use from the approved QL/representation contract before seed-specific layout is produced.

```text
canonical state
→ QL / representation contract
→ diagram disposition
→ semantic diagram projection
→ non-authoritative layout
→ SVG / accessibility projection
```

A production QL must declare one stable diagram disposition:

```text
NO_DIAGRAM
OPTIONAL_STEM_DIAGRAM
REQUIRED_STEM_DIAGRAM
REQUIRED_SOLUTION_DIAGRAM
REQUIRED_BOTH
```

`OPTIONAL_STEM_DIAGRAM` means the QL has an explicitly approved diagrammed representation variant. It does **not** authorize random diagram presence/absence by seed.

Diagram presence alone does not create a new QL unless it materially changes the learner inference, evidence topology or answer contract.

---

# B. When a stem diagram is required

Use `REQUIRED_STEM_DIAGRAM` or `REQUIRED_BOTH` when at least one of the following is true:

- the learner cannot unambiguously identify the intended configuration from natural prose alone;
- point order, ray direction, chord/secant ordering, intersection topology or which named angle/segment is intended is part of the evidence burden;
- multiple overlapping/nested geometric objects would make prose materially harder than the authentic exam representation;
- the source family is genuinely diagram-led and removing the diagram would change the representation contract;
- a relation is intentionally communicated by a governed diagram mark rather than repeated in prose;
- the question tests diagram interpretation itself;
- a mixed configuration in `GEO-CP-014` would otherwise require bloated or ambiguous wording.

Typical diagram-led candidates include:

```text
parallel/transversal configurations
overlapping or nested triangles
congruence/similarity correspondence when topology matters
triangle-centre constructions
special quadrilateral diagonal configurations
circle/chord/arc configurations
cyclic quadrilaterals
tangent and secant topologies
power-of-a-point segment ordering
mixed Euclidean synthesis
```

This is a selection rule, not a promise that every QL in those checkpoints requires a diagram.

---

# C. When a stem diagram should be omitted

Use `NO_DIAGRAM` when the question is complete, natural and exam-authentic without a figure and a diagram would add no material inference.

Typical examples include:

```text
triangle third-angle arithmetic stated unambiguously
triangle-inequality range/count questions
regular-polygon angle/side-count inversion
polygon diagonal count
pure theorem/criterion selection where correspondence is fully stated
simple classification questions whose required evidence is completely textual
```

A diagram must also be omitted or redesigned when:

- its only purpose is visual polish;
- it repeats every clue without reducing ambiguity or improving authentic representation;
- it creates an unintended shortcut;
- it visually reveals the answer or a hidden intermediate relation;
- a stable uncluttered mobile rendering cannot be produced;
- the configuration would be misleading even with a `not to scale` warning.

Hard questions must never be made harder by cramped or intentionally confusing diagrams.

---

# D. Solution-only diagram policy

Use `REQUIRED_SOLUTION_DIAGRAM` when the stem is unambiguous without a figure but a diagram materially improves the explanation of a derived relation.

A solution diagram may:

- add theorem-derived equalities, parallel/perpendicular marks or auxiliary segments;
- highlight the particular triangle/cyclic relation used in the proof;
- isolate a dense configuration into a clearer teaching view.

A solution diagram must not become a solver dump. Show only teaching-relevant derived evidence.

Do not add a solution diagram merely because a renderer exists.

---

# E. Semantic givens and evidence parity

A learner-visible diagram is a projection of the canonical geometry state. Visual appearance is never an unstated theorem premise.

Only governed semantic evidence may count as a diagram given, including:

```text
point / line / ray / segment identity
explicit point order or intersection
parallel mark
perpendicular / right-angle mark
equal-length mark
equal-angle mark
midpoint mark
angle-bisector mark
circle / centre / radius / diameter
chord / arc
tangent / point of contact
secant ordering
polygon boundary
numeric or symbolic label
```

Rules:

1. Every visible relation mark must correspond to a canonical displayed given or an allowed structural definition.
2. Every canonical diagram-only given must be present in the semantic diagram model and in the accessible description.
3. A relation may not be inferred by the learner merely because two lines look parallel, an angle looks like 90°, two sides look equal, or a point looks like a midpoint.
4. If prose and diagram disagree, the question is invalid; neither channel silently overrides the other.
5. The same evidence set must be available to visual and non-visual learners. Accessibility text may describe diagram givens but must not reveal hidden/derived facts.

---

# F. Not-to-scale and visual anti-leak policy

For Geometry V1, learner diagrams are non-authoritative for metric scale.

```text
notToScale = true
```

is the default and expected production state. No V1 QL may require the learner to measure a rendered angle or segment.

The layout engine may intentionally perturb non-semantic coordinates to prevent visual answer leakage while preserving:

- incidence/topology;
- point ordering required by the stem;
- circle membership where visually necessary;
- explicitly displayed relation marks;
- label association.

The learner layout and the independent coordinate oracle are separate authorities:

```text
synthetic/theorem state = mathematical authority
hidden exact/high-precision coordinates = verifier evidence
semantic diagram model = learner evidence authority
layout coordinates = non-authoritative presentation
```

Do not directly project verifier coordinates into the learner diagram when doing so visually exposes a derived answer.

High-risk anti-leak cases include:

- converse right-angle classification;
- derived perpendicular diagonals;
- derived parallelism;
- derived equal sides/segments;
- derived midpoint;
- derived tangent/perpendicular relation;
- answer-bearing angle magnitude;
- answer-bearing segment ratio.

For high-risk strategies, automated regression should test the specific visual leak whenever practical.

---

# G. Diagram mark policy

Marks are mathematical language and must be governed.

- Parallel pairs must use distinguishable parallel marks.
- Equal-length groups must not accidentally merge separate equality classes.
- Right-angle marks are shown only when the right angle is a displayed given/definition in the stem diagram.
- A tangent symbol/right-angle marker is not shown when tangency/perpendicularity is the conclusion being tested.
- Midpoint/equal-half marks are not shown when midpoint is the conclusion.
- Numeric target values are never placed on the target before solving.
- Internal theorem IDs, debug IDs and verifier coordinates never appear learner-facing.

If a derived relation is added in the solution diagram, its disclosure must be `SOLUTION`, not `STEM`.

---

# H. Diagram density and clarity

Prefer the minimum diagram that uniquely communicates the required topology.

Do not render every canonical object or every true relation. Omit non-teaching objects that create clutter and are unnecessary for learner interpretation.

A diagram is rejected if:

- point labels overlap;
- angle labels collide with arcs or lines;
- multiple marks are visually indistinguishable;
- segment labels cannot be associated confidently;
- line crossings look like intersections when they are not;
- a tangent point appears off the circle;
- centre and intersection labels collide;
- the figure requires horizontal scrolling;
- the target object is visually ambiguous.

For dense mixed questions, it is better to simplify the visible projection than to expose the complete hidden construction.

---

# I. Responsive and accessibility policy

Every retained diagram strategy must be reviewed at representative widths, including approximately:

```text
360 px
390–412 px
768 px
desktop
```

Required checks:

- no clipping or horizontal overflow;
- readable point/segment/angle labels;
- relation marks remain distinguishable;
- touch/mobile scale does not make the diagram unusably small;
- SVG has an accessible name/description;
- accessible description expresses the same displayed givens as the diagram;
- accessible description does not reveal the answer or any hidden theorem consequence.

If a diagram cannot satisfy both visual and accessible evidence parity, the question is not production-ready.

---

# J. Localisation policy

The canonical diagram topology and mathematical symbols remain shared across `en-IN`, `hi-IN` and `pa-IN`.

Preserve across languages:

- point identities and Latin point labels;
- numeric values;
- option semantics;
- relation marks;
- diagram disposition;
- diagram topology;
- target identity;
- semantic diagram fingerprint.

Localise only governed textual material such as:

- captions;
- prose labels when unavoidable;
- accessibility descriptions;
- explanatory annotations in solution diagrams.

Localized text expansion must not create clipping or change mathematical evidence.

A language variant may not add/remove a stem diagram independently unless the representation itself has been separately approved as a distinct language-specific exam contract; Geometry V1 assumes no such exception.

---

# K. QL discovery and freeze requirements

During source saturation and merge/split analysis, every candidate family must receive a diagram disposition and rationale.

The diagram audit must answer:

```text
Is the source family normally text-led or diagram-led?
Does removing the diagram change the learner inference?
Does the diagram communicate any essential clue?
Can the same clue be represented naturally in prose?
Does the diagram introduce a shortcut or answer leak?
Is the topology stable under seed/layout changes?
Is the accessible description evidence-equivalent?
Does diagram presence materially justify a representation split?
```

Before permanent QL freeze, each retained QL must have:

- declared diagram class;
- approved semantic diagram strategy if any;
- semantic parity proof;
- anti-leak proof;
- responsive visual review evidence;
- accessibility evidence;
- localisation fit evidence before multilingual freeze;
- representative/worst-case seed review;
- diagram version included in deterministic fingerprints/package metadata.

Do not claim a diagram strategy reviewed merely because an SVG was generated.

---

# L. Migration rule for current executable discovery

Existing temporary Geometry prototypes remain valid discovery evidence, but they are not grandfathered into production.

Before permanent QL allocation:

1. assign each surviving prototype/family a diagram disposition;
2. remove decorative diagrams;
3. add required diagrams where topology is otherwise ambiguous;
4. convert any accidental visual premise into an explicit semantic mark or prose given;
5. rerun answer-leak, semantic-parity, mobile and accessibility audits;
6. only then use the family in merge/split and permanent QL decisions.

This amendment changes diagram governance, not checkpoint ownership or current temporary prototype identity.
