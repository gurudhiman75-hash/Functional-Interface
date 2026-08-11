# NUM-CP-007 Wave 04 — Inspected Source Fixture Disposition Ledger

**Purpose:** make the Wave 04 source-gap decisions auditable instead of relying on synthetic source-family labels.  
**Scope:** division/remainder fixtures explicitly inspected during this audit from uploaded SSC Number System PYQs, R.S. Aggarwal quantitative-aptitude material, Arun Sharma Number System material, and Quant V3 remainder specifications.  
**Rule:** each listed fixture receives one primary disposition. This is an inspected-fixture ledger, not a claim that every page of every uploaded book has been exhaustively indexed.

---

## 1. Disposition codes

```text
COVERED       existing CP-007 prototype/authority represents the essential inference
EXPAND        existing CP-007 authority is correct but source requires a broader relation/state representation
NEW_W4        materially new CP-007 executable topology required in Wave 04
CP003         primary owner is NUM-CP-003
CP005_HOLD    divisor-count/mixed ownership; not ordinary CP-007
CP006         primary owner is NUM-CP-006
CP008         primary owner is NUM-CP-008
CROSS_CP_HOLD requires ablation/source work before ownership
REP_VARIANT   source wording/output can be absorbed by an existing authority without a new solve authority
```

---

## 2. Uploaded SSC Number System PYQ fixtures

| Fixture | Essential inference | Disposition | CP-007 mapping / reason |
|---|---|---|---|
| SSC Q82 — known remainder under 56, ask under 8 | smaller target divisor divides known divisor | COVERED | `PROT-011` compatible nested divisor |
| SSC Q84 — remainders 3 and 4; sum remainder 2; find divisor | infer divisor from one residue wrap | NEW_W4 | inverse remainder propagation |
| SSC Q85 — divisor multiple of quotient and remainder; remainder given | linked multiplier relation | NEW_W4 / EXPAND | expand `PROT-013` linked relation authority |
| SSC Q86 — fixed dividend, three successive long-division remainders, find divisor | infer divisor from internal long-division trace | NEW_W4 | long-division intermediate-remainder trace |
| SSC Q87 — least 5-digit multiple of 41 | exact divisibility extremum | CP003 | already permanent CP-003 extremum-multiple ownership |
| SSC Q89 — divide by 13, then divide quotient by 5, ask remainder mod 65 | successive quotient division chain | NEW_W4 | successive division authority |
| SSC Q90 — known remainder under 893, ask under 47 | target divisor divides known divisor | COVERED | `PROT-011` |
| SSC Q91 — known remainder under 6, ask square remainder | single-residue polynomial transform | COVERED | `PROT-012` |
| SSC Q93 — divisor 25 times quotient and 5 times remainder | linked multiplier relation | NEW_W4 / EXPAND | expand `PROT-013` |
| SSC Q106 — divisor 4 times quotient and 3 times remainder | linked multiplier relation | NEW_W4 / EXPAND | expand `PROT-013` |
| SSC Q107 — successive division by 4 and 5; reverse order | reverse successive division chain | NEW_W4 | successive chain reverse-order prototype |
| SSC Q109 — known remainder under 296, ask under 37 | compatible nested divisor | COVERED | `PROT-011` |
| SSC Q110 — smallest addition to reach multiple of 11 | exact-divisibility adjustment | COVERED | `PROT-008` |

Additional SSC source themes inspected during the audit reinforce the same families: direct missing divisor/quotient/remainder, nearest multiple, linked multiplier relations, compatible nested divisors, and exact-divisibility adjustment.

---

## 3. R.S. Aggarwal division/remainder fixtures

