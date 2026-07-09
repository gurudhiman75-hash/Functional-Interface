# RAP Chapter — Exam-Point-of-View Assessment

> **Scope:** Quant V4 → Arithmetic → RatioAndProportion → RAP-001 (foundational, frozen, multilingual) + RAP-002 (compound/chain, English MVP).
> **Purpose:** Detailed exam-realism, content-quality, and pedagogy assessment for SSC (CGL/CHSL/CPO/MTS), Banking (IBPS/SBI PO & Clerk), and Punjab State (PPSC PCS, Patwari, PSSSB, Police).
> **Status:** Assessment only. No files modified.
> **Date:** 2026-07-09

---

## 1. Executive Summary

The RAP chapter spans **three packages**: RAP-001 (foundational mechanics, frozen, multilingual), RAP-002 (compound/chain mechanics, English MVP), and RAP-003 (real-world applications, English MVP, QA-clean). The solver engines in all three are correct, deterministic, and internally consistent. Coverage across the family is **mechanically complete** — all major SSC/Banking/Punjab exam families now have a home. However, from an exam point of view, the family currently **would not fully pass an experienced SSC/Banking teacher's eye** because of editorial defects concentrated in RAP-001 and RAP-002:

1. **Semantic entity mismatch** — entities bleed across incompatible contexts ("workers in sales", "speeds of profit", "In a boys, the ratio of girls..."). RAP-003 solved this with CP-specific pools; RAP-001/002 have not.
2. **Editorial quality uneven across packages** — RAP-003 is QA-clean (500-sample residual QA, all counters at 0); RAP-001 has documented entity/grammar issues; RAP-002 has 4 known blockers.
3. **Mechanical question repetition in RAP-001** — 169 QLs but most are 4–20 near-identical phrasing variants of the same template, inflating coverage without adding exam value.

Verdict: **RAP-003 is the editorial gold-standard for the family (QA-clean, ready for manual review). RAP-001 is mathematically freeze-ready but editorially needs hardening. RAP-002 is an English MVP with known blockers. Family coverage is complete; remaining work is quality, not coverage.**

### Scorecard

| Dimension | RAP-001 | RAP-002 | RAP-003 | Target (SSC guidebook) |
|---|---|---|---|---|
| Solver correctness | 95 | 95 | 95 | 100 |
| Exam realism (stem wording) | 65 | 60 | 85 | 90 |
| Context realism (entity fit) | 60 | 55 | 85 | 90 |
| Explanation pedagogy | 75 | 70 | 80 | 90 |
| Difficulty calibration | 90 | 80 | 85 | 95 |
| Coverage breadth (exam families) | 55 | 50 | 90 | 85 |
| Duplication control | 70 | 75 | 90 | 90 |
| Grammar / agreement | 60 | 55 | 90 | 100 |
| Multilingual parity | 90 | 0 (en-only) | 0 (en-only) | 95 |
| Residual QA cleanliness | n/a | n/a | ✅ all-zero | ✅ |

---

## 2. Current Coverage Map

### 2.1 RAP-001 (6 CPs, 169 QLs, frozen, en/hi/pa)

| CP | Name | Task kinds | Exam value |
|---|---|---|---|
| CP-001 | Multi-Entity Linkage & Scaling | simpleLinkage, ratioNormalization, ratioTreeLinkage, scalingByComponent, decimalNormalization, fractionRatio | Foundational mechanic — present in exams but usually as a 1-line sub-step, not a standalone question. |
| CP-002 | Partitioned Sums & Distribution | basicPartition, shareDifference, reversePartition, salaryDistribution | **High exam value** — partition + reverse partition are core SSC. |
| CP-003 | Two-State Relational Transformation | twoStateAddition, twoStateSubtraction, twoStateTransfer, multiStageTransformation | **Very high exam value** — the "before/after ratio" family is a top-3 SSC archetype. |
| CP-004 | Mathematical Proportion & Variance | meanProportional, thirdProportional, fourthProportional, directVariation, inverseVariation | Medium — proportionals appear in SSC Tier-1; direct/inverse variation is more textbook than exam. |
| CP-005 | Generalized Weighted Mapping | coinCounting, multiDenominationMapping, weightedMapping (marks/weights) | **High exam value** — coin/denomination is a classic SSC + Punjab Patwari trophy. |
| CP-006 | Mixture Basis & Binary/Ternary Addition | mixtureAddition, ternaryMixture | **High exam value** — mixture ratio is core Banking + SSC. |

