# INT-001 / INT-CP-001 Inactive Release-Readiness Checkpoint

Status: **CI-PROVEN, INACTIVE, NOT REGISTERED**

## Approved authorities

```text
English:  INT-CP-001-EN-v3
Hindi:    INT-CP-001-HI-v2
Punjabi:  INT-CP-001-PA-v2
QL range: INT-QL-001..INT-QL-021
```

## Provider contract

```text
providerId:                    INT-001:INT-CP-001:APPROVED-INACTIVE-V1
packageId:                     INT-001
canonicalProblemId:            INT-CP-001
runtimeMode:                   APPROVED_INACTIVE_RELEASE_PROOF
enabled:                       false
registrationStatus:            NOT_REGISTERED
questionStudioDiscoverable:    false
questionBankStatus:            NOT_STORED
testEligibility:               INELIGIBLE
publiclyPublishable:           false
```

Implementation authority:

`cp001-inactive-release-provider.ts`

The provider supports:

- explicit permanent-QL generation;
- deterministic seeded QL selection;
- English, Hindi and Punjabi approved release selection;
- deterministic multi-question batches;
- a production-shaped Question Studio preview envelope;
- exact release, QL, language and seed traceability;
- strict invalid QL, language and missing-seed rejection.

The approved question object is preserved unchanged inside a separate provider envelope.

## Central-engine isolation

This checkpoint deliberately does not modify `generation-engine.ts` or `generation-engine-core.ts`.

The readiness audit requires `listQuantV4Packages()` to contain no `INT-001` entry. Therefore the provider cannot appear in Question Studio capabilities or be invoked through the public generation route.

## Exact-head proof

```text
Implementation head: 80ead4f22ffaecaf76d3da9bc31f8615cb801a38
Workflow:            Validate INT-CP-001 inactive release readiness
Run:                 30420488876
Conclusion:          PASS
Artifact:            8711719059
Digest:              sha256:d2d73bb27399eae665a78201c8eb3c95e4a15a31c93593acb9fb85a910026730
```

## Exhaustive evidence

```text
21 QLs × 60 seeds × 3 languages = 3,780 direct packages
Deterministic envelope checks:          3,780
Deterministic preview checks:           3,780
Release-ID checks:                      3,780
Production-shape checks:                3,780
Lifecycle-lock checks:                  3,780
Distractor checks:                     11,340

Deterministic batch runs:                   36
Batch packages:                          1,512
Batch determinism checks:                   36
```

Distinct stems:

```text
English:  1,239
Hindi:    1,235
Punjabi:  1,235
```

All 21 QLs and all four answer positions were exercised in every language. Superseded Hindi/Punjabi V1 release output was rejected.

The workflow also reran the exhaustive approved multilingual V2 regression:

```text
Approved V2 localized questions:       3,360
Candidate-to-approved identity checks: 3,360
English parity checks:                 3,360
Distractor checks:                    10,080
```

## Next deliberate gate

Central provider registration requires separate explicit approval. That later gate would modify the shared generation engine and expose `INT-001` to Question Studio capabilities while still retaining Question Bank, test and public-publication locks unless separately approved.

This checkpoint does not authorise registration, merging, storage, tests or publication.
