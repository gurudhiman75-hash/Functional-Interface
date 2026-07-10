# RAP Chapter QL Enrichment Plan
**Scope:** ExamTree Quant V4 → Arithmetic → Ratio & Proportion  
**Purpose:** Exact proposed QL additions for exam-readiness enrichment after the current RAP family became English QA-clean for manual review.
**Status of this file:** Planning artifact. These QLs are proposed additions, not yet implemented.
**Do not commit/push automatically.** Use this as the implementation map for the next enrichment pass.

## Current Baseline

- `RAP-001` already has broad fundamental coverage and should not be expanded in this pass.
- `RAP-002` is structurally clean but thin for exam-readiness. It should be expanded first.
- `RAP-003` has correct advanced application coverage, but high-frequency exam families need more variants.

## Addition Summary

| Package | Current issue | Proposed addition | Priority |
|---|---|---:|---|
| RAP-001 | Already broad; needs manual review only | 0 QLs | Low |
| RAP-002 | Only 49 active QLs; linked-ratio mechanics under-sampled | 112 QLs | Very High |
| RAP-003 | Broad, QA-clean, but high-frequency application families need variants | 171 QLs | High |
| **Total** |  | **283 proposed QLs** |  |

## Implementation Rules

1. Keep `RAP-001` stable; do not add QLs there unless a manual review finds a true gap.
2. Expand `RAP-002` first, because it has the biggest exam-readiness gap.
3. Keep `RAP-002` as linked/compound mechanics. Do not turn it into a second application chapter.
4. Expand `RAP-003` selectively around high-frequency exam applications: age, income-expenditure, alligation, rate-product, election/share chains.
5. Keep all packages English-only in Question Studio until Hindi/Punjabi editorial localization is done.
6. Every new QL must update:
   - `question-language.en.json`
   - `task-registry.library.json`
   - `types.ts` if a new task kind or answer type is introduced
   - `parameter-generator.ts`
   - `solver.ts`
   - `explanation-renderer.ts`
   - package tests, smoke, residual QA, and reports

# RAP-002 Proposed QL Additions

**Target:** expand from 49 active QLs to roughly 160 active QLs. This intentionally overshoots the earlier 120–150 target slightly, but can be implemented in phases.

## RAP-CP-007 — Direct Chain Ratios

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-213 | chainAlignment | Medium | Three-entity bridge A:B and B:C; find A:B:C. | ratioA1, ratioB1, ratioB2, ratioC2, entity labels | RATIO | Adds common SSC bridge-ratio form before four-part chains. |
| RAP-QL-214 | extendedChainAlignment | Medium | A:B and B:C given; find A:C only. | ratioA1, ratioB1, ratioB2, ratioC2, targetPairLabel | RATIO | Tests selected endpoint ratio without requiring full chain answer. |
| RAP-QL-215 | chainAlignment | Hard | Five-entity chain A:B, B:C, C:D, D:E; find A:B:C:D:E. | four adjacent ratios, five entity labels | RATIO | Expands beyond existing four-part chain. |
| RAP-QL-216 | extendedChainAlignment | Hard | Five-entity chain; find non-adjacent selected pair such as B:E. | four adjacent ratios, targetPairLabel | RATIO | Exam-style non-adjacent extraction. |
| RAP-QL-217 | missingChainRatio | Hard | A:B and B:C given; final A:C known; find missing B-linked ratio part. | endpointA, endpointC, missing bridge part | COUNT | Reverse bridge alignment, more realistic than current middle value wording. |
| RAP-QL-218 | chainAlignment | Medium | Class context: boys:girls, girls:teachers; find boys:girls:teachers. | class scenario labels, two ratios | RATIO | Adds classroom/population wording. |
| RAP-QL-219 | chainAlignment | Medium | Salary context: A:B and B:C salaries; find all salaries ratio. | salary entity labels, two ratios | RATIO | Adds banking/SSC workplace context. |
| RAP-QL-220 | extendedChainAlignment | Hard | Production chain: Machine A:B, B:C, C:D; find A:D output ratio. | machine labels, three ratios | RATIO | Adds production scenario. |
| RAP-QL-221 | chainAlignment | Medium | Marks chain across subjects/groups; find common ratio. | marks labels, two or three ratios | RATIO | Adds exam score context. |
| RAP-QL-222 | extendedChainAlignment | Hard | Given full chain plus one entity actual value, find another entity value. | aligned chain ratios, knownEntityValue, targetEntity | COUNT | Moves from pure ratio to practical count recovery. |
| RAP-QL-223 | chainAlignment | Hard | Given full chain and total of all entities, find target entity value. | chain ratios, totalValue, targetEntity | COUNT | Very common exam pattern. |
| RAP-QL-224 | extendedChainAlignment | Hard | Given full chain and difference between two selected entities, find target value. | chain ratios, differenceValue, targetEntity | COUNT | Adds difference constraint. |
| RAP-QL-225 | extendedChainAlignment | Hard | Given full chain and sum of two selected entities, find another entity. | chain ratios, selectedPairSum, targetEntity | COUNT | Adds partial-sum constraint. |
| RAP-QL-226 | missingChainRatio | Hard | A:C known and A:B known; find B:C ratio. | ratioA1, ratioB1, endpointA, endpointC | RATIO | Completes missing adjacent ratio. |
| RAP-QL-227 | chainAlignment | Medium | Ratio chain with non-coprime given ratios; simplify final chain. | ratios with common factors | RATIO | Prevents overfitting to already-reduced ratios. |
| RAP-QL-228 | extendedChainAlignment | Hard | Find ratio of sum groups, e.g. (A+B):(C+D), from full chain. | full chain ratios, groupedTargetLabel | RATIO | Adds high-quality grouped ratio comparison. |

## RAP-CP-008 — Reverse Chain Proportions

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-307 | reverseMiddleFinding | Medium | A:B and B:C given; A actual value known; find C. | ratioA1, ratioB1, ratioB2, ratioC2, valueA | COUNT | Endpoint recovery via bridge scaling. |
| RAP-QL-308 | reverseMiddleFinding | Medium | A:B and B:C given; C actual value known; find A. | ratios, valueC | COUNT | Reverse endpoint recovery from last value. |
| RAP-QL-309 | reverseEndpointFinding | Medium | B actual value known; find A and C difference. | ratios, valueB | COUNT | Adds difference as answer from known bridge. |
| RAP-QL-310 | constrainedReverseChain | Hard | A+B+C total known; find A. | ratios, totalValue | COUNT | Current total pattern asks B; expand target variation. |
| RAP-QL-311 | constrainedReverseChain | Hard | A+C difference known; find A and C values. | ratios, valueDifference | COUNT | A/C difference with endpoint target. |
| RAP-QL-312 | constrainedReverseChain | Hard | B+C sum known; find A. | ratios, selectedSum | COUNT | Partial-sum reverse chain. |
| RAP-QL-313 | constrainedReverseChain | Hard | A+B sum known; find C. | ratios, selectedSum | COUNT | Alternate partial-sum branch. |
| RAP-QL-314 | reverseEndpointFinding | Medium | B:C given and A:B given; B actual known; find full A:B:C ratio and target value. | ratios, valueB | COUNT | Combines ratio alignment with numeric recovery. |
| RAP-QL-315 | reverseMiddleFinding | Hard | A:C final simplified ratio known and A actual known; find B using bridge constraints. | endpointA, endpointC, ratioA1, ratioB1 | COUNT | Reverse from endpoint plus one adjacent ratio. |
| RAP-QL-316 | reverseEndpointFinding | Hard | Known C and A:C simplified ratio; recover A, then B. | endpointA, endpointC, valueC, ratioA1, ratioB1 | COUNT | Tests multi-step reverse scaling. |
| RAP-QL-317 | constrainedReverseChain | Hard | Difference between A and B known; find C. | ratios, valueDifference | COUNT | Adds adjacent difference constraint. |
| RAP-QL-318 | constrainedReverseChain | Hard | Difference between B and C known; find A. | ratios, valueDifference | COUNT | Complements previous variant. |
| RAP-QL-319 | reverseMiddleFinding | Medium | School population chain with known boys; find teachers/staff. | context labels, ratios, known value | COUNT | Exam-real context. |
| RAP-QL-320 | reverseMiddleFinding | Medium | Salary chain with known middle salary; find endpoint salary. | salary labels, ratios, valueB | COUNT | Banking workplace context. |
| RAP-QL-321 | reverseEndpointFinding | Medium | Production chain with known final output; find first unit output. | production labels, ratios, valueC | COUNT | Production scenario. |
| RAP-QL-322 | constrainedReverseChain | Hard | Village population chain with total known; find selected group. | population labels, ratios, totalValue | COUNT | Punjab/SSC style population use. |
| RAP-QL-323 | constrainedReverseChain | Hard | Three-part chain with one group exceeding another by amount; find third group. | ratios, excessValue | COUNT | Wording variation of difference constraint. |
| RAP-QL-324 | reverseEndpointFinding | Hard | Recover original full chain from one known entity and ask ratio of two non-adjacent entities. | ratios, known value, targetPairLabel | RATIO | Adds ratio output, not only count. |