### 2.2 RAP-002 (6 CPs, 42 QLs, English MVP)

| CP | Name | Task kinds | Exam value |
|---|---|---|---|
| CP-007 | Direct Chain Ratios | chainAlignment, extendedChainAlignment, missingChainRatio | Medium — chain alignment is a mechanic; standalone chains are rare in real exams (usually embedded). |
| CP-008 | Reverse Chain Proportions | reverseMiddleFinding, reverseEndpointFinding, constrainedReverseChain | Medium — reverse recovery appears but is usually worded as a real scenario, not "A:B:C chain". |
| CP-009 | Multi-Stage Ratio Transformations | successiveRatioChange, transferTracking, reconstructOriginalRatio | **High exam value** — overlaps RAP-001 CP-003; this is the real SSC transformation family. |
| CP-010 | Conditional Partition With Ratios | nestedPartition, conditionalDistribution, weightedNestedPartition | **High exam value** — nested partition is a Banking DI staple. |
| CP-011 | Inverse Proportion Chains | inverseChainWork, inverseChainSpeed, combinedInverseChain | High — work/speed inverse is exam-realistic. |
| CP-012 | Ratio Comparison & Ordering | chainOrdering, chainInequality, chainEquivalence | Medium — ordering is reasoning-flavored; appears in SSC but less frequently. |

### 2.3 RAP-003 (10 CPs, 45 task kinds, English MVP, QA-clean)

| CP | Name | Task kinds | Exam value |
|---|---|---|---|
| CP-013 | Weighted contribution ratios (Partnership) | partnershipProfitShare, partnershipJoiningPartnerProfit, partnershipMidPeriodChange | **Very high** — SSC Mains, Banking PO. |
| CP-014 | Time-shift ratio with invariant difference (Age-Ratio) | agePresentFromFutureRatio, agePresentFromPastRatio, ageYearsToReachRatio, ageFromDifferenceAndRatio, ageFromSumAndRatio, +3 more | **Very high** — SSC CGL Tier-2, Punjab PCS. |
| CP-015 | Two-ratio reconciliation (Income-Expenditure-Savings) | incomeExpenditureSavingsRatio, incomeExpenditureEqualSavings, incomeFromSavingsRatio, expenditureFromSavingsRatio | **High** — SSC CGL. |
| CP-016 | Weighted average / alligation (Alloy Blend) | alloyMixingRatioFromTarget, alloyTargetComponentFromMix, alloyThreeSourceEqualMix | **High** — Banking PO. |
| CP-017 | Repeated proportional replacement | replacementFinalRatio, replacementFinalQuantity, replacementIterationsFromFinalRatio | **High** — Banking trophy. |
| CP-018 | Value-count weighted systems (Denomination) | denominationTotalValue, denominationCountsFromValue, denominationTargetCount, denominationSwapValue | **High** — SSC, Punjab Patwari (incl. count-swap). |
| CP-019 | Inverse rate-product applications (SDT) | sdtTimeRatioFromSpeedDistance, sdtDistanceRatioFromSpeedTime, sdtSpeedRatioFromDistanceTime, sdtRaceLead, sdtOvertakeTime | **High** — SSC, Banking (incl. race/overtake). |
| CP-020 | Cross-tab ratio grid (Population/Literacy) | populationCrossTabCellCount, populationTotalLiterate, populationLiteracyPercent, populationCellRatio, populationTotalIlliterate | **High** — SSC, Punjab State. |
| CP-021 | Vote/share distribution chains (Election) | electionWinnerVotes, electionWinningMargin, electionTotalVotersFromMargin, electionLoserVotes, electionInvalidVotes | **High** — SSC, Punjab PCS. |
| CP-022 | Power-ratio applications (Geometric) | geometricAreaRatioFromSide, geometricVolumeRatioFromSide, geometricSideRatioFromArea, geometricSurfaceAreaRatioFromVolume, geometricAreaRatioFromRadius | **Medium-high** — SSC Tier-2. |

RAP-003 is the **applications chapter** that completes the family's exam coverage. It is QA-clean (500-sample residual QA, all 21 blocker counters at 0) and ready for English manual review.

---

## 3. Critical Issues (Exam Point of View)

### 3.1 ISSUE-1: Semantic entity mismatch (BLOCKER)

