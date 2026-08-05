# INE-CP-002 English Prototype Review Pack

Prototype-only review material. Permanent QLs remain unallocated and Question Studio visibility remains disabled.

## 1. DETERMINE_LONG_CHAIN_RELATION — seed 0

**Record:** INE-CP002-293CD530 · **Difficulty:** MEDIUM · **Topology:** LONG_CHAIN_5_ENTITIES · **Explanation mode:** LONG_CHAIN

Which relation between B and P is definitely established by the statements?

### Statements

- C = R
- P ≤ C
- D ≥ R
- D ≤ B

### Options

1. B > P
2. B ≥ P
3. B < P
4. The relation cannot be determined

**Correct:** B ≥ P

### Explanation

Read the links as one chain: D ≤ B and D ≥ R and C = R and P ≤ C.

None of those links forces the end values apart. Equality is still possible, so the guaranteed relation is B ≥ P.

Therefore, B ≥ P is definitely established.

Why not “B > P”? Every link on the decisive route is inclusive, so equality remains possible and a strict answer is not guaranteed.

Why not “B < P”? B < P points in the wrong direction; the decisive route establishes B ≥ P.

Why not “The relation cannot be determined”? A complete route connects B and P, so their relation is determined.

## 2. DETERMINE_LONG_CHAIN_RELATION — seed 1

**Record:** INE-CP002-43291FD3 · **Difficulty:** MEDIUM · **Topology:** LONG_CHAIN_5_ENTITIES · **Explanation mode:** LONG_CHAIN

Which relation between S and B is definitely established by the statements?

### Statements

- C = Q
- C ≥ B
- Q < D
- S ≥ D

### Options

1. S = B
2. S ≤ B
3. S > B
4. The relation cannot be determined

**Correct:** S > B

### Explanation

Read the links as one chain: S ≥ D and Q < D and C = Q and C ≥ B.

A strict link occurs on the route, so the two ends cannot be equal. This proves S > B.

Therefore, S > B is definitely established.

Why not “S = B”? The strict link on the decisive route makes equality impossible.

Why not “S ≤ B”? S ≤ B points in the wrong direction; the decisive route establishes S > B.

Why not “The relation cannot be determined”? A complete route connects S and B, so their relation is determined.

## 3. DETERMINE_LONG_CHAIN_RELATION — seed 2

**Record:** INE-CP002-4E6C2C8E · **Difficulty:** MEDIUM · **Topology:** LONG_CHAIN_5_ENTITIES · **Explanation mode:** LONG_CHAIN

Which relation between R and B is definitely established by the statements?

### Statements

- S = C
- B ≥ Q
- Q ≥ C
- S ≥ R

### Options

1. R < B
2. R = B
3. R > B
4. R ≤ B

**Correct:** R ≤ B

### Explanation

Read the links as one chain: B ≥ Q and Q ≥ C and S = C and S ≥ R.

None of those links forces the end values apart. Equality is still possible, so the guaranteed relation is R ≤ B.

Therefore, R ≤ B is definitely established.

Why not “R < B”? Every link on the decisive route is inclusive, so equality remains possible and a strict answer is not guaranteed.

Why not “R = B”? Equality is possible, but the inclusive chain does not force it.

Why not “R > B”? R > B points in the wrong direction; the decisive route establishes R ≤ B.

## 4. DETERMINE_LONG_CHAIN_RELATION — seed 3

**Record:** INE-CP002-3F4467E9 · **Difficulty:** MEDIUM · **Topology:** LONG_CHAIN_5_ENTITIES · **Explanation mode:** LONG_CHAIN

Which relation between D and B is definitely established by the statements?

### Statements

- S > Q
- B ≥ S
- Q = R
- D ≤ R

### Options

1. D < B
2. D = B
3. The relation cannot be determined
4. D ≥ B

**Correct:** D < B

### Explanation

Read the links as one chain: B ≥ S and S > Q and Q = R and D ≤ R.

A strict link occurs on the route, so the two ends cannot be equal. This proves D < B.

Therefore, D < B is definitely established.

Why not “D = B”? The strict link on the decisive route makes equality impossible.

Why not “The relation cannot be determined”? A complete route connects D and B, so their relation is determined.

Why not “D ≥ B”? D ≥ B points in the wrong direction; the decisive route establishes D < B.

## 5. DETERMINE_LONG_CHAIN_RELATION — seed 4

**Record:** INE-CP002-5D7403E4 · **Difficulty:** MEDIUM · **Topology:** LONG_CHAIN_5_ENTITIES · **Explanation mode:** LONG_CHAIN

Which relation between P and D is definitely established by the statements?

### Statements

- R ≤ B
- D ≤ A
- B ≤ P
- R = A

### Options

1. P < D
2. The relation cannot be determined
3. P ≥ D
4. P = D

**Correct:** P ≥ D

### Explanation

Read the links as one chain: B ≤ P and R ≤ B and R = A and D ≤ A.

None of those links forces the end values apart. Equality is still possible, so the guaranteed relation is P ≥ D.

Therefore, P ≥ D is definitely established.

Why not “P < D”? P < D points in the wrong direction; the decisive route establishes P ≥ D.

Why not “The relation cannot be determined”? A complete route connects P and D, so their relation is determined.

Why not “P = D”? Equality is possible, but the inclusive chain does not force it.

