# DSF-CP-015 — Three-Statement Data Sufficiency / DSF-QL-002

## Status

**IMPLEMENTED CANDIDATE — PERMANENT QL ALLOCATION PENDING EXECUTABLE GREEN**

This checkpoint implements the previously frozen deferred boundary candidate `DSF-QL-CAND-002`:

- statement count: 3;
- task contract: `THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS`;
- rule: `INFORMATION_SUFFICIENCY_SUBSET_LATTICE`;
- answer semantic: `MINIMAL_SUFFICIENT_STATEMENT_SUBSET`.

The permanent registry is intentionally unchanged until the current-head CP015 evaluator + renderer QA succeeds.

## Why this requires a new QL

`DSF-QL-001` owns two-statement target determinacy and its five canonical classes. Three statements create seven non-empty statement subsets and cannot be represented without information loss by the same five-class truth table.

For a valid three-statement problem, the minimal sufficient subsets form an antichain over `{I, II, III}`. Excluding the invalid case where the base problem is already sufficient, there are:

- 18 non-empty minimal-sufficient antichain patterns; plus
- one `NONE` state where even I+II+III is insufficient.

Therefore the three-statement semantic space contains exactly **19 valid learner outcomes**.

## Evaluator

`three-statement-foundation.ts`:

- evaluates all seven non-empty subsets independently from the base world set;
- rejects an empty base world set;
- rejects a base problem whose target is already uniquely determined;
- requires all three statements to be jointly consistent;
- checks consistency for every non-empty subset;
- enforces sufficiency monotonicity across subset/superset pairs;
- enforces target-answer stability after adding consistent evidence;
- derives the minimal sufficient antichain using the existing shared `findMinimalSufficientSubsets` authority;
- serializes that antichain into a stable semantic key; and
- exposes `evaluateFiniteDomainTriple` so existing source-domain adapters can be reused without giving DSF ownership of source mathematics/reasoning.

## Answer profile

`three-statement-answer-profile.ts` keeps an exam-style five-option surface while preserving all 19 semantic outcomes.

For a given correct semantic state it:

1. computes the seven-bit monotone sufficiency signature;
2. ranks the other 18 semantic states by Hamming distance from the correct signature;
3. selects the four nearest logical distractors;
4. renders each state as a human-readable statement-combination expression; and
5. rotates the correct option deterministically across A-E by seed.

This avoids both unacceptable alternatives:

- collapsing three-statement truth into the five two-statement classes; or
- presenting learners with a 19-option answer list.

## Exhaustive foundation audit

`three-statement-foundation.test.ts` constructively creates a finite world set for **every one of the 19 valid semantic states**.

The audit verifies:

- all 19 states are realizable and reproduced exactly by the evaluator;
- all seven non-empty subsets are evaluated for every state;
- the base problem remains insufficient;
- all statement subsets remain logically consistent;
- canonical semantic serialization is stable;
- five answer options are produced for every state;
- option semantic keys and text are unique;
- exactly one option is correct;
- seeds 0..4 place the correct answer at all five option positions;
- all 19 human-readable labels are distinct;
- `evaluateFiniteDomainTriple` works through the existing finite-domain adapter contract;
- already-sufficient base problems are rejected; and
- jointly inconsistent three-statement sets are rejected.

## Allocation rule

`DSF-QL-002` must **not** be added to `permanent-ql-registry.ts` merely because this code exists. Allocation occurs only after the current-head CP015 workflow completes successfully.

When that happens, the permanent entry should be allocated from `DSF-QL-CAND-002` with the exact frozen contract above. Lifecycle must remain review-only until separate Question Studio / Question Bank / scored-test / mock-test release checkpoints explicitly grant those capabilities.
