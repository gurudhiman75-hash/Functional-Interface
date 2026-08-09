# INT-CP-004 Hindi–Punjabi localisation plan

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

Hindi and Punjabi preserve the frozen English authority for permanent identity, mathematical state, solution, solve contract, answer semantic, difficulty, internal representation and stem-family ownership, option values and order, misconception IDs, correct option index, explanation structure, and inactive lifecycle.

Only learner-facing language may change.

## Human editorial v7

Human review after native-stem v6 found defects that structural automation alone did not catch. Human editorial v7 therefore applies to the complete learner-facing package: stems, option feedback, worked steps, final answers, and common-mistake notes.

The v7 layer now:

1. removes generated headings, fact blocks, account records, scheme summaries and translated template leads;
2. provides four materially distinct Hindi and Punjabi exam-style stems per QL;
3. corrects Hindi and Punjabi number, gender, plural and postposition agreement;
4. removes redundant annual expressions such as `rate ÷ 1` without damaging monthly `÷ 12` formulas;
5. permanently rejects malformed formulas such as `36%2 = 3%`;
6. requires every QL-073 and QL-074 stem to name its actual yearly, half-yearly, quarterly or monthly crediting interval;
7. replaces generic direct-rate mistake notes with the actual interval name;
8. uses Punjabi `ਮਿਸ਼ਰਤ ਵਿਆਜ` and rejects learner-facing `ਚੱਕਰਵੱਧੀ` everywhere;
9. replaces artificial phrases such as Hindi `ब्याज-आवृत्ति`, Punjabi `ਹਰ ਸੰਭਵ ਕ੍ਰਮ`, and related calques with normal exam language;
10. preserves all frozen mathematics, answers, option ownership and lifecycle locks.

## Validated learner-content checkpoint

```text
Validated learner-content head: 4fdb71391f35570a4d57cc361b4f7f220ca0053c
Human editorial authority:      INT-CP-004-HI-PA-HUMAN-EDITORIAL-v7
CP-004 workflow run:            31324434279 — PASS
CP-001 isolation run:           31324434269 — PASS
Evidence artifact:              9041120431
Artifact digest:                sha256:9b85f021d24fb7a129ac5c424141292d33a16fb67359a7a25107d6fd2bbe1877
```

Validation evidence:

```text
Executable bilingual cases:       3,800
Option-feedback checks:           15,200
Questions per review pack:            76
Questions per QL:                      4
Distinct stem patterns/QL/locale:      4
Direct-period stem checks:           800
Answer positions A/B/C/D:     19/19/19/19
API build:                          PASS
```

Direct exact-artifact scans:

```text
Punjabi ਚੱਕਰਵੱਧੀ:                  0
Hindi generic “हर बार” rate note:  0
Punjabi generic “ਹਰ ਵਾਰ” note:     0
Punjabi ਹਰ ਸੰਭਵ ਕ੍ਰਮ:              0
Punjabi gender defect:              0
Malformed percentage formula:       0
Standalone annual ÷ 1:              0
Monthly ÷ 12 retained:              yes
QL-073/074 explicit interval:       all reviewed cases
```

## Remaining gate

The implementation remains under direct Hindi and Punjabi linguistic and exam-readiness review. It is not approved for multilingual freeze or delivery.

The next decision must be an explicit human sign-off or a further defect report. No automated pass constitutes multilingual approval.

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
