# MIS-001 Target-Exam Source Crosswalk V8

Status: **TWO NEW SSC AUTHORITIES FOUND — SATURATION NOT YET REACHED**

## 1. New source-backed authority: cube root of difference

Source:
- SSC GD Previous Paper 30
- Held 7 Mar 2019 Shift 1

Observed relation:
- 565 − 222 = 343 = 7³
- 899 − 387 = 512 = 8³

Normalized rule:

`result = ∛|a−b|`

Decision:
- add MIS-CAND-104;
- exact integer cube roots only;
- keep distinct from cube-root sum and ordinary difference.

## 2. New source-backed authority: (ab+1)c

Source:
- SSC CGL Previous Paper 12
- Held 10 Aug 2017 Shift 3

Observed rows:
- (3×10+1)×6 = 186
- (9×5+1)×3 = 138
- (5×7+1)×1 = 36
- target (3×2+1)×5 = 35

Normalized rule:

`result = (a×b + 1) × c`

Decision:
- add MIS-CAND-105;
- retain as distinct from `abc+1`, `ab+c`, and `(a+b)c`.

## 3. Reconfirmed / boundary-routed examples

V8 also sampled:
- direct product figure forms -> existing PRODUCT authority;
- pair-product-difference ×2 -> already CP016;
- cube-root-sum -> already CP020;
- four-value pair-sum difference -> existing grouped-pair authority;
- row/column multiplication tables -> Number Matrix;
- ordinary sequences -> Series.

## 4. Punjab-state findings

No new Punjab-state MIS semantic authority was found in V8.

PSSSB search results again largely resolve to:
- Series;
- Number Matrix;
- Number Analogy;
- other reasoning topics.

The PSPCL missing-corner repeated-square form remains the strongest positive Punjab MIS evidence and is already covered by CP014.

## 5. Factorial / source-thin status

No new target-exam recurrence was found for:
- SMALL_FACTORIAL;
- MIS-CAND-095.

Both remain source-thin.

## 6. Inventory after V8

- runtime patterns: **105**
- canonical semantic authorities: **70**
- aliases / reuse-only variants: **35**
- permanent QLs: **0**
- source saturation: **false**

## 7. Saturation interpretation

V8 disproves a freeze after V7: a second targeted wave still exposed two genuine SSC semantic gaps.

Therefore MIS-001 is not yet source-saturated.

## 8. Next gate

Run V9 with emphasis on:
1. remaining older SSC CGL/CHSL/GD figure PYQs;
2. Punjab-state figure/repeated-group PYQs;
3. recurrence of CP020/CP021 root families;
4. source-thin factorial and MIS-CAND-095 recurrence;
5. inverse-input variants.

Permanent QL allocation remains blocked.
