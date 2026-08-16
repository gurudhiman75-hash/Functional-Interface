# TRG-002 48-QL MVP Status

Status: **HUMAN-APPROVED 48-QL CANDIDATE — REAL EXAMTREE BROWSER WRAPPER PASS — FREEZE-ELIGIBLE**

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

The current 48-QL candidate completed the post-self-review remediation cycle, full runtime verification, exam-style stem remodeling, representative artifact review, human approval and the real ExamTree/browser-wrapper gate.

- AI/editorial remediation: **PASS for approved candidate**
- known active blocker from the completed remediation pass: **0**
- representative runtime review artifact: **PASS**
- human review of designated QL review instances: **48 / 48 APPROVED**
- real ExamTree/browser UI wrapper: **PASS**
- 48-QL ExamTree solution serialization: **PASS 48 / 48**
- responsive browser check at 390 × 844: **PASS**
- per-generated-seed visual PASS: **not claimed**
- freeze eligible: **YES**

Human-review approval remains pinned in `HUMAN_REVIEW_APPROVAL.md` to source head `60e289ee6c89a3f595ad75038ac563daf2a5fc5f` and artifact id `9259815578`. The later ExamTree wrapper commits are integration-only and do not change the approved question mathematics, stems, options, explanations, difficulty or canonical solution-diagram specifications.

Real-wrapper evidence is recorded in `EXAMTREE_WRAPPER_VALIDATION.md`.

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
- solution disclosure AFTER_ATTEMPT / solution stage;
- exact canonical-state binding required.

The shared diagram contract includes:

- visible angle arcs;
- degree labels tied to the marked angle;
- right-angle square markers at relevant ground/vertical intersections;
- separate `arcLane` values for distinct angles sharing one vertex;
- exact semantic measurement labels;
- directional movement semantics;
- external height-breakup dimensions for unequal-height depression diagrams where required.

Representative final-artifact inspection confirmed clean ordinary elevation, ladder, broken-object, opposite-side and composite forms. QL-095/096 use separate nested 45° and 60° arcs rather than overlapping angle marks. QL-015 was visually rechecked after the final geometry correction and approved.

The real ExamTree wrapper now renders the same structured solution-diagram data through the existing explanation pipeline. The solution directive is absent from the stem and is disclosed only through the solution panel.

## Approved-content execution evidence

Workflow: `.github/workflows/trg-002-mvp48-verification.yml`

Approved-content run:

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

## Real ExamTree wrapper evidence

Successful integration/browser run:

- run: **31945456581**
- integration head: `e0480a63188327fb4a4521f0ade2efc1970557cf`
- `verify` job: **PASS**
- `browser-wrapper` job: **PASS**

Additional PASS gates:

- all 48 approved QLs serialize their exact solution diagram + annotations through `EXAMTREE_TRIG_HEIGHTS_SVG_V1`;
- ExamTree student-app TypeScript check;
- production student-app build;
- Chromium Playwright against the real `/test/:id` UI;
- Practice → answer → Show Solution disclosure timing;
- QL-015 corrected geometry, external split-height dimensions and four visible arrowheads;
- mobile-width no-overflow check at 390 × 844.

## Activation

Still OFF:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

PR #761 remains open/unmerged.

## Next governance decision

The 48-QL English MVP has no remaining content, human-review or real-wrapper blocker and is now **FREEZE-ELIGIBLE**.

The next explicit decision is whether to:

1. freeze this approved 48-QL English baseline as the stable expansion base; and/or
2. begin the planned 48→96 English expansion.

Neither activation/publication nor the 48→96 expansion is performed automatically by this status change.
