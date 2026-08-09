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

Hindi and Punjabi preserve the frozen English authority exactly for:

- permanent QL identity;
- mathematical state and canonical solution;
- solve contract, answer semantic and difficulty;
- representation and stem-family ownership metadata;
- option values, order and misconception IDs;
- correct option index;
- explanation structure;
- inactive delivery lifecycle.

Only learner-facing language may change.

## Native-stem v6 remediation

Human review found that the earlier learner-facing stems still exposed internal presentation frames and therefore felt machine generated. Native-stem v6 replaces that layer rather than lightly editing it.

The current implementation:

1. generates learner-facing stems directly from the frozen mathematical state;
2. provides four separately authored Hindi and four separately authored Punjabi exam-style stem patterns for every QL;
3. keeps representation and stem-family values only as internal frozen ownership metadata;
4. removes displayed tables, generated headings, account-detail blocks, fact lists and scheme-summary wrappers;
5. rejects machine leads such as “details are given below”, “account details” and “scheme summary”;
6. uses Punjabi `ਮਿਸ਼ਰਤ ਵਿਆਜ` for compound interest and rejects learner-facing `ਚੱਕਰਵੱਧੀ`;
7. corrects Punjabi oblique plurals such as `9 ਮਹੀਨਿਆਂ ਬਾਅਦ` and `4 ਸਾਲਾਂ ਬਾਅਦ`;
8. removes Hindi `ब्याज-योग` and Punjabi `ਵਿਆਜ-ਗੁਣਕ` calques from learner-facing text;
9. preserves all frozen mathematics, answers, option order, misconception ownership and lifecycle locks.

## Exact-head validation

```text
Validated head:          7580f66beaddb2446bc2652817b1002ca78c7c6a
Native stem authority:   INT-CP-004-HI-PA-NATIVE-STEMS-v6
CP-004 workflow run:     31309859596 — PASS
CP-001 isolation run:    31309859587 — PASS
Evidence artifact:       9037049158
Artifact digest:         sha256:2ab6ff3ceeae76f2895c5a2938db25b71bf759cc36f76f38cece1af21693c6da
```

Validation evidence includes:

```text
Executable bilingual runtime cases: 3,800
Questions per review pack:              76
Questions per QL:                        4
Native stem patterns per QL/locale:      4
Answer positions A/B/C/D:       19/19/19/19
API build:                            PASS
```

Direct review-pack scans:

```text
Punjabi ਚੱਕਰਵੱਧੀ:       0
Punjabi ਮਿਸ਼ਰਤ ਵਿਆਜ: 156
Hindi ब्याज-योग:         0
Punjabi ਵਿਆਜ-ਗੁਣਕ:      0
Markdown stem tables:    0
```

## Remaining gate

The implementation remains under direct Hindi and Punjabi linguistic and exam-readiness review. It is not approved for multilingual freeze or delivery.

Review should inspect:

- whether each stem sounds like a real SSC, banking or Punjab-state-exam question;
- native grammar and familiar terminology;
- option-feedback clarity;
- concise and student-friendly worked solutions;
- whether any remaining phrase still sounds translated or mechanically assembled.

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
