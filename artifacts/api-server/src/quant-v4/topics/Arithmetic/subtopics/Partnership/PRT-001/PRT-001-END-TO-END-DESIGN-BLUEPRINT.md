# PRT-001 — Partnership
## End-to-End Chapter Design Blueprint

**Status:** Design baseline; implementation must not begin until Phase-A design-freeze checks pass.  
**Subject:** ExamTree Quant V4 → Arithmetic  
**Chapter ID:** `PRT-001`  
**Student-facing title:** **Partnership**  
**Primary exams:** SSC CGL/CHSL/MTS/GD/CPO, Banking (IBPS/SBI/RRB), Railway, Punjab state and comparable state-level competitive examinations  
**Runtime languages:** English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)  
**Design date:** 26 August 2026

---

## 1. Executive decision

`PRT-001` is one student-facing Partnership chapter backed by two reusable mathematical engines:

1. an **effective-capital timeline engine**, where each partner's weight is the exact sum of capital × active duration across all capital segments;
2. a **profit-allocation engine**, which applies explicit pre-distribution deductions/remuneration and then distributes the remaining profit or loss in the effective-capital ratio.

The chapter must be exhaustive without manufacturing fake variety. A Question Language (QL) exists only when the exam task contract materially differs in its given/unknown structure, timeline inference, allocation ordering, answer contract, or misconception profile. Changing names, business objects, month numbers or wording alone does not create a new solve mode.

The core invariant is:

\[
\text{profit/loss share weight}_i = \sum_j C_{ij}T_{ij}
\]

where partner `i` may have one or more capital segments `j`.

After any explicit salary, commission, reserve, charity or expense rule is applied in the order stated in the question:

\[
\text{share}_i = \text{distributable pool}\times
\frac{W_i}{\sum_k W_k}
\]

where `W_i` is the partner's effective-capital weight.

**Counts are discovery baselines, not quotas.** The chapter is not frozen until forward, reverse, inverse, equal-share, join/leave, capital-change, multi-partner, remuneration, deduction and mixed variants have been audited and superficial duplicates have been removed.

---

## 2. Source and product basis

The design follows the mature Quant V4 architecture already used in Percentage, Average, Profit & Loss, Ratio & Proportion and Time & Work:

- typed canonical problems and solve modes;
- a human-owned task registry;
- curated variable and object pools;
- human-authored Question Languages rather than runtime paraphrasing;
- exact solver + independent verifier;
- reasoning graph and question-specific explanation renderer;
- multilingual EN/HI/PA parity;
- coverage, distribution, realism and maturity audits;
- design-freeze and implementation-freeze records.

Contemporary SSC/Banking preparation sources consistently group the real exam domain around simple partnership, capital × time, later joining/early leaving, capital additions/withdrawals, reverse unknowns, working-partner salary/commission and pre-distribution deductions. Those are treated here as mathematical task families, not copied question wording.

---

## 3. Scope and ownership boundaries

### 3.1 Included

The chapter owns:

- two-, three- and multi-partner profit or loss sharing;
- same-period partnership where share ratio equals capital ratio;
- unequal investment duration;
- partners joining after the business starts;
- partners leaving before the business ends;
- staggered joins and exits;
- capital additions and withdrawals during the partnership;
- percentage/fractional capital increases or reductions;
- multiple capital segments for one or more partners;
- reverse questions for unknown capital, duration, join month, leave month, change amount, change month, total profit or individual share;
- equal-profit/equal-share conditions;
- working/active partner fixed salary, management allowance, bonus or commission when the stem explicitly defines it;
- sleeping/dormant partners as a wording/context variant unless remuneration changes the mathematics;
- charity, reserve or explicit business expense deducted before distribution when the stem states the ordering;
- multi-partner relation systems using capital ratios, time ratios, share ratios, multiples, differences or totals;
- hard mixed questions combining timeline events and allocation rules;
- profit and loss distribution using the same contribution weights;
- exact answer generation for ratio, rupee amount, capital, duration, month/event position, percentage and difference.

### 3.2 Excluded or delegated

The chapter does **not** own:

- finding business profit from cost price, selling price, discount or markup → `ProfitAndLoss`;
- pure ratio division with no partnership/capital-time relation → `RatioAndProportion`;
- interest earned on invested capital → `Interest`;
- work-rate contribution and wage distribution based on labour performed → `TimeAndWork`;
- weighted-average questions without a partnership profit-sharing contract → `Average`;
- partnership accounting topics such as goodwill, revaluation account, sacrificing ratio, gaining ratio, partner capital accounts, dissolution or admission accounting;
- legal partnership rules;
- data-sufficiency as a new Partnership CP. Data Sufficiency may wrap proven Partnership tasks through the dedicated DS architecture;
- free-form runtime story generation;
- ambiguous rules such as commission “on profit” without saying whether it applies to gross or remaining profit.

### 3.3 Boundary rules

