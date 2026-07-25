# PNC-001 Duplicate and Near-Clone Audit

Date: 2026-07-24  
Status: **PASS**

## Automated duplicate gates

- Exact English template duplicate groups: 0.
- Duplicate QL IDs: 0.
- Duplicate registry ownership: 0.
- Duplicate QL-specific explanation narratives: 0.
- Duplicate options within a generated item across the final stress run: 0.

## Reviewed similarity pairs

The detector found 12 same-CP/same-mode pairs above the review threshold. All were retained after human review:

| Pair | Material distinction |
|---|---|
| `054 / 055` | one uncancelled factorial factor versus two |
| `079 / 080` | fixing a unique letter versus one copy of a repeated letter |
| `087 / 088` | zero absent versus zero present with a separate zero-ending case |
| `102 / 103` | recover total pool size `n` versus selected size `s` |
| `102 / 104` | recover `n` versus role count `k` |
| `103 / 104` | recover `s` versus `k` |
| `087 / 089` | even without zero versus odd with zero |
| `088 / 089` | even with zero case split versus odd with zero |
| `075 / 076` | one repeated category versus two |
| `075 / 077` | one repeated category versus three and a larger multiset |
| `076 / 077` | two repeated categories versus three with different multiplicities |
| `105 / 106` | distinct-letter rank versus repeated-letter rank with multiset correction |

These are structural contrasts, not noun substitutions.

## Fixed-state review

Twenty-two QLs produced fewer than five parameter states over 50 seeds. They were retained because they intentionally test fixed expressions, known words, exact multiplicity patterns, direct familiar contexts or fixed role multipliers. Forcing variation would either make the wording less natural or change the mathematical contract.

## Verdict

No duplicate or unjustified near-clone removal is required. Future additions must be compared against the reviewed semantic fingerprints before admission.