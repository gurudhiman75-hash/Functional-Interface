# ExamTree Quant V4 — Simplification and Approximation
## SAP-CP-001..SAP-CP-012 Scope Authority

**Authority version:** `SAP_CP_SCOPE_V1`  
**Student-facing chapter:** Simplification and Approximation  
**Runtime packages:** `SAP-001` Exact Expression Simplification and `SAP-002` Approximation and Estimation  
**Checkpoint range:** `SAP-CP-001..SAP-CP-012`  
**Current permanent QL allocation:** `SAP-QL-001..SAP-QL-033`  
**Allocated checkpoints:** `SAP-CP-001`, `SAP-CP-002`  
**Next available permanent ID:** `SAP-QL-034`  
**Unallocated checkpoints:** `SAP-CP-003..SAP-CP-012`  

This file defines what each checkpoint owns, what it must not absorb, how neighbouring checkpoints are separated, and what evidence is required before a checkpoint can be treated as complete. It is a scope authority, not a fixed question-count or QL-count quota.

---

# 1. Chapter architecture

```text
Simplification and Approximation
├── SAP-001 — Exact Expression Simplification
│   ├── SAP-CP-001 — Operation Order, Grouping and Signed Arithmetic
│   ├── SAP-CP-002 — Fractions, Mixed Numbers and Complex Rational Expressions
│   ├── SAP-CP-003 — Decimals, Percentages and Exact Representation Switching
│   ├── SAP-CP-004 — Numeric Powers, Roots, Factorials and Exact Special Forms
│   ├── SAP-CP-005 — Structural Cancellation, Product Chains and Telescoping Forms
│   └── SAP-CP-006 — Missing Values, Equality, Comparison and Exact Synthesis
└── SAP-002 — Approximation and Estimation
    ├── SAP-CP-007 — Rounding, Place Value and Significant-Figure Control
    ├── SAP-CP-008 — Approximate Sums, Differences and Mixed Operation Chains
    ├── SAP-CP-009 — Approximate Products, Quotients, Ratios and Percentages
    ├── SAP-CP-010 — Approximate Roots, Powers, Reciprocals and Derived Values
    ├── SAP-CP-011 — Nearest-Value Selection, Bounds, Error and Option-Led Estimation
    └── SAP-CP-012 — Reverse Approximation, Missing Values and Essential Synthesis
```

The learner sees one chapter. The packages and checkpoints are internal ownership boundaries.

---

# 2. Global scope rules

## 2.1 One governing learner contract

A question belongs to the checkpoint that owns its decisive reasoning step, not the checkpoint that merely supplies one numeric representation.

Examples:

```text
Evaluate 3/4 + 5/6
→ SAP-CP-002 because fraction arithmetic is central.

Evaluate 0.75 + 5/6
→ SAP-CP-003 when representation switching is central.

Evaluate (3/4 × 14/15 × 25/7) using cancellation
→ SAP-CP-005 when the cancellation structure is the intended task.

Find □ in 0.75 + □ = 1.4
→ SAP-CP-006 only when the task is a generic exact inverse problem.

Round 47.86 to one decimal place
→ SAP-CP-007.

Estimate 47.86 + 152.13
→ SAP-CP-008.
```

## 2.2 Exact and approximate content must remain separate

`SAP-CP-001..006` use exact equality and exact answer semantics.  
`SAP-CP-007..012` use a declared approximation policy, certified interval, tolerance or nearest-option contract.

An approximate question may use exact arithmetic internally, but its learner contract remains approximate. An exact question must not use `≈` merely because a shortcut was used.

## 2.3 Synthesis checkpoints are not dumping grounds

- `SAP-CP-006` owns exact reverse and synthesis tasks only after the primary exact checkpoint authorities exist.
- `SAP-CP-012` owns reverse approximation and genuine multi-authority approximation synthesis only after `SAP-CP-007..011` exist.
- A question remains in its primary checkpoint when a second operation is incidental.

## 2.4 No duplicate learner QLs across chapters

The chapter may call shared exact-number, percentage, root, factorial or approximation utilities. Shared computation does not create duplicate learner ownership.

The following remain outside this chapter when they are the main objective:

- divisibility, HCF, LCM, recurring-decimal theory, prime structure and terminal digits → Number System;
- unknown percentage, base, rate, percentage change and applied percentage stories → Percentage;
- symbolic surds, rationalisation and symbolic index laws → Surds and Indices;
- general variable equations and identities → Algebra;
- arrangement or selection meaning of factorials → Permutation and Combination;
- coded or interchanged operators → Reasoning Mathematical Operations;
- chart or table interpretation → Data Interpretation.

