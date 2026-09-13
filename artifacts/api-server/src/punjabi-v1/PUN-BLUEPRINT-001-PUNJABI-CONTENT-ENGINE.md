# Examtree Punjabi Content Engine — Implementation Blueprint

**Document ID:** `PUN-BLUEPRINT-001`  
**Status:** `DRAFT_BLUEPRINT__IMPLEMENTATION_NOT_STARTED`  
**Project:** Examtree Content Engine  
**Track:** Punjabi  
**Runtime family:** `punjabi-v1`  
**Recommended first package:** `PUN-001 — Punjabi Language & Grammar`  
**Recommended first checkpoint:** `PUN-001-CP001 — Gurmukhi Orthography, Lagaan & Lagakhars`

---

# 1. Purpose

This document defines the implementation blueprint for a dedicated **Punjabi Content Engine** inside Examtree.

Punjabi must be treated as a first-class language subject. It is **not**:

- an English question bank translated into Punjabi;
- a Hindi grammar engine with Gurmukhi words substituted into it;
- a Static GK fact bank containing Punjab culture;
- an LLM-at-runtime question-writing workflow.

The central principle is:

> **Canonical Punjabi linguistic truth → controlled Punjabi-native realization or transformation → deterministic question → deterministic answer → question-specific Punjabi explanation → validation → human review**

The engine should generate exam-like Punjabi directly from structured Punjabi linguistic authorities.

---

# 2. Subject Boundary

The Punjabi engine owns **Punjabi language competency**.

It includes:

- Gurmukhi script and orthography;
- ਲਗਾਂ, ਲਗਾਖਰ and spelling;
- word classes and grammar;
- gender and number;
- verbs and tense;
- word formation;
- vocabulary relationships;
- idioms and proverbs;
- sentence usage and correction;
- comprehension;
- controlled English↔Punjabi translation where required by an exam profile.

It does **not** own:

- Punjab history;
- Sikh history;
- Punjab geography;
- fairs and festivals;
- folk dances;
- personalities;
- Punjab current affairs;
- general Static GK.

Those remain under the relevant Static GK / Current Affairs authorities. Exam assemblers may combine Punjabi Language and Punjab GK according to an exam blueprint without duplicating ownership.

Punjabi literature history is also outside `PUN-001` unless source audit proves that a target exam requires it. If needed, it should become a separate future package rather than being hidden inside grammar.

---

# 3. Primary Goals

The Punjabi engine must be able to:

1. Generate large volumes of native, exam-like Punjabi questions.
2. Keep every answer deterministic and auditable.
3. Preserve correct Gurmukhi Unicode representation.
4. Use native Punjabi grammar terminology consistently.
5. Avoid literal English/Hindi translation tone.
6. Produce question-specific explanations in simple Punjabi.
7. Support genuine Easy / Medium / Hard difficulty.
8. Reuse grammar, lexical and orthographic authorities across multiple question families.
9. Prevent dubious synonyms, antonyms, idioms or spellings from being invented at runtime.
10. Support deterministic replay by seed and metadata.
11. Support Question Studio review before any downstream release.
12. Scale to thousands of questions without obvious slot-filling repetition.
13. Keep language truth separate from exam-frequency evidence.
14. Fail closed when a word, rule, spelling or interpretation is disputed.

---

# 4. Non-Goals

The engine must not:

- ask an LLM to freely invent answer keys at runtime;
- machine-translate English questions and call them native Punjabi;
- reuse one sentence frame with simple noun replacement as fake diversity;
- use rare vocabulary alone to manufacture Hard questions;
- accept multiple defensible spellings unless the question explicitly tests accepted variants;
- mix Shahmukhi and Gurmukhi in the initial engine;
- silently normalize away a spelling distinction that is itself being tested;
- create idiom meanings from semantic similarity;
- create proverb explanations without a curated authority;
- create translation questions whose answer depends on stylistic preference rather than a controlled equivalence set;
- patch bad generated questions one by one when the defect belongs to the generator or registry.

---

# 5. Core Punjabi Engine Architecture

Recommended pipeline:

```text
Source Audit
    ↓
Canonical Punjabi Knowledge Layers
    ↓
Unicode / Gurmukhi Normalization Layer
    ↓
Question-Family Contract
    ↓
Controlled Selection / Mutation / Context Realization
    ↓
Question Assembly
    ↓
Distractor Generation
    ↓
Deterministic Answer
    ↓
Question-Specific Explanation
    ↓
Structural + Linguistic + Ambiguity Validation
    ↓
Question Studio Review
```

No runtime web result or model judgement is answer authority.

---

# 6. Shared Knowledge Layers

## 6.1 Gurmukhi Orthography Layer

Stores canonical script and spelling facts such as:

