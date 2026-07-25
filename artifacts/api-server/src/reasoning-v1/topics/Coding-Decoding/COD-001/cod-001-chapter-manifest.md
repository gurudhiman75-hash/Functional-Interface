# COD-001 Audited Chapter Manifest

Status: **frozen design authority for QL identity and checkpoint allocation**.  
Implementation status: not started.

## 1. Chapter identity

| Field | Value |
|---|---|
| Student chapter | Coding–Decoding |
| Package ID | `COD-001` |
| Taxonomy | Reasoning → Verbal Reasoning → Coding–Decoding |
| Primary exams | SSC, Banking, Railways and Punjab state examinations |
| Total QLs | `260` |
| Continuous range | `COD-QL-001` to `COD-QL-260` |
| Checkpoints | `10` |
| Canonical rule families | `54` |
| Initial release language | English |
| Planned localized languages | Hindi and Punjabi |

QL IDs are permanent after merge. A checkpoint may not extend beyond its reserved range.

## 2. Scope decision

COD-001 covers encoding and decoding systems expressed through letters, words, digits, arbitrary tokens and symbols. It includes direct mappings, inferred transformations, rearrangements, artificial languages and conditional lookup systems.

It excludes operator interchange, inequalities, input-output, figure coding and coding wrappers whose underlying skill belongs to blood relations, direction sense, ranking or another chapter.

## 3. Checkpoint and QL allocation

| Checkpoint | QL range | Count | Scope | Canonical rule families |
|---|---:|---:|---|---:|
| `COD-CP-001` | 001–024 | 24 | Direct substitution mapping | 4 |
| `COD-CP-002` | 025–052 | 28 | Alphabet-rank and aggregate number coding | 9 |
| `COD-CP-003` | 053–080 | 28 | Uniform alphabet transformations | 2 |
| `COD-CP-004` | 081–112 | 32 | Position- and class-dependent transformations | 6 |
| `COD-CP-005` | 113–136 | 24 | Rearrangement and transposition | 6 |
| `COD-CP-006` | 137–168 | 32 | Composite multi-stage word coding | 6 |
| `COD-CP-007` | 169–192 | 24 | Digit, symbol and alphanumeric coding | 6 |
| `COD-CP-008` | 193–208 | 16 | Renaming and substitution coding | 4 |
| `COD-CP-009` | 209–240 | 32 | Sentence and artificial-language coding | 6 |
| `COD-CP-010` | 241–260 | 20 | Conditional table and mixed-symbol coding | 5 |

## 4. Exact QL block allocation

### COD-CP-001 — Direct substitution mapping

| QL block | Count | Rule family / task authority |
|---|---:|---|
| 001–006 | 6 | `DIRECT_LETTER_TO_LETTER_MAP` |
| 007–012 | 6 | `DIRECT_LETTER_TO_DIGIT_MAP` |
| 013–018 | 6 | `DIRECT_LETTER_TO_SYMBOL_MAP` |
| 019–024 | 6 | `DIRECT_PARTIAL_MAPPING_INFERENCE` |

Required task directions: encode target, decode target, recover missing code and apply mapping inferred from overlapping examples.

### COD-CP-002 — Alphabet-rank and aggregate number coding

| QL block | Count | Rule family / task authority |
|---|---:|---|
| 025–028 | 4 | `A1Z26_SEQUENCE_CODE` |
| 029–032 | 4 | `Z1A26_SEQUENCE_CODE` |
| 033–036 | 4 | `RANK_PLUS_CONSTANT_SEQUENCE` |
| 037–040 | 4 | `RANK_MINUS_CONSTANT_SEQUENCE` |
| 041–044 | 4 | `SUM_OF_FORWARD_RANKS` |
| 045–048 | 4 | `SUM_WITH_WORD_LENGTH_ADJUSTMENT` using separate plus/minus rule IDs |
| 049–052 | 4 | `POSITION_WEIGHTED_OR_PARITY_AGGREGATE` using separate weighted and odd-even rule IDs |

The checkpoint registry must expose nine named rules because plus and minus length adjustment, and weighted versus parity aggregation, are distinct ambiguity candidates.

### COD-CP-003 — Uniform alphabet transformations

