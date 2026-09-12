# Examtree Punjabi Content Engine (`punjabi-v1`)
## Master Architectural Blueprint & Technical Specification

**Document ID:** `PUN-BLUEPRINT-001`  
**Version:** `1.0.0-PROPOSAL`  
**Author:** Antigravity Engine Architecture Team  
**Runtime Track:** `punjabi-v1`  
**Primary Target Package:** `PUN-001` (*Punjabi Language & Grammar / ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਅਤੇ ਵਿਆਕਰਣ*)  
**Status:** `ACTIVE_BLUEPRINT`  
**Scope:** Strictly Local Implementation (Zero Remote Mutations)

---

## 1. System Vision & Foundational Tenets

The Examtree Punjabi Content Engine (`punjabi-v1`) is a native, deterministic question generation, validation, and review system designed to achieve full parity with `quant-v4` and `reasoning-v1`.

### 1.1 Non-Negotiable Axioms
1. **Native Linguistic Truth**: Punjabi is treated as an autonomous, primary language. It is **never** machine-translated from English/Hindi, nor is it created by filling English grammar frames with Gurmukhi tokens.
2. **Deterministic Reproducibility**: Every generated question, distractor set, correct answer, and explanation is completely reproducible via an immutable tuple: `(packageId, cpId, familyId, seed, generatorRevision)`.
3. **Structured Knowledge Separation**: Content generators do not hardcode grammar facts or vocabulary strings. Generators operate purely on structured, typed knowledge registries (Orthography, Lexicon, Grammar Rules, Idioms, Proverbs).
4. **Cognitive Distractor Engineering**: Distractors are never arbitrary, nonsensical words. They are engineered from genuine pedagogical traps: orthographic confusions (e.g. ਔਂਕੜ vs ਦੁਲੈਂਕੜ), phonetic mispairings, category collisions, or common colloquial interference.
5. **Native Pedagogical Explanations**: Explanations are generated in natural, elegant ਟਕਸਾਲੀ ਪੰਜਾਬੀ (Standard Majhi Literary Punjabi) citing formal grammatical axioms and explaining why distractors fail.
6. **Zero-Defect Unicode Contract**: Strict canonical Gurmukhi grapheme assembly. No orphan diacritics, illegal carrier-matra pairings, unnormalized nukta variants, or stray zero-width code points.
7. **Strict Question Studio Governance**: Every question batch must pass automated validation (uniqueness, single-truth, key distribution, length balance) before entering Question Studio for editorial sign-off.

---

## 2. Parity Comparison: `punjabi-v1` vs `quant-v4` & `reasoning-v1`

| Architectural Dimension | `quant-v4` | `reasoning-v1` | `punjabi-v1` |
| :--- | :--- | :--- | :--- |
| **Domain Truth Model** | Algebraic relations, geometric axioms | Propositional logic, DAGs, constraints | Gurmukhi phonotactics, Panjabi grammar rules, lexical senses |
| **Generation Engine** | Seed-based parameter space mutation | Seed-based scenario graph builder | Seed-based morphological & contextual transformer |
| **Option Synthesis** | Calculation trap options | Semantic fallacy & inverse options | Orthographic/category/inflectional misconception options |
| **Explanation Engine** | Step-by-step mathematical proof | Logical deduction chain | Rule derivation + distractor refutation in Punjabi |
| **Validation Layer** | Math sanity, range, division-by-zero | Graph acyclicity, single truth | Gurmukhi grapheme lint, single truth, sense balance |
| **Delivery Model** | Checkpoints (`CP001..CP020`) | Checkpoints (`CP-001..CP-017`) | Checkpoints (`PUN-001-CP001..CP014`) |
| **Review Platform** | Question Studio Review Runs | Question Studio Review Runs | Question Studio Review Runs (`PUN-001`) |

---

## 3. Unicode & Gurmukhi Orthography Contract

