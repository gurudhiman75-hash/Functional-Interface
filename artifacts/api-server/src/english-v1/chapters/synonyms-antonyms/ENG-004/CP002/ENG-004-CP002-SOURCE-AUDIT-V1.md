# ENG-004-CP002 — Standard Competitive Vocabulary — Source Audit V1

Status: `IMPLEMENTED_600__AUTOMATED_VALIDATION_PENDING__HUMAN_REVIEW_PENDING`

## Scope

CP002 adds **600 new headword-senses** on top of CP001's 500, for **1,100 unique ENG-004 headwords** across the first two checkpoints.

Composition:
- 250 adjectives
- 150 verbs
- 170 nouns
- 30 adverbs
- 160 Easy / 260 Medium / 180 Hard
- 1066 stored synonym links
- 423 stored antonym links
- 249 entries with explicit antonym relations
- 327 polysemous entries with source examples available

## Editorial selection

The automatic raw-frequency shortlist was rejected because it surfaced noisy/basic/polysemous items.

CP002 therefore uses a two-stage policy:
1. explicit competitive-exam vocabulary allowlist;
2. tightly filtered WordNet filler only where needed to reach the 600-entry checkpoint target.

Filler candidates require:
- attested WordNet corpus frequency;
- bounded sense count;
- general semantic lexicographer domains;
- non-technical definitions;
- at least one usable lexical relation;
- no CP001 overlap.

## Sense and relation model

Princeton WordNet 3.0 remains the source layer. Each entry retains the source synset offset and sense metadata.

Multiple accepted synonyms/antonyms are stored. Every accepted relation is blocked from distractor positions. Polysemous entries use a source example sentence where available.

## Validation

CP002 must pass:
- exactly 600 unique CP002 headwords;
- zero overlap with CP001;
- 1,100 combined unique headwords;
- exact 160/260/180 difficulty split;
- relation and distractor integrity for every entry;
- all eligible relation modes per entry;
- 15,000-question deterministic soak;
- all 600 entries exercised;
- synonym + antonym modes at all difficulties;
- answer-position balance;
- 60-question review export;
- API build.

## Lifecycle

Review-only. No Question Studio registration, Question Bank write, learner/test/mock/public delivery or production release before explicit approval.
