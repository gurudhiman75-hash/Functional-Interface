# V1 Production Multilingual Stable Freeze

Snapshot: `v1-production-multilingual-stable`

## 1. Engine Architecture Summary

The production baseline contains the quant-v2 percentage reasoning platform:

- canonical percentage problem generation
- topology-driven structural generation
- reasoning graph construction
- semantic-safe editorial realization
- multilingual intent realization for English, Hindi, and Punjabi
- pedagogical-flow balancing
- SVG pedagogical visualization
- calibrated quality metrics

Generation remains deterministic. Rendering layers consume semantic structures, not raw translated prose.

## 2. Stable Semantic Contracts

Stable semantic value contracts:

- `PercentageValue`
- `AbsoluteValue`
- `CountValue`
- `CurrencyValue`
- `RatioValue`

Guarantees:

- absolute values never render `%`
- negative semantics use directional meaning such as `loss`, `decrease`, or `reduction`
- answers render with semantic consistency
- equations remain language-neutral
- signatures avoid raw negative leakage

## 3. Stable Multilingual Contracts

Localization consumes semantic intents, not English strings.

Stable localization contract version: `semantic-intents.v1`

Supported languages:

- English: `en`
- Hindi: `hi`
- Punjabi: `pa`

Only labels, transitions, endings, shortcut wording, and coaching narration localize. Equations and arithmetic remain universal.

## 4. SVG Rendering Guarantees

SVG contract version: `svg-pedagogy.v1`

SVG rendering consumes:

`CanonicalPercentageProblem -> ReasoningGraph -> SvgPedagogyGraph -> Layout -> SVG`

Guarantees:

- deterministic layout
- no animation dependency
- clean educational themes
- multilingual-safe text labels
- equation-preserving visual nodes
- printable SVG output

## 5. Validator Guarantees

Production validation covers:

- canonical validity
- reasoning graph validity
- topology validity
- semantic stability
- localization stability
- SVG rendering stability
- metric calibration
- pedagogical flow
- equation preservation
- regression golden comparison

## 6. Metric Calibration Baselines

Stable metric calibration version: `metric-calibration.v1`

Healthy production ranges:

- editorial realism: 82-98
- semantic safety: 95-100
- repetition resistance: 84-95
- overall quality: 72-96

Scores are deterministic and explainable.

## 7. Pedagogical Guarantees

Explanations and SVGs preserve:

- derivation visibility
- compact aptitude rhythm
- shortcut-support rather than shortcut replacement
- teacher-like reasoning flow
- no solver-language leakage

## 8. Regression Guarantees

Goldens freeze:

- English realization
- Hindi realization
- Punjabi realization
- edge-case topology behavior
- SVG rendering
- multilingual SVG rendering
- metric metadata

Future changes must compare against these goldens before release.

## 9. Runtime Guarantees

- deterministic generation
- stable signatures
- language-neutral equations
- validator-gated exports
- no runtime randomness
- no reasoning mutation from rendering layers

## 10. Future Extension Compatibility

Future systems must extend contracts, not mutate production contracts:

- adaptive pedagogy
- analytics
- PYQ imitation
- difficulty ladders
- coaching modes
- future Indian languages
- student modeling