Gurmukhi (Unicode range `U+0A00`–`U+0A7F`) has strict phonotactic and typographic rules. The engine enforces the following technical contracts prior to any option assembly.

### 3.1 Normalization Invariant
All strings pass through `normalizeGurmukhi()`:
- **Unicode NFC Form**: Enforces precomposed characters.
- **Nukta Unification**: Decomposed sequences (e.g. `U+0A38` ਸ + `U+0A3C` ਼) are unconditionally unified into standard atomic characters (`U+0A5B` ਸ਼, `U+0A59` ਖ਼, `U+0A5A` ਗ਼, `U+0A5E` ਜ਼, `U+0A5C` ਫ਼, `U+0A33` ਲ਼).
- **Zero-Width Cleansing**: Non-printing characters (`U+200B` ZWSP, `U+FEFF` BOM) are stripped; `U+200C` (ZWNJ) and `U+200D` (ZWJ) are preserved only when required for pairin subjoined consonant rendering.
- **Diacritic Ordering**: Dependent vowel sign (Lagan) must strictly precede any auxiliary nasal mark (Lagakhar). For example, `ਮਾ + ਂ` (ਕੰਨਾ followed by ਬਿੰਦੀ), never `ਮ + ਂ + ਾ`.

### 3.2 Vowel Carrier Binding Invariants (ਸਵਰ ਵਾਹਕ ਨੇਮ)
Gurmukhi has three vowel carriers (ੳ, ਅ, ੲ). The engine rejects any question or distractor violating these authentic rules:
- **ੳ (U+0A73)**: Binds **only** with 3 Lagan:
  1. ਔਂਕੜ (ੁ) $\rightarrow$ ਉ
  2. ਦੁਲੈਂਕੜ (ੂ) $\rightarrow$ ਊ
  3. ਹੋੜਾ (open-top ਓ)
- **ਅ (U+0A05)**: Binds **only** with 4 Lagan:
  1. ਮੁਕਤਾ (inherent / no sign) $\rightarrow$ ਅ
  2. ਕੰਨਾ (ਾ) $\rightarrow$ ਆ
  3. ਦੁਲਾਵਾਂ (ੈ) $\rightarrow$ ਐ
  4. ਕਨੌੜਾ (ੌ) $\rightarrow$ ਔ
- **ੲ (U+0A72)**: Binds **only** with 3 Lagan:
  1. ਸਿਹਾਰੀ (ਿ) $\rightarrow$ ਇ
  2. ਬਿਹਾਰੀ (ੀ) $\rightarrow$ ਈ
  3. ਲਾਂ (ੇ) $\rightarrow$ ਏ

### 3.3 Lagakhar Distribution Rules (ਲਗਾਖਰ ਵੰਡ ਨੇਮ)
1. **ਬਿੰਦੀ (U+0A02)**: Pairs with long vowels (ਦੀਰਘ ਸਵਰ): ਕੰਨਾ (ਾ), ਬਿਹਾਰੀ (ੀ), ਲਾਂ (ੇ), ਦੁਲਾਵਾਂ (ੈ), ਹੋੜਾ (ੋ), ਕਨੌੜਾ (ੌ) [Total: 6 Lagan].
2. **ਟਿੱਪੀ (U+0A70)**: Pairs with short vowels (ਲਘੂ ਸਵਰ): ਮੁਕਤਾ, ਸਿਹਾਰੀ (ਿ), ਔਂਕੜ (ੁ), ਦੁਲੈਂਕੜ (ੂ) [Total: 4 Lagan].
3. **ਅੱਧਕ (U+0A71)**: Gemination mark (doubles consonant sound); attaches strictly before the geminated consonant and follows ਮੁਕਤਾ, ਸਿਹਾਰੀ, or ਔਂਕੜ (rarely ਕੰਨਾ in loanwords).

---

## 4. Architectural Layers

