# SEA-001 — Deep Audit Wave 05

Date: 2026-09-29

Status: `ENGLISH_REVIEW_AUTHORITY_READY__STRUCTURAL_DIFFICULTY_AUDITED__DIAGRAM_EXPLANATION_ONLY__FREEZE_APPROVAL_PENDING`

## Structural difficulty remediation

SEA-001 previously exposed no generated difficulty authority. The internal Question Studio projection marked every child as `UNASSESSED`.

Wave 05 adds `SEA_001_STRUCTURAL_DIFFICULTY_V1`.

Difficulty now derives from learner-visible reasoning burden:

- topology complexity;
- facing-state burden;
- query burden;
- inferred/conditional orientation;
- circular symmetry / directional-arc reasoning;
- bounded clue interaction;
- explicit transformed-state counterfactual burden.

It does **not** use:

- seed;
- answer magnitude;
- seat count as a primary driver;
- arbitrary QL ordering.

Seat count alone is regression-proved not to change the difficulty score for an otherwise identical solve structure.

The authority is structural/audit difficulty only. Production calibration still requires learner accuracy and solve-time evidence.

## Diagram policy remediation

The CP003 internal Studio projection previously exposed the solved `diagramScene` on the parent review object.

That creates a risk that a solved arrangement could appear with the question.

Wave 05 changes the contract to:

- `diagramPolicy: EXPLANATION_ONLY`;
- solved scene stored only as `explanationDiagramScene`;
- no `diagramScene` question field;
- no child-question diagram field.

The learner sees the seating diagram only as part of the explanation/review solution, consistent with Examtree chapter policy.

## English editorial / distractor gate

A chapter-wide audit now sweeps CP001–CP005 and requires:

- no internal solver/oracle/backtracking/canonicalisation terminology in learner stems or child explanations;
- four unique options;
- exact keyed answer position;
- every wrong option carries an explicit misconception ID;
- at most one generic verified fallback wrong option where concrete misconception outputs collide;
- concise exam-style stems;
- compact answer-specific explanations;
- explanation-only diagram policy;
- structural difficulty assessment on every reviewed runtime child.

## Extension explanation cleanup

The source-gap review extensions now use answer-specific explanations for:

- extreme-end pair;
- relative-position description;
- definitely-true relation statement;
- facing-direction count;
- end-person plus facing.

Generic “read the verified arrangement” explanation prose is no longer used.

## Unified English review pack

`SEA_001_ENGLISH_REVIEW_PACK_V1` is the single current manual-review authority.

It contains:

- 324 deterministic English review items;
- all 20 blueprint authorities;
- all five SEA-001 checkpoints;
- all nine permanent QLs;
- runtime children plus review-only source-gap extensions;
- Easy / Medium / Hard structural examples;
- explanation-only diagram policy;
- deterministic replay.

Review state:

- `MANUAL_REVIEW_REQUIRED`;
- English freeze not yet permitted;
- Question Studio not registered;
- Question Bank/test/mock/public delivery locked.

## Governance state

Package lifecycle now reports:

- solve inventory: `FROZEN`;
- query mix: `FROZEN`;
- permanent QLs: 9;
- English freeze: `IN_REVIEW`;
- Hindi/Punjabi freeze: not started;
- Question Studio: not registered;
- downstream delivery: locked.

## Next checkpoint

After explicit approval of the exact English review pack:

1. record immutable English freeze authority;
2. build Hindi and Punjabi from the frozen semantic state;
3. prove cross-language answer/state parity;
4. run human localization review;
5. register a review-only Question Studio package only after multilingual authority is complete.

Do not silently skip English approval.

## Novelty

Novel seating capability remains deferred to the later cross-chapter novelty pass.

## Result

`SEA_001_WAVE05_TECHNICALLY_READY_FOR_ENGLISH_FREEZE_APPROVAL`
