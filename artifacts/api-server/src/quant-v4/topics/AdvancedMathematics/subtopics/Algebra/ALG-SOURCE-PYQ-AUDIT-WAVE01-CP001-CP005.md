# Algebra Source / PYQ Audit — Wave 1 (ALG-CP-001 through ALG-CP-005)

**Chapter:** Algebra  
**Runtime package:** `ALG-001`  
**Audit wave:** 01  
**Scope:** CP-001 Expressions → CP-005 Remainder / Factor Theorem  
**Status:** SOURCE-AUDIT IN PROGRESS — NOT A FREEZE AUTHORITY  
**Discovery candidates reviewed:** 31  

---

## 1. Authority and safety

This audit sits **after executable discovery** and **before permanent QL allocation**.

The current executable-discovery count is not source authority. A candidate survives only when its learner-facing task contract is supported by exam evidence and remains semantically distinct after merge/split/ownership review.

Allowed dispositions in this file:

- `KEEP_SOURCE_BACKED` — evidence supports the task contract strongly enough to keep it in the audited pool.
- `KEEP_PROVISIONAL` — evidence supports the family, but exact topology still needs broader saturation.
- `MERGE_VARIANT` — useful generation state, but not a separate permanent QL contract.
- `MOVE` — valid mathematics, but learner-facing ownership belongs to another checkpoint.
- `HOLD` — no promotion until stronger/direct source evidence or ownership resolution exists.
- `GAP_ADD` — source evidence exposes a task contract not represented cleanly by current discovery candidates.

**No disposition in Wave 1 allocates a permanent QL ID.**

---

## 2. Evidence policy

### 2.1 Source preference used in this wave

1. SSC questions carrying explicit official-paper / previous-paper provenance on Testbook.
2. SSC CGL shift-wise previous-year question collections on ExamSIDE.
3. Previous-question collections on Cracku / ZestExam as secondary corroboration.
4. Non-SSC questions only as algorithmic corroboration; they do not by themselves establish SSC ownership.

The repository's existing SSC CGL extraction report is also retained as corpus-level evidence: it classified **35 extracted questions as Algebra**, but that export does not provide a usable Algebra question fixture ledger. It therefore proves material presence, not solve-mode saturation.

### 2.2 External evidence ledger

| Source ID | Provenance | Evidence used in this wave |
|---|---|---|
| `ALG-W1-S01` | Testbook SSC CGL Algebra collection | Coefficient extraction; scaled reciprocal transform; broader Algebra task mix |
| `ALG-W1-S02` | SSC CGL 2024 Tier-I, 12 Sep 2024 Shift 1 | Direct one-variable substitution / expression evaluation (`t = 2/5`) |
| `ALG-W1-S03` | SSC CGL 2023 Tier-I, 14 Jul 2023 Shift 4 | Two-variable expression evaluation / cubic identity |
| `ALG-W1-S04` | SSC CGL 2022 Tier-I, 07 Dec 2022 Shift 4 | `x + 1/x` → reciprocal cube |
| `ALG-W1-S05` | SSC CGL 2019, 13 Jun 2019 Shift 3 | `x + 1/x` → reciprocal cube |
| `ALG-W1-S06` | SSC CGL 2024 Tier-I, 19 Sep 2024 Shift 1 | `a + 1/a` → sixth reciprocal power |
| `ALG-W1-S07` | SSC CGL 2020 Tier-I, 18 Aug 2021 Shift 3 | minus-form reciprocal relation leading to cubic transformed value |
| `ALG-W1-S08` | ExamSIDE SSC CGL Tier-I 26–27 Jul 2023 Algebra identity set | expansion/simplification, reciprocal powers, three-variable symmetric identities |
| `ALG-W1-S09` | SSC CGL 2023 Tier-I, 14 Jul 2023 Shift 2 | `a+b+c=0` → `a³+b³+c³=3abc` |
| `ALG-W1-S10` | SSC CHSL 2020, 15 Oct 2020 Shift 1 | direct non-monic quadratic factorisation `2x²-5x-12` |
| `ALG-W1-S11` | SSC MTS 2023, 01 Sep 2023 Shift 2 | factor condition with unknown parameter k |
| `ALG-W1-S12` | SSC CHSL 2021, 27 May 2022 Shift 2 | remainder under general linear divisor `3x+2` |
| `ALG-W1-S13` | SSC CGL 2020 Tier-I, 20 Aug 2021 Shift 1 | scaled reciprocal transform `2a + 3/a` |
| `ALG-W1-S14` | SSC CPO 2024 Paper-I, 28 Jun 2024 Shift 3 | two polynomials leaving same remainder; solve parameter then remainder |
| `ALG-W1-S15` | SSC CGL Tier-2 Quant, 12 Jan 2017 | cyclic reciprocal relations among a,b,c |

