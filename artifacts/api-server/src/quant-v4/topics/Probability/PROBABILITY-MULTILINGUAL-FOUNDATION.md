# Probability Multilingual Foundation

## Decision

Probability remains **English mock-ready only**. Hindi and Punjabi now have complete draft editorial coverage for PRB-001 and PRB-002 **and complete automated ML-05 runtime parity**, but they are still not exposed in Question Studio and are not publicly publishable.

ML-05 proves that native presentation can be rendered from the frozen English source without changing mathematics. It does **not** replace the human native-editorial review required at ML-06.

## Authority model

The English Probability runtime remains the sole mathematical authority for:

- parameter generation;
- exact rational arithmetic;
- experiment and event construction;
- solver output and solver evidence;
- independent verification;
- options and correct-option index;
- mock-family policy;
- difficulty and exam-profile routing;
- parameter and mathematical fingerprints.

Hindi and Punjabi replace only student-facing presentation through native editorial entries and the ML-05 presentation overlay. Native rendering must never recompute mathematics or alter the answer key.

## Current inventory

| Package | English QLs | Hindi editorial state | Punjabi editorial state | ML-05 runtime parity |
|---|---:|---:|---:|---:|
| PRB-001 | 120 | 120 draft entries | 120 draft entries | 240/240 native presentations pass |
| PRB-002 | 96 | 96 draft entries | 96 draft entries | 192/192 native presentations pass |
| **Total** | **216** | **216 draft entries** | **216 draft entries** | **432/432 native presentations pass** |

The release manifest still contains **648 language records**: 216 English, 216 Hindi and 216 Punjabi. Hindi/Punjabi manifest status remains `PENDING_NATIVE_EDITORIAL` until ML-06 human review and multilingual freeze.

## Foundation guarantees

1. English remains `APPROVED_EDITORIAL_ENGLISH` and Question Studio-enabled.
2. Every Hindi and Punjabi QL remains release-gated as `PENDING_NATIVE_EDITORIAL`.
3. Hindi and Punjabi Question Studio requests fail closed.
4. No language is publicly publishable.
5. Every manifest record preserves `sourceLanguage: en`.
6. Duplicate package/CP/QL/language records are rejected by regression tests.
7. Public release remains a separate freeze after multilingual parity and human review.

## ML-02 shared native primitive authority

`native-language-primitives.ts` is the shared vocabulary/primitive authority introduced at ML-02. It does **not** approve any Hindi or Punjabi QL.

It provides:

- native labels for Probability concepts and experiment objects;
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

For the current Probability runtime, ML-05 preserves the complete English option array byte-for-byte, including its correct index.

## ML-03 PRB-001 draft editorial authority

`PRB-001/native-editorial.ts` provides the draft native editorial layer for all **120 PRB-001 English QLs**.

Inventory:

- 120 Hindi draft editorial entries;
- 120 Punjabi draft editorial entries;
- 240 native entries total;
- 37 curated wording families covering classical probability, complements, coins, dice, spinners, number selection, cards and urn selections.

Each native entry preserves the English QL identity, source stem-template ID, context family and exact placeholder contract. Dynamic English string bindings are closed/fail-closed, and `PRB-QL-004` plus `PRB-QL-010` remain learning-only.

**Status:** merged through PR #669.

## ML-04 PRB-002 draft editorial authority

`PRB-002/native-editorial.ts` provides the draft native editorial layer for all **96 PRB-002 English QLs**.

Inventory:

- 96 Hindi draft editorial entries;
- 96 Punjabi draft editorial entries;
- 192 native entries total;
- 30 curated wording families covering successive draws, conditional probability, counting/arrangement and event algebra.

Every PRB-002 native entry explicitly records:

- `answerKeyAuthority: ENGLISH_RUNTIME`;
- `optionPolicy: PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX`;
- `questionStudioEnabled: false`;
- `publiclyPublishable: false`.

Unknown prose bindings throw instead of leaking English.

**Status:** merged through PR #675.

## ML-05 multilingual runtime and parity authority

`multilingual-runtime.ts` implements an **English-first presentation-overlay runtime**.

A native preview is not a second generated question. The runtime:

1. obtains a valid English `ProbabilityQuestion` from the existing PRB-001/PRB-002 pipeline;
2. resolves the exact Hindi/Punjabi draft editorial entry for that QL;
3. reconstructs the English render context from the frozen generated parameters and solver result;
4. sends every dynamic prose placeholder through the package-native fail-closed binding layer;
5. renders native stem, explanation guidance and learner-facing visual text;
6. preserves the English options, correct index and answer exactly;
7. returns a native presentation overlay plus explicit parity evidence.

