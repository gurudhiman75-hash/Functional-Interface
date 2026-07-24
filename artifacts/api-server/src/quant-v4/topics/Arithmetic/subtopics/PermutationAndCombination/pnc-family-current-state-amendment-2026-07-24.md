# P&C Family Current-State Amendment — 2026-07-24

> **Applies to:** `pnc-family-end-to-end-design.md`  
> **Purpose:** Supersede implementation-state snapshots only.  
> **Governance effect:** None. The need-based architecture, admission rules and quality gates remain unchanged.

## Superseded snapshots

This amendment supersedes the following current-state statements in the original end-to-end design:

- the active-CP table showing 48 QLs;
- the list containing only five active solve modes;
- Section 19 current checkpoint showing `PNC-QL-001` through `PNC-QL-048`.

Those statements were accurate before the factorial coverage review but are no longer the latest repository state.

## Current active state

As of the successful factorial-extension runtime proof:

- active package: `PNC-001`;
- active CP: `PNC-CP-001`;
- CP title: `Fundamental Counting Principle, Case Partition & Factorial Reasoning`;
- implemented English QLs: `PNC-QL-001` through `PNC-QL-058`;
- current QL count: 58;
- current observed difficulty: 27 Easy, 22 Medium, 9 Hard;
- current active solve modes: 10;
- maturity: `RUNTIME_PROOF`;
- publicly publishable: `false`;
- generation-engine routing: not added;
- Hindi/Punjabi: not implemented.

## Current solve-mode snapshot

The active modes are:

1. `countSequentialIndependentChoices`;
2. `countMutuallyExclusiveAlternatives`;
3. `countDisjointCasePartition`;
4. `countUsingSimpleComplement`;
5. `recoverMissingStageChoiceCount`;
6. `evaluateFactorialValue`;
7. `evaluateFactorialUnitExpression`;
8. `simplifyFactorialQuotient`;
9. `recoverFactorialArgument`;
10. `recoverFactorialQuotientArgument`.

These modes exist because current admitted QLs require them. This list is not a forecast or final chapter inventory.

## Evidence-led admission record

The factorial extension was selected through `PNC-001/pnc-001-coverage-gap-matrix.md`. Ten QLs were admitted because reference review identified direct factorial evaluation, unit-factorial identities, factorial cancellation and bounded inverse factorial questions as material missing coverage inside the existing CP.

No new CP was created. No permutation, combination, multiset, digit, circular or grouping mode was predeclared.

## Verification snapshot

The current checkpoint passed:

- strict targeted TypeScript compilation;
- esbuild proof-test bundling;
- 58-QL registry/language and placeholder audit;
- 696 deterministic seed cases, each generated twice;
- independent verifier agreement;
- option and explanation invariants;
- exact duplicate English templates: 0.

Successful workflow run: `30068306106`.

## Continuing rule

The values above describe the repository at this checkpoint. They do not define a final QL count, solve-mode count, CP count or package boundary. The next change must begin with another documented coverage-gap review.