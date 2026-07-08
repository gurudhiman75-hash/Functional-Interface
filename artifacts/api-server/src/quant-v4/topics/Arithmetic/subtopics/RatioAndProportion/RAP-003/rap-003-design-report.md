# RAP-003 Design Report — Real-World Applications of Ratio & Proportion

> **Status:** Design report only. No files modified or created.
> **Position in family:** Third R&P chapter, after RAP-001 (foundational mechanics, frozen) and RAP-002 (compound/chain mechanics, English MVP).
> **Model:** Mirrors **PCT-007 "Mixed Applications of Percentage"** (the late percentage applications chapter) — an applications-dense, multi-CP, exam-realistic package.
> **Exam coverage:** SSC (CGL/CHSL/CPO/MTS), Banking (IBPS/SBI PO & Clerk), Punjab State exams (Punjab PCS, Patwari, PSSSB, Police).
> **Date:** 2026-07-07

---

## 1. Executive Summary

RAP-001 and RAP-002 together cover the **mechanics** of ratio & proportion: forming ratios, partitioning, transforming, chaining, reversing, comparing. What they do **not** cover is the dense band of **real-world application scenarios** that dominate SSC Mains, Banking PO, and Punjab State exam papers — partnership investments, age-ratio temporal shifts, income-expenditure-savings, alloy blending, repeated replacement, denomination systems, SDT ratios, population cross-tabulation, vote-share, and geometric ratios.

**RAP-003** fills this gap as the dedicated **applications chapter** for Ratio & Proportion, structurally mirroring PCT-007 (10 CPs, one task-kind per CP, application-flavored solve modes, 500 QLs, en/hi/pa). It does not duplicate RAP-001/002 mechanics; every CP is anchored to a real exam scenario family.

### Design at a glance

| Aspect | RAP-001 (ref: mechanics) | RAP-002 (ref: chains) | RAP-003 (designed: applications) |
|---|---|---|---|
| Focus | Foundational mechanics | Compound/chain mechanics | Real-world exam applications |
| CP count | 6 (CP-001..006) | 6 (CP-007..012) | 10 (CP-013..022) |
| Task kinds | 6 | 18 | 10 (one per CP) |
| Solve modes | ~24 | ~18 | 40 (see §6) |
| Answer types | RATIO, COUNT, AMOUNT | RATIO, COUNT, LOGIC | RATIO, COUNT, AMOUNT, TIME, SPEED, AGE, PROFIT, PERCENT, AREA, VOLUME |
| QL target | 27 (frozen) | 42 (MVP) | 300 (50 per CP) |
| Languages | en, hi, pa (frozen) | en only (MVP) | en, hi, pa (en-first) |
| Difficulty split | mixed | 0/60/40 (MVP skew) | 32/34/34 (mirrors PCT-007) |
| Architecture | flat + renderers/semantic/ | flat | flat (mirrors RAP-002) |

---

## 2. Why RAP-003 Now (Gap Analysis)

### 2.1 What RAP-001 covers (mechanics)
- CP-001: Multi-entity linkage & scaling (A:B, B:C → A:D).
- CP-002: Partitioned sums & distribution (divide total by ratio).
- CP-003: Two-state relational transformation (before→action→after).
- CP-004: Mathematical proportion & variance (mean/third/fourth proportional).
- CP-005: Generalized weighted mapping (counts→values, denominations).
- CP-006: Mixture basis & binary/ternary addition.

### 2.2 What RAP-002 covers (compound mechanics)
- CP-007..012: Direct chains, reverse chains, multi-stage transformations, nested partitions, inverse chains, comparison/ordering.

### 2.3 What is NOT covered (the application gap)

The following are **high-frequency real exam question families** that neither RAP-001 nor RAP-002 addresses as first-class CPs:

| Real exam family | Why it doesn't fit RAP-001/002 | Exam frequency |
|---|---|---|
| Partnership (investment × time → profit) | Time-weighting is not a partition or a chain; it's a product-of-ratios application. | SSC Mains, Banking PO — very high. |
| Age-ratio temporal shift | Equal time-shift for all entities creates a specific algebraic structure (cross-product with constant difference), not a generic two-state transform. | SSC CGL/Tier-2, Punjab PCS — very high. |
| Income-expenditure-savings | Differential savings from two ratio systems; not a simple partition. | SSC CGL — high. |
| Alloy/multi-source mixture blending | Combining two mixtures of different ratios to hit a target — distinct from single-mixture addition in RAP-001 CP-006. | Banking PO — high. |
| Repeated replacement cycles | Geometric-progression-style concentration decay — no RAP-001/002 CP handles iteration. | Banking PO trophy question — high. |
| Denomination & value systems | RAP-001 CP-005 touches counts→values, but real exam questions bundle 3-4 denominations with total value constraints and "count swap" conditions. | SSC, Punjab Patwari — high. |
| Speed-distance-time ratio | RAP-002 CP-011 covers inverse work/speed chains, but not the full SDT triangle (speed ratio × distance ratio → time ratio) with race/overtake scenarios. | SSC, Banking — high. |
| Population & literacy cross-tab | Two independent ratios (male:female, literate:illiterate) over the same base — a 2D ratio grid, not a chain. | SSC, Punjab State — high. |
| Election & vote-share | Turnout, valid/invalid, candidate split — multi-stage ratio with a percentage flavor. | SSC, Punjab PCS — high. |
| Geometric ratio (area/volume) | Side/radius ratio → area (square) / volume (cube/sphere) ratio. Distinct because the ratio is raised to a power. | SSC CGL Tier-2 — medium-high. |

These ten families are the CPs of RAP-003.

---

## 3. RAP-003 Archetype

### 3.1 Domain description
Real-world applications of Ratio & Proportion across partnership finance, age problems, income-expenditure systems, alloy and mixture blending, repeated replacement, denomination value systems, speed-distance-time, population cross-tabulation, election vote-share, and geometric scaling. Each CP is anchored to a concrete exam scenario family rather than an abstract ratio operation.