### Fields that remain English-runtime authoritative

- seed;
- package/CP/QL identity;
- exam profile;
- difficulty;
- generated parameters;
- experiment;
- event AST;
- solver and solver evidence;
- independent verification;
- reasoning evidence;
- options;
- correct index;
- answer;
- parameter fingerprint;
- mathematical fingerprint;
- mock policy and eligibility.

### Native-only presentation fields

- stem;
- event wording;
- explanation prose/guidance;
- learner-facing visual labels/title/alt text;
- language-specific question ID;
- language-specific explanation ID.

### Native presentation IDs

ML-05 keeps the English source IDs separately and derives deterministic language IDs:

- `<english-question-id>-hi` / `<english-question-id>-pa`;
- `<english-explanation-id>-hi` / `<english-explanation-id>-pa`.

### Visual safety

The currently supported Probability visuals are localized fail-closed:

- two-dice outcome grid;
- coin outcome tree;
- successive-draw probability tree;
- Venn event regions;
- standard card-deck summary;
- bag/urn composition display.

Native titles, alt text, event labels, replacement labels and coin-tree H/T leaves are localized. Unknown future visual strategies throw rather than silently exposing English learner-facing text.

### ML-05 parity proof

Workflow run `31449831894` passed on head `a336525762b4d641da0a408f8a3ded2c87735d5e`.

The harness validates all **216 English QLs × 2 native languages = 432 native presentations** and proves:

- 216/216 Hindi QL render coverage;
- 216/216 Punjabi QL render coverage;
- native-script and unresolved-placeholder safety;
- no silent English stem fallback;
- exact option-array parity;
- exact answer parity;
- exact correct-index parity;
- parameter-fingerprint parity;
- mathematical-fingerprint parity;
- unchanged solver authority;
- unchanged mock-policy authority;
- language-specific question/explanation ID uniqueness;
- native visual learner-text safety;
- renderer non-mutation of the English mathematical snapshot;
- deterministic seeded replay of parameters, mathematics, options, answer and correct index;
- unchanged English Probability readiness suites.

ML-05 therefore establishes **automated technical parity** for the complete Hindi/Punjabi draft layer.

It intentionally does not change the release manifest or Question Studio readiness guard.

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

**Status:** implemented and merged through PR #675.

### Checkpoint ML-05 — Multilingual runtime and parity harness

- English-first generation followed by native presentation rendering.
- Closed generated-value binding for PRB-001 and PRB-002.
- Script, placeholder, visual-text and answer-key validation.
- Deterministic cross-language replay and solver/fingerprint parity evidence.
- Language-specific question/explanation IDs.
- Full 216/216 parity proof for Hindi and Punjabi.
- Native Question Studio exposure remains disabled pending ML-06 human approval.

**Status:** implemented on `feat/prb-probability-ml05-multilingual-runtime`; branch workflow `31449831894` passed the complete ML-01 through ML-05 suite plus English readiness.

### Checkpoint ML-06 — Human review and multilingual freeze

- Generate review sheets from the ML-05 native runtime, not from static templates alone.
- Review real rendered stems, options, answers, explanations and visuals in Hindi and Punjabi.
- Record human editorial sign-off with reviewer/date evidence.
- Reconfirm cross-language mathematics and answer-key parity after any editorial corrections.
- Apply a separate Hindi/Punjabi scored-mock freeze.
- Only after the relevant language is approved may its Question Studio gate be enabled.

### Checkpoint ML-07 — Public release

- Public-surface rendering review.
- Search/filter/test-series integration.
- Final publication approval.
- Only then may `publiclyPublishable` become true.

## Non-negotiable safety rules

- Draft native prose cannot be treated as approved editorial content without human review.
- Missing native entries, bindings or visual strategies must throw; English fallback must not silently appear in a Hindi/Punjabi request.
- Native text cannot change generated values, solver evidence, options, correct index or mock eligibility.
- Numeric/fraction/ratio/percent/MathJax options remain mathematically identical across languages.
- Automated ML-05 parity is necessary but not sufficient for scored native mocks.
- A native language may be Question Studio-enabled only after ML-06 human review and multilingual freeze.
- The current English freeze must remain unchanged throughout multilingual implementation.
