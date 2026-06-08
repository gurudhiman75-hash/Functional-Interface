# Pattern System V2 Implementation Plan

## Scope

This is a planning document only.

It does not implement Pattern System V2, migrate templates, redesign CP-001, redesign CP-002, create generators, create validators, or create migration code.

## Section 1: Current System

The current NS-DIV-001 number pattern system stores fixed templates in `number-patterns.library.json`.

Current examples:

```text
x24
2x4
24x
57x28
83x96
72849x
```

Current behavior:

| Area | Current Model |
| --- | --- |
| Pattern storage | Fixed concrete templates. |
| Non-missing digits | Literal digits stored in the template. |
| Missing digit | The single `x` position is replaced by candidate digits. |
| Generator responsibility | Select an approved fixed template and divisor combination. |
| Solver responsibility | Evaluate the concrete template after candidate substitution. |
| Validator responsibility | Validate against current fixed-template library and CP requirements. |

## Section 2: Future Coexistence Model

Pattern System V2 is planned as a coexistence model.

```text
Structural Patterns
*
Fixed Templates
```

| System | Role |
| --- | --- |
| Structural Patterns | Own educational structure. |
| Fixed Templates | Remain available as seed examples, audit fixtures, regression fixtures, and human-curated reference cases. |

Structural patterns own:

| Field |
| --- |
| Length |
| Missing Position |
| Digit Pool |
| Repetition Policy |
| Fixed Position Constraints |

Fixed templates remain available as:

| Role |
| --- |
| Seed Examples |
| Audit Fixtures |
| Regression Fixtures |
| Human-Curated Reference Cases |

The current template system must not be removed and must not be marked deprecated.

## Section 3: Template To Structure Mapping

The following mappings are examples for future analysis only. They do not migrate current templates.

| Fixed Template | Future Structural Interpretation |
| --- | --- |
| `72849x` | Length = 6; Missing Position = 6; Digit Pool = human-approved pool; Repetition Policy = allowed; Fixed Position Constraints = future-reviewed constraints. |
| `57x28` | Length = 5; Missing Position = 3; Digit Pool = human-approved pool; Repetition Policy = allowed; Fixed Position Constraints = future-reviewed constraints. |
| `83x96` | Length = 5; Missing Position = 3; Digit Pool = human-approved pool; Repetition Policy = allowed; Fixed Position Constraints = future-reviewed constraints. |

In the future model, these fixed templates may serve as seed examples or regression fixtures while structural patterns generate new concrete instances.

## Section 4: Generator Responsibilities

Documented for future implementation only.

Future generator responsibilities may include:

| Responsibility | Description |
| --- | --- |
| Structural Pattern Selection | Select an approved structural pattern. |
| Concrete Digit Creation | Generate non-missing digits from the approved digit pool. |
| Repetition Policy Compliance | Allow repeated digits according to approved V1 policy. |
| Excessive Zero Avoidance | Avoid future instances such as `00x00`, `10x00`, and `000x8`. |
| Exam-Like Variety | Avoid allowing sequences such as `123x4`, `234x5`, `345x6`, `111x1`, `222x2`, and `333x3` to dominate generation. |
| Fixed Template Support | Continue allowing fixed templates as seed examples, audit fixtures, regression fixtures, and human-curated reference cases. |

No generator implementation is approved by this document.

## Section 5: Validator Responsibilities

Documented for future implementation only.

Future validator responsibilities may include:

| Responsibility | Description |
| --- | --- |
| Structural Pattern Validation | Confirm that a generated instance traces to an approved structural pattern. |
| Fixed Template Validation | Continue validating fixed templates during coexistence. |
| Digit Pool Validation | Confirm generated digits belong to the approved digit pool. |
| Repetition Policy Validation | Confirm repeated digits are allowed and not incorrectly rejected. |
| Fixed Position Constraint Validation | Confirm generated instances satisfy approved position-specific constraints. |
| Realism Constraint Validation | Check excessive-zero and exam-like variety constraints if later implemented. |
| CP Validation Preservation | Preserve existing CP-001 and CP-002 validation behavior during migration. |

No validator implementation is approved by this document.

## Section 6: Audit Responsibilities

Documented for future implementation only.

Future audits may need to report both structure-level and template-level evidence.

| Audit Area | Description |
| --- | --- |
| Structural Pattern Distribution | Count usage by structural pattern ID. |
| Fixed Template Distribution | Count usage by fixed template when fixed templates are used. |
| Concrete Instance Distribution | Count exact generated instances. |
| Digit Repetition Evidence | Report repeated-digit occurrence. |
| Excessive Zero Evidence | Report instances matching excessive-zero risk patterns. |
| Exam-Like Variety Evidence | Report sequence-heavy or overly uniform instances. |
| CP Continuity Evidence | Report CP-001 and CP-002 generation and validation outcomes during coexistence. |

No audit implementation is approved by this document.

## Section 7: Backward Compatibility

CP-001 and CP-002 must continue to function during any future migration.

| Component | Backward Compatibility Requirement |
| --- | --- |
| CP-001 | Must continue accepting current fixed-template pipeline until a separate migration phase is approved. |
| CP-002 | Must continue accepting current fixed-template pipeline until a separate migration phase is approved. |
| Existing Templates | Must remain available and not be marked deprecated. |
| Existing CSV Review Workflows | Must remain interpretable during coexistence. |
| Existing Audits | Must continue supporting fixed-template evidence. |

No CP-001 or CP-002 redesign is approved by this document.

## Section 8: Migration Phases

The following phases are planning labels only.

| Phase | Name | Description |
| --- | --- | --- |
| Phase A | Specification | Finalize structural pattern schema and coexistence rules. |
| Phase B | Dual-System Support | Plan support for both structural patterns and fixed templates. |
| Phase C | Structural Generation | Plan future generator behavior for structural patterns. |
| Phase D | Production Audit | Audit generated structural instances alongside fixed-template outputs. |
| Phase E | Migration Decision | Human review decides whether to continue coexistence, expand V2, or adjust the model. |

No phase is implemented by this document.

