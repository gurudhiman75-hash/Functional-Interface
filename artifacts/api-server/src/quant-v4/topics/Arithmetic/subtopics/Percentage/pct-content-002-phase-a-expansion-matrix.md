# PCT-CONTENT-002 Phase A Expansion Matrix

## Status

Phase A planning artifact only.

Do not modify `question-language.en.json`, task registries, parameter generators, solvers, validators, explanations, or multilingual assets until this matrix is reviewed and approved.

## Frozen Roadmap

1. PCT-CONTENT-002 — English content expansion, matrix-first, CP-by-CP.
2. PCT-CONTENT-003 — post-expansion audit and quality repair.
3. PCT-006 — next Percentage chapter.
4. PCT-007 — final Percentage chapter.
5. Hindi layer — human-authored only.
6. Punjabi layer — human-authored only.
7. Educational enrichment — fraction shortcuts, multiplier shortcuts, common mistakes, alternative methods, exam notes.

No additional platform infrastructure should be added before the Percentage domain is complete and content-rich, unless a blocking runtime issue prevents this roadmap.

## Acceptance Criteria

The target is not raw QL count.

- Raw QLs: whatever is necessary to achieve coverage.
- Effective educational families: minimum 35 per chapter, target 40.
- Every new family must be a genuinely different educational situation, not a noun swap.
- New English QLs may be English-only during Stage 1.
- Hindi and Punjabi must remain human-authored later; do not machine-fill them.
- English generation should use all English QLs.
- Hindi/Punjabi generation should use only the shared subset until Stage 5.

## Absolute Quality Gate

### Phase A — Planning

1. Analyse existing content.
2. Produce one CP-level expansion matrix per chapter.
3. Identify missing structures, contexts, answer archetypes, and distractor opportunities.
4. Stop for review.

### Phase B — Implementation, only after approval

1. Implement exactly the approved matrix.
2. Expand `question-language.en.json` only.
3. Update registries only when a new QL requires a task-kind mapping.
4. Add parameter-generation support only when a new educational situation needs different contextual variables.
5. Preserve solver, validator, reasoning graph, and explanations.

## English-only Activation Requirement

Current common-language selection can block English expansion because new English QLs will not yet exist in Hindi/Punjabi.

Required runtime behavior for Stage 1:

```text
English generation
↓
All English QLs
```

```text
Hindi generation
↓
Only shared en/hi/pa QL subset

Punjabi generation
↓
Only shared en/hi/pa QL subset
```

Cross-language parity tests should continue to run on the shared subset only until Stage 5.

---

# Chapter Summary

| Chapter | Current raw QLs | Current effective families | Stage 1 target | Phase A decision |
| --- | ---: | ---: | ---: | --- |
| PCT-001 | 350 | ~90 | Already above 40, but duplicate-heavy | Rationalize and add only targeted gap-fill families where CP balance is weak. |
| PCT-002 | 20 | ~15 | 35–40 | Add about 25 effective families, CP-balanced. |
| PCT-003 | 20 | ~12 | 35–40 | Add about 28 effective families, CP-balanced. |
| PCT-004 | 20 | ~12 | 35–40 | Add about 28 effective families, CP-balanced. |
| PCT-005 | 20 | ~11 | 35–40 | Highest priority; add about 30 effective families, CP-balanced. |

---

# PCT-001 — Foundational Percentage

PCT-001 is already broad by raw count, but wrapper inflation and duplicate pressure are high. Stage 1 should avoid adding volume blindly. It should classify effective families, remove mental dependence on wrapper clones, and add only targeted missing educational situations.

## PCT-001 / PCT-CP-001 — Foundational Conversions & Comparisons

Existing:

- Structures: direct percent-of, fraction conversion, value-as-percent, simple comparison, exam marks, election share, salary/savings, article discount.
- Contexts: voters, marks, village literacy, income, price/discount, factory output, students, mixture, books, fruit, alloy, library, garden, tank, business.
- Answer archetypes: absolute amount, fraction, percentage share, comparison.
- Current issue: strong raw coverage but many repeated percent-of shells.

Missing:

- Structures: table-based percent-of, before/after data row, two-source report, ranked comparison, invoice line item.
- Contexts: electricity usage, warehouse stock, internet users, transport passengers, crop yield, hospital patients.
- Distractor opportunities: base confusion, part/whole reversal, percent vs fraction output confusion.