Reference URLs:

- S01: https://testbook.com/questions/ssc-cgl-algebra-questions--637ef17e14906c7733f9a292
- S02: https://testbook.com/question-answer/textlet-t-frac25-text-then-the-val--6710cd6d432a14de6221703a
- S03: https://testbook.com/question-answer/if-a-17b-13-then-find-the-value-of-the-expre--64cb71156d24b6517260158b
- S04: https://testbook.com/question-answer/if-xfrac1x7-find-the-value-of-x3f--63a682fbbb96b2b6eecef29c
- S05: https://testbook.com/question-answer/ta/if-x-1x-5-then-x3-1x3-is-equal-to--5dc66b5af60d5d2c277b18e6
- S06: https://testbook.com/question-answer/if-a-frac1a-7sqrt3-then-what-is-th--6716029dce00cc70b9c0fbaf
- S07: https://testbook.com/question-answer/ifx-frac1x-sqrt77-then-one-o--61cad4330221a23eb171b5e0
- S08: https://questions.examside.com/past-years/ssc/ssc-cgl-tier-i/quantitative-aptitude/basic-algebraic-identities-of-school-algebra-and-elementary-surds
- S09: https://testbook.com/question-answer/if-a-b-c-0-then-what-is-the-value-of-a3-b--64cb665027ee06776253d855
- S10: https://testbook.com/question-answer/the-factors-of-the-expression-2x2-5x-12-are--5fbe749bcd9fcdad0da58491
- S11: https://testbook.com/question-answer/if-x-2-is-a-factor-of-2x2-12kx-25k--650b3a7e716e36ab84e37cc9
- S12: https://testbook.com/question-answer/when-fx-15x3-14x2-4x-10-is-d--62c864c81a1d8f8f13a08f60
- S13: https://testbook.com/question-answer/if-left2afrac3a-1right11-what-is-t--61c959e7bc175f6337df9cf1
- S14: https://testbook.com/question-answer/if-the-polynomial-2x3-ax2-3x-5-and-x3-x--66a4086b4f2d15fa9955e2a4
- S15: https://testbook.com/question-answer/if-a-1b-1-and-b-1c-1-then-the-value-of--5e9db859f60d5d2e9f7d852d

---

## 3. Semantic merge rules established in Wave 1

The source review confirms several distinctions that are useful for generation but too weak for permanent QL boundaries.

### 3.1 Plus/minus reciprocal givens

`x + 1/x` and `x - 1/x` are important **input states**, but a sign change alone does not automatically create a separate permanent QL when target topology and reasoning contract are otherwise identical.

Recommended permanent-contract direction:

- one square-level reciprocal transform contract with `inputSign = plus | minus`,
- one cube-level reciprocal transform contract with `inputSign = plus | minus`,
- higher-power recurrence remains separately auditable because the reasoning depth changes materially.

### 3.2 Linear divisor representation in Remainder Theorem

Divisors `x-k`, `x+k`, and `ax+b` all reduce to evaluation at the unique zero of the divisor. The SSC CHSL `3x+2` PYQ explicitly confirms the non-monic representation.

Recommended permanent-contract direction:

- one `findRemainderUnderLinearDivisor` task contract,
- divisor representation (`x-k`, `x+k`, `ax+b`) becomes generation topology rather than separate QL identity.

### 3.3 Factor condition is remainder-zero

A stated factor is the remainder-zero edge state of the same theorem. `find parameter from factor condition`, `find parameter from stated remainder`, and `verify factor` should not become three permanent QLs solely because the remainder is zero/nonzero or the answer is presented as a Boolean.

Recommended permanent-contract direction:

- one parameter-from-remainder-condition contract with remainder value as state,
- Boolean factor verification as an evidence/presentation variant unless later source saturation proves an independent exam contract.

### 3.4 Monic versus non-monic quadratic factorisation

The answer contract is still “factorise a quadratic”. Monic/non-monic coefficient topology changes difficulty and factor-search mechanics but does not, by itself, justify two learner-facing QLs.

Recommended permanent-contract direction:

- one quadratic-factorisation contract,
- monic/non-monic/perfectly factorable coefficient topology represented in generation metadata.

---

## 4. Candidate-by-candidate audit

## ALG-CP-001 — Expressions and substitution

