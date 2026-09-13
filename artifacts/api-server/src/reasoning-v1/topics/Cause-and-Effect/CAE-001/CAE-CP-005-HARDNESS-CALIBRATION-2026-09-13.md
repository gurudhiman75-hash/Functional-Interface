# CAE-CP-005 — Competing-Explanation Hardness Calibration — 2026-09-13

## Status

**Implemented for reviewed Question Studio generation.** The frozen V3 causal-world architecture remains unchanged.

## Defect being corrected

The earlier CP-005 generator satisfied structural credibility gates but often labelled an item HARD when the human choice was easy. Typical distractors were visibly too small or in the wrong place, such as:

- a single junction versus a corridor-wide commuter shift;
- a single form versus a portal-wide slowdown;
- an event in another district/station versus the affected location;
- one small delivery versus a town-wide supply shock.

Those options are technically plausible events but do not create genuine competing explanations.

## Reviewed CP-005 model

`cp005-competing-explanations.ts` supplies ten complete, human-authored competing-explanation cases for review:

1. metro corridor shift;
2. vegetable supply shock;
3. public-service server slowdown;
4. certificate printing delay;
5. cold-storage dispatch delay;
6. ferry/market delay;
7. rail-section delay;
8. examination-centre late arrivals;
9. water-pressure zone failure;
10. warehouse dispatch delay;
11. neighbourhood flooding.

Note: the implementation currently contains ten selected review scenarios; this list is descriptive of the authored scenario themes and should be kept in sync if scenarios are added or retired.

## Difficulty rule

The reviewed generator no longer derives HARD from a high arithmetic score alone.

For every reviewed CP-005 item:

- at least **two** wrong options must survive a first-pass plausibility check;
- a HARD item must retain at least **three** close alternatives;
- the deciding evidence must come from timing, affected scope, mechanism, or another causal-fit clue;
- difficult vocabulary, obscure facts and obvious geographic mismatch are not permitted difficulty sources.

Current reviewed distribution intentionally includes MEDIUM and HARD only.

## Stem structure

Each item exposes:

- an `Observation`;
- concise `Additional information` that discriminates among otherwise plausible explanations;
- four complete proposed causes.

The evidence does not reveal the answer by grammar or wording. It narrows the causal fit.

## Explanations

Explanations are short and beginner-readable. They state why the selected cause fits the supplied evidence. They do not perform unnecessary option-by-option analysis.

## QA

`cp005-competing-explanations.test.ts` verifies:

- ten independently authored reviewed scenarios;
- one unique best answer per scenario;
- at least two close alternatives in every item;
- at least three close alternatives in every HARD item;
- old giveaway patterns such as `different district`, `different metro station`, `one junction`, `one form`, `small load`, and `one vegetable stall` are absent from HARD candidate sets;
- 240-seed coverage reaches every calibrated scenario;
- every scenario owns a distinct reviewed causal state;
- both MEDIUM and HARD bands are produced;
- HARD evidence records at least three plausible distractors and higher inference burden;
- EN/HI/PA preserve causal state, answer, option order and difficulty;
- the reviewed 10-question CP-005 pack contains ten distinct states and both difficulty bands;
- Question Studio uses the reviewed CP-005 authority by default;
- explicit unsourced five-way requests remain on frozen V3.

## Integration boundary

`reviewed-generator.ts` routes default/four-way `CAE-QL-005` generation through the calibrated corpus. The frozen `generateCaeQuestion()` implementation remains the architecture regression and is not rewritten.

`reviewed-editorial-review-pack.ts` is the current human-review pack. `editorial-review-pack.ts` remains the frozen-V3 regression pack.

## Remaining release gates

This calibration is review-only. Production promotion still requires:

- executing the reviewed QA entrypoint and recording green evidence;
- materializing and human-reviewing the reviewed editorial pack;
- completing remaining CP-008/009 depth work and CP-010 saturation/source gates.
