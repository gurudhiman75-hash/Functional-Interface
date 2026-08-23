# SPA / EMB-001 — Source Saturation and Merge-Split V1

## Status

`SOURCE_SATURATION_EXPANDED_MACHINE_PROOF_PENDING`

This checkpoint audits the initial Embedded Figures discovery implementation against the available controlled non-verbal reasoning sources before any permanent QL allocation.

It does **not** register EMB-001 in Question Studio, allocate `SPA-QL-*` identities, authorize Question Bank writes, or make generated items test/public eligible.

## Source evidence reviewed

### Reasoning for Competitions — Embedded Figures, Chapter 33

The source exposes three learner-facing directions inside one chapter:

1. **Questions 1–40** — select the answer figure in which the question figure is hidden/embedded.
2. **Questions 41–48** — select the answer figure which is itself hidden/embedded in the question figure.
3. **Question 49** — select the answer figure which is **not** hidden/embedded in the question figure.

Labelled exam examples in the source include:

- SSC GD Constable 2021;
- SSC CHSL 2020;
- SSC CPO 2019/2020;
- Delhi Police 2017/2020;
- RRB ALP 2018;
- RRB Group D 2018;
- DSSSB 2018/2019.

### Secondary reasoning source

The second controlled reasoning book independently describes the standard direct task as one question figure followed by four complex answer figures, with the question figure embedded in exactly one answer.

## Core source finding

The original six discovery prototypes were **geometry/difficulty variants of only the forward learner ask**. They were not six distinct learner QLs.

The source pass also exposed a previously missing reverse learner direction plus its negative-polarity form.

Therefore the discovery taxonomy expands from six technical prototypes to eight technical prototypes, but consolidates to only **two proposed learner archetypes**.

## Proposed learner-archetype consolidation

### `EMB-PQL-P01` — Question target hidden in an answer figure

Temporary proposal handle only. No permanent QL ID.

Owns the learner contract:

`small question target → find the answer host containing it`

The following technical prototypes merge into this one learner method:

- `EMB-PROT-01-DIRECT-RIGID`;
- `EMB-PROT-02-ROTATED-RIGID`;
- `EMB-PROT-03-CROSSING-CLUTTER`;
- `EMB-PROT-04-MULTI-OVERLAP`;
- `EMB-PROT-05-TOPOLOGY-NEAR-MISS`;
- `EMB-PROT-06-MIXED-CURVE-LINE`.

These differ in representation burden, target topology, clutter density and perceptual difficulty, but the learner method remains the same: trace one target graph inside each candidate host.

### `EMB-PQL-P02` — Answer candidate hidden/not hidden in the question figure

Temporary proposal handle only. No permanent QL ID.

Owns the learner contract:

`one complex question host → test each small answer candidate for containment`

Source-backed technical prototypes:

- `EMB-PROT-07-OPTION-IN-QUESTION-POSITIVE` — select the one embedded candidate;
- `EMB-PROT-08-OPTION-NOT-IN-QUESTION` — select the one non-embedded candidate.

Positive vs negative is treated as a **polarity parameter**, not an automatic QL split, because the geometric solver and learner tracing procedure are the same and only the final selection criterion is inverted.

## Graph-engine hardening discovered during the audit

The first matcher could verify that a target segment lay inside a longer host segment, but transform-candidate discovery still required an equal-length host anchor. That would miss a common hidden-figure situation where a target edge forms only part of a longer visible line.

`FIGURE-GRAPH-V1-SUBSTRUCTURE-HARDENING-2026-08-23` therefore adds:

- host-segment endpoints as transform landmarks;
- line/line intersection landmarks;
- host arc-endpoint landmarks;
- target-segment containment inside longer host lines;
- target-arc containment inside longer host arcs with exact center/radius geometry;
- continued prohibition on undeclared scaling.

A dedicated regression proof covers extended-line containment, exact sub-arc containment and wrong-radius rejection.

## Matching-policy boundary

For V1/V2 discovery:

```text
translation:          allowed
rotation:             allowed where the learner task permits it
reflection:           disallowed by default
scaling:              disallowed
extra crossing lines: allowed
extra unrelated lines: allowed
missing target edge:  invalid
wrong junction:       invalid
wrong arc radius:     invalid
wrong arc path:       invalid
```

Reflection remains a misconception candidate unless a later source authority explicitly establishes reflected equivalence for a learner task.

## Current technical discovery map

```text
Forward technical prototypes:       6
Directional technical prototypes:   2
Total technical prototypes:         8
Proposed learner archetypes:         2
Permanent QLs allocated:             0
```

Current machine proof targets after the source expansion:

```text
Forward discovery:       80 × 6 = 480 accepted
Directional discovery:   80 × 2 = 160 accepted
Combined target:                    640 accepted
Answer-slot target:      exact A/B/C/D balance per prototype
```

A 640-question proof is generation evidence, **not** permission to create eight QLs or claim source saturation beyond the audited scope.

## Remaining source/capability gaps

The following remain explicit open questions rather than being silently treated as supported:

1. full-circle target primitives are not part of Figure Graph V1;
2. arbitrary free-form/Bézier curve containment is not yet represented; V1 supports straight segments and exact circular arcs;
3. source-backed permission for reflection equivalence is not established;
4. source-backed permission for scale-change equivalence is not established and scaling remains forbidden;
5. Banking-specific embedded-figure exam evidence is not established;
6. Punjab-state PYQ saturation is not established;
7. difficulty distribution across the two learner archetypes still requires rendered human review;
8. the expanded 52-card review surface (36 forward + 16 directional) still requires visual/mobile inspection after executable proof artifacts exist.

## Exam-scope posture

```text
SSC:                 STRONG_SOURCE_BACKING_FOR_EMBEDDED_FIGURE_TASK
RRB:                 SUPPORTING_SOURCE_BACKING_PRESENT
Delhi Police/DSSSB:  SUPPORTING_SOURCE_BACKING_PRESENT
Banking:             NOT_ESTABLISHED
Punjab state:        NOT_ESTABLISHED
```

No Banking or Punjab-state mock-test eligibility is authorized from this checkpoint.

## Lifecycle lock

```text
Permanent QLs:                0
Permanent namespace allocation: false
Question Studio discoverable: false
Question Studio registration: NOT_REGISTERED
Question Bank writable:       false
Mock/test eligibility:        false
Public publication:           false
Hindi/Punjabi generation:     false
Automatic publication:        false
```

`SPA-QL-041` remains only the earliest possible future Spatial identity after PFC/TPF `SPA-QL-035..040`; it is **not reserved or allocated by EMB discovery**.

## Next gate

`EMB_001_EXECUTABLE_DISCOVERY_EXPANDED_V2_AND_HUMAN_VISUAL_REVIEW`

The next gate must:

1. pass the hardened graph regression proof;
2. pass all 480 forward discovery questions;
3. pass all 160 source-backed directional questions;
4. inspect the generated 36 + 16 review cards at desktop/mobile learner sizes;
5. remediate any visual ambiguity or accidental target visibility;
6. only then prepare a two-QL permanent proposal for explicit approval.
