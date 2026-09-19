# ENG-004-CP003 — Advanced Competitive Vocabulary — Source Audit V1

Status: `IMPLEMENTED_450__HUMAN_REVIEW_PENDING__REVIEW_ONLY`

CP003 adds **450 unique advanced headword-senses** beyond CP001 and CP002, bringing ENG-004 to **1,550 unique headwords**.

## Composition
- 170 adjectives
- 80 verbs
- 170 nouns
- 30 adverbs
- 90 Easy / 180 Medium / 180 Hard
- 870 stored synonym links
- 158 stored antonym links
- 99 entries with explicit antonym relations
- 111 context-capable polysemous entries
- 3 explicit editorial sense overrides

## Selection hardening
The first automated pass was rejected after it surfaced legitimate dictionary senses that were not the standard competitive-exam sense. CP003 therefore uses a stricter resolver:
- no overlap with CP001/CP002;
- an explicit advanced-vocabulary allowlist is preferred;
- untagged multi-sense explicit words are rejected unless an editorial sense override exists;
- automatic additions require WordNet corpus sense evidence and no more than two senses in the selected part of speech;
- technical/scientific/demonym/object leakage is filtered;
- only general lexical domains are allowed;
- words whose intended exam meaning cannot be supported cleanly are omitted rather than forced.

Explicit overrides are recorded in each entry and remain auditable by WordNet synset offset.

## Validation
Must pass:
- exactly 450 CP003 entries;
- zero CP001/CP002 overlap;
- 1,550 combined unique ENG-004 headwords;
- exact 90/180/180 difficulty split;
- relation/distractor integrity;
- 18,000-question soak exercising all 450 entries;
- synonym and antonym mode at every difficulty;
- balanced answer positions;
- 60-question review export;
- API build.

Lifecycle remains review-only pending explicit human approval.
