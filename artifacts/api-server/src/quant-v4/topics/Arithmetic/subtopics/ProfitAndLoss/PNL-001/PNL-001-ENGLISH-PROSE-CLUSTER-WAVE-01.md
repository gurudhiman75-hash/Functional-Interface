# PNL-001 English Prose Cluster Wave 01

## Scope

This wave removes shared Editorial V2 prose from twelve English QLs and corrects the PNL-QL-092 data-sufficiency contract.

### CP-001 fraction-to-rate

- PNL-QL-024: profit fraction of cost price;
- PNL-QL-025: loss fraction of cost price;
- PNL-QL-026: profit fraction of selling price converted to cost base;
- PNL-QL-027: loss fraction of selling price converted to cost base.

### CP-003 grouped inventory

- PNL-QL-071: multiple-lot overall percentage;
- PNL-QL-077: weighted group-rate result;
- PNL-QL-088: table-ledger overall result;
- PNL-QL-093: overall profit or loss amount.

### CP-003 remaining-stock inverse

- PNL-QL-075: damaged-stock recovery and good-unit price;
- PNL-QL-080: remaining-unit selling price;
- PNL-QL-081: remaining-stock profit or loss rate;
- PNL-QL-092: two-statement data sufficiency.

## QL-092 correction

- The visible target is rendered from targetRatePercent and targetDirection instead of a hard-coded 10% profit.
- Statement I and Statement II are never identical.
- The EITHER class uses two differently worded but independently complete fact sets.
- Generated working evaluates statement sufficiency rather than describing an answer label as a unit price.
- A 96-seed regression requires all four standard sufficiency classes and verifies the facts behind each class.

## Audit result

```text
QLs:                               186
Review rows:                       558
Candidate packages:             8,928
Fatal findings:                      0
Editorial findings before wave:    46
Editorial findings after wave:     17
Unresolved same-QL stem repeats:    0
Unresolved same-QL answer repeats:  0
Audit status:          REVIEW_REQUIRED
```

Remaining finding counts:

```json
{
  "CONTRACTUALLY-FIXED-ANSWER": 7,
  "REPEATED-EXPLANATION-CLOSING": 2,
  "REPEATED-EXPLANATION-OPENING": 5,
  "REPEATED-EXPLANATION-PARAGRAPH": 3
}
```

## Hosted proof

```text
Workflow: Apply PNL English Prose Cluster Wave 01
Run:      30539490604
Result:   PASS
Artifact: 8758092430
Digest:   sha256:71705b18de35c735d66a1f8d8ff4ef677a58f40859fe25d7d95d256640aa47fe
```

The proof regenerated the committed CP-001 and CP-003 English Editorial V2 libraries from authority, passed exact source parity and renderer checks, passed both full dynamic seed sweeps, passed the permanent cluster regression, exercised 96 QL-092 seeds across all four sufficiency classes, and regenerated the hardened 8,928-candidate chapter audit.

## Regression boundary

The permanent cluster regression rejects a meaningful normalized editorial paragraph or opening shared across different QLs in any corrected cluster. Existing CP-001 and CP-003 dynamic seed sweeps, Editorial V2 source parity, render proofs and the chapter audit must also remain green.

## Safety boundary

No solver equations, answer semantics, option lifecycle, Question Studio route, Question Bank write, test eligibility or publication metadata changed. Dynamic packages remain unreviewed, not stored, test-ineligible and non-public.
