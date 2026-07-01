# PCT-CONTENT-008 - PCT-001 CP-003 and CP-004 Clone Cleanup Report

## Scope

This pass continued the post-audit cleanup of `PCT-001/question-language.en.json` after PCT-CONTENT-007.

The goal was to reduce five-way clone pressure in the next two high-priority blocks:

- `PCT-001/PCT-CP-003`
- `PCT-001/PCT-CP-004`

This was an editorial-only pass.

## Files edited

- `PCT-001/question-language.en.json`
- `pct-content-008-pct001-cp003-cp004-cleanup-report.md`

## Guardrails followed

No solver, validator, parameter generator, reasoning graph, pipeline, registry, schema, contract, runtime, explanation renderer, Hindi, or Punjabi files were intentionally modified.

Existing QL IDs were preserved.

Existing placeholders were preserved.

No new QL IDs were added.

No broad JSON formatting was performed.

## PCT-001 / PCT-CP-003 cleanup

### CP touched

- `PCT-001/PCT-CP-003`

### QL IDs touched

- `PCT-QL-220`
- `PCT-QL-320`
- `PCT-QL-420`
- `PCT-QL-221`
- `PCT-QL-321`
- `PCT-QL-421`
- `PCT-QL-222`
- `PCT-QL-322`
- `PCT-QL-422`
- `PCT-QL-223`
- `PCT-QL-323`
- `PCT-QL-423`
- `PCT-QL-224`
- `PCT-QL-324`
- `PCT-QL-424`
- `PCT-QL-225`
- `PCT-QL-325`
- `PCT-QL-425`
- `PCT-QL-226`
- `PCT-QL-326`
- `PCT-QL-426`
- `PCT-QL-227`
- `PCT-QL-327`
- `PCT-QL-427`

### Clone families reduced

The following repeated shells were diversified:

1. Two successive increases of `{rate1}%` and `{rate2}%`
2. Population/town growth over two years
3. Rise-then-fall total change
4. Price rise followed by price reduction
5. Two-year growth from an initial value
6. Yearly depreciation from an initial value
7. Rectangle length/breadth area increase
8. Square side increase area change

### New editorial directions introduced

- branch count review
- school enrolment record
- passenger monthly record
- district household survey
- cattle census
- library membership record
- ticket booking/cancellation note
- stock register
- website traffic note
- bill revision
- sale circular
- tax note
- subscriber record
- electricity-use record
- vehicle-count record
- vehicle value record
- warehouse asset record
- machine insurance record
- farm plot record
- warehouse floor plan
- sports ground layout
- square garden
- square tile design
- square floor plan

## PCT-001 / PCT-CP-004 cleanup

### CP touched

- `PCT-001/PCT-CP-004`

### QL IDs touched

- `PCT-QL-228`
- `PCT-QL-328`
- `PCT-QL-428`
- `PCT-QL-229`
- `PCT-QL-329`
- `PCT-QL-429`
- `PCT-QL-230`
- `PCT-QL-330`
- `PCT-QL-430`
- `PCT-QL-231`
- `PCT-QL-331`
- `PCT-QL-431`
- `PCT-QL-232`
- `PCT-QL-332`
- `PCT-QL-432`
- `PCT-QL-233`
- `PCT-QL-333`
- `PCT-QL-433`
- `PCT-QL-234`
- `PCT-QL-334`
- `PCT-QL-434`
- `PCT-QL-235`
- `PCT-QL-335`
- `PCT-QL-435`

### Clone families reduced

The following repeated shells were diversified:

1. Sugar price increase and same expenditure
2. Petrol price decrease and same cost
3. Rectangle length increase and same area
4. Speed increase and same distance time reduction
5. Price increase followed by restoring reduction
6. Tax reduction and sales increase revenue change
7. Working hours increase and same total bill
8. Circle radius decrease and area decrease

### New editorial directions introduced

- household expense note
- ration-card calculation
- kitchen budget note
- fuel budget
- travel allowance note
- route-cost record
- field layout
- warehouse layout
- sports ground plan
- train schedule
- delivery route note
- bus timetable
- shop notice
- tariff memo
- fee schedule
- ticketing notice
- market report
- shop revenue note
- payroll sheet
- labour notice
- contractor bill
- circular pond layout
- circular park record
- circular field plan

## Remaining PCT-001 priority work

PCT-001 still needs a later clone cleanup pass for:

- `PCT-001/PCT-CP-005`
- `PCT-001/PCT-CP-006`

Recommended next task:

`PCT-CONTENT-009 - PCT-001 CP-005 and CP-006 Clone Cleanup`

That pass should address income/election/school/alloy/mixture clone families and finish the highest-risk PCT-001 audit findings.

## Validation

Attempted to parse `PCT-001/question-language.en.json` with a local Node command after this pass.

The connector returned:

`spawn bash ENOENT`

So JSON validation remains pending in this connector session.
