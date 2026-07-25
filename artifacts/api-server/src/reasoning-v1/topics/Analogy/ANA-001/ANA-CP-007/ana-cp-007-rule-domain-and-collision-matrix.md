# ANA-CP-007 — Rule Domain and Collision Matrix

Status: **PROVISIONAL DESIGN CONTRACT — COUNTS OPEN**

This document converts the CP-007 source audit into machine-testable rule domains and collision boundaries. It does not allocate permanent QL IDs.

---

## 1. Shared lexical input contract

All first-runtime inputs are curated uppercase English A–Z words.

A word record should contain:

```ts
interface WordStructureEntry {
  id: string;
  word: string;
  length: number;
  vowels: readonly string[];
  consonants: readonly string[];
  vowelPositions: readonly number[];
  consonantPositions: readonly number[];
  oddPositionLetters: string;
  evenPositionLetters: string;
  alphabetPositions: readonly number[];
  alphabetPositionSum: number;
  equalityPattern: readonly number[];
  distinctLetterCount: number;
  locale: "en-IN";
  editorialStatus: "REVIEWED";
}
```

The runtime must derive and independently verify these fields from `word`; stored derived fields are indexing aids, not unquestioned truth.

General word eligibility:

- uppercase A–Z after normalization;
- length 4–10 unless a family defines a narrower domain;
- no apostrophes, hyphens, abbreviations or proper nouns in the first runtime;
- at least one vowel and one consonant unless a family explicitly requires otherwise;
- answer word or transformed output must not accidentally form a second accepted relation;
- source and target words must be distinct and should not be simple inflections of one another.

Vowel policy:

```text
A, E, I, O, U are vowels.
Y is treated as a consonant.
```

---

## 2. Native rule authorities

### 2.1 `WORD_REMOVE_VOWELS`

Input domain:

- at least two vowels removed;
- at least two consonants remain;
- output length 2–7;
- output preserves source order.

Independent result:

```ts
[...word].filter((letter) => !VOWELS.has(letter)).join("")
```

Primary collisions:

- odd-position extraction;
- even-position extraction;
- named-position deletion from CP-006;
- accidental complete output under another class filter.

Reject when the output equals either odd- or even-position extraction.

### 2.2 `WORD_REMOVE_CONSONANTS`

Input domain:

- at least two consonants removed;
- at least two vowels remain;
- output preserves source order.

Primary collisions:

- alternate-position extraction;
- named-position deletion;
- repeated-letter-only output with multiple valid interpretations.

Reject when the output equals odd- or even-position extraction.

### 2.3 `WORD_POSITION_EXTRACTION`

Context:

```ts
type WordPositionExtractionContext = {
  parity: "ODD" | "EVEN";
  outputOrder: "FORWARD" | "REVERSE";
};
```

Initial inclusion recommendation:

- `ODD/FORWARD`;
- `EVEN/FORWARD`.

Reverse-order variants remain provisional until recurring exam evidence is established.

Input domain:

- source length at least 5;
- retained output at least 3 letters for ordinary questions;
- retained letters must not equal all vowels or all consonants.

Primary collisions:

- remove vowels;
- remove consonants;
- CP-006 parity regroup or named deletion.

### 2.4 `WORD_ALPHABET_POSITION_SEQUENCE`

The complete word maps to the complete sequence of A=1 through Z=26 positions.

Context:

```ts
type PositionSequenceContext = {
  representation: "SEPARATED" | "CONCATENATED";
};
```

`SEPARATED` is the authoritative logical representation. `CONCATENATED` is only a renderer form and is allowed when token boundaries remain recoverable from the source word.

Input domain:

- length 4–8;
- every source letter contributes exactly once;
- no arithmetic aggregation.

Primary collisions:

- Coding-Decoding direct alphabet-position coding;
- ANA-CP-009 letter-to-number mixed analogy.

Ownership rule:

- CP-007 owns recognition of a displayed word-to-position-sequence analogy;
- Coding-Decoding owns a stated code-language task or unknown-code recovery;
- CP-009 owns cross-domain compositions beyond direct full representation.

### 2.5 `WORD_ALPHABET_POSITION_SUM`

The complete word maps to the sum of A=1 through Z=26 positions.

This must remain separate from the sequence representation because the answer type, independent arithmetic and distractor model differ.

Input domain:

- length 4–9;
- result within safe option bounds;
- no repeated-letter shortcut; each occurrence contributes;
- source and target sums should not equal simple word length or another admitted length profile.

Primary collisions:

- direct word length;
- reverse-position sum;
- distinct-letter-only sum;
- A=0 through Z=25 error;
- CP-009 word-length-plus-alphabet-value composition.

### 2.6 `WORD_LENGTH_RULE`

Context must identify one whitelisted function.

```ts
type WordLengthProfile =
  | "DIRECT_LENGTH"
  | "DOUBLE_LENGTH"
  | "SQUARE_LENGTH"
  | "LENGTH_PLUS_CONSTANT"
  | "LENGTH_MINUS_CONSTANT";
```

The plus/minus constant domain is initially `1..3`.

Freeze rule:

- `DIRECT_LENGTH` is clearly distinct and may be retained;
- other profiles require recurring analogy evidence, not merely coding examples;
- profiles that cannot be distinguished from alphabet-value rules over full displayed evidence are rejected.

