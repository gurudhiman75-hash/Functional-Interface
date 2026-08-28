# DSF-CP-015 — Three-Statement Data Sufficiency / DSF-QL-002

## Status

**FINAL IMPLEMENTATION / PERMANENT SEMANTIC ALLOCATION — EXECUTABLE GREEN**

Final executable allocation head:

- `166b8d691ce0c042d44fbed06295712e6f8ee85a`
- workflow: `Validate DSF CP-015 Three Statement QL-002 Foundation`
- run: `33058818772`
- job: `98472226362`
- conclusion: **SUCCESS**

The exact-head job completed locked dependency installation, API build, exhaustive three-statement semantic QA, real `NUM-001` source-prototype QA, and the additive `DSF-QL-002` allocation audit.

`DSF-QL-002` is therefore permanently allocated in the **current** DSF registry from historical candidate `DSF-QL-CAND-002`. The historical CP000 snapshot is intentionally unchanged and still truthfully records that CP000 initially allocated only `DSF-QL-001` and deferred Candidate 002.

Current permanent semantic identities after CP015:

- `DSF-QL-001` — two-statement target determinacy;
- `DSF-QL-002` — three-statement minimal-sufficient-subset reasoning;
- next available identity: `DSF-QL-003`.

All learner-delivery lifecycle capabilities remain locked.

## Permanent contract

- statement count: 3;
- task contract: `THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS`;
- rule: `INFORMATION_SUFFICIENCY_SUBSET_LATTICE`;
- answer semantic: `MINIMAL_SUFFICIENT_STATEMENT_SUBSET`.

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
- derives the minimal sufficient antichain using the shared `findMinimalSufficientSubsets` authority;
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

## Exhaustive foundation audit — GREEN

`three-statement-foundation.test.ts` constructively creates a finite world set for **every one of the 19 valid semantic states**.

Final run `33058818772` reports:

- `PASS_DSF_CP015_THREE_STATEMENT_SUBSET_LATTICE_FOUNDATION`;
- semantic states: 19;
- evaluated subsets per state: 7;
- answer options per state: 5;
- correct answer positions verified at A/B/C/D/E;
- finite-domain bridge verified.

The audit also verifies already-sufficient base rejection and jointly inconsistent statement-set rejection.

## Real source-bound prototypes — GREEN

The new semantic authority is not frozen on synthetic worlds alone. CP015 binds it to the existing reviewed `NUM-001/foundation/divisibility` authority over the complete `42X` single-digit universe.

Two source prototypes pass on the final head:

1. `I|II+III` — Statement I alone is sufficient, or Statements II and III together are sufficient;
2. `I+II+III` — no single statement or pair is sufficient; all three are required.

Final run output records:

- `PASS_DSF_CP015_NUM001_THREE_STATEMENT_SOURCE_PROTOTYPES`;
- source worlds: 10;
- `permanentQlAllocated: true`;
- `permanentQlId: DSF-QL-002`.

The prototypes retain historical `candidateQlId: DSF-QL-CAND-002` ancestry while exposing the current permanent identity `DSF-QL-002`.

## Additive allocation audit — GREEN

The allocation audit proves both historical and current views simultaneously:

- historical CP000 permanent IDs: `[DSF-QL-001]`;
- current permanent IDs: `[DSF-QL-001, DSF-QL-002]`;
- allocated identity: `DSF-QL-002`;
- next available identity: `DSF-QL-003`;
- lifecycle locked: true.

It reports `PASS_DSF_CP015_QL002_ADDITIVE_PERMANENT_ALLOCATION` on final run `33058818772`.

## Lifecycle

CP015 grants semantic identity only. It does **not** grant delivery authority:

- Question Studio discoverable: false;
- Question Bank writable: false;
- scored/test eligible: false;
- mock-test eligible: false;
- publicly publishable: false;
- automatic student publication: false.

Any later delivery activation requires separate governed checkpoints and must not be inferred from this semantic freeze.
