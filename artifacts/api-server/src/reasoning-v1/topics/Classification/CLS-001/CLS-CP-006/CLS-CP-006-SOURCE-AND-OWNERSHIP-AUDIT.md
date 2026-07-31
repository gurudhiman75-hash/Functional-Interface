# CLS-CP-006 — Alphabet, Letter-Pair and Letter-Class Source and Ownership Audit

Status: `SOURCE_BOUNDARY_ESTABLISHED__EXECUTABLE_DISCOVERY_OPEN`

## Purpose

This audit defines the admissible boundary for alphabet-based Classification questions before any permanent QL or solve-mode identity is allocated.

The decisive student task must remain classification: find the displayed letter or complete ordered letter-pair that does not share the common property or relation of the others. Directly calculating a requested alphabet position, offset, pair count, transformed token or rearranged output remains owned by `ALP-001 — Alphabet Test`.

## Source evidence recovered

The uploaded Classification material contains a dedicated letter-classification section with source forms including:

- one consonant among vowels or one vowel among consonants;
- one letter whose alphabet position has different parity;
- ordered pairs with a different forward or backward gap;
- opposite-letter pairs;
- pairs whose alphabet-position totals differ;
- longer clusters governed by repeated gap, alternating gap, position-sum or opposite-letter structures.

The source evidence confirms that letter classification is a genuine exam family. It does not justify treating every source form as CP-006.

## Ownership decisions

### Retained in CLS-CP-006

- direct odd-one-out among single English letters;
- vowel/consonant classification;
- bounded alphabet-position classes such as odd/even position and first/second alphabet half;
- direct odd-one-out among complete ordered letter-pairs;
- fixed absolute position gap;
- fixed signed position gap where direction is material;
- fixed pair-position total;
- opposite-letter-pair status;
- vowel/consonant composition of a displayed pair;
- four- and five-option presentation when the solve contract is unchanged.

### Deferred to CLS-CP-007

- three- or more-letter clusters;
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
- transform letters under an explicit class rule;
- sort, reverse or rearrange letters and report the result;
- any answer whose semantic object is a position, count or transformed output rather than the displayed classification option.

### Reassigned elsewhere

- source-to-target rule transfer: Analogy;
- next, missing or wrong term in a progression: Series;
- hidden transformation inference: Coding-Decoding;
- dictionary ordering: Word and Dictionary Order;
- visual letter shape when font or renderer changes the answer: reject unless separately proved renderer-safe.

## Canonical boundary test

A candidate belongs to CP-006 only when all conditions hold:

```text
1. Every answer option is one complete letter or one complete ordered letter-pair.
2. The final learner action is to select the outlier or matching option.
3. The intended rule is drawn from a bounded alphabet-property registry.
4. The complete eligible registry is independently enumerated.
5. No comparable competing rule produces a different answer.
6. No hidden operation, progression completion or direct position calculation is requested.
```

## Initial eligible rule universe

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

This is the first executable registry, not a frozen final inventory. Source-gap audit may add conventional bounded rules. Arbitrary modular classes, ad hoc constants and post-hoc equations are prohibited.

## Merge/split hypotheses

- all single-letter outlier rules may merge when the answer object and proof topology remain one displayed letter;
- all ordered letter-pair outlier rules may merge when direction and exact relation are instance properties;
- single-letter and letter-pair forms may require separate QLs because the answer object and relation proof differ;
- equivalent-set or reference-pair selection, if source-backed later, must be audited separately rather than assumed to merge;
- option count, exact letters, intended answer position and difficulty remain instance variables.

## Locale policy

The Latin letters and alphabet positions are logic-neutral tokens. English, Hindi and Punjabi may share the same canonical state, but instructions, explanations and traps require independent localisation. CP-006 begins as an English review-only discovery runtime.

## Lifecycle lock

```text
permanentQlId:              null
reviewStatus:               UNREVIEWED_DISCOVERY
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

No permanent QL, Question Studio exposure, Question Bank storage, test eligibility or publication is authorised by this audit.