Input domain:

- source and target lengths must differ;
- two source examples may be required for profiles with a free constant;
- numeric outputs must stay positive and bounded.

Primary collisions:

- vowel count;
- consonant count;
- distinct-letter count;
- arbitrary numeric formula fitting.

### 2.7 `WORD_EQUALITY_PATTERN`

Canonical pattern algorithm:

- scan left to right;
- assign the next integer to each new letter;
- reuse the assigned integer for later occurrences.

Examples:

```text
LEVEL  → 1-2-3-2-1
LETTER → 1-2-3-3-2-4
NOON   → 1-2-2-1
```

Input domain:

- at least one repeated letter;
- at least three distinct positions in the pattern;
- answer options must have the same length;
- exactly one option has the complete same pattern.

Primary collisions:

- same repeated-letter count;
- same number of distinct letters;
- anagram/multiset equality;
- palindrome status only.

### 2.8 `WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT`

Context:

```ts
type WordClassShiftContext = {
  vowelShift: number;
  consonantShift: number;
};
```

Initial bounded domain:

- each shift in `-4..-1` or `1..4`, with optional zero for exactly one class;
- `vowelShift !== consonantShift`;
- not both zero.

Input domain:

- at least two vowels and two consonants across each complete pair;
- at least one vowel and one consonant change visibly;
- all source positions preserved;
- source and target lengths equal.

Primary collisions:

- uniform shift;
- odd/even-position shift;
- first/last or endpoint/interior shift;
- opposite-letter substitution;
- CP-006 generic position vector fitting only one example.

Acceptance requires complete two-pair evidence and full eligible-rule matching.

### 2.9 `WORD_CLASS_REGROUP`

Status: **PROVISIONAL**.

Possible contexts:

```ts
type WordClassRegroupContext = {
  firstClass: "VOWELS" | "CONSONANTS";
  vowelOrder: "FORWARD" | "REVERSE";
  consonantOrder: "FORWARD" | "REVERSE";
};
```

Input domain:

- at least two vowels and two consonants;
- regrouping must move letters materially;
- no arbitrary permutation inside a class;
- output uses every input letter exactly once.

Primary collisions:

- CP-006 parity regroup;
- alphabetical sort;
- block exchange;
- arbitrary jumbling.

This authority receives no QL until source recurrence is confirmed.

---

## 3. Delegated CP-006 authorities

These relations may use English words as inputs but are solved by CP-006:

- uniform and position-dependent shifts;
- first-letter or last-letter-only shifts;
- opposite letters;
- complete reversal;
- first/last exchange;
- adjacent-pair exchange;
- rotations;
- deletion and insertion;
- block exchange and block reversal;
- odd/even regrouping by positions;
- alphabetical sorting;
- whitelisted two-stage cluster transformations.

CP-007 ambiguity checks may call the CP-006 matcher, but CP-007 must not copy these rule implementations.

---

## 4. Cross-rule collision matrix

| Intended rule | Competing rule | Mandatory rejection condition |
|---|---|---|
| remove vowels | odd/even extraction | outputs are identical |
| remove consonants | odd/even extraction | outputs are identical |
| position extraction | vowel/consonant removal | selected positions exactly equal one letter class |
| position sequence | direct code mapping | task wording is code-language recovery rather than analogy recognition |
| position sum | word length | both source and target numeric outputs equal an admitted length profile |
| position sum | distinct-letter sum | repeated letters do not affect displayed evidence |
| length rule | vowel/consonant count | both evidence pairs fit the competing count rule |
| equality pattern | repeated-count only | more than one option shares only the coarse count |
| differential class shift | uniform shift | vowel and consonant shifts are equal modulo 26 |
| differential class shift | odd/even shift | all vowels occupy one parity and consonants the other in all evidence |
| class regroup | parity regroup | vowel/consonant classes coincide with odd/even positions across all evidence |
| class regroup | alphabetical sort | regrouped output is also completely sorted |

---

## 5. Evidence requirements by presentation mode

### Direct completion

At least one complete source pair plus a target input is displayed.

Rules with free numeric parameters should use source words that activate every branch and prevent simpler fits. A second source example may be required when one pair cannot establish the parameter uniquely.

### Pair selection

The source pair establishes the relation. Exactly one option pair must satisfy the complete intended rule and no other registered rule of equal-or-lower priority.

The option validator must test every complete pair, not only compare with a precomputed target string.

---

## 6. Independent solver boundary

The independent solver must reimplement:

- vowel/consonant classification;
- source-position extraction;
- alphabet-position sequence and sum;
- word-length functions;
- equality-pattern canonicalization;
- class-dependent shifts;
- class regrouping if admitted.

It must not call the generator rule's `apply()` method.

For delegated CP-006 checks, use the CP-006 independent matcher rather than the CP-006 production rule.

---

## 7. Current design decision

```text
Confirmed native authorities: 8
Provisional native authorities: 1
Delegated generic authorities: CP-006 pool
Frozen QL count: none
Frozen solve-mode count: none
Next gate: source evidence and generation-yield simulation
```

The eight confirmed authorities count position sequence and position sum separately because they have different answer types and solver contracts. This is still not a permanent QL allocation.
