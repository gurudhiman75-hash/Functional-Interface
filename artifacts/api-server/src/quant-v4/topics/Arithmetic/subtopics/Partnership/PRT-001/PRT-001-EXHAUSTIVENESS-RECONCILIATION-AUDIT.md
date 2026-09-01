# PRT-001 — Exhaustiveness & Design-Reconciliation Audit

**Audit scope:** current `New-main` PRT-001 runtime versus the 102-candidate end-to-end design inventory, plus exam-realness, generator diversity, localization, ownership, and Question Studio readiness.

**Audit verdict:** **RUNTIME COMPLETE, CHAPTER EXHAUSTIVENESS REOPENED**.

The current runtime correctly implements all seven canonical problems and is Question-Studio routable, but the present 28 solve modes / 32 active QLs are a compact runtime proof rather than an exhaustive Partnership chapter. The design inventory was reduced from 102 candidate solve modes to 28 active modes without a recorded merge/delegate/reject ledger. This audit supplies that missing reconciliation and identifies the next expansion waves.

---

## 1. Current runtime baseline

| CP | Current ownership | Active QLs | Active unique solve modes |
|---|---|---:|---:|
| PRT-CP-001 | Same-period constant capital | 6 | 4 |
| PRT-CP-002 | Unequal fixed durations | 6 | 4 |
| PRT-CP-003 | Joining / leaving / staggered participation | 4 | 4 |
| PRT-CP-004 | Capital addition / withdrawal / piecewise capital | 4 | 4 |
| PRT-CP-005 | Three-partner / relational systems | 4 | 4 |
| PRT-CP-006 | Working-partner remuneration / deductions | 4 | 4 |
| PRT-CP-007 | Integrated compound partnership | 4 | 4 |
| **Total** |  | **32** | **28** |

Current runtime strengths:

- exact rational arithmetic;
- reusable capital-time timeline engine;
- ordered pre-distribution allocation engine;
- independent verifier;
- deterministic parameter generation;
- misconception-aware options;
- EN / HI / PA templates;
- Question Studio routing;
- coverage, localization, option-position and basic realism audits.

These are strong implementation foundations and should be reused rather than rewritten.

---

## 2. 102 → 28 reconciliation summary

Disposition vocabulary:

- **ACTIVE** — present as an active runtime solve mode.
- **MERGE/EXPOSE** — does not require a fundamentally new mathematical engine; should be represented by a distinct task/QL or by a generalized existing authority because the exam-facing answer contract/topology is materially different.
- **NEW AUTHORITY** — requires a materially new inverse, relational, multi-event, multi-allocation, or compound generation/solve contract.
- **DELEGATE** — better owned by another Quant V4 chapter when Partnership contributes no additional reasoning mechanism.

| CP | Design candidates | ACTIVE | MERGE/EXPOSE gaps | NEW AUTHORITY gaps | DELEGATE |
|---|---:|---:|---:|---:|---:|
| CP-001 | 12 | 4 | 6 | 1 | 1 |
| CP-002 | 12 | 4 | 5 | 3 | 0 |
| CP-003 | 16 | 4 | 11 | 1 | 0 |
| CP-004 | 18 | 4 | 10 | 4 | 0 |
| CP-005 | 16 | 4 | 8 | 2 | 2 |
| CP-006 | 16 | 4 | 5 | 7 | 0 |
| CP-007 | 12 | 4 | 0 | 8 | 0 |
| **Total** | **102** | **28** | **45** | **26** | **3** |

Therefore, **71 Partnership-facing candidate contracts are currently not product-exposed**: 45 can largely be absorbed by generalized existing foundations, while 26 need materially new active authorities/topologies. Three candidates are better delegated.

This does **not** imply that the final frozen solve-mode count must be 99. The correct outcome is a second merge/split pass in which related candidates share generalized authorities while retaining distinct exam-facing QLs where answer intent, event semantics, or misconception structure differs.

---

## 3. CP-by-CP disposition ledger

### PRT-CP-001 — Same-period constant capital

