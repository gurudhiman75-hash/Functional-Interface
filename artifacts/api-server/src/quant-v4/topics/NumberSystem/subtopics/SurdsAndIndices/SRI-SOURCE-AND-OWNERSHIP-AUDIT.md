# SRI Source and Ownership Audit — Wave 1

**Status:** `OPEN_DISCOVERY_WAVE_1`  
**Authority:** subordinate to `SRI-END-TO-END-DESIGN-R1`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Purpose:** source-backed executable-discovery inventory; candidate rows are evidence, not production QLs.

## 1. Evidence used in this wave

### Current external exam-preparation evidence

1. Testbook — *Surds and Indices MCQ*, updated 19 Aug 2026: https://testbook.com/objective-questions/mcq-on-surds-and-indices--5eea6a1039140f30f369e80a
   - complex conjugate rationalisation;
   - coefficient recovery from `a + b√m`;
   - transformed target after coefficient recovery;
   - nested surds;
   - exponent equations and mixed index forms.
2. Deepmentor — *SSC CGL Surds and Indices*, updated 30 Jun 2026: https://deepmentor.co/ssc/quantitative-aptitude/surds-and-indices
   - zero/negative/fractional indices;
   - surd classification;
   - different-order comparison;
   - nested radicals;
   - single and conjugate rationalisation.
3. EduRev — *Surds and Indices MCQs for Bank Exams*: https://edurev.in/chapter/questions/32300/38741/Surds-and-Indices
   - decimal negative exponents such as `(0.04)^(-1.5)`;
   - exponent-expression simplification.
4. Abhyas Online — *Bank AO Prelims / Surds And Indices*: https://abhyasonline.in/contents/Bank%20AO%20Prelims/Maths/Surds%20And%20Indices/Rationalisation%20of%20Surds/
   - zero exponent;
   - product of bases when exponent is same;
   - statement sums involving powers;
   - surd type and comparison.
5. Unacademy — *Bank: Surds And Indices*: https://unacademy.com/content/bank-exam/study-material/quantitative-aptitude/surds-and-indices/
   - same-index base product/quotient;
   - negative fractional powers;
   - coefficient-bearing conjugate rationalisation.
6. PrepGrind — *SSC CGL Surds and Indices*: https://prepgrind.com/study-material/ssc-cgl/surds-indices
   - negative fractional power of a fraction;
   - chained equality `2^x = 3^y = 6^-z`;
   - infinite nested-root pattern (retained only as source-gated candidate pending target-exam corroboration).

### Repository evidence

- `NS-EXP-001`: corrected legacy runtime; 100 current QL templates. Retain as migration evidence only.
- `NS-SURD-001`: legacy 8-CP / 47-QL runtime. Retain as migration evidence only.
- Legacy maturity reports are structural evidence, not proof of V4 source saturation.

## 2. Ownership rules applied

- SRI owns a question when exponent/surd structure is the dominant learner burden.
- Algebra owns generic identity/equation tasks where the radical merely occurs as a value or root representation.
- Number System owns remainder/last-digit/divisibility/cycle questions involving powers.
- Simplification owns long BODMAS/approximation expressions where surds or powers are merely operands.
- Data Sufficiency owns the sufficiency wrapper; SRI may expose the underlying capability.
- Geometry/Mensuration/Trigonometry own theorem/measurement/ratio tasks even when the exact answer is a surd.

## 3. Provisional solve-mode candidates

`KEEP` means strong legacy coverage exists but must be migrated to V4 exact state. `EXPAND` means the old family is materially thinner than source evidence. `NEW` means no first-class legacy family was found. `SOURCE_GATED` means evidence exists but release ownership/frequency still requires corroboration. None of these rows is a permanent QL.

### SRI-CP-001 — Integer indices and core laws

| Candidate | Task contract | Disposition |
|---|---|---|
| C001-A | multiply same-base integer powers | KEEP |
| C001-B | divide same-base integer powers | KEEP |
| C001-C | power raised to a power | KEEP |
| C001-D | mixed product/quotient compression | KEEP |
| C001-E | zero exponent with non-zero base | NEW |
| C001-F | multiply different bases carrying the same exponent | NEW |
| C001-G | divide different bases carrying the same exponent | NEW |
| C001-H | choose an equivalent expression using index laws | EXPAND |

### SRI-CP-002 — Zero, negative and fractional indices