The engine is structured into 5 decoupled layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    Question Studio UI                      │
│     (Preview Runs, Editorial Review Books, Freeze Locks)    │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│           Question Studio Review Adapter Layer               │
│  - punjabi-question-studio-adapter.ts                       │
│  - package registry & payload serialization                 │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│             Package & Checkpoint Generators                 │
│  - PUN-001 Package (CP001 through CP014)                    │
│  - Question Families (F01, F02, F03...)                     │
│  - Option Shuffling, Key Balancing, Stem Templating         │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│                  Core Engine Utilities                      │
│  - deterministic-rng.ts (Mulberry32 + MurmurHash3)          │
│  - question-validator.ts (Single-truth, distractor lints)   │
│  - explanation-builder.ts (Natural Punjabi rule templates)   │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│            Canonical Knowledge Registries                   │
│  - Orthography Registry (Letters, Lagan, Lagakhar rules)    │
│  - Lexical Registry (Lemmas, Senses, POS, Spellings)        │
│  - Grammar Registry (Nouns, Gender, Number, Tense, Case)    │
│  - Idiom & Proverb Registries (Canonical forms & lessons)   │
│  - Unicode Normalizer & Grapheme Tokenizer                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. PUN-001: Comprehensive Checkpoint Taxonomy

`PUN-001 — Punjabi Language & Grammar (ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਅਤੇ ਵਿਆਕਰਣ)` spans 14 discrete checkpoints, covering the entire competitive examination syllabus for Punjab state exams (PSSSB, Punjab Police, PPSC).

```
PUN-001 (Punjabi Language & Grammar)
 ├── CP001: Gurmukhi Orthography & Script Mechanics (ਗੁਰਮੁਖੀ ਲਿਪੀ, ਵਰਣਮਾਲਾ, ਲਗਾਂ-ਲਗਾਖਰ)
 ├── CP002: Spelling Precision & Orthographic Diagnostics (ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ ਸ਼ਬਦ-ਜੋੜ)
 ├── CP003: Noun & Pronoun Grammar (ਨਾਂਵ ਅਤੇ ਪੜਨਾਂਵ ਪ੍ਰਣਾਲੀ)
 ├── CP004: Gender & Number Systems (ਲਿੰਗ ਅਤੇ ਵਚਨ ਬਦਲੋ)
 ├── CP005: Adjectives & Adverbs (ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ)
 ├── CP006: Verbs, Tenses & Aspects (ਕਿਰਿਆ, ਕਾਲ ਅਤੇ ਰੂਪਾਂਤਰਣ)
 ├── CP007: Case, Postpositions & Connectors (ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ, ਵਿਸਮਿਕ)
 ├── CP008: Morphology, Prefixes & Suffixes (ਅਗੇਤਰ, ਪਿਛੇਤਰ ਅਤੇ ਸ਼ਬਦ-ਰਚਨਾ)
 ├── CP009: Synonyms & Antonyms (ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ)
 ├── CP010: One-Word Substitution & Lexical Precision (ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ)
 ├── CP011: Idiomatic Mastery (ਮੁਹਾਵਰੇ - ਅਰਥ ਅਤੇ ਵਾਕ ਵਰਤੋਂ)
 ├── CP012: Proverbs & Pragmatics (ਅਖਾਣ / ਕਹਾਵਤਾਂ - ਅਰਥ ਅਤੇ ਢੁਕਵਾਂ ਪ੍ਰਸੰਗ)
 ├── CP013: Syntax & Sentence Diagnostics (ਵਾਕ-ਵਟਾਂਦਰਾ, ਵਾਕ-ਵੰਡ ਅਤੇ ਸ਼ੁੱਧੀ)
 └── CP014: Reading Comprehension & Translation (ਪਾਠ-ਬੋਧ ਅਤੇ ਨਿਯੰਤਰਿਤ ਅਨੁਵਾਦ)
```

---

## 6. Detailed Checkpoint & Question Family Contracts

