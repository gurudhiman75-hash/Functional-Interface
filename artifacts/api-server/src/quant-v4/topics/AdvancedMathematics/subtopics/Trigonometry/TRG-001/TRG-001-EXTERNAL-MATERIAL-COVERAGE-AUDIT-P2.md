# TRG-001 External-Material Coverage Audit P2

Status: **ACTIVE AUDIT LAYER — NON-PRODUCTION AUTHORITY**

## Purpose

Use uploaded books, coaching material and solved-paper PDFs as an external challenge corpus for TRG-001/TRG-002. These sources do **not** become content authority and must not be copied. They are used only to identify question archetypes, representation patterns, difficulty shapes and coverage gaps.

## Source classes

### Primary SSC relevance
- `Disha SSC Mathematics Guidein English (sscstudy.com) (1).pdf`
- `30 Yearwise SSC CGL Solved Paper (English) 2022.pdf`
- `30 Yearwise SSC CGL Solved Paper (English) 2023.pdf`
- `30 Yearwise SSC CGL Solved Paper (English) 2024.pdf`

### Boundary / stretch source
- `Arun Sharma - How to Prepare for Quantitative Aptitude for the CAT-McGraw Hill Education (2018).pdf`

The SSC guide and solved papers are the main relevance evidence. CAT-oriented material is used only to identify adjacent constructions and explicitly mark material that is too advanced or off-profile for SSC/Banking.

## Classification

Every material observation must be assigned exactly one status:

- `DIRECTLY_COVERED` — current runtime has the same mathematical construction and exam representation.
- `COVERED_WITH_VARIATION` — current runtime owns the mathematics but does not yet demonstrate the exact construction/representation.
- `MISSING_EXAM_RELEVANT` — recurring/relevant external construction has no adequate runtime home.
- `TRG_002_APPLICATION` — legitimate trigonometry material owned by Heights & Distances rather than TRG-001.
- `OUT_OF_SCOPE_NON_MCQ_OR_OFF_PROFILE` — proof/theorem/CAT-level or otherwise inappropriate for the target mock profile.
- `NEEDS_RUNTIME_PROOF` — apparent authority home exists but a generated sample/runtime route must be demonstrated before calling it covered.

`DIRECTLY_COVERED` must not be awarded from a syllabus label alone. A QL/solve-mode/runtime construction must be identifiable.

## Initial uploaded-material matrix

| Material archetype | Source evidence | Audit classification | Current TRG home / action |
|---|---|---|---|
| Basic sin/cos/tan/cot/sec/cosec side ratios | Disha, Trigonometry pp. 400+ | DIRECTLY_COVERED | TRG-001 CP1 |
| Standard values at 0°,30°,45°,60°,90° | Disha pp. 400+; SSC solved papers | DIRECTLY_COVERED | TRG-001 CP2/CP6 |
| Reciprocal and Pythagorean identities | Disha pp. 400+ | DIRECTLY_COVERED | TRG-001 CP4/CP5 |
| Complementary-angle transformations | Disha pp. 401+ | DIRECTLY_COVERED | TRG-001 CP3/CP6 |
| `tan A=1`, `sin B=1/2`, evaluate `cos(A+B)` | Disha illustration | DIRECTLY_COVERED | CP6 compound/standard-angle family |
| `sin θ−cos θ=0`, acute θ, find θ | Disha illustration | DIRECTLY_COVERED | controlled acute-angle equation family |
| Cubic factorization `(sin³A±cos³A)/(sinA±cosA)` | Disha illustration; SSC-like archetype | DIRECTLY_COVERED | P2 QL-143 remediation |
| `secA+tanA=x` / conjugate reconstruction | Disha solutions; SSC 2023 solved paper | DIRECTLY_COVERED | CP5 conjugate family |
| Higher powers such as sin⁶/cos⁶ identities | Disha Level-II / solutions | COVERED_WITH_VARIATION | CP6 high-power/composite; retain as regression challenge |
| `tan x+cot x=3` leading to `sec²x+cosec²x` | Disha practice solutions | COVERED_WITH_VARIATION | CP5/CP6 controlled relation; require runtime proof sample |
| Max/min of `sinθ+cosθ` | Disha practice solutions | DIRECTLY_COVERED | CP6 max/min family |
| Dense complementary-angle mixed expression | Disha advanced illustration / SSC-style | COVERED_WITH_VARIATION | CP3+CP6; require generated parity sample |
| `tan²θ+cot²θ−sec²θ·cosec²θ` | SSC CGL 2022 solved paper | DIRECTLY_COVERED | CP4/CP6 identity composite |
| `cosecθ` given, evaluate composite `(sec²−1)cot²(1+cot²)` | SSC CGL 2024 solved paper | DIRECTLY_COVERED | CP5/CP6 derived reciprocal/identity composite |
| Long complementary-square expression across 30°–60° | SSC CGL 2024 solved paper | DIRECTLY_COVERED / regression anchor | CP3/CP6 complementary + Pythagorean |
| Height/tower/shadow/angle of elevation/depression | Disha applications | TRG_002_APPLICATION | TRG-002, never force into TRG-001 |
| Two observation points / inaccessible tower | Disha applications | TRG_002_APPLICATION | TRG-002 scenario/diagram engine |
| Textbook `show that` / proof-style identities | Disha illustrations | OUT_OF_SCOPE_NON_MCQ_OR_OFF_PROFILE | Do not add merely for book completeness |
| CAT-only multi-concept trigonometric manipulation | Arun Sharma boundary corpus | OUT_OF_SCOPE unless SSC recurrence exists | Use only as boundary evidence |

## Initial audit conclusion

The uploaded material does **not** currently expose a broad missing chapter family in TRG-001. It instead provides a useful regression corpus around several already-owned constructions.

The strongest unresolved material-audit items are not new syllabus topics; they are representation-depth checks:

1. prove runtime parity for dense complementary-angle expressions;
2. prove runtime parity for `tan+cot` derived sec/cosec relation questions;
3. sample higher-power identities beyond the newly added QL-126 construction;
4. keep Heights & Distances observations routed to TRG-002;
5. keep proof-style textbook questions out of the mock-generation completeness denominator.

## Freeze rule added by this audit

TRG-001 must not be called externally complete merely because all internal QLs are implemented.

Before refreeze, require:

- no unresolved `MISSING_EXAM_RELEVANT` observation in the sampled SSC corpus;
- every `COVERED_WITH_VARIATION` item either demonstrated by runtime samples or consciously accepted as a bounded representation gap;
- all Heights & Distances items correctly transferred to TRG-002;
- textbook proof/CAT-only material excluded from the SSC completeness denominator with an explicit reason;
- source observations retained as paraphrased archetypes only; do not copy source wording/options/explanations.

## Future audit-system behavior

This external-material layer should be reusable for every Quant chapter. For each package, maintain:

`uploaded material → archetype fingerprint → target package/QL → coverage status → remediation decision → regression anchor`

The external corpus is challenge evidence, not production authority and not a source of text to reproduce.