1. **Capital-time contribution is first-class.** Never solve dynamic partnership by averaging snapshots unless mathematically equivalent and independently verified.
2. **Event semantics are explicit.** “B joins after 4 months” means B contributes for the remaining duration, not for 4 months.
3. **Capital changes are piecewise.** If A adds ₹x after month `m`, old capital applies to the first `m` months and new capital to the remaining months.
4. **Withdrawal is not exit.** “Withdraws ₹x” reduces capital; “withdraws his entire capital/leaves” ends participation.
5. **Allocation order is part of the problem contract.** Salary/commission/charity/reserve must be applied exactly in the order declared.
6. **No hidden 12-month assumption.** A 12-month duration may be inferred only when the stem explicitly says one year/year-end or supplies equivalent dates.
7. **Loss uses the same weights** unless the stem explicitly states a different contractual rule.
8. **Working vs sleeping partner is not a separate CP** unless remuneration changes the distribution logic.

---

## 4. Canonical mathematical model

### 4.1 Core types

```ts
type MoneyUnit = "RUPEE";
type TimeUnit = "MONTH" | "YEAR";

type AllocationBasis =
  | "FIXED_AMOUNT"
  | "PERCENT_OF_GROSS_PROFIT"
  | "PERCENT_OF_POST_DEDUCTION_POOL";

interface Rational {
  numerator: bigint;
  denominator: bigint;
}

interface CapitalSegment {
  start: Rational;
  end: Rational;
  capital: Rational;
}

interface Partner {
  partnerId: string;
  role: "ACTIVE" | "SLEEPING" | "UNSPECIFIED";
  capitalSegments: CapitalSegment[];
}

interface PreDistributionAllocation {
  recipientPartnerId?: string;
  kind: "SALARY" | "COMMISSION" | "BONUS" | "CHARITY" | "RESERVE" | "EXPENSE";
  basis: AllocationBasis;
  value: Rational;
  sequence: number;
}

interface PartnershipState {
  totalDuration: Rational;
  grossProfitOrLoss: Rational;
  partners: Partner[];
  allocations: PreDistributionAllocation[];
}
```

### 4.2 Effective capital

For one constant capital:

\[
W_i=C_iT_i
\]

For piecewise capital:

\[
W_i=\sum_j C_{ij}(t_{j,end}-t_{j,start})
\]

Profit/loss sharing ratio:

\[
A:B:C=W_A:W_B:W_C
\]

### 4.3 Same-time shortcut

If all partners invest for the same duration:

\[
A:B:C=C_A:C_B:C_C
\]

### 4.4 Same-capital shortcut

If capitals are equal:

\[
A:B:C=T_A:T_B:T_C
\]

### 4.5 Partner share

\[
S_i=P_d\times\frac{W_i}{\sum_k W_k}
\]

where `P_d` is the distributable profit/loss pool after explicit prior allocations.

### 4.6 Reverse reconstruction

If the share ratio and all but one contribution variable are known:

\[
\frac{W_A}{W_B}=\frac{S_A}{S_B}
\]

Solve exactly for the unknown capital, active duration or event position.

### 4.7 Working-partner remuneration

If a working partner receives a fixed amount `R` before distribution:

\[
P_d=P-R
\]

If remuneration is `r%` of gross profit:

\[
R=\frac{r}{100}P,\qquad P_d=P-R
\]

The active partner's total receipt is:

\[
R+P_d\frac{W_i}{\sum W}
\]

### 4.8 Deduction before distribution

For an explicit deduction `D`:

\[
P_d=P-D
\]

If several allocations exist, the engine applies them by `sequence`; the question language must make that order semantically explicit.

### 4.9 Exact arithmetic

Canonical mathematics uses integers/reduced rational arithmetic. Floating point is not authoritative. Easy/Medium MCQs should overwhelmingly resolve to clean integer rupee amounts; awkward paise outcomes are rejected unless explicitly designed.

Required helpers include:

- `addRational`, `subtractRational`, `multiplyRational`, `divideRational`;
- `reduceRational`, `compareRational`;
- `sumCapitalTimeSegments`;
- `normalizeRatio`;
- `computeDistributablePool`;
- `allocateByEffectiveCapital`;
- `solveLinearContributionUnknown`;
- `formatMoney`, `formatDuration`, `formatRatio`.

---

## 5. Canonical Problem architecture

### PRT-CP-001 — Simple Partnership: Same Investment Period

**Ownership:** All partners have one constant capital and equal active duration; the tested inference is direct capital-ratio profit/loss sharing.

**Core reasoning:** equal time cancels, so share ratio = capital ratio.

**Solve-mode discovery baseline:**