## 2.5 Permanent QL rule

A permanent QL is justified only when the following materially differ:

- governing inference or expression topology;
- direct versus inverse direction;
- answer semantic;
- exact versus approximate contract;
- approved solving route;
- misconception profile;
- independent verification route;
- uniqueness or option-separation proof.

A new number set, wording variation, option order, language or cosmetic bracket style does not create a new QL.

---

# 3. Scope matrix

| CP | Core learner contract | Owns | Must not absorb |
|---|---|---|---|
| CP-001 | Parse and evaluate standard arithmetic correctly | precedence, grouping, signs, scoped `of`, valid/invalid steps | fraction arithmetic as the main challenge, representation switching, structural cancellation |
| CP-002 | Evaluate exact rational structures | fraction operations, mixed numbers, complex and continued fractions | lone representation theory, general algebra, structural telescoping |
| CP-003 | Switch exact representations to simplify evaluation | decimals, percentage literals, fraction-decimal-percent equivalence inside expressions | unknown percentage semantics, recurring-decimal theory, approximate decimals |
| CP-004 | Evaluate bounded exact special forms | numeric powers, exact roots, bounded factorials | symbolic indices/surds, valuations, counting interpretation |
| CP-005 | Recognise and execute structural reduction | cancellation maps, product chains, telescoping numeric forms | routine local cancellation, advanced series, cancellation across sums |
| CP-006 | Recover or compare exact values in fixed structures | missing operands, exact equality, comparison, exact synthesis | general equation chapters, primary single-family tasks |
| CP-007 | Apply or reverse a declared rounding rule | place-value rounding, decimal places, significant figures, rounding ranges | free-form estimation, option-led approximation |
| CP-008 | Estimate additive and mixed chains | approximate sums, differences and additive-dominant BODMAS | multiplicative-dominant estimation, uncontrolled near-cancellation |
| CP-009 | Estimate multiplicative structures | products, quotients, ratios and percentages | applied percentage stories, roots/powers as the main challenge |
| CP-010 | Estimate non-perfect special forms | roots, powers, reciprocals and bounded derived values | advanced numerical methods or symbolic theory |
| CP-011 | Prove the nearest answer or valid error/bound | nearest option, bounds, absolute/relative error, safety gaps | ordinary rounding drills, reverse missing-value synthesis |
| CP-012 | Reverse or combine approximation authorities | missing values, tolerance bands, approximate equality, synthesis | tasks fully owned by CP-007..011 |

---

# 4. SAP-CP-001 — Operation Order, Grouping and Signed Arithmetic

## 4.1 Learner promise

The learner can read one unambiguous arithmetic expression, identify the correct scope and precedence, and evaluate it exactly without falling for common BODMAS misconceptions.

## 4.2 Included scope

- flat mixed-operation expressions;
- multiplication and division with equal precedence, left to right;
- addition and subtraction with equal precedence, left to right;
- nested parentheses, braces and square brackets;
- fraction-bar or vinculum scope when the main issue is grouping rather than fraction arithmetic;
- unary positive and negative operands;
- negative intermediate values and sign propagation;
- explicitly scoped `of` multiplication;
- unambiguous implicit multiplication between a number and a complete grouped block;
- a small power or factorial inside an expression when the principal test is precedence;
- comparison of differently grouped versions of the same visible numbers;
- selecting an equivalent grouping;
- identifying the first valid or first invalid evaluation step;
- evaluating one declared subexpression before completing the whole expression.

## 4.3 Excluded or delegated

- fraction arithmetic whose denominator work is central → CP-002;
- decimal/fraction/percentage switching → CP-003;
- power, root or factorial technique as the main objective → CP-004;
- cancellation maps or telescoping → CP-005;
- missing-value reconstruction → CP-006;
- coded, interchanged or hidden operators → Reasoning OPS.

## 4.4 Answer semantics

- exact integer;
- exact rational when grouping naturally produces one;
- comparison class;
- equivalent expression;
- step label;
- truth value.

## 4.5 Difficulty boundary

- Easy: one precedence pivot or one grouping decision;
- Medium: two or more material pivots, signed intermediate values or nested scope;
- Hard: comparison/diagnosis where several plausible routes must be rejected.

