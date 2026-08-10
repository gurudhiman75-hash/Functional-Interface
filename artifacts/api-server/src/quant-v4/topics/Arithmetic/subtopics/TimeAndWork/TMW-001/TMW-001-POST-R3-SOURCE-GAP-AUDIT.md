# TMW-001 Post-R3 Exhaustive Source-Gap Audit

## Decision

`R3_211_QL_CORPUS_IS_STRONG_BUT_NOT_SATURATED`

The existing `TMW-QL-001..211` set must be preserved exactly. No existing permanent ID should be renumbered or repurposed.

However, the post-R3 source audit found materially distinct competitive-exam contracts that are not generatable by the current 211 QLs. Under the chapter blueprint, these are genuine saturation gaps because they change the given/unknown structure, required inference, answer semantics, event topology or dominant misconception profile. They are not wording-only variants.

The chapter therefore remains **NO-GO for final freeze, Question Studio eligibility or publication** until a source-gap extension is implemented and independently audited.

## Audit authority

The comparison used:

- `TMW-001-END-TO-END-DESIGN-BLUEPRINT.md`;
- uploaded Disha SSC Mathematics Time & Work/Pipes material;
- uploaded R.S. Aggarwal quantitative-aptitude Time & Work material;
- uploaded Arun Sharma Time & Work material;
- the final R3 runtime registries, parameter builders and student stems for CP-001 through CP-011;
- the earlier comprehensive exam-readiness audit and post-audit R1/R2/R3 remediation.

The blueprint explicitly states that solve-mode counts are not quotas and that a chapter is saturated only after source, inverse, event, boundary and representation gaps are checked.

## Merge/split rule used

A source pattern was **not** counted as a gap when the existing QL already has the same essential operation, solver composition, answer semantic, dominant traps and explanation architecture and differs only by surface nouns or by replacing `work` with `output`.

A source pattern **was** counted as a gap when at least one of the following changes materially:

- what is given versus what is unknown;
- the algebraic reconstruction required before the normal work-rate step;
- event timing topology, especially events defined relative to completion;
- answer type or target semantic;
- heterogeneous-category validity logic;
- the principal wrong methods expected from exam candidates;
- the pedagogically correct shortest exam method.

## Healthy consolidations — do not create extra QLs

The following apparent blueprint/registry count differences are deliberate and should remain consolidated:

1. CP-001 `work/rate/time` and physical-output `output/rate/time` forward forms use the same invariant and do not need duplicate QLs merely because the noun is pages, files or pieces.
2. CP-007 man/woman, man/child, skilled/unskilled and machine-type efficiency ratios are correctly represented by the generic two-category equivalence authority; the parameter pool already contains worker and machine families.
3. CP-009 two-inlet versus multiple-inlet and inlet/outlet versus inlet/leak forward systems are correctly consolidated by signed pipe sets where the given/unknown contract is unchanged.
4. CP-010 delayed inlet, delayed outlet/leak, staggered activation/deactivation and periodic schedules are correctly consolidated by event topology rather than pipe names.
5. CP-011 fixed daily increase/decrease and percentage increase/decrease are correctly consolidated into arithmetic/geometric daily-rate authorities where the mathematical sequence contract is unchanged.

## Confirmed missing contracts

### CORE_EXAM_PATTERN

These should receive high default practice/mock eligibility after final approval.

#### `TMW-QL-212` — CP-003
`findCombinedTimeFromSoloTimeAndRelativeEfficiency`

Source pattern: one worker's solo time is given; a second worker is stated to be x% more/less efficient; find their combined completion time.

Why existing coverage is insufficient: CP-003 can recover the second solo time and can recover individual time from a known combined time, but it does not own the forward combined-time target from one solo time plus relative efficiency. This is a direct SBI/SSC-style contract with its own distractors: using the faster solo time as the answer, adding the times, applying the percentage to time in the wrong direction, or failing to add both rates.

#### `TMW-QL-213` — CP-002
`findCombinedTimeFromPartialWorkFacts`

Source pattern: A completes a stated fraction of the job in x days and B another fraction in y days; find time together.

Why distinct: current CP-002 combined-time QLs begin from whole-job solo times. The partial-work facts must first be converted into full rates. The dominant trap is treating the stated days as solo completion times or adding the fractions without normalising by time.

#### `TMW-QL-214` — CP-002
`findTargetOutputTimeFromIndividualAndCombinedOutputFacts`

Source pattern: A produces q1 units in t1; A+B produce q2 units in t2; find how long B alone needs for a new target output.

Why distinct: this is an explicit-output component-extraction problem, not a whole-job reciprocal-time problem. It requires rate extraction from two output/time statements followed by a new target-output conversion.

#### `TMW-QL-215` — CP-004
`findCompletionWithEndRelativeLeaveEvent`

Source pattern: several workers start together; one leaves after a stated elapsed time while another leaves a stated number of days **before completion**; find total completion time.

Why distinct: current CP-004 event builders use event durations measured forward from the start or a known final completion time. They cannot generate an event whose position is defined backward from the unknown completion boundary. This is a common SSC/CPO pattern and requires a different timeline equation.

