# V1 English Core Stability Snapshot

Snapshot version: `v1-english-core-stable`

This snapshot freezes the English percentage reasoning core before multilingual realization. It is a baseline for regression detection, reference-sample comparison, metric calibration, and future Hindi/Punjabi/SVG realization work.

## 1. Semantic Contracts

Stable semantic value types:

- `PercentageValue`: a percentage with optional semantic direction such as `increase`, `decrease`, `profit`, `loss`, or `reduction`.
- `AbsoluteValue`: a raw absolute value. It must never render with `%`.
- `CountValue`: an absolute count with a domain label such as `votes`, `marks`, or `people`.
- `CurrencyValue`: a monetary value or salary/price amount.
- `RatioValue`: a ratio or multiplier-like relation used internally for reasoning.

Rendering guarantees:

- Absolute values never render `%`.
- Percentages are rendered only from semantic percentage values.
- Negative semantics must render through direction, for example `40% loss`, not `-40%`.
- Equation structure remains language-neutral.
- Semantic signatures use direction tokens such as `increase:25`, `decrease:10`, `loss`, and `ans=loss:40`.

## 2. Editorial Intent Contracts

Multilingual realization must consume semantic intents, not raw English strings.

Stable intent examples:

- `label.vote_margin`
- `label.remaining_votes`
- `label.valid_votes`
- `label.pass_mark_gap`
- `label.maximum_marks`
- `label.population_after_growth`
- `label.final_population`
- `label.reduction_in_consumption`
- `label.profit_percentage`
- `label.loss_percentage`
- `transition.therefore`
- `transition.hence`
- `transition.so`
- `shortcut.total_votes`
- `shortcut.total_quantity`
- `shortcut.reduction_in_consumption`

English text is one realization of these intents. Hindi, Punjabi, SVG, and voice layers must map from intent to local expression.

## 3. Formatting Guarantees

- Equations use visible arithmetic and remain parseable across languages.
- Multiplication is presentation-level and must not expose programming syntax.
- Internal variables such as `gapPercent`, `afterFirst`, and `validVotes` must not appear in user-facing explanations.
- Raw negative percentages must not appear in final answer rendering.
- Shortcut sections must not duplicate the full derivation.

## 4. Validator Guarantees

Current validators protect the following:

- `semantic-stability-validator`: prevents formatter leakage, raw negative answer leakage, unsafe semantic signatures, and shortcut duplication.
- `contextual-humanization-validator`: ensures domain-native narration, semantic answer consistency, and context-aware shortcuts.
- `presentation-polish-validator`: blocks weak systemic labels, robotic shortcut narration, generic scenario fallback, and signature sign leakage.
- `metric-calibration-validator`: prevents score saturation, over-clustering, weak differentiation, and unexplained scoring.
- `human-reasoning-validator`: prevents solver-language leakage and internal variable exposure.
- `editorial-micro-polish-validator`: prevents transition collisions, awkward labels, computational sign leakage, and bare shortcuts.

## 5. Metric Calibration Baselines

Healthy calibrated score ranges:

- `editorialRealismScore`: 82-98
- `semanticSafetyScore`: 95-100
- `repetitionResistanceScore`: 84-95
- `equationReadabilityScore`: 88-97
- `domainRealismScore`: 78-96
- `shortcutUsefulnessScore`: 72-97
- `overallQualityScore`: 72-96

Scores are deterministic, explainable, non-random, and intended for QA filtering, ranking, regression detection, and teacher review workflows.

## 6. Stable Topology Families

Stable topology families include:

- `direct_mapping`
- `filtered_base`
- `successive_filtering`
- `remaining_component`
- `hidden_total`
- `multi_entity_distribution`
- `ratio_percentage_hybrid`
- `effective_percentage`
- `base_shift`
- `layered_population`

Stable reasoning patterns include:

- `successive_base_change`
- `reverse_reconstruction`
- `difference_mapping`
- `fixed_base_relation`
- `population_projection`
- `margin_mapping`
- `mixture_balance`

## 7. Realization Architecture Rules

- Reasoning graphs remain the source of truth.
- Editorial layers realize structured reasoning; they do not invent reasoning.
- Multilingual layers must localize narration, labels, transitions, and coaching rhythm only.
- Equations remain universal and language-neutral.
- Do not translate English literally. Realize semantic editorial intents.
- Do not move prose logic into canonical generation or topology builders.

## 8. Regression Checklist

Before merging multilingual or visualization work, verify:

- no solver leakage
- no formatter leakage
- no raw negative percentages
- no AI tutoring prose
- no invalid `%` rendering
- no generic semantic labels
- no broken equations
- no duplicated shortcut derivation
- no unstable topology signatures
- no loss of contextual domain narration
- no metric saturation regression
- reference samples remain comparable

## 9. Runtime Guarantees

- Deterministic generation by seed/signature.
- Stable topology signatures.
- Stable semantic answer rendering.
- Validator-gated English output.
- Calibrated metric reports with confidence, tier, reasons, and penalties.
- Reference exports generated only through `pnpm stability:freeze`.

## 10. Multilingual Compatibility Guarantees

Future multilingual realization can rely on:

- semantic value types
- stable reasoning graph structure
- language-neutral equations
- semantic editorial intents
- domain labels and transitions as intents
- calibrated quality metadata
- frozen English reference samples

Future localized output must preserve the same reasoning, topology, semantic safety, and formatting contracts.

## Git Tag Recommendation

Do not run this automatically. After review, create one stable marker manually:

```bash
git tag v1-english-core-stable
git tag pre-multilingual-stable
```
