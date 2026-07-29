# ALP-001 CP-006–CP-010 Source, Ownership and Final Discovery Freeze

## Decision

The remaining Alphabet Test inventory is frozen at five checkpoints and 52 additional QLs after executable source-backed discovery.

```text
Existing identities: ALP-QL-001..104
New identities:      ALP-QL-105..156
New checkpoints:     ALP-CP-006..010
Final chapter QLs:   156
```

The count is the result of coverage and compression, not a preselected target.

## Source recovery

The uploaded Alphabet Test material supplies four material families beyond the existing CP-001–005 boundary: letter-pair equality inside a word; digit-pair equality and explicit digit rearrangement; alphanumeric/symbol position and adjacency scans; and explicit class-based or mixed-token rearrangement.

The same sources also contain dictionary order, meaningful-word formation, hidden coding, series and mirror/water forms. Those are recorded as source evidence but excluded because their decisive reasoning belongs to dedicated neighbouring chapters.

## CP-006 — Alphabet-pair relations inside words

Retained solve authorities:

- count matching pairs in both directions;
- count forward-direction pairs;
- count backward-direction pairs;
- identify a valid displayed pair;
- identify the word with a stated pair count;
- count matching pairs after an explicit reversal.

The equality is verified through:

```text
absolute word-position difference
=
absolute alphabet-rank difference
```

This is equivalent to equal exclusive gaps and avoids off-by-one ambiguity.

## CP-007 — Explicit letter-class transformations

Retained authorities cover direct changed-letter output, complete changed word, unchanged-position count, vowel count after change, transform-then-sort direct and inverse tasks, explicit vowel-opposite replacement and a stated class rule followed by reversal. Every rule is shown; hidden inference remains Coding-Decoding.

## CP-008 — Digit positions, pair relations and rearrangement

Retained authorities cover digit at a left/right position, left/right position of a digit, count and identification of equal-gap digit pairs, positions after ascending/descending/reverse/adjacent-swap arrangements and unchanged-position counts. The digit string is a token row; no arithmetic property of the represented integer is used.

## CP-009 — Alphanumeric and symbol scanning

Retained authorities cover direct and relative positions from either end, letter–symbol and digit–letter adjacency counts, filtered vowel/even-digit adjacency counts, nth letter from the left and nth symbol from the right. “Followed by” and “preceded by” are resolved as ordered adjacency contracts.

## CP-010 — Mixed-sequence rearrangement and composite scans

Retained authorities cover stable category grouping, sorting or reversing letters/digits in their own slots, adjacent swap, full reversal, category removal, inverse position after grouping, unchanged-position counts and transform-then-adjacency scans. Input-output machines are excluded because they require inferred iterative rules.

## Compression decisions

Merged as parameters or representations:

- left/right direction where solver and answer semantic are unchanged;
- which explicit letter class is shifted or kept;
- selected explicit transform for unchanged-position counts;
- letters, digits and symbols as category parameters;
- equivalent prose variants of immediate precedence/following.

Kept separate:

- direct token output versus inverse position output;
- pair count versus pair identification;
- unchanged-position count versus token-at-position;
- scan-before-transform versus transform-then-scan;
- stable category grouping versus in-place category rearrangement.

## Final safety

No new QL is published merely by this freeze. All CP-006–010 outputs remain review-only, non-stored, ineligible for tests and non-public until a separate approval and integration gate.
