# AGENT.md — PCT-006 Full Implementation Instructions

## Task title

`PCT-006-IMPL-001 — Percentage Comparison & Comparative Change`

## Project root

`C:\Users\gurbaj\Downloads\f`

## Primary goal

Implement a new Percentage chapter:

`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-006/`

Chapter identity:

`PCT-006 — Percentage Comparison & Comparative Change`

This chapter must be foundation-rich enough that it does not need to be revisited later only for content richness. The first implementation should be structurally working, mathematically correct, and content-rich with natural exam-like English stems.

Target quality:

`Foundation-rich and manual-review-ready`

Not merely:

`Minimal scaffold` or `20 QLs per CP`.

---

## Background and roadmap context

The intended Percentage roadmap is:

1. `PCT-001 — Percentage Foundations`
2. `PCT-002 — Percentage Transformations / Part-Whole / Distribution`
3. `PCT-003 — Percentage Increase`
4. `PCT-004 — Percentage Decrease`
5. `PCT-005 — Successive Percentage Change`
6. `PCT-006 — Percentage Comparison & Comparative Change`
7. `PCT-007 — Mixed Applications of Percentage`
8. `PCT-X — Experimental / deferred advanced patterns`

`PCT-006` must close the core conceptual gap around comparison and base-switching before mixed applications are implemented in `PCT-007`.

Do not make `PCT-006` a mixture/concentration chapter. Mixture, election, income-expenditure, marks/pass-fail, valid votes, tax/slabs, replacement, drying, evaporation, and broad application clusters belong to `PCT-007` unless used only as light contexts for a comparison concept.

---

## Lessons from recent PCT-001 cleanup

Recent PCT-001 cleanup ended with a strong result:

- JSON parse passed.
- Exact duplicate groups became `0`.
- Earlier exact duplicates were fully resolved.
- Remaining repetition was judged acceptable as conceptual family similarity, not copy-paste duplication.
- PCT-001 became ready for manual review.

Carry these lessons into PCT-006:

1. Build content with a matrix from the start; do not generate shallow noun swaps and audit later.
2. Exact duplicate template strings are not acceptable.
3. Same mathematical shell is allowed; same sentence shell is not.
4. Natural exam-like wording matters. Avoid robotic wrappers.
5. Do not overuse artificial phrases like:
   - `A worksheet asks...`
   - `A data sheet says...`
   - `A calculation says...`
   - `A record mentions...`
   - `A register lists...`
   - `A materials batch...`
6. These wrappers are not banned, but they should appear only occasionally when they make the stem more natural.
7. The implementation must include an exact duplicate audit and a near-clone review before handoff.
8. The implementation should leave the chapter ready for manual review, not ready for another long cleanup chain.

---

## Strict scope

### Create

Create the full `PCT-006` chapter folder and required files under:

`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-006/`

Create implementation/audit reports under:

`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/`

Required reports:

- `pct-006-implementation-report.md`
- `pct-006-content-audit.md`

### May update only if required for routing/build

You may update package/chapter exports or registries only if they are required for PCT-006 to compile or be discoverable.

Before editing any router/export file, inspect existing `PCT-001` to `PCT-005` wiring and follow the existing pattern.

### Do not edit unless absolutely required

Do not edit existing PCT-001 to PCT-005 source/content files.

Do not modify shared runtime architecture unless a genuine blocker prevents PCT-006 from working.

Do not add new platform infrastructure.

Do not machine-translate Hindi/Punjabi content deeply.

---

## Existing chapters to inspect first

Before implementation, inspect these files for conventions:

- `Percentage/PCT-002/canonical-problems.md`
- `Percentage/PCT-003/canonical-problems.md`
- `Percentage/PCT-004/canonical-problems.md`
- `Percentage/PCT-005/canonical-problems.md`
- `Percentage/PCT-005/foundation/types.ts`
- `Percentage/PCT-005/solver.ts`
- `Percentage/PCT-005/validator.ts`
- `Percentage/PCT-005/parameter-generator.ts`
- `Percentage/PCT-005/pipeline.ts`
- `Percentage/PCT-005/task-registry.library.json`
- `Percentage/PCT-005/variable-ranges.library.json`
- `Percentage/PCT-005/question-language.en.json`
- `Percentage/PCT-005/explanation.en.json`
- `Percentage/PCT-X/future-taxonomy.md`
- `Percentage/PCT-X/taxonomy-status.ts`