**ACTIVE**

- `findProfitRatioFromCapitals`
- `findPartnerShareFromTotalProfitAndCapitals`
- `findTotalProfitFromPartnerShareAndCapitals`
- `findProfitDifferenceFromTotalProfitAndCapitals`

**MERGE/EXPOSE**

- `findOtherPartnerShareFromKnownShareAndCapitals` — same-period ratio authority; distinct known-share answer contract.
- `findUnknownCapitalFromProfitRatio` — inverse contribution authority already supported conceptually by the linear helper.
- `findUnknownCapitalFromPartnerShares` — merge with unknown-capital authority; distinct stem/given structure.
- `findCapitalRatioFromProfitShares` — inverse same-period ratio; low arithmetic novelty but exam-real.
- `findLossShareFromCapitals` — same mathematics as profit share, but loss context is a real semantic contract and distractor surface.
- `findIndividualCapitalsFromTotalCapitalAndProfitRatio` — ratio partition under explicit partnership context; can share a generalized ratio-recovery authority.

**NEW AUTHORITY**

- `findTotalProfitFromShareDifferenceAndCapitals` — reverse from share difference rather than from one known share.

**DELEGATE**

- `findTotalCapitalFromCapitalRatioAndOneCapital` — pure ratio reconstruction when no time/profit mechanism is required; Ratio & Proportion should own the naked mechanic.

### PRT-CP-002 — Fixed capitals with unequal durations

**ACTIVE**

- `findProfitRatioFromCapitalAndDuration`
- `findPartnerShareFromTotalProfitCapitalDuration`
- `findUnknownCapitalFromShareRatioAndDurations`
- `findUnknownDurationFromShareRatioAndCapitals`

**MERGE/EXPOSE**

- `findTotalProfitFromPartnerShareCapitalDuration`
- `findCapitalForEqualProfitGivenDurations` — specialize unknown-capital inverse to target ratio 1:1.
- `findDurationForEqualProfitGivenCapitals` — specialize unknown-duration inverse to target ratio 1:1.
- `findProfitDifferenceFromCapitalDurationWeights`
- `findMissingPartnerShareFromKnownShareAndWeights`

**NEW AUTHORITY**

- `findCapitalRatioFromProfitRatioAndTimeRatio`
- `findTimeRatioFromProfitRatioAndCapitalRatio`
- `findTotalProfitFromShareDifferenceAndWeights`

### PRT-CP-003 — Joining, leaving, staggered participation

**ACTIVE**

- `findProfitRatioWhenPartnerJoinsLater`
- `findShareWhenPartnerLeavesEarly`
- `findUnknownJoinTimeFromProfitRatio`
- `findProfitRatioWithMultipleStaggeredJoins`

**MERGE/EXPOSE**

- `findProfitRatioWhenPartnerLeavesEarly`
- `findShareWhenPartnerJoinsLater`
- `findUnknownLeaveTimeFromProfitRatio`
- `findUnknownJoinTimeFromPartnerShare`
- `findUnknownLeaveTimeFromPartnerShare`
- `findJoinTimeForEqualProfitShares`
- `findLeaveTimeForEqualProfitShares`
- `findUnknownCapitalOfLateJoiningPartner`
- `findUnknownCapitalOfEarlyLeavingPartner`
- `findTotalProfitFromStaggeredPartnerShare`
- `findShareDifferenceWithStaggeredParticipation`

**NEW AUTHORITY**

- `findProfitRatioWithJoinAndLeaveEvents` — must support simultaneous join/leave topology, including a shared unknown event parameter.

### PRT-CP-004 — Capital addition, withdrawal, piecewise investment

**ACTIVE**

- `findProfitRatioAfterCapitalAddition`
- `findShareAfterCapitalWithdrawal`
- `findUnknownAddedCapitalFromProfitRatio`
- `findEventTimeForEqualProfitShares`

**MERGE/EXPOSE**

