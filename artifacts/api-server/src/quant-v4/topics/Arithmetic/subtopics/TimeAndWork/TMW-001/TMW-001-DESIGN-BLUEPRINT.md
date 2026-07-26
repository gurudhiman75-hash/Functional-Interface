# TMW-001 — Time, Work & Pipes
## End-to-End Chapter Design Blueprint

**Status:** Design baseline; implementation must not begin until the design-freeze gates in this document pass.  
**Subject:** ExamTree Quant V4 → Arithmetic  
**Chapter ID:** `TMW-001`  
**Student-facing title:** **Time, Work & Pipes**  
**Primary exams:** SSC CGL/CHSL/MTS/GD, Banking (IBPS/SBI/RRB), Railway, Punjab state and other state-level competitive examinations  
**Runtime languages:** English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)  
**Design date:** 25 July 2026

---

## 1. Executive decision

`TMW-001` will be implemented as one student-facing chapter backed by several related runtime engines:

1. exact work-rate arithmetic;
2. signed-rate aggregation;
3. staged work-state transitions;
4. repeating schedule and terminal-remainder logic;
5. workforce/work-quantity equivalence;
6. heterogeneous-agent linear systems;
7. contribution-based wage allocation;
8. tank-capacity and flow-rate modelling;
9. non-uniform productivity sequences.

The chapter must cover the full competitive-exam domain without turning every wording variation into a new Question Language (QL). A QL represents a materially distinct exam task contract: a distinct given/unknown structure, governing inference, state topology, answer contract, or misconception profile.

**QL counts and solve-mode counts are not quotas.** They remain open during design and implementation. Permanent counts are frozen only when:

- source audits find no meaningful uncovered exam pattern;
- forward, reverse and inverse variants have been checked;
- edge, boundary and schedule variants have been checked;
- same-rule wording duplicates have been removed;
- cross-CP ownership collisions have been resolved;
- every retained QL has an independent solver or verifier;
- every retained QL has a formula and explanation strategy suited to its topology.

The CP structure below is a design boundary. The solve-mode inventory is a **current exhaustive discovery baseline**, not a terminal list. A later gap audit may add or merge solve modes, but may not add superficial wording-only variants.

---

## 2. Source and product basis

This blueprint is based on:

- uploaded quantitative aptitude references covering reciprocal work rates, percentage and LCM methods, negative work, work equivalence, workforce scaling, pipes, outlets, leaks and project applications;
- SSC-oriented examples and prior-year-style question families;
- the repository’s existing `time-work` motif foundation;
- ExamTree’s mature Quant V4 package conventions;
- lessons from Percentage, Ratio & Proportion, Average, Profit & Loss, Mensuration and P&C implementation and review;
- the requirement that questions feel like real SSC, Banking and Punjab exam questions rather than classroom drills.

The uploaded material confirms the shared mathematical backbone:

\[
\text{Work done}=\text{Rate}\times\text{Time}
\]

For a worker completing one whole job in \(T\) time units:

\[
r=\frac{1}{T}
\]

Pipes use the same engine. Inlets contribute positive rate; outlets and leaks contribute negative rate.

---

## 3. Scope and ownership boundaries

### 3.1 Included

The chapter owns:

- individual work, rate and time;
- fractional and percentage work;
- two-person, three-person and multi-agent combined work;
- component extraction from combined rates;
- pairwise-rate reconstruction;
- efficiency–time inverse relations;
- percentage efficiency changes;
- partial work and remaining work;
- delayed joining, early leaving, handoffs and work interruptions;
- alternating-day and periodic schedules;
- workforce–days–hours–efficiency equivalence;
- planned versus actual project progress;
- work-quantity and dimensional scaling where the tested inference is work equivalence;
- men/women/children, skilled/unskilled workers and different machine capacities;
- wage or payment distribution based on contribution;
- inlets, outlets, leaks and signed flow;
- tank volume, current level and flow rate;
- staged and cyclic pipe schedules;
- variable daily productivity, fatigue, learning and piecewise rates where source-backed and exam-realistic;
- MCQ and numeric-answer presentation;
- data-sufficiency presentation as a cross-cutting mode after the ordinary QL is proven.

### 3.2 Excluded or delegated

The chapter does not own:

- pure ratio/proportion questions with no work-state inference;
- time–speed–distance, boats, streams, trains or races;
- partnership profit distribution based on capital and time;
- pure mensuration of tanks, walls or roads when no work/flow inference is required;
- arithmetic progression questions with no productivity interpretation;
- employment law, payroll, salary taxation or commercial accounting;
- hydraulic pressure or physical fluid mechanics;
- open-ended free-form word generation at runtime;
- questions whose answer depends on an unstated convention about whether a worker completes a full final day.

### 3.3 Boundary rules

1. **Work quantity is first-class.** The total job need not always be normalised to 1; it may be LCM units, items, pages, metres of road, wall volume, litres or machine output.
2. **Rate sign is first-class.** Constructive/filling work is positive; destructive/emptying work is negative relative to the declared target.
3. **Events are explicit.** “After 5 days B leaves” and “B works for 5 days” must map to an unambiguous interval contract.
4. **Completion may occur within an interval.** Cyclic and staged solvers must calculate the exact terminal fraction rather than blindly count a full day/hour.
5. **Presentation is not ownership.** A caselet, table or data-sufficiency version does not automatically create a new CP.
6. **Context is not ownership.** Workers, machines, typists, painters and printers may share one QL if the mathematical and answer contracts are identical.

---

## 4. Canonical mathematical model

### 4.1 Core entities

```ts
type WorkUnit =
  | "WHOLE_JOB"
  | "LCM_UNITS"
  | "ITEMS"
  | "PAGES"
  | "METRES"
  | "SQUARE_METRES"
  | "CUBIC_METRES"
  | "LITRES"
  | "CUSTOM";

type TimeUnit = "MINUTE" | "HOUR" | "DAY" | "SHIFT";

interface Rational {
  numerator: bigint;
  denominator: bigint;
}

interface WorkAgent {
  agentId: string;
  agentKind:
    | "PERSON"
    | "WORKER_GROUP"
    | "MACHINE"
    | "INLET"
    | "OUTLET"
    | "LEAK"
    | "PUMP"
    | "GENERIC";
  signedRate: Rational;
  efficiencyClass?: string;
  localeLabelKey: string;
}

interface WorkSegment {
  start: Rational;
  duration: Rational;
  activeAgentIds: string[];
  rateOverrides?: Record<string, Rational>;
  targetState?: "COMPLETE" | "EMPTY" | "LEVEL";
}

interface WorkState {
  totalWork: Rational;
  completedWork: Rational;
  timeElapsed: Rational;
  agents: WorkAgent[];
  segments: WorkSegment[];
}
```

### 4.2 Exact arithmetic

All canonical mathematics must use reduced rational arithmetic or safe integers. Floating-point arithmetic may be used only for presentation after exact validation.

Required helpers:

- `addRational`
- `subtractRational`
- `multiplyRational`
- `divideRational`
- `compareRational`
- `floorRational`
- `ceilRational`
- `reduceRational`
- `formatMixedNumber`
- `convertTimeUnit`
- `convertFlowUnit`

### 4.3 Canonical relations

#### Work–rate–time

\[
W=rt,\qquad r=\frac{W}{t},\qquad t=\frac{W}{r}
\]

#### Individual completion rate

\[
r_i=\frac{1}{T_i}
\]

#### Signed combined rate

