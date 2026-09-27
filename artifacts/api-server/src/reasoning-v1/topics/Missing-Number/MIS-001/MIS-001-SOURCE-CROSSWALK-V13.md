# MIS-001 Target-Exam Source Crosswalk V13

Status: **ONE NEW SSC SEMANTIC AUTHORITY FOUND — SATURATION REMAINS OPEN**

## 1. New SSC semantic authority — signed combination of exact square roots

Source:
- SSC CGL 2013 Tier I
- Held 21 Apr 2013 Shift 2
- solved-paper source independently identifies the rule

Observed relation:

`√row1 − √row2 + √row3 = row4`

Example supplied by the source:

`√81 − √49 + √16 = 9 − 7 + 4 = 6`

Decision:
- add `MIS-CAND-112`;
- runtime owner: `MIS-CP-028`;
- all three input values must be exact perfect squares;
- retain as a distinct semantic authority rather than merging it into simple root extraction or root-sum families;
- normalized rule: `result = √a − √b + √c`.

## 2. Reconfirmed existing SSC authorities

The V13 pass also reconfirmed:

- SSC CGL 11 Jun 2019 Shift 3: sum of squares `a²+b²` -> existing `MIS-CAND-019`;
- SSC CGL 13 Jun 2019 Shift 2: cube of a visible sum `(a+b)³` -> existing pair-sum/difference cube authority;
- SSC CGL 27 Aug 2016: simple cube value -> existing `CUBE_INPUT`;
- SSC GD positive-difference forms -> existing absolute-difference authority.

These do not justify new semantic QLs.

## 3. RRB / Punjab boundary reconfirmation

RRB ALP number-pair analogy questions remain Number Analogy, not Missing Number.

RRB and Punjab-state missing-term sequences remain Series.

PSPCL 3×3 row/column consistency remains Number Matrix.

No ownership change was justified by the words “missing number” alone.

## 4. Unresolved source evidence

The SSC GD 6 Mar 2019 Shift 1 figure with answer 458 remains unresolved because the source indexes expose the answer options but not enough reliable figure structure to recover the rule.

Decision:
- no inferred authority;
- no guessed renderer;
- carry it to the next source wave.

## 5. Source-thin recurrence

V13 did not establish sufficient independent recurrence to promote:
- `MIS-CAND-034` SMALL_FACTORIAL;
- `MIS-CAND-095`.

Both remain source-thin and ineligible for permanent QL promotion.

## 6. Inventory after V13

- runtime patterns: **112**
- canonical semantic authorities: **75**
- aliases / reuse-only variants: **37**
- permanent QLs: **0**
- source saturation: **false**

V13 change accounting:
- +1 semantic authority: `MIS-CAND-112` / ROOT_FIRST_MINUS_ROOT_SECOND_PLUS_ROOT_THIRD;
- +0 aliases.

## 7. Saturation interpretation

V10 exposed two semantic gaps.
V11 exposed one semantic gap plus two source-form gaps.
V12 exposed one semantic gap.
V13 has exposed another semantic gap from an older SSC CGL paper.

This is not a saturation plateau.

Permanent QL allocation remains blocked.

## 8. Next gate — V14

V14 should continue targeted historical source discovery, emphasizing:
1. pre-2016 SSC figure questions;
2. the unresolved SSC GD 6 Mar 2019 figure;
3. Punjab-state non-series figure/repeated-group questions;
4. RRB repeated-group figures not already represented by CP025/CP026;
5. recurrence checks for SMALL_FACTORIAL and `MIS-CAND-095`;
6. explicit boundary checks against Number Matrix, Number Analogy and Series.

Only after consecutive waves stop exposing meaningful semantic and source-form gaps should the chapter proceed to final merge/split recheck and permanent QL allocation.
