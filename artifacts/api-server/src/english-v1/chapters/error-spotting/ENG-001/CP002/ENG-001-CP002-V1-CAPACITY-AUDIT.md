# ENG-001-CP002 V1 Capacity Audit

Status: `V1_CAPACITY_GATE__REVIEW_CANDIDATE__HUMAN_REVIEW_PENDING`

## Authored semantic inventory

- Dynamic tense scenes: **80**
- Continuing/sequence/interruption scenes: **40**
- Stative scenes: **40**
- Total authored semantic scenes: **160**
- Semantic domains: **20**

Every domain has four dynamic scenes, two continuing/sequence/interruption scenes, and two stative scenes.

## Rule inventory

CP002 registers **10 tense/sequence rules**:

1. finished past time → simple past;
2. continuing dynamic action → present perfect continuous;
3. habitual/general action → simple present;
4. action happening now → present continuous;
5. stative verb → non-continuous form;
6. `did/did not + base form`;
7. earlier of two explicit past actions → past perfect;
8. ongoing past action + interruption → past continuous;
9. single completed past event → simple past rather than past perfect;
10. continuing stative state → present perfect simple.

## Canonical grammar-candidate capacity

The conservative V1 grammar-candidate count is **2,080** before QL shaping:

- Easy: **720**
  - GR-TNS-001: 80 scenes × 4 finished-past markers = 320
  - GR-TNS-003: 80 authored scene/routine combinations = 80
  - GR-TNS-004: 80 scenes × 3 internal current-time cues = 240
  - GR-TNS-006: 80 scenes = 80
- Medium: **1,240**
  - GR-TNS-001: 320
  - GR-TNS-002: 40
  - GR-TNS-003: 80
  - GR-TNS-004: 240
  - GR-TNS-005: 40
  - GR-TNS-006: 80
  - GR-TNS-007: 40
  - GR-TNS-008: 40
  - GR-TNS-009: 320
  - GR-TNS-010: 40
- Hard: **120**
  - GR-TNS-002: 40
  - GR-TNS-007: 40
  - GR-TNS-008: 40

This figure does not multiply by QL segmentation or generic filler text. It counts grammar-bearing candidate constructions only.

## Stress-generation observations

The 3,000-seed-per-difficulty CI stress run at the review-candidate head observed:

| Difficulty | Distinct corrected surfaces | Domains | Rules observed |
| --- | ---: | ---: | ---: |
| Easy | **298** | **20** | **4** |
| Medium | **639** | **20** | **10** |
| Hard | **120** | **20** | **3** |

The observed corrected-surface count is deliberately lower than candidate capacity because multiple erroneous mutations/QL surfaces can resolve to the same correct sentence, and the publication layer normalizes equivalent current-time wording.

## Diversity policy

CP002 does not claim diversity from random noun substitution alone. Diversity comes from authored domain scenes plus grammar-bearing temporal differences:

- finished-past markers;
- routine markers matched to scene semantics;
- current-action cues;
- continuing-duration cues;
- earlier/later past-event sequences;
- interruption structures;
- stative vs dynamic verb behaviour;
- Easy/Medium/Hard placement of temporal cues and clause structure.

The production surface layer also blocks known artificial diversity defects: doubled punctuation, contradictory routine/context combinations, forced parenthetical location commas, heavy vocabulary, and unnecessary sentence-final `currently` wording.

## Frozen review coverage

The deterministic review batch contains **60 questions**:

- 20 Easy;
- 20 Medium;
- 20 Hard;
- all 20 semantic domains exactly once in each difficulty section.

CP002 remains `reviewOnly: true`. Question Studio registration and publication remain blocked until explicit human approval.