| Candidate | Solve mode | Wave-1 disposition | Evidence / reason |
|---|---|---|---|
| CAND-001 | `identifyCoefficientOfTerm` | `KEEP_SOURCE_BACKED` | S01 includes direct SSC CGL coefficient extraction from an algebraic expansion. |
| CAND-002 | `combineLikeTerms` | `KEEP_PROVISIONAL` | S08 contains direct “expand and simplify” SSC CGL work, which includes collection of like terms, but pure collection-only topology still needs broader evidence. |
| CAND-003 | `evaluateOneVariableExpression` | `KEEP_SOURCE_BACKED` | S02 is direct substitution into a one-variable expression from SSC CGL 2024. |
| CAND-004 | `evaluateTwoVariableExpression` | `KEEP_SOURCE_BACKED` | S03 gives explicit a,b values and asks for an algebraic expression value. |
| CAND-005 | `findMissingCoefficientFromKnownValue` | `HOLD` | Valid executable family, but direct SSC evidence for this exact “known evaluation → missing coefficient” topology is not yet strong enough. Ownership also overlaps CP-006 equation solving and CP-005 polynomial parameter inference. |
| CAND-006 | `detectUndefinedSubstitution` | `MOVE → CP-008` | Undefinedness is fundamentally an original-domain / denominator restriction contract, already owned by rational-equation infrastructure. It should not remain a CP-001 permanent contract. |

### CP-001 gap exposed by source

`ALG-W1-GAP-001 — expandAndSimplifyAlgebraicExpression`

S08 directly asks candidates to expand bracketed/squared expressions and simplify. Current `combineLikeTerms` does not clearly encode multiplication/identity expansion as part of the task contract. This gap should be prototyped or explicitly merged only after inspecting the current generator coverage.

---

## ALG-CP-002 — Two-variable identities and reciprocal transforms

| Candidate | Solve mode | Wave-1 disposition | Evidence / reason |
|---|---|---|---|
| CAND-001 | `findSquareSumFromSumAndProduct` | `KEEP_SOURCE_BACKED` | Repeated SSC identity topology; S08 contains direct sum/pairwise-product → square-sum work. |
| CAND-002 | `findCubeSumFromSumAndProduct` | `KEEP_SOURCE_BACKED` | SSC identity sets contain sum/product → cube-based targets; retain pending wider saturation. |
| CAND-003 | `findReciprocalSquareFromPlus` | `KEEP_SOURCE_BACKED` (merge anchor) | Strong SSC CGL recurrence/identity evidence; source family repeatedly starts from first-order reciprocal relation. |
| CAND-004 | `findReciprocalCubeFromPlus` | `KEEP_SOURCE_BACKED` (merge anchor) | S04 and S05 directly ask `x+1/x` → `x³+1/x³`. |
| CAND-005 | `findReciprocalHigherPowerFromPlus` | `KEEP_SOURCE_BACKED` | S06 directly reaches sixth reciprocal power in SSC CGL 2024. |
| CAND-006 | `findReciprocalSquareFromMinus` | `MERGE_VARIANT → CAND-003` | Minus sign is an input-sign topology; it does not independently change square-level answer contract. |
| CAND-007 | `findReciprocalCubeFromMinus` | `MERGE_VARIANT → CAND-004` | S07 proves minus-input SSC relevance, but the sign form should be a variant of the cube reciprocal contract rather than a separate QL. |
| CAND-008 | `findDifferenceOfSquaresFromSumAndDifference` | `HOLD` | Algebraically valid, but this exact target topology needs stronger direct SSC PYQ evidence before permanent allocation. |

### CP-002 gaps exposed by source

`ALG-W1-GAP-002 — scaledReciprocalTransform`

S13 is an SSC CGL official-paper example of `2a + 3/a` leading to `4a² + 9/a²`. This is not safely represented by an engine that assumes only `x ± 1/x`. The shared recurrence architecture can support it, but the generator contract needs a scale/product-aware topology.

`ALG-W1-GAP-003 — cyclicReciprocalRelation`

S15 uses chained reciprocal relations across three variables. This is source-supported SSC CGL Tier-2 Algebra but crosses the CP-002/CP-003/CP-015 boundary. Add to ownership review; do not assign a CP until the reasoning contract is compared with three-variable symmetric and mixed-synthesis engines.

---

## ALG-CP-003 — Three-variable symmetric identities