- base letters;
- vowel carriers;
- ਲਗਾਂ;
- ਲਗਾਖਰ;
- ਟਿੱਪੀ;
- ਬਿੰਦੀ;
- ਅੱਧਕ;
- pairin forms where relevant;
- accepted spelling forms;
- confusable spelling patterns;
- word-boundary rules;
- punctuation conventions relevant to exams;
- invalid transformations used for controlled distractors.

Every record must contain source/provenance and review status.

## 6.2 Grammar Knowledge Layer

Stores structured Punjabi grammar rules.

Example conceptual record:

```yaml
rule_id: PGR-NUM-001
category: number
name: singular_plural_nominal_pair
canonical_form:
  singular: "ਕੁੜੀ"
  plural: "ਕੁੜੀਆਂ"
constraints:
  register: standard_punjabi
  script: gurmukhi
allowed_question_families:
  - identify_plural
  - transform_number
  - sentence_usage
explanation:
  principle_pa: "ਇਸ ਸ਼ਬਦ ਦਾ ਬਹੁਵਚਨ ਰੂਪ ‘ਕੁੜੀਆਂ’ ਹੈ।"
```

The grammar layer should store:

- rule ID;
- grammatical category;
- rule statement;
- canonical examples;
- exceptions;
- allowed constructions;
- prohibited contexts;
- controlled transformations;
- difficulty metadata;
- explanation logic;
- source authority.

## 6.3 Lexical Knowledge Layer

Stores curated Punjabi lexical truth:

- lemma;
- normalized Gurmukhi form;
- part of speech;
- meaning/sense ID;
- synonym set by sense;
- antonym set by sense;
- one-word-expression mappings;
- common confusions;
- register;
- domain;
- difficulty;
- frequency / exam relevance evidence;
- accepted variants;
- source provenance.

Synonymy and antonymy must be **sense-aware**. Two words are not accepted as synonyms merely because they are broadly related.

## 6.4 Idiom Knowledge Layer

Each idiom record should contain:

- idiom ID;
- canonical idiom;
- accepted meaning;
- one or more natural usage examples;
- incompatible literal interpretation traps;
- near-meaning distractors;
- register;
- source authority;
- review state.

## 6.5 Proverb Knowledge Layer

Each proverb record should contain:

- proverb ID;
- canonical wording;
- accepted meaning / lesson;
- suitable situation tags;
- near-proverb confusions;
- source authority;
- review state.

Idioms and proverbs must remain separate semantic types.

## 6.6 Word-Formation Layer

Stores:

- roots;
- prefixes / ਅਗੇਤਰ;
- suffixes / ਪਿਛੇਤਰ;
- valid derived forms;
- semantic change;
- part-of-speech change where applicable;
- invalid combinations for distractors;
- source authority.

## 6.7 Sentence Pattern Library

A reusable native Punjabi sentence library should define:

- semantic domain;
- subject type;
- predicate type;
- tense/aspect;
- number;
- gender where grammatically relevant;
- object/complement type;
- allowed modifiers;
- allowed grammar rules;
- mutation-safe positions;
- naturalness notes;
- lexical compatibility tags.

Use ordinary exam-neutral domains such as:

- education;
- transport;
- public service;
- office work;
- agriculture;
- banking;
- household;
- health services;
- science;
- environment;
- sports;
- communication;
- technology;
- commerce;
- postal service.

Avoid unnecessary local city or village names unless a source-backed exam family genuinely requires them.

## 6.8 Passage Library

For comprehension:

- passage ID;
- topic;
- text;
- word count;
- readability/difficulty;
- factual propositions;
- inference propositions;
- vocabulary targets;
- title/theme targets;
- source/authoring authority;
- answer evidence spans.

Questions must be derived from passage evidence, not model judgement.

## 6.9 Translation Equivalence Layer

Translation should use controlled equivalence records rather than open-ended model scoring.

Each record may contain:

- source language;
- source sentence;
- canonical target translation;
- accepted alternate translations;
- required semantic units;
- prohibited meaning changes;
- grammar notes;
- register;
- source/reviewer authority.

Initial scored questions should use options or constrained answer forms. Free-text translation scoring is a later product decision.

---

# 7. Unicode and Gurmukhi Technical Contract

Punjabi requires explicit Unicode handling before content generation.

## 7.1 Canonical Storage

- Store text in Unicode NFC.
- Validate round-trip UTF-8 integrity.
- Reject invisible or unapproved zero-width characters unless a documented linguistic reason exists.
- Preserve code-point distinctions that are relevant to spelling.
- Do not compare learner-facing Punjabi using raw byte equality without normalization.

## 7.2 Grapheme-Aware Processing

Character operations must be grapheme-aware.

Do not assume one visible Punjabi unit equals one Unicode code point.

Required utilities:

- `normalizePunjabiText()`;
- `tokenizeGurmukhiGraphemes()`;
- `compareNormalizedPunjabi()`;
- `detectIllegalCombiningSequence()`;
- `detectMixedScript()`;
- `detectInvisibleCharacters()`.

