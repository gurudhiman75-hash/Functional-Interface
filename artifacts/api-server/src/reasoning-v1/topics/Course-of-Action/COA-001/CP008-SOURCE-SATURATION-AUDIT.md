# COA-001 / COA-CP-008 — Source Saturation + Exam-realness Audit

Status: **IMPLEMENTED / HUMAN REVIEW PENDING**

## Purpose

CP008 audits the English Course-of-Action chapter against observed exam-style presentation patterns and the current semantic corpus before multilingual expansion.

This checkpoint is additive. It does not rewrite approved CP001–CP006 English authorities and it does not silently approve CP007.

## Source findings

### 1. Two-course five-code presentation is source-backed

Observed banking/competitive-exam reasoning material uses the following answer shell for a statement followed by Course I and Course II:

1. Only I follows
2. Only II follows
3. Either I or II follows
4. Neither I nor II follows
5. Both I and II follow

Verified examples/surfaces include:

- Studyadda Banking Reasoning — Statement and Course of Action question bank;
- Testbook Course-of-Action solved questions, including examples where the keyed answer is `Either I or II follows`;
- Oliveboard Statement & Course of Action practice material using the five-code shell;
- ISBT reasoning practice for banking/SSC/Railway using the same five-code direction.

Architecture consequence: `TWO_ACTION_FIVE_CODE` is no longer source-unsupported as a presentation shell.

However, the answer class `Either I or II` is **not** equivalent to `Both`. It requires a genuine exclusive-alternative relationship in the semantic authority. Ordinary four-class authorities must never be padded into a five-code question.

Therefore the approved CP005 fail-closed generator remains untouched until a dedicated exclusive-either authority model is implemented and reviewed.

### 2. Four-option paired presentation also exists

Some Course-of-Action material uses four answer options without an `Either` class, typically Only I / Only II / Neither / Both. This supports keeping paired presentation independent from semantic QL identity.

### 3. Multiple-course / best-action surfaces exist, but are not yet frozen for v1

Course-of-Action teaching and practice material also includes questions with more than two proposed actions or asks for the most appropriate action. These are presentation/candidate-model variants, not evidence for a new semantic reasoning family.

CP008 does not promote them into v1 generation without a stronger exam-specific source set and a dedicated authority model.

## Semantic QL allocation audit

### COA-QL-001 — Direct remedial action
**KEEP.** Distinct direct-response operation.

### COA-QL-002 — Preventive / risk-reduction action
**KEEP.** Distinct when recurrence or risk reduction is central.

### COA-QL-003 — Verification before irreversible action
**KEEP.** Distinct evidence/uncertainty operation.

### COA-QL-004 — Administrative / institutional response
**KEEP WITH OVERLAP GUARD.** Valid where operational authority/process is itself material. If direct remedy, verification, constraint or proportionality alone decides the question, assign the more specific QL instead.

### COA-QL-005 — Constraint-aware action
**KEEP.** Explicit staffing, capacity, continuity, time, access, safety or resource limits materially change correctness.

### COA-QL-006 — Proportionality / overreaction
**KEEP.** Distinct when an otherwise relevant response is unnecessarily broad, severe, collective or disruptive.

### COA-QL-007 — Paired courses
**RETIRE AS A PERMANENT SEMANTIC QL.** Paired Course I / Course II is a presentation dimension, not a learner operation. Preserve CP001 legacy QL007 calibration IDs only for backward compatibility and audit traceability.

### COA-QL-008 — Multi-step / ordered response
**KEEP.** Order/dependency is genuinely distinct.

### COA-QL-009 — Integrated exam-grade reasoning
**KEEP WITH STRICT BOUNDARY.** The question must require multiple material reasoning dimensions and must not be solvable by one earlier-family rule alone.

## Saturation finding

The current English semantic architecture covers:

- direct correction/restoration;
- prevention and risk reduction;
- verification before punishment or irreversible change;
- institutional/administrative authority;
- staffing, time, capacity, continuity and resource constraints;
- proportionality and blanket-overreaction traps;
- ordered containment, verification and correction;
- integrated evidence + constraint + proportionality + sequence reasoning.

**CP008 found no justified additional semantic QL.**

The semantic taxonomy is therefore **PROVISIONALLY SATURATED**, subject to CP007 human approval and CP008 human approval.

## Remaining implementation gaps

1. **Exclusive-either semantic authority**
   - The five-code shell is source-backed.
   - Genuine `Either I or II` cases need a dedicated semantic relationship and proof.
   - Do not infer this class from two independently following actions.

2. **Alternative presentation models**
   - Multiple-course / best-action surfaces exist in practice material.
   - Keep blocked for v1 until a stronger exam-specific source set and dedicated authority model justify implementation.

3. **Punjab-state-specific COA presentation**
   - No distinct Punjab-only shell is established by this audit.
   - Do not invent one.

4. **QL004 overlap control**
   - Continue rejecting generic administrative classification when a more specific QL fully explains the reasoning operation.

## Exam-realness rules frozen by this audit candidate

- stems must be concise, complete and exam-like;
- difficulty comes from reasoning, not vocabulary;
- wrong actions should usually be plausible near-misses;
- no shortcut rule such as “extreme words are always wrong”;
- explanations state the decisive issue in simple language;
- semantic correctness is independent of presentation;
- never create an answer class only to imitate a five-option shell;
- never relabel an ordinary single-rule question as QL009 merely to make it appear harder.

## CP008 candidate decisions

| Item | Decision |
|---|---|
| `TWO_ACTION_FOUR_WAY` | SUPPORTED |
| `TWO_ACTION_FIVE_CODE` | SOURCE_BACKED / EXCLUSIVE_EITHER_AUTHORITY_REQUIRED |
| multiple-course / best-action presentation | EVIDENCE_EXISTS / NOT_V1_FROZEN |
| `THREE_ACTION_COMBINATION` | BLOCKED_PENDING_STRONGER_EXAM_EVIDENCE |
| QL007 semantic status | RETIRE_CANDIDATE / PRESENTATION_ONLY |
| additional semantic QL needed | NO |
| semantic taxonomy | PROVISIONALLY_SATURATED |
| final QL freeze | REQUIRES_CP007_AND_CP008_APPROVAL |

## Lifecycle

- CP001–CP006: APPROVED / FROZEN
- CP007: HUMAN REVIEW PENDING
- CP008: HUMAN REVIEW PENDING
- QL allocation: PROVISIONALLY SATURATED / NOT FINAL-FROZEN
- Hindi/Punjabi: NOT STARTED
- Question Studio: CLOSED
- Question Bank writes: CLOSED
- test/mock eligibility: CLOSED
- public/student delivery: CLOSED

Green CI or source evidence does not itself approve CP007/CP008 or promote lifecycle eligibility.
