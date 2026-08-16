# SPA-FND-001 — Permanent QL Allocation V1

## Status

`PRODUCT_OWNER_APPROVED_PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN`

The final 30-QL English/mobile Spatial review was explicitly approved on 2026-08-15 after the MIR distractor remediation and Question 2 look-alike correction.

Approved evidence is pinned to:

```text
Reviewed source head:  5bd56352a6f2394df9f4f83d09f90638292f05bc
Human-review workflow: Validate SPA-FND-001 Proposed QL Human Review V1
Workflow run:          31879721096
Artifact ID:           9245701817
Artifact digest:       sha256:b565bd45cb003a362bd927e0115a1c3303563050955577c0dbf1c2669b88a428
Review questions:      120
Active learner QLs:    30
```

## Permanent allocation

```text
MIR-001   SPA-QL-001..003    3
WAT-001   SPA-QL-004..005    2
FAN-001   SPA-QL-006..013    8
FCL-001   SPA-QL-014..022    9
FSR-001   SPA-QL-023..030    8
TOTAL                       30
```

Next available Spatial identity: `SPA-QL-031`.

The permanent allocation follows the approved PQL order exactly. Proposal handles remain historical traceability IDs and are not reused as permanent IDs.

## Approved MIR quality boundary

The approved Mirror Images runtime includes the final premium distractor contract:

- the correct answer and premium near-answer preserve the same outer/main figure;
- external orientation marks and markers remain identical;
- exactly one internal secondary property may differ;
- polygon/line differences are judged by true rendered-outline separation rather than vertex ordering;
- the final threshold rejects the Question 2 approximately-2-unit look-alike while retaining legitimate compact inner differences at 5+ SVG units;
- semantic and perceptual uniqueness remain mandatory.

This quality boundary is part of the pinned approved English authority.

## Holds remain outside allocation

- `WAT-HOLD-P01` — analog clock water-image diagram
- `FCL-HOLD-P01` — letter/symbol identity-set replacement

Neither receives a permanent QL in V1.

## Source-scope boundary remains unchanged

```text
SSC:                CONTROLLED_TAXONOMY_EVIDENCE_ESTABLISHED
RRB/Police/DSSSB:   SUPPORTING_EVIDENCE_PRESENT
Banking:            NOT_ESTABLISHED
Punjab state:       NOT_ESTABLISHED
```

Permanent allocation does not convert an unestablished source scope into an established one.

## English freeze

All `SPA-QL-001..030` are bound to the approved review head and marked:

```text
englishImplementationFrozen: true
allocationStatus: PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN
```

This freezes the reviewed English learner authority and permanent identities. It does not authorize multilingual generation or delivery activation.

## Delivery lifecycle remains locked

```text
active:                            false
Question Studio discoverable:      false
Question Studio registration:      NOT_REGISTERED
Question Bank writable:            false
test/mock eligibility:             false
publicly publishable:              false
Hindi/Punjabi generation:          false
```

The product-owner approval recorded here closes the human English/mobile review and permanent-allocation gate only.

## Next gate

`SPATIAL_QUESTION_STUDIO_ACTIVATION_APPROVAL_V1`

Question Studio registration/discovery must be an explicit separate product checkpoint. No activation is implied by this allocation.
