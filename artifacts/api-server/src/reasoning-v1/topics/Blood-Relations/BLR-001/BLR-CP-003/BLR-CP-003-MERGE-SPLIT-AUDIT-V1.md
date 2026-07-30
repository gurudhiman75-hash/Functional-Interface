# BLR-CP-003 — Merge/Split Audit V1

Status: **technical pre-human decision; provisional; no permanent allocation**.

## Evidence base

The audit compares eighteen executable CP-003 item handles against the frozen CP-001 permanent contracts. The shared-passage renderer is assessed separately because it has no student answer of its own.

Current proof supporting the audit:

```text
8 executable family scenarios
760 deterministic groups
4,940 independently solved items
208 remediated English review records
18 temporary item handles
1 temporary assembly handle
0 permanent CP-003 QLs
```

## Existing-authority merges

| CP-003 handle | Frozen target | Reason |
|---|---|---|
| shared relation | `BLR-QL-001` | same subject-to-reference relation solve |
| shared great relation | `BLR-QL-001` | great depth is an output/path property |
| identify person | `BLR-QL-002` | one named person by relation |
| identify by great relation | `BLR-QL-002` | relation vocabulary does not alter the person-answer contract |
| identify person by supplied gender | `BLR-QL-003` | same supplied-gender, candidate-domain and person-name answer contract |
| definitely true claim | `BLR-QL-005` | frozen claim contract supports target truth `TRUE` |
| definitely false claim | `BLR-QL-005` | frozen claim contract already supports target truth `FALSE` |
| generation comparison | `BLR-QL-006` | same generation-delta solve |
| three-generation comparison | `BLR-QL-006` | output range widens, solve authority does not |
| exact lineage relation | `BLR-QL-007` | grouped item directly reuses the frozen lineage solver |

The shared passage is an assembly and review contract around these items. It does not create a second relation, person-by-gender, claim, generation or lineage solve authority.

## Gender boundary

Two grouped gender tasks are deliberately different:

```text
person -> gender label
  = provisional DETERMINE_MEMBER_GENDER

gender label + candidate set -> one person name
  = merge into BLR-QL-003 IDENTIFY_PERSON_BY_GENDER
```

The source-gap pass added the second form as an executable compact-passage item. It does not collapse the first form because their inputs and answers remain inverse contracts.

## Provisional new authorities

### `DETERMINE_MEMBER_GENDER`

The item supplies a person and asks for `MALE` or `FEMALE`. Frozen `BLR-QL-003` does the inverse: it supplies a gender and asks for one person from a candidate domain. The different answer contract prevents a merge.

### `SELECT_UNORDERED_FAMILY_PAIR`

Married, sibling and parent-child pair items share one solver and one unordered pair answer. They do not merge with `BLR-QL-004`, whose contract explicitly asks whether the first member has a stated relation to the second member. In the CP-003 renderer, pair order is not part of the student answer.

Connection type remains an instance property:

```text
MARRIED_COUPLE
SIBLING_PAIR
PARENT_CHILD_PAIR
```

### `IDENTIFY_ALL_MEMBERS_BY_RELATION`

The answer is a complete set of names. One omitted match or one extra non-match makes the option wrong. This is materially different from `BLR-QL-002`, which returns exactly one person.

### `DETERMINE_MEMBER_MARITAL_STATUS`

The item returns a unary status label. It relies on a spouse edge or explicit status fact, not on a binary relation to a supplied reference member.

### `IDENTIFY_MEMBER_BY_MARITAL_STATUS`

This is the inverse status task and returns one person name. It does not merge with `BLR-QL-002` because no binary reference relation is supplied.

### `IDENTIFY_PERSON_BY_EXACT_LINEAGE`

The answer is one person, but candidate evaluation requires the maternal/paternal exact-lineage solver. Frozen `BLR-QL-002` accepts the broad `BlrRelationId` domain, while `BLR-QL-007` returns a lineage label rather than a person. The current technical evidence therefore supports a provisional split pending human review and post-human confirmation.

## Assembly decision

```text
BLR-CP003-PROT-MULTI-ITEM-GROUP
  -> ASSEMBLY_ONLY
  -> no answer type
  -> no student solve identity
```

The passage renderer owns shared prompt construction, clue minimisation, common person mapping, generation-row explanation data and item grouping. Each child item retains its own solve authority.

## Current compression result

```text
Temporary item handles                   18
Handles merged into frozen authorities   10
Handles mapped to provisional new modes   8
Provisional new solve authorities          6
Assembly-only handles                      1
Permanent CP-003 QLs                       0
```

Frozen targets now used by the grouped layer:

```text
BLR-QL-001
BLR-QL-002
BLR-QL-003
BLR-QL-005
BLR-QL-006
BLR-QL-007
```

`BLR-QL-004` remains excluded because its pair semantics are ordered. No sequential identity is reserved and `BLR-QL-009` remains unclaimed.

## Completed technical confirmations

- inverse-contract audit: passed;
- technical second source and topology gap pass: passed;
- remediated English editorial V2 gate: passed.

## Required confirmation before freeze

The V1 result must still survive:

- English human review and accepted remediation;
- reruns of every affected deterministic gate;
- post-human source-gap confirmation;
- final discovery freeze.

The six-authority result is a technical compression hypothesis, not the final CP-003 QL inventory.
