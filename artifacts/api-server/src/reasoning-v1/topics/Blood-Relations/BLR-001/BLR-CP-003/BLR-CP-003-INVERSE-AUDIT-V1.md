# BLR-CP-003 — Inverse Contract Audit V1

Status: **technical pre-human audit; no permanent QL allocation**.

## Purpose

The merge/split result must survive inverse testing. Two tasks remain separate when the forward question can have one definite answer while the inverse requires a different answer type, a different uniqueness condition or different option semantics.

## Gender

```text
person -> gender label
```

is not the same contract as:

```text
gender label -> one person
```

A passage can determine that one named member is female while containing several female members. The forward gender-label item remains definite, but inverse person identification is not unique without an additional candidate or uniqueness condition. This confirms the provisional `DETERMINE_MEMBER_GENDER` split from frozen `BLR-QL-003`.

## Unordered family pair

CP-003 pair options are permutation-invariant:

```text
A and B == B and A
```

Frozen `BLR-QL-004` is explicitly directional:

```text
first person -> stated relation -> second person
```

Reversing its pair changes the semantic answer. Married-couple, sibling-pair and parent-child-pair options therefore remain compressed into one provisional unordered-pair authority rather than merging into the ordered-pair QL.

## Complete member set

A complete set is invariant to name order but sensitive to both omission and addition:

```text
{A, B} == {B, A}
{A, B} != {A}
{A, B} != {A, B, C}
```

This confirms that `IDENTIFY_ALL_MEMBERS_BY_RELATION` is not a repeated rendering of the one-person `BLR-QL-002` contract.

## Marital status

With two explicit unmarried facts, each forward question remains definite:

```text
status(D) = UNMARRIED
status(E) = UNMARRIED
```

but the inverse item “Who is unmarried?” is no longer unique and must reject. This proves separate uniqueness contracts for:

- `DETERMINE_MEMBER_MARITAL_STATUS`;
- `IDENTIFY_MEMBER_BY_MARITAL_STATUS`.

The audit also retains the rule that a missing spouse edge does not prove unmarried status.

## Exact lineage

Two named women can both be paternal aunts of the same reference member. The exact-lineage relation for each woman remains definite, while “Who is the paternal aunt?” becomes non-unique.

Therefore:

- relation-label output remains merged into frozen `BLR-QL-007`;
- person identification remains provisionally split as `IDENTIFY_PERSON_BY_EXACT_LINEAGE`.

## V1 result

```text
Provisional new authorities                  6
Authorities collapsed by inverse audit       0
Authorities split further by inverse audit   0
Permanent CP-003 QLs                          0
```

The inverse audit confirms the six-authority technical compression hypothesis without allocating `BLR-QL-009`.

## Remaining gates

- second source and topology gap pass;
- human review of the remediated English pack;
- accepted remediation and deterministic reruns;
- post-human source-gap confirmation;
- final freeze and sequential allocation.
