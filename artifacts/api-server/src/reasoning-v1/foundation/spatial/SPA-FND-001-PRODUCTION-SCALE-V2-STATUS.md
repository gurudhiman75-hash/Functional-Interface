# SPA-FND-001 — Production Scale V2

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_PROOF_AND_EDITORIAL_REVIEW`

This slice is stacked on Production Synthesis V1 exact head `0bb9fbe50682b36599852a337cced76c8d1141af`. Production Synthesis V1 remains unmerged and was not reclassified as user-approved by this continuation.

## Goal

Prove that the spatial synthesis architecture can produce a Question-Studio-sized review bank without counting option shuffles or globally rotated copies as new content.

Target stress scale:

```text
FAN-001: 500 unique accepted candidates
FCL-001: 500 unique accepted candidates
FSR-001: 500 unique accepted candidates
Total:   1,500
Correct slots/chapter: A125 / B125 / C125 / D125
```

## FCL capacity expansion

The V1 strict canonical primitive-ID catalog has finite capacity and cannot honestly support a 500-question FCL stress batch. V2 expands from canonical safe quartets into rendered primitive instances.

Each canonical primitive may contribute only visually distinct quarter-turn instances. A circle or other quarter-turn-invariant primitive therefore remains one visual instance; orientation-sensitive primitives may contribute more.

Every expanded quartet is re-audited using instance-aware vertical/horizontal/180° symmetry plus a new `VISIBLE_ORIENTATION_CLASS` descriptor. A quartet is rejected when a learner could answer it through a simpler three-upright/one-rotated cue or another competing visible minority.

## Global-rotation identity

Rotating all four classification options together does not create a new question. For each candidate quartet, V2 renders the quartet under common 0°, 90°, 180° and 270° rotations, sorts its option fingerprints and chooses the canonical minimum as `globalRotationOrbitFingerprint`.

FCL content identity includes this orbit fingerprint, so globally rotated copies deduplicate to one content item.

## Production selection

FCL family scheduling remains capacity-aware. Each family catalog is deterministically shuffled from the seed prefix and consumed without replacement, eliminating duplicate-retry pressure inside the FCL scale bank.

FAN and FSR reuse their independently validated V1 generators and retain explicit generation/duplicate rejection telemetry.

## Required proof gates

- 500 accepted unique candidates in FAN, FCL and FSR;
- exact A125/B125/C125/D125 balance in every chapter;
- all 26 synthesis families represented;
- deterministic replay from the same seed prefix;
- alternate seed prefix changes delivery;
- FCL instance catalog capacity exceeds the canonical catalog and is at least 500;
- no duplicate global-rotation-normalized FCL contents;
- instance-level property vector remains exactly 3/1;
- no competing instance descriptor;
- no disallowed student-visible orientation shortcut;
- crossing presentation remains free of vertical/horizontal/180° whole-figure symmetry;
- responsive 26-family editorial review export;
- all prior spatial regression gates;
- lifecycle isolation.

Required marker:

`PASS_SPA_FND_001_PRODUCTION_SCALE_V2`

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

This slice does not authorize merge, permanent QL allocation, Question Studio activation, database writes, localisation, mock-test eligibility or publication.
