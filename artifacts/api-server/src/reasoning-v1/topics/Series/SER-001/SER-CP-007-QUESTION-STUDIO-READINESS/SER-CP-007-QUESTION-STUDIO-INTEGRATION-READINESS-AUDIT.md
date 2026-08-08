# SER-CP-007 — Question Studio Integration Readiness Audit

Status: `IMPLEMENTED_PENDING_WORKFLOW_PROOF`

Authority: `SER_CP007_QUESTION_STUDIO_INTEGRATION_READINESS_AUDIT_V1`

## Purpose

This checkpoint proves that the frozen Series chapter can be projected into the payload shape required by the Question Studio and later Question Bank conversion pipeline without activating any lifecycle gate.

It is an integration-readiness checkpoint only. It does not register Series in Question Studio discovery, write any question to the Question Bank, make any item test-eligible, or publish any item.

## Frozen source inventory preserved

```text
Chapter:                              SER-001
Checkpoint:                           SER-CP-007
Frozen temporary templates:          140
Approved permanent solve contracts:   13
Permanent QL range:        SER-QL-001..SER-QL-013
English manual freeze:                APPROVED
Hindi manual freeze:                  APPROVED
Punjabi manual freeze:                APPROVED
Locales projected:            en-IN, hi-IN, pa-IN
Projected payloads per proof seed:    420
```

## Implemented readiness projection

`ser-cp-007-question-studio-readiness.ts` now builds a deterministic read-only projection from the frozen English and localized runtimes.

Every projection carries:

- permanent QL identity;
- temporary template identity and seed;
- approved authority and subtype identity;
- learner renderer and task kind;
- locale and language;
- learner stem, four options, keyed answer and reviewed explanation;
- release-pool and rendering metadata where present;
- a nested `generationContext` compatible with the current generated-question metadata path.

The projection validates permanent identity, template provenance, learner-facing content, option integrity and the inactive lifecycle boundary before returning a payload.

## Lifecycle lock

Every projected item is deliberately emitted with:

```text
integrationStatus:          READINESS_PROVEN_INACTIVE
runtimeMode:                INACTIVE_INTEGRATION_PROOF
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
active:                     false
questionStudioDiscoverable: false
questionBankWritable:       false
testEligible:               false
publiclyPublishable:        false
```

The current Question Bank converter must reject every readiness payload because `questionBankStatus` is `NOT_STORED`.

## Executable proof scope

The readiness test must prove, for one deterministic seed:

```text
English projections:                  140
Hindi projections:                    140
Punjabi projections:                  140
Total projections:                    420
Permanent QL coverage per locale:      13
Option-integrity proofs:              420
Subtype/provenance proofs:            420
Lifecycle-lock proofs:                420
Question Bank rejection proofs:       420
Deterministic regeneration proofs:      1
```

The test also proves that no duplicate template-seed-locale identity is produced and that all 13 permanent QLs are represented in every locale.

## Deliberately not implemented

The following remain outside this checkpoint:

1. adding Series to a Question Studio discovery registry;
2. changing the permanent registry lifecycle flags;
3. exposing any Series generator through an admin route;
4. allowing Question Bank conversion;
5. permitting test assembly or publication;
6. changing the approved English, Hindi or Punjabi learner content;
7. allocating `SER-QL-014` or any new permanent identity.

## Readiness result

The chapter is structurally ready for a separately approved integration proposal once the executable workflow is green. Readiness is not activation.

## Next authority

```text
SER_CP007_QUESTION_STUDIO_INTEGRATION_PROPOSAL_PENDING_EXPLICIT_ACTIVATION_APPROVAL
```

That proposal must identify the exact discovery registry, admin generation route, review UI contract and rollback boundary before any lifecycle field can change. It must preserve `questionBankWritable: false`, `testEligible: false` and `publiclyPublishable: false` unless those downstream gates receive their own explicit approvals.
