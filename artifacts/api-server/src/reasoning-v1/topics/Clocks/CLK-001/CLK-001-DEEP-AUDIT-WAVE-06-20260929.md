# CLK-001 — Deep Audit Wave 06

Date: 2026-09-29

Status: `FINAL_GENERATED_SURFACE_QUALITY_AUDIT_IN_PROGRESS`

## Item-level difficulty correction

Question Studio previously displayed the permanent QL's `defaultDifficulty` even when the generated variant carried a different item-level difficulty from `ITEM_LEVEL_V1`.

Wave 06 changes the learner/reviewer surface to use the actual generated item's difficulty.

Traceability now includes:

- `difficultyAuthority: ITEM_LEVEL_V1`;
- baseline score;
- generated-item score;
- generated-item factors.

Difficulty filters also operate on actual generated-item bands. They no longer reject or include a generated question merely because its parent QL has a different baseline band.

## Localization cleanup

The full multilingual authoring surface was scanned for English clock-jargon leakage.

Removed mixed-language residue including:

- rate;
- strike count;
- consecutive gap;
- durations;
- timeline;
- anchor.

Hindi and Punjabi remain semantic, native learner surfaces rather than English technical prose with script-localized wrappers.

## Diagram governance

Question media is permitted only when the diagram is the learner input or option for a genuine visual-literacy contract.

Core authorable visual tasks:

- `READ_TIME_FROM_DIAGRAM`;
- `SELECT_DIAGRAM_FOR_TIME`;
- `READ_ANGLE_TYPE_FROM_DIAGRAM`;
- `IDENTIFY_SMALLER_REFLEX_FROM_DIAGRAM`.

Non-visual Clock tasks must remain text-only. Held visual/synthesis candidates remain excluded from authoring.

## Final generated-surface regression

`clk-001-deep-audit-wave6.test.ts` checks:

1. displayed difficulty equals generated item-level difficulty;
2. Easy / Medium / Hard filtering returns only actual item-level matches;
3. all effective authoring tasks retain:
   - four unique options;
   - exactly one correct answer;
   - solver binding;
   - explicit wrong-option reason codes;
   - no more than one generic fallback distractor;
4. question media is restricted to genuine visual-literacy authoring tasks;
5. Hindi/Punjabi generated stems and explanations contain no blocked English clock-jargon residue.

## Lifecycle

No product activation changes in this wave.

- Question Studio: review-only;
- Question Bank writes: disabled;
- test/mock eligibility: disabled;
- public/student publication: disabled.

## Next decision

If Wave 06 passes without learner-facing defects, CLK-001 can proceed to final content deep-audit closure.

If it fails, remediate the concrete generator/localization defect and rerun the same gate.

## Result

`CLK_001_WAVE06_FINAL_QUALITY_GATE_READY`
