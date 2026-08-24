# SRI Source Saturation Audit — R1

**Chapter:** Surds & Indices  
**Packages:** SRI-001 / SRI-002  
**State:** SOURCE_SATURATION_R1_CLOSED_READY_FOR_ENGLISH_REVIEW  
**Permanent QLs:** 0  
**Frozen solve modes:** 0

## 1. R1 closure result

The executable discovery corpus entering saturation contained **91 provisional families** across all 12 canonical checkpoints. R1 added two source-driven prototypes:

- `C008-I` — condition forced by `sqrt(x)+sqrt(y)=sqrt(x+y)` over the non-negative domain;
- `C011-J` — exact comparison of positive finite surd sums by squaring.

This produced **93 executable prototypes**. Merge/split compression partitions those 93 prototypes into **59 retained learner contracts** with every prototype assigned exactly once.

Source-gate resolution leaves:

- **58 source-supported retained contracts** eligible to proceed to English review;
- **1 unresolved hold**: `SRI-RG-039 / C008-I`;
- `SRI-RG-047 / C010-F` retains discovery-time `SOURCE_GATED` provenance but is directly SSC previous-paper supported and is therefore resolved `SOURCE_BACKED_KEEP` for the next stage.

## 2. Executable saturation gate

The chapter-wide R1 audit generates:

```text
93 provisional families × 24 deterministic seeds = 2,232 question packages
```

It verifies:

- deterministic regeneration;
- immutable public seed identity;
- exact solver/verifier agreement;
- domain validity;
- exactly four canonical-unique options;
- exactly one correct option;
- misconception-backed distractors;
- stem diversity;
- state/object diversity;
- correct-option-position spread;
- answer diversity where the contract is not mathematically invariant;
- explicit invariant-answer proof for fixed-semantic contracts;
- absence of exact cross-candidate stem collisions;
- package/checkpoint count closure;
- lifecycle release locks.

Fixed-semantic contracts are audited as fixed rather than being forced to manufacture incorrect answer variation. Current invariant-answer families include the zero-exponent law, zero-base undefined cases, negative-base/even-root non-real classification, the held exceptional root-sum condition, and exact radical/index representation equality.

## 3. Current exam-source gap findings and dispositions

### A. Finite surd-sum comparison — ADD / EXPAND / RETAIN

Current SSC-oriented evidence compares expressions such as `√6+√2` and `√5+√3` by squaring both positive sums and comparing the cross terms. The learner burden is materially different from comparing single surds.

**Disposition:** retain `C011-J` under SRI-CP-011.  
**R1 hardening:** the generator now exercises both first-greater and second-greater orientations while preserving equal rational square parts.

### B. Condition under which `√x+√y=√(x+y)` holds — ADD / UNRESOLVED HOLD

Squaring gives `x+y+2√xy=x+y`, hence `xy=0` over the non-negative domain. The topology is mathematically valid and directly targets the false-distribution misconception.

**Disposition:** keep `C008-I` executable as discovery evidence but exclude `SRI-RG-039` from the English freeze-ready set. R1 did not locate comparable direct SSC/Bank/Railway previous-paper provenance for the condition-target form.

### C. Simultaneous `√x+√y` and `√x−√y` equations — MOVE

**Owner:** Algebra.  
**Reason:** simultaneous-equation elimination dominates; the radicals are only a substitution wrapper.

### D. Deep nested perfect-root evaluation chains — MOVE

**Owner:** Simplification & Approximation when procedural operation sequencing dominates.  
**Boundary:** true denesting `√(A±2√B)` remains SRI-CP-010.

### E. Terminating-decimal rational bases with fractional indices — OBJECT-POOL EXPANSION

Patterns such as `(0.008)^(1/3)` are generation surfaces inside the existing exact rational-base fractional-index contract, not new QLs.

### F. Cubic / biquadratic / higher-index radical classification — OBJECT-POOL EXPANSION

Higher root indices now broaden the C007-D object pool without changing its learner contract.

### G. Reciprocal/conjugate transformed targets — RETAIN WITH ALGEBRA BOUNDARY

Short conjugate/surd transformations remain SRI-owned when the surd step is dominant. Long generic `x±1/x` recurrence chains remain Algebra-owned.

### H. Complex rationalisation with coefficient recovery — COVERED

Covered by CP009-F/G/H; new coefficient geometries expand the object pool rather than creating QLs unless answer topology changes materially.

### I. Negative fractional powers on rational bases — COVERED

Covered by CP002-E/G with decimal and rational presentation variants inside the same retained contract.

