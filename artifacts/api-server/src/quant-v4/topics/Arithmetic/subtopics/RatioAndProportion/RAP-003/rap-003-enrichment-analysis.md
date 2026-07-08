# RAP-001 & RAP-002 Enrichment Analysis — Slimming RAP-003 to Advanced Applications Only

> **Status:** Analysis report only. No files modified or created in RAP-001, RAP-002, or RAP-003 runtime.
> **Purpose:** Determine which of the 10 designed RAP-003 CPs can be absorbed into RAP-001 and RAP-002 as enrichment, leaving only truly advanced applications in RAP-003.
> **Date:** 2026-07-08

---

## 1. Executive Summary

The original RAP-003 design proposed 10 CPs (CP-013..022) covering all real-world R&P applications. After analyzing each CP's mechanical complexity against RAP-001's 6 CPs and RAP-002's 6 CPs, we can redistribute **5 CPs** downward:

- **RAP-001 absorbs 2 CPs** (CP-018 Denomination, CP-022 Geometric Ratio) — these are direct extensions of existing RAP-001 mechanics (weighted mapping, proportion/variance).
- **RAP-002 absorbs 3 CPs** (CP-015 Income-Expenditure, CP-019 SDT Ratio, CP-021 Election) — these are chain/multi-stage/inverse-chain applications that fit RAP-002's compound mechanics.
- **RAP-003 retains 5 CPs** (CP-013 Partnership, CP-014 Age-Ratio, CP-016 Alloy Blending, CP-017 Repeated Replacement, CP-020 Population Cross-Tab) — these require genuinely advanced solvers with no clean home in RAP-001/002.

This produces a leaner, more defensible RAP-003 that is unambiguously "advanced applications" rather than a catch-all.

---

## 2. Absorption Criteria

A CP can be absorbed into RAP-001 or RAP-002 if it satisfies **all three** conditions:

1. **Mechanical fit:** The CP's core solve path is a direct extension of an existing CP's solver, not a fundamentally new algorithm.
2. **No new task-kind family:** The CP doesn't introduce a new class of task-kind that would bloat the chapter's task-kind count disproportionately.
3. **Difficulty ceiling is moderate:** The CP's hardest variant is solvable with the absorbing chapter's existing difficulty framework (Easy/Medium/Hard bands align).

A CP **must remain in RAP-003** if:
- It requires a fundamentally new solver algorithm (e.g., geometric decay, 2D cross-tab grid, time-weighted product).
- Its difficulty ceiling exceeds what RAP-001/002's parameter pools can cleanly support.
- It is a "trophy question" archetype (Banking PO repeated replacement, SSC Tier-2 age-ratio systems).

---

## 3. CP-by-CP Absorption Analysis

### CP-013: Partnership & Time-Weighted Investment → **STAYS in RAP-003**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ❌ No. RAP-001 CP-002 partitions a total by ratio, but partnership uses **investment × time** — a product of two ratios, not a partition. |
| Mechanical fit with RAP-002? | ❌ No. RAP-002 CP-011 handles inverse chains (speed-time), but partnership uses time as a **multiplier** (profit weight), not an inverse variable. |
| New solver algorithm? | ✅ Yes. Requires a time-weighted profit-share solver with join-later, withdraw-early, and mid-period-change variants. |
| Difficulty ceiling | Hard — 4 partners with mid-period investment changes. |
| **Verdict** | **RAP-003 only.** The product-of-ratios structure is unique. No existing CP handles it. |

---

### CP-014: Age-Ratio Temporal Shift → **STAYS in RAP-003**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ❌ No. RAP-001 CP-003 (Two-State Transform) changes ratios by adding/subtracting quantities, but age-ratio exploits the **constant-difference invariant** ($A - B = \text{const}$ under equal time shift). This is a fundamentally different algebraic structure. |
| Mechanical fit with RAP-002? | ❌ No. RAP-002 CP-009 (Multi-Stage Transform) tracks state changes, but age-ratio doesn't "change" the ratio — it shifts all entities equally and solves for the invariant. |
| New solver algorithm? | ✅ Yes. Cross-product solver with constant-difference invariant; 3-entity temporal systems. |
| Difficulty ceiling | Hard — 3-entity age-ratio with future/past ratio targets. SSC Tier-2 trophy. |
| **Verdict** | **RAP-003 only.** The constant-difference invariant is unique to age problems. |

