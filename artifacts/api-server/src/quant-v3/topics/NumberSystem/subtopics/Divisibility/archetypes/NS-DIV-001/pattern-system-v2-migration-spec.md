# Pattern System V2 Migration Specification

## Scope

This document specifies a future migration from the current fixed template model to a structural pattern production model.

It is specification only. It does not modify code, generators, validators, CP-001, CP-002, libraries, or production behavior.

## Human Decision

Fixed templates will not remain a production generation source.

Fixed templates will remain only as:

| Future Fixed Template Role |
| --- |
| Regression Fixtures |
| Audit Fixtures |
| Reference Examples |
| Solver Validation Cases |

Future production generation will come only from structural patterns.

## Section 1: Current State

### Current Template-Based Production Flow

The current system stores fixed templates in `number-patterns.library.json`.

Examples:

```text
x24
2x4
24x
57x28
83x96
72849x
```

Current production flow:

```text
Fixed Template
-> Candidate Digit Substitution
-> Solver
-> Reasoning Graph
-> Explanation Renderer
-> Validator
-> Question Output
```

Current interpretation:

| Current Asset | Interpretation |
| --- | --- |
| Fixed template | Concrete number expression with one missing digit. |
| Non-missing digits | Literal digits. |
| `x` | Missing digit position. |
| Candidate digits | Substituted into `x`. |
| Generated output | Uses one of the approved fixed templates. |

## Section 2: Future State

Future production generation will use structural patterns as the production source.

Future production flow:

```text
Structural Pattern
-> Instance Generator
-> CP Pipeline
-> Question Output
```

Expanded flow:

```text
Structural Pattern
-> Concrete Number Instance
-> CP Parameter Package
-> Solver
-> Reasoning Graph
-> Explanation Renderer
-> Validator
-> Question Output
```

Future interpretation:

| Future Asset | Interpretation |
| --- | --- |
| Structural Pattern | Human-owned educational structure. |
| Instance Generator | Creates concrete number instances from approved structural patterns. |
| Concrete Number Instance | Generated number expression with one missing digit. |
| CP Pipeline | Existing or future CP-specific solving and rendering path. |
| Question Output | Final validated question package. |

## Section 3: Template Reclassification

Current fixed templates will be reclassified as fixture assets, not production generation sources.

| Current Template Role | Future Role |
| --- | --- |
| Production pattern source | Removed from future production generation. |
| Fixed concrete example | Reference Example |
| Known solver case | Solver Validation Case |
| Known regression case | Regression Fixture |
| Known audit case | Audit Fixture |

### Regression Fixtures

Fixed templates may be used to confirm that future changes do not break known behavior.

### Audit Fixtures

Fixed templates may be used as stable audit inputs for comparing output behavior across versions.

### Reference Examples

Fixed templates may be retained as human-curated examples of realistic structures or known cases.

### Solver Validation Cases

Fixed templates may be used to verify solver behavior on known concrete instances.

## Section 4: Structural Pattern Library

The future structural pattern library will be human-owned.

Approved V1 structural fields:

| Field | Ownership |
| --- | --- |
| Pattern ID | Human-owned |
| Length | Human-owned |
| Missing Position | Human-owned |
| Digit Pool | Human-owned |
| Repetition Policy | Human-owned |
| Fixed Position Constraints | Human-owned |

Field purposes:

| Field | Purpose |
| --- | --- |
| Pattern ID | Stable identifier for educational structure. |
| Length | Defines total digit count. |
| Missing Position | Defines location of missing digit. |
| Digit Pool | Defines which digits may be used by generator when creating non-missing positions. |
| Repetition Policy | Controls whether repeated digits are allowed. |
| Fixed Position Constraints | Allows structural restrictions on specific positions. |

## Section 5: Generator Responsibilities

Future generator responsibilities are documented here only. No implementation is approved.

