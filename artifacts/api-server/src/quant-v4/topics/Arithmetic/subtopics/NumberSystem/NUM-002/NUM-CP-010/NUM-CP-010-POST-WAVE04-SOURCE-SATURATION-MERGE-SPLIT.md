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
| More carry/borrow columns | MERGE as difficulty depth within the same unknown-count contract |
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

## Challenged merge decisions

Three borderline decisions were explicitly re-audited after Wave 04 rather than accepted from the first compression pass:

1. **P020 versus P005/P011 — SPLIT.** P020 contains two linked unknown digits and returns an ordered pair. That changes both evidence topology and answer semantic, so it is now protected as a separate authority.
2. **P014 versus P019 — MERGE retained.** Both require the complete set of all valid decimal states. Digit-set versus numeral-set changes the element domain, but not the exhaustive-state objective or completeness proof.
3. **P015 versus P026 — MERGE retained with protected zero branch.** Both ask for positional occurrence count. Zero requires explicit leading-zero exclusion, but the final quantity and positional counting objective are unchanged; P026 exists to prove that special branch rather than create a second counting QL.

## Proposed permanent authority merge/split — 16 authorities

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

4. **Single-unknown column addition digit reconstruction**  
   Prototypes: P005 + P011  
   Rationale: one unknown digit is recovered by right-to-left column evidence; carry depth is a difficulty mode.

5. **Two-unknown column addition reconstruction**  
   Prototype: P020  
   Rationale: two linked unknown digits and an ordered-pair answer materially change the evidence topology and learner contract. This remains separate from single-unknown carry questions.

6. **Column subtraction digit reconstruction**  
   Prototypes: P006 + P012  
   Rationale: borrow propagation is the governing topology; depth is difficulty.

7. **Palindrome reconstruction**  
   Prototypes: P007 + P016  
   Rationale: mirrored decimal positions; length is a representation parameter.

8. **Relational / consecutive digit reconstruction**  
   Prototypes: P008 + P024  
   Rationale: relative digit equations; increasing/decreasing direction is a parameter.

9. **Least or greatest numeral under digit constraints**  
   Prototype: P013  
   Rationale: optimisation over multiple admissible decimal states.

10. **Complete valid digit/number set under decimal constraints**  
    Prototypes: P014 + P019  
    Rationale: exhaustive-set semantic; element domain (digit versus numeral) is a controlled state-domain mode rather than a different inference objective.

11. **Bounded digit-occurrence count**  
    Prototypes: P015 + P026  
    Rationale: positional occurrence counting; digit 0 requires a protected leading-zero branch but retains the same counting objective.

12. **Exact number of decimal digits**  
    Prototype: P017  
    Rationale: positional-bound answer semantic; approximate logarithm policy is explicitly outside this authority.

13. **Digit-constraint solution multiplicity classification**  
    Prototype: P018  
    Rationale: asks no/one/multiple admissible states rather than a particular state or complete set.

14. **Missing digit in multiplication with carry**  
    Prototype: P021  
    Rationale: multiplication-column propagation is materially distinct from addition/subtraction.

15. **Repeated decimal block / concatenation reconstruction**  
    Prototype: P022  
    Rationale: decimal concatenation coefficient such as `101n` is the governing positional invariant.

16. **Digital root / repeated digit-sum reduction**  
    Prototype: P025  
    Rationale: iterative digit aggregation to one digit; direct digital-root work belongs here, while divisibility use stays CP003.

## Protected non-merges

- direct digit-sum reconstruction vs digital root;
- reversal vs palindrome;
- single-unknown addition vs two-unknown ordered-pair addition;
- addition carry vs subtraction borrow vs multiplication carry;
- extremum vs complete set vs solution multiplicity;
- digit occurrence count vs exact number-of-digits;
- repeated-block concatenation vs reversal/interchange.

## Count proposal

**Proposed permanent authority count: 16.**

If approved, the next step is to re-confirm the chapter-wide next free Number System identity and allocate the approved contiguous range to these 16 authorities in the order above, then build/freeze the permanent English runtime. Until explicit approval:

- no `NUM-QL-197+` IDs are assigned;
- source lifecycle remains discovery-only;
- Question Studio remains OFF for CP010;
- Question Bank/test/mock/public gates remain OFF.
