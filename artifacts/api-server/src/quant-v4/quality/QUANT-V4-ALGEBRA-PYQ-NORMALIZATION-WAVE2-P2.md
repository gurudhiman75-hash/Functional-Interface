# Quant V4 Algebra PYQ Normalization — Wave 2 P2

**Authority:** `QUANT-V4-ALGEBRA-PYQ-NORMALIZATION-WAVE2-P2`  
**Source authority:** `ALG-FINAL-SOURCE-FIXTURE-LEDGER-V2.md`  
**Status:** normalized countable evidence; **no frequency-weight or selection calibration promoted**

## Purpose

Continue the P2 PYQ-frequency evidence programme by converting only directly attributable target-exam Algebra fixtures into `QuantV4PyqObservation` records. This wave does not treat chapter design coverage, comparable recruitment questions, or out-of-profile Railway/MTS questions as SSC section-frequency evidence.

## Counted observations

Five source fixtures are normalized:

| Source ID | Exam | Paper identity | Contract |
|---|---|---|---|
| `ALG-V2-S01` | SSC CGL Tier-I | 10 Sep 2024, Shift 2 | `ALG-QL-041` — unique 3×3 linear system |
| `ALG-V2-S02` | SSC CGL Tier-I | 12 Sep 2024, Shift 3 | `ALG-QL-041` — unique 3×3 linear system |
| `ALG-V2-S03` | SSC CHSL Tier-I | 03 Jul 2024, Shift 3 | `ALG-QL-041` — unique 3×3 linear system |
| `ALG-V2-S05` | SSC CGL Tier-I | 18 Sep 2025, Shift 1 | `ALG-QL-042` — direct cubic Vieta invariant |
| `ALG-V2-S07` | SSC CGL Tier-I | 09 Sep 2024, Shift 3 | `ALG-QL-043` — fixed-sum symmetric extremum |

All five retain the source ledger as their auditable repository reference and use the ledger's `DIRECT_PYQ` evidence classification.

## Deliberately excluded

The following V2 fixtures are **not** entered into the current SSC frequency denominator:

- `ALG-V2-S04` — RRB JE, outside the current eleven-profile Quant V4 simulation contract;
- `ALG-V2-S06` — RRB NTPC, outside the current eleven-profile Quant V4 simulation contract;
- `ALG-V2-S08` — comparable OSSC evidence; useful for semantic coverage, not SSC frequency counting;
- `ALG-V2-S09` — SSC MTS, outside the current eleven-profile contract and retained as a composition-only bounded cubic task rather than a permanent general cubic-solver contract.

No excluded fixture is relabelled as SSC CGL/CHSL evidence.

## Registry after this wave

The shared normalized registry becomes **31 observations**:

- Algebra: **15**
  - SSC CGL Tier-I: 11
  - SSC CHSL: 3
  - SSC CGL Tier-II: 1
- Number System: **16**
  - SSC CGL Tier-I: 10
  - SSC CHSL: 5
  - SSC CGL Tier-II: 1

Algebra Wave 2 adds five dated, shift-resolved paper/question identities under `ALG-002` while preserving the ten Wave-1 `ALG-001` observations unchanged.

## Readiness boundary

This is evidence accumulation, not a weighting release. Algebra-only evidence still covers one section-level topic family (`Advanced Mathematics`), so it cannot establish the full Quant section topic distribution. The regression therefore keeps `canReplaceProvisionalSimulationWeights(...) === false` under a policy that requires more than one topic family.

No CP/QL selection weights, difficulty weights, representation weights, simulator slot weights, or learner-facing generation routing are changed by this checkpoint.