Long mechanical strings without a new reasoning burden are not Hard.

## 4.6 Completion boundary

CP-001 is complete only when ordinary evaluation, grouping comparison, valid-step diagnosis and invalid-step diagnosis are all represented, and every rendered expression has exactly one parse.

## 4.7 Current allocation

`SAP-QL-001..SAP-QL-016` are the current permanent identities for this checkpoint.

---

# 5. SAP-CP-002 — Fractions, Mixed Numbers and Complex Rational Expressions

## 5.1 Learner promise

The learner can evaluate exact fraction structures, choose the correct rational operation, simplify efficiently and report the answer in the required form.

## 5.2 Included scope

- fraction addition and subtraction;
- product of fractions with valid cross-cancellation;
- fraction division through the reciprocal of the divisor;
- mixed fraction operation chains;
- mixed-number conversion followed by exact evaluation;
- fraction of a fraction;
- signed fraction expressions;
- bracketed fraction expressions;
- complex fractions with complete numerator and denominator blocks;
- bounded continued fractions evaluated inner to outer;
- fraction expressions containing an integer part;
- products of a fraction sum and fraction difference;
- reciprocal of a complete fraction expression;
- complement expressions such as `1 − used fraction`;
- missing numerator or missing denominator where fraction structure is central;
- missing fraction operand in a simple fixed rational equality;
- comparison of two evaluated fraction expressions;
- selecting the equivalent answer in the required reduced form;
- identifying the first invalid fraction step.

## 5.3 Boundary with CP-005 and CP-006

- Routine cancellation inside a normal fraction product remains CP-002.
- A question moves to CP-005 when recognising a larger cancellation pattern or telescoping structure is the decisive skill.
- A missing numerator, denominator or simple fraction operand remains CP-002 when rational structure is the main lesson.
- A question moves to CP-006 when the unknown is part of a broader exact mixed-expression or cross-family synthesis.

## 5.4 Excluded or delegated

- classification or reduction of a lone fraction as representation theory → Number System;
- HCF/LCM of fractions → Number System;
- rational expressions containing variables → Algebra;
- advanced or unbounded continued fractions → advanced hold;
- decimal/percentage switching as the intended shortcut → CP-003.

## 5.5 Answer semantics

- reduced rational;
- mixed number when explicitly required;
- integer;
- missing component;
- comparison class;
- step label.

## 5.6 Difficulty boundary

- Easy: one direct fraction operation with exam-realistic values;
- Medium: two-stage chain, mixed number, reciprocal or signed bracket;
- Hard: complex/continued fraction, comparison, inverse component or diagnosis requiring several exact stages.

## 5.7 Completion boundary

Every explanation must execute the displayed arithmetic completely. Complex fractions must show top block, bottom block and final division. Reciprocal questions must visibly perform the outer reciprocal. Continued fractions must show every layer.

## 5.8 Current allocation

`SAP-QL-017..SAP-QL-033` are the current permanent identities for this checkpoint.

---

# 6. SAP-CP-003 — Decimals, Percentages and Exact Representation Switching

## 6.1 Learner promise

The learner can recognise when an exact decimal, fraction or percentage representation makes a displayed expression easier, convert without changing value, and evaluate exactly.

## 6.2 Included scope

- terminating-decimal addition, subtraction, multiplication and division;
- decimal place-value multiplication and division by powers of ten;
- decimal division by compatible factors;
- expressions mixing decimals and fractions;
- percentage literals used as pure numeric factors;
- percent of a quantity inside a larger arithmetic expression;
- mixed fraction-decimal-percentage expressions;
- converting displayed terms to fractions before evaluation;
- converting displayed terms to decimals before evaluation;
- common exact equivalences such as `0.5 = 1/2 = 50%`;
- recurring decimals only when a shared exact adapter converts them inside a larger expression;
- complementary percentage expressions used as arithmetic;
- successive percentage factors treated as pure multiplication, without applied change semantics;
- missing decimal operand in a fixed exact expression;
- missing percentage literal where the percentage acts only as a number;
- comparison of equivalent fraction, decimal and percentage results;
- decimal-placement diagnosis;
- identification of an invalid exact conversion step.

## 6.3 Excluded or delegated

- construction of a recurring fraction from a recurring decimal → Number System;
- termination/non-termination classification → Number System;
- “what percent”, unknown rate/base/part and percentage change → Percentage;
- estimation or rounding of decimals → CP-007..009;
- generic missing-value synthesis combining several exact families → CP-006.

