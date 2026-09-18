# ENG-003-CP006 — Grammar Fillers: Adjectives, Adverbs and Comparison — Source Audit V1

Status: `IMPLEMENTED_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`

## Boundary

ENG-003 CP006 implements **Adjectives, Adverbs and Comparison Grammar Fillers** by reusing the closed ENG-001 CP006 / approved ENG-002 CP006 comparison layer.

Reused rule IDs:

- `GR-CMP-001` adjective vs adverb after action verbs
- `GR-CMP-002` adjective after linking verbs
- `GR-CMP-003` positive degree in `as ... as`
- `GR-CMP-004` comparative degree with `than`
- `GR-CMP-005` definite article with ordinary superlatives
- `GR-CMP-006` plural noun after `one of the + superlative`
- `GR-CMP-007` double comparative
- `GR-CMP-008` double superlative
- `GR-CMP-009` comparative intensifiers
- `GR-CMP-010` irregular comparison forms

No comparison rule is re-authored in ENG-003.

## Filler transformation

ENG-002 CP006 already focuses each donor sentence on the smallest meaningful contrast. ENG-003 preserves that focused boundary and replaces only the tested target with one `_____` blank.

To avoid inventing weak distractors, ENG-003 asks the same approved ENG-002 donor twice:

1. correction-required mode supplies the verified correct target;
2. no-improvement mode exposes the approved three wrong-form alternatives.

ENG-003 then places those four choices deterministically across A/B/C/D.

Examples of the intended surface include:

- `checked each entry _____` → carefully / careful / ...
- `as _____ as`
- `_____ than`
- `one of the oldest _____`
- `_____ faster than`
- irregular forms such as better / worse / best / worst.

`No improvement` never appears in ENG-003.

## Quality guards

The checkpoint rejects:

- duplicate choices;
- malformed/fabricated forms already banned by the approved CP006 layer;
- more than one visible blank;
- answer reconstruction drift;
- Error Spotting slash segmentation;
- explanation loss.

## Difficulty and coverage

The donor catalog contains **20 curated scenes at each difficulty**.

The 6,000-question soak must exercise every eligible:

- rule family;
- semantic domain;
- donor scene;

and must also pass deterministic replay, corrected-sentence reconstruction and balanced answer-position gates.

## Explanation policy

Every explanation begins with the exact filler, then gives the approved simple concept, sentence-specific application and completed correct sentence.

No option-by-option analysis and no generic closing clutter.

## Review batch

The review exporter produces **30 deterministic questions**:

- 10 Easy
- 10 Medium
- 10 Hard

It prioritizes rule-family breadth before adding further unique donor scenes.

## Lifecycle

CP006 remains review-only until explicit human editorial approval. It is not registered in Question Studio yet and has no authority for Question Bank writes, tests, mocks, learner/public publication, automatic student delivery or production release.