## RAP-CP-009 — Multi-stage Ratio Transformations

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-410 | successiveRatioChange | Medium | Same quantity added to both sides; find new ratio. | ratioA, ratioB, totalValue, commonAdd | RATIO | Classic ratio-change pattern. |
| RAP-QL-411 | successiveRatioChange | Medium | Same quantity removed from both sides; find new ratio. | ratioA, ratioB, totalValue, commonRemove | RATIO | Complements addition. |
| RAP-QL-412 | successiveRatioChange | Medium | Amount added to A only; find final ratio. | ratioA, ratioB, totalValue, valueAddA | RATIO | Common one-sided change. |
| RAP-QL-413 | successiveRatioChange | Medium | Amount removed from B only; find final ratio. | ratioA, ratioB, totalValue, valueRemoveB | RATIO | Common one-sided removal. |
| RAP-QL-414 | transferTracking | Hard | Transfer from A to B; final ratio asked. | ratioA, ratioB, totalValue, transferValue | RATIO | Existing type but new context/wording. |
| RAP-QL-415 | transferTracking | Hard | Transfer from B to A; final ratio asked. | ratioA, ratioB, totalValue, transferValue | RATIO | Existing type but new context/wording. |
| RAP-QL-416 | reconstructOriginalRatio | Hard | Final ratio and amount added to A are given; original ratio asked. | finalRatioA, finalRatioB, valueAddA, originalTotal | RATIO | Reverse addition. |
| RAP-QL-417 | reconstructOriginalRatio | Hard | Final ratio and amount removed from B are given; original ratio asked. | finalRatioA, finalRatioB, valueRemoveB, totalValue | RATIO | Reverse removal. |
| RAP-QL-418 | reconstructOriginalRatio | Hard | Final ratio after transfer A→B; original ratio asked. | finalRatioA, finalRatioB, transferValue, totalValue | RATIO | Reverse transfer. |
| RAP-QL-419 | successiveRatioChange | Hard | Two successive operations: add to A then remove from B; final ratio asked. | ratioA, ratioB, totalValue, valueAddA, valueRemoveB | RATIO | Multi-step realistic transformation. |
| RAP-QL-420 | successiveRatioChange | Hard | Different amounts added to both sides; final ratio asked. | ratioA, ratioB, totalValue, valueAddA, valueAddB | RATIO | Current 401 exists; add scenario/target variations. |
| RAP-QL-421 | successiveRatioChange | Hard | Different amounts removed from both sides; final ratio asked. | ratioA, ratioB, totalValue, valueRemoveA, valueRemoveB | RATIO | Missing symmetric variant. |
| RAP-QL-422 | reconstructOriginalRatio | Hard | After adding same amount to both sides, ratio becomes final; find amount added. | ratioA, ratioB, totalValue, finalRatioA, finalRatioB | COUNT | Unknown operation amount. |
| RAP-QL-423 | reconstructOriginalRatio | Hard | After transferring x from A to B, ratio becomes final; find x. | ratioA, ratioB, totalValue, finalRatioA, finalRatioB | COUNT | Very common exam pattern. |
| RAP-QL-424 | successiveRatioChange | Medium | Boys:girls after new admissions; final ratio asked. | boysGirls labels, ratio, total, admissions | RATIO | Natural classroom context. |
| RAP-QL-425 | successiveRatioChange | Medium | Stock ratio after sales from one category. | stock labels, ratio, total, soldValue | RATIO | Retail/stock context. |
| RAP-QL-426 | transferTracking | Hard | Supporters/voters switch sides; final ratio asked. | supporter labels, ratio, total, switchValue | RATIO | Election-adjacent but transformation-owned. |
| RAP-QL-427 | reconstructOriginalRatio | Hard | Final ratio after switch; original supporters ratio asked. | final ratio, switchValue, totalValue | RATIO | Reverse switch context. |
| RAP-QL-428 | successiveRatioChange | Hard | Money ratio after one spends and another receives amount. | money labels, ratio, total, spend/add values | RATIO | Banking-friendly wording. |
| RAP-QL-429 | reconstructOriginalRatio | Hard | Given final ratio and one person's final amount, find original total. | finalRatioA, finalRatioB, finalValueA, operationValue | COUNT | Hard reverse numeric recovery. |

