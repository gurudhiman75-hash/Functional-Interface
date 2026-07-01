# PCT-CONTENT-002 Phase B Report

## Scope

Implemented Phase B of the Percentage English content expansion plan.

Order followed:

1. PCT-005
2. PCT-003
3. PCT-004
4. PCT-002
5. PCT-001

This was a content-enrichment pass. No solver, validator, reasoning graph, explanation renderer, CP definition, or platform infrastructure redesign was performed.

## Runtime Rule Implemented

English selection now uses English QL coverage independently.

```text
English generation -> all English QLs
Hindi/Punjabi generation -> shared en/hi/pa QL subset
```

For multilingual triplets, `runPct00xForLanguages` now seeds from the shared subset so Hindi/Punjabi are not forced to render English-only QLs before the human-authored language phase.

## Chapter Summary

| Chapter | Raw English QLs before | Raw English QLs after | New English QLs | Estimated effective families after | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| PCT-005 | 20 | 50 | 30 | 38-40 | Expanded |
| PCT-003 | 20 | 50 | 30 | 38-40 | Expanded |
| PCT-004 | 20 | 50 | 30 | 38-40 | Expanded |
| PCT-002 | 20 | 50 | 30 | 38-40 | Expanded |
| PCT-001 | 350 | 350 | 0 | ~90 | Activated existing English breadth |

PCT-001 already exceeded the Phase B effective-family target, so no new PCT-001 QLs were added. The change there is runtime activation of the existing English expansion.

---

# PCT-005 — Successive Percentage Change

## New English QLs added

30 new English QLs: `PCT-QL-021` through `PCT-QL-050`.

## Effective educational family estimate

Before: ~11 effective families.

After: ~38-40 effective families.

## New structures introduced

- Timeline-style successive change
- Stock clearance report
- Depreciation schedule
- Campaign rise/fall story
- Spreadsheet multiplier replacement
- Accounting adjustment note
- Reverse two-stage recovery
- Branch/product/school comparison
- Month-wise sales log
- Inventory movement report
- Turnout/revenue contextual chain

## New contexts introduced

- Warehouse inventory
- Website traffic
- Sales and revenue
- Machine depreciation
- Active users/subscribers
- Market price revisions
- Factory output
- Admissions
- Turnout
- Branch stocks
- Product prices
- School admissions

## Answer archetypes covered

- Final value
- Original value
- Net percentage change
- Equivalent multiplier
- Difference between final values
- Multi-stage final value

## Duplicate-risk assessment

Reduced from critical to medium-low. The chapter still uses the same underlying CP mathematics, but the stem surfaces now create distinct exam situations rather than generic `{wholeLabel}` shells.

## Files modified

- `PCT-005/question-language.en.json`
- `PCT-005/task-registry.library.json`
- `PCT-005/foundation/parameter-generator.ts`
- `PCT-005/foundation/pipeline.ts`
- `PCT-005/pct-005.test.ts`

---

# PCT-003 — Percentage Increase

## New English QLs added

30 new English QLs: `PCT-QL-021` through `PCT-QL-050`.

## Effective educational family estimate

Before: ~12 effective families.

After: ~38-40 effective families.

## New structures introduced

- Electricity consumption report
- Website campaign report
- Government crop-yield revision
- Bonus/commission-style increase amount
- Reverse price revision
- Inventory before-addition recovery
- Spreadsheet multiplier prompt
- Two-year enrollment timeline
- Factory automation growth
- Sales/visitor compounded growth report
- Branch/district/product comparison
- Target memo and target-vs-current story
- Forecast growth bridge

## New contexts introduced

- Electricity usage
- Website visitors
- Crop yield
- Bonus and payroll
- Railway/transport seats
- Dairy production
- Warehouse stock
- Factory production
- Subscriptions
- Sales index
- District population
- Product prices
- Department headcount
- Passenger reports

## Answer archetypes covered

- Final value after increase
- Increase amount only
- Original value from increased value
- Multiplier
- Net increase percentage
- Difference after separate increases
- Required percentage increase
- Repeated growth final value

