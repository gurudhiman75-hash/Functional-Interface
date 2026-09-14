# Punjabi V1 Donor Engine — All-Checkpoint Extraction Audit

Date: 2026-09-12

## Scope

This audit reviews `feature/punjabi-v1-content-engine` as a **donor/R&D implementation** against the reviewed ChatGPT Punjabi direction. The donor branch is not approved for wholesale merge. The purpose of this document is to identify what can safely be extracted, what needs editorial/linguistic verification, and what must be rejected before integration.

## Repository topology finding

- Donor: `feature/punjabi-v1-content-engine`
- Current donor head inspected: `ea72103e655bd93221c0ed35e8eaf6031bd59576`
- Current `New-main` inspected: `40d317e7eb30bc1fc9bf40e3fd7a85b05dc7698c`
- `New-main` currently has no `artifacts/api-server/src/punjabi-v1` tree.
- The historical branch `feature/pun-001-cp001-v1` is not a safe canonical target: its current branch pointer resolves to an unrelated Geography commit.
- Therefore integration must be performed as a **fresh forward-port onto current `New-main`**, preserving only reviewed Punjabi assets. Do not merge the stale donor/history wholesale.

## Global verdict

The donor engine is strongest as a **large structured linguistic dataset plus deterministic-generation prototype**. It is substantially weaker as a finished exam-content engine. Its major reusable value is in authorities/corpora, deterministic RNG patterns, provenance concepts and topic coverage. Its major weaknesses are difficulty inflation, broad/coarse families, over-counted template diversity, shallow generic validation, fake fingerprints, some artificial stems, occasional English leakage, and unverified linguistic assertions.

### Global KEEP

- deterministic seeded generation concept;
- package/CP/family/seed/revision metadata;
- authority-ID lineage concept;
- NFC/Gurmukhi foundation concept, after model fixes;
- large structured authority tables;
- word/sentence/context corpora that survive linguistic review;
- direct, concise explanation style when it names the actual tested rule/word;
- broad CP taxonomy and several useful subtypes missing from a narrower implementation.

### Global MODIFY

- family boundaries: split broad families into semantic question families/subtypes useful to Question Studio analytics;
- difficulty: difficulty must be driven by cognitive operation/context ambiguity, not negative wording, formal prose or reversal;
- distractors: use same-category/contextual misconceptions, especially words/tokens from the sentence when appropriate;
- explanations: keep simple and learner-facing; no generic option-by-option analysis, shortcut/trap filler, or unnecessary English labels;
- Unicode model: distinguish base letters from contextual/subjoined/dutt use; normalization must not silently legitimize malformed generated content;
- diversity metrics: separately measure instruction/stem wording, semantic authority identity, reasoning pattern and answer/distractor topology;
- source truth: linguistic facts must come from one authority layer, not be duplicated inside generator code;
- tests: add semantic truth, linguistic correctness, difficulty, leakage, plausibility, duplicate, and explanation-alignment gates.

### Global REJECT

- `fingerprint: FINGERPRINT-...seed...` placeholders as content fingerprints;
- shared CP001 validator being treated as proof of linguistic/single-truth correctness;
- “Hard” created only by NOT/negative wording, reverse direction, rare vocabulary, or verbose academic stems;
- random unrelated distractor pools for medium/hard questions;
- generator-local copies of linguistic truth already represented by authorities;
- counting paraphrased instructions as meaningful question depth;
- any English leakage in ordinary Punjabi learner content unless the question itself is explicitly a translation/terminology task;
- wholesale merge of the donor branch.

---

# CP-by-CP extraction decisions

## CP001 — Gurmukhi Orthography, Lagaan & Lagakhars

### Extract
- orthographic authority records;
- lagaan/carrier data;
- lagakhar data;
- naveen-letter material;
- dutt/subjoined usage examples;
- word grapheme/orthographic breakdown records;
- deterministic replay/RNG concept;
- authority lineage fields.

