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


## 5. SSC CGL 2020 mixed whole-number / digit-property gap — CP017

Source:
- SSC CGL 2020 Tier-I Official Paper 4, held 16 Aug 2021 Shift 1.
- Rows include `14,16,13`; `12,21,17`; target `18,6,?`.

Normalized rule:

`result = b − (a÷2) + digitProduct(a)`

Evidence:
- `16 − (14÷2) + (1×4) = 13`
- `21 − (12÷2) + (1×2) = 17`
- `6 − (18÷2) + (1×8) = 5`

Decision:
- CP010 covers digit-only rules, but no prior semantic authority combines a whole-number division step with a digit-property step on the same visible input;
- add **MIS-CAND-091 / SECOND_MINUS_HALF_FIRST_PLUS_FIRST_DIGIT_PRODUCT**;
- retain as mixed whole-number/digit reasoning;
- runtime owner: `MIS-CP-017`.

## 6. Deliberate source holds and ownership boundaries

### Two-stage affine row chain — HOLD

SSC CHSL 2021, held 3 June 2022 Shift 3 includes:
- `12 → 51 → 159`
- `9 → 39 → 123`
- `8 → 35 → ?`

The source solution applies `x×4+3` and then `y×3+6`.

Current decision: **do not allocate a semantic authority yet**.

The target third value can be obtained from the already-visible middle value, so the first stage is not required to compute the answer. Keep this as source-faithful presentation evidence until another target-exam form makes both stages solve-relevant.

### Power/exponent column grid — Number Matrix boundary

Column-consistency forms such as `6³=216`, `2⁴=16`, `7²=49` are owned by Number Matrix. A missing exponent/cell does not become MIS-001 merely because the prompt says "missing number".

## 7. Inventory after V4

- runtime patterns: **91**
- canonical semantic authorities: **57**
- aliases / reuse-only variants: **34**
- permanent QLs: **0**
- source saturation: **false**

Source-discovered additions beyond the original blueprint-derived inventory now include:
- CP013: 2 semantic authorities;
- CP014: 1 Punjab source-backed runtime/query variant;
- CP015: 3 semantic authorities;
- CP016: 1 semantic authority;
- CP017: 1 semantic authority.

## 8. Remaining high-priority source checks

Before permanent QL freeze:

1. sample additional SSC CGL/CHSL/GD shifts for repeated-group rules not yet represented;
2. sample additional Punjab-state papers for figure/repeated-group forms;
3. verify whether SMALL_FACTORIAL appears in actual target-exam Missing Number sources;
4. sample further mixed whole-number/digit-property forms after the CP017 source gap;
5. search specifically for inverse-input forms beyond the confirmed CHSL product-minus-one source;
6. check whether stable multiplicative/divisive constants recur often enough to justify a shared parameterized permanent family;
7. continue rejecting Series and genuine Number Matrix questions at the ownership boundary.

No permanent QL allocation yet.
