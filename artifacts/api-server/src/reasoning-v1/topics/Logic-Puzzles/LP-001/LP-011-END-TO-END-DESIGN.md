# LP-011 — Box-and-Attribute Stack Puzzle

Status: **English human-review design candidate**

## Why LP-011 exists

LP-003 owns a single-axis stack: box/object ↔ vertical position. It does not model a second independent one-to-one attribute attached to each box.

The uploaded puzzle source contains a distinct exam family in which labelled boxes are stacked and each box also has a different colour/item. The learner must solve both the vertical order and the box↔attribute mapping. Source examples include coloured boxes and boxes containing different items, with queries such as which box has a colour/item, which colour/item belongs to a box, and where an attributed box is positioned.

LP-011 therefore owns **stack + independent attribute** puzzles. It does not duplicate:

- LP-003 pure box-order puzzles;
- Floor/Flat Arrangement, which is a separate chapter;
- LP-005/006 person-duty/location multi-attribute puzzles;
- scheduling checkpoints LP-008..010.

## Candidate QLs

These identities remain review-only until English approval and freeze.

| Candidate QL | Contract |
|---|---|
| `LP-QL-041` | `BOX_TO_ATTRIBUTE_LOOKUP` — identify the attribute assigned to a named box |
| `LP-QL-042` | `ATTRIBUTE_TO_BOX_LOOKUP` — identify the box carrying a named attribute |
| `LP-QL-043` | `ATTRIBUTE_TO_POSITION_LOOKUP` — identify the stack position of a named attribute |
| `LP-QL-044` | `BOX_ATTRIBUTE_POSITION_MATCH` — identify the correct box–attribute–position triple |

## Caselet model

V1 uses five labelled boxes and five unique attributes. Five-box structures are directly source-backed and keep the exhaustive proof small enough to independently re-solve every generated caselet.

Each caselet explicitly states:

- all five box labels;
- all five attribute values;
- positions are counted from bottom to top;
- every box occupies one unique position;
- every attribute belongs to exactly one box.

## Clue families

Position-only:

- box above box;
- box immediately above box;
- exact number of boxes between two boxes;
- box not in a stated position.

Attribute-only:

- box has attribute;
- box does not have attribute.

Mixed stack/attribute:

- attributed box above a named box;
- named box above an attributed box;
- attributed box immediately above a named box;
- named box immediately above an attributed box;
- one attributed box above another attributed box.

The generator constructs a hidden state first, derives only true clues, and independently enumerates all legal states until exactly one remains. Redundant clues are removed.

## Difficulty

Difficulty comes from deduction structure, not vocabulary.

- **Easy:** stronger direct/adjacent clues, fewer surviving alternatives early.
- **Medium:** mixed positional and attribute clues with limited direct assignment.
- **Hard:** layered mixed clues and exclusions; direct assignments are minimized.

The final band is calibrated from the selected clue topology and solver reduction profile.

## Explanation contract

Explanations must not mechanically follow printed clue order. They choose the most informative clue first and then prefer connected clues.

After every meaningful deduction, show a working table:

| Position from bottom | Box | Attribute |
|---|---|---|

Use `?` where unresolved and compact candidate sets only when they genuinely narrow the row. If exactly two full arrangements remain, show separate Case 1 / Case 2 tables and use the discriminating clue to reject one.

## Editorial rules

- Natural exam-style setup; no solver jargon in learner copy.
- No unnecessary local city names.
- No generic “associated with” wording.
- All variables/domains are explicitly stated before clues.
- Child explanations are question-specific and end by reading the requested answer from the completed table.
- Four distinct options; one semantic answer; balanced answer positions across deterministic batches.

## Lifecycle

LP-011 remains `REVIEW_ONLY` during English review. No permanent QL allocation, localization freeze, Question Bank admission, test/mock eligibility, or public publication is enabled until the English package is explicitly approved.