## 7.3 Mixed Script Guard

A Punjabi question may contain an English term only when the family explicitly allows it, for example controlled translation or a source-required technical term.

Otherwise mixed-script content should fail validation.

## 7.4 Orthography Test Safety

When a question tests spelling, normalization must not accidentally turn the wrong option into the correct option. Validators should compare both:

- stored surface form;
- normalized linguistic form.

---

# 8. Recommended Rollout

## Phase A — Punjabi Foundation

1. shared Punjabi schemas;
2. Unicode/Gurmukhi utilities;
3. source/provenance contract;
4. lexical authority format;
5. grammar authority format;
6. deterministic seed/replay metadata;
7. shared validators;
8. review-only Question Studio package contract.

## Phase B — PUN-001 Core Language

Implement CP001 through CP014 one checkpoint at a time.

Do not start all CPs simultaneously.

## Phase C — Mixed Punjabi Language Sets

Only after single-CP authorities are stable, build mixed grammar/vocabulary selection.

## Phase D — Exam Profile Assembly

Map approved Punjabi authorities to PSSSB/PPSC/Punjab Police/other target exam profiles using separate frequency evidence.

No topic percentage should be invented from the content taxonomy itself.

---

# 9. PUN-001 — Punjabi Language & Grammar CP Taxonomy

The initial package is deliberately split into narrow checkpoints so generator defects can be reviewed before they spread.

## PUN-001-CP001 — Gurmukhi Orthography, Lagaan & Lagakhars

Scope:

- Gurmukhi letters relevant to competitive exams;
- vowel signs / ਲਗਾਂ;
- ਲਗਾਖਰ;
- ਟਿੱਪੀ / ਬਿੰਦੀ;
- ਅੱਧਕ;
- pairin letters where relevant;
- valid grapheme composition;
- basic orthographic identification.

Planned question families:

- `CP001-F01` — identify correct letter / sign category;
- `CP001-F02` — identify the ਲਗ used in a word;
- `CP001-F03` — identify the word containing a specified orthographic feature;
- `CP001-F04` — choose the correctly formed Gurmukhi spelling;
- `CP001-F05` — choose the incorrectly formed option;
- `CP001-F06` — match sign to sound/function;
- `CP001-F07` — controlled pair comparison;
- `CP001-F08` — contextual orthography in a short word/sentence.

Primary engine proof:

- Unicode normalization;
- grapheme tokenizer;
- deterministic orthographic distractors;
- visual/text integrity.

## PUN-001-CP002 — ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ / Spelling

Scope:

- common exam-relevant spellings;
- matra confusion;
- tippi/bindi confusion;
- addak confusion;
- consonant confusion;
- accepted vs non-standard spellings;
- spelling in context.

Planned question families:

- `CP002-F01` — select the correctly spelt word;
- `CP002-F02` — select the incorrectly spelt word;
- `CP002-F03` — correct a given misspelling;
- `CP002-F04` — choose correct spelling from near-confusable forms;
- `CP002-F05` — sentence-level spelling error;
- `CP002-F06` — pair/list correctness;
- `CP002-F07` — error type by orthographic rule;
- `CP002-F08` — no-error spelling set.

Wrong spellings must come from controlled mutation rules, not random character substitution.

## PUN-001-CP003 — ਨਾਂਵ ਅਤੇ ਪੜਨਾਂਵ

Scope:

- noun identification;
- noun types required by exam convention;
- pronoun identification;
- pronoun types;
- contextual use;
- antecedent/reference clarity where appropriate.

Planned question families:

- `CP003-F01` — identify noun;
- `CP003-F02` — identify noun type;
- `CP003-F03` — identify pronoun;
- `CP003-F04` — identify pronoun type;
- `CP003-F05` — replace noun with suitable pronoun;
- `CP003-F06` — choose correct contextual pronoun;
- `CP003-F07` — classify highlighted word;
- `CP003-F08` — sentence correction involving noun/pronoun use.

## PUN-001-CP004 — ਲਿੰਗ ਅਤੇ ਵਚਨ

Scope:

- masculine/feminine;
- gender pairs;
- singular/plural;
- regular and irregular forms;
- contextual agreement where safe and source-backed.

Planned question families:

- `CP004-F01` — change gender;
- `CP004-F02` — identify correct gender pair;
- `CP004-F03` — identify mismatched gender pair;
- `CP004-F04` — change singular to plural;
- `CP004-F05` — change plural to singular;
- `CP004-F06` — identify correct number pair;
- `CP004-F07` — contextual gender/number usage;
- `CP004-F08` — error correction;
- `CP004-F09` — statement-pair correctness.

## PUN-001-CP005 — ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ

Scope:

