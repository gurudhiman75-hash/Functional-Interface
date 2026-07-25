# COD-CP-003 Runtime-Proof Implementation Report

Status: English runtime proof complete in source; repository CI and exact editorial review pending.

## Scope

- Exact QL range: `COD-QL-053` through `COD-QL-080`
- Exact QL count: `28`
- Canonical rules: `2`
- Locale: English (`en-IN`)
- Maturity: `RUNTIME_PROOF`
- Publicly publishable: `false`
- Question Studio discovery: deliberately not wired

## Canonical rule coverage

- `UNIFORM_CYCLIC_SHIFT` with one signed parameter across forward and backward variants;
- `OPPOSITE_ALPHABET_MAP`.

Fixed special cases such as ROT13 are intentionally not registered because they collide with the general signed-shift rule.

## Presentation coverage

- forward encode variants: `COD-QL-053`–`058`;
- backward encode variants: `COD-QL-059`–`064`;
- opposite-alphabet variants: `COD-QL-065`–`068`;
- inverse/decode variants: `COD-QL-069`–`072`;
- multi-example shift inference: `COD-QL-073`–`076`;
- forced wrap-boundary and missing-letter tasks: `COD-QL-077`–`080`.

## Correctness architecture

- signed shift selected before evidence;
- shift domain restricted to ±1 through ±8;
- every evidence set contains at least two distinct character correspondences;
- full matching against every eligible signed shift and opposite mapping;
- equal-priority competing interpretations rejected;
- independent preferred-rule inference;
- independent inverse decoding;
- deterministic bounded retry;
- wrong-direction, off-by-one, opposite-map and wrong-position distractors;
- forced wrap-around coverage for the final four QLs;
- difficulty derived from operation, direction, magnitude, inference, word length and wrap burden;
- exact review export and 100-seed-per-QL audit.

## Planned validation

The committed test generates `2,800` questions (`28 QLs × 100 seeds`) and verifies:

- exact QL continuity and two-rule registry;
- determinism;
- four unique options and one correct answer;
- independent solver agreement;
- unique minimum-priority rule inference;
- curated English evidence words;
- target non-exposure;
- forward/backward/opposite block contracts;
- forced wrap coverage;
- renderer, task, answer-type and difficulty coverage;
- answer-position balance below `1.20` max/min ratio.

## Deferred work

- GitHub Actions execution;
- exact review-export inspection and editorial correction;
- Hindi and Punjabi localization;
- Question Studio discovery;
- production publishability;
- chapter-wide freeze.
