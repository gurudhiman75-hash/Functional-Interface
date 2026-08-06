# Simplification and Approximation — Open QL Discovery and Freeze Protocol

**Applies to:** `SAP-001`, `SAP-002`, `SAP-CP-001..SAP-CP-012`  
**Permanent QLs:** 0  
**Purpose:** discover an exhaustive set of task contracts without converting an early count into a quota.

---

## 1. Non-negotiable rule

No checkpoint starts with a required number of QLs or solve modes.

```text
source evidence
→ temporary task candidates
→ executable prototypes
→ direct/inverse/edge/policy gap waves
→ merge/split and ownership decisions
→ count-bearing proposal without permanent IDs
→ product approval
→ permanent chapter-wide allocation
```

Completeness is proved by saturation and audits, not by reaching a target count.

---

## 2. Discovery identities

### 2.1 Source fixture

A normalised source question or pattern preserved as evidence. It must include a resolved AST or approximation policy. A fixture is not automatically a QL.

### 2.2 Prototype

A temporary executable task contract.

```text
SAP-CP001-PROT-...
SAP-CP009-PROT-...
```

Every prototype has:

```text
permanentQlId: null
questionStudioDiscoverable: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
active: false
```

### 2.3 Solve authority

A materially distinct inference contract. Multiple prototypes or representations may merge into one authority.

### 2.4 QL template family

An approved learner-facing task family derived from a proven authority. It remains ID-free until the allocation gate.

### 2.5 Permanent QL

A chapter-wide immutable identity allocated only after explicit approval and freeze proof.

---

## 3. Mandatory discovery dimensions

### 3.1 Task direction

```text
direct evaluation
direct inverse
missing operand
reverse reconstruction
comparison
ordering
select equivalent expression
select correct/incorrect step
nearest-value selection
least/greatest value
range reconstruction
count all admissible values
unique/multiple/impossible/indeterminate
claim verification
data sufficiency
```

### 3.2 Answer semantic

```text
integer
reduced rational
mixed number
decimal
percentage literal
missing operand
comparison class
ordered list
equivalent expression
rounded value
estimated value
nearest option
interval
absolute/relative/percentage error
overestimate/underestimate
truth value
sufficiency class
complete set
count
```

### 3.3 Expression topology

```text
flat operation chain
nested grouping
unary sign
fraction-bar scope
fraction chain
mixed numeric representations
power/root/factorial node
cancellation structure
telescoping structure
fixed unknown leaf
fixed unknown subtree
multiple expression sides
```

### 3.4 Approximation topology

```text
declared place-value rounding
decimal places
significant figures
terms-first rounding
final-only rounding
compatible numbers
nearest-option route
bound-preserving route
reverse rounded range
approximate missing operand
error comparison
```

### 3.5 Representation

```text
plain mathematical expression
prose plus expression
fraction layout
mixed number
decimal/percentage display
expression tree reviewer view
rounding number line
bound interval
option-distance table
statement set
data sufficiency
mini table or caselet
```

A representation becomes a separate QL only when it changes available evidence or learner inference.

### 3.6 Edge states

```text
zero and one operands
negative operands and intermediate values
division by a negative value
fraction less than or greater than one
terminating decimal with trailing zeroes
percentage above 100
zero exponent
negative base with odd/even exponent
0! and 1!
perfect root boundary
rounding tie
negative rounding tie
carry across place values
rounding to zero
denominator near zero
subtraction of close estimates
exact option midpoint
multiple values mapping to one rounded result
```

### 3.7 Misconception topology

A separate authority may be justified when the wrong-answer mechanism changes materially, for example:

- parse/precedence error versus arithmetic slip;
- common-denominator error versus reciprocal error;
- decimal-scale error versus percentage-scale error;
- illegal cancellation versus missed cancellation;
- exact-root error versus non-perfect-root estimation error;
- terms-first versus final-only rounding;
- nearest estimate versus certified bound;
- missing value with one solution versus a complete range/set.

