# INT-001 / INT-CP-001 Multilingual V2 Cash-Flow Review Candidate

Hindi candidate: `INT-CP-001-HI-v2`  
Punjabi candidate: `INT-CP-001-PA-v2`  
Superseded approved artefacts: `INT-CP-001-HI-v1`, `INT-CP-001-PA-v1`  
Editorial standard: `FOUR_TIER_GOLD_MULTILINGUAL_V2`  
English mathematical authority: `INT-CP-001-EN-v3`  
Permanent QL range: `INT-QL-001..INT-QL-021`  
Status: **PENDING HUMAN MULTILINGUAL REVIEW**

## Defect closed

The approved V1 localisation could combine a borrowing context with receipt-oriented wording such as:

```text
गुरलीन ने ... फसल ऋण लिया है ... कितना ब्याज मिलेगा?
```

That sentence contradicts the direction of the financial transaction. A borrower pays interest; a depositor or investor earns interest.

V2 makes the cash-flow direction an explicit locale contract:

```text
BORROWER_PAYS
INVESTOR_EARNS
NEUTRAL_MATH
```

## Source-scenario ownership

Borrower scenarios:

```text
BUSINESS_ADVANCE
COMMUNITY_LOAN
CROP_LOAN
EDUCATION_LOAN
EQUIPMENT_LOAN
PERSONAL_AGREEMENT
PERSONAL_LENDING
```

Investment/deposit scenarios:

```text
FIXED_DEPOSIT
POST_OFFICE
POST_OFFICE_DEPOSIT
SAVINGS_CERTIFICATE
GENERIC
```

Unknown future scenario IDs fail closed as neutral and cannot silently inherit an investment story.

## Learner-language rules

Hindi borrower stems use role-correct language such as:

```text
कितना ब्याज देना होगा?
देय ब्याज
कुल देय राशि
ऋण कितने समय के लिए लिया गया था?
```

Hindi investment stems use:

```text
कितना ब्याज अर्जित होगा?
अर्जित ब्याज
कुल राशि
राशि कितने समय के लिए निवेश की गई थी?
```

Punjabi follows the same semantic distinction with natural Gurmukhi wording:

```text
ਕਿੰਨਾ ਵਿਆਜ ਦੇਣਾ ਪਵੇਗਾ?
ਦੇਣਾ ਪੈਣ ਵਾਲਾ ਵਿਆਜ
ਕੁੱਲ ਦੇਣ ਵਾਲੀ ਰਕਮ
```

versus:

```text
ਕਿੰਨਾ ਵਿਆਜ ਮਿਲੇਗਾ?
ਮਿਲਣ ਵਾਲਾ ਵਿਆਜ
ਕੁੱਲ ਰਕਮ
```

## Patch boundary

V2 changes only learner-facing context/stem language and locale lifecycle traceability. It does not change:

- permanent QL identity or ownership;
- solve contract or mathematical topology;
- hidden numerical state;
- exact canonical solution;
- option-result values or display order;
- correct option index;
- misconception IDs;
- explanation mathematics;
- source adapter or mathematical fingerprint.

The exhaustive audit compares V1 and V2 after excluding only the authorised stem/release/status/validation/trace fields.

## Exact proof before record

Validated code head:

`a39832ad915993e62f3d287af7a9cdde15d9cc54`

Dedicated workflow:

```text
Validate INT-CP-001 multilingual V2 cash-flow direction
Run:        30419087843
Conclusion: PASS
```

Evidence artifact:

```text
Artifact ID: 8711232053
Digest: sha256:4c510ee455b05aea05df9d976a8b26c7a3390f7824e46ab6d518530d117115a1
```

The existing approved-English and multilingual-V1 regression workflow also passed on the same code head:

```text
Validate INT-CP-001 multilingual parity
Run:        30419087814
Conclusion: PASS
```

## Exhaustive V2 audit

```text
21 QLs × 80 seeds × 2 locales = 3,360 localized questions
English parity checks:              3,360
V1-to-V2 invariant checks:          3,360
Deterministic regeneration checks:  3,360
Cash-flow checks:                   3,360
Distractor checks:                 10,080
V2 contradictions:                      0
```

Hindi:

```text
generated:                         1,680
changed stems:                     1,389
legacy defects detected:           1,334
borrower packages:                 1,086
investment packages:                594
borrower amount-wording checks:    1,086
unclassified source scenarios:         0
V2 contradictions:                    0
answer positions:           421/419/419/421
```

Punjabi:

```text
generated:                         1,680
changed stems:                     1,300
legacy defects detected:           1,176
borrower packages:                 1,086
investment packages:                594
borrower amount-wording checks:    1,086
unclassified source scenarios:         0
V2 contradictions:                    0
answer positions:           421/419/419/421
```

All eleven source-scenario families were exercised in both languages.

## Review evidence

The evidence artifact contains:

```text
Hindi:    21 QLs × 3 seeds = 63 V1-versus-V2 review rows
Punjabi:  21 QLs × 3 seeds = 63 V1-versus-V2 review rows
Total:                         126 review rows
```

Each row displays the superseded V1 stem, proposed V2 stem, scenario ID, cash-flow direction, options, answer, four-tier explanation and distractor analysis.

## Lifecycle boundary

Every V2 package remains:

```text
maturity:                    MULTILINGUAL_EDITORIAL_PATCH_CANDIDATE
reviewStatus:                PENDING_MULTILINGUAL_REVIEW
localeReviewStatus:          PENDING_HUMAN_REVIEW
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
questionStudioDiscoverable:  false
```

V2 requires explicit human approval. This record does not merge the PR, publish questions, write to Question Bank, enable tests or expose Question Studio routing.