## 6.4 Answer semantics

- exact decimal;
- exact rational;
- percentage literal;
- missing numeric literal;
- comparison class;
- equivalent representation;
- step label.

## 6.5 Difficulty boundary

Difficulty depends on the number and purpose of representation switches, not the number of decimal digits. A two-digit decimal-placement trap can be Medium; a long but direct decimal sum can remain Easy.

## 6.6 Completion boundary

The checkpoint must prove exact string-to-value conversion, preservation of trailing zero meaning where relevant, no binary-floating-point equality decisions, and question-specific explanation of each representation switch.

---

# 7. SAP-CP-004 — Numeric Powers, Roots, Factorials and Exact Special Forms

## 7.1 Learner promise

The learner can evaluate bounded numeric powers, exact roots and factorial forms as arithmetic objects, then combine them with ordinary operations.

## 7.2 Included scope

- small non-negative integer powers;
- zero and one exponents;
- negative numeric bases with integer exponents;
- powers of fractions;
- perfect square roots and cube roots;
- bounded general perfect roots;
- exact roots of fractions whose numerator and denominator are perfect powers;
- root followed by mixed arithmetic;
- exact power-root cancellation;
- bounded nested perfect roots;
- small factorials;
- factorial ratios and product quotients when special-form evaluation is central;
- factorials embedded in mixed expressions;
- direct missing exponent from a small bounded candidate set;
- direct missing perfect radicand in a fixed structure;
- comparison of exact numeric power/root expressions;
- identification of an invalid power, root or factorial step.

## 7.3 Boundary with CP-001 and CP-005

- A single power or factorial included only to test precedence remains CP-001.
- A factorial ratio moves to CP-005 when the main skill is structural cancellation across a long product.
- CP-004 owns the special-form value; CP-005 owns the cancellation pattern.

## 7.4 Excluded or delegated

- symbolic exponent laws and variable bases → Surds and Indices;
- symbolic surd simplification and rationalisation → Surds and Indices;
- perfect-power classification, valuations and trailing zeroes → Number System;
- factorial as arrangements or selections → P&C;
- non-perfect-root estimation → CP-010;
- logarithmic or calculus-based approximation → excluded.

## 7.5 Answer semantics

- exact integer;
- reduced rational;
- missing exponent or radicand;
- comparison class;
- step label.

## 7.6 Difficulty boundary

Hard content must arise from interaction among exact special forms, inverse bounded reasoning or diagnosis—not from enormous exponents or factorials.

## 7.7 Completion boundary

Every generated root must be exact in SAP-001. Independent proof must use repeated multiplication, direct perfect-power verification or bounded product expansion rather than trusting the canonical special-form function.

---

# 8. SAP-CP-005 — Structural Cancellation, Product Chains and Telescoping Forms

## 8.1 Learner promise

The learner can see and exploit a structural reduction before doing heavy arithmetic, while avoiding illegal cancellation across addition or subtraction.

## 8.2 Included scope

- common-factor cancellation before multiplication;
- cancellation across a multi-fraction product chain;
- numeric factor extraction followed by cancellation;
- ratio of products;
- consecutive-integer product ratios;
- long factorial ratios where expansion would be wasteful;
- product of reciprocals;
- numeric difference-of-squares products;
- exact numeric conjugate products;
- repeated common-factor blocks;
- nested reciprocal chains when the structure is central;
- bounded telescoping sums;
- bounded telescoping products;
- source-backed numeric partial-fraction telescoping;
- products of `1 ± 1/n` patterns;
- symmetric fraction-pair expressions;
- repeated-block compression;
- missing factor recoverable from a cancellation state;
- selecting the best first cancellation step;
- comparing raw and structurally simplified routes;
- identifying illegal cancellation across addition or subtraction.

## 8.3 Boundary with CP-002 and CP-004

- A normal two-fraction product with one cross-cancellation remains CP-002.
- A short factorial calculation remains CP-004.
- CP-005 begins when recognising the cancellation map or telescoping structure is the intended exam advantage.

## 8.4 Excluded or delegated

- symbolic algebraic factorisation → Algebra;
- advanced series theory → advanced hold;
- cancellation that relies on hidden identities not shown or derivable from the question → reject;
- illegal cancellation across terms joined by `+` or `−` → diagnosis only, never accepted as a route.

## 8.5 Answer semantics

- exact integer or rational;
- missing factor;
- best first step;
- equivalent reduced expression;
- route comparison;
- step label.

