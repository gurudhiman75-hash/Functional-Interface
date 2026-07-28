# BLR-CP-001 — Merge, Split and Inverse Audit V1

Status: **provisional solve-authority audit; discovery remains open; zero permanent QLs**.

## Executable prototype inventory

CP-001 currently has eleven non-permanent prototype IDs:

```text
BLR-CP001-PROT-DIRECT-FORWARD
BLR-CP001-PROT-DIRECT-REVERSE
BLR-CP001-PROT-COMPOSED-TWO-EDGE
BLR-CP001-PROT-COMPOSED-THREE-EDGE
BLR-CP001-PROT-IDENTIFY-PERSON
BLR-CP001-PROT-IDENTIFY-PAIR
BLR-CP001-PROT-RELATION-CLAIM
BLR-CP001-PROT-GENERATION-COMPARISON
BLR-CP001-PROT-BRANCHING-RELATION
BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER
BLR-CP001-PROT-EXACT-LINEAGE-RELATION
```

Prototype count is not QL count. The prototypes deliberately over-sample query shape, topology and answer semantics before compression.

## Merge decisions

### Merge into one relation-label authority

The following five prototypes use the same generation, exact graph closure, relation-label answer and explanation authority:

- direct forward;
- direct reverse;
- two-edge composition;
- three-edge composition;
- branching relation.

They differ by path length, query direction or topology only. Those are generated-instance dimensions, not separate solve contracts.

Provisional authority:

```text
RESOLVE_NAMED_PERSON_RELATION
```

### Merge claim polarity

Definitely-true and false-claim questions share one option-by-option truth validator. The requested polarity is an instance property.

Provisional authority:

```text
SELECT_RELATION_CLAIM
```

### Merge male and female gender targets

Male and female are values of one gender-identification query. They do not create separate authorities.

Provisional authority:

```text
IDENTIFY_PERSON_BY_GENDER
```

### Merge maternal and paternal values

Maternal and paternal are outputs of one exact-lineage solver. Grandparent versus aunt/uncle changes the returned value but not the solver contract.

Provisional authority:

```text
RESOLVE_EXACT_LINEAGE_RELATION
```

## Split decisions

The following remain materially distinct provisional authorities:

1. `RESOLVE_NAMED_PERSON_RELATION` — answer is a broad kinship label;
2. `IDENTIFY_PERSON_BY_RELATION` — answer is a person selected by a relation predicate;
3. `IDENTIFY_PERSON_BY_GENDER` — answer is a person selected by a gender predicate;
4. `IDENTIFY_ORDERED_RELATION_PAIR` — every offered ordered pair must be solved independently;
5. `SELECT_RELATION_CLAIM` — every offered statement receives a truth value;
6. `COMPARE_GENERATIONS` — answer is a generation delta category rather than kinship;
7. `RESOLVE_EXACT_LINEAGE_RELATION` — answer preserves paternal/maternal side and exact relative gender.

The two person-answer authorities remain split provisionally despite sharing `PERSON_NAME`. Their predicates, distractor construction and explanation proofs are different. A later generic predicate runtime may merge them only if it preserves review metadata and source-natural wording.

## Inverse audit

| Forward operation | Candidate inverse | Decision |
|---|---|---|
| relation of A to B | relation of B to A | query direction property; merged |
| find person with relation R to B | ask relation of selected person to B | owned by relation-label authority |
| find ordered pair satisfying R | reverse every offered pair | distractor and option-order property |
| select a true claim | select a false claim | target polarity property; merged |
| compare A’s generation to B | compare B’s generation to A | sign reversal property; merged |
| identify male/female person | ask gender of a fixed person | not retained: four-option gender labels are semantically poor and redundant |
| exact paternal/maternal ancestor or aunt/uncle | reverse to descendant relation | not a matching exact-lineage inverse; ordinary descendant labels do not preserve paternal/maternal side |

No additional inverse solve authority is justified by the current source and executable evidence.

## Provisional compressed inventory

```text
Exploratory prototypes:       11
Provisional authorities:       7
Permanent QLs:                 0
Discovery freeze:             no
```

## Freeze blockers

- exact-head combined CI must pass;
- sibling-in-law paths must appear in the broad relation regression;
- generated English review must check all seven provisional authorities;
- a second source/gap audit must find no new CP-001 authority;
- final freeze metadata and permanent sequential allocation must be created in a later guarded change.

This document does not assign IDs, fix a final count or expose any question to Question Studio.
