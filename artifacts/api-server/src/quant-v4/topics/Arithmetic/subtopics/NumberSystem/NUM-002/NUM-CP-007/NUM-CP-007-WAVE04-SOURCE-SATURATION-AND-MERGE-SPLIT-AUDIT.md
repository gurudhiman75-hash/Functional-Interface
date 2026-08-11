# NUM-CP-007 Wave 04 — Source Saturation, Ownership and Merge/Split Audit

**Checkpoint:** `NUM-CP-007 — Division Algorithm and Elementary Remainder Transformation`  
**Audit base:** `New-main@644e26d32a98fd08a73b945fcb372c27aa4f3757`  
**Status:** `SOURCE_SATURATION_FOUND_MATERIAL_GAPS`  
**Permanent QLs:** `0`  
**Next chapter-wide identity:** `NUM-QL-098`  
**Question Studio / Question Bank / test / public lifecycle:** disabled

---

## 1. Decision

The 24 Wave 01–03 prototypes are mathematically healthy executable discovery, but **NUM-CP-007 is not ready for permanent QL allocation**.

Wave 04 source saturation found several recurring, source-backed division/remainder topologies that are absent from the current runtime. It also found representation-only duplicates and cross-checkpoint ownership collisions that must be resolved before a count-bearing proposal.

Therefore:

```text
DO NOT allocate NUM-QL-098 yet.
DO NOT freeze the current 24 prototypes as 24 QLs.
DO NOT activate any product surface.
Run a focused Wave 04 gap implementation, then repeat merge/split.
```

---

## 2. Authorities reviewed

This audit reconciles:

1. the 24 executable prototypes from Waves 01–03;
2. `NUM-001-NUM-002-END-TO-END-DESIGN.md`;
3. `NUM-002-COMPLETE-CHECKPOINT-DESIGN.md`;
4. `NUMBER-SYSTEM-CROSS-CP-OWNERSHIP-AND-DEPENDENCY-MATRIX.md`;
5. `NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md`;
6. Quant V2 scenario/PYQ-recovery infrastructure;
7. Quant V3 `NS-REM-001` and `NS-REM-002` specifications;
8. uploaded SSC Number System PYQs;
9. uploaded R.S. Aggarwal quantitative-aptitude remainder/division material;
10. uploaded Arun Sharma Number System material;
11. the exact-head Wave 01–03 review exports and runtime evidence.

The open-QL protocol requires source saturation and exact disposition before merge/split and permanent allocation. This audit follows that rule.

---

## 3. Current 24 prototypes — audit disposition

### 3.1 Direct division reconstruction

| Prototype | Current task | Disposition | Reason |
|---|---|---|---|
| `PROT-001` | recover remainder from dividend/divisor/quotient | RETAIN | Distinct unknown and misconception profile. |
| `PROT-002` | recover dividend from divisor/quotient/remainder | RETAIN | Direct source-backed division-lemma reconstruction. |
| `PROT-003` | recover divisor from dividend/quotient/remainder | RETAIN | Distinct inverse direction; requires exact divisibility after removing remainder. |
| `PROT-004` | recover quotient from dividend/divisor/remainder | RETAIN | Distinct inverse direction and answer semantic. |
| `PROT-021` | choose quotient/remainder pair from table | RETAIN, GENERALISE REPRESENTATION | The real learner contract is completion of the quotient–remainder pair from `N,d`; the table itself is only a representation. |

**Required edge hardening:** the shared direct-state generator currently uses quotient `>= 1`, so quotient-zero / dividend-smaller-than-divisor states are not actually exercised by the direct reconstruction families. Add explicit `q=0, N<d, r=N` states where uniqueness remains valid. Do not force `q=0` into missing-divisor questions because `N=r` does not uniquely determine the divisor.

### 3.2 Division-state validity and claims

| Prototype | Current task | Disposition | Reason |
|---|---|---|---|
| `PROT-005` | select the valid division statement | RETAIN | Option-level state validation. |
| `PROT-019` | classify one division record | RETAIN | Different target: identify validity/defect class rather than choose a whole record. |
| `PROT-022` | statement combination | RETAIN | Multiple claims must be independently evaluated; analogous to a claim-verification learner contract. |

