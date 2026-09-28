# MIS-001 Target-Exam Source Crosswalk V5

Status: **SSC SOURCE DISCOVERY CONTINUES TO EXPOSE GAPS; NOT SATURATED**

## 1. Existing authority reconfirmation

### Pair-sum square

SSC Selection Post 2022 presents rows such as:

- `11, 12 → 529`
- `13, 14 → 729`
- `15, 16 → 961`

Normalized rule:

`result = (a+b)²`

Decision:
- already owned by the existing pair-sum square authority;
- no new semantic authority;
- this is positive saturation evidence because a newly sampled paper maps cleanly to the existing registry.

## 2. SSC CHSL source gaps implemented in CP018

### MIS-CAND-092 — decrement both inputs, then multiply

Source:
- SSC CHSL 2021, held 1 Jun 2022 Shift 1.

Observed examples:

- `9, 7 → 48`
- `12, 5 → 44`
- `8, 13 → 84`

Normalized rule:

`result = (a−1)(b−1)`

Decision:
- not covered by the existing product, product-plus-constant or structured-number authorities;
- add a source-backed semantic authority;
- decrement value remains fixed at 1 because that is the evidenced rule.

### MIS-CAND-093 — half the first input, then add the second

Source:
- SSC CHSL 2021, held 8 Jun 2022 Shift 1.

Observed examples:

- `124÷2 + 38 = 100`
- `78÷2 + 25 = 64`
- `94÷2 + 31 = 78`

Normalized rule:

`result = a÷d + b`

Current evidenced context:

`d = 2`

Decision:
- add a source-backed semantic authority;
- do not broaden the divisor beyond 2 without more target-exam evidence;
- exact integer division is enforced by the generator.

### MIS-CAND-094 — equal-difference row continuation

Source:
- SSC CHSL 2021, held 31 May 2022 Shift 2.

Observed rows:

- `187, 164, 141`
- `215, 192, 169`
- `178, 155, 132`

Normalized rule:

`result = 2b − a`

Equivalent interpretation: the three visible row values form a three-term arithmetic progression.

Decision:
- add a source-backed semantic authority;
- treat this as repeated-group row inference, not a chapter-level number sequence, because each independent row uses the same relation;
- retain Series ownership for ordinary single-sequence missing-term questions.

### MIS-CAND-095 — first + 4×second + 1

Source:
- SSC CHSL 2021, held 1 Jun 2022 Shift 2.

Observed examples:

- `14, 4 → 31`
- `38, 10 → 79`
- `30, 8 → 63`

Normalized rule:

`result = a + wb + k`

Current evidenced context:

- `w = 4`
- `k = 1`

Decision:
- add only as **source-thin**;
- do not generalize the weight or constant;
- require more target-exam recurrence before permanent QL promotion.

## 3. CP017 mixed whole-number / digit-property authority remains distinct

SSC CGL 2020 Tier-I, held 16 Aug 2021 Shift 1, supports:

`result = b − (a÷2) + digitProduct(a)`

This is MIS-CAND-091 and remains distinct because both the whole-number half step and the digit-product step are solve-relevant.

## 4. Non-target / boundary evidence

A four-number form `ab÷(c−d)` was found with RRB NTPC provenance rather than SSC/Punjab/Banking provenance.

Decision:
- do not add it to the target-exam source inventory yet;
- it may remain enrichment evidence if later target-exam sources confirm the same family.

Banking evidence continues to show that "missing number" commonly refers to Number Series under Quant/Numerical Ability rather than repeated-group Reasoning.

Decision:
- do not force Banking-specific MIS authorities without paper-backed repeated-group/figure evidence.

## 5. Inventory after V5

- runtime patterns: **95**
- canonical semantic authorities: **61**
- aliases / reuse-only variants: **34**
- permanent QLs: **0**
- source saturation: **false**

Source-discovered semantic additions now include:
- CP013: 2
- CP015: 3
- CP016: 1
- CP017: 1
- CP018: 4

Source-backed reuse/query variant:
- CP014: 1

## 6. Saturation signal

V5 is important because it did both:

- **reconfirmed** an existing authority from a new paper: `(a+b)²`;
- **exposed four genuinely missing semantic families**.

Therefore source saturation cannot yet be declared.

## 7. Next source wave

V6 should prioritize:

1. additional SSC papers until consecutive discovery waves stop adding meaningful semantic authorities;
2. Punjab-state repeated-group / figure questions beyond the confirmed PSPCL missing-corner form;
3. explicit source search for factorial-derived Missing Number forms;
4. additional digit-property and mixed whole-number/digit forms;
5. inverse-input forms beyond the confirmed `abc−1` case;
6. frequency evidence for source-thin MIS-CAND-095 and SMALL_FACTORIAL;
7. evidence for recurring divisor/multiplier contexts before broadening parameter pools.

Permanent QL allocation remains blocked.