### Modify before use
- split the broad five-family layout into narrower semantic families (alphabet order, varg, articulation, nasal letters, naveen letters, lag identification, carrier rules, lagakhar usage, dutt/subjoined usage, word decomposition, orthographic diagnostics, etc.);
- remodel dutt letters as contextual/subjoined usage rather than simply classifying base `ਹ/ਰ/ਵ` as a special character class;
- lower or separately profile articulation-place questions unless exam evidence supports high frequency;
- replace easy elimination distractors with same-category alternatives;
- replace hard negative questions such as “which is not anunasak/dutt” with applied analysis.

### Reject
- local `GURMUKHI_35`, `VARG_MAP`, `LAGA_TO_CARRIER` as duplicate truth stores;
- fake seed-only fingerprints;
- present validator as a linguistic gate.

**Decision:** DONOR — high-value authority layer, generator requires major rewrite.

## CP002 — Spelling Precision / ਸ਼ੁੱਧ-ਅਸ਼ੁੱਧ

### Extract
- spelling-item schema (`correct`, `incorrectVariations`, error category, Punjabi explanation);
- high-yield confusion taxonomy: sihari/bihari, aunkar/dulankar, pairin-ha/tone, tippi/bindi, addak, loanword phonetics, varg confusion, halant/pairin, tatsam/tadbhav;
- correctly reviewed incorrect-variation sets;
- contextual sentence and blank-fill source material that reads naturally.

### Modify before use
- every `correct` form and every generated “incorrect” form must be lexically verified; an invented distractor cannot be treated as an authority fact merely because it is plausible-looking;
- explanations must describe the exact orthographic feature without over-generalized rules;
- difficulty should move from isolated recognition → close spelling discrimination → contextual diagnosis, rather than simply changing wording;
- semantic diversity should be based on different spelling phenomena/words, not many phrasings of `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਸ਼ੁੱਧ ਸ਼ਬਦ ਚੁਣੋ`.

### Reject
- any fabricated/unnatural misspelling that makes the key obvious;
- rule statements that generalize from one word to all Punjabi spelling without authority support.

**Decision:** STRONG DONOR. One of the highest-value corpora, but requires word-by-word editorial verification.

## CP003 — Noun & Pronoun Grammar

### Extract
- large noun/pronoun example pools;
- noun/pronoun category metadata where it matches the approved Punjabi grammar authority;
- sentence examples for functional extraction;
- pronoun case/inflection tables;
- collective-noun examples that can be source-verified.

### Modify before use
- independently verify the seven-noun-class taxonomy (`KHAS/AAM/IKATH/VASTU/BHAV/DRAVMAN/MISHRAT`): the donor contains overlapping/near-overlapping material and should not create duplicate “different” categories merely to increase breadth;
- remove topical/local-name bias from example pools where it creates recognition shortcuts;
- distinguish direct definition questions from real contextual grammatical identification;
- collective noun questions must use standard exam-recognized pairings, not merely plausible group labels.

### Reject
- taxonomy depth that is academically arguable but not stable enough for a single-truth MCQ;
- category questions where two accepted grammar traditions could yield different labels.

**Decision:** EXTRACT EXAMPLES + INFLECTION DATA; taxonomy requires authority reconciliation.

## CP004 — Gender & Number Systems

### Extract
- regular gender transformation pairs;
- regular/irregular number transformations;
- rule tags for inflection;
- sentence-level agreement examples;
- oblique-case agreement material;
- useful misconception distractors tied to actual morphology.

### Modify before use
- verify every “gender pair” semantically. Some donor pairs are lexical male/female counterparts rather than simple grammatical-gender transformations; these should be labelled appropriately rather than forced into one rule system;
- irregular/suppletive pairs need human source review;
- sentence agreement must be checked for natural Punjabi and not generated by mechanical substitution alone;
- difficulty should rely on agreement chains/oblique context, not obscure words.

