# INE-CP-002 English Prototype Review Pack

Prototype-only review material. Permanent QLs remain unallocated and Question Studio visibility remains disabled.

## 1. DETERMINE_LONG_CHAIN_RELATION — seed 0

What is the strongest relation that must be true for B compared with P?

### Statements

- R = C
- C ≥ P
- D ≥ R
- B ≥ D

### Options

1. B ≥ P
2. B = P
3. B ≤ P
4. B > P

**Correct:** B ≥ P

### Explanation

Follow the complete chain: B ≥ D, D ≥ R, R = C, C ≥ P.

Every comparison on the route is inclusive, so equality at the two ends is still possible.

Therefore, the strongest relation we can guarantee is B ≥ P.

Why not “B = P”? Equality is allowed, but it is not forced; the end terms may also be strictly ordered.

Why not “B ≤ P”? That reads the comparison backwards. The question asks for B relative to P.

Why not “B > P”? The inclusive chain still allows the two end terms to be equal, so a strict answer is not guaranteed.

## 2. DETERMINE_LONG_CHAIN_RELATION — seed 1

What is the strongest relation that must be true for S compared with B?

### Statements

- Q = C
- C ≥ B
- D > Q
- S ≥ D

### Options

1. S < B
2. S > B
3. The relation cannot be determined
4. S = B

**Correct:** S > B

### Explanation

Follow the complete chain: S ≥ D, D > Q, Q = C, C ≥ B.

At least one comparison on the route is strict, so equality at the two ends is impossible.

Therefore, the strongest relation we can guarantee is S > B.

Why not “S < B”? That reads the comparison backwards. The question asks for S relative to B.

Why not “The relation cannot be determined”? The displayed statements do connect S to B, so their relation is not unknown.

Why not “S = B”? Equality is ruled out because the chain contains a strict comparison.

## 3. DETERMINE_LONG_CHAIN_RELATION — seed 2

What is the strongest relation that must be true for R compared with B?

### Statements

- C = S
- B ≥ Q
- Q ≥ C
- S ≥ R

### Options

1. The relation cannot be determined
2. R < B
3. R ≤ B
4. R = B

**Correct:** R ≤ B

### Explanation

Follow the complete chain: B ≥ Q, Q ≥ C, C = S, S ≥ R.

Every comparison on the route is inclusive, so equality at the two ends is still possible.

Therefore, the strongest relation we can guarantee is R ≤ B.

Why not “The relation cannot be determined”? The displayed statements do connect R to B, so their relation is not unknown.

Why not “R < B”? The inclusive chain still allows the two end terms to be equal, so a strict answer is not guaranteed.

Why not “R = B”? Equality is allowed, but it is not forced; the end terms may also be strictly ordered.

## 4. DETERMINE_LONG_CHAIN_RELATION — seed 3

What is the strongest relation that must be true for D compared with B?

### Statements

- S > Q
- B ≥ S
- Q = R
- R ≥ D

### Options

1. D ≤ B
2. D > B
3. D = B
4. D < B

**Correct:** D < B

### Explanation

Follow the complete chain: B ≥ S, S > Q, Q = R, R ≥ D.

At least one comparison on the route is strict, so equality at the two ends is impossible.

Therefore, the strongest relation we can guarantee is D < B.

Why not “D ≤ B”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is D < B.

Why not “D > B”? That reads the comparison backwards. The question asks for D relative to B.

Why not “D = B”? Equality is ruled out because the chain contains a strict comparison.

## 5. DETERMINE_LONG_CHAIN_RELATION — seed 4

What is the strongest relation that must be true for P compared with D?

### Statements

- B ≥ R
- A ≥ D
- P ≥ B
- R = A

### Options

1. P ≥ D
2. P = D
3. P > D
4. The relation cannot be determined

**Correct:** P ≥ D

### Explanation

Follow the complete chain: P ≥ B, B ≥ R, R = A, A ≥ D.

Every comparison on the route is inclusive, so equality at the two ends is still possible.

Therefore, the strongest relation we can guarantee is P ≥ D.

Why not “P = D”? Equality is allowed, but it is not forced; the end terms may also be strictly ordered.

Why not “P > D”? The inclusive chain still allows the two end terms to be equal, so a strict answer is not guaranteed.

Why not “The relation cannot be determined”? The displayed statements do connect P to D, so their relation is not unknown.