## 6. DETERMINE_MULTI_ROUTE_RELATION — seed 0

**Record:** INE-CP002-6E133C6B · **Difficulty:** HARD · **Topology:** DIAMOND_TWO_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

Which relation between R and A is definitely established by the statements?

### Statements

- R > C
- R ≥ S
- S > A
- A ≤ C

### Options

1. R > A
2. R = A
3. The relation cannot be determined
4. R ≤ A

**Correct:** R > A

### Explanation

Two separate routes connect R and A.

Route 1: R > C and A ≤ C — this gives R > A.

Route 2: R ≥ S and S > A — this independently gives the same result.

Therefore, R > A is definitely established.

Why not “R = A”? The strict link on the decisive route makes equality impossible.

Why not “The relation cannot be determined”? A complete route connects R and A, so their relation is determined.

Why not “R ≤ A”? R ≤ A points in the wrong direction; the decisive route establishes R > A.

## 7. DETERMINE_MULTI_ROUTE_RELATION — seed 1

**Record:** INE-CP002-C443CD48 · **Difficulty:** HARD · **Topology:** DIAMOND_TWO_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

Which relation between S and R is definitely established by the statements?

### Statements

- C ≤ R
- Q ≥ S
- R > Q
- C > S

### Options

1. S > R
2. S < R
3. S ≥ R
4. S = R

**Correct:** S < R

### Explanation

Two separate routes connect S and R.

Route 1: R > Q and Q ≥ S — this gives S < R.

Route 2: C ≤ R and C > S — this independently gives the same result.

Therefore, S < R is definitely established.

Why not “S > R”? S > R points in the wrong direction; the decisive route establishes S < R.

Why not “S ≥ R”? S ≥ R points in the wrong direction; the decisive route establishes S < R.

Why not “S = R”? The strict link on the decisive route makes equality impossible.

## 8. DETERMINE_MULTI_ROUTE_RELATION — seed 2

**Record:** INE-CP002-80970D01 · **Difficulty:** HARD · **Topology:** DIAMOND_TWO_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

Which relation between D and C is definitely established by the statements?

### Statements

- S ≥ C
- R ≤ D
- D > S
- R > C

### Options

1. D < C
2. The relation cannot be determined
3. D > C
4. D = C

**Correct:** D > C

### Explanation

Two separate routes connect D and C.

Route 1: D > S and S ≥ C — this gives D > C.

Route 2: R ≤ D and R > C — this independently gives the same result.

Therefore, D > C is definitely established.

Why not “D < C”? D < C points in the wrong direction; the decisive route establishes D > C.

Why not “The relation cannot be determined”? A complete route connects D and C, so their relation is determined.

Why not “D = C”? The strict link on the decisive route makes equality impossible.

## 9. DETERMINE_MULTI_ROUTE_RELATION — seed 3

**Record:** INE-CP002-77E746C6 · **Difficulty:** HARD · **Topology:** DIAMOND_TWO_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

Which relation between D and P is definitely established by the statements?

### Statements

- R ≥ D
- D < C
- P > R
- P ≥ C

### Options

1. D > P
2. D ≥ P
3. D = P
4. D < P

**Correct:** D < P

### Explanation

Two separate routes connect D and P.

Route 1: P > R and R ≥ D — this gives D < P.

Route 2: P ≥ C and D < C — this independently gives the same result.

Therefore, D < P is definitely established.

Why not “D > P”? D > P points in the wrong direction; the decisive route establishes D < P.

Why not “D ≥ P”? D ≥ P points in the wrong direction; the decisive route establishes D < P.

Why not “D = P”? The strict link on the decisive route makes equality impossible.

## 10. DETERMINE_MULTI_ROUTE_RELATION — seed 4

**Record:** INE-CP002-18DC090F · **Difficulty:** HARD · **Topology:** DIAMOND_TWO_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

Which relation between P and B is definitely established by the statements?

### Statements

- A > B
- A ≤ P
- S < P
- B ≤ S

### Options

1. P = B
2. The relation cannot be determined
3. P ≤ B
4. P > B

**Correct:** P > B

### Explanation

Two separate routes connect P and B.

Route 1: S < P and B ≤ S — this gives P > B.

Route 2: A ≤ P and A > B — this independently gives the same result.

Therefore, P > B is definitely established.

Why not “P = B”? The strict link on the decisive route makes equality impossible.

Why not “The relation cannot be determined”? A complete route connects P and B, so their relation is determined.

Why not “P ≤ B”? P ≤ B points in the wrong direction; the decisive route establishes P > B.

## 11. APPLY_ALTERNATE_PATH_STRICTNESS — seed 0

**Record:** INE-CP002-FE96204A · **Difficulty:** HARD · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

Which relation between A and Q is definitely established by the statements?

### Statements

- C ≤ A
- C > B
- Q ≤ A
- B ≥ Q

### Options

1. A > Q
2. A = Q
3. A < Q
4. A ≤ Q

**Correct:** A > Q

### Explanation

Compare the two available routes from A to Q.

Direct route: Q ≤ A — this is only inclusive.

Alternate route: C ≤ A and C > B and B ≥ Q — its strict link rules out equality, proving A > Q.

Therefore, A > Q is definitely established.

Why not “A = Q”? The strict link on the decisive route makes equality impossible.