| QL block | Count | Rule family / presentation authority |
|---|---:|---|
| 053–058 | 6 | `UNIFORM_CYCLIC_SHIFT`, forward encode variants |
| 059–064 | 6 | `UNIFORM_CYCLIC_SHIFT`, backward encode variants |
| 065–068 | 4 | `OPPOSITE_ALPHABET_MAP` |
| 069–072 | 4 | inverse/decode variants of the same canonical rules |
| 073–076 | 4 | shift inference from multiple examples |
| 077–080 | 4 | wrap-boundary and missing-code presentations |

Forward and backward movement are parameters of one canonical cyclic-shift rule, not duplicate fixed rules. The opposite map is the second canonical rule.

### COD-CP-004 — Position- and class-dependent transformations

| QL block | Count | Rule family |
|---|---:|---|
| 081–086 | 6 | `INCREMENTAL_FORWARD_SHIFT` |
| 087–092 | 6 | `INCREMENTAL_BACKWARD_SHIFT` |
| 093–098 | 6 | `ALTERNATING_SIGNED_SHIFT` |
| 099–104 | 6 | `ODD_EVEN_POSITION_SHIFT` |
| 105–108 | 4 | `VOWEL_CONSONANT_CLASS_SHIFT` |
| 109–112 | 4 | `ENDPOINT_INTERIOR_SHIFT` |

### COD-CP-005 — Rearrangement and transposition

| QL block | Count | Rule family |
|---|---:|---|
| 113–116 | 4 | `REVERSE_SEQUENCE` |
| 117–120 | 4 | `CYCLIC_POSITION_ROTATION` |
| 121–124 | 4 | `HALF_SWAP` |
| 125–128 | 4 | `ODD_THEN_EVEN_EXTRACTION` |
| 129–132 | 4 | `EVEN_THEN_ODD_EXTRACTION` |
| 133–136 | 4 | `OUTER_INNER_INTERLEAVING` |

### COD-CP-006 — Composite multi-stage word coding

| QL block | Count | Rule family |
|---|---:|---|
| 137–142 | 6 | `REVERSE_THEN_INDEXED_SHIFT` |
| 143–148 | 6 | `PAIR_SWAP_THEN_ALTERNATING_SHIFT` |
| 149–154 | 6 | `HALF_SWAP_THEN_ODD_EVEN_SHIFT` |
| 155–160 | 6 | `ROTATE_THEN_CLASS_SHIFT` |
| 161–164 | 4 | `OPPOSITE_MAP_WITH_POSITION_PERMUTATION` |
| 165–168 | 4 | `TRANSFORM_THEN_RANK_SEQUENCE` |

Equivalent stage orders must be normalized. A commuting pair may have one canonical rule only.

### COD-CP-007 — Digit, symbol and alphanumeric coding

| QL block | Count | Rule family |
|---|---:|---|
| 169–172 | 4 | `DIRECT_DIGIT_SUBSTITUTION` |
| 173–176 | 4 | `DIGIT_TO_SYMBOL_TABLE` |
| 177–180 | 4 | `MODULAR_DIGIT_SHIFT` |
| 181–184 | 4 | `DIGIT_POSITION_PERMUTATION` |
| 185–188 | 4 | `POSITION_WISE_DIGIT_TRANSFORM` |
| 189–192 | 4 | `ALPHANUMERIC_TOKEN_MAPPING` |

### COD-CP-008 — Renaming and substitution coding

| QL block | Count | Rule family |
|---|---:|---|
| 193–196 | 4 | `ONE_STEP_REFERENT_RENAMING` |
| 197–200 | 4 | `CYCLIC_REFERENT_RENAMING` |
| 201–204 | 4 | `ROLE_FUNCTION_UNDER_RENAMING` |
| 205–208 | 4 | `TWO_LAYER_RENAMING_QUERY` |

### COD-CP-009 — Sentence and artificial-language coding

| QL block | Count | Rule family |
|---|---:|---|
| 209–214 | 6 | `IDENTIFY_CODE_FOR_WORD` |
| 215–220 | 6 | `IDENTIFY_WORD_FOR_CODE` |
| 221–226 | 6 | `IDENTIFY_COMMON_PHRASE_CODE` |
| 227–230 | 4 | `POSSIBLE_CODE_UNDER_PARTIAL_INFORMATION` |
| 231–236 | 6 | `CONSTRUCT_CODE_FOR_NEW_PHRASE` |
| 237–240 | 4 | `MULTI_STATEMENT_EXCLUSION_DEDUCTION` |