### J. Denesting `√(A±2√B)` — COVERED

Covered by CP010-A..E before compression and retained through the CP010 compressed authorities.

### K. Mixed radical/index expressions — COVERED

Covered by CP012 retained contracts. Long BODMAS chains remain Simplification-owned.

### L. Repeating infinite radical fixed point — SOURCE GATE RESOLVED

`C010-F` entered discovery as `SOURCE_GATED`, but R1 source review found direct SSC previous-paper provenance for repeating plus/minus radical fixed-point forms. `source-gate-resolution-r1.ts` therefore records `SOURCE_BACKED_KEEP`. Historical discovery provenance remains unchanged.

## 4. Representation/object-pool expansions that do NOT create QLs

R1 confirmed that these are generation dimensions rather than permanent learner-contract identities:

- exact terminating-decimal bases in fractional-index evaluation;
- fourth- and fifth-root classification alongside square/cube roots;
- sign and reciprocal surface variation inside parameterised exponent contracts;
- orientation variation for finite-surd comparison;
- coefficient and equivalent-representation variants where the governing inference is unchanged.

## 5. Cross-chapter ownership closure

### Algebra owns

- simultaneous radical-variable systems where solving the system is the dominant burden;
- generic reciprocal polynomial/identity recurrences where the radical is incidental;
- general equation families without a surd/index-specific domain or exact-form burden.

### Simplification owns

- long mixed arithmetic or nested-root chains where operation sequencing/evaluation dominates.

### Number System owns

- perfect-power structure as a number-theory task;
- general rational/irrational number classification when radical notation and surd semantics are not the learner burden.

### SRI retains

- radical-as-surd classification when the radical/surd distinction itself is tested;
- symbolic index laws and rational-exponent domain reasoning;
- rationalisation;
- denesting;
- exact surd comparison and bounds;
- radical equations where original-domain/extraneous-root reasoning is central;
- mixed radical-index synthesis.

## 6. Compression result

Authority: `retained-contracts-r1.ts`.

```text
Executable prototypes:          93
Retained contract groups:       59
Source-supported after R1:      58
Unresolved holds:                1
Permanent QLs:                   0
Frozen solve modes:              0
```

Important intentional merges include:

- same-base multiplication/division → one operator-parameterised exponent-combination contract;
- same-exponent different-base variants across CP001/CP003 → one CP001-owned contract;
- positive/negative/fractional perfect-power cases → signed fractional-index contracts;
- `a^(x+k)`, `a^(x-k)`, `a^(mx)` → one affine exponent-transform contract;
- direct/linear same-base exponent equations → one linear exponent-equation contract;
- exponential sum/difference factoring → one signed operator contract;
- square/cube/general nth-root extraction → one supported nth-root simplification contract;
- already-like vs simplify-then-combine surds → one normalization-then-combination contract;
- surd multiplication/division → one exact product/quotient contract;
- square vs general finite-surd-binomial multiplication → one finite-sum multiplication contract;
- monomial square/cube radical rationalisation → one supported monomial-denominator contract;
- several quadratic-surd denominator shapes → one conjugate-rationalisation contract;
- plus/minus denesting → one signed denesting contract;
- single/coefficient-bearing square-surd comparison → one same-index comparison contract;
- root/index conversion in both directions → one bidirectional mixed-representation contract.

Two cross-CP ownership closures are explicit and executable:

- `C003-D` → CP001 same-exponent contract;
- `C009-I` → CP011 transformed reciprocal/conjugate value contract.

## 7. R1 CI closure

On the final R1 head:

- Phase 0 foundation — PASS;
- Phase 1 power foundations — PASS;
- Phase 2 power relations — PASS;
- Phase 3 surd foundations — PASS;
- Phase 4 advanced surds — PASS;
- Source Saturation R1 2,232-package audit — PASS;
- Merge/split 93→59 partition audit — PASS;
- Source-gate resolution audit — PASS.

## 8. Next authorised stage

R1 does **not** freeze the chapter and does **not** allocate permanent QLs.

The next stage is an **adversarial English review over the 58 source-supported retained contracts**. `SRI-RG-039 / C008-I` must appear only in a HOLD appendix and must not be counted as freeze-ready.

The English review must inspect actual generated questions, explanations, options and contract boundaries. It may still MERGE, SPLIT, MOVE, REPAIR or HOLD a retained contract if learner-facing review exposes a defect.

Only after English review closure and explicit approval may package-local permanent QL IDs be proposed.