Why not “A < Q”? A < Q points in the wrong direction; the decisive route establishes A > Q.

Why not “A ≤ Q”? A ≤ Q points in the wrong direction; the decisive route establishes A > Q.

## 12. APPLY_ALTERNATE_PATH_STRICTNESS — seed 1

**Record:** INE-CP002-FC342A65 · **Difficulty:** HARD · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

Which relation between P and S is definitely established by the statements?

### Statements

- A < C
- S ≥ P
- P ≤ A
- C ≤ S

### Options

1. P = S
2. P > S
3. The relation cannot be determined
4. P < S

**Correct:** P < S

### Explanation

Compare the two available routes from P to S.

Direct route: S ≥ P — this is only inclusive.

Alternate route: C ≤ S and A < C and P ≤ A — its strict link rules out equality, proving P < S.

Therefore, P < S is definitely established.

Why not “P = S”? The strict link on the decisive route makes equality impossible.

Why not “P > S”? P > S points in the wrong direction; the decisive route establishes P < S.

Why not “The relation cannot be determined”? A complete route connects P and S, so their relation is determined.

## 13. APPLY_ALTERNATE_PATH_STRICTNESS — seed 2

**Record:** INE-CP002-4D04FAEC · **Difficulty:** HARD · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

Which relation between B and S is definitely established by the statements?

### Statements

- S ≤ B
- R > Q
- R ≤ B
- Q ≥ S

### Options

1. B = S
2. B > S
3. B < S
4. B ≤ S

**Correct:** B > S

### Explanation

Compare the two available routes from B to S.

Direct route: S ≤ B — this is only inclusive.

Alternate route: R ≤ B and R > Q and Q ≥ S — its strict link rules out equality, proving B > S.

Therefore, B > S is definitely established.

Why not “B = S”? The strict link on the decisive route makes equality impossible.

Why not “B < S”? B < S points in the wrong direction; the decisive route establishes B > S.

Why not “B ≤ S”? B ≤ S points in the wrong direction; the decisive route establishes B > S.

## 14. APPLY_ALTERNATE_PATH_STRICTNESS — seed 3

**Record:** INE-CP002-55B887DF · **Difficulty:** HARD · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

Which relation between A and D is definitely established by the statements?

### Statements

- Q < R
- Q ≥ A
- R ≤ D
- D ≥ A

### Options

1. A ≥ D
2. A = D
3. A < D
4. The relation cannot be determined

**Correct:** A < D

### Explanation

Compare the two available routes from A to D.

Direct route: D ≥ A — this is only inclusive.

Alternate route: R ≤ D and Q < R and Q ≥ A — its strict link rules out equality, proving A < D.

Therefore, A < D is definitely established.

Why not “A ≥ D”? A ≥ D points in the wrong direction; the decisive route establishes A < D.

Why not “A = D”? The strict link on the decisive route makes equality impossible.

Why not “The relation cannot be determined”? A complete route connects A and D, so their relation is determined.

## 15. APPLY_ALTERNATE_PATH_STRICTNESS — seed 4

**Record:** INE-CP002-15F6AF56 · **Difficulty:** HARD · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

Which relation between S and A is definitely established by the statements?

### Statements

- Q ≥ A
- D ≤ S
- Q < D
- S ≥ A

### Options

1. S > A
2. S < A
3. S = A
4. The relation cannot be determined

**Correct:** S > A

### Explanation

Compare the two available routes from S to A.

Direct route: S ≥ A — this is only inclusive.

Alternate route: D ≤ S and Q < D and Q ≥ A — its strict link rules out equality, proving S > A.

Therefore, S > A is definitely established.

Why not “S < A”? S < A points in the wrong direction; the decisive route establishes S > A.

Why not “S = A”? The strict link on the decisive route makes equality impossible.

Why not “The relation cannot be determined”? A complete route connects S and A, so their relation is determined.

## 16. DETERMINE_BRANCHED_GRAPH_RELATION — seed 0

**Record:** INE-CP002-34FE440A · **Difficulty:** MEDIUM · **Topology:** UPPER_AND_LOWER_SHARED_BOUNDS · **Explanation mode:** BRANCHED_GRAPH

Which relation between S and R is definitely established by the statements?

### Statements

- A > S
- A > R
- B ≤ S
- R > B

### Options

1. S < R
2. S ≥ R
3. The relation cannot be determined
4. S > R

**Correct:** The relation cannot be determined

### Explanation

S and R sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of S and R is not fixed.

A=2, B=0, R=1, S=0 satisfies every statement and gives S < R.

A=2, B=0, R=1, S=1 satisfies every statement and gives S = R.

Because valid arrangements give different results, the relation between S and R cannot be determined.

Why not “S < R”? The valid arrangements above give different orders for S and R, so S < R is not guaranteed.

Why not “S ≥ R”? The valid arrangements above give different orders for S and R, so S ≥ R is not guaranteed.

Why not “S > R”? The valid arrangements above give different orders for S and R, so S > R is not guaranteed.

## 17. DETERMINE_BRANCHED_GRAPH_RELATION — seed 1

**Record:** INE-CP002-295A6C25 · **Difficulty:** MEDIUM · **Topology:** UPPER_AND_LOWER_SHARED_BOUNDS · **Explanation mode:** BRANCHED_GRAPH