## 6. DETERMINE_MULTI_ROUTE_RELATION — seed 0

What is the strongest relation that must be true for R compared with A?

### Statements

- R > C
- R ≥ S
- S > A
- C ≥ A

### Options

1. R > A
2. R < A
3. The relation cannot be determined
4. R ≥ A

**Correct:** R > A

### Explanation

There are two routes between R and A: R > C, C ≥ A; and R ≥ S, S > A.

Both routes agree, and each contains a strict comparison. Therefore, they both support R > A.

Therefore, the strongest relation we can guarantee is R > A.

Why not “R < A”? That reads the comparison backwards. The question asks for R relative to A.

Why not “The relation cannot be determined”? The displayed statements do connect R to A, so their relation is not unknown.

Why not “R ≥ A”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is R > A.

## 7. DETERMINE_MULTI_ROUTE_RELATION — seed 1

What is the strongest relation that must be true for S compared with R?

### Statements

- R ≥ C
- Q ≥ S
- R > Q
- C > S

### Options

1. S = R
2. S < R
3. The relation cannot be determined
4. S ≤ R

**Correct:** S < R

### Explanation

There are two routes between S and R: R > Q, Q ≥ S; and R ≥ C, C > S.

Both routes agree, and each contains a strict comparison. Therefore, they both support S < R.

Therefore, the strongest relation we can guarantee is S < R.

Why not “S = R”? Equality is ruled out because the chain contains a strict comparison.

Why not “The relation cannot be determined”? The displayed statements do connect S to R, so their relation is not unknown.

Why not “S ≤ R”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is S < R.

## 8. DETERMINE_MULTI_ROUTE_RELATION — seed 2

What is the strongest relation that must be true for D compared with C?

### Statements

- S ≥ C
- D ≥ R
- D > S
- R > C

### Options

1. D < C
2. D ≥ C
3. D > C
4. The relation cannot be determined

**Correct:** D > C

### Explanation

There are two routes between D and C: D > S, S ≥ C; and D ≥ R, R > C.

Both routes agree, and each contains a strict comparison. Therefore, they both support D > C.

Therefore, the strongest relation we can guarantee is D > C.

Why not “D < C”? That reads the comparison backwards. The question asks for D relative to C.

Why not “D ≥ C”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is D > C.

Why not “The relation cannot be determined”? The displayed statements do connect D to C, so their relation is not unknown.

## 9. DETERMINE_MULTI_ROUTE_RELATION — seed 3

What is the strongest relation that must be true for D compared with P?

### Statements

- R ≥ D
- C > D
- P > R
- P ≥ C

### Options

1. D = P
2. D > P
3. The relation cannot be determined
4. D < P

**Correct:** D < P

### Explanation

There are two routes between D and P: P > R, R ≥ D; and P ≥ C, C > D.

Both routes agree, and each contains a strict comparison. Therefore, they both support D < P.

Therefore, the strongest relation we can guarantee is D < P.

Why not “D = P”? Equality is ruled out because the chain contains a strict comparison.

Why not “D > P”? That reads the comparison backwards. The question asks for D relative to P.

Why not “The relation cannot be determined”? The displayed statements do connect D to P, so their relation is not unknown.

## 10. DETERMINE_MULTI_ROUTE_RELATION — seed 4

What is the strongest relation that must be true for P compared with B?

### Statements

- A > B
- P ≥ A
- P > S
- S ≥ B

### Options

1. P > B
2. The relation cannot be determined
3. P = B
4. P ≥ B

**Correct:** P > B

### Explanation

There are two routes between P and B: P > S, S ≥ B; and P ≥ A, A > B.

Both routes agree, and each contains a strict comparison. Therefore, they both support P > B.

Therefore, the strongest relation we can guarantee is P > B.

Why not “The relation cannot be determined”? The displayed statements do connect P to B, so their relation is not unknown.

Why not “P = B”? Equality is ruled out because the chain contains a strict comparison.

Why not “P ≥ B”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is P > B.

## 11. APPLY_ALTERNATE_PATH_STRICTNESS — seed 0

What is the strongest relation that must be true for A compared with Q?

### Statements

- A ≥ C
- C > B
- A ≥ Q
- B ≥ Q

### Options

1. A > Q
2. A ≥ Q
3. The relation cannot be determined
4. A < Q

**Correct:** A > Q

### Explanation

