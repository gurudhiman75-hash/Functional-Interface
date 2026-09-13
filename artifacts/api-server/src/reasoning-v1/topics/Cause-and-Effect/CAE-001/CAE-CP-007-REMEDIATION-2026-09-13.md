# CAE-CP-007 — Correlation / False Causation Remediation — 2026-09-13

## Status

**Implemented for Question Studio review.** The frozen CAE V3 graph architecture is unchanged.

The superseded CP-007 behaviour selected arbitrary disconnected nodes from parallel worlds. That produced editorially trivial pairs such as incidents from unrelated domains and therefore tested obvious independence rather than false causation.

## Reviewed CP-007 model

Question Studio and the ordinary editorial review pack now route `CAE-QL-007` through `reviewed-generator.ts`.

The reviewed CP-007 mix contains two learner operations:

1. **False causation / association only** — same-domain outcomes occur together or in sequence, but the canonical world records separate supported causes. The correct answer is `CORRELATION_ONLY`.
2. **Hidden common factor** — two outcomes look associated and neither causes the other, but the canonical world contains one shared cause. The correct answer is `COMMON_CAUSE`.

This prevents the answer from being mechanically fixed to `correlation only`.

## False-causation scenario depth

`cp007-false-causation.ts` contains eight curated same-domain scenario variants covering:

- retail order volume vs delivery performance;
- rail mobile bookings vs punctuality;
- hospital missed appointments vs registration wait;
- factory downtime vs electricity use;
- college portal use vs library visits;
- telecom data use vs call-drop complaints;
- cinema ticket sales vs snack-counter waiting;
- warehouse parcel volume vs damage reports.

The visible pair is always effect/effect. Each effect has its own hidden graph-supported cause. Several variants deliberately use a post-hoc timing lure so the learner must reject `B happened after A, therefore A caused B` reasoning.

The eight variants support two visible orders, giving up to sixteen false-causation causal states before option presentation variation.

## Common-factor depth

`cp007-common-factor.ts` reuses the existing graph-first `CAE-FAM-SHARED-PRESSURE` worlds rather than duplicating them. Heat, festival and admissions worlds supply common-factor discrimination states in which one hidden cause produces both visible outcomes.

## Difficulty policy

CP-007 reviewed content no longer emits EASY items:

- co-movement items are MEDIUM;
- stronger post-hoc timing traps are HARD;
- common-factor discrimination is MEDIUM.

Difficulty still comes from causal discrimination, not difficult vocabulary.

## Editorial safeguards

The primary false-causation stems deliberately avoid independence giveaways such as:

- `another town`;
- `different public service`;
- explicit `unrelated` / `independent` wording.

Explanations expose the actual hidden causal structure directly and simply rather than analysing every option.

## QA added

`cp007-false-causation.test.ts` covers:

- 240 deterministic false-causation seeds;
- every authored false-causation scenario reached;
- visible nodes are effects and have no causal path to each other;
- each visible effect has its own supported hidden cause;
- no EASY reviewed CP-007 items;
- both MEDIUM co-movement and HARD post-hoc items exist;
- common-factor cases have one cause reaching both visible effects;
- reviewed CP-007 includes both `CORRELATION_ONLY` and `COMMON_CAUSE` answers;
- at least sixteen reviewed semantic states across the 240-seed pass;
- ten distinct CP-007 causal states in the ordinary editorial pack;
- EN/HI/PA causal-state, answer and option-order parity;
- Question Studio remains review-only and non-persistable;
- explicit unsourced CP-007 `FIVE_WAY` requests continue to use frozen V3 rather than pretending source coverage exists.

## Integration boundary

`reviewed-generator.ts` is a facade over frozen V3:

- `CAE-QL-007` default/four-way -> reviewed CP-007 authorities;
- every other QL -> unchanged `generateCaeQuestion()`;
- explicit CP-007 five-way -> unchanged V3 until separately sourced/approved.

This keeps the approved graph engine frozen while allowing editorially stronger checkpoint-specific authorities.

## Remaining release gates

This remediation does **not** promote CAE-001 to production. Before chapter freeze:

- execute the new tests in CI/local repo and record green evidence;
- regenerate the materialized 90-question Markdown from the reviewed generator;
- perform human review of the regenerated CP-007 ten-item sample;
- continue CP-005 HARD distractor calibration and the remaining CP-008/009 depth work.