## 8.6 Difficulty boundary

Difficulty derives from visibility and depth of the structural pattern. A long chain with obvious pairwise cancellation may be Easy/Medium; a short expression requiring factor recognition can be Hard.

## 8.7 Completion boundary

The canonical explanation must expose an exact cancellation map. The independent verifier must also evaluate the bounded unsimplified expression exactly to prove that the structural route preserved value.

---

# 9. SAP-CP-006 — Missing Values, Equality, Comparison and Exact Synthesis

## 9.1 Learner promise

The learner can reverse a fixed arithmetic structure, compare exact expressions and combine earlier exact authorities without turning the chapter into general algebra.

## 9.2 Included scope

- missing addend, minuend or subtrahend;
- missing factor, dividend or divisor;
- missing operand in a fixed mixed-operation expression;
- missing complete bracketed subexpression;
- missing integer from a fraction expression when the task is cross-family rather than fraction-specific;
- missing decimal from a mixed exact expression;
- bounded missing power, root or factorial component in a composed exact structure;
- value making two fully numeric expression sides equal;
- comparison of two exact expressions;
- ordering several exact expressions;
- selecting an equivalent exact expression;
- selecting a correct or incorrect simplification statement;
- candidate verification by substitution;
- exact arithmetic statement-combination questions;
- exact arithmetic data sufficiency only after ordinary direct authorities are stable;
- small table or mini-caselet wrappers whose interpretation is trivial and whose core is exact arithmetic.

## 9.3 Admission rule

A task enters CP-006 only when at least one of these is true:

- the unknown is not naturally owned by a single earlier CP;
- two or more exact checkpoint authorities must be combined;
- comparison, ordering or statement synthesis is the learner objective;
- candidate substitution is materially different from the direct route.

## 9.4 Excluded or delegated

- simple missing fraction component → CP-002;
- simple missing decimal or percentage representation → CP-003;
- direct missing exponent/radicand → CP-004;
- missing factor visible from a cancellation map → CP-005;
- general linear/quadratic/polynomial equation families → Algebra;
- coded operators → Reasoning OPS.

## 9.5 Answer semantics

- missing exact value;
- comparison class;
- ordered list;
- equivalent expression;
- truth value;
- statement combination;
- sufficiency class;
- complete candidate set or count.

## 9.6 Difficulty boundary

Hard tasks may combine multiple exact authorities or require proof of uniqueness. They must not become disguised algebra chapters or depend on excessive candidate enumeration.

## 9.7 Completion boundary

CP-006 cannot be source-frozen before CP-003, CP-004 and CP-005 have stable ordinary authorities. Every inverse answer must be checked by substitution or bounded independent enumeration.

---

# 10. SAP-CP-007 — Rounding, Place Value and Significant-Figure Control

## 10.1 Learner promise

The learner can apply one declared rounding rule, interpret the precision conveyed by the result and reverse the rule into a valid value range.

## 10.2 Included scope

- rounding integers to nearest ten, hundred or thousand;
- rounding decimals to nearest integer;
- rounding to declared decimal places;
- rounding to declared significant figures where exam evidence supports it;
- positive and negative values under one explicit tie rule;
- identifying the deciding place-value digit;
- selecting the correctly rounded representation;
- comparing results at different precisions;
- finding the range of original values that round to a target;
- least or greatest admissible value for a rounded result;
- missing digit for a declared rounding outcome;
- absolute rounding error for one value;
- maximum possible rounding error under the declared unit;
- simple relative or percentage rounding error when directly tied to the rounding interval;
- identifying premature rounding or an invalid significant-figure count.

## 10.3 Boundary with CP-011

- CP-007 owns the mechanics and direct consequences of one rounding rule.
- CP-011 owns option-led nearest selection, comparison of competing estimates, certified expression intervals and safety-gap proof.

## 10.4 Excluded or delegated

- free selection of convenient values to estimate an expression → CP-008/009;
- scientific measurement conventions beyond competitive-exam arithmetic → advanced hold;
- conflicting unstated tie rules → reject.

## 10.5 Answer semantics

- rounded value;
- place-value label;
- interval;
- least/greatest admissible value;
- missing digit;
- absolute, relative or percentage error;
- step label.

## 10.6 Completion boundary

The tie rule must be machine-declared and stable across languages. Trailing zeroes must preserve intended precision. Independent proof must reconstruct the rounding interval rather than calling the same rounding function.

