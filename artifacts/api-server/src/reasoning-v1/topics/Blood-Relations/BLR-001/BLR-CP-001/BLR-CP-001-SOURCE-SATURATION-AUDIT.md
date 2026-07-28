# BLR-CP-001 — Source Saturation and Boundary Audit

Status: **third executable discovery slice; source ownership reviewed; no permanent QLs**.

## Sources reviewed

The audit compared:

- the uploaded Blood Relation chapter and its relation table;
- source examples using direct, reverse, identity, pair, gender, generation, maternal/paternal and in-law questions;
- the BLR-001 end-to-end design;
- the current CP-001 executable graph surface;
- neighbouring ownership planned for CP-002 through CP-007.

The source table explicitly treats gender as essential and distinguishes grandparents and uncles through the father’s or mother’s side. It also lists both constructions of brother-in-law and sister-in-law: a sibling’s spouse and a spouse’s sibling.

## Source-backed CP-001 task surface

The current direct named-person checkpoint now prototypes:

1. relation of one named person to another;
2. reverse endpoint relation;
3. linear relation composition;
4. non-linear sibling/cousin branching;
5. identify the unique person with a requested relation;
6. identify an ordered pair with a requested relation;
7. select a true or false relation claim;
8. compare generation positions;
9. identify a person by stated gender;
10. return an exact paternal or maternal relation.

These cover relation-label, person, pair, claim, generation and exact-lineage answer semantics over direct declarative named-person clues.

## Ontology saturation

The broad relation engine now supports:

- father, mother, son and daughter;
- brother, sister, husband and wife;
- grandfather, grandmother, grandson and granddaughter;
- uncle, aunt, nephew, niece and cousin;
- father-in-law, mother-in-law, son-in-law and daughter-in-law;
- brother-in-law and sister-in-law.

Brother-in-law and sister-in-law are recognised through both supported paths:

```text
spouse -> sibling
sibling -> spouse
```

The exact-lineage layer additionally distinguishes:

```text
paternal grandfather   maternal grandfather
paternal grandmother   maternal grandmother
paternal uncle         maternal uncle
paternal aunt          maternal aunt
```

Lineage is accepted only when the connecting parent’s gender is established by displayed clues.

## Ownership decisions

| Candidate source form | Owner | Decision |
|---|---|---|
| direct named-person declarative clues | BLR-CP-001 | include |
| path length or number of names only | generated instance property | do not split |
| query endpoints reversed | generated query direction | do not split |
| linear versus branching family topology | generated topology | do not split |
| photograph, pointing, quoted speech or nested self-reference | BLR-CP-002 | exclude from CP-001 |
| shared family passage with several questions | BLR-CP-003 | exclude from CP-001 |
| family counts, couples, males or females | BLR-CP-004 | exclude from CP-001 |
| possible, impossible or cannot be determined | BLR-CP-005 | exclude from CP-001 |
| supplied relation symbols decoded into a graph | BLR-CP-006 | exclude from CP-001 |
| construct or complete a coded expression | BLR-CP-007 | exclude from CP-001 |
| family plus profession, height, colour or seating | General Puzzles | exclude |
| sufficiency of supplied statements | Data Sufficiency | exclude |

## Negative source decisions

The following do not currently justify additional CP-001 solve contracts:

- separate QLs for one-edge, two-edge and three-edge paths;
- separate QLs for maternal versus paternal values inside the exact-lineage contract;
- separate true-claim and false-claim QLs;
- separate male and female identity QLs;
- diagram-input questions, because the family tree remains an explanation/review renderer;
- step, half, adoptive, foster or multiple-spouse structures in V1;
- great-grandparent labels without stronger recurring standalone exam evidence;
- maternal/paternal cousin labels, which are not stable ordinary answer labels in the target exam surface.

## Remaining discovery work before freeze

- execute the third-slice runtime on repository CI;
- run the combined eleven-prototype regression after the sibling-in-law ontology expansion;
- perform an explicit inverse-contract audit;
- review generated English stems and explanations across all retained task authorities;
- perform a second gap pass after editorial review;
- freeze only if the second pass adds no materially distinct CP-001 solve contract.

No permanent `BLR-QL-*` identity is authorised by this audit.
