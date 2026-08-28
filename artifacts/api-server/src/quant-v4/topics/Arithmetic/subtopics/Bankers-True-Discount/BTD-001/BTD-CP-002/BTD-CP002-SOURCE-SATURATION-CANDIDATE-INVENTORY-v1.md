# BTD-CP-002 — Source-Saturation Candidate Inventory v1

Status: **executable source-saturation candidate; no permanent QL allocation**

Parent: `BTD-CP-001` official-source discovery foundation  
Chapter: `BTD-001 — Banker's Discount / True Discount`

## Purpose

CP001 certified nine ID-free source directions. CP002 asks a narrower question: after further competitive-exam source recovery, which additional unknown positions or system topologies are genuinely source-backed and distinct enough to survive merge/split review?

The checkpoint deliberately rejects the strategy of allocating every algebraically possible permutation of `PW`, `TD`, `BD`, `BG`, rate and time.

## Existing CP001 semantic inventory retained

The following nine source directions remain the baseline and are not reimplemented as CP002 candidates:

1. face value + rate + time → present worth
2. face value + rate + time → true discount
3. face value + rate + time → banker's discount
4. face value + rate + time → banker's gain
5. face value + true discount → banker's discount
6. BD:TD ratio + known time → annual rate
7. banker's gain + rate + time → present worth
8. bill date + term + discount date + rate → banker's discount, including grace days
9. BD:TD ratio + `R = kT` → annual rate

## Eleven CP002 source-backed candidates

```text
BTD-CAND-010  present worth + banker's gain -> true discount
BTD-CAND-011  two bills: total face + distinct maturities + rate + total BD -> face-value difference
BTD-CAND-012  banker's discount + true discount -> face value
BTD-CAND-013  banker's discount + rate + time -> true discount
BTD-CAND-014  BD:TD ratio + rate -> time
BTD-CAND-015  banker's gain + rate + time -> true discount
BTD-CAND-016  present worth + true discount -> banker's discount
BTD-CAND-017  present worth + true discount -> banker's gain
BTD-CAND-018  BD(face1) = TD(face2), same rate/time + rate -> time
BTD-CAND-019  banker's discount + true discount + time -> rate
BTD-CAND-020  true discount + rate + time -> banker's discount
```

## Highest-authority recovered sources

### Official GPSC — PW + BG → TD

Goa Public Service Commission question paper `804.pdf` asks:

- present worth = ₹576
- banker's gain = ₹16
- find true discount
- official answer = ₹96

This is a distinct unknown-position semantic not present in CP001.

Source: `https://gpsc.goa.gov.in/wp-content/uploads/QuestionPaper/804.pdf`

### Official GPSC 2026 — two-bill weighted BD system

GPSC paper `QP_GPSC092025011.pdf`, Q33 asks:

- two bills due in 3 and 6 months
- total face value = ₹17,200
- common rate = 10% p.a.
- total banker's discount = ₹610
- find exact difference between the two face values
- official answer = ₹2,800

This changes the topology from one bill to a two-equation weighted-bill system and therefore cannot be treated as a wording variant of CP001.

Source: `https://gpsc.goa.gov.in/wp-content/uploads/2026/06/QP_GPSC092025011.pdf`

## Additional exam-corpus evidence

Further banking / aptitude / past-paper material supports the remaining inverse directions, including:

- `BD + TD -> face value`;
- `BG + rate + time -> TD`;
- `PW + TD -> BD`;
- `PW + TD -> BG`;
- equal `BD(face1)` and `TD(face2)` at the same rate/time -> time;
- `BD:TD + rate -> time`;
- `BD + TD + time -> rate`;
- `TD + rate + time -> BD`.

Sources retained in the machine-readable authority include Meritnotes banking aptitude, the Numerical Aptitude Banker's Discount chapter, IndiaBix, Odtutor IBPS-style ratio problems, and an Indian Navy INCET official-paper reproduction on Testbook.

Punjab-specific corroboration was also found in a PPSC past-paper reproduction containing the cross-face time inverse and the `PW+TD -> BD/BG` directions. This is corroborating past-paper evidence, not upgraded to official PPSC provenance without a primary paper artifact.

## Merge/split rule

A candidate may survive only when all of the following hold:

1. at least one source-evidence record binds to the candidate;
2. its semantic signature does not duplicate a CP001 signature;
3. its semantic signature does not duplicate another CP002 candidate;
4. its executable solver and independent verifier agree across the stress corpus;
5. the mathematical state pool is broad enough;
6. the candidate does not leak a permanent `BTD-QL-*` identity;
7. lifecycle remains discovery-only.

Different story contexts, currencies, bill nouns, option ordering and stem wording are presentation parameters, not separate QLs.

## Explicit holds / rejections

The following are **not** authorized merely because they are algebraically derivable:

- every remaining permutation of `{face, PW, TD, BD, BG, R, T}` without source evidence;
- duplicate date variants that ask only another derived amount from the same bill-date state;
- cash-received variants that are a trivial `face − BD` output without evidence of a distinct exam contract;
- arbitrary three-bill or N-bill systems without source-backed competitive-exam topology;
- alternate nouns, currencies, maturities or narrative surfaces that do not change the solve contract.

## Allocation boundary

Even if all eleven candidates pass CP002, the checkpoint proposes at most a **20-semantic combined inventory** (9 CP001 + 11 CP002). It does not allocate `BTD-QL-001..020` by itself.

```text
permanentQlAllocationAuthorized: false
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
mockTestEligible: false
publiclyPublishable: false
```

A separate exact-head merge/split and allocation checkpoint is required before permanent identities are created.