---

# 11. SAP-CP-008 — Approximate Sums, Differences and Mixed Operation Chains

## 11.1 Learner promise

The learner can estimate additive or additive-dominant expressions under a declared policy and judge whether the result is an overestimate, underestimate or uniquely nearest option.

## 11.2 Included scope

- approximate sums by rounding terms;
- approximate differences by rounding terms;
- signed sums and differences;
- bracketed additive expressions;
- decimal sums and differences;
- mixed add-multiply expressions when addition/subtraction controls the approximation decision;
- mixed divide-add expressions when the additive stage is central;
- bounded BODMAS estimation chains;
- compatible addends for a declared target place;
- missing addend or subtrahend under approximate equality when additive inversion is direct;
- nearest option for an additive estimate;
- upper and lower bounds for sums and differences;
- comparison of two approximate additive expressions;
- identifying overestimate or underestimate;
- diagnosing an invalid rounding direction in an additive chain.

## 11.3 Boundary with CP-009

Use CP-008 when addition or subtraction determines sensitivity and policy. Use CP-009 when multiplication, division, ratio or percentage scaling determines the estimate.

## 11.4 Excluded or rejected

- subtraction of nearly equal quantities under uncontrolled rounding;
- a denominator that can round to zero;
- an unstated policy where terms-first and final-only produce different answers;
- multiplicative estimation disguised by one incidental addition → CP-009.

## 11.5 Answer semantics

- estimated value;
- nearest option;
- interval;
- over/under class;
- missing approximate operand;
- comparison class;
- step label.

## 11.6 Completion boundary

Every state must retain the exact oracle, transformed expression, approved estimate and uncertainty. Close-subtraction states require bound-preserving proof or rejection.

---

# 12. SAP-CP-009 — Approximate Products, Quotients, Ratios and Percentages

## 12.1 Learner promise

The learner can choose compatible multiplicative values, preserve scale and estimate products, quotients, ratios and percentage factors safely.

## 12.2 Included scope

- products estimated by rounding factors;
- decimal products;
- quotients estimated using compatible numerator and denominator values;
- approximate value of a fraction;
- approximate ratio value;
- approximate percentage of a quantity;
- approximate one quantity as a percentage of another when no applied story is involved;
- percentage-factor products;
- product-quotient chains;
- coordinated scaling of numerator and denominator;
- common-factor cancellation before approximation;
- reciprocal-then-multiply routes;
- missing factor or divisor under approximate equality when multiplicative inversion is direct;
- nearest option for a product or quotient;
- comparison of approximate ratios;
- bounds for positive products and quotients;
- decimal-scale or place-shift diagnosis;
- diagnosis of independent rounding that distorts a ratio.

## 12.3 Boundary with Percentage and CP-010

- Pure numeric `%` estimation belongs here.
- Applied percentage change, profit, discount, population or rate stories remain in their applied chapters.
- Approximate roots and powers belong to CP-010 even when later multiplied.

## 12.4 Excluded or rejected

- denominator rounded to zero or across a sign change;
- ratio substitutions that destroy a common scale without certified error;
- options closer together than the approximation uncertainty;
- applied percentage semantics as the primary task.

## 12.5 Answer semantics

- estimated value;
- approximate ratio or percentage;
- nearest option;
- interval;
- missing factor/divisor;
- comparison class;
- over/under class;
- step label.

## 12.6 Completion boundary

The engine must preserve sign, scale and non-zero denominators. Option spacing must be larger than the certified uncertainty of the approved route.

---

# 13. SAP-CP-010 — Approximate Roots, Powers, Reciprocals and Derived Values

## 13.1 Learner promise

The learner can estimate non-perfect roots, bounded powers and reciprocals from nearby exact benchmarks without using advanced numerical analysis.

## 13.2 Included scope

- square roots from nearby perfect squares;
- cube roots from nearby perfect cubes;
- bounded higher roots from nearby perfect powers;
- nearest integer root;
- nearest tenth root only when exam evidence supports it;
- interval containing a non-perfect root;
- upper or lower root bound;
- small decimal powers;
- percentage power factors;
- reciprocal of a value near a convenient benchmark;
- root products or quotients;
- mixed bounded power-root approximation;
- simple first-order difference or interpolation only when source-backed and within a certified safe range;
- missing radicand under approximate equality;
- missing base in a bounded approximate power;
- nearest option for root or power;
- comparison of approximate root/power values;
- diagnosis of a wrong benchmark or unsafe interpolation.