---

### CP-015: Income, Expenditure & Savings Ratio → **MOVE to RAP-002**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ❌ No. RAP-001 CP-002 partitions one total by one ratio. Income-expenditure uses **two ratio systems** (income ratio + expenditure ratio) reconciled via savings — not a single partition. |
| Mechanical fit with RAP-002? | ✅ **Yes.** RAP-002 CP-010 (Conditional Partition) divides a total at one level, then subdivides at another. Income-expenditure-savings is a **two-system reconciliation** — structurally a conditional partition where income is divided by one ratio and expenditure by another, with savings as the linking constraint. This is a natural extension of CP-010's nested allocation logic. |
| New solver algorithm? | ❌ No. The solver is a 2-equation linear system (income ratio × x − expenditure ratio × y = savings), which is a constrained reverse-chain solve — already within RAP-002's solver dispatch. |
| Difficulty ceiling | Hard — 3-entity income/expenditure/savings system. Aligns with RAP-002's Hard band. |
| **Verdict** | **Absorb into RAP-002 as a new task-kind family under CP-010** (Conditional Partition). Add task kinds: `incomeExpenditureSavings`, `findIncomeFromEqualSavings`, `findSavingsFromIncomeExpenditureRatio`. |

---

### CP-016: Alloy & Multi-Source Mixture Blending → **STAYS in RAP-003**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ❌ No. RAP-001 CP-006 (Mixture Basis) adds a single component to one mixture. Alloy blending **combines 2-3 pre-existing mixtures** of different concentrations to hit a target — a weighted-average across sources, not a single-component addition. |
| Mechanical fit with RAP-002? | ❌ No. RAP-002 chains ratios, but alloy blending uses alligation/weighted-average, which is not a chain operation. |
| New solver algorithm? | ✅ Yes. Alligation solver + multi-source weighted-average solver + target-ratio reverse solver. |
| Difficulty ceiling | Hard — 3-source alloy mixing with equal/unequal quantities. Banking PO trophy. |
| **Verdict** | **RAP-003 only.** Multi-source weighted-average is distinct from single-mixture addition. |

---

### CP-017: Repeated Replacement Cycles → **STAYS in RAP-003**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ❌ No. RAP-001 CP-006 mentions "Variable Quantity Replacement cycles" in its description, but the actual frozen CP-006 solver handles **single-step** replacement. Repeated replacement uses **geometric decay** $(1-f)^n$ — an iterative closed form that no RAP-001 solver implements. |
| Mechanical fit with RAP-002? | ❌ No. RAP-002 CP-009 does multi-stage transforms, but each stage is an add/remove action on a ratio. Repeated replacement iterates a **concentration decay formula**, not a ratio transformation. |
| New solver algorithm? | ✅ Yes. Geometric decay solver with iteration count, final-ratio reverse solver. |
| Difficulty ceiling | Hard — find iterations from final ratio (logarithmic solve). Banking PO trophy. |
| **Verdict** | **RAP-003 only.** The geometric decay formula is unique. RAP-001 CP-006's description mentions "replacement cycles" but the frozen solver doesn't implement iterative decay. |

> **Note:** RAP-001 CP-006's canonical-problems.md description says "Variable Quantity Replacement cycles" — this is a naming overlap, but the frozen solver handles single-step replacement only. The iterative version is genuinely more advanced and belongs in RAP-003.

---

### CP-018: Denomination & Value Systems → **MOVE to RAP-001**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ✅ **Yes.** RAP-001 CP-005 (Generalized Weighted Mapping) already covers "converting counts to values using weights (Denominations, Baskets, Marks)" and explicitly mentions "Multi-Denomination (3-4) systems." CP-018 is a **direct application** of CP-005's weighted-mapping solver: count-ratio × face-value → total value. The only addition is the "count swap" variant (replace N coins of one denomination with N of another), which is a two-state transform on top of the weighted mapping — composable with CP-003. |
| Mechanical fit with RAP-002? | ❌ No. Not a chain operation. |
| New solver algorithm? | ❌ No. The solver is: (1) derive counts from ratio + total count (CP-002 partition), (2) multiply by face values (CP-005 weighted mapping), (3) optional count-swap (CP-003 two-state transform). All three are existing RAP-001 mechanics. |
| Difficulty ceiling | Hard — 4 denominations with count-swap conditions. Aligns with RAP-001's Hard band. |
| **Verdict** | **Absorb into RAP-001 as new task-kind family under CP-005** (Generalized Weighted Mapping). Add task kinds: `denominationTotalValue`, `denominationCountSwap`, `findCountsFromTotalValue`. Requires unfreezing RAP-001. |