- adjective identification;
- adjective types required by exam convention;
- adverb identification;
- contextual function;
- adjective/adverb distinction.

Planned question families:

- `CP005-F01` — identify adjective;
- `CP005-F02` — identify adjective type;
- `CP005-F03` — identify adverb;
- `CP005-F04` — classify highlighted word;
- `CP005-F05` — choose suitable modifier;
- `CP005-F06` — distinguish adjective vs adverb usage;
- `CP005-F07` — sentence correction;
- `CP005-F08` — paired statement correctness.

## PUN-001-CP006 — ਕਿਰਿਆ ਅਤੇ ਕਾਲ

Scope:

- verb identification;
- verb classes required by source audit;
- tense/time expression;
- aspectual usage where exam-relevant;
- agreement patterns only where deterministic;
- sentence-level verb correctness.

Planned question families:

- `CP006-F01` — identify verb;
- `CP006-F02` — identify verb type;
- `CP006-F03` — identify tense;
- `CP006-F04` — transform tense;
- `CP006-F05` — choose correct verb form in context;
- `CP006-F06` — sentence correction;
- `CP006-F07` — statement pair;
- `CP006-F08` — no-error sentence;
- `CP006-F09` — contextual sequence/time relation.

## PUN-001-CP007 — ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ ਅਤੇ ਵਿਸਮਿਕ

Scope:

- case/postpositional relations under the adopted Punjabi grammar convention;
- connectors;
- conjunctions;
- interjections;
- functional identification in sentences.

Planned question families:

- `CP007-F01` — identify grammatical function;
- `CP007-F02` — select correct relation marker;
- `CP007-F03` — choose suitable connector;
- `CP007-F04` — identify conjunction;
- `CP007-F05` — identify interjection;
- `CP007-F06` — sentence completion;
- `CP007-F07` — sentence correction;
- `CP007-F08` — paired usage judgement.

## PUN-001-CP008 — ਅਗੇਤਰ, ਪਿਛੇਤਰ ਅਤੇ ਸ਼ਬਦ-ਰਚਨਾ

Scope:

- prefixes;
- suffixes;
- root identification;
- derived words;
- valid formation;
- semantic effect where relevant.

Planned question families:

- `CP008-F01` — identify prefix;
- `CP008-F02` — identify suffix;
- `CP008-F03` — form word using given prefix;
- `CP008-F04` — form word using given suffix;
- `CP008-F05` — identify root/base word;
- `CP008-F06` — choose correctly derived word;
- `CP008-F07` — identify invalid formation;
- `CP008-F08` — match formation to meaning.

## PUN-001-CP009 — ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ

Scope:

- synonym sets by sense;
- antonym pairs by sense;
- contextual synonymy;
- contextual antonymy;
- distractor quality.

Planned question families:

- `CP009-F01` — choose synonym;
- `CP009-F02` — choose antonym;
- `CP009-F03` — reverse lookup from synonym to headword;
- `CP009-F04` — reverse lookup from antonym to headword;
- `CP009-F05` — identify non-synonym in a set;
- `CP009-F06` — identify non-antonym pair;
- `CP009-F07` — contextual synonym;
- `CP009-F08` — contextual antonym;
- `CP009-F09` — statement-pair lexical relation.

No runtime thesaurus inference is answer authority.

## PUN-001-CP010 — ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ / Semantic Vocabulary

Scope:

- one-word substitutions;
- concise semantic expressions;
- controlled definition→word and word→definition relations;
- common lexical confusions.

Planned question families:

- `CP010-F01` — phrase/definition to one word;
- `CP010-F02` — word to correct meaning;
- `CP010-F03` — identify mismatched pair;
- `CP010-F04` — choose correct word in context;
- `CP010-F05` — reverse definition;
- `CP010-F06` — paired statement correctness;
- `CP010-F07` — near-meaning distractor discrimination.

## PUN-001-CP011 — ਮੁਹਾਵਰੇ

Scope:

- canonical idiom;
- accepted meaning;
- natural usage;
- contextual completion;
- misuse detection.

Planned question families:

- `CP011-F01` — idiom to meaning;
- `CP011-F02` — meaning to idiom;
- `CP011-F03` — correct sentence usage;
- `CP011-F04` — incorrect sentence usage;
- `CP011-F05` — contextual blank with idiom;
- `CP011-F06` — match idiom and meaning;
- `CP011-F07` — statement pair;
- `CP011-F08` — near-meaning idiom discrimination.

## PUN-001-CP012 — ਅਖਾਣ / ਕਹਾਵਤਾਂ

Scope:

- canonical proverb wording;
- accepted meaning/lesson;
- suitable situation;
- proverb completion where source-backed.

Planned question families:

- `CP012-F01` — proverb to meaning;
- `CP012-F02` — meaning/situation to proverb;
- `CP012-F03` — complete proverb;
- `CP012-F04` — identify incorrect completion;
- `CP012-F05` — choose proverb for situation;
- `CP012-F06` — match proverb and meaning;
- `CP012-F07` — paired statement correctness.

## PUN-001-CP013 — ਵਾਕ-ਸ਼ੁੱਧੀ ਅਤੇ ਭਾਸ਼ਾਈ ਪ੍ਰਯੋਗ

Scope:

- sentence correction;
- grammatical error identification;
- usage selection;
- mixed grammar only from already approved single-rule authorities;
- no-error questions.

Planned question families:

- `CP013-F01` — select correct sentence;
- `CP013-F02` — select incorrect sentence;
- `CP013-F03` — identify erroneous segment;
- `CP013-F04` — choose corrected replacement;
- `CP013-F05` — fill grammatical blank;
- `CP013-F06` — no-error sentence;
- `CP013-F07` — statement pair;
- `CP013-F08` — two-rule controlled mixed usage;
- `CP013-F09` — contextual correction.

CP013 may reuse only grammar authorities whose source CP is already frozen/review-approved. It must not become a back door for unreviewed grammar rules.

## PUN-001-CP014 — ਪਾਠ-ਬੋਧ ਅਤੇ ਨਿਯੰਤਰਿਤ ਅਨੁਵਾਦ

Scope:

- unseen passage comprehension;
- factual retrieval;
- inference;
- title/theme;
- vocabulary in context;
- controlled English→Punjabi translation;
- controlled Punjabi→English translation only if an exam profile requires it.

Planned question families:

- `CP014-F01` — direct passage fact;
- `CP014-F02` — inference from passage;
- `CP014-F03` — main idea/theme;
- `CP014-F04` — suitable title;
- `CP014-F05` — vocabulary meaning in context;
- `CP014-F06` — statement supported/not supported;
- `CP014-F07` — English sentence to correct Punjabi translation;
- `CP014-F08` — Punjabi sentence to correct English translation;
- `CP014-F09` — identify meaning-changing translation error.

Open-ended generative translation scoring is outside V1.

---

# 10. Planned QL Scale

The CP family inventory above defines **114 provisional family surfaces** before permanent Question Language allocation.

Permanent QL IDs should be allocated only after:

1. source ownership is clear;
2. the family has a deterministic contract;
3. generated review proves it is not a cosmetic duplicate of another family;
4. answer uniqueness is validated;
5. the user/editor approves the review checkpoint.

A family may map to one or more permanent QLs if real exam surfaces differ materially. Cosmetic direction wording alone must not create extra QLs.

Target after review is approximately **100–130 meaningful permanent QLs**, not a forced count.

---

# 11. Question-Family Contract

Every permanent Punjabi QL should declare:

```yaml
ql_id: PUN-001-QL-XXX
cp_id: PUN-001-CP00X
task_kind: ...
answer_type: single_choice
option_count_profile: exam_profile_owned
language: pa-Guru
source_authority: ...
knowledge_authorities:
  - ...
difficulty_model: structural
explanation_renderer: ...
lifecycle: REVIEW_ONLY
```

It should also declare:

- admissible source records;
- distractor strategy;
- ambiguity exclusions;
- canonical stem pool;
- allowed semantic domains;
- answer derivation method;
- explanation fields;
- validation rules;
- deterministic fingerprint fields.

---

# 12. Stem Quality Contract

Punjabi stems must be:

- short enough for the target exam;
- natural in Punjabi;
- grammatically correct unless the question intentionally displays an error;
- consistent in terminology;
- free of literal English syntax;
- free of unnecessary English words;
- clear about whether one or more options may be correct;
- consistent about “correct”, “incorrect”, “meaning”, “usage”, “pair” and “No error” instructions.

Direction variation should come from a small editorially approved pool.

Avoid machine-like repetition such as changing only the headword while every surrounding sentence stays identical.

---

# 13. Native Punjabi Editorial Contract

The canonical content must be authored/reviewed as Punjabi.

Preferred pipeline:

> native Punjabi linguistic record → native Punjabi question → native Punjabi explanation

Not:

> English question → Hindi translation → Punjabi translation

Explanations should use simple, standard Punjabi rather than unnecessarily academic terminology when a simpler standard term is available.

If a traditional grammar term has competing names, the adopted term must be recorded in a terminology registry and used consistently.

---

# 14. Terminology Registry

Create a shared `punjabiTerminologyRegistry` containing approved learner-facing terms for concepts such as:

- ਨਾਂਵ;
- ਪੜਨਾਂਵ;
- ਵਿਸ਼ੇਸ਼ਣ;
- ਕਿਰਿਆ;
- ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ;
- ਲਿੰਗ;
- ਵਚਨ;
- ਅਗੇਤਰ;
- ਪਿਛੇਤਰ;
- ਸਮਾਨਾਰਥਕ;
- ਵਿਰੋਧੀ;
- ਮੁਹਾਵਰਾ;
- ਅਖਾਣ / ਕਹਾਵਤ;
- ਲਗ;
- ਲਗਾਖਰ;
- ਸ਼ੁੱਧ / ਅਸ਼ੁੱਧ;
- ਵਾਕ-ਸ਼ੁੱਧੀ.

The registry should record aliases but expose one chosen surface per adopted exam convention.

---

# 15. Canonical Registries

Initial registries:

```text
punjabiOrthographyRegistry
punjabiSpellingRegistry
punjabiGrammarRuleRegistry
punjabiNounRegistry
punjabiPronounRegistry
punjabiGenderRegistry
punjabiNumberRegistry
punjabiModifierRegistry
punjabiVerbRegistry
punjabiWordFormationRegistry
punjabiSynonymRegistry
punjabiAntonymRegistry
punjabiOneWordRegistry
punjabiIdiomsRegistry
punjabiProverbsRegistry
punjabiTerminologyRegistry
punjabiSentencePatternRegistry
punjabiPassageRegistry
punjabiTranslationEquivalenceRegistry
```

Do not merge all lexical content into one untyped JSON bank.

---

# 16. Distractor Strategy

Distractors must be generated from known confusion classes.

Examples:

## Orthography

- one controlled matra substitution;
- tippi/bindi confusion only where plausible;
- addak omission/addition only where it creates an exam-like distractor;
- consonant confusion from a documented pair.

## Grammar

- opposite gender/number form;
- same-category but contextually wrong form;
- close grammatical class;
- common learner confusion.

## Vocabulary

- same semantic field but wrong relation;
- near-synonym for a different sense;
- antonym of a distractor rather than the headword;
- register-mismatched word where exam-relevant.

## Idioms/Proverbs

- literal reading;
- nearby meaning;
- thematically related but incorrect idiom/proverb;
- mismatched situation.

A distractor must never be an accepted alternate answer.

---

# 17. Difficulty Model

Difficulty must be structural and linguistic, not simply lexical rarity.

## Easy

Typical features:

- common word/rule;
- direct task;
- low-confusion options;
- short context;
- one-step decision.

## Medium

Typical features:

- plausible distractors;
- contextual use;
- less direct wording;
- morphology/grammar interaction;
- sense distinction;
- sentence-level evidence.

## Hard

Typical features:

- multiple plausible near-forms;
- subtle contextual distinction;
- two approved grammar features interacting;
- inference from a passage;
- idiom/proverb situation discrimination;
- spelling confusion with strong orthographic plausibility.

Hard must never mean:

- obscure word with no exam evidence;
- artificially long sentence;
- ambiguous answer;
- trick based on typography or broken rendering.

---

# 18. Explanation Contract

Explanations must be question-specific.

Preferred structure:

1. **ਸਹੀ ਉੱਤਰ**;
2. **ਨਿਯਮ / ਅਰਥ**;
3. **ਇਸ ਪ੍ਰਸ਼ਨ ਉੱਤੇ ਲਾਗੂ ਕਰਨਾ**;
4. **ਲੋੜ ਪਏ ਤਾਂ ਹੋਰ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ**;
5. corrected word/sentence or example where useful.

Example conceptual structure:

```yaml
explanation:
  answer_surface: "..."
  principle_pa: "..."
  application_pa: "..."
  correction_pa: "..."
  distractor_notes:
    - option: B
      reason_pa: "..."
```

Avoid generic filler such as:

- “ਇਹੀ ਸਹੀ ਉੱਤਰ ਹੈ।”
- “ਨਿਯਮ ਅਨੁਸਾਰ ਇਹ ਗਲਤ ਹੈ।”
- “ਬਾਕੀ ਵਿਕਲਪ ਗਲਤ ਹਨ।”

without explaining the actual linguistic reason.

---

# 19. Validation Pipeline

Every generated question must pass all relevant validators.

## 19.1 Structural Validator

Checks:

- required fields;
- non-empty stem/options;
- valid option count;
- answer maps to exactly one option unless family says otherwise;
- no duplicate visible options;
- metadata completeness.

## 19.2 Unicode Validator

Checks:

- NFC normalization;
- invalid combining sequence;
- invisible characters;
- mixed-script policy;
- Gurmukhi grapheme safety;
- normalization collision among options.

## 19.3 Knowledge Authority Validator

Checks:

- every answer derives from a registered authority;
- registry record is active for review generation;
- source/provenance exists;
- disputed records are excluded.

## 19.4 Distractor Validator

Checks:

- distractor is not accepted alternate answer;
- distractors remain in the intended category;
- mutation provenance exists;
- no duplicate normalized forms.

## 19.5 Grammar Validator

Checks:

- grammar question references approved rule;
- correction restores canonical form;
- no second unintended error;
- rule is valid in the generated context.

## 19.6 Semantic Validator

Checks:

- sentence remains meaningful;
- lexical item is compatible with context;
- idiom/proverb use fits situation;
- synonym/antonym relation matches intended sense.

## 19.7 Ambiguity Validator

Reject when:

- two options are defensible;
- accepted spelling variants collide;
- grammar references disagree;
- dialect/register variation makes the answer unstable;
- translation has multiple equally valid choices not represented in the equivalence authority.

## 19.8 Explanation Validator

Checks:

- answer named correctly;
- rule/meaning matches authority;
- correction matches canonical form;
- application references actual question surface;
- explanation does not contradict option set.

## 19.9 Naturalness / Editorial Validator

Flags:

- translated-sounding Punjabi;
- strange word order;
- excessive repetition;
- unnatural lexical combinations;
- over-academic wording;
- sentence frames that reveal the generator slots.

Human review remains mandatory before freeze.

---

# 20. Duplicate and Variety Control

Track duplication at:

- exact normalized question surface;
- exact answer/option tuple;
- same lexical set;
- same sentence pattern;
- same mutation;
- same semantic scene;
- same explanation wording;
- same QL contract.

Variety should come from:

- independent semantic scenes;
- different sentence structures;
- different lexical authorities;
- different contextual tasks;
- different distractor strategies;
- different approved QL families.

Do not count direction-stem paraphrases as semantic variety.

---

# 21. Source and Provenance Policy

Punjabi linguistic truth and exam-frequency evidence are separate concerns.

## Truth authority

Use reviewed, reputable Punjabi grammar/dictionary/orthography sources suitable for the target convention.

Every registry record should carry:

```yaml
source_id: ...
source_type: grammar_reference | dictionary | official_syllabus | official_paper | verified_pyq | editorial_authority
locator: ...
review_status: ...
```

## Exam-frequency evidence

Official papers and verified PYQ collections may inform:

- family importance;
- recurring stem formats;
- difficulty;
- option count;
- chapter frequency.

They must not silently rewrite linguistic truth.

No target exam weight is frozen until sufficient evidence exists.

---

# 22. Human Review Policy

For every CP:

1. build source/coverage matrix;
2. implement a small deterministic authority;
3. generate a representative review file;
4. review Easy / Medium / Hard separately;
5. review native Punjabi wording;
6. review answer uniqueness;
7. review explanations;
8. review option plausibility;
9. group defects by generator/registry cause;
10. fix systemically;
11. regenerate;
12. run saturation/duplicate audit;
13. record explicit editorial decision.

Do not freeze a CP because automated CI is green.

---

# 23. Lifecycle Contract

Initial lifecycle for the entire Punjabi engine:

```text
REVIEW_ONLY
```

Until separately approved:

- Question Bank writable: `false`;
- test eligible: `false`;
- mock eligible: `false`;
- public/student publishable: `false`;
- automatic publication: `false`.

A CP editorial approval freezes that CP's authored authority only. It does not automatically open downstream delivery gates.

---

# 24. Question Studio Integration

Punjabi should use the existing Question Studio lifecycle rather than a separate admin product.

Required filters:

- Subject: Punjabi;
- Package: PUN-001;
- CP;
- QL/family;
- difficulty;
- seed;
- source authority;
- review status.

Review payload should expose:

- question;
- options;
- answer;
- Punjabi explanation;
- CP/QL;
- rule/lexical authority IDs;
- seed;
- source provenance;
- deterministic fingerprint;
- lifecycle state.

Question Studio must not be the source of linguistic truth. It is the review/control surface.

---

# 25. Exam Profile Boundary

The Punjabi engine defines content capability.

Exam profile configuration separately defines:

- whether Punjabi is qualifying or scored;
- number of questions;
- option count;
- chapter weights;
- allowed difficulties;
- translation direction;
- inclusion/exclusion of comprehension;
- any literature component.

This prevents one recruitment notification from distorting the shared Punjabi taxonomy.

---

# 26. Recommended First Technical Checkpoint

Begin with:

> **PUN-001-CP001 — Gurmukhi Orthography, Lagaan & Lagakhars, Review-Ready V1**

CP001 should be deliberately deep enough to validate Punjabi-native infrastructure.

Minimum technical deliverables:

- Unicode normalizer;
- Gurmukhi grapheme tokenizer;
- mixed-script detector;
- invisible-character detector;
- orthography registry;
- controlled mutation registry;
- provisional CP001 family registry;
- deterministic generator;
- difficulty derivation;
- Punjabi explanation renderer;
- structural validator;
- normalization-collision validator;
- orthography validator;
- duplicate audit;
- deterministic replay test;
- generated review file;
- coverage report.

Suggested initial CP001 authority should cover enough examples to exercise:

- vowel signs;
- tippi/bindi;
- addak;
- selected lagakhar/pairin forms;
- correct/incorrect composition;
- contextual recognition.

Do not maximize content count in V1. First prove the representation and validators.

---

# 27. CP001 Review Batch Contract

The first generated review pack should contain approximately **60 questions**:

- 20 Easy;
- 20 Medium;
- 20 Hard.

It should represent all CP001 provisional families where feasible and must include:

- direct recognition;
- controlled spelling/orthography contrasts;
- contextual items;
- multiple confusion classes;
- no duplicate normalized answer sets.

The review file should include metadata beneath each item or in a companion table:

- family;
- authority ID;
- mutation ID if applicable;
- difficulty reason;
- seed;
- fingerprint.

---

# 28. CP001 Approval Gate

Do not begin CP002 implementation until CP001 passes:

- Unicode integrity;
- correct grapheme segmentation;
- orthographic correctness;
- native Punjabi stem quality;
- answer uniqueness;
- distractor plausibility;
- explanation clarity;
- Easy/Medium/Hard separation;
- duplicate control;
- deterministic replay;
- human editorial approval.

If CP001 exposes an architectural flaw, fix the shared foundation before continuing.

---

# 29. Implementation Folder Structure

Recommended initial structure:

```text
artifacts/api-server/src/punjabi-v1/
├── PUN-BLUEPRINT-001-PUNJABI-CONTENT-ENGINE.md
├── foundation/
│   ├── unicode/
│   ├── terminology/
│   ├── grammar/
│   ├── lexical/
│   ├── idioms/
│   ├── proverbs/
│   ├── sentence-patterns/
│   ├── passages/
│   ├── translation/
│   └── validation/
├── packages/
│   └── PUN-001/
│       ├── registry.ts
│       ├── CP001/
│       ├── CP002/
│       ├── ...
│       └── CP014/
├── question-studio/
└── tests/
```

The final exact structure may adapt to repository conventions discovered during implementation, but ownership boundaries above should remain.

---

# 30. Metadata Contract

Every generated question should be reproducible from metadata including at minimum:

```yaml
engine: punjabi-v1
package_id: PUN-001
cp_id: PUN-001-CP001
family_id: CP001-F01
ql_id: null
language: pa-Guru
difficulty: EASY
seed: ...
authority_ids:
  - ...
mutation_ids:
  - ...
source_ids:
  - ...
generator_revision: ...
fingerprint: ...
lifecycle: REVIEW_ONLY
```

Permanent `ql_id` remains null until allocated after editorial review.

---

# 31. Testing Strategy

Each CP should have:

- unit tests for authority records;
- deterministic generation tests;
- answer uniqueness tests;
- option normalization tests;
- Unicode tests;
- duplicate/fingerprint tests;
- explanation consistency tests;
- difficulty distribution tests;
- source/provenance completeness tests;
- large-sample stress tests after V1 review.

Cross-CP tests should verify:

- shared terminology consistency;
- no duplicate permanent QL ownership;
- no authority ID collisions;
- registry/schema conformance;
- Question Studio routing;
- lifecycle locks.

---

# 32. Release Philosophy

Punjabi quality cannot be inferred from English/Hindi parity.

Each Punjabi authority must be reviewed on its own merits.

The release path is:

```text
DESIGN
→ REVIEW_READY
→ HUMAN_REVIEW
→ APPROVED_AUTHORITY
→ QUESTION_STUDIO_REGISTERED
→ optional BANK_ONLY gate
→ optional TEST/MOCK gate
→ optional PUBLIC gate
```

No stage is implied by the previous one.

---

# 33. Definition of Success

The Punjabi engine is successful when a generated question:

1. reads like native competitive-exam Punjabi;
2. renders correctly in Gurmukhi;
3. derives from a registered linguistic authority;
4. has one defensible answer;
5. uses plausible but invalid distractors;
6. has difficulty caused by linguistic reasoning, not obscurity or ambiguity;
7. has a simple, question-specific Punjabi explanation;
8. can be reproduced exactly from seed and metadata;
9. can be audited back to its source authority;
10. can be reviewed in Question Studio;
11. scales without mechanical sentence repetition;
12. remains isolated from unrelated Punjab Static GK content.

---

# 34. Immediate Next Step

After this blueprint is accepted, create the **Punjabi V1 foundation + `PUN-001-CP001` Review-Ready V1** on a dedicated implementation branch.

The first implementation checkpoint should not attempt CP002 or later CPs.

It should prove:

- Unicode/Gurmukhi correctness;
- source-backed orthography authority;
- deterministic distractors;
- difficulty logic;
- native Punjabi explanations;
- validator quality;
- review-file quality.

Once CP001 passes human review, use its approved foundation to implement CP002 and then continue checkpoint-by-checkpoint through the taxonomy.

---

**End of Blueprint**