| Candidate | Solve mode | Wave-1 disposition | Evidence / reason |
|---|---|---|---|
| CAND-001 | `findPairwiseProductSumFromSumAndSquareSum` | `KEEP_PROVISIONAL` | S08 contains direct SSC questions targeting `ab+bc+ca`, but exact givens vary. Keep in audited pool while target/given topology is saturated. |
| CAND-002 | `findSquareSumFromSumAndPairwiseProduct` | `KEEP_SOURCE_BACKED` | S08 contains the exact SSC CGL topology `(a+b+c), (ab+bc+ca) → a²+b²+c²`. |
| CAND-003 | `findCubeSumWhenTotalSumIsZero` | `KEEP_SOURCE_BACKED` | S09 is direct SSC CGL official-paper evidence for `a+b+c=0 → a³+b³+c³=3abc`. |
| CAND-004 | `findPairwiseProductSumWhenTotalSumIsZero` | `MERGE_VARIANT → CAND-001` | `a+b+c=0` is a special constraint state of the same symmetric square/pairwise-product relation; source saturation must show a genuinely separate contract before splitting. |
| CAND-005 | `findPairwiseDifferenceSquareSum` | `HOLD` | Pairwise-difference-square expressions occur in SSC identity questions, but Wave 1 has not yet found enough direct target evidence for this exact direction. |

---

## ALG-CP-004 — Polynomial factorisation

| Candidate | Solve mode | Wave-1 disposition | Evidence / reason |
|---|---|---|---|
| CAND-001 | `factorCommonIntegerContent` | `MERGE_VARIANT` | Common-content extraction is a factorisation pre-step/topology, not yet evidenced as a distinct permanent exam contract. Keep as generator state. |
| CAND-002 | `factorDifferenceOfSquares` | `KEEP_PROVISIONAL` | Difference-of-squares factorisation is repeatedly used in SSC Algebra identities, but direct standalone SSC target evidence should be expanded before freeze. |
| CAND-003 | `factorPerfectSquareTrinomial` | `KEEP_PROVISIONAL` | Perfect-square recognition is exam-relevant; retain while exact factorisation-target evidence is saturated. |
| CAND-004 | `factorMonicQuadratic` | `KEEP_SOURCE_BACKED` (merge anchor) | Direct factorisation tasks are source-supported; permanent contract should be generic quadratic factorisation. |
| CAND-005 | `factorNonMonicQuadratic` | `MERGE_VARIANT → CAND-004` | S10 directly supports non-monic quadratic factorisation in SSC CHSL, but monic/non-monic is coefficient topology rather than a different answer contract. |

### CP-004 audit note

Do **not** lose difficulty topology when merging CAND-004/005. The future permanent contract should still record at least:

- monic/non-monic,
- integer/rational factors,
- sign pattern,
- repeated/distinct factors,
- middle-term split requirement.

---

## ALG-CP-005 — Remainder and Factor Theorem

| Candidate | Solve mode | Wave-1 disposition | Evidence / reason |
|---|---|---|---|
| CAND-001 | `findRemainderForXMinusK` | `KEEP_SOURCE_BACKED` (merge anchor) | Direct Remainder-Theorem topology is repeatedly source-supported. |
| CAND-002 | `findRemainderForXPlusK` | `MERGE_VARIANT → CAND-001` | Sign of constant in a monic linear divisor is representation state, not separate reasoning. |
| CAND-003 | `findUnknownCoefficientFromFactorCondition` | `KEEP_SOURCE_BACKED` (merge anchor) | S11 gives direct SSC factor-condition → unknown parameter evidence. |
| CAND-004 | `findUnknownCoefficientFromGivenRemainder` | `MERGE_VARIANT → CAND-003` | A factor is remainder 0; numeric remainder is the same parameter-from-remainder constraint family. Keep remainder value as state. |
| CAND-005 | `findRemainderForGeneralLinearDivisor` | `MERGE_VARIANT → CAND-001` | S12 explicitly validates `3x+2` in SSC CHSL; `ax+b` is important representation coverage, but not a separate QL. |
| CAND-006 | `verifyDeclaredLinearFactor` | `MERGE_VARIANT → CAND-003` | Boolean verification is an evidence/presentation variant of checking remainder = 0. |
| CAND-007 | `findTwoCoefficientsFromTwoRemainderConditions` | `KEEP_SOURCE_BACKED` | Multi-condition parameter recovery is materially different because it produces a 2×2 coefficient system; retain as a distinct audited contract. |

### CP-005 gap exposed by source

`ALG-W1-GAP-004 — equalRemaindersAcrossTwoPolynomials`

S14 (SSC CPO 2024) gives two parameterised polynomials that leave the **same unknown remainder** under the same linear divisor. The learner must equate the two theorem evaluations, recover the parameter, then compute the common remainder. This is not cleanly identical to “given numeric remainder → find coefficient”.

Disposition: `GAP_ADD / PROTOTYPE REQUIRED`.

---

## 5. Wave-1 disposition summary

### Clear semantic merges / moves already justified

These changes should survive even if the source corpus expands:

1. CP-001 undefined substitution → **MOVE to CP-008 domain ownership**.
2. CP-002 plus/minus square reciprocal candidates → **one contract with sign state**.
3. CP-002 plus/minus cube reciprocal candidates → **one contract with sign state**.
4. CP-003 zero-sum pairwise-product candidate → **special constraint state of the broader symmetric contract unless contrary evidence appears**.
5. CP-004 common integer content → **factorisation topology, not standalone permanent QL**.
6. CP-004 monic/non-monic quadratic factorisation → **one quadratic-factorisation contract with coefficient topology**.
7. CP-005 `x-k`, `x+k`, `ax+b` remainder → **one linear-divisor remainder contract**.
8. CP-005 factor-condition / numeric-remainder / Boolean factor-check → **one remainder-condition family with target/presentation states**, subject to final target-direction audit.

### Source-supported gaps discovered

- `GAP-001` expand + simplify an algebraic expression.
- `GAP-002` scaled reciprocal transforms such as `pa + q/a`.
- `GAP-003` cyclic reciprocal relations across multiple variables — ownership unresolved.
- `GAP-004` equal remainders across two parameterised polynomials.

These gaps demonstrate why **106 discovery candidates cannot be frozen as the permanent QL inventory**.

---

## 6. Provisional post-merge shape of ALG-001

This is **not** a permanent ID list; it is the current semantic shape after Wave-1 evidence review.

### CP-001 likely contracts

- coefficient extraction,
- simplify/collect algebraic expression,
- evaluate one-variable expression,
- evaluate multi-variable expression,
- missing coefficient from known evaluation — HOLD pending evidence/ownership,
- expansion + simplification — new gap.

### CP-002 likely contracts

- square target from sum/product,
- cube target from sum/product,
- reciprocal square transform with plus/minus input state,
- reciprocal cube transform with plus/minus input state,
- higher reciprocal power / recurrence,
- scaled reciprocal transform — new gap,
- sum/difference → difference of squares — HOLD.

### CP-003 likely contracts

- symmetric sum ↔ pairwise-product/square-sum conversion,
- zero-sum cubic identity,
- pairwise difference-square target — HOLD,
- cyclic reciprocal relation — ownership gap.

### CP-004 likely contracts

- identity-form factorisation (difference of squares),
- perfect-square recognition/factorisation,
- generic quadratic factorisation with monic/non-monic topology,
- common-content extraction as variant/pre-step.

### CP-005 likely contracts

- remainder under any linear divisor,
- parameter from remainder/factor condition,
- two-parameter recovery from two independent remainder/factor conditions,
- equal-remainders across two polynomials — new gap.

---

## 7. Open evidence questions before Wave-1 freeze

The following remain unresolved and therefore block permanent IDs for ALG-001:

1. Is CP-001 `findMissingCoefficientFromKnownValue` directly present in SSC PYQs, or should it move to CP-006 / CP-005 ownership?
2. Does SSC evidence justify a standalone “sum+difference → difference of squares” contract, or is it just an identity variant?
3. Is CP-003 pairwise-difference-square target independently common enough to keep?
4. Should perfect-square factorisation stay distinct from generic quadratic factorisation because the recognition task is materially different?
5. Does CP-005 numeric remainder versus factor remainder=0 ever change the tested reasoning enough to split permanent QLs?
6. Where should cyclic reciprocal relations live after comparing CP-002, CP-003 and CP-015?
7. Are there Banking-specific ALG-001 identity/polynomial families missing from this SSC-heavy Wave 1?

---

## 8. Next audit work

### Wave 1B — finish ALG-001 saturation

- expand the source set beyond the currently mapped SSC examples,
- explicitly test the seven open evidence questions above,
- prototype `GAP-001`, `GAP-002`, and `GAP-004`,
- run ownership review for `GAP-003`,
- produce a candidate→source fixture ledger with exam/date/shift where provenance is available,
- only then publish an `ALG-001 SOURCE-SATURATED CANDIDATE AUTHORITY`.

### Wave 2 — ALG-002 CP-006 through CP-011

Audit linear/system/rational/quadratic/Vieta/Banking-comparison families.

### Wave 3 — ALG-002 CP-012 through CP-015

Audit inequalities/extrema, absolute value, QC/DS and mixed synthesis.

---

## 9. Current decision

**ALG-001 executable discovery:** COMPLETE.  
**ALG-001 source/PYQ Wave 1:** COMPLETE AS A FIRST PASS, NOT SATURATED.  
**Permanent ALG-001 QLs:** 0.  
**Permanent Algebra QLs overall:** 0.  
**Question Studio / Question Bank / release:** LOCKED.
