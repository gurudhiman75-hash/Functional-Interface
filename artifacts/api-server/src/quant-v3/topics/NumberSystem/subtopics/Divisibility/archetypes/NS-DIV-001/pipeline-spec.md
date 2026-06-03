# NS-DIV-001 Pipeline Specification

## Purpose

Define the complete execution pipeline for NS-DIV-001 from question request intake to final question package assembly.

This document is specification only. It does not create code, generators, solvers, renderers, validators, questions, stems, explanations, distractors, or implementation behavior.

## Pipeline Mission

The NS-DIV-001 pipeline coordinates approved canonical problem metadata, parameter contracts, solver contracts, reasoning graph contracts, rendering contracts, distractor contracts, validation contracts, localization contracts, difficulty contracts, and realism contracts.

The pipeline is reasoning-graph-first. The reasoning graph is the source of truth for downstream explanation rendering and validation.

## Pipeline Rules

- Reasoning Graph is the source of truth.
- Explanation Renderer must consume graph output.
- Stem Renderer must consume approved canonical problem metadata.
- Distractor Generator must consume approved answer metadata.
- Validation must occur before final packaging.
- Final output must preserve source traceability.
- Every stage must preserve NS-DIV-001 ownership.
- No stage may fall back to a global educational system.

## Stage 1: Question Request Intake

| Field | Specification |
| --- | --- |
| Mission | Receive an NS-DIV-001 request and confirm that it targets an approved canonical problem. |
| Inputs | Request metadata; archetype ID; requested canonical problem ID; source trace metadata; target language metadata; difficulty metadata |
| Outputs | Accepted request contract; rejection metadata when intake fails |
| Dependencies | `archetype.md`; `canonical-problems.md`; `difficulty-spec.md`; `localization-spec.md` |
| Validation Requirements | Archetype ID must be NS-DIV-001; canonical problem ID must be approved; source trace metadata must be present |
| Failure Conditions | Archetype mismatch; missing canonical problem; missing source trace; unsupported language target; unsupported difficulty metadata |
| Ownership Rules | Intake contract belongs to NS-DIV-001 and must not be routed through a global intake contract |
| Review Status | PENDING HUMAN REVIEW |

## Stage 2: Canonical Problem Selection

| Field | Specification |
| --- | --- |
| Mission | Select the approved canonical problem contract that governs the requested output type. |
| Inputs | Accepted request contract; canonical problem registry; requested output type |
| Outputs | Canonical problem execution contract |
| Dependencies | `canonical-problems.md`; `parameter-spec.md`; `validation-spec.md` |
| Validation Requirements | Canonical problem must belong to NS-DIV-001; output type must match canonical problem contract |
| Failure Conditions | Output type mismatch; canonical problem not approved; canonical problem ownership missing |
| Ownership Rules | Selection must preserve canonical-problem-owned parameters and must not create global parameter ownership |
| Review Status | PENDING HUMAN REVIEW |

## Stage 3: Parameter Resolution

| Field | Specification |
| --- | --- |
| Mission | Resolve the parameter contract required by the selected canonical problem. |
| Inputs | Canonical problem execution contract; required parameter schema; optional parameter schema; difficulty control inputs; realism inputs; localization inputs |
| Outputs | Parameter resolution contract; unresolved parameter metadata when resolution fails |
| Dependencies | `parameter-spec.md`; `difficulty-spec.md`; `realism-rules.md`; `localization-spec.md` |
| Validation Requirements | Parameters must belong to the selected canonical problem; parameter contract must support validation, localization, and realism enforcement |
| Failure Conditions | Missing required parameter contract; global parameter ownership; invalid difficulty control input; invalid realism input |
| Ownership Rules | Parameters are owned by canonical problems inside NS-DIV-001 |
| Review Status | PENDING HUMAN REVIEW |

## Stage 4: Solver Invocation