### 6.1 CP001: Gurmukhi Orthography & Script Mechanics
*Focus:* Alphabet structure, classification of characters, vowel carriers, lagan, lagakhars, and dutt akkhars.
- **Family `CP001-F01` (Character Classification)**:
  - Identification of character class: ਮੁੱਖ ਵਰਗ, ਸਵਰ ਵਾਹਕ (ੳ, ਅ, ੲ), ਅਨੁਨਾਸਕ (ਙ, ਞ, ਣ, ਨ, ਮ), ਦੁੱਤ ਅੱਖਰ (ਹ, ਰ, ਵ), ਨਵੀਨ ਟੋਲੀ (ਸ਼, ਖ਼, ਗ਼, ਜ਼, ਫ਼, ਲ਼).
  - *Distractor Strategy:* Consonants from adjacent phonetic vargs or confusing nasal with non-nasal.
- **Family `CP001-F02` (Vowel Carrier & Lagan Pairing Rules)**:
  - Identify valid/invalid combinations for ੳ (3 ਲਗਾਂ), ਅ (4 ਲਗਾਂ), and ੲ (3 ਲਗਾਂ).
  - *Distractor Strategy:* Phonetically plausible but orthographically illegal pairings (e.g., attaching ਕੰਨਾ to ੳ).
- **Family `CP001-F03` (Lagakhar Distribution & Application)**:
  - Testing the exact mathematical mapping: ਬਿੰਦੀ (6 lagan) vs ਟਿੱਪੀ (4 lagan) vs ਅੱਧਕ (short vowels + consonant gemination).
  - *Distractor Strategy:* Misapplying Bindi to Mukta or Tippi to Kanna.

### 6.2 CP002: Spelling Precision (ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ)
*Focus:* Exam-proven orthographic distinctions.
- **Family `CP002-F01` (Single Word Orthographic Choice)**: Identify correct spelling from 4 subtle variations.
- **Family `CP002-F02` (Sentence-Level Error Spotting)**: Identify which word in a sentence is misspelled.
- *Distractor Strategy:* Common Punjabi spelling pitfalls:
  - ਸਿਹਾਰੀ vs ਬਿਹਾਰੀ in word-final syllables (e.g., ਕਵੀ vs ਕਵਿ).
  - ਔਂਕੜ vs ਦੁਲੈਂਕੜ in loanwords.
  - Ha-pairin sound representation (e.g., ਸ਼ਹਿਰ vs ਸ਼ੈਹਰ, ਪੜ੍ਹਨਾ vs ਪੜਨਾ).
  - Tippi vs Bindi substitution on ambiguous phonetic boundaries.

### 6.3 CP003: Nouns & Pronouns (ਨਾਂਵ ਅਤੇ ਪੜਨਾਂਵ)
*Focus:* Grammatical categorization, contextual extraction, semantic subtypes.
- **Family `CP003-F01` (Noun Subtype Classification)**:
  - ਖ਼ਾਸ ਨਾਂਵ, ਆਮ ਨਾਂਵ, ਇਕੱਠ-ਵਾਚਕ ਨਾਂਵ, ਵਸਤੂ-ਵਾਚਕ ਨਾਂਵ, ਭਾਵ-ਵਾਚਕ ਨਾਂਵ.
- **Family `CP003-F02` (Pronoun Subtype Classification)**:
  - ਪੁਰਖ-ਵਾਚਕ (ਉੱਤਮ, ਮੱਧਮ, ਅੰਨਯ), ਨਿੱਜ-ਵਾਚਕ, ਨਿਸ਼ਚੇ-ਵਾਚਕ, ਅਨਿਸ਼ਚੇ-ਵਾਚਕ, ਸੰਬੰਧ-ਵਾਚਕ, ਪ੍ਰਸ਼ਨ-ਵਾਚਕ.
- **Family `CP003-F03` (In-Sentence Functional Extraction)**: Underlined token identification.

