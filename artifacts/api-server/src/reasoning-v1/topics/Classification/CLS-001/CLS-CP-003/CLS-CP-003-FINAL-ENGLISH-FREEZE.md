# CLS-CP-003 — Final English Freeze

Status: `FROZEN_ENGLISH_RUNTIME_PROOF`

## Permanent inventory

| QL | Solve contract | Student task |
|---|---|---|
| `CLS-QL-005` | `CP003-FIND-WORD-STRUCTURE-OUTLIER` | Find the word whose visible spelling or structural property differs from the others |
| `CLS-QL-006` | `CP003-RESOLVE-JUMBLES-AND-FIND-SEMANTIC-OUTLIER` | Resolve each controlled jumble, then find the resolved word from a different semantic class |

## Merge/split decision

The six direct controls merge into `CLS-QL-005` because they share one answer object and proof contract: compare a declared visible property of every displayed word and select the unique mismatch.

Covered direct properties:

- exact word length;
- vowel count;
- repeated-letter topology;
- palindrome status;
- first/last vowel-consonant class;
- governed prefix or suffix family.

The jumbled-word task remains `CLS-QL-006`. It requires a distinct first stage—unique reconstruction of every jumble—before semantic classification. The runtime rejects any jumbled state that exposes a direct visible structural shortcut.

## Governed English foundation

```text
Dataset version:              CLS-CP003-WORD-STRUCTURE-EN-v1
Governed words:               630
Controlled jumble words:       35
Temporary source controls:      7
Permanent English QLs:          2
Answer-option counts:           4 and 5
Locale:                         en-IN
```

## Source closure

The uploaded Classification references explicitly cover spelling or structural difference, repeated-letter and letter-count patterns, affix structure, and rearranging letters into meaningful words before classification. Dictionary ordering remains outside this checkpoint, and hidden transformation inference remains Coding-Decoding.

## Executable proof

The English freeze gate validates deterministic replay, all seven source controls, both permanent QLs, both option counts, all answer positions, independent solving, shortcut-free jumbles, learner-text hygiene and review-only lifecycle locks.

## Product locks

```text
Question Studio exposure:     disabled
Question Bank storage:        disabled
Test eligibility:             disabled
Public publication:           disabled
```

English completion does not authorise mechanical Hindi or Punjabi translation. Script-specific governed word datasets are required for those locales.