> **Important:** RAP-001 is currently **FROZEN** (freeze-record.md: "READY FOR FREEZE REVIEW"). Absorbing CP-018 means unfreezing RAP-001, adding new task kinds and QLs, then re-freezing. This is the highest-cost absorption but the most mechanically justified.

---

### CP-019: Speed-Distance-Time Ratio Scenarios → **MOVE to RAP-002**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ❌ No. SDT uses the product relation $S \times T = D$, not a partition or weighted mapping. |
| Mechanical fit with RAP-002? | ✅ **Yes.** RAP-002 CP-011 (Inverse Proportion Chains) already handles "speed-time" and "workers vs. days" inverse chains. SDT ratio scenarios are a **direct application** of CP-011's inverse-chain solver: given speed ratio and distance ratio, find time ratio (inverse chain). The race/overtake variant is a multi-stage transform (CP-009). |
| New solver algorithm? | ❌ No. The solver is: (1) speed ratio → time ratio (inverse, CP-011), (2) race scenario → distance ratio from lead (CP-009 multi-stage), (3) meeting point → relative speed (simple arithmetic on ratio terms). All within RAP-002's existing solver dispatch. |
| Difficulty ceiling | Hard — meeting point from opposite ends with speed ratio. Aligns with RAP-002's Hard band. |
| **Verdict** | **Absorb into RAP-002 as a new task-kind family under CP-011** (Inverse Proportion Chains). Add task kinds: `sdtTimeRatioFromSpeed`, `sdtRaceLead`, `sdtMeetingPoint`. RAP-002 is English MVP (not frozen), so this is low-cost. |

---

### CP-020: Population & Literacy Cross-Tabulation → **STAYS in RAP-003**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ❌ No. RAP-001 handles 1D ratios (A:B). Population cross-tab is a **2D ratio grid** — two independent ratios (male:female, literate:illiterate) over the same base population, requiring cell-level computation. No RAP-001 CP handles 2D grids. |
| Mechanical fit with RAP-002? | ❌ No. RAP-002 chains ratios linearly. A 2D cross-tab is not a chain — it's a matrix decomposition. |
| New solver algorithm? | ✅ Yes. 2D cell-grid solver with independence assumption, conditional literacy rates, and fraction-of-subgroup computation. |
| Difficulty ceiling | Hard — conditional literacy rates by gender (60% male, 40% female). SSC/Punjab State trophy. |
| **Verdict** | **RAP-003 only.** The 2D cross-tab grid is structurally unique. |

---

### CP-021: Election & Vote-Share Ratio → **MOVE to RAP-002**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ❌ No. Election vote-share is a multi-stage chain (turnout → polled → valid → candidate split), not a single partition. |
| Mechanical fit with RAP-002? | ✅ **Yes.** RAP-002 CP-009 (Multi-Stage Ratio Transformations) tracks a ratio through successive actions. Election vote-share is a **multi-stage chain**: total voters → (turnout %) → polled → (valid %) → valid votes → (candidate ratio) → winner/loser. This is a direct application of CP-009's multi-stage transform solver, with CP-012 (Comparison) for margin computation. |
| New solver algorithm? | ❌ No. The solver is: (1) apply turnout percentage (multi-stage transform), (2) apply validity percentage (multi-stage transform), (3) partition valid votes by candidate ratio (CP-010 conditional partition), (4) compute margin (CP-012 comparison). All within RAP-002's existing solver dispatch. |
| Difficulty ceiling | Hard — reverse solve from margin to total voters. Aligns with RAP-002's Hard band. |
| **Verdict** | **Absorb into RAP-002 as a new task-kind family under CP-009** (Multi-Stage Ratio Transformations). Add task kinds: `electionWinnerVotes`, `electionMargin`, `electionTotalVotersFromMargin`. RAP-002 is English MVP (not frozen), so this is low-cost. |

---

### CP-022: Geometric Ratio Applications → **MOVE to RAP-001**