Recommended scaffold source:

`PCT-005`

Reason:

- It has the modern 10-CP chapter shape.
- It has the foundation folder pattern.
- It has solver/validator/pipeline/test/audit conventions.

But replace all conceptual logic. Do not clone PCT-005 content.

---

## Chapter mission

`PCT-006` teaches how to compare quantities using percentage language, especially when the base changes.

The central misconception this chapter should correct:

`A is 25% more than B` does not mean `B is 25% less than A`.

Correct reasoning:

`A = 125% of B`, so `B = 100/125 of A = 80% of A`, therefore `B is 20% less than A`.

This base-switching skill is common in SSC, Banking, Railways, State exams, and Punjab-state aptitude questions.

---

## Include boundary

PCT-006 should include:

- A is `p%` more than B.
- A is `p%` less than B.
- By what percent is B less/more than A?
- Difference as a percentage of selected base.
- Ratio-based percentage comparison.
- Required percentage increase/decrease to match a target.
- Compare two values after different percentage changes.
- Chain comparisons such as A vs B and B vs C.
- Percentage points vs percentage change.
- Cross-base comparison, where percentages are taken on different totals.

---

## Exclude boundary

Keep these mostly for `PCT-007 — Mixed Applications of Percentage`:

- mixture and concentration
- acid-water / salt-water / sugar solution
- fruit drying / evaporation
- alloy composition
- election and valid votes
- income-expenditure-savings full applications
- marks/pass-fail full applications
- tax slabs
- commission
- miscalculation and percentage error
- set overlap
- replacement operations
- full caselet-style DI

PCT-006 may use salary, marks, population, price, production, stock, or attendance as contexts, but the mathematical skill must remain comparison/base-switching.

---

## Canonical problems

Implement exactly 10 canonical problems.

### `PCT-CP-001 — Direct More-Than Comparison`

Core idea:

Given `A is p% more than B`, find A, B, or the difference.

Formulas:

- `A = B × (100 + p) / 100`
- `B = A × 100 / (100 + p)`
- `Difference = B × p / 100`

Common contexts:

- salary/income
- marks
- population
- production
- shop price
- sales
- attendance

Required variables:

- `percentageRate`
- `baseValue`

Optional generated/evidence values:

- `greaterValue`
- `difference`

Difficulty:

- Easy for finding A from B.
- Medium for finding B from A.

---

### `PCT-CP-002 — Direct Less-Than Comparison`

Core idea:

Given `A is p% less than B`, find A, B, or the difference.

Formulas:

- `A = B × (100 - p) / 100`
- `B = A × 100 / (100 - p)`
- `Difference = B × p / 100`

Required variables:

- `percentageRate`
- `baseValue`

Difficulty:

- Easy for finding lower value from higher base.
- Medium for reverse base recovery.

---

### `PCT-CP-003 — Reverse Base-Switching Comparison`

Core idea:

Convert one comparison statement into the reverse comparison.

Cases:

- If A is `p%` more than B, find by what percent B is less than A.
- If A is `p%` less than B, find by what percent B is more than A.

Formulas:

If A is `p%` more than B:

- `reverseLessPercent = p / (100 + p) × 100`

If A is `p%` less than B:

- `reverseMorePercent = p / (100 - p) × 100`

Implementation note:

Prefer generator values that produce clean or exam-friendly answers. Use ratio-derived pairs where possible, e.g. `5:4`, `4:3`, `3:2`, `6:5`, `8:5`, `9:5`, `7:4`.

Difficulty:

- Medium/Hard.

This is one of the highest-priority CPs.

---

### `PCT-CP-004 — Difference as Percentage of Selected Base`

Core idea:

The same absolute difference gives different percentages depending on the base.

Formulas:

- `difference = |value1 - value2|`
- `differenceAsPercentOfValue1 = difference / value1 × 100`
- `differenceAsPercentOfValue2 = difference / value2 × 100`

Required variables:

- `value1`
- `value2`

Difficulty:

- Easy/Medium.

Important:

Stems must specify the base clearly:

- as a percentage of the first value
- as a percentage of the second value
- by what percent is the larger more than the smaller
- by what percent is the smaller less than the larger

---

### `PCT-CP-005 — Ratio-Based Percentage Comparison`

Core idea:

Given `A:B = m:n`, find how much percent one is more/less than the other.

Formulas:

If `m > n`:

- `A is [(m - n) / n] × 100% more than B`
- `B is [(m - n) / m] × 100% less than A`

If `m < n`, reverse the roles.

Required variables:

- `ratioA`
- `ratioB`

Difficulty:

- Medium.

Generator note:

Use ratios that produce clean or exam-friendly percentages, e.g.:

- `5:4`
- `4:3`
- `3:2`
- `6:5`
- `7:5`
- `8:5`
- `9:5`
- `10:7`
- `11:8`
- `12:9`

---

### `PCT-CP-006 — Required Percentage Change to Match Target`

Core idea:

Given two values, find the percentage increase or decrease required for one to become the other.

Formulas:

To increase `value1` to `value2`:

- `requiredIncreasePercent = (value2 - value1) / value1 × 100`

To decrease `value1` to `value2`:

- `requiredDecreasePercent = (value1 - value2) / value1 × 100`

Required variables:

- `value1`
- `value2`

Difficulty:

- Easy/Medium.

Important:

Stems must not be ambiguous. They should state which value is being changed into which target.

---

### `PCT-CP-007 — Compare Two Values After Different Percentage Changes`

Core idea:

Two starting values undergo different percentage changes. Compare final values.

Formulas:

- `finalValue1 = value1 × (100 ± rate1) / 100`
- `finalValue2 = value2 × (100 ± rate2) / 100`
- `finalDifference = |finalValue1 - finalValue2|`
- Optional: `finalComparisonPercent = finalDifference / chosenBase × 100`

Required variables:

- `value1`
- `value2`
- `rate1`
- `rate2`
- `changeType1`
- `changeType2`

If the existing architecture avoids string variables, encode change types through task variants or separate task registry entries.

Difficulty:

- Medium/Hard.

Important:

This CP must not become generic successive change. Each item must end in comparison between two final values.

---

### `PCT-CP-008 — Chain Percentage Comparison`

Core idea:

Given relations between A and B, and B and C, find relation between A and C.

Example:

- A is `rate1%` more than B.
- B is `rate2%` less than C.
- Find whether A is more/less than C and by what percent.

Formula pattern:

Use multipliers.

- `A = B × multiplier1`
- `B = C × multiplier2`
- Therefore `A = C × multiplier1 × multiplier2`

Then compare `A` with `C`.

Required variables:

- `rate1`
- `rate2`

Optional internal values:

- `multiplier1`
- `multiplier2`
- `combinedMultiplier`

Difficulty:

- Hard.

Generator note:

Use friendly combinations that produce clean results where possible:

- `+20%` and `-25%` gives `0.90`, so A is `10%` less than C.
- `+25%` and `-20%` gives `1.00`, so A equals C.
- `+50%` and `-20%` gives `1.20`, so A is `20%` more than C.

---

### `PCT-CP-009 — Percentage Points vs Percentage Change`

Core idea:

Distinguish percentage-point difference from relative percentage change.

Example:

A rate rising from `40%` to `50%` increases by `10 percentage points`, but the relative increase is `25%`.

Formulas:

- `percentagePointDifference = newRate - oldRate`
- `relativeChangePercent = (newRate - oldRate) / oldRate × 100`

Required variables:

- `oldRate`
- `newRate`

Difficulty:

- Medium/Hard.

Important:

This CP is conceptually important. Keep language very clear.

Use contexts such as:

- pass percentage
- literacy rate
- attendance rate
- polling percentage
- defect rate
- market share