One route is A ≥ Q. The alternate route is A ≥ C, C > B, B ≥ Q.

The first route is only inclusive, but the alternate route contains a strict comparison. That stricter route proves A > Q.

Therefore, the strongest relation we can guarantee is A > Q.

Why not “A ≥ Q”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is A > Q.

Why not “The relation cannot be determined”? The displayed statements do connect A to Q, so their relation is not unknown.

Why not “A < Q”? That reads the comparison backwards. The question asks for A relative to Q.

## 12. APPLY_ALTERNATE_PATH_STRICTNESS — seed 1

What is the strongest relation that must be true for P compared with S?

### Statements

- C > A
- S ≥ P
- A ≥ P
- S ≥ C

### Options

1. P = S
2. P < S
3. The relation cannot be determined
4. P ≤ S

**Correct:** P < S

### Explanation

One route is S ≥ P. The alternate route is S ≥ C, C > A, A ≥ P.

The first route is only inclusive, but the alternate route contains a strict comparison. That stricter route proves P < S.

Therefore, the strongest relation we can guarantee is P < S.

Why not “P = S”? Equality is ruled out because the chain contains a strict comparison.

Why not “The relation cannot be determined”? The displayed statements do connect P to S, so their relation is not unknown.

Why not “P ≤ S”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is P < S.

## 13. APPLY_ALTERNATE_PATH_STRICTNESS — seed 2

What is the strongest relation that must be true for B compared with S?

### Statements

- B ≥ S
- R > Q
- B ≥ R
- Q ≥ S

### Options

1. B < S
2. B ≥ S
3. B > S
4. The relation cannot be determined

**Correct:** B > S

### Explanation

One route is B ≥ S. The alternate route is B ≥ R, R > Q, Q ≥ S.

The first route is only inclusive, but the alternate route contains a strict comparison. That stricter route proves B > S.

Therefore, the strongest relation we can guarantee is B > S.

Why not “B < S”? That reads the comparison backwards. The question asks for B relative to S.

Why not “B ≥ S”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is B > S.

Why not “The relation cannot be determined”? The displayed statements do connect B to S, so their relation is not unknown.

## 14. APPLY_ALTERNATE_PATH_STRICTNESS — seed 3

What is the strongest relation that must be true for A compared with D?

### Statements

- R > Q
- Q ≥ A
- D ≥ R
- D ≥ A

### Options

1. A > D
2. A ≤ D
3. The relation cannot be determined
4. A < D

**Correct:** A < D

### Explanation

One route is D ≥ A. The alternate route is D ≥ R, R > Q, Q ≥ A.

The first route is only inclusive, but the alternate route contains a strict comparison. That stricter route proves A < D.

Therefore, the strongest relation we can guarantee is A < D.

Why not “A > D”? That reads the comparison backwards. The question asks for A relative to D.

Why not “A ≤ D”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is A < D.

Why not “The relation cannot be determined”? The displayed statements do connect A to D, so their relation is not unknown.

## 15. APPLY_ALTERNATE_PATH_STRICTNESS — seed 4

What is the strongest relation that must be true for S compared with A?

### Statements

- Q ≥ A
- S ≥ D
- D > Q
- S ≥ A

### Options

1. S > A
2. S ≥ A
3. S < A
4. The relation cannot be determined

**Correct:** S > A

### Explanation

One route is S ≥ A. The alternate route is S ≥ D, D > Q, Q ≥ A.

The first route is only inclusive, but the alternate route contains a strict comparison. That stricter route proves S > A.

Therefore, the strongest relation we can guarantee is S > A.

Why not “S ≥ A”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is S > A.

Why not “S < A”? That reads the comparison backwards. The question asks for S relative to A.

Why not “The relation cannot be determined”? The displayed statements do connect S to A, so their relation is not unknown.

## 16. DETERMINE_BRANCHED_GRAPH_RELATION — seed 0

What is the strongest relation that must be true for S compared with R?

### Statements

- A > S
- A > R
- S ≥ B
- R > B

### Options

1. The relation cannot be determined
2. S ≥ R
3. S < R
4. S = R

**Correct:** The relation cannot be determined

### Explanation

The statements place S and R on separate branches of the same graph.

Sharing bounds does not compare the two branch terms with each other, so no single relation is forced.

All three arrangements remain possible: S < R, S = R, or S > R.

So the relation between S and R cannot be determined.

