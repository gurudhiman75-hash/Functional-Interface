# DIR-001 Final Audit — Wave 07

## Scope

Generated-instance difficulty calibration for `DIR-001`.

This wave follows the chapter-wide stem/distractor audit and asks a separate question:

> Does the displayed Easy / Medium / Hard label reflect the actual reasoning burden of the generated instance?

The audit reviewed the difficulty functions and scenario construction for CP001..CP008.

## Findings

### Already burden-aware enough

The existing logic in CP002, CP003, CP004 and CP006 already uses material generated-state features such as:

- movement-leg count;
- axis versus two-component distance work;
- relation count;
- answer demand;
- coded-relation chain length.

No broad relabeling is justified there.

### CP001 — trivial adjacent turn cancellation

Difficulty already depends on turn count, but the turn generator could create adjacent operations that exactly cancel:

- clockwise X° followed by anticlockwise X°;
- anticlockwise X° followed by clockwise X°;
- two 180° turns.

A nominal 3- or 4-turn question could therefore contain artificial padding that reduces the real burden.

Remediation:

- preserve the 1..4-turn range;
- deterministically reject adjacent cancelling turn pairs;
- retain all angle/sense variety;
- keep difficulty tied to the resulting turn count.

### CP005 — answer-type-only difficulty

The previous CP005 difficulty function ignored the generated paths.

That under-classified some four-mover questions and failed to distinguish:

- same-origin versus offset-origin pair problems;
- shorter versus longer path sets;
- one-axis separation versus Pythagorean separation.

Remediation now uses:

- mover count;
- total generated movement-leg count;
- same-origin versus offset-origin starts;
- whether endpoint separation requires two components / Pythagoras;
- answer demand.

Four-mover tracking is treated as Hard. Pair direction/distance families can resolve to Medium or Hard from their generated burden.

### CP007 — seed/modulo leakage into difficulty

QL030 could become Easy or Medium from `seed % 4` despite having the same direct sun/shadow reasoning structure.

QL035 could similarly jump to Hard based on a complexity modulo rule even though the additional same/opposite-facing relation remains a short two-stage inference.

Remediation:

- QL030 direct sun/shadow direction: Easy;
- QL032 shadow side from known facing: Easy;
- QL031 facing from shadow side: Medium;
- QL033 infer morning/evening: Medium;
- QL035 mutual facing after shadow inference: Medium;
- QL034 shadow inference plus turns: Medium for 1–2 meaningful turns, Hard for 3.

QL034 generation also rejects adjacent inverse/cancelling turn pairs so turn count represents real work.

### CP008 — caselet direction versus distance

QL042 and QL043 deliberately share exactly the same route state.

Previously both were Medium:

- QL042 only classifies the final endpoint direction;
- QL043 must derive endpoint components and calculate an exact shortest distance.

QL043 is now Hard while QL042 remains Medium.

Other CP008 families have essentially fixed structural burden within each QL, so their existing fixed labels are retained rather than creating fake instance variability.

## Regression

New tests require:

- CP001: no adjacent cancelling turn pair; difficulty matches meaningful turn count;
- CP005: four-mover work is Hard and pair-family difficulty follows actual origin/path/component burden;
- CP007: difficulty is deterministic from reasoning structure rather than seed modulo; QL034 has no adjacent cancelling turns;
- CP008: the shared caselet keeps identical state while direction is Medium and exact-distance is Hard.

## Safety boundary

This wave changes generated question instances only where needed to prevent trivial turn cancellation and changes difficulty metadata where the prior label was not cognitively grounded.

It does not change:

- QL IDs or ownership;
- answer demands;
- option contracts;
- independent solver logic;
- correctness criteria;
- localization semantics;
- diagrams;
- downstream Question Bank / mock / public-release state.

## Still open after Wave 07

- diagram placement / scale / readability audit;
- current Question Studio integration;
- explicit multilingual freeze authority;
- final downstream release-boundary proof.