Which relation between B and S is definitely established by the statements?

### Statements

- R > B
- S > A
- S < R
- B ≥ A

### Options

1. B < S
2. B ≥ S
3. B > S
4. The relation cannot be determined

**Correct:** The relation cannot be determined

### Explanation

B and S sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of B and S is not fixed.

A=0, B=0, R=2, S=1 satisfies every statement and gives B < S.

A=0, B=1, R=2, S=1 satisfies every statement and gives B = S.

Because valid arrangements give different results, the relation between B and S cannot be determined.

Why not “B < S”? The valid arrangements above give different orders for B and S, so B < S is not guaranteed.

Why not “B ≥ S”? The valid arrangements above give different orders for B and S, so B ≥ S is not guaranteed.

Why not “B > S”? The valid arrangements above give different orders for B and S, so B > S is not guaranteed.

## 18. DETERMINE_BRANCHED_GRAPH_RELATION — seed 2

**Record:** INE-CP002-7A2B3CAC · **Difficulty:** MEDIUM · **Topology:** UPPER_AND_LOWER_SHARED_BOUNDS · **Explanation mode:** BRANCHED_GRAPH

Which relation between S and D is definitely established by the statements?

### Statements

- D < B
- P < D
- S ≥ P
- S < B

### Options

1. S > D
2. The relation cannot be determined
3. S ≥ D
4. S < D

**Correct:** The relation cannot be determined

### Explanation

S and D sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of S and D is not fixed.

B=2, D=1, P=0, S=0 satisfies every statement and gives S < D.

B=2, D=1, P=0, S=1 satisfies every statement and gives S = D.

Because valid arrangements give different results, the relation between S and D cannot be determined.

Why not “S > D”? The valid arrangements above give different orders for S and D, so S > D is not guaranteed.

Why not “S ≥ D”? The valid arrangements above give different orders for S and D, so S ≥ D is not guaranteed.

Why not “S < D”? The valid arrangements above give different orders for S and D, so S < D is not guaranteed.

## 19. DETERMINE_BRANCHED_GRAPH_RELATION — seed 3

**Record:** INE-CP002-5FED5A9F · **Difficulty:** MEDIUM · **Topology:** UPPER_AND_LOWER_SHARED_BOUNDS · **Explanation mode:** BRANCHED_GRAPH

Which relation between R and D is definitely established by the statements?

### Statements

- C ≤ R
- R < S
- D < S
- C < D

### Options

1. The relation cannot be determined
2. R ≥ D
3. R = D
4. R > D

**Correct:** The relation cannot be determined

### Explanation

R and D sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of R and D is not fixed.

C=0, D=1, R=0, S=2 satisfies every statement and gives R < D.

C=0, D=1, R=1, S=2 satisfies every statement and gives R = D.

Because valid arrangements give different results, the relation between R and D cannot be determined.

Why not “R ≥ D”? The valid arrangements above give different orders for R and D, so R ≥ D is not guaranteed.

Why not “R = D”? The valid arrangements above give different orders for R and D, so R = D is not guaranteed.

Why not “R > D”? The valid arrangements above give different orders for R and D, so R > D is not guaranteed.

## 20. DETERMINE_BRANCHED_GRAPH_RELATION — seed 4

**Record:** INE-CP002-26FFEE16 · **Difficulty:** MEDIUM · **Topology:** UPPER_AND_LOWER_SHARED_BOUNDS · **Explanation mode:** BRANCHED_GRAPH

Which relation between R and Q is definitely established by the statements?

### Statements

- Q < B
- R ≥ P
- P < Q
- R < B

### Options

1. The relation cannot be determined
2. R > Q
3. R < Q
4. R = Q

**Correct:** The relation cannot be determined

### Explanation

R and Q sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of R and Q is not fixed.

B=2, P=0, Q=1, R=0 satisfies every statement and gives R < Q.

B=2, P=0, Q=1, R=1 satisfies every statement and gives R = Q.

Because valid arrangements give different results, the relation between R and Q cannot be determined.

Why not “R > Q”? The valid arrangements above give different orders for R and Q, so R > Q is not guaranteed.

Why not “R < Q”? The valid arrangements above give different orders for R and Q, so R < Q is not guaranteed.

Why not “R = Q”? The valid arrangements above give different orders for R and Q, so R = Q is not guaranteed.

## 21. FILTER_IRRELEVANT_STATEMENTS — seed 0

**Record:** INE-CP002-F7B6A136 · **Difficulty:** MEDIUM · **Topology:** RELEVANT_CHAIN_PLUS_SIDE_BRANCH · **Explanation mode:** IRRELEVANT_EVIDENCE

Which relation between R and C is definitely established by the statements?

### Statements

- B ≤ R
- Q < R
- B > C
- S < Q

### Options

1. R < C
2. R > C
3. The relation cannot be determined
4. R ≤ C

**Correct:** R > C

### Explanation

Relevant route: B ≤ R and B > C.

The remaining clues — Q < R and S < Q — do not complete another route between R and C. The relevant route proves R > C.

Therefore, R > C is definitely established.

Why not “R < C”? R < C points in the wrong direction; the decisive route establishes R > C.

Why not “The relation cannot be determined”? A complete route connects R and C, so their relation is determined.

