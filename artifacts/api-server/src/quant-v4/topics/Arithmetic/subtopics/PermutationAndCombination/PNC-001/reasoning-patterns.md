# PNC-001 Reasoning Patterns

## Active CP-001 patterns

1. **Sequential product** — multiply independent stage counts.
2. **Mutually exclusive sum** — add non-overlapping alternative counts.
3. **Disjoint case partition** — multiply within each case and add case totals.
4. **Simple complement** — unrestricted total minus invalid outcomes.
5. **Exact factor recovery** — recover a missing stage by exact division.
6. **Factorial definition** — evaluate `n!` as a descending exact product.
7. **Unit-factorial identity** — use `0! = 1! = 1`.
8. **Factorial cancellation** — retain only the uncancelled consecutive factors.
9. **Factorial inverse search** — recover the bounded exact factorial argument.
10. **Factorial-quotient inverse search** — transform and recover an exact argument.

## Active CP-002 patterns

11. **Arrange all distinct objects** — all `n` objects fill `n` ordered positions, giving `n!`.
12. **Ordered selection without repetition** — choose and order `r` from `n` distinct objects, giving `nPr`.
13. **Permutation-parameter inverse search** — recover the missing `n` or `r` from an exact target.

## Active CP-003 patterns

14. **Unordered selection** — divide the ordered `nPr` count by the `r!` internal orders of each selected set.
15. **Combination-parameter inverse search** — recover the missing `n` or lower-half `r` from an exact `nCr` target.
16. **Combination symmetry** — use `nCr = nC(n-r)` to recover the complementary index.

## Active CP-004 patterns

17. **Identical-object correction** — begin with `n!` and divide by every repeated multiplicity factorial.
18. **Fixed-position multiset reduction** — fix one object, reduce its multiplicity when necessary, then arrange the remaining multiset.
19. **Multiset overcount factor** — identify the product of multiplicity factorials that measures all indistinguishable swaps.
20. **Multiplicity inverse search** — search the stated bounded multiplicities until the exact multiset count recreates the target.

These are the patterns required by currently admitted QLs. The file is extended only when newly approved QLs introduce a genuinely different reasoning construction.

## Evidence contract

The solver returns the chosen method and decisive stage, factorial, permutation, combination or multiset evidence. CP-004 evidence includes total and remaining objects, original and remaining repeated multiplicities, all-distinct numerator, identical-swap denominator, target where applicable, and the recovered multiplicity. Explanation prose consumes this evidence and must not recalculate the answer independently.
