# COD-CP-002 Runtime-Proof Implementation Report

Status: English runtime proof complete in source and locally stress-tested; repository CI and final PR review pending.

## Scope

- Exact QL range: `COD-QL-025` through `COD-QL-052`
- Exact QL count: `28`
- Canonical rules: `9`
- Locale: English (`en-IN`)
- Maturity: `RUNTIME_PROOF`
- Publicly publishable: `false`
- Question Studio discovery: deliberately not wired

## Rule coverage

- forward A1Z26 sequence coding;
- reverse Z1A26 sequence coding;
- forward rank plus a fixed constant;
- forward rank minus a fixed constant;
- sum of forward ranks;
- rank sum plus word length;
- rank sum minus word length;
- position-weighted rank sum;
- odd/even-position rank-total difference.

## Correctness architecture

- intended rule and context selected before examples;
- full registered-rule matching over every displayed example;
- equal-or-simpler competing interpretations rejected;
- independent preferred-rule inference from visible evidence;
- independent encoding and inverse sequence decoding;
- bounded deterministic retry;
- competing-rule and arithmetic-error distractors;
- scalar zero-result rejection;
- deterministic difficulty derived from reasoning burden;
- exact review export and 100-seed-per-QL runtime audit.

## Local validation result

- generated questions: `2,800` (`28 QLs × 100 seeds`);
- answer positions: `714 / 720 / 680 / 686`;
- answer-position max/min ratio: approximately `1.059`;
- all nine rules covered;
- task directions covered: encode, decode, infer-and-encode, choose matching code and recover missing value;
- answer types covered: digit sequence, letter cluster and number;
- renderers covered: inline pair, example-target block and mapping table;
- difficulties covered: Easy, Medium and Hard;
- determinism, option uniqueness, single-answer behavior, independent solver agreement, curated-word use, target non-exposure, ambiguity rejection and scalar non-zero contracts passed for every sampled instance.

## Editorial corrections completed before commit

- zero-valued odd/even aggregate instances are rejected;
- rank-plus and rank-minus difficulty now reflects the additional operation;
- advanced weighted/parity aggregates can reach Hard;
- examples for scalar rules use more than one word length to expose length-dependent rules.

## Deferred work

- GitHub Actions execution;
- Hindi and Punjabi localization;
- Question Studio discovery;
- production publishability;
- chapter-wide freeze.