Why not “R ≤ C”? R ≤ C points in the wrong direction; the decisive route establishes R > C.

## 22. FILTER_IRRELEVANT_STATEMENTS — seed 1

**Record:** INE-CP002-184147B1 · **Difficulty:** MEDIUM · **Topology:** RELEVANT_CHAIN_PLUS_DISCONNECTED_CLUE · **Explanation mode:** IRRELEVANT_EVIDENCE

Which relation between S and Q is definitely established by the statements?

### Statements

- A > R
- S < D
- Q ≥ D

### Options

1. S = Q
2. The relation cannot be determined
3. S < Q
4. S ≥ Q

**Correct:** S < Q

### Explanation

Relevant route: Q ≥ D and S < D.

The remaining clues — A > R — do not complete another route between S and Q. The relevant route proves S < Q.

Therefore, S < Q is definitely established.

Why not “S = Q”? The strict link on the decisive route makes equality impossible.

Why not “The relation cannot be determined”? A complete route connects S and Q, so their relation is determined.

Why not “S ≥ Q”? S ≥ Q points in the wrong direction; the decisive route establishes S < Q.

## 23. FILTER_IRRELEVANT_STATEMENTS — seed 2

**Record:** INE-CP002-2446B4B8 · **Difficulty:** MEDIUM · **Topology:** RELEVANT_CHAIN_PLUS_SIDE_BRANCH · **Explanation mode:** IRRELEVANT_EVIDENCE

Which relation between B and C is definitely established by the statements?

### Statements

- B ≥ A
- R > S
- R < B
- C < A

### Options

1. B < C
2. The relation cannot be determined
3. B ≤ C
4. B > C

**Correct:** B > C

### Explanation

Relevant route: B ≥ A and C < A.

The remaining clues — R < B and R > S — do not complete another route between B and C. The relevant route proves B > C.

Therefore, B > C is definitely established.

Why not “B < C”? B < C points in the wrong direction; the decisive route establishes B > C.

Why not “The relation cannot be determined”? A complete route connects B and C, so their relation is determined.

Why not “B ≤ C”? B ≤ C points in the wrong direction; the decisive route establishes B > C.

## 24. FILTER_IRRELEVANT_STATEMENTS — seed 3

**Record:** INE-CP002-C98765DB · **Difficulty:** MEDIUM · **Topology:** RELEVANT_CHAIN_PLUS_DISCONNECTED_CLUE · **Explanation mode:** IRRELEVANT_EVIDENCE

Which relation between Q and P is definitely established by the statements?

### Statements

- A < D
- P ≥ B
- Q < B

### Options

1. Q < P
2. The relation cannot be determined
3. Q > P
4. Q = P

**Correct:** Q < P

### Explanation

Relevant route: P ≥ B and Q < B.

The remaining clues — A < D — do not complete another route between Q and P. The relevant route proves Q < P.

Therefore, Q < P is definitely established.

Why not “The relation cannot be determined”? A complete route connects Q and P, so their relation is determined.

Why not “Q > P”? Q > P points in the wrong direction; the decisive route establishes Q < P.

Why not “Q = P”? The strict link on the decisive route makes equality impossible.

## 25. FILTER_IRRELEVANT_STATEMENTS — seed 4

**Record:** INE-CP002-2B916E2A · **Difficulty:** MEDIUM · **Topology:** RELEVANT_CHAIN_PLUS_SIDE_BRANCH · **Explanation mode:** IRRELEVANT_EVIDENCE

Which relation between B and A is definitely established by the statements?

### Statements

- P < D
- A < S
- B > D
- S ≤ B

### Options

1. The relation cannot be determined
2. B = A
3. B > A
4. B ≤ A

**Correct:** B > A

### Explanation

Relevant route: S ≤ B and A < S.

The remaining clues — B > D and P < D — do not complete another route between B and A. The relevant route proves B > A.

Therefore, B > A is definitely established.

Why not “The relation cannot be determined”? A complete route connects B and A, so their relation is determined.

Why not “B = A”? The strict link on the decisive route makes equality impossible.

Why not “B ≤ A”? B ≤ A points in the wrong direction; the decisive route establishes B > A.

## 26. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 0

**Record:** INE-CP002-65D3D470 · **Difficulty:** HARD · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- S ≥ A
- Q = B
- Q > A
- D > S

### Options

1. S and B
2. S and Q
3. D and Q
4. D and A

**Correct:** D and A

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

D and A: D > S and S ≥ A, so D > A.

Therefore, option 4 — D and A — is the only pair with a definite relation.

Why not “S and B”? S and B are on separate branches of one graph, with no directed path fixing their order.

Why not “S and Q”? S and Q are on separate branches of one graph, with no directed path fixing their order.

Why not “D and Q”? D and Q are on separate branches of one graph, with no directed path fixing their order.

## 27. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 1

**Record:** INE-CP002-0DE14213 · **Difficulty:** HARD · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- A > B
- A = R
- Q > C
- B ≤ C

### Options

1. C and A
2. B and Q
3. C and R
4. Q and A

**Correct:** B and Q

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

B and Q: Q > C and B ≤ C, so B < Q.

Therefore, option 2 — B and Q — is the only pair with a definite relation.

Why not “C and A”? C and A are on separate branches of one graph, with no directed path fixing their order.

