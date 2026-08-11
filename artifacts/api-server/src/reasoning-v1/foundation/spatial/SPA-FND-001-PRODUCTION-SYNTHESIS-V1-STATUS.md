# SPA-FND-001 — Production Synthesis V1

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_PROOF_AND_EDITORIAL_REVIEW`

This slice starts from the user-approved FSR-001 exact head `bf026fa1714cc927471db5aefdc05a33751cb440` and adds lifecycle-isolated deterministic candidate synthesis for FAN-001, FCL-001 and FSR-001.

## Scope

Production Synthesis V1 separates:

1. deterministic candidate construction;
2. independent chapter validation;
3. explicit rejection telemetry;
4. order-independent content deduplication;
5. delivery-order identity;
6. family / correct-slot scheduling;
7. editorial review export.

A failed seed returns a rejected attempt with a code and message. The batch scheduler may try a new seed only after recording that rejected attempt.

## Family authority

```text
FAN-001: 4 transform families
FCL-001: 12 primitive classification families
FSR-001: 10 approved series families
Total:   26 synthesis families
```

FCL production synthesis and the fixed FCL V2 proof now use the same exported quartet builder, property authority and 17-descriptor competing-minority audit.

FSR production synthesis reuses the approved FSR proof generator, visible-role-aware rule inference and independent rendered-transition validator. Quarter-turn-sensitive primitives are used for the controlled production families so an extra hidden 90° transform cannot disappear inside a symmetric main figure.

FAN production synthesis reuses Primitive Library V2 instances and the shared complete transform authority. An asymmetric marker makes all transform candidates observable, and A→B is independently solved across the complete transform candidate set before C options are accepted.

## Identity model

`contentFingerprint` is exact and order-independent with respect to answer delivery. Shuffling the same four options does **not** create a new content item.

`deliveryFingerprint` includes ordered options and the correct option slot. It is intentionally separate from content identity.

The proof export may show SHA-256 digests of these exact fingerprints for compact traceability; deduplication itself uses the full semantic fingerprint strings.

## Stress target

```text
Accepted FAN candidates: 96
Accepted FCL candidates: 96
Accepted FSR candidates: 96
Total accepted:          288
Correct slots/chapter:   A24 / B24 / C24 / D24
Representative review:   26 samples (one per family)
```

Required checks:

- deterministic replay from the same seed prefix;
- materially different output for a different seed prefix;
- no duplicate content fingerprints in a chapter batch;
- answer-order changes excluded from content identity;
- delivery fingerprints remain order-sensitive;
- exact correct-slot balance;
- complete family coverage;
- FCL competing-minority ambiguity rejection;
- representative responsive HTML/JSON review;
- complete previous spatial regression stack;
- lifecycle isolation.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

Required marker:

`PASS_SPA_FND_001_PRODUCTION_SYNTHESIS_V1`

This slice does not authorize merge, permanent QL allocation, Question Studio activation, database writes, localisation, mock-test eligibility or publication.
