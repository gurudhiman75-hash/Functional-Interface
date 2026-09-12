# Logic Puzzles — Post-LP-010 Chapter Closure and Gap Audit V2

Status: **closure still open; `LP-QL-001..040` remain the only permanent allocations. Candidate identities below are provisional until explicit English approval and permanent freeze.**

This V2 audit reconciles all currently active Logic Puzzle gap work. It corrects the earlier narrow assumption that only a new solver family can justify a new QL. In ExamTree, a permanent QL is also an answer/query contract; a genuinely different source-backed projection may justify a QL while safely reusing an already approved hidden-state solver.

## 1. Frozen permanent surface

| Package | Permanent QLs | Primary ownership |
|---|---:|---|
| `LP-001` | `LP-QL-001..004` | assignment and grouping |
| `LP-002` | `LP-QL-005..008` | day + location multi-attribute assignment |
| `LP-003` | `LP-QL-009..012` | box / stack ordered arrangement |
| `LP-004` | `LP-QL-013..016` | selection and conditional committees |
| `LP-005` | `LP-QL-017..020` | person + duty + location matching |
| `LP-006` | `LP-QL-021..024` | day + study-area + city synthesis |
| `LP-007` | `LP-QL-025..028` | variable / preference assignment |
| `LP-008` | `LP-QL-029..032` | month + date scheduling |
| `LP-009` | `LP-QL-033..036` | one-axis ordered month/year scheduling |
| `LP-010` | `LP-QL-037..040` | day + time scheduling |

`LP-QL-041` is the first free permanent identity. Nothing in this audit allocates it permanently.

## 2. Taxonomy boundaries outside Logic Puzzles

Reference books often print adjacent families inside one puzzle chapter, but Reasoning V1 ownership follows the primary tested inference:

- floor / flat arrangements → `REAS-FLR`;
- seating arrangements → seating chapters;
- blood relations → `REAS-BLR`;
- ranking / order → ranking chapter;
- overlapping membership / Venn-style classification → set/Venn reasoning when membership itself is the target;
- input-output and games/tournament → their dedicated chapters.

Source presence alone therefore does not justify adding a Logic Puzzle package.

## 3. Reconciled source-backed gaps

Three pieces of work are now distinct and non-overlapping.

### A. LP-009 DAY mode — existing QLs 033–036

The uploaded puzzle source contains ordinary one-person-per-day schedules across Monday–Saturday. This is the same ordered-axis hidden-state and query contract already frozen for LP-009 month/year scheduling.

Decision: **reuse `LP-QL-033..036`; no new QL.**

Existing review implementation: PR `#1587`, `feature/lp009-day-scheduling-v2`.

The one-unused-day / six-entities-in-seven-days variant remains a discovery hold because it changes state cardinality and must not be silently folded into the six-by-six form.

### B. LP-011 Box + Attribute — provisional QLs 041–044

The uploaded source also contains a structurally different family: labelled boxes in a vertical stack plus an independent one-to-one attribute attached to each box. This is more than LP-003 wording variation because the hidden state has two linked axes: position↔box and box↔attribute.

Existing review implementation: PR `#1590`, `feature/logic-puzzles-lp011-box-attribute-v1`.

Its current provisional identities are:

| Candidate | Authority |
|---|---|
| `LP-QL-041` | `BOX_TO_ATTRIBUTE_LOOKUP` |
| `LP-QL-042` | `ATTRIBUTE_TO_BOX_LOOKUP` |
| `LP-QL-043` | `ATTRIBUTE_TO_POSITION_LOOKUP` |
| `LP-QL-044` | `BOX_ATTRIBUTE_POSITION_MATCH` |

These identities are **provisional, not permanent**. They get first claim only because LP-011 is the distinct new structural family already implemented and review-ready.

### C. LP-006 cross-attribute projections — provisional QLs 045–046

LP-006 already solves a four-column one-to-one state: Person, Day, Study area and City. Its frozen QLs 021–024 currently test only person→attribute lookups and the complete row match.

The uploaded source contains additional exam-real question projections over such multi-attribute tables:

- one non-person attribute → a different attribute;
- one non-person attribute → person;
- choose the uniquely correct statement;
- choose the uniquely incorrect statement.

These are different answer contracts and distractor semantics, but **not** a new hidden-state family. Therefore they belong as a versioned LP-006 projection layer rather than another duplicate package.

Reconciled provisional identities:

| Candidate | Authority | Scope |
|---|---|---|
| `LP-QL-045` | `CROSS_ATTRIBUTE_PROJECTION_LOOKUP` | given a non-person value in one column, identify its linked person or value in another column |
| `LP-QL-046` | `STATEMENT_TRUTH_SELECTION` | choose the uniquely correct or uniquely incorrect statement about the solved multi-attribute table |

The prototype must preserve LP-006's approved setup, clue set, assignment, difficulty and existing QLs 021–024 exactly.

## 4. Why LP-006 projections are not part of LP-011

LP-011 changes the hidden state itself by combining stack position, box identity and an attribute. LP-006 projection V1 does not change hidden state at all; it merely asks new questions over an already approved multi-attribute row table.

Keeping them separate prevents solver duplication and keeps QL ownership semantic:

- LP-011 = new **box-position-attribute arrangement family**;
- LP-006 V2 = new **query projections over existing multi-attribute assignment**.

## 5. Determinability / `Cannot be determined`

The source also contains questions whose intended answer is `Cannot be determined` / `Data inadequate`. These are real exam forms, but the current Reasoning V1 arrangement contract requires a uniquely solved hidden state before child questions are emitted.

Decision: **quarantine these forms.** They must not be introduced by weakening uniqueness. A future implementation would need an explicit governed partial-state contract proving that underdetermination is intentional rather than a generator defect.

## 6. Review and allocation order

1. Human-review LP-009 DAY V2. If approved, extend LP-009 using the existing permanent QLs 033–036.
2. Human-review LP-011 Box + Attribute. If approved, allocate provisional `LP-QL-041..044` permanently and then localize.
3. Human-review LP-006 projection extension. If approved, allocate provisional `LP-QL-045..046` permanently and then localize.
4. Re-run a full chapter closure/source-saturation audit after all three decisions.
5. Only then decide whether `LP-QL-047+` are justified.

## 7. Closure verdict

Logic Puzzles are **not yet source-saturated**.

The reconciled next surface is:

- LP-009 DAY mode — no new QLs;
- LP-011 Box + Attribute — provisional `LP-QL-041..044`;
- LP-006 cross-attribute projections — provisional `LP-QL-045..046`;
- intentional underdetermination — quarantined discovery only.

No candidate above is permanent until its own English review is explicitly approved.