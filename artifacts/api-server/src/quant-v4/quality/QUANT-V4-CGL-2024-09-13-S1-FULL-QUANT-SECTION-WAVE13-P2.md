# Quant V4 — SSC CGL Tier-I 13 Sep 2024 Shift 1 Whole-Section Wave 13 P2

**Authority:** `QUANT-V4-CGL-2024-09-13-S1-FULL-QUANT-SECTION-WAVE13-P2`

## Purpose

Wave 13 adds one more independent, dated SSC CGL Tier-I Quant section to the conservative whole-section frequency corpus. The paper was selected deliberately because the post-Wave-12 stability audit had only one remaining blocker: deleting the three-section 25-Jul-2023 cluster removed all complete-section support for `DI-004`, `PCT-001`, and `SRI-002`.

The 13 Sep 2024 Shift 1 paper contains an exam-authentic foundational percentage question that belongs to `PCT-001`. That gives `PCT-001` independent whole-section support outside the dominant 25-Jul-2023 cluster without inventing or reclassifying evidence solely to satisfy the stability gate.

## Source and paper identity

Primary public mirror:

- Prepp response-sheet PDF — SSC CGL Tier-I, 13 Sep 2024, Shift 1.

Corroboration:

- SSC Portal mirror of the same paper and answer key.

The response-sheet PDF numbers the Quant section locally as Q1-Q25. For consistency with the other 2024 full-paper evidence records, those positions are normalized to `Q51-Q75`. Paper identity is:

- paper: `SSC-CGL-2024-TIER-I-2024-09-13-S1`
- held date: `2024-09-13`
- shift: `Shift 1`
- normalized Quant range: `Q51-Q75`
- complete-section count: 25 questions.

Candidate-selected options in response-sheet mirrors are not treated as answer authority. Where a selected option conflicts with independent arithmetic or the keyed answer, the normalized evidence uses the independently verified/keyed result. This matters for the simple-interest settlement, grouped-table percentage, tangent-circle item, and remaining-pizza perimeter.

## Package mapping

The 25 questions map to 18 live Question Studio package families:

| Package | Questions |
|---|---:|
| `ALG-001` | 3 |
| `DI-001` | 2 |
| `DI-003` | 1 |
| `DI-005` | 1 |
| `GEO-001` | 1 |
| `GEO-002` | 1 |
| `INT-001` | 1 |
| `MAL-001` | 1 |
| `MEN-001` | 2 |
| `MEN-002` | 1 |
| `NUM-001` | 1 |
| `PCT-001` | 1 |
| `PNL-001` | 2 |
| `RAP-001` | 1 |
| `SAP` | 1 |
| `TMW-001` | 1 |
| `TRG-001` | 3 |
| `TSD-002` | 1 |

Total: **25**.

Important ownership decisions:

- Q62 is `PCT-001`: it is a foundational percentage relation (`R = 110% of S`) with a fixed vote-margin anchor.
- Q65 is `SAP`: the source is a nested BODMAS / “of” simplification expression.
- Q66 is `DI-003`: the source stimulus is a bar graph.
- Q72 is `TSD-002`: it is a boats-and-streams system, not ordinary land-speed `TSD-001`.
- Q74 stays in `MEN-001`: the perimeter of the remaining three-quarter circular pizza is plane mensuration.

## Independent arithmetic corrections

Several candidate-selected response-sheet options are explicitly not copied into evidence:

- grouped table comparison: `313 / 327 × 100 ≈ 95.72%`, hence 96% when rounded;
- simple-interest settlement: remaining principal `606,915`, unpaid first-year interest `62,330.50`, second-year interest `60,691.50`, total `729,937`;
- remaining pizza perimeter: `(3/4) × 2 × (22/7) × 21 + 42 = 141 cm`;
- three touching circles: positive radius is `2 cm` from `(r+2)^2 + (r+1)^2 = 25`.

## Cumulative corpus after Wave 13

Expected cumulative state:

- registered normalized observations: **381**
- SSC CGL Tier-I countable observations: **348**
- complete Quant sections: **13**
- complete-section questions: **325**
- represented years: **3**
- year distribution: 2022 = 2 sections, 2023 = 6, 2024 = 5
- package coverage: **28** live package families.

## Stability effect

The dominant date remains 25 Jul 2023, but its share falls to `3/13` sections. More importantly, removing all three 25-Jul-2023 sections now leaves `PCT-001` supported by this 13-Sep-2024 paper. The packages expected to disappear under that concentrated-date removal are therefore only:

- `DI-004`
- `SRI-002`

That is exactly the conservative policy ceiling of two lost packages. If the leave-one-out and share-drift thresholds remain satisfied, the evidence-only stability state advances from `STABILITY_HOLD` to `STABILITY_CANDIDATE`.

## Production gate

Wave 13 does **not** authorize production frequency promotion. `productionPromotionAuthorized` remains `false` in both the whole-section and stability policies. Even if all evidence-stability blockers clear, production weighting remains locked until a separate, deliberate authorization gate is opened.
