# NUM-CP-005 — Hindi and Punjabi Localisation Review

**Checkpoint:** `NUM-CP-005 — Divisors and Divisor Functions`  
**Permanent QL range:** `NUM-QL-046..NUM-QL-069`  
**Canonical authority:** frozen English runtime  
**Translated locales:** `hi-IN`, `pa-IN`  
**Phase:** executable localisation review  
**Final multilingual freeze:** not yet granted  
**Question Studio / Question Bank / tests / public delivery:** disabled

## Localisation architecture

Hindi and Punjabi questions are reconstructed from the frozen mathematical state. The implementation does not translate complete English paragraphs.

For every localized question it preserves:

- permanent QL identity;
- retained authority and solve-mode identity;
- runtime prototype and complete prototype ancestry;
- seed and source seed;
- hidden mathematical state;
- mathematical fingerprint;
- difficulty, semantic and representation;
- option order and correctness flags;
- correct option index;
- canonical English answer and verifier trace;
- locked lifecycle.

Localized stems and explanation sections use QL-specific structured builders and natural exam vocabulary. Numeric answers, sets, factorisations and formula symbols remain mathematically unchanged. Textual answer classes are translated through a closed language pack.

## Permanent authority coverage

The localisation pack contains dedicated Hindi and Punjabi concept, strategy, speed-method and trap text for all 24 permanent QLs:

```text
NUM-QL-046..NUM-QL-069
```

The localizer handles all approved parameter variants, including:

- total/proper divisor count;
- odd/even divisor count;
- divisible/not-divisible subset counts;
- square/cube/general perfect-power divisors;
- total/proper divisor sums;
- unrestricted/odd/even least-integer construction;
- all singleton direct, inverse, table, claim, caselet and data-sufficiency authorities.

## Executable review contract

The localisation workflow must prove:

- frozen English permanent-runtime regression;
- deterministic Hindi and Punjabi generation;
- 24 QLs and all 32 runtime prototypes in both translated locales;
- exact hidden-state and fingerprint parity with English;
- exact QL, authority, solve-mode, prototype, seed and source-seed parity;
- exact option ordering and correct-index parity;
- translated semantic answer equality;
- expected Devanagari or Gurmukhi script in learner-facing prose;
- four unique options, one correct option and misconception-owned wrong options;
- no English instructional prose leak;
- no internal identity or invalid-value leak;
- no cross-QL exact localized-stem collision;
- zero lifecycle exposure;
- JSON, CSV and Markdown bilingual review evidence.

## Lifecycle

Every Hindi and Punjabi package remains:

```text
maturity:                    MULTILINGUAL_LOCALISATION_REVIEW
reviewStatus:                LOCALIZED_REVIEW_REQUIRED
localizationStatus:          EXECUTABLE_REVIEW_REQUIRED
active:                      false
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

## Next gate

After executable parity and editorial audit pass, the generated review pack requires explicit human linguistic review. Only a separate approval may change the status to final multilingual freeze. Question Studio activation remains a later independent release gate.
