# COD-CP-003 Runtime-Proof Implementation Report

Status: English runtime proof complete, exact samples reviewed, and repository CI verified; publication approval remains deferred.

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

## Verified validation

The cumulative `Reasoning COD-001 Runtime` workflow executed CP-001, CP-002 and CP-003 successfully on PR #123. The Render production build also passed. The broad admin workflow remains an inherited base-branch failure already reproduced on unrelated merged reasoning changes.

CP-003 result:

- generated questions: `2,800` (`28 QLs × 100 seeds`);
- answer positions: `668 / 713 / 714 / 705`;
- answer-position max/min ratio: approximately `1.069`;
- wrap-using questions: `1,959`, including all `400` forced-wrap samples from QLs `077`–`080`;
- both canonical rules covered;
- task directions covered: encode, decode, infer-and-encode, choose matching code and recover missing letter;
- answer types covered: letter cluster and single code token;
- renderers covered: inline pair, example-target block and mapping table;
- difficulties covered: Easy, Medium and Hard;
- determinism, option uniqueness, single-answer behavior, independent solver agreement, unique rule inference, direction blocks, curated words, target non-exposure and wrap contracts passed for every sampled instance.

## Exact editorial review

The seed-1 output across all 28 QLs was inspected after CI. The review confirmed:

- natural English source words rather than synthetic clusters;
- correct forward, backward and opposite-letter demonstrations;
- accurate cyclic-wrap explanations;
- decode items that do not expose the target word in evidence;
- missing-letter items that hide the actual wrapped position;
- plausible wrong-direction, off-by-one, opposite-map and position distractors;
- no critical stem or explanation defects requiring a correction commit.

## Deferred work

- Hindi and Punjabi localization;
- Question Studio discovery;
- production publishability;
- chapter-wide freeze.