Why not “S ≥ R”? A shared upper or lower bound does not tell us whether S is above, equal to, or below R.

Why not “S < R”? A shared upper or lower bound does not tell us whether S is above, equal to, or below R.

Why not “S = R”? A missing comparison does not imply equality.

## 17. DETERMINE_BRANCHED_GRAPH_RELATION — seed 1

What is the strongest relation that must be true for B compared with S?

### Statements

- R > B
- S > A
- R > S
- B ≥ A

### Options

1. B > S
2. The relation cannot be determined
3. B = S
4. B ≥ S

**Correct:** The relation cannot be determined

### Explanation

The statements place B and S on separate branches of the same graph.

Sharing bounds does not compare the two branch terms with each other, so no single relation is forced.

All three arrangements remain possible: B < S, B = S, or B > S.

So the relation between B and S cannot be determined.

Why not “B > S”? A shared upper or lower bound does not tell us whether B is above, equal to, or below S.

Why not “B = S”? A missing comparison does not imply equality.

Why not “B ≥ S”? A shared upper or lower bound does not tell us whether B is above, equal to, or below S.

## 18. DETERMINE_BRANCHED_GRAPH_RELATION — seed 2

What is the strongest relation that must be true for S compared with D?

### Statements

- B > D
- D > P
- S ≥ P
- B > S

### Options

1. S > D
2. S < D
3. The relation cannot be determined
4. S ≥ D

**Correct:** The relation cannot be determined

### Explanation

The statements place S and D on separate branches of the same graph.

Sharing bounds does not compare the two branch terms with each other, so no single relation is forced.

All three arrangements remain possible: S < D, S = D, or S > D.

So the relation between S and D cannot be determined.

Why not “S > D”? A shared upper or lower bound does not tell us whether S is above, equal to, or below D.

Why not “S < D”? A shared upper or lower bound does not tell us whether S is above, equal to, or below D.

Why not “S ≥ D”? A shared upper or lower bound does not tell us whether S is above, equal to, or below D.

## 19. DETERMINE_BRANCHED_GRAPH_RELATION — seed 3

What is the strongest relation that must be true for R compared with D?

### Statements

- R ≥ C
- S > R
- S > D
- D > C

### Options

1. R = D
2. R ≥ D
3. R > D
4. The relation cannot be determined

**Correct:** The relation cannot be determined

### Explanation

The statements place R and D on separate branches of the same graph.

Sharing bounds does not compare the two branch terms with each other, so no single relation is forced.

All three arrangements remain possible: R < D, R = D, or R > D.

So the relation between R and D cannot be determined.

Why not “R = D”? A missing comparison does not imply equality.

Why not “R ≥ D”? A shared upper or lower bound does not tell us whether R is above, equal to, or below D.

Why not “R > D”? A shared upper or lower bound does not tell us whether R is above, equal to, or below D.

## 20. DETERMINE_BRANCHED_GRAPH_RELATION — seed 4

What is the strongest relation that must be true for R compared with Q?

### Statements

- B > Q
- R ≥ P
- Q > P
- B > R

### Options

1. The relation cannot be determined
2. R = Q
3. R > Q
4. R < Q

**Correct:** The relation cannot be determined

### Explanation

The statements place R and Q on separate branches of the same graph.

Sharing bounds does not compare the two branch terms with each other, so no single relation is forced.

All three arrangements remain possible: R < Q, R = Q, or R > Q.

So the relation between R and Q cannot be determined.

Why not “R = Q”? A missing comparison does not imply equality.

Why not “R > Q”? A shared upper or lower bound does not tell us whether R is above, equal to, or below Q.

Why not “R < Q”? A shared upper or lower bound does not tell us whether R is above, equal to, or below Q.

## 21. FILTER_IRRELEVANT_STATEMENTS — seed 0

What is the strongest relation that must be true for R compared with C?

### Statements

- R ≥ B
- R > Q
- B > C
- Q > S

### Options

1. R > C
2. R = C
3. R < C
4. The relation cannot be determined

**Correct:** R > C

### Explanation

Only R ≥ B, B > C connects R with C.

R > Q and Q > S form a separate branch and do not change that route. The relevant chain gives R > C.

Therefore, the strongest relation we can guarantee is R > C.

Why not “R = C”? Equality is ruled out because the chain contains a strict comparison.

Why not “R < C”? That reads the comparison backwards. The question asks for R relative to C.