\[
r_{\text{net}}=\sum_i s_i r_i,\qquad s_i\in\{+1,-1\}
\]

#### Combined completion time

\[
T_{\text{net}}=\frac{W_{\text{remaining}}}{r_{\text{net}}}
\]

#### Two positive workers

\[
T_{A+B}=\frac{T_AT_B}{T_A+T_B}
\]

#### Component extraction

If \(A+B\) completes the work in \(T_{AB}\) and \(A\) alone in \(T_A\):

\[
\frac1{T_B}=\frac1{T_{AB}}-\frac1{T_A}
\]

#### Efficiency–time inverse relation

For equal work:

\[
E_A:E_B=T_B:T_A
\]

#### Partial and remaining work

\[
W_{\text{done}}=\sum_j r_j\Delta t_j,\qquad
W_{\text{remaining}}=W_{\text{total}}-W_{\text{done}}
\]

#### Repeating cycle

For a cycle containing segments \(j=1,\ldots,m\):

\[
W_{\text{cycle}}=\sum_{j=1}^{m}r_j\Delta t_j
\]

Full cycles are followed by an exact terminal-segment calculation. The engine must not assume that the final cycle is complete.

#### Workforce equivalence

\[
W\propto N\times D\times H\times E
\]

For two project states:

\[
\frac{W_1}{W_2}
=
\frac{N_1D_1H_1E_1}{N_2D_2H_2E_2}
\]

#### Heterogeneous crew rate

\[
r_{\text{crew}}=\sum_k n_ke_k
\]

where \(n_k\) is the count and \(e_k\) the individual rate of category \(k\).

#### Contribution-based wages

\[
\text{Wage share}_i
=
\text{Total wage}\times
\frac{r_it_i}{\sum_j r_jt_j}
\]

#### Tank flow

\[
V_{\text{changed}}=q_{\text{net}}t,\qquad
q_{\text{net}}=\sum q_{\text{in}}-\sum q_{\text{out}}
\]

#### Variable daily rate

\[
W_n=\sum_{d=1}^{n} r_d
\]

The sequence may be piecewise, arithmetic, geometric or explicitly scheduled, but must be bounded and exam-realistic.

---

## 5. Canonical Problem architecture

### TMW-CP-001 — Fundamental Work–Rate–Time Mapping

**Ownership:** A single rate or one uniform group; no combination of independent agents and no schedule transition.

**Core reasoning:** Translate between total work, unit-time work, elapsed time, completed fraction, remaining fraction and physical output.

**Current solve-mode discovery baseline:**

- `findWorkFromRateAndTime`
- `findRateFromWorkAndTime`
- `findTimeFromWorkAndRate`
- `findOneUnitWorkFromCompletionTime`
- `findCompletionTimeFromOneUnitWork`
- `findFractionCompletedInGivenTime`
- `findPercentCompletedInGivenTime`
- `findTimeForGivenFraction`
- `findTimeForGivenPercent`
- `findRemainingFractionAfterTime`
- `findRemainingPercentAfterTime`
- `findOutputFromUnitRateAndTime`
- `findUnitRateFromOutputAndTime`
- `findTimeFromOutputAndUnitRate`
- `recoverWholeWorkFromPartAndTime`
- `recoverWholeTimeFromPartCompletion`
- `convertRateAcrossTimeUnits`
- `compareWorkCompletedAtEqualTime`
- `compareTimeForDifferentWorkAtSameRate`
- `findRequiredRateForTargetCompletion`
- `findDelayFromReducedUniformRate`
- `findTimeSavedFromIncreasedUniformRate`

**Scenario families:** data entry, typing, printing, painting, packaging, harvesting, road repair, machine production, inspection, document verification.

**Key exclusions:** independent-agent combination belongs to CP-002; rate-ratio language belongs to CP-003.

---

### TMW-CP-002 — Combined Work and Rate Reconstruction

**Ownership:** Two or more independent signed rates are simultaneously active, or individual rates are reconstructed from combined-rate facts.

**Core reasoning:** Add/subtract rates, recover missing components and solve pairwise-rate systems.

**Current solve-mode discovery baseline:**

- `findTwoAgentCombinedTime`
- `findThreeAgentCombinedTime`
- `findMultiAgentCombinedTime`
- `findCombinedWorkInGivenTime`
- `findIndividualTimeFromCombinedAndOtherTime`
- `findIndividualRateFromCombinedAndOtherRate`
- `findMissingThirdRateFromAllTogetherAndKnownRates`
- `findMissingAgentFromAllTogetherAndSubgroup`
- `findAllTogetherTimeFromPairwiseCombinedTimes`
- `findIndividualTimesFromThreePairwiseCombinedTimes`
- `findTargetIndividualTimeFromPairwiseCombinedTimes`
- `findSubgroupTimeFromAllTogetherAndExcludedAgent`
- `findNetTimeWithPositiveAndNegativeWorker`
- `findDestructiveRateFromNetCompletion`
- `findNumberOfIdenticalAgentsFromCombinedTime`
- `findCombinedTimeFromEfficiencyMultipleAndOneTime`
- `findIndividualTimesFromCombinedTimeAndTimeRatio`
- `findIndividualTimesFromCombinedTimeAndTimeDifference`
- `findIndividualTimesFromCombinedTimeAndTimeSum`
- `findIndividualTimesFromCombinedTimeAndEfficiencyPercent`
- `compareTwoTeamCompletionTimes`
- `findRateOfOneTeamFromTwoTeamFacts`
- `findUnknownGroupSizeFromRateContribution`
- `findMissingSignedComponentFromNetRate`

**Independent verification:** rate algebra must be cross-checked by exact unit-work simulation.

**Collision guard:** percentage comparison without combined work belongs to CP-003.

---

### TMW-CP-003 — Efficiency, Time Ratios and Comparative Productivity

**Ownership:** The central inference is proportional or percentage comparison of efficiency, time or output rather than direct rate summation.

**Current solve-mode discovery baseline:**

- `findEfficiencyRatioFromCompletionTimes`
- `findTimeRatioFromEfficiencyRatio`
- `findFasterTimeFromSlowerTimeAndEfficiencyPercent`
- `findSlowerTimeFromFasterTimeAndEfficiencyPercent`
- `findEfficiencyPercentMore`
- `findEfficiencyPercentLess`
- `findTimePercentMore`
- `findTimePercentLess`
- `findWorkRatioAtEqualTime`
- `findTimeRatioForUnequalWork`
- `findEfficiencyRatioFromUnequalWorkAndTime`
- `findOutputFromEfficiencyRatioAndReferenceOutput`
- `findReferenceOutputFromEfficiencyRatio`
- `findIndividualTimesFromEfficiencyRatioAndCombinedTime`
- `findIndividualTimesFromEfficiencyRatioAndTimeDifference`
- `findIndividualTimesFromEfficiencyRatioAndTimeSum`
- `findCombinedTimeAfterEfficiencyIncrease`
- `findCombinedTimeAfterEfficiencyDecrease`
- `findTimeSavedByEfficiencyIncrease`
- `findDelayCausedByEfficiencyDecrease`
- `findSuccessiveEfficiencyChange`
- `findRequiredEfficiencyChangeForDeadline`
- `findTeamEfficiencyFromMemberEfficiencyRatios`
- `findEquivalentCountFromEfficiencyDifference`
- `findEfficiencyFromWorkCompletedInGivenTime`
- `findComparativeProductivityAcrossDifferentDurations`

