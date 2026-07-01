# AGENT.md - PCT-007 Implementation Contract

## Task Title

`PCT-007-IMPL-001 - Mixed Applications of Percentage`

## Project Root

`C:\Users\gurbaj\Downloads\f`

## Primary Goal

Implement, in a later task, a new Percentage chapter:

`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/`

Chapter identity:

`PCT-007 - Mixed Applications of Percentage`

This file is the implementation contract only. Do not implement `PCT-007` while creating or reading this file.

Target quality for the later implementation:

`Foundation-rich, exam-realistic, and manual-review-ready`

The later implementation should produce:

- `10` canonical problems
- `50` English QLs per CP
- `500` English QLs total
- natural SSC / Banking / Punjab state exam wording
- no exact duplicate English template strings
- customized solver and explanation behavior per generated question

---

## 1. Chapter Identity and Mission

`PCT-007` covers real exam-style mixed applications of percentage that were deliberately excluded from `PCT-006`.

The chapter mission is to train percentage application in practical contexts while keeping the core calculation inside the Percentage topic.

Central student skills:

- identify the correct base
- convert percentage statements into actual values
- separate percentage points from percentage change where needed
- handle remaining/used/changed quantities
- avoid direct comparison of percentages when bases differ
- solve short real-exam percentage applications without drifting into another chapter

This chapter should feel like SSC, Banking, Railways, Punjab state, and other Indian competitive-exam percentage application questions.

---

## 2. What PCT-007 Includes

PCT-007 includes mixed but still percentage-centered applications:

- income, expenditure, and savings
- marks, pass-fail, and exam scores
- election, votes, valid votes, and invalid votes
- population, production, and consumption applications
- mixture and concentration basics
- evaporation, drying, and composition change
- tax, discount, commission, and charges
- error, miscalculation, and percentage error
- replacement and repeated percentage application in context
- mini DI / mixed percentage caselets

Allowed adjacent context:

- profit/loss
- discount
- tax
- election
- mixture
- marks
- population
- production
- consumption
- compact DI-style tables

The calculation must remain percentage application, not a full treatment of the adjacent topic.

---

## 3. What PCT-007 Excludes

Do not turn PCT-007 into:

- full Profit and Loss
- full Simple Interest / Compound Interest
- full Ratio-Proportion
- full Alligation
- full DI
- full taxation/accounting
- full mensuration
- full time-work or time-speed application
- a generic word-problem dumping ground

Strict exclusions:

- no profit percentage over cost-price/selling-price systems beyond light discount/tax/charge context
- no interest formulas
- no alligation cross-rule or allegation table method
- no large DI sets requiring multi-step table interpretation beyond a mini caselet
- no complex tax slabs
- no partnership, average, or ratio chapter takeover
- no geometry, area, volume, or mensuration as the core computation

---

## 4. Canonical Problem Definitions

Implement exactly 10 CPs.

### `PCT-CP-001 - Income, Expenditure, and Savings`

Core idea:

Given income and one or two percentage statements about expenditure or savings, find income, expenditure, savings, or percentage saved/spent.

Typical stems:

- A person spends `{percentageRate}%` of income and saves the rest.
- Monthly income is Rs. `{baseValue}` and expenditure is `{percentageRate}%`.
- Savings are Rs. `{value1}` and expenditure is `{percentageRate}%` of income.

Required concepts:

- part of income
- remaining percentage
- original from known percentage
- change in savings when income/expenditure changes, only if still percentage-centered

### `PCT-CP-002 - Marks, Pass-Fail, and Exam Scores`

Core idea:

Use total marks, pass percentage, marks obtained, and shortage/excess over pass marks.

Typical stems:

- A candidate scores `{percentageRate}%` of total marks.
- Pass marks are `{percentageRate}%` of total marks.
- A student fails by `{value1}` marks or passes by `{value1}` marks.

Required concepts:

- percent of total marks
- total from percentage marks
- pass threshold
- excess or shortage over pass marks

### `PCT-CP-003 - Election, Votes, and Valid-Invalid Votes`

Core idea:

Apply percentages to registered voters, votes polled, valid votes, invalid votes, and candidate shares.

Typical stems:

- `{percentageRate}%` of voters cast votes.
- `{rate1}%` votes are invalid.
- A candidate gets `{rate2}%` of valid votes.
- Winning margin is calculated from vote shares.

Required concepts:

- turnout
- valid/invalid split
- candidate vote share
- difference between two candidates

### `PCT-CP-004 - Population, Production, and Consumption Applications`

Core idea:

Use percent increase/decrease and percent share in population, production, and consumption contexts.

Typical stems:

- Population increases by `{percentageRate}%`.
- Production is reduced by `{percentageRate}%`.
- Consumption is `{percentageRate}%` of supply.
- Remaining stock/quantity is requested.

Required concepts:

- revised value
- original value
- used/remaining quantity
- percent change in practical quantities

### `PCT-CP-005 - Mixture and Concentration Basics`

Core idea:

Use percentage composition in simple mixtures where one component amount or total mixture amount is requested.

Typical stems:

- A solution contains `{percentageRate}%` salt.
- Milk is `{percentageRate}%` of a mixture.
- Water forms the remaining percentage.

Boundary:

This CP may use direct concentration and component calculations only. Do not implement full alligation or replacement methods here.

### `PCT-CP-006 - Evaporation, Drying, and Composition Change`

Core idea:

Use unchanged solid/pure component percentage before and after water loss, drying, or evaporation.

Typical stems:

- Fresh fruit contains `{rate1}%` water and dry fruit contains `{rate2}%` water.
- A solution loses water by evaporation, changing concentration from `{rate1}%` to `{rate2}%`.
- Sugar/salt remains unchanged while water changes.

Boundary:

No full chemistry, no alligation, no multi-stage industrial process unless the calculation remains one percentage application.

### `PCT-CP-007 - Tax, Discount, Commission, and Charges`

Core idea:

Apply tax, discount, commission, service charge, or fee percentages to a base amount.

Typical stems:

- Marked bill is Rs. `{baseValue}` and tax is `{percentageRate}%`.
- Discount is `{percentageRate}%`, then tax/charge is applied.
- Commission is `{percentageRate}%` of sales.

Boundary:

This is not a full profit/loss or taxation chapter. Avoid cost-price/profit chains unless the percent application is the central skill.

### `PCT-CP-008 - Error, Miscalculation, and Percentage Error`

Core idea:

Compare wrong value, correct value, measured value, actual value, and calculate percentage error.

Typical stems:

- A number is wrongly taken as `{value1}` instead of `{value2}`.
- A bill is overcharged/undercharged by `{value1}` on a correct amount.
- A measurement is `{percentageRate}%` above or below the actual value.

Required concepts:

- absolute error
- percentage error on correct value
- correct value from wrong value and error percent

### `PCT-CP-009 - Replacement and Repeated Percentage Application in Context`

Core idea:

Handle repeated removal/replacement or repeated percentage application in practical contexts.

Typical stems:

- `{percentageRate}%` of a tank/stock is used and replaced.
- A quantity is reduced by `{rate1}%` and then again by `{rate2}%`.
- Stock is replenished after a percentage sale.

Boundary:

This CP may include light repeated application but should not become PCT-005 successive-change theory or full mixture replacement/alligation. Stems must stay contextual and percentage-application driven.

### `PCT-CP-010 - Mini DI / Mixed Percentage Caselets`

Core idea:

Use very short caselets with 2-4 facts where percentage application is required.

Typical stems:

- A small school/class/business/election summary gives totals and percentages.
- A candidate must compute one actual value or one comparison.
- A small table may appear only if the runtime supports table-like text cleanly.

Boundary:

This is mini DI only. Do not implement full DI sets, multi-question passages, chart interpretation, or long tables.

---

## 5. Formula Logic for Every CP

### CP-001 formulas

- `expenditure = income * expenditureRate / 100`
- `savings = income - expenditure`
- `savingsRate = 100 - expenditureRate`
- `income = knownPart * 100 / knownRate`
- `newSavings = newIncome - newExpenditure`

### CP-002 formulas

- `marksObtained = totalMarks * percentageRate / 100`
- `passMarks = totalMarks * passRate / 100`
- `shortage = passMarks - marksObtained`
- `excess = marksObtained - passMarks`
- `totalMarks = marksObtained * 100 / percentageRate`

