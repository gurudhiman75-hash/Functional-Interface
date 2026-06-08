# NS-HL-001 Library Authority Map

## Ownership

All student-facing question language and explanation language is human-owned.

Runtime may:

- load approved libraries
- validate approved libraries
- select approved templates
- substitute approved variables
- render approved templates
- audit rendered output

Runtime may not:

- generate educational wording
- invent question stems
- invent explanations
- rewrite approved language
- create fallback question wording
- create fallback solution wording
- infer missing instructional sentences

## Approved Library Files

- question-language.library.json
- explanation.library.json
- variable-ranges.library.json
- coverage-targets.library.json
- distribution-targets.library.json
- library-authority-map.md

## Canonical Problem Authority

Active CPs are fixed for Phase B:

- CP-001 Product Relation Applications
- CP-002 HCF-LCM Validity Check
- CP-003 Missing Number From HCF, LCM And One Number
- CP-004 Number Pair Reconstruction
- CP-005 Count Possible Number Pairs
- CP-006 Ratio-Based Number Reconstruction

No runtime may introduce additional CPs.

## Question Language Authority

question-language.library.json owns all approved stems.

Approved IDs are exactly:

- QL-001 through QL-033

Runtime may only render an approved QL entry by substituting approved placeholders.

## Explanation Authority

explanation.library.json owns all approved explanation text.

Approved IDs are:

- ES-001
- ES-002
- ES-003
- ES-004
- ES-005
- ES-006
- ES-007

Runtime may only render an approved ES entry by substituting approved placeholders.

## MathJax Placeholder Authority

The explanation library owns the required MathJax placeholder inventory:

- productRelationLatex
- divisibilityCheckLatex
- productRelationCheckLatex
- missingNumberFormulaLatex
- hcfVerificationLatex
- lcmVerificationLatex
- quotientLatex
- factorPairListLatex
- coprimePairFilterLatex
- conditionFilterLatex
- reconstructedPairLatex
- factorPairCountLatex
- orderedPairPolicyLatex
- unorderedPairPolicyLatex
- ratioReductionLatex
- ratioMultiplierLatex
- hcfMultiplierLatex
- lcmMultiplierLatex
- consistencyCheckLatex

Future runtime must supply these objects. It may not replace them with generated prose.

## Coverage Authority

coverage-targets.library.json owns required coverage categories.

distribution-targets.library.json owns target balancing policies.

variable-ranges.library.json owns approved variables and value-range policies.

## Phase Boundary

This Phase B package creates educational libraries only.

It does not create runtime files, generators, solvers, validators, reasoning graphs, pipelines, tests, or audits.