## RAP-CP-010 — Conditional Partition With Ratios

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-509 | nestedPartition | Medium | Total split A:B; A split C:D; find D. | totalValue, ratioA, ratioB, subRatioC, subRatioD | COUNT | Target variation. |
| RAP-QL-510 | nestedPartition | Medium | Total split A:B; B split C:D; find C. | same as above | COUNT | Target variation. |
| RAP-QL-511 | nestedPartition | Hard | Total split A:B:C; selected branch split into two; find sub-branch. | three-level ratios, totalValue | COUNT | Adds three-parent branch. |
| RAP-QL-512 | conditionalDistribution | Hard | If selected branch exceeds threshold, split; otherwise ask original branch value. | thresholdValue, ratios, totalValue | COUNT | Conditional logic. |
| RAP-QL-513 | conditionalDistribution | Hard | Known sub-branch value; recover total. | subBranchValue, ratios | COUNT | Reverse nested partition. |
| RAP-QL-514 | conditionalDistribution | Hard | Known difference between sub-branches; recover total. | subBranchDifference, ratios | COUNT | Reverse from difference. |
| RAP-QL-515 | nestedPartition | Medium | Class: boys:girls; boys passed:failed; find failed boys. | class labels, total, ratios | COUNT | Exam-real context. |
| RAP-QL-516 | nestedPartition | Medium | Company: permanent:temporary; selected group trained:untrained; find target. | employee labels, total, ratios | COUNT | Workplace context. |
| RAP-QL-517 | nestedPartition | Medium | Village: males:females; females literate:illiterate; find literate females. | population labels, total, ratios | COUNT | Cross-table bridge but still nested. |
| RAP-QL-518 | weightedNestedPartition | Hard | Nested marks distribution with weights; find weighted total. | branch ratios, sub-ratios, weights | COUNT | More applied weighted variant. |
| RAP-QL-519 | weightedNestedPartition | Hard | Nested product quantities and prices; find total value. | ratios, prices, total quantity | COUNT | Commerce context. |
| RAP-QL-520 | nestedPartition | Hard | Find ratio of two sub-branches across different parent groups. | two branch ratios and sub-ratios | RATIO | Adds cross-subshare ratio answer. |
| RAP-QL-521 | conditionalDistribution | Hard | Find sum of two selected sub-branches across parents. | ratios, totalValue, selected labels | COUNT | Mini-DI style. |
| RAP-QL-522 | conditionalDistribution | Hard | Find difference between two selected sub-branches. | ratios, totalValue, selected labels | COUNT | Mini-DI style. |
| RAP-QL-523 | nestedPartition | Hard | Three-level partition: total → branch → sub-branch → sub-sub-branch. | three nested ratios, totalValue | COUNT | Advanced nesting. |
| RAP-QL-524 | nestedPartition | Medium | Fund division with selected branch split by condition; target share asked. | fund labels, ratios, total | COUNT | Finance context. |
| RAP-QL-525 | conditionalDistribution | Hard | Total recovered from target subshare and ratio chain. | targetSubshare, ratios | COUNT | Reverse nested chain. |
| RAP-QL-526 | weightedNestedPartition | Hard | Weighted average style nested shares, answer ratio of weighted outputs. | subshares, weights | RATIO | Adds ratio output. |

## RAP-CP-011 — Inverse Proportion Chains

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-609 | inverseChainWork | Medium | Workers ratio given; days of B known; find days of A. | ratioA, ratioB, valueB | COUNT | Reverse target variation. |
| RAP-QL-610 | inverseChainWork | Medium | Men ratio and fixed work; find time ratio. | ratioA, ratioB | RATIO | Pure inverse answer. |
| RAP-QL-611 | inverseChainWork | Hard | Workers and efficiency ratios given; find days ratio. | workerRatio, efficiencyRatio | RATIO | Combined inverse/direct product. |
| RAP-QL-612 | inverseChainWork | Hard | Machines:hours fixed output; one machine group time known; find other. | machine ratios, time known | COUNT | Machine productivity context. |
| RAP-QL-613 | inverseChainWork | Hard | Pipes filling same tank; pipe capacities ratio; find time ratio. | capacityRatio | RATIO | Pipes context. |
| RAP-QL-614 | inverseChainWork | Hard | Food-days-men inverse chain; find days after men change. | men ratio, food total, days | COUNT | Hostel/camp classic. |
| RAP-QL-615 | combinedInverseChain | Hard | Output proportional to workers × hours × efficiency; find output ratio. | workersRatio, hoursRatio, efficiencyRatio | RATIO | Rate-product but mechanics-owned. |
| RAP-QL-616 | combinedInverseChain | Hard | Equal output, workers and efficiency ratios given; find time ratio. | workerRatio, efficiencyRatio | RATIO | Inverse-product variant. |
| RAP-QL-617 | inverseChainSpeed | Medium | Fixed distance: speed ratio given; time ratio asked. | speedRatioA, speedRatioB | RATIO | Clean inverse SDT. |
| RAP-QL-618 | inverseChainSpeed | Medium | Fixed time: speed ratio given; distance ratio asked. | speedRatioA, speedRatioB | RATIO | Direct counterpart. |
| RAP-QL-619 | combinedInverseChain | Hard | Speed and stoppage-time ratio; effective distance ratio asked. | speedRatio, timeRatio | RATIO | Transport context. |
| RAP-QL-620 | inverseChainWork | Hard | More workers join midway; equivalent days asked. | initialWorkers, addedWorkers, daysWorked, remainingWork | COUNT | Classic work-ratio pattern. |
| RAP-QL-621 | inverseChainWork | Hard | Workers leave midway; completion days asked. | initialWorkers, remainingWorkers, work completed | COUNT | Complementary pattern. |
| RAP-QL-622 | combinedInverseChain | Hard | Two teams have worker ratio and days ratio; compare efficiencies. | workersRatio, daysRatio | RATIO | Recover efficiency ratio. |
| RAP-QL-623 | combinedInverseChain | Hard | Machine output ratio with machines and hours known; find efficiency ratio. | machineRatio, hoursRatio, outputRatio | RATIO | Reverse product. |
| RAP-QL-624 | inverseChainWork | Medium | If x men complete in d days, y men complete in how many days? | menA, daysA, menB | COUNT | Basic inverse proportionality with real numbers. |
| RAP-QL-625 | inverseChainWork | Medium | If work completed fraction changes, find required workers. | workFraction, days, workers | COUNT | Fractional work variant. |
| RAP-QL-626 | combinedInverseChain | Hard | A and B work rates in ratio; both work together; find work share ratio. | efficiencyRatio, timeRatio | RATIO | Work contribution boundary. |
| RAP-QL-627 | inverseChainSpeed | Hard | Three vehicles speed chain; fixed distance; order time taken. | speed chain ratios | LOGIC | Combines inverse and ordering. |
| RAP-QL-628 | combinedInverseChain | Hard | Direct with quantity, inverse with time; find missing ratio. | quantityRatio, timeRatio | RATIO | Mixed direct/inverse variation. |
| RAP-QL-629 | inverseChainWork | Hard | Given days ratio and workers ratio, find efficiency comparison. | workersRatio, daysRatio | LOGIC | Concept check. |
| RAP-QL-630 | combinedInverseChain | Hard | Find missing variable in product ratio workers × hours × days. | product target, two known ratios | COUNT | Hard product-ratio missing factor. |

## RAP-CP-012 — Ratio Comparison & Ordering

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-707 | chainOrdering | Medium | Three entities from A:B and B:C; greatest asked. | two ratios | LOGIC | Direct ranking. |
| RAP-QL-708 | chainOrdering | Hard | Four entities from three adjacent ratios; smallest asked. | three ratios | LOGIC | Target-specific ordering. |
| RAP-QL-709 | chainInequality | Medium | Compare A+C with B from aligned chain. | two ratios | LOGIC | Composite comparison. |
| RAP-QL-710 | chainInequality | Hard | Compare A+B and C+D from four-part chain. | three ratios | LOGIC | Grouped inequality. |
| RAP-QL-711 | chainEquivalence | Medium | Check if two simplified ratios are equivalent after scaling. | ratioA:B, equivalentA:B | LOGIC | Existing 706 but with realistic wording. |
| RAP-QL-712 | chainEquivalence | Hard | Find missing value to make A:C equivalent after chain alignment. | two ratios, missingEndpoint | COUNT | Missing equivalence. |
| RAP-QL-713 | chainEquivalence | Hard | Given A:B and C:D, determine if A/C = B/D. | two independent ratios | LOGIC | Cross-equivalence. |
| RAP-QL-714 | chainInequality | Medium | Which pair has larger share: A:B or C:D after common base? | two ratios | LOGIC | Ratio comparison without full chain. |
| RAP-QL-715 | chainOrdering | Medium | Salary ratios of three employees; arrange salaries. | salary labels, ratios | LOGIC | Workplace context. |
| RAP-QL-716 | chainOrdering | Medium | Marks ratios of four students; arrange marks. | marks labels, ratios | LOGIC | Exam score context. |
| RAP-QL-717 | chainInequality | Hard | Production chain; compare two machines after alignment. | production labels, ratios | LOGIC | Machine context. |
| RAP-QL-718 | chainEquivalence | Hard | Detect contradiction between direct A:C ratio and chained A:C ratio. | chain ratios, givenEndpointRatio | LOGIC | High-quality reasoning gap. |
| RAP-QL-719 | chainOrdering | Hard | Rank four departments and ask second highest. | chain ratios | LOGIC | Ranking variant. |
| RAP-QL-720 | chainOrdering | Hard | Rank and ask difference ratio between highest and lowest. | chain ratios | RATIO | Ratio answer from ordering. |
| RAP-QL-721 | chainInequality | Hard | Compare fractions formed from ratios, e.g. A/(A+B) vs C/(C+D). | two ratio pairs | LOGIC | Exam reasoning variant. |
| RAP-QL-722 | chainEquivalence | Medium | Find whether ratio statement remains same after multiplying both parts by different expressions. | ratio values | LOGIC | Basic equivalence trap. |
| RAP-QL-723 | chainInequality | Hard | Logical conclusion: if A:B and B:C, determine true statement among options. | two ratios | LOGIC | Question Studio option quality stress. |
| RAP-QL-724 | chainEquivalence | Hard | Find missing bridge ratio so A:C equals target ratio. | ratioA1, ratioB1, target A:C | RATIO | Constructive equivalence. |

