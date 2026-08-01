# CLS-CP-003 — Hindi and Punjabi Localisation Audit

Status: `LOCALIZED_REVIEW_READY_RUNTIME_PROOF`

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
- matches nuisance letter-count and vowel-mark features where the intended rule requires it;
- excludes one-grapheme palindrome shortcuts;
- reparses every displayed option independently;
- resolves each jumble by a canonical grapheme signature;
- rejects a jumble set when its visible scrambled forms create a direct structural shortcut;
- preserves deterministic prototype, option-count and answer-index keys across Hindi and Punjabi;
- produces native stems, option evidence, full worked explanations, shortcuts and trap warnings;
- contains no Latin learner-facing text;
- rejects technical Hindi residue, gender-sensitive jumble grammar, awkward Punjabi genitives and count-agreement defects.

The authoritative localised generator is:

```text
cls-cp003-localized-runtime-v4
```

V4 changes presentation only. Its independent proof compares all generated mathematical states against V3 and requires zero option, answer, prototype, intended-rule or ambiguity-audit change.

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

## Exact executable proof

Pre-sync validated runtime head:

```text
1c856f69e5047355620ebab8d09aca7228c406fb
```

Workflow:

```text
Validate CLS-001 CP-003 Hindi Punjabi Localisation
Run: 30681766417
Result: PASS
```

English regression:

```text
Generated:                 800
Unique visible questions:  800
Permanent QLs:               2
Prototype ancestries:        7
Option counts:            4, 5
Difficulties: EASY, MEDIUM, HARD
Answer positions: 191, 193, 182, 191, 43
```

Hindi runtime proof:

```text
Generated:                  800
Unique visible questions:   799
Unique explanations:        799
Permanent QLs:                2
Prototype ancestries:         7
Adapted rules:                 7
```

Punjabi runtime proof:

```text
Generated:                  800
Unique visible questions:   796
Unique explanations:        796
Permanent QLs:                2
Prototype ancestries:         7
Adapted rules:                 7
```

Final V4 grammar and state-preservation proof:

```text
Generated comparisons:       1,600
Hindi plural lines corrected:   268
Mathematical state changes:        0
```

## Review corpus

```text
Total review questions:               84
Questions per locale:                 42
Prototype ancestries per locale:       7
Samples per ancestry per locale:       6
QLs represented: CLS-QL-005, CLS-QL-006
Formats: JSON and Markdown
```

Review artifact:

```text
Artifact ID: 8812523978
Digest: sha256:f9fd1fff8f4bf4e07dcd286e5911d09601d40f68eed746de27ef70e9f6c86424
```

Diagnostics artifact:

```text
Artifact ID: 8812523605
Digest: sha256:79f3aa37e66bcb99a00abf8595c6979bac7063db405d0bd50e9a130359a940b0
```

The exported 84-question corpus was checked for answer integrity, option uniqueness, complete prototype coverage, correct locale cardinality, palindrome nuisance matching, native-only learner text, singular/plural grammar, gender-safe jumble prose and lifecycle isolation. No defect remained.

## Current lifecycle

```text
English editorial status:       APPROVED
Hindi/Punjabi status:            LOCALIZED_REVIEW_READY
Question Studio discovery:       disabled
Question Bank writing:           disabled
Test eligibility:                disabled
Public publication:              disabled
Hindi/Punjabi approval:          false
```

Editorial approval and multilingual freeze remain separate explicit steps. This runtime may be merged as review-ready evidence, but it must not be treated as approved content until the product owner reviews the native corpus.