### CP-003 formulas

- `votesPolled = totalVoters * turnoutRate / 100`
- `invalidVotes = votesPolled * invalidRate / 100`
- `validVotes = votesPolled - invalidVotes`
- `candidateVotes = validVotes * candidateRate / 100`
- `margin = abs(candidate1Votes - candidate2Votes)`

### CP-004 formulas

- `newValue = oldValue * (100 + rate) / 100`
- `newValue = oldValue * (100 - rate) / 100`
- `oldValue = newValue * 100 / (100 + rate)`
- `oldValue = newValue * 100 / (100 - rate)`
- `remaining = total * (100 - usedRate) / 100`

### CP-005 formulas

- `componentAmount = totalMixture * componentRate / 100`
- `otherComponent = totalMixture - componentAmount`
- `componentRate = componentAmount * 100 / totalMixture`
- `totalMixture = componentAmount * 100 / componentRate`

### CP-006 formulas

For drying/evaporation where solid/pure component remains constant:

- `solidRateFresh = 100 - waterRateFresh`
- `solidAmount = initialWeight * solidRateFresh / 100`
- `finalWeight = solidAmount * 100 / solidRateDry`
- `waterLost = initialWeight - finalWeight`

For concentration change by water loss:

- `soluteAmount = initialVolume * initialConcentration / 100`
- `finalVolume = soluteAmount * 100 / finalConcentration`
- `evaporated = initialVolume - finalVolume`

### CP-007 formulas

- `discount = markedAmount * discountRate / 100`
- `amountAfterDiscount = markedAmount - discount`
- `tax = taxableAmount * taxRate / 100`
- `finalBill = taxableAmount + tax`
- `commission = salesAmount * commissionRate / 100`
- `charge = baseAmount * chargeRate / 100`

### CP-008 formulas

- `absoluteError = abs(wrongValue - correctValue)`
- `percentageError = absoluteError * 100 / correctValue`
- `correctValue = wrongValue * 100 / (100 + errorRate)` for overstatement
- `correctValue = wrongValue * 100 / (100 - errorRate)` for understatement

### CP-009 formulas

For repeated use/removal:

- `remainingAfterOneStep = total * (100 - rate) / 100`
- `remainingAfterTwoSteps = total * (100 - rate1) / 100 * (100 - rate2) / 100`

For contextual replacement where the same percentage is removed from current quantity:

- `remainingAfterN = total * ((100 - rate) / 100)^n`

If replacement restores total but changes composition, use only simple two-step cases and avoid alligation-style reasoning unless explicitly scoped.

### CP-010 formulas

Use formulas from CP-001 to CP-009 depending on caselet type.

Each generated caselet must declare its solve mode so solver logic remains deterministic.

---

## 6. Suggested TaskKind Names

Use names compatible with local project conventions.

Suggested `Pct007TaskKind` values:

- `incomeExpenditureSavingsApplication`
- `marksPassFailApplication`
- `electionVotesApplication`
- `populationProductionConsumptionApplication`
- `mixtureConcentrationBasicApplication`
- `evaporationDryingCompositionApplication`
- `taxDiscountCommissionChargesApplication`
- `errorMiscalculationPercentageErrorApplication`
- `replacementRepeatedPercentageApplication`
- `miniDiMixedPercentageCaselet`

---

## 7. Suggested SolveMode Names

Use solve modes to keep formulas explicit and avoid ambiguous generic solvers.

Suggested solve modes:

- `findExpenditureFromIncome`
- `findSavingsFromIncome`
- `findIncomeFromSavings`
- `findMarksFromTotal`
- `findTotalMarksFromScore`
- `findPassShortageOrExcess`
- `findVotesPolled`
- `findValidVotes`
- `findCandidateVotes`
- `findWinningMargin`
- `findRevisedPopulationOrProduction`
- `findOriginalPopulationOrProduction`
- `findUsedOrRemainingQuantity`
- `findComponentAmount`
- `findMixtureTotalFromComponent`
- `findFinalDryWeight`
- `findEvaporatedAmount`
- `findDiscountAmount`
- `findTaxOrChargeAmount`
- `findFinalBill`
- `findCommission`
- `findPercentageError`
- `findCorrectValueFromError`
- `findRemainingAfterRepeatedUse`
- `findCaseletActualValue`
- `findCaseletComparison`

