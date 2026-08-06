# SYL-001 V5 Exam-Readiness Remediation

## Authority

```text
SYL_001_EXAM_READINESS_REMEDIATION_V5
```

This authority implements the accepted `SYL-001 V4 — Simple Exam-Readiness Review` as an additive learner projection over V4.

V3 remains the structured administrator proof and answer-key authority. V4 remains reproducible historical learner evidence. V5 corrects the learner-facing selection of explanation and diagram modes without changing solver mathematics or keyed answers.

## Implemented P0 corrections

### QL-008 answer-derived mode selection

`TWO_CONCLUSION_EITHER_OR` no longer automatically selects an either-or explanation.

The learner mode is derived from the actual pair status:

```text
EITHER_OR_FOLLOWS  -> EITHER_OR
ONLY_FIRST_FOLLOWS -> CONCLUSION_MASK
ONLY_SECOND_FOLLOWS-> CONCLUSION_MASK
BOTH_FOLLOW        -> CONCLUSION_MASK
NEITHER_FOLLOWS    -> CONCLUSION_MASK
```

Only a genuine complementary pair may use the exact-one proof or the `VENN_EITHER_OR` diagram.

For every other QL-008 answer, V5 explains conclusion I and conclusion II separately and finishes with the exact marked answer.

### QL-009 complete pair classification

Every pair-classification record now provides:

1. conclusion I logical status and reason;
2. conclusion II logical status and reason;
3. the exact selected relationship between the conclusions.

The reviewed seed-3 and seed-4 regressions are named in the exhaustive audit.

### Explanation-answer and diagram-answer gates

The V5 audit rejects:

- an either-or explanation for a non-either-or answer;
- an either-or diagram for a non-either-or answer;
- a pair or mask conclusion that does not contain the marked answer;
- a displayed conclusion without a reason;
- option labels that disagree with the semantic status.

## Implemented P1 explanation corrections

### Concrete counterexamples

Counterexample explanations narrate the stored canonical countermodel. They no longer merely state that a counterexample exists.

### Concrete possibility models

Possibility explanations narrate the stored satisfying model and state how that arrangement makes the displayed conclusion true.

### Concrete dual models

Possible-but-not-definite and dual-model explanations narrate both:

```text
Model 1 — conclusion true
Model 2 — conclusion false
```

Both models must preserve the statements.

### Complete mask explanations

Every two- and three-conclusion mask record provides one concise reason for every displayed conclusion, including conclusions that definitely follow.

### Logical status separated from task disposition

Learner option analysis now exposes the actual logical status first:

```text
Definitely follows
Possible, but not definite
Impossible
```

It then explains why that status does or does not satisfy the task. A definite conclusion is no longer labelled `Not proved` merely because it is the wrong answer to a non-following or possibility-selection task.

## Diagram safety correction

V5 treats unknown relations conservatively.

When a witness-transfer diagram would have to draw an unstated pair as fully separate, the diagram is omitted with:

```text
UNKNOWN_RELATION_NOT_DRAWN
```

When a stale either-or diagram conflicts with the actual answer, it is omitted with:

```text
ANSWER_MODE_MISMATCH
```

The text explanation remains available and carries the decisive witness or conclusion reasoning.

## Visible existence convention

Every V5 record exposes the following direction before the attempt, localized into English, Hindi and Punjabi:

```text
For this chapter, every class named in the statements is treated as non-empty.
```

The explanation may repeat this note when the keyed answer materially depends on the existence policy.

## Automated scope

The exhaustive V5 gate runs:

```text
18 provisional QLs × 80 seeds × 3 locales = 4,320 records
```

It verifies:

- QL-008 answer-derived explanation selection;
- QL-008 answer-derived diagram selection;
- QL-009 complete pair reasoning;
- all displayed conclusion reasons;
- concrete canonical model evidence;
- option logical-status labels;
- unknown-relation diagram omission;
- immutable delivery locks.

The human-review exporter produces:

```text
18 QLs × 6 seeds × 3 locales = 324 localized records
```

Files:

```text
SYL-001-V5-EXAM-READINESS-REVIEW.md
syl-001-v5-review.jsonl
syl-001-v5-summary.json
```

## Deliberately retained blockers

This V5 wave does not claim full release readiness.

The following remain separate decisions or human gates:

1. Replace the repeatedly dead `The statements are inconsistent` option, or add verified inconsistent-statement source contracts.
2. Complete native English editorial approval.
3. Complete native Hindi editorial approval.
4. Complete native Punjabi editorial approval.
5. Complete human diagram and viewport review at 360, 412 and 768 px.
6. Calibrate Easy/Medium/Hard and task-format weights against verified SSC, banking and Punjab-exam frequency.
7. Complete final source-profile and QL merge/split sign-off.

These blockers are exported in evidence and are not converted into automated approval.

## Lifecycle

```text
reviewStatus: REVISE
nativeEnglishEditorialStatus: PENDING
nativeHindiEditorialStatus: PENDING
nativePunjabiEditorialStatus: PENDING
humanViewportStatus: PENDING
deadOptionRemediationStatus: PENDING_SEPARATE_SOURCE_DECISION
mockWeightCalibrationStatus: PENDING_SEPARATE_SOURCE_DECISION
questionStudioEnabled: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
public: false
```

Do not merge this branch independently of V4 and V3. Do not allocate permanent QLs or enable delivery surfaces from automated V5 evidence alone.
