# MIS-001 Target-Exam Source Crosswalk V9

Status: **TWO NEW SEMANTIC AUTHORITIES FOUND — PRIOR ZERO-GAP V9 INVALIDATED**

## 1. New SSC authority: pair arithmetic mean

Source:
- SSC CGL Previous Paper 62
- Held 13 Jun 2019 Shift 2
- previous-paper label verified through Testbook

Observed columns:
- (36 + 28) ÷ 2 = 32
- (52 + 40) ÷ 2 = 46
- target: (86 + 12) ÷ 2 = 49

Normalized rule:

`result = (a+b)÷2`

Decision:
- add `MIS-CAND-106`;
- require an exact integer mean;
- retain as a distinct semantic authority rather than treating it as generic division;
- runtime owner: `MIS-CP-022`.

## 2. New Punjab-state authority: root-sum × third + 2

Source:
- PSPCL LDC Previous Paper 8
- Held 23 Dec 2019 Shift 2
- previous-paper label verified through Testbook

Observed groups:
- (√25 + √9) × 12 + 2 = 98
- (√36 + √16) × 15 + 2 = 152
- target: (√49 + √25) × 18 + 2 = 218

Normalized rule:

`result = (√a + √b) × c + 2`

Decision:
- add `MIS-CAND-107`;
- first two inputs must be exact perfect squares;
- keep distinct from CP020 simple root-extraction authorities because the third operand and final +2 are both solve-relevant;
- runtime owner: `MIS-CP-023`.

## 3. Reconfirmed existing authorities

The same V9 pass reconfirmed several already-owned families:

- SSC CGL 9 Aug 2017 Shift 3: pair-product sum `ab+cd` -> `MIS-CAND-051`;
- SSC GD 3 Mar 2019 Shift 3: pair-product difference followed by ×2 -> `MIS-CAND-090`;
- SSC GD 9 Mar 2019 Shift 2: cube-root sum -> `MIS-CAND-103`;
- PSSSB reasoning sample: `ab+8` -> CP001 product-plus-stable-constant `MIS-CAND-006`;
- PSPCL LDC 4 Jan 2020 Shift 2: repeated-square invariant corner sum -> `MIS-CAND-050` / inverse presentation `MIS-CAND-086`.

Series-only results remain routed to Series. Genuine row/column consistency remains routed to Number Matrix.

## 4. Factorial and inverse-query status

The targeted V9 sample did not expose a second independent target-exam recurrence for:
- `SMALL_FACTORIAL` / `MIS-CAND-034`;
- `MIS-CAND-095`.

Both remain source-thin.

No new semantic authority was justified merely because the missing position changed. Existing inverse forms remain query-direction variants unless the arithmetic relation itself changes.

## 5. Inventory after corrected V9

- runtime patterns: **107**
- canonical semantic authorities: **72**
- aliases / reuse-only variants: **35**
- permanent QLs: **0**
- source saturation: **false**

## 6. Saturation interpretation

The earlier V9 note treated the wave as zero-new-authority. That conclusion is no longer valid.

A deeper targeted pass exposed:
1. one new SSC semantic authority;
2. one new Punjab-state mixed-root authority.

Therefore the saturation clock resets again. Permanent QL allocation remains blocked.

## 7. Next gate — V10

V10 must target:
1. older SSC CGL/CHSL figure PYQs not represented in V8/V9;
2. Punjab-state repeated-group and figure questions beyond the PSPCL examples already mapped;
3. Banking/RRB repeated-group forms only where ownership is genuinely Missing Number;
4. recurrence evidence for `SMALL_FACTORIAL` and `MIS-CAND-095`;
5. mixed root/power compositions;
6. inverse-input forms that change solve topology rather than blank position only.

A freeze should be considered only after consecutive targeted waves stop exposing meaningful new semantic authorities.