# RAP-003 Proposed QL Additions

**Target:** strengthen exam-realism across advanced application families without changing the RAP-003 CP map.

## RAP-CP-013 — Weighted Contribution Ratios

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-805 | partnershipThreePartnerProfitShare | Medium | Three partners invest different amounts for different months; find target share. | investmentA/B/C, timeA/B/C, totalProfit, targetPartner | PROFIT | Adds missing three-partner partnership. |
| RAP-QL-806 | partnershipLeavingPartnerProfit | Medium | One partner leaves before year-end; find profit share. | investmentA/B, timeA/B, totalProfit, targetPartner | PROFIT | Complements joining-partner type. |
| RAP-QL-807 | partnershipMidPeriodChangeBoth | Hard | Both partners change capital mid-period; find target share. | initial/changed investments, periods, totalProfit | PROFIT | Harder than current one-sided change. |
| RAP-QL-808 | partnershipSalaryThenProfitShare | Hard | Working partner gets fixed salary first; remaining profit split by contribution. | salaryAmount, investments, times, totalProfit | PROFIT | Classic partnership exam variant. |
| RAP-QL-809 | partnershipProfitFromKnownShare | Hard | One partner’s share is known; find total profit. | knownShare, contribution products | PROFIT | Reverse partnership. |
| RAP-QL-810 | partnershipCapitalRatioTimeRatio | Medium | Capital ratio and time ratio given; find profit ratio. | capitalRatioA/B, timeRatioA/B | RATIO | Fast ratio-product pattern. |
| RAP-QL-811 | partnershipLossShare | Medium | Loss is divided by investment-time ratio; find target loss. | investments, times, totalLoss | PROFIT | Profit/loss symmetry. |
| RAP-QL-812 | workContributionShare | Medium | Workers have efficiency ratio and days ratio; find work contribution ratio. | efficiencyRatio, daysRatio | RATIO | Bridges contribution method without partnership. |
| RAP-QL-813 | partnershipNewPartnerCapital | Hard | New partner joins; find required investment for given profit share ratio. | existing investment/time, target ratio | QUANTITY | Reverse capital recovery. |
| RAP-QL-814 | partnershipTimeFromProfitRatio | Hard | Investments and profit ratio known; find missing time period. | investments, profitRatio, knownTime | TIME | Reverse time recovery. |
| RAP-QL-815 | partnershipTargetPartnerShareFromRatio | Easy | Profit ratio directly from effective capitals; find target share. | effectiveRatio, totalProfit | PROFIT | Simple exam bridge. |
| RAP-QL-816 | partnershipRemainingProfitAfterCommission | Hard | Commission deducted first, remaining profit split. | commission, investments, times, totalProfit | PROFIT | More realistic business wording. |

## RAP-CP-014 — Time-shift Ratio With Invariant Difference

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-911 | agePresentFromFutureRatio | Medium | Present ratio and future ratio; ask elder age. | ratioA/B, shiftYears, futureRatioA/B | AGE | Target variation. |
| RAP-QL-912 | agePresentFromFutureRatio | Medium | Present ratio and future ratio; ask younger age. | same | AGE | Target variation. |
| RAP-QL-913 | agePresentFromPastRatio | Hard | Present ratio and past ratio; ask elder age. | ratioA/B, shiftYears, pastRatioA/B | AGE | Past-ratio variant. |
| RAP-QL-914 | agePresentFromPastRatio | Hard | Present ratio and past ratio; ask younger age. | same | AGE | Target variation. |
| RAP-QL-915 | ageYearsToReachPastRatio | Hard | How many years ago was the ratio X:Y? | presentAgeA/B, pastRatioA/B | TIME | Missing backward years-to-reach type. |
| RAP-QL-916 | ageFromDifferenceAndRatio | Easy | Age difference and ratio; ask elder. | ratioA/B, ageDifference | AGE | Easy SSC pattern. |
| RAP-QL-917 | ageFromDifferenceAndRatio | Easy | Age difference and ratio; ask younger. | same | AGE | Target variation. |
| RAP-QL-918 | ageFromSumAndRatio | Easy | Age sum and ratio; ask elder/younger. | ratioA/B, ageSum | AGE | Already type exists; more QL contexts. |
| RAP-QL-919 | ageThreePersonSumRatio | Medium | Three-person ratio and total; ask middle person. | ratioA/B/C, ageSum | AGE | Target variation. |
| RAP-QL-920 | ageThreePersonKnownAge | Medium | Three-person ratio and one actual age; find another. | ratioA/B/C, knownAge, targetPerson | AGE | Missing reverse three-person type. |
| RAP-QL-921 | ageAverageAndRatio | Medium | Average age of two people and ratio; find one age. | averageAge, ratioA/B | AGE | Average-age hybrid. |
| RAP-QL-922 | ageAverageThreePersonRatio | Medium | Average age of three people and ratio; find target age. | averageAge, ratioA/B/C | AGE | Frequent exam wording. |
| RAP-QL-923 | ageFutureSumAndPresentRatio | Hard | Present ratio plus future sum after n years; find present age. | ratioA/B, shiftYears, futureSum | AGE | Reverse sum with time shift. |
| RAP-QL-924 | agePastSumAndPresentRatio | Hard | Present ratio plus past sum n years ago; find present age. | ratioA/B, shiftYears, pastSum | AGE | Past-sum variant. |
| RAP-QL-925 | ageFutureRatioFromPresent | Easy | Current ages given; ratio after n years. | presentAgeA/B, shiftYears | RATIO | Already type but more contexts. |
| RAP-QL-926 | agePastRatioFromPresent | Medium | Current ages given; ratio n years ago. | presentAgeA/B, shiftYears | RATIO | Requires valid past-age guard. |
| RAP-QL-927 | ageDoubleHalfWording | Medium | A is twice/half relation after n years; find current age. | relationFactor, shiftYears, current/past condition | AGE | Natural language exam style. |
| RAP-QL-928 | ageFatherSonRealistic | Medium | Father-son realistic ratio after years; find son's age. | safe parent-child ages/ratios | AGE | Explicit realism pool. |
| RAP-QL-929 | ageMotherDaughterRealistic | Medium | Mother-daughter realistic past/future ratio; find daughter/mother age. | safe parent-child ages/ratios | AGE | Explicit realism pool. |
| RAP-QL-930 | ageBrotherSisterNeutral | Medium | Sibling ages ratio with future condition. | neutral/sibling labels | AGE | Avoids parent-age constraints. |

