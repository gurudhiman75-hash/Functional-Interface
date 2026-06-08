# Pattern System V2: Structural Pattern Model Specification

## Scope

This document specifies a possible future structural pattern model for Quant V3.

It is specification only. It does not modify code, generators, libraries, CP-001, CP-002, validators, solvers, reasoning graphs, explanation renderers, question language, or existing pattern data.

The V1 structural pattern schema in this document reflects human review resolution. Field behavior beyond the approved field list remains human-owned.

## Section 1: Current Model Analysis

### Current Pattern To Current Instance Relationship

The current system stores entries such as:

```text
x24
2x4
24x
7x24
72x4
724x
57x28
8396x
72849x
```

These entries are currently called patterns, but the implementation treats each entry as a fixed template containing concrete digits.

Example:

| Current Pattern | Current Interpretation |
| --- | --- |
| `72849x` | Fixed template |

For `72849x`, the digits `7`, `2`, `8`, `4`, and `9` are literal. Only `x` is replaced by candidate digits.

The current relationship is:

```text
Current Pattern
-> Current Instance Family
```

Example:

```text
72849x
-> 728490, 728491, 728492, 728493, 728494, 728495, 728496, 728497, 728498, 728499
```

The current model does not express:

```text
Length = 6
Missing Position = 6
```

as an abstract educational structure. It stores one concrete fixed template that happens to have that length and missing position.

### Strengths

| Strength | Description |
| --- | --- |
| Human control is direct | Every stored entry is visible and manually reviewable. |
| Output is predictable | The generator can only use approved fixed templates. |
| Validation is simple | Membership can be checked by exact string match. |
| Auditing is easy at the template level | Reports can count exact stored entries. |
| No hidden digit creation rules | Non-missing digits do not come from generator logic. |

### Weaknesses

| Weakness | Description |
| --- | --- |
| Limited variety | Each approved entry creates a narrow family of instances. |
| Concrete digits are mixed with educational structure | Length and missing position are not separated from literal digit choices. |
| Library growth is manual-heavy | More output variety requires adding many concrete templates. |
| Coverage gaps can appear artificial | A missing 6-digit pattern means no 6-digit structure is available, even if the educational idea is simple. |
| Distribution can over-repeat templates | High-volume generation may repeatedly use the same fixed structures. |
| Educational intent is implicit | The reason a template exists must be inferred from its digits and position unless separately documented. |

### Audit Findings Caused By Current Design

| Finding | Relationship To Current Design |
| --- | --- |
| No approved 4-digit first-missing pattern existed before expansion | The library needed a literal entry such as `x724`, not just a structural approval for 4-digit position 1. |
| No approved 6-digit patterns existed before expansion | The library needed literal 6-digit entries for every desired position. |
| Certain templates repeated heavily in production audit | Fixed templates concentrate output around the same concrete digit arrangements. |
| Question review CSVs contain repeated exact structures | Concrete templates are reused rather than generating varied concrete instances from one structure. |
| Pattern distribution reports count literal strings | Audits cannot distinguish structural coverage from concrete-instance coverage. |

## Section 2: Define Structural Pattern

A structural pattern must represent educational structure, not concrete digits.

### Approved V1 Structural Pattern Fields

Only the following fields are part of the V1 structural pattern schema.

| V1 Field | Purpose |
| --- | --- |
| Pattern ID | Stable identifier for educational structure. |
| Length | Defines total digit count. |
| Missing Position | Defines location of missing digit. |
| Digit Pool | Defines which digits may be used by the generator when creating non-missing positions. |
| Repetition Policy | Controls whether repeated digits are allowed. V1 decision: repeated digits are allowed. |
| Fixed Position Constraints | Allows structural restrictions on specific positions. |

### Fields Removed From V1 Structural Pattern Schema

The following fields are not part of the V1 structural pattern definition.

| Removed Field | Status |
| --- | --- |
| Difficulty Band | Removed from V1 structural pattern schema. |
| Compatible Divisors | Removed from V1 structural pattern schema. |
| Review Status | Removed from V1 structural pattern schema. |

### Field Notes

| Field | Notes |
| --- | --- |
| Pattern ID | Stable identifier for educational structure. |
| Length | Defines total digit count. Examples: `3-digit`, `4-digit`, `5-digit`, `6-digit`. |
| Missing Position | Defines location of missing digit. Examples: `Position 1`, `Position 2`, `Position 3`. |
| Digit Pool | Defines which digits may be used by generator when creating non-missing positions. Examples: `0-9`, `1-9`, custom approved pools. These examples are documented only and do not approve additional pools. |
| Repetition Policy | Controls whether repeated digits are allowed. Approved V1 policy: repeated digits are allowed. Valid future instance examples include `11x11`, `22x4`, `100x8`, and `909x`. Repeated digits are common in competitive-exam questions and must not be prohibited. |
| Fixed Position Constraints | Allows structural restrictions on specific positions. Examples: `First Digit != 0`, `Last Digit != 0`, `Position 2 != Position 5`. These examples are documented only and do not approve constraints. |

