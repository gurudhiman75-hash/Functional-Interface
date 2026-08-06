# CLS-CP-003 — Lexical, Spelling and Word-Structure Classification

Status: `EXECUTABLE_DISCOVERY_IN_PROGRESS`

This checkpoint owns classification-final questions whose displayed objects are words or controlled letter jumbles and whose governing property is lexical or word-structural rather than semantic knowledge, arithmetic or hidden coding.

No permanent QL or solve-contract identity is allocated by this document.

## 1. Source boundary

The chapter source audit records recurring forms for:

- jumbled meaningful-word classification;
- different spelling or structural property;
- repeated-letter and letter-count patterns;
- common prefix, suffix or morphology.

The chapter blueprint additionally admits word length, vowel/consonant count, initial/final letter class, palindrome status and controlled internal word structure.

Full uploaded-book saturation remains open because the File Library retrieval service was unavailable when this wave began. The first wave therefore remains temporary even if its executable audits pass.

## 2. Temporary source controls

| Prototype | Discovery purpose |
|---|---|
| `CLS-CP003-PROT-001` | Find the word whose exact letter count differs |
| `CLS-CP003-PROT-002` | Find the word whose vowel count differs |
| `CLS-CP003-PROT-003` | Find the word whose repeated-letter topology differs |
| `CLS-CP003-PROT-004` | Find the word whose palindrome status differs |
| `CLS-CP003-PROT-005` | Find the word whose first/last vowel-consonant class differs |
| `CLS-CP003-PROT-006` | Find the word whose governed prefix or suffix family differs |
| `CLS-CP003-PROT-007` | Resolve controlled unique jumbles, then find the semantic outlier |

The first six controls operate directly on displayed words. The seventh adds a unique-anagram resolution stage and may require a separate permanent solver contract.

## 3. Bounded rule universe

Direct word controls are audited against the declared structural properties only:

```text
WORD_LENGTH
VOWEL_COUNT
REPEATED_LETTER_TOPOLOGY
PALINDROME_STATUS
BOUNDARY_LETTER_CLASS
PRIMARY_AFFIX
```

The solver does not invent poetic, semantic or phonetic similarities after seeing the options.

For controlled jumbles:

```text
each displayed jumble resolves to exactly one admitted canonical word
and exactly one resolved word falls outside the common semantic class
```

Open-dictionary anagram search and free-form runtime word invention are prohibited.

## 4. Acceptance invariant

For direct structural questions:

```text
one admitted rule-value supports optionCount - 1 displayed words
exactly one word falls outside that value
and no comparable admitted rule identifies a different outlier
```

For jumbled-word questions:

```text
each jumble has exactly one admitted resolution
optionCount - 1 resolved words share one admitted class
exactly one resolved word belongs to a contrasting class
```

Audit outcomes:

```text
UNIQUE
AMBIGUOUS
NO_VALID_RULE
```

Only `UNIQUE` states are emitted.

## 5. Ownership boundary

CP-003 owns:

- classification by visible word structure;
- classification by governed prefix/suffix family;
- explicit controlled unjumbling when the final task is classification.

It excludes:

- dictionary sorting or dictionary position — Word and Dictionary Order;
- source-to-target word transformation — Analogy;
- hidden encoding or decoding — Coding-Decoding;
- direct alphabet-position calculation — Alphabet Test;
- abstract letter-pair or cluster arithmetic — later Classification checkpoints;
- open-ended spelling correction or vocabulary testing;
- language-independent translation claims when spelling structure changes by script.

## 6. Locale policy

This first wave is English discovery only. Word length, vowels, repeated letters, affixes and palindromes do not survive translation as the same canonical state.

Hindi and Punjabi require language-specific governed datasets and script-aware solvers. They must not be produced by translating English structural questions.

## 7. Lifecycle locks

```text
Permanent CP-003 QLs:          0
Frozen CP-003 solve contracts: 0
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```