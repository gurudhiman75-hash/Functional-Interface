# Logic Puzzles LP-001 → LP-010 — CP02 Target-Exam Crosswalk and QL Discovery

Status: **CP02 COMPLETE — production gate remains closed; two new high-value solve authorities discovered for implementation review.**

Date: 2026-09-12

## Purpose

This checkpoint compares the frozen Logic Puzzle chapter (`LP-001` through `LP-010`) against recurring SSC, Banking and Punjab-state reasoning puzzle families. The goal is not to add every wrapper seen on coaching sites. The goal is to distinguish:

1. puzzle families already owned by existing LP authorities;
2. forms owned by other Reasoning chapters;
3. stem/context variations that do not deserve new QLs;
4. genuinely different solve contracts that should become new permanent authorities only after implementation and review.

The current permanent registry `LP-QL-001..040` is preserved. Nothing in this audit reinterprets or renumbers frozen QLs.

## Evidence policy

Evidence is classified conservatively:

- **A — executable/source-backed:** existing uploaded reasoning references plus current LP generator/solver proofs;
- **B — repeated exam-analysis evidence:** recurring puzzle families reported across banking/SSC exam analyses and preparation records;
- **C — coaching/example evidence:** useful for discovering wrappers and edge cases, never sufficient by itself for permanent allocation.

Public banking exam analyses repeatedly report scheduling, box, tabular/variable, age, floor and mixed puzzle sets, often in five-question caselets. SSC sources show puzzles/distribution/scheduling as a smaller but recurring part of General Intelligence. Punjab-state evidence is weaker and is treated as SSC-like only for coverage planning, not as official provenance.

## Existing chapter crosswalk

| Exam-facing family | Existing owner | Disposition |
|---|---|---|
| assignment / grouping / distribution | `LP-001` | COVERED |
| person × day × ordered location | `LP-002` | COVERED |
| vertical box / stack arrangement | `LP-003` | COVERED |
| committee / subset selection with conditions | `LP-004` | COVERED, but conditional-clue depth remains a calibration item |
| person × attribute × place grid | `LP-005` | COVERED |
| three-attribute day/subject/city synthesis | `LP-006` | COVERED |
| variable / preference assignment | `LP-007` | COVERED |
| month × date scheduling | `LP-008` | COVERED |
| single-axis month / year scheduling | `LP-009` | COVERED |
| day × time scheduling | `LP-010` | COVERED |
| linear/circular/double-row seating | Seating Arrangement chapter | NOT AN LP GAP |
| floor/flat puzzles | Floor/Flat chapter | NOT AN LP GAP |
| pure order/rank by height, weight, marks, score | Ranking and Order chapter | NOT AN LP GAP |
| data-sufficiency wrapper around a puzzle | Data Sufficiency chapter | NOT AN LP GAP |
| blood-relation puzzle | Blood Relation chapter unless the relationship is merely one attribute inside a broader LP | NOT AN LP GAP by default |

## Exam-family assessment

### SSC / similar recruitment exams

The present LP chapter is structurally adequate for the compact distribution, scheduling and assignment puzzles typically expected in SSC-style reasoning. SSC does not require banking-scale puzzle density from every test, so production simulation should use LP questions at a lower frequency than Banking rather than inventing easier duplicate QLs.

Important SSC-facing strengths already present:

- complete standalone stems;
- small and medium assignment domains;
- simple direct + relational clue chains;
- distribution/grouping;
- vertical box order;
- committee selection;
- scheduling by day/month/date/time;
- direct and inverse lookup questions.

### Banking exams

Banking is the strongest stress target for this chapter. Repeated exam analyses show multiple puzzle/arrangement sets in the same paper, including scheduling, box, tabular/variable, floor, age and multi-layer forms. After excluding Seating and Floor/Flat because they have separate owners, LP-001→010 covers most recurring structural families.

The remaining weakness is **query/solve mode**, not basic scenario inventory. Existing LP packages overwhelmingly solve one uniquely determined final assignment and then project factual lookups from it. Banking puzzles also commonly test what is possible under the clue set or what follows after an extra temporary condition.

### Punjab-state exams

Current evidence is not strong enough to claim a Punjab-specific source-saturated puzzle profile. The safe production position is:

- reuse the proven SSC-style compact puzzle mix;
- keep language and contexts neutral/standard rather than injecting local place names;
- do not claim Punjab PYQ saturation until year-tagged papers are crosswalked;
- keep Punjab-specific weighting provisional.

This is an evidence gap, not a reason to add Punjab-branded QLs.

## QL discovery result

Two solve contracts are materially different from all current `LP-QL-001..040` authorities.

### Candidate A — POSSIBILITY-SET QUERY

Provisional identity: `LP-QL-041` only if implementation/review later approves it.

Representative learner questions:

- Which of the following **could be true**?
- Which of the following **cannot be true**?
- Which of the following **must be true**?
- Which of the following arrangements is possible?

Why this is not a stem variant:

The existing LP engine normally requires exactly one final hidden assignment. A possibility question requires retaining **multiple valid states** under the displayed clues and evaluating each option across that set.

Semantic contracts:

- `COULD_BE_TRUE(option)` → at least one valid state satisfies the option;
- `CANNOT_BE_TRUE(option)` → no valid state satisfies the option;
- `MUST_BE_TRUE(option)` → every valid state satisfies the option.

Required implementation change:

- do not force the parent clue set to a unique final assignment;
- enumerate the complete valid-state set independently;
- generate one and only one semantically correct MCQ option;
- explanation must show the decisive cases/possibilities rather than pretend a unique table existed.

Priority: **HIGH for Banking; useful edge coverage for SSC/Punjab.**

### Candidate B — COUNTERFACTUAL / ADDITIONAL-CONDITION QUERY

Provisional identity: `LP-QL-042` only if implementation/review later approves it.

Representative learner questions:

- If A is assigned to Tuesday, which of the following must be true?
- If B works in City X, who can be assigned to Subject Y?
- If C is placed immediately before D, which arrangement is possible?

Why this is not a stem variant:

The extra condition belongs to the **child question**, not the shared parent puzzle. Solving requires cloning the parent state, adding a temporary condition, re-solving, and then evaluating the child query. That is a distinct counterfactual solve pipeline.

Required implementation change:

- preserve the frozen parent clue set;
- add one validated temporary condition to the child;
- independently re-solve parent + temporary condition;
- require at least one valid state and exactly one correct option;
- explanation must clearly separate `Given puzzle` from `Additional condition` and show only deductions that follow after the temporary condition.

Priority: **HIGH for Banking; medium for SSC/Punjab.**

## Forms that do NOT currently justify new LP QLs

### Age-based puzzle

Banking analyses frequently label sets as age-based. That label alone does not define ownership.

- pure oldest/youngest or relative-order logic belongs to Ranking/Order or existing LP-009-style ordering;
- age arithmetic or difference equations introduce a Quant burden;
- a genuine multi-attribute age puzzle should be parameterized through an LP grid only if the age field behaves as an ordinary one-to-one attribute.

Decision: **OWNER AUDIT REQUIRED; do not allocate a new LP QL yet.**

### Comparison-based puzzle

Pure height/weight/marks/salary ordering is Ranking and Order. Multi-attribute matching that merely uses those values as labels can be represented by LP-005/006.

Decision: **NOT A NEW LP QL.**

### Designation / profession / city / colour wrappers

If the topology is still one-to-one multi-attribute matching, these are scenario/object-pool variants of LP-005/006/007.

Decision: **PARAMETERIZATION, NOT NEW QL.**

### Larger caselet sizes

Five versus six versus seven people does not by itself create a new semantic authority. Size should be expanded inside an existing QL only where solver cost, explanation readability and real-exam evidence justify it.

Decision: **DEPTH/VARIETY CALIBRATION, NOT NEW QL.**

### Exactly/at-least/at-most conditional committee clauses

These belong inside LP-004 if they preserve subset-selection semantics. They may require a new clue family and harder topology but not necessarily a new child-query authority.

Decision: **LP-004 DEPTH AUDIT REQUIRED.**

## Coverage gaps to close without adding QLs

1. **LP-004 conditional depth:** verify `if`, `only if`, `either/or`, `exactly one`, `at least one`, `not together`, and quota-style conditions at real-exam difficulty.
2. **LP-005/006 multi-layer depth:** verify that Hard forms require linked deductions across attributes rather than merely more exclusions.
3. **Object/context rotation:** ensure professions, subjects, colours, products, departments, cities and neutral institutional contexts rotate without creating semantically identical stems.
4. **Question-stem rotation:** direct lookup, inverse lookup, correct combination, pair/triple match and ordered-position wording should remain varied but simple.
5. **Caselet density:** Banking simulation should permit multiple LP/arrangement sets per paper, while SSC/Punjab should use lower frequencies. This belongs to exam-profile weighting rather than QL creation.
6. **Punjab provenance:** obtain year-tagged Punjab papers before claiming local source saturation.

## Difficulty audit conclusion

Current LP difficulty design is structurally sound where calibrated:

- Easy = more direct anchors / shorter chain;
- Medium = mixed direct + relational deductions;
- Hard = fewer direct anchors + layered relations/exclusions/cases.

A production audit must reject any package where difficulty is produced merely through harder vocabulary, larger arbitrary numbers, or a longer stem with the same deduction depth.

For Candidate A/B, difficulty must instead depend on valid-state count, branching depth, temporary-condition interaction and number of deductions needed to distinguish options.

## Production-readiness decision after CP02

**DO NOT OPEN PRODUCTION YET.**

Reason:

1. two high-value solve modes are absent from the frozen LP registry;
2. LP-004 conditional depth still needs explicit proof;
3. Punjab source-year provenance remains incomplete;
4. exam-profile frequency/weighting has not yet been bound to the chapter.

At the same time, CP02 finds **no reason to redesign LP-001..010 wholesale**. Their core scenario/family coverage is broad and well-separated. Most remaining work is targeted.

## Next checkpoint — CP03

Implement a review-only experimental authority for **Possibility-Set Queries** without touching frozen `LP-QL-001..040`.

CP03 must:

1. use one or more existing frozen puzzle topologies as the parent state model;
2. intentionally retain multiple valid assignments after the displayed clue set;
3. independently enumerate all valid states;
4. generate `could be true`, `cannot be true`, and `must be true` children;
5. guarantee exactly one semantically correct option;
6. produce beginner-friendly case/possibility explanations;
7. remain unallocated and `REVIEW_ONLY` until human review;
8. reserve no permanent QL number until approval.

After CP03 review, implement the counterfactual child-query authority as CP04.