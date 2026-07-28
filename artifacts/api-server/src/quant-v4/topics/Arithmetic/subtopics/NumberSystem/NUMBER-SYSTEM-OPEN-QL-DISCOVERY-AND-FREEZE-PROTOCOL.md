# Number System — Open QL Discovery and Freeze Protocol

**Applies to:** `NUM-001`, `NUM-002`, `NUM-CP-001..014`  
**Permanent QLs:** 0  
**Purpose:** make the solve-mode and QL inventory exhaustive without turning a guessed count into a quota.

---

## 1. Non-negotiable rule

No checkpoint begins with a required number of QLs or solve modes.

The process is:

```text
source evidence
→ temporary task candidates
→ executable prototypes
→ gap waves
→ merge/split decisions
→ count-bearing template proposal without IDs
→ product approval
→ permanent ID allocation
```

A checkpoint may finish with fewer or more authorities than its first design list. Completeness is proved by audits, not by reaching a target number.

---

## 2. Terminology

### 2.1 Source fixture

A reviewed question pattern or example preserved as evidence. A source fixture is not automatically a QL.

### 2.2 Prototype

A non-permanent executable task contract used to test mathematics, generation, options, explanations, ownership and uniqueness.

Prototype identity format:

```text
NUM-CP003-PROT-...
```

A prototype must have:

- no permanent QL ID;
- no Question Studio exposure;
- no Question Bank eligibility;
- no public lifecycle state.

### 2.3 Solve authority

A materially distinct inference contract. Several prototypes may merge into one solve authority.

### 2.4 QL template family

An approved learner-facing task template derived from a proven solve authority. It remains ID-free until the allocation gate.

### 2.5 Permanent QL

A chapter-wide immutable identity allocated only after explicit approval and freeze proof.

---

## 3. Candidate discovery dimensions

Every CP must search across all relevant dimensions.

### 3.1 Task direction

```text
forward
direct inverse
reverse reconstruction
missing variable
least/greatest optimisation
count all valid values
select valid set
possible/impossible
unique/multiple/indeterminate
claim verification
```

### 3.2 Answer semantic

```text
number
digit
digit set
count
prime factor
exponent
factorisation
divisor
HCF
LCM
remainder
residue class
terminal digits
trailing-zero count
base
base numeral
truth value
sufficiency class
```

### 3.3 State topology

```text
single constraint
multiple compatible constraints
multiple incompatible constraints
single-stage transformation
multi-stage transformation
cyclic state
range-bounded state
constructed prime-exponent state
digit-equation state
mixed-engine state
```

### 3.4 Representation

```text
plain prose
mathematical expression
number line
factor tree
prime-exponent table
Euclidean ladder
remainder table
digit column arithmetic
place-value table
base-conversion table
statement set
data sufficiency
mini caselet
```

A representation becomes a separate QL only if it changes the evidence available or the learner inference, not merely the layout.

### 3.5 Edge and boundary states

```text
zero and one conventions
negative integers
remainder zero
remainder divisor minus one
cycle-position remainder zero
leading zero
carry and borrow
co-prime and non-co-prime moduli
one, many or no valid digits
interval endpoint inclusion
exactly versus at least
square/cube exponent already complete
invalid base digit
minimum permissible base
```

### 3.6 Misconception topology

A task may require a separate authority if its wrong-answer space is materially different. Examples include:

- direct divisibility versus all-valid-digit enumeration;
- total divisors versus even divisors;
- ordinary remainder versus simultaneous congruences;
- last digit versus last two digits;
- decimal-to-base conversion versus unknown-base reconstruction;
- trailing zeroes versus highest composite power.

---

## 4. Discovery waves per checkpoint

Each CP follows the same open sequence.

### Wave 0 — Source and ownership registration

Required outputs:

- source fixtures;
- visible givens and target;
- proposed owner;
- competing chapter owners;
- unresolved conventions;
- known source defects.

No code and no permanent IDs.

### Wave 1 — Architecture foundation

Implement the smallest set of temporary prototypes needed to prove:

- exact state construction;
- canonical solving;
- independent verification;
- deterministic option generation;
- structured explanation evidence;
- lifecycle locks.

Wave 1 is deliberately incomplete and must be labelled as such.

### Wave 2 — Direct and inverse gap expansion

Search for:

- every unknown variable direction;
- count/set predicates;
- possible/impossible forms;
- least/greatest forms;
- bounded reconstruction.

### Wave 3 — Edge and representation expansion

Search for:

- boundary states;
- multiple/no-solution states;
- diagrams/tables;
- statements and data sufficiency;
- exact display and locale risks.

### Wave 4 — Source saturation and legacy reconciliation

Re-run:

- uploaded source audit;
- SSC/PYQ audit;
- Quant V2 family recovery;
- Quant V3 trace recovery;
- cross-chapter duplicate audit.

Every source fixture must be mapped exactly once to retain, merge, split, reassign, reject or hold.

### Wave 5 — Merge/split and ownership freeze proposal

For each prototype pair, compare:

```text
givens
unknown
governing invariant
algorithm
answer semantic
uniqueness proof
misconception profile
explanation strategy
```

Then propose:

- retained solve authorities;
- merged representations/parameters;
- split authorities;
- reassigned items;
- rejected items;
- open gaps.

Still no permanent IDs.

---

## 5. Executable proof contract

Every prototype must generate enough deterministic states to prove behaviour across its parameter space. The number of seeds is chosen by risk and domain size, not by one global quota.

Required checks:

- deterministic replay;
- exact canonical answer;
- independent-verifier agreement;
- four unique options where MCQ;
- exactly one marked correct option unless the task intentionally asks for a set/predicate;
- misconception label for each wrong option;
- all answer positions reached over the proof sweep;
- no hidden or unresolved placeholders;
- complete unit/semantic formatting;
- difficulty derived from live state;
- lifecycle/publication locks;
- no learner-facing internal IDs;
- no exact or normalised cross-QL stem collisions above the accepted threshold;
- no mathematical fingerprint collapse to one repeated state.

### 5.1 Independent verification must differ materially

Examples:

```text
Divisibility shortcut
↔ exact division of every candidate

Prime-exponent divisor formula
↔ explicit divisor enumeration in bounded states

CRT construction
↔ bounded residue search

Cycle-table terminal digit
↔ modular exponentiation

Legendre factorial valuation
↔ explicit accumulation of prime factors

Base positional expansion
↔ repeated division reconstruction
```

A second function that calls the same helper with renamed variables is not independent verification.

---

## 6. Review-export contract

Before any approval proposal, export at least three mathematically distinct states per retained prototype unless the domain itself is smaller.

Reviewer artefacts must include:

```text
prototype/temporary identity
proposed CP owner
source provenance
stem
options
correct answer
answer semantic
canonical reasoning
independent-verifier evidence
shortcut
actual option-specific trap explanations
hidden mathematical state
misconception IDs as reviewer-only metadata
lifecycle flags
```

Required formats:

- JSON or JSONL for machine audit;
- CSV for batch editorial review;
- HTML or Markdown for human reading.

---

## 7. Human editorial gate

Automated validity does not freeze learner text.

The human review must check:

- exam-realistic wording;
- no classroom-only or robotic framing;
- every visible given is sufficient;
- no hidden assumptions;
- correct natural terminology;
- readable number sizes;
- appropriate shortcut;
- full step-by-step solution;
- actual wrong-option analysis;
- English originality and variation;
- future Hindi/Punjabi translatability from structured state.

Defects are batched by family and repaired at the shared renderer or task-contract layer where possible. Individual row patches must not conceal a systemic generator defect.

---

## 8. Count-bearing allocation proposal

After all checkpoint gaps are closed, produce a proposal containing:

```text
retained solve authorities by CP
approved QL-template families by authority
representation parameters
context parameters
answer semantics
merge/split decisions
source coverage
rejected/reassigned items
remaining open risks
proposed total count
```

This proposal may state a count, but it must not allocate `NUM-QL-*` identities.

