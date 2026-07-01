# PCT-CONTENT-001 Audit

## Scope

Audited active Percentage chapter assets for PCT-001 through PCT-005, focusing on canonical problem coverage, English stem richness, explanation asset depth, variable-range authority, coverage targets, distribution targets, runtime context surfacing, and duplicate pressure.

## Method

This audit distinguishes between:

- raw QL count: literal stem families declared in question-language.en.json;
- effective QL count: materially distinct English families after collapsing duplicates, wrapper clones, and near-clones;
- runtime context surface: contexts actually supplied by the active chapter assets and deterministic scenario builders.

Important findings used in this report:

- PCT-001 has 350 raw QLs, but boilerplate-normalized clustering collapses it to 130 upper-bound families, with 150 explicit wrapper rows and 106 exact-duplicate rows.
- PCT-002 through PCT-005 each declare 20 raw QLs, but almost every chapter is effectively built as 10 CP shells plus one thin companion shell per CP.
- PCT-002 through PCT-005 explanation assets are structurally thin: explanation.en.json mostly provides one explanation ID per CP rather than rich, family-level educational variation.

## 1. Chapter Scorecards

| Chapter | CP Count | Raw QL Count | ES Count | QLs / CP | ES / CP | Effective QL Count | Context Diversity | Structure Diversity | Answer Diversity | Duplicate Pressure | Richness Score |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| PCT-001 | 6 | 350 | 6 | 58.3 | 1.0 | 90 | 26 | 12 | 8 | HIGH | 74 |
| PCT-002 | 10 | 20 | 10 | 2.0 | 1.0 | 15 | 16 | 8 | 6 | HIGH | 62 |
| PCT-003 | 10 | 20 | 10 | 2.0 | 1.0 | 12 | 10 | 8 | 7 | VERY HIGH | 54 |
| PCT-004 | 10 | 20 | 10 | 2.0 | 1.0 | 12 | 10 | 8 | 7 | VERY HIGH | 53 |
| PCT-005 | 10 | 20 | 10 | 2.0 | 1.0 | 11 | 7 | 8 | 6 | CRITICAL | 48 |

### How the richness score was calculated

Each chapter was scored on a 100-point scale using five weighted dimensions:

- CP diversity: 20
- context diversity: 20
- structure diversity: 20
- answer archetype diversity: 15
- duplication resistance: 25

Breakdown:

- PCT-001: CP 14/20, context 18/20, structure 16/20, answer 12/15, duplication 14/25 = 74/100
- PCT-002: CP 18/20, context 12/20, structure 13/20, answer 11/15, duplication 8/25 = 62/100
- PCT-003: CP 18/20, context 8/20, structure 12/20, answer 12/15, duplication 4/25 = 54/100
- PCT-004: CP 18/20, context 8/20, structure 12/20, answer 12/15, duplication 3/25 = 53/100
- PCT-005: CP 18/20, context 6/20, structure 12/20, answer 10/15, duplication 2/25 = 48/100

## 2. Canonical Problem Coverage

All five chapters are mathematically complete at the declared CP level, but the density of QLs per CP is extremely uneven.

- PCT-001: PCT-CP-001:120, PCT-CP-002:50, PCT-CP-003:40, PCT-CP-004:40, PCT-CP-005:60, PCT-CP-006:40
- PCT-002: PCT-CP-001:2, PCT-CP-002:2, PCT-CP-003:2, PCT-CP-004:2, PCT-CP-005:2, PCT-CP-006:2, PCT-CP-007:2, PCT-CP-008:2, PCT-CP-009:2, PCT-CP-010:2
- PCT-003: PCT-CP-001:2, PCT-CP-002:2, PCT-CP-003:2, PCT-CP-004:2, PCT-CP-005:2, PCT-CP-006:2, PCT-CP-007:2, PCT-CP-008:2, PCT-CP-009:2, PCT-CP-010:2
- PCT-004: PCT-CP-001:2, PCT-CP-002:2, PCT-CP-003:2, PCT-CP-004:2, PCT-CP-005:2, PCT-CP-006:2, PCT-CP-007:2, PCT-CP-008:2, PCT-CP-009:2, PCT-CP-010:2
- PCT-005: PCT-CP-001:2, PCT-CP-002:2, PCT-CP-003:2, PCT-CP-004:2, PCT-CP-005:2, PCT-CP-006:2, PCT-CP-007:2, PCT-CP-008:2, PCT-CP-009:2, PCT-CP-010:2

Interpretation:

- PCT-001 is broad but inflated. It has many task families, but much of the raw count comes from wrappers, repeated paraphrase, and exact duplicates.
- PCT-002 through PCT-005 are clean and balanced structurally, but each CP is only represented by two shells, which is far below mature SSC/Banking content density.

## 3. Stem Family Audit

### PCT-001

- Strongest asset base by raw volume.
- Weakness: volume is overstated by wrappers (competitive exam setup, If the following conditions hold, Based on given parameters).
- percentOf, valueAsPercent, and reversePercent are the only major groups where context changes produce meaningful educational variation.
- Many other task kinds are effectively one family repeated 5 times.