This is the single biggest exam-realism defect and it affects **both** packages.

**RAP-001 (documented in realism-audit.md):**
- *"In a boys, the ratio of girls to students is 8:1."* — `groupName` resolves to a person-type entity ("boys") instead of a container ("school"/"class").
- *"A sum of Rs. 1650 is divided among students, boys, and girls..."* — three logically overlapping groups treated as mutually exclusive. A human author would use men/women/children or A/B/C.
- *"What is boys's share"* — possessive of a plural-ending-in-s entity is wrong (`boys's` instead of `boys'`).

Root cause: `variable-ranges.library.json` marks `personA`, `groupName`, `contextName` all as `entity-placeholder` and the parameter generator picks from a single global entity pool with no role constraint. A "container" slot can receive a "person" entity.

**RAP-002 (documented in readiness report + parameter-generator.ts):**
- `entitySet(seed)` picks one global set (`school`, `workplace`, `business`, `generic`) and uses it for **every** CP/task kind.
- `business` set = `["sales", "expenses", "profit", "investment"]` gets applied to inverse-work tasks → "The number of workers in sales and expenses are in the ratio..." and "The speeds of profit and investment are in the ratio...".
- `school` set applied to partition → "divide between boys, girls, teachers, staff" which is fine for partition but nonsensical for speed/time tasks.

**Exam impact:** These phrases are instant giveaways that the question is machine-generated. An SSC guidebook editor would reject them. They also confuse students because the scenario is incoherent.

**Required fix:** CP/task-specific scenario pools (already specified in the RAP-002 hardening task). Work/inverse → teams/workers/machines; speed/time → vehicles/trains/runners; partition → people/partners/funds; comparison → neutral A/B/C/D; business labels only in partition/finance contexts.

### 3.2 ISSUE-2: Subject–verb agreement (BLOCKER)

**RAP-001:** `shareDifference` template: *"How much more money does {personA} get than {personC}?"* with `personA = "girls"` renders → *"How much more money does girls get than teachers?"* (should be "do girls get"). The `basicPartition` with `targetPerson = "girls"` → *"Find girls' share"* is OK, but *"Find girls share"* (missing apostrophe) appears in some render paths.

**RAP-002:** RAP-QL-601: *"The number of workers in {personA} and {personB} **are** in the ratio..."* — "the number of ... is" (singular subject). This is a direct grammar error that would be flagged in any exam paper.

**Exam impact:** Grammar errors in stems undermine trust and would not appear in a published question bank.

**Required fix:** 
- RAP-002 RAP-QL-601: `are` → `is`.
- Add grammar audit rules for: `number of .* are`, `ratio of .* are`, `total number of .* are`, `workers in sales/expenses`, `speeds of profit/investment`, `number of workers in profit/investment`.
- Prefer neutral templates: "the ratio of ...", "the number of ...", "the value of ...", "the share of ...", "the time taken by ...".

### 3.3 ISSUE-3: Chain comparison tie handling (BLOCKER)

**RAP-002 `chainInequality` solver:**
```ts
const result = values[leftIndex]! >= values[rightIndex]! ? labels[leftIndex]! : labels[rightIndex]!;
```
Uses `>=`, so when the two compared values are **equal**, it returns the left side — but the question asks "which is greater". There is no valid answer when values are equal.

The generator (`baseComparisonVariables`) does not prevent equality: `baseChainVariables` picks ratio terms independently, and after alignment the endpoint values can coincide.

**Exam impact:** A question that asks "which is greater: A or C?" where A = C has no correct answer among options. This is a correctness defect, not just a style issue.

**Required fix:** Prevent ties in the generator for `chainInequality` and `chainOrdering` when wording asks greatest/greater (preferred), OR support an "equal" answer explicitly. Add tests proving no equal compared values.

### 3.4 ISSUE-4: Equivalence answer diversity (BLOCKER)

**RAP-002 `chainEquivalence`:** RAP-QL-705 and RAP-QL-706 currently generate only "Equivalent" answers.

- RAP-QL-706 (`baseComparisonVariables`): always sets `equivalentA = ratioA * multiplier`, `equivalentB = ratioB * multiplier` — by construction this is **always** equivalent. There is no path to "Not equivalent".
- RAP-QL-705: `endpointA`/`endpointC` come from `simplifyRatio([aligned[0], aligned[2]])` — also always equivalent by construction.

