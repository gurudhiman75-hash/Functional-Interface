# TRG-001 / TRG-002 Uploaded-Book Challenge Audit P2

Status: **ACTIVE EXTERNAL-EVIDENCE AUDIT — NOT A FREEZE OR ACTIVATION AUTHORITY**

## Purpose

Use uploaded books, coaching PDFs and PYQ compilations as a repeatable external challenge corpus for Quant V4.

These sources are evidence for:

- missing exam archetypes;
- overly narrow runtime construction;
- taxonomy/ownership mistakes;
- difficulty and explanation realism;
- distractor realism.

They are **not** allowed to directly authorize production activation, change section-frequency weights, or override package authority.

## Registered uploaded sources

1. `BOOK-DISHA-SSC-MATHEMATICS-GUIDE` — Disha SSC Mathematics Guide in English.
2. `BOOK-RAKESH-YADAV-MATHS-7300` — Rakesh Yadav Maths 7300.

The Disha source is currently machine-readable enough for immediate question-level auditing. The Rakesh source is registered but its trigonometry section still requires a reliable extraction route before question-level observations are admitted.

## Taxonomy rule

A book chapter named “Trigonometry” may mix multiple Examtree packages.

- Core ratios, identities, exact values, angle relations and algebraic trig expressions -> `TRG-001`.
- Towers, poles, shadows, kite/string, line of sight, angle of elevation/depression and multi-observer physical applications -> `TRG-002`.
- Pure Pythagoras/ladder displacement without a decisive trig relation may belong to Geometry rather than TRG.

Therefore external-book coverage is scored **after package ownership is assigned**, never from the book chapter title alone.

---

# Disha challenge corpus — first pass

Source section: **Trigonometry and Its Applications**, book pages around 405–412 (PDF pages 409–416).

The following matrix is intentionally conservative. `NEEDS_MANUAL_REVIEW` means the book has exposed a construction that must be checked against a concrete Examtree runtime/QL before it can be called covered.

| Book item | Archetype | Examtree owner | First-pass disposition | Audit note |
|---|---|---|---|---|
| Ex. 6 | given sin -> find cos | TRG-001 | DIRECTLY_COVERED | Basic Pythagorean ratio recovery. |
| Ex. 7 | given tan -> find sec | TRG-001 | DIRECTLY_COVERED | Standard sec-tan identity family. |
| Ex. 10 | tan double-angle standard value | TRG-001 | COVERED_WITH_VARIATION | Exact standard-angle/double-angle evaluation. |
| Ex. 12 | equation `sin 2A = 2 sin A` | TRG-001 | NEEDS_MANUAL_REVIEW | Must verify equation-solving construction, not just double-angle evaluation. |
| Ex. 15 | `cos 9a = sin a` -> angle relation | TRG-001 | COVERED_WITH_VARIATION | Cofunction/complementary-angle equation family. |
| Ex. 16 | `9sec²A - 9tan²A` | TRG-001 | DIRECTLY_COVERED | Fundamental sec-tan identity. |
| Ex. 17 | `(sec A + tan A)(1-sin A)` | TRG-001 | COVERED_WITH_VARIATION | Composite identity/conjugate manipulation. |
| Ex. 19 | choose true trig relation | TRG-001 | DIRECTLY_COVERED | Basic ratio/identity recognition. |
| Ex. 20 | `sin A/tan A + cos A` | TRG-001 | COVERED_WITH_VARIATION | Convert tan to sin/cos and simplify. |
| Ex. 21 | `cos(40+x)=sin30` | TRG-001 | DIRECTLY_COVERED | Complementary/standard-angle equation. |
| Ex. 23 | `tan1 tan2 ... tan89` | TRG-001 | NEEDS_MANUAL_REVIEW | Long complementary product; verify explicit construction depth. |
| Ex. 29 | `sinθ=1/2`, evaluate cubic cosine expression | TRG-001 | NEEDS_MANUAL_REVIEW | Triple-angle/polynomial style construction may exceed current SSC core surface. |
| Ex. 30 | `tanθ+cotθ=2` -> squares | TRG-001 | COVERED_WITH_VARIATION | Algebraic relation using tan/cot. |
| Ex. 33 | sum of `cos²` over many standard/complementary angles | TRG-001 | NEEDS_MANUAL_REVIEW | Series/pairing construction needs explicit runtime check. |
| Ex. 34 | complementary-angle mixed simplification | TRG-001 | COVERED_WITH_VARIATION | Cofunction + simplification. |
| Ex. 35 | right-triangle diagram side recovery | TRG-001 / Geometry boundary | NEEDS_MANUAL_REVIEW | Ownership depends on whether decisive step is trig ratio or pure 30-60-90 geometry. |
| Ex. 36 | 75 m tower, angle of depression 30° | TRG-002 | DIRECTLY_COVERED_OWNERSHIP | Heights & Distances, not TRG-001. Runtime mapping to be checked under TRG-002 audit. |
| Ex. 37 | tower observed from two positions, 30°/60° | TRG-002 | DIRECTLY_COVERED_OWNERSHIP | Two-observation Heights & Distances family. |
| Ex. 38 | moving aeroplane, changing elevation angles | TRG-002 | NEEDS_MANUAL_REVIEW | Combines motion/time with two-observation sight-line geometry. |
| Ex. 40 | tower shadow ratio -> sun elevation | TRG-002 | DIRECTLY_COVERED_OWNERSHIP | Single-observation shadow/elevation form. |
| Ex. 41 | complementary elevations from two distances | TRG-002 | NEEDS_MANUAL_REVIEW | Two-observer symbolic-distance form. |
| Ex. 43 | pole + shadow -> elevation | TRG-002 | DIRECTLY_COVERED_OWNERSHIP | Standard shadow problem. |
| Ex. 44 | kite string + tan relation -> height | TRG-002 | COVERED_WITH_VARIATION | Physical line-of-sight/right-triangle application. |
| Ex. 45 | walking toward chimney, 30° -> 45° | TRG-002 | DIRECTLY_COVERED_OWNERSHIP | Two-position observer family. |
| Ex. 47 | opposite sides of flagstaff, 30°/60° | TRG-002 | DIRECTLY_COVERED_OWNERSHIP | Two-observer opposite-side family. |
| Ex. 50 | product of complementary tangent pairs | TRG-001 | NEEDS_MANUAL_REVIEW | Product-pairing construction should be checked explicitly. |
| Ex. 51 | `(sec-cos)(cosec-sin)(tan+cot)` | TRG-001 | NEEDS_MANUAL_REVIEW | Dense composite identity; verify explicit runtime home. |
| Ex. 54 | minimum of `4tan²θ + 9cot²θ` | TRG-001 | NEEDS_MANUAL_REVIEW | Min/max trig inequality family must be checked against CP-006 runtime. |
| Ex. 55 | given `sin-cos`, find `sin+cos` | TRG-001 | DIRECTLY_COVERED | Sum/difference-square identity family. |
| Ex. 56 | given `cosec-cot`, find cosec | TRG-001 | COVERED_WITH_VARIATION | Conjugate reciprocal relation. |
| Ex. 58 | `sec²θ + tan²θ = 7`, solve angle | TRG-001 | NEEDS_MANUAL_REVIEW | Identity + acute-angle reconstruction/equation form. |
| Ex. 59 | simplify mixed `sin²`, `tan²`, `sec²`, `cos²` | TRG-001 | DIRECTLY_COVERED | Fundamental identities/composite simplification. |
| Ex. 63 | rational expression in sin/cos -> cot | TRG-001 | COVERED_WITH_VARIATION | Linear/rational sin-cos relation family. |
| Ex. 66 | given `5tanθ=4`, evaluate linear sin/cos ratio | TRG-001 | DIRECTLY_COVERED | Reconstruct ratio / linear sin-cos expression. |
| Ex. 68 | `2(cos²-sin²)=1`, find cot | TRG-001 | COVERED_WITH_VARIATION | Double-angle/acute reconstruction. |
| Ex. 70 | relation between `tan²-sin²` and product | TRG-001 | NEEDS_MANUAL_REVIEW | Algebraic identity transformation needs explicit runtime mapping. |
| Ex. 72 | quadratic in cos -> `tan(θ-15°)` | TRG-001 | NEEDS_MANUAL_REVIEW | Equation solve followed by angle-difference evaluation. |
| Ex. 74 | pole/tower with elevation and depression | TRG-002 | DIRECTLY_COVERED_OWNERSHIP | Two-level sight-line Heights & Distances. |
| Ex. 75 | shadow increases as sun changes 45° -> 30° | TRG-002 | DIRECTLY_COVERED_OWNERSHIP | Changing-angle shadow family. |