#### `TMW-QL-216` — CP-004
`findMissingSoloTimeFromCombinedThenSoloStage`

Source pattern: A+B can finish in T days; they work together for x days, then one leaves and the other completes the remaining job in y days; find the remaining worker's solo time.

Why distinct: current CP-004 solves total completion when solo times are known and inverse event time when final completion is known, but not the missing solo rate from a known combined rate plus a staged remainder.

#### `TMW-QL-217` — CP-006
`findOriginalWorkforceFromAddedWorkersAndTimeSaved`

Source pattern: x workers take D days; with k additional workers the same work takes d fewer days; find x.

Why distinct: current CP-006 can recover the original workforce when the revised absolute workforce is supplied, but not when only the **workforce difference** and **time difference** are supplied. This requires solving `xD=(x+k)(D-d)`.

#### `TMW-QL-218` — CP-004/CP-006 ownership resolved to CP-004
`findWorkforceLeaveTimeForExtendedDeadline`

Source pattern: N workers can finish in D days. A fixed number leave after x days, and the job is required to finish in a longer specified time. Find x.

Why distinct: the unknown is the event time of a homogeneous workforce-count change. Existing CP-004 inverse leave-time contracts use named agents with individual reciprocal rates; CP-006 workforce QLs do not solve the event time. CP-004 should own this because the tested inference is the event boundary.

#### `TMW-QL-219` — CP-007
`findCompletionAfterHeterogeneousReplacementEvent`

Source pattern: a mixed men/women or skilled/unskilled crew starts; after a stated duration some members of one category leave and members of another category join; find the additional completion time.

Why distinct: CP-007 owns heterogeneous rates but its replacement QL changes the crew before the job starts. CP-004 owns stage transitions but only homogeneous named agents. This contract combines a heterogeneous weighted crew with an in-job event and is explicitly present in banking material.

#### `TMW-QL-220` — CP-008
`findTogetherTimeFromPaymentSharesAndOneSoloTime`

Source pattern: A's solo completion time is known; A and B complete the job together and receive known wage shares; infer the joint completion time.

Why distinct: the wage ratio reveals the work-contribution/rate ratio, which must then be combined with A's known reciprocal rate. Current CP-008 inverse QLs recover a missing work duration or efficiency directly from contribution factors but do not target joint completion time.

#### `TMW-QL-221` — CP-009
`findAllPipesTimeFromOverlappingSubsetTimes`

Source pattern: different overlapping subsets of three/four inlet pipes have known combined filling times; find the time for all pipes together.

Why distinct: current CP-009 can recover one missing pipe from a net system but does not solve an overlapping-subset linear reconstruction. This is a recognizable SSC pipes contract analogous to pairwise worker-rate reconstruction but with pipe ownership and pipe distractors.

#### `TMW-QL-222` — CP-002
`findSoloTimeFromSubgroupEquivalenceAndCombinedFact`

Source pattern: A alone has the same rate as B+C; A+B have a known completion time and C has a known solo time; find B's solo time.

Why distinct: it requires a rate-equivalence constraint between a person and a subgroup before component extraction. No current CP-002 QL accepts this relation.

#### `TMW-QL-223` — CP-002
`findSoloTimeRatioFromPairwiseCombinedTimes`

Source pattern: AB, BC and AC combined times are known; find the ratio of A's solo time to C's solo time.

Why distinct: the existing pairwise reconstruction QLs target all-together time or one individual's solo time. A direct solo-time-ratio answer has a different answer contract and strong ratio-direction traps and is explicitly bank-exam style.

### UPPER_EXAM_PRACTICE

These are source-backed and useful for stronger SSC CGL/Bank PO/state practice but should receive lower default mock weight than the core group.

#### `TMW-QL-224` — CP-007
`findTargetMixedCrewTimeFromMixedCrewCompletionFacts`

Source pattern: two or more heterogeneous crew compositions have known whole-job completion times; use those equations to infer category rates and then find the completion time of a new mixed crew.

Why distinct: current CP-007 weighted-system QL presents combined **output rates** directly and asks for one category rate. It does not present whole-job crew times and then target a new crew completion time.

#### `TMW-QL-225` — CP-007
`findAdditionalCategoryAfterStagedHeterogeneousProgress`

Source pattern: a mixed crew completes one fraction in a first phase; after category counts change it completes another fraction; determine how many additional members of one category are needed to finish the remainder in a deadline.

Why distinct: this combines heterogeneous-rate inference, completed fractions and a final workforce target. It appears in established aptitude references and cannot be generated by current CP-004, CP-006 or CP-007 alone.

#### `TMW-QL-226` — CP-008
`findHelperShareFromSoloTimesAndJointCompletion`

Source pattern: A and B have known solo times; with helper C they complete the job in a shorter known time; determine C's contribution/payment share from a fixed contract amount.

Why distinct: current wage QLs assume each contribution factor is already given or directly represented. Here C's rate must first be reconstructed from the joint completion rate.

#### `TMW-QL-227` — CP-004
`findCombinedTimeFromHandoffCompletionFacts`

Source pattern: A's solo time is known; A works alone for x days and B completes the remainder in y days; find how long A+B would take if they worked together throughout.

