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
12. **Ordered selection without repetition** — choose and order `r` from `n` distinct objects, giving `nPr = n!/(n-r)!`.
13. **Permutation-parameter inverse search** — recover the missing `n` or `r` by bounded exact search against an `nPr` target.

These are the patterns required by currently admitted QLs. The file is extended only when newly approved QLs introduce a genuinely different reasoning construction.

## Evidence contract

The solver returns the chosen method and the decisive stage, case, factorial or permutation evidence. For CP-002 this includes `n`, `r`, order/repetition semantics, consecutive permutation factors, the target where applicable, and the recovered parameter. Explanation prose consumes this evidence and must not recalculate the answer independently.