## RAP-CP-015 — Two-ratio Reconciliation

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-955 | incomeExpenditureSavingsRatio | Medium | Income ratio and expenditure ratio; find savings ratio from given units. | income/expenditure ratios and units | RATIO | More contexts. |
| RAP-QL-956 | incomeExpenditureEqualSavings | Medium | Equal savings; one income known; find other income. | ratios, givenIncomeA/B | QUANTITY | Missing target. |
| RAP-QL-957 | incomeExpenditureEqualSavings | Medium | Equal savings; one expenditure known; find both savings. | ratios, givenExpenditure | QUANTITY | Practical reverse. |
| RAP-QL-958 | incomeFromSavingsRatio | Hard | Savings ratio and expenditure ratio; find income ratio. | expenditureRatio, savingsRatio | RATIO | Reverse income ratio. |
| RAP-QL-959 | expenditureFromSavingsRatio | Hard | Income ratio and savings ratio; find expenditure ratio. | incomeRatio, savingsRatio | RATIO | Reverse expenditure ratio. |
| RAP-QL-960 | incomeExpenseDifferenceSavings | Hard | Difference in savings known; find one income. | ratios, savingsDifference | QUANTITY | Common hard variant. |
| RAP-QL-961 | incomeExpenseSumSavings | Hard | Sum of savings known; find target expenditure. | ratios, savingsSum | QUANTITY | Complement to difference. |
| RAP-QL-962 | incomeExpenseOneSavesPercent | Medium | A saves x% of income, B saves y%; income ratio given; find savings ratio. | savePercentA/B, incomeRatio | RATIO | Ratio-percent bridge. |
| RAP-QL-963 | incomeExpenseFindSavingsPercent | Hard | Income/expenditure values from ratios; find savings percentage of income. | ratios, units | PERCENT | Exam-rich output. |
| RAP-QL-964 | familyIncomeExpenditure | Medium | Family A/B income-expense ratio; find combined savings. | family labels, ratios, known unit | QUANTITY | Family context. |
| RAP-QL-965 | salarySpendingSavings | Medium | Salary and spending ratios; find who saves more and by how much. | salary ratios, expense ratios, unit | QUANTITY | Comparison context. |
| RAP-QL-966 | shopRevenueCostProfit | Hard | Revenue and cost ratios; find profit ratio/amount. | revenue ratio, cost ratio, known amount | RATIO | Business analogue. |
| RAP-QL-967 | equalIncomeDifferentExpense | Medium | Equal incomes and expenditure ratio; find savings ratio. | expenseRatio, incomeValue | RATIO | Simple reconciliation. |
| RAP-QL-968 | equalExpenseDifferentIncome | Medium | Equal expenditure and income ratio; find savings ratio. | incomeRatio, expenseValue | RATIO | Complement. |
| RAP-QL-969 | pocketMoneySpending | Easy | Pocket money ratio and spending ratio; find saving ratio. | student context | RATIO | Realistic easy QL. |
| RAP-QL-970 | givenOneSavesMore | Hard | A saves Rs x more than B; find target income. | ratios, savingDifference | QUANTITY | Common exam hard. |
| RAP-QL-971 | givenOneSpendsMore | Hard | B spends Rs x more than A; find target saving. | ratios, expenseDifference | QUANTITY | Expense-difference variant. |
| RAP-QL-972 | incomeExpenseTotalIncome | Hard | Combined income known; find combined savings. | income ratio, expense ratio, totalIncome | QUANTITY | Aggregate variant. |
| RAP-QL-973 | incomeExpenseTotalExpense | Hard | Combined expenditure known; find combined income. | ratios, totalExpense | QUANTITY | Reverse aggregate. |
| RAP-QL-974 | incomeExpenseSavingsComparison | Medium | Find ratio of savings and identify larger saver. | ratios, units | LOGIC | Adds logic answer possibility if implemented. |

## RAP-CP-016 — Weighted Average / Alligation

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-1005 | alloyMixingRatioFromTarget | Medium | Two alloys with target percentage; ratio asked. | percentA/B, targetPercent | RATIO | More source contexts. |
| RAP-QL-1006 | alloyMixingRatioFromTarget | Medium | Acid solutions to target concentration. | percentA/B, targetPercent | RATIO | High-frequency solution context. |
| RAP-QL-1007 | alloyMixingRatioFromTarget | Medium | Milk-water mixtures to target milk percentage. | percentA/B, targetPercent | RATIO | SSC classic. |
| RAP-QL-1008 | alloyTargetComponentFromMix | Medium | Known quantities of two mixtures; final concentration asked. | quantityA/B, percentA/B | PERCENT | Weighted average. |
| RAP-QL-1009 | alloyTargetComponentFromMix | Medium | Average cost of two item groups. | quantityA/B, costA/B | QUANTITY | Price mixture. |
| RAP-QL-1010 | weightedAverageGroup | Medium | Average marks of two groups combined. | countA/B, averageA/B | QUANTITY | Average-by-ratio style. |
| RAP-QL-1011 | weightedAverageGroup | Medium | Average salary of two departments combined. | countA/B, averageA/B | QUANTITY | Banking workplace. |
| RAP-QL-1012 | alloyMissingQuantity | Hard | One mixture quantity known, target percent known; find other quantity. | quantityA, percentA/B, targetPercent | QUANTITY | Reverse alligation. |
| RAP-QL-1013 | alloyMissingSourcePercent | Hard | Mixing ratio and target percent known; find one source percent. | mixRatio, percentKnown, targetPercent | PERCENT | Reverse source. |
| RAP-QL-1014 | alloyTargetFromThreeSources | Hard | Three mixtures with unequal quantities; final percent asked. | quantityA/B/C, percentA/B/C | PERCENT | Three-source expansion. |
| RAP-QL-1015 | alloyThreeSourceEqualMix | Hard | Three sources equal quantity; final component ratio asked. | component ratios | RATIO | Existing type with more scenario. |
| RAP-QL-1016 | alloyPureAndImpureMix | Medium | Pure component mixed with solution; target concentration ratio asked. | 100%, sourcePercent, targetPercent | RATIO | Common alligation edge. |
| RAP-QL-1017 | alloyZeroComponentMix | Medium | Water/zero component source mixed to target concentration. | 0%, sourcePercent, targetPercent | RATIO | Common dilution. |
| RAP-QL-1018 | weightedProfitPercentMix | Hard | Two items with different profit percentages; overall profit percent asked. | quantities/CPs/profit rates | PERCENT | Profit-alligation bridge. |
| RAP-QL-1019 | weightedDiscountMix | Hard | Two product categories with discounts; average discount asked. | bill values, discount rates | PERCENT | Commerce context. |
| RAP-QL-1020 | sugarSolutionConcentration | Medium | Sugar solution concentrations mixed; final percentage asked. | quantities, percents | PERCENT | Natural solution context. |
| RAP-QL-1021 | averagePriceFromRatio | Medium | Items bought in ratio at two prices; average price asked. | ratioA/B, priceA/B | QUANTITY | Ratio-weighted average. |
| RAP-QL-1022 | mixingRatioFromAveragePrice | Hard | Two prices and target average price; mixing ratio asked. | priceA/B, targetPrice | RATIO | Alligation price. |
| RAP-QL-1023 | marksAverageMixture | Medium | Two batches average marks; combined average asked. | count/ratio, avg marks | QUANTITY | Exam context. |
| RAP-QL-1024 | reverseWeightedAverageCount | Hard | Combined average and one group count known; find missing group count. | averageA/B, combinedAvg, countA | COUNT | Reverse weighted average. |
| RAP-QL-1025 | reverseWeightedAverageGroupAvg | Hard | Combined average and counts known; find missing group average. | counts, avgKnown, combinedAvg | QUANTITY | Reverse average. |
| RAP-QL-1026 | alloyTargetExactlyMidpoint | Easy | Target percent midpoint; mixing ratio should be 1:1. | percentA/B, targetMid | RATIO | Concept check. |
| RAP-QL-1027 | alloyNonMidpointTrap | Medium | Target close to one source; ratio not intuitive. | percentA/B, targetPercent | RATIO | Quality trap. |
| RAP-QL-1028 | alloyReplaceToTarget | Hard | Remove part of mixture and add stronger solution to target percent. | initialPercent, addPercent, targetPercent, totalQuantity | QUANTITY | Advanced alligation. |
| RAP-QL-1029 | alloyRatioToFinalPercent | Medium | Mixing ratio and source percentages given; final percent asked. | mixRatio, percentA/B | PERCENT | Reverse of alligation. |

