# ENG-004-CP002 — Standard Competitive Vocabulary — Source Audit V2

Status: `IMPLEMENTED_600__SENSE_FREQUENCY_RESOLVED__HUMAN_REVIEW_PENDING`

CP002 adds **600 unique headword-senses** beyond CP001, bringing ENG-004 to **1,100 unique headwords**.

## Composition
- 250 adjectives
- 150 verbs
- 170 nouns
- 30 adverbs
- 160 Easy / 260 Medium / 180 Hard
- 1245 stored synonym links
- 375 stored antonym links
- 217 entries with explicit antonym relations
- 349 context-capable polysemous entries
- 6 explicit editorial sense/relation overrides

## Sense-resolution correction
The initial draft resolver could prefer a rare part-of-speech or secondary sense merely because that synset contained more relations. V2 fixes this by using WordNet `index.sense` tag counts and sense numbers across all parts of speech.

Six high-value exam words use explicit editorial overrides where the desired competitive-exam sense is clear but raw same-synset relations are too thin: aberration, callous, candor, integrity, transparency and sanguine. Their WordNet source synset offsets are retained.

## Filler policy
The raw automatic shortlist was rejected. The final bank contains 395 explicit exam-list words plus 205 tightly filtered additions.

Automatic additions require:
- WordNet sense-frequency evidence;
- tag count between 1 and 20;
- at most four senses;
- approved general semantic domains;
- non-technical definitions;
- no CP001 overlap;
- at least one usable relation.

Number words, demonyms/language labels, domain-specific scientific terms and obvious mechanical/medical leakage are excluded.

## Validation
Must pass:
- exactly 600 CP002 entries;
- zero CP001 overlap;
- 1,100 combined unique words;
- exact 160/260/180 difficulty split;
- relation/distractor integrity;
- 15,000-question soak with all 600 entries;
- synonym and antonym generation at each difficulty;
- balanced answer positions;
- 60-question review export;
- API build.

Lifecycle remains review-only pending explicit human approval.
