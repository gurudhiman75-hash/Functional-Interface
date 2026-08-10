# Probability Multilingual Foundation

## Decision

Probability remains **English mock-ready only**. Hindi and Punjabi now have complete draft editorial coverage for both PRB-001 and PRB-002, but they are not exposed in Question Studio and are not publicly publishable.

## Authority model

The English Probability runtime remains the sole mathematical authority for:

- parameter generation;
- exact rational arithmetic;
- solver output;
- options and correct-option index;
- mock-family policy;
- difficulty and exam-profile routing;
- traceability IDs.

Hindi and Punjabi replace only student-facing language through native editorial entries. Native rendering must never recompute mathematics or alter the answer key.

## Current inventory

| Package | English QLs | Hindi editorial state | Punjabi editorial state |
|---|---:|---:|---:|
| PRB-001 | 120 | 120 draft entries | 120 draft entries |
| PRB-002 | 96 | 96 draft entries | 96 draft entries |
| **Total** | **216** | **216 draft entries** | **216 draft entries** |

The release manifest still contains **648 language records**: 216 English, 216 Hindi and 216 Punjabi. Hindi/Punjabi manifest status remains `PENDING_NATIVE_EDITORIAL` until the later runtime-parity and human-review freeze.

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
- colour, card-suit and card-rank vocabulary;
- counting vocabulary for selection, arrangement, permutation, combination and committee questions;
- learner-facing explanation labels;
- closed primitive-token and textual-option localisation;
- native-script and wrong-script validation;
- unresolved prose-placeholder detection that ignores MathJax braces;
- English-fallback detection through Latin prose auditing.

### Number, fraction and option policy

Probability mathematics remains language-neutral. Hindi and Punjabi therefore use an exam-safe display policy:

- ASCII digits `0-9` are preserved;
- integers, fractions, percentages and ratios are preserved byte-for-byte;
- MathJax is preserved byte-for-byte;
- known textual options may be translated only through the closed shared dictionary;
- unknown prose options throw rather than silently falling back to English.

This policy keeps the English solver and correct-option index authoritative while allowing native editorial prose around the mathematics.

## ML-03 PRB-001 draft editorial authority

`PRB-001/native-editorial.ts` provides the draft native editorial layer for all **120 PRB-001 English QLs**.

Inventory:

- 120 Hindi draft editorial entries;
- 120 Punjabi draft editorial entries;
- 240 native entries total;
- 37 curated wording families covering classical probability, complements, coins, dice, spinners, number selection, cards and urn selections.

Each native entry preserves the English QL identity, source stem-template ID, context family and exact placeholder contract. Dynamic English string bindings are closed/fail-closed, and `PRB-QL-004` plus `PRB-QL-010` remain learning-only.

ML-03 was merged through PR #669. Its native entries remain draft-only and release-gated.

## ML-04 PRB-002 draft editorial authority

`PRB-002/native-editorial.ts` provides the draft native editorial layer for all **96 PRB-002 English QLs**.

Inventory:

- 96 Hindi draft editorial entries;
- 96 Punjabi draft editorial entries;
- 192 native entries total;
- 30 curated wording families.

The 30 families cover:

- 8 successive-draw / replacement families;
- 6 conditional-probability families;
- 8 counting, committee, arrangement and number-formation families;
- 8 event-algebra families.

Every PRB-002 native entry explicitly records:

- `answerKeyAuthority: ENGLISH_RUNTIME`;
- `optionPolicy: PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX`;
- `questionStudioEnabled: false`;
- `publiclyPublishable: false`.

ML-04 preserves advanced Probability semantics including:

- independent vs dependent successive draws;
- with/without-replacement conditions;
- restricted conditional sample spaces;
- committee/combination and arrangement/permutation reasoning;
- event-algebra notation and formulas;
- all English-generated numerical values, options and the correct index.

Its closed native binding layer covers currently generated conditional labels and together/apart relations. Unknown prose bindings throw instead of leaking English.

Probability multilingual workflow run `31411657904` passed ML-01, ML-02, ML-03, ML-04 and the unchanged English readiness suites.

These 192 entries are **draft editorial content, not human-approved content**. Their release-manifest status intentionally remains `PENDING_NATIVE_EDITORIAL`.

## Implementation checkpoints

### Checkpoint ML-01 — Foundation and inventory

- Complete 216-QL language manifest.
- Fail-closed Hindi/Punjabi readiness guards.
- Public-publication guard for all languages.
- Count, uniqueness and authority regression tests.

**Status:** implemented and merged through PR #646.

### Checkpoint ML-02 — Shared native language primitives

- Native labels for Probability vocabulary and experiment objects.
- Hindi/Punjabi number, fraction and option localisation rules.
- Script validation and unresolved-placeholder detection.
- No question exposure.

**Status:** implemented and merged through PR #658.

### Checkpoint ML-03 — PRB-001 native editorial library

- Draft Hindi and Punjabi stems and explanation guidance for all 120 QLs.
- Context binding against English-generated variables.
- Placeholder and mathematical authority preservation.
- PRB-QL-004 and PRB-QL-010 remain learning-only.

**Status:** implemented and merged through PR #669.

### Checkpoint ML-04 — PRB-002 native editorial library

- Draft Hindi and Punjabi stems and explanation guidance for all 96 QLs.
- Advanced conditional/counting/event-algebra wording parity.
- English option/correct-index authority explicitly preserved.
- No native runtime exposure.

**Status:** implemented on `feat/prb-probability-ml04-prb002-native-editorial`; branch workflow `31411657904` passed.

### Checkpoint ML-05 — Multilingual runtime and parity harness

- English-first generation followed by native rendering.
- Bind generated values through the closed PRB-001/PRB-002 native binding layers.
- Script, placeholder, option uniqueness and answer-key validation.
- Deterministic cross-language replay and solver parity evidence.
- Language-specific question/explanation IDs.
- Keep Hindi/Punjabi Question Studio disabled until the full 216/216 parity suite passes.

### Checkpoint ML-06 — Human review and multilingual freeze

- Regenerate native review sheets.
- Human editorial sign-off with reviewer/date evidence.
- Cross-language mathematics and answer-key parity audit.
- Separate Hindi/Punjabi scored-mock approval.

### Checkpoint ML-07 — Public release

- Public-surface rendering review.
- Search/filter/test-series integration.
- Final publication approval.
- Only then may `publiclyPublishable` become true.

## Non-negotiable safety rules

- Draft native prose cannot be treated as approved editorial content without human review.
- Missing native entries or bindings must throw; English fallback must not silently appear in a Hindi/Punjabi request.
- Native text cannot change generated values, solver evidence, options, correct index or mock eligibility.
- Numeric/fraction/ratio/percent/MathJax options remain mathematically identical across languages.
- A language may be enabled only when its full 216-QL set passes runtime parity and human review.
- The current English freeze must remain unchanged throughout multilingual implementation.
