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
- permanent seed and resolved source seed;
- source prototype;
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

## Source and internal-mode coverage

All 22 retained discovery source prototypes are reachable through the 11 permanent authorities in both Hindi and Punjabi. This includes conversion, binary/octal/hex grouping, base validity, inverse digit/base problems, addition, subtraction, multiplication, comparison, remainder, terminal digit, leading-zero validity, carry/borrow edges and bounded base-solution topology.

The localization freeze also inherits the permanent source-seed decoupling repair. Prototype identity alone is not treated as sufficient coverage. For each language the parity audit must reach:

- QL237/P011 modes 0, 1, 2, 3: place value, digit count, largest n-digit boundary, smallest n-digit boundary;
- QL238/P009 modes 0, 1, 2, 3: binary→octal, binary→hex, octal→binary, hex→binary grouping;
- QL239/P012 modes 0, 1, 2: zero, one and multiple valid bases in the bounded interval;
- QL241/P021 modes 0, 1, 2: no solution, one solution and multiple solutions;
- QL245/P015 modes 0, 1, 2: all retained cross-base comparison state classes.

This explicitly closes the earlier merged-authority seed-parity trap in QL237/P011 and QL241/P021.

## Parity audit

`localization/runtime-parity.test.ts` targets **1,100 localized packages**:

- 11 authorities × 2 languages × 50 seeds;
- deterministic localized replay;
- exact identity and mathematical-state parity with English;
- exact permanent/source-seed parity with English;
- exact fingerprint and ancestry parity;
- source-prototype reachability;
- prototype-internal mode reachability in each language;
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

The Question Studio projection additionally uses native final-answer labels: `उत्तर:` in Hindi and `ਉੱਤਰ:` in Punjabi rather than leaking English `Answer:`.

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