Do not make it too statistical or too advanced.

---

### `PCT-CP-010 — Cross-Base Percentage Comparison`

Core idea:

Compare percentages taken on different bases.

Example:

- A scored `60%` of `500`.
- B scored `70%` of `400`.
- Compare actual marks.

Formulas:

- `actualValue1 = baseValue1 × rate1 / 100`
- `actualValue2 = baseValue2 × rate2 / 100`
- `difference = |actualValue1 - actualValue2|`

Required variables:

- `rate1`
- `baseValue1`
- `rate2`
- `baseValue2`

Difficulty:

- Medium/Hard.

Important:

This CP should train students not to compare percentages directly when bases differ.

---

## Required type/task design

Use names matching local project conventions. The exact file structure may use `foundation/types.ts` re-exported from `types.ts`.

Suggested constants/types:

```ts
export const PCT_006_ARCHETYPE_ID = "PCT-006" as const;

export const PCT_006_CP_IDS = [
  "PCT-CP-001",
  "PCT-CP-002",
  "PCT-CP-003",
  "PCT-CP-004",
  "PCT-CP-005",
  "PCT-CP-006",
  "PCT-CP-007",
  "PCT-CP-008",
  "PCT-CP-009",
  "PCT-CP-010",
] as const;

export type Pct006TaskKind =
  | "directMoreThanComparison"
  | "directLessThanComparison"
  | "reverseBaseSwitchingComparison"
  | "differenceAsPercentageOfSelectedBase"
  | "ratioBasedPercentageComparison"
  | "requiredPercentageChangeToMatchTarget"
  | "compareAfterDifferentPercentageChanges"
  | "chainPercentageComparison"
  | "percentagePointsVsPercentageChange"
  | "crossBasePercentageComparison";

export type Pct006AnswerType =
  | "ABSOLUTE"
  | "PERCENT"
  | "COMPARISON"
  | "DIFFERENCE"
  | "RATIO";
```

Adapt these only if existing architecture requires a different enum shape.

---

## Variable vocabulary

Use a controlled vocabulary. Avoid creating many one-off variable names.

Primary variables:

- `percentageRate`
- `rate1`
- `rate2`
- `oldRate`
- `newRate`
- `baseValue`
- `value1`
- `value2`
- `ratioA`
- `ratioB`
- `baseValue1`
- `baseValue2`

Optional internal/evidence values:

- `difference`
- `greaterValue`
- `lowerValue`
- `finalValue1`
- `finalValue2`
- `actualValue1`
- `actualValue2`
- `percentagePointDifference`
- `relativeChangePercent`
- `combinedMultiplier`

Do not use placeholders in templates unless the parameter generator always supplies them.

---

## Content target

This chapter must be content-rich from the first implementation.

Minimum required English QL target:

- `10` CPs
- `50` English QLs per CP
- `500` English QL templates total

Do not stop at 20 QLs per CP.

If the implementation becomes too large for one safe pass, prioritize CPs 1–6 first, but the final deliverable should still target 500 English templates. Do not hand back a partial 200-template chapter unless there is a hard blocker.

---

## QL ID rules

Use a deterministic, stable, project-compatible QL ID scheme.

Before writing `question-language.en.json`, inspect PCT-002 to PCT-005 and follow the style that the runtime expects.

Requirements:

- Every QL ID must be stable.
- Every QL ID must be unique within its CP and compatible with existing lookup code.
- Do not reuse the same QL ID across different CPs if existing coverage/audit tooling expects global uniqueness.
- Do not change IDs after creating the task registry unless required.
- Include all referenced QL IDs in coverage targets if the existing architecture requires it.

If uncertain, prefer a simple global sequence such as:

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

But if existing code expects another convention, follow existing code.

---

## English stem style guide

The user is sensitive to robotic wording. Write natural, exam-like English.

Preferred style:

- short competitive-exam stems
- clear comparison base
- direct but not dry
- natural contexts from Indian aptitude exams
- no unnecessary story
- no artificial metadata language
- no repeated boilerplate sentence shells

Good stem style examples:

