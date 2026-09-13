# PUN-001 CP002 — Spelling Precision Forward Port

Status: `REVIEW_ONLY`

This is a fresh forward-port implementation. It does not merge donor Punjabi history.

## Current breadth

- 168 unique active review authorities;
- 45 manually contextualized authorities for sentence families;
- 8 active orthographic categories;
- 7 semantic question families;
- computed semantic capacity: **384,378,270** content combinations;
- option-order permutations are excluded from that capacity number;
- donor `TATSAM_TADBHAV` remains quarantined because several donor "incorrect" options are valid lexical alternatives rather than spelling errors.

### Active orthographic categories

- SIHARI_BIHARI — 20
- AUNKAR_DULANKAR — 16
- HA_PAIRIN_SOUND — 23
- TIPPI_BINDI — 20
- ADDAK_OMISSION — 16
- LOANWORD_PHONETICS — 24
- VARG_CONFUSION — 28
- HALVANT_PAIRIN — 21

## Semantic families

- F01 — correct-form recognition — Easy
- F02 — sentence error correction — Medium
- F03 — contextual completion — Medium
- F04 — multi-error sentence repair — Hard
- F05 — two-word precision — Hard
- F06 — incorrect-form detection across four words — Medium
- F07 — two-sentence spelling diagnosis — Hard

## Difficulty contract

Difficulty is driven by the operation required:

- Easy: recognize one correct form among close variants.
- Medium: resolve spelling through context or inspect a four-word set.
- Hard: repair/evaluate multiple spelling decisions together.

Negative wording, rare vocabulary, formal prose and instruction paraphrases do not create difficulty. Direct recognition is intentionally not relabelled Medium.

## Breadth contract

The engine now uses combinatorial unranking rather than a fixed pair offset. Different seeds traverse real authority combinations instead of repeatedly recycling the same 45 pairings.

Approximate exact capacities enforced by code:

- F01: 168
- F02: 135
- F03: 45
- F04: 8,910
- F05: 126,252
- F06: 384,226,920
- F07: 15,840
- Total: 384,378,270

These are semantic content combinations. Shuffling the same four options is not counted as a new question.

## Editorial contract

- concise exam-style stems;
- no unnecessary `ਟਕਸਾਲੀ`, `ਪ੍ਰਮਾਣਿਤ` or academic wording;
- no option-by-option explanation filler;
- close orthographic variants and contextual distractors;
- semantic fingerprint includes actual distractor content, not seed placeholders;
- fine-grained `subtype` metadata for Question Studio analytics;
- no Question Bank/test/mock/public promotion in this checkpoint.

## Authority lifecycle

All 168 records remain `REVIEW_PENDING`. The first 45 records contain manually normalized Punjabi sentence context. The additional 123 records expand direct/pair/group spelling coverage while remaining outside production authority until lexical review explicitly promotes them.

The semantic proof requires unique canonical forms, unique authority IDs, three distinct incorrect variants, NFC normalization, no incorrect variant colliding with another canonical form, eight-category depth, deterministic semantic uniqueness, and strict `REVIEW_ONLY` lifecycle metadata.
