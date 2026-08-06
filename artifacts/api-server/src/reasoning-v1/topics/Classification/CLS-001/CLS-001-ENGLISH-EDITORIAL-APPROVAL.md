# CLS-001 — English Editorial Approval

## Decision

The product owner explicitly approved the complete `CLS-001 — Classification / Odd One Out` English review corpus on 1 August 2026.

```text
Approval status:       APPROVED
Approval authority:    EXPLICIT_USER_EDITORIAL_SIGN_OFF
Approved locale:       en-IN
Approved at (UTC):     2026-08-01T02:10:00.000Z
Approved at (IST):     2026-08-01T07:40:00+05:30
```

## Approved corpus

```text
Permanent QL range:    CLS-QL-001 through CLS-QL-013
Permanent QLs:         13
English review items:  494
Question checkpoints:  CLS-CP-001 through CLS-CP-007
CP-008 questions:      0
```

Checkpoint split:

| Checkpoint | English review questions |
|---|---:|
| `CLS-CP-001` | 48 |
| `CLS-CP-002` | 20 |
| `CLS-CP-003` | 40 |
| `CLS-CP-004` | 40 |
| `CLS-CP-005` | 190 |
| `CLS-CP-006` | 80 |
| `CLS-CP-007` | 76 |
| **Total** | **494** |

QL split:

| QL | Review questions |
|---|---:|
| `CLS-QL-001` | 16 |
| `CLS-QL-002` | 16 |
| `CLS-QL-003` | 16 |
| `CLS-QL-004` | 20 |
| `CLS-QL-005` | 24 |
| `CLS-QL-006` | 16 |
| `CLS-QL-007` | 40 |
| `CLS-QL-008` | 70 |
| `CLS-QL-009` | 120 |
| `CLS-QL-010` | 40 |
| `CLS-QL-011` | 40 |
| `CLS-QL-012` | 52 |
| `CLS-QL-013` | 24 |
| **Total** | **494** |

## Source review evidence

The approved combined reviewer was assembled without altering question content from these exact green artifacts:

| Scope | Artifact ID | Digest | Questions |
|---|---:|---|---:|
| `CLS-CP-001` through `CLS-CP-005` | `8781484326` | `sha256:dd4b6937a08c4813f26b33d461b6533b2587e896ee5286a420426e949100c734` | 338 |
| `CLS-CP-006` | `8782575271` | `sha256:62b9838f5bfe3ca770d95760e9a04553d7cc898ae40146ef9b7039a34d77e239` | 80 |
| `CLS-CP-007` | `8802075274` | `sha256:f00fe0e899e210d5edd02c3096fc882a8d6508ff2683823d0736637e971c91cb` | 76 |

The combined total is `338 + 80 + 76 = 494` questions.

## Meaning of approval

This approval freezes the reviewed English learner-facing corpus as the accepted editorial authority for `CLS-001`.

It approves:

- English stems;
- answer options;
- correct answers;
- explanations and option checks;
- QL ownership and checkpoint allocation;
- chapter-wide English editorial quality.

The English manual may be reopened only for a proven:

- mathematical or logical defect;
- answer-integrity defect;
- ambiguity or competing-answer defect;
- source-parity defect;
- rendering defect;
- exam-pattern coverage defect.

Cosmetic variation alone does not reopen the approved English manual.

## Lifecycle boundary

Editorial approval is not product activation.

```text
Question Studio discovery:  disabled
Question Bank writing:      disabled
Test eligibility:           disabled
Public publication:         disabled
Hindi editorial approval:   not granted by this decision
Punjabi editorial approval: not granted by this decision
```

Hindi and Punjabi localisation/parity for `CLS-CP-003` through `CLS-CP-007` remains a separate controlled phase. Any later Question Studio, Question Bank, test or publication activation requires a separate explicit decision and proof.