Add more solve modes only when the solver behavior genuinely differs.

---

## 8. Suggested AnswerType Usage

Use a controlled answer type set.

Suggested `Pct007AnswerType` values:

- `ABSOLUTE`
- `PERCENT`
- `AMOUNT`
- `COUNT`
- `COMPARISON`
- `DIFFERENCE`
- `WEIGHT`
- `VOLUME`
- `BILL_VALUE`

Guidance:

- Use `ABSOLUTE` for plain numerical values where no unit-specific rendering matters.
- Use `AMOUNT` / `BILL_VALUE` for rupee answers.
- Use `COUNT` for votes, students, people, units, and passengers.
- Use `WEIGHT` for kg/gram drying contexts.
- Use `VOLUME` for litre/ml solution contexts.
- Use `PERCENT` for percentage error or rates.
- Use `COMPARISON` only when the answer must state direction.

---

## 9. Safe Variable Vocabulary

Use a limited placeholder vocabulary.

Primary variables:

- `percentageRate`
- `rate1`
- `rate2`
- `rate3`
- `baseValue`
- `value1`
- `value2`
- `totalValue`
- `income`
- `expenditure`
- `savings`
- `totalMarks`
- `marksObtained`
- `passRate`
- `totalVoters`
- `turnoutRate`
- `invalidRate`
- `validVotes`
- `candidateRate`
- `waterRate`
- `dryWaterRate`
- `componentRate`
- `newRate`
- `oldRate`
- `taxRate`
- `discountRate`
- `commissionRate`
- `chargeRate`
- `correctValue`
- `wrongValue`
- `baseValue1`
- `baseValue2`

Context labels:

- `personA`
- `personB`
- `candidateA`
- `candidateB`
- `itemLabel`
- `wholeLabel`
- `componentLabel`
- `unitLabel`
- `valuePrefix`

Do not introduce one-off placeholders unless they are documented in `task-registry.library.json`, supplied by the generator, and validated.

---

## 10. QL Count Target

Later implementation target:

- `10` CPs
- `50` English QLs per CP
- `500` English QLs total

Do not stop at `20` QLs per CP.

Each CP should include:

- direct exam-style stems
- person/salary/marks stems where relevant
- public-record or administrative contexts where natural
- business/shop/production contexts where natural
- short data/caselet phrasing where it improves realism

---

## 11. QL ID Rules

Use global stable QL IDs:

- CP-001: `PCT-QL-001` to `PCT-QL-050`
- CP-002: `PCT-QL-051` to `PCT-QL-100`
- CP-003: `PCT-QL-101` to `PCT-QL-150`
- CP-004: `PCT-QL-151` to `PCT-QL-200`
- CP-005: `PCT-QL-201` to `PCT-QL-250`
- CP-006: `PCT-QL-251` to `PCT-QL-300`
- CP-007: `PCT-QL-301` to `PCT-QL-350`
- CP-008: `PCT-QL-351` to `PCT-QL-400`
- CP-009: `PCT-QL-401` to `PCT-QL-450`
- CP-010: `PCT-QL-451` to `PCT-QL-500`

Rules:

- Do not reuse a QL ID across CPs.
- Do not change IDs after task registry creation.
- Every QL ID in `question-language.en.json` must exist in `task-registry.library.json`.
- Every active QL ID must be reachable by the coverage auditor.

---

## 12. English Stem Style Guide

Write concise, natural English.

Preferred:

- `A person spends {percentageRate}% of his income and saves the rest. If his income is Rs. {baseValue}, find his savings.`
- `A candidate scored {marksObtained} marks and failed by {value1} marks. If the pass marks are {percentageRate}% of the total, find the total marks.`
- `{percentageRate}% of the voters cast their votes. If there are {totalVoters} registered voters, find the number of votes polled.`
- `A solution contains {componentRate}% salt. How much salt is present in {baseValue} litres of the solution?`
- `A bill of Rs. {baseValue} attracts {taxRate}% tax. Find the final bill amount.`

