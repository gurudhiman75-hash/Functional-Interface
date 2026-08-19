# Geometry Gap Authority & Runtime Remediation — Wave 4 Status

**Authority:** Composite Geometry Revision 3  
**Predecessors:** approved Waves 1–3 discovery remediation  
**Lifecycle:** `DISCOVERY`  
**Wave 4 state:** `REVIEW_READY_CANDIDATE`

## Wave decision

Wave 4 addresses the source-observed `GEO-CP-005` perimeter-scale similarity gap with two temporary prototypes:

| Temporary prototype | Learner decision | Source gap | Diagram disposition |
|---|---|---|---|
| `GEO-TMP-GAP-W4-CP005-PERIMETER-TO-SIDE-V1` | two perimeters + one corresponding side → other corresponding side | `PERIMETER_RATIO_SIMILARITY_SCALE` | `NO_DIAGRAM` |
| `GEO-TMP-GAP-W4-CP005-SIDE-TO-PERIMETER-V1` | corresponding-side scale + one triangle's sides → other perimeter | `PERIMETER_RECOVERY_FROM_SIDE_SCALE` | `NO_DIAGRAM` |

Baseline temporary executable discovery = 38.  
Wave 1 = +4.  
Wave 2 = +3.  
Wave 3 = +4.  
Wave 4 = +2.  
Current temporary executable count after Wave 4 = **51**.

Permanent QLs = **0**.  
Frozen solve modes = **0**.

## Source basis

1. `SRC-TESTBOOK-CGL-PERIMETER-TO-SIDE-PYQ-2024` — SSC CGL 2024 Tier-I Official Paper, held 13 Sep 2024 Shift 3: similar triangles RST and ABC with perimeters 26 cm and 39 cm, and AB = 24 cm, yield RS = 16 cm.
2. `SRC-TESTBOOK-CHSL-PERIMETER-TO-SIDE-PYQ-2022` — SSC CHSL Tier-I Exam 2022 Official Paper, held 16 Mar 2023 Shift 4: similar-triangle perimeters 64 and 56 with AB = 16 yield corresponding PQ = 14.
3. `SRC-TESTBOOK-CHSL-SIDE-TO-PERIMETER-PYQ-2024` — SSC CHSL 2024 Tier-I Official Paper, held 02 Jul 2024 Shift 2: AB = 8, PQ = 12 and sides 12, 18, 24 of PQR yield perimeter 36 cm for ABC.

The source audit also observes area-scale questions, but Wave 4 deliberately does **not** absorb them because area ownership/merge-split remains unresolved. This wave closes only the linear perimeter/corresponding-side scale decision.

## Shared exact additions

`similarity-scale-inference.ts` adds exact Rational helpers for:

- corresponding side from two perimeters and one corresponding side;
- perimeter from one corresponding side pair and the other perimeter.

The theorem registry adds `SIMILAR_TRIANGLES_PERIMETER_SCALE` under the `SIMILARITY` family with the learner-facing rule that the ratio of the perimeters of similar triangles equals the ratio of corresponding sides.

## Representation quality

Both Wave-4 archetypes declare `NO_DIAGRAM`.

That is intentional under Revision 3: triangle correspondence and every metric clue are explicit in prose, so a sketch would add no semantic evidence. The runtime/review contract rejects decorative diagram insertion unless the stem topology changes materially.

Each prototype uses:

- three materially varied review stems and numeric targets;
- exact Rational synthesis;
- an independent cross-multiplication verifier;
- clue-removal minimality;
- operation-owned misconception distractors;
- natural learner explanations with no internal theorem IDs.

The first green Wave-4 artifact was **not** accepted for review handoff: human editorial QA found that several plausible distractor values were paired with misconception IDs that did not actually generate those numbers. The prototype bank and proof were corrected so every distractor now follows its stated wrong operation exactly. The exact SSC CGL 2024 `26, 39, 24 → 16` source was also added to the evidence set. The full retained proof chain was then rerun.

Final human artifact review confirms all six questions have:

- correct operation-owned distractors;
- materially different wording/numeric targets across each prototype's three seeds;
- natural, question-specific explanations;
- valid source mapping;
- `NO_DIAGRAM` with no hidden `diagramModel` or `stemSvg` payload;
- clean lifecycle locks.

## Final CI evidence — PASS

`Validate Geometry Gap Remediation Wave 4` — **PASS**

- run: `32282512209`
- job: `96164316583`
- runtime head: `f602cfed6a336bbe52f0684aba7aa99a8428cdbf`
- API build: PASS
- retained Source Saturation Audit V1: PASS
- retained Geometry Phases 0–5: PASS
- retained Wave 1 proof: PASS
- retained Wave 2 proof: PASS
- retained Wave 3 proof: PASS
- Wave 4 proof: PASS
- review export: PASS
- artifact upload: PASS

Final review artifact:

- id: `9376369079`
- digest: `sha256:5fc60bcf3eb69e871eb1128136679e71959ad458fec5f9b4a9499d683d4b525b`
- two temporary prototypes × three review seeds = **6 review questions**

The earlier artifact `9376214498` is superseded and must not be used for review.

```text
wave4ImplementationComplete = true
wave4RuntimeProofPassed      = true
wave4ReviewReady             = true
wave4Approved                = false
```

## Gates

```text
sourceSaturationClaimAllowed    = false
permanentQlAllocationAllowed    = false
solveModeFreezeAllowed          = false
questionStudioActivationAllowed = false
questionBankWriteAllowed        = false
testEligibilityAllowed          = false
publicPublicationAllowed        = false
```

## Next priority after Wave 4 review

1. CP014 congruence + parallel synthesis;
2. CP006 perpendicular-bisector equal-distance / centroid inverse / midpoint-converse;
3. remaining source-observed CP010/011 gaps;
4. area-scale ownership/merge-split review;
5. only after further source remediation, permanent-QL freeze review.
