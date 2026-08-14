# SPA-FND-001 — Learner Perceptual / Editorial Remediation V2

## Status

`PASS_SPA_FND_001_LEARNER_PERCEPTUAL_REMEDIATION_V2`

This checkpoint supersedes the old learner-readiness interpretation of the V1 3,800-question material proof. The V1 result remains useful as historical mechanical-generation evidence, but it is **not** the current learner-facing authority because human-style review exposed perceptual ambiguity, weak FAN transfer, underdetermined FSR series and explanation-language defects.

Validated V2 implementation head before this status-only commit:

`01b8f580615eb6d5b01dcd5d991503f57320ae08`

PR: `#708` — branch `design/spa-fnd-001-production-authority-v1`

## Learner remediation principles

V2 makes learner-visible validity a first-class gate rather than an implication of SVG semantics.

- FAN transfer figure C is materially different from A so the learner must transfer the rule rather than copy B.
- FCL requires a declared decisive 3-to-1 cue and rejects competing observable 3-to-1 cues.
- FSR-GAP-03 and FSR-GAP-08 expose four visible frames so movement cycle / alternating-operation inference is established before asking for the next figure.
- Explanations name visible features such as hooked line, triangle, square, circle, dot, arrow, diamond, pentagon or marker; internal labels such as `component A` are rejected.
- Explanations are rejected if they assume shuffled delivery order with wording such as `the first three figures/options`.
- Review figures use a 128 px desktop / 104 px mobile floor.
- Semantic option uniqueness is retained, but a separate 2-unit quantized perceptual signature is also required.

## V2 editorial proof

Marker:

`PASS_SPA_FND_001_GAP_QUESTION_LEARNER_REMEDIATION_V2`

```text
Audited gap families:     19
Requested / family:       40
Accepted:                 760
Attempts:                 760
Duplicate rejects:          0

FAN-001:                  200
FCL-001:                  240
FSR-001:                  320

Correct slots:
A190 / B190 / C190 / D190
```

Every accepted question passes:

- chapter-specific learner contract,
- semantic option uniqueness,
- quantized perceptual option uniqueness,
- FCL competing-cue audit where applicable,
- learner-visible explanation vocabulary,
- shuffled-delivery-safe explanation language,
- four visible frames for FSR-GAP-03 and FSR-GAP-08,
- 104 px minimum learner option size,
- deterministic replay and alternate-seed divergence,
- lifecycle locks.

## V2 perceptual production scale proof

Marker:

`PASS_SPA_FND_001_GAP_QUESTION_PRODUCTION_SCALE_V2`

Workflow run:

`31765107081` — PASS

Exact validated head:

`01b8f580615eb6d5b01dcd5d991503f57320ae08`

```text
Audited gap families:          19
Requested / family:           200
Accepted:                    3,800
Perceptually unique:         3,800
Total attempts:              3,826
Semantic duplicate rejects:      0
Material-profile rejects:        0
Perceptual collision rejects:   26

FAN-001:                     1,000
FCL-001:                     1,200
FSR-001:                     1,600

Correct slots:
A950 / B950 / C950 / D950
```

### Perceptual rejection pressure

The scale engine rejects a material candidate before acceptance when either its four delivered options collapse under the V2 perceptual signature or the complete learner question duplicates a previously accepted perceptual composition.

```text
FAN-GAP-01:   0
FAN-GAP-02:   0
FAN-GAP-03:   0
FAN-GAP-04:   0
FAN-GAP-05:   0

FCL-GAP-01:   0
FCL-GAP-02:   6
FCL-GAP-03:   2
FCL-GAP-04:   0
FCL-GAP-05:   0
FCL-GAP-06:   0

FSR-GAP-01:   0
FSR-GAP-02:   0
FSR-GAP-03:   0
FSR-GAP-04:   9
FSR-GAP-05:   2
FSR-GAP-06:   7
FSR-GAP-07:   0
FSR-GAP-08:   0

Total:        26
```

The target was not reduced and perceptual collisions were not converted into uniqueness by seed labels, profile IDs or cosmetic fingerprint salt.

## Exact-head scale artifact

```text
Name:   spa-gap-question-production-scale-v2-review
ID:     9205997225
Digest: sha256:139c2e33c30c1fe1a112ffc5a9559575c01b8167280aa74613e69003d450fee7
Samples: 38 — first and last accepted material profile for each of 19 families
```

The artifact was rendered and assistant-self-reviewed after CI. FAN, all six FCL families and all eight FSR families remained visually defensible across the two sampled scale extremes. This is **not** a substitute for human approval; English/mobile freeze remains pending.

## Supersession boundary

The old marker `PASS_SPA_FND_001_GAP_QUESTION_PRODUCTION_SCALE_V1` is retained as historical mechanical evidence only.

Current learner-facing machine authority is:

1. `PASS_SPA_FND_001_GAP_QUESTION_LEARNER_REMEDIATION_V2`
2. `PASS_SPA_FND_001_GAP_QUESTION_PRODUCTION_SCALE_V2`

This does not invalidate the lower-level spatial runtime/authority/source proofs.

## Curriculum / lifecycle boundary

The earlier proposal remains proposal-only:

```text
Proposed active learner QL candidates: 30
Permanent QLs allocated:                0
Question Studio discovery:          false
Question Bank writes:               false
Mock-test eligibility:              false
Public publication:                 false
English human freeze:               false
Hindi/Punjabi generation:           false
API/database schema activation:      none
```

Banking and Punjab-state exam scope remain `NOT_ESTABLISHED` under the source-saturation authority.

## Remaining work before permanent QL allocation

V2 closes the learner-perceptual defect in the 19 FAN/FCL/FSR remediation families. It does **not** by itself close all evidence slices of the 30 proposed PQL curriculum.

Still required before permanent allocation:

- complete remaining proposal-level production coverage for MIR/WAT and legacy/mixed FAN/FCL slices,
- retain the WAT analog-clock hold and FCL glyph/symbol hold unless separately resolved,
- produce the final proposed-QL-organized human review packet,
- obtain explicit human English/mobile approval,
- only then allocate permanent QLs and consider Question Studio discovery.

Next gate:

`SPATIAL_PROPOSED_QL_COVERAGE_COMPLETION_AND_HUMAN_REVIEW_V1`