### COD-CP-010 — Conditional table and mixed-symbol coding

| QL block | Count | Rule family |
|---|---:|---|
| 241–244 | 4 | `ENDPOINT_CONDITION_OVERRIDE` |
| 245–248 | 4 | `VOWEL_CONSONANT_CONDITION_OVERRIDE` |
| 249–252 | 4 | `REPEATED_CHARACTER_CONDITION_OVERRIDE` |
| 253–256 | 4 | `POSITION_CONDITION_OVERRIDE` |
| 257–260 | 4 | `ORDERED_MULTI_CONDITION_OVERRIDE` |

## 5. Difficulty allocation

The exact chapter target is aligned with the global 35% / 45% / 20% policy.

| Checkpoint | Easy | Medium | Hard | Total |
|---|---:|---:|---:|---:|
| CP-001 | 14 | 8 | 2 | 24 |
| CP-002 | 10 | 14 | 4 | 28 |
| CP-003 | 12 | 12 | 4 | 28 |
| CP-004 | 8 | 18 | 6 | 32 |
| CP-005 | 10 | 10 | 4 | 24 |
| CP-006 | 4 | 16 | 12 | 32 |
| CP-007 | 10 | 10 | 4 | 24 |
| CP-008 | 8 | 6 | 2 | 16 |
| CP-009 | 8 | 16 | 8 | 32 |
| CP-010 | 7 | 7 | 6 | 20 |
| **Chapter total** | **91** | **117** | **52** | **260** |

Difficulty is an instance property. The table is a coverage target, not permission to hard-code one permanent difficulty per QL.

## 6. Approved answer types

1. `LETTER_CLUSTER`
2. `DIGIT_SEQUENCE`
3. `SYMBOL_SEQUENCE`
4. `MIXED_CODE_SEQUENCE`
5. `NUMBER`
6. `WORD_OR_LABEL`
7. `SINGLE_CODE_TOKEN`
8. `CODE_TOKEN_SET`

Every rendered option must have the same answer type and comparable display shape.

## 7. Approved renderer IDs

1. `INLINE_CODE_PAIR`
2. `EXAMPLE_TARGET_BLOCK`
3. `MAPPING_TABLE`
4. `STATEMENT_CODE_GRID`
5. `CONDITION_TABLE`

The renderer may vary deterministically, but it may not change the underlying hidden code system or answer.

## 8. Locale modes

| Checkpoints | Locale mode | Policy |
|---|---|---|
| CP-001 to CP-007 | `TRANSLATABLE` | Latin letters, digits and symbols remain logic-neutral; instructions and explanations are localized. |
| CP-008 | `LANGUAGE_ADAPTED` | Referents, roles and functions use curated locale-specific datasets. |
| CP-009 | `LANGUAGE_ADAPTED` | Sentence datasets and grammar are authored separately for English, Hindi and Punjabi while preserving puzzle structure. |
| CP-010 | `TRANSLATABLE` | Mapping tables remain stable; condition text and explanation are localized. |

## 9. Chapter-wide non-negotiable contracts

- identical QL, locale, seed and runtime version produce identical output;
- exactly four unique options;
- exactly one correct answer;
- independent solver agreement;
- no equal-or-simpler eligible rule explains all displayed evidence;
- repeated source symbols obey the active mapping consistently;
- encode/decode rules are invertible whenever the question asks for a unique inverse;
- no identity or inactive stage in composite questions;
- no unresolved placeholders or internal rule IDs in student text;
- bounded word, digit, token and symbol lengths suitable for timed exams;
- explanation traces use the actual generated evidence;
- answer-position, difficulty, layout and query-direction coverage are audited;
- English editorial approval precedes localization freeze;
- Question Studio discovery remains disabled until checkpoint freeze criteria pass.

## 10. Manifest change policy

A proposed change to CP boundaries, QL ranges, rule-family count, exclusions or locale mode requires an explicit manifest amendment. Implementation convenience is not sufficient reason to reassign a QL ID.