The count is an outcome of evidence, not a target.

---

## 9. Permanent ID freeze gate

Permanent IDs are allocated only after explicit product-owner approval of the count-bearing proposal.

Rules:

- one chapter-wide continuous range across `NUM-001` and `NUM-002`;
- no package-local reset;
- QL identity tied to solve contract, not wording;
- permanent mapping record includes source and prototype ancestry;
- ID allocation occurs in a separate PR or clearly isolated commit;
- any later new material requires a new post-freeze discovery and allocation decision.

Example shape only:

```text
NUM-QL-001 ... NUM-QL-N
```

`N` is deliberately unknown at design time.

---

## 10. Checkpoint freeze gates

A CP may be proposed for English freeze only when:

- source saturation is documented;
- all candidate tasks have dispositions;
- inverse and edge audits pass;
- ownership collisions are closed;
- every permanent QL has exact generation;
- every permanent QL has independent verification;
- options and explanations pass adversarial audit;
- generated review corpus is approved;
- no public route is introduced accidentally.

A CP freeze does not imply chapter freeze. Later CP work may discover a genuine ownership gap, which must be handled transparently through a new discovery record rather than silently inserted.

---

## 11. Chapter-wide English closure

After all CPs are frozen:

- prove continuous QL identity;
- run every QL over a broad seed matrix;
- run cross-CP and cross-package collision audits;
- prove all answer positions and difficulties are reachable;
- prove every solver/verifier pair;
- prove every source fixture is represented or disposed;
- audit explanation diversity and human authorship;
- export one or more English questions per permanent QL;
- create an English freeze record.

Question Studio remains disabled unless separately approved.

---

## 12. Multilingual closure

Hindi and Punjabi are downstream releases, not automatic translations.

For every permanent QL:

- generate from the same hidden state;
- preserve exact answer and option index;
- preserve formula and MathJax authority;
- localise task wording, explanation, shortcuts and traps;
- reject English instructional fallback;
- run script-separation checks;
- run natural-language human review;
- freeze locale releases separately.

---

## 13. Question Studio and publication gates

The release sequence is deliberately separated:

```text
Design
→ executable discovery
→ permanent English QLs
→ English editorial freeze
→ Hindi/Punjabi review and freeze
→ Question Studio review routing
→ Question Bank conversion
→ mock-test eligibility
→ public publication
```

No earlier gate implies a later one.

---

## 14. Recommended discovery order after design approval

The CP numbering is pedagogical, but executable discovery may begin with the strongest architecture-establishing checkpoint.

Recommended sequence:

```text
1. NUM-CP-003 — Divisibility and missing digits
2. NUM-CP-004 — Prime structure
3. NUM-CP-005 — Divisor functions
4. NUM-CP-006 — HCF/LCM
5. NUM-CP-007 — Division algorithm
6. NUM-CP-008 — Congruences
7. NUM-CP-009 — Terminal digits
8. NUM-CP-011 — Factorial valuations
9. NUM-CP-012 — Perfect powers
10. NUM-CP-010 — Digit reconstruction
11. NUM-CP-002 — Fractions/decimals
12. NUM-CP-001 — Sets/order/parity
13. NUM-CP-013 — Bases
14. NUM-CP-014 — Synthesis only after all component engines exist
```

Rationale:

- Divisibility has strong uploaded, legacy and exam evidence;
- prime factorisation supports divisors, HCF/LCM, valuations and perfect powers;
- synthesis must not be implemented before its component authorities are proven.

This order is a workflow recommendation, not a freeze decision.

---

## 15. Design-stage truth

At the completion of these design documents:

```text
Student-facing chapter: defined
Runtime package hypothesis: defined
Provisional CP hypotheses: 14
Current solve-mode baseline: broad but unfrozen
Permanent QLs: 0
Frozen solve modes: 0
Implemented prototypes: 0
Question Studio exposure: 0
Publicly publishable questions: 0
```

The next valid action is review and approval of the design/ownership hypothesis. Implementation begins only after that decision.