| Fixture | Essential inference | Disposition | CP-007 mapping / reason |
|---|---|---|---|
| Ex. 40 / Q296 — dividend, quotient, remainder -> divisor | direct missing divisor | COVERED | `PROT-003` |
| Ex. 41 / Q303–305 — known remainder under composite divisor, ask under factor | compatible nested divisor | COVERED | `PROT-011` |
| Ex. 42 — successive division 3,5,8; reverse divisor order | reverse successive chain | NEW_W4 | Wave 04 successive-division authority |
| Ex. 43 — factor-order long/successive division trace | reverse successive chain | NEW_W4 | same successive-chain cluster; keep representation explicit |
| Ex. 44 / Q297 — divisor multiple of quotient and remainder | linked multiplier state | NEW_W4 / EXPAND | broaden `PROT-013` |
| Q298 — divisor 25q and 5r; quotient given | linked multiplier state | NEW_W4 / EXPAND | broaden `PROT-013` |
| Q299 — divisor and quotient are directly computable from visible arithmetic; find dividend | direct dividend reconstruction | REP_VARIANT | `PROT-002`; arithmetic wording is not a new invariant |
| Q300 — wrong divisor used, erroneous quotient given, find correct quotient | recover hidden dividend then re-divide | NEW_W4 | division-error correction |
| Q301 — divisor 7q and 5r; dividend 6r; find q | richer linked relation with division identity | NEW_W4 / EXPAND | linked relation family |
| Q302 — q-r fixed under divisor 19; select number | quotient–remainder relation with candidate verification | NEW_W4 / EXPAND | linked relation family; candidate enumeration required |
| Q306 — known remainder, square the number | polynomial residue transform | COVERED | `PROT-012` |
| Q307 — difference of two numbers plus larger/smaller division state | linked two-number division relation | NEW_W4 / EXPAND | linked relation family, with bounded/candidate uniqueness proof |
| Q308 — known remainder, ask remainder of 2N | scaling | COVERED / MERGE | `PROT-010`, to merge under `PROT-012` authority |
| Q310 — `N mod d=71`, `2N mod d=43`, find d | inverse scaling remainder | NEW_W4 | inverse remainder propagation |
| Q311 — `P mod d=r1`, `Q mod d=r2`, `(P+Q) mod d=r3`, infer possible d | inverse sum remainder | NEW_W4 | inverse remainder propagation |
| Q312 — two large remainders; sum remainder known; find divisor | inverse sum remainder | NEW_W4 | inverse remainder propagation |
| Q313 — divide by 13, then quotient by 5, ask remainder mod 65 | successive chain | NEW_W4 | successive division |
| Q314 — two numbers same remainder under a three-digit divisor, find derived property of divisor | bounded divisor of difference | EXPAND | broaden `PROT-020` beyond option testing |
| Q315 — successive divisors 9,11,13; reverse order | reverse successive chain | NEW_W4 | successive division |
| Q316 — successive division by 3,4,7, ask remainder mod 84 | chain reconstruction / product modulus | NEW_W4 | successive division |
| Q317 — successive division by 8,7,3 plus final quotient; find original number | reverse reconstruction | NEW_W4 | successive division |
| Q318 — divide by 3, divide quotient by 2, ask remainder mod 6 | successive chain | NEW_W4 | successive division |
| Q319 — odd square modulo 8 | structural/polynomial remainder, potentially advanced theorem wording | COVERED/CP008 boundary | bounded direct square transform can use `PROT-012`; universal theorem variants need separate ownership review |

### Same-remainder count fixture

The source also asks how many possible divisors make two numbers leave the same remainder. The reduction `d | (A-B)` is CP-007 support, but the **requested output is a divisor count**, which invokes divisor-function structure. This is recorded as `CP005_HOLD`, not a CP-007 gap.

---

## 4. Arun Sharma fixtures