**Exam impact:** Students see only one answer type; the LOGIC answer distribution is degenerate. A real exam always mixes "equivalent" and "not equivalent" cases.

**Required fix:** Add a negative-case generator path (e.g., perturb `equivalentA` by ±1, or use a non-matching endpoint ratio). Add fixed solver tests for both "Equivalent" and "Not equivalent".

---

## 4. Coverage Gaps (Exam Families Missing)

Both RAP-001 and RAP-002 cover ratio **mechanics**. The real-world **application families** that dominate actual SSC/Banking/Punjab papers were a coverage gap in the mechanics packages — but that gap is **already filled by RAP-003** (Advanced Ratio & Proportion Applications), which is fully implemented, English-only Question Studio wired, and QA-clean. The table below maps each application family to its RAP-003 CP:

| Exam family | Frequency | RAP-003 CP | Status |
|---|---|---|---|
| **Partnership (investment × time → profit)** | Very high (SSC Mains, Banking PO) | RAP-CP-013 (`partnershipProfitShare`, `partnershipJoiningPartnerProfit`, `partnershipMidPeriodChange`) | ✅ Implemented |
| **Age-ratio temporal shift** | Very high (SSC CGL Tier-2, Punjab PCS) | RAP-CP-014 (`agePresentFromFutureRatio`, `agePresentFromPastRatio`, `ageYearsToReachRatio`, `ageFromDifferenceAndRatio`, `ageFromSumAndRatio`, + 3 more) | ✅ Implemented |
| **Income-expenditure-savings (two ratio systems)** | High (SSC CGL) | RAP-CP-015 (`incomeExpenditureSavingsRatio`, `incomeExpenditureEqualSavings`, `incomeFromSavingsRatio`, `expenditureFromSavingsRatio`) | ✅ Implemented |
| **Alloy / multi-source mixture blending** | High (Banking PO) | RAP-CP-016 (`alloyMixingRatioFromTarget`, `alloyTargetComponentFromMix`, `alloyThreeSourceEqualMix`) | ✅ Implemented |
| **Repeated replacement cycles** | High (Banking trophy) | RAP-CP-017 (`replacementFinalRatio`, `replacementFinalQuantity`, `replacementIterationsFromFinalRatio`) | ✅ Implemented |
| **Denomination value systems (3-4)** | High (SSC, Punjab Patwari) | RAP-CP-018 (`denominationTotalValue`, `denominationCountsFromValue`, `denominationTargetCount`, `denominationSwapValue`) | ✅ Implemented (incl. count-swap) |
| **Speed-distance-time ratio scenarios** | High (SSC, Banking) | RAP-CP-019 (`sdtTimeRatioFromSpeedDistance`, `sdtDistanceRatioFromSpeedTime`, `sdtSpeedRatioFromDistanceTime`, `sdtRaceLead`, `sdtOvertakeTime`) | ✅ Implemented (incl. race/overtake) |
| **Population & literacy cross-tabulation** | High (SSC, Punjab State) | RAP-CP-020 (`populationCrossTabCellCount`, `populationTotalLiterate`, `populationLiteracyPercent`, `populationCellRatio`, `populationTotalIlliterate`) | ✅ Implemented |
| **Election & vote-share ratio** | High (SSC, Punjab PCS) | RAP-CP-021 (`electionWinnerVotes`, `electionWinningMargin`, `electionTotalVotersFromMargin`, `electionLoserVotes`, `electionInvalidVotes`) | ✅ Implemented |
| **Geometric ratio (area/volume)** | Medium-high (SSC Tier-2) | RAP-CP-022 (`geometricAreaRatioFromSide`, `geometricVolumeRatioFromSide`, `geometricSideRatioFromArea`, `geometricSurfaceAreaRatioFromVolume`, `geometricAreaRatioFromRadius`) | ✅ Implemented |

**RAP-003 status:** English runtime MVP, all 10 CPs active, 45 task kinds, Question Studio wired (`supportedLanguages: ["en"]`), residual QA clean (500 samples, all 21 blocker counters at 0), ready for English manual review but not yet freeze-ready or multilingual-ready.

**Note:** RAP-001's `incomeExpenditureSystem` (CP-004) remains a weaker abstract version of the same family; RAP-003 CP-015 is the exam-realistic implementation. The RAP-001 version should eventually be retired or scoped as a foundational drill once RAP-003 is frozen.

