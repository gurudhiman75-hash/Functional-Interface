# DSF-001 Data Sufficiency — Chapter Manifest

Status: `IMPLEMENTATION_STARTED / CP-000 EXECUTABLE DISCOVERY`

## Identity

- Product chapter: Data Sufficiency
- Chapter code: `REAS-DSF`
- Implementation package: `DSF-001`
- Current checkpoint: `DSF-CP-000`
- Permanent QL allocation: **LOCKED / NOT YET AUTHORIZED**

## Product boundary

Data Sufficiency remains one learner-facing chapter. Internally it is a shared sufficiency engine over Quant and Reasoning domain adapters.

Statement & Assumption, Statement & Conclusion, Statement & Argument, Cause & Effect, Course of Action, Assertion & Reason, and Decision Making remain separate Logic/Deduction chapters.

## CP-000 purpose

Build and prove the chapter-level semantics before permanent domain content generation:

1. evaluate Statement I from the base problem;
2. evaluate Statement II independently from the same base problem;
3. evaluate their conjunction;
4. determine sufficiency from uniqueness of the **asked target answer**;
5. reject inconsistent statement sets;
6. classify one of five canonical sufficiency classes;
7. compute minimal sufficient statement subsets;
8. keep answer-contract rendering separate from semantic truth;
9. audit existing DS-shaped runtimes before reuse;
10. prove Quant and Reasoning adapter behavior with executable prototypes;
11. keep permanent QLs and Question Studio publication locked during discovery.

## Canonical classes

- `STATEMENT_I_ONLY`
- `STATEMENT_II_ONLY`
- `EACH_STATEMENT_ALONE`
- `BOTH_TOGETHER_ONLY`
- `INSUFFICIENT_EVEN_TOGETHER`

## Core semantic invariant

A statement set is sufficient when it leaves at least one valid world and every surviving valid world gives the same normalized answer to the target question. Complete-world uniqueness is not required.

## Executable discovery status

### Shared foundation

Implemented and proof-gated:

- finite-world target projection;
- statement independence;
- conjunction evaluation;
- consistency rejection;
- monotonicity and answer-agreement invariants;
- minimal sufficient subsets for future 3+ statement DS;
- exclusive/exhaustive `DS_STANDARD_5` English answer contract;
- exhaustive finite-domain property sweep.

### Existing-runtime audit

Audited on `New-main`:

- Number System `NUM-001`: reusable candidate/predicate assets; adapt to shared DSF;
- Time and Work `TMW-001`: reusable scenarios, but migrate intended `iUnique` flags to shared proof;
- Simplification `SAP-001`: reusable bounded candidate solving, but its four-class contract omits `EACH_STATEMENT_ALONE` and must not become the canonical DS contract.

### Executable Quant proof — Number System

`DSF-NUM-PROT-*` reuses the actual `NUM-001/foundation/divisibility.ts` capability and routes all sufficiency truth through the shared DSF evaluator.

The corpus proves all five classes plus a target-projection case where five complete digit worlds remain but the asked parity answer is uniquely `EVEN`.

### Executable Quant proof — Algebra target function

`DSF-ALG-PROT-TARGET-FUNCTION-BOTH-ONLY` uses bounded integer worlds to prove the important algebraic case:

- Statement I: `xy = 24`;
- Statement II: `|x-y| = 2`;
- neither statement alone fixes `x+y`;
- together the complete worlds `(4,6)` and `(6,4)` both survive;
- the asked target `x+y` is nevertheless uniquely `10`.

This is a discovery semantic proof only. Production Algebra source-runtime integration remains pending because a reusable Algebra runtime is not present on `New-main` yet.

### Executable Reasoning proof — Ranking and Order

`DSF-RNK-PROT-*` now provides the first relational adapter proof:

- all 24 total orders of four entities form the finite discovery world-space;
- DSF filters worlds independently under Statement I, Statement II and their conjunction;
- the asked target is A's rank from the top;
- target sets are independently checked with the existing `RNK-CP-007/exactRankSet` capability;
- all five canonical sufficiency classes are covered;
- a statement can leave six complete orders while fixing A's rank uniquely to `1`.

The local permutation enumerator is discovery scaffolding, not a new production Ranking solver. Production integration should consume a source-owned valid-order enumeration/constraint interface when exposed by RNK.

### Coverage matrix

Architectural matrix currently tracks 12 source-domain groups:

- 6 Quant;
- 6 Reasoning;
- 3 executable prototype groups: Number System, Algebra, Ranking and Order;
- 2 existing-runtime audits: Simplification and Time & Work;
- 5 prototype-required groups;
- 2 constraint-heavy groups deferred.

This matrix is architectural coverage only. Real exam/PYQ source-pattern discovery remains required before permanent QL allocation.

## CP-000 lifecycle locks

Until CP-000 discovery is reviewed:

- permanent QL IDs: disabled;
- Question Studio learner discovery: disabled;
- question-bank writes: disabled;
- mock-test eligibility: disabled;
- public publication: disabled.

## Remaining CP-000 work

1. attach SSC / Banking / Punjab-state source or PYQ pattern evidence;
2. perform prototype merge/split analysis and decide permanent QL boundaries;
3. reconcile existing TMW/SAP/NUM DS ownership with the chapter-level adapter model;
4. record the RNK production valid-order interface requirement discovered by the prototype;
5. freeze the discovery coverage matrix before allocating `DSF-QL-*` IDs.

## Exit gate

CP-000 may advance only when:

- all five canonical classes pass executable tests;
- target-projection semantics are proven with multiple-world examples;
- statement-independence tests pass;
- contradiction/inconsistency tests pass;
- monotonicity and answer-agreement invariants pass;
- the standard five-option semantic contract is exclusive and exhaustive;
- Quant and Reasoning cross-domain adapter semantics are executable;
- existing DS-shaped runtime ownership is reconciled;
- source-pattern discovery and merge/split audit are reviewed;
- permanent QL allocation remains locked until those gates pass.
