# INT-CP-009 — Heterogeneous Dated Cash Flows

Status: **executable discovery / no permanent QL allocation**

## Ownership

CP009 owns fixed-rate interest questions in which the decisive structure is an explicitly timed **heterogeneous** cash-flow ledger. At least two non-equal cash flows or a changed/missing flow must materially affect the solution.

Mandatory source directions inherited from the certified CP008 source-gap audit:

1. deposits on different dates;
2. unequal repayments;
3. changed middle payment.

## Boundaries

- CP007 keeps equal-future-value scheme/allocation tasks where the main unknown is how a present sum is split between schemes.
- CP008 keeps equal periodic instalments, equal recurring deposits/withdrawals, and their direct inverses.
- CP009 owns unequal or changed dated flows at one fixed periodic rate, solved by ledger recurrence or common-date equivalence.
- CP010 remains the provisional owner of mixed/variable-rate instalment systems unless later discovery proves a cleaner boundary.

## Wave 01 temporary prototypes

No IDs below are permanent learner QLs.

1. `INT-CP009-PROT-001` — future fund from heterogeneous dated deposits.
2. `INT-CP009-PROT-002` — opening debt from unequal repayments.
3. `INT-CP009-PROT-003` — missing/changed middle repayment.
4. `INT-CP009-PROT-004` — outstanding balance after unequal repayments.
5. `INT-CP009-PROT-005` — final balancing payment after unequal repayments.
6. `INT-CP009-PROT-006` — missing dated deposit required for a target future fund.
7. `INT-CP009-PROT-007` — bounded exact periodic-rate recovery from a heterogeneous schedule.
8. `INT-CP009-PROT-008` — equivalent single payment at an explicit comparison date.

Prototype 008 is intentionally included as a merge/split probe: it may collapse into the same common-date valuation authority as another prototype after collision testing.

## Canonical mathematics

For a fixed periodic growth factor `g = 1 + r`, move every dated cash flow to one comparison date `T`:

`equivalent(T) = sum(flow_i * g^(T - t_i))`

For a repayment ledger, the independent recurrence is:

`B_k = B_(k-1) * g - payment_k`

Both routes must agree whenever they describe the same schedule.

## Discovery rules

- exact rational arithmetic only;
- deterministic state construction;
- fixed rate per schedule in CP009 Wave 01;
- explicit integer period indices;
- at least two heterogeneous flows for every retained prototype;
- bounded inverse rate search only; no floating logarithms/root solving;
- four distinct MCQ options with exactly one correct answer;
- temporary English stems only at this gate;
- no permanent QL identity before source/gap saturation and final merge/split approval.

## Lifecycle

```text
permanentQlCount:            0
nextPotentialQlIdentity:     INT-QL-125 (not reserved)
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```
