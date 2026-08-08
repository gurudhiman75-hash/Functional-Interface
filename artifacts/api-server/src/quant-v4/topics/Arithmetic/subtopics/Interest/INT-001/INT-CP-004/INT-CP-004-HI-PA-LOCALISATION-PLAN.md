# INT-CP-004 Hindi and Punjabi Localisation Plan

## Canonical source

```text
English freeze:          INT-CP-004-EN-v1-frozen
Freeze implementation:   cb42395a88609f9ead26e0afa49ded365eec198b
Approved source head:    9f8790d3ec0f630d37fd5e832fc5740f1c1928d9
QL range:                INT-QL-067..INT-QL-085
QL count:                19
Localisation version:    INT-CP-004-HI-PA-LOCALISATION-v1
Locales:                 hi-IN, pa-IN
```

## Non-negotiable parity

Hindi and Punjabi must preserve the frozen English authority exactly for:

- permanent QL identity;
- mathematical state and canonical solution;
- solve contract, answer semantic and difficulty;
- representation and stem-family ownership;
- option values, order and misconception IDs;
- correct option index;
- explanation structure;
- inactive delivery lifecycle.

Only learner-facing language may change.

## Implementation waves

1. **Foundation** — localisation types, terminology authority, frequency/duration helpers, script guards and lifecycle contract.
2. **Presentation Wave 1** — `INT-QL-067..INT-QL-072`: complete-period amount, compound interest, principal, nominal rate and duration.
3. **Presentation Wave 2** — `INT-QL-073..INT-QL-078`: direct period rates, frequency comparison and effective annual rate.
4. **Presentation Wave 3** — `INT-QL-079..INT-QL-085`: broken periods and mixed-frequency intervals.
5. **Options and feedback** — localise display and misconception feedback without changing option ownership or order.
6. **Explanations** — rebuild Hindi and Punjabi explanations from the frozen mathematical state and approved solution structure; do not translate completed English paragraphs mechanically.
7. **Executable runtime and parity audit** — generate all 19 QLs in both locales, compare every protected field with the English freeze, and reject English fallback or placeholders.
8. **Review packs and multilingual freeze** — produce separate 76-question Hindi and Punjabi reviews, apply human corrections, then create an immutable multilingual freeze.

## Editorial requirements

- Natural exam-style Hindi and Punjabi suitable for SSC, Banking and Punjab-state preparation.
- Standard mathematical notation, Indian currency formatting and the approved numerical precision.
- No method hints in stems.
- Unknown values must remain unknown in tables and records.
- High-rate examples must remain neutral investment or mathematical contexts.
- Structured representations must remain genuine tables, records, comparisons or timelines.
- Explanations must be question-specific and student-friendly.

## Lifecycle boundary

```text
maturity:                    MULTILINGUAL_LOCALISATION_REVIEW
reviewStatus:                LOCALIZED_REVIEW_REQUIRED
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

Localisation does not authorize merge, staging, registration, Question Studio discovery, Question Bank storage, test use or publication.
