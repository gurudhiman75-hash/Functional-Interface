# Probability Multilingual Foundation

## Decision

Probability remains **English mock-ready only**. Hindi and Punjabi are represented by a complete, auditable and fail-closed foundation, shared native-language primitives, and a draft PRB-001 native editorial library. They are not exposed in Question Studio and are not publicly publishable.

## Authority model

The English Probability runtime remains the sole mathematical authority for:

- parameter generation;
- exact rational arithmetic;
- solver output;
- correct-option index;
- mock-family policy;
- difficulty and exam-profile routing;
- traceability IDs.

Hindi and Punjabi replace only student-facing language through native editorial entries. Native rendering must never recompute mathematics or alter the answer key.

## Current inventory

| Package | English QLs | Hindi editorial state | Punjabi editorial state |
|---|---:|---:|---:|
| PRB-001 | 120 | 120 draft entries | 120 draft entries |
| PRB-002 | 96 | 96 pending slots | 96 pending slots |
| **Total** | **216** | **216 tracked** | **216 tracked** |

The release manifest still contains **648 language records**: 216 English, 216 Hindi and 216 Punjabi. Hindi/Punjabi manifest status remains `PENDING_NATIVE_EDITORIAL` until the later human-review and parity freeze.

## Foundation guarantees

1. English remains `APPROVED_EDITORIAL_ENGLISH` and Question Studio-enabled.
2. Every Hindi and Punjabi QL remains release-gated as `PENDING_NATIVE_EDITORIAL`.
3. Hindi and Punjabi Question Studio requests fail closed.
4. No language is publicly publishable.
5. Every manifest record preserves `sourceLanguage: en`.
6. Duplicate package/CP/QL/language records are rejected by regression tests.
7. Public release remains a separate freeze after multilingual parity review.

## ML-02 shared native primitive authority

`native-language-primitives.ts` is the shared vocabulary/primitive authority introduced at ML-02. It does **not** approve any Hindi or Punjabi QL.

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

This policy keeps the English solver and correct-option index authoritative while allowing native editorial prose around the mathematics.

## ML-03 PRB-001 draft editorial authority

`PRB-001/native-editorial.ts` now provides the draft native editorial layer for all **120 PRB-001 English QLs**.

Inventory:

- 120 Hindi draft editorial entries;
- 120 Punjabi draft editorial entries;
- 240 native entries total;
- 37 hand-curated wording families covering classical probability, complements, coins, dice, spinners, number selection, cards and urn selections.

Each native entry preserves:

- the English `qlId`;
- the English source stem-template ID;
- the English context-family authority;
- the exact stem placeholder contract;
- learner-friendly native approach, working lead and key-point guidance;
- `questionStudioEnabled: false`;
- `publiclyPublishable: false`.

The native binding layer is closed/fail-closed for all currently generated PRB-001 string values, including:

- tickets, bulbs, balls, books and candidate/application contexts;
- dynamic certain/impossible/possible event labels;
- red/blue/green/black values;
- coin H/T patterns;
- die and number properties;
- dice product/parity event types;
- card ranks and suits;
- probability/count answer instructions.

Unknown string bindings throw instead of leaking English prose into a native question.

`PRB-QL-004` and `PRB-QL-010` remain learning-only in every native entry.

### ML-03 validation

Workflow run `31372735056` passed:

- ML-01 648-record fail-closed manifest validation;
- ML-02 shared primitive validation;
- ML-03 120/120 Hindi coverage;
- ML-03 120/120 Punjabi coverage;
- exact placeholder parity against every English PRB-001 stem;
- native-script validation for stems, event wording and explanation guidance;
- closed dynamic binding samples;
- zero Hindi/Punjabi Question Studio exposure;
- zero native public publication exposure;
- unchanged English Probability Question Studio and exam-readiness suites.

These 240 entries are **draft editorial content, not human-approved content**. Their release manifest status intentionally remains `PENDING_NATIVE_EDITORIAL`.

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

**Status:** implemented and merged through PR #658.

### Checkpoint ML-03 — PRB-001 native editorial library

- Draft Hindi and Punjabi stems and explanation guidance for all 120 QLs.
- Context binding against English-generated variables.
- Placeholder and mathematical authority preservation.
- PRB-QL-004 and PRB-QL-010 remain learning-only in every language.
- No native runtime exposure before full parity and human review.

**Status:** implemented on `feat/prb-probability-ml03-prb001-native-editorial`; branch validation passed in workflow `31372735056`.

### Checkpoint ML-04 — PRB-002 native editorial library

- Hindi and Punjabi draft stems and explanations for all 96 QLs.
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

- Draft native prose cannot be treated as approved editorial content without human review.
- Shared ML-02 vocabulary is reusable infrastructure, not QL-level editorial approval.
- Missing native entries or bindings must throw; English fallback must not silently appear in a Hindi/Punjabi request.
- Native text cannot change generated values, solver evidence, correct index or mock eligibility.
- Numeric/fraction/ratio/percent/MathJax options remain mathematically identical across languages.
- A language may be enabled only when its full required QL set passes parity and human review.
- The current English freeze must remain unchanged throughout multilingual implementation.