Why not “The relation cannot be determined”? The displayed statements do connect R to C, so their relation is not unknown.

## 22. FILTER_IRRELEVANT_STATEMENTS — seed 1

What is the strongest relation that must be true for A compared with Q?

### Statements

- R > A
- D > S
- Q > D
- Q ≥ R

### Options

1. A = Q
2. A < Q
3. A ≤ Q
4. The relation cannot be determined

**Correct:** A < Q

### Explanation

Only Q ≥ R, R > A connects A with Q.

Q > D and D > S form a separate branch and do not change that route. The relevant chain gives A < Q.

Therefore, the strongest relation we can guarantee is A < Q.

Why not “A = Q”? Equality is ruled out because the chain contains a strict comparison.

Why not “A ≤ Q”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is A < Q.

Why not “The relation cannot be determined”? The displayed statements do connect A to Q, so their relation is not unknown.

## 23. FILTER_IRRELEVANT_STATEMENTS — seed 2

What is the strongest relation that must be true for B compared with C?

### Statements

- B ≥ A
- R > S
- B > R
- A > C

### Options

1. The relation cannot be determined
2. B ≥ C
3. B > C
4. B < C

**Correct:** B > C

### Explanation

Only B ≥ A, A > C connects B with C.

B > R and R > S form a separate branch and do not change that route. The relevant chain gives B > C.

Therefore, the strongest relation we can guarantee is B > C.

Why not “The relation cannot be determined”? The displayed statements do connect B to C, so their relation is not unknown.

Why not “B ≥ C”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is B > C.

Why not “B < C”? That reads the comparison backwards. The question asks for B relative to C.

## 24. FILTER_IRRELEVANT_STATEMENTS — seed 3

What is the strongest relation that must be true for Q compared with A?

### Statements

- P > R
- A ≥ C
- C > Q
- A > P

### Options

1. Q = A
2. The relation cannot be determined
3. Q ≤ A
4. Q < A

**Correct:** Q < A

### Explanation

Only A ≥ C, C > Q connects Q with A.

A > P and P > R form a separate branch and do not change that route. The relevant chain gives Q < A.

Therefore, the strongest relation we can guarantee is Q < A.

Why not “Q = A”? Equality is ruled out because the chain contains a strict comparison.

Why not “The relation cannot be determined”? The displayed statements do connect Q to A, so their relation is not unknown.

Why not “Q ≤ A”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is Q < A.

## 25. FILTER_IRRELEVANT_STATEMENTS — seed 4

What is the strongest relation that must be true for B compared with A?

### Statements

- D > P
- S > A
- B > D
- B ≥ S

### Options

1. B > A
2. B = A
3. The relation cannot be determined
4. B ≥ A

**Correct:** B > A

### Explanation

Only B ≥ S, S > A connects B with A.

B > D and D > P form a separate branch and do not change that route. The relevant chain gives B > A.

Therefore, the strongest relation we can guarantee is B > A.

Why not “B = A”? Equality is ruled out because the chain contains a strict comparison.

Why not “The relation cannot be determined”? The displayed statements do connect B to A, so their relation is not unknown.

Why not “B ≥ A”? That answer is weaker than the result proved by the strict link in the chain. The strongest answer is B > A.

## 26. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 0

Which pair has a relation that is completely determined by the statements?

### Statements

- S ≥ A
- B = Q
- Q > A
- D > S

### Options

1. D and A
2. S and Q
3. D and Q
4. S and B

**Correct:** D and A

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

The statements force D > A, so this pair has a definite relation.

Therefore, option 1 — D and A — is the pair with a definite relation.

Why not “S and Q”? No comparison path fixes the order of S and Q; either one may be greater, or they may be equal.

Why not “D and Q”? No comparison path fixes the order of D and Q; either one may be greater, or they may be equal.

Why not “S and B”? No comparison path fixes the order of S and B; either one may be greater, or they may be equal.

## 27. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 1

Which pair has a relation that is completely determined by the statements?

### Statements

- A > B
- R = A
- Q > C
- C ≥ B

### Options

1. C and A
2. Q and B
3. Q and A
4. C and R

**Correct:** Q and B

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

The statements force Q > B, so this pair has a definite relation.

Therefore, option 2 — Q and B — is the pair with a definite relation.

Why not “C and A”? No comparison path fixes the order of C and A; either one may be greater, or they may be equal.

