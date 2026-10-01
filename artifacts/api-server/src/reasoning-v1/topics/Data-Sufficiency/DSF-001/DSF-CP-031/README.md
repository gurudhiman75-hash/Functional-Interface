# DSF-CP-031 — QL002 Reasoning Hindi/Punjabi Localization Review

Date: 2026-10-01

Status: **REVIEW-ONLY multilingual expansion**

## Scope

Adds Hindi and Punjabi review surfaces for the three-statement `DSF-QL-002` reasoning runtime across:

1. Ranking & Order
2. Direction Sense
3. Blood Relations
4. Inequality
5. Seating Arrangement
6. Coding-Decoding
7. Calendar

CP031 does not modify the approved CP018 two-statement localization contract. It reuses CP018's reviewed lane-specific statement/stem renderers and adds a separate three-statement semantic layer.

## Semantic preservation

Localization is rebuilt from structured source data:

- three structured statements;
- the canonical 19-class `semanticKey`;
- five option semantic keys;
- correct index;
- seven subset proof evaluations;
- canonical answer and source generation identity.

Explanations are rendered from the proof object, not translated from English prose.

## Lifecycle boundary

- Question Studio discoverable: **true**
- human language review required: **true**
- Question Bank writable: **false**
- scored test eligible: **false**
- mock-test eligible: **false**
- publicly publishable: **false**
- automatic learner publication: **false**

This checkpoint is not a production release.

## Executable review

`ql002-reasoning-localization-v1.test.ts` generates 5 deterministic source questions per lane, then validates both Hindi and Punjabi versions: **70 localized samples plus English controls**.