### 3.2 Exam context
- **SSC (CGL/CHSL/CPO/MTS):** Partnership, age-ratio, income-expenditure-savings, denomination systems, geometric ratios, SDT ratios. High frequency in Tier-1 and Tier-2.
- **Banking (IBPS/SBI PO & Clerk):** Alloy blending, repeated replacement, partnership with time-weighting, vote-share, population cross-tab. Common in DI-adjacent word problems.
- **Punjab State (PPSC PCS, Patwari, PSSSB, Police):** Income-expenditure, denomination value, age-ratio, population/literacy, election votes. These appear as standalone 1-2 mark questions with Punjab-localized entity labels (names, crops, districts).

### 3.3 Boundary with RAP-001 and RAP-002
- RAP-003 **must not** re-derive basic linkage, partition, two-state transform, chain alignment, or inverse-chain mechanics as standalone CPs.
- RAP-003 **may** compose those mechanics internally, but every CP must be identifiable by its real-world scenario family, not by the underlying ratio operation.
- If a question reduces to a pure RAP-001/002 mechanic with no real-world anchor, it belongs in RAP-001/002, not RAP-003.

### 3.4 Performance targets
- Support up to 4 partners in partnership CP.
- Support up to 4 replacement iterations in repeated-replacement CP.
- Support 3-4 denominations in denomination CP.
- Support 2D cross-tab (2×2 or 2×3) in population CP.
- Multilingual parity (en, hi, pa) for all teacher-voice templates, with Punjab-localized entity pools for `pa`.

---

## 4. Canonical Problems (10 CPs)

| CP ID | Name | Core Logic | Exam Realism |
|---|---|---|---|
| `RAP-CP-013` | Partnership & Time-Weighted Investment | Profit share ∝ (investment × time). Supports join-later, withdraw-early, and mid-period investment change. | SSC Mains, Banking PO — very high. |
| `RAP-CP-014` | Age-Ratio Temporal Shift | Equal time-shift for all entities; constant difference invariant. "Present ratio → after n years → find age." | SSC CGL Tier-2, Punjab PCS — very high. |
| `RAP-CP-015` | Income, Expenditure & Savings Ratio | Two ratio systems (income & expenditure) over the same entities; savings = income − expenditure, possibly equal or in a stated ratio. | SSC CGL — high. |
| `RAP-CP-016` | Alloy & Multi-Source Mixture Blending | Combine 2-3 mixtures of different component ratios to reach a target ratio; find mixing ratio or target component. | Banking PO — high. |
| `RAP-CP-017` | Repeated Replacement Cycles | Remove a fraction of a mixture and replace with a pure component, repeated n times; final ratio via $(1-f)^n$ decay. | Banking PO trophy — high. |
| `RAP-CP-018` | Denomination & Value Systems | 3-4 coin/note denominations in a ratio with total value constraint; find counts, total, or swapped-count value. | SSC, Punjab Patwari — high. |
| `RAP-CP-019` | Speed-Distance-Time Ratio Scenarios | SDT triangle: given two of {speed ratio, distance ratio, time ratio}, find the third. Includes race and overtake. | SSC, Banking — high. |
| `RAP-CP-020` | Population & Literacy Cross-Tabulation | Two independent ratios (male:female, literate:illiterate) over one population; find cell values or fractions. | SSC, Punjab State — high. |
| `RAP-CP-021` | Election & Vote-Share Ratio | Turnout, valid/invalid, candidate split as chained ratios; find winner's votes or margin. | SSC, Punjab PCS — high. |
| `RAP-CP-022` | Geometric Ratio Applications | Side/radius ratio → area ratio (square of ratio) or volume ratio (cube of ratio). | SSC CGL Tier-2 — medium-high. |

### CP Independence Analysis

**RAP-CP-013 (Partnership):** Focus = product of two ratios (investment × time). Independent because no other CP uses time-as-a-multiplier; RAP-002 CP-011 uses time as an inverse variable, not a profit-weight.

**RAP-CP-014 (Age-Ratio):** Focus = constant-difference invariant under equal time shift. Independent because the solver exploits $A - B = \text{const}$, a property unique to age problems; generic two-state transforms (RAP-001 CP-003) don't assume equal shifts.

**RAP-CP-015 (Income-Expenditure-Savings):** Focus = two ratio systems sharing entities with a difference constraint. Independent because it's a 2-system reconciliation, not a single partition.

**RAP-CP-016 (Alloy Blending):** Focus = weighted-average of component concentrations across sources. Independent because it combines multiple pre-existing ratios into a target, unlike RAP-001 CP-006 which adds a single component to one mixture.

**RAP-CP-017 (Repeated Replacement):** Focus = iterative geometric decay. Independent because no other CP iterates; the closed form $(1-f)^n$ is unique to this family.

**RAP-CP-018 (Denomination):** Focus = count-ratio × face-value → total value. Independent because it's a 3-4 denomination matrix with a value equation, more constrained than RAP-001 CP-005's generic weighted mapping.

**RAP-CP-019 (SDT Ratio):** Focus = the SDT triangle ($S \times T = D$) applied to ratios. Independent because it uses the product relation across three ratio variables, not the inverse-chain logic of RAP-002 CP-011.

**RAP-CP-020 (Population Cross-Tab):** Focus = 2D ratio grid. Independent because two orthogonal ratios share a base population, creating a 2×2/2×3 cell structure no chain CP produces.

**RAP-CP-021 (Election):** Focus = multi-stage ratio with a percentage flavor (turnout, valid rate). Independent because it chains ratio with rate-of-base, a hybrid no RAP-001/002 CP covers.

**RAP-CP-022 (Geometric Ratio):** Focus = power-of-ratio (area ∝ ratio², volume ∝ ratio³). Independent because the ratio is exponentiated, an operation absent from all other CPs.

---

## 5. Reasoning Patterns