## 13.3 Excluded or delegated

- exact perfect roots → CP-004;
- symbolic roots and indices → Surds and Indices;
- Newton-Raphson, logarithmic interpolation, Taylor/binomial series and unrestricted numerical methods → excluded or advanced hold;
- reverse multi-authority approximation → CP-012.

## 13.4 Answer semantics

- estimated root/power/reciprocal;
- nearest integer or option;
- interval or bound;
- missing radicand/base;
- comparison class;
- step label.

## 13.5 Difficulty boundary

Difficulty comes from benchmark selection, interval proof, interaction among derived values or option closeness—not from demanding many decimal places.

## 13.6 Completion boundary

Independent verification must use integer-power bracketing or a sufficiently precise independent oracle with a certified margin. No question may require a precision unsupported by the stem or source pattern.

---

# 14. SAP-CP-011 — Nearest-Value Selection, Bounds, Error and Option-Led Estimation

## 14.1 Learner promise

The learner can select or justify the uniquely nearest answer and quantify how reliable an approximation is.

## 14.2 Included scope

- nearest option to an exact or estimated expression;
- nearest integer or declared multiple;
- nearest fraction or decimal option;
- option within a stated tolerance;
- absolute error;
- relative error;
- percentage error;
- overestimate or underestimate direction;
- certified interval for an expression;
- tightest valid displayed interval;
- comparison of the accuracy of two estimates;
- estimate with smaller absolute or relative error;
- required precision to separate options;
- explicit rejection of equidistant or ambiguous options;
- diagnosis of an unsafe option gap;
- exact-oracle verification of an approximate option.

## 14.3 Boundary with CP-007 and CP-008..010

- CP-007 owns direct rounding mechanics and the interval created by one rounding unit.
- CP-008..010 own the primary estimation method.
- CP-011 owns the final question when nearest-option uniqueness, bound quality, error measurement or safety proof is the central learner contract.

## 14.4 Option-separation authority

For each option, compute exact distance from the exact value. The correct option must be uniquely nearest. The gap between the best and second-best option must exceed the uncertainty of the approved approximation route. Otherwise reject the state.

## 14.5 Answer semantics

- nearest option;
- interval;
- absolute, relative or percentage error;
- over/under class;
- accuracy comparison;
- required precision;
- safety/ambiguity truth value.

## 14.6 Completion boundary

Every nearest-option item needs exact distance evidence. Every bound/error item needs an exact oracle or independently certified interval. “Closest-looking” options without proof are prohibited.

---

# 15. SAP-CP-012 — Reverse Approximation, Missing Values and Essential Synthesis

## 15.1 Learner promise

The learner can reverse a declared approximation process, find all admissible values and combine earlier approximation authorities while respecting tolerance and uncertainty.

## 15.2 Included scope

- missing operand from an approximate result;
- missing rounded term in an expression;
- original value range from a rounded operand;
- unknown value before and after rounding;
- missing percentage in a pure approximate expression;
- missing ratio term from an approximate quotient;
- missing root or power component under a bounded approximate contract;
- value satisfying approximate equality within tolerance;
- all candidate values within an approximation band;
- unique, multiple, impossible or indeterminate outcome classification;
- exact cancellation followed by approximation;
- approximated terms followed by an exact final operation;
- deciding whether the stem requires an exact or approximate route;
- approximation statement-combination questions;
- approximation data sufficiency after ordinary authorities are stable;
- small approximation tables or caselets whose interpretation is not the main task;
- candidate verification against policy and tolerance;
- selecting the correct approximation strategy;
- identifying an incorrect approximation claim.

## 15.3 Admission rule

A question enters CP-012 only when it requires approximation-aware inversion or genuine composition of at least two earlier approximation authorities. A direct missing addend remains CP-008; a direct missing divisor remains CP-009; a direct root bound remains CP-010.

## 15.4 Excluded or delegated

- general algebraic equations with an approximate coefficient → Algebra;
- applied percentage or ratio stories → their applied chapter;
- interpretation-heavy tables/charts → Data Interpretation;
- open-ended numerical analysis → excluded.

## 15.5 Answer semantics

- missing approximate value;
- interval or tolerance band;
- complete admissible set;
- number of admissible values;
- unique/multiple/impossible/indeterminate class;
- strategy class;
- truth value;
- sufficiency class.

## 15.6 Completion boundary

