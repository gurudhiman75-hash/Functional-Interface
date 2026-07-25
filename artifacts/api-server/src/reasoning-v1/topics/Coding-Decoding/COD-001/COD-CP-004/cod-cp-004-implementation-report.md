# COD-CP-004 Runtime-Proof Implementation Report

Status: English runtime proof complete in source; repository CI and exact editorial review pending.

## Scope

- Exact QL range: `COD-QL-081` through `COD-QL-112`
- Exact QL count: `32`
- Canonical rules: `6`
- Locale: English (`en-IN`)
- Maturity: `RUNTIME_PROOF`
- Publicly publishable: `false`
- Question Studio discovery: deliberately not wired

## Rule coverage

- incremental forward shifts;
- incremental backward shifts;
- alternating signed shifts;
- odd/even-position shifts;
- vowel/consonant class shifts;
- endpoint/interior shifts.

## Correctness architecture

- every source and target word activates every branch of its rule;
- position/class context selected before evidence;
- full ambiguity pool includes all CP-003 uniform/opposite rules and every CP-004 rule context;
- simpler CP-003 matches take priority and cause rejection;
- registry-level collision audit runs across the complete CP-003/CP-004 context inventory;
- independent preferred-rule inference;
- independent inverse decoding by per-position source-letter search;
- non-injective class decodes are rejected;
- deterministic bounded retry with a maximum of 300 attempts;
- diagnosed distractors for start-index, phase, branch-swap, direction, uniform-shift and skipped-position errors;
- selected QLs force cyclic wrap coverage;
- difficulty derives from rule class, inference, decoding, word length, context magnitude and wrap burden;
- exact review export and 100-seed-per-QL runtime audit.

## Planned validation

The committed test generates `3,200` questions (`32 QLs × 100 seeds`) and verifies:

- exact QL continuity and six-rule registry;
- no complete CP-003/CP-004 registry collisions over the probe corpus;
- determinism;
- four unique options and one correct answer;
- independent solver agreement;
- unique minimum-priority rule inference;
- branch activation in every source and target;
- curated English evidence words;
- target non-exposure;
- context-domain contracts;
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
