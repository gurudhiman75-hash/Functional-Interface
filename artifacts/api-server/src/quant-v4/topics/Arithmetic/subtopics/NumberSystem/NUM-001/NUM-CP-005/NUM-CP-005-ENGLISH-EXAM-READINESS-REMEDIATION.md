# NUM-CP-005 — English Exam-Readiness Remediation

**Checkpoint:** `NUM-CP-005 — Divisors and Divisor Functions`  
**Permanent QL range:** `NUM-QL-046..NUM-QL-069`  
**Final review pack:** 290 English questions  
**Approval date:** 2026-08-08  
**Approval:** product-owner approved English freeze  
**Delivery state:** inactive; all downstream delivery gates remain closed

## Why the technical freeze was reopened

The mathematical authorities were correct, but the learner-facing contract contained release blockers:

- semantically duplicate empty-set options in `NUM-QL-066`;
- overlapping data-sufficiency categories in `NUM-QL-069`;
- dominant answer±1/±2 distractor geometry;
- incomplete calculations in explanations;
- malformed perfect-power exponent sequences;
- raw enormous divisor-product answers;
- parity-revealing options;
- dead comparison and claim distractors;
- long divisor-pair table stems;
- inconsistent exponent/base rendering, including powers visually appearing to the left of the second base.

## Remediation implemented

### One-correct-option contract

- Semantic option normalisation rejects equivalent empty-set forms.
- `NUM-QL-066` no-solution cases receive distinct misconception sets.
- `NUM-QL-069` uses four mutually exclusive data-sufficiency categories.
- Every wrong option carries a question-specific misconception ID and analysis.

### Distractors

The permanent English layer constructs distractors from governed wrong methods, including:

- adding exponent choices instead of multiplying;
- forgetting the zero-exponent choice;
- reversing a complement or set difference;
- omitting a divisor pair;
- returning a rank instead of the ranked divisor;
- ignoring a bound or parity condition;
- swapping comparison values;
- returning `x+1` instead of `x`;
- forcing a non-integral exponent in an inverse problem.

The audit rejects renewed dominance of universal answer±1/±2 options.

### Explanations

Every QL owns a calculation-complete explanation mode. The learner sees:

- the exact exponent-choice product;
- total-minus-odd calculations for even divisors;
- geometric-sum expansion for divisor sums;
- factor-pair translation for inverse exponent problems;
- candidate sets for data sufficiency;
- direct division for divisor-pair completion;
- explicit verification of bounds, parity and uniqueness;
- structural exponent-pattern proofs for bounded greatest-integer questions;
- complete statement-set derivations for data sufficiency.

Generic warning blocks were replaced with three traps tied to the displayed question.

### Exam realism and delivery control

- Divisor products are asked and answered symbolically rather than as huge raw integers.
- Prime-power reconstruction remains in exponential form when expansion adds no conceptual value.
- Long divisor-pair tables are replaced by the decisive pair equation.
- Bounded maximum options satisfy the visible parity requirement.
- Claim and comparison options contain computed values rather than dead “cannot determine” choices.
- Bounded inverse classification asks for the exact number of ordered pairs.
- Guided-learning families are excluded from normal mocks.
- Advanced-practice and repetitive families have explicit per-mock, per-session and spacing limits.

### Mathematical rendering

All prime-power expressions are emitted as one delimited LaTeX expression, for example:

```text
\(2^{3} \times 3^{2}\)
```

The audit rejects:

- unbraced power markup such as `2^3` in learner-facing text;
- left-superscript patterns such as `²3`;
- unbalanced inline-math delimiters;
- huge raw divisor-product integers.

## Approved lifecycle

```text
allocationStatus:             PRODUCT_OWNER_APPROVED_INACTIVE_ENGLISH_IMPLEMENTATION
maturity:                     ENGLISH_IMPLEMENTATION_FROZEN
reviewStatus:                 PRODUCT_OWNER_COMPLETION_AUTHORISED
active:                       false
questionStudioDiscoverable:   false
questionBankWritable:         false
testEligible:                 false
publiclyPublishable:          false
```

Permanent QL identities, authority mappings, solve-mode identities and the approved English implementation are frozen.

Approval does **not** activate Question Studio, Question Bank, tests or public delivery. Localisation refresh, multilingual review and later delivery activation remain separate controlled phases.

## Approval evidence

The approved head passed:

- 2,880-question permanent runtime validation;
- deterministic replay and independent verifier checks;
- semantic option checks;
- English remediation audit;
- final exam-readiness audit;
- final editorial-freeze audit;
- 290-question expanded review export with distinct stems, complete question records and explanations.