**Generation rule:** percentage changes must be applied to rate, not time, unless the stem explicitly defines a time change.

---

### TMW-CP-004 — Partial Work and Staged Participation

**Ownership:** One non-repeating sequence of phases in which active workers, rates or hours change.

**Current solve-mode discovery baseline:**

- `findTotalTimeWhenFirstAgentStartsThenSecondFinishes`
- `findTotalTimeWhenTeamStartsThenOneLeaves`
- `findTotalTimeWhenOneStartsThenAnotherJoins`
- `findTotalTimeWithStaggeredJoins`
- `findTotalTimeWithStaggeredExits`
- `findTotalTimeWithJoinAndLeaveEvents`
- `findRemainingWorkAfterInitialPhase`
- `findWorkCompletedBeforeEvent`
- `findJoinTimeFromFinalCompletion`
- `findLeaveTimeFromFinalCompletion`
- `findUnknownInitialPhaseDuration`
- `findUnknownFinalPhaseDuration`
- `findMissingAgentTimeFromStagedCompletion`
- `findRequiredAdditionalAgentRateAfterDelay`
- `findDelayAfterWorkerLeaves`
- `findEarlyCompletionAfterWorkerJoins`
- `findReplacementWorkerRate`
- `findReplacementWorkerTime`
- `findTimeAfterWorkHandoff`
- `findHandoffSequenceCompletion`
- `findCompletionWithIdleInterval`
- `findCompletionWithChangedDailyHours`
- `findCompletionWithMidProjectEfficiencyChange`
- `findCompletionWithNegativeWorkerActivatedLater`
- `findEventTimeAtSpecifiedCompletionFraction`
- `findRequiredRemainingRateForDeadline`
- `findWorkerCountAddedAfterPartialProgress`
- `findWorkerCountRemovedAfterPartialProgress`

**State contract:** every event must specify whether it occurs at the start or end of a time interval.

---

### TMW-CP-005 — Alternating and Periodic Work Schedules

**Ownership:** A schedule repeats, cycles, alternates or activates agents periodically.

**Current solve-mode discovery baseline:**

- `findCompletionTimeForTwoAgentAlternationStartingA`
- `findCompletionTimeForTwoAgentAlternationStartingB`
- `findCompletionTimeForMultiDayCycle`
- `findCompletionTimeForThreeAgentCycle`
- `findCompletionDayAndTerminalFraction`
- `findWorkAfterGivenNumberOfCycles`
- `findRemainingWorkAfterFullCycles`
- `findTerminalAgent`
- `findStartingAgentFromCompletionCondition`
- `findUnknownRateFromAlternatingCompletion`
- `findUnknownTimeFromAlternatingCompletion`
- `findCompletionWhenHelperWorksEveryNthDay`
- `findCompletionWhenAgentRestsEveryNthDay`
- `findCompletionWithWeekendOrHolidayPattern`
- `findCompletionWithUnequalShiftDurations`
- `findCompletionWithTwoDaysOnOneDayOffPattern`
- `findCompletionWithPeriodicNegativeWork`
- `findCompletionWithRepeatedJoinLeaveCycle`
- `findCycleCountToReachSpecifiedFraction`
- `findTimeFromArbitraryCyclePhase`
- `findExactBoundaryCompletion`
- `findCompletionWithinCycleSegment`
- `findOutputUnderPeriodicMachineSchedule`
- `findRequiredCycleRateForDeadline`

**Mandatory audit:** off-by-one, wrong starting agent, full-final-day and incomplete-final-cycle errors.

---

### TMW-CP-006 — Workforce, Days, Hours and Work-Quantity Equivalence

**Ownership:** The dominant structure is workforce or machine-count scaling under changes in days, hours, efficiency or total work.

**Current solve-mode discovery baseline:**

- `findWorkersFromWorkDays`
- `findDaysFromWorkersAndWork`
- `findWorkFromWorkersAndDays`
- `findWorkersFromWorkDaysHours`
- `findDaysFromWorkersHoursAndWork`
- `findHoursPerDayFromWorkersDaysAndWork`
- `findEfficiencyFromWorkersDaysHoursAndWork`
- `compareTwoProjectStates`
- `findWorkersAfterWorkQuantityChange`
- `findDaysAfterWorkQuantityChange`
- `findHoursAfterWorkQuantityChange`
- `findWorkersAfterEfficiencyChange`
- `findRequiredExtraWorkersForDeadline`
- `findWorkersToRemoveForGivenDelay`
- `findOriginalWorkforceFromChangedSchedule`
- `findNewDeadlineAfterWorkforceChange`
- `findWorkforceChangeAfterPartialProgress`
- `findRemainingDaysFromActualProgress`
- `findExtraWorkersFromPlannedVersusActualProgress`
- `findPercentWorkCompletedFromManHours`
- `findPercentScheduleDelay`
- `findOvertimeHoursForDeadline`
- `findShiftCountForProductionTarget`
- `findMachineCountForOutputTarget`
- `findOutputFromMachinesShiftsAndDays`
- `findRoadOrWallWorkScaling`
- `findWorkersForChangedWallDimensions`
- `findDaysForChangedWorkDimensions`
- `findWorkQuantityRatioFromProjectStates`
- `findResourceDurationFromPopulationChange`
- `findEffectOfAbsenteeism`
- `findBatchWorkerAdditionSchedule`
- `findCrewSizeAfterDailyHourReduction`
- `findEquivalentManDays`
- `findEquivalentMachineHours`

**Boundary:** dimensional variables are included only when they determine work quantity.

---

### TMW-CP-007 — Heterogeneous Workers and Machine Equivalence

**Ownership:** Different categories have different per-unit rates and the task requires category equivalence or a linear system.

**Current solve-mode discovery baseline:**

- `findManWomanEfficiencyRatio`
- `findManChildEfficiencyRatio`
- `findWomanChildEfficiencyRatio`
- `findThreeCategoryEfficiencyRatios`
- `findMixedCrewCompletionTime`
- `findEquivalentWorkersOfAnotherCategory`
- `findCategoryCountForTargetTime`
- `findMissingCategoryCount`
- `findCrewCompositionFromTwoWorkFacts`
- `findIndividualCategoryRatesFromPairwiseCrews`
- `findGroupRateFromCategoryRates`
- `findReplacementCountAcrossCategories`
- `findCompletionAfterCategoryReplacement`
- `findSkilledUnskilledEfficiencyRatio`
- `findMachineTypeEfficiencyRatio`
- `findMixedMachineOutput`
- `findMachineReplacementCount`
- `findEquivalentMachineHours`
- `findMinimumIntegerCrewComposition`
- `findCrewCompositionForDeadline`
- `findUnknownCategoryTimeFromMixedGroupTimes`
- `findCategoryContributionFraction`
- `compareTwoHeterogeneousCrews`
- `findIntegerSolutionUnderCrewConstraints`

**Parameter policy:** generate valid integer crew states first, then derive ratios and times. Do not select unrelated ratios and hope the system becomes integral.

---

### TMW-CP-008 — Wages and Contribution-Based Payment

**Ownership:** A fixed wage or payment is distributed according to actual work contribution.

**Current solve-mode discovery baseline:**

