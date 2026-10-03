# SYL-001 — Syllogism

Status: **closed for multilingual Question Studio generation; downstream delivery remains locked**.

## Inventory

- authority: `SYL_001_MULTILINGUAL_REVIEW_RUNTIME_V2`;
- explanation schema: `syl-pedagogy-v2`;
- diagram architecture: `syl-venn-geometry-v2`;
- permanent review QLs: `SYL-QL-001..018`;
- checkpoints: `SYL-CP-001..007`;
- source patterns: 6;
- source-shaped scenarios: 36;
- locales: `en-IN`, `hi-IN`, `pa-IN`.

## Pedagogy remodel

- four-tier teacher-voice explanations;
- no solver booleans, witness-region dumps or model-checker jargon in student text;
- statement-order parity between the displayed question and explanation;
- true relation geometry for inclusion, exclusion, overlap, some-not and only-a-few;
- forced-fact, can-be-true and can-be-false panels where one drawing would overstate the premises;
- diagnostic tags retained only in administrator metadata;
- natural Hindi and Punjabi teaching vocabulary with exact semantic parity.

## Validation

- formal foundation adversarial proof;
- 4,320-question multilingual semantic and pedagogy audit;
- 108-question HTML/JSONL review export;
- primary and independent solver agreement;
- SVG relation-geometry and accessibility checks;
- all delivery locks closed.

## Important semantic rules

- `Only A are B` means `All B are A`;
- `A are only B` means `All A are B`;
- `Only a few A are B` means both `Some A are B` and `Some A are not B`;
- `Not all A are B` means `Some A are not B`;
- `No A is B` carries existence for both named categories in the frozen exam profile;
- plain `Few A are B` remains rejected until its source conflict is resolved.

## Release state

Current live chapter authority is `SYL_001_QUESTION_STUDIO_CLOSEOUT_V1`.

- multilingual learner/editorial approval: **approved**;
- human viewport approval: **approved**;
- Question Studio visibility: **enabled**;
- Question Studio candidate generation: **enabled**;
- Question Studio persistence/write: **disabled**;
- Question Bank: **locked**;
- test/mock eligibility: **locked**;
- public/student publication: **locked**.

The unresolved work is not learner-content approval. It is the separate source-profile / mock-archetype freeze: exact historical weighting is still unfrozen, the Banking modal candidate family remains inactive pending its own review/source-profile gate, and difficulty calibration remains non-production until learner evidence exists.


## 2026-10-03 post-closure remediation

- current `reasoning-v1` Question Studio adapter registration added;
- legacy review-registry route retained for compatibility;
- V5 exact Venn renderer now reuses VEN-001 reviewed geometry/label anchors where semantically safe;
- Syllogism-specific witness, possibility, counterexample and either/or proof semantics remain local to SYL-001;
- strict V4/V5 diagram type leaks repaired;
- source weighting, learner-data difficulty calibration and downstream release remain separate gates.

Authority: `SYL-001-POST-CLOSURE-DEEP-AUDIT-20261003.md`.
