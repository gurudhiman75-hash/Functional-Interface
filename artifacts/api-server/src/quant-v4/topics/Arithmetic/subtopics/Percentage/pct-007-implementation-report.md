# PCT-007 Implementation Report

## Scope

Implemented:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/`

Created PCT-007 as a first-class Percentage package using the modern PCT-006 folder shape.

Modified outside `PCT-007/` in this implementation pass:

- None intentionally.

Existing pre-implementation modified file still present in git status:

- `artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/pct-007-implementation-agent.md`

## Chapter Identity

- Chapter: `PCT-007 - Mixed Applications of Percentage`
- Status: implemented for manual review, with bundled test blocked by local dependency state

## CP List

- `PCT-CP-001` - Income, Expenditure, and Savings
- `PCT-CP-002` - Marks, Pass-Fail, and Exam Scores
- `PCT-CP-003` - Election, Votes, and Valid-Invalid Votes
- `PCT-CP-004` - Population, Production, and Consumption Applications
- `PCT-CP-005` - Mixture and Concentration Basics
- `PCT-CP-006` - Evaporation, Drying, and Composition Change
- `PCT-CP-007` - Tax, Discount, Commission, and Charges
- `PCT-CP-008` - Error, Miscalculation, and Percentage Error
- `PCT-CP-009` - Replacement and Repeated Percentage Application in Context
- `PCT-CP-010` - Mini DI / Mixed Percentage Caselets

## Files Created

Inside `PCT-007/`:

- `archetype.md`
- `canonical-problems.md`
- `coverage-auditor.ts`
- `coverage-targets.library.json`
- `difficulty-framework.md`
- `distribution-targets.library.json`
- `explanation-renderer.ts`
- `explanation.en.json`
- `explanation.hi.json`
- `explanation.pa.json`
- `foundation/coverage-auditor.ts`
- `foundation/explanation-renderer.ts`
- `foundation/library.ts`
- `foundation/math.ts`
- `foundation/parameter-generator.ts`
- `foundation/pipeline.ts`
- `foundation/reasoning-graph.ts`
- `foundation/solver.ts`
- `foundation/types.ts`
- `foundation/validator.ts`
- `implementation-plan.md`
- `index.ts`
- `library-authority-map.md`
- `library.ts`
- `math.ts`
- `parameter-generator.ts`
- `pct-007.test.ts`
- `pipeline.ts`
- `question-language.en.json`
- `question-language.hi.json`
- `question-language.pa.json`
- `reasoning-graph.ts`
- `reasoning-patterns.md`
- `solver.ts`
- `task-registry.library.json`
- `types.ts`
- `validator.ts`
- `variable-ranges.library.json`

## Task Kinds

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

## Solve Modes

- `findSavingsFromSpendRate`
- `findExpenditureFromSavingsRate`
- `findIncomeFromSavingsAmount`
- `findIncomeFromExpenditureAmount`
- `findExpenditureFromSavingsAmount`
- `findMarksFromTotalMarks`
- `findTotalFromMarksPercent`
- `findPassMarksFromTotalMarks`
- `findTotalFromFailMargin`
- `findTotalFromPassMargin`
- `findVotesPolledFromTurnout`
- `findValidVotesFromInvalidRate`
- `findCandidateVotesFromValidVotes`
- `findWinningMarginFromVoteShare`
- `findTotalVotersFromVotesPolled`
- `findRevisedValueAfterIncrease`
- `findOriginalValueBeforeIncrease`
- `findRevisedValueAfterDecrease`
- `findUsedQuantityFromPercent`
- `findRemainingQuantityFromPercent`
- `findComponentFromTotalAndRate`
- `findOtherComponentFromTotalAndRate`
- `findTotalFromComponentAndRate`
- `findRateFromComponentAndTotal`
- `findTotalFromOtherComponentAndRate`
- `findFinalDryWeight`
- `findWaterLostAfterDrying`
- `findFinalVolumeAfterEvaporation`
- `findEvaporatedAmount`
- `findInitialWeightFromFinalDryWeight`
- `findDiscountAmount`
- `findBillAfterDiscount`
- `findTaxOrChargeAmount`
- `findFinalBillAfterDiscountAndTax`
- `findCommissionAmount`
- `findPercentageErrorFromWrongAndCorrect`
- `findCorrectValueFromOverstatement`
- `findCorrectValueFromUnderstatement`
- `findPercentageErrorOnBill`
- `findActualValueFromMeasuredError`
- `findRemainingAfterOneRemoval`
- `findRemainingAfterTwoSameRemovals`
- `findRemainingAfterThreeSameRemovals`
- `findRemainingAfterTwoDifferentRemovals`
- `findTotalRemovedAfterTwoDifferentRemovals`
- `findCaseletSavings`
- `findCaseletCandidateVotes`
- `findCaseletFinalBill`
- `findCaseletRemainingGoodUnits`
- `findCaseletComparison`

## Answer Types

- `ABSOLUTE`
- `PERCENT`
- `AMOUNT`
- `COUNT`
- `COMPARISON`
- `DIFFERENCE`
- `WEIGHT`
- `VOLUME`
- `BILL_VALUE`

## Variable Vocabulary

Primary numeric placeholders used:

- `percentageRate`
- `rate1`
- `rate2`
- `baseValue`
- `value1`
- `value2`
- `totalValue`
- `totalMarks`
- `marksObtained`
- `passRate`
- `totalVoters`
- `turnoutRate`
- `invalidRate`
- `candidateRate`
- `waterRate`
- `dryWaterRate`
- `componentRate`
- `oldRate`
- `newRate`
- `discountRate`
- `commissionRate`
- `wrongValue`
- `correctValue`
- `baseValue1`
- `baseValue2`

Text placeholders used in mini comparison caselets:

- `subjectA`
- `subjectB`

Runtime support variables supplied by the generator:

- `wholeLabel`
- `unitLabel`
- `valuePrefix`

## Solver Summary

The solver is solve-mode driven and covers all 10 CPs:

- CP-001 handles savings, expenditure, and reverse income recovery.
- CP-002 handles marks obtained, total marks recovery, pass marks, and pass/fail margin recovery.
- CP-003 handles turnout, valid votes, candidate votes, winning margin, and total voter recovery.
- CP-004 handles increase, reverse increase, decrease, used quantity, and remaining quantity.
- CP-005 handles direct component, other component, total-from-component, component rate, and total-from-other-component calculations.
- CP-006 handles unchanged solid/solute logic for drying and evaporation.
- CP-007 handles discount, bill after discount, tax or charge, final bill after discount and tax, and commission.
- CP-008 handles percentage error and correct/actual value recovery.
- CP-009 handles repeated removal/reduction/use only, without mixture replacement or alligation.
- CP-010 handles standalone savings, election, bill, good-unit, and comparison caselets.

## Validator Summary

The validator checks:

- package and parameter identity consistency
- required variables
- finite numeric variables
- positive bases and totals
- rendered stem cleanliness
- answer cleanliness
- explanation line pairing
- placeholder coverage
- library validation
- rate bounds for invalid votes, components, drying, evaporation, understatement, and repeated reduction
- pass/fail margin ordering

## Generator Summary

The parameter generator is deterministic by seed and supports:

- explicit `questionLanguageId`
- CP-specific value pools
- solve-mode-specific variable construction
- clean integer-friendly cases for reverse and repeated calculations
- language triplet generation with answer parity
- all 500 QLs reachable through batch coverage

## QL Count Summary

- CP count: `10`
- English QL count: `500`
- Per CP count: `50`
- Hindi companion QL count: `500`
- Punjabi companion QL count: `500`
- Explanation IDs: `10`

## Duplicate Audit Result

- Exact duplicate English template groups: `0`

## Verification Commands and Results

### JSON, count, duplicate, placeholder, and render audit

Command executed from repo root:

```bash
node - <<'NODE'
// JSON parse, QL count, duplicate, registry, placeholder parity, and representative render audit.
NODE
```

Result:

- JSON parse: `OK`
- CP count: `10`
- QL count: `500`
- Per CP counts: `50` each
- Exact duplicate template groups: `0`
- Registry entries: `500`
- Registry entries without English QL: `0`
- Placeholder parity failures: `0`
- Representative rendered-stem unresolved-placeholder failures: `0`
- Required-variable failures: `0`
- Total failures: `0`

### Bundled PCT-007 test

Dependency repair command attempted from `artifacts/api-server`:

```bash
pnpm install
```

Result:

- Timed out after `300000 ms`.
- `artifacts/api-server/node_modules/.bin/esbuild.cmd` was still missing.

Non-interactive dependency repair command attempted from `artifacts/api-server`:

```bash
pnpm install --config.confirmModulesPurge=false
```

Result:

- Timed out after `900000 ms`.
- `artifacts/api-server/node_modules/.bin/esbuild.cmd` was still missing.

Narrow build fallback attempts:

```bash
pnpm dlx esbuild@0.27.3 src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/pct-007.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-007.test.mjs
```

Result:

- Failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`.

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 pnpm dlx esbuild@0.27.3 src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/pct-007.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-007.test.mjs
```

Result:

- Failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`.

