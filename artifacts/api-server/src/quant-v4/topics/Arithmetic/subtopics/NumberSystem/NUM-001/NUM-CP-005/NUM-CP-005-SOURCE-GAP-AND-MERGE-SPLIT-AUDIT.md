# NUM-CP-005 — Source-Gap and Merge/Split Audit

**Checkpoint:** `NUM-CP-005 — Divisors and Divisor Functions`  
**Discovery evidence:** Waves 01–04  
**Temporary prototypes audited:** 32  
**Evidence-derived retained-authority proposal:** 24  
**Permanent QL allocation:** none  
**Next available chapter identity:** `NUM-QL-046`  
**Status:** `AWAITING_EXPLICIT_COUNT_APPROVAL`

## 1. Audit conclusion

Four executable waves now cover the routine divisor-function exam space owned by CP-005:

- direct divisor counts, subsets, sums, products and complete sets;
- direct and reverse prime-exponent reconstruction;
- least/greatest optimisation under bounded and parity domains;
- indexed, bounded and tabular divisor evidence;
- no, unique and multiple inverse solutions;
- complete exponent-pair and integer solution sets;
- claims, statement combinations and data sufficiency;
- prime-exponent tables and mini-caselet comparison.

No additional routine discovery wave is justified by the current source and ownership evidence. The 32 temporary prototypes do not represent 32 permanent learner templates. Six groups share one governing invariant and are merged as parameters, reducing the evidence-derived proposal to 24 authorities.

This document does **not** approve 24 as a frozen count and does not allocate `NUM-QL-046` or any later identity. It closes discovery only far enough to request explicit count approval.

## 2. Merge decisions

| Proposed authority | Temporary prototypes | Decision | Reason |
|---|---|---|---|
| total/proper divisor count | `001`, `002` | merge | proper count is `τ(n)-1`; only the requested divisor set changes |
| odd/even divisor count | `003`, `004` | merge | parity selection is one parameterised exponent restriction |
| divisible/not divisible by `k` | `005`, `009` | merge | inclusion polarity changes direct versus complement evaluation, not the learner invariant |
| perfect `r`-th-power divisor count | `006`, `010`, `011` | merge | square, cube, fourth and fifth power use the same exponent-multiple rule with parameter `r` |
| total/proper divisor sum | `007`, `012` | merge | proper sum is `σ(n)-n`; only the requested set changes |
| least integer with optional parity | `016`, `023`, `024` | merge | unrestricted, odd and even are domains of one exponent-partition minimisation authority |

These six merged authorities account for 14 temporary prototypes and reduce the inventory by eight.

## 3. Retained split decisions

The following remain distinct because the answer semantic, evidence topology or proof burden changes:

1. multi-condition divisor-subset count (`017`);
2. product of all divisors (`013`);
3. complete divisor set (`014`);
4. missing exponent from divisor count (`008`);
5. reconstruct prime power from divisor count (`015`);
6. greatest bounded integer with exact count/parity (`032`);
7. greatest divisor under a bound (`018`);
8. indexed divisor (`019`);
9. bounded interval count of integers with exact divisor count (`022`);
10. single claim verification (`020`);
11. statement combination (`026`);
12. divisor-pair table completion (`021`);
13. inverse no/unique/multiple classification (`027`);
14. complete exponent-pair set (`028`);
15. complete possible integer set (`029`);
16. prime-exponent table match (`030`);
17. mini-caselet comparison (`031`);
18. data sufficiency (`025`).

Together with the six merged authorities, these yield the 24-authority proposal.

## 4. Proposed retained inventory