Planned new effective families: 4–6 targeted gap-fill only.

## PCT-001 / PCT-CP-002 — Dynamic Change & Reverse Reasoning

Existing:

- Structures: increase/decrease new value, reverse increase, reverse decrease, amount of change.
- Contexts: price, salary, population, production, expenditure.
- Answer archetypes: final value, original value, increase/decrease amount, required restore percentage.
- Current issue: many wrapper clones and limited situational variety.

Missing:

- Structures: price revision notice, stock correction memo, before/after table, annual report, target recovery story.
- Contexts: electricity bill, warehouse inventory, bus ridership, crop harvest, website traffic, bank balance.
- Distractor opportunities: applying percentage on final instead of original, adding/subtracting amount from wrong base.

Planned new effective families: 6–8, prioritizing reverse and restore situations.

## PCT-001 / PCT-CP-003 — Successive Changes & Compound Growth

Existing:

- Structures: successive increase/decrease, compound growth/decay, area change.
- Contexts: population, price, attendance, production, geometry.
- Answer archetypes: net percentage, final value, area percentage change.
- Current issue: structurally useful but repetitive in language.

Missing:

- Structures: timeline table, quarterly report, two-year population note, sequential price revision, growth/decline chart description.
- Contexts: website visits, subscriptions, rainfall, revenue, admissions, machine output.
- Distractor opportunities: simple addition of rates, wrong second base, sign-order confusion.

Planned new effective families: 5–7.

## PCT-001 / PCT-CP-004 — Product Invariance & Variations

Existing:

- Structures: price-consumption invariance, expenditure held constant, variation in one factor.
- Contexts: fuel, commodity price, consumption, expenditure.
- Answer archetypes: required consumption change, price compensation percentage.
- Current issue: mathematically important but thin surface variety.

Missing:

- Structures: household budget memo, factory input-consumption report, fuel usage table, procurement note, rationing story.
- Contexts: petrol, electricity units, raw material consumption, water usage, grain purchase, data plan usage.
- Distractor opportunities: direct vs inverse percentage, base switch, increase/decrease sign reversal.

Planned new effective families: 8–10; this is PCT-001's weakest CP.

## PCT-001 / PCT-CP-005 — Distributional Analysis

Existing:

- Structures: income partition, marks/pass-fail, election votes, polling, remainder after shares.
- Contexts: income, expenses, marks, candidates, votes, population groups.
- Answer archetypes: remaining amount, winner/loser votes, pass marks, partition value.
- Current issue: good variety, but some election and budget shells repeat.

Missing:

- Structures: budget table, survey result table, polling report, school result summary, category ranking.
- Contexts: municipal budget, hospital beds, crop allocation, warehouse stock, railway passengers, employees.
- Distractor opportunities: remainder vs named share, percentage difference vs absolute difference, total voters vs valid votes.

Planned new effective families: 4–6 targeted gap-fill.

## PCT-001 / PCT-CP-006 — Compositional Proportions

Existing:

- Structures: mixture composition, water/dry matter, dilution, adding pure component, evaporation.
- Contexts: liquid mixtures, dry/fresh produce, water percentage.
- Answer archetypes: amount added, original quantity, final percentage.
- Current issue: good mathematical spread but context surface is narrow.

Missing:

- Structures: lab solution note, milk-water mix, warehouse moisture report, crop drying report, concentration table.
- Contexts: salt solution, acid solution, milk mixture, grain moisture, fruit drying, chemical concentration.
- Distractor opportunities: total changes while component stays constant, new component changes numerator and denominator.

Planned new effective families: 5–7.

PCT-001 implementation note: Do not chase raw volume. Build a PCT-001 effective-family classifier first, then add only the missing planned families.

---

# PCT-002 — Percentage Recovery, Share, and Distribution

Stage 1 target: 35–40 effective families. Current: about 15 effective families. Plan: 3–4 effective families per CP, with emphasis on table, survey, ledger, and distribution situations.

## PCT-002 / PCT-CP-001 — Whole from Part

Existing:

- Structures: direct recovery from part, money kept aside.
- Contexts: students/girls, income/savings.
- Answer archetypes: total count, total amount.

Missing:

- Structures: survey result, warehouse category report, attendance roll, government beneficiary count.
- Contexts: hospital patients, registered voters, crop sacks, railway passengers, website active users.
- Distractor opportunities: treating given part as whole, dividing by percentage instead of multiplier.

Planned new effective families: 3–4.

## PCT-002 / PCT-CP-002 — Another Percentage from Known Percentage

Existing:

- Structures: known percentage maps to value, find target percentage.
- Contexts: income, students.
- Answer archetypes: another amount/count on same base.

Missing:

- Structures: payroll report, inventory conversion, school enrollment sheet, budget allocation row.
- Contexts: employees, stock items, voters, rainfall collection, electricity usage.
- Distractor opportunities: using target rate on known value directly, wrong base reconstruction.

Planned new effective families: 3–4.

## PCT-002 / PCT-CP-003 — Percentage from Part and Whole

Existing:

- Structures: part out of whole, savings out of income.
- Contexts: students/girls, personal income.
- Answer archetypes: percentage share.

Missing:

- Structures: defect report, attendance register, crop loss statement, transport passenger report.
- Contexts: defective units, present students, spoiled grain, booked seats, paid invoices.
- Distractor opportunities: part/whole inversion, decimal-to-percent error.

Planned new effective families: 3–4.

## PCT-002 / PCT-CP-004 — Reverse Percentage Mapping

Existing:

- Structures: known percentage gives value, target value asks percent.
- Contexts: salary/rent/books, books/reference/story books.
- Answer archetypes: target percentage.

Missing:

- Structures: two-line report, ledger entry, table row, allocation memo.
- Contexts: electricity budget, warehouse dispatch, hospital admissions, election vote blocks.
- Distractor opportunities: using target value over known value, forgetting recovered whole.

Planned new effective families: 3–4.

## PCT-002 / PCT-CP-005 — Ratio to Percentage Conversion

Existing:

- Structures: two-part ratio, first/second part as percentage of whole.
- Contexts: generic quantity/parts.
- Answer archetypes: percentage share.
- Weakness: one of the thinnest CPs.

Missing:

- Structures: class boys:girls, budget split, land division, stock A:B, votes between two candidates.
- Contexts: students, expenses, farmland, warehouse stock, election votes, alloy components.
- Distractor opportunities: percentage of other part instead of whole, ratio order swap.

Planned new effective families: 4–5.

## PCT-002 / PCT-CP-006 — Complementary Percentage

Existing:

- Structures: known share, find remaining share.
- Contexts: class gender split, income savings/expenditure.
- Answer archetypes: complement percentage.

Missing:

- Structures: attendance absence report, battery usage remaining, budget spent/remaining, survey yes/no.
- Contexts: students, electricity consumption, warehouse sold/unsold, patients recovered/not recovered.
- Distractor opportunities: reporting known share instead of complement.

Planned new effective families: 3–4.

## PCT-002 / PCT-CP-007 — Difference Between Percentage Parts

Existing:

- Structures: two same-base categories, find percentage difference.
- Contexts: students, monthly budget.
- Answer archetypes: percentage-point difference.

Missing:

- Structures: poll result, production category comparison, hospital ward occupancy comparison, expenditure comparison table.
- Contexts: voters, product grades, bed occupancy, crop type shares, transport categories.
- Distractor opportunities: absolute difference vs percentage-point difference.

Planned new effective families: 3–4.

## PCT-002 / PCT-CP-008 — Percentage Partition

Existing:

- Structures: total divided into three percentage categories, find one category.
- Contexts: students, monthly expenses.
- Answer archetypes: count/amount extraction.

Missing:

- Structures: pie-chart description, department budget table, school enrollment category, stock category sheet.
- Contexts: employees by department, budget heads, warehouse items, crops, passengers by class.
- Distractor opportunities: using wrong category rate, ignoring total.

Planned new effective families: 3–4.

## PCT-002 / PCT-CP-009 — Missing Percentage

Existing:

- Structures: three known percentages, find remaining.
- Contexts: expenses, business budget.
- Answer archetypes: missing percentage.
- Weakness: near-identical prompts.

Missing:

- Structures: survey table with unreported category, election turnout breakdown, school result distribution, crop allocation report.
- Contexts: survey responses, voters, pass/fail/absent, crop use, hospital outcomes.
- Distractor opportunities: percentage sum error, interpreting missing as amount.

