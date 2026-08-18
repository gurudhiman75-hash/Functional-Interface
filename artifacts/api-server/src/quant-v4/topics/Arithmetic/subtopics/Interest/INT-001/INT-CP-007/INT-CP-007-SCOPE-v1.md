# INT-CP-007 — Effective Rates, Scheme Comparison and Equal Future Values

Status: **executable discovery / no permanent QLs allocated yet**

## Purpose

CP007 owns questions in which two or more complete interest schemes must be compared or made equivalent at a common date. The decisive reasoning is not the direct amount formula of one scheme, but comparison, equivalence, allocation or a bounded cross-scheme inverse.

The checkpoint begins as executable discovery. Prototype identities are temporary and must not be promoted to permanent `INT-QL-*` identities until collision, inverse, edge and source-saturation audits stop finding meaningful uncovered contracts.

## Source basis

The Interest end-to-end design and source/ownership audit recover the following CP007 source structures:

- equal principal in two schemes;
- equal maturity amount under different methods/rates;
- simple borrowing and compound lending;
- effective/equivalent return comparison;
- division of a present sum so future amounts become equal;
- inheritance shares maturing at different future ages;
- equal values at different future dates;
- bounded scheme break-even / first-overtake questions.

No current real-world financial product, bank rate or recommendation is permitted. Every scheme is a closed mathematical state.

## Ownership boundaries

### CP004

CP004 remains sole owner of standalone compounding-frequency mechanics and standalone nominal-to-effective annual rate calculation.

CP007 may consume a mature CP004 accumulation factor when that factor is only one side of a **comparison/equivalence** question. Merely asking for effective annual rate from one nominal rate/frequency does not create a CP007 QL.

### CP002

CP002 owns split-principal questions when all branches are simple-interest contributions in one linear ledger.

CP007 owns a one-time present allocation when different accumulation factors are compared at a common future date and the equality of future values is decisive.

### CP003

CP003 owns direct/inverse annual compound accumulation for one scheme. CP007 owns cross-scheme equality/comparison, even when one component uses CP003 mathematics.

### CP008

CP008 owns recurring equal instalments, deposits or withdrawals. CP007 has no recurring cash-flow series.

### CP009

CP009 owns heterogeneous dated cash flows, replacement payments and equated due dates. CP007 permits only the initial scheme deposits/allocation and accumulation to a stated comparison date; there are no intermediate cash flows.

### Context variants

Inheritance, beneficiaries of different ages, two named investment plans and two abstract schemes may be separate authored stem families while sharing one mathematical contract. Context alone never creates a QL.

## Foundation prototype contracts

Temporary prototype IDs:

| Prototype | Contract | Given → answer |
|---|---|---|
| `INT-CP007-PROT-001` | Better scheme at common maturity | principal + duration + two schemes → winning scheme |
| `INT-CP007-PROT-002` | Maturity-return difference | principal + duration + two schemes → amount difference |
| `INT-CP007-PROT-003` | Missing rate from equal maturity | complete scheme + second method/duration → second rate |
| `INT-CP007-PROT-004` | Borrow-under-one / lend-under-another gain | principal + duration + borrowing/lending schemes → net gain |
| `INT-CP007-PROT-005` | Equivalent simple annual rate | compound scheme + duration → simple rate with same maturity amount |
| `INT-CP007-PROT-006` | Equivalent compound annual rate | simple scheme + duration → bounded exact compound rate with same maturity amount |
| `INT-CP007-PROT-007` | Split total for equal future values | total present sum + two accumulation factors → component principal |
| `INT-CP007-PROT-008` | Present-principal ratio for equal future values | two accumulation factors → present-principal ratio |
| `INT-CP007-PROT-009` | First whole-year scheme overtake | two schemes → first whole year one scheme exceeds the other |

Discovery disposition candidates:

- inheritance-at-different-ages is expected to merge into prototype 007 as a context/stem variant;
- equal-present-value wording is expected to merge into 007/008 depending on answer semantic;
- “choose the better plan” and “how much more” remain separate only if scheme-choice versus money-difference answer semantics justify separate learner contracts;
- nominal/effective-rate-only questions must be rejected to CP004;
- any question with an intermediate payment/deposit must be rejected to CP008/009.

## Mathematical authority

For principal `P`, annual rate as a decimal `r` and whole-year duration `n`:

- simple maturity factor: `F_SI = 1 + nr`;
- annual compound maturity factor: `F_CI = (1+r)^n`;
- maturity amount: `A = P × F`.

For two schemes with factors `F1` and `F2` at the same comparison date:

- amount difference: `P × |F1−F2|` for equal principal;
- equal-maturity rate inverse: solve the missing scheme factor exactly from the known factor;
- one-time split of total `T` into `x` and `T−x` for equal future values:
  `xF1 = (T−x)F2`, so `x = T F2 / (F1+F2)`;
- for equal future values from two present principals, `P1/P2 = F2/F1`.

Equivalent-rate inverses must use exact algebra for SI and bounded exact enumeration for compound rates. No floating roots/logarithms are permitted.

First-overtake questions are solved by bounded whole-year enumeration. The question must state which scheme must first exceed the other and the bounded production state must guarantee a crossing.

## Exactness and verifier policy

- all money/rates/factors use exact rational arithmetic;
- runtime construction starts from admissible exact states;
- compound inverse rates use a finite exact rate library;
- comparison uses exact cross multiplication, never rounded displayed values;
- the independent verifier rebuilds each scheme factor from method/rate/duration rather than trusting a stored winning scheme or stored difference;
- allocation verification substitutes the candidate component back into both future-value branches;
- overtake verification checks both the selected year and all earlier whole years.

## Editorial requirements for later question generation

- three genuinely different authored English stem families per retained contract;
- explanations must say what is given, what is required, how each scheme grows, the common-date comparison/equality equation, substitution, arithmetic and final conclusion;
- no recommendation language such as “best investment for you”;
- scheme names are fictional/neutral;
- Hindi/Punjabi localization occurs only after English product approval and freeze;
- Punjabi compound-interest terminology must follow the chapter standard `ਮਿਸ਼ਰਤ ਵਿਆਜ`.

## Delivery boundary

Discovery does not authorize learner delivery:

- `enabled: false`
- `stagingStatus: NOT_STAGED`
- `registrationStatus: NOT_REGISTERED`
- `questionStudioDiscoverable: false`
- Question Bank: `NOT_STORED`
- tests: `INELIGIBLE`
- public publication: `false`

## Exit gate for permanent QL allocation

Permanent QLs may be allocated only after the executable foundation proves:

1. all nine prototype directions are mathematically valid and deterministic;
2. cross-prototype answer semantics and solve routes are classified;
3. CP004/CP002/CP008/CP009 collisions are explicitly rejected or reassigned;
4. inverse rate states are exact and bounded;
5. equal-future-value allocation is proven without introducing intermediate cash flows;
6. no meaningful source-backed comparison/equivalence contract remains unclassified.
