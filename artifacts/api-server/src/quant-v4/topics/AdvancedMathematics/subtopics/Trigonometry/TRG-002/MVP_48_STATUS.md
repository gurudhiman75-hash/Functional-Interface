# TRG-002 48-QL MVP Status

Status: **HUMAN-APPROVED 48-QL CANDIDATE — TRG-002 WORKFLOW PASS — REPRESENTATIVE RUNTIME VISUAL PASS — REAL APP/UI WRAPPER PENDING**

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

The current 48-QL candidate completed the post-self-review remediation cycle, full runtime verification, exam-style stem remodeling and representative artifact review. Human approval was recorded on 2026-08-16 for the exact reviewed candidate pinned below.

- AI/editorial remediation: **PASS for current candidate**
- known active blocker from the completed remediation pass: **0**
- representative runtime review artifact: **PASS**
- human review of designated QL review instances: **48 / 48 APPROVED**
- per-generated-seed visual PASS: **not claimed**
- real ExamTree/browser UI wrapper inspection: **PENDING**
- freeze eligible: **NO — app/UI wrapper gate still open**

Human-review approval is pinned in `HUMAN_REVIEW_APPROVAL.md` to source head `60e289ee6c89a3f595ad75038ac563daf2a5fc5f` and artifact id `9259815578`. Material edits after that head do not automatically inherit approval.

## Exam-readiness remediation

The approved candidate locks:

- exam-style student-facing stems across all 48 QLs, with direct asks and conventional elevation/depression wording;
- explicit 30°/60° point assignment in QL-049;
- explicit collinearity/same-side geometry in QL-071;
- more natural QL-007/024/043/076/083 wording and values;
- fully worked Hard reasoning in QL-081 and QL-096;
- genuine trig misconception distractors in QL-092;
- CP-009 diversity through QL-067 45°/30° and QL-069 45°/60° exact systems;
- Medium calibration for QL-052/055/058/061/064/095 and Hard retention for QL-096;
- conventional positive-first surd presentation for QL-067 and QL-095 instead of forms such as `-8 + 8√3`;
- natural decimal half-metre presentation in QL-073 and QL-076 options/answers;
- removal of the duplicated final equality in QL-081;
- corrected QL-015 depression construction with the redundant lower transfer line removed and the two-part height breakup shown externally beside the taller vertical using four visible arrowheads;
- QL-024 article grammar corrected in the final reviewed artifact.

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
- directional movement semantics;
- external height-breakup dimensions for unequal-height depression diagrams where required.

Representative final-artifact inspection confirmed clean ordinary elevation, ladder, broken-object, opposite-side and composite forms. QL-095/096 use separate nested 45° and 60° arcs rather than overlapping angle marks. QL-015 was visually rechecked after the final geometry correction and approved.

## Execution evidence

Workflow: `.github/workflows/trg-002-mvp48-verification.yml`

Latest successful approved-candidate run:

- run: **31932920092**
- approved source head: `60e289ee6c89a3f595ad75038ac563daf2a5fc5f`
- artifact id: **9259815578**
- artifact digest: `sha256:2e49ac250376d38fcd7fa21aa7be4d9906f9fed6d6ccc8a036dfe69bcad2788f`

PASS:

- targeted TRG-002 TypeScript compile;
- 576 canonical cases;
- 2,400 sweep cases;
- exact solution-label gate;
- difficulty regression;
- 14-strategy diagram gate;
- QL-015 depression helper / external height-breakup regression;
- high-risk projection gate;
- expanded 576-case final-editorial gate;
- 48-QL exam-style stem regression gate;
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
2. explicitly approve production freeze / next expansion after that wrapper check.

The human-review gate for the approved 48-QL candidate is complete.