Why not “C and R”? C and R are on separate branches of one graph, with no directed path fixing their order.

Why not “Q and A”? Q and A are on separate branches of one graph, with no directed path fixing their order.

## 28. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 2

**Record:** INE-CP002-E3BB68CE · **Difficulty:** HARD · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- C ≥ B
- R > C
- B < A
- A = D

### Options

1. C and A
2. R and A
3. D and A
4. C and D

**Correct:** D and A

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

D and A: , so D = A.

Therefore, option 3 — D and A — is the only pair with a definite relation.

Why not “C and A”? C and A are on separate branches of one graph, with no directed path fixing their order.

Why not “R and A”? R and A are on separate branches of one graph, with no directed path fixing their order.

Why not “C and D”? C and D are on separate branches of one graph, with no directed path fixing their order.

## 29. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 3

**Record:** INE-CP002-D7F8E429 · **Difficulty:** HARD · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- S < A
- A = Q
- S ≤ D
- P > D

### Options

1. D and S
2. D and Q
3. D and A
4. P and A

**Correct:** D and S

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

D and S: S ≤ D, so D ≥ S.

Therefore, option 1 — D and S — is the only pair with a definite relation.

Why not “D and Q”? D and Q are on separate branches of one graph, with no directed path fixing their order.

Why not “D and A”? D and A are on separate branches of one graph, with no directed path fixing their order.

Why not “P and A”? P and A are on separate branches of one graph, with no directed path fixing their order.

## 30. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 4

**Record:** INE-CP002-4E82D524 · **Difficulty:** HARD · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- A = C
- S < Q
- B ≤ S
- B < C

### Options

1. S and C
2. Q and C
3. B and S
4. S and A

**Correct:** B and S

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

B and S: B ≤ S, so B ≤ S.

Therefore, option 3 — B and S — is the only pair with a definite relation.

Why not “S and C”? S and C are on separate branches of one graph, with no directed path fixing their order.

Why not “Q and C”? Q and C are on separate branches of one graph, with no directed path fixing their order.

Why not “S and A”? S and A are on separate branches of one graph, with no directed path fixing their order.

## 31. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 0

**Record:** INE-CP002-FF243FB7 · **Difficulty:** HARD · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that cannot be determined from the statements?

### Statements

- P ≥ Q
- P < R
- Q = D
- D < A

### Options

1. D and P
2. R and D
3. R and Q
4. P and A

**Correct:** P and A

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

P and A are on separate branches of one graph, with no directed path fixing their order.

Therefore, option 4 — P and A — is the only pair whose relation is not determined.

Why not “D and P”? D and P: P ≥ Q, so D ≤ P.

Why not “R and D”? R and D: P < R and P ≥ Q, so R > D.

Why not “R and Q”? R and Q: P < R and P ≥ Q, so R > Q.

## 32. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 1

**Record:** INE-CP002-EFCA51E4 · **Difficulty:** HARD · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that cannot be determined from the statements?

### Statements

- A < S
- Q < R
- Q ≥ B
- B = A

### Options

1. R and A
2. A and Q
3. Q and S
4. R and B

**Correct:** Q and S

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

Q and S are on separate branches of one graph, with no directed path fixing their order.

Therefore, option 3 — Q and S — is the only pair whose relation is not determined.

Why not “R and A”? R and A: Q < R and Q ≥ B, so R > A.

Why not “A and Q”? A and Q: Q ≥ B, so A ≤ Q.

Why not “R and B”? R and B: Q < R and Q ≥ B, so R > B.

## 33. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 2

**Record:** INE-CP002-F06AD11D · **Difficulty:** HARD · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that cannot be determined from the statements?

### Statements

- Q = C
- P > Q
- S ≥ C
- A > S

### Options

1. S and P
2. A and Q
3. Q and S
4. A and C

**Correct:** S and P

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

S and P are on separate branches of one graph, with no directed path fixing their order.

Therefore, option 1 — S and P — is the only pair whose relation is not determined.

Why not “A and Q”? A and Q: A > S and S ≥ C, so A > Q.

Why not “Q and S”? Q and S: S ≥ C, so Q ≤ S.

Why not “A and C”? A and C: A > S and S ≥ C, so A > C.

## 34. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 3

**Record:** INE-CP002-EAE58842 · **Difficulty:** HARD · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that cannot be determined from the statements?

### Statements

- C < P
- Q = R
- B > Q
- R ≤ C

### Options

1. P and Q
2. C and B
3. P and R
4. Q and C

**Correct:** C and B

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

C and B are on separate branches of one graph, with no directed path fixing their order.

Therefore, option 2 — C and B — is the only pair whose relation is not determined.

Why not “P and Q”? P and Q: C < P and R ≤ C, so P > Q.

Why not “P and R”? P and R: C < P and R ≤ C, so P > R.

Why not “Q and C”? Q and C: R ≤ C, so Q ≤ C.

## 35. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 4

**Record:** INE-CP002-D57F6DD3 · **Difficulty:** HARD · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that cannot be determined from the statements?

### Statements

- A < B
- A ≥ R
- D > Q
- Q = R

### Options

1. A and D
2. B and Q
3. B and R
4. Q and A

**Correct:** A and D

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own.

A and D are on separate branches of one graph, with no directed path fixing their order.