Why not “Q and A”? No comparison path fixes the order of Q and A; either one may be greater, or they may be equal.

Why not “C and R”? No comparison path fixes the order of C and R; either one may be greater, or they may be equal.

## 28. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 2

Which pair has a relation that is completely determined by the statements?

### Statements

- C ≥ B
- R > C
- A > B
- D = A

### Options

1. C and A
2. R and A
3. R and B
4. C and D

**Correct:** R and B

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

The statements force R > B, so this pair has a definite relation.

Therefore, option 3 — R and B — is the pair with a definite relation.

Why not “C and A”? No comparison path fixes the order of C and A; either one may be greater, or they may be equal.

Why not “R and A”? No comparison path fixes the order of R and A; either one may be greater, or they may be equal.

Why not “C and D”? No comparison path fixes the order of C and D; either one may be greater, or they may be equal.

## 29. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 3

Which pair has a relation that is completely determined by the statements?

### Statements

- A > S
- Q = A
- D ≥ S
- P > D

### Options

1. D and A
2. P and A
3. D and Q
4. P and S

**Correct:** P and S

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

The statements force P > S, so this pair has a definite relation.

Therefore, option 4 — P and S — is the pair with a definite relation.

Why not “D and A”? No comparison path fixes the order of D and A; either one may be greater, or they may be equal.

Why not “P and A”? No comparison path fixes the order of P and A; either one may be greater, or they may be equal.

Why not “D and Q”? No comparison path fixes the order of D and Q; either one may be greater, or they may be equal.

## 30. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 4

Which pair has a relation that is completely determined by the statements?

### Statements

- A = C
- Q > S
- S ≥ B
- C > B

### Options

1. Q and B
2. S and C
3. Q and C
4. S and A

**Correct:** Q and B

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

The statements force Q > B, so this pair has a definite relation.

Therefore, option 1 — Q and B — is the pair with a definite relation.

Why not “S and C”? No comparison path fixes the order of S and C; either one may be greater, or they may be equal.

Why not “Q and C”? No comparison path fixes the order of Q and C; either one may be greater, or they may be equal.

Why not “S and A”? No comparison path fixes the order of S and A; either one may be greater, or they may be equal.

## 31. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 0

Which pair has a relation that cannot be determined from the statements?

### Statements

- P ≥ Q
- R > P
- Q = D
- A > D

### Options

1. P and A
2. R and Q
3. D and P
4. R and D

**Correct:** P and A

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

No comparison path fixes the order of P and A; either one may be greater, or they may be equal.

Therefore, option 1 — P and A — is the pair whose relation cannot be determined.

Why not “R and Q”? The statements force R > Q, so this pair has a definite relation.

Why not “D and P”? The statements force D ≤ P, so this pair has a definite relation.

Why not “R and D”? The statements force R > D, so this pair has a definite relation.

## 32. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 1

Which pair has a relation that cannot be determined from the statements?

### Statements

- S > A
- R > Q
- Q ≥ B
- B = A

### Options

1. R and B
2. Q and S
3. A and Q
4. R and A

**Correct:** Q and S

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

No comparison path fixes the order of Q and S; either one may be greater, or they may be equal.

Therefore, option 2 — Q and S — is the pair whose relation cannot be determined.

Why not “R and B”? The statements force R > B, so this pair has a definite relation.

Why not “A and Q”? The statements force A ≤ Q, so this pair has a definite relation.

Why not “R and A”? The statements force R > A, so this pair has a definite relation.

## 33. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 2

Which pair has a relation that cannot be determined from the statements?

### Statements

- C = Q
- P > Q
- S ≥ C
- A > S

### Options

1. A and C
2. Q and S
3. S and P
4. A and Q

**Correct:** S and P

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

No comparison path fixes the order of S and P; either one may be greater, or they may be equal.

Therefore, option 3 — S and P — is the pair whose relation cannot be determined.

Why not “A and C”? The statements force A > C, so this pair has a definite relation.

Why not “Q and S”? The statements force Q ≤ S, so this pair has a definite relation.

Why not “A and Q”? The statements force A > Q, so this pair has a definite relation.

## 34. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 3

Which pair has a relation that cannot be determined from the statements?

### Statements

- P > C
- R = Q
- B > Q
- C ≥ R

### Options

1. P and R
2. Q and C
3. P and Q
4. C and B

**Correct:** C and B

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

