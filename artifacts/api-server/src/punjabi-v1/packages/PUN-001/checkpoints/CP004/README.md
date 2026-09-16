# PUN-001 CP004 — ਲਿੰਗ ਅਤੇ ਵਚਨ

Status: **REVIEW ONLY / FORWARD PORT**

CP004 implements the nine blueprint families for Punjabi gender and number without opening production delivery.

## Authority layer

- 26 audited gender pairs
- 20 rule-safe gender pairs used by direct transformation family
- 32 audited singular/plural pairs
- 12 contextual agreement authorities
- every authority remains `REVIEW_PENDING`

## Implemented families

- `F01` — change gender
- `F02` — identify correct gender pair
- `F03` — identify mismatched gender pair
- `F04` — singular to plural
- `F05` — plural to singular
- `F06` — identify correct number pair
- `F07` — contextual gender/number usage
- `F08` — agreement error correction
- `F09` — statement-pair correctness

## Human-quality hardening

- fabricated suffix-based distractors were removed from the authority layer
- direct gender options now use canonical forms from the same semantic domain
- direct number options now use canonical forms from the same inflection-rule group
- `F03` wrong gender pairs are constrained to the same semantic domain instead of arbitrary cross-category mismatches
- contextual families remain sentence-derived and Punjabi-only

## Quality gates

`CP004.test.ts` exhaustively walks the declared semantic capacity and checks four unique options, deterministic metadata, Punjabi-only stems/explanations, authority traceability, semantic-neighbour distractor constraints, no generic stem clutter, no option-by-option explanation filler, review-only lifecycle, and cross-family fingerprint uniqueness.

Declared semantic capacity: **904** distinct content combinations before option-order permutations. The previous 1,400 figure was reduced deliberately when low-quality cross-domain mismatch combinations were removed.

`export-review.ts` produces a 240-question review pack with an 80/80/80 Easy/Medium/Hard split.

No Question Bank, test, mock, or public delivery gate is enabled by this checkpoint.
