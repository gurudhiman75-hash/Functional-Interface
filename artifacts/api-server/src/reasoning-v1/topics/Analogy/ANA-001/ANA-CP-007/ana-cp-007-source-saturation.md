# ANA-CP-007 — Source Saturation and Ownership Audit

Status: **DESIGN AUTHORITY IN PROGRESS — QL COUNT OPEN**

This audit determines which word-structure analogy contracts genuinely belong to ANA-CP-007 after ANA-CP-006 was expanded to cover generic letter-cluster transformations.

The checkpoint must not retain a family merely because it appeared in the old 20-QL allocation. A family is retained only when meaningful-word structure, vowel/consonant class, word length, alphabet value, or repeated-letter structure is necessary to define the relation.

---

## 1. Source evidence reviewed

The uploaded competitive-reasoning material contains the following relevant analogy classes:

- alphabet-position representation of complete words;
- complete reversal and adjacent-pair exchange;
- vowel/consonant differential transformation;
- source-word structural relationships involving vowels, consonants, positions and repeated letters.

Representative source-backed examples include:

- `LION : 1291514`, where each letter is replaced by its A=1 to Z=26 position;
- `FORWARD : DRAWROF`, a complete reversal already owned by ANA-CP-006;
- `CALCULATOR : YAAJJSRYPM`, a shift-plus-adjacent-exchange composition already owned by ANA-CP-006;
- `JANUARY : IBMVBQX`, where vowels move forward by one and consonants move backward by one.

The last example proves that class-aware vowel/consonant transformation is a material family and cannot be represented by generic position shifts alone.

---

## 2. Ownership removals from the inherited baseline

The following old CP-007 families are generic cluster operations and must be delegated to ANA-CP-006:

| Old family | Ownership verdict | Reason |
|---|---|---|
| Transform first letter | Delegate | CP-006 already supports position-specific transformations |
| Transform last letter | Delegate | CP-006 already supports position-specific transformations |
| Exchange first and last | Delegate | Exact CP-006 family already exists |
| Reverse word | Delegate | Exact CP-006 family already exists |

Meaningful English words may still appear as CP-006 inputs, but their presence does not create a new CP-007 solve contract.

This avoids duplicate solvers, duplicate ambiguity pools and permanent QL IDs for the same underlying relation.

---

## 3. Confirmed CP-007-native families

### 3.1 Remove vowels

Rule:

- remove A, E, I, O and U;
- preserve all remaining letters in original order;
- treat Y consistently as a consonant in the first runtime.

Required validations:

- at least two consonants remain;
- output is not identical to the input;
- distractors may remove consonants, retain one vowel, or change order.

### 3.2 Remove consonants

Rule:

- retain only A, E, I, O and U;
- preserve vowel order.

Required validations:

- at least two vowels remain for ordinary runtime questions;
- words producing one-character outputs may be reserved for Easy only or rejected;
- distractors may retain consonants or start from the wrong class.

### 3.3 Select letters by source position

Profiles:

- odd positions only;
- even positions only;
- bounded alternate selection beginning from a declared side.

Ownership boundary:

This family is retained only when the operation is word extraction and the output is structurally shorter. Generic odd/even letter shifting remains CP-006.

### 3.4 Complete alphabet-position representation

Source-backed form:

`LION → 12 9 15 14`

Profiles may differ only by representation, not solver ownership:

- separated numeric tokens;
- concatenated numeric string where parsing is unambiguous;
- forward alphabet positions only in this family.

Reverse positions and mixed arithmetic belong to advanced or coding-decoding ownership unless separately proven.

### 3.5 Bounded word-length transformation

The generic phrase “transform by word length” is not a valid frozen rule. Each allowed profile must be explicit and bounded.

Candidate profiles for audit:

- direct length;
- twice the length;
- square of the length;
- length plus or minus one fixed small constant.

A profile is retained only when source evidence and option quality justify it. Arbitrary formulas are prohibited.

### 3.6 Repeated-letter equality pattern

Use a canonical occurrence signature rather than the vague property “contains repeated letters.”

Examples:

- `LEVEL` → `1-2-3-2-1`;
- `LETTER` → `1-2-3-3-2-4`.

Two words match only when the complete equality pattern is identical.

Required validations:

- exactly one option shares the full pattern;
- options that merely contain the same number of repeated letters are distractors, not valid matches;
- case is normalized before pattern generation.

### 3.7 Vowel/consonant differential transformation

This family is mandatory from source evidence.

Representative source rule:

- vowels move one place forward;
- consonants move one place backward.

