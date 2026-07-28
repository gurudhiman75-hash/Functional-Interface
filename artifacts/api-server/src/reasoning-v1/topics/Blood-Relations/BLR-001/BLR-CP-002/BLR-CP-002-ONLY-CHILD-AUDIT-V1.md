# BLR-CP-002 — Exact Only-Child Audit V1

Status: **broad `ONLY_CHILD` semantics implemented and green; no new solve authority**.

## Problem closed

The initial CP-002 role vocabulary was relation-specific:

```text
SON
DAUGHTER
```

That cannot safely represent `only child`, because a parent with one son and one daughter has one son and one daughter but does not have one child.

## Implemented role model

The shared role vocabulary now distinguishes answer relations from gender-neutral traversal roles:

```text
PARENT = FATHER ∪ MOTHER
CHILD = SON ∪ DAUGHTER
SIBLING = BROTHER ∪ SISTER
SPOUSE = HUSBAND ∪ WIFE
```

`ONLY` is applied after unioning the complete role set.

Therefore:

```text
ONLY_CHILD(reference)
```

passes only when the union of sons and daughters contains exactly one person.

## Positive source scenarios

Three source-backed exact scenarios prove:

1. the pointed woman is the daughter of the speaker's father's only child;
2. the reverse query asks how the speaker is related to that pointed daughter;
3. the person in the photograph is the only child of the speaker's father and collapses to `SELF`.

Expected answers:

```text
DAUGHTER
MOTHER
SELF
```

## Negative cardinality scenario

A father is modelled with:

```text
one daughter
one son
```

Both `only son` and `only daughter` could be individually true, but `only child` is false because the union contains two people.

The role solver must reject the chain before answering the query.

## Deterministic proof

```text
3 positive scenarios × 64 seeds     192 questions
1 two-child rejection × 64 seeds     64 questions
-------------------------------------------------
ONLY_CHILD proof                     256 questions
```

Every positive case verifies unique role-chain resolution, assertion truth and expected answer. Every negative case fails with an exact-cardinality error for `child`.

## Merge/split result

No separate authority is required. `CHILD` is a role vocabulary parameter inside:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

`ONLY_CHILD`, `ONLY_SON` and `ONLY_DAUGHTER` differ in the matching role set, not in the solve contract.

## Allocation state

```text
permanent CP-002 QLs: 0
next available chapter ID: BLR-QL-008
claimed: no
```

The remaining discovery blockers are canonical review integration of the widening scenarios, longer role chains and the second independent source-gap audit.