## RAP-CP-017 — Repeated Proportional Replacement

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-1105 | replacementFinalRatio | Medium | Milk-water two replacements; final ratio asked. | initialVolume, removedVolume, replacementCount=2 | RATIO | SSC classic. |
| RAP-QL-1106 | replacementFinalRatio | Hard | Three replacements; final ratio asked. | replacementCount=3 | RATIO | Harder power use. |
| RAP-QL-1107 | replacementFinalQuantity | Medium | Original liquid remaining after n replacements. | initialVolume, removedVolume, replacementCount | QUANTITY | Quantity output. |
| RAP-QL-1108 | replacementAddedLiquidQuantity | Medium | Replacement liquid quantity after n operations. | initialVolume, removedVolume, replacementCount | QUANTITY | Complement target. |
| RAP-QL-1109 | replacementOriginalPercentRemaining | Medium | Percentage of original liquid remaining. | initialVolume, removedVolume, replacementCount | PERCENT | Percentage output. |
| RAP-QL-1110 | replacementIterationsFromFinalRatio | Hard | Find number of operations from final ratio. | initialVolume, removedVolume, finalRatio | COUNT | Current type with more cases. |
| RAP-QL-1111 | replacementRemovedVolumeFromFinalRatio | Hard | Find removed volume given final ratio after two operations. | initialVolume, finalRatio, replacementCount | QUANTITY | Reverse removal amount. |
| RAP-QL-1112 | replacementDifferentRounds | Hard | Two different removed volumes in two rounds; final quantity asked. | initialVolume, removed1, removed2 | QUANTITY | Advanced varied retention. |
| RAP-QL-1113 | replacementAcidWater | Medium | Acid-water replacement; final acid:water ratio. | acid/water labels | RATIO | Solution context. |
| RAP-QL-1114 | replacementWineWater | Medium | Wine-water repeated replacement; original wine remaining. | wine/water labels | QUANTITY | Classic context. |
| RAP-QL-1115 | replacementTankSolution | Hard | Tank solution replacement with percentage strength; final concentration. | initialPercent, removedVolume, addLiquidPercent | PERCENT | Concentration variant. |
| RAP-QL-1116 | replacementInventoryAnalogy | Medium | Inventory sold and restocked repeatedly; original stock remaining. | initialStock, soldEachRound, rounds | QUANTITY | Real-world analogy. |
| RAP-QL-1117 | replacementInitialFromFinalQuantity | Hard | Final original quantity known; find initial quantity. | finalQuantity, removedFraction, rounds | QUANTITY | Reverse initial. |
| RAP-QL-1118 | replacementFinalAfterFractionRemoval | Medium | Fraction of vessel removed each time; final ratio asked. | removedFraction, rounds | RATIO | Fraction removal form. |
| RAP-QL-1119 | replacementStrengthAfterRounds | Hard | Find final strength percentage after repeated dilution. | initialStrength, removedVolume, rounds | PERCENT | Exam concentration form. |

## RAP-CP-018 — Value-count Weighted Systems

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-1207 | denominationTotalValue | Easy | Coins in ratio; total value asked. | denominations, countRatio, commonUnit | QUANTITY | Coin context. |
| RAP-QL-1208 | denominationCountsFromValue | Medium | Notes in ratio; total value given; target count asked. | denominations, ratio, totalValue | COUNT | Banking context. |
| RAP-QL-1209 | denominationTargetCount | Medium | Stamps/tickets in ratio; target count asked. | denominations, commonUnit | COUNT | Alternative item. |
| RAP-QL-1210 | denominationTotalCountFromValue | Hard | Total value known; find total number of items. | denominations, ratios, totalValue | COUNT | Missing total count output. |
| RAP-QL-1211 | denominationTotalValueFromTotalCount | Hard | Total count known; find total value. | denominations, ratios, totalCount | QUANTITY | Reverse of count. |
| RAP-QL-1212 | denominationValueRatio | Medium | Find ratio of values contributed by denominations. | denominations, count ratios | RATIO | Distinguishes count vs value ratio. |
| RAP-QL-1213 | denominationSwapValue | Hard | Replace lower denomination by higher; new value asked. | swapCount, from/to denominations | QUANTITY | Existing type more variants. |
| RAP-QL-1214 | denominationAverageValue | Medium | Find average value per item. | denominations, count ratios | QUANTITY | Weighted average bridge. |
| RAP-QL-1215 | denominationFourTypeTotalCount | Hard | Four denominations; total value; target count. | four denominations and ratios | COUNT | Four-type expansion. |
| RAP-QL-1216 | denominationMissingRatioPart | Hard | Total value and two ratio parts known; find missing ratio part. | denominations, totalValue, known ratio parts | COUNT | Hard constructive. |
| RAP-QL-1217 | ticketValueSystem | Medium | Tickets of different prices in ratio; total revenue asked. | ticketPrices, ratios | QUANTITY | Exam-real ticket context. |
| RAP-QL-1218 | marksPerQuestionType | Hard | Questions of different marks in ratio; total marks asked. | markValues, count ratios | QUANTITY | Education context. |

