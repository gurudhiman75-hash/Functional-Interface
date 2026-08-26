# EMB-001 Embedded Figures — End-to-End Design V1

## Status

`FOUNDATION_IMPLEMENTATION_STARTED`

Branch: `feat/spa-emb-001-foundation-v1`

Base: latest `New-main` after PFC/TPF merge and subsequent repository merges.

Next free Spatial permanent ID at start: `SPA-QL-041`.

No permanent EMB QL is allocated by this document. No Question Studio registration, Question Bank write, test eligibility or publication is enabled by this design.

## 1. Product boundary

`EMB-001` asks the learner to identify a target figure as an exact permitted substructure inside a more complex host figure.

Visual resemblance is never sufficient. The canonical authority is a semantic graph made of vertices and typed edges. A host may contain extra lines, crossings, regions and decoy structures, but every target vertex/edge relationship must be present under the explicitly allowed equivalence policy.

Embedded Figures remains separate from:

- `FFM-001` Figure Formation — assembly of pieces into a target;
- `FCT-001` Counting Figures — enumeration of all valid shapes;
- `FCL-001` Figure Classification — common-property/odd-one-out reasoning;
- `IDF-001` Identical Figure — whole-figure equivalence;
- `FGC-001` Figure Completion — missing-region reconstruction.

## 2. Exam-source finding and source lock

The initial source audit confirms a strong SSC pattern across CGL, CHSL, CPO and GD: prompts commonly say the target is hidden/embedded and explicitly state that **rotation is NOT allowed**.

Observed source-backed invariants:

1. fixed target orientation is part of the task when rotation is prohibited;
2. target size may differ from the visible copy, so uniform scale is not identity-breaking;
3. extra host lines are allowed and are the main concealment mechanism;
4. a near-match with a curved edge where the target needs a straight edge is invalid;
5. the answer is an option figure containing the target, not a transformed target output;
6. four-option MCQ format is standard in the sampled SSC questions.

Therefore `EMB-001` does **not** treat rotation/reflection as implicitly allowed. The generator stores an explicit equivalence policy in every question.

### Source-backed core policy

`FIXED_ORIENTATION`

Allowed:
- translation;
- positive uniform scale;
- extra host edges/vertices;
- target edges subdivided only when an exact collinear/compatible-path rule is explicitly enabled by the archetype (disabled in V1 core).

Disallowed:
- rotation;
- reflection;
- line↔curve substitution;
- missing target edge;
- changed target incidence/topology;
- non-uniform scaling/shear.

### Controlled extension policies

The graph engine may support these policies so later source evidence can activate them without architectural rewrite:

- `ROTATION_ALLOWED_REFLECTION_DISALLOWED`;
- `ROTATION_AND_REFLECTION_ALLOWED`.

They are capability-only in the foundation. They do not become source-backed SSC QLs merely because the engine can solve them.

## 3. Curriculum consolidation / proposed learner QLs

The old family inventory lists direct embedding, rotated target, reflected target, crossing lines, overlaps, topological near-misses and mixed curved/straight edges. These are **not seven learner QLs**. Most are representation/difficulty axes around the same exact-subgraph invariant.

### `EMB-PROP-01` — Fixed-orientation exact embedding

Status: `SOURCE_BACKED_CORE`

Learner invariant:
> Find the option that contains the exact target structure in the same orientation; size may change, extra lines may be present.

Parameter axes:
- straight-only vs mixed straight/curve target;
- sparse vs dense host;
- crossing-line count;
- target vertex count;
- target edge count;
- overlap density;
- distractor similarity;
- uniform scale;
- translation within host;
- open vs closed target;
- degree sequence / rare-angle anchors.

### `EMB-PROP-02` — Rotation-permitted exact embedding

Status: `HOLD_SOURCE_PRIORITY_REVIEW`

Learner invariant differs because orientation ceases to be evidence. Activate only when exam/source scope explicitly permits rotation.

### `EMB-PROP-03` — Reflection-permitted exact embedding

Status: `HOLD_SOURCE_PRIORITY_REVIEW`

