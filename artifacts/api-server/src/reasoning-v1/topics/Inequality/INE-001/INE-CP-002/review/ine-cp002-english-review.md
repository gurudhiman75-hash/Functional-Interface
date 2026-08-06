# INE-CP-002 English Prototype Review Pack

Prototype-only review material. Permanent QLs remain unallocated and Question Studio visibility remains disabled.

## 1. DETERMINE_LONG_CHAIN_RELATION — seed 0

**Record:** INE-CP002-293CD530 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** CHAIN_3_ENTITIES_INCLUSIVE · **Explanation mode:** LONG_CHAIN

Which relation between Q and C is definitely established by the statements?

### Statements

- B ≥ C
- B ≤ Q

### Options

1. Q = C
2. Q ≥ C
3. Q > C
4. The relation cannot be determined

**Correct:** Q ≥ C

### Explanation

Read the links as one chain: B ≤ Q and B ≥ C.

None of those links forces the end values apart. Equality is still possible, so the guaranteed relation is Q ≥ C.

Therefore, Q ≥ C is definitely established.

## 2. DETERMINE_LONG_CHAIN_RELATION — seed 1

**Record:** INE-CP002-43291FD3 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** CHAIN_3_ENTITIES_STRICT · **Explanation mode:** LONG_CHAIN

Which relation between Q and C is definitely established by the statements?

### Statements

- Q < B
- C ≥ B

### Options

1. The relation cannot be determined
2. Q = C
3. Q < C
4. Q ≥ C

**Correct:** Q < C

### Explanation

Read the links as one chain: C ≥ B and Q < B.

A strict link occurs on the route, so the two ends cannot be equal. This proves Q < C.

Therefore, Q < C is definitely established.

## 3. DETERMINE_LONG_CHAIN_RELATION — seed 2

**Record:** INE-CP002-4E6C2C8E · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** CHAIN_4_ENTITIES_WITH_EQUALITY · **Explanation mode:** LONG_CHAIN

Which relation between P and Q is definitely established by the statements?

### Statements

- P > B
- B = C
- Q ≤ C

### Options

1. P ≤ Q
2. The relation cannot be determined
3. P = Q
4. P > Q

**Correct:** P > Q

### Explanation

Read the links as one chain: P > B and B = C and Q ≤ C.

A strict link occurs on the route, so the two ends cannot be equal. This proves P > Q.

Therefore, P > Q is definitely established.

## 4. DETERMINE_LONG_CHAIN_RELATION — seed 3

**Record:** INE-CP002-3F4467E9 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** CHAIN_5_ENTITIES_INCLUSIVE_EQUALITY · **Explanation mode:** LONG_CHAIN

Which relation between D and B is definitely established by the statements?

### Statements

- S ≥ Q
- B ≥ S
- Q = R
- D ≤ R

### Options

1. D ≤ B
2. D > B
3. The relation cannot be determined
4. D = B

**Correct:** D ≤ B

### Explanation

Read the links as one chain: B ≥ S and S ≥ Q and Q = R and D ≤ R.

None of those links forces the end values apart. Equality is still possible, so the guaranteed relation is D ≤ B.

Therefore, D ≤ B is definitely established.

## 5. DETERMINE_LONG_CHAIN_RELATION — seed 4

**Record:** INE-CP002-5D7403E4 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** CHAIN_5_ENTITIES_LATE_STRICT · **Explanation mode:** LONG_CHAIN

Which relation between P and D is definitely established by the statements?

### Statements

- R ≤ B
- D < A
- B ≤ P
- R ≥ A

### Options

1. The relation cannot be determined
2. P ≤ D
3. P > D
4. P < D

**Correct:** P > D

### Explanation

Read the links as one chain: B ≤ P and R ≤ B and R ≥ A and D < A.

A strict link occurs on the route, so the two ends cannot be equal. This proves P > D.

Therefore, P > D is definitely established.

## 6. DETERMINE_MULTI_ROUTE_RELATION — seed 0

**Record:** INE-CP002-6E133C6B · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** DIRECT_PLUS_TWO_EDGE_ROUTE · **Explanation mode:** MULTIPLE_ROUTES

Which relation between B and R is definitely established by the statements?

### Statements

- B > R
- C > R
- C ≤ B

### Options

1. B > R
2. B ≤ R
3. B < R
4. B = R

**Correct:** B > R

### Explanation

Two separate routes connect B and R.

