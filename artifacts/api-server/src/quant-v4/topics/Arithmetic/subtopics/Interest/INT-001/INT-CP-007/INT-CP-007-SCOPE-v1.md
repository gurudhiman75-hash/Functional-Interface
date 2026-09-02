# INT-CP-007 — Effective Rates, Scheme Comparison and Equal Future Values

Status: **source-saturated; permanent QLs allocated; English V2 under product review**

## Purpose

CP007 owns questions in which two complete interest schemes are compared or made equivalent at a common date. The decisive reasoning is comparison, equivalence, a one-time present allocation, or a bounded cross-scheme inverse—not merely evaluating one scheme's amount formula.

## Proven discovery history

Executable discovery started with 9 temporary prototypes. The first foundation audit passed 2,700 exact states and then exposed three mathematical collisions plus one missing source-backed inverse. Discovery V2 therefore tested 10 temporary prototypes.

The exact-head saturation audit classified all 12 recovered source directions with:

- **7 retained mathematical contracts**;
- **3 prototype merges**;
- standalone nominal/effective annual rate reassigned to CP004;
- inheritance-at-different-ages retained only as an equal-future-value context variant;
- **0 meaningful unclassified source directions**.

Saturation evidence:

- runtime `INT-CP-007-DISCOVERY-v2`;
- exact source head `ebaaca224622093906ac5039f6df7641b28e577b`;
- workflow `Validate INT-CP-007 Saturation V1`;
- run `32124315581` — PASS;
- artifact `9319765647`;
- artifact digest `sha256:96d0146499e23f6c3b55226e3eb70649279f17651161aa5f1d6cc367b3f3e71d`;
- 2,000 deterministic states and 2,000 independent verifier checks;
- 600 executable merge-containment checks;
- 12/12 source directions classified.

## Permanent QL authority

The seven retained contracts are permanently allocated as:

| QL | Contract | Given → answer | Discovery source |
|---|---|---|---|
| `INT-QL-109` | Choose the higher-maturity scheme | common principal + two complete schemes → winning scheme | PROT-001 |
| `INT-QL-110` | Difference between two scheme returns | common principal + two complete schemes → maturity amount difference | PROT-002 |
| `INT-QL-111` | Missing rate from equal maturity | one complete scheme + second method/duration → second annual rate | PROT-003 |
| `INT-QL-112` | Split a present total for equal future values | present total + two complete schemes → one present component | PROT-007 |
| `INT-QL-113` | Present-principal ratio for equal future values | two complete schemes → required present-principal ratio | PROT-008 |
| `INT-QL-114` | First whole-year scheme overtake | two complete schemes → first whole year one exceeds the other | PROT-009 |
| `INT-QL-115` | Missing present principal for equal future value | known present principal + two complete schemes → other present principal | PROT-010 |

Permanent allocation evidence:

- runtime `INT-CP-007-v3-permanent-allocation`;
- allocation head `bed7bdfc012ee684f94592d0cfa6e3b3d8f9d15c`;
- workflow `Validate INT-CP-007 Permanent Allocation V1`;
- run `32124642972` — PASS;
- artifact `9319859619`;
- artifact digest `sha256:bb13cbcea9c92fb29b72449f0d2f511a19db8e4bd7b019a14119a599d237e7c3`;
- 2,100 permanent states;
- 2,100 deterministic checks;
- 2,100 solver/verifier checks;
- 10,500 permanent identity checks;
- 14,700 lifecycle checks.

Permanent identity is frozen. Learner wording is not frozen until product review is approved.

## Proven merges

The following discovery prototypes do **not** receive separate QLs:

- PROT-004 simple borrowing / compound lending gain → `INT-QL-110` as an ordered return-difference context;
- PROT-005 equivalent simple rate → `INT-QL-111` as a specialization of the general equal-maturity rate inverse;
- PROT-006 equivalent compound rate → `INT-QL-111` as the converse specialization.

A change in story alone never creates a QL.

## Ownership boundaries

### CP004

CP004 remains sole owner of standalone compounding-frequency mechanics and standalone nominal-to-effective annual rate calculation. CP007 may consume such an accumulation factor only when comparison/equivalence is the learner task.

### CP002

CP002 owns simple-only split-principal ledgers. CP007 owns a one-time present allocation when different accumulation factors are equated at a common future date.

### CP003

CP003 owns direct/inverse annual compound accumulation for one scheme. CP007 owns cross-scheme equality/comparison even when one component uses CP003 mathematics.

### CP008

CP008 owns recurring equal instalments, deposits or withdrawals. CP007 has no recurring cash-flow series.

### CP009

CP009 owns heterogeneous dated cash flows, replacement payments and equated due dates. CP007 permits only initial principals/allocation and accumulation to the comparison date; no intermediate cash flows are allowed.

### Context variants

Inheritance, beneficiaries of different ages, two fictional plans, borrowing/lending language and abstract Scheme A/Scheme B may be separate authored stem families while sharing one permanent mathematical contract.

## Mathematical authority

For principal `P`, annual rate as decimal `r` and whole-year duration `n`:

- simple maturity factor: `F_SI = 1 + nr`;
- annual compound maturity factor: `F_CI = (1+r)^n`;
- maturity amount: `A = P × F`.

For two schemes with factors `F1` and `F2` at the comparison date:

- equal-principal amount difference: `P × |F1−F2|`;
- missing rate: solve the second scheme factor exactly from the first scheme factor;
- total split `T` into `x` and `T−x`: `xF1 = (T−x)F2`, so `x = T F2/(F1+F2)`;
- equal-future-value present ratio: `P1/P2 = F2/F1`;
- missing present principal: `P2 = P1F1/F2`.

Equivalent compound-rate inverses use a bounded exact rate library. No floating roots or logarithms are permitted. First-overtake questions use bounded whole-year enumeration and verify that every earlier whole year fails.

## Exactness and verifier policy

- money, rates and factors use exact rational arithmetic;
- comparison uses exact cross multiplication, not rounded displays;
- independent verification rebuilds each accumulation factor;
- allocation verification substitutes both present components into their future-value branches;
- missing-principal verification accumulates the candidate forward;
- overtake verification checks the selected year and all preceding whole years.

## English learner-authoring requirements

- three genuinely different authored English stem families per QL;
- four deterministic options with independently false misconception distractors;
- explanations explicitly state what is asked, what is given, the accumulation/equality relation, substitution, arithmetic and final conclusion;
- no financial recommendation language;
- neutral/fictional scheme names only.

English V1 (`INT-CP-007-EN-v1-review`) failed strict CI because some QL113 distractor formulas collapsed to duplicate ratio values. It is retained as failed evidence and is superseded by English V2. V2 changes only QL113 distractor construction; permanent mathematics is unchanged.

Hindi/Punjabi localization remains blocked until English product approval and freeze. Punjabi Compound Interest terminology must use `ਮਿਸ਼ਰਤ ਵਿਆਜ`.

## Delivery boundary

Permanent QL allocation and English review do not authorize delivery:

- `enabled: false`
- `stagingStatus: NOT_STAGED`
- `registrationStatus: NOT_REGISTERED`
- `questionStudioDiscoverable: false`
- Question Bank: `NOT_STORED`
- tests: `INELIGIBLE`
- public publication: `false`