- `findWageRatioFromEqualTimeAndEfficiency`
- `findWageRatioFromEqualEfficiencyAndTime`
- `findWageRatioFromEfficiencyAndTime`
- `findIndividualWageShare`
- `findTotalWageFromKnownShare`
- `findMissingWorkerShare`
- `findGroupWageShare`
- `findWageShareAfterJoinEvent`
- `findWageShareAfterLeaveEvent`
- `findWageShareAfterHandoff`
- `findWageShareFromCompletedFraction`
- `findEfficiencyRatioFromWageSharesAndTime`
- `findTimeRatioFromWageSharesAndEfficiency`
- `findUnknownTimeFromWageShare`
- `findUnknownEfficiencyFromWageShare`
- `findMixedCategoryWageDistribution`
- `findHelperPaymentFromContribution`
- `findContractorResidualPayment`
- `findPieceRatePaymentFromOutput`
- `findBonusShareFromExtraContribution`
- `findPaymentAfterDefectiveOrNegativeContribution`
- `findFairPaymentUnderUnequalDailyHours`

**Boundary:** capital-based partnership profit is excluded. Payment must be linked to work contribution.

---

### TMW-CP-009 — Pipes and Cisterns: Core Signed-Rate Systems

**Ownership:** Simultaneous inlets, outlets or leaks without a changing schedule.

**Current solve-mode discovery baseline:**

- `findFillTimeWithTwoInlets`
- `findFillTimeWithMultipleInlets`
- `findFillTimeWithInletAndOutlet`
- `findFillTimeWithMultipleInletsAndOutlets`
- `findEmptyTimeWhenOutflowDominates`
- `findNetFractionFilledInGivenTime`
- `findNetFractionEmptiedInGivenTime`
- `findMissingInletTime`
- `findMissingOutletTime`
- `findLeakTimeFromNormalAndLeakyFill`
- `findLeakTimeFromNormalAndLeakyEmpty`
- `findInletTimeFromLeakyFillAndLeakTime`
- `findOutletTimeFromNetEmptyAndInletTime`
- `findAllPipesCombinedTime`
- `findOnePipeFromCombinedAndOtherPipes`
- `findNumberOfIdenticalPipes`
- `findTankCapacityFromFlowAndTime`
- `findFlowRateFromCapacityAndTime`
- `findTimeFromCapacityAndNetFlow`
- `convertFlowUnits`
- `findTimeToFillFromInitialLevel`
- `findTimeToEmptyFromInitialLevel`
- `findFinalLevelAfterGivenTime`
- `comparePipeCapacities`
- `findReducedPipeEfficiency`
- `findBlockagePercentFromChangedFillTime`
- `findNetRateDirection`
- `findOverflowOrEmptyFeasibility`

**Mandatory semantic rule:** the target—fill, empty or reach a level—must be explicit before signs are assigned.

---

### TMW-CP-010 — Pipes and Cisterns: Staged, Cyclic and Level-Based Operations

**Ownership:** Pipe activity changes with time, level or a repeating schedule.

**Current solve-mode discovery baseline:**

- `findFillTimeWhenOutletOpensLater`
- `findFillTimeWhenInletOpensLater`
- `findEmptyTimeWhenInletStartsLater`
- `findFillTimeWhenLeakStartsLater`
- `findFillTimeWhenLeakIsRepaired`
- `findTimeWhenPipeClosesAfterDelay`
- `findTimeWithStaggeredPipeOpenings`
- `findTimeWithStaggeredPipeClosures`
- `findTimeWithAlternateHourPipes`
- `findTimeWithPeriodicOutlet`
- `findTimeWithPipeShiftSchedule`
- `findTimeFromPartialInitialLevelAndSchedule`
- `findTimeToThresholdThenSwitch`
- `findTimeFromThresholdToTarget`
- `findFinalLevelAfterStagedSchedule`
- `findOpeningTimeFromFinalCompletion`
- `findClosingTimeFromFinalCompletion`
- `findCycleCountToFillTank`
- `findCycleCountToEmptyTank`
- `findTerminalPipeSegment`
- `findOverflowTimeUnderSchedule`
- `findEmptyEventTimeUnderSchedule`
- `findAutomaticPumpOnOffCompletion`
- `findInterruptedFlowCompletion`
- `findCompletionFromArbitraryCyclePhase`
- `findTankVolumeFromStagedFlows`
- `findRequiredFinalPipeRate`
- `findScheduleChangeNeededForDeadline`

**Independent verification:** event-driven tank simulation using exact rational levels.

---

### TMW-CP-011 — Variable and Non-Uniform Productivity

**Ownership:** Rate changes according to a non-constant but explicitly defined rule rather than only a one-time event or fixed cycle.

**Current solve-mode discovery baseline:**

- `findWorkFromArithmeticDailyRates`
- `findCompletionDayFromArithmeticDailyRates`
- `findInitialRateFromArithmeticDailyOutput`
- `findDailyRateChangeFromTotalOutput`
- `findWorkFromGeometricDailyRates`
- `findCompletionDayFromGeometricDailyRates`
- `findInitialRateFromGeometricOutput`
- `findRateMultiplierFromTotalOutput`
- `findCompletionWithDailyFixedIncrease`
- `findCompletionWithDailyFixedDecrease`
- `findCompletionWithDailyPercentIncrease`
- `findCompletionWithDailyPercentDecrease`
- `findCompletionWithFatigueAfterThreshold`
- `findCompletionWithLearningAfterThreshold`
- `findCompletionWithPiecewiseRates`
- `findCompletionWithMachineBreakdown`
- `findCompletionWithVaryingWorkerCountByDay`
- `findCumulativeOutputAfterGivenDays`
- `findTerminalPartialDayUnderVariableRate`
- `findUnknownChangePoint`
- `findUnknownRateChange`
- `findCombinedVariableAgentOutput`
- `findVariableSignedNetWork`
- `findScheduleNeededForVariableTarget`

**Admission rule:** a variable-rate QL must correspond to a recognisable exam pattern and have bounded arithmetic. Exotic continuous models are excluded.

---

## 6. Cross-cutting presentation modes

These do not create CP ownership by themselves:

- direct MCQ;
- numeric answer;
- statement I/II data sufficiency;
- table-based crew or schedule presentation;
- timeline/phase table;
- small caselet with multiple questions;
- “which conclusion follows” only when the underlying numerical task remains unambiguous;
- bilingual display for review, not student runtime.

A presentation variant becomes a distinct QL only when it materially changes:

- information extraction;
- required inference;
- ambiguity risk;
- answer type;
- distractor contract;
- renderer or solver path.

---

## 7. Question Language design

### 7.1 QL identity contract

Every QL registry entry must include:

```ts
interface Tmw001QlRegistryEntry {
  qlId: string;
  cpId: string;
  taskKind: string;
  solveMode: string;
  ruleId: string;
  answerType: TmwAnswerType;
  requiredVariables: string[];
  scenarioFamily: string;
  contextTag: string[];
  formulaStrategyId: string;
  explanationStrategyId: string;
  distractorStrategyIds: string[];
  independentVerifierId: string;
  localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED" | "LANGUAGE_SPECIFIC";
  renderer: "TEXT" | "STRUCTURED_TEXT" | "TABLE_OR_GRID";
  constraints: string[];
  publiclyPublishable: false;
}
```

### 7.2 What justifies a new QL

A new QL is justified by at least one of:

- a new given/unknown direction;
- a new rate topology;
- a new event or schedule topology;
- a new inverse-reconstruction system;
- a new answer type or unit;
- a new representation requiring a distinct extraction process;
- a new boundary condition;
- a new misconception family that cannot be represented safely by an existing QL;
- a new locale mode.

A new QL is not justified by:

- changing worker names;
- changing “painting” to “typing” with identical mathematics;
- reordering the same givens;
- replacing days with hours when unit conversion is not tested;
- changing numbers only;
- adding decorative narrative;
- paraphrasing the same target.

### 7.3 Stem-writing standard

Stems must:

- sound like competitive-exam questions;
- state the target precisely;
- use natural professional or everyday contexts;
- avoid repetitive “A can do a piece of work” language across the chapter;
- avoid implausible worker counts, durations, output rates or tank capacities;
- distinguish “works for 5 days” from “leaves after the fifth day”;
- identify whether work begins with A or B in alternating schedules;
- identify whether a tank is initially empty, full or partially filled;
- state whether outlets/leaks operate continuously;
- use consistent units;
- avoid unnecessary character backstories;
- avoid classroom commands such as “use the formula” in the stem;
- avoid hidden conventions about final partial days.

### 7.4 Controlled context families

Recommended English context pool:

- construction crews;
- painters and decorators;
- road repair teams;
- data-entry operators;
- typists and proofreaders;
- printers and binding machines;
- packaging lines;
- factory machines;
- inspection teams;
- harvest or field-work teams;
- warehouse loading teams;
- document-verification teams;
- water tanks, reservoirs and pumps;
- municipal or institutional supply tanks.

The generator should select context from validated scenario families, not create free-form narratives.

### 7.5 Number realism

Parameter generators must prefer:

- exact or clean fractional answers;
- LCM-friendly individual times;
- realistic work durations;
- sensible workforces and daily hours;
- integral crew counts;
- meaningful tank volumes and flow rates;
- positive remaining work at every intermediate stage unless completion is the tested event;
- exact terminal fractions when used;
- bounded cycle counts;
- answer units that match the stem.

Hard questions should become difficult through inference depth, state changes, inverse recovery and close distractors—not merely huge numbers.

---

## 8. Formula and rule registry

### 8.1 Rule families

```text
TMW_RATE_DIRECT
TMW_RATE_RECIPROCAL
TMW_RATE_COMBINE_POSITIVE
TMW_RATE_COMBINE_SIGNED
TMW_RATE_COMPONENT_EXTRACT
TMW_PAIRWISE_RATE_SYSTEM
TMW_EFFICIENCY_TIME_INVERSE
TMW_EFFICIENCY_PERCENT_CHANGE
TMW_PARTIAL_WORK_BALANCE
TMW_STAGE_EVENT_LEDGER
TMW_CYCLE_ACCUMULATION
TMW_TERMINAL_REMAINDER
TMW_WORKFORCE_EQUIVALENCE
TMW_WORK_QUANTITY_SCALING
TMW_HETEROGENEOUS_LINEAR_SYSTEM
TMW_CONTRIBUTION_WAGE_SHARE
TMW_FLOW_CAPACITY
TMW_LEVEL_STATE_TRANSITION
TMW_VARIABLE_RATE_SUM
TMW_DATA_SUFFICIENCY_EVALUATION
```

Each QL must have one primary `ruleId`. Helper rules may be declared, but wording-only QLs may not be created to duplicate an existing rule/task contract.

### 8.2 Formula display policy

Every student explanation must visibly show the governing relation appropriate to the question. This does not mean every explanation begins with the same generic line.

Examples:

- direct work question: \(W=rt\);
- individual time question: \(r=1/T\);
- combined work: \(r_{\text{net}}=r_A+r_B\);
- outlet/leak: \(r_{\text{net}}=r_{\text{in}}-r_{\text{out}}\);
- efficiency comparison: \(E_A:E_B=T_B:T_A\);
- project scaling: \(W\propto NDHE\);
- wages: \(\text{share}\propto rt\);
- flow volume: \(V=qt\);
- cycle: \(W_{\text{cycle}}=\sum r_j\Delta t_j\).

The displayed formula must be question-specific. Generic formula padding is prohibited.

---

## 9. Explanation architecture

### 9.1 Governing principle

Explanations must be:

- mathematically canonical;
- human-authored in tone;
- formula-led;
- adapted to the question topology;
- context-aware;
- unique enough to avoid mechanical repetition;
- concise for direct questions and detailed for staged, cyclic or inverse questions;
- naturally translated or adapted for Hindi and Punjabi;
- generated from the solver trace, never independently guessed.

There is **no fixed explanation-line quota**. A direct QL may need four meaningful steps; a staged or cyclic hard QL may need seven or eight. No line may exist solely to satisfy a count.

### 9.2 Explanation object

```ts
interface TmwExplanationPlan {
  explanationStrategyId: string;
  contextualOpening: string;
  keyRule: {
    label: string;
    latex: string;
    interpretation: string;
  };
  steps: Array<{
    label: string;
    prose: string;
    latex?: string;
    stateBefore?: Rational;
    stateAfter?: Rational;
  }>;
  verification?: {
    prose: string;
    latex?: string;
  };
  conclusion: {
    prose: string;
    answerLatex: string;
  };
}
```

### 9.3 Explanation strategy families

#### `EXP-RATE-DIRECT`

For direct work/rate/time mapping.

Flow:

1. identify total work or output;
2. show \(W=rt\);
3. substitute;
4. solve in the required unit;
5. conclude in context.

#### `EXP-RECIPROCAL-LCM`

For individual or combined completion times.

Flow:

1. convert completion times into one-unit rates or LCM work units;
2. show the combined rate;
3. divide total/remaining work by the rate;
4. express an exact mixed fraction if needed;
5. verify that the combined time is less than each positive individual time.

#### `EXP-COMPONENT-EXTRACTION`

For recovering one agent from combined work.

Flow:

1. state that the missing rate is the combined rate minus known rates;
2. display the reciprocal equation;
3. simplify the missing rate;
4. invert to obtain time;
5. verify by recombination.

#### `EXP-EFFICIENCY-INVERSE`

For time and efficiency comparisons.

Flow:

1. state that equal-work time is inversely proportional to efficiency;
2. display \(E_A:E_B=T_B:T_A\);
3. translate percentage wording into a rate multiplier;
4. solve the requested time/rate/output;
5. conclude with the correct comparison language.

#### `EXP-STAGE-LEDGER`

For join/leave/handoff questions.

Flow:

1. state the phase structure;
2. show each phase’s active rate;
3. calculate work completed in each phase;
4. subtract to find remaining work;
5. divide by the final active rate;
6. add phase durations;
7. verify no phase completes the work earlier than assumed.

A compact phase table should be used where it improves clarity.

#### `EXP-CYCLE-REMAINDER`

For alternating and periodic work.

Flow:

1. identify the exact cycle and starting agent;
2. calculate work completed per cycle;
3. take the largest possible number of full cycles that leaves positive work;
4. process subsequent cycle segments one by one;
5. stop at the exact completion point;
6. report full time plus the final fraction;
7. state the terminal agent/segment when relevant.

#### `EXP-WORK-EQUIVALENCE`

For workers–days–hours–efficiency and work-quantity scaling.

Flow:

1. identify which factors change;
2. show \(W\propto NDHE\);
3. form the two-state ratio;
4. cancel common factors;
5. solve the target;
6. interpret whether workers/days/hours must increase or decrease;
7. sanity-check direction.

#### `EXP-HETEROGENEOUS-SYSTEM`

For different worker or machine categories.

Flow:

1. choose a base efficiency unit;
2. translate each group statement into a linear rate equation;
3. solve the smallest necessary system;
4. build the target crew rate;
5. divide work by the target rate;
6. enforce positive integral counts;
7. verify against the original group facts.