### Reject
- treating every male/female lexical counterpart as the same grammatical operation;
- mechanically generated inflection that yields unattested forms.

**Decision:** HIGH-VALUE morphology donor after pair-level review.

## CP005 — Adjectives & Adverbs

### Extract
- adjective/adverb category example pools;
- declinable/indeclinable agreement examples;
- sentence-level extraction contexts;
- quantitative/numeral/demonstrative/pronominal adjective material where exam terminology is verified.

### Modify before use
- reconcile category names with the exact grammar terminology used in target Punjab exams/textbooks;
- examples that are phrases rather than individual adjectives/adverbs need explicit context tags;
- verify whether degree-of-comparison framing is actually exam-standard Punjabi grammar rather than imported English-grammar structure;
- difficulty should be contextual classification/agreement, not simply more formal stems.

### Reject
- ambiguous category examples that can play more than one syntactic role without sentence context;
- English-derived classification assumptions lacking Punjabi authority.

**Decision:** EXTRACT corpus; taxonomy and degree system need review.

## CP006 — Verbs, Tenses & Aspects

### Extract
- `VerbSentenceItem` records with sentence, verb phrase, main verb, auxiliary, transitivity, tense and direct object;
- tense-shift pairs;
- transitivity-conversion pairs;
- compound-verb data;
- aspect sentence records;
- dhatu/root records;
- causative/preranarthak ladders;
- sentence-based distractor candidates where they come from the sentence itself.

### Modify before use
- split the current two mega-families into separate semantic families: transitivity, object identification, main/auxiliary verb, root/dhatu, causative degree, tense recognition, tense transformation, aspect, compound verb, etc.;
- remove English learner leakage such as `(Object)`;
- enforce the approved rule that sentence-identification distractors should preferably be meaningful tokens from the sentence; generic fallback pools should not dominate;
- remove academic/verbose hard stems; make the grammatical operation hard instead;
- review every transitivity/object judgement because Punjabi case/agreement can make simplistic “has object = transitive” explanations misleading.

### Reject
- present two-family analytics model;
- hard difficulty produced by phrases such as “deep grammatical analysis”;
- generic off-sentence fallback distractors when a valid contextual set can be constructed.

**Decision:** VERY HIGH-VALUE authority corpus; generator/editorial layer requires heavy rewrite.

## CP007 — Karak, Postpositions, Conjunctions & Interjections

### Extract
- karak records with marker, definition, sample sentence, target span and explanation;
- postposition inventories;
- conjunction inventories and clause examples;
- interjection examples;
- contextual marker blank-fill data.

### Modify before use
- keep karak name, marker and syntactic role separate: a marker such as `ਨੇ/ਨੂੰ/ਨਾਲ/ਤੋਂ/ਦਾ/ਵਿੱਚ` is not itself sufficient to prove one unique semantic role in every sentence;
- review all target spans for exact role in context;
- split postpositions, conjunctions and interjections into separate analytical families rather than one broad mixed bucket;
- sentence-level questions should dominate medium/hard difficulty.

### Reject
- marker-only inference where context could support another interpretation;
- broad family labels that prevent Question Studio from seeing which grammatical relation is weak.

**Decision:** STRONG structured donor, needs role-level linguistic validation.

## CP008 — Prefixes, Suffixes & Word Formation

### Extract
- prefix/suffix inventory;
- `validWords` examples;
- `spuriousWords` concept for pseudo-affix discrimination;
- meaning tags;
- root extraction pairs;
- genuine-vs-apparent affix question idea.

### Modify before use
- verify every `validWords` and `spuriousWords` entry. This is a high-risk authority because accidental string-prefix matching does not equal morphological derivation;
- normalize spelling before use;
- distinguish productive Punjabi affixes, inherited Sanskrit/Persian forms, lexicalized forms and mere orthographic sequences;
- use pseudo-affix discrimination mainly for medium/hard after source review.

### Reject
- string-prefix logic as morphological truth;
- suspect/misspelled examples used only because they fit an affix pattern.