---

## 5. Question Quality Issues

### 5.1 Mechanical repetition in RAP-001 (HIGH severity)

RAP-001 has **169 QLs** but they are mostly 4–20 phrasing variants of ~22 distinct question shapes. Examples from `question-language.en.json`:

- **simpleLinkage** (5 variants): "If the ratio A:B is...", "In a competitive exam setup, if the ratio A:B is...", "If the following conditions hold: If the ratio...", "Based on given parameters, If the ratio...". The phrase prefixes ("In a competitive exam setup", "If the following conditions hold:", "Based on given parameters") add zero exam value and read as template padding.
- **ratioNormalization** (20 variants): all reduce to "Convert/simplify/normalize/express/reduce the fractional ratio X/Y : X/Y into integers." Twenty near-identical stems.
- **basicPartition** (19 variants): all are "A total of {total} is distributed among A, B, C in ratio... Find X's share."

**Exam impact:** A real SSC question bank would have 3–5 distinct wordings per family, not 20. The high variant count inflates the "169 QL" headline but provides little diversity. The `maturity-audit.md` reports 4.60% duplicate rate, but stem-*shape* duplication (not exact-string duplication) is far higher.

**Recommendation:** Prune the prefix variants ("In a competitive exam setup", "If the following conditions hold:", "Based on given parameters") — these are not exam-realistic. Keep at most 3–5 distinct, naturally-worded stems per family. Redirect the QL budget to genuinely new scenario families (RAP-003).

### 5.2 Unnatural prefix phrases (MEDIUM severity)

The recurring prefixes are non-exam-like:
- *"In a competitive exam setup, ..."* — no real paper says this.
- *"If the following conditions hold: ..."* — stilted.
- *"Based on given parameters, ..."* — meta/robotic.

These appear because the generator was attempting "diversity" by prepending boilerplate. They should be removed entirely.

### 5.3 Abstract entity labels reduce realism (MEDIUM severity)

RAP-001 CP-001 uses `personA/B/C` = "boys/girls/teachers" which is fine, but CP-004 (proportionals/variation) uses bare numbers with no scenario: *"What will be the third proportional to {numA} and {numB}?"* — this reads like a textbook drill, not an exam question. Real SSC proportion questions embed a context (e.g., "The ratio of two numbers is 3:4; find the third proportional to their sum and difference").

**Recommendation:** Wrap proportionals/variation in minimal scenarios where possible, or accept them as "drill" questions and label them as Easy foundational.

### 5.4 RAP-002 question wording is cleaner but scenario-thin

RAP-002 stems are better-written than RAP-001 (no prefix boilerplate), e.g. RAP-QL-401: *"{personA}:{personB} = {ratioA}:{ratioB}, and their total is {totalValue}. If {valueAddA} is added to {personA}..."*. But `personA/B` resolve to abstract entities ("A", "B") or mismatched ones ("sales", "profit"). Real exam questions would say "The ratio of Aman's income to Bhavna's income..." or "The ratio of milk to water...".

**Recommendation:** Add a scenario-noun layer so stems read as real situations (names, quantities) rather than abstract A/B.

---

## 6. Explanation Quality Issues

### 6.1 RAP-001: generic filler lines (MEDIUM severity)

The `explanation.en.json` uses a 5-step variant system, but several steps are filler:
- *"Now simplify the working carefully."*
- *"Keep the base quantity clear while simplifying."*
- *"Observe the given relation carefully."*
- *"Now write the working with the given values."*

These add no pedagogical value and would not appear in a Kiran/Pinnacle solution. The realism-audit.md praised PCT-001's "strict 5-step pedagogical model (Goal, Formula, Substitution, Simplification, Conclusion)" and noted "generic phrases have been completely purged" — RAP-001 has **not** completed this purge.

**Recommendation:** Replace filler lines with concrete calculation steps showing actual numbers (as PCT-001 does). Remove "Observe the given relation carefully" etc.

### 6.2 RAP-002: renderer-only, no explanation library (MEDIUM severity)

RAP-002 has **no `explanation.en.json`** — explanations come entirely from `explanation-renderer.ts` which builds lines programmatically. This means:
- No variant diversity (every question of a task kind gets the same explanation shape).
- Harder to localize (no JSON to translate; the renderer must be rewritten per language).
- The lines are decent but lack the "Goal → Formula → Substitution → Simplification → Conclusion" structure that PCT-001 established as the standard.

