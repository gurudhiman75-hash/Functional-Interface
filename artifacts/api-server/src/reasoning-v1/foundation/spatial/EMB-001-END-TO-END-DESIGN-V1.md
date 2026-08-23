# EMB-001 — Embedded Figures End-to-End Design V1

## Status

`DISCOVERY_DESIGN_ACTIVE_PERMANENT_QLS_NOT_ALLOCATED`

This design starts `EMB-001 — Embedded Figures` after the frozen/integrated Spatial P0 surface (`SPA-QL-001..030`), FGC (`SPA-QL-031..034`) and the stacked PFC/TPF namespace candidate (`SPA-QL-035..040`).

`SPA-QL-041` is therefore treated as the **earliest possible future EMB identity**, but this checkpoint does not allocate it. The PFC/TPF branch must close its permanent namespace before EMB allocation is allowed.

## 1. Learner task

Canonical V1 ask:

> The problem figure is hidden inside one of the answer figures. Select the answer figure that contains the problem figure exactly.

The target is a small line/curve figure. Every option is a denser answer figure. The learner must trace the complete target through clutter; no target edge is highlighted in an option.

Reverse asks such as “which simple figure is hidden in the given complex figure?” remain outside V1 until source saturation proves a separate learner contract.

## 2. Semantic authority

SVG is never the answer authority.

The target and answer figures are converted into a language-neutral figure graph containing:

- straight segments;
- curved arc primitives where required;
- shared endpoints / junctions;
- primitive geometry independent of node IDs and drawing order.

A correct answer must contain the target as an exact permitted geometric substructure under the declared equivalence policy.

Visual resemblance, equal edge count or a roughly similar outline is insufficient.

## 3. Equivalence policy

V1 policies are explicit per generated item:

- translation: allowed;
- rotation: allowed for rotation-enabled families, including non-cardinal source-backed angles;
- reflection: **disallowed by default** and used as a misconception distractor;
- reflection may only become an accepted transform when a later source authority explicitly says the learner ask permits it;
- scaling: disallowed in V1;
- stroke width, node IDs and SVG ordering: non-semantic;
- extra host lines/arcs: allowed;
- extra host intersections: allowed if all target geometry still exists exactly.

The solver must infer candidate rigid transforms from geometry. It may not trust generation metadata such as the authored option label or hidden transform.

## 4. Segment containment

A transformed target segment is present when one host segment geometrically covers it within tolerance.

This deliberately permits a host line to extend beyond the target segment. Additional crossing lines do not destroy the target edge.

The V1 generator retains target edges as semantic line primitives even when visual clutter crosses them; later graph normalization may split host segments at intersections without changing the containment result.

## 5. Curve containment

Mixed curved/straight EMB questions use canonical circular arcs. A transformed target arc must match a host arc in center, radius, endpoints and sweep geometry within tolerance.

Approximate curvature, wrong radius and reversed/shifted arc geometry are invalid even when the option looks broadly similar.

## 6. Provisional discovery families

These are implementation prototypes, **not QLs**.

1. `EMB-PROT-01-DIRECT-RIGID` — target appears without rotation inside moderate clutter.
2. `EMB-PROT-02-ROTATED-RIGID` — complete target appears after a non-zero rigid rotation.
3. `EMB-PROT-03-CROSSING-CLUTTER` — target remains valid through additional crossing lines.
4. `EMB-PROT-04-MULTI-OVERLAP` — target is distributed across a denser compound overlap.
5. `EMB-PROT-05-TOPOLOGY-NEAR-MISS` — distractors preserve counts/rough outline but break one decisive junction or edge relation.
6. `EMB-PROT-06-MIXED-CURVE-LINE` — target combines straight segments with a curved arc.

Source saturation may merge, split, add or remove these prototypes before permanent allocation.

## 7. Distractor contract

Every option has misconception ownership. V1 distractor families include:

- `MISSING_TARGET_EDGE`;
- `WRONG_TARGET_ANGLE`;
- `REFLECTED_TARGET_ONLY`;
- `BROKEN_TARGET_JUNCTION`;
- `SHIFTED_TARGET_COMPONENT`;
- `WRONG_CURVE_RADIUS`;
- `WRONG_CURVE_SWEEP`;
- `PARTIAL_TARGET_ONLY`.