Reflection changes chirality and is a separate equivalence rule. Activate only with explicit source support/instruction.

**Current permanent allocation count: 0.**

The first permanent EMB QL should not be assigned until source saturation, production-scale proof and learner review show that `EMB-PROP-01` is sufficiently exhaustive and that any held policy deserves separate exam ownership.

## 4. Semantic graph authority

```ts
type EmbeddedGraph = {
  vertices: Array<{ id: string; x: number; y: number }>;
  edges: Array<
    | { id: string; a: string; b: string; kind: "LINE" }
    | { id: string; a: string; b: string; kind: "ARC"; bulge: number }
  >;
};
```

Requirements:

- vertex IDs are stable inside the canonical item;
- edge endpoints reference existing vertices;
- duplicate undirected edges are prohibited;
- zero-length edges are prohibited;
- ARC `bulge` is non-zero and signed;
- crossings do not automatically become graph vertices unless the source geometry explicitly connects there;
- semantic adjacency is authoritative, not SVG pixel intersection.

## 5. Exact similarity matcher

The V1 matcher checks whether target graph `T` occurs inside host graph `H` under a declared policy.

A valid embedding requires one similarity transform:

`hostPoint = translation + uniformScale × permittedOrthogonalTransform(targetPoint)`

with:

- positive uniform scale;
- translation free;
- rotation angle constrained by policy;
- reflection constrained by policy;
- every transformed target vertex matching one host vertex within deterministic tolerance;
- every target edge matching a host edge between the mapped vertices;
- edge kind preserved;
- ARC chirality/bulge preserved under rotation and sign-inverted only under reflection;
- host may contain arbitrary additional vertices/edges.

The matcher returns solver evidence, not only boolean truth:

```ts
{
  matched: true,
  scale,
  rotationDegrees,
  reflected,
  translation: { x, y },
  vertexMap,
  matchedHostEdgeIds
}
```

This evidence drives answer validation and learner explanation overlays.

## 6. Distractor families

Distractors must be semantically near, never visually sloppy.

Core misconception families:

1. **one-edge omission** — most of target exists but one required segment is absent;
2. **wrong incidence** — same edge/vertex counts but a critical connection is moved;
3. **curved-vs-straight substitution** — especially important in SSC-like figures;
4. **rotation trap** — a rotated copy exists when prompt forbids rotation;
5. **reflection trap** — mirrored chirality exists when prompt forbids reflection;
6. **angle/topology near-match** — visual silhouette similar but graph mapping fails;
7. **extra target edge trap** — candidate contains an apparent outline but the required target path cannot be traced exactly;
8. **partial embedding** — recognisable fragment without all target edges.

Random noise, different drawing thickness, poor alignment and size alone are prohibited distractors.

## 7. Generation model

For a seeded question:

1. select source-backed QL/archetype;
2. build target graph from a canonical motif library;
3. choose target uniform scale and translation for the correct host;
4. embed the target graph exactly;
5. add concealment geometry without deleting/mutating target edges;
6. generate three misconception-owned non-matching hosts;
7. independently run the exact matcher against all four options;
8. require exactly one valid option;
9. reject if any distractor accidentally embeds the target;
10. render target and options as deterministic SVG;
11. permute options after semantic validation;
12. produce explanation from match evidence.

## 8. Canonical motif families

V1 foundation motif library should support:

- open polylines with 3–7 vertices;
- closed triangles/quadrilaterals/pentagon-like motifs;
- attached branch/spur motifs;
- nested/intersecting straight-line motifs;
- one-arc-plus-lines motifs;
- two-arc mixed motifs only after perceptual proof;
- asymmetric motifs preferred to reduce accidental transform collisions.

Motifs must have a canonical fingerprint based on normalized graph structure + metric/angle signature + edge kinds.

## 9. Difficulty model

### L1 Direct
- 3–4 target edges;
- sparse host;
- one distinctive angle/branch;
- low decoy overlap.

