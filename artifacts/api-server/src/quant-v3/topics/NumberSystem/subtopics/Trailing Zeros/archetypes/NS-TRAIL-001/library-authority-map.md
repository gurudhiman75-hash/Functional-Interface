# NS-TRAIL-001 Library Authority Map

## Ownership

All educational wording is human-owned.

Runtime may:

- load approved libraries
- validate approved libraries
- select approved templates
- substitute approved variables
- render approved templates
- audit rendered output

Runtime may not:

- invent question wording
- invent explanations
- create additional stems
- rewrite approved wording
- create fallback question wording
- create fallback explanation wording

## Approved Library Files

- question-language.library.json
- explanation.library.json
- variable-ranges.library.json
- coverage-targets.library.json
- distribution-targets.library.json
- library-authority-map.md

## Active Canonical Problems

- CP-001 Count Trailing Zeros In n!
- CP-002 Count Trailing Zeros In Factorial Expressions
- CP-003 Smallest Number Whose Factorial Has Given Trailing Zeros
- CP-004 Count Trailing Zeros In Powers
- CP-005 Determine Change In Trailing Zeros After Multiplication

No additional CPs are approved.

## Question Language Authority

question-language.library.json owns exactly 39 stems:

- QL-001 through QL-039

Runtime may only substitute variables into these stems.

## Explanation Authority

explanation.library.json owns exactly 5 explanation entries:

- ES-001 through ES-005

Runtime may only substitute approved values and MathJax placeholders.

## MathJax Placeholder Authority

Approved placeholders:

- factorFiveCountLatex
- factorialExpressionLatex
- searchProcessLatex
- powerFactorizationLatex
- productFactorizationLatex

Future runtime must supply these placeholders and may not replace them with generated prose.

## Phase Boundary

This package contains design and educational libraries only.

It does not create runtime files, generators, solvers, validators, reasoning graphs, pipelines, tests, or audits.