**Recommendation:** Add `explanation.en.json` with per-CP explanation templates (mirroring PCT-001/PCT-007), keeping the renderer for math-Jax assembly only. This also unblocks future HI/PA localization.

### 6.3 MathJax present but inconsistent

Both packages emit `mathJax` in solver results, but RAP-001's `setupLatex` uses abstract formulas (`A:B = a:b, B:C = m:n`) rather than the actual numbers, while the `calculationLatex` shows the result. PCT-001 shows the full substitution with real numbers. RAP explanations should show actual substituted values, not generic placeholders.

---

## 7. Difficulty Calibration Issues

### 7.1 RAP-001: mislabeled difficulties (LOW-MEDIUM severity)

From the human-review CSV:
- RAP-QL-001 (simpleLinkage, ratio 3:4 and 4:5 → trivial) is labeled **Easy** ✓.
- RAP-QL-101 (same structure, 4:5 and 5:6) is labeled **Hard** ✗ — should be Easy.
- RAP-QL-402 (ratioNormalization, 3/3 : 4/2 = 1:2) is labeled **Easy** but RAP-QL-902 (3/3 : 4/2, identical) is labeled **Hard**. Same question, two difficulty bands.

Root cause: difficulty is assigned per-QL in the registry, and the variant copies inherited inconsistent bands.

**Recommendation:** Re-derive difficulty from structural complexity (chain length, term size, operation count) rather than per-QL manual assignment. RAP-002's `difficulty-framework.md` already does this correctly — backport the approach.

### 7.2 RAP-002: MVP difficulty skew

`distribution-targets.library.json` shows `Easy: 0, Medium: 0.6, Hard: 0.4` — no Easy questions are generated. The `pickDifficulty` function only picks from `["Medium", "Hard"]`. This is acceptable for an MVP but means the package cannot serve foundational learners. Real exam banks need an Easy tier.

**Recommendation:** Once the MVP blockers are fixed, add Easy-band QLs (small ratio terms 1–6, single operations).

---

## 8. Multilingual Status

### 8.1 RAP-001: multilingual, frozen (GOOD)
- `question-language.{en,hi,pa}.json`, `explanation.{en,hi,pa}.json` all present.
- `entity-rendering-audit.md` confirms synchronized entity IDs across en/hi/pa.
- Maturity audit: 0 cross-language failures, 0 placeholder failures, 4.60% duplicate rate.
- This is the multilingual gold-standard reference for the family.

### 8.2 RAP-002: English-only MVP (GAP)
- No `question-language.hi.json` / `.pa.json`.
- No `explanation.*.json` at all (renderer-only).
- Validator explicitly blocks non-English: `language !== "en"` → fail.
- Question Studio exposes `supportedLanguages: ["en"]` only.
- Hindi/Punjabi generation is rejected at runtime (verified by smoke test).

**Recommendation:** RAP-002 multilingual is correctly deferred until the English MVP blockers (ISSUE-1 to ISSUE-4) are resolved. Do not localize until the English contract is stable.

---

## 9. Duplication & Diversity

### 9.1 RAP-001 exact-duplicate rate: 4.60% (ACCEPTABLE)
The maturity audit reports 4.60% duplicate rate, below the ~8% threshold. However, this measures **exact-string** duplicates. Stem-*shape* duplication is far higher (see §5.1) because the 169 QLs collapse to ~22 distinct shapes.

### 9.2 RAP-002 unique stems
The coverage audit reports healthy unique-stem counts per CP (e.g., CP-010: 124 unique stems from 126 samples). This is good — RAP-002's deterministic seeding produces real diversity. The risk is not duplication but the four quality blockers (§3).

### 9.3 Logic-answer diversity (RAP-002, BLOCKER)
As noted in ISSUE-4, `chainEquivalence` produces only "Equivalent" — a degenerate answer distribution. The residual QA must assert both "Equivalent" and "Not equivalent" appear.

---

## 10. Validator & Audit Gaps

### 10.1 RAP-001 validator
Not directly inspected, but the maturity audit passed with 0 validation failures. The validator likely checks placeholders, required variables, and language — but the realism-audit.md found entity/grammar issues that the validator did **not** catch. This means the validator checks *structure* not *quality*.

