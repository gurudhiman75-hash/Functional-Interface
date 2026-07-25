# COD-CP-004 Runtime-Proof Implementation Report

Status: English runtime proof complete, exact samples reviewed, editorially corrected, and repository CI verified; publication approval remains deferred.

## Scope

- Exact QL range: `COD-QL-081` through `COD-QL-112`
- Exact QL count: `32`
- Canonical rules: `6`
- Locale: English (`en-IN`)
- Difficulty: Medium and Hard only
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

## Verified validation

The cumulative `Reasoning COD-001 Runtime` workflow executed CP-001 through CP-004 successfully on PR #125. The initial CP-004 run passed before the editorial difficulty correction; the final run verifies the revised Medium/Hard contract.

CP-004 result:

- registered CP-003 + CP-004 rule contexts checked for collisions: `97`;
- generated questions: `3,200` (`32 QLs × 100 seeds`);
- answer positions: `814 / 803 / 767 / 816`;
- answer-position max/min ratio: approximately `1.064`;
- wrap-using questions: `2,495`, including every forced-wrap sample;
- all six CP-004 rules covered;
- tasks covered: encode, decode, infer-and-encode, choose matching code and recover missing letter;
- answer types covered: letter cluster and single code token;
- renderers covered: inline pair, example-target block and mapping table;
- difficulties covered: Medium and Hard;
- determinism, option uniqueness, single-answer behavior, independent solver agreement, full-pool ambiguity rejection, branch activation, curated words, target non-exposure, context-domain and wrap contracts passed for every sampled instance.

## Exact editorial review

The seed-1 output across all 32 QLs was inspected. The review confirmed correct position/class working, cyclic wrapping, inverse decoding, hidden missing positions and diagnosed distractors. One defect was corrected:

- branch-dependent questions could previously receive an Easy label; CP-004 is now explicitly restricted to Medium and Hard.

No other critical stem, explanation, option or rule-domain defect was found.

## Deferred work

- Hindi and Punjabi localization;
- Question Studio discovery;
- production publishability;
- chapter-wide freeze.
