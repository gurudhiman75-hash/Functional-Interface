# ANA-001 Manifest Amendment — CP-007 Saturated Word-Structure Allocation

Status: **authoritative for ANA-CP-007 and all still-unimplemented ANA-001 QLs after ANA-QL-208**.

This amendment is based on the completed CP-007 source-saturation, ownership, collision, lexical-yield, CP-006 bridge and four-option pilot audits. It does not change any merged QL from `ANA-QL-001` through `ANA-QL-208`.

## 1. Why the previous 20-QL allocation is replaced

The CP-006 amendment reserved 20 QLs (`ANA-QL-209..228`) for a ten-family word-structure baseline. Four inherited families were later proven to be generic language-neutral cluster transformations already owned by ANA-CP-006:

- transform only the first letter;
- transform only the last letter;
- exchange the first and last letters;
- reverse the complete word.

Duplicating those families in CP-007 would create two solver authorities for the same operation and weaken chapter-wide ambiguity checking.

The source audit also established one genuinely word-native missing authority:

- transform vowels and consonants by different fixed alphabet movements.

A representative relation is `JANUARY → IBMVBQX`, where vowels move one place forward and consonants move one place backward.

The pilot additionally tested alphabet-position sequence output such as `LION → 12-9-15-14`. That output is a letter-to-number sequence code and is delegated to the later cross-domain/coding authority. CP-007 retains only the complete scalar alphabet-position sum in analogy presentation.

## 2. Frozen native authority inventory

ANA-CP-007 owns exactly seven word-native authorities:

1. remove vowels while preserving consonant order;
2. remove consonants while preserving vowel order;
3. select odd- or even-numbered source positions while preserving order;
4. calculate the complete `A=1` through `Z=26` alphabet-position sum;
5. apply the source-backed word-length-minus-one rule;
6. map a word to its canonical repeated-letter equality pattern;
7. apply different fixed alphabet shifts to vowels and consonants.

Each authority has two materially different presentation contracts:

- `DIRECT_COMPLETION`;
- `PAIR_SELECTION`.

Rule parameters such as odd/even selection or vowel/consonant shift amounts remain runtime contexts. They do not become separate QLs because they do not change the requested inference strategy.

## 3. Frozen CP-007 QL allocation

| QLs | Authority | Presentation |
|---|---|---|
| `ANA-QL-209/210` | `WORD_REMOVE_VOWELS` | direct completion / pair selection |
| `ANA-QL-211/212` | `WORD_REMOVE_CONSONANTS` | direct completion / pair selection |
| `ANA-QL-213/214` | `WORD_POSITION_EXTRACTION` | direct completion / pair selection |
| `ANA-QL-215/216` | `WORD_ALPHABET_POSITION_SUM` | direct completion / pair selection |
| `ANA-QL-217/218` | `WORD_LENGTH_MINUS_ONE` | direct completion / pair selection |
| `ANA-QL-219/220` | `WORD_EQUALITY_PATTERN` | direct completion / pair selection |
| `ANA-QL-221/222` | `WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT` | direct completion / pair selection |

Frozen CP-007 count: **14 QLs**.

Frozen CP-007 range: **`ANA-QL-209..ANA-QL-222`**.

## 4. Revised later checkpoint ranges

No CP-008 or CP-009 runtime or permanent QL has been implemented. Their ranges may therefore be shifted without reassigning merged IDs.

| Checkpoint | Previous amended range | Revised range | Count | Status |
|---|---:|---:|---:|---|
| ANA-CP-001 | `001..036` | unchanged | 36 | implemented |
| ANA-CP-002 | `037..060` | unchanged | 24 | implemented |
| ANA-CP-003 | `061..108` | unchanged | 48 | implemented |
| ANA-CP-004 | `109..140` | unchanged | 32 | implemented |
| ANA-CP-005 | `141..160` | unchanged | 20 | implemented |
| ANA-CP-006 | `161..208` | unchanged | 48 | implemented |
| ANA-CP-007 | `209..228` | **`209..222`** | **14** | frozen for implementation |
| ANA-CP-008 | `229..244` | **`223..238`** | 16 | unimplemented IDs shifted |
| ANA-CP-009 | `245..268` | **`239..262`** | 24 | unimplemented IDs shifted |

Revised ANA-001 chapter total: **262 QLs**.

## 5. Production context boundaries

### Position extraction

Admitted contexts:

- odd positions in forward order;
- even positions in forward order.

Reverse-order extraction is excluded until recurring source evidence establishes it as a separate exam pattern.

### Word length

The production rule is narrowly fixed to:

```text
result = number of letters − 1
```

Source examples include `REASON → 5` and `BELIEVED → 7`. Direct length, double length, square length, length-plus-constant and length-minus-two/three were useful pilot collision contexts but are not production authorities.

### Differential vowel/consonant shifts

The QL owns the class-aware solve strategy. Shift amounts are bounded runtime contexts.

A valid instance must:

- contain at least two vowels and two consonants in both source and target words;
- use materially different vowel and consonant movements;
- reject identity and equal-shift contexts;
- reject evidence also explained by an equal-or-simpler CP-006 rule;
- show wraparound calculations explicitly when a letter crosses A or Z.

### Alphabet-position sum

The arithmetic calculation belongs in a shared alphabet foundation. CP-007 owns only the analogy presentation contract. Individual per-letter position sequences remain excluded.

### Equality pattern

The complete first-occurrence pattern is authoritative. For example:

- `LEVEL → 1-2-3-2-1`;
- `LETTER → 1-2-3-3-2-4`.

Merely sharing a repeated-letter count is insufficient.

## 6. Locale policy

The structural tokens remain uppercase English words in all three interfaces.

- English interface: English instructions and explanations;
- Hindi interface: Hindi instructions and explanations with the English word tokens preserved;
- Punjabi interface: Punjabi instructions and explanations with the English word tokens preserved.

Native Devanagari or Gurmukhi word transformations are excluded until grapheme/akshara segmentation and script-specific class rules are separately designed and sourced.

## 7. Freeze criteria

ANA-CP-007 may be marked runtime-complete only after:

- all 14 QLs are registered continuously;
- deterministic generation passes for every QL and seed matrix;
- the independent solver agrees with every generated answer;
- complete native-rule and CP-006 collision checks pass;
- every question has four unique options and one correct answer;
- answer positions are balanced;
- Hindi and Punjabi preserve answer, option, rule, context and difficulty parity;
- explanations follow the approved student-facing multi-step standard;
- no production or Question Studio exposure is enabled before manual review.

## Governance

This amendment supersedes the CP-007 and later-range rows in `ANA-001-MANIFEST-AMENDMENT-CP006.md`. The CP-006 allocation itself remains unchanged.
