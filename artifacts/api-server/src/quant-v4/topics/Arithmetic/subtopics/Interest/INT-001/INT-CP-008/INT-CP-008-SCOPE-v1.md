# INT-CP-008 — Equal Instalments and Reducing-Balance Repayment

Status: **Wave 01 executable discovery — temporary prototypes only**  
Parent authority: certified `INT-CP-007` branch head `7b7d52aacb1a54bde5ff5a608a172588a6d03e22`  
Permanent QLs allocated: **0**  
Next potential identity: **INT-QL-116**, only after source saturation + merge/split approval

## Ownership

CP008 owns a single opening balance or fund with an explicitly ordered sequence of **equal periodic** repayments, deposits or withdrawals.

The canonical end-of-period debt recurrence is:

```text
B_k = B_(k-1)(1+r) - X
```

The canonical recurring-deposit recurrence is:

```text
F_k = F_(k-1)(1+r) + D
```

Beginning-of-period payments are a distinct event topology:

```text
B_k = (B_(k-1) - X)(1+r)
```

The canonical solver may use the equivalent finite geometric sum. The independent verifier must rebuild the schedule period by period.

## Boundary

- `INT-CP-007`: complete interest schemes with no intermediate cash flows.
- `INT-CP-008`: one recurring equal periodic cash-flow topology.
- `INT-CP-009`: heterogeneous dated cash flows, unequal timings/amounts, general common-date equivalence.
- `INT-CP-010`: mixed advanced systems, including variable-rate instalments unless CP008 source discovery proves a clean recurring extension.

Changing a story, annual versus half-yearly wording, deposit versus withdrawal context, or payment label does **not** automatically justify a permanent QL. Wave 01 deliberately contains merge candidates so source saturation can prove the final authority count instead of assuming it.

## Wave 01 temporary prototypes

1. `INT-CP008-PROT-001` — recover equal end-of-period instalment from opening balance, periodic rate and count.
2. `INT-CP008-PROT-002` — recover opening balance from equal end-of-period instalment, rate and count.
3. `INT-CP008-PROT-003` — recover outstanding balance after a stated number of regular payments.
4. `INT-CP008-PROT-004` — recover a final balancing payment after earlier regular payments do not fully amortize the balance.
5. `INT-CP008-PROT-005` — equal beginning-of-period instalment; event order differs from ordinary end-of-period repayment.
6. `INT-CP008-PROT-006` — down payment followed by equal periodic instalments; explicit candidate for merge/adaptor analysis against P001.
7. `INT-CP008-PROT-007` — recover periodic rate from a bounded exact instalment schedule.
8. `INT-CP008-PROT-008` — future value of equal recurring end-of-period savings deposits.
9. `INT-CP008-PROT-009` — required opening fund for equal recurring withdrawals; explicit merge/context candidate against P002.
10. `INT-CP008-PROT-010` — missed instalment with final catch-up addition under explicit event order.
11. `INT-CP008-PROT-011` — difference between equal instalments under two periodic rates for the same opening debt and duration.

## Discovery requirements

Every prototype must prove:

- deterministic state construction;
- exact-rational solver output;
- independent recurrence verifier agreement;
- exactly four unique MCQ options with only the keyed option accepted;
- all four correct-answer positions over the audit pool;
- all three temporary stem families over the audit pool;
- annual and half-yearly period-unit coverage;
- a non-trivial mathematical state pool;
- no permanent QL allocation;
- no Question Studio registration;
- no Question Bank storage/write authority;
- no test/mock/public delivery authority.

## Wave 01 is not saturation

The existing chapter design also names comparison, changed instalment and other bounded recurring-payment directions. After Wave 01 goes green, the next step is a **source/gap audit** across:

- equal annual and half-yearly instalments;
- opening-loan inverse;
- outstanding balance;
- final balancing instalment;
- end-versus-beginning event order;
- down payment + instalments;
- missed/changed instalments;
- exact bounded rate inverse;
- recurring savings;
- recurring withdrawals;
- two-rate comparison;
- any source-backed representation variants.

Only then should merge/split be proposed. No `INT-QL-116+` identity is reserved by this Wave 01 work.

## Lifecycle

```text
permanentQlCount:            0
permanentQlAllocation:       FORBIDDEN
runtimeEnabled:              false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
questionBankWritable:        false
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```
