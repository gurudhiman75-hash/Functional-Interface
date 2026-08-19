# NUM-CP-008 — Final Source Saturation and Merge/Split Proposal

**Checkpoint:** `NUM-CP-008 — Modular Arithmetic and Simultaneous Congruences`  
**Discovery frontier:** `NUM-CP008-PROT-001..026`  
**Permanent QLs at this gate:** `0`  
**Next available Number System QL:** `NUM-QL-166`  
**Proposal status:** `AWAITING_EXPLICIT_COUNT_APPROVAL`

## Result

Four executable discovery waves now cover 26 temporary prototypes. The final design/source/ownership recheck finds **zero remaining routine source gaps for current ordinary CP008 ownership**.

The 26 prototypes compress to **19 proposed permanent authorities**. This is a count-bearing, ID-free proposal only; it does not allocate `NUM-QL-166+`.

## Proposed authority inventory

| Authority | Proposed learner authority | Prototype ancestry |
|---|---|---|
| CP008-AUTH-001 | Basic modular arithmetic and residue normalisation | 001, 002 |
| CP008-AUTH-002 | Exact power remainder | 003 |
| CP008-AUTH-003 | Solvable linear congruence solution classes | 004, 005 |
| CP008-AUTH-004 | Unsolvable linear congruence classification | 006 |
| CP008-AUTH-005 | Compatible simultaneous congruence construction | 007, 015, 020 |
| CP008-AUTH-006 | Incompatible simultaneous congruence classification | 008, 016 |
| CP008-AUTH-007 | Bounded residue-class extremum | 009 |
| CP008-AUTH-008 | Bounded residue/system solution count | 010, 024 |
| CP008-AUTH-009 | Complete bounded simultaneous-system solution set | 011, 026 |
| CP008-AUTH-010 | Missing modular coefficient reconstruction | 012 |
| CP008-AUTH-011 | Missing modulus reconstruction | 013 |
| CP008-AUTH-012 | Structured geometric-sum remainder | 014 |
| CP008-AUTH-013 | Missing residue from modular-system evidence | 017 |
| CP008-AUTH-014 | Nested modular expression | 018 |
| CP008-AUTH-015 | Congruence-system candidate verification | 019 |
| CP008-AUTH-016 | Modular statement combination | 021 |
| CP008-AUTH-017 | Bounded modular Data Sufficiency | 022 |
| CP008-AUTH-018 | Repeated-numeral modular recurrence | 023 |
| CP008-AUTH-019 | Bounded simultaneous-system multiplicity classification | 025 |

## Six merge groups

1. `001 + 002`: signed residue normalisation is an edge/parameter state of basic modular arithmetic.
2. `004 + 005`: one versus multiple residue classes is solution topology inside the same solvable-linear-congruence engine.
3. `007 + 015 + 020`: two/three constraints and same/different-remainder wording use the same compatible sequential CRT construction.
4. `008 + 016`: incompatible two/three-congruence systems share the same gcd-compatibility learner target.
5. `010 + 024`: after CRT, bounded system count is the same arithmetic-progression count as a directly stated residue class.
6. `011 + 026`: two/three-congruence complete bounded sets differ only in system width after CRT.

These six groups reduce 26 prototypes by seven coordinates, yielding 19 authorities.

## Protected non-merges

The final proposal deliberately preserves:

- direct power remainder vs geometric-sum remainder vs nested modular expression vs repeated-numeral recurrence;
- bounded extremum vs count vs complete set vs multiplicity classification;
- missing coefficient vs missing modulus vs missing residue;
- candidate verification vs statement combination vs Data Sufficiency;
- solvable linear-congruence classes vs no-solution classification;
- compatible-system construction vs incompatible-system classification.

These differ in answer semantic, evidence topology, canonical algorithm or independent verifier burden and must not be compressed merely because all use modular arithmetic.

## Design-direction disposition

The complete design has also been rechecked so no direction remains silently unclassified:

- large modular expressions → represented by modular composition / power / nested-expression authorities;
- least positive linear-congruence representative → bounded representative projection after solving the class;
- greatest bounded simultaneous-system solution → bounded extremum projection after CRT;
- same-remainder multi-modulus forms → compatible-system surface when the target is the number; greatest-divisor optimisation stays CP006;
- system + range reconstruction → bounded set/count/multiplicity authorities;
- single boolean modular claim → lower-burden adapter of candidate/statement verification;
- least repunit length divisible by `m` → explicit inverse-recurrence source hold, not silently promoted;
- structured fixed-block concatenation remainder → repeated-numeral recurrence adapter; digit-structure-essential variants hand off to CP010.

## Advanced/source holds

No ordinary permanent QL is proposed solely for:

- direct modular inverse as final target;
- unrestricted theorem-level CRT;
- Fermat/Euler theorem reduction;
- Wilson theorem.

These remain explicit source/enrichment holds unless material SSC/Banking/Punjab evidence requires later promotion.

## Cross-checkpoint boundaries

- one-stage division lemma and compatible nested-divisor transfer → `NUM-CP-007`;
- unit / last two / last three digits as final output → `NUM-CP-009`;
- arbitrary digit construction/concatenation where digit structure is essential → `NUM-CP-010`;
- HCF/LCM common alignment and greatest common-remainder divisor → `NUM-CP-006`;
- formed-number arrangement counting → P&C;
- equations without an essential modular target → Algebra.

## Candidate coordinates only if count is explicitly approved

```text
Proposed authority count: 19
Candidate range:           NUM-QL-166..NUM-QL-184
Next QL if approved:       NUM-QL-185
```

These are not allocated by this proposal.

## Lifecycle

```text
permanentQlCount:            0
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```
