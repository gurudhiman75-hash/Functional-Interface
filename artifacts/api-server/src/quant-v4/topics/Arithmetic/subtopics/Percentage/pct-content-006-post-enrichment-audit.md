# PCT-CONTENT-006 - Post-Enrichment Editorial Audit

## Scope

Audited only:

- `PCT-001/question-language.en.json`
- `PCT-002/question-language.en.json`
- `PCT-003/question-language.en.json`
- `PCT-004/question-language.en.json`
- `PCT-005/question-language.en.json`

No JSON, solver, validator, pipeline, schema, runtime, explanation, Hindi, or Punjabi files were changed.

## Executive Summary

| File | Total stems | Exact duplicate groups | Duplicate rows affected | Main editorial risk |
| --- | ---: | ---: | ---: | --- |
| `PCT-001/question-language.en.json` | 350 | 62 | 265 | Large clone blocks, lower-case copies, old coaching-book shells |
| `PCT-002/question-language.en.json` | 50 | 2 | 4 | Better variety, but still shell repetition and two verbatim duplicates |
| `PCT-003/question-language.en.json` | 50 | 0 | 0 | No verbatim duplicates, but strong shell repetition around increase/original/multiplier prompts |
| `PCT-004/question-language.en.json` | 50 | 1 | 2 | Decrease file mirrors the same shell pattern too often; one verbatim duplicate remains |
| `PCT-005/question-language.en.json` | 50 | 0 | 0 | Best structure mix, but notation-heavy wording and repeated successive-change shells remain |

## Headline Findings

1. `PCT-001` is still the major risk surface. It contains five-way clone families across entire CP blocks, plus 45 stems that begin with lower-case words and read like accidental copy variants rather than intentional editorial alternates.
2. `PCT-002` to `PCT-005` are much better than `PCT-001`, but most "enrichment" is still surface-level. Many stems keep the same mathematical shell and only swap the noun field.
3. Exam-feel is strongest for SSC-style direct asks. Banking-data style and Punjab public-record style are still underrepresented outside a few bank statement, register, record, and note wrappers.
4. Formula-only prompts are still overused in percentage-conversion and multiplier chapters. They are serviceable for drills, but weak for bank-grade question-bank richness.
5. A few stems remain visibly non-natural or artificial, especially lower-case clones, `water flies away`, and sign-coded `+{rate}%` / `-{rate}%` wording.

## File-by-File Audit

### `PCT-001/question-language.en.json`

- The file still behaves like a template bank rather than an editorially differentiated question set.
- `PCT-CP-002` to `PCT-CP-006` are dominated by five-way verbatim duplicate families.
- `PCT-CP-001` looks diverse on the surface, but many contexts are just noun swaps on the same one-line direct shell.
- Lower-case duplicates such as `PCT-QL-110`, `PCT-QL-128`, `PCT-QL-136`, `PCT-QL-148`, and similar variants weaken trust in the enrichment pass.
- Best action: deduplicate aggressively before approval, then rebuild a smaller number of stems with genuinely different structures.

### `PCT-002/question-language.en.json`

- This file shows some real editorial improvement through bank statement, telecom note, attendance, poll, crop report, and result-summary shells.
- The main weakness is structural thinness: most chapters still keep the same sentence shell across 4-5 variants.
- Two verbatim duplicates remain in `PCT-CP-008` and `PCT-CP-010`.
- Best action: keep the file, remove the exact duplicates, and enrich 2-3 repeated direct shells into table/register/public-record formats.

### `PCT-003/question-language.en.json`

- Context spread is solid enough for an increase chapter: clinic, library, electricity, internet, crop, salary, production, sales, visitors, passengers, and cattle all appear.
- The bigger issue is shell repetition: `After a {increaseRate}% increase... find the original`, `What multiplier...`, and `current ... target ... required increase` appear as families rather than distinct editorial items.
- Best action: keep the contexts, vary the structures and asks.

### `PCT-004/question-language.en.json`

- This file mirrors `PCT-003` very closely, which is expected mathematically, but the editorial forms are too parallel.
- `PCT-CP-003` still contains a verbatim duplicate pair: `PCT-QL-005` and `PCT-QL-006`.
- Stock, marked-price, and generic decrease shells are overused; public-record styling is still thin.
- Best action: remove the duplicate pair and break the "after a decrease... find the starting..." family into more document-led forms.

### `PCT-005/question-language.en.json`

- This is the strongest file structurally. It introduces district survey, bank branch report, warehouse audit, school record, railway passenger note, final bill, lab calibration sheet, and monthly sales register.
- The main remaining weakness is wording. Several stems read like symbolic working notes rather than polished exam English.
- Sign-coded prompts such as `+{rate1}%` and `-{rate2}%` are efficient for internal math notation, but they do not feel like final-bank English.
- Best action: retain the structure diversity, but rewrite the notation-heavy prompts into natural stage-by-stage English.

## Exam-Feel Verdict

### SSC direct style

- Strongest in `PCT-002`, `PCT-003`, and `PCT-004`.
- Weakest when the same CP repeats the same direct shell too many times, especially in `PCT-001`.

### Banking data style

- Present, but thin.
- Strongest examples: `PCT-002/PCT-CP-002/PCT-QL-003`, `PCT-005/PCT-CP-001/PCT-QL-002`, `PCT-005/PCT-CP-008/PCT-QL-042`.
- Weakness: many "statement" wrappers still ask in the same plain verbal shell as the generic variants.

