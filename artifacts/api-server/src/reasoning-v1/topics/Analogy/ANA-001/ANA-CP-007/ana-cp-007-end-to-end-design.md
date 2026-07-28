# ANA-CP-007 — Word-Structure Analogy
## End-to-End Design and Coverage-Saturation Draft

Status: **DESIGN IN PROGRESS — QL COUNT NOT YET FROZEN**

This checkpoint follows the CP-006 manifest amendment. The inherited range is currently
`ANA-QL-209..ANA-QL-228`, but the final range must not be frozen until the source and
collision audits below are complete.

---

## 1. Checkpoint purpose

ANA-CP-007 covers analogy questions in which the displayed items are meaningful words
and the relationship depends on the structure of those words.

It is not a second copy of the generic letter-cluster runtime.

The checkpoint may use:

- a curated safe-word library;
- alphabet positions;
- word boundaries;
- vowels and consonants;
- repeated-letter structure;
- word length;
- letter-selection rules;
- language-aware instructions and explanations.

It must not use:

- unrestricted arbitrary substitution tables;
- semantic word relations already owned by ANA-CP-001 or ANA-CP-002;
- generic cluster permutations already owned completely by ANA-CP-006;
- coding-decoding questions whose primary task is recovering an unknown code table;
- figure analogy.

---

## 2. Inherited audited baseline

The audited ANA manifest currently assigns ten families, each with direct-completion and
pair-selection presentations.

| Baseline family | Direct / pair forms | Current assessment |
|---|---:|---|
| Transform first letter | 2 | valid but overlaps CP-006 positional transformation |
| Transform last letter | 2 | valid but overlaps CP-006 positional transformation |
| Exchange first and last | 2 | valid but overlaps CP-006 first/last exchange |
| Reverse word | 2 | valid but overlaps CP-006 full reversal |
| Remove vowels | 2 | genuinely word-class dependent |
| Remove consonants | 2 | genuinely word-class dependent |
| Select alternate letters | 2 | structural filtering; ownership boundary required |
| Alphabet-position sum | 2 | genuinely word-to-number |
| Transform by word length | 2 | genuinely word-to-number, but operation must be explicit |
| Preserve duplicate-letter pattern | 2 | genuinely word-frequency dependent |

The baseline count is 20 QLs. This count is not frozen merely because it appears in the
old manifest.

---

## 3. Confirmed source-backed gap

A recurring exam pattern changes vowels and consonants differently.

Representative form:

`JANUARY : IBMVBQX`

The demonstrated relationship moves vowels one way and consonants another way. This is
not represented by merely removing vowels or consonants.

Required candidate family:

```text
WORD_VOWEL_CONSONANT_DIFFERENTIAL_TRANSFORM
```

Allowed bounded profiles may include:

- vowels forward by `k`, consonants backward by `m`;
- vowels backward by `k`, consonants forward by `m`;
- vowels unchanged, consonants shifted;
- consonants unchanged, vowels shifted.

Every profile must keep one fixed rule across the full analogy and must be checked against
all simpler eligible rules.

This family is confirmed as a meaningful coverage gap. Whether its profiles require one
family or multiple families will be decided by collision and explanation audits rather
than by a predetermined QL count.

---

## 4. Candidate families requiring further source evidence

These patterns are plausible and machine-solvable, but they should not receive permanent
QL IDs until recurring exam evidence is confirmed.

| Candidate | Possible rule | Main risk |
|---|---|---|
| Vowels first, consonants second | `WORD_CLASS_REGROUP` | may be uncommon or collapse into arbitrary jumbling |
| Count vowels and consonants | `WORD_CLASS_COUNT` | may belong to coding-decoding or alphabet test |
| Vowel-position sum / consonant-position sum | `WORD_CLASS_VALUE` | may be too coding-oriented |
| Extract first and last letters | `WORD_BOUNDARY_EXTRACT` | simple cluster extraction may belong to CP-006 |
| Extract middle letter(s) | `WORD_MIDDLE_EXTRACT` | parity and language segmentation issues |
| Preserve complete letter multiset | `WORD_ANAGRAM_PATTERN` | semantic/anagram ambiguity |
| Sort letters alphabetically | `WORD_ALPHABETICAL_SORT` | already fully owned by CP-006 |
| Delete a named boundary/middle letter | `WORD_NAMED_DELETE` | generic deletion already owned by CP-006 |
| Insert a derived letter | `WORD_DERIVED_INSERT` | generic insertion already owned by CP-006 |
| Reverse then shift | delegated CP-006 composition | duplicate solver ownership |
| Adjacent exchange then shift | delegated CP-006 composition | duplicate solver ownership |

