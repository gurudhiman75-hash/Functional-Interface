# MIS-001 Target-Exam Source Crosswalk V4

Status: **SSC SOURCE DISCOVERY EXPANDED; BANKING BOUNDARY CALIBRATED; NOT SATURATED**

## 1. SSC CHSL source-backed additions already present in CP015

### MIS-CAND-087 — pair product plus first input

Source:
- SSC CHSL 2021, held 3 June 2022 Shift 3.
- Rows: `17, 8, 153`; `19, 6, 133`; `13, 7, ?`.

Normalized rule:

`result = a×b + a`

Evidence:
- `17×8+17=153`
- `19×6+19=133`
- `13×7+13=104`

Decision:
- retain as a distinct source-backed authority;
- do not reinterpret it as a digit rule;
- whole-number operation mode only.

### MIS-CAND-088 — three-input product plus 1

Source:
- SSC CHSL 2025 Tier-1, held 22 Nov 2025 Shift 3.
- Rows include `7,3,7,148`; `4,8,3,97`; `2,5,6,?`.

Normalized rule:

`result = a×b×c + 1`

Decision:
- retain as a source-backed authority;
- `+1` is evidenced by the repeated groups;
- do not generalize to arbitrary constants until more source evidence supports that broader context.

### MIS-CAND-089 — three-input product minus 1, including inverse input

Source:
- SSC CHSL 2025 Tier-1, held 27 Nov 2025 Shift 3.
- Columns: `6,2,3 → 35`; `2,5,4 → 39`; `8,?,2 → 63`.

Normalized rule:

`result = a×b×c − 1`

Decision:
- retain as a source-backed semantic authority;
- the source directly supports an input-missing/inverse presentation;
- missing position remains a query/runtime dimension, not another authority.

## 2. SSC GD 2019 source gap — CP016

Source:
- SSC GD previous paper, 3 Mar 2019 Shift 3.
- Repeated figure solution:
  - `{(5×3) − (4×2)} × 2 = 14`
  - `{(5×6) − (4×7)} × 2 = 4`

Normalized rule:

`result = |ab − cd| × k`

Current source-backed context:

`k = 2`

Decision:
- add **MIS-CAND-090 / PAIR_PRODUCT_DIFFERENCE_TIMES_CONSTANT**;
- keep the final multiplier as a rule context rather than creating a separate identity for every constant;
- executable context remains `k=2` until another target-exam source supports broadening;
- retain as distinct from plain pair-product difference because the repeated final scaling stage is part of the inferred relation.

## 3. Punjab-state evidence

Previous wave remains valid:

- PSPCL LDC, 4 Jan 2020 Shift 2;
- repeated squares share the same four-corner total;
- target has one missing corner;
- runtime variant MIS-CAND-086 reuses canonical four-corner-sum authority MIS-CAND-050.

No new semantic authority is created by the blank moving to a corner.

## 4. Banking calibration

Current identifiable SBI/IBPS previous-paper analyses consistently place "Missing Number Series" under Quant/Numerical Ability.

Reasoning sections are dominated by:
- puzzles and seating arrangements;
- syllogism;
- inequality;
- direction/blood relation;
- coding/decoding and related verbal-logical forms.

Decision:
- do not import number-series content into MIS-001;
- do not artificially expand MIS-001 merely to force a Banking-specific quota;
- retain Banking as an applicable target only when repeated-group/figure evidence is actually observed;
- source saturation for MIS-001 should be driven primarily by SSC and Punjab-state evidence unless Banking previous-paper figure evidence emerges.

## 5. Inventory after V4

- runtime patterns: **90**
- canonical semantic authorities: **56**
- aliases / reuse-only variants: **34**
- permanent QLs: **0**
- source saturation: **false**

Source-discovered additions beyond the original blueprint-derived inventory now include:
- CP013: 2 semantic authorities;
- CP014: 1 Punjab source-backed runtime/query variant;
- CP015: 3 semantic authorities;
- CP016: 1 semantic authority.

## 6. Remaining high-priority source checks

Before permanent QL freeze:

1. sample additional SSC CGL/CHSL/GD shifts for repeated-group rules not yet represented;
2. sample additional Punjab-state papers for figure/repeated-group forms;
3. verify whether SMALL_FACTORIAL appears in actual target-exam Missing Number sources;
4. search specifically for digit-property Missing Number forms;
5. search specifically for inverse-input forms beyond the confirmed CHSL product-minus-one source;
6. check whether stable multiplicative/divisive constants recur often enough to justify a shared parameterized permanent family;
7. continue rejecting Series and genuine Number Matrix questions at the ownership boundary.

No permanent QL allocation yet.
