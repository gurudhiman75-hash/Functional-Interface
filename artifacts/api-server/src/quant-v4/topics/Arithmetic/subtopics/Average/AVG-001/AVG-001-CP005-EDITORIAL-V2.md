# AVG-001 CP-005 Editorial V2 Candidate

## Status

**ADVERSARIAL REVIEW REMEDIATION COMPLETE AND APPROVED**

This wave upgrades all 56 `AVG-CP-005` question-language units while preserving the current `AVG-001-EN-v1` runtime until the complete chapter-wide v2 release is assembled.

## Scope

- QL range: `AVG-QL-274` through `AVG-QL-329` — 56 QLs;
- eight correction solve modes;
- examination marks, payroll, age, factory output, shop sales, innings, parcel-weight and numerical-record contexts;
- context-specific stems and explicit targets;
- misconception-derived options;
- semantic units and Indian currency grouping;
- exact four-tier explanations;
- all three wrong options mapped to explicit misconception tags;
- unchanged solver state, exact answer and mathematical fingerprint.

## Adversarial review remediation

The 56-question external audit scored the candidate 9.2/10 and approved its mathematics and answer keys, subject to three presentation fixes. The reviewed layer now provides:

1. **MathJax-safe units**
   - every unit inside a display equation is wrapped with `\\text{...}`;
   - final answers use bold MathJax forms such as `\\mathbf{50\\text{ marks}}`;
   - signed currency uses `-\\text{₹}...`, never `\\text{₹}-...`.

2. **Numerical exam shortcuts**
   - every shortcut substitutes the actual generated values;
   - generic repeated sentences were removed;
   - the 56-question review export contains 56 distinct shortcut strings.

3. **Grammar guards**
   - singular quantities use `1 mark`, `1 year`, `1 run` and `1 unit`;
   - indefinite articles are corrected for relevant vowel-sound nouns, including `An inspection...`;
   - count-answer labels remain separate from measurement units.

## Final validation

The dedicated CP-005 workflow validates five deterministic instances for each QL, producing 280 candidate packages.

Passed checks:

- API server build;
- 56 QLs and eight solve modes;
- 280 mathematical-fingerprint preservation cases;
- 280 MathJax unit-safety cases;
- 280 numerical-shortcut cases;
- 280 misconception-option cases;
- 280 four-tier explanations;
- every wrong option analysed;
- zero raw unit words inside display math;
- zero generic shortcut boilerplate;
- zero article errors;
- zero duplicate rendered stems;
- zero audit failures.

## Release boundary

The reviewed candidate remains separate from the existing `AVG-001-EN-v1` production runtime. Production wiring and the final `AVG-001-EN-v2` release ID remain chapter-wide follow-up work.
