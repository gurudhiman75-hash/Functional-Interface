# Probability Multilingual Foundation

## Decision

Probability remains **English mock-ready only**. Hindi and Punjabi are represented by a complete, auditable and fail-closed foundation plus shared native-language primitives, but they are not exposed in Question Studio and are not publicly publishable.

## Authority model

The English Probability runtime remains the sole mathematical authority for:

- parameter generation;
- exact rational arithmetic;
- solver output;
- correct-option index;
- mock-family policy;
- difficulty and exam-profile routing;
- traceability IDs.

Hindi and Punjabi must replace only student-facing language through approved native editorial entries. Native rendering must never recompute mathematics or alter the answer key.

## Current inventory

| Package | English QLs | Hindi slots | Punjabi slots |
|---|---:|---:|---:|
| PRB-001 | 120 | 120 pending | 120 pending |
| PRB-002 | 96 | 96 pending | 96 pending |
| **Total** | **216** | **216 pending** | **216 pending** |

The runtime manifest therefore contains **648 language records**: 216 English, 216 Hindi and 216 Punjabi.

## Foundation guarantees

1. English remains `APPROVED_EDITORIAL_ENGLISH` and Question Studio-enabled.
2. Every Hindi and Punjabi QL is explicitly `PENDING_NATIVE_EDITORIAL`.
3. Hindi and Punjabi Question Studio requests fail closed.
4. No language is publicly publishable.
5. Every manifest record preserves `sourceLanguage: en`.
6. Duplicate package/CP/QL/language records are rejected by regression tests.
7. Public release remains a separate freeze after multilingual parity review.

## ML-02 shared native primitive authority

`native-language-primitives.ts` is the only shared vocabulary/primitive authority introduced at ML-02. It does **not** approve any Hindi or Punjabi QL.

It provides:

- native labels for probability concepts such as event, outcome, favourable outcome, sample space, complement, conditional probability and independence;
- experiment-object vocabulary for coins, dice, cards, deck, bag/urn, balls, spinner and numbers;
- colour vocabulary;
- card-suit and card-rank vocabulary;
- cricket/football labels used by overlap questions;
- counting vocabulary for selection, arrangement, permutation, combination and committee questions;
- learner-facing explanation labels for method, working, simplification, key point and final answer;
- a closed primitive-token localizer;
- a closed textual-option localizer;
- native-script validation;
- wrong-script detection;
- unresolved prose-placeholder detection that ignores MathJax braces;
- English-fallback detection through Latin prose auditing.

### Number, fraction and option policy

Probability mathematics remains language-neutral. Hindi and Punjabi therefore use an exam-safe display policy:

- ASCII digits `0-9` are preserved;
- integer options are preserved byte-for-byte;
- fractions such as `1/3` are preserved byte-for-byte;
- percentages such as `25%` are preserved byte-for-byte;
- ratios such as `2:3` are preserved byte-for-byte;
- MathJax is preserved byte-for-byte;
- known textual options may be translated only through the closed shared dictionary;
- unknown prose options throw rather than silently falling back to English.

This policy keeps the English solver and correct-option index authoritative while allowing future native editorial prose around the mathematics.

## Implementation checkpoints

### Checkpoint ML-01 — Foundation and inventory

- Complete 216-QL language manifest.
- Fail-closed Hindi/Punjabi readiness guards.
- Public-publication guard for all languages.
- Count, uniqueness and authority regression tests.

**Status:** implemented and merged through PR #646.

### Checkpoint ML-02 — Shared native language primitives

- Native labels for probability terms, objects, colours, suits, games and counting vocabulary.
- Hindi/Punjabi number, fraction and option localisation rules.
- Script validation and unresolved-placeholder detection.
- No question exposure.

**Status:** implemented on `feat/prb-probability-ml02-native-primitives`; pending merge validation.

### Checkpoint ML-03 — PRB-001 native editorial library

- Human-authored Hindi and Punjabi stems and explanations for all 120 QLs.
- Context binding against English-generated variables.
- Four-option answer-key preservation.
- PRB-QL-004 and PRB-QL-010 remain learning-only in every language.

### Checkpoint ML-04 — PRB-002 native editorial library

- Human-authored Hindi and Punjabi stems and explanations for all 96 QLs.
- Five-option banking profile preservation.
- Combination/permutation notation and conditional wording parity.
- Banking Mains challenge families remain English-only until separately translated and reviewed.

### Checkpoint ML-05 — Multilingual runtime and Question Studio routing

- English-first generation followed by native rendering.
- Script, placeholder, option uniqueness and answer-key validation.
- Language-specific question and explanation IDs.
- Enable Hindi/Punjabi only after 216/216 parity proof for that language.

### Checkpoint ML-06 — Human review and freeze

- Regenerate review sheets for each native language.
- Human editorial sign-off with reviewer/date evidence.
- Cross-language mathematics and answer-key parity audit.
- Separate multilingual mock freeze.

### Checkpoint ML-07 — Public release

- Public-surface rendering review.
- Search/filter/test-series integration.
- Final publication approval.
- Only then may `publiclyPublishable` become true.

## Non-negotiable safety rules

- Machine-translated prose cannot be treated as approved editorial content.
- Shared ML-02 vocabulary is reusable infrastructure, not QL-level editorial approval.
- Missing native entries must throw; English fallback must not silently appear in a Hindi/Punjabi request.
- Native text cannot change generated values, solver evidence, correct index or mock eligibility.
- Numeric/fraction/ratio/percent/MathJax options remain mathematically identical across languages.
- A language may be enabled only when its full required QL set passes parity and human review.
- The current English freeze must remain unchanged throughout multilingual implementation.
