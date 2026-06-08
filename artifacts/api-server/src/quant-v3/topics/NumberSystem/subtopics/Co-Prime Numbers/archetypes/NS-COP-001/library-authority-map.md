# NS-COP-001 Library Authority Map

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

- CP-001 Co-Prime Check
- CP-002 Count Co-Primes From A List
- CP-003 Missing Number For Co-Prime Condition
- CP-004 Count Co-Prime Pairs
- CP-005 Consecutive Number Co-Prime Property
- CP-006 Ratio Reduction To Lowest Form

No additional CPs are approved.

## Question Language Authority

question-language.library.json owns exactly 41 stems:

- QL-001 through QL-041

Runtime may only substitute variables into these stems.

## Explanation Authority

explanation.library.json owns exactly 6 explanation entries:

- ES-001 through ES-006

Runtime may only substitute approved values and MathJax placeholders.

## MathJax Placeholder Authority

Approved placeholders:

- hcfLatex
- coprimeCheckLatex
- candidateEvaluationLatex
- pairEvaluationLatex
- consecutivePropertyLatex
- ratioReductionLatex

Future runtime must supply these placeholders and may not replace them with generated prose.

## Phase Boundary

This package contains design and educational libraries only.

It does not create runtime files, generators, solvers, validators, reasoning graphs, pipelines, tests, or audits.
