# DSF-001 — Data Sufficiency

This package is the implementation root for ExamTree `REAS-DSF`.

Current status: **DSF-CP-000 foundation/discovery**.

The foundation intentionally contains no permanent `DSF-QL-*` identities. CP-000 proves information-sufficiency semantics first; domain adapters and permanent Question Languages are allocated only after executable discovery and merge/split review.

Core rule:

> Solve enough of the underlying problem to know every possible answer to the asked target. Evaluate Statement I, Statement II, and their conjunction independently. Sufficiency is uniqueness of the target answer, not uniqueness of the complete hidden world.

Implemented in CP-000:

- five canonical sufficiency classes;
- finite-world target projection;
- independent I / II / I+II evaluation;
- consistency rejection;
- monotonicity and answer-agreement invariants;
- minimal sufficient statement subsets;
- standard five-option English semantic contract;
- discovery-only prototype registry;
- executable foundation tests.