| Fixture | Essential inference | Disposition | CP-007 mapping / reason |
|---|---|---|---|
| Q126/Q128 — least addition for exact divisibility | complement of remainder | COVERED | `PROT-008` |
| Q127/Q129 — least subtraction for exact divisibility | current remainder | COVERED | `PROT-008` |
| Q130/Q131 — least/greatest 5-digit exact multiple | direct divisibility extremum | CP003 | already permanent CP-003 contract |
| Q132 — nearest integer exactly divisible by 12 | compare lower/upper distance | COVERED | `PROT-016` |
| Q133 — `N mod 84=57`, ask `N mod 12` | compatible nested divisor | COVERED | `PROT-011` |
| Q134 — `N mod 84=57`, ask `N mod 11` | known residue does not determine target residue because 11 does not divide 84 | CP008 | incompatibility/indeterminacy under another modulus |
| Q135 — count divisors that make 511 and 667 leave same remainder | divisor count of a difference | CP005_HOLD | not ordinary CP-007 output |
| earlier common-remainder / several-divisor least-number fixtures | common multiple after subtracting remainder | CP006 | existing HCF/LCM/common-alignment ownership |
| different remainder conditions under several moduli | simultaneous residue system | CP008 | independent congruence system |

---

## 5. Quant V3 legacy reconciliation

### NS-REM-002 — Number Reconstruction From Division Information

| Legacy canonical problem | V4 disposition |
|---|---|
| find dividend from `d,q,r` | COVERED by `PROT-002` |
| find missing divisor | COVERED by `PROT-003` |
| find missing quotient | COVERED by `PROT-004` |
| find missing remainder | COVERED by `PROT-001` |
| count bounded numbers satisfying one remainder condition | COVERED by `PROT-014`, but zero-remainder instances route to CP-003 |
| smallest number above bound with fixed non-zero remainder | NEW_W4 bounded extremum |
| greatest number below bound with fixed non-zero remainder | NEW_W4 bounded extremum |
| sum all bounded residue-class members | CROSS_CP_HOLD — AP/summation engine is additionally essential |

### NS-REM-001 — Target Remainder Missing-Value Conditions

Legacy missing-digit / valid-value-set forms under a non-zero target remainder are **not automatically assigned to CP-007**. Digit-place structure is essential, creating a CP-003/CP-010/CP-007 collision. Record as `CROSS_CP_HOLD` until modern source recurrence and an ablation test justify a mixed/public authority.

Quant V3 also explicitly excluded repeated division from `NS-REM-001` and deferred it to a future remainder archetype. The uploaded SSC/RRB fixtures listed above now supply the missing source evidence that repeated/successive division must be owned somewhere in V4.

---

## 6. V4 cross-CP collision findings

### Existing permanent CP-003 ownership

Do not duplicate:

```text
NUM-QL-012 — least/greatest n-digit exact multiple
NUM-QL-013 — one-divisor inclusive range count for exact divisibility
```

Hence CP-007 bounded non-zero remainder work must be parameter-guarded so `r=0` does not silently clone CP-003 learner contracts.

### Existing permanent CP-006 ownership

Do not duplicate:

```text
greatest divisor leaving same remainder
greatest divisor leaving specified remainders
least common-remainder/common-alignment number across several divisors
```

### CP-008 boundary

Route away from CP-007 when the task requires:

- independent residue conditions under several moduli;
- incompatibility / indeterminacy between unrelated moduli;
- CRT-style reconstruction;
- non-trivial modular equations or large-power residue cycles.

---

## 7. Audit conclusion from inspected fixtures

The inspected evidence supports the following judgement:

```text
Current Wave 01–03 runtime is valid but not source-saturated.
The missing material is not cosmetic.
At least five genuinely new inference topologies are source-backed:
  1. inverse remainder propagation -> divisor
  2. successive quotient-division chains
  3. wrong-divisor / error correction
  4. long-division intermediate-remainder trace
  5. bounded non-zero-remainder extremum

Two existing authorities require material expansion rather than new ownership:
  6. linked division relations (`PROT-013/024`)
  7. same-remainder divisor reconstruction (`PROT-020`)

Direct-family quotient-zero states require edge hardening.
Review export requires outcome-stratified sampling.
```

No permanent QL proposal is valid until those gaps have executable proof and the merge/split audit is re-run.
