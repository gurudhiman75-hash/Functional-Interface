# BLR-CP-001 — Second Source and Gap Audit

Status: **gap identified and implemented; exact-head proof and focused V3 review pending; no permanent QLs**.

## Trigger

The remediated 88-record V2 English pack was approved after the external human audit. The discovery sequence therefore advanced to the mandatory second source-and-gap pass before any checkpoint freeze or permanent QL allocation.

## Sources rechecked

1. *Reasoning for Competitions*, Blood Relation chapter 11-1 through 11-21;
2. *Verbal & Non-Verbal Reasoning for Competitive Exams*, Blood Relation chapter 78 through 87;
3. the BLR-001 end-to-end design and first source-saturation record;
4. the implemented eleven-prototype review registry and seven provisional solve authorities.

The source pass focused on relation outputs, prompt ownership, ambiguity semantics, path depth, answer shape and renderer needs. It did not treat every printed template as a separate solve authority.

## Coverage decision matrix

| Source-backed family | Current owner | Audit decision |
|---|---|---|
| direct named relation, reverse relation and composed chains | CP-001 | retained |
| identity, ordered pair, claim, gender and generation questions | CP-001 | retained |
| exact maternal/paternal grandparent and aunt/uncle | CP-001 | retained |
| great-grandfather, great-grandmother, great-grandson and great-granddaughter | CP-001 | **material relation-output gap found** |
| pointer, photograph, conversation and nested self-reference | CP-002 | boundary confirmed |
| multi-question family passages | CP-003 | boundary confirmed |
| male/female/member/child/couple counts | CP-004 | boundary confirmed |
| son-or-daughter, possible relation and cannot-be-determined answers | CP-005 | boundary confirmed |
| coded relation solving and coded-expression construction | CP-006/CP-007 | boundary confirmed |
| family plus profession/sport/colour puzzles | general puzzle runtime | excluded from CP-001 |
| Blood Relations Data Sufficiency | Data Sufficiency | excluded from BLR-CP-001 |

## Material gap

The uploaded competition material contains explicit great-generation outputs, including great-granddaughter practice and a relation table that identifies a grandson's son as a great-grandson. These outputs are not merely hypothetical ontology entries.

Before this audit, the shared solver could enumerate three-edge paths but the relation ontology reduced only cousin-shaped three-edge paths. A pure ancestor or descendant path of length three therefore had no supported relation label.

## Merge/split decision

Great-generation questions do **not** justify a new prototype authority or eventual QL by themselves.

They retain the existing contract:

```text
three direct declarative clues
  -> exact graph closure
  -> relation-label answer
  -> family-tree explanation
```

The only changed instance properties are:

- path topology: three parent moves or three child moves;
- generation delta: `+3` or `-3`;
- output relation label.

They therefore merge into `RESOLVE_NAMED_PERSON_RELATION`, specifically the existing `BLR-CP001-PROT-COMPOSED-THREE-EDGE` exploratory prototype.

## Implemented closure

The second-gap slice adds:

- `GREAT_GRANDFATHER`;
- `GREAT_GRANDMOTHER`;
- `GREAT_GRANDSON`;
- `GREAT_GRANDDAUGHTER`;
- `CHILD>CHILD>CHILD` and `PARENT>PARENT>PARENT` reductions;
- gender-paired swaps and misconception distractor pools;
- four deterministic source-gap scenarios;
- generation-three family grids and explicit `ΔGen = +3/-3` teaching;
- focused shortcuts for all four outputs;
- a 512-question executable source-gap gate;
- a sixteen-record appendix balanced across four answer positions for each relation.

## Authority and identity result

```text
exploratory prototypes: 11
provisional solve authorities: 7
new authority added by second gap audit: 0
permanent BLR-QL IDs: 0
```

## Remaining checkpoint-freeze gates

1. exact-head CI for the second-gap implementation;
2. inspect the focused sixteen-record V3 appendix;
3. confirm no wording, diagram or distractor defect in the added relation family;
4. write the final CP-001 discovery-freeze record;
5. allocate guarded permanent sequential QLs only in a later change.

CP-001 remains English review-only, hidden from Question Studio and ineligible for publication or test generation.