### 10.2 RAP-002 validator (WEAK)
`validator.ts` has only 5 checks:
1. stem-present
2. answer-present
3. no-unresolved-placeholders
4. required-variables-present
5. language-supported (en only)

**Missing checks:** NaN/Infinity, undefined/null, grammar blockers, semantic-incompatibility phrases, duplicate stems, invalid answer format, invalid correctIndex, duplicate normalized options, weak options, explanation leakage, tie-risk in chainInequality, logic-answer diversity.

The coverage audit proves *runtime coverage* (every CP/QL/task kind runs) but **not** *generated-output quality*. This is the core gap the RAP-002 hardening task addresses.

**Recommendation:** Extend the validator with the quality checks listed in the hardening task §5, and create a residual QA script (§6 of the hardening task) that generates 500+ samples and audits all quality counters.

---

## 11. Generation-Engine Integration

### 11.1 RAP-001
Wired and frozen. No issues noted.

### 11.2 RAP-002
- Wired into `generation-engine.ts` as `RUNTIME_PACKAGES` entry.
- `supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES` (correct).
- Difficulty normalization: the engine passes `difficultyBand` only if Medium/Hard, else `undefined` → falls back to `pickDifficulty` (Medium/Hard). This is consistent with the MVP skew but means Easy is unreachable from Question Studio.
- `polishGeneratedEnglishText` in the engine applies many Percentage-specific fixes ("A investment" → "An investment") but **no RAP-specific fixes**. The "number of workers ... are" bug is not polished because the polisher doesn't know about it.

**Recommendation:** Fix the grammar at the template/source level (RAP-002 QL-601), not in the engine polisher. The polisher is a safety net, not the primary fix.

---

## 12. Prioritized Improvement Roadmap

### Tier 1 — Blockers (must fix before any expansion)
1. **RAP-002 semantic entity pools** (ISSUE-1): CP/task-specific scenario pools in `parameter-generator.ts`.
2. **RAP-002 subject-verb agreement** (ISSUE-2): fix QL-601 `are`→`is`, add grammar audit.
3. **RAP-002 tie handling** (ISSUE-3): prevent equality in `chainInequality`/`chainOrdering` generators.
4. **RAP-002 equivalence diversity** (ISSUE-4): add "Not equivalent" generator path + tests.
5. **RAP-002 residual QA script**: generate 500+ samples, audit all quality counters to zero.
6. **RAP-002 validator hardening**: add NaN/null/grammar/semantic/tie/diversity checks.

### Tier 2 — Editorial hardening (before freeze)
7. **RAP-001 entity/grammar cleanup**: fix "In a boys", "boys's", logical overlap (students/boys/girls) flagged in realism-audit.md. This is a shared integration issue — if the entity library is shared, RAP-002 fixes may need to propagate.
8. **RAP-001 prune prefix variants**: remove "In a competitive exam setup", "If the following conditions hold:", "Based on given parameters" from all 169 QLs.
9. **RAP-001 difficulty re-derivation**: fix inconsistent Easy/Hard labels on identical questions.
10. **RAP-001 explanation filler purge**: remove "Observe the given relation carefully" etc., replace with concrete numbered steps (PCT-001 standard).
11. **RAP-002 add `explanation.en.json`**: move from renderer-only to library-backed explanations.

### Tier 3 — Coverage status & consolidation
12. **RAP-003 (applications chapter) is already built** — all 10 real-world families (partnership, age-ratio, income-savings, alloy blend, repeated replacement, denomination, SDT, population cross-tab, election, geometric) are implemented, QA-clean, and ready for English manual review. No new coverage build is needed.
13. **RAP-001 `incomeExpenditureSystem` retirement/scoping** — RAP-003 CP-015 is the exam-realistic implementation; the abstract RAP-001 version should be scoped as foundational drill or retired once RAP-003 is frozen, to avoid two CPs covering the same family at different quality levels.
14. **RAP-002 add Easy tier** — small-ratio-term foundational questions once MVP blockers are resolved.
15. **RAP-002 multilingual pilot** — HI/PA for CP-007 only after English is QA-clean.
16. **RAP-003 multilingual** — HI/PA localization after English manual review passes; structural `question-language.{hi,pa}.json` files already exist as parity companions.