### L2 Standard exam
- 4–6 target edges;
- moderate crossing/overlap density;
- plausible partial/rotation traps;
- target scale differs from display target.

### L3 Advanced
- 6–9 target edges;
- dense host;
- multiple near-isomorphic decoys;
- mixed straight/curve edges;
- low-salience target placement.

### L4 High discrimination
- reserved until source evidence supports it;
- heavy overlap and multiple almost-valid traces;
- still one unambiguous graph match.

Difficulty is driven by search/perceptual burden, not arbitrary line count.

## 10. Stem variety

English examples:

- "Select the option figure in which the given figure is embedded. Rotation is not allowed."
- "Which option contains the question figure as a part without rotating it?"
- "Find the option in which the target figure is hidden in the same orientation."
- "The target may be smaller or larger. Which option contains its exact structure without rotation?"

Hindi/Punjabi variants are localized only after English freeze. The geometry and equivalence policy remain language-neutral.

No stem may imply rotation is allowed when lifecycle policy is `FIXED_ORIENTATION`.

## 11. Explanation standard

Explanation is short and traceable:

1. identify a distinctive anchor vertex/angle/curve;
2. trace the mapped target edges in order;
3. state that all required connections are present;
4. note that extra host lines do not invalidate the embedding;
5. for a common trap, state the exact failure (e.g. rotated copy, missing edge, curved instead of straight);
6. report the final option only after permutation.

Never use only “by observation”.

## 12. Visual rendering

- white background;
- consistent stroke weight;
- no decorative styling;
- target and options rendered at comparable perceptual size;
- enough padding that edges do not touch card borders;
- mobile option floor at least the established Spatial visual minimum;
- learner-review evidence includes an overlay/highlight of the matched target path in the correct host;
- production question itself does not reveal that overlay.

## 13. Validation gates

Foundation gate:
- graph structural validation;
- fixed-orientation positive match;
- scale+translation positive match;
- rotation correctly rejected under SSC core policy;
- same rotation correctly accepted under explicit rotation policy;
- reflection policy enforced;
- extra host lines tolerated;
- line/curve mismatch rejected;
- missing edge rejected;
- solver evidence deterministic.

Discovery gate:
- source inventory and provenance;
- archetype consolidation;
- controlled-vs-source-backed separation;
- distractor ownership;
- zero permanent QL allocation.

Production-scale gate:
- at least 200 accepted unique questions per proposed active QL before allocation review;
- deterministic replay;
- exactly one valid option;
- A/B/C/D answer balance;
- semantic/canonical uniqueness;
- no perceptual collision;
- explanation evidence bound to each item.

Learner-review gate:
- representative mobile HTML pack;
- easy/moderate/advanced samples;
- target visibility without answer leakage;
- distractor plausibility;
- stem variety;
- human-written explanation quality.

Then: English freeze → permanent QL allocation approval → English production runtime → Hindi/Punjabi localization/parity → Question Studio integration → manual generated-item approval lifecycle.

## 14. Initial implementation waves

### Wave EMB-CP-001 — Graph foundation
- semantic graph types;
- validator;
- exact similarity/subgraph matcher;
- deterministic evidence;
- focused executable proof.

### Wave EMB-CP-002 — Source-saturated discovery
- SSC source-backed inventory;
- controlled extension inventory;
- canonical motif catalog;
- distractor taxonomy;
- proposed QL consolidation.

### Wave EMB-CP-003 — Generator + scale proof
- seeded target/host generation;
- option solver/oracle;
- uniqueness/collision control;
- 200+ accepted questions per active proposal.

### Wave EMB-CP-004 — English learner review/freeze
- review HTML;
- editorial cleanup;
- stem/explanation variety;
- permanent QL proposal.

### Wave EMB-CP-005 — Localization + Question Studio
- Hindi/Punjabi terminology and parity;
- standard Spatial adapter integration;
- Question Bank normalization proof;
- manual approval retained;
- automatic student publication false.

## 15. Current next gate

`EMB_CP_001_GRAPH_FOUNDATION_EXACT_SUBGRAPH_PROOF`
