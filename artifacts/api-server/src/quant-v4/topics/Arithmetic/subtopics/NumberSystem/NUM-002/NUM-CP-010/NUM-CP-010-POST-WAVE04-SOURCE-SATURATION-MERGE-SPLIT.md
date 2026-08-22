# NUM-CP-010 — Post-Wave-04 Source Saturation and ID-Free Merge/Split

**Checkpoint:** `NUM-CP-010` — Digit Structure, Place Value and Number Reconstruction  
**Discovery prototypes:** 26  
**Permanent QLs allocated:** 0  
**Status:** candidate merge/split proposal; requires explicit product-owner count approval before identity allocation

## Saturation verdict

The retained decimal digit-structure inventory is materially saturated for the current source authority. A further broad discovery wave is **not justified**.

Recovered/covered families include:

- place value, including inverse digit/position directions;
- digit-sum reconstruction;
- two/three-digit reversal plus trailing-zero reversal edge;
- addition carry, chained carry and two-unknown addition;
- subtraction borrow and chained borrow;
- palindrome reconstruction at multiple lengths;
- increasing/decreasing consecutive digit relations;
- least/greatest numeral under digit constraints;
- complete valid digit/number sets;
- no/one/multiple-solution classification;
- bounded digit occurrence for non-zero digits and zero with leading-zero exclusion;
- multiplication carry reconstruction;
- repeated decimal-block concatenation/reconstruction;
- exact number-of-digits by positional bounds;
- digital root.

Remaining candidates are dispositioned rather than left open:

| Candidate | Disposition |
|---|---|
| More palindrome lengths | MERGE as parameter/representation |
| Longer repeated blocks / more repetitions | MERGE into concatenation unless new source topology appears |
| More carry/borrow columns | MERGE as difficulty depth |
| Descending vs increasing consecutive digits | MERGE as direction parameter |
| Face value vs place value | MISCONCEPTION/representation inside place-value authority |
| Two-unknown multiplication | HOLD; composition of multi-unknown reconstruction + multiplication carry, no separate source need yet |
| Inverse digital-root complete set | HOLD/adapter; implement only with direct source demand |
| Statement / claim / DS | ADAPTER after ordinary authorities; not standalone by default |
| Divisibility-led missing digit | REASSIGN CP003 |
| Terminal digit(s) of powers | REASSIGN CP009 |
| Arrangement / formed-number counts | REASSIGN P&C |
| General algebra with incidental digits | REASSIGN Algebra |
| Non-decimal base questions | REASSIGN CP013 |
| Genuine digit + second-engine synthesis | HOLD for CP014 necessity ablation |

## Proposed permanent authority merge/split — 15 authorities

This is an **ID-free** proposal. Labels below are conceptual only.

1. **Decimal place value — direct and inverse**  
   Prototypes: P001 + P009 + P010  
   Rationale: same positional-weight invariant; requested unknown may be place value, digit or position.

2. **Missing digit from digit aggregate**  
   Prototype: P002  
   Rationale: direct decimal digit-sum reconstruction.

3. **Number reversal / digit interchange reconstruction**  
   Prototypes: P003 + P004 + P023  
   Rationale: same positional reversal equation; length and trailing-zero handling are variants.

4. **Column addition digit reconstruction**  
   Prototypes: P005 + P011 + P020  
   Rationale: right-to-left column evidence with carry; one/two unknown and carry depth are modes, not separate authorities.

5. **Column subtraction digit reconstruction**  
   Prototypes: P006 + P012  
   Rationale: borrow propagation is the governing topology; depth is difficulty.

6. **Palindrome reconstruction**  
   Prototypes: P007 + P016  
   Rationale: mirrored decimal positions; length is a representation parameter.

7. **Relational / consecutive digit reconstruction**  
   Prototypes: P008 + P024  
   Rationale: relative digit equations; increasing/decreasing direction is a parameter.

8. **Least or greatest numeral under digit constraints**  
   Prototype: P013  
   Rationale: optimisation over multiple admissible decimal states.

9. **Complete valid digit/number set under decimal constraints**  
   Prototypes: P014 + P019  
   Rationale: exhaustive-set semantic; element domain (digit vs numeral) is a controlled mode.

10. **Bounded digit-occurrence count**  
    Prototypes: P015 + P026  
    Rationale: positional occurrence counting; digit 0 requires a protected leading-zero branch but retains the same count objective.

11. **Exact number of decimal digits**  
    Prototype: P017  
    Rationale: positional-bound answer semantic; approximate logarithm policy is explicitly outside this authority.

12. **Digit-constraint solution multiplicity classification**  
    Prototype: P018  
    Rationale: asks no/one/multiple admissible states rather than a particular state or set.

13. **Missing digit in multiplication with carry**  
    Prototype: P021  
    Rationale: multiplication-column propagation is materially distinct from addition/subtraction.

14. **Repeated decimal block / concatenation reconstruction**  
    Prototype: P022  
    Rationale: decimal concatenation coefficient such as 101n is the governing positional invariant.

15. **Digital root / repeated digit-sum reduction**  
    Prototype: P025  
    Rationale: iterative digit aggregation to one digit; direct digital-root work belongs here, while divisibility use stays CP003.

## Protected non-merges

- direct digit-sum reconstruction vs digital root;
- reversal vs palindrome;
- addition carry vs subtraction borrow vs multiplication carry;
- extremum vs complete set vs solution multiplicity;
- digit occurrence count vs exact number-of-digits;
- repeated-block concatenation vs reversal/interchange.

## Count proposal

**Proposed permanent authority count: 15.**

If approved, the next step is to allocate the next free Number System identities starting at `NUM-QL-197` to these 15 authorities in the order above, then build/freeze the permanent English runtime. Until explicit approval:

- no `NUM-QL-197+` IDs are assigned;
- source lifecycle remains discovery-only;
- Question Studio remains OFF for CP010;
- Question Bank/test/mock/public gates remain OFF.
