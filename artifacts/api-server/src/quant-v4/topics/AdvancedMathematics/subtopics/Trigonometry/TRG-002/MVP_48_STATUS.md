# TRG-002 48-QL MVP Status

Status: **POST-SELF-REVIEW REMEDIATION PASS — TRG-002 WORKFLOW PASS — REPRESENTATIVE RUNTIME VISUAL PASS — APP/UI + HUMAN REVIEW PENDING**

## Scope

`TRG-002 — Heights & Distances Applications` has a composed 48-QL English MVP candidate:

- TRG-CP-007: 12 permanent QLs
- TRG-CP-008: 12 permanent QLs
- TRG-CP-009: 12 permanent QLs
- TRG-CP-010: 12 permanent QLs
- total: **48**
- production target: **96**

The 20 proof anchors remain permanent and the MVP adds 28 roles from the Phase-0 ledger.

## Current review truth

A stricter self-review reopened the earlier editorial checkpoint and identified exam-readiness and diagram-presentation weaknesses. A second artifact-level pass then found student-facing exact-value presentation defects that mathematical gates did not catch. The active candidate has now been remediated and re-executed at the current source head.

- AI/editorial remediation: **PASS for current candidate**
- known active blocker from the completed remediation pass: **0**
- representative runtime review artifact: **PASS**
- per-generated-seed visual PASS: **not claimed**
- real ExamTree/browser UI wrapper inspection: **PENDING**
- human reviewed: **0 / 48**
- freeze eligible: **NO**

## Exam-readiness remediation

The current candidate locks:

- explicit 30°/60° point assignment in QL-049;
- explicit collinearity/same-side geometry in QL-071;
- more natural QL-007/024/043/076/083 wording and values;
- fully worked Hard reasoning in QL-081 and QL-096;
- genuine trig misconception distractors in QL-092;
- CP-009 diversity through QL-067 45°/30° and QL-069 45°/60° exact systems;
- Medium calibration for QL-052/055/058/061/064/095 and Hard retention for QL-096;
- conventional positive-first surd presentation for QL-067 and QL-095 instead of forms such as `-8 + 8√3`;
- natural decimal half-metre presentation in QL-073 and QL-076 options/answers;
- removal of the duplicated final equality in QL-081.

## Solution-diagram standard

For all 48 MVP QLs:

- solution diagram REQUIRED;
- stem diagram OPTIONAL/not automatic;
- solution disclosure AFTER_ATTEMPT;
- exact canonical-state binding required.

The shared diagram contract now includes:

- visible angle arcs;
- degree labels tied to the marked angle;
- right-angle square markers at relevant ground/vertical intersections;
- separate `arcLane` values for distinct angles sharing one vertex;
- exact semantic measurement labels;
- directional movement semantics.

Representative final-artifact inspection confirmed clean ordinary elevation, ladder, broken-object, opposite-side and composite forms. QL-095/096 use separate nested 45° and 60° arcs rather than overlapping angle marks.

## Execution evidence

Workflow: `.github/workflows/trg-002-mvp48-verification.yml`

Latest successful post-audit remediation run:

- run: **31820489042**
- head: `0a0b0fbe72bd053252d7dd05c33721a9aab522d2`
- artifact id: **9226750393**

PASS:

- targeted TRG-002 TypeScript compile;
- 576 canonical cases;
- 2,400 sweep cases;
- exact solution-label gate;
- difficulty regression;
- 14-strategy diagram gate;
- high-risk projection gate;
- expanded 576-case final-editorial gate, including natural presentation regressions;
- actual-runtime HTML/JSON review export;
- review artifact verification/upload.

Artifact: `trg-002-mvp48-runtime-review`.

## Activation

Still OFF:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

## Remaining gate

Before production freeze or 48→96 expansion under the current plan:

1. inspect solution presentation in the real ExamTree/browser wrapper;
2. complete human review of all 48;
3. explicitly approve the next expansion.