| Candidate | Task contract | Disposition |
|---|---|---|
| C002-A | normalize a negative integer exponent | KEEP |
| C002-B | combine positive and negative exponents | KEEP |
| C002-C | convert/evaluate `a^(1/n)` | KEEP |
| C002-D | evaluate `a^(m/n)` on an exact perfect-power base | KEEP |
| C002-E | negative fractional exponent | NEW |
| C002-F | fractional exponent on an exact rational/fraction base | NEW |
| C002-G | negative fractional exponent on a fraction | NEW |
| C002-H | decimal exponent reduced exactly to a rational exponent | NEW |
| C002-I | reject/identify `0^0` and zero with negative exponent | NEW |
| C002-J | negative base with odd-denominator rational exponent | NEW |
| C002-K | identify non-real negative-base/even-denominator form | NEW |

### SRI-CP-003 — Compound powers and base harmonisation

| Candidate | Task contract | Disposition |
|---|---|---|
| C003-A | rewrite composite bases to one common base | KEEP |
| C003-B | simplify product/quotient after base harmonisation | KEEP |
| C003-C | harmonise reciprocal bases | NEW |
| C003-D | combine same-exponent different bases | NEW |
| C003-E | mixed integer/negative/fractional exponent structure after harmonisation | EXPAND |
| C003-F | equivalence decision between two differently written power expressions | EXPAND |

### SRI-CP-004 — Transformed exponential values and parameter recovery

| Candidate | Task contract | Disposition |
|---|---|---|
| C004-A | given `a^x`, find `a^(x+k)` | KEEP |
| C004-B | given `a^x`, find `a^(x-k)` | KEEP |
| C004-C | given `a^x`, find `a^(mx)` | KEEP |
| C004-D | combine two supplied power relations into a new target | NEW |
| C004-E | use `X=a^p`, `Y=a^q` to recover a power relation/parameter | NEW |
| C004-F | recover an integer parameter from a transformed power value | EXPAND |
| C004-G | derive a secondary requested quantity after parameter recovery | NEW |

### SRI-CP-005 — Exponential equations and unknown exponents

| Candidate | Task contract | Disposition |
|---|---|---|
| C005-A | same-base direct exponent equation | KEEP |
| C005-B | same-base linear exponent equation | KEEP |
| C005-C | common-base transformed equation | KEEP |
| C005-D | factor a common exponential term in a sum equation | NEW |
| C005-E | factor a common exponential term in a difference equation | NEW |
| C005-F | quadratic-in-`a^x` substitution where exponent structure is dominant | NEW |
| C005-G | chained equal-power relation such as `a^x=b^y=(ab)^-z` | NEW |
| C005-H | solve exponent then evaluate a derived power target | EXPAND |
| C005-I | reciprocal-base exponent equation | NEW |

### SRI-CP-006 — Comparison, ordering and statement reasoning with powers

| Candidate | Task contract | Disposition |
|---|---|---|
| C006-A | compare after same-base alignment | KEEP |
| C006-B | order three or more powers after alignment | KEEP |
| C006-C | compare expressions with a common exponent | NEW |
| C006-D | classify two powers as equal/greater/smaller | KEEP |
| C006-E | select the true/false statement about index laws | NEW |
| C006-F | exact statement-combination outcome over two or more power claims | NEW |
| C006-G | quantity comparison where both sides reduce to exact power normal form | NEW |

### SRI-CP-007 — Surd form, simplification and rationality

| Candidate | Task contract | Disposition |
|---|---|---|
| C007-A | simplify square root by extracting perfect squares | KEEP |
| C007-B | simplify cube root by extracting perfect cubes | KEEP |
| C007-C | simplify supported nth root by extracting perfect nth powers | NEW |
| C007-D | identify whether a radical is rational or a surd | NEW |
| C007-E | classify rational/irrational outcome of a simple exact radical form | NEW |
| C007-F | convert between radical and fractional-index representations | NEW |

### SRI-CP-008 — Arithmetic with surds and radical identities

| Candidate | Task contract | Disposition |
|---|---|---|
| C008-A | add/subtract already-like surds | KEEP |
| C008-B | simplify first, then combine like surds | KEEP |
| C008-C | multiply surds of the same index | KEEP |
| C008-D | divide supported surds exactly | KEEP |
| C008-E | square a binomial containing surds | KEEP |
| C008-F | conjugate-product / difference-of-squares identity | KEEP |
| C008-G | multiply two finite surd sums and collect canonical terms | EXPAND |
| C008-H | determine rational/irrational result after exact surd arithmetic | NEW |

### SRI-CP-009 — Rationalisation and conjugates