Planned new effective families: 4–5.

## PCT-002 / PCT-CP-010 — Multi-category Percentage Distribution

Existing:

- Structures: multi-category total distribution, remaining target category.
- Contexts: population, monthly expenses.
- Answer archetypes: amount/count for target category.

Missing:

- Structures: government report, inventory ledger, school annual data, transport passenger split.
- Contexts: district population, warehouse stock, school enrollment, bus/train passengers, hospital patients.
- Distractor opportunities: target remaining percentage vs named provided percentage, wrong total base.

Planned new effective families: 3–4.

---

# PCT-003 — Percentage Increase

Stage 1 target: 35–40 effective families. Current: about 12 effective families. Plan: 3–4 effective families per CP. Avoid money/count wrappers unless the structure changes.

## PCT-003 / PCT-CP-001 — Direct Percentage Increase

Existing:

- Structures: direct original-to-new increase.
- Contexts: salary, population.
- Answer archetypes: final value.

Missing:

- Structures: before/after table, government estimate, revised price list, annual report.
- Contexts: electricity consumption, website traffic, warehouse stock, bus passengers, crop yield.
- Distractor opportunities: increase amount vs final value, percentage on wrong base.

Planned new effective families: 3–4.

## PCT-003 / PCT-CP-002 — Increase Amount

Existing:

- Structures: find only increased part.
- Contexts: salary, production.
- Answer archetypes: increase amount only.

Missing:

- Structures: bonus calculation, commission statement, extra production report, added inventory note.
- Contexts: bonus, commission, milk production, factory output, seats added.
- Distractor opportunities: returning final value instead of increase amount.

Planned new effective families: 3–4.

## PCT-003 / PCT-CP-003 — Original Value from Increased Value

Existing:

- Structures: reverse increase, final known.
- Contexts: salary, population.
- Answer archetypes: original value.

Missing:

- Structures: last-year recovery, pre-revision price, original stock before addition, previous traffic count.
- Contexts: website users, inventory, railway passengers, rent, crop output.
- Distractor opportunities: subtracting given percentage from final, using final as base.

Planned new effective families: 3–4.

## PCT-003 / PCT-CP-004 — Equivalent Multiplier

Existing:

- Structures: abstract multiplier for increase.
- Contexts: salary/population labels only.
- Answer archetypes: multiplier.
- Weakness: nearly notation-only.

Missing:

- Structures: spreadsheet formula prompt, price-index multiplier, scaling factor in report, one-line conversion table.
- Contexts: salary revision, demand index, production index, traffic growth index.
- Distractor opportunities: 20% -> 0.20 instead of 1.20.

Planned new effective families: 4–5.

## PCT-003 / PCT-CP-005 — Repeated Percentage Increase

Existing:

- Structures: two successive increases, final value.
- Contexts: salary, population.
- Answer archetypes: final value after two increases.

Missing:

- Structures: two-year timeline, quarter-wise production, two price revisions, double-stage inventory report.
- Contexts: subscription count, factory production, website visits, market price, school enrollment.
- Distractor opportunities: adding rates directly, applying both rates to original.

Planned new effective families: 3–4.

## PCT-003 / PCT-CP-006 — Net Increase Percentage

Existing:

- Structures: two increases, find net percentage.
- Contexts: price, population.
- Answer archetypes: net percentage increase.
- Weakness: near-clone wording.

Missing:

- Structures: rate comparison note, compounded growth report, timeline without original value, exam shortcut prompt.
- Contexts: sales, users, production, visitors, admissions.
- Distractor opportunities: simple rate addition vs compounded rate.

Planned new effective families: 4–5.

## PCT-003 / PCT-CP-007 — Comparative Increase

Existing:

- Structures: two quantities increase separately, compare final values.
- Contexts: salary A/B, production A/B.
- Answer archetypes: absolute difference.

Missing:

- Structures: two-company report, two-district population note, two-product price list, table comparison.
- Contexts: company sales, district population, shop inventory, app downloads, crops.
- Distractor opportunities: comparing original values, comparing increase amounts, ignoring different rates.

Planned new effective families: 3–4.

## PCT-003 / PCT-CP-008 — Percentage Increase in Parts

Existing:

- Structures: group split into two parts, both increase, new part percentage.
- Contexts: students, workers.
- Answer archetypes: new percentage share.

Missing:

- Structures: department-wise headcount, urban/rural report, two-category inventory, survey group composition.
- Contexts: male/female voters, skilled/unskilled workers, online/offline users, local/tourist passengers.
- Distractor opportunities: using old total, increasing only target part, confusing part increase with share increase.

Planned new effective families: 3–4.

## PCT-003 / PCT-CP-009 — Required Increase

Existing:

- Structures: current value to target value.
- Contexts: salary, production.
- Answer archetypes: required percentage increase.
- Weakness: little narrative.

Missing:

- Structures: target memo, sales target gap, capacity planning, target-vs-achieved table.
- Contexts: sales, attendance, output, revenue, website traffic, crop yield.
- Distractor opportunities: gap/target instead of gap/current.

Planned new effective families: 4–5.

## PCT-003 / PCT-CP-010 — Percentage Increase Bridge

Existing:

- Structures: repeated growth over periods.
- Contexts: population, production value.
- Answer archetypes: final value after n periods.

Missing:

- Structures: annual compound table, forecast note, staged planning report, recurring subscription growth.
- Contexts: users, cattle population, admissions, subscribers, machine output.
- Distractor opportunities: simple interest-style addition, wrong number of periods.

Planned new effective families: 3–4.

---

# PCT-004 — Percentage Decrease

Stage 1 target: 35–40 effective families. Current: about 12 effective families. Plan parallels PCT-003 but should not mirror it word-for-word; decrease contexts should feel natural.

## PCT-004 / PCT-CP-001 — Direct Percentage Decrease

Existing:

- Structures: direct original-to-new decrease.
- Contexts: salary, population.
- Answer archetypes: remaining/final value.

Missing:

- Structures: stock clearance report, depreciation note, attendance drop report, revised estimate.
- Contexts: inventory, machine value, attendance, rainfall, crop yield, electricity usage.
- Distractor opportunities: decrease amount vs remaining value.

Planned new effective families: 3–4.

## PCT-004 / PCT-CP-002 — Decrease Amount

Existing:

- Structures: find only decreased part.
- Contexts: salary, production.
- Answer archetypes: decrease amount only.

Missing:

- Structures: discount amount, stock loss, absenteeism count, rainfall shortfall, crop loss.
- Contexts: price discount, warehouse stock, attendance, rainfall, farm output.
- Distractor opportunities: returning remaining value instead of decrease amount.

Planned new effective families: 3–4.

## PCT-004 / PCT-CP-003 — Original Value from Decreased Value

Existing:

- Structures: reverse decrease; two current QLs are effectively identical.
- Contexts: generic wholeLabel.
- Answer archetypes: original value.

Missing:

- Structures: pre-discount price, original stock before loss, previous attendance, original value before depreciation.
- Contexts: marked price, inventory, school attendance, machine value, rainfall.
- Distractor opportunities: adding decrease percentage to final, using final as base.

Planned new effective families: 4–5.

## PCT-004 / PCT-CP-004 — Decrease Multiplier Method

Existing:

- Structures: abstract multiplier for decrease.
- Contexts: generic wholeLabel.
- Answer archetypes: multiplier.
- Weakness: notation-only.

Missing:

- Structures: spreadsheet formula, depreciation multiplier, discount factor, remaining index.
- Contexts: price index, attendance index, stock index, machine value.
- Distractor opportunities: 20% decrease -> 0.20 instead of 0.80.

Planned new effective families: 4–5.

## PCT-004 / PCT-CP-005 — Successive Decrease

Existing:

- Structures: two successive decreases.
- Contexts: salary, population.
- Answer archetypes: final value.

Missing:

- Structures: monthly attrition, stock clearance in two rounds, two discount stages, rainfall decline over periods.
- Contexts: employees, inventory, product price, rainfall, subscription users.
- Distractor opportunities: subtracting rates directly, applying both decreases on original.

Planned new effective families: 3–4.

## PCT-004 / PCT-CP-006 — Net Percentage Decrease

Existing:

- Structures: two decreases, net percentage decrease.
- Contexts: price, population.
- Answer archetypes: net percentage decrease.
- Weakness: near-clone wording.

Missing:

- Structures: compounded decline report, index drop, retention calculation, two-round stock reduction.
- Contexts: sales, attendance, active users, stock, revenue.
- Distractor opportunities: adding rates directly instead of compounding remaining value.

Planned new effective families: 4–5.

## PCT-004 / PCT-CP-007 — Comparative Decrease

Existing:

- Structures: two quantities decrease separately; compare finals.
- Contexts: salary A/B, production A/B.
- Answer archetypes: absolute difference.

Missing:

- Structures: two-branch stock report, two-machine depreciation, two-school attendance decline, table comparison.
- Contexts: branches, machines, schools, districts, shops.
- Distractor opportunities: comparing decreases instead of final values.

Planned new effective families: 3–4.

## PCT-004 / PCT-CP-008 — Component-wise Decrease

Existing:

- Structures: group split into two parts, both decrease, new target share.
- Contexts: students, workers.
- Answer archetypes: new percentage share.

Missing:

- Structures: employee attrition by type, stock category loss, attendance category decline, passenger category drop.
- Contexts: skilled/unskilled workers, online/offline users, local/tourist passengers, categories of stock.
- Distractor opportunities: using old total, decreasing only target part, treating share decrease as count decrease.

Planned new effective families: 3–4.

## PCT-004 / PCT-CP-009 — Required Decrease

Existing:

- Structures: current value to lower target.
- Contexts: salary, production.
- Answer archetypes: required percentage decrease.
- Weakness: little narrative.

Missing:

- Structures: target reduction memo, cost-cutting plan, inventory clearance target, pollution reduction goal.
- Contexts: expenses, stock, emissions, electricity usage, absenteeism.
- Distractor opportunities: gap/current vs gap/target confusion.

Planned new effective families: 4–5.

## PCT-004 / PCT-CP-010 — Percentage Decrease Bridge

Existing:

- Structures: repeated decline over periods.
- Contexts: inventory, production value.
- Answer archetypes: final value after periods.

Missing:

- Structures: depreciation schedule, monthly attrition log, recurring decline forecast, stock decay report.
- Contexts: machine value, subscribers, warehouse stock, rainfall, attendance.
- Distractor opportunities: linear subtraction each period, wrong period count.

Planned new effective families: 3–4.

---

# PCT-005 — Successive Percentage Change

Stage 1 target: 35–40 effective families. Current: about 11 effective families. Highest-priority expansion chapter because the current layer is mathematically clean but context-poor.

## PCT-005 / PCT-CP-001 — Successive Increase

Existing:

- Structures: two increases, final value.
- Contexts: generic value, salary.
- Answer archetypes: final value.

Missing:

- Structures: timeline table, two-quarter growth, sequential price revision, two-phase enrollment growth.
- Contexts: inventory, revenue, website users, admissions, production.
- Distractor opportunities: adding rates, applying both to original.

Planned new effective families: 3–4.

## PCT-005 / PCT-CP-002 — Successive Decrease

Existing:

- Structures: two decreases, final value.
- Contexts: generic value, salary.
- Answer archetypes: final value.

Missing:

- Structures: stock clearance timeline, depreciation schedule, user attrition, two-stage discount.
- Contexts: inventory, machine value, active users, market price, attendance.
- Distractor opportunities: adding rates linearly, wrong base after first decrease.

Planned new effective families: 3–4.

## PCT-005 / PCT-CP-003 — Increase Then Decrease

Existing:

- Structures: increase followed by decrease, final value.
- Contexts: generic value.
- Answer archetypes: final value.

Missing:

- Structures: price rise then discount, admissions increase then dropout, production rise then rejection, stock replenishment then sale.
- Contexts: market price, students, factory output, warehouse stock, website traffic.
- Distractor opportunities: assuming opposite changes cancel when rates equal.

Planned new effective families: 3–4.

## PCT-005 / PCT-CP-004 — Decrease Then Increase

Existing:

- Structures: decrease followed by increase, final value.
- Contexts: generic value.
- Answer archetypes: final value.

Missing:

- Structures: discount then tax, stock loss then refill, attendance drop then recovery, price fall then rise.
- Contexts: product price, inventory, attendance, revenue, passenger count.
- Distractor opportunities: order/base confusion.

Planned new effective families: 3–4.

## PCT-005 / PCT-CP-005 — Net Percentage Change

