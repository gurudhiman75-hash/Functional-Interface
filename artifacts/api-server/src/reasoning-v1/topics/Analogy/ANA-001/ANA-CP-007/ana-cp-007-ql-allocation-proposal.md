# ANA-CP-007 Provisional QL Allocation Proposal

Status: **PROPOSAL — not frozen and not implemented**

This proposal is derived from the completed pilot rather than from the old manifest count. The pilot proves seven genuinely word-native authorities, 87 bounded contexts, independent solver parity, cross-checking against CP-006, and four-option yield.

## 1. Allocation principle

A new QL is justified only when the student is asked to perform a materially different inference.

The following remain rule contexts rather than separate QLs:

- odd versus even source-position extraction;
- the bounded formula used by a word-length rule;
- the vowel shift and consonant shift amounts;
- word length, vowel distribution and repeated-letter complexity;
- difficulty and distractor proximity.

Those parameters change the generated instance but not the requested reasoning task.

The two currently proven presentation contracts are:

1. `DIRECT_COMPLETION` — infer the demonstrated word-structure rule and apply it to a target word;
2. `PAIR_SELECTION` — select the complete word/result pair that follows the same rule.

No inverse, incorrect-pair, or rule-description QL is admitted yet. Those tasks would need separate source evidence and an overlap audit against the later advanced/meta checkpoint.

## 2. Provisional range

Subject to final freeze, CP-007 would occupy:

```text
ANA-QL-209..ANA-QL-222
```

This is 14 proposed QLs: seven authorities × two materially distinct presentation contracts.

| Proposed QLs | Native authority | Direct answer | Pair-selection answer |
|---|---|---|---|
| `209–210` | Remove vowels | letter cluster | word/cluster pair |
| `211–212` | Remove consonants | letter cluster | word/cluster pair |
| `213–214` | Select odd/even source-position letters | letter cluster | word/cluster pair |
| `215–216` | Complete alphabet-position sum | number | word/number pair |
| `217–218` | Bounded word-length rule | number | word/number pair |
| `219–220` | Canonical repeated-letter equality pattern | number-pattern cluster | word/pattern pair |
| `221–222` | Differential vowel/consonant shift | letter cluster | word/cluster pair |

The numbering preserves the six nonduplicated allocations from the audited manifest and appends the source-backed differential class rule. Generic word transformations formerly occupying the beginning of CP-007 remain delegated to CP-006 and receive no replacement CP-007 IDs.

## 3. Proposed QL contracts

### `ANA-QL-209` — Remove vowels, direct completion

- task: infer that vowels are removed and consonant order is preserved;
- contexts: fixed English vowel set `A,E,I,O,U`;
- answer: consonant cluster;
- reject words where removal equals odd/even extraction or produces a trivial output.

### `ANA-QL-210` — Remove vowels, pair selection

- task: select the complete pair that removes vowels while preserving all consonants in order;
- options: one correct pair and three misconception-labelled pairs.

### `ANA-QL-211` — Remove consonants, direct completion

- task: retain vowels in original order;
- answer: vowel cluster;
- prefer at least two retained vowels.

### `ANA-QL-212` — Remove consonants, pair selection

- task: select the pair that preserves the complete vowel sequence.

### `ANA-QL-213` — Alternate source-position extraction, direct completion

- task: retain letters from either positions `1,3,5,…` or positions `2,4,6,…`;
- odd/even choice is a rule context, not a separate QL;
- reverse-order variants remain excluded until recurring source evidence is established.

### `ANA-QL-214` — Alternate source-position extraction, pair selection

- task: select the pair using the same starting parity and preserved order.

### `ANA-QL-215` — Complete alphabet-position sum, direct completion

- task: add all ordinary alphabet positions using `A=1,…,Z=26`;
- answer: scalar number;
- explanation must show every letter value and the full addition.

Ownership note: the arithmetic authority should live in a shared alphabet-value library usable by both Analogy and Coding-Decoding. CP-007 owns only this analogy presentation contract; it must not duplicate the underlying calculation implementation.

### `ANA-QL-216` — Complete alphabet-position sum, pair selection

- task: select the word/number pair whose number equals the complete alphabet-position sum;
- reject sequence-code options such as `12-9-15-14`, which belong to cross-domain/coding tasks.

### `ANA-QL-217` — Bounded word-length rule, direct completion

- task: infer one whitelisted function of word length and apply it to a target word;
- currently piloted contexts: direct length, double length, square length, and length ± a bounded constant;
- final production context list remains subject to source proof;
- arbitrary formula fitting is prohibited.

### `ANA-QL-218` — Bounded word-length rule, pair selection

- task: select the word/number pair using the same length function;
- source and target words should normally have different lengths so the rule is evidenced rather than repeated accidentally.

### `ANA-QL-219` — Repeated-letter equality pattern, direct completion

- task: convert a word to its canonical first-occurrence pattern;
- example: `LEVEL → 1-2-3-2-1`;
- every equality and inequality among positions is significant.

### `ANA-QL-220` — Repeated-letter equality pattern, pair selection

- task: select the word/pattern pair with the exact canonical equality structure;
- “contains a repeated letter” is not sufficient.

### `ANA-QL-221` — Differential vowel/consonant shift, direct completion

- task: infer separate fixed alphabet movements for vowels and consonants;
- both classes must occur in source and target;
- equal movements, identity, and accidental ordinary positional rules are rejected;
- explanation identifies vowels/consonants and works each letter explicitly.

### `ANA-QL-222` — Differential vowel/consonant shift, pair selection

- task: select the word/cluster pair applying the same two class-specific movements;
- distractors include reversed class operations, one-class-only movement, a uniform shift, and an off-by-one class shift.

## 4. Why the proposal is 14 QLs rather than 87

The 87 pilot contexts do not represent 87 student skills.

- 72 contexts are bounded combinations of vowel and consonant shifts under one class-aware solve strategy;
- 9 contexts are bounded word-length formulas under one length-based solve strategy;
- 2 contexts are odd/even extraction under one position-selection strategy;
- the remaining fixed contexts are one per authority.

Freezing a QL for every parameter combination would create artificial duplication, fragmented analytics, and repeated explanations without expanding exam-pattern coverage.

## 5. Remaining blockers before freeze

The 14-QL proposal becomes final only after:

1. source evidence decides which word-length contexts survive production;
2. the shared alphabet-sum ownership contract with Coding-Decoding is documented;
3. direct and pair-selection generation are audited separately for all seven authorities;
4. English/Hindi/Punjabi interface policy is frozen;
5. a final gap audit finds no recurring native word-structure task requiring a distinct inference contract;
6. downstream unimplemented ANA ranges are amended from the final count.

## Current verdict

```text
Provisional native authorities: 7
Provisional presentation contracts: 2
Proposed QLs: 14
Proposed range: ANA-QL-209..ANA-QL-222
Permanent QL count: OPEN
Permanent solve-mode count: OPEN
Implementation: NOT STARTED
```
