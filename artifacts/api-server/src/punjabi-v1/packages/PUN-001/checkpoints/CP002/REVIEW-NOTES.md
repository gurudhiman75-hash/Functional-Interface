# CP002 Forward-Port Review Notes

## Current checkpoint

- Lifecycle: `REVIEW_ONLY`
- Active corpus: **375 unique spelling authorities**
- Context corpus: **252 contextual authorities**
- Authority status: every record remains `REVIEW_PENDING`
- Active orthographic categories: **8**
- Semantic families: **7**
- Review pack target: **240 questions (80 Easy / 80 Medium / 80 Hard)**
- Computed semantic capacity: **9,731,687,658** content combinations, excluding option-order permutations

## Corpus composition

- 45 original manually contextualized donor authorities;
- 123 selectively curated donor-derived authorities retained from the breadth expansion;
- 207 new editorial authorities with natural Punjabi sentence context;
- total: 375 unique canonical spelling targets.

The 207-authority editorial wave is balanced across the eight active spelling categories rather than being used as raw vocabulary padding.

## Gates enforced

1. exactly 375 active authorities;
2. unique canonical correct forms across the full corpus;
3. unique forward-port authority IDs;
4. three distinct incorrect variants per authority;
5. no incorrect variant may equal any other active canonical form;
6. NFC-normalized canonical and incorrect forms;
7. exactly 252 contextual authorities, each with its canonical form present in the sentence;
8. all eight categories present with a minimum depth of 30 authorities each;
9. explicit provenance: `DONOR_CP002`, `DONOR_CP002_CURATED`, or `EDITORIAL_CURATED`;
10. no silent authority promotion: all records remain `REVIEW_PENDING`;
11. no `ਟਕਸਾਲੀ` / `ਪ੍ਰਮਾਣਿਤ` stem padding;
12. no option-by-option explanation filler;
13. semantic fingerprints include distractor content, not seed placeholders;
14. combinatorial pair/quartet traversal rather than fixed-pair offsets;
15. deterministic uniqueness proof across all seven families;
16. hard questions require multiple spelling decisions rather than NOT/reversal wording.

## Active category depth

- SIHARI_BIHARI: 50
- AUNKAR_DULANKAR: 41
- HA_PAIRIN_SOUND: 43
- TIPPI_BINDI: 55
- ADDAK_OMISSION: 51
- LOANWORD_PHONETICS: 54
- VARG_CONFUSION: 45
- HALVANT_PAIRIN: 36

## Exact family capacity

- F01: 375
- F02: 756
- F03: 252
- F04: 284,634
- F05: 631,125
- F06: 9,730,264,500
- F07: 506,016
- Total: 9,731,687,658

The capacity figure is a structural upper space of distinct semantic constructions. It is **not** a claim that every mathematical combination should be served to a learner. Production sampling must still apply difficulty, repetition, lexical-review and quality controls.

## Quarantine decision

The donor `TATSAM_TADBHAV` section is deliberately **not active**. Punjabi University/Punjabipedia spelling guidance explicitly notes that Punjabi can have accepted variant spellings; therefore an alternative lexical form must not automatically be treated as a misspelling. The quarantined donor block contains several records where that distinction is not safe enough for automatic question generation.

Other donor records with duplicate canonical forms, reused IDs, or potentially competing accepted variants also remain excluded. Corpus size is not allowed to override lexical correctness.

## Production lock

This checkpoint does not write to Question Bank and is not eligible for test/mock/public delivery. All 375 authorities remain review data until explicit lexical/source approval.