| Proposal | Retained learner authority |
|---|---|
| `AUTH-001` | total or proper positive-divisor count |
| `AUTH-002` | odd or even positive-divisor count |
| `AUTH-003` | divisors divisible or not divisible by constructed `k` |
| `AUTH-004` | multi-condition divisor-subset count |
| `AUTH-005` | perfect `r`-th-power divisor count |
| `AUTH-006` | sum of all or proper positive divisors |
| `AUTH-007` | product of all positive divisors |
| `AUTH-008` | complete positive-divisor set |
| `AUTH-009` | recover a missing exponent from divisor count |
| `AUTH-010` | reconstruct a prime power from prime and divisor count |
| `AUTH-011` | least integer with exact divisor count and optional parity |
| `AUTH-012` | greatest bounded integer with exact divisor count and parity |
| `AUTH-013` | greatest divisor not exceeding a bound |
| `AUTH-014` | indexed positive divisor |
| `AUTH-015` | bounded interval count of integers with exact divisor count |
| `AUTH-016` | single divisor-function claim verification |
| `AUTH-017` | divisor-function statement combination |
| `AUTH-018` | divisor-pair table completion |
| `AUTH-019` | inverse divisor-count solution classification |
| `AUTH-020` | complete bounded exponent-pair solution set |
| `AUTH-021` | complete possible integer set from divisor-function constraints |
| `AUTH-022` | prime-exponent table match under multiple divisor functions |
| `AUTH-023` | divisor-function mini-caselet comparison |
| `AUTH-024` | divisor-function data sufficiency |

The `AUTH-*` identifiers are audit-only proposal labels. They are not QLs and must never appear in learner-facing content.

## 5. Universal discovery-matrix closure

| Discovery dimension | Evidence |
|---|---|
| direct value | Waves 01–02 direct count/sum/product/set authorities |
| reverse value and missing input | missing exponent, prime-power reconstruction and inverse sets |
| least/greatest optimisation | unrestricted/odd/even minimum and bounded greatest states |
| count and complete set | divisor subsets, interval integer counts, divisor/exponent/integer sets |
| possible, impossible, one, many | Wave 04 classification and complete-set authorities |
| bounded range | divisor bound, integer interval and bounded optimisation |
| claim verification | Wave 03 single claims |
| statement combination | Wave 04 all eight truth masks |
| data sufficiency | Wave 04 all four sufficiency classes |
| multiple compatible/incompatible constraints | multi-condition subset, no-solution and intersection states |
| edge conventions | `n=1`, primes, prime powers, perfect squares, zero even divisors, exact boundaries |
| direct representation | all waves |
| divisor-pair table | Wave 03 |
| prime-exponent table | Wave 04 |
| statement set | Wave 04 |
| mini caselet | Wave 04 |

Routine source-gap count after this audit: **zero**.

## 6. Holds and reassignments

Not promoted to routine CP-005 authorities:

- perfect/deficient/abundant classification — advanced-enrichment hold pending recurring source evidence;
- reciprocal-divisor sums and divisor means — source-evidence hold;
- unbounded inverse `τ` or `σ` optimisation — boundedness hold;
- arrangements or selections of factors — reassigned to P&C;
- HCF/LCM and common-divisor optimisation — reassigned to `NUM-CP-006`;
- completing the original number to a square/cube/general power — reassigned to `NUM-CP-012`.

These dispositions are not routine gaps and do not justify Wave 05.

## 7. Machine proof contract

The audit workflow must prove:

- the four waves contain exactly 32 unique temporary prototypes;
- every prototype appears in exactly one merge/split disposition;
- 24 unique proposal authorities exist;
- six authorities merge parameters and eighteen remain singleton authorities;
- the reduction from prototype count is exactly eight;
- all routine discovery rows are covered;
- all excluded families have a hold or owner;
- every proposed authority has `permanentQlId: null`;
- `NUM-QL-046` remains available;
- Waves 01–04 remain green;
- no Question Studio, Question Bank, test or public lifecycle gate is activated.

## 8. Required next decision

The next valid stage is explicit review of the proposed count and merge/split decisions.

Until that approval is recorded:

```text
permanentQlCount:            0
nextAvailableQl:             NUM-QL-046
proposalCount:               24
proposalStatus:              AWAITING_EXPLICIT_COUNT_APPROVAL
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

No permanent allocation or English freeze may begin merely because this audit passes.