### CP-013 Partnership
- **Profit ∝ Investment × Time**: $P_i = \frac{I_i \times T_i}{\sum I_j T_j} \times P_{total}$.
- **Join-later**: partner's time = total duration − join month.
- **Withdraw-early**: partner's time = exit month.
- **Mid-change**: split a partner's period into sub-periods with different investments; sum the $I \times T$ products.

### CP-014 Age-Ratio
- **Constant difference**: $A - B$ is invariant across time shifts.
- **Cross-product recovery**: from present ratio $p:q$ and future ratio $r:s$ with shift $n$, solve $A = \frac{n(p \cdot s - q \cdot r)}{q \cdot r - p \cdot s}$... (algebraic isolation).
- **"After how many years"**: solve for $n$ given two ratios.

### CP-015 Income-Expenditure-Savings
- **Equal savings**: $\frac{I_A}{p} - \frac{E_A}{r} = \frac{I_B}{q} - \frac{E_B}{s}$ with $I$ and $E$ in given ratios.
- **Savings ratio given**: introduce a third ratio and reconcile.

### CP-016 Alloy Blending
- **Weighted average**: $\frac{\sum m_i c_i}{\sum m_i} = c_{target}$ where $c_i$ is the component fraction in source $i$.
- **Mixing ratio**: solve for $m_1 : m_2$ given $c_1, c_2, c_{target}$.
- **Three-source**: extend to 3 sources with one degree of freedom.

### CP-017 Repeated Replacement
- **Decay formula**: final pure-component fraction = $c_0 (1 - f)^n$ where $f$ = fraction removed, $n$ = iterations.
- **Inverse**: find $n$ or $f$ given final ratio.

### CP-018 Denomination
- **Value equation**: $\sum (n_i \times v_i) = V_{total}$ with $n_i$ in ratio $p:q:r$.
- **Count swap**: "if 5 fifty-paise coins are replaced by 5 one-rupee coins, total increases by..."
- **Multi-denomination**: 3-4 denominations with face values.

### CP-019 SDT Ratio
- **Time ratio** = $\frac{D_A/S_A}{D_B/S_B}$; **speed ratio** = $\frac{D_A/T_A}{D_B/T_B}$; **distance ratio** = $S \times T$.
- **Race**: winner's distance = race length; loser's distance = race length − lead.
- **Overtake**: LCM-based meeting point.

### CP-020 Population Cross-Tab
- **Cell grid**: male-literate, male-illiterate, female-literate, female-illiterate from two ratios.
- **Fraction queries**: "what fraction of males are literate?" = $\frac{ML}{ML + MI}$.

### CP-021 Election
- **Turnout chain**: voters → polled → valid → candidate.
- **Margin**: winner − loser = $\frac{p - q}{p + q} \times \text{valid votes}$.

### CP-022 Geometric Ratio
- **Area ratio** = (side ratio)² for squares/circles; **volume ratio** = (side ratio)³ for cubes/spheres.
- **Inverse**: find side ratio given area/volume ratio.

---

## 6. Difficulty Framework

### Easy
- 2 partners, full-duration, clean ratio terms (1-6).
- Age-ratio with shift ≤ 5 years, present ratio terms ≤ 5.
- Income-expenditure with equal savings, ratio terms ≤ 5.
- 2-source alloy blend, target given, find mixing ratio.
- Single replacement iteration.
- 2 denominations, total value clean.
- SDT with two ratios given, find the third directly.
- 2×2 population cross-tab, find a cell.
- Election with turnout = 100%, 2 candidates.
- Square area ratio, side ratio ≤ 5.

### Medium
- 3 partners, one joins later or withdraws early.
- Age-ratio "after how many years" solve-for-n.
- Income-expenditure with savings in a stated ratio.
- 3-source alloy blend.
- 2-3 replacement iterations.
- 3 denominations with count-swap condition.
- SDT race with lead distance.
- 2×3 cross-tab, find a fraction.
- Election with turnout < 100% and invalid votes.
- Circle area ratio, radius ratio up to 10.

### Hard
- 4 partners with mid-period investment change.
- Age-ratio with three entities and two shifts.
- Income-expenditure with three entities and unequal savings.
- 3-source blend with target component and unknown mixing ratio.
- 4+ replacement iterations, solve for n or f.
- 4 denominations with multi-swap.
- SDT overtake/meeting problems.
- 2×3 cross-tab with percentage-literate queries.
- Election with three candidates and vote-transfer.
- Sphere/cube volume ratio, inverse (find side ratio from volume ratio).

### Complexity axes
- **Entity count**: more partners/denominations/sources raise SC.
- **Time-weighting complexity**: join/withdraw/mid-change raises RD.
- **Iteration depth**: more replacement cycles raise CE.
- **Cross-tab dimensionality**: 2×2 → 2×3 → 3×3 raises SC.
- **Power of ratio**: area (²) < volume (³); inverse direction raises RD.
- **Algebraic direction**: forward (find value) < reverse (find n, find ratio) raises RD.

### Distribution target (mirrors PCT-007)
- Easy: 32%
- Medium: 34%
- Hard: 34%

---

## 7. Designed Type System (`types.ts`)

Mirrors RAP-002's flat `types.ts` (no `foundation/` subdirectory, per RAP-002's architecture decision):