No comparison path fixes the order of C and B; either one may be greater, or they may be equal.

Therefore, option 4 — C and B — is the pair whose relation cannot be determined.

Why not “P and R”? The statements force P > R, so this pair has a definite relation.

Why not “Q and C”? The statements force Q ≤ C, so this pair has a definite relation.

Why not “P and Q”? The statements force P > Q, so this pair has a definite relation.

## 35. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 4

Which pair has a relation that cannot be determined from the statements?

### Statements

- B > A
- A ≥ R
- D > Q
- R = Q

### Options

1. A and D
2. B and R
3. Q and A
4. B and Q

**Correct:** A and D

### Explanation

Check each pair separately. A pair is definite only when the displayed statements force one relation between its two terms.

No comparison path fixes the order of A and D; either one may be greater, or they may be equal.

Therefore, option 1 — A and D — is the pair whose relation cannot be determined.

Why not “B and R”? The statements force B > R, so this pair has a definite relation.

Why not “Q and A”? The statements force Q ≤ A, so this pair has a definite relation.

Why not “B and Q”? The statements force B > Q, so this pair has a definite relation.

## 36. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 0

What is the strongest relation that must be true for P compared with Q?

### Statements

- R > P
- P ≥ D
- B > Q
- R > D

### Options

1. The relation cannot be determined
2. P ≥ Q
3. P = Q
4. P < Q

**Correct:** The relation cannot be determined

### Explanation

P and Q belong to different connected groups of statements.

No comparison path joins the two groups. Either term may be above, equal to, or below the other, so no single relation is forced.

All three arrangements remain possible: P < Q, P = Q, or P > Q.

So the relation between P and Q cannot be determined.

Why not “P ≥ Q”? A shared upper or lower bound does not tell us whether P is above, equal to, or below Q.

Why not “P = Q”? A missing comparison does not imply equality.

Why not “P < Q”? A shared upper or lower bound does not tell us whether P is above, equal to, or below Q.

## 37. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 1

What is the strongest relation that must be true for D compared with A?

### Statements

- R > A
- S > P
- S > D
- D ≥ P

### Options

1. D < A
2. The relation cannot be determined
3. D = A
4. D > A

**Correct:** The relation cannot be determined

### Explanation

D and A belong to different connected groups of statements.

No comparison path joins the two groups. Either term may be above, equal to, or below the other, so no single relation is forced.

All three arrangements remain possible: D < A, D = A, or D > A.

So the relation between D and A cannot be determined.

Why not “D < A”? A shared upper or lower bound does not tell us whether D is above, equal to, or below A.

Why not “D = A”? A missing comparison does not imply equality.

Why not “D > A”? A shared upper or lower bound does not tell us whether D is above, equal to, or below A.

## 38. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 2

What is the strongest relation that must be true for R compared with P?

### Statements

- D > R
- D > B
- R ≥ B
- C > P

### Options

1. R = P
2. R < P
3. The relation cannot be determined
4. R > P

**Correct:** The relation cannot be determined

### Explanation

R and P belong to different connected groups of statements.

No comparison path joins the two groups. Either term may be above, equal to, or below the other, so no single relation is forced.

All three arrangements remain possible: R < P, R = P, or R > P.

So the relation between R and P cannot be determined.

Why not “R = P”? A missing comparison does not imply equality.

Why not “R < P”? A shared upper or lower bound does not tell us whether R is above, equal to, or below P.

Why not “R > P”? A shared upper or lower bound does not tell us whether R is above, equal to, or below P.

## 39. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 3

What is the strongest relation that must be true for D compared with B?

### Statements

- C > A
- D ≥ A
- C > D
- Q > B

### Options

1. D = B
2. D < B
3. D ≥ B
4. The relation cannot be determined

**Correct:** The relation cannot be determined

### Explanation

D and B belong to different connected groups of statements.

No comparison path joins the two groups. Either term may be above, equal to, or below the other, so no single relation is forced.

All three arrangements remain possible: D < B, D = B, or D > B.

So the relation between D and B cannot be determined.

Why not “D = B”? A missing comparison does not imply equality.

Why not “D < B”? A shared upper or lower bound does not tell us whether D is above, equal to, or below B.

Why not “D ≥ B”? A shared upper or lower bound does not tell us whether D is above, equal to, or below B.

## 40. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 4

What is the strongest relation that must be true for C compared with B?