#### `EXP-WAGE-CONTRIBUTION`

For payment distribution.

Flow:

1. state that payment follows actual contribution, not attendance alone;
2. calculate each contribution as rate × time;
3. form the contribution ratio;
4. divide the total wage;
5. verify shares sum to the total;
6. conclude with the requested worker/group amount.

#### `EXP-PIPE-SIGNED-RATE`

For simultaneous pipes.

Flow:

1. declare the target state;
2. assign positive signs to filling and negative signs to emptying;
3. show the signed net rate;
4. confirm its direction;
5. divide remaining capacity by net rate;
6. conclude in hours/minutes;
7. verify feasibility.

#### `EXP-PIPE-STAGE-LEVEL`

For staged pipe schedules.

Flow:

1. state initial level;
2. show level change for each interval;
3. update the exact tank level after every event;
4. identify the interval in which the target is reached;
5. calculate the terminal fraction;
6. combine elapsed times;
7. verify level remains within valid bounds unless overflow is tested.

#### `EXP-VARIABLE-RATE-SUM`

For non-uniform productivity.

Flow:

1. identify the daily rate rule;
2. show the sequence or piecewise schedule;
3. sum complete days;
4. locate the completion day;
5. calculate any final-day fraction;
6. verify the previous day’s cumulative work is below the target.

### 9.4 Explanation anti-patterns

Reject explanations that:

- merely restate the stem;
- use generic padding such as “Now calculate carefully”;
- repeat the final answer in every line;
- display a formula unrelated to the actual method;
- skip the remaining-work calculation in staged problems;
- count a full final day when only a fraction is required;
- switch from LCM units to fractions without explanation;
- silently change hours to days;
- treat efficiency and time as directly proportional;
- ignore outlet/leak signs;
- use one generic CP-level explanation for materially different solve modes;
- translate English word order literally into unnatural Hindi or Punjabi;
- contain unresolved placeholders;
- produce a correct final number from an incorrect intermediate trace.

---

## 10. Gemini-assisted explanation design

Gemini may be used as an **editorial design assistant**, not as the mathematical authority and not as an unvalidated runtime explanation generator.

### 10.1 Permitted uses

- propose human-sounding variants for a validated explanation plan;
- compare two explanation structures for clarity;
- adapt an English explanation plan into natural Hindi or Punjabi drafts;
- flag repetitive phrasing;
- suggest context-specific openings and conclusions;
- classify whether a formula appears at the correct point;
- produce structured drafts from a strict schema.

### 10.2 Prohibited uses

- independently decide the correct answer;
- invent intermediate values;
- change the solver trace;
- create new QL mathematics without review;
- translate without answer and variable parity checks;
- publish text directly without automated and human review.

### 10.3 Gemini prompt contract

```text
ROLE
You are an editorial explanation designer for ExamTree competitive-exam mathematics.

AUTHORITY
The supplied canonical answer, variables, formula strategy and reasoning trace are final.
Do not re-solve the problem using a different method.
Do not alter any number, unit, sign, answer or event boundary.

TASK
Write one natural teacher-style explanation in {locale} for the supplied Time, Work & Pipes question.

REQUIRED STRUCTURE
1. A context-specific opening that identifies the governing idea.
2. The exact governing formula in LaTeX.
3. Only the meaningful worked steps required by this topology.
4. A state or phase calculation when the question has joins, leaves, cycles or pipe events.
5. A concise final answer in context.
6. Optional verification only when it adds mathematical value.

STYLE
- Real competitive-exam teaching style.
- Formula-led but not robotic.
- No generic filler.
- No repeated restatement of the target.
- No fixed number of steps.
- Preserve exact mathematical notation.
- Use natural {locale} terminology.
- Keep names and symbols unchanged unless a locale glossary explicitly maps them.

INPUT
{canonicalQuestionPackage}

OUTPUT
Return JSON matching the supplied explanation schema only.
```

### 10.4 Suggested structured output

```json
{
  "contextualOpening": "",
  "keyRule": {
    "label": "",
    "latex": "",
    "interpretation": ""
  },
  "steps": [
    {
      "label": "",
      "prose": "",
      "latex": ""
    }
  ],
  "verification": {
    "prose": "",
    "latex": ""
  },
  "conclusion": {
    "prose": "",
    "answerLatex": ""
  }
}
```

### 10.5 Gemini review loop

1. Solver creates the canonical trace.
2. Deterministic renderer creates the baseline explanation.
3. Gemini drafts one or more editorial alternatives from the same trace.
4. Structural validators check schema, placeholders, formula presence and locale.
5. Mathematical validators compare every numeric expression and final answer with the canonical package.
6. Duplicate and generic-language audits run.
7. A human reviewer selects or edits the best version.
8. The approved text becomes human-owned library content.
9. Runtime consumes only the approved library text/strategy.

---

## 11. Distractor architecture

Every incorrect option must map to a declared misconception. Random numerical fillers are prohibited.

### 11.1 Core distractor families

```text
TIME_ADDITION_INSTEAD_OF_RATE_ADDITION
TIME_SUBTRACTION_INSTEAD_OF_RATE_SUBTRACTION
RECIPROCAL_NOT_TAKEN
RECIPROCAL_TAKEN_TWICE
EFFICIENCY_TIME_DIRECT_PROPORTION
PERCENT_APPLIED_TO_TIME_INSTEAD_OF_RATE
KNOWN_RATE_ADDED_WHEN_IT_SHOULD_BE_SUBTRACTED
OUTLET_SIGN_IGNORED
OUTLET_SIGN_REVERSED
ONE_AGENT_OMITTED
TOTAL_WORK_USED_INSTEAD_OF_REMAINING_WORK
REMAINING_WORK_SUBTRACTED_IN_WRONG_DIRECTION
JOIN_EVENT_OFF_BY_ONE
LEAVE_EVENT_OFF_BY_ONE
IDLE_INTERVAL_IGNORED
FULL_FINAL_DAY_COUNTED
TERMINAL_FRACTION_IGNORED
WRONG_STARTING_AGENT
ONE_FULL_CYCLE_TOO_MANY
ONE_FULL_CYCLE_TOO_FEW
CYCLE_ORDER_REVERSED
WORKER_DAY_HOUR_FACTOR_OMITTED
WORK_QUANTITY_CHANGE_IGNORED
EFFICIENCY_FACTOR_OMITTED
HETEROGENEOUS_CATEGORIES_TREATED_EQUAL
WRONG_CATEGORY_REPLACEMENT_RATIO
PAIRWISE_SYSTEM_SIGN_ERROR
NON_INTEGER_CREW_ROOT_ACCEPTED
WAGES_DIVIDED_BY_TIME_ONLY
WAGES_DIVIDED_BY_EFFICIENCY_ONLY
WAGE_SHARES_DO_NOT_SUM_TO_TOTAL
INITIAL_TANK_LEVEL_IGNORED
CAPACITY_USED_INSTEAD_OF_REMAINING_CAPACITY
FLOW_UNIT_CONVERSION_ERROR
FILL_DIRECTION_USED_FOR_EMPTY_TARGET
THRESHOLD_SWITCH_IGNORED
VARIABLE_RATE_TREATED_AS_CONSTANT
ARITHMETIC_SEQUENCE_SUM_ERROR
GEOMETRIC_SEQUENCE_SUM_ERROR
PREVIOUS_DAY_COMPLETION_BOUNDARY_ERROR
INVALID_ALGEBRAIC_ROOT
```