### Approved V1 Realism Decisions

| Decision | Approved Resolution |
| --- | --- |
| Repetition Policy | Repeated digits are allowed. Do not prohibit repeated digits. |
| Excessive Zeros | Generator should avoid excessive zeros as an educational realism constraint. |
| Exam-Like Digit Variety | Generator should aim for exam-like digit variety. |
| Structural Patterns And Fixed Templates | Structural patterns and fixed templates shall coexist. Do not remove the current template system and do not mark it deprecated. |

### Excessive Zero Realism Constraint

The future generator should avoid excessive zeros.

Examples of undesirable future instances:

```text
00x00
10x00
000x8
```

Reason: such numbers are mathematically valid but often appear unnatural in competitive-exam settings.

### Exam-Like Digit Variety Objective

The future generator should aim for exam-like digit variety.

Examples that should not dominate generation:

```text
123x4
234x5
345x6
111x1
222x2
333x3
```

Reason: the goal is educational realism, not merely mathematical validity.

## Section 3: Pattern Vs Instance

The future relationship should be:

```text
Structural Pattern
-> Concrete Number Instance
```

A pattern would describe structure. The generator would create concrete instances under approved constraints.

Example structural pattern:

```text
Length = 6
Missing Position = 6
```

Possible concrete instances:

```text
58214x
94735x
31628x
72491x
```

In this model:

| Concept | Meaning |
| --- | --- |
| Pattern | Human-reviewed educational structure. |
| Instance | Concrete number expression created by the generator from the approved structure. |
| Non-missing digits | Generator-owned concrete values, subject to human-approved constraints. |
| Missing digit symbol | Structural location where candidate digits are evaluated. |

The current entry `72849x` would be treated as a concrete instance in the future model, not as the full structural pattern.

### Coexistence With Fixed Templates

Structural patterns and fixed templates shall coexist.

| System | Ownership |
| --- | --- |
| Structural Patterns | Own educational structure: Length, Missing Position, Digit Pool, Repetition Policy, Fixed Position Constraints. |
| Fixed Templates | Remain available as seed examples, audit fixtures, regression fixtures, and human-curated reference cases. |

The current template system must not be removed and must not be marked deprecated by this specification.

## Section 4: Human Ownership

The following areas should remain human-owned in a future structural model.

| Human-Owned Area | Reason |
| --- | --- |
| Pattern ID | Stable structure identity must remain human-owned. |
| Length | Length controls educational exposure. |
| Missing Position | Missing position changes reasoning and exam realism. |
| Digit Pool | Allowed non-missing digits must be curated. |
| Repetition Policy | Repeated digits are allowed by human decision. |
| Fixed Position Constraints | Position-specific restrictions must remain curated. |
| Educational Restrictions | Rules such as forbidden structures or special cases must remain curated. |

## Section 5: Generator Ownership

The following areas may be generator-owned only after human approval of the structural model.

| Generator-Owned Area | Purpose |
| --- | --- |
| Actual Digits | Choose concrete non-missing digits within approved constraints, while avoiding excessive zeros and aiming for exam-like digit variety. |
| Concrete Number Creation | Produce specific instances from structural patterns. |
| Instance Selection | Select from generated valid instances for output. |
| Candidate Screening | Reject generated instances that violate approved CP requirements. |
| Distribution Balancing | Balance generated instances across approved structures, if later specified. |

Generator ownership must remain bounded by human-owned structure and constraints.

## Section 6: Compatibility Analysis

### CP-001

CP-001 currently requires exactly one valid missing digit. A structural model would require the generator to create concrete instances that satisfy the CP-001 uniqueness requirement before output.

Potential impact:

| Area | Impact |
| --- | --- |
| Parameter generation | Would need to generate and screen concrete instances. |
| Solver | Could remain candidate-evaluation based if inputs remain concrete by solve time. |
| Validation | Would need to verify that the instance came from an approved structural pattern. |

### CP-002

CP-002 currently requires a non-empty valid digit set and selects the largest valid digit. A structural model would require the generator to create concrete instances with valid digit set size at least 1.

Potential impact:

| Area | Impact |
| --- | --- |
| Parameter generation | Would need to reject empty valid set instances. |
| Solver | Could remain candidate-set based if concrete instance is already produced. |
| Validation | Would need structural provenance plus existing valid set validation. |

### Future CP-003

Future CP-003 may share valid digit set construction and select the smallest valid digit.

Potential impact:

| Area | Impact |
| --- | --- |
| Structural pattern use | Future CP-003 must define how it uses approved structures. |
| Instance generation | Must produce non-empty valid sets. |
| Validation | Must verify smallest-valid selection against generated instance. |

### Future CP-004

Future CP-004 may count valid digits.

Potential impact:

| Area | Impact |
| --- | --- |
| Structural pattern use | Future CP-004 must define how it uses approved structures. |
| Instance generation | Must preserve full candidate evaluation metadata. |
| Validation | Must verify count against valid digit set. |

### Reasoning Graph

The reasoning graph may need to distinguish structural pattern metadata from concrete instance metadata.

Potential impact:

| Area | Impact |
| --- | --- |
| Graph inputs | May include structural pattern ID and generated instance ID. |
| Graph outputs | May preserve both structure and concrete instance trace. |
| Ownership | Must keep human-owned structure visible. |

### Solver

The solver should receive a concrete number expression by solve time.

Potential impact:

| Area | Impact |
| --- | --- |
| Solver input | May remain mostly unchanged if generation resolves structure into instance first. |
| Solver responsibility | Should not own educational structure generation decisions. |

### Validator

The validator may need to validate two layers:

```text
Structural Pattern Approval
Concrete Instance Validity
```

Potential impact:

| Area | Impact |
| --- | --- |
| Structure validation | Check structural pattern ID and approved fields. |
| Instance validation | Check concrete digits, missing position, divisor, CP requirements. |
| Trace validation | Confirm instance was generated from approved structure. |

### Explanation Renderer

The explanation renderer should continue explaining the mathematics of the concrete instance.

Potential impact:

| Area | Impact |
| --- | --- |
| Explanation content | Should not describe generator behavior. |
| Graph dependency | Should consume graph output only. |
| Structural metadata | Should not leak into student-facing explanation unless human-approved. |

### Question Language

Question language may remain template-driven with `{number}` and `{divisor}` placeholders.

Potential impact:

| Area | Impact |
| --- | --- |
| Stem rendering | `{number}` would receive a generated concrete instance. |
| Language library | No change required unless human review wants new wording. |

## Section 7: Migration Analysis

Current model:

```text
number-patterns.library.json
-> allowedStructures
-> fixed concrete templates
```

Potential future model:

```text
structural-patterns.library.json
-> approved structural patterns
-> generator creates concrete instances
-> solver receives concrete instance
```

Possible future mapping:

| Current Entry | Potential Future Interpretation |
| --- | --- |
| `72849x` | Concrete instance generated from a structure such as Length 6, Missing Position 6. |
| `x724` | Concrete instance generated from a structure such as Length 4, Missing Position 1. |
| `57x28` | Concrete instance generated from a structure such as Length 5, Missing Position 3. |

Migration is not approved in this document.

No existing library should be changed without a separate human-approved migration phase.

The current fixed template system remains available during any future migration as seed examples, audit fixtures, regression fixtures, and human-curated reference cases.

## Section 8: Human Decision Resolutions

The following decisions have been resolved by human review.

| Decision | Resolution |
| --- | --- |
| Should repeated digits be allowed in generated instances? | APPROVED: repeated digits are allowed. |
| Should generated instances avoid excessive zeros? | APPROVED: generator should avoid excessive zeros as a realism constraint. |
| Should generated instances require exam-like digit variety? | APPROVED: generator should aim for exam-like digit variety. |
| Should structural patterns replace or coexist with fixed templates? | APPROVED: structural patterns and fixed templates shall coexist. |

## Section 9: Risks

### Benefits

| Benefit | Description |
| --- | --- |
| Better variety | Many concrete instances can come from one approved structure while preserving fixed templates for review and regression use. |
| Cleaner ownership | Humans own educational structure; generator owns concrete digits. |
| Better coverage reporting | Audits can distinguish structure coverage from instance coverage. |
| Reduced manual library growth | New variety does not require manually listing every concrete template. |
| Stronger future CP support | CP-003 and CP-004 can share structural foundations. |

### Risks

| Risk | Description |
| --- | --- |
| Generator may create unrealistic numbers | Excessive-zero and exam-like variety constraints must be enforced in a future implementation phase. |
| Hidden educational behavior may enter generation | Requires strict traceability and validation. |
| Distribution may become harder to audit | Requires separate structure and instance reporting. |
| Migration may break existing assumptions | Current code expects exact string templates. |
| Explanations may accidentally expose system behavior | Renderer boundaries must remain strict. |

### Unknowns

| Unknown | Notes |
| --- | --- |
| Best digit-generation constraints | Requires human review and production audits. |
| Ideal distribution across structures | Requires batch evidence. |
| Whether fixed templates should remain allowed | Resolved: fixed templates shall coexist with structural patterns. |
| How to version structural patterns | Requires architecture review. |

### Tradeoffs

| Tradeoff | Description |
| --- | --- |
| Control vs variety | Fixed templates maximize control; structural patterns increase variety. |
| Simplicity vs expressiveness | Current exact-match validation is simple; structural validation is richer. |
| Manual effort vs generator responsibility | Structural patterns reduce manual template entry but require stronger generator constraints. |
| Audit clarity vs system complexity | More metadata improves audit clarity but adds implementation surface. |
