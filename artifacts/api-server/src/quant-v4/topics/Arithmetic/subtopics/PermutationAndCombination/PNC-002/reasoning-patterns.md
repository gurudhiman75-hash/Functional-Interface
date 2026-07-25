# PNC-002 Reasoning Patterns — CP-007

## Single block together

Compress the specified group into one unit.

\[
(n-k+1)!\,k!
\]

The first factorial arranges the block with all outside objects. The second restores every internal order of the block.

## Single block not together

Count every unrestricted arrangement and remove the arrangements in which the specified group forms one block.

\[
n!-(n-k+1)!\,k!
\]

For \(k>2\), “not all together” means only that the complete specified group is not one consecutive block; it does not mean pairwise separation.

## Multiple blocks together

For disjoint block sizes \(b_1,\ldots,b_g\), the number of outside units is

\[
n-\sum b_i+g.
\]

The count is

\[
\left(n-\sum b_i+g\right)!\prod_{i=1}^{g} b_i!.
\]

## One block together and an external pair apart

After compressing the required block of size \(k\), there are \(u=n-k+1\) units. Exclude unit arrangements in which the separate pair is adjacent:

\[
\left(u!-2(u-1)!\right)k!.
\]

## Bounded inverse

Evaluate the relevant forward construction over the stated finite domain and require exactly one match. The production solver uses exact factorial arithmetic; the independent verifier enumerates every distinct linear permutation for each candidate.
