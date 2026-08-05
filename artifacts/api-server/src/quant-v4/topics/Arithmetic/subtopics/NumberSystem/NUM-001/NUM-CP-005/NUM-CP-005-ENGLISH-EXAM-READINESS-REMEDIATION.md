# NUM-CP-005 — English Exam-Readiness Remediation

**Checkpoint:** `NUM-CP-005 — Divisors and Divisor Functions`  
**Permanent QL range:** `NUM-QL-046..NUM-QL-069`  
**Review pack:** 72 English questions, 3 seeds per QL  
**Trigger:** critical exam-readiness audit after the earlier technical English freeze  
**Lifecycle after this change:** editorial review; all delivery gates remain closed

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

- Semantic option normalisation now rejects equivalent empty-set forms.
- `NUM-QL-066` no-solution cases receive distinct misconception sets.
- `NUM-QL-069` uses four mutually exclusive data-sufficiency categories.
- Every wrong option carries a question-specific misconception ID and analysis.

### Distractors

The permanent English layer now constructs distractors from governed wrong methods, including:

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

Every QL now owns a calculation-complete explanation mode. The learner sees:

- the exact exponent-choice product;
- total-minus-odd calculations for even divisors;
- geometric-sum expansion for divisor sums;
- factor-pair translation for inverse exponent problems;
- candidate sets for data sufficiency;
- direct division for divisor-pair completion;
- explicit verification of bounds, parity and uniqueness.

Generic warning blocks were replaced with three traps tied to the displayed question.

### Exam realism

- Divisor products are asked and answered symbolically rather than as huge raw integers.
- Prime-power reconstruction remains in exponential form when expansion adds no conceptual value.
- Long 32-row divisor-pair tables are replaced by the decisive pair equation.
- Bounded maximum options all satisfy the visible parity requirement.
- Claim and comparison options contain computed values rather than dead “cannot determine” choices.
- Bounded inverse classification asks for the exact number of ordered pairs, avoiding an impossible “infinitely many” option.

### Mathematical rendering

All prime-power expressions are emitted as one delimited LaTeX expression, for example:

```text
\(2^{3} \times 3^{2}\)
```

This prevents the exponent of the second base from being emitted as a detached or left-positioned superscript.

The audit rejects:

- unbraced power markup such as `2^3` in learner-facing text;
- left-superscript patterns such as `²3`;
- unbalanced inline-math delimiters;
- huge raw divisor-product integers.

## Lifecycle

```text
allocationStatus:             EDITORIAL_REMEDIATION_AWAITING_PRODUCT_OWNER_REVIEW
maturity:                     ENGLISH_EDITORIAL_REVIEW
reviewStatus:                 CRITICAL_REVIEW_REMEDIATED_AWAITING_APPROVAL
active:                       false
questionStudioDiscoverable:   false
questionBankWritable:         false
testEligible:                 false
publiclyPublishable:          false
```

Permanent QL identities, authority mappings and solve-mode identities remain frozen. This remediation does not activate Question Studio or any downstream delivery surface.

## Approval boundary

Passing executable proofs establishes technical and editorial remediation readiness. It does not grant final product-owner approval. A fresh 72-question English review artifact must be reviewed before any English re-freeze or localisation refresh.