Route 1: B > R — this gives B > R.

Route 2: C ≤ B and C > R — this independently gives the same result.

Therefore, B > R is definitely established.

## 7. DETERMINE_MULTI_ROUTE_RELATION — seed 1

**Record:** INE-CP002-C443CD48 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** DIAMOND_TWO_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

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

## 8. DETERMINE_MULTI_ROUTE_RELATION — seed 2

**Record:** INE-CP002-80970D01 · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Topology:** TWO_AND_THREE_EDGE_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

Which relation between S and D is definitely established by the statements?

### Statements

- A ≤ S
- A > R
- C ≥ D
- S > C
- R ≥ D

### Options

1. S ≤ D
2. S < D
3. S > D
4. S = D

**Correct:** S > D

### Explanation

Two separate routes connect S and D.

Route 1: S > C and C ≥ D — this gives S > D.

Route 2: A ≤ S and A > R and R ≥ D — this independently gives the same result.

Therefore, S > D is definitely established.

## 9. DETERMINE_MULTI_ROUTE_RELATION — seed 3

**Record:** INE-CP002-77E746C6 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** INCLUSIVE_DIAMOND_WITH_EQUALITY · **Explanation mode:** MULTIPLE_ROUTES

Which relation between P and D is definitely established by the statements?

### Statements

- R = D
- D ≤ C
- P ≥ R
- P ≥ C

### Options

1. P < D
2. The relation cannot be determined
3. P = D
4. P ≥ D

**Correct:** P ≥ D

### Explanation

Two separate routes connect P and D.

Route 1: P ≥ R and R = D — this gives P ≥ D.

Route 2: P ≥ C and D ≤ C — this independently gives the same result.

Therefore, P ≥ D is definitely established.

## 10. DETERMINE_MULTI_ROUTE_RELATION — seed 4

**Record:** INE-CP002-18DC090F · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Topology:** TWO_ROUTES_WITH_CROSS_LINK · **Explanation mode:** MULTIPLE_ROUTES

Which relation between P and A is definitely established by the statements?

### Statements

- R > A
- P ≥ R
- A ≤ B
- Q < P
- R < Q
- B ≤ Q

### Options

1. The relation cannot be determined
2. P < A
3. P = A
4. P > A

**Correct:** P > A

### Explanation

Two separate routes connect P and A.

Route 1: Q < P and B ≤ Q and A ≤ B — this gives P > A.

Route 2: P ≥ R and R > A — this independently gives the same result.

Therefore, P > A is definitely established.

## 11. APPLY_ALTERNATE_PATH_STRICTNESS — seed 0

**Record:** INE-CP002-FE96204A · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

## 12. APPLY_ALTERNATE_PATH_STRICTNESS — seed 1

**Record:** INE-CP002-FC342A65 · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

## 13. APPLY_ALTERNATE_PATH_STRICTNESS — seed 2

**Record:** INE-CP002-4D04FAEC · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

## 14. APPLY_ALTERNATE_PATH_STRICTNESS — seed 3

**Record:** INE-CP002-55B887DF · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

## 15. APPLY_ALTERNATE_PATH_STRICTNESS — seed 4

**Record:** INE-CP002-15F6AF56 · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

## 16. DETERMINE_BRANCHED_GRAPH_RELATION — seed 0

**Record:** INE-CP002-34FE440A · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** BRANCHES_COMMON_UPPER_ONLY · **Explanation mode:** BRANCHED_GRAPH

Which relation between A and B is definitely established by the statements?

### Statements

- S > A
- S ≥ B
- Q < A

### Options

1. A ≥ B
2. A < B
3. The relation cannot be determined
4. A = B

**Correct:** The relation cannot be determined

### Explanation

A and B sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of A and B is not fixed.

A=1, B=2, Q=0, S=2 satisfies every statement and gives A < B.

A=1, B=1, Q=0, S=2 satisfies every statement and gives A = B.

Because valid arrangements give different results, the relation between A and B cannot be determined.

## 17. DETERMINE_BRANCHED_GRAPH_RELATION — seed 1

**Record:** INE-CP002-295A6C25 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** BRANCHES_COMMON_LOWER_ONLY · **Explanation mode:** BRANCHED_GRAPH

Which relation between B and A is definitely established by the statements?

### Statements

- B > Q
- R > B
- Q ≤ A

### Options

1. B = A
2. B < A
3. B > A
4. The relation cannot be determined

