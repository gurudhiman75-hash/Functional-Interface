# PNL-001 Solve-Mode Evidence Map

Status: ACTIVE DISCOVERY

## Purpose

This file explains how a candidate becomes a semantic solve mode. It prevents V2 family names, formula variants, stem variants and answer variants from being treated as equivalent without review.

## Semantic split tests

Split a candidate when any of the following changes:

- governing percentage base;
- unknown semantic;
- forward versus inverse equation structure;
- transaction topology;
- required ledger type;
- independent verification method;
- misconception and distractor model;
- explanation path needed for an exam learner.

Do not split solely because the article, profession, numbers or wording change.

## Evidence map by concept family

### Fundamental relations

| Candidate | Evidence | Required verifier | Current decision |
|---|---|---|---|
| CP/SP → profit amount | V2 answer semantics include profit amount | `sp - cp` | Separate semantic mode. |
| CP/SP → loss amount | V2 answer semantics include loss amount | `cp - sp` | Separate semantic mode. |
| CP/SP → gain rate | V2 family `pl_cp_sp_percent` | `(sp-cp)/cp` | Split from loss branch. |
| CP/SP → loss rate | V2 family `pl_cp_sp_percent` | `(cp-sp)/cp` | Split from gain branch. |
| CP + gain/loss rate → SP | V2 `pl_cp_percent_to_sp` | forward multiplier | Split by sign and explanation. |
| SP + gain/loss rate → CP | V2 `pl_sp_percent_to_cp` | reverse denominator | Split by gain/loss denominator. |
| CP:SP ratio ↔ rate | ontology/symmetry | ratio normalization | Evidence pending. |
| margin on SP ↔ profit rate on CP | ontology gap | cross-base conversion | Mandatory gap candidate. |

### Marked price and reductions

| Candidate | Evidence | Required verifier | Current decision |
|---|---|---|---|
| MP + discount rate → SP | V2 family/scenario | discount multiplier | Verified seed. |
| MP + SP → discount amount | discount identity | `mp-sp` | Separate from discount percentage. |
| MP + SP → discount rate | V2 `pl_mp_sp_discount_percent` | `(mp-sp)/mp` | Verified seed. |
| SP + discount rate → MP | inverse symmetry | reverse multiplier | Evidence pending. |
| successive discounts → final SP | V2 successive family | chained multiplier | Separate amount answer. |
| successive discounts → equivalent rate | V2 successive equivalent | complement of chained multiplier | Separate percentage answer. |
| one missing discount | inverse symmetry | solve chained multiplier | Mandatory gap candidate. |
| buy-X-get-Y → effective reduction | V2 promotion family | paid/received quantity ratio | Split from reverse quantity mode. |
| coupon/cashback/fixed rebate | V2 hybrid families | ordered price ledger | Split by eligibility/order topology. |

### Markup-discount-profit calibration

| Candidate | Evidence | Required verifier | Current decision |
|---|---|---|---|
| CP→MP→SP→result | V2 markup-discount triangle | full forward ledger | Must split by answer result. |
| target profit + discount → markup | V2 calibration family | forward substitution | Verified seed. |
| CP/MP + target result → discount | V2 inverse discount family | forward substitution | Verified seed. |
| CP/discount + target result → MP | V2 target MP family | forward substitution | Verified seed. |
| MP/discount/result → CP | V2 inverse CP family | forward substitution | Verified seed. |
| multiple markups/discounts | ontology | chained price ledger | Evidence pending. |
| commission/overhead inserted in chain | V2 commission/overhead families | net-realization ledger | Must split by placement. |

### Aggregate and inventory

| Candidate | Evidence | Required verifier | Current decision |
|---|---|---|---|
| equal SP, one gain and one loss | V2 equal-SP families | reconstruct both CPs | Split equal/unequal rates. |
| multiple articles → overall result | V2 two-article family | total SP versus total CP | Split amount/rate/unknown segment. |
| partial inventory allocation | V2 partial-inventory family | quantity-weighted ledger | Split forward and reverse modes. |
| damaged/stolen/free/unsold units | ontology gap | acquired/sold/remaining ledger | Mandatory gap candidate. |
| target overall result → missing count/rate/price | inverse symmetry | aggregate equation | Split by unknown semantic. |

### Sequential transactions

| Candidate | Evidence | Required verifier | Current decision |
|---|---|---|---|
| forward A→B→C chain | V2 supply chain | adjacent transaction continuity | Verified seed. |
| reverse original CP | V2 supply-chain inverse | backward multipliers | Separate reverse mode. |
| reverse intermediate price | topology split | local continuity plus forward check | Separate from original CP. |
| missing stage rate | inverse symmetry | solve stage multiplier | Mandatory gap candidate. |
| commission-bearing intermediary | ontology/V2 commission evidence | net received versus paid | Evidence pending. |

### Dishonest trade

| Candidate | Evidence | Required verifier | Current decision |
|---|---|---|---|
| false selling weight at stated CP | V2 family/scenario | revenue versus cost of delivered quantity | Verified seed. |
| false weight plus price change | V2 dual-fraud family | price × quantity multipliers | Split by price action. |
| false buying and false selling measure | ontology gap | dual-side quantity ledger | Mandatory gap candidate. |
| reverse required false weight/price | symmetry | target-profit equation | Mandatory gap candidate. |
| false length/area/volume | ontology gap | dimensional scaling | Must split by dimension exponent. |

### Effective cost and recovery

| Candidate | Evidence | Required verifier | Current decision |
|---|---|---|---|
| repair/transport/packaging → effective cost | V2 overhead family | cost component sum | Split lot/per-unit allocation. |
| manufacturing breakdown | V2 manufacturing family | component and output ledger | Split with/without wastage. |
| commission deducted from sale | V2 commission family | gross versus net realization | Split fixed/rate and placement. |
| recovery after earlier loss | V2 recovery family | whole-stock total equation | Split price/rate/quantity unknowns. |
| CP from SP difference at two rates | V2 difference family | difference-of-multipliers equation | Verified seed. |
| break-even price | V2 no-profit-no-loss | SP = effective CP | Separate from quantity mode. |
| break-even quantity | ontology symmetry | total revenue = total cost | Mandatory gap candidate. |

## Current evidence conclusion

The V2 family list is a strong seed but cannot define the final V4 solve-mode set because:

1. several V2 families combine multiple answer semantics;
2. reverse and missing-intermediate forms are incomplete;
3. quantity and dimensional fraud are underrepresented;
4. aggregate inventory variants lack damaged/unsold/free-unit coverage;
5. margin-on-SP and cross-base conversions are absent;
6. delivery formats such as statement sufficiency and mini-DI require separate discovery.

No total is frozen by this evidence map.