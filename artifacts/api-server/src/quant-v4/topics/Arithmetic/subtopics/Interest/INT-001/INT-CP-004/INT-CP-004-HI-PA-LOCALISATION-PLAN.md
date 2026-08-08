# INT-CP-004 Hindi and Punjabi localisation plan

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

Hindi and Punjabi preserve the frozen English authority exactly for:

- permanent QL identity;
- mathematical state and canonical solution;
- solve contract, answer semantic and difficulty;
- representation and stem-family ownership;
- option values, order and misconception IDs;
- correct option index;
- explanation structure;
- inactive delivery lifecycle.

Only learner-facing language may change.

## Completed implementation

1. Localisation types, terminology authority, script guards and lifecycle contract.
2. Native Hindi and Punjabi stems for `INT-QL-067..INT-QL-085`.
3. Localised option display and misconception-specific feedback.
4. Formula-first, question-specific explanations.
5. Executable bilingual runtime and frozen-English parity audit.
6. Separate 76-question Hindi and Punjabi human-review packs.
7. Editorial remediation after critical human review.

## Editorial remediation v2

The learner-facing layer was remodelled rather than lightly edited. The current implementation rejects:

- `नाममात्र / ਨਾਮਮਾਤਰ` in learner-facing text;
- translated template leads;
- mechanical numeric ordinals and wrong singular/plural forms;
- vague direct-period-rate wording;
- circular inverse-principal explanations;
- hidden answer-rate substitution;
- long month-by-month rounded balance chains;
- ambiguous `x/y/100` percentage notation;
- computed scheme amounts revealed inside QL-075 stems;
- QL-080 described as compound interest instead of total interest;
- awkward teaching phrases such as `गोल-गोल सिद्ध`, `गोल राशि`, and `वार्षिक संख्या`.

## Validated checkpoint

```text
Branch:          feat/int-cp004-hi-pa-localisation
Validated head:  f36db52d05c19eb3afa4bc9618897c950ee58628
Workflow run:    31246203474 — PASS
Artifact ID:     9018572889
Artifact digest: sha256:3d44e9d7326874f3c4fce1595bb8ad5f87420946a9212cd4dda85b8f036e0686
Isolation run:   31246203475 — PASS
```

Editorial evidence:

```text
Bilingual question cases:       3,800
Stem checks:                    3,800
Option checks:                 15,200
Explanation checks:             3,800
Grammar checks:                 7,600
Explicit-period checks:         1,200
Inverse-derivation checks:        600
Explicit option-test checks:      600
Concise-solution checks:         3,800
Rounding-safety checks:          3,800
Formula-clarity checks:          3,800
Comparison-leak checks:            200
Broken-period-prompt checks:       200
Maximum explanation length:     5 steps
```

Review packs:

```text
Questions per locale:          76
Questions per QL:               4
Answer positions A/B/C/D: 19/19/19/19
Representations:          19 each
Shared canonical seeds:         76
Hindi Markdown SHA-256:  c903a5373b572649679f2960b2253ed39f0fb6f9a36f0019637e439c4595df3a
Punjabi Markdown SHA-256: fe9fb98a3c5ea919046365a79d6b5cb7333fc6f82bd0e3e76b8327928dd4b5a4
```

## Remaining gate

The implementation remains under human Hindi and Punjabi linguistic and exam-readiness review. It is not yet approved for multilingual freeze or delivery.

Review should inspect:

- natural exam-style wording;
- terminology familiar to SSC, banking and Punjab-state-exam students;
- grammatical fluency;
- option-feedback clarity;
- concise and student-friendly worked solutions.

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

No step in this phase authorizes merge, staging, registration, Question Studio discovery, Question Bank storage, test use, multilingual freeze or publication.