`DIRECTLY_COVERED_OWNERSHIP` means the taxonomy is certain, but package-runtime coverage must be scored under the owning package audit rather than credited to TRG-001.

---

# Immediate findings

## 1. The book validates the TRG-001/TRG-002 split

The uploaded source itself interleaves pure identity questions and physical elevation/depression applications. Examtree should not reproduce that book-level chapter boundary internally. Keeping TRG-001 and TRG-002 separate is the cleaner runtime design.

## 2. Basic SSC trigonometry is well represented in TRG-001

The book contains many forms already aligned with implemented TRG-001 families:

- sin -> cos and tan -> sec recovery;
- reciprocal/function equivalence;
- sec²-tan² identities;
- complementary-angle equations;
- sum/difference-square relations;
- linear sin/cos expressions;
- standard-angle and mixed identity simplification.

These do not justify new QLs merely because the wording differs.

## 3. The external source exposes a useful “rare construction” queue

The strongest candidates for explicit runtime verification are:

- long complementary tangent products;
- long paired `cos²` series;
- triple-angle/polynomial-style expressions;
- dense composite reciprocal identities;
- trig min/max forms;
- identity + equation + angle-difference chains;
- symbolic two-observer Heights & Distances.

These must be checked before claiming book-level exhaustiveness.

## 4. No book question should be copied into production

The audit stores only archetype/evidence descriptions and source coordinates. Production questions must be generated from Examtree-owned stems, variables, explanations and distractor logic.

---

# Coverage scoring protocol

For each source question/archetype:

1. assign Examtree package ownership;
2. locate a concrete permanent QL/runtime construction;
3. classify as:
   - `DIRECTLY_COVERED`;
   - `COVERED_WITH_VARIATION`;
   - `MISSING_ARCHETYPE`;
   - `OUT_OF_SCOPE`;
   - `NEEDS_MANUAL_REVIEW`;
4. only confirmed `MISSING_ARCHETYPE` items enter remediation;
5. after remediation, generate fresh Examtree questions and compare reasoning structure—not copied wording;
6. books remain evidence only and cannot authorize freeze/activation by themselves.

# Next pass

Resolve every `NEEDS_MANUAL_REVIEW` TRG-001 item against the current 144-QL runtime, then compute:

- TRG-001 direct coverage rate;
- TRG-001 variation coverage rate;
- true missing-archetype count;
- out-of-scope count;
- TRG-002 handoff count.

Only after this external challenge pass should TRG-001 P2 be considered for final refreeze.