**Correct:** The relation cannot be determined

### Explanation

B and A sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of B and A is not fixed.

A=2, B=1, Q=0, R=2 satisfies every statement and gives B < A.

A=1, B=1, Q=0, R=2 satisfies every statement and gives B = A.

Because valid arrangements give different results, the relation between B and A cannot be determined.

## 18. DETERMINE_BRANCHED_GRAPH_RELATION — seed 2

**Record:** INE-CP002-7A2B3CAC · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** UPPER_AND_LOWER_SHARED_BOUNDS · **Explanation mode:** BRANCHED_GRAPH

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

## 19. DETERMINE_BRANCHED_GRAPH_RELATION — seed 3

**Record:** INE-CP002-5FED5A9F · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** ASYMMETRIC_BRANCH_DEPTH · **Explanation mode:** BRANCHED_GRAPH

Which relation between P and Q is definitely established by the statements?

### Statements

- P ≤ C
- C < R
- Q < R

### Options

1. The relation cannot be determined
2. P > Q
3. P = Q
4. P ≥ Q

**Correct:** The relation cannot be determined

### Explanation

P and Q sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of P and Q is not fixed.

C=0, P=0, Q=1, R=2 satisfies every statement and gives P < Q.

C=0, P=0, Q=0, R=1 satisfies every statement and gives P = Q.

Because valid arrangements give different results, the relation between P and Q cannot be determined.

## 20. DETERMINE_BRANCHED_GRAPH_RELATION — seed 4

**Record:** INE-CP002-26FFEE16 · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Topology:** BRANCH_WITH_EQUALITY_DEPTH · **Explanation mode:** BRANCHED_GRAPH

Which relation between C and P is definitely established by the statements?

### Statements

- B = C
- B ≥ Q
- P < R
- P > Q
- C < R

### Options

1. The relation cannot be determined
2. C < P
3. C ≥ P
4. C > P

**Correct:** The relation cannot be determined

### Explanation

C and P sit on different branches of the same connected graph.

The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of C and P is not fixed.

B=0, C=0, P=1, Q=0, R=2 satisfies every statement and gives C < P.

B=1, C=1, P=1, Q=0, R=2 satisfies every statement and gives C = P.

Because valid arrangements give different results, the relation between C and P cannot be determined.

## 21. FILTER_IRRELEVANT_STATEMENTS — seed 0

**Record:** INE-CP002-F7B6A136 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** RELEVANT_CHAIN_PLUS_SIDE_BRANCH · **Explanation mode:** IRRELEVANT_EVIDENCE

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

## 22. FILTER_IRRELEVANT_STATEMENTS — seed 1

**Record:** INE-CP002-184147B1 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** RELEVANT_CHAIN_PLUS_DISCONNECTED_CLUE · **Explanation mode:** IRRELEVANT_EVIDENCE

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

## 23. FILTER_IRRELEVANT_STATEMENTS — seed 2

**Record:** INE-CP002-2446B4B8 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** RELEVANT_CHAIN_PLUS_SIDE_BRANCH · **Explanation mode:** IRRELEVANT_EVIDENCE

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

## 24. FILTER_IRRELEVANT_STATEMENTS — seed 3

**Record:** INE-CP002-C98765DB · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** RELEVANT_CHAIN_PLUS_DISCONNECTED_CLUE · **Explanation mode:** IRRELEVANT_EVIDENCE

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

## 25. FILTER_IRRELEVANT_STATEMENTS — seed 4

**Record:** INE-CP002-2B916E2A · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** RELEVANT_CHAIN_PLUS_SIDE_BRANCH · **Explanation mode:** IRRELEVANT_EVIDENCE

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

## 26. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 0

**Record:** INE-CP002-65D3D470 · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: S and B are on separate branches of one graph, with no directed path fixing their order.

Pair check: S and Q are on separate branches of one graph, with no directed path fixing their order.

Pair check: D and Q are on separate branches of one graph, with no directed path fixing their order.

## 27. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 1

**Record:** INE-CP002-0DE14213 · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: C and A are on separate branches of one graph, with no directed path fixing their order.

Pair check: C and R are on separate branches of one graph, with no directed path fixing their order.

Pair check: Q and A are on separate branches of one graph, with no directed path fixing their order.

## 28. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 2

**Record:** INE-CP002-E3BB68CE · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: C and A are on separate branches of one graph, with no directed path fixing their order.

