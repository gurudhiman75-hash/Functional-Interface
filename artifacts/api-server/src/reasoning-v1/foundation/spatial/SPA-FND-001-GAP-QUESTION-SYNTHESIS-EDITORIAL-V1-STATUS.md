# SPA-FND-001 — Gap Question Synthesis and Editorial V1

## Status

`PASS_MACHINE_VALIDATED_LEARNER_SYNTHESIS_HUMAN_EDITORIAL_FREEZE_PENDING`

This checkpoint converts the nineteen source-backed runtime-remediation gaps for `FAN-001`, `FCL-001` and `FSR-001` into controlled learner-question candidates.

Dedicated machine-validation head:

`bf9691d81988f51bbce99a7c4cff757dcd156a72`

Baseline remains Production Scale V2 exact head:

`caff1d753358a0a9b12e8c892c391adbb007eab8`

This phase does **not** allocate permanent QLs, activate Question Studio, authorize Question Bank writes, make mock-test content eligible, or freeze English/editorial presentation.

## Chapter-specific learner contracts

The runtime gap model is shared, but the learner task remains chapter-specific.

### FAN-001 — Figure Analogy

Learner contract:

`A → B :: C → ?`

Stem:

> Select the figure that will replace the question mark so that the second pair follows the same rule as the first pair.

Five source-backed gap families now synthesize four-option analogy questions:

1. independent component rotations/inversions;
2. multi-element cyclic movement/permutation;
3. selected-component enlargement/reduction;
4. inside/outside or hierarchy-level transfer;
5. broader compound multi-operation analogy.

Distractors deliberately model partial-rule, wrong-component, wrong-direction and no-change misconceptions rather than arbitrary visual noise.

### FCL-001 — Figure Classification

Learner contract:

`four options → select the odd figure`

Stem:

> Three of the following figures follow the same relation. Select the figure that does not belong to the group.

All six gap families use an explicit decisive property and exact `3 true / 1 false` property vector after option shuffling:

1. rotational equivalence;
2. general count relation;
3. relative-size relation;
4. relative-position relation;
5. shading amount/location relation;
6. internal mirror/rotation relation between paired subfigures.

The correct option is independently required to be the unique property-breaking option.

### FSR-001 — Figure Series

Learner contract:

`three visible frames → select the next figure`

Eight source-backed gap families now synthesize four-option series questions:

1. reflection/inversion progression;
2. independent component rotations;
3. cyclic/general movement progression;
4. count decrease/removal progression;
5. fill/shading progression;
6. substitution progression;
7. multi-element permutation progression;
8. alternating operation phases.

## Important inferability corrections

The runtime proof demonstrated representational capability, but two raw runtime traces were not strong enough to become learner series without editorial remodeling.

### FSR-GAP-04

Raw runtime demonstration:

`2 → 3 → 4 → 3`

The first three frames alone do not uniquely justify `3` as the next value. The learner series was therefore remodeled to the explicit monotonic contract:

`4 → 3 → 2 → 1`

Rule: remove exactly one dot per step.

### FSR-GAP-06

Raw runtime demonstration:

`square → circle → triangle → circle`

The first three frames do not uniquely establish that the next shape must be a circle. The learner series was therefore remodeled to:

`square → circle → square → circle`

Rule: alternate between two shape classes.

These changes are intentional exam-readiness corrections. Runtime-capability evidence remains unchanged; learner synthesis uses the clearer inference contract.

## Four-option and solver contract

Every synthesized learner question requires:

- exactly four unique visual options;
- one expected correct scene fingerprint;
- independently validated option uniqueness;
- explicit chapter contract evidence;
- explicit runtime-authority evidence;
- a decisive learner-visible rule/property;
- delivered answer-slot verification;
- content fingerprint independent of answer order;
- delivery fingerprint sensitive to option order/seed.

For classification, an additional exact `3-to-1` property-vector requirement is enforced.

## Explanation contract

Each question carries question-specific learner explanation fields:

1. `observation` — what visibly changes or remains common;
2. `rule` — the exact relation/sequence operation;
3. `application` — how that rule is applied to the target/next frame;
4. `check` — identifies the delivered correct option letter and why it alone satisfies the full rule.

