# CLS-CP-006 — Alphabet, Letter-Pair and Letter-Class Source and Ownership Audit

Status: `SOURCE_AND_OWNERSHIP_BOUNDARY_FROZEN`

Final authority: `CLS-CP-006-FINAL-ENGLISH-FREEZE.md`

## Purpose

This audit defines the admissible boundary for alphabet-based Classification questions.

The decisive learner task must remain classification: select the displayed single letter or complete ordered letter-pair that does not share the common bounded property or relation. Directly calculating a requested alphabet position, offset, pair count, transformed token or rearranged output remains owned by `ALP-001 — Alphabet Test`.

## Source evidence recovered

The Classification source material contains genuine letter-classification forms including:

- one consonant among vowels or one vowel among consonants;
- one letter whose alphabet position has different parity;
- ordered pairs with a different forward or backward gap;
- opposite-letter pairs;
- pairs whose alphabet-position totals differ;
- longer clusters governed by repeated gaps, alternating gaps, position sums or opposite-letter structures.

The first five families are represented in CP-006. Longer clusters belong to CP-007.

## Frozen ownership decisions

### Retained in CLS-CP-006

- odd-one-out among single uppercase English letters;
- vowel/consonant class;
- odd/even alphabet-position class;
- first-half/second-half alphabet-position class;
- odd-one-out among complete ordered distinct-letter pairs;
- fixed absolute position gap;
- fixed signed position gap where direction is material;
- fixed pair-position total;
- opposite-letter-pair status;
- ordered vowel/consonant composition;
- four- and five-option presentation when the solve contract is unchanged.

### Deferred to CLS-CP-007

- three-or-more-letter clusters;
- alternating or multi-step gap sequences inside a cluster;
- cluster position-sum equations;
- mirrored or opposite transformations across complete clusters;
- repeated-letter topology and explicit cluster rearrangement.

### Retained by ALP-001, not Classification

- direct position of a letter from either end;
- move forward or backward by a stated offset;
- reconstruct a missing endpoint or midpoint;
- count equal-gap pairs inside a word;
- identify a requested pair inside a word;
- transform letters under an explicit rule;
- sort, reverse or rearrange letters and report the result;
- any answer whose semantic object is a position, count or transformed output.

### Reassigned elsewhere

- source-to-target rule transfer — Analogy;
- next, missing or wrong term in a progression — Series;
- hidden transformation inference — Coding-Decoding;
- dictionary ordering — Word and Dictionary Order;
- visual letter shape when font or renderer changes the answer — rejected unless separately renderer-proved.

## Canonical boundary test

A candidate belongs to CP-006 only when all conditions hold:

```text
1. Every answer option is one complete letter or one complete ordered letter-pair.
2. The final learner action is classification by mismatch.
3. The intended rule belongs to the frozen bounded registry.
4. The complete compatible registry is independently enumerated.
5. No comparable rule produces a different answer.
6. No hidden operation, progression completion or direct position calculation is requested.
```

## Frozen rule universe

### Single-letter rules

- `LETTER_VOWEL_CONSONANT_CLASS`
- `LETTER_POSITION_PARITY`
- `LETTER_ALPHABET_HALF`

### Ordered letter-pair rules

- `PAIR_ABSOLUTE_POSITION_GAP`
- `PAIR_SIGNED_POSITION_GAP`
- `PAIR_POSITION_SUM`
- `PAIR_OPPOSITE_STATUS`
- `PAIR_VOWEL_CONSONANT_COMPOSITION`

Arbitrary modular classes, ad hoc constants, post-hoc equations and source-thin mathematical descriptions are prohibited.

## Frozen learner contracts

- `CLS-QL-010` — find the odd single letter;
- `CLS-QL-011` — find the odd complete ordered letter-pair.

Option count, exact letters, admitted rule, answer position and difficulty remain instance variables.

## Locale policy

Latin letters and alphabet positions are logic-neutral tokens. English, Hindi and Punjabi may share canonical states, but instructions, explanations and traps require independent localisation proof.

## Lifecycle lock

```text
permanentQlIds:             CLS-QL-010, CLS-QL-011
reviewStatus:               FROZEN_ENGLISH_RUNTIME_PROOF
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

Hindi and Punjabi localisation and all product integration remain separate explicit phases.