Pair check: R and A are on separate branches of one graph, with no directed path fixing their order.

Pair check: C and D are on separate branches of one graph, with no directed path fixing their order.

## 29. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 3

**Record:** INE-CP002-D7F8E429 · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: D and Q are on separate branches of one graph, with no directed path fixing their order.

Pair check: D and A are on separate branches of one graph, with no directed path fixing their order.

Pair check: P and A are on separate branches of one graph, with no directed path fixing their order.

## 30. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 4

**Record:** INE-CP002-4E82D524 · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** BRANCH_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: S and C are on separate branches of one graph, with no directed path fixing their order.

Pair check: Q and C are on separate branches of one graph, with no directed path fixing their order.

Pair check: S and A are on separate branches of one graph, with no directed path fixing their order.

## 31. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 0

**Record:** INE-CP002-FF243FB7 · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: D and P: P ≥ Q, so D ≤ P.

Pair check: R and D: P < R and P ≥ Q, so R > D.

Pair check: R and Q: P < R and P ≥ Q, so R > Q.

## 32. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 1

**Record:** INE-CP002-EFCA51E4 · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: R and A: Q < R and Q ≥ B, so R > A.

Pair check: A and Q: Q ≥ B, so A ≤ Q.

Pair check: R and B: Q < R and Q ≥ B, so R > B.

## 33. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 2

**Record:** INE-CP002-F06AD11D · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: A and Q: A > S and S ≥ C, so A > Q.

Pair check: Q and S: S ≥ C, so Q ≤ S.

Pair check: A and C: A > S and S ≥ C, so A > C.

## 34. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 3

**Record:** INE-CP002-EAE58842 · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: P and Q: C < P and R ≤ C, so P > Q.

Pair check: P and R: C < P and R ≤ C, so P > R.

Pair check: Q and C: R ≤ C, so Q ≤ C.

## 35. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 4

**Record:** INE-CP002-D57F6DD3 · **Difficulty:** HARD (PAIR_AUDIT) · **Topology:** CHAIN_PLUS_DISCONNECTED_EQUALITY · **Explanation mode:** PAIR_SELECTION

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

Pair check: B and Q: A < B and A ≥ R, so B > Q.

Pair check: B and R: A < B and A ≥ R, so B > R.

Pair check: Q and A: A ≥ R, so Q ≤ A.

## 36. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 0

**Record:** INE-CP002-6E34CEAC · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** DISCONNECTED_TWO_EDGES · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between Q and A is definitely established by the statements?

### Statements

- P > Q
- D > A

### Options

1. Q < A
2. The relation cannot be determined
3. Q = A
4. Q > A

**Correct:** The relation cannot be determined

### Explanation

Q and A belong to two separate groups of statements.

Group containing Q: P > Q.

Group containing A: D > A. No comparison joins the groups, so the order of Q and A is not fixed.

A=1, D=2, P=1, Q=0 satisfies every statement and gives Q < A.

A=0, D=1, P=1, Q=0 satisfies every statement and gives Q = A.

Because valid arrangements give different results, the relation between Q and A cannot be determined.

## 37. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 1

**Record:** INE-CP002-53F6EC9F · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** DISCONNECTED_CHAIN_PLUS_EDGE · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between D and C is definitely established by the statements?

### Statements

- C < A
- D < R
- Q ≤ D

### Options

1. The relation cannot be determined
2. D > C
3. D < C
4. D = C

**Correct:** The relation cannot be determined

### Explanation

D and C belong to two separate groups of statements.

Group containing D: D < R; Q ≤ D.

Group containing C: C < A. No comparison joins the groups, so the order of D and C is not fixed.

A=2, C=1, D=0, Q=0, R=1 satisfies every statement and gives D < C.

A=1, C=0, D=0, Q=0, R=1 satisfies every statement and gives D = C.

Because valid arrangements give different results, the relation between D and C cannot be determined.

## 38. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 2

**Record:** INE-CP002-2907D60A · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** DISCONNECTED_EQUALITY_PLUS_CHAIN · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between Q and D is definitely established by the statements?

### Statements

- D > A
- C = Q
- B > D

### Options

1. Q = D
2. Q ≥ D
3. The relation cannot be determined
4. Q < D

**Correct:** The relation cannot be determined

### Explanation

Q and D belong to two separate groups of statements.

Group containing Q: C = Q.

Group containing D: D > A; B > D. No comparison joins the groups, so the order of Q and D is not fixed.

