# TMW-CP-003 — Efficiency, Time Ratios and Comparative Productivity
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp003`  
**Base:** merged CP-002 chapter base `c91cb9494a55f6477a16a468c1806139f8b4175f`  
**Status:** implementation ownership baseline; counts are discovered, not quotas  
**Publication:** disabled

## 1. Ownership rule

CP-003 owns questions whose governing inference is a comparison among efficiency, time and output rather than direct work-rate mapping or simultaneous-rate aggregation.

For equal work:

\[
E_A:E_B=T_B:T_A
\]

For possibly unequal work and duration:

\[
\frac{E_A}{E_B}
=
\frac{W_A/T_A}{W_B/T_B}
=
\frac{W_AT_B}{W_BT_A}
\]

and:

\[
W\propto E\times T
\]

Percentage statements must be converted to multipliers before time is inferred. For example, if A is \(p\%\) more efficient than B:

\[
E_A=\left(1+\frac p{100}\right)E_B,
\qquad
T_A=\frac{T_B}{1+p/100}
\]

## 2. Current distinct solve contracts

1. `findEfficiencyRatioFromEqualWorkTimes`  
   Reverse the equal-work completion-time ratio.

2. `findTimeRatioFromEfficiencyRatio`  
   Reverse a stated efficiency ratio for equal work.

3. `findEfficiencyPercentMoreFromCompletionTimes`  
   Determine how much more efficient the faster worker is.

4. `findEfficiencyPercentLessFromCompletionTimes`  
   Determine how much less efficient the slower worker is, preserving the correct comparison base.

5. `findFasterTimeFromSlowerTimeAndPercentMoreEfficient`  
   Apply a rate multiplier and invert it to obtain the faster completion time.

6. `findSlowerTimeFromFasterTimeAndPercentMoreEfficient`  
   Recover the reference worker’s time from the more-efficient worker’s time.

7. `findTimePercentLessFromEfficiencyPercentMore`  
   Convert “p% more efficient” into the percentage reduction in completion time.

8. `findTimePercentMoreFromEfficiencyPercentLess`  
   Convert “p% less efficient” into the percentage increase in completion time.

9. `findWorkRatioAtEqualTimeFromEfficiencyRatio`  
   For equal duration, work ratio equals efficiency ratio.

10. `findWorkRatioFromEfficiencyRatioAndUnequalTimes`  
    Use \(W_A:W_B=E_AT_A:E_BT_B\).

11. `findTimeRatioForUnequalWorkAndEfficiencyRatio`  
    Recover the time ratio when work quantities differ.

12. `findEfficiencyRatioFromUnequalWorkAndTimes`  
    Recover relative efficiency from comparative output and duration.

13. `findOutputFromEfficiencyRatioAndReferenceOutput`  
    Scale output for equal working time.

14. `findReferenceOutputFromEfficiencyRatioAndOtherOutput`  
    Reverse the equal-time output comparison.

15. `findIndividualTimeFromEfficiencyRatioAndCombinedTime`  
    Use the efficiency ratio to partition a known combined rate and recover a named individual time.

16. `findIndividualTimeFromEfficiencyRatioAndTimeDifference`  
    Use inverse times plus a stated time difference to recover a named completion time.

17. `findIndividualTimeFromEfficiencyRatioAndTimeSum`  
    Use inverse times plus a stated time sum to recover a named completion time.

18. `findEfficiencyRatioFromOutputAndTimeComparison`  
    Compare productivity where both output and duration are explicitly stated.

19. `findComparativeOutputFromDifferentEfficienciesAndDurations`  
    Determine an unknown output using a reference output, an efficiency ratio and unequal durations.

20. `findComparativeDurationFromDifferentWorkAndEfficiencies`  
    Determine an unknown duration from work and efficiency ratios.

21. `findSuccessiveEfficiencyRatioAcrossThreeAgents`  
    Combine A:B and B:C efficiency relations into A:C or a requested pair.

22. `findSuccessiveEfficiencyPercentComparison`  
    Convert successive percentage-efficiency statements into one final comparison.

23. `findEfficiencyChangePercentFromCompletionTimeChange`  
    Reverse a change in equal-work completion time to the corresponding efficiency increase or decrease.

These twenty-three contracts are the current architecture- and source-backed baseline. They are not a quota. New QLs may be admitted only for a materially distinct given/unknown direction, comparison base, representation, inverse system or misconception contract.

## 3. Provisional-mode consolidation and rejection

The chapter blueprint contained several provisional labels that overlap other CPs:

- direct time saved or delay after one uniform rate change belongs to CP-001;
- direct work/rate/time recovery belongs to CP-001;
- simultaneous team-rate addition belongs to CP-002;
- joins, leaves or changing active sets belong to CP-004;
- worker-count equivalence after efficiency changes belongs to CP-006;
- men/women/children or machine-category equivalence belongs to CP-007.

The following are therefore not separate CP-003 QLs:

- `findCombinedTimeAfterEfficiencyIncrease`;
- `findCombinedTimeAfterEfficiencyDecrease`;
- `findTimeSavedByEfficiencyIncrease`;
- `findDelayCausedByEfficiencyDecrease`;
- `findRequiredEfficiencyChangeForDeadline` when only one uniform worker is involved;
- `findEquivalentCountFromEfficiencyDifference`;
- `findEfficiencyFromWorkCompletedInGivenTime` without a comparison.

They are either already owned elsewhere or become CP-003 only when a genuine comparative-efficiency system is present.

## 4. Percentage-base rules

The runtime must distinguish:

- “A is 25% more efficient than B” → \(E_A:E_B=125:100=5:4\);
- “B is 20% less efficient than A” → \(E_B:E_A=80:100=4:5\);
- if A is 25% more efficient than B, A takes \(20%\) less time, not \(25%\) less;
- if A is 20% less efficient than B, A takes \(25%\) more time, not \(20%\) more.

Every percentage QL must store the comparison base explicitly and reject ambiguous wording.

## 5. Explanation strategies

### Ratio inversion

1. State that equal-work time is inversely proportional to efficiency.
2. Display \(E_A:E_B=T_B:T_A\).
3. Substitute the stated times or ratio.
4. Reduce to lowest terms.
5. Conclude with the requested order.

### Percentage multiplier

1. Identify the reference worker.
2. Convert the efficiency percentage into a multiplier.
3. Invert the multiplier when moving to time.
4. Apply it to the stated time/output.
5. Verify the direction: the more efficient worker must take less time or produce more output.

### Unequal work and time

1. Use \(W=ET\) for each worker.
2. Form one comparative ratio.
3. Cancel common factors.
4. Solve the unknown work, time or efficiency.
5. Verify against the direction and scale of both output and duration.

### Ratio plus combined rate

1. Represent the two efficiencies as \(kx\) and \(ky\).
2. Use their combined completion time to determine \(k\).
3. Recover the requested individual rate.
4. Invert to obtain individual completion time.
5. Recombine the rates as a check.

### Ratio plus sum/difference of times

1. Reverse the efficiency ratio to obtain the time ratio.
2. Represent the times with one common factor.
3. Apply the stated sum or difference.
4. Recover the requested time.
5. Verify both the time relation and efficiency direction.

## 6. Required misconception families

- treating efficiency and time as directly proportional;
- failing to reverse a ratio;
- using the wrong percentage base;
- applying an efficiency percentage directly to time;
- assuming “p% more efficient” means “p% less time”;
- assuming “p% less efficient” means “p% more time”;
- omitting one duration factor in \(W=ET\);
- using output ratio as efficiency ratio despite unequal durations;
- using time ratio without adjusting for unequal work;
- adding rather than multiplying successive efficiency multipliers;
- reversing the requested worker order;
- reporting the combined time as an individual time;
- splitting combined time in the efficiency ratio rather than splitting combined rate.

## 7. Implementation gate

Before CP-003 can be called saturated:

- percentage bases must be encoded and tested explicitly;
- every ratio must be reduced exactly;
- all parameter states must be generated from valid underlying efficiencies, times and outputs;
- canonical and independent comparative equations must agree;
- direction checks must confirm that greater efficiency implies lower equal-work time and higher equal-time output;
- distractors must map to declared comparison mistakes;
- formula-led explanations must use only visible or explicitly derived information;
- a multi-seed review export must pass manual exam-language review;
- exact-head focused CI must be green;
- no Question Studio, Question Bank, test assembly or student routing may be added.
