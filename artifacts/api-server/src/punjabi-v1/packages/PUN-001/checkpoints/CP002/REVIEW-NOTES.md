# CP002 Forward-Port Review Notes

## Current checkpoint

- Lifecycle: `REVIEW_ONLY`
- Corpus: 45 selectively extracted donor spelling authorities
- Authority status: every record remains `REVIEW_PENDING`
- Semantic families: 5
- Difficulty: Easy = direct recognition; Medium = contextual resolution; Hard = two simultaneous spelling decisions

## Gates enforced

1. unique canonical correct forms across the review corpus;
2. three distinct incorrect variants per authority;
3. target form present in each natural Punjabi context sentence;
4. NFC-normalized canonical spelling;
5. explicit donor provenance and no silent authority promotion;
6. no `ਟਕਸਾਲੀ` / `ਪ੍ਰਮਾਣਿਤ` stem padding;
7. no option-by-option explanation filler;
8. semantic content fingerprints rather than seed fingerprints;
9. 40-question uniqueness proof per enabled family/difficulty sample;
10. hard questions must resolve two authority records.

## Deliberately excluded from this wave

Donor records with duplicate canonical forms or potentially competing accepted variants were not auto-forward-ported. They require separate lexical review rather than being used merely to inflate the pool.

## Production lock

This checkpoint does not write to Question Bank and is not eligible for test/mock/public delivery. Lexical records must be explicitly reviewed before any production-authority promotion.
