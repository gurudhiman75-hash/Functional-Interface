# PUN-001 CP002 — Spelling Precision Forward Port

Status: `REVIEW_ONLY`

This is a fresh forward-port implementation. It does not merge donor Punjabi history.

## Current breadth

- **375 unique active review authorities**;
- **252 contextual authorities** available to sentence families;
- **8 active orthographic categories**;
- **7 semantic question families**;
- computed semantic capacity: **9,731,687,658** content combinations;
- option-order permutations are excluded from that capacity number;
- donor `TATSAM_TADBHAV` remains quarantined because several donor "incorrect" options are valid lexical alternatives rather than spelling errors.

### Active orthographic categories

- SIHARI_BIHARI — 50
- AUNKAR_DULANKAR — 41
- HA_PAIRIN_SOUND — 43
- TIPPI_BINDI — 55
- ADDAK_OMISSION — 51
- LOANWORD_PHONETICS — 54
- VARG_CONFUSION — 45
- HALVANT_PAIRIN — 36

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

The engine uses combinatorial unranking rather than fixed pair offsets. Different seeds traverse real authority combinations instead of recycling a small set of pairings.

Exact semantic capacities from the current corpus:

- F01: 375
- F02: 756
- F03: 252
- F04: 284,634
- F05: 631,125
- F06: 9,730,264,500
- F07: 506,016
- **Total: 9,731,687,658**

These are semantic content combinations. Shuffling the same four options is not counted as a new question.

## Editorial expansion contract

The exhaustive-breadth wave adds 207 new contextual authorities on top of the 168-authority audited pool. The added authorities are distributed across all eight categories rather than concentrated in one easy spelling pattern. Every new editorial authority has:

- one unique canonical form;
- exactly three distinct close spelling variants;
- a natural Punjabi sentence containing the canonical form;
- an explicit category;
- `EDITORIAL_CURATED` provenance;
- `REVIEW_PENDING` lifecycle status.

No editorial item is silently promoted to production linguistic truth by being present in the generator.

## Editorial contract

- concise exam-style stems;
- no unnecessary `ਟਕਸਾਲੀ`, `ਪ੍ਰਮਾਣਿਤ` or academic wording;
- no option-by-option explanation filler;
- close orthographic variants and contextual distractors;
- semantic fingerprint includes actual distractor content, not seed placeholders;
- fine-grained `subtype` metadata for Question Studio analytics;
- no Question Bank/test/mock/public promotion in this checkpoint.

## Authority lifecycle

All 375 records retain provenance-level `REVIEW_PENDING` flags; checkpoint approval is recorded separately. The contextual pool now contains 252 authorities: the original 45 manually normalized records plus all 207 authorities from the exhaustive-breadth editorial wave. The remaining donor-derived authorities continue to support direct/pair/group families without fabricated generic sentence context.

The semantic proof requires exactly 375 unique canonical forms, unique authority IDs, three distinct incorrect variants, NFC normalization, no incorrect variant colliding with another canonical form, at least 30 authorities in every active category, deterministic semantic uniqueness, and strict `REVIEW_ONLY` lifecycle metadata.
