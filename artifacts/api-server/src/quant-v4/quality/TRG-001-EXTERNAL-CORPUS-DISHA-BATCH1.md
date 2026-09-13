# TRG-001 External Corpus Audit — Disha SSC Mathematics — Batch 1

Status: **AUDIT EVIDENCE — NOT PRODUCTION CONTENT — NOT A FREEZE AUTHORITY**

Source: `Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf`
Chapter: **Trigonometry and Its Applications**
Book chapter range: approximately book pages 399–424 (PDF pages ~403 onward).
Batch inspected here: PDF pages 409–413.

## Audit rule

A mathematical family being present in TRG authority is not enough to call a book question covered.

- `DIRECT_RUNTIME_MATCH` = current runtime has a demonstrated equivalent construction.
- `FAMILY_MATCH_RUNTIME_DEMO_NEEDED` = TRG owns the concept, but exact construction still needs generated runtime evidence.
- `MISSING_CONSTRUCTION_CANDIDATE` = useful in-scope construction not yet demonstrated by current runtime; requires human decision before implementation.
- `OWNED_BY_OTHER_PACKAGE` = valid Quant question, but not TRG-001 ownership.
- `SOURCE_PARSE_UNCERTAIN` = PDF extraction is too damaged to classify safely.

Book wording must never be copied into production. Only the abstract archetype may influence authority design.

## Batch 1 observations