A candidate becomes a permanent family only when:

1. at least two independent exam/source examples establish recurrence;
2. the operation has one explainable general rule;
3. it does not duplicate an existing CP-006 family;
4. it yields enough valid, unambiguous runtime instances;
5. its distractors represent real student errors.

---

## 5. Ownership boundary with ANA-CP-006

ANA-CP-006 already owns language-neutral transformations over arbitrary A–Z clusters:

- reversal;
- first/last exchange;
- adjacent-pair exchange;
- rotations;
- positional shifts;
- insertion and deletion;
- sorting;
- block transformations;
- bounded two-stage compositions.

ANA-CP-007 should create a separate rule only when meaningful-word structure is necessary
to define or validate the relation.

Examples of genuinely CP-007-owned information:

- whether a letter is a vowel or consonant;
- the number of letters in a word;
- the sum of alphabet positions in a word;
- the repeated-letter frequency pattern;
- a curated word constraint needed to make the stem exam-natural.

When a meaningful word is merely an input to a generic CP-006 transformation, CP-007
should reuse or delegate to the CP-006 rule rather than maintain a second solver.

---

## 6. Presentation modes

Every frozen rule family should be audited for all materially different tasks.

Baseline presentation candidates:

### Direct completion

```text
SOURCE : TRANSFORMED_SOURCE :: TARGET : ?
```

### Pair selection

```text
Choose the pair that follows the same word-structure rule.
```

Additional tasks must not be added automatically. They should be introduced only if they
change the requested inference, such as:

- identify the incorrect transformed pair;
- recover the original word from its transformed form;
- select the rule description.

These may belong to ANA-CP-009 advanced/meta analogy rather than CP-007.

---

## 7. Locale and script policy

The old manifest labels these QLs `LANGUAGE_SPECIFIC`. That requires an explicit runtime
decision.

### Recommended first runtime

Use curated English words as the structural tokens in all three interfaces:

- English interface: English instructions and explanations;
- Hindi interface: Hindi instructions and explanations, Latin word tokens preserved;
- Punjabi interface: Punjabi instructions and explanations, Latin word tokens preserved.

This matches the common treatment of English-alphabet reasoning questions in multilingual
exam papers and avoids invalid manipulation of Devanagari or Gurmukhi combining marks.

### Native-script word rules

Native Hindi and Punjabi word transformation must not be implemented by indexing Unicode
code points.

It would require:

- grapheme/akshara segmentation;
- independent-vowel and vowel-sign policy;
- conjunct handling;
- script-specific vowel/consonant classification;
- separate curated datasets;
- separate source evidence showing that the exam actually asks the pattern in native
  script.

Until those contracts exist, native-script structural transformations remain excluded.

---

## 8. Formal rule contracts

### First-letter transformation

- only the first letter changes;
- every remaining letter must remain identical and in the same position;
- allowed transformations must be explicitly parameterized;
- identity transformations are rejected;
- the source and target use the same parameter.

### Last-letter transformation

Same contract, applied only to the final letter.

### First/last exchange

- first and last letters exchange;
- middle letters remain unchanged;
- words shorter than three letters are rejected;
- palindromic or accidental-identity cases are rejected.

### Reverse word

- full order reversal;
- palindromes are rejected;
- no letter is added, removed or changed.

### Remove vowels

- vowel set is explicitly declared;
- output preserves the original consonant order;
- words producing empty or one-character outputs may be restricted by difficulty;
- Y treatment must be fixed and not inferred per word.

### Remove consonants

- output preserves vowel order;
- at least two retained vowels are preferred for nontrivial questions;
- Y policy is fixed.

### Alternate-letter selection

- odd-position or even-position selection is explicit;
- starting position cannot change between pairs;
- short or identity-like outputs are rejected.

### Alphabet-position sum

- A=1 through Z=26;
- every letter contributes exactly once unless a different named profile is explicitly
  registered;
- answer is numeric;
- arithmetic trace must show all letter values.

### Word-length transformation

The generic label is insufficient. The runtime must register a bounded profile such as:

- direct length;
- square of length;
- length plus/minus a fixed constant;
- twice the length;
- vowel count plus consonant count only when this is not trivially identical to length.

Arbitrary formulas are prohibited.

### Duplicate-letter pattern

The rule must use a canonical frequency signature.

Examples:

- `LEVEL` → pattern `1-2-3-2-1`;
- `LETTER` → pattern `1-2-3-3-2-4`.

Two words match only when their equality pattern is identical, not merely when both contain
a repeated letter.

