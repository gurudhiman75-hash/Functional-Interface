# RNK-CP-004 — Question Studio Capability Registration

Status: **DISCOVERY-ONLY REGISTRATION IMPLEMENTED; GENERATION AND PERSISTENCE REMAIN DISABLED**.

## Purpose

Register the frozen RNK-001 / RNK-CP-004 English capability in the shared Question Studio capability response without enabling any live generation, database persistence, approval, Question Bank conversion, test use or publication path.

This phase deliberately separates **discoverability** from **execution**.

## Frozen authority

```text
package:              RNK-001
checkpoint:           RNK-CP-004
freeze state:         ENGLISH_DISCOVERY_FREEZE_READY
freeze version:       RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
runtime version:      RNK_CP004_PERMANENT_RUNTIME_V1
permanent QL range:   RNK-QL-027..035
permanent QL count:   9
permanent questions:  1,728
projection SHA-256:   39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

## Registered capability

The shared Reasoning V1 registry exposes the package with the following lifecycle contract:

```text
enabled:                   false
runtimeMode:               DISCOVERY_ONLY
generationAllowed:         false
persistenceAllowed:        false
approvalAllowed:           false
questionBankStatus:        NOT_STORED
testEligibility:           INELIGIBLE
publiclyPublishable:       false
supportedLanguages:        en only
localizationStatus:        NOT_STARTED
screenReaderValidation:    PENDING_MANUAL_ASSISTIVE_TECHNOLOGY_EXECUTION
```

Question Studio may inspect this metadata, but the normal generation-package selector continues to filter it out because `enabled` is false.

## Server-side hard gate

The generation route checks RNK selectors before generating a run identifier or opening a database transaction.

The following selectors are recognized as RNK requests:

- package ID `RNK-001`;
- pattern IDs containing `RNK-001`;
- topic `Ranking and Order` or equivalent normalized aliases;
- topic `Reasoning` with subtopic `Ranking and Order` or equivalent normalized aliases.

A matching request receives HTTP `409` with code:

```text
REASONING_PACKAGE_DISCOVERY_ONLY
```

The rejection response repeats the non-public lifecycle state. No generation run, generation item, immutable payload version, audit event or outbox event is written.

## Automated proof

The registry test must prove:

- exactly one audited Reasoning V1 package is registered;
- RNK identity and checkpoint range are exact;
- the permanent projection digest is unchanged;
- every lifecycle switch remains closed;
- direct package, pattern and topic/subtopic selectors are blocked;
- Quant packages remain unaffected;
- API build succeeds;
- the frozen CP-004 permanent projection still reproduces.

## Remaining gates

This registration does not complete the RNK release path. The following remain open:

1. human NVDA + Chromium validation;
2. human VoiceOver + Safari validation;
3. explicit approval of a separate live-generation adapter;
4. explicit approval of payload persistence;
5. Question Bank conversion validation;
6. Hindi and Punjabi localization and parity;
7. test eligibility and publication review.

## Safety rule

Do not change `enabled`, `generationAllowed`, `persistenceAllowed`, `approvalAllowed`, `questionBankStatus`, `testEligibility` or `publiclyPublishable` in this phase.

Any future activation must be performed on a separate branch and must retain the frozen projection digest while adding executable adapter, persistence and lifecycle evidence.
