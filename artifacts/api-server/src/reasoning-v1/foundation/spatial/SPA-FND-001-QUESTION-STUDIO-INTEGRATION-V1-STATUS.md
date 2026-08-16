# SPA-FND-001 — Question Studio Integration V1

## Status

`QUESTION_STUDIO_INTEGRATION_IMPLEMENTED_VALIDATION_PENDING`

This checkpoint is stacked on merged permanent allocation authority commit:

`f35733f2ad7b5add11be51390c387513dc2d9886`

It activates the approved 30 permanent English Spatial QLs for **Question Studio review only**.

## Registered curriculum

```text
MIR-001   SPA-QL-001..003    3
WAT-001   SPA-QL-004..005    2
FAN-001   SPA-QL-006..013    8
FCL-001   SPA-QL-014..022    9
FSR-001   SPA-QL-023..030    8
TOTAL                       30
```

`WAT-HOLD-P01` and `FCL-HOLD-P01` remain outside registration.

## Question Studio contract

```text
Package:                       SPA-001
Question Studio visible:       true
Question Studio discoverable:  true
Registration:                  REGISTERED
Runtime:                       APPROVED_PERMANENT_ENGLISH_SPATIAL_V1
Language:                      English only
Persistence to review queue:   true
Question Bank writes:          false
Test/mock eligibility:         false
Public/student publication:    false
Hindi/Punjabi generation:      false
Bulk sync:                     false
```

The permanent allocation authority itself remains immutable. Question Studio activation is represented by a separate integration authority rather than rewriting the earlier frozen allocation checkpoint.

## Runtime generation

The runtime uses the same validated Spatial engines that supported the approved curriculum and scale proofs:

- mirror/water transformation and string geometry;
- mirror-clock diagram geometry;
- arbitrary 45°/135° figure analogy rotation;
- learner-safe gap generators;
- FCL safe geometric-form generation;
- primitive FCL synthesis;
- FSR production synthesis.

Every accepted Studio question is revalidated for scene validity, semantic option uniqueness, perceptual option uniqueness and learner-visible explanation safety before SVG rendering.

## Review persistence

Spatial runs use the standard Question Studio generation-run tables and audit/outbox path. Stored payloads explicitly carry:

```text
questionBankStatus:   NOT_STORED
questionBankWritable: false
reviewOnly:            true
testEligible:          false
publiclyPublishable:   false
```

The review approval policy has been backported onto this Spatial stack so marking such an item `approved` records editorial approval without converting it into Question Bank.

## Source-scope lock

```text
SSC:                controlled taxonomy evidence established
RRB/Police/DSSSB:   supporting evidence present
Banking:            NOT ESTABLISHED
Punjab state:       NOT ESTABLISHED
```

Question Studio registration does not broaden source claims.

## Validation target

Dedicated CI must pass both API and admin-app production builds and execute the Question Studio integration proof across all 30 permanent QLs before this checkpoint can be called complete.