- `findProfitRatioAfterCapitalWithdrawal`
- `findShareAfterCapitalAddition`
- `findProfitRatioAfterPercentageCapitalIncrease`
- `findProfitRatioAfterPercentageCapitalDecrease`
- `findProfitRatioAfterFractionalCapitalChange`
- `findUnknownWithdrawnCapitalFromProfitRatio`
- `findUnknownCapitalChangeTimeFromProfitRatio`
- `findUnknownCapitalChangeTimeFromPartnerShare`
- `findCapitalChangeForEqualProfitShares`
- `compareEffectiveCapitalsAfterDifferentChanges`

**NEW AUTHORITY**

- `findProfitRatioWithMultipleChangesForOnePartner`
- `findProfitRatioWithChangesForMultiplePartners`
- `findUnknownPercentageCapitalChange`
- `findInitialCapitalFromFinalShareAndChangeHistory`

### PRT-CP-005 — Multi-partner and relational systems

**ACTIVE**

- `findThreePartnerProfitRatio`
- `findMultiPartnerSharesFromTotalProfit`
- `findUnknownCapitalInThreePartnerSystem`
- `findTotalProfitFromOnePartnerShareInMultiPartnerSystem`

**MERGE/EXPOSE**

- `findFourPartnerProfitRatio`
- `findUnknownDurationInThreePartnerSystem`
- `findTotalProfitFromDifferenceBetweenTwoShares`
- `findSharesFromCapitalMultiplesAndDurations`
- `findSharesFromTimeMultiplesAndCapitals`
- `findPartnerShareWhenOneWeightIsSumOfOthers`
- `findUnknownCapitalFromEqualShareConditionInMultiPartnerSystem`
- `findUnknownDurationFromEqualShareConditionInMultiPartnerSystem`

**NEW AUTHORITY**

- `findCapitalRatioFromPartnerShareRelations`
- `findDurationRatioFromPartnerShareRelations`

**DELEGATE**

- `findMissingPartnerWeightFromPairwiseShareRatios` — pure ratio-chain recovery if no capital/time interpretation survives.
- `findIndividualCapitalsFromTotalCapitalAndRatios` — pure ratio partition when durations are identical and no Partnership-specific event is involved.

### PRT-CP-006 — Working partner remuneration and deductions

**ACTIVE**

- `findActivePartnerTotalReceiptWithFixedSalary`
- `findOtherPartnerShareWithPercentCommission`
- `findSharesAfterCharityDeduction`
- `findUnknownSalaryFromFinalPartnerReceipts`

**MERGE/EXPOSE**

- `findSleepingPartnerShareWithActivePartnerSalary`
- `findPartnerSharesAfterFixedManagementAllowance`
- `findActivePartnerReceiptWithPercentOfGrossProfitCommission`
- `findSharesAfterReserveDeduction`
- `findSharesAfterExplicitBusinessExpenseDeduction`

**NEW AUTHORITY**

- `findTotalProfitFromActivePartnerFinalReceipt`
- `findTotalProfitFromSleepingPartnerReceipt`
- `findUnknownCommissionPercentFromFinalReceipt`
- `findUnknownDeductionFromPartnerShare`
- `findProfitRatioFromFinalReceiptsWhenOnePartnerGetsSalary`
- `findPartnerReceiptWithSalaryAndDeduction`
- `findPartnerReceiptsWithMultipleOrderedAllocations`

### PRT-CP-007 — Integrated compound partnership

**ACTIVE**

- `findShareWithLateJoinAndCapitalChange`
- `findShareWithDynamicCapitalAndWorkingPartnerSalary`
- `findMultiPartnerSharesWithStaggeredEvents`
- `findUnknownEventTimeWithPreDistributionDeduction` (runtime name: `findUnknownJoinTimeWithPreDistributionDeduction`)

**NEW AUTHORITY**