CP-012 cannot be frozen before CP-007..011 have stable policies and independent proof routes. Candidate sets must be complete, not merely one convenient example.

---

# 16. Cross-checkpoint conflict rules

## 16.1 CP-001 versus CP-002

- Main challenge is precedence/grouping → CP-001.
- Main challenge is fraction arithmetic → CP-002.

## 16.2 CP-002 versus CP-005

- Cancellation is a local arithmetic step → CP-002.
- Recognition of a structural cancellation map is the task → CP-005.

## 16.3 CP-003 versus Percentage

- Percentage symbol acts as a numeric representation → CP-003.
- Part-whole-rate meaning or percentage change is central → Percentage.

## 16.4 CP-004 versus Surds and Indices

- Fully numeric exact power/root/factorial → CP-004.
- Symbolic law, rationalisation or variable-base manipulation → Surds and Indices.

## 16.5 CP-006 versus Algebra

- Fixed arithmetic structure solved by direct inverses or bounded candidates → CP-006.
- General equation family or symbolic transformation → Algebra.

## 16.6 CP-007 versus CP-011

- Apply or reverse one rounding rule → CP-007.
- Prove nearest option, compare accuracy or certify expression error/bounds → CP-011.

## 16.7 CP-008 versus CP-009

- Additive sensitivity controls the route → CP-008.
- Multiplicative scale or denominator choice controls the route → CP-009.

## 16.8 CP-010 versus CP-012

- Direct root/power benchmark estimation → CP-010.
- Missing component or composed approximation authority → CP-012.

---

# 17. Implementation dependencies and recommended order

```text
Already implemented and allocated:
1. SAP-CP-001
2. SAP-CP-002

Next exact foundations, safe to develop in parallel after shared adapters are agreed:
3. SAP-CP-003 — decimal/fraction/percentage representation engine
4. SAP-CP-004 — exact power/root/factorial engine
5. SAP-CP-005 — structural cancellation engine

Exact synthesis only after the above ordinary authorities stabilise:
6. SAP-CP-006

Approximation foundation:
7. SAP-CP-007 — rounding policy and interval engine

Can then progress largely in parallel:
8. SAP-CP-008 — additive estimation
9. SAP-CP-009 — multiplicative estimation
10. SAP-CP-010 — root/power/reciprocal estimation

Cross-cutting approximation proof:
11. SAP-CP-011 — option separation, bounds and error

Final approximation synthesis:
12. SAP-CP-012
```

CP-003, CP-004 and CP-005 should not independently create incompatible exact-value, formatting or explanation contracts. CP-008, CP-009 and CP-010 must share the policy object established by CP-007 and the option-gap proof required by CP-011.

---

# 18. Minimum completion gate for every CP

A checkpoint is not complete merely because generators exist. Before permanent allocation it must have:

1. source saturation and ownership reconciliation;
2. explicit inclusion and exclusion decisions for every discovered family;
3. merge/split review of solve authorities;
4. deterministic valid-state-first generation;
5. canonical solver and materially independent verifier;
6. exact answer or certified approximation proof;
7. misconception-derived options with no formatting or answer-position cues;
8. fully executed, visible-operand explanations;
9. difficulty calibration based on reasoning burden;
10. duplicate and canonical-identity audit;
11. student-facing editorial review against SSC, banking and state-exam standards;
12. explicit product approval before permanent allocation, activation or publication.

---

# 19. Current lifecycle after SAP-CP-002 approval

```text
SAP-CP-001: permanent QLs allocated, inactive
SAP-CP-002: permanent QLs allocated, V4 approved and merged, inactive
SAP-CP-003: scope defined, executable discovery not yet approved
SAP-CP-004: scope defined, executable discovery not yet approved
SAP-CP-005: scope defined, executable discovery not yet approved
SAP-CP-006: scope defined, blocked by CP-003..005 ordinary authorities
SAP-CP-007: scope defined, approximation policy discovery pending
SAP-CP-008: scope defined, depends on CP-007 policy engine
SAP-CP-009: scope defined, depends on CP-007 policy engine
SAP-CP-010: scope defined, depends on CP-007 policy engine
SAP-CP-011: scope defined, depends on CP-008..010 evidence and exact option-distance proof
SAP-CP-012: scope defined, blocked by CP-007..011 ordinary authorities
```

No checkpoint becomes Question Studio discoverable, Question Bank writable, test eligible or publicly publishable merely because its scope has been defined.
