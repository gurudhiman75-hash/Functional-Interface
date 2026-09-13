# PUN-001 CP002 — Spelling Precision Forward Port

Status: `REVIEW_ONLY`

This is a fresh forward-port implementation. It does not merge donor Punjabi history.

## Semantic families

- F01 — correct-form recognition — Easy
- F02 — sentence error correction — Medium
- F03 — contextual completion — Medium
- F04 — multi-error sentence repair — Hard
- F05 — two-word precision — Hard

## Difficulty contract

Difficulty is driven by the operation required:

- Easy: recognize one correct form among close variants.
- Medium: resolve the spelling inside a sentence/context.
- Hard: repair or evaluate two spelling decisions together.

Negative wording, rare vocabulary, formal prose and instruction paraphrases do not create difficulty. Direct recognition is intentionally not relabelled Medium.

## Editorial contract

- concise exam-style stems;
- no unnecessary `ਟਕਸਾਲੀ`, `ਪ੍ਰਮਾਣਿਤ` or academic wording;
- no option-by-option explanation filler;
- same-word/contextual distractors;
- semantic fingerprint independent of seed-only placeholders;
- Question Studio receives a fine-grained `subtype`;
- no Question Bank/test/mock/public promotion in this checkpoint.

## Authority lifecycle

The current review corpus contains 45 selectively extracted donor records across six spelling-confusion categories. Records are normalized for concise explanations and natural sentence context, but all remain `REVIEW_PENDING` until lexical/source review explicitly promotes them.

The semantic proof requires unique correct forms, three distinct incorrect variants, NFC-normalized text, context containing the target form, donor provenance, 40 unique review questions per enabled family/difficulty sample, and strict `REVIEW_ONLY` lifecycle metadata.