- `findProfitRatioWithJoinLeaveAndCapitalChange`
- `findShareWithDynamicCapitalAndPercentCommission`
- `findUnknownJoinTimeWithCapitalChangeHistory`
- `findUnknownCapitalWithStaggeredParticipation`
- `findTotalProfitFromMixedTimelineFinalReceipt`
- `findDifferenceBetweenFinalReceiptsInMixedSystem`
- `findEqualFinalReceiptsConditionWithRemuneration`
- `findReverseContributionFromMixedPartnerRelations`

---

## 4. Exam-source saturation findings

The missing areas are confirmed by contemporary exam-style / previous-paper evidence and are not merely theoretical additions.

### High-priority missing topology: join + capital change + leave

A Testbook previous-paper item attributed to **SSC CGL 2025, 16 Sep 2025 Shift 3** combines:

- one partner present from the start;
- another joining after 3 months;
- first partner increasing capital after 6 months;
- second partner leaving before year-end;
- requested final profit ratio.

This maps directly to the missing `findProfitRatioWithJoinLeaveAndCapitalChange` family and is stronger than the current CP-007 direct late-join + capital-addition case.

Source: `https://testbook.com/question-answer/alok-starts-a-business-with-90000-after-3-month--6909f917d9de8466e62d5ba5`

### High-priority missing topology: shared unknown join/leave event

A Testbook previous-paper item attributed to **DSSSB MTS, 8 Mar 2026 Shift 2** uses:

- A fixed for the full year;
- C joining after `x` months;
- B leaving `x` months before year-end;
- a three-partner profit ratio;
- solve for `x`.

This requires a genuine join+leave inverse authority, not the current single late-join inverse.

Source: `https://testbook.com/question-answer/a-and-b-enter-into-a-partnership-with-%E2%82%B950000-an--6a1678540863722a6f66a7ab/amp`

### High-priority missing topology: percentage capital changes across multiple partners

A Testbook previous-paper item attributed to **SSC CHSL 2025 Tier-1, 13 Nov 2025 Shift 2** uses three partners where one increases capital by 25% and another decreases capital by 10% after six months, then asks for a profit share.

This validates the missing percentage-change and multi-partner piecewise-capital families.

Source: `https://testbook.com/question-answer/a-b-and-c-enter-into-a-partnership-a-invests-rs--6992fb0c94d21cbf02845aa0`

### High-priority missing topology: late-joining partner unknown capital

A Testbook previous-paper item attributed to **UP Police SI, 15 Mar 2026 Shift 2** gives A's capital, B's join time and the final profit ratio, then asks for B's contribution. This is the missing `findUnknownCapitalOfLateJoiningPartner` contract.

Source: `https://testbook.com/question-answer/a-starts-a-business-with-%E2%82%B9-4000-after-4-months--69d0e7fc1b84ebeff0f140ed`

### High-priority missing topology: relational three-partner capital system

A Testbook previous-paper item attributed to **AFCAT, 31 Jan 2026 Shift 1** defines B's capital algebraically from A and C, then asks for C's share from total profit. This validates relational CP-005 coverage beyond direct three-capital tuples.

Source: `https://testbook.com/question-answer/among-three-partners-a-b-and-c-in-a-business-the--6a070264ee09dbb41f0a6814`

### High-priority missing topology: working-partner percentage plus reverse total profit / difference

A current Testbook item uses three partners, one working partner receiving 20% of gross profit before ratio distribution, and a difference between final receipts to recover total profit. This is not covered by current CP-006/007 active modes.

Source: `https://testbook.com/question-answer/a-b-and-c-enter-into-partnership-with-capitals-of--6a0ab1c6ae47cdb701eae251`

### High-priority missing topology: multiple working-partner allocations

A Testbook item uses two working partners receiving separate percentage allocations before the balance is shared. This validates `findPartnerReceiptsWithMultipleOrderedAllocations`.

Source: `https://testbook.com/question-answer/a-b-and-c-enter-into-partnership-with-capital-i--5ef45cefe8c2370d0f185e18`

---

## 5. Generator diversity audit

### 5.1 Object pools are pilot-thin

Current `object-pools.library.json` contains only:

- 5 fixed partner pairs / 10 names;
- 5 business contexts.