```ts
export const RAP_003_ARCHETYPE_ID = "RAP-003" as const;

export const RAP_003_CP_IDS = [
  "RAP-CP-013",
  "RAP-CP-014",
  "RAP-CP-015",
  "RAP-CP-016",
  "RAP-CP-017",
  "RAP-CP-018",
  "RAP-CP-019",
  "RAP-CP-020",
  "RAP-CP-021",
  "RAP-CP-022",
] as const;

export const RAP_003_LANGUAGES = ["en", "hi", "pa"] as const;

export type Rap003CanonicalProblemId = (typeof RAP_003_CP_IDS)[number];
export type Rap003Language = (typeof RAP_003_LANGUAGES)[number];
export type Rap003DifficultyBand = "Easy" | "Medium" | "Hard";

export type Rap003TaskKind =
  | "partnershipApplication"            // CP-013
  | "ageRatioTemporalShiftApplication"  // CP-014
  | "incomeExpenditureSavingsApplication" // CP-015
  | "alloyMultiSourceBlendApplication"  // CP-016
  | "repeatedReplacementApplication"    // CP-017
  | "denominationValueApplication"      // CP-018
  | "speedDistanceTimeRatioApplication" // CP-019
  | "populationLiteracyCrossTabApplication" // CP-020
  | "electionVoteShareApplication"      // CP-021
  | "geometricRatioApplication";        // CP-022

export type Rap003AnswerType =
  | "RATIO"
  | "COUNT"
  | "AMOUNT"      // money value (Rs.)
  | "TIME"        // years/months/days/hours
  | "SPEED"       // km/h or m/s
  | "AGE"         // years
  | "PROFIT"      // partner's profit share
  | "PERCENT"     // percentage of population
  | "AREA"        // area ratio or value
  | "VOLUME";     // volume ratio or value

export type Rap003SolveMode =
  // CP-013 Partnership
  | "findProfitShareFromInvestmentAndTime"
  | "findInvestmentFromProfitShare"
  | "findTimeFromProfitShare"
  | "findTotalProfitFromOneShare"
  | "findJoiningPartnerProfit"
  | "findProfitAfterMidPeriodChange"
  // CP-014 Age-Ratio
  | "findPresentAgeFromFutureRatio"
  | "findPresentAgeFromPastRatio"
  | "findYearsToReachRatio"
  | "findPresentAgeOfThirdEntity"
  | "findAgeDifferenceFromRatio"
  // CP-015 Income-Expenditure-Savings
  | "findIncomeFromEqualSavings"
  | "findExpenditureFromEqualSavings"
  | "findSavingsFromIncomeExpenditureRatio"
  | "findIncomeFromSavingsRatio"
  // CP-016 Alloy Blend
  | "findMixingRatioFromTarget"
  | "findTargetComponentFromMix"
  | "findQuantityOfSourceToAdd"
  | "findFinalRatioFromThreeSourceMix"
  // CP-017 Repeated Replacement
  | "findFinalRatioAfterNReplacements"
  | "findIterationsFromFinalRatio"
  | "findReplacementFractionFromFinalRatio"
  | "findInitialRatioFromFinalAfterN"
  // CP-018 Denomination
  | "findCountsFromTotalValue"
  | "findTotalValueFromCounts"
  | "findValueAfterCountSwap"
  | "findCountOfSpecificDenomination"
  // CP-019 SDT Ratio
  | "findTimeRatioFromSpeedAndDistance"
  | "findSpeedRatioFromTimeAndDistance"
  | "findDistanceRatioFromSpeedAndTime"
  | "findRaceLengthFromLead"
  | "findMeetingPointFromSpeeds"
  // CP-020 Population Cross-Tab
  | "findCellFromTwoRatios"
  | "findFractionOfSubgroup"
  | "findTotalPopulationFromCell"
  | "findLiterateCountFromRatios"
  // CP-021 Election
  | "findWinnerVotesFromVoteShare"
  | "findMarginFromVoteShare"
  | "findTotalVotersFromMargin"
  | "findValidVotesFromTurnout"
  // CP-022 Geometric Ratio
  | "findAreaRatioFromSideRatio"
  | "findVolumeRatioFromSideRatio"
  | "findSideRatioFromAreaRatio"
  | "findSideRatioFromVolumeRatio";

export interface Rap003TaskRegistryEntry {
  cpId: Rap003CanonicalProblemId;
  taskKind: Rap003TaskKind;
  solveMode: Rap003SolveMode;
  answerType: Rap003AnswerType;
  requiredVariables: string[];
  scenarioFamily: string;
  contextTag: string;
}

export interface Rap003TaskRegistryLibrary {
  archetypeId: typeof RAP_003_ARCHETYPE_ID;
  ownership: "HUMAN_OWNED";
  authority: string;
  usage: "Runtime Consumption Only";
  entries: Record<string, Rap003TaskRegistryEntry>;
}

export interface Rap003QuestionLanguageEntry {
  template: string;
  difficulty: Rap003DifficultyBand;
}
```

**Design notes:**
- 10 task kinds (one per CP) — mirrors PCT-007's 1-task-kind-per-CP application pattern.
- 40 solve modes — proportionate to PCT-007's 49 for 10 CPs; covers every reasoning pattern in §5.
- Answer types are application-domain-specific: `TIME`, `SPEED`, `AGE`, `PROFIT`, `PERCENT`, `AREA`, `VOLUME` replace the generic `LOGIC`/`RATIO` of RAP-002, reflecting real-world answer shapes.

---

## 8. Designed Library Files

### 8.1 `task-registry.library.json` (shape)

```jsonc
{
  "archetypeId": "RAP-003",
  "ownership": "HUMAN_OWNED",
  "authority": "ExamTree Quant V4 RatioAndProportion RAP-003",
  "usage": "Runtime Consumption Only",
  "entries": {
    "RAP-QL-801": {
      "cpId": "RAP-CP-013",
      "taskKind": "partnershipApplication",
      "solveMode": "findProfitShareFromInvestmentAndTime",
      "answerType": "PROFIT",
      "requiredVariables": ["partnerA", "partnerB", "investmentA", "investmentB", "timeA", "timeB", "totalProfit"],
      "scenarioFamily": "two_partner_full_duration",
      "contextTag": "|business|money"
    }
    // ... 300 entries, 50 per CP, QL range RAP-QL-801 to RAP-QL-1100
  }
}
```

QL ID convention: `RAP-QL-8xx` for CP-013, `9xx` for CP-014, `10xx` for CP-015, ..., `11xx` for CP-022. This continues the RAP-002 numbering (which ended at RAP-QL-706) without collision.

### 8.2 `variable-ranges.library.json` (designed pools)

