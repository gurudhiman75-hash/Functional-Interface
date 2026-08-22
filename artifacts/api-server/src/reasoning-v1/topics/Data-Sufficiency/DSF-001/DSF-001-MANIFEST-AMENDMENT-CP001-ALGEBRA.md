# DSF-001 — CP-001 Algebra Production Amendment

Status: `ALGEBRA_PRODUCTION_PROOF_CANDIDATE`

Permanent DSF Question Logic: `DSF-QL-001 / TWO_STATEMENT_TARGET_DETERMINACY`

## Source authority

The Algebra dependency is now available on `New-main` through the frozen Algebra chapter authority.

DSF consumes only the source-owned Algebra Data Sufficiency contract:

- source package: `ALG-002`;
- source permanent QL: `ALG-QL-040`;
- source checkpoint: `ALG-CP-014`;
- source freeze key: `F-C040`;
- source English freeze: `ALG-EN-v3-frozen`;
- source title: `Algebraic data sufficiency`.

The five source variants mapped to `ALG-QL-040` are reused as source problem states. DSF does not copy or replace Algebra equation/system/inequality solvers.

## DSF ownership

DSF independently owns and verifies:

- Statement I / Statement II / conjunction sufficiency classification;
- canonical five-class DS semantics;
- `DS_STANDARD_5` options;
- target-uniqueness invariant;
- DSF explanation and proof metadata;
- DSF generation identity and lifecycle.

Algebra owns:

- exact linear-equation solving;
- exact linear-inequality interval solving;
- interval intersection;
- exact 2×2 linear-system solving;
- source Algebra DS problem states.

## Symbolic target proof

Algebra is not forced into a bounded finite-world approximation. The DSF bridge converts the exact Algebra solver result into symbolic target cardinality:

- `EMPTY` — inconsistent, rejected;
- `ONE` — exactly one value of the asked target, sufficient;
- `MANY` — more than one target value remains, insufficient.

The canonical DSF classifier then classifies Statement I, Statement II and their conjunction. The result must agree with the frozen source Algebra verdict for every generated item.

## Production solve modes

Both remain under `DSF-QL-001`:

- `DSF-SM-ALG-SINGLE-VARIABLE-X`;
- `DSF-SM-ALG-LINEAR-SYSTEM-X`.

No `DSF-QL-002` allocation is created.

## Lifecycle

This wave is review-only until its exact-head production proof and final CP-001 cross-wave freeze audit pass.

Still false:

- Question Studio discoverable;
- Question Bank writable;
- mock/scored-test eligible;
- publicly publishable.