| Source | Archetype | Package | Status | Audit note |
|---|---|---|---|---|
| p409 Q5 `tan9° tan27° tan63° tan81°` | Complementary-angle tangent product cancellation | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Cofunction/reciprocal families exist; exact multi-factor construction still needs generated proof. |
| p409 Q7 `tanθ=√3 -> secθ` | tan-to-sec Pythagorean recovery | TRG-001 | DIRECT_RUNTIME_MATCH | Already represented in TRG real-exam evidence/runtime family. |
| p409 Q10 `2tan30°/(1+tan²30°)` | Double-angle tangent rational identity | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Double-angle family exists; require this exact rational form or equivalent sibling evidence. |
| p409 Q16 `9sec²A-9tan²A` | Scaled sec²−tan² identity | TRG-001 | DIRECT_RUNTIME_MATCH | Fundamental sec/tan identity family is established. |
| p410 Q17 `(secA+tanA)(1−sinA)` | Composite reciprocal/identity simplification | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | In-scope composite identity; exact construction needs runtime demonstration. |
| p410 Q19 ratio-equivalence selection | Basic function-definition equivalence | TRG-001 | DIRECT_RUNTIME_MATCH | Core ratio/reciprocal definition coverage. |
| p410 Q21 `cos(40°+x)=sin30°` | Cofunction equation to solve angle | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Cofunction and angle-solve families exist; exact shifted-angle equation needs proof. |
| p410 Q23 `tan1° tan2° ... tan89°` | Long complementary product pairing | TRG-001 | MISSING_CONSTRUCTION_CANDIDATE | Distinct sequence/product archetype; do not assume coverage from simple cofunction identities. |
| p410 Q29 `sinθ=1/2`, evaluate `3cosθ−4cos³θ` | Triple-angle-equivalent polynomial evaluation | TRG-001 | MISSING_CONSTRUCTION_CANDIDATE | Current audited authority explicitly contains double-angle work; triple-angle polynomial construction requires separate decision. |
| p410 Q30 `tanθ+cotθ=2 -> tan²θ+cot²θ` | Square relation from tan/cot sum | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Derived-ratio algebra family is relevant; exact relation needs generated evidence. |
| p410 Q33 `cos²5°+...+cos²90°` | Symmetric angle-series sum | TRG-001 | MISSING_CONSTRUCTION_CANDIDATE | Sequence symmetry is materially different from single-expression evaluation. |
| p410 Q35 right-triangle figure, recover side | Diagram-based standard-angle side recovery | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | TRG owns angle-based side recovery; visual/diagram construction must be separately demonstrated. |
| p410 Q36 tower + angle of depression | Basic Heights & Distances | TRG-002 | OWNED_BY_OTHER_PACKAGE | Decisive relation is vertical height / horizontal distance. |
| p411 Q37 tower observed at 30°, walk 20 m, then 60° | Two-position Heights & Distances | TRG-002 | OWNED_BY_OTHER_PACKAGE | TRG-002, not a TRG-001 gap. |
| p411 Q39 ladder slips down wall | Pure Pythagorean geometry change | GEO / geometry authority | OWNED_BY_OTHER_PACKAGE | No trigonometric ratio is required. |
| p411 Q41 complementary elevation angles from distances m,n | Two-point complementary Heights & Distances | TRG-002 | OWNED_BY_OTHER_PACKAGE | Application belongs to TRG-002. |
| p411 Q48 right triangle, evaluate `tanB+tanC` from sides | Triangle ratio composite | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Ratio authority exists; exact two-angle expression needs proof. |
| p411 Q50 `tan7° tan23° tan60° tan67° tan83°` | Cofunction-paired tangent product | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Same broader product-pair family as Q5; useful recurring material archetype. |
| p411 Q51 `(sec−cos)(cosec−sin)(tan+cot)` | Multi-function composite identity | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Strong SSC-style composite; exact construction should be generated before claiming coverage. |
| p412 Q54 minimum `4tan²θ+9cot²θ` | Trig minimum via reciprocal product/AM-GM | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | CP006 max/min authority exists; this coefficient-weighted form needs runtime proof. |
| p412 Q56 `cosecθ−cotθ=k -> cosecθ` | Conjugate reciprocal recovery | TRG-001 | DIRECT_RUNTIME_MATCH | Conjugate sec/tan and cosec/cot family is established. |
| p412 Q58 `sec²θ+tan²θ=7`, solve θ | Identity reduction + angle recovery | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Fundamental identity exists; exact solve-to-angle construction needs demonstration. |
| p412 Q59 `sin²x+2tan²x−2sec²x+cos²x` | Composite Pythagorean + sec/tan simplification | TRG-001 | DIRECT_RUNTIME_MATCH | Same core identity stack already represented in current TRG audit. |
| p413 Q68 `2(cos²θ−sin²θ)=1`, find cotθ | Double-angle-equivalent relation + ratio recovery | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | In-scope; needs exact runtime evidence. |
| p413 Q72 quadratic in cosθ then `tan(θ−15°)` | Algebraic trig equation + angle-difference evaluation | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Composite but exam-relevant; runtime generation must be proven. |
| p413 Q74 pole/tower elevation + depression | Compound Heights & Distances | TRG-002 | OWNED_BY_OTHER_PACKAGE | Explicit application boundary. |
| p413 Q76 rational tan/cot identity | Rational reciprocal identity simplification | TRG-001 | FAMILY_MATCH_RUNTIME_DEMO_NEEDED | Authority likely owns mathematics; exact rational surface needs proof. |

## Batch 1 preliminary result

This batch does **not** support a blanket statement that TRG-001 already generates every book form.

It does support a stronger and more useful conclusion:

1. Core SSC trig families are well represented.
2. A large middle layer is **conceptually covered but still needs runtime-construction proof**.
3. At least three materially distinct book constructions deserve explicit gap review:
   - long complementary product pairing (`tan1°...tan89°` style);
   - triple-angle-equivalent polynomial forms (`3cosθ−4cos³θ` style);
   - symmetric trigonometric series sums (`cos²5°+...+cos²90°` style).
4. Several apparent "trigonometry" book questions are correctly owned by TRG-002 or Geometry and must not inflate TRG-001 scope.

## Required next actions

1. Generate runtime samples for every `FAMILY_MATCH_RUNTIME_DEMO_NEEDED` row.
2. Promote to `DIRECT_RUNTIME_MATCH` only when an equivalent construction is reproducibly generated.
3. Review the three `MISSING_CONSTRUCTION_CANDIDATE` families for SSC recurrence and usefulness.
4. Continue Disha pages 414–416 as Batch 2.
5. Add a second independent uploaded book (Rakesh Yadav 7300) to prevent source-specific overfitting.
6. Only after multi-source coverage is stable should external-book coverage contribute to a TRG refreeze decision.
