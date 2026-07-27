# ANA-CP-007 Coverage and Ownership Audit

Status: **provisional ownership audit; QL and solve-mode counts remain open**.

## 1. Purpose

This audit prevents `ANA-CP-007` from becoming a duplicate of the completed letter-cluster checkpoint. A rule belongs here only when meaningful-word structure is necessary to define, solve or validate the analogy.

## 2. Inherited baseline review

| Inherited family | Decision | Reason |
|---|---|---|
| transform first letter | delegate to CP-006 | this is a position-specific alphabet transform and does not require word structure |
| transform last letter | delegate to CP-006 | this is a position-specific alphabet transform and does not require word structure |
| exchange first and last letters | delegate to CP-006 | CP-006 already owns the complete first/last exchange rule and ambiguity model |
| reverse word | delegate to CP-006 | full reversal is already a complete language-neutral cluster rule |
| remove vowels | retain in CP-007 | vowel classification is meaningful-word/class structure |
| remove consonants | retain in CP-007 | consonant classification is meaningful-word/class structure |
| select alternate letters | retain provisionally | selection by word position is exam-relevant, but must be checked against generic deletion/extraction ownership |
| alphabet-position sum | retain in CP-007 | maps the complete word to a numeric structural value |
| transform by word length | retain provisionally | valid only after bounded, source-backed length profiles are frozen |
| preserve duplicate-letter pattern | retain in CP-007 | depends on equality/frequency structure across the word |

The inherited 20-QL count is therefore not authoritative for implementation. Four baseline families would duplicate CP-006 and must not receive new CP-007 solver ownership.

## 3. Confirmed additional family

`WORD_VOWEL_CONSONANT_DIFFERENTIAL_TRANSFORM` is required.

Representative source form:

```text
JANUARY : IBMVBQX
```

The relationship changes vowels and consonants under different fixed operations. It cannot be represented by vowel removal, consonant removal or one uniform alphabet shift.

Required controls:

- fixed vowel set;
- fixed vowel movement and fixed consonant movement;
- source and target activate both classes;
- vowel and consonant operations must differ materially;
- cases collapsing to a uniform shift are rejected;
- wrap arithmetic is explicit in explanations;
- distractors include reversed class operations, one-class-only movement and uniform-shift mistakes.

## 4. Provisional native ownership set

The current evidence supports these CP-007-native authorities:

1. remove vowels while preserving consonant order;
2. remove consonants while preserving vowel order;
3. select odd- or even-position letters while preserving order;
4. calculate the A=1 through Z=26 value of the complete word;
5. apply a bounded word-length profile;
6. compare or preserve the canonical repeated-letter pattern;
7. transform vowels and consonants differently.

This is an ownership list, not a frozen QL list. A family may need more than one materially different solve contract, while another may need only one context-driven contract.

## 5. Candidate modes still requiring proof

### Alternate-letter selection

Possible contexts:

- retain positions 1, 3, 5, ...;
- retain positions 2, 4, 6, ...;
- retain odd positions in reverse order;
- retain even positions in reverse order.

Only contexts with recurring exam evidence should be frozen. Simple odd/even extraction may be one context-driven rule rather than separate solve modes.

### Word-length profiles

The label `transform by word length` is too broad. Potential bounded profiles include:

- direct length;
- square of length;
- twice the length;
- length plus or minus a fixed constant;
- product of vowel and consonant counts;
- difference between consonant and vowel counts.

The final set must be source-backed. Arbitrary formulas chosen only to fit one example are prohibited.

### Duplicate-letter structure

Possible tasks include:

- select a word with the same canonical equality pattern;
- determine a missing transformed pattern;
- select the pair with the same repeated-letter arrangement.

A simple statement that “both words contain a repeated letter” is insufficient. The complete canonical pattern must match.

## 6. Candidate families not yet admitted

The following remain unowned until further source evidence is established:

- vowels first followed by consonants;
- consonants first followed by vowels;
- count vowels only;
- count consonants only;
- sum vowel positions separately from consonant positions;
- extract only boundary letters;
- extract middle letter or middle pair;
- anagram or multiset equivalence;
- native-script Hindi/Gurmukhi structural transformations.

## 7. Cross-chapter boundaries

### ANA-CP-006

Owns all language-neutral A-Z cluster transformations, including reversal, first/last exchange, rotations, positional shifts, named deletion/insertion, block rearrangement, sorting and whitelisted two-stage compositions.

### Coding-Decoding

Owns tasks whose primary challenge is recovering or applying an unknown code system rather than recognizing an analogy relation.

### Semantic analogy checkpoints

Own conceptual relations between words. CP-007 does not infer meaning-based relationships.

### Native-script language processing

Excluded until grapheme/akshara segmentation, script-specific class rules and source evidence are separately designed.

## 8. Provisional presentation tasks

For every admitted native authority, evaluate:

- direct completion;
- equivalent-pair selection.

Do not automatically add inverse, incorrect-pair or rule-description tasks. They belong only if they create a materially different inference contract and do not belong to the later advanced/meta checkpoint.

## 9. Explanation standard

Every runtime explanation must:

1. state the rule in ordinary student language;
2. identify the relevant vowels, consonants, positions, lengths or repeated-letter groups;
3. prove the rule using the source word;
4. apply it to the target word;
5. state the answer;
6. reject the nearest displayed misconception.

Prohibited wording includes internal IDs, `vector`, `context`, `registered family`, `rule parameter` and similarly implementation-oriented language.

## 10. Freeze gate

CP-007 may be frozen only after:

- every inherited family is classified as native, delegated or excluded;
- all length profiles are source-backed and bounded;
- alternate-letter contexts are source-backed;
- coding-decoding overlap is audited;
- multilingual token/script policy is frozen;
- no material word-structure analogy mode remains uncovered;
- collision tests show that the retained authorities are operationally distinct.

## Current verdict

```text
Inherited family count: not authoritative
Native retained authorities: 6 provisional + 1 confirmed new authority
Delegated generic authorities: 4
QL count: open
Solve-mode count: open
Implementation: not started
Next action: source saturation of alternate-letter, length and class-count/value patterns
```