| Responsibility | Description |
| --- | --- |
| Structural Pattern Selection | Select from approved structural patterns. |
| Concrete Instance Creation | Generate concrete non-missing digits from the approved digit pool. |
| Missing Position Preservation | Place `x` according to the approved missing position. |
| Repetition Policy Application | Apply approved repeated-digit policy. |
| Fixed Position Constraint Application | Respect approved position-specific constraints. |
| CP Compatibility Screening | Ensure generated instance can enter the requested CP pipeline. |
| Fixture Separation | Do not use fixed templates as production generation sources. |

## Section 6: Validator Responsibilities

Future validator responsibilities are documented here only. No implementation is approved.

| Responsibility | Description |
| --- | --- |
| Structural Pattern Approval Check | Confirm the structural pattern is approved. |
| Instance Provenance Check | Confirm the concrete instance was generated from an approved structural pattern. |
| Digit Pool Check | Confirm generated digits use the approved digit pool. |
| Missing Position Check | Confirm `x` appears in the approved position. |
| Repetition Policy Check | Confirm repeated digits comply with approved policy. |
| Fixed Position Constraint Check | Confirm approved position constraints are satisfied. |
| CP Contract Check | Confirm CP-001, CP-002, or future CP requirements are satisfied. |
| Fixture Role Check | Confirm fixed templates are used only as fixtures, not production sources. |

## Section 7: Audit Responsibilities

Future audits must report evidence at multiple layers.

### Structure-Level Audit

| Audit Area | Description |
| --- | --- |
| Structural Pattern Distribution | Frequency of each structural pattern. |
| Length Distribution | Frequency by digit length. |
| Missing Position Distribution | Frequency by missing position. |
| Digit Pool Usage | Evidence of digit pool usage. |
| Repetition Policy Evidence | Evidence of repeated digit occurrence. |

### Instance-Level Audit

| Audit Area | Description |
| --- | --- |
| Concrete Instance Distribution | Frequency of exact generated instances. |
| Repeated Instance Detection | Evidence of repeated concrete instances. |
| Fixture Leakage Detection | Evidence that fixed templates did or did not enter production generation. |
| Solver Validation Instance Coverage | Evidence from fixed solver validation cases. |

### Question-Level Audit

| Audit Area | Description |
| --- | --- |
| CP Distribution | Frequency by canonical problem. |
| Divisor Distribution | Frequency by divisor. |
| Answer Distribution | Frequency by final answer. |
| Stem Family Distribution | Frequency by stem family. |
| Question Language Distribution | Frequency by question language entry. |
| Explanation Style Distribution | Frequency by explanation style. |
| Validation Failure Count | Count of validation failures. |

### Audit Signals

The following must remain audit signals, not generation constraints:

| Signal | Status |
| --- | --- |
| Excessive Zeros | Audit Signal |
| Exam-Like Variety | Audit Signal |
| Uniform Digit Numbers | Audit Signal |
| Sequence-Heavy Numbers | Audit Signal |

These signals should produce evidence for human review. They must not automatically block generation unless a later human-approved specification changes their status.

## Section 8: Migration Phases

| Phase | Name | Description |
| --- | --- | --- |
| Phase A | Specification | Complete the structural pattern and migration specifications. |
| Phase B | Structural Pattern Library | Create a human-owned structural pattern library. |
| Phase C | Structural Generator | Implement generation from structural patterns after approval. |
| Phase D | Audit Validation | Audit structural, instance, and question outputs. |
| Phase E | Production Approval | Human review decides whether structural generation is approved for production. |

No migration phase is implemented by this document.

## Forbidden Work

| Work | Status |
| --- | --- |
| Implement migration | Forbidden |
| Modify CP-001 | Forbidden |
| Modify CP-002 | Forbidden |
| Create code | Forbidden |
| Modify generators | Forbidden |
| Modify validators | Forbidden |
| Implement Pattern System V2 | Forbidden |