Avoid:

- `A data sheet says...`
- `A summary line shows...`
- `A table lists...` unless it is a real mini DI caselet
- `A calculation says...`
- `A record mentions...` as filler
- `Find the same.`
- `Calculate it.`
- vague pronouns when multiple values exist

Direction must be explicit:

- use `increased by`, `decreased by`, `spent`, `saved`, `valid`, `invalid`, `overcharged`, `undercharged`
- never rely on `changed by` when direction matters
- never say `opposite direction` without specifying which side increases and which decreases

---

## 13. SSC-Realism Rules

Stems should resemble real Indian competitive-exam wording:

- short, direct, and solvable from given data
- no unnecessary story
- no artificial business jargon
- no excessive named entities
- natural units: rupees, marks, votes, litres, kg, people, units
- clear base for every percentage
- no hidden assumptions

Use Indian exam context naturally:

- monthly income and savings
- student marks and pass marks
- registered voters and valid votes
- village/town population
- factory production
- shop bill and tax
- discount on marked bill
- commission on sales
- salt/sugar/milk-water solution
- fresh and dry fruit

---

## 14. Context Library

Recommended contexts by CP:

- CP-001: salary, monthly income, household expenditure, savings, rent, school fee, food expense
- CP-002: exam marks, pass marks, failed by, passed by, total marks, subject marks
- CP-003: registered voters, polling percentage, invalid votes, valid votes, candidate share, margin
- CP-004: population, production, consumption, stock, supply, public utility usage
- CP-005: salt solution, sugar solution, milk-water mixture, acid-water only for direct component calculation
- CP-006: fruit drying, grapes/raisins, water evaporation, sugar solution concentration, dry matter
- CP-007: bill, tax, GST-like tax, discount, service charge, commission, brokerage-like fee
- CP-008: wrong bill, incorrect measurement, misread marks, wrong population entry, overcount/undercount
- CP-009: stock sold and replenished, tank emptied, quantity used twice, repeated consumption, repeated reduction
- CP-010: compact school/election/shop/factory/public-utility caselets

Avoid context dominance. No CP should have all 50 stems from one setting.

---

## 15. Placeholder Discipline

Rules:

- Every placeholder in a template must be supplied by the generator.
- Every placeholder must be declared through task registry metadata if the local architecture supports it.
- Do not use placeholders casually for natural-language nouns if fixed wording is enough.
- Do not change placeholder contracts after tests are written unless tests and registry are updated in the same implementation task.
- Preserve placeholder names exactly across English/Hindi/Punjabi structural files.
- No rendered stem may contain unresolved `{placeholder}` text.

Run a placeholder audit before handoff:

- collect placeholders from all English QLs
- compare against task-registry required variables
- generate at least one package per active QL
- verify all stems render without unresolved placeholders

---

## 16. Solver Requirements

Solver must be CP-aware and solve-mode-aware.

Requirements:

- handle all 10 CPs
- return finite answers only
- preserve integer answers where possible
- format decimals to at most 2 places unless project convention differs
- include direction in comparison answers
- include units in human-readable answers where existing chapter conventions support it
- provide evidence values for explanation rendering
- keep formulas localized to PCT-007 logic

Do not use one generic percentage solver for all CPs if that hides business rules or direction.

For CP-010 mini caselets, solve mode must identify which formula family is active.

---

## 17. Validator Requirements

Validator must check:

- required variables exist
- numeric values are finite
- rates are realistic
- bases and denominators are non-zero
- less-than rates are below 100 where required
- total marks, votes, population, weight, volume, and amount are positive
- invalid vote rate is below 100
- dry-water rate is less than fresh-water rate where drying requires it
- final concentration is greater than initial concentration where evaporation requires it
- correct value is non-zero for percentage error
- rendered stems have no unresolved placeholders
- cross-language placeholder parity, if Hindi/Punjabi files are created

Validator should reject generated items where:

- marks exceed total marks unless the solve mode intentionally asks for an error
- invalid votes exceed polled votes
- expenditure exceeds income unless the stem explicitly permits debt/loss
- final weight/volume becomes negative or zero
- replacement/repeated application produces impossible quantities

