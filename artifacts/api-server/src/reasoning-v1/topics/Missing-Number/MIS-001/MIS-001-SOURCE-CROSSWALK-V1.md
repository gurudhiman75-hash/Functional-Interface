# MIS-001 Target-Exam Source Crosswalk V1

Status: **DISCOVERY WAVE 1 — NOT SATURATED**

This crosswalk records only source forms that can be tied to identifiable exam-prep / previous-paper evidence. It deliberately separates true Missing Number repeated-group/figure questions from questions whose surface wording says "missing number" but whose ownership is actually Series or Number Matrix.

## A. Included Missing Number evidence

| Source | Exam evidence | Observed structure | Normalized rule | MIS authority | Decision |
|---|---|---|---|---|---|
| Testbook solved previous-paper item | SSC CGL, 9 Aug 2017 Shift 3 | Three repeated figures; each result = product of one pair + product of another pair | pair-product sum `ab + cd` | MIS-CAND-051 | INCLUDE |
| Testbook solved reasoning item carrying SSC CGL figure provenance | SSC CGL source figure | Repeated figures; result = square of first visible value + square of second visible value | `a²+b²` | MIS-CAND-019 | INCLUDE |

### SSC CGL 9 Aug 2017 Shift 3

Observed solution:

- Figure 1: `3×4 + 2×5 = 22`
- Figure 2: `2×1 + 7×6 = 44`
- Figure 3: `7×8 + 5×2 = 66`

This directly supports the canonical pair-product-sum authority. Row/column/diagonal placement should remain a pairing-map / renderer parameter rather than separate permanent QLs.

### SSC figure — sum of squares

Observed solution family:

- `18² + 15² = 549`
- `17² + 19² = 650`
- target `15² + 14² = 421`

This supports the existing `SUM_OF_SQUARES` authority rather than a figure-specific duplicate.

## B. Boundary evidence — explicitly excluded from MIS-001

| Source | Exam evidence | Surface wording | Actual structure | Owner | Decision |
|---|---|---|---|---|---|
| Adda247 previous-year PDF | PSSSB Clerk 2018 | "Find the missing number in the following series" | ordinary sequence `4,6,3,5,2,?` | Series | EXCLUDE |
| Testbook | Punjab Police Constable, 6 Aug 2024 Shift 1 | missing number in series | sequence `5,9,25,?,345,1369` | Series | EXCLUDE |
| Testbook | Punjab Police Constable, 18 Aug 2023 Shift 2 | replace ? in series | sequence `14,20,44,104,?,434` | Series | EXCLUDE |
| Testbook PSSSB reasoning collection | PSSSB reasoning | select number at ? | 3×4 row/column grid solved column-wise by `(top×middle)+8=bottom` | Number Matrix | EXCLUDE |
| Testbook banking examples | IBPS/RRB-oriented practice | missing number in series | sequential recurrence / alternating series | Series | EXCLUDE |

## C. Supporting non-target / enrichment observations

These are useful for grammar coverage but do not by themselves satisfy SSC/Banking/Punjab source saturation.

Observed diagram families include:

- sum of three values in repeated diagrams;
- `top × |bottom-left-bottom-right|`;
- square of a pair sum;
- square of a pair difference;
- pair-product difference;
- grouped pair-sum / pair-difference products.

These align with existing MIS authorities, but they remain enrichment evidence until target-exam provenance is established.

## D. Current target-exam evidence state

### SSC

Status: **PARTIAL CONFIRMED**

Confirmed target-exam figure evidence currently supports at least:

- pair-product sum;
- sum of squares.

More SSC shifts/papers should be sampled before frequency or saturation is claimed.

### Punjab state

Status: **BOUNDARY EVIDENCE CONFIRMED; IN-CHAPTER FIGURE EVIDENCE STILL THIN**

Current public examples strongly demonstrate that many Punjab questions returned by "missing number" searches are actually Series. One PSSSB reasoning example is a genuine row/column matrix and belongs to Number Matrix.

This is useful ownership evidence but does not yet saturate Missing Number figure families for Punjab exams.

### Banking

Status: **NOT SATURATED**

Public search results are dominated by missing-number Series questions and general practice pages. No sufficiently strong set of identifiable Banking previous-paper repeated-group/figure questions has yet been crosswalked in this wave.

## E. Implications for current semantic authorities

This source wave does **not** justify increasing the 50-authority canonical inventory.

It provides positive evidence for existing authorities and negative/boundary evidence against absorbing Series/Matrix content.

No new semantic authority is added in Source Crosswalk V1.

## F. Next discovery wave

Required:

1. collect additional SSC CGL/CHSL/GD figure-based Missing Number previous-paper questions;
2. locate Banking previous-paper repeated-group/figure evidence rather than Number Series;
3. collect PSSSB / Punjab Police / other Punjab-state figure-based examples;
4. normalize each source to the 50-authority registry;
5. flag any genuinely observed rule that has no authority;
6. measure repeated source occurrence before rejecting or promoting source-thin families;
7. keep `SMALL_FACTORIAL` on hold unless source-backed.

Source saturation remains false until this crosswalk stops exposing meaningful new authorities or boundary corrections across the target exams.
