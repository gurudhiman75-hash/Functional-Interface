# PCT-CONTENT-009 — PCT-001 CP-005 and CP-006 Clone Cleanup

## Scope

Edited only:

- `PCT-001/question-language.en.json`

Created this report:

- `pct-content-009-pct001-cp005-cp006-cleanup-report.md`

No solver, validator, generator, pipeline, registry, schema, runtime, renderer, Hindi, Punjabi, or explanation files were edited.

## Cleanup target

This pass continued after completed `PCT-CONTENT-008` and focused on:

- `PCT-001` / `PCT-CP-005`
- `PCT-001` / `PCT-CP-006`

The cleanup addressed repeated clone shells in income/expenditure, election, school, population, alloy, mixture, solution, fruit drying, dilution, and evaporation families.

## Constraints preserved

- All QL IDs were preserved exactly.
- All difficulty labels were preserved exactly.
- Existing placeholder sets were preserved for each edited template.
- No runtime-facing structure changed.
- No multilingual files were changed.
- No math meaning was intentionally changed; edits are wording/context diversification only.

## CP-005 cleanup summary

### Income and expenditure families

Diversified repeated income/salary shells in:

- `PCT-QL-236`, `PCT-QL-336`, `PCT-QL-436`
- `PCT-QL-237`, `PCT-QL-337`, `PCT-QL-437`

The repeated direct household/man salary wording was replaced with office budget, coaching-centre account, family account, employee salary, monthly pay account, and worker salary contexts.

### Election families

Diversified repeated two-candidate and cancelled-vote shells in:

- `PCT-QL-238`, `PCT-QL-338`, `PCT-QL-438`
- `PCT-QL-239`, `PCT-QL-339`, `PCT-QL-439`
- `PCT-QL-247`, `PCT-QL-347`, `PCT-QL-447`

The repeated election wording was replaced with ward election, polling summary, college election, local poll, counting report, student-council election, and society-election contexts.

### School, marks, population, and literacy families

Diversified repeated direct shells in:

- `PCT-QL-240`, `PCT-QL-340`, `PCT-QL-440`
- `PCT-QL-241`, `PCT-QL-341`, `PCT-QL-441`
- `PCT-QL-242`, `PCT-QL-342`, `PCT-QL-442`
- `PCT-QL-243`, `PCT-QL-343`, `PCT-QL-443`
- `PCT-QL-244`, `PCT-QL-344`, `PCT-QL-444`

The repeated direct question shells were replaced with test, board exam, class register, enrolment, coaching batch, census list, town record, survey, assessment, literacy record, and panchayat data contexts.

### Family allocation and alloy families

Diversified repeated money-allocation and alloy shells in:

- `PCT-QL-245`, `PCT-QL-345`, `PCT-QL-445`
- `PCT-QL-246`, `PCT-QL-346`, `PCT-QL-446`

The repeated family and alloy wording was replaced with neutral family settlement, donation plan, metal sample, brass-mix record, and alloy-batch contexts.

## CP-006 cleanup summary

### Acid-mixture and salt-solution families

Diversified repeated mixture/solution shells in:

- `PCT-QL-248`, `PCT-QL-348`, `PCT-QL-448`
- `PCT-QL-250`, `PCT-QL-350`, `PCT-QL-450`

The repeated direct mixture wording was replaced with chemical tank, laboratory beaker, acid solution, tank, brine container, and salt-water mix contexts.

### Fruit and grape drying families

Diversified repeated drying shells in:

- `PCT-QL-149`, `PCT-QL-249`, `PCT-QL-349`, `PCT-QL-449`
- `PCT-QL-252`, `PCT-QL-352`, `PCT-QL-452`

The repeated fruit/grape drying wording was replaced with drying batch, mango drying, processor drying, fresh-to-dry preparation, drying register, and dry-grape-to-fresh-weight variants.

### Alcohol dilution and strengthening families

Diversified repeated alcohol solution shells in:

- `PCT-QL-251`, `PCT-QL-351`, `PCT-QL-451`
- `PCT-QL-253`, `PCT-QL-353`, `PCT-QL-453`

The repeated direct solution wording was replaced with chemist, dilution record, lab, bottle, and solution-sample contexts.

### Evaporation and alloy families

Diversified repeated evaporation/alloy shells in:

- `PCT-QL-254`, `PCT-QL-354`, `PCT-QL-454`
- `PCT-QL-255`, `PCT-QL-355`, `PCT-QL-455`

The repeated sugar-solution and alloy wording was replaced with sugar solution, syrup mixture, sugar-water batch, materials batch, copper-zinc batch, and remaining-metal contexts.

## Editorial notes

- The cleanup reduced exact repeated stems within the targeted CP-005 and CP-006 families.
- Contexts were kept exam-safe and concise.
- Placeholder order sometimes changed only where the same placeholders remained present and the mathematical relationship stayed equivalent.
- A few baseline templates were intentionally left as anchors while clone variants were diversified around them.

## Verification notes

Manual review confirmed the edited region still retains the original JSON object structure, QL IDs, difficulty fields, and required placeholders.

Runtime validation was not run in this CodexPro session because prior shell verification in this Windows environment failed with `spawn bash ENOENT`. Suggested local checks:

```bat
cd C:\Users\gurbaj\Downloads\f\artifacts\api-server
pnpm run typecheck
```

Then run the relevant PCT-001 generation/audit test if available in your local workflow.