Random scribble/noise is prohibited.

A distractor is rejected if the independent graph solver still finds a valid target embedding in it.

## 8. Correct-answer contract

For every generated question:

- exactly four answer figures;
- exactly one option contains the target under the declared policy;
- all four option scenes are semantically unique;
- learner-size perceptual uniqueness is mandatory;
- option ordering is deterministic and independent of solve authority;
- answer letters are assigned only after final option ordering;
- content fingerprint is independent of answer-slot ordering;
- delivery fingerprint is answer-order sensitive.

## 9. Difficulty

- **L1 Direct** — fixed orientation, low clutter, target 3–4 primitives.
- **L2 Standard** — rotation or crossing clutter, 4–5 target primitives.
- **L3 Advanced** — overlapping host structures, near-miss topology and higher line density.
- **L4 High discrimination** — mixed curve/straight target with strong near-miss distractors. L4 remains controlled discovery until learner review proves mobile clarity.

Difficulty is driven by tracing burden and distractor similarity, not merely line count.

## 10. Explanation contract

Every explanation follows:

1. **Observation** — identify the target’s decisive path/junction/curve feature.
2. **Rule** — state the allowed equivalence (for example rotation allowed, reflection not allowed).
3. **Application** — trace the complete target inside the correct option.
4. **Check** — name the delivered answer and the exact reason each near-miss family fails.

“By observation” or “the figure is clearly present” is prohibited.

The production review should eventually support a highlighted explanation overlay, but the highlight is explanatory only and must never appear in the learner stimulus/options.

## 11. Localization

Geometry remains language-neutral.

English/Hindi/Punjabi localize only:

- instruction;
- rotation/reflection terminology when needed;
- explanation prose.

No script-specific glyph geometry is required by V1 EMB discovery.

Freeze order remains English review/freeze → terminology authority → Hindi/Punjabi generation/parity → multilingual freeze → Question Studio integration.

## 12. Initial executable proof

Discovery target:

```text
provisional families:             6
accepted questions per family:   80
accepted total:                  480
correct slots per family:        A20/B20/C20/D20
```

Required gates:

- deterministic replay;
- alternate-seed divergence;
- target graph fingerprint stable under node order/IDs;
- exact one-option graph containment;
- reflection distractor rejected where reflection is disallowed;
- semantic option uniqueness;
- perceptual option uniqueness at learner size;
- target does not appear as an isolated highlighted copy in the answer figure;
- no question uses scaling as an undeclared equivalence;
- mixed-curve family has exact arc authority;
- 36-question responsive review pack (6 per family);
- all lifecycle controls remain off.

## 13. Source-saturation gate after executable proof

The executable six-family proof is not exam saturation.

The next source pass must answer:

- whether rotation is always implicitly permitted or should remain a difficulty axis;
- whether any reliable exam family explicitly accepts reflected targets;
- whether targets may appear at materially different scale;
- whether curved-edge targets are sufficiently represented in SSC/Railway/Punjab sources;
- whether embedded shapes formed from portions of longer host edges need explicit segment-subdivision normalization;
- whether reverse embedded-figure asks deserve a separate learner QL;
- whether target primitive count / host density are parameters or distinct learner methods.

Banking and Punjab-state mock eligibility remain unestablished until dedicated source evidence exists.

## 14. Lifecycle

```text
permanent QLs:                    0
namespace allocation:             NOT_AUTHORIZED
Question Studio discoverable:     false
Question Studio registration:     NOT_REGISTERED
Question Bank writable:           false
test/mock eligible:               false
publicly publishable:             false
automatic publication:            false
merge/deployment:                 NOT_AUTHORIZED_BY_THIS_CHECKPOINT
```

## 15. Next gate

`EMB_001_EXECUTABLE_DISCOVERY_V1`

Implement the reusable figure-graph containment engine and six provisional families, then inspect rendered learner-size questions before source saturation or permanent QL proposal.