### 6.4 CP004: Gender & Number (ਲਿੰਗ ਅਤੇ ਵਚਨ ਬਦਲੋ)
*Focus:* Inflectional morphology and subject-verb agreement.
- **Family `CP004-F01` (Gender Transformation)**:
  - Regular masculine $\rightarrow$ feminine (ਕੰਨਾ $\rightarrow$ ਬਿਹਾਰੀ: ਘੋੜਾ $\rightarrow$ ਘੋੜੀ).
  - Suffix additions: ਣੀ, ਆਣੀ, ਨੀ (ਉੱਠ $\rightarrow$ ਉੱਠਣੀ, ਸੇਠ $\rightarrow$ ਸੇਠਾਣੀ).
  - Suppletion / Distinct roots (ਮਰਦ $\rightarrow$ ਔਰਤ, ਬਾਪ $\rightarrow$ ਮਾਂ).
- **Family `CP004-F02` (Number Transformation)**:
  - Masculine ending in Kanna (ਮੁੰਡਾ $\rightarrow$ ਮੁੰਡੇ).
  - Feminine ending in Mukta/Bihari (ਕੁਰਸੀ $\rightarrow$ ਕੁਰਸੀਆਂ, ਕਿਤਾਬ $\rightarrow$ ਕਿਤਾਬਾਂ).
  - Collective / Invariable nouns (ਹਾਥੀ $\rightarrow$ ਹਾਥੀ).
- **Family `CP004-F03` (Sentence-Wide Inflectional Agreement)**: Whole sentence transformation from singular to plural or masculine to feminine.

### 6.5 CP005: Adjectives & Adverbs (ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ)
- **Family `CP005-F01` (Adjective Classification)**: ਗੁਣ-ਵਾਚਕ, ਸੰਖਿਆ-ਵਾਚਕ, ਮਿਣਤੀ-ਵਾਚਕ (ਪਰਿਮਾਣ), ਨਿਸ਼ਚੇ-ਵਾਚਕ, ਪੜਨਾਂਵੀ ਵਿਸ਼ੇਸ਼ਣ.
- **Family `CP005-F02` (Degrees of Adjectives)**: ਸਧਾਰਨ ਅਵਸਥਾ, ਅਧਿਕਤਰ ਅਵਸਥਾ, ਅਧਿਕਤਮ ਅਵਸਥਾ.
- **Family `CP005-F03` (Adverb Subtypes)**: ਕਾਲ-ਵਾਚਕ, ਅਸਥਾਨ-ਵਾਚਕ, ਢੰਗ-ਵਾਚਕ (ਪ੍ਰਕਾਰ), ਗਿਣਤੀ-ਵਾਚਕ, ਕਾਰਨ-ਵਾਚਕ, ਤਾਕੀਦ-ਵਾਚਕ, ਨਿਰਣੇ-ਵਾਚਕ.

### 6.6 CP006: Verbs, Tenses & Aspects (ਕਿਰਿਆ ਅਤੇ ਕਾਲ)
- **Family `CP006-F01` (Verb Classification)**: ਅਕਰਮਕ ਕਿਰਿਆ (Intransitive) vs ਸਕਰਮਕ ਕਿਰਿਆ (Transitive), ਮੁੱਖ ਕਿਰਿਆ vs ਸਹਾਇਕ ਕਿਰਿਆ vs ਸੰਚਾਲਕ ਕਿਰਿਆ.
- **Family `CP006-F02` (Tense Identification & Shift)**: ਵਰਤਮਾਨ ਕਾਲ, ਭੂਤਕਾਲ, ਭਵਿੱਖਤ ਕਾਲ and their sub-aspects (ਸਧਾਰਨ, ਚਾਲੂ, ਪੂਰਨ).

