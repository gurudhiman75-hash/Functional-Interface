# ENG-004 — Synonyms & Antonyms — Lexical Coverage Plan V1

Status: `EXPANSION_TARGET_ACHIEVED__CP001_CP005_HUMAN_REVIEW_PENDING`

## Decision

The original 36-headword ENG-004 CP001 bank is only an architecture pilot. It is too small for Examtree production-quality synonym/antonym generation and must not be treated as chapter-complete or human-approval-ready.

## Chapter-scale target

ENG-004 should reach at least:

- **2,000 exam-relevant headwords / headword-senses**
- **6,000+ curated synonym relations**
- **4,000+ curated antonym relations**
- multiple accepted relations per headword where linguistically defensible
- explicit sense separation where the same spelling has materially different meanings
- Easy / Medium / Hard coverage driven by exam familiarity and semantic closeness
- lexical coverage broad enough that large mock-test batches do not visibly recycle the same small word set

These are minimum content targets, not generation counts.

## Planned checkpoint split

### ENG-004-CP001 — Core high-frequency vocabulary
Target: 500 headword-senses.

Focus:
- common SSC / Banking / State-exam vocabulary
- direct synonyms
- direct antonyms
- high-confidence single-sense entries
- strong Easy / Medium base

### ENG-004-CP002 — Standard competitive-exam vocabulary
Target: 600 additional headword-senses.

Focus:
- medium-frequency exam vocabulary
- closer semantic distractors
- stronger Medium / Hard coverage

### ENG-004-CP003 — Advanced exam vocabulary
Target: 450 additional headword-senses.

Focus:
- difficult but defensible competitive-exam words
- avoid dictionary-obscure vocabulary with little exam value
- high-similarity distractor families

### ENG-004-CP004 — Context-sensitive synonym / antonym senses
Implemented: **300 additional alternate senses** of already-curated headwords.

Focus:
- explicit sense IDs
- sentence-supported questions
- other-sense relation blocking
- prevent a second defensible answer caused by polysemy

### ENG-004-CP005 — Confusable and near-meaning lexical sets
Implemented target: **550 additional unique headwords**.

Focus:
- competitive-exam headword allowlists
- near-synonyms and semantic-family distractors
- common confusions
- high-quality Hard distractors
- all-sense relation blocking

Expected implemented chapter total: **2,100 unique headwords / 2,400 curated headword-senses** before final editorial approval.

## Lexical record V2

The scalable record should support:

- headword
- sense ID
- part of speech
- concise meaning/gloss
- 2–5 accepted synonyms where available
- 1–4 accepted antonyms where available
- prohibited/ambiguous alternatives
- near-meaning distractors
- register
- frequency/exam-relevance tier
- difficulty
- example/context where sense disambiguation is needed
- source provenance
- review status

A word must not be forced to have an antonym merely to fill the schema.

## Source policy

The large lexical layer may use **Princeton WordNet 3.0** as a source/reference layer for sense structure, synonym sets and lexical relations, under its license, together with Examtree editorial curation.

WordNet data must not be passed straight through to questions. Examtree must maintain an exam-relevance allowlist, normalize spelling/forms, remove archaic/technical noise, resolve senses and separately curate distractors.

## Quality gates

A lexical entry cannot become generation-eligible unless:

1. the tested sense is explicit;
2. every accepted answer is genuinely defensible for that sense;
3. known alternative correct answers are either included as accepted relations or blocked from distractors;
4. distractors match part of speech;
5. the question has exactly one defensible displayed answer;
6. wording is normal competitive-exam English;
7. the explanation states the target meaning and relation simply;
8. duplicate and near-duplicate headwords are controlled;
9. Easy / Medium / Hard tagging is editorially reviewed;
10. source provenance is retained.

## Current CP001 state

The original 36-entry bank is retained only as historical architecture-pilot context.

CP001 V2 now contains **500 curated headword-senses**, so the CP001 minimum coverage target has been achieved. Its lifecycle is now:

`EXPANDED_500__HUMAN_REVIEW_PENDING__REVIEW_ONLY`

The chapter-wide 2,000+ headword-sense target remains active for CP002 onward.

## Final implemented totals

- **2,100 unique headwords**
- **2,400 headword-senses**
- **5,524 stored synonym links**
- **985 explicit stored antonym links**

Antonym relations are not forced where English has no clean lexical opposite. A broad indirect-antonym closure was tested and rejected because it introduced remote/context-dependent oppositions. Quality takes precedence over an arbitrary antonym-link quota.