Therefore, option 1 — A and D — is the only pair whose relation is not determined.

Why not “B and Q”? B and Q: A < B and A ≥ R, so B > Q.

Why not “B and R”? B and R: A < B and A ≥ R, so B > R.

Why not “Q and A”? Q and A: A ≥ R, so Q ≤ A.

## 36. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 0

**Record:** INE-CP002-6E34CEAC · **Difficulty:** MEDIUM · **Topology:** TWO_NONTRIVIAL_COMPONENTS · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between P and Q is definitely established by the statements?

### Statements

- R > P
- P ≥ D
- B > Q
- D < R

### Options

1. P ≥ Q
2. The relation cannot be determined
3. P = Q
4. P > Q

**Correct:** The relation cannot be determined

### Explanation

P and Q belong to two separate groups of statements.

Group containing P: R > P; P ≥ D; D < R.

Group containing Q: B > Q. No comparison joins the groups, so the order of P and Q is not fixed.

B=2, D=0, P=0, Q=1, R=1 satisfies every statement and gives P < Q.

B=1, D=0, P=0, Q=0, R=1 satisfies every statement and gives P = Q.

Because valid arrangements give different results, the relation between P and Q cannot be determined.

Why not “P ≥ Q”? The valid arrangements above give different orders for P and Q, so P ≥ Q is not guaranteed.

Why not “P = Q”? The valid arrangements above give different orders for P and Q, so P = Q is not guaranteed.

Why not “P > Q”? The valid arrangements above give different orders for P and Q, so P > Q is not guaranteed.

## 37. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 1

**Record:** INE-CP002-53F6EC9F · **Difficulty:** MEDIUM · **Topology:** TWO_NONTRIVIAL_COMPONENTS · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between D and A is definitely established by the statements?

### Statements

- A < R
- P < S
- D < S
- P ≤ D

### Options

1. The relation cannot be determined
2. D ≥ A
3. D > A
4. D = A

**Correct:** The relation cannot be determined

### Explanation

D and A belong to two separate groups of statements.

Group containing D: P < S; D < S; P ≤ D.

Group containing A: A < R. No comparison joins the groups, so the order of D and A is not fixed.

A=1, D=0, P=0, R=2, S=1 satisfies every statement and gives D < A.

A=0, D=0, P=0, R=1, S=1 satisfies every statement and gives D = A.

Because valid arrangements give different results, the relation between D and A cannot be determined.

Why not “D ≥ A”? The valid arrangements above give different orders for D and A, so D ≥ A is not guaranteed.

Why not “D > A”? The valid arrangements above give different orders for D and A, so D > A is not guaranteed.

Why not “D = A”? The valid arrangements above give different orders for D and A, so D = A is not guaranteed.

## 38. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 2

**Record:** INE-CP002-2907D60A · **Difficulty:** MEDIUM · **Topology:** TWO_NONTRIVIAL_COMPONENTS · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between R and P is definitely established by the statements?

### Statements

- R < D
- B < D
- R ≥ B
- C > P

### Options

1. R < P
2. R = P
3. The relation cannot be determined
4. R ≥ P

**Correct:** The relation cannot be determined

### Explanation

R and P belong to two separate groups of statements.

Group containing R: R < D; B < D; R ≥ B.

Group containing P: C > P. No comparison joins the groups, so the order of R and P is not fixed.

B=0, C=2, D=1, P=1, R=0 satisfies every statement and gives R < P.

B=0, C=1, D=1, P=0, R=0 satisfies every statement and gives R = P.

Because valid arrangements give different results, the relation between R and P cannot be determined.

Why not “R < P”? The valid arrangements above give different orders for R and P, so R < P is not guaranteed.

Why not “R = P”? The valid arrangements above give different orders for R and P, so R = P is not guaranteed.

Why not “R ≥ P”? The valid arrangements above give different orders for R and P, so R ≥ P is not guaranteed.

## 39. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 3

**Record:** INE-CP002-1D63FE25 · **Difficulty:** MEDIUM · **Topology:** TWO_NONTRIVIAL_COMPONENTS · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between D and B is definitely established by the statements?

### Statements

- C > A
- D ≥ A
- D < C
- Q > B

### Options

1. D < B
2. D > B
3. D = B
4. The relation cannot be determined

**Correct:** The relation cannot be determined

### Explanation

D and B belong to two separate groups of statements.

Group containing D: C > A; D ≥ A; D < C.

Group containing B: Q > B. No comparison joins the groups, so the order of D and B is not fixed.

A=0, B=1, C=1, D=0, Q=2 satisfies every statement and gives D < B.

A=0, B=0, C=1, D=0, Q=1 satisfies every statement and gives D = B.

Because valid arrangements give different results, the relation between D and B cannot be determined.

Why not “D < B”? The valid arrangements above give different orders for D and B, so D < B is not guaranteed.

Why not “D > B”? The valid arrangements above give different orders for D and B, so D > B is not guaranteed.

Why not “D = B”? The valid arrangements above give different orders for D and B, so D = B is not guaranteed.

## 40. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 4

**Record:** INE-CP002-11310D18 · **Difficulty:** MEDIUM · **Topology:** TWO_NONTRIVIAL_COMPONENTS · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between C and B is definitely established by the statements?

### Statements