The machine gate rejects explanations that are structurally empty or too generic, but this does **not** substitute for human editorial review.

## Learner synthesis proof

Workflow:

`Validate SPA-FND-001 Gap Question Synthesis Editorial V1`

Run:

`31662388004` — PASS

Marker:

`PASS_SPA_FND_001_GAP_QUESTION_SYNTHESIS_EDITORIAL_V1`

Scale used at this checkpoint:

```text
Audited gap families: 19
Requested per gap:     40
Accepted:             760
Attempts:             764
Duplicate rejects:      4

FAN-001: 200
FCL-001: 240
FSR-001: 320

Correct answer slots:
A 190 / B 190 / C 190 / D 190

Each individual gap:
A 10 / B 10 / C 10 / D 10
```

All 760 accepted learner-question content fingerprints and delivery fingerprints are unique.

## Canonical duplicate finding

The first strict synthesis run correctly failed when `FCL-GAP-06` generated a canonical duplicate.

This was **not** remediated by injecting cosmetic noise or weakening the uniqueness gate.

Instead, the batch engine now:

- rejects canonical duplicate content;
- deterministically advances to the next seed;
- balances answer positions by accepted-question index;
- records retry pressure explicitly.

Final retry evidence:

```text
FAN-GAP-01..05: 0 duplicate rejects
FCL-GAP-01..05: 0 duplicate rejects
FCL-GAP-06:     4 duplicate rejects
FSR-GAP-01..08: 0 duplicate rejects
Total:          4
```

This is a useful production-scale warning: internal mirror/rotation relation questions have a smaller true canonical content space after positional normalization and must be capacity-tested separately rather than padded with superficial variation.

## Editorial review artifact

The workflow generates one representative learner question for every gap family, including:

- exam-style stem;
- decisive property/rule;
- stimulus SVGs where applicable;
- four option SVGs;
- misconception label for each option;
- correct answer;
- question-specific explanation;
- responsive mobile CSS.

Artifact:

```text
Name:   spa-gap-question-synthesis-editorial-v1-review
ID:     9166652978
Digest: sha256:238bfefa3ae83f133b94c39e87c3cc30768896414e15b0fab24ed3bf85a1d4b2
Size:   26436 bytes
```

Artifact status remains explicitly:

```text
mobileReviewStatus: REPRESENTATIVE_ARTIFACT_READY_HUMAN_REVIEW_PENDING
englishFreezeStatus: HUMAN_REVIEW_PENDING
```

A responsive artifact existing is not treated as proof that a human has reviewed every figure at learner/mobile size.

## Machine gates passed

- exact 19-gap learner coverage;
- four options on every question;
- independent option uniqueness;
- chapter-specific FAN/FCL/FSR task contracts;
- exact FCL three-to-one property vectors;
- question-specific explanation structure;
- deterministic replay;
- deterministic duplicate-retry pressure;
- alternate-seed divergence;
- unique learner-question content;
- balanced answer positions globally and per gap;
- representative 19-family responsive review artifact;
- strict API build;
- Production Authority V1 revalidation;
- Source Saturation Audit V1 revalidation;
- Gap Runtime Remediation V1 revalidation.

## What remains unproven

This checkpoint does **not** yet prove:

- high-volume learner-question capacity for all nineteen families;
- acceptable duplicate/retry pressure at production scale, particularly `FCL-GAP-06`;
- human approval of the 19-family visual/mobile review;
- human English stem/explanation freeze;
- permanent QL allocation;
- Banking exam saturation;
- Punjab-state exam saturation;
- Hindi or Punjabi realization;
- Question Studio or Question Bank activation.

## Lifecycle lock

```text
Permanent QLs:                0
Discovery frozen:             false
English human freeze:         false
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
Hindi/Punjabi generation:     false
API/database schema changes:  none
```

## Next gate

`SPATIAL_GAP_QUESTION_PRODUCTION_SCALE_V1`

The next phase should stress the learner-question generators themselves at high volume, measure per-family canonical capacity and retry pressure, preserve answer-slot balance, and produce a larger audit sample. Human editorial/mobile approval should remain a separate explicit gate rather than being inferred from machine CI.