Why distinct: the existing handoff QL targets staged total completion and the replacement-worker inverse targets B's solo time. This source contract deliberately targets the hypothetical combined time after reconstructing B's rate.

#### `TMW-QL-228` — CP-011
`findInitialWorkforceFromDailyAttritionSchedule`

Source pattern: a workforce was expected to finish in D days, but a fixed number of workers drop out each day and the job actually finishes later; find the initial workforce.

Why distinct: CP-011 can consume an explicit varying worker-count schedule, while CP-006 can consume batch additions, but neither solves the **unknown first term** of an arithmetic workforce sequence from the completion condition.

### ADVANCED_ENRICHMENT

Keep this source-backed pattern available for advanced practice, but do not give it routine SSC/Banking mock weight.

#### `TMW-QL-229` — CP-002
`findIndividualTimeFromCombinedAndHalfHandoffTotal`

Source pattern: A+B have a known combined completion time. If A alone completes half the work and then B alone completes the other half, a second total time is known; an efficiency ordering identifies which algebraic root belongs to the requested worker.

Why distinct: this contract combines a simultaneous-rate condition with a sequential half-work condition. It requires recovering the **sum and product of the two solo times** and resolving a two-root ambiguity from the stated efficiency ordering. No existing CP-002 or CP-004 QL has the same validity, solve or misconception topology.

## Collision review — proposed pattern rejected as a new QL

An earlier audit draft proposed a separate `findIndividualPaymentFromPairwiseContributionFractions` wage QL. Implementation-level collision review rejected it as a permanent new contract: when the pairwise fractions determine an individual's contribution, the final payment operation collapses to the same contribution-share authority already owned by CP-008. The extra pairwise statement reconstruction does not create enough independent validity or misconception topology to justify another wage QL in the final saturated set.

This rejected candidate was replaced by the source-backed half-handoff inverse contract retained as `TMW-QL-229` above. The candidate extension therefore remains 18 QLs rather than growing by a superficial duplicate.

## Source patterns intentionally excluded rather than added

The following uploaded patterns do **not** justify Time & Work QLs under the frozen chapter boundary:

- questions using only aggregate wage sums and individual wage ratios with no work contribution; these are payroll/algebra rather than work-contribution allocation;
- generic pairwise daily earnings reconstruction with no completed-work or rate inference;
- pure partnership-capital/time allocation;
- fluid-pressure or hydraulic questions beyond signed volume flow;
- pure ratio questions where the work state contributes no inference.

## Cross-cutting product gaps that do not require new mathematical QLs

### Data sufficiency

The blueprint includes statement-I/II data-sufficiency as a cross-cutting presentation mode after an ordinary QL is proven. The 211-QL runtime does not yet provide a chapter-level DS wrapper. This should be implemented at Question Studio/presentation-contract level rather than by duplicating every mathematical QL.

### Mock-weight tiering

The chapter needs explicit test-assembly weight classes:

- `CORE_EXAM_PATTERN`
- `UPPER_EXAM_PRACTICE`
- `ADVANCED_ENRICHMENT`

Staged controllers, arbitrary cycle phases and non-uniform sequence problems must not receive the same default mock weight as ordinary combined-work, workforce and standard pipes questions.

### Answer-position governance

A previous full review found checkpoint-local answer-position patterns that can become exploitable when many questions from one checkpoint appear together. R4 must add a multi-seed chapter audit that checks answer-position reachability and assembled-window balance instead of relying only on whole-chapter aggregate counts.

### Difficulty recalibration

Difficulty labels must be based on information extraction, number of reasoning transitions, arithmetic burden and boundary/event complexity. A long stem or an internal `Hard` registry label is not evidence of hard SSC/Banking difficulty.

### State-pool diversity

A saturation decision must audit normalized stem skeletons and mathematical-state fingerprints across many seeds. A QL can be correct yet still be too repetitive for a large question bank.

## R4 implementation plan

1. Preserve `TMW-QL-001..211` unchanged.
2. Implement `TMW-QL-212..229` through a source-gap extension registry/router so early-CP ownership does not require renumbering the frozen range.
3. Reuse exact rational arithmetic and existing CP concepts; do not duplicate older solvers when a shared invariant can be composed safely.
4. Give each added QL its own parameter-state generator, canonical solve trace, independent verifier, misconception-derived four-option contract and learner V2 explanation.
5. Implement English/Hindi/Punjabi together; publication remains false.
6. Add source-pattern proof plus full R1/R2/R3 regression.
7. Add answer-position, difficulty-tier and multi-seed diversity audits.
8. Only after R4 is green, run a fresh blind full-chapter exam-readiness audit on the expanded 229-QL corpus.

## Post-audit target

If all retained contracts survive implementation-level proof, the next candidate chapter count is:

- existing: 211 QLs
- new source-gap contracts: 18 QLs
- candidate total: **229 QLs**

`229` is still not a quota. If implementation proves that two retained contracts have identical validity, solver, answer and misconception topology, they must be merged before freeze. Conversely, a newly discovered source-backed materially distinct contract may still be added before saturation is declared.