## RAP-CP-019 — Inverse Rate-product Applications

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-1306 | sdtTimeRatioFromSpeedDistance | Medium | Speed ratio and distance ratio; time ratio asked with train context. | speedRatio, distanceRatio | RATIO | More scenario. |
| RAP-QL-1307 | sdtDistanceRatioFromSpeedTime | Easy | Speed ratio and time ratio; distance ratio asked with bus context. | speedRatio, timeRatio | RATIO | More scenario. |
| RAP-QL-1308 | sdtSpeedRatioFromDistanceTime | Medium | Distance and time ratios; speed ratio asked. | distanceRatio, timeRatio | RATIO | More scenario. |
| RAP-QL-1309 | fixedDistanceSpeedTimeInverse | Medium | Same distance; speeds in ratio; find time ratio. | speedRatio | RATIO | Pure inverse SDT. |
| RAP-QL-1310 | fixedTimeSpeedDistanceDirect | Easy | Same time; speed ratio; find distance ratio. | speedRatio | RATIO | Direct SDT. |
| RAP-QL-1311 | sdtRaceLead | Medium | Race lead in metres; find speed ratio. | raceLength, leadDistance | RATIO | Reverse race lead. |
| RAP-QL-1312 | sdtRaceLeadTime | Hard | Faster finishes x seconds earlier; speed ratio asked. | timeA, timeB or finish difference | RATIO | Time lead form. |
| RAP-QL-1313 | sdtOvertakeTime | Hard | Same direction relative speed; overtake time. | speedA/B, leadDistance | TIME | Existing type more contexts. |
| RAP-QL-1314 | sdtOppositeDirectionMeeting | Medium | Opposite direction; meeting time from distance. | speedA/B, distance | TIME | Relative speed. |
| RAP-QL-1315 | trainPlatformRatio | Hard | Train length/speed/time ratio; find missing time/length ratio. | train lengths/speeds/time | RATIO | Train-style ratio. |
| RAP-QL-1316 | workEfficiencyTimeRatio | Medium | Efficiency ratio and work ratio; time ratio asked. | efficiencyRatio, workRatio | RATIO | Work-rate product. |
| RAP-QL-1317 | machinesOutputTime | Medium | Machines and hours ratio; output ratio asked. | machineRatio, timeRatio | RATIO | Production context. |
| RAP-QL-1318 | pipesTimeRatio | Medium | Pipe rates ratio; filling time ratio asked. | rateRatio | RATIO | Pipe context. |
| RAP-QL-1319 | workersEfficiencyDays | Hard | Workers, efficiency, days ratios; work done ratio. | workersRatio, efficiencyRatio, daysRatio | RATIO | Combined product. |
| RAP-QL-1320 | findMissingRateFromOutput | Hard | Output ratio, time ratio known; find rate ratio. | outputRatio, timeRatio | RATIO | Reverse rate. |
| RAP-QL-1321 | timeSavedByHigherSpeed | Medium | Speed ratio and original time; time saved asked. | speedRatio, oldTime | TIME | Exam style. |
| RAP-QL-1322 | distanceSlowerCoversWhenFasterFinishes | Medium | Race distance and speed ratio; distance covered by slower. | trackDistance, speedRatio | QUANTITY | Race lead basis. |
| RAP-QL-1323 | sameWorkTwoTeams | Hard | Two teams with efficiency and worker ratios; compare completion time. | workersRatio, efficiencyRatio | RATIO | Team work. |
| RAP-QL-1324 | rateProductAbsoluteOutput | Hard | Rate×time×units with one actual output; find other output. | rate/time/unit ratios, outputA | QUANTITY | Absolute output. |
| RAP-QL-1325 | relativeSpeedRatioFromOvertake | Hard | Lead and overtake time known; find speed difference or ratio. | leadDistance, overtakeTime, oneSpeed | QUANTITY | Reverse relative speed. |

## RAP-CP-020 — Cross-tab Ratio Grid

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-1406 | populationCrossTabCellCount | Medium | Boys/girls and passed/failed split; find selected cell. | total, row ratio, pass/fail ratios | COUNT | School exam context. |
| RAP-QL-1407 | populationCrossTabCellCount | Medium | Urban/rural and employed/unemployed; find selected cell. | total, row ratios, employment ratios | COUNT | DI-like context. |
| RAP-QL-1408 | populationTotalLiterate | Easy | Total qualified from two groups. | total, group ratios, qualified ratios | COUNT | Generic table. |
| RAP-QL-1409 | populationTotalIlliterate | Easy | Total unqualified from two groups. | same | COUNT | Complement target. |
| RAP-QL-1410 | populationCellRatio | Hard | Ratio of two cells across different rows. | cell labels, table ratios | RATIO | Existing type variants. |
| RAP-QL-1411 | populationCellPercentOfTotal | Medium | Selected cell as percentage of total. | targetCellLabel, total | PERCENT | Useful DI output. |
| RAP-QL-1412 | populationRecoverTotalFromCell | Hard | One cell value known; recover total population. | knownCellValue, ratios | COUNT | Reverse grid. |
| RAP-QL-1413 | populationMissingRowTotal | Hard | Total literates given; recover male/female totals or selected cell. | known column total, ratios | COUNT | Reverse row/column. |
| RAP-QL-1414 | populationDifferenceBetweenCells | Medium | Difference between two selected cells. | ratios, total | COUNT | Common comparison. |
| RAP-QL-1415 | populationSumOfSelectedCells | Medium | Sum of two selected cells. | ratios, total | COUNT | Mini-DI style. |
| RAP-QL-1416 | populationThreeRows | Hard | Three groups each split into two categories; target cell/total asked. | three row ratios and internal ratios | COUNT | Advanced grid. |
| RAP-QL-1417 | populationMiniCaseletQuestion1 | Hard | Mini caselet: table described once; ask first metric. | shared table variables | COUNT | Caselet readiness. |
| RAP-QL-1418 | populationMiniCaseletQuestion2 | Hard | Mini caselet: ask ratio/percentage from same table. | shared table variables | RATIO/PERCENT | Caselet readiness. |
| RAP-QL-1419 | populationColumnRatioGiven | Hard | Row ratio plus column ratio; recover cells. | row ratio, column ratio, total | COUNT | More complex grid. |
| RAP-QL-1420 | populationTableValidationTrap | Hard | Given table ratios, find statement true/false. | ratios, derived cells | LOGIC | DI reasoning variant. |

## RAP-CP-021 — Vote / Share Distribution Chains

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-1506 | electionWinnerVotes | Easy | Valid votes and two-candidate ratio; winner votes. | totalValidVotes, candidateRatio | COUNT | Existing type more contexts. |
| RAP-QL-1507 | electionLoserVotes | Easy | Valid votes and ratio; loser votes. | totalValidVotes, candidateRatio | COUNT | Complement. |
| RAP-QL-1508 | electionWinningMargin | Medium | Valid votes and ratio; margin asked. | totalValidVotes, candidateRatio | COUNT | Direct margin. |
| RAP-QL-1509 | electionTotalVotersFromMargin | Hard | Margin, turnout, valid percent; total voters asked. | margin, turnout, validPercent, ratio | COUNT | Existing type variants. |
| RAP-QL-1510 | electionInvalidVotes | Easy | Total voters and turnout/invalid percent; invalid votes. | totalVoters, turnout, invalidPercent | COUNT | Existing type more contexts. |
| RAP-QL-1511 | electionPolledVotesFromTurnout | Easy | Total voters and turnout; polled votes asked. | totalVoters, turnoutPercent | COUNT | Missing chain stage. |
| RAP-QL-1512 | electionValidVotesFromInvalidRate | Easy | Polled votes and invalid percent; valid votes asked. | polledVotes, invalidPercent | COUNT | Missing chain stage. |
| RAP-QL-1513 | electionWinnerFromMarginAndValidVotes | Medium | Valid votes and margin; winner votes asked. | validVotes, margin | COUNT | Two-candidate equation. |
| RAP-QL-1514 | electionLoserFromMarginAndValidVotes | Medium | Valid votes and margin; loser votes asked. | validVotes, margin | COUNT | Complement. |
| RAP-QL-1515 | electionThreeCandidateSplit | Hard | Valid votes split among three candidates; winner votes/margin asked. | three ratio parts, validVotes | COUNT | Three-candidate variant. |
| RAP-QL-1516 | electionCandidateSharePercent | Medium | Candidate vote share percentage from ratio. | candidateRatio, validVotes optional | PERCENT | Ratio to percent. |
| RAP-QL-1517 | electionRatioFromVoteSharePercent | Medium | Vote share percentages; candidate ratio asked. | percentA/B | RATIO | Percent to ratio. |
| RAP-QL-1518 | electionOneCandidateMorePercent | Hard | A gets x% more votes than B; total valid known; votes asked. | morePercent, validVotes | COUNT | Percentage comparison. |
| RAP-QL-1519 | electionMarginAsPercentOfValid | Medium | Margin as percent of valid votes. | candidateRatio, validVotes | PERCENT | Exam common. |
| RAP-QL-1520 | electionTotalElectorateFromCandidateVotes | Hard | Candidate votes and ratio + turnout/valid chain; total electorate asked. | candidateVotes, candidateRatio, turnout, validPercent | COUNT | Reverse chain. |
| RAP-QL-1521 | marketShareWinner | Medium | Market share ratio among companies; leader share asked. | totalMarket, shareRatio | QUANTITY | Share distribution analogy. |
| RAP-QL-1522 | surveyResponseShare | Medium | Survey responses in ratio; selected category count asked. | totalResponses, ratio parts | COUNT | Survey analogy. |
| RAP-QL-1523 | electionNotaInvalidStyle | Medium | Polled votes include NOTA/invalid; valid candidate votes ratio; asked NOTA/invalid count. | totalVoters, turnout, notaPercent/invalidPercent | COUNT | Modern wording. |
| RAP-QL-1524 | electionReverseTurnoutFromValidVotes | Hard | Valid votes and valid-percent of polled known; total turnout asked. | validVotes, validPercent, totalVoters | PERCENT | Reverse turnout. |
| RAP-QL-1525 | electionMarginDifferenceChain | Hard | A defeats B by amount; ratio given; invalid percent known; total voters asked. | margin, ratio, invalidPercent, turnout | COUNT | Hard mixed chain. |