### 11.2 Option contract

For each generated question:

- exactly one option equals the canonical answer;
- all options are distinct after normalisation;
- units and formatting are consistent;
- fraction/decimal equivalents are not allowed as separate options;
- negative time/count options are rejected unless a signed quantity is the actual answer type;
- each wrong option is generated from a misconception applicable to the exact solve mode;
- correct-answer positions are balanced across review batches;
- a fallback distractor may be used only if it is still a registered misconception.

---

## 12. Parameter generation strategy

### 12.1 Generate valid states first

Prefer:

```text
choose canonical rates/crew state/schedule
→ derive work completed
→ derive target
→ render givens
```

Avoid:

```text
choose unrelated givens
→ solve
→ hope the result is valid and exam-realistic
```

### 12.2 Generation families

- **LCM-backed:** choose individual completion times with a bounded LCM.
- **Answer-backward:** choose desired clean answer and rates, then derive one given.
- **State-first:** construct all phases and exact work states, then hide the target variable.
- **Integer-system-first:** choose category efficiencies and crew counts, then derive group completion facts.
- **Contribution-first:** choose exact work contributions, then derive wage shares.
- **Tank-first:** choose capacity, initial level and exact flows, then derive times.
- **Cycle-first:** choose a cycle whose full-cycle work and terminal segment are controlled.
- **Variable-sequence-first:** choose a bounded sequence and exact completion boundary.

### 12.3 Required invariants

- all denominators are non-zero;
- time and rate are positive where required;
- net rate direction matches the target;
- intermediate completed work does not exceed total work unless overflow is tested;
- remaining work is non-negative;
- completion does not occur before an assumed event unless that event is the target;
- crew counts are positive integers;
- daily hours are realistic;
- tank capacity and flow units are compatible;
- schedules are finite and deterministic;
- algebraic inverse modes have exactly one admissible root;
- options remain unique;
- answer precision follows the chapter policy.

---

## 13. Difficulty model

Difficulty must be computed from the generated instance, not frozen solely on the QL.

### 13.1 Difficulty factors

1. number of independent rates;
2. number of phases/events;
3. signed-rate complexity;
4. repeating-cycle length;
5. terminal-remainder complexity;
6. number of unknowns;
7. inverse/algebraic reconstruction depth;
8. heterogeneous categories;
9. work-quantity scaling dimensions;
10. arithmetic friction;
11. unit conversion;
12. information density;
13. distractor proximity;
14. representation complexity;
15. verification depth.

### 13.2 Public bands

- **Easy:** direct rate mapping, one combination, low arithmetic friction, no hidden state.
- **Moderate:** one inverse step, one state transition, one efficiency conversion or a short cycle.
- **Difficult:** multiple phases, pairwise reconstruction, heterogeneous systems, cyclic terminal remainder, staged pipes or variable productivity.

Large numbers alone must not increase difficulty.

---

## 14. Multilingual design

### 14.1 Locale classification

Most numerical QLs are `TRANSLATABLE`. Context-heavy terminology may be `LANGUAGE_ADAPTED`. Language-specific wordplay is not expected in this chapter.

### 14.2 English-first sequence

1. English design and runtime proof;
2. English automated QA;
3. English review export;
4. English manual editorial review;
5. English freeze;
6. Hindi and Punjabi terminology/glossary freeze;
7. Hindi/Punjabi draft generation;
8. mathematical and structural parity audit;
9. bilateral human review;
10. multilingual freeze.

### 14.3 Terminology requirements

A controlled glossary must cover:

- work;
- rate/efficiency;
- one day’s work;
- remaining work;
- joins/leaves;
- together/alone;
- inlet/outlet/leak;
- fills/empties;
- tank/cistern/reservoir;
- worker/crew/machine;
- wages/payment/share;
- capacity/flow rate;
- shift/hour/day;
- completed fraction/percentage.

Hindi and Punjabi explanations must be natural and rule-first, not word-for-word translations. Mathematical symbols, variables and names may remain unchanged where appropriate.

### 14.4 Parity invariants

Across languages:

- same seed;
- same QL and solve mode;
- same parameter state;
- same correct answer and options;
- same answer position;
- same formula;
- same reasoning trace;
- same difficulty;
- same fingerprint;
- no unresolved placeholders;
- no meaning-changing translation.

---

## 15. Runtime architecture

Target path:

```text
artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/TimeAndWork/TMW-001/
```

Proposed package:

```text
TMW-001/
├── TMW-001-DESIGN-BLUEPRINT.md
├── archetype.md
├── canonical-problems.md
├── reasoning-patterns.md
├── difficulty-framework.md
├── implementation-plan.md
├── library-authority-map.md
├── task-registry.library.json
├── rule-registry.library.json
├── formula-registry.library.json
├── distractor-registry.library.json
├── variable-ranges.library.json
├── scenario-families.library.json
├── terminology.en.json
├── terminology.hi.json
├── terminology.pa.json
├── question-language.en.json
├── question-language.hi.json
├── question-language.pa.json
├── explanation.en.json
├── explanation.hi.json
├── explanation.pa.json
├── index.ts
├── tmw-001.test.ts
├── tmw-001-coverage-audit.ts
├── tmw-001-runtime-proof.ts
├── tmw-001-review-export.ts
├── tmw-001-localization-audit.ts
├── tmw-001-duplicate-audit.ts
├── tmw-001-explanation-quality-audit.ts
└── foundation/
    ├── types.ts
    ├── rational.ts
    ├── rate-engine.ts
    ├── schedule-engine.ts
    ├── workforce-engine.ts
    ├── heterogeneous-engine.ts
    ├── flow-engine.ts
    ├── variable-rate-engine.ts
    ├── parameter-generator.ts
    ├── solver.ts
    ├── independent-verifier.ts
    ├── reasoning-graph.ts
    ├── explanation-renderer.ts
    ├── distractor-builder.ts
    ├── validator.ts
    ├── library.ts
    ├── pipeline.ts
    └── coverage-auditor.ts
```

### 15.1 Solver separation

The canonical solver and independent verifier should differ where practical:

- algebraic reciprocal solver vs LCM-unit simulation;
- event-ledger solver vs exact timeline simulation;
- cycle formula vs segment-by-segment replay;
- workforce ratio equation vs constructed-output verification;
- linear-system solver vs direct substitution;
- signed-rate formula vs tank-level simulation;
- sequence formula vs explicit daily accumulation.

A verifier that merely calls the canonical solver is not independent.

### 15.2 Pipeline contract

```ts
runTmw001Pipeline(cpId, qlId, seed, language):
  registry = resolveQl(qlId)
  state = generateValidState(registry, seed)
  canonical = solveCanonical(state, registry.ruleId)
  independent = verifyIndependently(state, registry.independentVerifierId)
  assertEquivalent(canonical, independent)
  reasoningGraph = buildReasoningGraph(state, canonical)
  distractors = buildDeclaredDistractors(state, canonical, registry)
  stem = renderStem(qlId, language, state.variables)
  explanation = renderApprovedExplanation(
    registry.explanationStrategyId,
    language,
    state,
    canonical,
    reasoningGraph
  )
  package = assemble(...)
  validation = validateTmwPackage(package)
  return { ...package, validation }
```

---

## 16. Review and audit system

### 16.1 Automated audits

Each CP and the whole chapter require:

