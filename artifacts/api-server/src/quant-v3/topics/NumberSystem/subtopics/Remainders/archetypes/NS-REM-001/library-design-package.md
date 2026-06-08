# NS-REM-001 Library Design Package

Archetype: NS-REM-001

Name: Remainder Conditions

Phase: Library Design Package

Status: Specification only

This document designs the human-owned educational libraries required before NS-REM-001 implementation begins. It does not create runtime libraries, generators, solvers, validators, reasoning graphs, audits, pipelines, tests, or code.

NS-REM-001 follows the NS-DIV-001 philosophy:

```text
Human owns educational content.
Code owns execution.
```

## Section 1: Target Remainder Library

Future file:

```text
target-remainder.library.json
```

Purpose:

Define allowed target remainders for each approved divisor.

Concept:

```text
Number % Divisor = Target Remainder
```

Example design:

| Divisor | Allowed Target Remainders |
|---:|---|
| 2 | 0, 1 |
| 3 | 0, 1, 2 |
| 4 | 0, 1, 2, 3 |
| 5 | 0, 1, 2, 3, 4 |
| 6 | 0, 1, 2, 3, 4, 5 |
| 7 | 0, 1, 2, 3, 4, 5, 6 |
| 8 | 0, 1, 2, 3, 4, 5, 6, 7 |
| 9 | 0, 1, 2, 3, 4, 5, 6, 7, 8 |
| 10 | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 |
| 11 | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 |

Target Remainder Selection Rules:

| Rule | Description |
|---|---|
| Valid range | Target remainder must be greater than or equal to 0 and less than the divisor. |
| Human-approved divisor only | Target remainders may be used only for approved divisors. |
| Zero is allowed | Remainder 0 is allowed when the question remains a remainder-condition problem rather than a pure divisibility problem. |
| Non-zero exposure | Batches should not over-concentrate on target remainder 0. |
| Valid set feasibility | A generated instance must have a valid value set that satisfies the target remainder. |

## Section 2: Structural Pattern Library

Future file:

```text
structural-pattern-library.json
```

Purpose:

Define educational structures for concrete number generation while avoiding fixed templates as the production source.

Pattern System V2 philosophy:

```text
Humans own educational structure.
Generator owns concrete number instances.
```

Approved structural fields:

| Field | Purpose |
|---|---|
| Pattern ID | Stable identifier for the educational structure. |
| Length | Total digit count. |
| Missing Position | Position of the candidate value slot. |
| Digit Pool | Digits allowed for non-missing positions. |
| Repetition Policy | Whether repeated digits are allowed. |
| Fixed Position Constraints | Restrictions such as first digit not equal to 0. |

Production rule:

Fixed templates must not be the production generation source. Fixed templates may be retained only as regression fixtures, audit fixtures, reference examples, and solver validation cases.

## Section 3: Difficulty Band Library

Future file:

```text
difficulty-bands.library.json
```

Required bands:

| Band | Description |
|---|---|
| Easy | Small divisor, short number, direct candidate evaluation, usually one valid value. |
| Medium | Larger number length, non-trivial target remainder, multiple valid values, or less obvious missing position. |
| Hard | Larger divisor, composite divisor, prime divisor requiring careful remainder work, longer number, or number formation answer. |

Difficulty factors:

| Factor | Impact |
|---|---|
| Larger divisor | Usually increases computation burden. |
| Larger number length | Increases reading and evaluation load. |
| Missing position | Middle positions may be less direct than last digit positions. |
| Multiple valid values | Requires valid set construction rather than direct answer. |
| Prime divisor | May require full candidate evaluation. |
| Composite divisor | May invite component reasoning, depending on divisor. |
| Target remainder complexity | Non-zero and less familiar target remainders increase difficulty. |
| Number formation answer | Requires an additional transformation after valid value selection. |

## Section 4: Distribution Target Library

Future file:

```text
distribution-targets.library.json
```

Purpose:

Control batch variety and prevent over-concentration.

Required distributions:

| Distribution | Requirement |
|---|---|
| Pattern Distribution | Structural patterns should rotate so no single pattern dominates. |
| Divisor Distribution | Approved divisors should receive balanced exposure. |
| Target Remainder Distribution | Target remainders should rotate within each divisor. |
| Difficulty Distribution | Easy, Medium, and Hard outputs should follow human-approved targets. |

Lessons from NS-DIV-001:

| Risk | Control |
|---|---|
| Pattern concentration | Track structural pattern distribution. |
| Divisor concentration | Track divisor distribution. |
| Question form repetition | Track question language distribution after language is approved. |
| Explanation repetition | Track explanation distribution after explanations are approved. |
| Overuse of easy targets | Track target remainder distribution, especially remainder 0. |

## Section 5: Question Language Library Design

Future file:

```text
question-language.library.json
```

Important:

This package does not create final question language. It defines the required language architecture only.

Required stem families:

| CP | Required Stem Family Coverage |
|---|---|
| CP-001 | Missing digit for given remainder. |
| CP-002 | Smallest valid value. |
| CP-003 | Greatest valid value. |
| CP-004 | Count valid values. |
| CP-005 | Sum of valid values. |
| CP-006 | Form smallest valid number. |
| CP-007 | Form greatest valid number. |

