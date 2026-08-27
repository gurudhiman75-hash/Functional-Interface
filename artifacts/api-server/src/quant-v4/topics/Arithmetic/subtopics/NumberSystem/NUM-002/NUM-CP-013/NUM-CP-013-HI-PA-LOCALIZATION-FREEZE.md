# NUM-CP-013 Hindi / Punjabi Localization Freeze

## Scope

Checkpoint: `NUM-CP-013 — Positional Bases and Numeral Conversion`

Permanent authorities: `NUM-QL-237..NUM-QL-247`

Languages:

- Hindi: `hi-IN`
- Punjabi: `pa-IN`

## Localization architecture

Localization is generated from the permanent package's hidden mathematical state and task semantics. It is not a blind translation of the English stem or explanation.

The localized package preserves exactly:

- permanent QL and authority identity;
- source prototype and seed;
- difficulty and task kind;
- authority/source answer semantics;
- representation;
- hidden mathematical state;
- mathematical fingerprint;
- source/prototype ancestry;
- option order and correct index;
- misconception identity;
- lifecycle gates.

Numerical answers and base numerals remain mathematically identical. Categorical answers are localized consistently for cross-base comparison and zero/one/multiple-solution classifications.

## Source coverage

All 22 retained discovery source prototypes are reachable through the 11 permanent authorities in both Hindi and Punjabi. This includes conversion, binary/octal/hex grouping, base validity, inverse digit/base problems, addition, subtraction, multiplication, comparison, remainder, terminal digit, leading-zero validity, carry/borrow edges and bounded base-solution topology.

## Parity audit

`localization/runtime-parity.test.ts` targets **1,100 localized packages**:

- 11 authorities × 2 languages × 50 seeds;
- deterministic localized replay;
- exact identity and mathematical-state parity with English;
- exact fingerprint and ancestry parity;
- source-prototype reachability;
- option-count and misconception parity;
- exact correct-index parity;
- localized canonical/verifier agreement;
- locked downstream lifecycle gates.

## Human-quality audit

`localization/runtime-human-quality.test.ts` targets **770 localized packages**:

- 11 authorities × 2 languages × 35 seeds;
- native-script density;
- concise learner text;
- two or three clear explanation steps;
- non-trivial concept and strategy text;
- no generator/prototype/Question Studio implementation vocabulary;
- Hindi rejects Gurmukhi leakage;
- Punjabi rejects Devanagari letters/marks;
- U+0964/U+0965 Indic danda punctuation remains allowed in Punjabi;
- exact localized answer binding.

## Lifecycle

This implementation is a multilingual-freeze candidate until its dedicated executable CI completes successfully.

No downstream publication gate is opened by localization:

- Question Studio discoverable: OFF
- Question Bank writable/stored: OFF
- test eligible: OFF
- mock-test eligible: OFF
- public publication: OFF
- automatic student publication: OFF

Question Studio integration is a separate controlled stage.