## Duplicate-risk assessment

Reduced from very high to medium-low. PCT-003 now has realistic increase-native structures instead of salary/population wrappers only.

## Files modified

- `PCT-003/question-language.en.json`
- `PCT-003/task-registry.library.json`
- `PCT-003/foundation/parameter-generator.ts`
- `PCT-003/foundation/pipeline.ts`
- `PCT-003/pct-003.test.ts`

---

# PCT-004 — Percentage Decrease

## New English QLs added

30 new English QLs: `PCT-QL-021` through `PCT-QL-050`.

## Effective educational family estimate

Before: ~12 effective families.

After: ~38-40 effective families.

## New structures introduced

- Stock clearance report
- Rainfall decline statement
- Depreciation note
- Discount amount prompt
- Attendance fall report
- Crop loss report
- Reverse discount and reverse stock recovery
- Spreadsheet reduction multiplier
- Two-round stock clearance
- Subscriber decline
- Retention decline report
- Cost-cutting memo
- Depreciation schedule

## New contexts introduced

- Stock clearance
- Rainfall
- Machine depreciation
- Marked price and discount
- Attendance/absenteeism
- Crop yield loss
- Warehouse dispatch
- Price index
- Employees
- Subscribers
- School attendance
- Electricity usage

## Answer archetypes covered

- Remaining value
- Decrease amount only
- Original value from decreased value
- Decrease multiplier
- Net percentage decrease
- Difference after separate decreases
- Required percentage decrease
- Repeated decline final value

## Duplicate-risk assessment

Reduced from very high to medium-low. PCT-004 now has decrease-native contexts and does not merely mirror PCT-003 wording.

## Files modified

- `PCT-004/question-language.en.json`
- `PCT-004/task-registry.library.json`
- `PCT-004/foundation/parameter-generator.ts`
- `PCT-004/foundation/pipeline.ts`
- `PCT-004/pct-004.test.ts`

---

# PCT-002 — Percentage Recovery, Share, and Distribution

## New English QLs added

30 new English QLs: `PCT-QL-021` through `PCT-QL-050`.

## Effective educational family estimate

Before: ~15 effective families.

After: ~38-40 effective families.

## New structures introduced

- Hospital report
- Election booth report
- Warehouse audit
- Payroll file
- School enrollment sheet
- Rainfall collection report
- Defect report
- Attendance register
- Transport report
- Ledger/allocation memo
- Ratio-in-context prompts
- Battery/stock complement prompts
- Poll/hospital/crop percentage-point comparison
- Department table
- Survey/election/school missing percentage
- Multi-category distribution report

## New contexts introduced

- Hospital patients
- Election booth/voters
- Warehouse inventory
- Payroll
- School enrollment
- Rainfall
- Defective units
- Attendance
- Transport seats/passengers
- Land division
- Battery capacity
- Stock sold/unsold
- Poll results
- Crop area
- District report

## Answer archetypes covered

- Whole from known part
- Another percentage from known percentage
- Percentage from part and whole
- Reverse percentage mapping
- Ratio share as percentage
- Complement percentage
- Percentage-point difference
- Partition count/amount
- Missing percentage
- Multi-category count/amount

## Duplicate-risk assessment

Reduced from high to medium-low. The chapter now has CP-balanced recovery, conversion, complement, and distribution situations rather than two thin shells per CP.

## Files modified

- `PCT-002/question-language.en.json`
- `PCT-002/task-registry.library.json`
- `PCT-002/foundation/parameter-generator.ts`
- `PCT-002/foundation/pipeline.ts`
- `PCT-002/pct-002.test.ts`

---

# PCT-001 — Foundational Percentage

## New English QLs added

0.

## Effective educational family estimate

Before: ~90 effective families.

After: ~90 effective families.

## Reason

PCT-001 already exceeds the Phase B target of 35-40 effective families. Adding more raw QLs would increase duplicate pressure. The correct Phase B action was to activate the existing English breadth while keeping Hindi/Punjabi on the shared subset.

