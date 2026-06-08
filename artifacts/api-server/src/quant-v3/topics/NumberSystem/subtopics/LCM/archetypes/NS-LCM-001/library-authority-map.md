# NS-LCM-001 Library Authority Map

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

Future runtime may not:

- invent stems
- invent explanations
- invent educational wording
- create fallback wording
- rewrite approved wording

## Libraries

| Library Name | Owner | Runtime Usage |
| --- | --- | --- |
| question-language.library.json | HUMAN OWNED | Runtime may load and render approved stems only. |
| explanation.library.json | HUMAN OWNED | Runtime may load and render approved explanations only. |
| variable-ranges.library.json | HUMAN OWNED | Runtime may load, validate, register, enforce, and audit approved ranges. |
| coverage-targets.library.json | HUMAN OWNED | Runtime may load, validate, register, enforce, and audit approved coverage targets. |
| distribution-targets.library.json | HUMAN OWNED | Runtime may load, validate, register, enforce, and audit approved distribution targets. |

## Active CP Authority Rule

Only CP-001 through CP-005 are active:

- CP-001 Direct LCM Computation
- CP-002 Common Cycle Synchronization
- CP-003 Missing Number Using LCM
- CP-004 Count Common Multiples In A Range
- CP-005 Smallest Common Multiple Greater Than A Threshold

Future runtime must reject unknown CP IDs.

## Language Authority Rule

All stems and explanations are explicitly authored in this Phase B package.

Runtime may substitute variables into approved placeholders.

Runtime must not synthesize question language or explanation language.

## CP-002 Context Family Authority

Approved CP-002 context families are:

- bells
- lights
- alarms
- runners
- machines
- buses
- trains
- traffic_signals
- sprinklers
- cleaning_schedules

Future runtime may select only approved CP-002 context stems and must audit context-family usage.

## CP-003 exactLcmMatch Authority

exactLcmMatch is a required CP-003 coverage category.

Definition:

Tracks whether a candidate exactly produces the required target LCM.

Future runtime must expose exactLcmMatch in audit reporting for CP-003.

## MathJax Object Authority

The following MathJax-compatible objects must be available for future runtime, explanations, traceability, audits, and human review exports:

- operandFactorizationLatex
- primeUnionLatex
- maximumExponentSelectionLatex
- lcmLatex
- synchronizationInterpretationLatex
- candidateEvaluationLatex
- rangeCountFormulaLatex
- thresholdSelectionFormulaLatex

## Runtime Gate

This educational library package does not authorize runtime implementation.

No generators, solvers, validators, reasoning graphs, pipelines, tests, audits, exports, or runtime TypeScript files are authorized by this package.
