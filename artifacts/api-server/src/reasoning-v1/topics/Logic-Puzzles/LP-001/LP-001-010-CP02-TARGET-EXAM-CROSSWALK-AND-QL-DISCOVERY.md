# Logic Puzzles LP-001 → LP-010 — CP02 Target-Exam Crosswalk and QL Discovery

Status: **CP02 RECONCILED — production gate remains closed; existing post-LP-010 candidates recovered and one additional partial-state solve surface moved into CP03.**

Date: 2026-09-12

## Purpose

This checkpoint compares the frozen Logic Puzzle chapter (`LP-001` through `LP-010`) against recurring SSC, Banking and Punjab-state puzzle families and reconciles that comparison with **all existing open Logic Puzzle gap work in the repository**.

The permanent registry remains exactly `LP-QL-001..040`. No candidate in this document is permanent.

## Evidence and ownership policy

A new QL is justified only when the source-backed answer/query contract or hidden-state contract is genuinely different. Context labels, larger entity counts and alternate wording do not create QLs by themselves.

Adjacent reasoning families remain outside Logic Puzzles when their primary inference already has a dedicated owner:

- linear/circular/double-row seating → Seating Arrangement;
- floor/flat → Floor/Flat Arrangement;
- pure height/weight/marks/score ordering → Ranking and Order;
- data-sufficiency wrappers → Data Sufficiency;
- blood relation as the primary task → Blood Relation.

## Frozen core coverage

| Exam-facing family | Current owner | Status |
|---|---|---|
| assignment / grouping / distribution | `LP-001` | COVERED |
| person × day × ordered location | `LP-002` | COVERED |
| pure vertical box / stack | `LP-003` | COVERED |
| committee / subset selection | `LP-004` | COVERED; conditional-depth audit still required |
| person × attribute × place grid | `LP-005` | COVERED |
| day × study-area × city synthesis | `LP-006` | COVERED; projection extension pending review |
| variable / preference assignment | `LP-007` | COVERED |
| month × date scheduling | `LP-008` | COVERED |
| ordered month / year scheduling | `LP-009` | COVERED |
| day × time scheduling | `LP-010` | COVERED |

Banking remains the strongest stress target because it uses multiple puzzle/arrangement sets and broader query forms. SSC/Punjab generally require a lower puzzle frequency; that should be handled by exam-profile weighting rather than duplicate easy QLs. Punjab year-tagged provenance remains insufficient for a source-saturation claim.

## Recovered existing post-LP-010 work

A previous chapter-closure effort already identified three non-overlapping surfaces. They must be reconciled before assigning numbers to any newly discovered candidate.

### A. LP-009 DAY mode — existing QLs 033–036

Pure one-person-per-day Monday–Saturday scheduling is the same ordered-axis solve/query contract as LP-009 month/year scheduling.

Decision: **reuse permanent `LP-QL-033..036`; no new QL.**

Existing review branch/PR: `feature/lp009-day-scheduling-v2` / PR #1587.

The six-entities-in-seven-days / one-unused-day variant remains a separate discovery question because state cardinality differs.

### B. LP-011 Box + Attribute — provisional 041–044

Existing review branch/PR: `feature/logic-puzzles-lp011-box-attribute-v1` / PR #1590.

LP-011 is structurally different from LP-003. It combines:

- vertical position ↔ box identity; and
- box identity ↔ one independent attribute.

Existing provisional identities:

| Candidate | Contract |
|---|---|
| `LP-QL-041` | `BOX_TO_ATTRIBUTE_LOOKUP` |
| `LP-QL-042` | `ATTRIBUTE_TO_BOX_LOOKUP` |
| `LP-QL-043` | `ATTRIBUTE_TO_POSITION_LOOKUP` |
| `LP-QL-044` | `BOX_ATTRIBUTE_POSITION_MATCH` |

These numbers have **first provisional claim only**. They are not permanent because LP-011 has not completed the current English approval/freeze path and its branch is substantially behind `New-main`.

### C. LP-006 cross-attribute projections — provisional 045–046

Existing chapter-closure branch/PR: `audit/logic-puzzles-chapter-closure-v2` / PR #1593.

The frozen LP-006 state already contains Person, Day, Study Area and City, but QLs 021–024 do not exhaust source-real projections across those columns.

