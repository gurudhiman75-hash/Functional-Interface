# PCT-007 SSC-Realism Editorial Review

## Scope

Reviewed:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/question-language.en.json`
- Existing implementation and content-audit reports for technical status

This review is editorial only. No solver, validator, generator, registry, runtime, test, Hindi, Punjabi, or PCT-001 to PCT-006 files were reviewed for changes in this pass.

## Technical Baseline

The committed implementation report records:

- JSON parse: `OK`
- CP count: `10`
- English QL count: `500`
- Per-CP counts: `50` each
- Exact duplicate English template groups: `0`
- Registry entries: `500`
- Placeholder parity failures: `0`
- Representative unresolved rendered-stem failures: `0`
- Required-variable failures: `0`
- Bundled PCT-007 test: `PCT-007 implementation test passed.`

Technical status is therefore good enough to proceed to editorial polish.

## Overall Verdict

`Needs small editorial polish before manual question-bank review.`

PCT-007 is implemented and technically verified, but the English library still has multiple SSC-realism and wording issues. These are not solver/runtime problems. They are JSON stem polish issues, mainly caused by patterned noun-swaps in a few CPs.

Recommended next action:

`Do a focused English-only editorial polish pass on question-language.en.json, then rerun JSON parse, exact duplicate audit, placeholder audit, and bundled PCT-007 test.`

## CP-Level Realism Scores

| CP | Topic | Score | Notes |
|---|---|---:|---|
| PCT-CP-001 | Income, Expenditure, Savings | 4/5 | Exam-like and clear, but highly patterned by profession noun-swap. Acceptable with optional light variety polish. |
| PCT-CP-002 | Marks, Pass-Fail, Exam Scores | 4/5 | Strong exam relevance. Repetitive but conceptually clean. |
| PCT-CP-003 | Election, Votes, Valid-Invalid Votes | 4/5 | Good SSC-style contexts. Repetition acceptable. |
| PCT-CP-004 | Population, Production, Consumption | 2.5/5 | Increase/decrease stems are fine, but `used or consumed` is applied to unsuitable subjects like population and school strength. Needs polish. |
| PCT-CP-005 | Mixture and Concentration Basics | 3.5/5 | Boundary is correct, no alligation. Some contexts are tautological or artificial, such as paint mixture containing paint and syrup mixture containing syrup. |
| PCT-CP-006 | Evaporation, Drying, Composition Change | 3.5/5 | Conceptually correct. Needs grammar fixes around wet grain and some repeated phrasing. |
| PCT-CP-007 | Tax, Discount, Commission, Charges | 4/5 | Good boundary control; no full profit-loss drift. Some `tax or charge` stems are generic but usable. |
| PCT-CP-008 | Error, Miscalculation, Percentage Error | 2/5 | Main weak area. Several stems use artificial `recorded/measured/value entry` shells, and the bill-based family creates nonsensical rupee bills from weight, population, marks, stock, etc. Needs focused rewrite. |
| PCT-CP-009 | Replacement / Repeated Percentage Application | 3.5/5 | Boundary is correct; no mixture replacement/alligation. Repetitive but acceptable. Could use small wording variety. |
| PCT-CP-010 | Mini DI / Mixed Percentage Caselets | 4/5 | Mostly natural, standalone, and within mini-caselet limits. Good for this stage. |

## Weak Stem List

### PCT-CP-004: unsuitable `used or consumed` wording

Target ranges:

- `PCT-QL-181` to `PCT-QL-190`
- `PCT-QL-191` to `PCT-QL-200`

Problem:

These stems use a common shell:

- `If {percentageRate}% of it is used or consumed, find the quantity used.`
- `If {percentageRate}% of it is used or consumed, find the quantity remaining.`

This is acceptable for electricity, water supply, stock, milk supply, grain stock, and passenger count in some contexts, but it is unnatural or wrong for:

- population of a town
- production of a factory
- strength of a school
- crop output of a farm

Examples needing rewrite:

- `PCT-QL-181`: population cannot be `used or consumed`
- `PCT-QL-182`: production is not naturally `used or consumed` in this phrasing
- `PCT-QL-186`: school strength cannot be `used or consumed`
- `PCT-QL-187`: crop output can be sold/used, but not generic `used or consumed`
- `PCT-QL-191` to `PCT-QL-200`: same issue for remaining-quantity versions

Suggested fix:

Use context-specific verbs:

- population: `If {percentageRate}% of the people move away...`
- production: `If {percentageRate}% of the units are dispatched/sold...`
- electricity: `If {percentageRate}% is consumed...`
- stock: `If {percentageRate}% is issued/sold...`
- water supply: `If {percentageRate}% is used...`
- school strength: `If {percentageRate}% of the students are absent/leave...`
- crop output: `If {percentageRate}% is sold...`

### PCT-CP-005: tautological mixture contexts

Target IDs:

- `PCT-QL-206`
- `PCT-QL-207`
- likely matching families in `PCT-QL-216` to `PCT-QL-250`

Problems:

- `A paint mixture contains {componentRate}% paint...` is tautological.
- `A syrup mixture contains {componentRate}% syrup...` is tautological.

Suggested fix:

Use clearer component names:

- paint mixture: pigment/thinner/base
- syrup solution: sugar/water
- fertilizer mix: nutrient/base material
- metal blend: copper/other metal

### PCT-CP-006: grammar and wording issues

Target IDs:

- `PCT-QL-257`
- `PCT-QL-267`
- likely `PCT-QL-297`

Problem:

- `Wet grain contain...` should be `Wet grain contains...` or `Wet grains contain...`.
- For wet grain, avoid saying `fresh weight`; use `initial weight` or `wet weight`.

Suggested fix:

- `Wet grain contains {waterRate}% water. After drying, water becomes {dryWaterRate}% of the final weight. If the wet weight is {baseValue} kg, find the final dry weight.`

### PCT-CP-008: artificial error/miscalculation shells

Target ranges:

- `PCT-QL-351` to `PCT-QL-380`
- `PCT-QL-381` to `PCT-QL-390`
- `PCT-QL-391` to `PCT-QL-400`

Problems:

1. Repeated artificial shells:
   - `A value is wrongly taken...`
   - `A value is recorded...`
   - `A value is measured...`
   - `A weight entry...`
   - `A marks entry...`

2. The `PCT-QL-381` to `PCT-QL-390` family is the weakest. Examples:
   - `A bill based on a weight entry is prepared as Rs. {wrongValue} instead of Rs. {correctValue}.`
   - `A bill based on a population figure is prepared as Rs. {wrongValue} instead of Rs. {correctValue}.`
   - `A bill based on a marks entry is prepared as Rs. {wrongValue} instead of Rs. {correctValue}.`

These are unnatural because weight/population/marks/stock are not normally converted into a rupee bill in this wording.

Suggested fix:

Rewrite the family into realistic error contexts while preserving placeholders and solve modes:

- `A bill is prepared as Rs. {wrongValue} instead of the correct amount Rs. {correctValue}. Find the percentage error.`
- `A weight is entered as {wrongValue} kg instead of {correctValue} kg. Find the percentage error.`
- `A population figure is entered as {wrongValue} instead of {correctValue}. Find the percentage error.`
- `Marks are entered as {wrongValue} instead of {correctValue}. Find the percentage error.`
- `Stock is recorded as {wrongValue} items instead of {correctValue} items. Find the percentage error.`

For `PCT-QL-391` to `PCT-QL-400`, prefer `recorded` or `entered` over `measured` except in true measurement contexts.

## Robotic Shell List

High-confidence robotic/patterned shells:

- CP-001: profession noun-swap pattern across `PCT-QL-001` to `PCT-QL-050`
- CP-002: exam-name noun-swap pattern across `PCT-QL-051` to `PCT-QL-100`
- CP-004: context noun-swap pattern across `PCT-QL-151` to `PCT-QL-200`
- CP-008: error-entry noun-swap pattern across `PCT-QL-351` to `PCT-QL-400`
- CP-009: depletion noun-swap pattern across `PCT-QL-401` to `PCT-QL-450`

Only CP-004 and CP-008 require immediate polish. The others are acceptable for a first full implementation, though later manual review may add more variety.

## Ambiguity List

No major formula ambiguity was found in the sampled review. Bases are usually explicit.

Watch items:

- CP-007 `tax or charge` stems are mathematically clear, but editorially generic.
- CP-008 `recorded/measured as above actual value` is formula-clear, but context-light.

## Boundary Drift Check

- CP-005 direct mixture/concentration only: pass
- CP-006 unchanged solid/solute drying/evaporation only: pass
- CP-007 tax/discount/commission/charge only: pass
- CP-009 repeated percentage removal/reduction/use only: pass
- CP-010 standalone single-question mini caselets only: pass

No implementation-boundary drift was found. The required next work is editorial, not architectural.

## Recommended Editorial Patch

Do a focused English-only polish pass on:

1. `PCT-QL-181` to `PCT-QL-200`
2. `PCT-QL-206`, `PCT-QL-207`, and matching related mixture families where tautological wording appears
3. `PCT-QL-257`, `PCT-QL-267`, and likely `PCT-QL-297`
4. `PCT-QL-351` to `PCT-QL-400`, especially `PCT-QL-381` to `PCT-QL-390`

Constraints for the patch:

- Edit only `PCT-007/question-language.en.json`
- Do not change QL IDs
- Do not change CP mapping
- Do not change placeholders
- Do not change task registry, solver, validator, generator, runtime, tests, Hindi, or Punjabi
- Preserve 500 English QLs and 50 per CP
- Keep exact duplicate English template groups at 0
- Rerun JSON parse, duplicate audit, placeholder audit, and bundled PCT-007 test

## Final Call

`Needs tiny editorial polish.`

PCT-007 does not need another implementation pass. It should not yet be marked ready for manual question-bank review because CP-004 and CP-008 contain enough weak wording to affect student-facing quality.

## Final Editorial Polish

- Files changed:
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/question-language.en.json`
  - `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-007-ssc-realism-review.md`
- Target ranges patched:
  - `PCT-QL-181` to `PCT-QL-200`
  - `PCT-QL-206`, `PCT-QL-207`, and related CP-005 families through `PCT-QL-250`
  - `PCT-QL-257`, `PCT-QL-267`, `PCT-QL-297`
  - `PCT-QL-351` to `PCT-QL-400`
- JSON parse result:
  - Passed
- QL count result:
  - CP count = `10`
  - Total English QLs = `500`
  - Per-CP count = `50` for every CP
- Duplicate audit result:
  - Exact duplicate English template groups = `0`
- Placeholder audit result:
  - Registry placeholder mismatch count = `0`
  - Cross-language placeholder mismatch count = `0`
  - Rendered-stem unresolved placeholder count = `0`
- Bundled test result:
  - Build command passed:
    - `C:\Users\gurbaj\Downloads\Functional-Interface\Functional-Interface\artifacts\api-server\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/pct-007.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-007.test.mjs`
  - Runtime command passed:
    - `node dist/quant-v4/pct-007.test.mjs`
  - Output:
    - `PCT-007 implementation test passed.`
- Final status:
  - `PCT-007 - Ready for manual question-bank review`