| Candidate | Task contract | Disposition |
|---|---|---|
| C009-A | rationalise monomial square-root denominator | KEEP |
| C009-B | rationalise supported cube-root monomial denominator | KEEP |
| C009-C | rationalise `k/(a±√b)` | KEEP |
| C009-D | rationalise `k/(√a±√b)` | KEEP |
| C009-E | rationalise coefficient-bearing `p√a ± q√b` denominator | EXPAND |
| C009-F | combine multiple rationalised terms into canonical `a+b√m` | NEW |
| C009-G | recover `a,b` from a canonical rationalised result | NEW |
| C009-H | evaluate a further target built from recovered coefficients | NEW |
| C009-I | exploit reciprocal/conjugate pair without decimal approximation | NEW |

### SRI-CP-010 — Nested surds and denesting

| Candidate | Task contract | Disposition |
|---|---|---|
| C010-A | denest `√(A+2√B)` | NEW |
| C010-B | denest `√(A-2√B)` | NEW |
| C010-C | decide whether a supported nested surd is denestable | NEW |
| C010-D | reverse-construct `A,B` from `√m ± √n` | NEW |
| C010-E | recover hidden component/parameter from a denested form | NEW |
| C010-F | nested/infinite radical fixed-point pattern | SOURCE_GATED |

### SRI-CP-011 — Transformed surd values, equations, comparison and bounds

| Candidate | Task contract | Disposition |
|---|---|---|
| C011-A | compare positive single square surds exactly | KEEP |
| C011-B | compare coefficient-bearing square surds by exact squares | KEEP |
| C011-C | compare/order radicals of different indices via common exact power | EXPAND |
| C011-D | locate `√n` between consecutive integers | NEW |
| C011-E | exact bound/range statement about an irrational radical | NEW |
| C011-F | transform `x=a+√b` using its conjugate/reciprocal relation | NEW |
| C011-G | solve a bounded one-radical equation and verify original domain | NEW |
| C011-H | reject an extraneous candidate created by squaring | NEW |
| C011-I | statement truth-set involving surd comparison/bounds | NEW |

### SRI-CP-012 — Mixed surd-index synthesis

| Candidate | Task contract | Disposition |
|---|---|---|
| C012-A | simplify a radical by converting to rational exponents | NEW |
| C012-B | simplify an index expression by converting an exact power to radical form | NEW |
| C012-C | compare equivalent radical/index representations | NEW |
| C012-D | solve a short mixed radical-index equation where neither ordinary engine alone is sufficient | NEW |
| C012-E | evaluate a transformed target requiring one surd step and one index step | NEW |

## 4. Explicit exclusions / moves

| Pattern | Disposition | Owner |
|---|---|---|
| `7^103 mod 10`, last digit, cyclic remainder | MOVE | Number System |
| long BODMAS/approximation expression containing roots/powers | MOVE | Simplification & Approximation |
| generic `x+1/x` identity chain with no surd-specific burden | MOVE | Algebra |
| polynomial/quadratic equation whose roots happen to contain `√d` | MOVE | Algebra |
| sufficiency of statements used to determine an exponent | MOVE wrapper | Data Sufficiency |
| diagonal/height/triangle problem whose final answer is a surd | MOVE | Geometry/Mensuration/Trigonometry by tested burden |

## 5. Legacy disposition

### `NS-EXP-001`

- **KEEP as migration evidence:** existing human-authored stem families and the corrected deterministic P0 runtime.
- **DO NOT inherit:** legacy QL numbering/count claims, old fixed fixtures, generic explanation attachment, or V3 maturity claims as V4 freeze evidence.
- **EXPAND:** zero/domain edges, same-exponent base operations, reciprocal bases, transformed relations, factorable/quadratic exponent equations, statement/quantity reasoning.

### `NS-SURD-001`

- **KEEP as migration evidence:** canonical simplification, like-surds, arithmetic, basic comparison, rationalisation and identity solving.
- **DO NOT inherit:** `Math.random()` generation, floating-point comparison authority, fixed-stem duplicate behaviour, or 47-QL count as a V4 quota.
- **EXPAND:** classification, nth-root forms, coefficient recovery, denesting, transformed values, radical equations, exact bounds and mixed synthesis.

## 6. Wave-1 gap verdict

All twelve SRI checkpoints have executable/source-backed work to do. Existing V3 material covers a useful core but does not saturate the candidate matrix above. Permanent QL allocation remains prohibited until:

1. each candidate has executable state/solver/verifier evidence;
2. target-exam source-gap search is repeated per checkpoint;
3. inverse/reverse and edge/domain audits run;
4. merge/split compression removes mathematically duplicate contracts;
5. cross-chapter collision audit is closed;
6. representative English review is approved.