```jsonc
{
  "archetypeId": "RAP-003",
  "investments": [5000, 6000, 7500, 8000, 10000, 12000, 15000, 20000, 24000, 25000, 30000, 36000, 40000, 45000, 50000, 60000, 72000, 75000, 90000, 100000],
  "durationsMonths": [3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24],
  "totalProfits": [1000, 1200, 1500, 2000, 2400, 2500, 3000, 3600, 4000, 4500, 5000, 6000, 7200, 7500, 8000, 9000, 10000, 12000, 15000, 18000, 20000, 24000, 25000, 30000],
  "ageShifts": [2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 18, 20, 24],
  "ageRatioTerms": [2, 3, 4, 5, 6, 7, 8, 9, 10],
  "incomeRatioTerms": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  "expenditureRatioTerms": [2, 3, 4, 5, 6, 7, 8, 9],
  "alloyComponentRates": [25, 30, 33, 40, 50, 60, 66, 70, 75, 80],
  "replacementFractions": [0.125, 0.2, 0.25, 0.333, 0.4, 0.5],
  "replacementIterations": [1, 2, 3, 4],
  "denominations": [
    { "value": 0.25, "label": "25 paise" },
    { "value": 0.5, "label": "50 paise" },
    { "value": 1, "label": "1 rupee" },
    { "value": 2, "label": "2 rupee" },
    { "value": 5, "label": "5 rupee" },
    { "value": 10, "label": "10 rupee" },
    { "value": 20, "label": "20 rupee" },
    { "value": 50, "label": "50 rupee" },
    { "value": 100, "label": "100 rupee" },
    { "value": 500, "label": "500 rupee" }
  ],
  "denominationCounts": [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50],
  "speeds": [30, 40, 45, 50, 60, 72, 75, 80, 90, 100, 120],
  "distances": [60, 100, 120, 150, 200, 240, 300, 360, 400, 500, 600],
  "times": [2, 3, 4, 5, 6, 8, 10, 12, 15],
  "populations": [1000, 1200, 1500, 2000, 2400, 2500, 3000, 3600, 4000, 5000, 6000, 7200, 7500, 8000, 9000, 10000, 12000, 15000, 18000, 20000, 24000, 25000, 30000, 36000, 40000, 48000, 50000, 60000, 72000, 75000, 80000, 90000, 100000],
  "voterCounts": [1000, 2000, 5000, 10000, 12000, 15000, 18000, 20000, 24000, 25000, 30000, 36000, 40000, 48000, 50000, 60000, 72000, 75000, 80000, 90000, 100000],
  "turnoutPercents": [55, 60, 65, 70, 75, 80, 85, 90],
  "validVotePercents": [80, 85, 88, 90, 92, 95],
  "sideRatios": [2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
  "entities": {
    "partners": ["Aman", "Bhavna", "Chetan", "Dilip", "Esha"],
    "ages": ["father", "son", "mother", "daughter", "brother", "sister"],
    "income": ["Ravi", "Sunita", "Karan", "Pooja"],
    "alloys": ["gold-copper", "silver-copper", "brass", "bronze"],
    "mixture": ["milk-water", "spirit-water", "acid-water", "salt-solution"],
    "denomination": ["coins", "notes"],
    "vehicles": ["car", "bike", "truck", "bus", "train"],
    "population": ["males", "females", "literate", "illiterate"],
    "election": ["candidateA", "candidateB", "candidateC"],
    "geometry": ["squares", "circles", "cubes", "spheres"]
  }
}
```

