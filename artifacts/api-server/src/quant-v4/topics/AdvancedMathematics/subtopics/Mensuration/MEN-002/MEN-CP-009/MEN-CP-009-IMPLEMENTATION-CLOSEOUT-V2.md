# MEN-CP-009 — Spheres & Hemispheres Implementation Closeout V2

## Authority

```text
MEN-CP009-COVERAGE-CLOSURE-V2
```

## Final engineering verdict

```text
IMPLEMENTATION_COMPLETE__EXPLICIT_SOLVE_MODES_CLOSED__ACTIVATION_LOCKED
```

V2 supersedes the V1 implementation inventory for completion reporting. V1 established the direct, inverse, application, comparison and scaling runtime. V2 closes the missing surface-area-to-volume solve-mode axis discovered during final self-review.

## Permanent inventory

```text
Permanent QLs:                 28
Range:                         MEN-002-QL-096..MEN-002-QL-123
Base V1 QLs:                   24
Coverage-closure QLs:           4
Deterministic proof packages:  2,240
English review records:          112
Review records per QL:             4
Answer positions:              A28 B28 C28 D28
```

## V2 additions

```text
MEN-002-QL-120
Surface area : volume for a sphere or hemisphere curved surface

MEN-002-QL-121
Radius from sphere/hemisphere curved-surface-area : volume

MEN-002-QL-122
Hemisphere total surface area : volume

MEN-002-QL-123
Hemisphere radius from total-surface-area : volume
```

These families use formula cancellation rather than independent numerical evaluation:

```text
Sphere surface area : volume
4πr² : (4/3)πr³ = 3:r

Hemisphere CSA : volume
2πr² : (2/3)πr³ = 3:r

Hemisphere TSA : volume
3πr² : (2/3)πr³ = 9:2r
```

Direct and inverse answer semantics remain separate. Sphere and hemisphere curved-surface forms share one family because cancellation produces the same decisive reasoning. Hemisphere total surface area remains separate because the flat base changes the coefficient and misconception structure.

## Original solve-mode closure

All eight solve-mode groups from the original CP-009 authority now have an explicit disposition:

- direct sphere surface/volume — implemented;
- inverse sphere radius — implemented;
- hemisphere CSA/TSA — implemented;
- hemisphere volume — implemented;
- sphere/hemisphere comparisons — implemented;
- spherical shell material — reassigned and implemented in CP-011;
- number of small spheres after transformation — reassigned to CP-012;
- surface-area-to-volume ratio — implemented by V2.

No original solve-mode group remains unimplemented or silently omitted.

## Runtime guarantees

- exact cancellation with no floating-point ratio authority;
- deterministic state generation;
- four unique misconception-derived options;
- all answer positions for every QL;
- materially separate formula reconstruction;
- five-part learner teaching surface;
- responsive sphere and hemisphere diagrams;
- internal taxonomy isolation;
- permanent identity and lifecycle locks.

## Product boundary

```text
questionStudioDiscoverable: false
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
```

No human English approval, direct-source normalization, Hindi/Punjabi parity or product-release approval is asserted.