- `findProfitRatioFromCapitals`
- `findPartnerShareFromTotalProfitAndCapitals`
- `findTotalProfitFromPartnerShareAndCapitals`
- `findOtherPartnerShareFromKnownShareAndCapitals`
- `findProfitDifferenceFromTotalProfitAndCapitals`
- `findTotalProfitFromShareDifferenceAndCapitals`
- `findUnknownCapitalFromProfitRatio`
- `findUnknownCapitalFromPartnerShares`
- `findCapitalRatioFromProfitShares`
- `findLossShareFromCapitals`
- `findTotalCapitalFromCapitalRatioAndOneCapital`
- `findIndividualCapitalsFromTotalCapitalAndProfitRatio`

**Exam-real stem families:** business started jointly, shop/firm/agency investment, annual profit split, annual loss split, one partner's receipt given, difference between receipts.

---

### PRT-CP-002 — Fixed Capital with Unequal Investment Duration

**Ownership:** Each partner has one constant capital, but active durations differ and are given directly rather than inferred from join/leave events.

**Core reasoning:** share weight = capital × duration.

**Solve-mode discovery baseline:**

- `findProfitRatioFromCapitalAndDuration`
- `findPartnerShareFromTotalProfitCapitalDuration`
- `findTotalProfitFromPartnerShareCapitalDuration`
- `findUnknownCapitalFromShareRatioAndDurations`
- `findUnknownDurationFromShareRatioAndCapitals`
- `findCapitalRatioFromProfitRatioAndTimeRatio`
- `findTimeRatioFromProfitRatioAndCapitalRatio`
- `findCapitalForEqualProfitGivenDurations`
- `findDurationForEqualProfitGivenCapitals`
- `findProfitDifferenceFromCapitalDurationWeights`
- `findTotalProfitFromShareDifferenceAndWeights`
- `findMissingPartnerShareFromKnownShareAndWeights`

**Boundary:** if duration must be inferred from “joins after/leaves after”, use CP-003.

---

### PRT-CP-003 — Joining, Leaving and Staggered Participation

**Ownership:** One or more partners enter after the business begins or leave before the partnership ends; event wording must be converted to actual active duration.

**Core reasoning:** infer each partner's active interval, then use capital × active duration.

**Solve-mode discovery baseline:**

- `findProfitRatioWhenPartnerJoinsLater`
- `findProfitRatioWhenPartnerLeavesEarly`
- `findShareWhenPartnerJoinsLater`
- `findShareWhenPartnerLeavesEarly`
- `findProfitRatioWithMultipleStaggeredJoins`
- `findProfitRatioWithJoinAndLeaveEvents`
- `findUnknownJoinTimeFromProfitRatio`
- `findUnknownLeaveTimeFromProfitRatio`
- `findUnknownJoinTimeFromPartnerShare`
- `findUnknownLeaveTimeFromPartnerShare`
- `findJoinTimeForEqualProfitShares`
- `findLeaveTimeForEqualProfitShares`
- `findUnknownCapitalOfLateJoiningPartner`
- `findUnknownCapitalOfEarlyLeavingPartner`
- `findTotalProfitFromStaggeredPartnerShare`
- `findShareDifferenceWithStaggeredParticipation`

**Event guard examples:**

- “B joins after 4 months in a one-year business” → B duration = 8 months.
- “B joins for the last 4 months” → B duration = 4 months.
- “A leaves after 7 months” → A duration = 7 months.

These are semantically distinct templates and must not share the wrong duration helper.

---

### PRT-CP-004 — Capital Addition, Withdrawal and Piecewise Investment

**Ownership:** At least one partner's capital changes while the partner remains in the business.

**Core reasoning:** split the timeline into capital segments and sum capital-month contributions.

**Solve-mode discovery baseline:**

- `findProfitRatioAfterCapitalAddition`
- `findProfitRatioAfterCapitalWithdrawal`
- `findShareAfterCapitalAddition`
- `findShareAfterCapitalWithdrawal`
- `findProfitRatioAfterPercentageCapitalIncrease`
- `findProfitRatioAfterPercentageCapitalDecrease`
- `findProfitRatioAfterFractionalCapitalChange`
- `findProfitRatioWithMultipleChangesForOnePartner`
- `findProfitRatioWithChangesForMultiplePartners`
- `findUnknownAddedCapitalFromProfitRatio`
- `findUnknownWithdrawnCapitalFromProfitRatio`
- `findUnknownCapitalChangeTimeFromProfitRatio`
- `findUnknownCapitalChangeTimeFromPartnerShare`
- `findUnknownPercentageCapitalChange`
- `findInitialCapitalFromFinalShareAndChangeHistory`
- `findCapitalChangeForEqualProfitShares`
- `findEventTimeForEqualProfitShares`
- `compareEffectiveCapitalsAfterDifferentChanges`

**Generation rule:** “withdraws one-fourth of his capital” must state whether the fraction refers to original or then-existing capital if more than one event has occurred.

---

### PRT-CP-005 — Multi-Partner and Relational Partnership Systems

**Ownership:** Three or more partners, or contribution variables are given through ratios/multiples/differences rather than as fully explicit capitals and durations.