A=0, B=2, C=0, D=1, Q=0 satisfies every statement and gives Q < D.

A=0, B=2, C=1, D=1, Q=1 satisfies every statement and gives Q = D.

Because valid arrangements give different results, the relation between Q and D cannot be determined.

## 39. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 3

**Record:** INE-CP002-1D63FE25 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** DISCONNECTED_BRANCH_PLUS_EDGE · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between A and Q is definitely established by the statements?

### Statements

- C > P
- A < C
- B ≥ Q

### Options

1. A > Q
2. A < Q
3. A ≥ Q
4. The relation cannot be determined

**Correct:** The relation cannot be determined

### Explanation

A and Q belong to two separate groups of statements.

Group containing A: C > P; A < C.

Group containing Q: B ≥ Q. No comparison joins the groups, so the order of A and Q is not fixed.

A=0, B=1, C=1, P=0, Q=1 satisfies every statement and gives A < Q.

A=0, B=0, C=1, P=0, Q=0 satisfies every statement and gives A = Q.

Because valid arrangements give different results, the relation between A and Q cannot be determined.

## 40. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 4

**Record:** INE-CP002-11310D18 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** DISCONNECTED_EQUALITY_CHAIN_PLUS_EDGE · **Explanation mode:** DISCONNECTED_COMPONENTS

Which relation between P and D is definitely established by the statements?

### Statements

- P = B
- Q > D
- P = S

### Options

1. P < D
2. The relation cannot be determined
3. P = D
4. P ≥ D

**Correct:** The relation cannot be determined

### Explanation

P and D belong to two separate groups of statements.

Group containing P: P = B; P = S.

Group containing D: Q > D. No comparison joins the groups, so the order of P and D is not fixed.

B=0, D=1, P=0, Q=2, S=0 satisfies every statement and gives P < D.

B=0, D=0, P=0, Q=1, S=0 satisfies every statement and gives P = D.

Because valid arrangements give different results, the relation between P and D cannot be determined.

## 41. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 0

**Record:** INE-CP002-E45B3926 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** DIRECT_EQUALITY_ONE_BRANCH · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between C and Q is definitely established by the statements?

### Statements

- C = Q
- C > D

### Options

1. The relation cannot be determined
2. C = Q
3. C > Q
4. C < Q

**Correct:** C = Q

### Explanation

Collapse the equality route first: C = Q.

This places C and Q in the same equality group. The other comparisons leave that group but cannot separate its members, so C = Q.

Therefore, C = Q is definitely established.

## 42. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 1

**Record:** INE-CP002-198E38E1 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Topology:** EQUALITY_CHAIN_ONE_BRANCH · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between C and Q is definitely established by the statements?

### Statements

- C = S
- Q = S
- Q ≥ B

### Options

1. C > Q
2. C < Q
3. C = Q
4. The relation cannot be determined

**Correct:** C = Q

### Explanation

Collapse the equality route first: C = S and Q = S.

This places C and Q in the same equality group. The other comparisons leave that group but cannot separate its members, so C = Q.

Therefore, C = Q is definitely established.

## 43. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 2

**Record:** INE-CP002-A9612EA8 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** EQUALITY_HUB_AND_BRANCHES · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

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

## 44. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 3

**Record:** INE-CP002-91AB42CB · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** LONG_EQUALITY_COMPONENT_SHARED_LOWER · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between B and D is definitely established by the statements?

### Statements

- S > P
- R = B
- S = B
- R = D
- D ≥ P

### Options

1. B < D
2. The relation cannot be determined
3. B > D
4. B = D

**Correct:** B = D

### Explanation

Collapse the equality route first: R = B and R = D.

This places B and D in the same equality group. The other comparisons leave that group but cannot separate its members, so B = D.

Therefore, B = D is definitely established.

## 45. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 4

**Record:** INE-CP002-C102EA9A · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Topology:** EQUALITY_STAR_SPLIT_BRANCHES · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

Which relation between C and Q is definitely established by the statements?

### Statements

- D = Q
- C = D
- C > B
- A ≤ Q

### Options

1. C < Q
2. C = Q
3. The relation cannot be determined
4. C > Q

**Correct:** C = Q

### Explanation

Collapse the equality route first: C = D and D = Q.

This places C and Q in the same equality group. The other comparisons leave that group but cannot separate its members, so C = Q.

Therefore, C = Q is definitely established.