**Decision:** HIGH UPSIDE, HIGH LINGUISTIC-REVIEW COST.

## CP009 — Synonyms & Antonyms

### Extract
- synonym/antonym headword sets;
- multiple accepted synonyms;
- explicit distractor lists;
- explanation text after simplification;
- contextual replacement material;
- near-synonym discrimination concept.

### Modify before use
- add sense/domain tags; synonymy must be sense-specific, not word-global;
- separate synonym distractors from antonyms so a direct synonym question is not made trivial by three obvious opposites;
- human-review literary/register variants (`ਗੁਰੂ/ਉਸਤਾਦ/ਮਾਸਟਰ`, etc.) for context and exam acceptability;
- near-synonym questions need real sentence context and should not be based on subjective nuance without a source-backed distinction.

### Reject
- direct synonym questions where all distractors are antonyms/unrelated words;
- cross-sense synonym claims.

**Decision:** HIGH-VALUE lexical donor after sense tagging and distractor rebuild.

## CP010 — One-Word Substitution

### Extract
- phrase → canonical word records;
- word → definition records;
- contextual sentence examples;
- stable semantic category tags;
- alternative accepted forms where source-backed.

### Modify before use
- source-verify every canonical phrase/word pair;
- avoid making mismatch/negative-pair identification a fake “hard” mode;
- distractors should be same semantic field and plausible for the definition;
- distinguish true one-word substitution from loose synonym/description matching.

### Reject
- arbitrary reverse-definition items whose definition is not canonical;
- negative pair questions with one obviously unrelated option.

**Decision:** STRONG donor lexicon, medium editorial risk.

## CP011 — Idioms / ਮੁਹਾਵਰੇ

### Extract
- idiom corpus;
- canonical figurative meanings;
- approved contextual-use sentences;
- scenario → idiom mappings;
- meaning → idiom reverse mappings.

### Modify before use
- verify idiom wording and accepted meaning against Punjabi authority;
- contextual usage should sound like real Punjabi, not a gloss wrapped in a sentence;
- literal interpretations can be retained as an occasional misconception distractor but should not define an entire hard family;
- difficulty should come from close idiomatic alternatives/context, not absurd literal translations.

### Reject
- “literal vs figurative” questions where literal distractors are comically obvious;
- variant idiom spellings treated as wrong when both are accepted.

**Decision:** VERY HIGH-VALUE corpus if source-verified.

## CP012 — Proverbs / ਅਖਾਣ / ਕਹਾਵਤਾਂ

### Extract
- proverb corpus;
- canonical completions;
- meaning/lesson records;
- scenario/application records;
- completion halves where the proverb has one stable accepted form.

### Modify before use
- track accepted variants explicitly;
- distinguish proverb/akhan/kahavat labels only where target exams care about the distinction;
- scenario questions require editorial review because multiple proverbs may fit the same scenario;
- hard questions should use close pragmatic alternatives, not obscure wording alone.

### Reject
- forced single-truth scenario questions when two proverbs reasonably apply;
- completion questions where regional variants create multiple correct endings.

**Decision:** VERY HIGH-VALUE corpus, but variant management is mandatory.

## CP013 — Syntax & Sentence Diagnostics

### Extract
- manually valid sentence classification examples;
- verified transformation pairs;
- subject–verb agreement error/correction pairs;
- postposition/case error pairs;
- word-order correction records;
- semantic-preservation transformation concept.

### Modify before use
- sentence transformation must be authority/example-driven, not free mechanical generation;
- classify “simple/compound/complex” only under a documented Punjabi grammar convention;
- every correction item needs proof that the corrected sentence is uniquely best and the original defect is real;
- difficulty should increase by interaction of agreement/case/clause structure, not formal wording.

### Reject
- open-ended machine rewrites treated as single truth;
- stylistic preference presented as grammatical error;
- transformations that subtly change meaning.

**Decision:** EXTRACT only curated sentence pairs and rules; generator logic needs strict review.