**Core reasoning:** reconstruct comparable effective-capital weights, then distribute or invert.

**Solve-mode discovery baseline:**

- `findThreePartnerProfitRatio`
- `findFourPartnerProfitRatio`
- `findMultiPartnerSharesFromTotalProfit`
- `findUnknownCapitalInThreePartnerSystem`
- `findUnknownDurationInThreePartnerSystem`
- `findTotalProfitFromOnePartnerShareInMultiPartnerSystem`
- `findTotalProfitFromDifferenceBetweenTwoShares`
- `findSharesFromCapitalMultiplesAndDurations`
- `findSharesFromTimeMultiplesAndCapitals`
- `findCapitalRatioFromPartnerShareRelations`
- `findDurationRatioFromPartnerShareRelations`
- `findMissingPartnerWeightFromPairwiseShareRatios`
- `findIndividualCapitalsFromTotalCapitalAndRatios`
- `findPartnerShareWhenOneWeightIsSumOfOthers`
- `findUnknownCapitalFromEqualShareConditionInMultiPartnerSystem`
- `findUnknownDurationFromEqualShareConditionInMultiPartnerSystem`

**Difficulty guard:** multi-partner questions are not automatically Hard; hardness comes from reconstruction depth and event count, not partner count alone.

---

### PRT-CP-006 — Working Partner Remuneration and Pre-Distribution Deductions

**Ownership:** Profit is not distributed directly because one or more explicit allocations/deductions occur before capital-time sharing.

**Core reasoning:** calculate the correct distributable pool, then split by contribution weights, then add any partner-specific remuneration to that partner's final receipt.

**Solve-mode discovery baseline:**

- `findActivePartnerTotalReceiptWithFixedSalary`
- `findSleepingPartnerShareWithActivePartnerSalary`
- `findPartnerSharesAfterFixedManagementAllowance`
- `findActivePartnerReceiptWithPercentOfGrossProfitCommission`
- `findOtherPartnerShareWithPercentCommission`
- `findSharesAfterCharityDeduction`
- `findSharesAfterReserveDeduction`
- `findSharesAfterExplicitBusinessExpenseDeduction`
- `findTotalProfitFromActivePartnerFinalReceipt`
- `findTotalProfitFromSleepingPartnerReceipt`
- `findUnknownSalaryFromFinalPartnerReceipts`
- `findUnknownCommissionPercentFromFinalReceipt`
- `findUnknownDeductionFromPartnerShare`
- `findProfitRatioFromFinalReceiptsWhenOnePartnerGetsSalary`
- `findPartnerReceiptWithSalaryAndDeduction`
- `findPartnerReceiptsWithMultipleOrderedAllocations`

**Semantic safety:** commission basis must be explicit. “10% commission on total profit” and “10% of the amount remaining after reserve” are different solve contracts.

---

### PRT-CP-007 — Integrated Compound Partnership

**Ownership:** Real exam-hard questions requiring at least two Partnership mechanisms together, such as capital timeline + join/leave, dynamic capital + remuneration, or multi-partner reverse reconstruction.

**Core reasoning:** build the timeline first, derive effective-capital weights, apply allocation order, then solve the requested inverse or distribution.

**Solve-mode discovery baseline:**

- `findShareWithLateJoinAndCapitalChange`
- `findProfitRatioWithJoinLeaveAndCapitalChange`
- `findShareWithDynamicCapitalAndWorkingPartnerSalary`
- `findShareWithDynamicCapitalAndPercentCommission`
- `findMultiPartnerSharesWithStaggeredEvents`
- `findUnknownJoinTimeWithCapitalChangeHistory`
- `findUnknownCapitalWithStaggeredParticipation`
- `findUnknownEventTimeWithPreDistributionDeduction`
- `findTotalProfitFromMixedTimelineFinalReceipt`
- `findDifferenceBetweenFinalReceiptsInMixedSystem`
- `findEqualFinalReceiptsConditionWithRemuneration`
- `findReverseContributionFromMixedPartnerRelations`

**Anti-bloat rule:** CP-007 owns genuinely integrated topologies only. A direct CP-003 question with longer wording must not be moved here.

---

## 6. Solve-mode and QL policy

The baseline above contains **102 named solve modes** across 7 CPs. This is deliberately a discovery inventory, not a promise that all 102 survive freeze as independent modes. During design audit:

- merge modes that differ only by output naming but share the same unknown contract;
- retain inverse modes when they require materially different equation setup or distractor logic;
- retain event modes when duration inference changes;
- retain remuneration modes when allocation basis/order changes;
- add source-backed gaps uncovered by PYQ-style audit.

Expected final QL footprint is likely **300–380 human-authored English QLs**, then semantically localized to Hindi and Punjabi, but final counts are frozen only after coverage audits. High-frequency solve modes should have multiple structural stem families; no important mode should survive with only a single wording template.

### QL diversity requirements

