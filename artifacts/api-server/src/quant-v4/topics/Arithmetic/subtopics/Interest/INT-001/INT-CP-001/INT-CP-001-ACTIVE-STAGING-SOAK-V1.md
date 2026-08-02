# INT-CP-001 — Active Staging Soak V1

Status: **passed non-registration soak; central registration remains prohibited**  
Provider: `INT-001:INT-CP-001:APPROVED-ACTIVE-STAGING-V3`  
Pre-registration adapter: isolated and not exported through the shared Quant V4 registry or route

## Purpose

This checkpoint stress-tests the approved V6 Active Staging provider and its isolated Question Studio-shaped adapter before any central registration is authorised.

## Soak volume

```text
Maximum-size package batches:      9
Questions in large batches:    9,000
Explicit-QL runs:                  63
Questions in explicit-QL runs: 1,575
Total generated questions:    10,575
```

The nine large batches cover English, Hindi and Punjabi at package-level Easy, Medium and Hard, with 1,000 questions per batch.

The explicit-QL phase covers all 21 permanent QLs, 25 questions per QL and all three languages.

## Proof contract

The soak verifies:

- byte-for-byte deterministic replay of every maximum-size batch;
- JSON-safe questions, packages and envelopes;
- all 21 QLs in every language;
- option-value, correct-index and mathematical-fingerprint parity;
- bounded difficulty selector attempts;
- bounded provider seed recovery;
- lifecycle locks on every response;
- actual shared Quant V4 registry absence before and after generation;
- byte-identical central registry before and after all 10,575 questions.

## Strengthened executable proof

```text
Head:       1a45ae33fd8b158f79f31536d8541ecc622a0ff0
Workflow:   Validate INT-CP-001 active staging soak V1
Run:        30747923828
Conclusion: PASS
Artifact:   8833764004
Digest:     sha256:f1e5b3abf9a3912cb9c2916cf1f34d994fda51fcda62e585e968345834be8362
```

```text
Large-batch runs:                  9
Large-batch questions:         9,000
Explicit-QL runs:                 63
Explicit-QL questions:         1,575
Total questions:              10,575
Deterministic replay checks:      18
Lifecycle checks:                 72
JSON checks:                      72
Cross-language parity checks:  1,050
Central-registry checks:           3
Maximum selector attempts:        50 / 96
Maximum provider attempts:         2 / 32
```

The central registry digest remained identical:

```text
Before: 306d272412418f83d5cdcda0e5974851c4ebf3b92379c946bcae011591abff4a
After:  306d272412418f83d5cdcda0e5974851c4ebf3b92379c946bcae011591abff4a
```

## Lifecycle boundary

```text
enabled:                     true
stagingStatus:               ACTIVE_STAGING
registrationStatus:          NOT_REGISTERED
centralRegistryContainsInt001:false
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

`enabled: true` is confined to the internal Active Staging provider. This record does not authorise central Question Studio registration, shared-route exposure, Question Bank storage, test use or publication.

## Next boundary

CP-001 is technically ready for a future central registration change, but that change remains blocked until explicit human authorisation. No additional CP-001 integration action should bypass this lock.