These may share low-level validators but should not be collapsed merely because all use `N=dq+r` and `0<=r<d`.

### 3.3 Elementary remainder propagation

| Prototype | Current task | Disposition | Reason |
|---|---|---|---|
| `PROT-006` | remainder of sum | MERGE WITH `PROT-009` | Same additive residue-composition authority; sign is a governed parameter. |
| `PROT-009` | remainder of difference | MERGE WITH `PROT-006` | Same inference after signed reduction. |
| `PROT-007` | remainder of product | RETAIN | Two independent residues and multiplicative composition. |
| `PROT-010` | remainder after scaling | MERGE WITH `PROT-012` | Scaling is the linear special case of the single-residue expression/polynomial authority. |
| `PROT-012` | bounded linear/quadratic polynomial remainder | RETAIN AS PARENT OF `PROT-010` | Covers `aN+b`, scaling and bounded polynomial transformations from a known residue. |
| `PROT-011` | compatible nested divisor | RETAIN | Requires the second divisor to divide the known divisor; this compatibility fact is essential. |

**Boundary:** incompatible second divisors are not CP-007 variants. They become an indeterminate/compatibility modular question and belong to CP-008 unless another source-specific owner is proven.

### 3.4 Exact-divisibility adjustment

| Prototype | Current task | Disposition | Reason |
|---|---|---|---|
| `PROT-008` | least addition/subtraction for exact divisibility | RETAIN | Adjustment amount is the requested semantic. Addition/subtraction are parameters of one authority. |
| `PROT-016` | nearest multiple / lower-upper-tie class | RETAIN | Same primitive state but materially different answer semantic and misconception topology. |

The existing exact/tie boundary states are valuable and should remain.

### 3.5 Linked division relations

| Prototype | Current task | Disposition | Reason |
|---|---|---|---|
| `PROT-013` | linked relation `d=q+c`, find divisor | RETAIN AND EXPAND | The source corpus contains several materially broader quotient/divisor/remainder relations. |
| `PROT-024` | mini-caselet over the same `d=q+c` state, find quotient | MERGE INTO `PROT-013` AUTHORITY | Same hidden equation and uniqueness proof; mini-caselet is representation and quotient/divisor can be target projections. |

The present additive relation is too narrow for source saturation; see Section 5.

### 3.6 Bounded residue-class state

| Prototype | Current task | Disposition | Reason |
|---|---|---|---|
| `PROT-014` | count matching integers in an interval | RETAIN, RESTRICT OWNERSHIP | Distinct count projection. For `remainder=0`, direct divisibility range count collides with CP-003 `NUM-QL-013`; CP-007 public ownership should use a genuinely non-zero remainder condition or route zero-remainder states to CP-003. |
| `PROT-017` | unique bounded integer | RETAIN | Unique reconstruction under a residue class and bounds. |
| `PROT-018` | complete bounded set | RETAIN | Set output is materially different from unique/count. |
| `PROT-015` | none/one/many/invalid topology | RETAIN | Solution-topology classification is a distinct diagnostic contract. |
| `PROT-023` | data sufficiency | RETAIN | Sufficiency requires separate candidate-set tests under I, II and both. |

A legacy gap remains for **least-above / greatest-below under a non-zero remainder condition**; see Section 5.

### 3.7 Same-remainder divisor

| Prototype | Current task | Disposition | Reason |
|---|---|---|---|
| `PROT-020` | candidate divisor causing equal remainders | RETAIN AND EXPAND | Correct CP-007 invariant is `d | (A-B)` for candidate/bounded divisor reconstruction. Greatest such divisor is already CP-006 and must not be duplicated. |

**Cross-CP guard:**

- greatest divisor leaving the same remainder -> CP-006 permanent authority;
- candidate/uniquely bounded divisor from the difference -> CP-007;
- count of all such possible divisors -> not automatically CP-007; it invokes divisor-count structure and must be reassigned/held for CP-005 or mixed-ownership review.

---

## 4. Confirmed cross-checkpoint reassignments / non-gaps

### 4.1 Least/greatest n-digit exact multiple