A QL pool must vary more than names/numbers. Across the chapter, stems should cover:

- direct ratio request;
- individual share request;
- total-profit reverse request;
- difference-between-shares request;
- equal-share condition;
- unknown capital;
- unknown duration/event position;
- one-year and non-one-year timelines;
- two-, three- and four-partner systems;
- explicit month durations and inferred join/leave durations;
- amount, fraction and percentage capital changes;
- active/sleeping partner terminology only where semantically useful;
- profit and occasional loss contexts;
- plain business wording and a restrained set of realistic contexts.

No runtime LLM paraphrasing is required for coverage.

---

## 7. Question Studio data architecture

Target path:

`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Partnership/PRT-001/`

```text
PRT-001/
├── PRT-001-END-TO-END-DESIGN-BLUEPRINT.md
├── archetype.md
├── canonical-problems.md
├── difficulty-framework.md
├── reasoning-patterns.md
├── implementation-plan.md
├── library-authority-map.md
├── task-registry.library.json
├── variable-ranges.library.json
├── object-pools.library.json
├── coverage-targets.library.json
├── distribution-targets.library.json
├── question-language.en.json
├── question-language.hi.json
├── question-language.pa.json
├── explanation.en.json
├── explanation.hi.json
├── explanation.pa.json
├── index.ts
├── prt-001.test.ts
├── prt-001-coverage-audit.ts
├── prt-001-context-realism-audit.ts
├── prt-001-multilingual-audit.ts
├── prt-001-option-quality-audit.ts
└── foundation/
    ├── types.ts
    ├── library.ts
    ├── math.ts
    ├── capital-timeline.ts
    ├── allocation-engine.ts
    ├── parameter-generator.ts
    ├── solver.ts
    ├── independent-verifier.ts
    ├── reasoning-graph.ts
    ├── explanation-renderer.ts
    ├── distractor-generator.ts
    ├── validator.ts
    ├── pipeline.ts
    └── coverage-auditor.ts
```

### 7.1 Human-owned libraries

`task-registry.library.json` maps every `PRT-QL-###` to:

- `cpId`;
- `taskKind`;
- `solveMode`;
- `answerType`;
- required variables;
- scenario family;
- context tag;
- difficulty eligibility;
- distractor profile;
- explanation strategy;
- locale constraints.

`variable-ranges.library.json` owns curated numeric pools and constraints.  
`object-pools.library.json` owns names, partner counts, business nouns, temporal phrases and event wording.  
`question-language.*.json` owns stems.  
`explanation.*.json` owns semantic explanation templates, not answers.

---

## 8. Variable and object-pool design

### 8.1 Capital pools

Use exam-friendly values that simplify capital-time ratios without making every question visibly patterned:

- ₹4,000–₹90,000 for common direct questions;
- ₹1.2 lakh–₹12 lakh selectively for banking/state contexts;
- multiples chosen across 100, 500, 1,000, 2,500 and 5,000 bands;
- ratio-derived capitals when a target share must be integral.

Avoid making every capital end in `0000`; include natural values such as ₹18,000, ₹24,000, ₹27,500, ₹36,000, ₹45,000, ₹72,000.

### 8.2 Time pools

- total durations: 6, 8, 9, 10, 12, 15, 18, 24 months where wording remains natural;
- common event points: 2–10 months;
- fractions of year only when explicitly translated into months or simple fractions;
- avoid ambiguous partial-month events in standard MCQs.

### 8.3 Profit/loss pools

Generate backwards from contribution weights when necessary so partner shares are clean. Prefer totals yielding integral shares and plausible answer options.

### 8.4 Capital-change pools

- fixed additions/withdrawals;
- 10%, 20%, 25%, 33⅓%, 50%, 75%, 100% where mathematically clean;
- one-third, one-fourth, one-half etc. only when the reference capital is unambiguous.

### 8.5 Context/object families

Primary stem contexts should remain close to real aptitude papers:

- business / firm / venture;
- shop / trading business;
- small manufacturing unit;
- agency / dealership;
- wholesale or retail concern;
- generic “A, B and C started a business”.

Names must come from broad English/Hindi/Punjabi-compatible pools and must not encode semantic assumptions. Context variety must never obscure the arithmetic.

### 8.6 Anti-thin-pool requirement

No CP may depend on one tiny object pool or one sentence skeleton. High-frequency CPs require multiple grammatical structures and event phrasings. Coverage audit must measure:

- distinct stem skeletons;
- context families;
- answer contracts;
- partner counts;
- event topologies;
- variable-band usage;
- repeated n-gram/stem similarity.

---

## 9. Difficulty framework

Difficulty is computed from reasoning topology, not from ugly arithmetic.

### Easy

Usually:

- 2 partners;
- one capital segment each;
- same time or directly given unequal time;
- direct ratio/share/total request;
- no inverse event reconstruction;
- clean integer arithmetic.

### Medium

Usually one or more of:

- 3 partners;
- one join/leave inference;
- one capital change;
- one reverse unknown capital/time;
- share difference or equal-share condition;
- one salary/commission/deduction step;
- moderate ratio reduction.

### Hard

Usually:

- 3+ partners plus multiple events;
- two capital segments for multiple partners;
- unknown join/leave/change time;
- remuneration combined with dynamic contributions;
- reverse final-receipt reconstruction;
- ordered allocations;
- integrated CP-007 topology.

Hard questions should still use exam-real numbers. Large primes, gratuitous decimals and excessive arithmetic do not count as reasoning difficulty.

Suggested production mix after freeze: approximately **30–35% Easy, 35–40% Medium, 25–30% Hard**, adjustable from actual mock performance and exam-source audits.

---

## 10. Parameter generator contract

The generator must be **answer-aware** and **constraint-led**, not “pick random numbers and hope”.

Generation sequence:

1. select CP → solve mode → QL;
2. select a structural scenario/event topology compatible with that QL;
3. generate target ratio/share/unknown constraints;
4. back-solve capitals, durations, profits and events where required;
5. build exact timeline segments;
6. solve with canonical solver;
7. independently verify by direct weighted-contribution simulation;
8. generate options from misconception-aware distractors;
9. run all mathematical, semantic, realism and locale validators;
10. reject/regenerate if any gate fails.

### Required generation invariants

- all capital values > 0 while a partner remains active;
- withdrawals never make capital negative;
- event times strictly inside valid range unless boundary case is intentional;
- capital segments do not overlap for the same partner;
- no zero-duration segment;
- total effective-capital weight > 0;
- distributable profit is not negative unless the question is explicitly about loss;
- answer is exact and within declared answer type;
- MCQ options are unique after formatting;
- intended unknown is uniquely solvable;
- no accidental equal shares unless equal-share topology is intended;
- no impossible “partner joins after business ended” state;
- no commission basis ambiguity.

---

## 11. Solver and independent verification

### 11.1 Canonical solver

`solver.ts` should solve algebraically from normalized exact contribution weights and allocation rules.

### 11.2 Independent verifier

`independent-verifier.ts` should reconstruct each partner's capital timeline, sum capital × duration directly, execute allocations sequentially and recompute every final receipt independently of the solve-mode algebra.

Every generated package must satisfy:

- solver answer = verifier answer;
- sum of distributed shares + deductions/allocations = gross profit, within exact arithmetic;
- normalized ratio reproduces the raw effective-capital weights;
- reverse-mode solved variable reproduces all original constraints when substituted back.

No QL is freeze-eligible without independent verification coverage.

---

## 12. Distractor architecture

Distractors should model realistic mistakes, not arbitrary ±1 noise.

Reusable misconception families:

1. **ignore time** — use capital ratio only;
2. **ignore capital** — use time ratio only;
3. **elapsed-vs-remaining error** — later joiner gets `m` months instead of `T-m`;
4. **early-leaver complement error** — leaver gets `T-m` instead of `m`;
5. **ignore capital change**;
6. **apply changed capital for full duration**;
7. **use addition/withdrawal amount as new total capital**;
8. **percentage-change base error**;
9. **invert profit ratio**;
10. **split gross profit before salary/commission**;
11. **deduct remuneration twice**;
12. **forget to add remuneration back to active partner's final receipt**;
13. **apply commission percentage to wrong pool**;
14. **subtract charity/reserve from one partner's share rather than from common pool**;
15. **sum capital snapshots instead of capital-months**;
16. **calendar boundary off-by-one conceptual error** where relevant.

Distractor generator must discard duplicates and any distractor equal to the correct answer after rounding/formatting.

---

## 13. Explanation contract

Explanations must follow the user-facing style established in our later Quant reviews: **short, human-written, complete, and question-specific**.

Do not repeat the full stem. Do not dump generic theory before solving. Do not present a wall of formulas with no prose.

Preferred structure:

1. one short sentence stating what matters in this question;
2. show each partner's effective contribution clearly;
3. reduce to the profit-sharing ratio;
4. apply salary/commission/deduction only if present;
5. calculate the requested share/unknown;
6. one final answer line.

Example shape:

> A invested ₹30,000 for all 12 months, so his contribution is 30,000 × 12. B joined after 4 months, so he invested for the remaining 8 months: 45,000 × 8. These contributions are equal, hence their profit ratio is 1:1. Therefore each receives half of the total profit.

### Explanation anti-clutter rules

- no “Given / Formula / Substitution / Calculation / Therefore” label stack unless the topology genuinely needs sections;
- no restatement of every sentence from the question;
- no generic definition of partnership inside each answer;
- formula shown only where it aids understanding;
- intermediate quantities use the actual generated numbers;
- inverse questions explain why the unknown duration/capital is being solved from the share ratio;
- remuneration questions explicitly identify the distributable pool before ratio splitting.

---

## 14. Localization design

