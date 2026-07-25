# ANA-CP-005 Implementation Report

Status: canonical realignment source-complete; checked-out runtime execution and editorial review pending.

## Scope

- 20 permanent QLs: `ANA-QL-141` through `ANA-QL-160`
- 10 audited single-letter alphabet families
- canonical task kind: `singleLetterTransform`
- canonical solve mode: `ALPHABET_RULE`
- presentation modes: `DIRECT_COMPLETION`, `PAIR_SELECTION`
- four structured-text layouts
- deterministic seeded generation
- independent solver and complete-context validation
- equal-or-simpler ambiguity rejection
- registry-level collision audit
- English, Hindi and Punjabi runtime support
- English and localized review exporters with trap notes

## Canonical rule families

1. fixed forward shift
2. fixed backward shift
3. cyclic forward shift
4. cyclic backward shift
5. opposite alphabet letter
6. equal positional distance
7. reverse-position transform
8. doubled positional movement
9. vowel/consonant class correspondence
10. two-step position transform

## Removed from CP-005

The earlier implementation contained half-position, rounded-half, double-minus-one and opposite-of-double standalone families. Those were mathematically valid but did not match the audited ANA-001 allocation, so they are no longer assigned to QLs 141–160.

## Runtime protections

Every generated question must have:

- exactly four unique options;
- exactly one correct answer;
- a valid intended rule and complete context;
- independent solver agreement;
- no equal-or-simpler competing rule;
- deterministic output for the same QL and seed;
- explicit boundary-wrap arithmetic for cyclic shifts;
- both direction branches visible for equal-distance evidence;
- a non-zero reverse-position adjustment;
- no internal `ALPHA_*` identifier in student-facing text;
- localized question, explanation and trap-note parity.

All rule applications return `null` on ineligible inputs. Candidate discovery skips invalid inputs instead of allowing domain errors to reach alphabet-position conversion.

## Audit volume

English audit:

- 20 QLs;
- 80 seeds per QL;
- 1,600 generated questions.

Localized audit:

- 20 QLs;
- 40 seeds per QL;
- 2 locales;
- 1,600 generated questions.

Total committed audit volume: 3,200 questions.

## Ownership boundary

CP-005 contains only single-letter transformations. Multi-letter clusters, per-character transformations, rearrangement and cluster reversal remain in `ANA-CP-006`. Mixed number-letter rules remain in later advanced checkpoints. Figure analogy remains excluded from ANA-001.

## Current merge gate

The feature branch must not be merged until:

- the English canonical audit passes locally;
- the Hindi/Punjabi canonical audit passes locally;
- English, Hindi and Punjabi review files are regenerated;
- the new equal-distance, reverse-position, class-correspondence and two-step samples receive editorial inspection;
- no runtime collision or language defect remains.
