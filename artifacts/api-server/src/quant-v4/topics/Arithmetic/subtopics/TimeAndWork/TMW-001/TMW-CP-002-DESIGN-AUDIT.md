# TMW-CP-002 — Combined Work and Rate Reconstruction
## Ownership and Solve-Contract Audit

**Branch:** `feat/tmw-cp002`  
**Base:** merged CP-001 chapter base `99d552aef1421540ea6d37284a55d1db5c2b96a0`  
**Status:** implementation ownership baseline; counts are discovered, not quotas  
**Publication:** disabled

## 1. Ownership rule

CP-002 owns questions in which two or more independent rates are combined simultaneously, separated from a known net rate, or reconstructed from combined-rate facts.

The core relation is:

\[
r_{net}=\sum r_{constructive}-\sum r_{destructive}
\]

and, for remaining work \(W\):

\[
t=\frac{W}{r_{net}}
\]

CP-002 does not own a question merely because two workers are mentioned. It owns the question only when independent-rate aggregation or component extraction is the governing inference.

## 2. Current distinct solve contracts

1. `findCombinedTimeFromIndividualTimes`  
   Combine two to four positive individual completion rates.

2. `findCombinedWorkInGivenTime`  
   Determine the fraction of one job completed by simultaneously active agents over a stated duration.

3. `findMissingIndividualTimeFromCombinedAndKnownTimes`  
   Subtract one or more known individual rates from the combined rate and invert the remainder.

4. `findAllTogetherTimeFromPairwiseTimes`  
   Use \((A+B)+(B+C)+(C+A)=2(A+B+C)\).

5. `findIndividualTimeFromPairwiseTimes`  
   Recover one individual rate from the three pairwise rates.

6. `findPairTimeFromAllTogetherAndThirdTime`  
   Recover a subgroup rate by subtracting an excluded individual from the all-together rate.

7. `findNetTimeWithDestructiveAgent`  
   Combine constructive agents and subtract one destructive rate.

8. `findDestructiveTimeFromPositiveAndNetTimes`  
   Recover the rate that cancels progress from positive and net completion facts.

9. `findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes`  
   Recover a missing positive rate in a signed-rate system.

10. `findIdenticalAgentCountFromSingleAndCombinedTime`  
    Recover the number of equal-efficiency agents from single-agent and group completion times.

11. `findCombinedTimeFromIdenticalAgentCount`  
    Scale one-agent time by the number of identical simultaneous agents.

12. `findCombinedOutputFromExplicitRates`  
    Add explicit physical output rates and apply a duration.

13. `findMissingRateFromSignedNetRate`  
    Recover an explicitly expressed rate from a signed net-rate equation.

14. `findCompletionTimeDifferenceBetweenTeams`  
    Build two team rates from individual completion times and compare their completion durations.

These fourteen contracts are the current source- and architecture-backed baseline. Further QLs may be admitted only if a later gap audit identifies a materially different given/unknown structure, signed topology, representation, answer type or misconception contract.

## 3. Provisional-mode consolidation

The chapter blueprint listed several provisional labels that are not distinct QLs:

- two-agent, three-agent and multi-agent direct combination share `findCombinedTimeFromIndividualTimes`; agent count is a generated-state dimension;
- missing third rate, missing excluded agent and missing component from a combined rate share component-extraction contracts according to whether the requested component is individual, subgroup, constructive or destructive;
- “all individual times from pairwise times” is not a scalar MCQ answer contract; the retained QL asks for a named individual;
- comparing two teams is retained only where both team rates must first be constructed; simple efficiency comparison belongs to CP-003.

## 4. Excluded ownership

- explicit efficiency ratios, percentage efficiency and time-ratio reconstruction → CP-003;
- joins, leaves, handoffs or changing active sets → CP-004;
- alternating/repeating schedules → CP-005;
- workers–days–hours/work-quantity scaling → CP-006;
- men/women/children or unequal machine categories → CP-007;
- contribution-based wages → CP-008;
- inlets, outlets, leaks and tank levels → CP-009/010;
- changing daily rates → CP-011.

## 5. Explanation strategies

### Direct combination

1. Treat the whole assignment as one unit.
2. Convert each completion time to a rate.
3. Add active constructive rates.
4. Divide work by the combined rate.
5. Verify that positive-agent combined time is below every individual time.

### Component extraction

1. Write the known combined/net rate.
2. Remove the known component rates with their correct signs.
3. Simplify the missing rate.
4. Invert only when the target is completion time.
5. Recombine as a verification.

### Pairwise reconstruction

1. Convert pairwise completion times to pairwise rates.
2. Use the pairwise identity for the target.
3. Simplify the target rate.
4. Invert to obtain time.
5. Substitute back into the pairwise facts.

### Signed-rate systems

1. Declare constructive and destructive directions.
2. Show the signed net-rate equation.
3. Confirm that the net direction completes the target.
4. Divide the remaining work by the net rate or isolate the missing signed component.
5. Reject non-positive net completion states.

## 6. Required misconception families

- add completion times instead of rates;
- average completion times;
- omit one agent;
- forget the reciprocal conversion;
- subtract a constructive rate;
- add a destructive rate;
- omit the factor of two in pairwise aggregation;
- invert before isolating the missing rate;
- report the combined/net rate as a time;
- use the single-agent time as the identical-agent group time;
- multiply rather than divide by identical-agent count;
- compare team rates without converting them to completion times.

## 7. Implementation gate

Before CP-002 can be called saturated:

- all retained QLs must use exact rational arithmetic;
- every state must be generated from valid underlying individual rates;
- canonical and independently replayed work totals must agree;
- signed systems must have positive target-direction net rates;
- all options must be unique and misconception-backed;
- formula-led explanations must use only visible or explicitly derived facts;
- a multi-seed review export must pass manual exam-language review;
- exact-head focused CI must be green;
- no Question Studio, Question Bank, test assembly or student routing may be added.
