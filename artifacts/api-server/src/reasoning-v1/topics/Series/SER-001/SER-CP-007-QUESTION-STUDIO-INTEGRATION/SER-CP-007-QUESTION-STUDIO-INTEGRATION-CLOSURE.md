# SER-CP-007 — Question Studio Integration Closure

Status: `COMPLETE_QUESTION_STUDIO_REVIEW_INTEGRATION`

Authority: `SER_CP007_QUESTION_STUDIO_REVIEW_RUNTIME_V1`

## Final result

`SER-001` is now an active, discoverable Question Studio package for multilingual editorial review.

The package is available through the existing admin Question Studio capability and generation surfaces with:

```text
Package:                     SER-001
Canonical problem:           SER-CP-007
Runtime mode:                FROZEN_REVIEW
Review status:               APPROVED_MULTILINGUAL_FROZEN
Languages:                   en, hi, pa
Locales:                     en-IN, hi-IN, pa-IN
Frozen templates:            140
Permanent QLs:               SER-QL-001..SER-QL-013
Maximum admin batch size:    50
Generation domain:           reasoning-v1
```

## Implemented surfaces

### Runtime activation

The Question Studio runtime wraps the already approved inactive readiness projection. It activates only the admin review surface:

```text
active:                      true
questionStudioDiscoverable:  true
```

The frozen source authority and permanent registry remain unchanged and inactive. Their original lifecycle state is retained in each generated payload as source provenance.

### Reasoning V1 generation engine

`reasoning-v1/generation-engine.ts` provides:

- one discoverable `SER-001` package;
- deterministic seeded generation;
- English, Hindi and Punjabi selection;
- permanent QL targeting through `questionLanguageId`;
- canonical-problem validation;
- frozen runtime-mode validation;
- bounded batches;
- reviewed stems, options, answers and explanations.

### Admin Question Studio integration

`admin-question-studio-series.ts`:

- combines Quant V4 and Reasoning V1 capabilities;
- exposes `SER-001` without removing existing Quant packages;
- dispatches only `SER-001` generation to Reasoning V1;
- delegates all non-Series runs to the existing Quant router;
- stores generated Series items in the existing review-run tables;
- preserves authority, subtype, task and rendering metadata;
- records audit and outbox events under the existing Question Studio workflow.

The Series router is mounted before the legacy Quant-only router so the combined capability response is authoritative while legacy Quant generation remains unchanged.

## Downstream safety boundary

Question Studio review activation does not authorize release.

Every Series review payload remains:

```text
questionBankStatus:          NOT_STORED
questionBankWritable:        false
testEligibility:             INELIGIBLE
testEligible:                false
publiclyPublishable:         false
```

The shared Question Bank converter independently rejects every Series review payload because `questionBankStatus` is `NOT_STORED`.

No Series item can enter the Question Bank, test assembly or public delivery through this integration.

## Executable proof

The protected workflow proved:

```text
Frozen templates:                         140
Permanent QLs:                             13
Live multilingual review payloads:        420
Payloads per locale:                      140
Permanent QL coverage per locale:          13
Option-integrity proofs:                  420
Review-activation proofs:                 420
Downstream-lock proofs:                   420
Question Bank rejection proofs:          420
Targeted QL generation proofs:             39
Deterministic multilingual batch proofs:    3
Admin capability proofs:                    1
Admin dispatch proofs:                      1
Route-mount proofs:                         1
```

It also built the complete API server successfully and uploaded permanent workflow evidence.

## Workflow evidence

```text
Workflow: Validate SER-001 Question Studio integration
Run:      31245183631
Head:     a026d02e62846f106ddfe5bf159e97dc349bbafa
Job:      validate-review-only-integration
Result:   SUCCESS
```

## Completion boundary

The Series chapter is complete for Question Studio review integration.

Any future change that makes Series Question Bank writable, test eligible or publicly publishable is a separate release decision. It must receive independent approval and must not be inferred from this closure.