Required quantity:

| Area | Minimum Requirement |
|---|---|
| Stem families per CP | At least 3 human-approved stem families per CP. |
| Total CP coverage | CP-001 through CP-007 must all be covered. |
| Placeholder support | Stems must support number expression, divisor, and target remainder. |

Coverage requirements:

| Requirement | Description |
|---|---|
| CP ownership | Every stem must be mapped to a CP. |
| Target remainder visibility | Stems must clearly state the required remainder. |
| Candidate variable visibility | Stems must identify the missing digit/value being replaced. |
| Student task clarity | Stems must make the expected answer type clear. |
| No internal language | Stems must not mention systems, pipelines, contracts, graphs, validators, or metadata. |

## Section 6: Explanation Library Design

Future file:

```text
explanation.library.json
```

Important:

This package does not create final explanations. It defines the required explanation architecture only.

Required explanation styles:

| Style | Purpose |
|---|---|
| Teacher Style | Clear classroom-style explanation of the remainder condition and answer extraction. |
| Short Exam Style | Minimal calculation and final answer for exam-like solutions. |
| Detailed Teaching Style | More explicit valid set construction and answer extraction. |

Coverage requirements:

| Requirement | Description |
|---|---|
| CP coverage | CP-001 through CP-007 must all have conclusion templates. |
| Target remainder rule | Explanations must mention the required remainder condition. |
| Valid value set | Explanations must be able to display the valid value set. |
| Answer extraction | Explanations must show the CP-specific extraction rule. |
| Human tone | Explanations must read like a teacher or exam solution. |

Variation requirements:

| Area | Requirement |
|---|---|
| Style variety | Multiple approved styles must be available. |
| CP-specific conclusions | Each CP needs a distinct conclusion form. |
| Repetition control | Audit should track explanation style usage. |
| No internal language | Explanations must not mention graph, pipeline, validator, contract, traceability, or system metadata. |

## Section 7: Traceability Requirements

Every future generated question package must preserve:

| Field | Purpose |
|---|---|
| Pattern ID | Links the question to the structural pattern. |
| Instance ID | Links the question to the concrete generated instance. |
| Question ID | Unique output identifier. |
| CP ID | Identifies the canonical problem. |
| Stem Family ID | Identifies the human-approved question wording family. |
| Explanation Style ID | Identifies the human-approved explanation style. |

Traceability rule:

Traceability fields must be carried through parameter generation, solving, reasoning graph construction, explanation rendering, validation, audit reporting, and final output.

## Section 8: Audit Requirements

Future audit reports must include:

| Audit Field | Purpose |
|---|---|
| Pattern Distribution | Detect structural overuse. |
| Divisor Distribution | Detect divisor overuse. |
| Target Remainder Distribution | Detect overuse of specific target remainders. |
| Difficulty Distribution | Detect difficulty imbalance. |
| Question Language Distribution | Detect wording repetition. |
| Explanation Distribution | Detect explanation repetition. |
| Validation Failures | Report failed generated outputs. |
| Generation Failures | Report rejected or failed generation attempts. |

Audit should report batch-level evidence only. Educational judgment remains human-owned.

## Section 9: Implementation Readiness

| Library | Purpose | Owner | Runtime Usage | Validation Requirements |
|---|---|---|---|---|
| `target-remainder.library.json` | Define allowed target remainders by divisor. | Human | Select and validate target remainder. | Every target remainder must be in range and approved for its divisor. |
| `structural-pattern-library.json` | Define educational number structures. | Human | Generate concrete instances. | Must validate Pattern ID, length, missing position, digit pool, repetition policy, and fixed constraints. |
| `difficulty-bands.library.json` | Define difficulty categories. | Human | Label or select difficulty. | Every difficulty band must be registered and human-approved. |
| `distribution-targets.library.json` | Define batch distribution targets. | Human | Audit and generation balancing. | Distribution rules must be machine-readable and auditable. |
| `question-language.library.json` | Store approved stems. | Human | Render student-facing question. | Every rendered question must match a registered stem exactly after placeholder substitution. |
| `explanation.library.json` | Store approved explanation styles and conclusion templates. | Human | Render student-facing explanation. | Every rendered explanation must use an approved style and CP-specific conclusion. |

## Section 10: Final Recommendation

Mandatory libraries before implementation:

| Library | Mandatory |
|---|---:|
| `target-remainder.library.json` | YES |
| `structural-pattern-library.json` | YES |
| `question-language.library.json` | YES |
| `explanation.library.json` | YES |
| `distribution-targets.library.json` | YES |

Optional libraries before implementation:

| Library | Optional |
|---|---:|
| `difficulty-bands.library.json` | YES |
| Fixed template fixture file | YES |

Future libraries:

| Library | Future Use |
|---|---|
| `localization.library.json` | Multilingual support. |
| `distractor.library.json` | MCQ option generation if later approved. |
| `exam-profile.library.json` | Exam-specific distribution profiles. |

Final recommendation:

NS-REM-001 should not begin implementation until the mandatory human-owned libraries are approved. After approval, implementation should reuse the NS-DIV-001 reference architecture, with Target Remainder added as the core educational variable.