| Criterion | Assessment |
|---|---|
| Mechanical fit with RAP-001? | ✅ **Yes.** RAP-001 CP-004 (Mathematical Proportion & Variance) covers "mean/third/fourth proportional" and "direct/inverse variation." Geometric ratio (side → area = side², side → volume = side³) is a **direct application of proportion with power variation** — the ratio is raised to a power (2 or 3), which is a variation problem. CP-004's solver already handles proportional relationships; adding power-ratio computation is a natural extension. |
| Mechanical fit with RAP-002? | ❌ No. Not a chain operation. |
| New solver algorithm? | ❌ No. The solver is: (1) compute side ratio, (2) raise to power 2 (area) or 3 (volume), (3) optionally reverse (cube root / square root). This is a simple power operation on ratio terms — well within CP-004's proportion solver. |
| Difficulty ceiling | Hard — reverse solve (volume ratio → side ratio → surface area ratio). Aligns with RAP-001's Hard band. |
| **Verdict** | **Absorb into RAP-001 as a new task-kind family under CP-004** (Mathematical Proportion & Variance). Add task kinds: `geometricAreaRatio`, `geometricVolumeRatio`, `geometricSideFromVolumeRatio`. Requires unfreezing RAP-001. |

---

## 4. Summary Redistribution Table

| Original RAP-003 CP | Destination | Absorbing CP | New Task Kinds | Cost |
|---|---|---|---|---|
| CP-013 Partnership | **RAP-003** | — | — | — |
| CP-014 Age-Ratio | **RAP-003** | — | — | — |
| CP-015 Income-Expenditure | **RAP-002** | CP-010 (Conditional Partition) | `incomeExpenditureSavings`, `findIncomeFromEqualSavings`, `findSavingsFromIncomeExpenditureRatio` | Low (English MVP, not frozen) |
| CP-016 Alloy Blending | **RAP-003** | — | — | — |
| CP-017 Repeated Replacement | **RAP-003** | — | — | — |
| CP-018 Denomination | **RAP-001** | CP-005 (Weighted Mapping) | `denominationTotalValue`, `denominationCountSwap`, `findCountsFromTotalValue` | **High** (requires unfreezing) |
| CP-019 SDT Ratio | **RAP-002** | CP-011 (Inverse Proportion Chains) | `sdtTimeRatioFromSpeed`, `sdtRaceLead`, `sdtMeetingPoint` | Low (English MVP, not frozen) |
| CP-020 Population Cross-Tab | **RAP-003** | — | — | — |
| CP-021 Election | **RAP-002** | CP-009 (Multi-Stage Transform) | `electionWinnerVotes`, `electionMargin`, `electionTotalVotersFromMargin` | Low (English MVP, not frozen) |
| CP-022 Geometric Ratio | **RAP-001** | CP-004 (Proportion & Variance) | `geometricAreaRatio`, `geometricVolumeRatio`, `geometricSideFromVolumeRatio` | **High** (requires unfreezing) |

---

## 5. Enriched Chapter Profiles

### 5.1 Enriched RAP-001 (Unfrozen + 2 new task-kind families)

| Aspect | Current | Enriched |
|---|---|---|
| CP count | 6 (CP-001..006) | 6 (unchanged — no new CPs, just new task kinds under existing CPs) |
| Task kinds | 6 | 12 (6 original + 3 denomination + 3 geometric) |
| QL count | 27 (frozen) | ~45-50 (27 existing + ~9-12 denomination + ~9-12 geometric) |
| Languages | en, hi, pa (frozen) | en, hi, pa (must re-validate after unfreezing) |
| Status | FROZEN | Unfrozen → enriched → re-freeze |

**New task-kind families:**
- Under **CP-005** (Weighted Mapping): `denominationTotalValue`, `denominationCountSwap`, `findCountsFromTotalValue`
- Under **CP-004** (Proportion & Variance): `geometricAreaRatio`, `geometricVolumeRatio`, `geometricSideFromVolumeRatio`

**Enrichment rationale:** Denomination is explicitly mentioned in CP-005's description ("Denominations, Baskets, Marks"). Geometric ratio is a power-variation, which is CP-004's domain. Both are moderate-difficulty applications that don't need a dedicated advanced chapter.

---

### 5.2 Enriched RAP-002 (English MVP + 3 new task-kind families)

