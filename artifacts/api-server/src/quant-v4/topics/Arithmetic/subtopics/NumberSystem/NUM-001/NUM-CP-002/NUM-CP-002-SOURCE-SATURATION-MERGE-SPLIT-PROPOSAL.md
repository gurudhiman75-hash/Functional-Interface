# NUM-CP-002 — Source Saturation and Merge/Split Proposal

**Checkpoint:** Fractions, Decimals and Recurring Representations  
**Discovery prototypes:** 32  
**In-scope after ownership audit:** 30  
**Explicitly delegated:** 2  
**Proposed permanent authorities:** **21**  
**Permanent QL IDs:** **NOT ALLOCATED**  
**First available ID after approval:** `NUM-QL-145`  
**Delivery surfaces:** all closed

## Source-saturation decision

Discovery is now source-saturated for the current CP-002 design boundary.

Why saturation is justified:

1. every solve-mode hypothesis in the current Number System CP-002 end-to-end design is mapped to executable discovery or explicit delegation;
2. all 32 temporary prototypes have exactly one authority/adapter/delegation disposition;
3. the executable inventory covers direct conversion, reverse conversion, exact comparison/order, strict-between selection, termination classification, quantitative termination structure, inverse exponent/factor reconstruction, bounded count/set, recurring-cycle reconstruction, statement combination and Data Sufficiency;
4. generic Algebra/Ratio work is excluded instead of being used to inflate the checkpoint;
5. three discovery waves have passed executable sweeps and human review before this proposal.

This closes **discovery breadth**, not implementation maturity. No permanent QL is created by this document.

## Proposed 21 authorities

| # | Proposed authority | Discovery evidence | Disposition |
|---:|---|---|---|
| 1 | Fraction reduction to lowest terms | P001 | Singleton |
| 2 | Improper ↔ mixed fraction representation | P002, P003 | **Merge** — one quotient/remainder identity |
| 3 | Terminating decimal → reduced fraction | P004 | Singleton |
| 4 | Recurring decimal → exact rational | P005, P006; P022/P029 as edges | **Merge + adapters** |
| 5 | Fraction → exact terminating decimal | P007 | Singleton |
| 6 | Fraction → exact recurring decimal | P008 | Singleton |
| 7 | Pairwise exact rational comparison | P009 | Singleton |
| 8 | Multi-value exact ordering | P010; P024 largest/smallest adapter | Singleton + adapter |
| 9 | Exact rational strictly between two bounds | P023 | Singleton |
| 10 | Terminating vs recurring after reduction | P011 | Singleton |
| 11 | Decimal-place count / least clearing power of 10 | P012, P016 | **Merge** — same `max(a,b)` integer invariant |
| 12 | Recover denominator exponent from place-count evidence | P015 | Singleton inverse |
| 13 | Least factor intervention required for termination | P013, P014 | **Merge** — same forbidden-factor removal invariant |
| 14 | Count bounded denominators yielding termination | P017 | Singleton |
| 15 | Complete bounded denominator set yielding termination | P018 | Singleton; protected from count |
| 16 | Numerator-side cancellation / least bad-prime exponent | P019, P030 | **Merge** — same numerator cancellation requirement |
| 17 | Missing recurring-block digit | P020 | Singleton |
| 18 | Recurring-block length | P021 | Singleton |
| 19 | Missing fraction component from exact decimal representation | P025, P026 | **Merge** — exact rational reconstruction + equivalent fraction |
| 20 | Statement-combination representation | P031 | Protected answer-shape authority |
| 21 | Data Sufficiency representation | P032 | Protected answer-shape authority |

## Adapter-only discovery

These prototypes remain useful evidence and learner variants but should not consume permanent QLs:

- **P022 recurring nines** → edge state of recurring-decimal exact-rational reconstruction;
- **P024 largest/smallest** → endpoint wording over the multi-value ordering authority;
- **P029 repeated minimal recurring block** → notation-equivalence edge of recurring-decimal reconstruction.

## Explicit delegation

Two discovery prototypes are removed from Number System permanent ownership:

- **P027 reciprocal/complement isolation** → Algebra when exact rational values are already supplied;
- **P028 sum/difference unknown rational** → Algebra when rational notation is incidental to a linear equation.

The current design's generic ratio-only inverse is likewise delegated to Ratio/Proportion or Algebra. CP-002 should own the representation step, not generic proportion solving.

## Why some tempting merges are rejected

### Terminating decimal → fraction vs fraction → terminating decimal

Do **not** merge P004 and P007. Decimal → fraction uses decimal place value and reduction. Fraction → decimal uses denominator scaling to powers of ten. Reversing the direction changes the governing operation.

### Recurring decimal → fraction vs fraction → recurring decimal

Do **not** merge P005/P006 with P008. One uses shift/subtract reconstruction; the other uses exact long-division remainder cycles.

### Pairwise comparison vs fraction between two bounds

Do **not** merge P009 and P023. P009 returns a relation. P023 must identify a value satisfying two strict inequalities and has a different option/proof burden.

### Decimal nature vs decimal-place count

Do **not** merge P011 with P012/P016. Classification and quantitative exponent measurement are different targets.

### Direct place count vs inverse exponent reconstruction

Do **not** merge P012/P016 with P015. The direct invariant is `max(a,b)`; P015 inverts it under a uniqueness condition.

### Denominator-side intervention vs numerator-side reconstruction

Do **not** merge P013/P014 with P019/P030. Both use forbidden prime factors, but they solve different unknown contracts: an operation/factor applied to the rational versus a numerator parameter that must supply cancellation.

### Bounded count vs bounded set

Do **not** merge P017 and P018. A cardinality answer does not prove that every required member of a complete set has been returned.

### Recurring digit vs recurring period length

Do **not** merge P020 and P021. One reconstructs a marked digit; the other proves cycle length.

### Statement combination vs Data Sufficiency

Do **not** merge P031 and P032. Statement truth evaluation and sufficiency quantify over different state spaces and have different answer semantics.

## Exam-readiness implications for the future permanent runtime

The discovery generators are not the final learner layer. At English freeze:

- P001/P002/P003/P004-style foundation work must not be allowed to dominate the review corpus;
- difficulty must be recalibrated by permanent authority, not inherited from discovery seeds;
- bounded denominator questions should teach prime-factor structure rather than enumerate values blindly;
- termination explanations should say which unwanted prime factors must be cancelled, avoiding technical shorthand such as “non-2,5 part”;
- recurring-cycle questions must retain real reconstruction rather than rely on memorized famous fractions;
- statement and DS wording must follow natural SSC/Banking exam style;
- all mathematical expressions must use whole-expression LaTeX.

## Approval boundary

This PR is deliberately **count-bearing but ID-free**.

If the proposed **21-authority count** is approved, the next step is a separate allocation gate assigning:

`NUM-QL-145` through `NUM-QL-165`

Only after that allocation will permanent English runtime/editorial freeze begin.

No Question Studio integration will be added for CP-002. The Number System chapter will be connected to the existing Question Studio workflow only once, after the chapter is complete.
