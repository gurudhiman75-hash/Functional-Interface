# DSF-001 Data Sufficiency — Chapter Manifest

Status: `DSF-CP-000 FREEZE-REVIEW CANDIDATE`

## Identity

- Product chapter: Data Sufficiency
- Chapter code: `REAS-DSF`
- Implementation package: `DSF-001`
- Current checkpoint: `DSF-CP-000`
- Permanent `DSF-QL-*` IDs: **not allocated yet**
- Question Studio publication: **locked**

## Product boundary

Data Sufficiency is one learner-facing chapter with shared sufficiency semantics and source-owned Quant/Reasoning adapters.

Statement & Assumption, Statement & Conclusion, Statement & Argument, Cause & Effect, Course of Action, Assertion & Reason, and Decision Making remain separate Logic/Deduction chapters.

## Canonical semantic rule

A statement set is sufficient when:

1. at least one valid world remains; and
2. every surviving valid world gives the same normalized answer to the **asked target**.

Complete-world uniqueness is not required.

Canonical two-statement classes:

- `STATEMENT_I_ONLY`
- `STATEMENT_II_ONLY`
- `EACH_STATEMENT_ALONE`
- `BOTH_TOGETHER_ONLY`
- `INSUFFICIENT_EVEN_TOGETHER`

## CP-000 implemented foundation

- independent Statement I / Statement II / conjunction evaluation;
- target-answer projection;
- contradiction / empty-world rejection;
- sufficiency monotonicity invariant;
- answer-agreement invariant;
- generic minimal sufficient subsets for 3+ statements;
- `DS_STANDARD_5` canonical English semantic contract;
- generic finite-domain adapter bridge;
- exhaustive finite-domain property sweep;
- dedicated GitHub Actions proof suite.

## Executable domain discovery

### Number System

Uses real `NUM-001/foundation/divisibility.ts` capabilities. Six disposable prototypes cover all five canonical classes plus a case where five complete digit worlds survive while the asked parity answer is uniquely `EVEN`.

### Algebra

Discovery proof:

- I: `xy = 24`
- II: `|x-y| = 2`
- target: `x+y`
- complete worlds `(4,6)` and `(6,4)` both survive
- target answer is uniquely `10`

This proves target-function sufficiency independent of complete-world uniqueness. Production Algebra source-runtime integration remains pending a reusable Algebra runtime on `New-main`.

### Ranking and Order

The first Reasoning adapter covers all five canonical classes and checks DSF target-rank sets independently against `RNK-CP-007/exactRankSet`. A statement may leave six complete orders while fixing A's rank uniquely to `1`.

The CP-000 permutation enumerator is discovery scaffolding only; production must consume a source-owned complete valid-order interface or equivalent proof.

## Existing-runtime ownership reconciliation

- `TMW-001 / TMW-CP-013`: preserve frozen `TMW-QL-216..223`; never renumber or clone them. Migrate/wrap sufficiency proof through DSF while TMW retains domain truth.
- `NUM-001` retained DS: reuse Number System capabilities; route canonical classification through DSF before any new DS-facing permanent identity.
- `SAP-001` Wave 3: reuse arithmetic candidate-solving ideas only; do not promote its local four-class answer taxonomy because it omits `EACH_STATEMENT_ALONE`.
- `RNK-001`: remains owner of ranking inference; DSF owns only statement-subset sufficiency classification.

One underlying frozen task keeps one permanent identity. Learner taxonomy may reference a source QL through ancestry/alias metadata rather than duplicating it.

## Source-pattern discovery

Evidence registry now captures:

- Banking: two-statement five-class profiles, including different option orders across exam sets;
- Banking: three-statement subset / minimal-combination contracts;
- SSC CGL Tier-II: four-option DS profiles in both Reasoning and Quant examples on PYQ platforms;
- Railway: Data Sufficiency preparation signal, not treated as direct PYQ proof;
- PSSSB Clerk: exam-specific preparation signal confirming DS relevance, including Direction Sense, but the official Punjab answer-contract profile is not yet frozen.

Architectural consequence: semantic truth and displayed option position/count are separate layers.

## Merge / split decision

Merge into the same QL contract:

- option-order variants;
- wording variants;
- Quant vs Reasoning source chapter changes;
- scalar, categorical and rank targets already proven to use the same two-statement target-projection semantics.

Split from the two-statement contract:

- three-statement subset-lattice DS.

Defer from first allocation:

- Seating / general puzzle adapters until complete source-world interfaces are proven;
- Punjab-specific rendering profile until official-paper semantics are verified.

## QL boundary freeze candidate

CP-000 currently proposes only **one initial permanent QL contract**:

`DSF-QL-CAND-001 — TWO_STATEMENT_TARGET_DETERMINACY`

It supports source adapters / solve modes for scalar values, categorical/yes-no targets, ranks/positions, identities, directions/distances, relations, comparisons and counts.

A separate future candidate is retained but not part of the first allocation:

`DSF-QL-CAND-002 — THREE_STATEMENT_MINIMAL_SUFFICIENT_SUBSETS`

No permanent `DSF-QL-*` ID is assigned in CP-000 itself.

## Coverage matrix

12 architectural source-domain groups:

- 6 Quant;
- 6 Reasoning;
- 3 executable prototype groups: Number System, Algebra, Ranking and Order;
- 2 existing-runtime audits: Simplification and Time & Work;
- 5 further prototype-required groups;
- 2 constraint-heavy groups deferred.

## Lifecycle locks

Until CP-000 freeze review passes:

- permanent DSF QL allocation: locked;
- Question Studio learner discovery: disabled;
- question-bank writes: disabled;
- mock-test eligibility: disabled;
- public publication: disabled.

## Freeze-review gate

CP-000 is ready for freeze review when CI proves:

- all five canonical classes;
- target projection with multiple complete worlds;
- statement independence;
- contradiction rejection;
- monotonicity and answer agreement;
- minimal sufficient subsets;
- answer-contract exclusivity;
- Number System source-capability reuse;
- Algebra target-function semantics;
- Ranking source-capability agreement;
- source-pattern / option-profile audit;
- ownership and QL-boundary governance.

After that review, the next implementation step is initial permanent allocation for the single two-statement QL candidate and CP-001 production generation. Three-statement, Seating/Puzzle and unverified Punjab-specific presentation remain separately gated.