- C ≥ R
- Q > B
- D > R
- C < D

### Options

1. C > B
2. The relation cannot be determined
3. C < B
4. C = B

**Correct:** The relation cannot be determined

### Explanation

C and B belong to two separate groups of statements.

Group containing C: C ≥ R; D > R; C < D.

Group containing B: Q > B. No comparison joins the groups, so the order of C and B is not fixed.

B=1, C=0, D=1, Q=2, R=0 satisfies every statement and gives C < B.

B=0, C=0, D=1, Q=1, R=0 satisfies every statement and gives C = B.

Because valid arrangements give different results, the relation between C and B cannot be determined.

Why not “C > B”? The valid arrangements above give different orders for C and B, so C > B is not guaranteed.

Why not “C < B”? The valid arrangements above give different orders for C and B, so C < B is not guaranteed.

Why not “C = B”? The valid arrangements above give different orders for C and B, so C = B is not guaranteed.

## 41. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 0

**Record:** INE-CP002-E45B3926 · **Difficulty:** MEDIUM · **Topology:** EQUALITY_HUB_AND_BRANCHES · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between B and P is definitely established by the statements?

### Statements

- S = P
- D < B
- B = S
- R ≤ P

### Options

1. B < P
2. B = P
3. B > P
4. The relation cannot be determined

**Correct:** B = P

### Explanation

Collapse the equality route first: B = S and S = P.

This places B and P in the same equality group. The other comparisons leave that group but cannot separate its members, so B = P.

Therefore, B = P is definitely established.

Why not “B < P”? The equality route proves B = P, so neither term can be strictly above the other.

Why not “B > P”? The equality route proves B = P, so neither term can be strictly above the other.

Why not “The relation cannot be determined”? The equality route fixes B and P exactly; their relation is known.

## 42. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 1

**Record:** INE-CP002-198E38E1 · **Difficulty:** MEDIUM · **Topology:** EQUALITY_HUB_AND_BRANCHES · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between Q and A is definitely established by the statements?

### Statements

- Q > R
- Q = C
- A = C
- A ≥ B

### Options

1. Q < A
2. The relation cannot be determined
3. Q = A
4. Q > A

**Correct:** Q = A

### Explanation

Collapse the equality route first: Q = C and A = C.

This places Q and A in the same equality group. The other comparisons leave that group but cannot separate its members, so Q = A.

Therefore, Q = A is definitely established.

Why not “Q < A”? The equality route proves Q = A, so neither term can be strictly above the other.

Why not “The relation cannot be determined”? The equality route fixes Q and A exactly; their relation is known.

Why not “Q > A”? The equality route proves Q = A, so neither term can be strictly above the other.

## 43. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 2

**Record:** INE-CP002-A9612EA8 · **Difficulty:** MEDIUM · **Topology:** EQUALITY_HUB_AND_BRANCHES · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between R and Q is definitely established by the statements?

### Statements

- D = R
- C ≤ Q
- Q = D
- S < R

### Options

1. R = Q
2. R < Q
3. R > Q
4. The relation cannot be determined

**Correct:** R = Q

### Explanation

Collapse the equality route first: D = R and Q = D.

This places R and Q in the same equality group. The other comparisons leave that group but cannot separate its members, so R = Q.

Therefore, R = Q is definitely established.

Why not “R < Q”? The equality route proves R = Q, so neither term can be strictly above the other.

Why not “R > Q”? The equality route proves R = Q, so neither term can be strictly above the other.

Why not “The relation cannot be determined”? The equality route fixes R and Q exactly; their relation is known.

## 44. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 3

**Record:** INE-CP002-91AB42CB · **Difficulty:** MEDIUM · **Topology:** EQUALITY_HUB_AND_BRANCHES · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between S and R is definitely established by the statements?

### Statements

- S > D
- S = B
- R = B
- R ≥ A

### Options

1. S > R
2. S < R
3. The relation cannot be determined
4. S = R

**Correct:** S = R

### Explanation

Collapse the equality route first: S = B and R = B.

This places S and R in the same equality group. The other comparisons leave that group but cannot separate its members, so S = R.

Therefore, S = R is definitely established.

Why not “S > R”? The equality route proves S = R, so neither term can be strictly above the other.

Why not “S < R”? The equality route proves S = R, so neither term can be strictly above the other.

Why not “The relation cannot be determined”? The equality route fixes S and R exactly; their relation is known.

## 45. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 4

**Record:** INE-CP002-C102EA9A · **Difficulty:** MEDIUM · **Topology:** EQUALITY_HUB_AND_BRANCHES · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between C and Q is definitely established by the statements?

### Statements

- D = Q
- D = C
- C > B
- A ≤ Q

### Options

1. C > Q
2. C = Q
3. The relation cannot be determined
4. C < Q

**Correct:** C = Q

### Explanation

Collapse the equality route first: D = C and D = Q.

This places C and Q in the same equality group. The other comparisons leave that group but cannot separate its members, so C = Q.

Therefore, C = Q is definitely established.

Why not “C > Q”? The equality route proves C = Q, so neither term can be strictly above the other.

Why not “The relation cannot be determined”? The equality route fixes C and Q exactly; their relation is known.

Why not “C < Q”? The equality route proves C = Q, so neither term can be strictly above the other.