The V4 end-to-end CP-007 hypothesis listed `findLeastOrGreatestNDigitMultiple`, and uploaded sources contain many examples. However this learner contract is **already permanently owned by CP-003** as:

```text
NUM-QL-012 — NUM-CP003-QLC-EXTREMUM-N-DIGIT-MULTIPLE
```

Do not recreate it in CP-007.

### 4.2 One-divisor divisible-range count

CP-003 also permanently owns:

```text
NUM-QL-013 — NUM-CP003-QLC-ONE-DIVISOR-INCLUSIVE-RANGE-COUNT
```

Therefore CP-007 bounded-count generation must not surface zero-remainder instances as a duplicate public contract.

### 4.3 Same-remainder greatest divisor

Already frozen under CP-006. CP-007 may use the difference invariant to test a candidate or uniquely reconstruct a non-extremum bounded divisor, but **greatest** same-remainder divisor remains CP-006.

### 4.4 Multiple independent residue systems

Different stated remainders under independent moduli, incompatible divisor systems, CRT-style reconstruction and large-expression modular reasoning remain CP-008. Do not stretch CP-007 to absorb them.

### 4.5 Non-zero-remainder missing digit

Legacy Quant V3 `NS-REM-001` contains missing-digit target-remainder tasks. Digit position/formation plus a non-zero remainder condition creates a CP-003/CP-010/CP-007 ownership collision. No new CP-007 QL is justified from legacy existence alone. Hold for cross-CP/CP-014 ablation if modern source saturation later proves recurring demand.

### 4.6 Sum of all bounded residue-class members

Legacy Quant V3 includes this form. The residue class identifies an AP and summing it invokes an additional progression/summation engine. Hold/reassign outside ordinary CP-007 unless a later mixed-engine authority explicitly accepts it.

---

## 5. Material source-backed gaps requiring Wave 04 executable proof

### GAP-A — Multiplier and richer linked division relations

**Evidence shape repeatedly seen in SSC/reference sources:**

```text
divisor = a × quotient
divisor = b × remainder
```

with one of `q`, `r`, `N` given and another requested; also quotient–remainder relation/candidate forms and two-number linked division states.

Examples in the source corpus include:

- divisor 4 times quotient and 3 times remainder;
- divisor 7 times quotient and 3/5 times remainder;
- divisor 12/25 times quotient and 5 times remainder;
- difference between quotient and remainder fixed;
- difference between two numbers plus `larger = smaller × q + r`.

**Current deficiency:** `PROT-013/024` only proves `d=q+c`.

**Action:** add an executable linked-relation family with relation-shape parameters and full bounded candidate enumeration. Keep generic algebra out: the division state must be essential and the remainder bound must participate in verification.

### GAP-B — Inverse remainder propagation: infer the divisor

Repeated source pattern:

```text
A leaves r1 mod d
B leaves r2 mod d
A+B leaves r3 mod d
find d
```

or

```text
N leaves r mod d
kN leaves s mod d
find d
```

When the raw residue expression wraps exactly once, the divisor follows from the wrap amount, e.g. `d = r1+r2-r3` or `d = kr-s` under validated bounds.

**Current deficiency:** Waves 01–02 only propagate forward when `d` is known.

**Action:** new executable inverse-propagation authority with sum and scaling parameterisations, explicit one-wrap/uniqueness guards and independent bounded verification.

### GAP-C — Successive quotient-division chains

Repeated SSC/RRB/reference patterns include:

- divide by `a`, then divide the quotient by `b`, with successive remainders;
- reconstruct original number from a final quotient and the successive remainders;
- find the remainder on division by the product of the successive divisors;
- reverse the order of successive divisors and find the new remainder sequence.

This is **not** a system of independent congruences. It is repeated application of:

```text
N_i = d_i N_{i+1} + r_i
```

**Design conflict:** V4 currently describes CP-007 ownership as “one-stage division-lemma states”, while neither CP-008 nor another CP owns this repeated single-engine chain. Quant V3 explicitly deferred repeated division to a future remainder archetype; modern SSC/RRB source saturation now proves it is needed.

**Action:** amend CP-007 design ownership to allow **multi-stage successive division by repeated application of the same division lemma**, while continuing to exclude independent congruence systems. Then implement at least:

1. reconstruct original / product-mod remainder from successive chain;
2. reverse-order successive remainder sequence.

### GAP-D — Wrong-divisor / division-error correction

Source-backed form:

```text
student used divisor d_wrong instead of d_correct,
obtained quotient q_wrong (often zero remainder),
find correct quotient/answer.
```

This requires recovering the hidden dividend from the erroneous division state and re-dividing under the correct divisor.

**Action:** new two-stage error-correction prototype. It remains CP-007 because both stages are ordinary division states and no independent Number System engine is required.

### GAP-E — Long-division intermediate-remainder trace

SSC source includes direct long-division questions where several **successive intermediate remainders** appear while a fixed large dividend is divided by an unknown divisor, and the divisor must be identified.

This is not the same as GAP-C: GAP-C divides successive quotients by different divisors; this family reasons over the internal trace of one long division.

**Action:** new long-division trace prototype or explicit hold if rendering cannot faithfully expose the intermediate partial dividends/remainders. It is source-backed enough that it may not be silently omitted.

### GAP-F — Bounded non-zero-remainder extremum

Quant V3 `NS-REM-002` explicitly distinguished:

- smallest number above a lower bound leaving remainder `r` on division by `d`;
- greatest number below an upper bound leaving remainder `r` on division by `d`.

Current V4 CP-007 has unique-range, count, set and topology projections but no explicit extremum projection.

**Action:** add one parameterised extremum prototype (`LEAST_ABOVE` / `GREATEST_BELOW`) for **non-zero remainder**. Exact-divisibility (`r=0`) extremum is routed to CP-003 to avoid duplicate ownership.

### GAP-G — Same-remainder bounded direct reconstruction

Source pattern:

```text
A and B leave the same remainder when divided by a three-digit d;
find d or a derived property of d.
```

Current `PROT-020` proves only option-candidate checking.

**Action:** expand the same-remainder authority to enumerate divisors of `|A-B|` under explicit bounds and prove unique bounded reconstruction. Do not add a second authority if this is only a representation/constraint expansion of `PROT-020`.

---

## 6. Source families deliberately not assigned to CP-007

| Source form | Disposition |
|---|---|
| greatest divisor leaving same/specified remainders | CP-006 |
| least number leaving same remainder for several divisors | CP-006 |
| different remainder conditions under independent moduli | CP-008 |
| incompatible nested modulus / “cannot determine” when smaller divisor does not divide known divisor | CP-008 |
| large power / cyclic modular remainder | CP-008 (or CP-009 when terminal digits are target) |
| n-digit exact multiple and direct divisible-range count | CP-003 existing permanent QLs |
| count all possible same-remainder divisors | CP-005 / mixed-ownership hold; not ordinary CP-007 |
| digit-placeholder target-remainder family | cross-CP hold (CP-003/010/014), not yet CP-007 |
| bounded residue-class sum | progression/mixed-engine hold |
| formed-number arrangement counts | P&C |

---

## 7. Review-export and editorial audit

The exact-head Wave 01–03 review exports contain 72 questions (3 per prototype). This satisfies the minimum *count* but not yet the final human-review quality bar.

### 7.1 Sampling defect

The three sampled questions for each of these prototypes collapse to one outcome class:

- `PROT-019`: all three samples are `Invalid: remainder condition fails`;
- `PROT-022`: all three samples produce the same statement combination (`II and III only`);
- `PROT-023`: all three samples produce the same sufficiency class (`both together sufficient, neither alone`).

Runtime coverage can be broader while the human pack is still unrepresentative. Final review export must be **stratified by semantic outcome**, not merely first/selected seeds.

### 7.2 Difficulty sampling weakness

Several review samples expose only Easy/Medium or only Medium even where runtime reaches harder states. The final review pack must deliberately include representative state complexity rather than assuming runtime difficulty coverage is equivalent to editorial coverage.

### 7.3 Stem realism

Most direct stems are clean and exam-appropriate. The weakest surfaces are the more synthetic diagnostic forms:

- repeated “Consider integers from ... Which statement is correct?” topology wording;
- generic “Consider the following statements about one division state” wording;
- data-sufficiency items with mechanically symmetric bounds;
- linked mini-caselet wording that is structurally correct but not yet as varied as banking/SSC material.

These are not mathematical defects. They require editorial diversification before English freeze.

### 7.4 Explanation structure

The current clutter-free explanation model is appropriate for discovery. However permanent review must prove:

- source-natural shortcut where one exists;
- option-specific trap explanations for the final four choices;
- no generic repeated strategy lines across the entire retained family;
- special explanation paths for quotient-zero, invalid remainder, exact multiple, nearest tie and no/one/many bounded states.

---

## 8. Preliminary retained-authority shape after current merges

This is **not** a permanent count proposal. It is only the current merge/split direction before Wave 04 gaps are executable.

```text
A01 recover remainder
A02 recover dividend
A03 recover divisor
A04 recover quotient
A05 complete quotient-remainder pair
A06 select valid division state
A07 classify division-state defect
A08 statement / claim verification
A09 additive remainder composition (sum/difference)
A10 product remainder composition
A11 single-residue expression/polynomial transformation (includes scaling)
A12 compatible nested divisor remainder
A13 least addition/subtraction adjustment
A14 nearest-multiple classification
A15 linked division relation (PROT-013 + PROT-024; requires Wave 04 expansion)
A16 bounded unique residue-class value
A17 bounded residue-class count
A18 bounded complete residue-class set
A19 bounded solution topology
A20 bounded data sufficiency
A21 same-remainder candidate/bounded divisor reconstruction (requires expansion)
```

This preliminary grouping reduces the existing 24 prototypes to approximately **21 current solve-authority directions**, before adding/merging the Wave 04 gap families. The final QL count may be lower or higher because solve authority and learner-facing QL template are not assumed to be one-to-one.

---

## 9. Required Wave 04 implementation set

Implement and prove, without permanent IDs:

```text
W4-01 linked multiplier / quotient-remainder relation family
W4-02 inverse remainder propagation -> divisor
W4-03 successive division chain: reconstruct/product-mod
W4-04 successive division chain: reverse divisor order
W4-05 wrong-divisor error correction
W4-06 long-division intermediate-remainder trace
W4-07 bounded non-zero-remainder extremum
W4-08 same-remainder bounded direct reconstruction (expansion of PROT-020)
W4-EDGE quotient-zero / dividend-smaller state hardening for retained direct families
W4-REVIEW stratified outcome-aware review export
```

The exact number of temporary prototypes may differ if two items are cleanly parameterised under one executable contract; the audit requirement is coverage, not a quota.

---

## 10. Wave 04 proof requirements

For every new/expanded family:

- deterministic seeded generation;
- exact canonical answer;
- materially independent verifier;
- exactly four distinct options and one correct option where MCQ;
- misconception ownership for every distractor;
- all answer positions reached;
- state-derived difficulty;
- mathematical-fingerprint diversity;
- source traceability;
- no internal ID leakage;
- lifecycle locks;
- explicit CP-006/008/003 collision guards;
- at least three **outcome-stratified**, mathematically distinct review questions per retained prototype/family.

For successive division, independent verification must reconstruct the original number from the terminal quotient/remainders and then directly re-run the divisions, rather than calling the same chain helper.

For inverse remainder propagation, verifier must enumerate/validate candidate divisors under the visible bounds and remainder rules rather than copying the algebraic construction.

For linked relations, verifier must independently enumerate admissible `(d,q,r,N)` states satisfying both the division identity and visible relation.

---

## 11. Freeze gate after Wave 04

Only after all Wave 04 items pass should CP-007 repeat:

1. uploaded source saturation;
2. Quant V2/V3 reconciliation;
3. cross-CP duplicate audit;
4. pairwise merge/split comparison;
5. count-bearing template proposal **without** IDs;
6. product-owner approval;
7. separate permanent allocation beginning at `NUM-QL-098`.

Until then:

```text
maturity:                    EXECUTABLE_DISCOVERY_PROOF
reviewStatus:                SOURCE_SATURATION_GAPS_OPEN
permanentQlCount:            0
nextAvailableQl:             NUM-QL-098
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```
