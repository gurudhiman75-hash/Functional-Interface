# PNC-CP-006 Selection-Then-Arrangement & Role Assignment — Coverage-Gap Matrix

> Date: 2026-07-24  
> Package: `PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations`  
> Decision: implement the first complete runtime checkpoint for `PNC-CP-006`

## Ownership comparison

| Existing owner | Already covered | CP-006 must not duplicate |
|---|---|---|
| `PNC-CP-002` | direct ordered selection from the full pool, ranked medals, distinct offices | a single-stage `nPr` question with no selected-group stage |
| `PNC-CP-003` | unordered teams and committees | selection-only questions with no later role or arrangement stage |
| `PNC-CP-006` | choose a group, then assign roles or arrange the chosen group | mixed evidence must preserve both the selection and assignment factors |

## Admitted directions

1. choose a committee and appoint one chair;
2. choose a team and appoint captain and vice-captain;
3. choose a committee and assign three distinct offices;
4. choose finalists and assign a smaller number of ranked prizes;
5. choose books and arrange every selected book;
6. choose speakers and assign every selected speaker to numbered slots;
7. find the multiplier introduced by assigning distinct roles after selection;
8. recover the original pool size from a mixed target;
9. recover the selected-group size from a mixed target;
10. recover the number of assigned roles from a mixed target.

These directions become `PNC-QL-095` through `PNC-QL-104` because QL IDs follow admission order, not CP order.

## Required solve contracts

- `selectThenAssignDistinctRoles` — `nCs × sPk`, with `1 ≤ k < s`;
- `selectThenArrangeAllSelected` — `nCs × s! = nPs`;
- `findRoleAssignmentMultiplier` — isolate `sPk` as the factor beyond selection alone;
- `recoverSelectionRoleParameter` — bounded exact recovery of `n`, `s` or `k`.

One-chair, captain/vice-captain and three-office contexts reuse the same direct mixed contract. Separate modes would add names without changing the solver, evidence, verifier or validator.

## Deferred

- category-constrained teams or committees: CP-009;
- together/apart or positional restrictions: CP-007/008;
- circular role/seating systems: CP-010/012;
- multiple interacting restrictions: CP-012.

## Saturation decision

Further ordinary committee/office noun substitutions collapse into the admitted mathematical fingerprints. Expansion stops at ten current QLs unless later PYQ/reference review demonstrates a new solve direction or constraint topology.