---

## 18. Parameter-Generator Requirements

Generator should be scalable. Do not write 500 one-off parameter builders.

Required behavior:

- deterministic generation by seed
- explicit generation by `questionLanguageId`
- CP-specific scenario pools
- solve-mode-specific variable generation
- clean-number pools
- realistic Indian exam values
- values chosen to avoid ugly decimals where possible
- coverage auditor can touch all 500 QLs exactly once

Suggested values:

- amounts: 100, 120, 150, 200, 240, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 5000, 10000
- percentages: 5, 10, 12.5, 15, 20, 25, 30, 33.33, 40, 50, 60, 75, 80
- marks totals: 100, 150, 200, 300, 400, 500, 600
- voter counts: 1000, 2000, 5000, 10000, 25000, 50000
- weights/volumes: 10, 20, 25, 40, 50, 80, 100, 120, 200
- water rates: 60, 70, 75, 80, 90
- dry-water rates: 10, 15, 20, 25, 30

Do not generate:

- negative values
- zero bases
- invalid percentages over 100 unless context explicitly permits `more than 100%`
- unreasonably large or unrealistic quantities

---

## 19. Explanation-Renderer Requirements

Follow Explanation Standard V2.1 used by recent Percentage chapters.

Every explanatory statement should be followed by a MathJax consequence beginning with `\Rightarrow`.

Requirements:

- explanation should use the actual generated numbers
- explanation should name the base clearly
- explanation should not dump formulas without context
- comparison answers should explain direction
- CP-010 explanations should adapt to the active caselet solve mode

Example style:

```text
The person spends 70% of income, so the savings are the remaining 30%.
\Rightarrow \text{Savings rate} = 100\% - 70\% = 30\%

Now find 30% of the income.
\Rightarrow \text{Savings} = \frac{30}{100} \times 5000 = 1500
```

Avoid:

- long algebra-first derivations
- vague `Therefore answer is...`
- unrendered placeholders
- explanations that do not match the specific generated question

---

## 20. Required Files to Create Later

Create the folder:

`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/`

Expected files, following the modern `PCT-006` package shape:

- `archetype.md`
- `canonical-problems.md`
- `difficulty-framework.md`
- `implementation-plan.md`
- `library-authority-map.md`
- `reasoning-patterns.md`
- `index.ts`
- `types.ts`
- `math.ts`
- `solver.ts`
- `validator.ts`
- `parameter-generator.ts`
- `pipeline.ts`
- `coverage-auditor.ts`
- `explanation-renderer.ts`
- `reasoning-graph.ts`
- `library.ts`
- `task-registry.library.json`
- `variable-ranges.library.json`
- `coverage-targets.library.json`
- `distribution-targets.library.json`
- `question-language.en.json`
- `explanation.en.json`
- `question-language.hi.json`
- `question-language.pa.json`
- `explanation.hi.json`
- `explanation.pa.json`
- `pct-007.test.ts`

If the local convention still uses thin top-level re-exports to a `foundation/` folder, mirror the `PCT-006` structure.

---

## 21. Required Reports to Create Later

Create reports under:

`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/`

Required reports:

- `pct-007-implementation-report.md`
- `pct-007-content-audit.md`

Implementation report must include:

- files created
- files modified outside `PCT-007`
- CP list
- task kinds
- solve modes
- answer types
- variable vocabulary
- solver summary
- validator summary
- generator summary
- QL count summary
- explanation summary
- verification commands and results
- known caveats
- readiness status

Content audit must include:

- exact duplicate template count
- affected rows
- CP spread of duplicates
- high-confidence near-clone families
- weak stems
- context diversity notes
- CP-level richness score
- publish-readiness judgement
- recommended next action

---

## 22. Verification Commands and Checks

At minimum, run JSON parse checks:

```bash
cd artifacts/api-server
node -e "JSON.parse(require('fs').readFileSync('src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/question-language.en.json','utf8')); console.log('PCT-007 question-language.en.json JSON OK')"
```

Also parse:

- `task-registry.library.json`
- `variable-ranges.library.json`
- `coverage-targets.library.json`
- `distribution-targets.library.json`
- `explanation.en.json`
- `question-language.hi.json`
- `question-language.pa.json`
- `explanation.hi.json`
- `explanation.pa.json`

Required audits:

- exact duplicate template audit on English templates
- QL count audit: `500`
- CP count audit: `10`
- per-CP QL count audit: `50`
- placeholder consistency audit
- rendered-stem unresolved-placeholder audit
- sample generation per CP
- 500-question deterministic coverage generation
- answer finite check
- explanation render check

Run project checks if practical:

```bash
cd artifacts/api-server
pnpm exec esbuild src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/pct-007.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-007.test.mjs
node dist/quant-v4/pct-007.test.mjs
```

If local shell/runtime checks fail due to environment issues, capture exact failed commands and include fallback local commands in the implementation report.

---

## 23. Acceptance Criteria

PCT-007 later implementation is acceptable only if:

- `PCT-007/` folder exists
- all 10 CPs are implemented
- English QL count is `500`
- every CP has exactly `50` English QLs
- all QL IDs are stable and globally unique within the chapter
- exact duplicate English template groups are `0`
- high-confidence near-clone families are not severe
- stems feel natural and exam-like
- solver handles every task kind and solve mode
- validator checks all CP-specific constraints
- generator supplies all placeholders
- all generated answers are finite and non-empty
- explanations render with generated values
- JSON parse passes for every new JSON file
- PCT-007 test passes if local runtime allows it
- implementation report exists
- content audit exists
- no unrelated PCT-001 to PCT-006 files are edited
- no shared runtime changes are made without a documented necessity

Desired final readiness:

`Ready for manual review`

---

## 24. What Not to Do

Do not:

- implement PCT-007 while only asked to create this contract
- stop at 20 QLs per CP in the later implementation
- create robotic noun-swap stems
- use artificial shells such as `A comparison note says...`
- overuse `data sheet`, `summary line`, or `table lists`
- leave ambiguous increase/decrease direction
- compare percentages directly when bases differ
- leave exact duplicate templates
- leave unresolved placeholders
- alter task registry without updating solver/generator/validator in the same implementation task
- change Hindi/Punjabi deeply through machine translation and call it final localization
- turn the chapter into profit/loss, interest, alligation, ratio, DI, taxation, or accounting
- claim verification passed if commands were not run

---

## 25. Suggested Implementation Sequence

1. Inspect `PCT-006` structure, tests, reports, and polish notes.
2. Create the `PCT-007` folder using the modern `PCT-006` package shape.
3. Define `types.ts` constants, CP IDs, task kinds, solve modes, and answer types.
4. Write `canonical-problems.md`, `difficulty-framework.md`, and `reasoning-patterns.md`.
5. Implement math helpers for all 10 CPs.
6. Implement solver branches by solve mode.
7. Implement validator checks by CP and solve mode.
8. Implement scalable parameter generation with deterministic QL coverage.
9. Create `task-registry.library.json` with 500 active QL IDs.
10. Create `variable-ranges.library.json`, `coverage-targets.library.json`, and `distribution-targets.library.json`.
11. Write 500 natural English QL templates using a CP/context/structure matrix.
12. Create explanation library and renderer behavior.
13. Create structurally complete Hindi/Punjabi companion libraries if required.
14. Wire exports/routing only if needed by existing architecture.
15. Add `pct-007.test.ts` with fixed solver assertions and 500-question coverage.
16. Run JSON parse checks.
17. Run duplicate, placeholder, and coverage audits.
18. Run bundled test and project checks where practical.
19. Rewrite any weak, robotic, ambiguous, or duplicate English stems.
20. Create implementation and content audit reports.
21. Final handoff with status, verification results, exact duplicate count, and known caveats.

---

## Final Handoff Format for Later Implementation

When PCT-007 is implemented, report:

- files created
- files modified outside `PCT-007`
- exact English QL count
- QL count per CP
- exact duplicate template count
- verification commands run
- pass/fail results
- known caveats
- whether PCT-007 is ready for manual review

Use one of:

- `Ready for manual review`
- `Needs tiny patch`
- `Needs another implementation pass`