### Punjab state public-record style

- Emerging in `PCT-003`, `PCT-004`, and especially `PCT-005`.
- Still underused in `PCT-001`, where the bank would benefit most from more record-led variety.

## Weak Stem Log

| File | CP ID | QL ID | Current stem or snippet | Issue | Suggested improvement direction |
| --- | --- | --- | --- | --- | --- |
| `PCT-001/question-language.en.json` | `PCT-CP-002` | `PCT-QL-115` | `a man's salary is increased by {percentageRate}%...` | Lower-case start and part of a five-way clone family | Keep one salary version only; convert the rest into payroll order, pay-slip note, or staff revision memo shells |
| `PCT-001/question-language.en.json` | `PCT-CP-003` | `PCT-QL-120` | `two successive increases of {rate1}% and {rate2}%...` | Pure formula prompt repeated five times | Keep at most one formula-only version; move others into population, stock, passenger, or public-report structures |
| `PCT-001/question-language.en.json` | `PCT-CP-004` | `PCT-QL-128` | `if the price of sugar increases by {percentageRate}%...` | Lower-case start plus exact clone family | Rewrite as a ration card / household expense note or remove duplicate copies |
| `PCT-001/question-language.en.json` | `PCT-CP-005` | `PCT-QL-136` | `A man spends {rate1}% of his income on food...` | Old coaching-book shell; repetitive within the same CP | Replace some salary families with ledger, household budget sheet, or department expense distribution contexts |
| `PCT-001/question-language.en.json` | `PCT-CP-006` | `PCT-QL-054` | `If {value} kg water flies away...` | Non-natural English | Replace `flies away` with `evaporates`, or phrase it as water loss from the solution |
| `PCT-002/question-language.en.json` | `PCT-CP-008` | `PCT-QL-015` | `Out of {totalValue} {wholeLabel}, {targetRate}% are {targetLabel}...` | Repeated verbatim as `PCT-QL-042` | Keep one direct version and turn the other into a roster/table style prompt |
| `PCT-002/question-language.en.json` | `PCT-CP-010` | `PCT-QL-019` | `Out of {totalValue} {wholeLabel}, {rate1}% are {otherLabel}...` | Repeated verbatim as `PCT-QL-049` | Convert one version into a branch record, survey table, or district summary |
| `PCT-003/question-language.en.json` | `PCT-CP-001` | `PCT-QL-001` | `A clinic report records {valuePrefix}{originalValue} as the starting {wholeLabel}...` | Placeholder-heavy and only lightly contextualized | Use a more fixed noun pair so the report shell feels real, not generic |
| `PCT-003/question-language.en.json` | `PCT-CP-004` | `PCT-QL-030` | `What multiplier should be used for a {increaseRate}% increase?` | Formula-only and not very exam-like | Keep one multiplier drill; convert others into revised-price or growth-factor interpretations |
| `PCT-003/question-language.en.json` | `PCT-CP-008` | `PCT-QL-015` | `Out of {totalValue} {wholeLabel}, {partRate}% were {partLabel}...` | Same shell repeated across the full CP with noun swaps | Use a survey sheet, passenger chart, or company register to vary the structure |
| `PCT-004/question-language.en.json` | `PCT-CP-003` | `PCT-QL-005` | `After a {decreaseRate}% decrease... Find the starting {wholeLabel}.` | Verbatim duplicate of `PCT-QL-006` | Remove one copy and rewrite the survivor as a discount/depreciation/public-record variant |
| `PCT-004/question-language.en.json` | `PCT-CP-004` | `PCT-QL-030` | `A budget note shows a {decreaseRate}% cut...` | Thin wrapper around a formula-only multiplier ask | Reframe as sanctioned budget vs revised budget, not just "what single multiplier" |
| `PCT-005/question-language.en.json` | `PCT-CP-005` | `PCT-QL-035` | `A wildlife census note records a +{rate1}% change followed by a -{rate2}% change...` | Symbol-heavy and editorially artificial | Rewrite in natural sequence: increased by X%, then decreased by Y% |
| `PCT-005/question-language.en.json` | `PCT-CP-006` | `PCT-QL-038` | `Revenue is adjusted by +{rate1}% and then by -{rate2}%...` | Robotic and internal-note sounding | Use quarter-wise or revision-wise wording instead of arithmetic signs |
| `PCT-005/question-language.en.json` | `PCT-CP-008` | `PCT-QL-044` | `Their numbers changed by +{rateA1}%, -{rateA2}%... respectively.` | Hard to parse on first read | Break into two sentences or a comparative record/table shell |
| `PCT-005/question-language.en.json` | `PCT-CP-009` | `PCT-QL-018` | `changed successively by +{rate1}%, +{rate2}%, -{rate3}%, and +{rate4}%` | Notation overload | Convert stages into months, quarters, or revisions stated in normal English |

## Approval Recommendation

- `PCT-001`: Do not approve to bank without a focused deduplication pass.
- `PCT-002`: Safe after duplicate cleanup and light enrichment.
- `PCT-003`: Safe after shell-diversity improvements in multiplier/original/target chapters.
- `PCT-004`: Safe after duplicate cleanup and stronger structural differentiation from `PCT-003`.
- `PCT-005`: Closest to approval quality, but notation-heavy stems should still be normalized.