- `A's salary is {percentageRate}% more than B's salary. If B earns Rs. {baseValue}, find A's salary.`
- `Ravi scored {percentageRate}% less marks than Aman. If Aman scored {baseValue} marks, find Ravi's marks.`
- `The population of village A is {percentageRate}% higher than village B. If village B has {baseValue} people, find the population of village A.`
- `A is {percentageRate}% more than B. By what percent is B less than A?`
- `The incomes of A and B are in the ratio {ratioA}:{ratioB}. By what percent is A's income more than B's income?`
- `A scored {rate1}% of {baseValue1} marks, while B scored {rate2}% of {baseValue2} marks. Who scored more and by how many marks?`

Avoid dominant use of:

- `A worksheet asks...`
- `A data sheet says...`
- `A calculation says...`
- `A report mentions...`
- `A record shows...`
- `A register lists...`
- `A materials batch...`
- `A note says...`

These can appear occasionally only when they sound natural.

Avoid lower-quality phrasing:

- `Find how much percent...`
- `What is his less percentage...`
- `By what percentage less is...` when awkward
- `Calculate the same.`
- `Find it.`
- `The same is asked.`

Preferred comparison wording:

- `By what percent is A more than B?`
- `By what percent is B less than A?`
- `Find the percentage by which A exceeds B.`
- `Find the required percentage increase.`
- `Find the required percentage decrease.`
- `Compare their final values.`
- `Who has the higher value, and by how much?`

---

## QL diversity matrix

For each CP, write 50 QLs using structure diversity, not just noun swaps.

Recommended internal split per CP:

1. `10` direct exam/drill stems.
2. `10` person/marks/salary stems.
3. `10` price/population/production/business stems.
4. `10` reverse/target/base-switching stems.
5. `10` short table/report/data-style stems.

This split is a guide. Adjust where a CP needs different structures, but preserve richness and avoid cloning.

Every CP should include at least:

- 5 direct mathematical comparison stems
- 5 marks/exam stems
- 5 income/salary/business stems
- 5 population/production/stock stems
- 5 price/sales/cost stems
- 5 reverse or unknown-base stems where relevant
- 5 data/table/report-style stems where relevant
- 5 mixed but still single-concept comparison stems

Do not let one context dominate the CP.

---

## Context library

Use natural contexts such as:

- salary/income
- marks/exam scores
- population of towns/villages
- shop prices
- article prices
- sales targets
- production units
- factory output
- attendance
- branch performance
- stock/inventory
- votes/polling only if the skill is comparison, not full election application
- rent/expense only if the skill is comparison, not income-expenditure application
- machine output
- distance covered
- water/electricity usage
- school/class strength
- company revenue
- crop yield
- library books
- transport passengers

Do not overuse:

- worksheet
- register
- data sheet
- report
- record

Do not use mixture/concentration as a major context in PCT-006.

---

## Placeholder discipline

Every placeholder in a template must be supplied by the generator.

No template may include a placeholder that is missing from the corresponding task registry/parameter generator.

No generator variable should be unused across all QLs.

Do not change placeholder names casually.

Before final handoff, run or simulate a placeholder audit:

- collect all placeholders used in `question-language.en.json`
- compare them to variables generated for each CP/task kind
- report missing/extra placeholders

---

## Solver requirements

The solver must handle all 10 task kinds.

Numerical handling:

- Avoid floating-point display noise.
- Use exact fraction/multiplier logic internally where feasible.
- Round display answers consistently, preferably to at most 2 decimal places when needed.
- Preserve integer answers where possible.
- For percentage answers like `16.666...`, display as `16.67%` unless existing project convention uses fractions.
- Evidence should include raw values and computed values.
- MathJax should show the key reasoning, not a huge derivation.

Comparison answers:

For CPs that compare two values, the answer may be string-like:

- `A is greater by 20`.
- `B is higher by Rs. 500`.
- `A is 25% more than B`.
- `Both are equal`.

Use existing answer formatting conventions from PCT-005 if available.

Do not hide comparison direction.

Bad answer:

- `20%`

Better answer:

- `A is 20% more than B` or `B is 20% less than A`, depending on the question.

---

## Validator requirements

Validator must check:

- required variables are present
- numeric values are finite
- rates are within realistic bounds
- denominator/base is non-zero
- less-than percentage is below 100
- ratio values are positive
- generated comparison does not become invalid unless equality is intentionally allowed
- answer is not `NaN`, `Infinity`, or empty
- stem rendering does not leave unresolved placeholders

Special cases:

- CP-008 may intentionally produce equality; if so, solver and wording must support equality.
- CP-009 oldRate must not be zero for relative percentage change.
- CP-002 percentageRate must be less than 100.
- CP-005 ratioA and ratioB must not be equal unless the question supports equality.

---

## Parameter generator requirements

The generator should choose values that make answers exam-friendly.

General rules:

- Prefer integer or one/two-decimal answers.
- Avoid awkward decimals unless the CP intentionally teaches base switching.
- Avoid unrealistic values.
- Avoid negative quantities.
- Avoid zero bases.
- Avoid less-than rates of 100 or more.
- Use Indian-exam-friendly values such as salaries, marks, population, prices, units, production counts.

Suggested values:

- `percentageRate`: 5, 10, 12, 12.5, 15, 20, 25, 30, 33.33, 40, 50, 60, 75, 100 where safe.
- For reverse base-switching, prefer ratio-derived pairs.
- `baseValue`: 100, 120, 150, 160, 200, 240, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 5000.
- `value1`, `value2`: choose pairs with clean difference percentages, e.g. 80/100, 100/125, 120/150, 150/200, 240/300, 400/500, 600/750.
- `ratioA:ratioB`: 5:4, 4:3, 3:2, 6:5, 7:5, 8:5, 9:5, 10:7, 11:8, 12:9.
- `oldRate`, `newRate`: 20/25, 25/30, 30/45, 40/50, 50/60, 60/75, 80/90.

If exact generation constraints already exist in the project, follow them.

---

## Explanation requirements

Follow the existing Explanation Standard V2.1 used in PCT-002 to PCT-005:

Every pedagogical statement should be immediately followed by a MathJax consequence beginning with `\Rightarrow`.

Avoid:

- formula dumps
- `Let x be...` as the default style
- long algebra-first explanations
- AI filler
- vague reasoning

Explanation style should be concise and exam-oriented.

Example for reverse base switching:

```text
A is 25% more than B, so A is 125% of B.
\Rightarrow A = \frac{125}{100}B

To compare B with A, take A as the base.
\Rightarrow \frac{B}{A} = \frac{100}{125} = \frac{4}{5}

So B is 80% of A.
\Rightarrow B is 20% less than A
```

Create explanations that are reusable per CP/task kind, not 500 separate verbose explanations unless the architecture requires it.

---

## Required files inside PCT-006

Create the folder:

`artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-006/`

Expected files, following local chapter conventions:

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
- `pct-006.test.ts`

If the PCT-005 scaffold has a `foundation/` folder, mirror that structure.

---

## Hindi/Punjabi handling

Do not deeply machine-translate 500 English templates.

If architecture requires Hindi/Punjabi files to exist:

- create structurally valid files
- keep them minimal/safe according to existing project conventions
- document that full Hindi/Punjabi authoring is deferred to a human-authored language pass

Do not pretend Hindi/Punjabi are production-complete if they are placeholders.

---

## Reports to create

Create these report files under `Percentage/`:

1. `pct-006-implementation-report.md`
2. `pct-006-content-audit.md`

### `pct-006-implementation-report.md` must include

- scope
- files created
- files modified outside PCT-006, if any
- CP list
- task kinds
- answer types
- variable vocabulary
- solver summary
- validator summary
- generator summary
- QL count summary
- explanation summary
- verification commands attempted
- verification results
- known caveats
- next recommended action

### `pct-006-content-audit.md` must include

- exact duplicate template count
- affected rows
- CP spread of duplicates
- high-confidence near-clone families
- top weak stems
- language naturalness notes
- CP-level content richness score
- whether the chapter is manual-review-ready
- recommended next action

---