Existing provisional identities:

| Candidate | Contract |
|---|---|
| `LP-QL-045` | `CROSS_ATTRIBUTE_PROJECTION_LOOKUP` |
| `LP-QL-046` | `STATEMENT_TRUTH_SELECTION` |

These are query-layer extensions over the existing LP-006 hidden state, not a new puzzle family. They remain provisional/review-only.

## Newly advanced surface — partial-state possibility queries

The previous closure audit explicitly quarantined intentionally underdetermined forms because the existing arrangement architecture required one unique final hidden state. CP02 confirms that this quarantine hides a real exam-facing solve contract:

- Which option **could be true**?
- Which option **cannot be true**?
- Which option **must be true**?
- Which arrangement is possible?

This cannot be represented honestly by forcing the parent puzzle to one final arrangement. The correct semantic object is the **complete valid-state set** after the displayed clues.

Decision: **implement experimentally in CP03, but keep it completely unnumbered.** It must not claim `LP-QL-041` or any later number while LP-011 and LP-006 candidates are unresolved.

Semantic contract:

- `COULD_BE_TRUE(option)` → at least one valid state satisfies it;
- `CANNOT_BE_TRUE(option)` → no valid state satisfies it;
- `MUST_BE_TRUE(option)` → every valid state satisfies it.

CP03 therefore becomes the governed partial-state implementation that the older closure audit intentionally deferred.

## Additional-condition / counterfactual query

A second genuine solve surface remains after CP03:

- “If A is assigned to Tuesday, which must be true?”
- “If B is in City X, who can be assigned to Y?”
- “If C is immediately before D, which arrangement is possible?”

The extra condition belongs to the child question, so the engine must clone the parent state, add the temporary condition, independently re-solve, and then evaluate the child options.

Decision: **CP04 candidate; unnumbered until all earlier provisional identities are reconciled.**

## Forms that do not currently justify new LP QLs

- **Age-based puzzle:** owner audit first; pure ordering belongs Ranking/Order, arithmetic belongs Quant, ordinary one-to-one age labels may be an LP parameter.
- **Comparison-based puzzle:** pure comparison belongs Ranking/Order.
- **Profession/designation/city/colour wrappers:** parameterization of existing multi-attribute authorities.
- **Larger caselet sizes:** depth/variety calibration, not a semantic identity by itself.
- **Exactly/at-least/at-most committee conditions:** extend LP-004 clue depth unless they change the child-query contract.

## Remaining depth/evidence gaps

1. LP-004: explicitly prove `if`, `only if`, either/or, exactly one, at least one, not together and quota-style conditions.
2. LP-005/006: verify Hard forms require linked cross-attribute deductions, not merely more exclusions.
3. LP-009 DAY: resolve current review branch and decide whether one-unused-day scheduling needs a distinct state contract.
4. LP-011: rebase/review the box+attribute candidate against current frozen conventions.
5. LP-006 projections: review the existing 045/046 candidate rather than duplicating it.
6. Punjab: obtain year-tagged papers before claiming local source saturation.
7. Exam-profile weighting: Banking may use multiple puzzle sets; SSC/Punjab should use lower frequencies.

## Production-readiness decision

**DO NOT OPEN PRODUCTION YET.**

The chapter core is strong and does not need wholesale redesign, but closure is still open because:

- three pre-existing post-LP-010 review surfaces remain unresolved;
- the intentionally underdetermined possibility contract is only now being implemented under CP03;
- the counterfactual/additional-condition contract remains pending;
- LP-004 conditional depth and Punjab provenance remain incomplete.

## Next checkpoint — CP03

Implement the possibility-set authority as an **unnumbered, review-only** candidate using an existing frozen topology. It must:

1. retain multiple valid states intentionally;
2. enumerate the complete valid-state set independently;
3. generate `could`, `cannot`, and `must` children;
4. prove exactly one semantic answer per MCQ;
5. show learner-friendly possibilities/cases rather than pretending a unique final table exists;
6. vary branching width rather than producing one repeated state count;
7. remain outside the permanent QL registry and outside Question Studio production routes until explicit review approval.

After CP03 review, CP04 should implement the unnumbered counterfactual/additional-condition query contract.