### Statements

- C ≥ R
- Q > B
- D > R
- D > C

### Options

1. The relation cannot be determined
2. C > B
3. C < B
4. C = B

**Correct:** The relation cannot be determined

### Explanation

C and B belong to different connected groups of statements.

No comparison path joins the two groups. Either term may be above, equal to, or below the other, so no single relation is forced.

All three arrangements remain possible: C < B, C = B, or C > B.

So the relation between C and B cannot be determined.

Why not “C > B”? A shared upper or lower bound does not tell us whether C is above, equal to, or below B.

Why not “C < B”? A shared upper or lower bound does not tell us whether C is above, equal to, or below B.

Why not “C = B”? A missing comparison does not imply equality.

## 41. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 0

What is the strongest relation that must be true for B compared with P?

### Statements

- S = P
- B > D
- B = S
- P ≥ R

### Options

1. B = P
2. The relation cannot be determined
3. B < P
4. B > P

**Correct:** B = P

### Explanation

The equality route is B = S, S = P.

The two queried terms belong to the same equality group. Comparisons leaving that group do not change their equality, so B = P.

Therefore, the strongest relation we can guarantee is B = P.

Why not “The relation cannot be determined”? An equality sign gives an exact relation; it is not missing information.

Why not “B < P”? Equal terms must keep the same comparison with every other term.

Why not “B > P”? Equal terms must keep the same comparison with every other term.

## 42. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 1

What is the strongest relation that must be true for Q compared with A?

### Statements

- Q > R
- Q = C
- C = A
- A ≥ B

### Options

1. Q < A
2. Q = A
3. The relation cannot be determined
4. Q ≥ A

**Correct:** Q = A

### Explanation

The equality route is Q = C, C = A.

The two queried terms belong to the same equality group. Comparisons leaving that group do not change their equality, so Q = A.

Therefore, the strongest relation we can guarantee is Q = A.

Why not “Q < A”? Equal terms must keep the same comparison with every other term.

Why not “The relation cannot be determined”? An equality sign gives an exact relation; it is not missing information.

Why not “Q ≥ A”? The statements prove equality exactly, so a weaker inclusive relation is not the strongest answer.

## 43. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 2

What is the strongest relation that must be true for R compared with Q?

### Statements

- R = D
- Q ≥ C
- D = Q
- R > S

### Options

1. R ≥ Q
2. R < Q
3. R = Q
4. The relation cannot be determined

**Correct:** R = Q

### Explanation

The equality route is R = D, D = Q.

The two queried terms belong to the same equality group. Comparisons leaving that group do not change their equality, so R = Q.

Therefore, the strongest relation we can guarantee is R = Q.

Why not “R ≥ Q”? The statements prove equality exactly, so a weaker inclusive relation is not the strongest answer.

Why not “R < Q”? Equal terms must keep the same comparison with every other term.

Why not “The relation cannot be determined”? An equality sign gives an exact relation; it is not missing information.

## 44. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 3

What is the strongest relation that must be true for S compared with R?

### Statements

- S > D
- S = B
- B = R
- R ≥ A

### Options

1. S ≥ R
2. S > R
3. S < R
4. S = R

**Correct:** S = R

### Explanation

The equality route is S = B, B = R.

The two queried terms belong to the same equality group. Comparisons leaving that group do not change their equality, so S = R.

Therefore, the strongest relation we can guarantee is S = R.

Why not “S ≥ R”? The statements prove equality exactly, so a weaker inclusive relation is not the strongest answer.

Why not “S > R”? Equal terms must keep the same comparison with every other term.

Why not “S < R”? Equal terms must keep the same comparison with every other term.

## 45. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 4

What is the strongest relation that must be true for C compared with Q?

### Statements

- D = Q
- C = D
- C > B
- Q ≥ A

### Options

1. C = Q
2. C > Q
3. The relation cannot be determined
4. C < Q

**Correct:** C = Q

### Explanation

The equality route is C = D, D = Q.

The two queried terms belong to the same equality group. Comparisons leaving that group do not change their equality, so C = Q.

Therefore, the strongest relation we can guarantee is C = Q.

Why not “C > Q”? Equal terms must keep the same comparison with every other term.

Why not “The relation cannot be determined”? An equality sign gives an exact relation; it is not missing information.

Why not “C < Q”? Equal terms must keep the same comparison with every other term.
