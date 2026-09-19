# ENG-004-CP004 — Context-Sensitive Synonyms & Antonyms — Source Audit V1

Status: `IMPLEMENTED_300_ALTERNATE_SENSES__HUMAN_REVIEW_PENDING`

CP004 adds **300 alternate senses** for already-curated ENG-004 headwords. It raises chapter coverage from 1,550 to **1,850 headword-senses** while retaining 1,550 unique headwords.

Every CP004 item:
- uses a different WordNet synset from the word's CP001–CP003 entry;
- has a source context sentence;
- has at least one approved synonym or antonym relation;
- blocks all stored relations from the original sense from distractor use;
- uses contextual wording only, never a context-free direct question.

Stored additions:
- 751 synonym links
- 84 antonym links
- 54 senses with explicit antonym relations

The automatic-new-headword approach was rejected because it introduced dictionary noise. CP004 therefore deepens already-curated vocabulary instead.

Validation requires a 300-entry integrity pass, 18,000-question soak, all entries exercised, both relation modes at every difficulty, context on every question, and balanced answer positions.

Lifecycle remains review-only pending explicit approval.