## Changes made

- English selection now uses all English QLs.
- Hindi/Punjabi selection continues to use the shared subset.
- Multilingual triplet generation now seeds from the shared subset.

## Duplicate-risk assessment

Still high because PCT-001 has many wrapper-style rows. PCT-CONTENT-003 should classify and de-duplicate effective families before any further PCT-001 additions.

## Files modified

- `PCT-001/parameter-generator.ts`
- `PCT-001/pipeline.ts`

---

# English-only Activation Summary

Modified parameter selection in:

- `PCT-001/parameter-generator.ts`
- `PCT-002/foundation/parameter-generator.ts`
- `PCT-003/foundation/parameter-generator.ts`
- `PCT-004/foundation/parameter-generator.ts`
- `PCT-005/foundation/parameter-generator.ts`

Modified multilingual triplet generation in:

- `PCT-001/pipeline.ts`
- `PCT-002/foundation/pipeline.ts`
- `PCT-003/foundation/pipeline.ts`
- `PCT-004/foundation/pipeline.ts`
- `PCT-005/foundation/pipeline.ts`

# Validation Results

## Static checks completed

- Confirmed PCT-002 through PCT-005 have language-aware QL selection.
- Confirmed PCT-001 English selection uses the existing English QL library.
- Confirmed PCT-002 taskKind names were corrected back to the existing runtime names:
  - `anotherPercentageFromKnownPercentage`
  - `percentageFromPartAndWhole`
  - `complementaryPercentage`
  - `multiCategoryPercentageDistribution`
- Confirmed no remaining shortened PCT-002 taskKind names were found by search.
- Updated PCT-002 through PCT-005 audit expectations from 20 to 50 English QLs.

## Command validation

Attempted:

```text
pnpm run typecheck
```

Result:

```text
Blocked: CodexPro bash runner failed to start with spawn bash ENOENT.
```

Because the local command runner could not start, TypeScript typecheck, bundled chapter tests, render verification, and generation batch commands were not executable from this CodexPro session.

# Files Modified in Phase B

## Content libraries

- `PCT-002/question-language.en.json`
- `PCT-003/question-language.en.json`
- `PCT-004/question-language.en.json`
- `PCT-005/question-language.en.json`

## Task registries

- `PCT-002/task-registry.library.json`
- `PCT-003/task-registry.library.json`
- `PCT-004/task-registry.library.json`
- `PCT-005/task-registry.library.json`

## Runtime selection / aliases

- `PCT-001/parameter-generator.ts`
- `PCT-001/pipeline.ts`
- `PCT-002/foundation/parameter-generator.ts`
- `PCT-002/foundation/pipeline.ts`
- `PCT-003/foundation/parameter-generator.ts`
- `PCT-003/foundation/pipeline.ts`
- `PCT-004/foundation/parameter-generator.ts`
- `PCT-004/foundation/pipeline.ts`
- `PCT-005/foundation/parameter-generator.ts`
- `PCT-005/foundation/pipeline.ts`

## Tests

- `PCT-002/pct-002.test.ts`
- `PCT-003/pct-003.test.ts`
- `PCT-004/pct-004.test.ts`
- `PCT-005/pct-005.test.ts`

## Report

- `pct-content-002-phase-b-report.md`

# Remaining Weaknesses Before PCT-CONTENT-003

1. PCT-001 still needs a true effective-family classifier and duplicate-pressure audit.
2. PCT-002 through PCT-005 should be reviewed by sampling generated English questions once the local runner is available.
3. PCT-CONTENT-003 should measure duplicate pressure using rendered stems, not raw template counts.
4. Human-authored Hindi/Punjabi should not begin until PCT-CONTENT-003 confirms the English families are stable.

# Recommendation

Proceed to PCT-CONTENT-003 only after local test/typecheck execution is available and the expanded English stems are sampled. The content breadth target is now met for PCT-002 through PCT-005, and PCT-001 is activated without adding more duplicate-prone raw volume.