## RAP-CP-022 — Power-ratio Applications

| Proposed QL ID | Task kind | Difficulty | Stem intent | Required variable groups | Answer type | Why add it |
|---|---|---|---|---|---|---|
| RAP-QL-1606 | geometricAreaRatioFromSide | Easy | Squares side ratio; area ratio. | sideRatio | RATIO | Specific square wording. |
| RAP-QL-1607 | geometricAreaRatioFromSide | Easy | Similar triangles side ratio; area ratio. | sideRatio | RATIO | Common geometry wording. |
| RAP-QL-1608 | geometricVolumeRatioFromSide | Medium | Cubes side ratio; volume ratio. | sideRatio | RATIO | Specific solid. |
| RAP-QL-1609 | geometricVolumeRatioFromSide | Medium | Spheres radius ratio; volume ratio. | radiusRatio | RATIO | Sphere variant. |
| RAP-QL-1610 | geometricSideRatioFromArea | Medium | Area ratio of similar triangles; side ratio. | areaRatio | RATIO | Reverse square root. |
| RAP-QL-1611 | geometricSideRatioFromArea | Medium | Area ratio of circles; radius ratio. | areaRatio | RATIO | Circle reverse. |
| RAP-QL-1612 | geometricSurfaceAreaRatioFromVolume | Hard | Volume ratio of cubes; surface area ratio. | volumeRatio | RATIO | Power conversion. |
| RAP-QL-1613 | geometricSurfaceAreaRatioFromVolume | Hard | Volume ratio of spheres; surface area ratio. | volumeRatio | RATIO | Sphere power conversion. |
| RAP-QL-1614 | mapScaleAreaRatio | Medium | Map scale length ratio; area ratio. | scaleRatio | RATIO | Practical scale context. |
| RAP-QL-1615 | mapScaleLengthFromArea | Hard | Map area ratio; length scale ratio. | areaRatio | RATIO | Reverse map scale. |
| RAP-QL-1616 | similarSolidSurfaceToVolume | Hard | Surface area ratio given; volume ratio asked. | surfaceAreaRatio | RATIO | Reverse then cube. |
| RAP-QL-1617 | geometricPowerMixedStatement | Hard | Identify true statement for side/area/volume ratio. | side ratio | LOGIC | Conceptual option-based QL. |

# Recommended Phasing

## Phase 1 — Highest exam impact

Implement these first:

- RAP-002 CP-009: `RAP-QL-410` to `RAP-QL-429`
- RAP-002 CP-011: `RAP-QL-609` to `RAP-QL-630`
- RAP-003 CP-014: `RAP-QL-911` to `RAP-QL-930`
- RAP-003 CP-016: `RAP-QL-1005` to `RAP-QL-1029`
- RAP-003 CP-021: `RAP-QL-1506` to `RAP-QL-1525`

## Phase 2 — Complete RAP-002 breadth

- RAP-002 CP-007: `RAP-QL-213` to `RAP-QL-228`
- RAP-002 CP-008: `RAP-QL-307` to `RAP-QL-324`
- RAP-002 CP-010: `RAP-QL-509` to `RAP-QL-526`
- RAP-002 CP-012: `RAP-QL-707` to `RAP-QL-724`

## Phase 3 — Complete RAP-003 application depth

- RAP-003 CP-013: `RAP-QL-805` to `RAP-QL-816`
- RAP-003 CP-015: `RAP-QL-955` to `RAP-QL-974`
- RAP-003 CP-017: `RAP-QL-1105` to `RAP-QL-1119`
- RAP-003 CP-018: `RAP-QL-1207` to `RAP-QL-1218`
- RAP-003 CP-019: `RAP-QL-1306` to `RAP-QL-1325`
- RAP-003 CP-020: `RAP-QL-1406` to `RAP-QL-1420`
- RAP-003 CP-022: `RAP-QL-1606` to `RAP-QL-1617`

# QA Acceptance Criteria

After each phase, run:

```powershell
node build.mjs
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002.test.mjs
node dist/quant-v4/rap-002.test.mjs
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002-question-studio-smoke.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002-question-studio-smoke.mjs
node dist/quant-v4/rap-002-question-studio-smoke.mjs
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-002/rap-002-residual-qa.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-002-residual-qa.mjs
node dist/quant-v4/rap-002-residual-qa.mjs
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/rap-003.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-003.test.mjs
node dist/quant-v4/rap-003.test.mjs
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/rap-003-question-studio-smoke.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-003-question-studio-smoke.mjs
node dist/quant-v4/rap-003-question-studio-smoke.mjs
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-003/rap-003-residual-qa.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/rap-003-residual-qa.mjs
node dist/quant-v4/rap-003-residual-qa.mjs
```

Required final counters:

- duplicateStemGroupCount = 0
- grammarIssueCount = 0
- semanticCompatibilityIssueCount = 0
- unresolvedPlaceholderCount = 0
- invalidCorrectIndexCount = 0
- duplicateNormalizedOptionCount = 0
- weakOptionCount = 0
- validationFailureCount = 0
- metadataLanguageMismatchCount = 0
- unsupportedLanguageExposureCount = 0
- crossPackageDuplicateWithRap002Count = 0 for RAP-003
- explanation quality counters = 0 after the explanation-quality pass

# Final Notes

- The proposed IDs intentionally continue the existing package-local numbering ranges.
- Some proposed rows introduce new task kinds. Those should be added only if the solver can support them cleanly.
- If implementation time is limited, prioritize Phase 1 and postpone lower-frequency CPs.
- Do not mark RAP freeze-ready after this expansion until manual editorial review is complete.