### PCT-002

- No raw duplicate rows, but most CPs are represented by one count shell and one money/category shell.
- Educationally, that is closer to 10-15 effective families than 20.

### PCT-003

- Architecturally neat.
- Content-richness weak. Most second QLs are only money/count wrappers.
- The chapter needs contextual and structural enrichment much more than new mathematics.

### PCT-004

- Mirrors PCT-003 closely.
- Shares the same richness problem.
- One additional sign of thinness: QL-005 and QL-006 are exact duplicates after value-surface normalization.

### PCT-005

- Mathematically strong and well qualified.
- Educationally the thinnest chapter: too many stems collapse into generic `{wholeLabel}` shells plus `rate1/rate2/final/net` phrasing.
- Runtime duplicate rate around 80.5% confirms that the stem layer is underpowered.

## 4. Context Diversity Audit

### Context heatmap

| Chapter | Real context surface | Missing major contexts |
| --- | --- | --- |
| PCT-001 | election/voters, marks, village literacy, income/salary, discount/price, factory defects, students, mixtures, books, savings, trees, tanks, business, fruit, alloy, distance | bank balance, crop yield, electricity usage, warehouse stock, transport passengers, internet users |
| PCT-002 | students, girls/boys, monthly income/savings, salary/rent/books, food/transport budgets, population/children, education | school enrollment, warehouse stock, voter share, crop distribution, transport passengers |
| PCT-003 | salary, population, production, price, students, workers | bonus, commission, inventory, website traffic, bus passengers, milk production |
| PCT-004 | salary, population, production, inventory, attendance, expenditure, students, workers | depreciation, stock clearance, crop loss, rainfall, machine downtime, absenteeism |
| PCT-005 | value, salary, population, production, attendance, sales | inventory, revenue, admissions, turnout, warehouse stock, market price swings |

Interpretation:

- PCT-001 already spans many exam-like objects, even though many are shallowly expressed.
- PCT-002 is conceptually varied but context-limited.
- PCT-003 and PCT-004 rely heavily on salary/population/production.
- PCT-005 is the most context-constrained chapter by far.

## 5. Structural Diversity Audit

| Chapter | Real structures present | Structural note |
| --- | ---: | --- |
| PCT-001 | 12 | direct calculation, conversion, reverse recovery, successive change, geometry, invariance, partition, election, mixture/composition |
| PCT-002 | 8 | recovery, mapping, share conversion, complement, difference, partition, missing share, multi-category distribution |
| PCT-003 | 8 | direct, amount-only, reverse, multiplier, repeated increase, net increase, comparative, part-composition, bridge |
| PCT-004 | 8 | direct, amount-only, reverse, multiplier, repeated decrease, net decrease, comparative, component-wise, bridge |
| PCT-005 | 8 | same-sign successive, mixed successive, net change, multiplier, reverse recovery, comparative sequence, multi-stage chain, contextual chain |

Missing structures across the domain:

- table-style prompts
- timeline-style prompts
- memo/ledger style prompts
- before/after comparison blocks
- mixed-data story prompts
- two-clue reconstruction prompts

## 6. Answer Archetype Audit

| Chapter | Coverage summary |
| --- | --- |
| PCT-001 | Final value, recovery value, percentage share, conversion output, difference/comparison, count recovery, compositional recovery |
| PCT-002 | Recovery value, percentage share, difference/comparison, partition output, count/amount extraction |
| PCT-003 | Final value, increase amount, recovery value, multiplier, net percentage change, comparison |
| PCT-004 | Final value, decrease amount, recovery value, multiplier, net percentage change, comparison |
| PCT-005 | Final value, recovery value, multiplier, net percentage change, comparison, staged sequence output |

The shallowest answer spread is in PCT-005, because many CPs still resolve to find final/net/original with only light surface differentiation.

## 7. Weakest and Strongest CPs

### Weakest CPs

| Chapter | CP | Why it is weak |
| --- | --- | --- |
| PCT-001 | PCT-CP-002 | Reverse/restore cluster has many wrapper clones and limited contextual spread. |
| PCT-001 | PCT-CP-004 | Invariance families are mathematically useful but surface diversity is thin. |
| PCT-002 | PCT-CP-005 | Ratio-to-percentage has only two close shells. |
| PCT-002 | PCT-CP-009 | Missing-percentage prompts are nearly the same sentence twice. |
| PCT-003 | PCT-CP-004 | Multiplier questions are extremely thin in surface variation. |
| PCT-003 | PCT-CP-006 | Net-increase wording collapses to one shell. |
| PCT-003 | PCT-CP-009 | Required-increase uses almost no contextual narrative. |
| PCT-004 | PCT-CP-004 | Decrease multiplier is almost pure notation with little educational surface. |
| PCT-004 | PCT-CP-006 | Net-decrease prompts are near-clones. |
| PCT-004 | PCT-CP-009 | Required decrease is target-setting with almost no narrative spread. |
| PCT-005 | PCT-CP-005 | Net change families collapse into the same two-sentence shell. |
| PCT-005 | PCT-CP-006 | Equivalent multiplier has almost no contextual embodiment. |
| PCT-005 | PCT-CP-007 | Reverse successive change is mathematically good but context-poor. |