- JSON/schema validation;
- QL–CP ownership audit;
- solve-mode coverage audit;
- rule collision audit;
- required-variable audit;
- unregistered-placeholder audit;
- unresolved-rendered-placeholder audit;
- deterministic seed replay;
- canonical-answer consistency;
- independent-verifier agreement;
- option uniqueness;
- distractor-contract validation;
- correct-position distribution;
- unit and answer-format validation;
- exact and normalised stem duplicate audit;
- exact and semantic explanation duplicate audit;
- formula presence and MathJax validity;
- stage/cycle boundary audit;
- negative/zero-rate audit;
- invalid-root audit;
- multilingual parity audit;
- locale leakage audit;
- production bundle verification.

### 16.2 Runtime proof

For each QL:

- multiple deterministic seeds across valid state families;
- each case generated twice;
- all answers independently verified;
- all options validated;
- all explanations checked against trace;
- edge cases included, not only random cases.

Required edge suites include:

- completion exactly at an event boundary;
- completion just before/after an event;
- net signed rate near zero but valid;
- final fractional day/hour;
- one full cycle less than completion;
- initial partial tank;
- outlet-dominant emptying;
- changed work quantity;
- integer crew reconstruction;
- multiple algebraic roots with only one admissible;
- variable-rate completion on and within a day.

### 16.3 Human review export

The review export should include:

```text
packageId
cpId
qlId
taskKind
solveMode
ruleId
difficulty
questionId
seed
fingerprint
scenarioFamily
stem
options
correctIndex
correctAnswer
formulaStrategyId
explanationStrategyId
explanation
independentVerifierStatus
distractorLabels
reviewStatus
reviewerNotes
```

Generate at least three mathematically distinct seeds per QL for editorial review, but do not treat three as the runtime-proof limit.

---

## 17. CP design and implementation workflow

For every CP:

### Gate A — Ownership design

- inspect reference questions;
- list all distinct given/unknown directions;
- list forward, reverse and inverse forms;
- list event, boundary and representation forms;
- resolve overlaps with other CPs;
- create a provisional solve-mode map;
- do not allocate a fixed QL quota.

### Gate B — QL discovery

- create QLs only for materially distinct task contracts;
- attach rule, formula, explanation and distractor strategies;
- run a wording-duplicate audit;
- run a mathematical-equivalence collision audit;
- perform a first gap audit.

### Gate C — Shared/runtime implementation

- implement or reuse the required engine;
- add exact canonical solver;
- add independent verifier;
- add parameter-state generators;
- add declared distractors;
- add validator rules.

### Gate D — English runtime proof

- run deterministic multi-seed proof;
- generate review export;
- inspect exam realism;
- inspect explanation quality;
- correct state diversity;
- repeat gap audit.

### Gate E — CP freeze candidate

A CP may be called saturated only when:

- no meaningful solve-mode gaps remain;
- no ownership collisions remain;
- all QLs have exact proof;
- no duplicate stems/explanations remain;
- all formulas and explanations are topology-specific;
- human review has no unresolved critical defects.

### Gate F — Merge

Merge one CP at a time onto the chapter base only after its focused workflow is green. Keep it non-publishable.

---

## 18. Chapter implementation order

Recommended order:

1. **Shared exact rational and rate foundation**
2. `TMW-CP-001` Fundamental mapping
3. `TMW-CP-002` Combined work and reconstruction
4. `TMW-CP-003` Efficiency and comparative productivity
5. `TMW-CP-004` Staged participation
6. `TMW-CP-005` Alternating and periodic schedules
7. `TMW-CP-006` Workforce/work-quantity equivalence
8. `TMW-CP-007` Heterogeneous workers and machines
9. `TMW-CP-008` Wages and contribution
10. `TMW-CP-009` Core pipes
11. `TMW-CP-010` Staged/cyclic pipes
12. `TMW-CP-011` Variable productivity
13. chapter-wide English gap audit
14. English manual freeze
15. Hindi/Punjabi localisation and parity proof
16. multilingual manual freeze
17. Question Studio integration
18. publication readiness review

CP-009 and CP-010 should reuse the signed-rate and schedule engines proven earlier rather than creating separate ad hoc mathematics.

---

## 19. Question Studio requirements

Question Studio must expose:

- CP;
- QL;
- solve mode;
- primary rule;
- formula strategy;
- explanation strategy;
- scenario family;
- renderer;
- seed;
- locale;
- exact work state;
- active schedule segments;
- signed rates;
- canonical solver trace;
- independent verifier trace/status;
- distractor labels;
- difficulty factors;
- answer type and unit;
- editorial status;
- saturation/freeze status.

Reviewers must be able to:

- regenerate the same seed;
- compare English/Hindi/Punjabi;
- inspect the phase or cycle ledger;
- inspect exact rational values;
- see why each distractor was produced;
- flag an event-boundary ambiguity;
- reject an unrealistic context;
- export multi-seed review batches.

Internal rule names must never appear in student-facing questions.

---

## 20. Freeze criteria

### 20.1 Design freeze

Required before implementation:

- CP boundaries approved;
- solve-mode discovery baseline reviewed;
- source gap audit completed;
- ownership exclusions approved;
- formula registry approved;
- explanation strategies approved;
- Gemini editorial role constrained;
- runtime architecture approved;
- no fixed QL quota imposed.

### 20.2 English chapter freeze

Required before localisation:

- all CPs saturated for current English ownership;
- all QLs runtime-proof green;
- independent verification green;
- stem and explanation duplicate audits clean;
- formula/MathJax audit clean;
- exam-realism review complete;
- manual editorial review complete;
- all critical defects closed;
- QL IDs and mathematical fingerprints frozen.

### 20.3 Multilingual freeze

Required before publication:

- Hindi and Punjabi coverage equals English where locale mode permits;
- answer/options/parameters/fingerprint parity;
- terminology review complete;
- no English leakage except permitted notation;
- no structural placeholders;
- manual Hindi review complete;
- manual Punjabi review complete.

### 20.4 Publication freeze

Required before `publiclyPublishable: true`:

- Question Studio integration verified;
- production bundle verified;
- chapter discovery/routing verified;
- public-test smoke tests pass;
- editorial and localisation sign-off recorded;
- chapter freeze record committed.

---

## 21. Immediate design deliverables

Before coding CP-001, create and approve:

1. `archetype.md`
2. `canonical-problems.md`
3. `reasoning-patterns.md`
4. `difficulty-framework.md`
5. `rule-registry.library.json`
6. `formula-registry.library.json`
7. `distractor-registry.library.json`
8. provisional solve-mode ownership matrix
9. source-to-solve-mode audit
10. explanation strategy schema
11. Gemini explanation-editor prompt and JSON schema
12. runtime type contracts
13. exact rational arithmetic tests
14. design-freeze report

---

## 22. Final design verdict

`TMW-001` should proceed as an eleven-CP chapter with shared exact-rate, state-transition and schedule engines.

The design is intentionally exhaustive in **mathematical ownership**, not artificially uniform in QL count. QLs and solve modes must continue to be discovered during source audits and CP gap audits. Counts may be reported as checkpoints, but they must never become quotas.

The strongest chapter-specific quality requirement is:

> Every explanation must expose the exact rate, work state or schedule logic that determines the answer, show the governing formula visibly, and follow the question’s actual phase structure without generic filler or hidden arithmetic.

Implementation should begin only after the CP ownership and solve-mode map have received design review and the shared foundation contract has been frozen.