Existing:

- Structures: net after two changes.
- Contexts: generic wholeLabel.
- Answer archetypes: net percentage.
- Weakness: severe shell collapse.

Missing:

- Structures: compare stated net vs actual, two-change index report, exam-style shortcut, no-original-value report.
- Contexts: price index, sales, revenue, active users, stock.
- Distractor opportunities: simple sum/difference of rates, sign confusion.

Planned new effective families: 4–5.

## PCT-005 / PCT-CP-006 — Equivalent Single Multiplier

Existing:

- Structures: abstract two-change multiplier.
- Contexts: generic wholeLabel.
- Answer archetypes: multiplier.
- Weakness: almost no contextual embodiment.

Missing:

- Structures: spreadsheet formula, index multiplier, conversion factor table, accounting note.
- Contexts: price index, demand index, production index, subscriber index.
- Distractor opportunities: net percentage vs multiplier, 1.10 × 0.90 vs 10 - 10.

Planned new effective families: 4–5.

## PCT-005 / PCT-CP-007 — Reverse Successive Change

Existing:

- Structures: final known after two changes, recover original.
- Contexts: generic wholeLabel.
- Answer archetypes: original value.
- Weakness: mathematically useful but context-poor.

Missing:

- Structures: original price before two revisions, opening stock before two changes, initial enrollment before changes.
- Contexts: price, inventory, admissions, subscribers, revenue.
- Distractor opportunities: reversing in wrong order, applying changes on final directly.

Planned new effective families: 3–4.

## PCT-005 / PCT-CP-008 — Comparative Successive Change

Existing:

- Structures: two items each undergo two changes, compare final values.
- Contexts: label A/B only.
- Answer archetypes: difference between final values.

Missing:

- Structures: two-branch sales table, two-products price revision, two-schools enrollment change, two-warehouses stock change.
- Contexts: branches, products, schools, warehouses, districts.
- Distractor opportunities: comparing net percentages instead of final values, ignoring different starting values.

Planned new effective families: 3–4.

## PCT-005 / PCT-CP-009 — Multi-stage Successive Change

Existing:

- Structures: three/four-stage chain, final value.
- Contexts: generic wholeLabel.
- Answer archetypes: final value after chain.

Missing:

- Structures: month-wise timeline table, quarterly sales sequence, inventory movement log, multi-stage price revision.
- Contexts: sales, inventory, price, subscribers, production.
- Distractor opportunities: arithmetic sum of rates, missing stage order, applying all rates to original.

Planned new effective families: 3–4.

## PCT-005 / PCT-CP-010 — Contextual Successive Change

Existing:

- Structures: three-stage contextual chain.
- Contexts: salary/production value.
- Answer archetypes: final value.

Missing:

- Structures: story-style mixed change, target-vs-actual chain, compare final against target, recover missing stage after final.
- Contexts: admissions, turnout, market price, warehouse stock, revenue.
- Distractor opportunities: final-vs-net confusion, wrong stage order, target comparison mistake.

Planned new effective families: 4–5.

---

# Phase B Implementation Rules

After approval, implement in this order:

1. PCT-005 — highest duplicate pressure.
2. PCT-003 and PCT-004 — parallel increase/decrease enrichment.
3. PCT-002 — distribution and recovery enrichment.
4. PCT-001 — targeted rationalization/gap-fill only.

For each chapter:

1. Add English QLs according to approved CP matrix.
2. Add task-registry entries by cloning existing taskKind mappings where mathematics is unchanged.
3. Add parameter-generator scenario support only for new contextual placeholders.
4. Do not alter solver, validator, reasoning graph, or explanations.
5. Ensure validators still require Explanation Standard V2.1.
6. Ensure MCQ option generation remains unchanged.

# Phase D Validation Plan

Run after Phase B:

1. Existing chapter tests for PCT-001..PCT-005.
2. English batch generation per chapter.
3. Library validation.
4. Render validation.
5. Coverage audit.
6. Content audit measuring:
   - raw QL count,
   - effective educational family count,
   - context diversity,
   - structure diversity,
   - answer archetype diversity,
   - duplicate pressure.

PCT-CONTENT-003 should begin only after all five chapters meet or exceed 35 effective educational families and the first-pass duplicate rate is acceptable.
