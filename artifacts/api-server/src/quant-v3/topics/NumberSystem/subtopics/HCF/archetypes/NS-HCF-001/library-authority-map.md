# NS-HCF-001 Library Authority Map

## Status

Educational library package only.

No runtime implementation is authorized by this package.

## Authority Principle

Educational libraries are human-owned.

Future runtime may only:

- load
- validate
- register
- enforce
- audit

Future runtime must not invent educational content.

## Libraries

| Library Name | Owner | Purpose | Runtime Usage | Validation Rules |
| --- | --- | --- | --- | --- |
| question-language.library.json | Human Owned | Defines approved government-exam-style question stems and stem families for CP-001 through CP-004. CP-003 constraint wording is fully library-owned. | Runtime Consumed for stem rendering only. | Validate active CP IDs, QL IDs, required variables, self-containment, stem family metadata, CP-003 family-specific placeholders, and CP-004 context family metadata. |
| explanation.library.json | Human Owned | Defines approved human-style explanation families and required MathJax evidence placeholders. | Runtime Consumed for explanation rendering only. | Validate EF/ES IDs, explanation family coverage, CP applicability, evidence placeholders, CP-002 HCF -> factor count dependency, CP-003 candidateCount = 1 proof, and CP-004 context -> HCF translation. |
| variable-ranges.library.json | Human Owned | Defines approved difficulty bands, operand counts, HCF size buckets, CP-003 constraint types, CP-004 context types, and MathJax objects. | Runtime Consumed for future parameter constraints. | Validate Easy/Medium/Hard bands, operand counts, HCF buckets, constraint families, context families, and only CP-001 through CP-004 references. |
| coverage-targets.library.json | Human Owned | Defines required educational coverage categories, including stemFamily and explanationFamily. | Runtime Consumed for future audit reporting and coverage checks. | Validate difficulty, CP, question language, stem family, explanation family, operand count, HCF value, HCF structure, CP-003 constraints, CP-004 contexts, and MathJax object coverage. |
| distribution-targets.library.json | Human Owned | Defines distribution targets for difficulty, question stems, stem families, explanation families, operand count, context families, and constraint families. | Runtime Consumed for future batch generation and audit reporting. | Validate 40/40/20 difficulty targets and balanced/uniform distribution policies for all approved family dimensions. |

## Specification Authority

| Document | Purpose |
| --- | --- |
| archetype.md | Defines NS-HCF-001 identity, scope, mathematical foundation, architecture reuse, and runtime gate. |
| canonical-problems.md | Defines active CP-001 through CP-004, topology analysis, and removed candidates. |
| difficulty-framework.md | Defines Easy, Medium, and Hard educational difficulty framework. |
| reasoning-patterns.md | Defines reasoning families for future graph design. |
| implementation-plan.md | Defines future implementation requirements without implementing runtime. |

## Active CP Authority Rule

Only CP-001 through CP-004 are active:

- CP-001 Direct HCF Computation
- CP-002 Count Common Divisors
- CP-003 Missing Operand Using HCF
- CP-004 Maximum Equal Grouping / HCF Word Application

Future runtime must reject unknown CP IDs.

## Language Authority Rule

Question and explanation wording must come only from the human-owned libraries.

No fallback stems, generated wording, or invented educational explanations are authorized.

Future runtime may rotate, select, render, validate, and audit approved stems and explanations.

Future runtime may not create substitute wording to fill distribution gaps.

Educational wording ownership is 100% human owned.

Future runtime may:

- substitute variables into approved templates.
- select approved templates.

Future runtime may not:

- generate constraint language.
- generate educational sentences.
- generate explanations.

## Stem Family Authority Rule

Stem families are human-owned educational categories.

Future runtime must preserve and audit the approved stemFamily value attached to each question-language entry.

Approved stem families include:

- direct
- alternative_terminology
- statement_style
- applied_numeric_style
- exam_style
- constraint_reconstruction
- contextual_application

Future human-review exports should include stemFamily so reviewers can detect repetitive wording.

## Explanation Family Authority Rule

Explanation families are human-owned educational categories.

Future runtime must preserve and audit the approved styleFamily value attached to each explanation family.

Approved explanation families include:

- step_by_step
- compact
- formula_first
- concept_first

Every CP must have access to all four explanation families.

## MathJax Object Authority

The following MathJax-compatible objects must be available for future runtime, explanations, traceability, audits, and human review exports:

- operandFactorizationLatex
- commonPrimeIntersectionLatex
- minimumExponentSelectionLatex
- hcfLatex
- hcfFactorCountFormulaLatex
- candidateEvaluationLatex
- groupingInterpretationLatex

## CP-002 Dependency Rule

CP-002 must visibly show:

HCF -> factor count

Future runtime must derive commonDivisorCount by computing the HCF and counting the factors of the HCF.

## CP-003 Library-Owned Constraint Rule

CP-003 constraint wording is library-owned.

Future runtime only renders approved text.

Future runtime must not generate range wording, list wording, divisibility wording, arithmetic wording, or mixed exam wording.

Approved CP-003 family-specific placeholders are:

- rangeStart
- rangeEnd
- numberList
- divisibleBy
- notDivisibleBy
- baseNumber
- increase
- decrease

Future runtime must reject underdetermined CP-003 values and must prove that exactly one missing number satisfies every condition.

CP-003 explanations must visibly establish:

candidateCount = 1

before answer extraction.

## CP-004 Translation Rule

CP-004 must visibly show:

context -> HCF

Future runtime must trace the contextual quantities to an HCF expression before producing the final answer.

Approved CP-004 context families are:

- fruits
- students
- books
- notebooks
- pencils
- packets
- boxes
- bundles
- rows
- chairs
- teams
- classrooms
- distribution
- packing
- grouping

## Runtime Gate

This educational library package does not authorize runtime implementation.

No generators, solvers, validators, reasoning graphs, pipelines, tests, audits, exports, or runtime TypeScript files are authorized by this package.
