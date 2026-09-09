# LP-010 — Source and Saturation Audit

Status: review-only English implementation candidate. Permanent QL allocation, localization, Question Bank admission, test eligibility and publication remain locked.

## Source coverage

| Source | Relevant evidence | LP-010 use |
|---|---|---|
| `reasoning_aggarwal.pdf` / duplicate copy | Puzzle Type 5, pp. 14-5 onward: family tree combined with six different professions | family structure plus a one-to-one profession layer; relation queries and profession queries from the same caselet |
| `reasoning_aggarwal.pdf` / duplicate copy | RRB NTPC 2021 Type 5 example: six family members also have six different heights | family structure plus an ordered height layer; relation queries and height-order queries from the same caselet |
| BLR-001 open QL discovery policy | explicitly places family-plus-profession/height/colour puzzles outside ordinary Blood Relations checkpoint ownership | keeps LP-010 in general Logic Puzzles rather than duplicating the core Blood Relations chapter |

The source is used for puzzle-family boundaries, clue interaction and explanation structure only. No source wording is copied.

## Implemented candidate authority

| Field | Value |
|---|---|
| Package | `LP-010` |
| Checkpoint | `LP-CP-010` |
| Candidate QLs | `LP-QL-037`–`LP-QL-040` |
| Caselet shape | six members of one family plus one unique attribute per member |
| Attribute modes | profession; height order |
| Family forms | paternal uncle, maternal aunt, paternal aunt, maternal uncle topologies |
| Child projections | relation lookup; attribute-to-person; person-to-attribute; relation-to-attribute link |
| Difficulty | Easy mostly named direct entries; Medium mixes named and family-role entries; Hard makes the family tree necessary before the attribute table can be completed, with ordered height clues where applicable |
| Languages | English review only |
| Runtime | `REVIEW_ONLY` |

## Explanation contract

LP-010 inherits the approved LP-009 V2 explanation standard. Every explanation must:

1. build the family tree first;
2. identify the person represented by any relational clue (for example, paternal uncle or mother-in-law);
3. fill the profession/height table clue by clue;
4. show the table after each meaningful deduction;
5. complete the final one-to-one table;
6. answer the exact child query from that completed structure.

Generic text such as “use all the clues” is not accepted as a complete explanation.

## Boundary

- ordinary direct blood-relation questions stay in `REAS-BLR`;
- floor/flat structures stay in `REAS-FLR`;
- LP-010 owns hybrid family-plus-attribute caselets because the family graph and a second constraint layer must be solved together;
- Data Sufficiency remains in its own chapter.

## Review obligations before merge

- human-review generated English questions from both modes;
- confirm family language is natural and unambiguous;
- confirm role-linked clues genuinely require the family tree;
- confirm height wording means rank/order, not arithmetic height calculation;
- confirm every child repeats all family and attribute information;
- confirm detailed table-led explanations stay question-specific;
- keep the entire checkpoint review-only and non-persistent until explicit approval.