### Vowel/consonant differential transformation

- vowel set fixed;
- vowel operation fixed;
- consonant operation fixed;
- operations remain identical across both pairs;
- cases collapsing into one uniform shift are rejected;
- wrap behavior is explicit.

---

## 9. Independent solver design

The independent solver must not call the generator rule's own `apply()` function.

It should independently:

1. segment and normalize the word;
2. classify each letter where required;
3. apply the registered rule context;
4. calculate the expected result;
5. compare complete source and target evidence;
6. report every matching rule/context.

For number-producing rules, the solver returns a numeric result. For string-producing
rules, it returns an uppercase cluster.

---

## 10. Ambiguity controls

Reject a generated analogy when:

- a simpler rule also solves both pairs;
- first-letter and last-letter transformations both appear valid because of accidental
  equality;
- removal and alternate selection produce the same outputs;
- a differential vowel/consonant transform collapses into one uniform shift;
- a length formula and alphabet-value formula accidentally give the same source and target
  answers under different rules;
- multiple registered word-length profiles fit the full evidence;
- a distractor forms a valid relation under any eligible frozen rule;
- a duplicate-pattern question has more than one correct option.

Complete two-pair evidence is mandatory. One source pair alone is not sufficient to prove
most word-structure rules.

---

## 11. Distractor contracts

Distractors must carry machine-readable error labels.

Examples:

- `WRONG_BOUNDARY_LETTER`;
- `SHIFT_APPLIED_TO_ALL_LETTERS`;
- `WRONG_SHIFT_DIRECTION`;
- `VOWEL_CONSONANT_OPERATIONS_REVERSED`;
- `REMOVED_VOWELS_INSTEAD_OF_CONSONANTS`;
- `STARTED_ALTERNATE_SELECTION_FROM_WRONG_POSITION`;
- `MISSED_REPEATED_LETTER`;
- `COUNTED_DISTINCT_LETTERS_ONLY`;
- `USED_A0_Z25_VALUES`;
- `USED_WORD_LENGTH_INSTEAD_OF_ALPHABET_SUM`;
- `REVERSED_ONLY_PART_OF_WORD`;
- `SEMANTIC_NEAR_WORD_WITH_WRONG_STRUCTURE`.

No random unrelated option should be used while a plausible structural misconception is
available.

---

## 12. Explanation contract

Every explanation must use the approved CP-006 editorial style:

1. state the rule in ordinary student language;
2. demonstrate the rule on the source word;
3. apply the same rule to the target word;
4. state the answer;
5. explain the nearest wrong option.

Prohibited student-facing wording includes:

- `vector`;
- `successive shifts`;
- `apply context`;
- `rule parameter`;
- `registered family`;
- internal rule IDs.

For alphabet-value questions, show each letter value and the complete sum.

For repeated-letter patterns, show the canonical number pattern explicitly.

For vowel/consonant rules, identify which letters are vowels and which are consonants
before applying the operation.

---

## 13. Difficulty model

Difficulty is generated at instance level.

### Easy

- one visible operation;
- short words;
- no alphabet wrapping;
- distant distractors.

### Medium

- longer words;
- close distractors;
- class-based filtering;
- one bounded numeric computation.

### Hard

- differential vowel/consonant operations;
- repeated-letter patterns;
- close rule collisions;
- pair selection with structurally plausible alternatives;
- multi-step arithmetic traces.

The runtime target remains approximately:

- Easy: 35%;
- Medium: 45%;
- Hard: 20%.

---

## 14. Audit plan

Before QL freeze:

- source-family inventory completed;
- CP-006 overlap audit completed;
- coding-decoding overlap audit completed;
- locale/script decision frozen;
- all candidate families classified as included, delegated or excluded;
- no meaningful uncovered exam pattern remains.

After implementation:

- exact continuous registry;
- deterministic generation;
- four unique options;
- one correct answer;
- independent solver parity;
- complete eligible-rule ambiguity audit;
- answer-position balance;
- English/Hindi/Punjabi interface parity;
- no prohibited technical wording;
- explanation minimum-detail checks;
- review exports for every QL.

---

## 15. Current freeze verdict

```text
Inherited 10-family baseline: NOT YET FROZEN
Confirmed additional source-backed family: VOWEL/CONSONANT DIFFERENTIAL TRANSFORM
QL count: OPEN
Solve-mode count: OPEN
CP-006 ownership boundary: REQUIRES FINAL AUDIT
Locale strategy: REQUIRES FREEZE
Implementation: NOT STARTED
```

The next action is a source-saturation pass, not immediate coding from the old 20-QL list.