It is still labelled `ENGLISH_PILOT` even though the chapter-level runtime is labelled complete.

This is below the chapter's own design intent for varied contexts and structurally different stems.

### 5.2 CP-001 / CP-002 variable depth is narrow

Current variable ranges contain:

- 5 same-period capital ratios;
- 4 capital scales;
- 5 share-unit values;
- 5 unequal-duration scenarios;
- 3 unknown-capital scenarios;
- 3 unknown-duration scenarios.

These are adequate for a runtime proof but not for production-scale exam diversity.

### 5.3 CP-003 through CP-007 are substantially hard-coded

`advanced-parameter-generator.ts` uses mostly one canonical mathematical state per solve-mode group and changes it primarily through:

- partner-name shuffle;
- business context choice;
- a scale factor of only `1` or `2`;
- target-partner choice.

Examples include fixed 4-month join points, fixed 6-month capital-change boundaries, and repeated fixed capital tuples. This creates high risk of same-QL mathematical-state repetition even when rendered stems differ superficially.

### 5.4 Current realism audit is not a diversity audit

`auditPrt001ContextRealism()` counts `traceability.scenarioFamily` values and requires at least 20. Because `scenarioFamily` is human-labelled per task entry, that metric can pass even when numerical states and stem skeletons repeat.

Missing production gates:

- distinct mathematical-state count per QL;
- same-QL normalized stem duplication;
- cross-QL n-gram / skeleton collision audit;
- event-topology diversity;
- capital-band diversity;
- partner-count diversity;
- answer-contract diversity;
- object/context distribution;
- duplicate detection against legacy RAP-003 Partnership QLs.

---

## 6. Stem and QL audit

The 32 English QLs are readable and correctly distinguish the implemented contracts, but they remain a small pilot set.

Current concentration:

- 12 of 32 QLs are CP-001/002 basic two-partner questions;
- CP-003 through CP-007 have only four QLs each;
- most high-frequency complex event families have exactly one or zero stem skeletons;
- no dedicated QLs for percentage/fraction capital changes;
- no join+leave combined QL;
- no four-partner QL;
- no relational-multiple QLs;
- no reverse commission/deduction/total-profit QLs;
- no multiple ordered-allocation QL;
- no final-receipt difference/equality compound QLs.

Recommendation: retain the 28 current solve modes where useful, but expand task/QL ownership aggressively. The final chapter should not equate one mathematical authority with one stem family.

---

## 7. Explanation audit

English explanations are concise and generally align with the desired style for direct modes. However, several hard/inverse modes fall back to a generic three-line template:

1. translate the condition to a contribution ratio;
2. state that one linear unknown remains;
3. state the solved answer.

That is mathematically valid but under-explains the actual substitution for hard reverse problems. Before editorial freeze, each inverse/compound QL should show the specific equation or concrete effective-contribution arithmetic that produces the answer.

Hindi/Punjabi explanations are even more generic: the localized renderer currently emits the same broad three-line explanation shape for most modes. Structural parity is present, but human editorial parity is not yet demonstrated by the automated audit.

---

## 8. Localization audit

Positive:

- 32 EN / HI / PA templates exist;
- native scripts are used;
- answer type / solve mode / exact-weight parity is checked.

Gap:

- the multilingual audit is structural, not editorial;
- it does not verify natural competitive-exam phrasing, awkward calques, remuneration terminology, join/leave semantics under all event variants, or explanation naturalness;
- newly added QLs must be localized only after English solve contracts are frozen.

Current localized templates may remain as runtime proof, but localization should be reopened after the English exhaustiveness expansion.

---

## 9. Ownership audit

### Keep in Partnership

- capital × time profit/loss distribution;
- join/leave event interpretation;
- piecewise capital changes;
- inverse capital/time under partnership constraints;
- working/sleeping partner remuneration;
- pre-distribution deductions;
- multi-partner and compound combinations.

### Delegate when Partnership contributes no extra mechanism

- naked total-from-ratio reconstruction;
- pure ratio-chain weight recovery;
- pure total-capital partition by a given ratio.