Bounded profiles may include:

- vowels `+k`, consonants `-m`;
- vowels `-k`, consonants `+m`;
- vowels unchanged, consonants shifted;
- consonants unchanged, vowels shifted.

Constraints:

- both classes must be present at least twice across displayed evidence;
- the operations must not collapse into one uniform shift;
- wrap behaviour must be explicit;
- source and target use the same class operations;
- the independent solver classifies letters separately from the generator.

### 3.8 Class regrouping with class-aware order

Candidate rule:

- collect vowels and consonants separately while preserving or explicitly reversing order;
- write one class before the other.

This family remains **provisional** until the source audit confirms recurring analogy examples rather than isolated coding-decoding questions.

It must not absorb arbitrary jumbles.

---

## 4. Candidate families rejected or deferred

| Candidate | Verdict | Reason |
|---|---|---|
| Alphabetical sorting | Delegate to CP-006 | Exact generic family already exists |
| Named-position deletion | Delegate to CP-006 | Generic deletion family already exists |
| Derived-letter insertion | Delegate to CP-006 | Generic insertion family already exists |
| Adjacent exchange plus shift | Delegate to CP-006 | Exact two-stage ownership already exists |
| Reverse then shift | Delegate to CP-006 | Exact two-stage ownership already exists |
| First/last extraction | Not yet proven | May be a generic cluster extraction rather than word structure |
| Middle-letter extraction | Not yet proven | Needs recurring source evidence and parity policy |
| Anagram relation | Deferred | Risks semantic and multi-answer ambiguity |
| Count distinct letters | Deferred | More naturally Coding-Decoding or Alphabet Test |
| Vowel/consonant numeric totals | Deferred | Requires boundary audit against Coding-Decoding |
| Word length plus alphabet value | Reserve for ANA-CP-009 | Existing advanced mixed-rule ownership |

---

## 5. Presentation-mode audit

For every frozen native family, the following modes are materially distinct and provisionally required:

1. `DIRECT_COMPLETION`
2. `PAIR_SELECTION`

Other task directions are not automatically allocated QLs.

Potential later tasks such as finding the incorrect pair, recovering the original word, or selecting a rule description should be added only when they create a different inference contract and do not belong to ANA-CP-009.

---

## 6. Locale policy

The first runtime should manipulate curated English A–Z words in all three interfaces:

- English instructions and explanations for `en-IN`;
- Hindi instructions and explanations for `hi-IN`, preserving Latin word tokens;
- Punjabi instructions and explanations for `pa-IN`, preserving Latin word tokens.

Native Devanagari and Gurmukhi structural transformations are excluded until the runtime has script-specific grapheme segmentation, vowel-sign handling, conjunct handling and source evidence.

This checkpoint is therefore language-sensitive in wording and dataset curation, but not a Unicode-code-point word manipulator.

---

## 7. Ambiguity pool

A generated question must be checked against:

- all frozen CP-007 word-structure rules;
- delegated eligible CP-006 transformations when the input/output lengths permit them;
- simple uniform shifts and opposite-letter relations;
- relevant numeric representations;
- equal-or-simpler competing word-length profiles.

Reject when:

- remove-vowels and alternate-position extraction produce the same output;
- remove-consonants and alternate-position extraction produce the same output;
- a class-aware transformation collapses into a uniform shift;
- more than one length formula fits both displayed pairs;
- a repeated-letter question has multiple structurally matching options;
- a distractor forms any registered relation with the source pair.

---

## 8. Current provisional native inventory

Confirmed native families:

1. remove vowels;
2. remove consonants;
3. position-based extraction;
4. complete alphabet-position representation;
5. bounded word-length transform;
6. repeated-letter equality pattern;
7. vowel/consonant differential transform.

Provisional pending stronger recurrence evidence:

8. class regrouping with class-aware order.

Delegated families do not receive CP-007 QL IDs.

---

## 9. Freeze rule

The checkpoint QL count and solve-mode count remain open until:

- every candidate family is classified as native, delegated, deferred or excluded;
- the Coding-Decoding boundary is audited;
- the CP-009 advanced mixed-rule boundary is audited;
- every retained family has sufficient valid word inventory;
- full-rule-pool ambiguity simulation shows acceptable generation yield;
- no meaningful source-backed word-structure pattern remains uncovered.

Current verdict:

```text
Native families confirmed: 7
Native families provisional: 1
Delegated inherited families: 4
QL count: OPEN
Solve-mode count: OPEN
Implementation: NOT STARTED
```