## Built-in content audit requirements

Before handoff, audit the English QLs.

### Exact duplicate audit

Count exact duplicate `template` strings in `question-language.en.json`.

Acceptable:

- `0` exact duplicate groups.

If exact duplicates exist, fix them before final handoff unless there is a hard reason not to.

### Near-clone audit

Flag high-confidence near-clone families, especially if many templates only differ by one noun.

Do not overstate normal conceptual similarity as a blocker.

Recommended judgement:

- Exact duplicates = blocker.
- Robotic five-way shell clones = should fix.
- Same mathematical family with natural variation = acceptable.

### Weak-stem audit

Flag stems that sound unnatural, robotic, or meta.

Examples of weak patterns:

- `A worksheet asks...`
- `A data sheet says...`
- `A calculation says...`
- `A record mentions...`
- `A materials batch...`

Rewrite the worst ones before handoff.

---

## Verification requirements

Run what is practical in the local environment.

At minimum attempt:

```bash
cd artifacts/api-server
node -e "JSON.parse(require('fs').readFileSync('src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-006/question-language.en.json','utf8')); console.log('PCT-006 question-language.en.json JSON OK')"
```

Also parse:

- `task-registry.library.json`
- `variable-ranges.library.json`
- `coverage-targets.library.json`
- `distribution-targets.library.json`
- `explanation.en.json`
- Hindi/Punjabi JSON files if created

Run project checks if available and practical:

- TypeScript typecheck
- PCT-006 test
- coverage auditor
- sample generation
- renderer check

If CodexPro shell fails with `spawn bash ENOENT`, state that clearly in the report and provide exact local commands for the user.

---

## Acceptance criteria

PCT-006 first implementation is acceptable only if:

- `PCT-006/` folder exists.
- 10/10 CPs are implemented.
- 500 English QLs exist, ideally 50 per CP.
- All QL templates have natural exam-like wording.
- Exact duplicate template count is 0.
- High-confidence clone families are documented and not severe.
- Solver handles all 10 task kinds.
- Validator handles all 10 task kinds.
- Parameter generator supplies all placeholders.
- JSON parse passes for all new JSON files.
- Exports/routing are wired if required by existing architecture.
- No unnecessary changes are made to PCT-001 to PCT-005.
- Implementation report is created.
- Content audit report is created.

---

## What not to do

Do not:

- stop at 20 QLs per CP
- create only a blueprint
- turn PCT-006 into mixture/concentration
- implement PCT-007 at the same time
- copy PCT-005 content and rename it
- create 500 robotic noun-swap templates
- leave exact duplicate templates
- leave unresolved placeholders
- deeply machine-translate Hindi/Punjabi
- edit PCT-001 to PCT-005 content
- change shared runtime architecture without a true blocker
- claim tests passed if they were not run

---

## Suggested implementation sequence

1. Inspect PCT-005 structure and local export conventions.
2. Create `PCT-006` folder from the closest existing scaffold.
3. Rename all PCT-005 identifiers to PCT-006 identifiers.
4. Replace CP list, task kinds, variables, and formulas.
5. Implement `math.ts`, `solver.ts`, `validator.ts`, and `parameter-generator.ts`.
6. Create task registry and variable range libraries.
7. Create English explanation library.
8. Create 500 English QL templates using the CP × structure × context matrix.
9. Create minimal Hindi/Punjabi structural files if required.
10. Wire exports/router only if needed.
11. Run JSON parse checks.
12. Run typecheck/test/sample generation if possible.
13. Run exact duplicate and near-clone audits.
14. Rewrite weak/duplicate stems in the same pass.
15. Create implementation and content audit reports.
16. Final handoff with changed files and verification results.

---

## Final handoff format

When done, report:

- files created
- files modified outside PCT-006
- exact English QL count
- QL count per CP
- exact duplicate count
- verification commands run
- pass/fail results
- known caveats
- whether PCT-006 is ready for manual review

Use a clear status:

- `Ready for manual review`
- `Needs tiny patch`
- `Needs another implementation pass`

The desired outcome is:

`Ready for manual review`