Design rationale (mirrors PCT-007's curated-pool philosophy):
- All investments/durations/profits chosen so that $I \times T$ products and profit shares yield clean integers for Easy/Medium.
- `replacementFractions` restricted to values where $(1-f)^n$ terminates or rounds cleanly for $n \le 4$.
- `denominations` cover the full Indian coin/note spectrum used in SSC/Punjab exams.
- `populations` and `voterCounts` are multiples of common ratio-term LCMs (12, 24, 36) to keep cell values integer.
- Entity pools include Punjab-localizable names (Aman, Bhavna, Ravi, Sunita) for `pa` localization in Phase 4.

### 8.3 `coverage-targets.library.json`

```jsonc
{
  "archetypeId": "RAP-003",
  "canonicalProblemCount": 10,
  "questionLanguageCount": 300,
  "explanationCount": 10,
  "languageCount": 3
}
```

### 8.4 `distribution-targets.library.json`

```jsonc
{
  "archetypeId": "RAP-003",
  "canonicalProblemDistribution": {
    "RAP-CP-013": 0.12,
    "RAP-CP-014": 0.12,
    "RAP-CP-015": 0.10,
    "RAP-CP-016": 0.10,
    "RAP-CP-017": 0.08,
    "RAP-CP-018": 0.10,
    "RAP-CP-019": 0.10,
    "RAP-CP-020": 0.10,
    "RAP-CP-021": 0.10,
    "RAP-CP-022": 0.08
  },
  "difficultyDistribution": {
    "Easy": 0.32,
    "Medium": 0.34,
    "Hard": 0.34
  }
}
```

Rationale: Partnership (CP-013) and Age-Ratio (CP-014) get the highest weight (0.12 each) because they are the most frequently tested R&P applications in SSC and Punjab State exams. Repeated Replacement (CP-017) and Geometric Ratio (CP-022) get slightly lower weight (0.08) as they are more specialized/trophy questions. Difficulty split mirrors PCT-007 (32/34/34) for cross-chapter consistency.

### 8.5 `question-language.en.json` (template shape, Phase 1)

```jsonc
{
  "RAP-QL-801": {
    "template": "Aman and Bhavna start a business with investments of Rs. {{investmentA}} and Rs. {{investmentB}} respectively. Aman invested for {{timeA}} months and Bhavna for {{timeB}} months. If the total profit at the end of the year is Rs. {{totalProfit}}, what is Aman's share of the profit?",
    "difficulty": "Easy"
  },
  "RAP-QL-901": {
    "template": "The present ages of a father and his son are in the ratio {{ratioA}}:{{ratioB}}. After {{ageShift}} years, the ratio of their ages will become {{futureRatioA}}:{{futureRatioB}}. Find the present age of the father.",
    "difficulty": "Medium"
  }
  // ... 300 entries
}
```

### 8.6 `explanation.en.json` (one per CP, mirrors PCT-007's 1-explanation-per-CP)

```jsonc
{
  "RAP-CP-013": {
    "explanationId": "RAP-ES-013",
    "steps": [
      "In a partnership, profit is divided in the ratio of (Investment × Time) for each partner.",
      "Aman's investment-time product = {{investmentA}} × {{timeA}} = {{productA}}.",
      "Bhavna's investment-time product = {{investmentB}} × {{timeB}} = {{productB}}.",
      "Profit-sharing ratio = {{productA}} : {{productB}} = {{ratioSimplified}}.",
      "Aman's share = ({{productA}} / ({{productA}} + {{productB}})) × {{totalProfit}} = {{answer}}."
    ]
  }
  // ... one entry per CP
}
```

### 8.7 `library-authority-map.md` (mirrors PCT-007)

```markdown
# RAP-003 Library Authority Map

- `task-registry.library.json` maps each QL id to CP, task kind, solve mode, answer type, and required variables.
- `question-language.en.json` is the English stem source of truth.
- `question-language.hi.json` and `question-language.pa.json` preserve placeholder parity for runtime checks.
- `explanation.en.json` maps CP ids to explanation ids.
- `variable-ranges.library.json` documents curated numeric pools used by the parameter generator.
- `coverage-targets.library.json` and `distribution-targets.library.json` document expected coverage counts and balance targets.
```

---

## 9. Designed Package Structure (flat, mirrors RAP-002)

Target path:
`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/`

```
RAP-003/
├── archetype.md                      (NEW)
├── canonical-problems.md             (NEW)
├── reasoning-patterns.md             (NEW)
├── difficulty-framework.md           (NEW)
├── implementation-plan.md            (NEW)
├── rap-003-readiness-report.md       (NEW — created at Phase 1 start)
├── library-authority-map.md          (NEW — Phase 5)
├── task-registry.library.json        (NEW)
├── variable-ranges.library.json      (NEW)
├── coverage-targets.library.json     (NEW)
├── distribution-targets.library.json (NEW)
├── question-language.en.json         (NEW — Phase 1)
├── question-language.hi.json         (NEW — Phase 4)
├── question-language.pa.json         (NEW — Phase 4)
├── explanation.en.json               (NEW — Phase 1)
├── explanation.hi.json               (NEW — Phase 4)
├── explanation.pa.json               (NEW — Phase 4)
├── types.ts                          (NEW)
├── math.ts                           (NEW)
├── library.ts                        (NEW)
├── parameter-generator.ts            (NEW)
├── solver.ts                         (NEW)
├── explanation-renderer.ts           (NEW)
├── validator.ts                      (NEW)
├── pipeline.ts                       (NEW)
├── index.ts                          (NEW)
├── rap-003.test.ts                   (NEW)
├── rap-003-coverage-audit.ts         (NEW — Phase 2)
├── rap-003-multilingual-audit.ts     (NEW — Phase 4)
├── rap-003-question-studio-smoke.ts  (NEW — Phase 3)
├── rap-003-maturity-audit.md         (NEW — Phase 5)
├── rap-003-pre-freeze-coverage-audit.md (NEW — Phase 5)
└── rap-003-freeze-record.md          (NEW — Phase 5)
```

**Architecture decision:** Use the RAP-002 flat architecture (no `foundation/` subdirectory), per RAP-002's own architecture decision. This keeps the R&P family internally consistent and differs from the PCT-007 `foundation/` layout only in folder shape — the runtime contract is identical.

---

## 10. Designed Runtime Contract (`pipeline.ts`)

Mirrors RAP-002's `runRap002Pipeline`:

```ts
export function runRap003Pipeline(
  cpId: Rap003CanonicalProblemId,
  input: Rap003ParameterInput = {}
): Rap003QuestionPackage {
  const parameters = generateRap003Parameters(cpId, input);
  const solver = solveRap003(parameters);
  const explanation = renderRap003Explanation(parameters, solver);
  const stem = renderTemplate(
    getQuestionEntry(cpId, parameters.questionLanguageId, parameters.language).template,
    parameters.variables
  );
  const basePackage = {
    archetypeId: RAP_003_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: parameters.questionId,
    questionLanguageId: parameters.questionLanguageId,
    explanationId: parameters.explanationId,
    language: parameters.language,
    difficultyBand: parameters.difficultyBand,
    stem,
    answer: solver.answer,
    parameters,
    solver,
    explanation,
    traceability: {
      questionId: parameters.questionId,
      canonicalProblemId: cpId,
      questionLanguageId: parameters.questionLanguageId,
      explanationId: parameters.explanationId,
      difficultyBand: parameters.difficultyBand,
      taskKind: parameters.taskKind,
      solveMode: parameters.solveMode,
      answerType: parameters.answerType,
      answer: solver.answer,
    },
    mathJax: solver.mathJax,
  };
  const validation = validateRap003QuestionPackage({
    ...basePackage,
    validation: { valid: false, checks: [] },
  });
  return { ...basePackage, validation };
}

export function runRap003ForLanguages(
  cpId: Rap003CanonicalProblemId,
  input: Rap003ParameterInput = {}
) {
  const base = generateRap003Parameters(cpId, {
    ...input, language: "hi", questionLanguageId: undefined
  });
  return (["en", "hi", "pa"] as Rap003Language[]).map((language) =>
    runRap003Pipeline(cpId, {
      ...input, language,
      questionLanguageId: base.questionLanguageId,
      difficultyBand: base.difficultyBand,
      seed: input.seed,
    })
  );
}
```

### Solver responsibilities per CP

| CP | Solver logic |
|---|---|
| RAP-CP-013 | $P_i = \frac{I_i \times T_i}{\sum I_j T_j} \times P_{total}$; supports join-later (subtract join month), withdraw-early, mid-change (sum sub-periods). |
| RAP-CP-014 | Constant-difference invariant; cross-product isolation for present age; solve-for-n for "after how many years". |
| RAP-CP-015 | Two ratio systems reconciliation; equal-savings or savings-ratio constraint. |
| RAP-CP-016 | Weighted-average of component fractions; mixing-ratio via alligation logic. |
| RAP-CP-017 | Final pure-component fraction = $c_0 (1-f)^n$; inverse for n or f. |
| RAP-CP-018 | Value equation $\sum n_i v_i = V$ with count-ratio; count-swap delta. |
| RAP-CP-019 | SDT triangle: $T = D/S$, $S = D/T$, $D = S \times T$ on ratios; race lead; overtake LCM. |
| RAP-CP-020 | 2D cell grid from two ratios; fraction and percentage queries. |
| RAP-CP-021 | Turnout → polled → valid → candidate chain; margin = $\frac{p-q}{p+q} \times \text{valid}$. |
| RAP-CP-022 | Area ratio = (side ratio)²; volume ratio = (side ratio)³; inverse via square/cube root. |

### Validator invariants (RAP-003-specific)

- Partnership: every partner's $I \times T > 0$; profit shares sum to total profit.
- Age-ratio: present ages positive; age difference consistent across all stated ratios; shift years positive.
- Income-expenditure: income ≥ expenditure for each entity (savings non-negative).
- Alloy blend: each source component fraction in [0,1]; target fraction strictly between min and max source fractions.
- Repeated replacement: $0 < f < 1$; $n \ge 1$; final pure-component fraction in $(0, c_0]$.
- Denomination: all counts positive integers; total value matches $\sum n_i v_i$ within rounding epsilon.
- SDT: all speeds/distances/times positive; race length > lead; meeting point ≤ race length.
- Population cross-tab: all cell counts non-negative integers; row/column sums match marginal ratios.
- Election: turnout ≤ 100%; valid ≤ polled; candidate vote shares sum to 100% of valid.
- Geometric: side ratio > 0; area/volume ratios positive; inverse recovers side ratio within epsilon.
- Rounding: no traceability drift (final answer matches solver output within stated precision).

---

## 11. Phased Build Plan

### Phase 0: Design (this report)
- [x] This design report.
- [ ] Create `archetype.md`, `canonical-problems.md`, `reasoning-patterns.md`, `difficulty-framework.md`, `implementation-plan.md`.
- [ ] Create initial `task-registry.library.json` scaffold.

### Phase 1: English Runtime MVP (`RAP-CP-013` and `RAP-CP-014` first)
Start with the two highest-frequency CPs (Partnership and Age-Ratio).
Files: `types.ts`, `math.ts`, `question-language.en.json`, `variable-ranges.library.json`, `distribution-targets.library.json`, `library.ts`, `parameter-generator.ts`, `solver.ts`, `explanation-renderer.ts`, `validator.ts`, `pipeline.ts`, `index.ts`, `rap-003.test.ts`.
Initial solve modes: `findProfitShareFromInvestmentAndTime`, `findJoiningPartnerProfit`, `findPresentAgeFromFutureRatio`, `findYearsToReachRatio`.
QL target: 20-30 smoke QLs across the two CPs.

### Phase 2: English Expansion (remaining 8 CPs in batches)
- Batch 2: `RAP-CP-015` income-expenditure-savings + `RAP-CP-018` denomination.
- Batch 3: `RAP-CP-016` alloy blend + `RAP-CP-017` repeated replacement.
- Batch 4: `RAP-CP-019` SDT ratio + `RAP-CP-022` geometric ratio.
- Batch 5: `RAP-CP-020` population cross-tab + `RAP-CP-021` election vote-share.
Each batch adds QLs, registry mappings, variable generation, solver logic, explanations, and tests together. Scale to 300 QLs (50 per CP).
Add `rap-003-coverage-audit.ts` and run maturity audit.

### Phase 3: Generation-Engine Integration
- Add `RAP-003` discovery/routing in `generation-engine.ts` (mirror the existing `isRatioChapterRequest()` pattern, extend to recognize RAP-003).
- Add normal export smoke (`rap-003-question-studio-smoke.ts`).
- Verify metadata, options, explanations, and validation summary shape.
- Keep student/public exposure off until reviewed.
- English-only guard in validator until Phase 4.

### Phase 4: Multilingual Backend
- Add `question-language.hi.json`, `question-language.pa.json`.
- Add `explanation.en.json`, `explanation.hi.json`, `explanation.pa.json`.
- Add `rap-003-multilingual-audit.ts`.
- Use shared entity libraries and `language-coverage.ts`.
- Punjab-localized entity pools (names, crops, districts) for `pa`.
- Keep HI/PA frontend exposure off until audit passes.

### Phase 5: Governance & Freeze
- Produce `library-authority-map.md`.
- Generate human review CSVs for en, hi, pa.
- Produce `rap-003-pre-freeze-coverage-audit.md`, `rap-003-maturity-audit.md`, `rap-003-freeze-record.md`.

---

## 12. Cross-Chapter Consistency

| Dimension | RAP-001 | RAP-002 | RAP-003 (designed) | Consistent? |
|---|---|---|---|---|
| Architecture | flat + renderers/semantic/ | flat | flat | ✅ (RAP-002/003 flat) |
| Pipeline contract (`run*Pipeline` + `run*ForLanguages`) | yes | yes | yes | ✅ |
| Library ownership (`HUMAN_OWNED`, `Runtime Consumption Only`) | yes | yes | yes | ✅ |
| QL ID convention (`RAP-QL-###`) | `001-027` | `201-706` | `801-1100` | ✅ (no collision) |
| CP ID convention (`RAP-CP-###`) | `001-006` | `007-012` | `013-022` | ✅ (no collision) |
| Difficulty split | mixed | 0/60/40 (MVP) | 32/34/34 | ✅ (mirrors PCT-007 at scale) |
| Languages | en, hi, pa | en (MVP) | en, hi, pa (en-first) | ✅ |
| 1 task kind per CP (applications) | no (mechanics) | no (mechanics) | yes | ✅ (mirrors PCT-007) |
| 1 explanation per CP | yes | yes | yes | ✅ |
| Traceability block shape | yes | yes | yes | ✅ |
| MathJax in solver output | yes | yes | yes | ✅ |

---

## 13. Real-World Exam Coverage Matrix

| CP | SSC CGL Tier-1 | SSC CGL Tier-2 | Banking PO | Punjab PCS | Punjab Patwari/PSSSB |
|---|---|---|---|---|---|
| CP-013 Partnership | ●● | ●●● | ●●● | ●● | ● |
| CP-014 Age-Ratio | ●●● | ●●● | ● | ●●● | ●● |
| CP-015 Income-Expenditure | ●● | ●●● | ● | ●● | ●● |
| CP-016 Alloy Blend | ● | ●● | ●●● | ● | ● |
| CP-017 Repeated Replacement | ● | ●● | ●●● | ● | ● |
| CP-018 Denomination | ●● | ●● | ● | ●● | ●●● |
| CP-019 SDT Ratio | ●● | ●●● | ●● | ●● | ● |
| CP-020 Population Cross-Tab | ●● | ●● | ● | ●● | ●● |
| CP-021 Election Vote-Share | ●● | ●● | ● | ●● | ●● |
| CP-022 Geometric Ratio | ● | ●●● | ● | ● | ● |

(● = appears; ●● = frequent; ●●● = high frequency / trophy question)

This matrix confirms every CP maps to real, high-frequency exam questions across the three target exam families, with no "filler" CPs.

---

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Partnership mid-period change produces fractional months. | Constrain durations to integer months; validator rejects fractional month products. |
| Age-ratio cross-product can yield non-integer ages for some ratio pairs. | Constrain ratio-term pairs so that $(p \cdot s - q \cdot r)$ divides $n$ cleanly; validator checks integer age. |
| Income-expenditure with three entities can produce non-terminating savings. | Restrict three-entity cases to ratio terms whose LCM keeps savings integer; flag CE-Hard. |
| Alloy blend with three sources has a degree of freedom (non-unique mixing ratio). | Fix one source quantity or constrain mixing ratio to integer terms; validator checks uniqueness. |
| Repeated replacement with irrational $f$ (e.g., 1/3) produces non-terminating decimals. | Restrict $f$ to $\{1/8, 1/5, 1/4, 1/3, 2/5, 1/2\}$ and round to 2 decimals; validator allows 2-dp tolerance. |
| Denomination count-swap can produce negative counts. | Validator enforces all counts ≥ 0 pre- and post-swap. |
| SDT overtake/meeting can produce large LCMs. | Cap speeds/distances at pool maxima; flag CE-Hard for LCM > 600. |
| Population cross-tab with percentage queries can drift on rounding. | Carry full-precision cell counts; round only at final answer; validator checks $|computed - stated| < \epsilon$. |
| Election with three candidates and vote-transfer is algebraically heavy. | Restrict three-candidate cases to Medium/Hard bands only; keep Easy two-candidate. |
| Geometric inverse (cube root) may be irrational. | Restrict volume ratios to perfect cubes of side-ratio terms in the pool; validator checks exact cube root. |
| Generation engine doesn't yet route RAP-003. | Phase 3 adds routing; do not expose publicly until smoke passes. |
| RAP-002 is English-only MVP — RAP-003 en-first avoids cross-chapter multilingual debt. | Phase 4 localizes RAP-003 only after English runtime is stable; do not block on RAP-002 multilingual. |

---

## 15. Recommended Implementation Agent Prompt Skeleton

(Adapted from PCT-007's implementation plan and RAP-002's readiness report)

```
You are implementing RAP-003 Real-World Applications of Ratio & Proportion for Quant V4.
Reference template (structure): PCT-007 Mixed Applications of Percentage.
Reference template (family architecture): RAP-002 Compound Proportions & Linked Ratios.
Reference paths:
  .../Percentage/PCT-007/
  .../RatioAndProportion/RAP-002/
Target path:
  .../RatioAndProportion/RAP-003/

Phase 1 scope: RAP-CP-013 (Partnership) and RAP-CP-014 (Age-Ratio) English runtime MVP only.
1. Mirror the RAP-002 flat package shape (no foundation/ subdirectory).
2. Use PCT-007's 1-task-kind-per-CP, application-flavored solve-mode pattern.
3. Generate the task registry and 20-30 English QLs from deterministic family definitions.
4. Implement chapter-specific generator, solver, validator, and explanation behavior.
5. Run JSON, duplicate, placeholder, render, finite-answer, and bundled test checks.
6. Produce implementation and content-audit reports.
Do not add HI/PA until Phase 4. Do not wire generation-engine.ts until Phase 3.
Do not duplicate RAP-001/002 mechanics as standalone CPs.
```

---

## 16. Summary

RAP-003 is the **applications chapter** that completes the Ratio & Proportion family in Quant V4, exactly as PCT-007 completes the Percentage family. The design:

- Fills the real-world application gap left by RAP-001 (mechanics) and RAP-002 (chains).
- Defines 10 CPs, each anchored to a high-frequency SSC/Banking/Punjab State exam scenario family.
- Specifies 10 task kinds, 40 solve modes, 10 answer types, 300 QLs, 3 languages.
- Mirrors PCT-007's structure (1-task-kind-per-CP, 1-explanation-per-CP, 32/34/34 difficulty) and RAP-002's flat architecture.
- Provides Average-specific validator invariants and risk mitigations per CP.
- Phases the build en-first (Partnership + Age-Ratio MVP → expand → engine integration → multilingual → freeze).
- Includes a real-world exam coverage matrix proving every CP maps to actual exam questions.

**No files were modified.** This report is the blueprint for the subsequent implementation pass.
