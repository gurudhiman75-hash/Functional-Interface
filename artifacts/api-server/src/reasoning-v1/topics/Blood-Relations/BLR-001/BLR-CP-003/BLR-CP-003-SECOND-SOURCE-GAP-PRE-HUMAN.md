# BLR-CP-003 — Second Source-Gap Audit: Technical Pre-Human Pass

Status: **technical source-gap pass complete; human review and post-human confirmation still required**.

## Purpose

This pass checks whether the current shared-family runtime misses source-significant task forms, passage renderers or graph structures before the English pack is submitted for human review.

It is not the mandatory post-human source-gap confirmation and cannot freeze the checkpoint.

## Evidence reviewed

The second pass widened beyond the initial isolated-clue renderers to cover common shared-passage forms:

- a compact couple statement followed by joint children;
- a child explicitly described as the son or daughter of both named parents;
- person identification from a supplied gender and candidate list;
- ordinary relation, grandparent, in-law and married-pair items from the same compact passage;
- explicit unmarried wording rather than missing-spouse inference;
- paternal and maternal branches;
- four-generation relation and generation-distance questions;
- complete member-set, true-claim and false-claim options.

The uploaded-file retrieval service was unavailable during this pass, so the earlier repository source inventory was supplemented with public SSC and banking preparation sets. Human review must still assess the resulting English pack directly.

## New executable source-gap scenario

```text
BLR-CP003-SCN-COMPACT-JOINT-PARENT-PASSAGE
```

The learner-facing passage uses natural compact wording:

```text
A and B are a married couple.
C is their son, and D is their daughter.
C is married to E.
F is the son of C and E.
```

The structured clue model explicitly contains both parent edges for every use of `their` or `of C and E`. The renderer never infers that a spouse is automatically a co-parent.

## Newly covered task

```text
BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER
```

The question supplies a gender and a candidate set, then returns one person name. Executable merge/split evidence maps it to frozen:

```text
BLR-QL-003 — IDENTIFY_PERSON_BY_GENDER
```

The grouped passage changes only assembly and does not justify another solve authority.

## Deliberate checkpoint boundaries

### Only son, only daughter and only child

These facts constrain family composition and member counts. They remain in `BLR-CP-004` rather than being hidden inside CP-003 as closed-universe assumptions.

### Possible, impossible or cannot determine

Ambiguous status, relation or co-parent conclusions remain in `BLR-CP-005`. CP-003 accepts only questions with one exact answer entailed by displayed clues and explicit facts.

### Missing spouse

A missing spouse edge is not proof of unmarried status. `UNMARRIED` still requires an explicit status fact.

### Marriage and co-parenthood

A spouse edge does not by itself prove that both spouses are parents of every child. Joint-parent wording is allowed only when both parent edges are explicitly represented.

## Exact executable result

```text
Base shared-family scenarios                 3
Extended sibling/set scenarios               1
Explicit marital-status scenarios            1
Lineage/four-generation scenarios             2
Compact joint-parent source-gap scenarios     1
------------------------------------------------
Executable scenarios                          8
Deterministic groups                        760
Independently solved items                 4,940
Hidden-graph agreement checks               760
Input-contribution checks                   760
Temporary item handles                       18
Temporary assembly handles                    1
Permanent CP-003 QLs                          0
```

The new source-gap gate contributes:

```text
100 groups
800 items
100 person-by-gender items
answer positions [200, 200, 200, 200]
```

## Compression impact

The technical merge/split result changes only by adding one existing-Ql merge:

```text
handles merged into frozen QLs   10
provisional new handles            8
provisional new authorities        6
assembly-only handles              1
```

The six-authority technical hypothesis remains:

```text
DETERMINE_MEMBER_GENDER
SELECT_UNORDERED_FAMILY_PAIR
IDENTIFY_ALL_MEMBERS_BY_RELATION
DETERMINE_MEMBER_MARITAL_STATUS
IDENTIFY_MEMBER_BY_MARITAL_STATUS
IDENTIFY_PERSON_BY_EXACT_LINEAGE
```

No permanent identity is allocated and `BLR-QL-009` remains unclaimed.

## Remaining mandatory sequence

```text
human review of English V2 pack
  -> accepted editorial remediation
  -> affected deterministic reruns
  -> post-human source-gap confirmation
  -> final discovery freeze
  -> sequential QL allocation
```
