# ENG-004-CP005 — Confusable & Near-Meaning Lexical Sets — Source Audit V1

Status: `IMPLEMENTED_550__HUMAN_REVIEW_PENDING__REVIEW_ONLY`

CP005 adds **550 new unique competitive-vocabulary headwords**, bringing ENG-004 to **2,100 unique headwords and 2,400 headword-senses**.

## Source boundary

**Princeton WordNet 3.0 remains the authoritative stored source** for:
- sense/gloss;
- example sentence;
- synonyms;
- antonyms;
- semantic-family pointers;
- source synset offset.

Two public vocabulary lists were used only as **candidate/selection signals**:
- a GRE/TOEFL-tagged headword list;
- a SAT-style headword list.

Their prose definitions/examples are **not copied into Examtree**. For SAT-listed words, listed relation words are used only as an internal sense-selection cross-check; stored lexical relations still come from WordNet.

## Quality hardening

CP005 rejects:
- any CP001–CP003 headword duplicate;
- basic/common utility words explicitly excluded from this checkpoint;
- technical/scientific/medical/domain-specific senses;
- multi-sense entries without a WordNet context example;
- ambiguous SAT-listed senses when the candidate sense has no relation-level cross-check;
- entries without an approved synonym or antonym relation.

For every selected word, direct WordNet synonym/antonym relations from **all other same-POS senses** are stored as blocked relations and cannot be used as distractors.

## Distractors

Distractors are drawn only from the approved CP005 bank and remain same-part-of-speech. Ranking favours:
- shared semantic-family / hypernym-neighbourhood;
- same WordNet lexical domain;
- gloss overlap;
- same difficulty;
- similar corpus frequency and form length.

Direct synonyms, direct antonyms and known other-sense relations are blocked.

## Validation gate

Must pass:
- exactly 550 unique CP005 headwords;
- zero overlap with CP001–CP003;
- exactly 2,100 combined unique headwords;
- exactly 2,400 combined headword-senses including CP004;
- exact 110/220/220 difficulty split;
- no multi-sense entry without context;
- relation/distractor integrity;
- 24,000-question soak exercising all 550 entries;
- synonym + antonym generation at every difficulty;
- balanced answer positions;
- 75-question review export;
- API build.

Lifecycle remains review-only pending explicit human approval.
