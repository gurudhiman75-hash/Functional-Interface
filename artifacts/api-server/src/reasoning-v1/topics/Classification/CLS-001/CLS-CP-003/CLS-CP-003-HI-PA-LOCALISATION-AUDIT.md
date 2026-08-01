# CLS-CP-003 — Hindi and Punjabi Localisation Audit

Status: `LOCALIZED_REVIEW_RUNTIME_PROOF`

## Scope

This phase localises the two frozen CP-003 learner contracts without translating English words or English spelling logic mechanically.

Permanent QL identities remain unchanged:

- `CLS-QL-005` — find the word whose visible structure differs;
- `CLS-QL-006` — resolve controlled jumbles, then find the semantic outlier.

Localised review locales:

- Hindi (`hi-IN`);
- Punjabi (`pa-IN`).

## Language-ownership decision

English orthography is not the source of truth for Hindi or Punjabi. The learner contract is preserved, while each language receives governed native-script evidence.

| English prototype ancestry | Hindi/Punjabi adapted evidence | QL disposition |
|---|---|---|
| exact word length | grapheme-safe written letter-unit count | retain in `CLS-QL-005` |
| vowel count | visible native vowel-mark / matra / lag count | retain in `CLS-QL-005` |
| repeated-letter topology | repeated grapheme-unit topology | retain in `CLS-QL-005` |
| palindrome status | forward/backward equality of grapheme units | retain in `CLS-QL-005` |
| first/last letter class | first/last visible vowel-mark pattern | retain in `CLS-QL-005` |
| prefix/suffix family | governed native prefix/suffix family | retain in `CLS-QL-005` |
| jumbled semantic outlier | native-grapheme jumble plus semantic classification | retain in `CLS-QL-006` |

No new QL is justified. No English word is transliterated merely to preserve an English state.

## Runtime architecture

The localised runtime:

- segments Devanagari and Gurmukhi by Unicode grapheme rather than code point;
- normalises all source words to NFC;
- counts only visible native vowel marks for the adapted vowel-mark family;
- generates valid states first and rejects competing-answer ambiguity;
- reparses every displayed option independently;
- resolves each jumble by a canonical grapheme signature;
- rejects a jumble set when its visible scrambled forms create a direct structural shortcut;
- preserves deterministic prototype, option-count and answer-index keys across Hindi and Punjabi;
- produces native stems, option evidence, full worked explanations, shortcuts and trap warnings;
- contains no Latin learner-facing text.

## Governed source boundary

Each locale has:

- a curated general native-word dataset;
- explicit governed prefix/suffix groups;
- a curated palindrome supplement;
- seven semantic classes for native jumbles;
- five words per semantic class;
- native class labels and teacher-language explanations.

The dataset is an implementation authority for review, not a public dictionary or unrestricted free-text generator.

## Parity policy

The following are preserved between Hindi and Punjabi for the same QL and seed:

- permanent QL identity;
- solve contract;
- prototype ancestry;
- option count;
- correct-answer position.

The following are intentionally language-specific:

- displayed words;
- exact structural values;
- semantic word states;
- explanations;
- shortcuts and trap language.

This avoids false state parity while retaining reproducible product parity.

## Current lifecycle

```text
English editorial status:       APPROVED
Hindi/Punjabi status:            LOCALIZED_REVIEW_REQUIRED
Question Studio discovery:       disabled
Question Bank writing:           disabled
Test eligibility:                disabled
Public publication:              disabled
Hindi/Punjabi approval:          false
```

The localised runtime must pass executable parity, uniqueness, native-script, ambiguity, diversity and lifecycle audits before a review artifact is accepted. Editorial approval and multilingual freeze remain separate explicit steps.