### 6.7 CP007: Case, Postpositions & Connectors (ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ, ਵਿਸਮਿਕ)
- **Family `CP007-F01` (Karak Identification)**: ਕਰਤਾ (ਕੰਮ ਕਰਨ ਵਾਲਾ), ਕਰਮ, ਕਰਨ (ਸਾਧਨ), ਸੰਪ੍ਰਦਾਨ, ਅਪਾਦਾਨ (ਵੱਖ ਹੋਣਾ), ਸੰਬੰਧ, ਅਧਿਕਰਨ (ਆਸਰਾ/ਸਥਾਨ), ਸੰਬੋਧਨ.
- **Family `CP007-F02` (Sambandhak Types)**: ਪੂਰਨ ਸੰਬੰਧਕ (ਦਾ, ਦੇ, ਦੀ, ਨੂੰ), ਅਪੂਰਨ ਸੰਬੰਧਕ (ਕੋਲ, ਦੂਰ, ਬਿਨਾਂ), ਮਿਸ਼ਰਤ / ਦੁਬਾਜਰੇ ਸੰਬੰਧਕ.
- **Family `CP007-F03` (Yojak & Vismik Types)**: ਸਮਾਨ ਯੋਜਕ vs ਅਧੀਨ ਯੋਜਕ; ਵਿਸਮਿਕ ਸ਼੍ਰੇਣੀਆਂ (ਪ੍ਰਸੰਸਾ, ਸ਼ੋਕ, ਹੈਰਾਨੀ, ਸਤਿਕਾਰ).

### 6.8 CP008: Morphology, Prefixes & Suffixes (ਅਗੇਤਰ, ਪਿਛੇਤਰ)
- **Family `CP008-F01` (Prefix Identification & Synthesis)**: ਬੇ-, ਨਿਰ-, ਦੁਰ-, ਉਪ-, ਸ-, ਅਣ-, ਕੁ-, ਸੁ-.
- **Family `CP008-F02` (Suffix Identification & Synthesis)**: -ਦਾਰ, -ਵਾਨ, -ਮੰਦ, -ਗਾਰ, -ਆਊ, -ਹਾਰ.
- **Family `CP008-F03` (Invalid / Spurious Formation Spotting)**: Finding which option does NOT contain a genuine prefix or suffix.

### 6.9 CP009: Synonyms & Antonyms (ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ)
- **Family `CP009-F01` (Direct Synonym Resolution)**.
- **Family `CP009-F02` (Direct Antonym Resolution)**.
- **Family `CP009-F03` (Contextual / In-Sentence Sense Selection)**.
- *Strict Rule:* Synonyms and antonyms are strictly keyed by exact semantic sense IDs in the lexical database to avoid false cross-sense pairings.

### 6.10 CP010: One-Word Substitutions (ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ)
- **Family `CP010-F01` (Description $\rightarrow$ Word)**: e.g. "ਜੋ ਰੱਬ ਨੂੰ ਨਾ ਮੰਨਦਾ ਹੋਵੇ" $\rightarrow$ "ਨਾਸਤਿਕ".
- **Family `CP010-F02` (Word $\rightarrow$ Description Definition)**.
- *Distractor Strategy:* Semantically neighbouring words (e.g., ਆਸਤਿਕ, ਅਲਪਗ, ਸਰਵਗਿਆਨੀ).

### 6.11 CP011: Idioms (ਮੁਹਾਵਰੇ)
- **Family `CP011-F01` (Idiom Meaning Identification)**: Canonical idiom given, choose standard meaning.
- **Family `CP011-F02` (Contextual Idiom Completion)**: Select the missing Punjabi word to complete the idiom correctly.
- **Family `CP011-F03` (Appropriate Situational Selection)**: Select the idiom that best fits a real-world scenario.

### 6.12 CP012: Proverbs (ਅਖਾਣ / ਕਹਾਵਤਾਂ)
- **Family `CP012-F01` (Proverb Moral / Lesson)**: Identify the underlying wisdom/implication.
- **Family `CP012-F02` (Proverb Completion)**: Supply the authentic second hemistich / phrase.
- **Family `CP012-F03` (Contextual Applicability)**.