---

## 4. Discovery waves per checkpoint

### Wave 0 — Source and ownership registration

Record:

- source fixture and visual confirmation where needed;
- normalised AST;
- target and answer semantic;
- proposed owner and competing owners;
- exact/approximate contract;
- unresolved convention;
- source defect;
- provisional disposition.

No code and no permanent IDs.

### Wave 1 — Minimal executable foundation

Implement the smallest prototypes needed to prove:

- valid-state-first generation;
- canonical solving;
- independent verification;
- deterministic rendering;
- misconception-derived options;
- explanation evidence;
- lifecycle locks.

Wave 1 is intentionally incomplete.

### Wave 2 — Direction expansion

Search all meaningful direct, inverse, missing-value, comparison, ordering, set/count and possible/impossible forms.

### Wave 3 — Structure and representation expansion

Search:

- deeper AST forms;
- signs and boundary values;
- representation switching;
- statement and data-sufficiency wrappers;
- reviewer visual aids;
- display and localisation hazards.

### Wave 4 — Approximation-policy expansion

For SAP-002, search:

- each supported rounding stage;
- ties and negative ties;
- over/under/bound-preserving routes;
- option-gap bands;
- high-sensitivity subtraction and quotient states;
- exact-versus-approximate notation;
- alternate-policy ambiguity.

### Wave 5 — Source saturation and legacy reconciliation

Re-run:

- uploaded source audit;
- SSC/banking/state-exam pattern audit;
- legacy Fundamentals recovery;
- neighbouring chapter duplicate audit;
- advanced-hold and reject review.

Each source fixture must map once to retain, merge, split, reassign, hold or reject.

### Wave 6 — Merge/split proposal

Compare every plausible prototype pair by:

```text
AST/state topology
givens and hidden target
governing invariant
canonical algorithm
independent route
answer semantic
uniqueness proof
approximation policy
misconception profile
explanation strategy
```

Still no permanent IDs.

---

## 5. Executable proof contract

Proof-sweep size is chosen by domain risk, not a global quota.

Every prototype must prove:

- deterministic replay;
- exact canonical value;
- independent-verifier agreement;
- one unambiguous expression parse;
- valid mathematical domain;
- exact representation and display precision;
- four unique options where MCQ;
- exactly one correct option unless set/count semantics intentionally differ;
- misconception label and recomputation for each wrong option;
- answer-position rotation over the sweep;
- no hidden placeholders or internal IDs;
- derived difficulty;
- lifecycle locks;
- no normalised stem or mathematical-fingerprint collapse;
- no unsafe floating-point equality.

For approximation prototypes, also prove:

- explicit policy;
- transformed values and estimated result;
- exact oracle;
- uncertainty or certified interval where required;
- unique nearest option;
- configured option safety gap;
- no alternate common policy changes the answer unless the stem distinguishes it;
- correct use of `=` and `≈`.

---

## 6. Independence requirements

A verifier is not independent when it calls the canonical solver, reuses its output or merely renames the same helper path.

Examples of acceptable separation:

```text
AST rational evaluator
↔ independently reconstructed rendered-token evaluation

fraction operation formulas
↔ exact common-denominator reconstruction

perfect-root primitive
↔ direct integer-power verification

structural cancellation
↔ bounded direct exact evaluation

inverse arithmetic solver
↔ candidate substitution/enumeration

rounding function
↔ interval-membership proof

compatible-number estimate
↔ exact oracle plus independent error interval

nearest-option selection
↔ exact distance enumeration

root benchmark estimate
↔ integer-power bracketing/high-precision oracle
```

---

## 7. Review-export contract

Before an allocation proposal, export at least three mathematically distinct states per retained prototype unless the domain is smaller.

Each review item must show:

- temporary prototype ID;
- no permanent ID;
- checkpoint and proposed title;
- exact rendered question;
- options and correct answer;
- exact hidden state and AST in technical details;
- canonical trace;
- independent trace;
- approximation policy/evidence where applicable;
- answer semantic;
- difficulty evidence;
- misconception analysis;
- source ancestry;
- lifecycle locks;
- reviewer decision and comments.

Review samples must differ mathematically, not only by seed labels or surface numbers.

---

## 8. Merge rules

Merge prototypes when they share the same:

- material AST/state topology;
- inference direction;
- algorithm;
- answer semantic;
- uniqueness proof;
- approximation policy family;
- misconception space;
- explanation structure.

Typical merge candidates:

- nearest ten/hundred/thousand under one parameterised place engine;
- round to one/two/three decimal places;
- different bracket glyphs with identical grouping;
- fraction versus decimal display where conversion is incidental;
- different exact perfect-root degrees under one bounded parameterised engine.

---

## 9. Split rules

Split when at least one materially changes:

- left-to-right precedence versus nested-group scope;
- direct evaluation versus missing-value inversion;
- exact fraction evaluation versus complex-fraction recursion;
- exact perfect root versus approximate non-perfect root;
- final-only versus terms-first rounding;
- point estimate versus bound/interval;
- nearest option versus explicit error calculation;
- unique missing value versus complete admissible range;
- canonical or independent algorithm;
- misconception-derived option structure.

---

## 10. Reassignment rules

A candidate leaves SAP when its primary objective is:

- representation or number property → Number System;
- percentage relation/application → Percentage;
- symbolic equation/identity → Algebra;
- symbolic surd/index law → Surds and Indices;
- factorial counting → P&C;
- coded/interchanged operator meaning → Reasoning OPS;
- chart/table interpretation → Data Interpretation;
- applied arithmetic chapter semantics → that applied chapter.

An SAP calculation helper does not create duplicate learner ownership.

---

## 11. Saturation evidence

A checkpoint may propose freeze only after:

- all source fixtures are disposed;
- all mandatory discovery dimensions are covered or explicitly inapplicable;
- the latest gap wave adds no new material authority;
- merge/split decisions are documented;
- neighbouring ownership is clear;
- exact and approximation policies are stable;
- generated-corpus coverage has no unexplained holes;
- English review samples are mathematically and editorially acceptable;
- zero-tolerance validation counters are zero.

Saturation is checkpoint-specific and chapter-wide. A CP can appear saturated and still reopen after a cross-CP gap audit.

---

## 12. Count-bearing proposal without allocation

After saturation, create a proposal containing:

- proposed QL template families;
- solve authority per template;
- checkpoint owner;
- answer semantic;
- supported directions and representations;
- merged prototype ancestry;
- split/reassignment decisions;
- proof and review links;
- proposed total count.

The count is a result, not a target. IDs remain null.

---

## 13. Permanent allocation gate

Permanent `SAP-QL-*` identities may be allocated only after explicit product-owner approval of the count-bearing proposal.

Allocation must be:

- chapter-wide;
- collision-free;
- immutable;
- mapped one-to-one to approved templates;
- recorded in a frozen registry;
- still inactive for Question Studio and Question Bank until later gates.

Allocation does not mean publication.

---

## 14. Post-allocation sequence

```text
permanent identity allocation
→ English implementation proof
→ English editorial freeze
→ chapter-wide English gap audit
→ Hindi/Punjabi structured localisation
→ multilingual parity and human review
→ guarded Question Studio integration
→ separate Question Bank/test/public release decisions
```

Any material mathematical gap found after allocation requires an explicit reopen decision. IDs must not be silently repurposed.

---

## 15. Current state

```text
Design blueprint: complete for executable discovery
Source/ownership audit: created
Permanent QLs: 0
Frozen solve modes: 0
Implemented checkpoints: 0
Question Studio: disabled
Question Bank: disabled
Test eligibility: disabled
Public publication: disabled
```