### Tier 4 — Polish
15. **Scenario-noun layer for RAP-002**: replace abstract A/B with names/quantities.
16. **MathJax substitution**: show real numbers in `setupLatex`, not generic `a:b`.
17. **Engine polisher RAP rules**: add RAP-specific grammar safety nets.

---

## 13. Exam-Family Readiness Matrix

| Exam family | RAP-001 | RAP-002 | RAP-003 | Family ready? |
|---|---|---|---|---|
| Basic linkage/normalization | ✅ | ✅ (chains) | — | ✅ |
| Partition / reverse partition | ✅ | — | — | ✅ |
| Two-state transformation | ✅ | ✅ (multi-stage) | — | ✅ |
| Proportionals & variation | ✅ | — | — | ✅ (drill-quality) |
| Coin/denomination | ✅ (basic) | — | ✅ (incl. count-swap) | ✅ |
| Mixture (single addition) | ✅ | — | — | ✅ |
| Mixture (multi-source blend) | — | — | ✅ | ✅ |
| Repeated replacement | — | — | ✅ | ✅ |
| Partnership | — | — | ✅ | ✅ |
| Age-ratio | — | — | ✅ | ✅ |
| Income-expenditure-savings | ⚠️ (abstract) | — | ✅ | ✅ (RAP-003) |
| SDT ratio | — | ⚠️ (inverse only) | ✅ | ✅ (RAP-003) |
| Population cross-tab | — | — | ✅ | ✅ |
| Election vote-share | — | — | ✅ | ✅ |
| Geometric ratio | — | — | ✅ | ✅ |
| Inverse work/speed chain | — | ✅ | — | ✅ |
| Nested partition | — | ✅ | — | ✅ |
| Comparison/ordering | — | ✅ | — | ✅ (needs tie fix) |

**Verdict:** All 18 exam families now have a home. Coverage is mechanically complete across the three-package family. The remaining gaps are **quality** (RAP-001 entity/grammar, RAP-002 4 blockers), not **coverage**. RAP-003 is QA-clean and ready for English manual review; RAP-001 and RAP-002 still need editorial hardening.

---

## 14. Recommendations Summary

1. **Fix the 4 RAP-002 blockers first** (semantic pools, grammar, ties, equivalence diversity) — these are correctness and realism defects. RAP-003 already demonstrates the CP-specific-pool and residual-QA pattern to follow.
2. **RAP-003 is built and QA-clean** — proceed to English manual review; no coverage build is needed. Use RAP-003 as the editorial reference standard for hardening RAP-001/002 (CP-specific entity pools, residual QA script, validator quality checks).
3. **Harden RAP-001 editorially** — entity/grammar cleanup, prune prefix variants, fix difficulty labels, purge explanation filler. The math is freeze-ready; the English is not.
4. **Backport RAP-002/RAP-003's difficulty-framework approach** (structural complexity → band) to RAP-001 to fix the inconsistent labels.
5. **Backport RAP-003's residual-QA pattern** to RAP-001 and RAP-002 so all three packages have generated-output quality audits, not just runtime coverage audits.
6. **Do not localize RAP-002 or RAP-003** until their English blockers are resolved and residual QA is clean. RAP-001 is the only multilingual package today.
7. **Scope/retire RAP-001 `incomeExpenditureSystem`** once RAP-003 CP-015 is frozen, to avoid two CPs covering the same family at different quality levels.

---

## 15. Final Verdict

- **RAP-001:** Mathematically freeze-ready ✅. Editorially needs hardening ⚠️. Not yet guidebook-quality due to entity glitches and filler explanations.
- **RAP-002:** English MVP with 4 known blockers ❌. Not ready for manual review until blockers are fixed and residual QA is clean. Not multilingual-ready. Not freeze-ready.
- **RAP-003:** English MVP, QA-clean ✅, ready for English manual review. Not multilingual-ready. Not freeze-ready (pending manual/editorial review). Serves as the editorial reference standard for the family.
- **RAP family as a whole:** Coverage is **complete** across all major SSC/Banking/Punjab exam families (mechanics in RAP-001/002, applications in RAP-003). Remaining work is **editorial quality** (RAP-001 entity/grammar, RAP-002 4 blockers) and **multilingual expansion** (RAP-002/003), not coverage. An experienced SSC/Banking teacher would currently notice RAP-001/002 are generated due to entity/grammar issues, but RAP-003 passes that test.

**No files were modified (except this assessment report's corrections).** This is an assessment report only.