### 6.13 CP013: Syntax & Sentence Diagnostics (ਵਾਕ-ਵਟਾਂਦਰਾ ਅਤੇ ਸ਼ੁੱਧੀ)
- **Family `CP013-F01` (Sentence Classification)**: ਸਧਾਰਨ ਵਾਕ, ਸੰਯੁਕਤ ਵਾਕ, ਮਿਸ਼ਰਤ ਵਾਕ.
- **Family `CP013-F02` (Sentence Transformation)**: Transforming Affirmative $\leftrightarrow$ Negative $\leftrightarrow$ Interrogative without altering fundamental meaning.
- **Family `CP013-F03` (Sentence Correction / Error Spotting)**: Subject-verb agreement errors, incorrect postposition usage, or faulty modifier placement.

### 6.14 CP014: Reading Comprehension & Translation (ਪਾਠ-ਬੋਧ ਅਤੇ ਅਨੁਵਾਦ)
- **Family `CP014-F01` (Passage Factual Retrieval)**.
- **Family `CP014-F02` (Inferential & Title Deduction)**.
- **Family `CP014-F03` (Controlled Official English $\leftrightarrow$ Punjabi Translation)**: Administrative and official exam terms (e.g., "Gazetted Officer" $\rightarrow$ "ਗਜ਼ਟਿਡ ਅਫ਼ਸਰ", "Quorum" $\rightarrow$ "ਕੋਰਮ / ਗਣਪੂਰਤੀ").

---

## 7. Distractor Philosophy & Quality Gating

In `punjabi-v1`, every distractor is tagged with a cognitive error code:

```typescript
export type DistractorTrapType =
  | "ORTHOGRAPHIC_SUBSTITUTION"   // Matra or Lagakhar substitution
  | "PHONETIC_CONFUSION"          // Similar-sounding Punjabi consonant/vowel
  | "CATEGORY_COLLISION"          // Related grammar class (e.g. Adjective chosen when Noun requested)
  | "INFLECTIONAL_OVEREXTENSION"  // Pluralized using wrong rule (e.g. using -ਆਂ where not applicable)
  | "COLLOQUIAL_INTERFERENCE"     // Spoken Punjabi slang vs standard literary Taksaali
  | "ANTONYM_POLAR_INVERSION"     // Providing the opposite when synonym was requested
  | "SEMANTIC_NEIGHBOR";          // Near-synonym lacking required contextual nuance
```

### 7.1 Quality Invariants Enforced by `question-validator.ts`
1. **Option Distinctness**: All 4 options must be non-empty, pairwise distinct after Unicode NFC normalization.
2. **Single Truth Guarantee**: Exactly one option matches `correctIndex`.
3. **Option Length Symmetry**: Max option length cannot exceed 2.2x min option length, eliminating "longest option is the answer" test-wiseness cues.
4. **Key Balancing**: Across any generated batch ($N \ge 40$), each option key (A, B, C, D) must fall within $25\% \pm 6\%$.
5. **No Negative Clues**: Explanations must strictly justify the right option and refute the specific misconception of the distractors.

---

## 8. Question Studio Integration Contract

`punjabi-v1` plugs directly into Examtree's existing Question Studio review ecosystem:

### 8.1 Registry Integration
Registered in `artifacts/api-server/src/punjabi-v1/question-studio/question-studio-adapter.ts` and exposed to the admin studio preview routes:

```typescript
export interface PunjabiQuestionStudioReviewRequest {
  packageId: "PUN-001";
  cpId: string;
  familyId?: string;
  difficulty?: PunjabiDifficulty;
  count?: number;
  seed?: number;
}
```