## CP014 — Reading Comprehension & Administrative Translation

### Extract
- source-verified Punjabi passage corpus;
- factual question/answer records tied to exact passage evidence;
- title/main-idea candidates after review;
- administrative terminology table where an official bilingual source can be attached;
- contextual departmental-use examples where stable and non-time-sensitive.

### Modify before use
- current “Hard” passage stems are often harder in wording (`ਡੂੰਘੇ ਭਾਵ-ਅਰਥ`, `ਆਲੋਚਨਾਤਮਕ ਮੁਲਾਂਕਣ`) rather than in inference depth; simplify instructions and make passage/question inference genuinely harder;
- administrative translation must preserve English only because translation is the tested task; ordinary Punjabi CPs remain English-free;
- source every “official/standard” translation claim; do not label a term “official” only because it appears in the donor data;
- comprehension distractors must be passage-grounded and semantically plausible.

### Reject
- fake seed fingerprints;
- generic shared validator as proof of passage inference correctness;
- unsupported claims such as “official state administrative dictionary” without an actual source lineage record.

**Decision:** USEFUL late-stage donor. Passage/terminology data only after source verification; generator stems require rewrite.

---

# Cross-CP extraction priority

## Priority A — import first

1. CP002 verified spelling records and confusion taxonomy.
2. CP004 verified gender/number/oblique inflection pairs.
3. CP006 verb sentence/root/causative/tense/aspect records.
4. CP008 verified affix/root records.
5. CP009 sense-tagged synonym/antonym sets.
6. CP010 verified one-word-substitution lexicon.
7. CP011 verified idiom corpus.
8. CP012 verified proverb corpus.

These deliver the largest corpus/depth gain without forcing adoption of the donor generator architecture.

## Priority B — import with taxonomy reconciliation

- CP001 orthographic authorities/foundation;
- CP003 noun/pronoun taxonomy and inflection data;
- CP005 adjective/adverb taxonomy;
- CP007 karak/connectors/postpositions/interjections;
- CP013 curated syntax pairs;
- CP014 passages and administrative terminology.

## Do not import as-is

- donor generator family layout;
- donor difficulty labels;
- donor generic validator;
- donor seed-based fingerprint strings;
- donor review diversity counts;
- donor Question Studio/lifecycle code from stale history;
- donor branch history itself.

# Integration contract for the canonical Punjabi engine

Any extracted donor record must pass all of the following before becoming learner-authority data:

1. **Canonical-source check** — source/grammar authority is attached or the record is placed in `REVIEW_PENDING`.
2. **Native-language check** — no accidental English leakage outside explicit translation tasks.
3. **Single-truth check** — exactly one accepted answer for the generated context; accepted variants are modelled explicitly.
4. **Naturalness check** — stem and sentence read like real Punjabi exam content.
5. **Distractor check** — alternatives are same-category/contextual misconceptions, not random fillers.
6. **Difficulty check** — difficulty comes from semantic/cognitive work, not wording length/negation.
7. **Explanation check** — concise, beginner-readable explanation of the actual rule/word/context; no generic shortcut/trap and no unnecessary option-by-option analysis.
8. **Semantic fingerprint** — stable hash of canonical semantic payload, not family+seed text.
9. **Question Studio observability** — semantic family/subtype is fine-grained enough for frequency/quality analytics.
10. **No lifecycle promotion by import** — extraction does not automatically enable Question Bank, test, mock or public delivery.

# Final recommendation

Use the reviewed ChatGPT Punjabi implementation as the canonical editorial/generator model and use `feature/punjabi-v1-content-engine` strictly as a **donor corpus and architecture source**. Forward-port reviewed assets onto a fresh branch based on current `New-main`; never merge the donor branch wholesale. The independent implementation is most valuable for breadth and structured data, while the reviewed implementation should continue to own stem naturalness, semantic family design, contextual distractors, difficulty, explanations and QA gates.