| Aspect | Current | Enriched |
|---|---|---|
| CP count | 6 (CP-007..012) | 6 (unchanged — no new CPs, just new task kinds under existing CPs) |
| Task kinds | 18 | 27 (18 original + 3 income-expenditure + 3 SDT + 3 election) |
| QL count | 42 (MVP) | ~60-66 (42 existing + ~6-8 income-expenditure + ~6-8 SDT + ~6-8 election) |
| Languages | en only (MVP) | en (enrich first, then multilingual) |
| Status | English MVP | English MVP enriched → then multilingual |

**New task-kind families:**
- Under **CP-010** (Conditional Partition): `incomeExpenditureSavings`, `findIncomeFromEqualSavings`, `findSavingsFromIncomeExpenditureRatio`
- Under **CP-011** (Inverse Proportion Chains): `sdtTimeRatioFromSpeed`, `sdtRaceLead`, `sdtMeetingPoint`
- Under **CP-009** (Multi-Stage Transform): `electionWinnerVotes`, `electionMargin`, `electionTotalVotersFromMargin`

**Enrichment rationale:** Income-expenditure is a two-system conditional partition (CP-010). SDT ratio is an inverse chain (CP-011 already covers speed-time). Election is a multi-stage transform chain (CP-009). All three are compound-mechanics applications, which is RAP-002's mandate.

---

### 5.3 Slimmed RAP-003 (5 CPs — Advanced Applications Only)

| Aspect | Original Design | Slimmed |
|---|---|---|
| CP count | 10 (CP-013..022) | 5 (CP-013, CP-014, CP-016, CP-017, CP-020) |
| Task kinds | 10 | 5 (one per CP) |
| Solve modes | 40 | ~20 (4 per CP) |
| QL target | 300 | 150 (30 per CP) |
| Difficulty split | 32/34/34 | 30/35/35 (skews harder — advanced chapter) |
| Languages | en, hi, pa | en, hi, pa (en-first) |

**Retained CPs and why they are genuinely advanced:**

| CP | Name | Why it can't be absorbed |
|---|---|---|
| CP-013 | Partnership & Time-Weighted Investment | Product of two ratios (investment × time) — no existing CP uses time as a profit-weight multiplier. |
| CP-014 | Age-Ratio Temporal Shift | Constant-difference invariant under equal time shift — unique algebraic structure, not a generic two-state transform. |
| CP-016 | Alloy & Multi-Source Mixture Blending | Weighted-average across multiple pre-existing mixtures — distinct from single-mixture addition (RAP-001 CP-006). |
| CP-017 | Repeated Replacement Cycles | Geometric decay $(1-f)^n$ — iterative closed form, no existing CP iterates. |
| CP-020 | Population & Literacy Cross-Tabulation | 2D ratio grid (male:female × literate:illiterate) — no existing CP handles 2D cross-tabulation. |

**What makes this RAP-003 unambiguously "advanced":**
- Every CP requires a **fundamentally new solver algorithm** not present in RAP-001 or RAP-002.
- Every CP is a **trophy question** archetype (Banking PO repeated replacement, SSC Tier-2 age-ratio, etc.).
- The difficulty ceiling is genuinely higher — 4-partner mid-period changes, 3-entity age systems, 3-source alloy mixing, logarithmic iteration solving, conditional 2D literacy rates.

---

## 6. Implementation Sequencing

The enrichment has a natural dependency order:

### Phase 1: Enrich RAP-002 (Low cost — not frozen, English MVP)

1. Add 3 new task-kind families to `types.ts` (9 new task kinds total).
2. Extend `solver.ts` with income-expenditure, SDT, and election solver dispatches.
3. Extend `parameter-generator.ts` with income/expenditure ratio pools, SDT scenario pools, election scenario pools.
4. Add QLs to `task-registry.library.json` (~18-24 new QLs).
5. Add explanation templates to the explanation library.
6. Regenerate samples and validate.
7. Update readiness report and maturity audit.

### Phase 2: Unfreeze and Enrich RAP-001 (High cost — frozen, multilingual)

1. **Unfreeze** RAP-001 (update freeze-record.md status).
2. Add 2 new task-kind families to types (6 new task kinds total).
3. Extend solver with denomination and geometric-ratio dispatches.
4. Extend parameter-generator with denomination pools and geometric-ratio pools.
5. Add QLs to task-registry (~18-24 new QLs).
6. Add explanation templates in **all 3 languages** (en, hi, pa).
7. Add QL templates in **all 3 languages** (en, hi, pa).
8. Regenerate samples and validate across all 3 languages.
9. Re-run pre-freeze audit, maturity audit, and duplicate check.
10. **Re-freeze** RAP-001.