### 8.2 Review Payload
Exposes:
- `questionId`: Canonical deterministic identifier (e.g. `PUN-001-CP001-F01-S1024-EASY`).
- `stem`: Standard Gurmukhi question text.
- `options`: 4 clean, normalized Gurmukhi strings.
- `correctIndex`: 0..3.
- `explanation`: Detailed Punjabi pedagogical text.
- `metadata`: Checkpoint, family, difficulty, authority citation, seed.

### 8.3 Freeze Snapshot Policy
When a checkpoint achieves editorial approval:
1. A golden corpus (e.g., 60 to 120 questions) is locked into an immutable JSON snapshot: `artifacts/api-server/src/punjabi-v1/packages/PUN-001/checkpoints/CP001/snapshots/PUN-001-CP001-FREEZE-V1.json`.
2. Downstream mock tests, section tests, and practice drills bind strictly to the frozen corpus, preventing unexpected runtime drift.

---

## 9. Implementation Roadmap & Milestones

```
Phase 1: Foundations & Unicode Invariants
  ├── Unicode Normalizer (NFC, Nukta unification, Lagan-Lagakhar order)
  ├── Gurmukhi Grapheme Tokenizer & Vowel Carrier Validator
  ├── Deterministic PRNG Engine (Mulberry32 + MurmurHash3)
  ├── Grammar Terminology Registry (ਟਕਸਾਲੀ ਸ਼ਬਦਾਵਲੀ)
  └── Foundation Unit Test Suite

Phase 2: Checkpoint CP001 Pilot (Script & Orthography)
  ├── CP001 Authorities (Letters, Lagan, Lagakhar rules)
  ├── Family Generators (F01 Character Class, F02 Carrier Rules, F03 Lagakhar Rules)
  ├── CP001 Generator Engine & Question Validator
  ├── 60-Question Golden Review Batch (20 Easy, 20 Medium, 20 Hard)
  └── CP001 Vitest Test Suite (1000-seed zero-error verification)

Phase 3: Question Studio Integration
  ├── Punjabi Question Studio Adapter implementation
  ├── Registration in Review Package Registry
  └── Verification of preview & batch generation

Phase 4: Core Grammar Expansion (CP002 through CP007)
  ├── CP002 (ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ / Spelling)
  ├── CP003 (ਨਾਂਵ ਅਤੇ ਪੜਨਾਂਵ)
  ├── CP004 (ਲਿੰਗ ਅਤੇ ਵਚਨ)
  ├── CP005 (ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ)
  ├── CP006 (ਕਿਰਿਆ ਅਤੇ ਕਾਲ)
  └── CP007 (ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ, ਵਿਸਮਿਕ)

Phase 5: Morphology, Vocabulary & Pragmatics (CP008 through CP014)
  ├── CP008 (ਅਗੇਤਰ-ਪਿਛੇਤਰ)
  ├── CP009 (ਸਮਾਨਾਰਥਕ / ਵਿਰੋਧੀ)
  ├── CP010 (ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ)
  ├── CP011 (ਮੁਹਾਵਰੇ)
  ├── CP012 (ਅਖਾਣ)
  ├── CP013 (ਵਾਕ-ਸ਼ੁੱਧੀ)
  └── CP014 (ਪਾਠ-ਬੋਧ ਅਤੇ ਅਨੁਵਾਦ)
```

---

## 10. Local Development & Testing Instructions

All commands are run within `artifacts/api-server/` locally. **No git push or remote commands are permitted.**

```bash
# Run Punjabi Foundation Tests
node --loader tsx src/punjabi-v1/foundation/unicode/unicode-contracts.test.ts

# Run CP001 Pilot Generator Tests
node --loader tsx src/punjabi-v1/packages/PUN-001/checkpoints/CP001/CP001.test.ts

# Run Question Studio Adapter Tests
node --loader tsx src/punjabi-v1/question-studio/question-studio-adapter.test.ts
```

---

*Examtree Content Engine Architecture — End of Blueprint PUN-BLUEPRINT-001.*