### Cross-chapter watchlist

Recent practice material also contains **interest-on-capital before residual profit distribution**. The current PRT design deliberately assigns interest-on-capital to the Interest chapter. Keep that boundary for now, but create a future cross-chapter compound-routing decision so such mixed questions are not silently uncovered by both chapters.

---

## 10. Freeze-status correction

The existing `implementation-freeze.md` statement that the runtime is complete is correct **only at runtime-proof scope**. It should not be interpreted as chapter exhaustiveness or editorial/source freeze.

Recommended lifecycle wording:

- runtime foundation: **COMPLETE**;
- seven CP routing: **COMPLETE**;
- current 32-QL pilot: **IMPLEMENTED**;
- design reconciliation: **REOPENED**;
- exhaustiveness/source saturation: **NOT FROZEN**;
- same-QL diversity: **NOT FROZEN**;
- English editorial freeze: **NOT FROZEN**;
- Hindi/Punjabi editorial freeze: **NOT FROZEN**;
- public publication: **BLOCKED**.

---

## 11. Required remediation waves

### Wave E1 — Critical recent-exam topology expansion

Implement first:

1. join + leave combined events;
2. join + leave + capital change compound ratio;
3. percentage/fraction capital changes;
4. changes affecting multiple partners;
5. late-joining / early-leaving unknown capital;
6. reverse leave-time and shared-event-time problems;
7. relational three-partner capital systems;
8. reverse total profit from share difference;
9. working-partner percentage plus reverse total/final-receipt difference;
10. multiple ordered allocations.

### Wave E2 — Inverse/answer-contract saturation

Add the MERGE/EXPOSE contracts across CP-001..006, sharing generalized authorities where appropriate but giving materially different answer intents dedicated task kinds/QLs.

### Wave E3 — Generator-depth rebuild

Replace fixed advanced scenarios with curated variable libraries:

- multiple event months;
- multiple duration totals (6/8/9/10/12/15/18/24 where natural);
- broad capital bands including non-round exam values;
- 2/3/4-partner topologies;
- fixed, percentage and fractional capital changes;
- 1/2/3 capital segments;
- salary, gross commission, post-deduction commission, reserve, expense and multiple allocations;
- answer-aware backward generation for clean values.

Minimum production diversity gate should require at least three materially distinct mathematical states per QL, with stronger targets for high-frequency QLs.

### Wave E4 — Stem/object diversity

Expand human-owned context and stem skeleton pools; add normalized-skeleton and n-gram collision audits. Names/numbers alone must not count as diversity.

### Wave E5 — Explanation editorial pass

Replace generic reverse-mode explanation fallback with concrete question-specific working. Preserve concise human narration; avoid formula walls and full-stem repetition.

### Wave E6 — English source/exam-realness freeze

Run source saturation against SSC, Banking and Punjab/state patterns and record explicit source-family coverage / omission decisions.

### Wave E7 — EN → HI / PA localization

Only after English QL authorities and stem families freeze, localize all new material and run semantic + editorial parity review.

### Wave E8 — final Question Studio / duplicate / publication gate

- compare against legacy `RAP-003` Partnership runtime and retire/de-duplicate overlapping product exposure;
- run full corpus generation;
- run exact/near duplicate audits;
- run answer-position, option-quality, context, difficulty and locale audits;
- then update the implementation freeze record.

---

## 12. Final verdict

`PRT-001` is **not a failed implementation**. Its foundation is strong and all seven CPs have executable proof. The problem is lifecycle labelling: 32 QLs / 28 solve modes were promoted to `CHAPTER_RUNTIME_COMPLETE` before the original 102-candidate discovery space was dispositioned and before production-grade diversity/source saturation was demonstrated.

**Do not rewrite the chapter. Reopen it for controlled expansion.** Reuse the exact timeline/allocation/solver/verifier foundation, add missing authorities and QLs, rebuild generator diversity, then perform the real English → localization → Question Studio freeze sequence.
