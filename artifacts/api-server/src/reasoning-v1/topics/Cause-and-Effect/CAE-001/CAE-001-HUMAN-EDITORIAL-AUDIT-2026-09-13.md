# CAE-001 — Human Editorial Audit — 2026-09-13

## Decision

The graph-first CAE V3 architecture is **approved and frozen**. The target/reference-specific candidate work and CP-009 visible-endpoint exclusion are accepted. Do not redesign the canonical causal-world model, causal-state identity, target-specific applicability model, locale parity model, or Question Studio review-only boundary unless later source evidence demonstrates an unavoidable structural gap.

The chapter itself is **not content-frozen**. QL allocation remains provisional pending source-pattern saturation and editorial approval.

## Audit basis

This audit used:

- the materialized 90-question `CAE-001-V3-EDITORIAL-REALNESS-REVIEW.md`;
- the 240-seed saturation evidence;
- the current scenario/candidate authorities and generator/validator logic;
- the project-library reference `Reasoning for Competitions`, chapter 22, Cause and Effect;
- current public competitive-exam references recorded in `CAE-001-SOURCE-PATTERN-CENSUS-2026-09-13.md`.

## What is approved

1. **Graph first.** Questions originate from a canonical causal world rather than assigning causality after rendering.
2. **Semantic identity.** `causalStateId` is separate from item/presentation identity.
3. **Target-specific candidates.** Authored candidates are authorised by projection, target slot, reference slot and relation before metadata scoring.
4. **CP-005 safety gate.** Competing-explanation items require at least two initially credible alternatives.
5. **CP-009 endpoint safety.** Learner-visible endpoints cannot re-enter the option pool; the unique bridge is checked in EN/HI/PA.
6. **Locale parity.** EN/HI/PA share the same semantic state and answer/presentation identity.
7. **Review-only integration.** The package is still prevented from entering public/test/mock persistence before content freeze.

## Human editorial findings

### A. Review-pack selection is semantically wasteful — FIX NOW

`editorial-review-pack.ts` says it samples graph states before item presentations, but the actual de-duplication key is `itemVariantId`. Therefore the 10-item CP sample can contain the same `causalStateId` multiple times with only option order changed.

Observed examples include:

- CP-002: the same admissions common-cause state repeats; warehouse/library and books/buses states also repeat.
- CP-005: the same metro, server and other semantic states recur with shuffled presentation.
- CP-006/007 and later checkpoints show the same pattern.

Required correction:

- build the candidate review pool around **distinct `causalStateId` first**;
- only use presentation variation after semantic-state coverage is exhausted or when a rendering-profile comparison is deliberately requested;
- the ordinary 10-per-CP editorial pack must contain 10 distinct causal states wherever saturation proves at least 10 exist;
- add a QA assertion for distinct causal states in every 10-item CP sample.

This is a review-sampling defect, not a generator-architecture defect.

### B. Exam-profile fidelity is under-reviewed — FIX NOW

The engine supports `FOUR_WAY` and `FIVE_WAY` for relevant paired-statement projections, but the materialized editorial pack uses the default first profile and therefore largely shows only the four-way rendering.

Source evidence shows that option schemas themselves vary across exams/material. The classic five-way banking form distinguishes:

- I causes II;
- II causes I;
- both are independent causes;
- both are effects of independent causes;
- both are effects of a common cause.

Other four-/five-option sources use different collapses or a `None of these` outcome. Therefore `FOUR_WAY` and `FIVE_WAY` should be treated as broad internal capabilities, not proof that every observed exam schema has been reproduced.

Required correction:

- materialize explicit profile-review samples for every supported paired-statement profile;
- record which real source schema each renderer is intended to match;
- do not claim exam-profile saturation until the source ledger maps observed schemas to renderers.

### C. CP-001 — DIRECT RELATIONSHIP: PASS WITH SOURCE-PROFILE WORK

The generated direct-cause pairs are concise, readable and generally exam-like. Statement order varies independently of causal order and explanations are appropriately short.

Remaining work is mainly profile fidelity and scenario breadth. The current 90-pack should expose both supported paired-statement renderings rather than only one.

### D. CP-002 — COMMON / INDEPENDENT: PARTIAL PASS

The core causal states are valid, but the current review presentation is too easy and under-demonstrates the classic distinction between:

- independent causes;
- effects of independent causes;
- effects of a common cause.

The four-way collapsed `independent` answer hides an important classic banking distinction. In addition, duplicate semantic states in the 10-question pack make coverage look narrower than the saturation data indicates.

Required work:

- include the classic five-way profile in editorial review;
- deliberately sample independent-cause, independent-effect and common-cause states;
- create medium-level states where the relationship is not obvious from unrelated domains alone, while preserving one defensible answer.

### E. CP-003 / CP-004 — PROBABLE CAUSE / EFFECT: GOOD FOUNDATION, NEED MORE HUMAN DIFFICULTY CALIBRATION

Target-specific distractor applicability fixed the earlier machine-generated/irrelevant-option problem. The better items now contain natural alternatives from the same situation.

However, difficulty should be calibrated by **learner confusability**, not only graph/topology/candidate metadata. An item should not become HARD merely because the hidden graph has several links if the alternatives are obviously too small, too late or from another locality.