| Field | Specification |
| --- | --- |
| Mission | Invoke the NS-DIV-001 solver contract using approved canonical problem and parameter metadata. |
| Inputs | Parameter resolution contract; solver input contract; canonical problem execution contract |
| Outputs | Solver output contract; failure metadata when solving cannot proceed |
| Dependencies | `solver-spec.md`; `canonical-problems.md`; `parameter-spec.md` |
| Validation Requirements | Solver input must preserve ownership, source trace, missing digit metadata, divisibility constraint metadata, and requested output type |
| Failure Conditions | Solver scope mismatch; unsupported requested output type; missing parameter ownership; missing source trace |
| Ownership Rules | Solver invocation must remain archetype-owned and must not use a global solver fallback |
| Review Status | PENDING HUMAN REVIEW |

## Stage 5: Reasoning Graph Construction

| Field | Specification |
| --- | --- |
| Mission | Build the reasoning graph contract from solver metadata. |
| Inputs | Solver output contract; reasoning pattern contract; source trace metadata; canonical problem metadata |
| Outputs | Reasoning graph contract; explanation renderer payload; validation payload |
| Dependencies | `reasoning-graph-spec.md`; `reasoning-patterns.md`; `solver-spec.md` |
| Validation Requirements | Required graph nodes must exist; node relationships must follow approved graph rules; graph must preserve source trace and canonical problem ownership |
| Failure Conditions | Missing required node; forbidden node relationship; missing reasoning pattern approval; missing source trace |
| Ownership Rules | Reasoning graph belongs to NS-DIV-001 and remains the source of truth |
| Review Status | PENDING HUMAN REVIEW |

## Stage 6: Answer Validation

| Field | Specification |
| --- | --- |
| Mission | Validate solver answer metadata before presentation-layer rendering begins. |
| Inputs | Solver output contract; reasoning graph contract; validation payload |
| Outputs | Approved answer metadata; validation failure metadata |
| Dependencies | `validation-spec.md`; `solver-spec.md`; `reasoning-graph-spec.md` |
| Validation Requirements | Answer metadata must match canonical output type; graph metadata must support the answer; source trace must be preserved |
| Failure Conditions | Answer contract mismatch; graph mismatch; failed ownership validation; missing source trace |
| Ownership Rules | Answer validation belongs to NS-DIV-001 and must occur before stem, explanation, distractor, and package assembly stages |
| Review Status | PENDING HUMAN REVIEW |

## Stage 7: Stem Rendering

| Field | Specification |
| --- | --- |
| Mission | Render a presentation-layer stem from approved canonical problem and parameter metadata. |
| Inputs | Canonical problem metadata; parameter resolution contract; localization metadata; realism metadata |
| Outputs | Stem rendering contract; stem metadata for final validation |
| Dependencies | `stem-spec.md`; `parameter-spec.md`; `localization-spec.md`; `realism-rules.md` |
| Validation Requirements | Stem must consume approved canonical problem metadata; stem must preserve source trace; stem must not alter solver or graph metadata |
| Failure Conditions | Missing canonical problem metadata; missing localization approval; unapproved stem format; source trace loss |
| Ownership Rules | Stem rendering belongs to NS-DIV-001 and remains presentation-layer only |
| Review Status | PENDING HUMAN REVIEW |

## Stage 8: Explanation Rendering

| Field | Specification |
| --- | --- |
| Mission | Render explanation presentation from reasoning graph output. |
| Inputs | Reasoning graph contract; explanation renderer payload; localization metadata; approved answer metadata |
| Outputs | Explanation rendering contract; explanation metadata for final validation |
| Dependencies | `explanation-spec.md`; `reasoning-graph-spec.md`; `localization-spec.md` |
| Validation Requirements | Explanation Renderer must consume graph output; renderer must not invent reasoning; renderer must preserve graph order and source trace |
| Failure Conditions | Missing graph output; graph validation failure; renderer attempts to bypass graph; source trace loss |
| Ownership Rules | Explanation rendering belongs to NS-DIV-001 and must remain downstream of the reasoning graph |
| Review Status | PENDING HUMAN REVIEW |