### Phase 3: Update RAP-003 Design (Slim to 5 CPs)

1. Update `rap-003-design-report.md` to reflect 5 CPs (remove CP-015, CP-018, CP-019, CP-021, CP-022).
2. Update `rap-003-cp-examples.md` to remove examples for absorbed CPs.
3. Renumber CPs if desired (CP-013, CP-014, CP-016, CP-017, CP-020 → or keep original IDs for traceability).
4. Update QL target from 300 to 150.
5. Update solve modes from 40 to ~20.
6. Proceed with implementation plan for the slimmed 5-CP RAP-003.

### Phase 4: Implement RAP-003 (5 CPs)

1. Create runtime files (types.ts, pipeline.ts, solver.ts, validator.ts, parameter-generator.ts, library.ts).
2. Implement 5 CP solvers (partnership, age-ratio, alloy-blend, repeated-replacement, population-cross-tab).
3. Add QLs and explanation templates (en-first).
4. Generate samples, validate, audit.
5. Multilingual expansion (hi, pa).

---

## 7. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Unfreezing RAP-001 destabilizes frozen content | **High** | Run full regression on existing 27 QLs before and after enrichment. Ensure new task kinds don't modify existing solver dispatches. |
| RAP-001 re-freeze fails (new duplicates, coverage gaps) | Medium | Curate denomination and geometric-ratio variable pools carefully to avoid collision with existing CP-004/CP-005 QLs. |
| RAP-002 enrichment delays multilingual expansion | Medium | Do RAP-002 enrichment before Phase 3 of the existing RAP-002 plan (multilingual). Enrichment is English-only, consistent with current MVP. |
| Absorbed CPs lose exam-realism context in host chapters | Low | Ensure new task-kind names and QL templates retain real-world scenario framing (e.g., "denomination" not just "weighted mapping"). |
| RAP-003 becomes too thin (only 5 CPs) | Low | 5 CPs × 30 QLs = 150 QLs is still substantial. PCT-007 has 10 CPs but RAP-003 is a slimmer, focused advanced-applications chapter. Quality over quantity. |

---

## 8. Comparison: Before vs After

| Dimension | Before (Original Design) | After (Enrichment) |
|---|---|---|
| RAP-001 CPs | 6 | 6 (+ 6 new task kinds) |
| RAP-001 QLs | 27 | ~45-50 |
| RAP-002 CPs | 6 | 6 (+ 9 new task kinds) |
| RAP-002 QLs | 42 | ~60-66 |
| RAP-003 CPs | 10 | 5 |
| RAP-003 QLs | 300 | 150 |
| Total R&P QLs | ~369 | ~255-266 |
| RAP-003 identity | "All real-world applications" | "Advanced applications only" |
| RAP-001 status | Frozen | Unfrozen → enriched → re-frozen |
| RAP-002 status | English MVP | English MVP enriched |

The total QL count drops slightly (~369 → ~260) because the absorbed CPs generate fewer QLs in their host chapters (shared infrastructure) than they would as standalone CPs in RAP-003. This is a net positive — less infrastructure overhead, cleaner chapter boundaries.

---

## 9. Recommendation

**Proceed with the enrichment strategy.** The redistribution produces three benefits:

1. **Cleaner chapter identity:** RAP-003 is unambiguously "advanced applications" — every CP requires a new solver algorithm. No more "this could have been in RAP-001" ambiguity.

2. **Richer foundational chapters:** RAP-001 and RAP-002 become more exam-realistic without losing their mechanical focus. Denomination, geometric ratio, income-expenditure, SDT, and election scenarios are high-frequency exam families that strengthen the foundational chapters.

3. **Lower RAP-003 implementation cost:** 5 CPs instead of 10 means less solver code, fewer parameter pools, fewer QLs to author, and faster time to production.

The main cost is unfreezing RAP-001, but the mechanical fit (denomination → CP-005, geometric ratio → CP-004) is strong enough to justify it. Do RAP-002 enrichment first (low cost), then RAP-001 unfreeze + enrichment (high cost), then update RAP-003 design, then implement the slimmed RAP-003.
