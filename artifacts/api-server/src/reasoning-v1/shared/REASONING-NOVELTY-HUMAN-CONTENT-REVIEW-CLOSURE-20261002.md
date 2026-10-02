# Reasoning V1 — Controlled Novelty Human Content Review Closure

Date: 2026-10-02

Status: `8_PROVIDER_CONTENT_REVIEW_PASS__ACTIVATION_NOT_AUTHORIZED`

## Scope

A real learner-facing review pack was generated from the current generators:

- 8 review-only controlled-novel providers
- 4 live samples per provider
- 32 total questions
- stems, options, answers and explanations reviewed
- production novelty mixing remained disabled throughout

## First-pass findings and remediation

Five providers needed editorial remediation before sign-off:

- **OPS-001-INFER-THEN-FILL** — contiguous seeds over-repeated the same target answer. Target semantics were diversified so adjacent samples rotate across M/N/P/Q while preserving unique operation inference.
- **RNK-001-CROSS-FAMILY-CASELET** — the original caselet repeated one clue structure and one rank query. Four distinct constraint structures and varied target ranks were added.
- **CLK-001-FAULTY-TIME-ANGLE** — learner wording exposed machine-like “actual time/rate” phrasing and an engineering-style explanation. The stem is now exam-natural and the explanation derives displayed time and hand angles directly.
- **CAE-001-EDGE-FAMILIES** — one simple-event distractor was too close to the intended downstream effect. Near-duplicate simple-event distractor sets are now rejected and deterministically resampled.
- **DIR-001-GRAPH-RELATIVE-PATH** — adjacent samples were mostly cosmetic scaling and explanations skipped the calculation. Orientation now rotates across quadrants and explanations show component movement plus Pythagorean distance.

ALP, CAL and BLR passed the first learner-facing review without further content remediation.

## Final provider verdicts

All 8 providers now pass the sampled human-content review:

1. `ALP-001-TRANSFORMED-GAP`
2. `OPS-001-INFER-THEN-FILL`
3. `RNK-001-CROSS-FAMILY-CASELET`
4. `CLK-001-FAULTY-TIME-ANGLE`
5. `CAE-001-EDGE-FAMILIES`
6. `DIR-001-GRAPH-RELATIVE-PATH`
7. `CAL-001-IMPLICIT-RANGE-FREQUENCY`
8. `BLR-001-CODED-FILTERED-COUNT`

Each is recorded as:

`CONTENT_REVIEW_PASS_AWAITING_ACTIVATION`

## Activation boundary

This closure does **not** activate any provider.

For all 8 providers:

- registry status remains `DISCOVERY_REVIEW_ONLY`
- `questionStudioNoveltyMixActivated=false`
- `humanReviewRequired=true`
- `countsTowardAssemblyNoveltyNow=false`
- no permanent QL is allocated by this review
- no production assembly quota changes
- no public/test/mock publication changes

Activation requires a separate explicit checkpoint.

## Review result

`REASONING_CONTROLLED_NOVELTY_CONTENT_REVIEW_20261002__8_OF_8_PASS__0_ACTIVATED`
