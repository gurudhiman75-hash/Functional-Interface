# SPA-FND-001 — Gap Question Production Scale V1

## Status

`PASS_SPA_FND_001_GAP_QUESTION_PRODUCTION_SCALE_V1`

This checkpoint proves high-volume learner-question capacity for the nineteen source-backed remediation families in `FAN-001`, `FCL-001` and `FSR-001` while preserving all lifecycle locks.

Validated implementation head before this status-only commit:

`a476b0463d143c159d99b43525ae405c6dd8416f`

Baseline remains Production Scale V2 exact head:

`caff1d753358a0a9b12e8c892c391adbb007eab8`

## Why this scale proof is stricter than fingerprint uniqueness

The earlier learner-synthesis checkpoint proved 40 questions per gap, but the underlying runtime seed also changes small coordinates, stroke width and radius values. Those changes can make fingerprints unique without producing materially different exam questions.

Production Scale V1 therefore adds a controlled **material composition profile** after the learner rule is constructed. The profile changes visible component proportions or subfigure geometry while preserving the solved rule, options and explanation contract.

This prevents cosmetic seed noise from being treated as the principal source of production capacity.

## Scale result

Workflow:

`Validate SPA-FND-001 Gap Question Production Scale V1`

Run:

`31685228308` — PASS

Marker:

`PASS_SPA_FND_001_GAP_QUESTION_PRODUCTION_SCALE_V1`

```text
Audited gap families:      19
Requested per gap:        200
Accepted:                 3800
Attempts:                 3951
Canonical duplicate rejects: 151
Material-profile rejects:    0

FAN-001: 1000
FCL-001: 1200
FSR-001: 1600

Global correct slots:
A950 / B950 / C950 / D950

Every individual gap:
A50 / B50 / C50 / D50
```

Every accepted question contains four independently unique visual options and every scene passes the existing spatial validator.

## Material profile authority

### Standard remediation families

Eighteen of the nineteen families use a controlled `ROLE_SCALE_GRID`.

Declared profile capacity per family:

`216`

The grid varies visible proportions of component A, component B, components C/D and dot geometry **after** the chapter rule has been built. Every one of these eighteen families accepted 200/200 attempts with zero canonical duplicate rejects.

### FCL-GAP-06 — internal mirror/rotation relation

This family is structurally narrower because multiple source shapes become equivalent after reflection/rotation normalization and unordered option-set comparison.

The first scale attempt used 256 simple aspect-ratio profiles and correctly failed:

```text
Accepted:   169 / 200
Profiles:   256 exhausted
Duplicates: 87
```

The 200-question target was **not reduced** and no meaningless stroke/position noise was introduced.

The family was remediated with `FCL_SUBFIGURE_EQUIVARIANT_GRID`:

```text
Horizontal aspect levels: 16
Vertical aspect levels:   16
Bend levels:               8
Declared capacity:      2048
```

The bend transformation is reflection-equivariant: it changes asymmetric subfigure geometry while commuting with vertical reflection. Therefore the three common options remain genuine mirror pairs instead of merely being cosmetically different.

Final scale result for `FCL-GAP-06`:

```text
Accepted:              200
Attempts:              351
Canonical duplicates: 151
Material rejects:        0
Declared profile capacity: 2048
```

This retry pressure is retained as an explicit capacity characteristic. It should not be hidden when permanent learner archetypes are consolidated.

## Per-family production result

Every family except `FCL-GAP-06`:

```text
Accepted:   200
Attempts:   200
Duplicates:   0
```

`FCL-GAP-06`:

```text
Accepted:   200
Attempts:   351
Duplicates: 151
```

Total:

```text
Accepted:   3800
Attempts:   3951
Duplicates: 151
```

## Proof gates passed

- exact nineteen-gap coverage;
- 200 accepted material learner questions per gap;
- 3,800 globally unique learner-question content fingerprints;
- 3,800 globally unique delivery fingerprints;
- four unique options for every accepted question;
- all materialized scenes validate;
- deterministic full replay;
- alternate seed divergence;
- exact per-gap A/B/C/D balance of 50/50/50/50;
- global A/B/C/D balance of 950/950/950/950;
- material-profile identity is unique inside each family;
- earlier 760-question learner synthesis revalidation passes;
- Production Authority and Source Saturation validations pass;
- lifecycle locks remain intact.

## Review artifact

```text
Name:   spa-gap-question-production-scale-v1-review
ID:     9175150291
Digest: sha256:4d3c9692eec61f79872dffcae6927511eefb2acd82990338097c79feee0b5beb
Size:   41612 bytes
```

The artifact contains:

- production-scale evidence JSON;
- expanded review JSON;
- responsive HTML review;
- two representative material profiles per gap = **38 review questions**.

Review state deliberately remains:

```text
EXPANDED_SCALE_ARTIFACT_READY_HUMAN_REVIEW_PENDING
English freeze: HUMAN_REVIEW_PENDING
Mobile review:  HUMAN_REVIEW_PENDING
```

A successful scale test is not treated as human editorial approval.

## Current maturity boundary

For the nineteen remediation families we now have:

```text
Source-backed gap authority:        PASS
Reusable runtime capability:       SCALE VALIDATED
Learner-question synthesis:         VALIDATED
Learner-question production scale:  VALIDATED (200/gap)
Human English freeze:               PENDING
Human mobile/visual review:         PENDING
Permanent QL allocation:            NOT DONE
Question Studio activation:         NOT DONE
```

Production-scale validation does **not** imply that nineteen permanent QLs should exist. Several technical gap families may belong to the same learner solve pattern and must be merged/split using exam behavior, solver method and source evidence rather than implementation IDs.

## Exam-scope lock

The previous source-saturation boundary remains unchanged:

```text
SSC:                controlled taxonomy evidence established
RRB/Police/DSSSB:   supporting evidence present
Banking:            NOT ESTABLISHED
Punjab state:       NOT ESTABLISHED
```

This checkpoint does not grant Banking or Punjab-state mock eligibility.

## Lifecycle lock

```text
Permanent QLs:                0
Discovery frozen:             false
English human freeze:         false
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
Hindi/Punjabi generation:     false
API/database schema changes:  none
```

No registry, API, database or student-facing route is activated.

## Next gate

`SPATIAL_ARCHETYPE_CONSOLIDATION_AND_PERMANENT_QL_PROPOSAL_V1`

The next phase should **propose, not allocate**, the permanent QL structure by consolidating the current normalized learner archetypes and nineteen remediated mechanisms according to:

1. distinct exam ask;
2. distinct learner solving method;
3. meaningful difficulty/progression boundary;
4. source/PYQ support;
5. generator and production-scale evidence;
6. merge of purely technical variants that do not change the learner method;
7. explicit treatment of the lower canonical efficiency of `FCL-GAP-06`.

Permanent QL IDs, Question Studio discovery and publication must remain locked until the proposal is reviewed and explicitly approved.