Languages: English, Hindi, Punjabi.

### 14.1 Semantic parity

Localization must preserve:

- who invested;
- exact capital amount;
- start/end/change event timing;
- whether a partner added capital, withdrew part, or left entirely;
- gross versus distributable profit;
- salary versus commission versus deduction;
- commission basis;
- requested answer.

### 14.2 Terminology baseline

English terms are simple and exam-standard. Hindi/Punjabi translations should use familiar competitive-exam vocabulary rather than literal legal/accounting prose.

Examples:

- capital → पूंजी / ਪੂੰਜੀ
- investment → निवेश / ਨਿਵੇਸ਼
- profit → लाभ / ਲਾਭ
- loss → हानि / ਘਾਟਾ or context-appropriate standard exam term
- share → हिस्सा / ਹਿੱਸਾ
- working partner → working/active partner equivalent with clear local wording

Terminology must be reviewed during editorial localization rather than blindly machine-translated.

### 14.3 Numerals and money

Use Arabic numerals and `₹` consistently unless the product-wide locale standard changes. Do not translate variable identifiers or alter numbers across languages.

### 14.4 Multilingual audit

For every QL, audit:

- numeric parity;
- entity/partner parity;
- event-order parity;
- capital-change parity;
- remuneration/deduction parity;
- question-intent parity;
- answer parity;
- no accidental hint introduced by translation.

---

## 15. Validation gates

### Mathematical gates

- exact solver/verifier equality;
- all contribution weights valid;
- ratio normalized correctly;
- final allocated totals reconcile exactly;
- reverse solution satisfies source constraints;
- integer/allowed rational answer contract satisfied.

### Semantic gates

- QL-required variables all present;
- no unused event that changes nothing;
- “after x months” semantics consistent with timeline;
- withdrawal wording consistent with partial vs full exit;
- percentage-change reference capital explicit when needed;
- commission/deduction basis unambiguous.

### MCQ gates

- exactly one correct option;
- no duplicate displayed options;
- distractors plausible but mathematically wrong;
- answer position distribution balanced;
- no unit mismatch;
- no option reveals answer through formatting precision.

### Editorial gates

- natural competitive-exam English;
- varied stem skeletons;
- no repetitive “A and B entered into partnership...” monopoly;
- no artificial story clutter;
- explanations concise and specific;
- correct use of “profit”, “share”, “capital”, “invested for”, “joined after”, “withdrew”.

---

## 16. Coverage and exhaustiveness audit

Before chapter freeze, the audit matrix must prove coverage across these axes:

### Partner topology

- 2 partners;
- 3 partners;
- 4 partners selectively;
- active + sleeping wording;
- one/multiple active partners where remuneration is explicit.

### Timeline topology

- same duration;
- unequal explicit durations;
- later join;
- early leave;
- multiple joins;
- join + leave;
- one capital change;
- multiple changes;
- changes across multiple partners.

### Unknown/answer topology

- ratio;
- individual share;
- total profit;
- share difference;
- capital;
- time duration;
- join/leave/change event position;
- salary/commission/deduction;
- percentage;
- equal-share condition.

### Allocation topology

- no prior allocation;
- fixed salary/allowance;
- percentage commission;
- charity/reserve/expense;
- combined ordered allocations;
- loss distribution.

### Difficulty topology

- direct;
- one inverse;
- one timeline inference;
- multi-partner reconstruction;
- mixed hard topology.

A chapter can be mathematically correct and still fail exhaustiveness if one of these matrix regions has no exam-real QLs.

---

## 17. Exam-realness audit

Each QL family is scored for:

- recognizable SSC/Banking/Punjab competitive-exam structure;
- realistic capital/profit magnitudes;
- natural month/year events;
- plausible business language;
- absence of accounting concepts outside aptitude scope;
- no classroom-only contrivances;
- solution length appropriate to timed exams;
- distractors reflecting real candidate errors.

Reject questions that are technically solvable but feel synthetic, e.g. five capital changes with prime-numbered months, obscure commission recursion, or unrealistic fractional-rupee outputs.

---

## 18. Distribution strategy

Production distribution must not be uniform across solve modes merely because they exist.

High-frequency weight:

- CP-001 direct share/ratio;
- CP-002 capital × time;
- CP-003 joins/leaves;
- CP-004 one capital addition/withdrawal;
- CP-006 common working-partner salary/commission.

Moderate weight:

- multi-partner relational systems;
- reverse unknown capital/time;
- share differences and total-profit reconstruction.

Lower but non-zero weight:

- multiple capital changes;
- ordered allocations;
- integrated CP-007 hard systems;
- uncommon loss/remuneration combinations.

Coverage targets and actual generation distribution are separate. Rare modes still need sufficient QLs for readiness even if generated less frequently.

---

## 19. Question Studio runtime contract

Pipeline target:

```ts
runPrt001Pipeline(cpId, input):
  task = resolveTaskRegistryEntry(cpId, input)
  params = generatePrt001Parameters(task, input)
  timeline = buildCapitalTimeline(params)
  solver = solvePrt001(task, params, timeline)
  verifier = verifyPrt001Independently(task, params, timeline)
  reasoningGraph = buildPrt001ReasoningGraph(task, params, solver)
  explanation = renderPrt001Explanation(task, params, solver, reasoningGraph)
  stem = renderPrt001QuestionLanguage(task, params, input.language)
  options = generatePrt001Distractors(task, params, solver)
  package = assembleQuestionPackage(...)
  validation = validatePrt001QuestionPackage(package, verifier)
  return { ...package, validation }
```

Required traceability in every generated question:

- chapter ID;
- CP ID;
- QL ID;
- solve mode;
- difficulty;
- language;
- scenario family;
- seed/input trace;
- exact parameters;
- solver result;
- verifier result;
- distractor profile;
- validation result.

---

## 20. Testing strategy

### Unit tests

- exact rational math;
- contribution-segment sums;
- event duration inference;
- capital additions/withdrawals;
- percentage changes;
- ratio normalization;
- pre-distribution allocations;
- reverse solvers;
- answer formatting.

### Property tests

For thousands of generated parameter sets:

- total shares reconcile;
- scaling all capitals by the same factor preserves ratio;
- scaling all durations by the same factor preserves ratio;
- same-time problems equal capital-ratio result;
- same-capital problems equal time-ratio result;
- replacing a split capital history with mathematically equivalent segments preserves answer;
- solver = verifier;
- generated inverse variable recovers the seeded original value.

### Corpus tests

- every QL renders in EN/HI/PA;
- no missing placeholder;
- no NaN/Infinity;
- no duplicate options;
- no empty explanation;
- no forbidden ambiguous phrases;
- snapshot review samples per CP/difficulty/language.

---

## 21. Implementation waves

### Wave 0 — Design freeze

- finalize CP ownership;
- audit solve-mode discovery inventory;
- merge duplicate modes;
- review exam-realness gaps;
- freeze Phase-A blueprint.

### Wave 1 — Foundation

- types;
- exact math;
- capital-timeline engine;
- allocation engine;
- solver;
- independent verifier;
- validators;
- tests.

### Wave 2 — CP-001 and CP-002 English pilot

- task registry slices;
- variables/object pools;
- QLs;
- explanations;
- distractors;
- generation audit.

Freeze only after editorial and exam-realness review.

### Wave 3 — CP-003 and CP-004

Build joins/leaves and capital-history families; this is the main timeline wave.

### Wave 4 — CP-005

Multi-partner and relational/reverse systems.

### Wave 5 — CP-006

Working-partner remuneration and deductions with strict allocation-order validators.

### Wave 6 — CP-007

Integrated hard mixed systems, added only after component CPs are mature.

### Wave 7 — English chapter audit

- coverage/exhaustiveness;
- exam realness;
- object/stem diversity;
- explanation quality;
- option quality;
- difficulty calibration;
- duplicate QL audit.

### Wave 8 — Hindi and Punjabi localization

Localize only frozen English semantics; run parity and editorial audits.

### Wave 9 — Question Studio integration

- chapter registry/routing;
- generation UI exposure;
- language and difficulty selectors;
- telemetry tags;
- smoke generation from production path.

### Wave 10 — Final freeze

- all CI green;
- source/exhaustiveness audit clean;
- multilingual parity clean;
- random generation review clean;
- Question Studio connected;
- freeze record committed.

---

## 22. Design-freeze gates

`PRT-001` may move to implementation only when all of the following are true:

- [ ] chapter boundaries accepted;
- [ ] 7-CP structure accepted or explicitly revised;
- [ ] solve-mode discovery inventory audited for duplicates and gaps;
- [ ] join/leave event semantics frozen;
- [ ] variable and object-pool strategy accepted;
- [ ] remuneration/commission basis contracts frozen;
- [ ] explanation style accepted;
- [ ] distractor taxonomy accepted;
- [ ] EN → HI/PA localization contract accepted;
- [ ] Data Sufficiency ownership boundary accepted;
- [ ] final source/exam-realness gap audit finds no major uncovered family.

---

## 23. Final design judgment

Partnership should be a **medium-sized but very deep arithmetic chapter**, not a tiny two-formula package. The mathematics is compact, but real exam coverage depends on timeline interpretation, reverse reconstruction, dynamic capital and correct allocation ordering.

The correct architecture is therefore:

- one chapter `PRT-001`;
- 7 CPs;
- one exact capital-timeline engine;
- one ordered allocation engine;
- solver + independent verifier;
- audit-driven solve-mode/QL discovery;
- human-authored stem diversity;
- concise question-specific explanations;
- EN/HI/PA semantic localization;
- strict exam-realness and exhaustiveness gates before freeze.

This design is implementation-ready after the Phase-A gap/duplicate audit.