## Stage 9: Distractor Generation

| Field | Specification |
| --- | --- |
| Mission | Produce distractor metadata from approved answer metadata and distractor contracts. |
| Inputs | Approved answer metadata; canonical problem metadata; distractor contract; difficulty metadata; localization metadata |
| Outputs | Distractor metadata contract; distractor validation payload |
| Dependencies | `distractor-spec.md`; `validation-spec.md`; `difficulty-spec.md`; `localization-spec.md` |
| Validation Requirements | Distractor Generator must consume approved answer metadata; distractors must preserve answer format and canonical problem ownership |
| Failure Conditions | Missing approved answer metadata; answer duplication; distractor contract mismatch; source trace loss |
| Ownership Rules | Distractor generation belongs to NS-DIV-001 and must not use a global distractor fallback |
| Review Status | PENDING HUMAN REVIEW |

## Stage 10: Final Validation

| Field | Specification |
| --- | --- |
| Mission | Validate all contracts before final question package assembly. |
| Inputs | Stem metadata; explanation metadata; distractor metadata; reasoning graph contract; approved answer metadata; source trace metadata |
| Outputs | Final validation approval; final validation failure metadata |
| Dependencies | `validation-spec.md`; `reasoning-graph-spec.md`; `stem-spec.md`; `explanation-spec.md`; `distractor-spec.md` |
| Validation Requirements | Ownership, canonical problem, graph, answer, stem, explanation, distractor, localization, realism, difficulty, and source trace checks must pass |
| Failure Conditions | Any contract mismatch; source trace loss; graph mismatch; unapproved renderer output; unapproved distractor metadata |
| Ownership Rules | Final validation belongs to NS-DIV-001 and must occur before final packaging |
| Review Status | PENDING HUMAN REVIEW |

## Stage 11: Question Package Assembly

| Field | Specification |
| --- | --- |
| Mission | Assemble the final question package from validated contracts. |
| Inputs | Final validation approval; stem metadata; explanation metadata; distractor metadata; approved answer metadata; reasoning graph metadata; source trace metadata |
| Outputs | Final question package contract |
| Dependencies | `validation-spec.md`; `reasoning-graph-spec.md`; `localization-spec.md`; `realism-rules.md` |
| Validation Requirements | Package must preserve source traceability; package must preserve graph traceability; package must preserve NS-DIV-001 ownership |
| Failure Conditions | Missing validation approval; missing source trace; missing graph trace; package ownership mismatch |
| Ownership Rules | Final package belongs to NS-DIV-001 and must not contain unvalidated presentation artifacts |
| Review Status | PENDING HUMAN REVIEW |

## Cross-Stage Interaction Contract

| From | To | Required Contract |
| --- | --- | --- |
| Request Intake | Canonical Problem Selection | Accepted request contract |
| Canonical Problem Selection | Parameter Resolution | Canonical problem execution contract |
| Parameter Resolution | Solver Invocation | Parameter resolution contract |
| Solver Invocation | Reasoning Graph Construction | Solver output contract |
| Reasoning Graph Construction | Answer Validation | Reasoning graph validation payload |
| Answer Validation | Stem Rendering | Approved canonical and answer metadata |
| Answer Validation | Explanation Rendering | Approved answer metadata |
| Reasoning Graph Construction | Explanation Rendering | Explanation renderer payload |
| Answer Validation | Distractor Generation | Approved answer metadata |
| Presentation Stages | Final Validation | Presentation metadata contracts |
| Final Validation | Question Package Assembly | Final validation approval |

## Pipeline Review Checklist

| Check | Status | Reviewer Notes |
| --- | --- | --- |
| All stages are specification-only | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Reasoning graph source-of-truth rule is preserved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Renderer dependencies are approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Validation-before-packaging rule is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Source trace preservation is approved | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
| Global system fallback is forbidden | PENDING HUMAN REVIEW | PENDING HUMAN REVIEW |