Required work:

- human-rate a representative sample for actual learner difficulty;
- use those labels to tune thresholds or candidate-set requirements;
- retain simple wording; difficulty must come from causal discrimination, not vocabulary.

### F. CP-005 — COMPETING EXPLANATIONS: STRUCTURALLY SOUND, EDITORIALLY TOO EASY IN PLACES

CP-005 now satisfies the structural two-credible-alternative gate, but several items labelled HARD still expose the answer quickly because distractors advertise their weakness: one junction, one form, another district, one stall, a later corrective response, etc.

Required work:

- at least two alternatives in HARD items should remain credible after a first read;
- the winning option should emerge from a subtler mismatch in timing, coverage, magnitude or mechanism;
- avoid making every hard item `large root cause` versus `tiny local distractors`;
- add a human editorial gate: HARD CP-005 must not be solvable merely by spotting words such as `one`, `briefly`, `different district`, `another locality`, or an explicit `after` response.

Do not remove the current CP-005 architecture; improve the authored competitor library.

### G. CP-006 — INDIRECT CAUSATION: PASS AS ONE FAMILY, NOT YET DEPTH-SATURATED

The current root-to-terminal indirect relationship is coherent and explanations show the hidden chain clearly.

But the checkpoint is effectively one repeated learner task. The approved design also intended indirect-cause depth around immediate versus remote causes/effects, connector events and different causal distances.

Required work:

- add controlled projections/renderings for immediate vs remote cause/effect discrimination;
- vary causal distance and visible endpoints;
- do not count option-order permutations as depth.

### H. CP-007 — CORRELATION / FALSE CAUSATION: FAIL CONTENT DEPTH

This is the clearest content weakness in the current pack.

Most examples are simply unrelated events placed together, e.g. a warehouse scanner and a library stock check, a pipe burst and clinic software, or factory trouble and rain near a school in another town. Those test `unrelated events`, not a tempting correlation-versus-causation error.

The intended skill is to reject causal claims when events co-vary, occur together, share a context, or have plausible reverse/common-cause explanations without sufficient causal evidence.

Required work:

- create a dedicated set of **superficially associated but non-causal** scenarios;
- include temporal co-movement, shared trend, selection/common-factor, and reverse-causation traps;
- keep the causal graph free of a direct link, but make the learner-visible context genuinely tempting;
- include some cases where a common cause is the correct answer and some where only association is established;
- remove obviously cross-domain unrelated pairs from the primary CP-007 review set.

This can be done with new scenario/rendering authorities; it does not require abandoning the graph-first architecture.

### I. CP-008 — MULTI-EVENT CAUSAL REASONING: PARTIAL / UNDER-DEPTH

The current implementation is essentially one question form: order four known events into the valid chain. That is a useful family, but it does not exhaust the checkpoint promised by the design.

Required additional families:

- identify immediate versus remote cause among 3–5 events;
- identify immediate versus remote effect;
- choose the connector event;
- locate the incorrect/broken causal link;
- choose which event must precede/follow another;
- vary 3-, 4- and 5-event chains where editorially safe.

The current sequence family should remain, but CP-008 should not be frozen with sequence ordering alone.

### J. CP-009 — NOVEL / INTEGRATED: MISSING-LINK FAMILY PASSES; CHECKPOINT DOES NOT YET MATCH ITS INTENDED BREADTH

The visible-endpoint defect is fixed and the missing-link questions are now structurally clean.

However, CP-009 currently represents almost entirely one integrated form: missing causal link. The approved design intended a broader edge layer including graph completion, alternative-cause discrimination, common-cause reconstruction, broken chains, strongest relation and mini-case inference.

Required work:

- keep current missing-link generation as one CP-009 family;
- add additional integrated renderings only after source/novelty review;
- require each new family to add a genuinely new learner operation, not merely a paraphrased stem.

### K. Explanation quality: PASS WITH MINOR EDITORIAL VARIATION

Explanations are now simple and coherent. They show the causal chain directly and avoid unnecessary option-by-option analysis.

Minor issue: repeated stock endings such as `This immediate link fits the observation's timing, scope, and magnitude` and `This chain matches...` make the content feel generated. This is not a correctness blocker, but explanation renderers should support a small number of natural concise closings or omit the closing when the chain itself is sufficient.

## Priority implementation order

1. Fix review-pack sampling to use distinct `causalStateId` values.
2. Add explicit source/profile review coverage for paired-statement schemas.
3. Rebuild CP-007 with genuine correlation/false-causation situations.
4. Strengthen CP-005 hard distractors and recalibrate human difficulty.
5. Expand CP-008 beyond four-event sequence ordering.
6. Expand CP-009 beyond missing-link while retaining the now-correct missing-link family.
7. Expand scenario/domain library after the source-pattern census identifies which real exam situations are still missing.
8. Re-run 240-seed QA + regenerate the editorial pack + perform another human review.

## Freeze policy

Do **not** reopen the approved causal-world architecture for the issues above. These are renderer/profile/scenario/editorial-depth problems. Only reopen core architecture if a sourced exam pattern cannot be represented without changing the canonical causal-state model.
