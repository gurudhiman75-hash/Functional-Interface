# Data Interpretation — Pre-Freeze Content Quality Audit V1

Date: 2026-10-01  
Branch: `audit/di-pre-freeze-content-quality-v1`  
Status: **PRE-FREEZE QUALITY GATE — CI AND MULTILINGUAL FINAL REVIEW REQUIRED**

## Closure standard

DI must not be frozen merely because generators are mathematically valid. Closure requires all of the following:

1. **Source-aligned breadth** — every major DI representation and operation family in the project source baseline is owned by an active generator.
2. **Exam-standard stems** — individual questions are concise asks, not solving instructions; they name the actual quantity/activity instead of generic “value/values”, “first/second”, or “displayed value” wording.
3. **Calculative explanations** — derived questions show the arithmetic actually needed for that question. Recovery/advanced arithmetic questions must not hide the calculation behind boilerplate such as “using the rule shown”.
4. **Scenario fit** — quantities combined, compared, averaged or ratioed must be semantically compatible. The chart/table activity, units and question wording must agree.
5. **Answer/stem parity** — if the stem asks for a period/category, the answer must be a period/category; if it asks for a number/percentage, the answer/options must carry the correct numeric unit/symbol.
6. **Regression protection** — defects found in this audit must have automated guards.
7. **Localization parity** — Hindi/Punjabi learner surfaces must preserve the same semantic and mathematical contract before final freeze.

## Source-baseline breadth map

The project source baseline requires these DI families. Current ownership is:

| Source-baseline requirement | Current ownership |
|---|---|
| Table DI: direct read, difference, ratio, average, percentage, combined totals | DI-001 |
| Advanced/missing table, reverse recovery | DI-002, DI-007, DI-012 |
| Single bar | DI-003 single-bar |
| Grouped/double bar | DI-003 grouped-bar |
| Stacked bar | DI-003 stacked-bar |
| Single-series line | DI-004 single-line |
| Two-series/grouped line | DI-004 permanent line |
| Three-series/multi-line | DI-004 multi-line |
| Pie: percentage/value/angle-style interpretation and visible/missing shares | DI-005 pie variants |
| Comparative/ring/donut pie variants | DI-005 extension variants |
| Prose/caselet DI | DI-006 |
| Advanced relation-topology caselets | DI-006 advanced |
| Arithmetic DI: revenue/profit/percentage/ratio/weighted average | DI-008 V2 |
| Advanced arithmetic DI: time-work, speed-distance, partnership, mixture/alligation, simple interest, probability/selection | DI-008 advanced |
| Histogram / grouped-frequency DI | DI-009 |
| Frequency polygon | DI-010 |
| Mixed/multi-display DI | DI-011 |
| Multi-variable / multi-missing recovery | DI-012 |
| Radar chart | DI-013 |
| Radar + pie / hybrid representation | DI-014 |

This closes the **project source-baseline representation map**. It is not a claim that no future PYQ corpus can introduce a new niche topology; future source ingestion must still be checked against this map.

## Defects found and corrected in this pass

### DI-001
- Removed remaining generic “Selected value” stem variant.

### DI-003
- Single-bar stems now name the measured quantity/unit.
- Stacked-bar stems no longer ask for generic “value/total value”.
- Instruction-like total/cross-total wording was replaced with direct questions.
- Regression guards reject generic value wording and procedural openers.

### DI-004
- Single-line generic “first-period value / last-period value / plotted values” variants removed.
- Corrected a stem-answer mismatch where a highest/lowest variant asked **which period** while the keyed answer was the numeric maximum/minimum.
- Multi-line direct/combined/cross-series questions now name the series, period and measured unit.
- Regression guards reject generic/procedural wording and ask-answer mismatch.

### DI-006
- Advanced caselet stems now name the real count/activity (applications, claims, students, orders, cases).
- Generic “combined number” / unnamed difference-ratio wording removed.
- Explanations now point to the actual scenario quantity.

### DI-007
- Active V2 stem variants no longer use “two visible table values”, generic combined value, or Add/Compare-style prompts.
- Regression guards reject procedural and generic table wording.

### DI-008
- Advanced arithmetic labels changed from generic “Case A–E” to Team/Route/Partner/Container/Loan/Group labels.
- Derived-value explanations now show domain arithmetic.
- Fixed task dispatch mismatch: declared `MAXIMUM_DERIVED_VALUE` had been checked under a different task name, which could route it to fallback behavior.
- Regression guards require contextual labels and calculative derivations.

### DI-011
- Non-pie mixed displays now compare **parallel measures** across periods instead of summing overlapping/unlike quantities such as applications + approvals or policies + claims.
- Generic “combined value / displayed values” wording removed.
- Regression guard blocks incompatible mixed-chart scenario pairs.

### DI-012
- x/y recovery questions now identify the actual row and column.
- Recovery explanations now show algebra/arithmetic for the active recovery model.
- Percentage answers/options now carry the `%` symbol.
- Regression guards require direct stems, percentage-unit parity, and calculative recovery steps.

### DI-013
- Remaining Find-style radar stems converted to direct questions.
- Explanation key idea names the contextual measure.
- Regression guard rejects instruction-like radar stems.

## Remaining gates before final freeze

- Run the complete affected DI test suite and global production/build checks on this exact branch.
- Regenerate the full mixed review packet after the branch is green.
- Re-run Hindi/Punjabi parity for any localized surface affected by changed English semantics, especially DI-004 extension variants and DI-011–DI-014.
- Do not label the chapter **FROZEN / GAP-FREE** until those gates pass.

## Freeze rule

A green generator test is necessary but not sufficient. Final freeze requires:

`source breadth mapped + active stems clean + explanations calculative + scenarios semantically valid + answer parity + localization parity + CI green`.