### Strongest CPs

| Chapter | CP | Why it is stronger |
| --- | --- | --- |
| PCT-001 | PCT-CP-001 | Broadest context surface and strongest answer-form spread. |
| PCT-001 | PCT-CP-005 | Best distribution/election/story variety inside the chapter. |
| PCT-002 | PCT-CP-001 | Count and money recovery both feel natural. |
| PCT-002 | PCT-CP-010 | Best multi-category surface in the chapter. |
| PCT-003 | PCT-CP-008 | Part-composition change introduces a genuine multi-part structure. |
| PCT-003 | PCT-CP-010 | Bridge problems add time dimension and period-based reasoning. |
| PCT-004 | PCT-CP-008 | Component-wise decrease adds genuine composition reasoning. |
| PCT-004 | PCT-CP-010 | Bridge contexts introduce periods and realistic decline scenarios. |
| PCT-005 | PCT-CP-009 | Three-stage and four-stage chains add real structure. |
| PCT-005 | PCT-CP-010 | Contextual chains are the best seed for future enrichment. |

## 8. Duplicate Pressure Ranking

From most content-constrained to least content-constrained:

1. PCT-005 - critical pressure; chapter is mathematically complete but stem-thin.
2. PCT-004 - very high pressure; content mirrors PCT-003 with slightly narrower context spread.
3. PCT-003 - very high pressure; clean architecture, low surface breadth.
4. PCT-002 - high pressure; good conceptual spread, weak stem depth.
5. PCT-001 - high pressure, but broad enough to remain the least constrained Percentage chapter.

## 9. Why duplicate rates are high

1. Wrapper inflation
   - Especially in PCT-001, many rows differ only by boilerplate framing.

2. Two-shell architecture in PCT-002..005
   - Most CPs currently have exactly two QLs.
   - In practice, that often means one count shell and one money shell.

3. Generic `{wholeLabel}` overuse
   - PCT-003, PCT-004, and especially PCT-005 are structurally neat but linguistically under-specified.

4. Thin explanation assets in newer chapters
   - Newer chapters route through explanation IDs rather than rich, family-level educational variation.

5. Weak structural branching
   - Very few table, timeline, multi-clue, or comparative story structures currently exist.

## 10. Final Recommendations

### Current effective families vs mature target

| Chapter | Current Effective Families | Target Effective Families | Gap |
| --- | ---: | ---: | ---: |
| PCT-001 | 90 | 140 | 50 |
| PCT-002 | 15 | 60 | 45 |
| PCT-003 | 12 | 55 | 43 |
| PCT-004 | 12 | 55 | 43 |
| PCT-005 | 11 | 65 | 54 |

### Expansion roadmap

| Priority | Chapter | Why next |
| ---: | --- | --- |
| 1 | PCT-005 | Lowest effective family count, weakest context surface, and already observed 80.5% runtime duplicate rate. |
| 2 | PCT-003 + PCT-004 | Same chapter skeleton, same enrichment needs, and can share context/structure expansion patterns. |
| 3 | PCT-002 | Conceptually broad but still too thin at the stem layer; needs table and category-distribution growth. |
| 4 | PCT-001 | Richest current chapter, but should be rationalized before expansion so new work is not piled onto wrapper duplication. |

### Recommended enrichment direction by chapter

#### PCT-001

- New contexts: bank balance, crop yield, electricity usage, warehouse stock, transport passengers, internet users
- New structures: table style, before/after comparison table, mixed-data story, two-clue reconstruction
- New answer archetypes: target percentage from two clues, ranking/comparison output

#### PCT-002

- New contexts: school enrollment, warehouse stock, voter share, crop distribution, transport passengers
- New structures: table style, ledger/budget table, category chart description, reverse multi-category
- New answer archetypes: largest share, smallest share, comparison between category shares

#### PCT-003

- New contexts: bonus, commission, inventory, website traffic, bus passengers, milk production
- New structures: before/after table, target-vs-achieved memo, two-year story, price-list comparison
- New answer archetypes: increase amount vs final value comparison, best/worst performer comparison

#### PCT-004

- New contexts: depreciation, stock clearance, crop loss, rainfall, machine downtime, absenteeism
- New structures: before/after table, decline memo, monthly attrition log, reverse-decrease story
- New answer archetypes: loss amount comparison, remaining-vs-lost dual answer

#### PCT-005

- New contexts: inventory, revenue, admissions, turnout, warehouse stock, market price swings
- New structures: timeline table, compare-two-sequences, net-vs-final dual ask, story-style mixed change
- New answer archetypes: best sequence comparison, target net change, recover one missing stage


## Conclusion

The Percentage domain is mathematically healthier than it is content-rich.

- PCT-001 already has breadth, but needs de-duplication discipline.
- PCT-002 is conceptually solid but still too thin for a mature bank.
- PCT-003 and PCT-004 need parallel enrichment.
- PCT-005 is the highest-priority chapter for stem diversification before any PCT-006 work.

The next sensible move is content enrichment, not new chapter creation.
