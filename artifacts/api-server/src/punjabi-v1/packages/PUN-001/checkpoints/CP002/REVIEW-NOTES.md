# CP002 Forward-Port Review Notes

## Current checkpoint

- Lifecycle: `REVIEW_ONLY`
- Active corpus: 168 unique spelling authorities
- Context corpus: 45 manually contextualized authorities
- Authority status: every record remains `REVIEW_PENDING`
- Active orthographic categories: 8
- Semantic families: 7
- Review pack: 180 questions (60 Easy / 60 Medium / 60 Hard)
- Computed semantic capacity: 384,378,270 content combinations, excluding option-order permutations

## Gates enforced

1. unique canonical correct forms across all 168 active authorities;
2. unique forward-port authority IDs even where donor IDs were reused;
3. three distinct incorrect variants per authority;
4. no incorrect variant may equal any other active canonical form;
5. NFC-normalized canonical and incorrect forms;
6. contextual families use only the manually contextualized 45-authority subset;
7. explicit donor provenance and no silent authority promotion;
8. no `ਟਕਸਾਲੀ` / `ਪ੍ਰਮਾਣਿਤ` stem padding;
9. no option-by-option explanation filler;
10. semantic fingerprints include distractor content, not seed placeholders;
11. combinatorial pair/quartet traversal replaces the old fixed-pair offset;
12. deterministic uniqueness samples cover all seven families;
13. hard questions require multiple spelling decisions rather than NOT/reversal wording.

## Active category depth

- SIHARI_BIHARI: 20
- AUNKAR_DULANKAR: 16
- HA_PAIRIN_SOUND: 23
- TIPPI_BINDI: 20
- ADDAK_OMISSION: 16
- LOANWORD_PHONETICS: 24
- VARG_CONFUSION: 28
- HALVANT_PAIRIN: 21

## Quarantine decision

The donor `TATSAM_TADBHAV` section is deliberately **not active**. Several records treat valid Punjabi/Sanskrit-derived lexical alternatives or synonyms as if they were misspellings. Those records require a separate lexical-standardization design and must not be used merely to inflate spelling breadth.

Other donor records with duplicate canonical forms, reused IDs, or potentially competing accepted variants were also not auto-admitted. The forward-port keeps donor lineage while assigning collision-safe IDs to curated extensions.

## Production lock

This checkpoint does not write to Question Bank and is not eligible for test/mock/public delivery. All authorities remain review data until explicit lexical/source approval.
