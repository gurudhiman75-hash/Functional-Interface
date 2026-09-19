# ENG-004-CP001 — Core Synonyms & Antonyms — Source Audit V2

Status: `EXPANDED_500__AUTOMATED_VALIDATION_PENDING__HUMAN_REVIEW_PENDING`

## Expansion result

CP001 has been expanded from the 36-entry architecture pilot to **500 curated allowlisted headword-senses**.

Current composition:

- 500 headword-senses
- 342 adjectives / 158 verbs
- 170 Easy / 180 Medium / 150 Hard
- 748 stored synonym links
- 216 stored antonym links
- 164 entries with at least one antonym relation
- 412 polysemous entries with source context available

The full ENG-004 chapter target remains 2,000+ headword-senses across later CPs.

## Source and editorial boundary

The sense/relation source is **Princeton WordNet 3.0**. Examtree does not expose raw WordNet indiscriminately.

The CP001 allowlist is explicitly selected for competitive-exam usefulness. Technical and phrase-heavy entries are excluded from this checkpoint. Relation alternatives are filtered toward attested/common single-token forms. Source synset offsets are retained for audit.

The WordNet 3.0 license is stored at:
`ENG-004/WORDNET-3.0-LICENSE.txt`.

## Sense handling

A headword may have several WordNet senses. CP001 resolves one source sense per headword and records its sense rank/count.

Where a selected headword is polysemous and WordNet provides a usable example sentence, the generator supplies that sentence as context. This prevents direct-word questions from silently accepting a second sense.

## Multi-relation model

V2 stores arrays rather than a single answer pair:

- `synonyms[]`
- `antonyms[]`
- `distractors[]`

The generator deterministically chooses one accepted relation for the displayed correct option and blocks every other stored synonym/antonym from distractor positions.

## Distractor model

Distractors are drawn from the approved 500-word bank, not from arbitrary strings.

Selection favours:

- same part of speech
- same or nearby WordNet lexical domain
- same difficulty band
- semantic-gloss overlap
- similar corpus frequency and word length

Known direct WordNet synonym/antonym relations are excluded.

## Difficulty

Difficulty is assigned by corpus-frequency rank within the curated bank:

- top 170 → Easy
- next 180 → Medium
- remaining 150 → Hard

This creates a reproducible starting point. Human review may override individual difficulty labels before approval.

## Validation gates

V2 must pass:

- exact bank size and unique headword checks
- relation existence and option uniqueness
- every eligible synonym/antonym mode per entry
- minimum relation-depth assertions
- 12,000-question soak
- all 500 entries exercised
- synonym and antonym generation at every difficulty
- balanced A/B/C/D positions
- 60-question review export
- API build

## Lifecycle

Review-only. No Question Studio registration or learner/test/mock/public/production promotion until explicit approval of V2.