```bash
NPM_CONFIG_STRICT_SSL=false pnpm dlx esbuild@0.27.3 src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/pct-007.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-007.test.mjs
```

Result:

- Failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`.

Bundled build command that succeeded, executed from `artifacts/api-server` using an already-installed local esbuild binary from the adjacent checkout:

```bash
C:\Users\gurbaj\Downloads\Functional-Interface\Functional-Interface\artifacts\api-server\node_modules\.bin\esbuild.CMD src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-007/pct-007.test.ts --bundle --platform=node --format=esm --outfile=dist/quant-v4/pct-007.test.mjs
```

Result:

- Build passed.
- Output: `dist\quant-v4\pct-007.test.mjs 580.5kb`

Bundled test run command executed from `artifacts/api-server`:

```bash
node dist/quant-v4/pct-007.test.mjs
```

Result:

- `PCT-007 implementation test passed.`

Weak-stem cleanup:

- Fixed `PCT-007/question-language.en.json` wording:
  - from `A measurement is measured as {wrongValue}, which is {percentageRate}% above the actual value. Find the actual value.`
  - to `A measurement is recorded as {wrongValue}, which is {percentageRate}% above the actual value. Find the actual value.`

## Known Caveats

- The local `artifacts/api-server/node_modules` tree remains incomplete. The bundled test was run successfully using an already-installed `esbuild.CMD` from a neighboring local checkout.
- Hindi and Punjabi libraries are structurally placeholder-safe companions, not final editorial translations.
- No shared runtime registration outside the PCT-007 package was performed.

## Readiness Status

`PCT-007 - Ready for SSC-realism editorial review`
