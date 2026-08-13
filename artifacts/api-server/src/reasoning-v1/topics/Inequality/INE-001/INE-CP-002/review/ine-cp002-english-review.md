# INE-CP-002 English Prototype Review Pack

Prototype-only review material. Permanent QLs remain unallocated and Question Studio visibility remains disabled.

## 1. DETERMINE_LONG_CHAIN_RELATION — seed 0

**Record:** INE-CP002-293CD530 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** CHAIN_3_ENTITIES_INCLUSIVE · **Explanation mode:** LONG_CHAIN

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

Read the links as one chain: B ≤ Q and B ≥ C. None of those links forces the end values apart. Equality is still possible, so the guaranteed relation is Q ≥ C. Therefore, Q ≥ C is definitely established.

## 2. DETERMINE_LONG_CHAIN_RELATION — seed 1

**Record:** INE-CP002-43291FD3 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** CHAIN_3_ENTITIES_STRICT · **Explanation mode:** LONG_CHAIN

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

Read the links as one chain: C ≥ B and Q < B. A strict link occurs on the route, so the two ends cannot be equal. This proves Q < C. Therefore, Q < C is definitely established.

## 3. DETERMINE_LONG_CHAIN_RELATION — seed 2

**Record:** INE-CP002-4E6C2C8E · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** CHAIN_4_ENTITIES_WITH_EQUALITY · **Explanation mode:** LONG_CHAIN

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

Read the links as one chain: P > B and B = C and Q ≤ C. A strict link occurs on the route, so the two ends cannot be equal. This proves P > Q. Therefore, P > Q is definitely established.

## 4. DETERMINE_LONG_CHAIN_RELATION — seed 3

**Record:** INE-CP002-3F4467E9 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** CHAIN_5_ENTITIES_INCLUSIVE_EQUALITY · **Explanation mode:** LONG_CHAIN

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

Read the links as one chain: B ≥ S and S ≥ Q and Q = R and D ≤ R. None of those links forces the end values apart. Equality is still possible, so the guaranteed relation is D ≤ B. Therefore, D ≤ B is definitely established.

## 5. DETERMINE_MULTI_ROUTE_RELATION — seed 0

**Record:** INE-CP002-6E133C6B · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** INDIRECT_DIAMOND_TWO_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

Which relation between R and A is definitely established by the statements?

### Statements

- R ≥ C
- R > S
- S ≥ A
- A < C

### Options

1. R > A
2. R = A
3. R < A
4. R ≤ A

**Correct:** R > A

### Explanation

Two separate routes connect R and A. Route 1: R ≥ C and A < C — this gives R > A. Route 2: R > S and S ≥ A — this independently gives the same result. Therefore, R > A is definitely established.

## 6. DETERMINE_MULTI_ROUTE_RELATION — seed 1

**Record:** INE-CP002-C443CD48 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** DIAMOND_TWO_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

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

Two separate routes connect S and R. Route 1: R > Q and Q ≥ S — this gives S < R. Route 2: C ≤ R and C > S — this independently gives the same result. Therefore, S < R is definitely established.

## 7. DETERMINE_MULTI_ROUTE_RELATION — seed 2

**Record:** INE-CP002-80970D01 · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Release tier:** ADVANCED_PRACTICE · **Topology:** TWO_AND_THREE_EDGE_ROUTES · **Explanation mode:** MULTIPLE_ROUTES

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

Two separate routes connect S and D. Route 1: S > C and C ≥ D — this gives S > D. Route 2: A ≤ S and A > R and R ≥ D — this independently gives the same result. Therefore, S > D is definitely established.

## 8. DETERMINE_MULTI_ROUTE_RELATION — seed 3

**Record:** INE-CP002-77E746C6 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** INCLUSIVE_DIAMOND_WITH_EQUALITY · **Explanation mode:** MULTIPLE_ROUTES

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

Two separate routes connect P and D. Route 1: P ≥ R and R = D — this gives P ≥ D. Route 2: P ≥ C and D ≤ C — this independently gives the same result. Therefore, P ≥ D is definitely established.

## 9. APPLY_ALTERNATE_PATH_STRICTNESS — seed 0

**Record:** INE-CP002-FE96204A · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Release tier:** ADVANCED_PRACTICE · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

Compare the two available routes from A to Q. Direct route: Q ≤ A — this is only inclusive. Alternate route: C ≤ A and C > B and B ≥ Q — its strict link rules out equality, proving A > Q. Therefore, A > Q is definitely established.

## 10. APPLY_ALTERNATE_PATH_STRICTNESS — seed 1

**Record:** INE-CP002-FC342A65 · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Release tier:** ADVANCED_PRACTICE · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

Compare the two available routes from P to S. Direct route: S ≥ P — this is only inclusive. Alternate route: C ≤ S and A < C and P ≤ A — its strict link rules out equality, proving P < S. Therefore, P < S is definitely established.

## 11. APPLY_ALTERNATE_PATH_STRICTNESS — seed 2

**Record:** INE-CP002-4D04FAEC · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Release tier:** ADVANCED_PRACTICE · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

Compare the two available routes from B to S. Direct route: S ≤ B — this is only inclusive. Alternate route: R ≤ B and R > Q and Q ≥ S — its strict link rules out equality, proving B > S. Therefore, B > S is definitely established.

## 12. APPLY_ALTERNATE_PATH_STRICTNESS — seed 3

**Record:** INE-CP002-55B887DF · **Difficulty:** HARD (ADVANCED_GRAPH_REASONING) · **Release tier:** ADVANCED_PRACTICE · **Topology:** DIRECT_PLUS_LONG_ALTERNATE · **Explanation mode:** ALTERNATE_STRICT_PATH

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

Compare the two available routes from A to D. Direct route: D ≥ A — this is only inclusive. Alternate route: R ≤ D and Q < R and Q ≥ A — its strict link rules out equality, proving A < D. Therefore, A < D is definitely established.

## 13. DETERMINE_BRANCHED_GRAPH_RELATION — seed 0

**Record:** INE-CP002-34FE440A · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** BRANCHES_COMMON_UPPER_ONLY · **Explanation mode:** BRANCHED_GRAPH

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

A and B sit on different branches of the same connected graph. The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of A and B is not fixed. Because valid arrangements give different results, the relation between A and B cannot be determined.

## 14. DETERMINE_BRANCHED_GRAPH_RELATION — seed 1

**Record:** INE-CP002-295A6C25 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** BRANCHES_COMMON_LOWER_ONLY · **Explanation mode:** BRANCHED_GRAPH

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

B and A sit on different branches of the same connected graph. The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of B and A is not fixed. Because valid arrangements give different results, the relation between B and A cannot be determined.

## 15. DETERMINE_BRANCHED_GRAPH_RELATION — seed 2

**Record:** INE-CP002-7A2B3CAC · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** UPPER_AND_LOWER_SHARED_BOUNDS · **Explanation mode:** BRANCHED_GRAPH

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

S and D sit on different branches of the same connected graph. The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of S and D is not fixed. Because valid arrangements give different results, the relation between S and D cannot be determined.

## 16. DETERMINE_BRANCHED_GRAPH_RELATION — seed 3

**Record:** INE-CP002-5FED5A9F · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** ASYMMETRIC_BRANCH_DEPTH · **Explanation mode:** BRANCHED_GRAPH

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

P and Q sit on different branches of the same connected graph. The branches share other terms, but neither branch provides a directed comparison path to the other. Therefore, the order of P and Q is not fixed. Because valid arrangements give different results, the relation between P and Q cannot be determined.

## 17. FILTER_IRRELEVANT_STATEMENTS — seed 0

**Record:** INE-CP002-F7B6A136 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** RELEVANT_CHAIN_PLUS_SIDE_BRANCH · **Explanation mode:** IRRELEVANT_EVIDENCE

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

Relevant route: B ≤ R and B > C. The remaining clues — Q < R and S < Q — do not complete another route between R and C. The relevant route proves R > C. Therefore, R > C is definitely established.

## 18. FILTER_IRRELEVANT_STATEMENTS — seed 1

**Record:** INE-CP002-184147B1 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** RELEVANT_CHAIN_PLUS_DISCONNECTED_CLUE · **Explanation mode:** IRRELEVANT_EVIDENCE

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

Relevant route: Q ≥ D and S < D. The remaining clues — A > R — do not complete another route between S and Q. The relevant route proves S < Q. Therefore, S < Q is definitely established.

## 19. FILTER_IRRELEVANT_STATEMENTS — seed 2

**Record:** INE-CP002-2446B4B8 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** RELEVANT_CHAIN_PLUS_SIDE_BRANCH · **Explanation mode:** IRRELEVANT_EVIDENCE

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

Relevant route: B ≥ A and C < A. The remaining clues — R < B and R > S — do not complete another route between B and C. The relevant route proves B > C. Therefore, B > C is definitely established.

## 20. FILTER_IRRELEVANT_STATEMENTS — seed 3

**Record:** INE-CP002-C98765DB · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** RELEVANT_CHAIN_PLUS_DISCONNECTED_CLUE · **Explanation mode:** IRRELEVANT_EVIDENCE

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

Relevant route: P ≥ B and Q < B. The remaining clues — A < D — do not complete another route between Q and P. The relevant route proves Q < P. Therefore, Q < P is definitely established.

## 21. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 0

**Record:** INE-CP002-65D3D470 · **Difficulty:** HARD (PAIR_AUDIT) · **Release tier:** ADVANCED_PRACTICE · **Topology:** PAIR_AUDIT_CONNECTED_BRANCHES_MULTI_STEP · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- S ≥ A
- Q = B
- Q > A
- D > S

### Options

1. S and Q
2. D and Q
3. S and B
4. D and A

**Correct:** D and A

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own. D and A: D > S and S ≥ A, so D > A. Therefore, option 4 — D and A — is the only pair with a definite relation.

## 22. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 1

**Record:** INE-CP002-0DE14213 · **Difficulty:** HARD (PAIR_AUDIT) · **Release tier:** ADVANCED_PRACTICE · **Topology:** PAIR_AUDIT_CONNECTED_BRANCHES_MULTI_STEP · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- A > B
- A = R
- Q > C
- B ≤ C

### Options

1. Q and A
2. B and Q
3. C and A
4. C and R

**Correct:** B and Q

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own. B and Q: Q > C and B ≤ C, so B < Q. Therefore, option 2 — B and Q — is the only pair with a definite relation.

## 23. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 2

**Record:** INE-CP002-E3BB68CE · **Difficulty:** HARD (PAIR_AUDIT) · **Release tier:** ADVANCED_PRACTICE · **Topology:** PAIR_AUDIT_EQUALITY_CHAIN_WITH_DISCONNECTED_EDGE · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- R = B
- B = A
- Q < S

### Options

1. B and Q
2. R and S
3. R and A
4. A and S

**Correct:** R and A

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own. R and A: R = B and B = A, so R = A. Therefore, option 3 — R and A — is the only pair with a definite relation.

## 24. IDENTIFY_PAIR_WITH_DEFINITE_RELATION — seed 3

**Record:** INE-CP002-D7F8E429 · **Difficulty:** HARD (PAIR_AUDIT) · **Release tier:** ADVANCED_PRACTICE · **Topology:** PAIR_AUDIT_CONNECTED_BRANCHES_MULTI_STEP · **Explanation mode:** PAIR_SELECTION

Which pair has a relation that is completely determined by the statements?

### Statements

- S < A
- A = Q
- S ≤ D
- P ≥ D

### Options

1. P and S
2. D and Q
3. P and A
4. D and A

**Correct:** P and S

### Explanation

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own. P and S: P ≥ D and S ≤ D, so P ≥ S. Therefore, option 1 — P and S — is the only pair with a definite relation.

## 25. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 0

**Record:** INE-CP002-FF243FB7 · **Difficulty:** HARD (PAIR_AUDIT) · **Release tier:** ADVANCED_PRACTICE · **Topology:** PAIR_AUDIT_CONNECTED_GRAPH_SINGLE_UNKNOWN · **Explanation mode:** PAIR_SELECTION

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

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own. P and A are on separate branches of one graph, with no directed path fixing their order. Therefore, option 4 — P and A — is the only pair whose relation is not determined.

## 26. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 1

**Record:** INE-CP002-EFCA51E4 · **Difficulty:** HARD (PAIR_AUDIT) · **Release tier:** ADVANCED_PRACTICE · **Topology:** PAIR_AUDIT_CONNECTED_GRAPH_SINGLE_UNKNOWN · **Explanation mode:** PAIR_SELECTION

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

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own. Q and S are on separate branches of one graph, with no directed path fixing their order. Therefore, option 3 — Q and S — is the only pair whose relation is not determined.

## 27. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 2

**Record:** INE-CP002-F06AD11D · **Difficulty:** HARD (PAIR_AUDIT) · **Release tier:** ADVANCED_PRACTICE · **Topology:** PAIR_AUDIT_CONNECTED_GRAPH_SINGLE_UNKNOWN · **Explanation mode:** PAIR_SELECTION

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

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own. S and P are on separate branches of one graph, with no directed path fixing their order. Therefore, option 1 — S and P — is the only pair whose relation is not determined.

## 28. IDENTIFY_PAIR_WITHOUT_DEFINITE_RELATION — seed 3

**Record:** INE-CP002-EAE58842 · **Difficulty:** HARD (PAIR_AUDIT) · **Release tier:** ADVANCED_PRACTICE · **Topology:** PAIR_AUDIT_CONNECTED_GRAPH_SINGLE_UNKNOWN · **Explanation mode:** PAIR_SELECTION

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

Check each pair by tracing an actual comparison path. A shared name or nearby branch is not enough on its own. C and B are on separate branches of one graph, with no directed path fixing their order. Therefore, option 2 — C and B — is the only pair whose relation is not determined.

## 29. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 0

**Record:** INE-CP002-6E34CEAC · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** DISCONNECTED_TWO_EDGES · **Explanation mode:** DISCONNECTED_COMPONENTS

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

Q and A belong to two separate groups of statements. Group containing Q: P > Q. Group containing A: D > A. No comparison joins the groups, so the order of Q and A is not fixed. Because valid arrangements give different results, the relation between Q and A cannot be determined.

## 30. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 1

**Record:** INE-CP002-53F6EC9F · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** DISCONNECTED_CHAIN_PLUS_EDGE · **Explanation mode:** DISCONNECTED_COMPONENTS

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

D and C belong to two separate groups of statements. Group containing D: D < R; Q ≤ D. Group containing C: C < A. No comparison joins the groups, so the order of D and C is not fixed. Because valid arrangements give different results, the relation between D and C cannot be determined.

## 31. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 2

**Record:** INE-CP002-2907D60A · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** DISCONNECTED_EQUALITY_PLUS_CHAIN · **Explanation mode:** DISCONNECTED_COMPONENTS

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

Q and D belong to two separate groups of statements. Group containing Q: C = Q. Group containing D: D > A; B > D. No comparison joins the groups, so the order of Q and D is not fixed. Because valid arrangements give different results, the relation between Q and D cannot be determined.

## 32. DETERMINE_DISCONNECTED_PAIR_RELATION — seed 3

**Record:** INE-CP002-1D63FE25 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** DISCONNECTED_BRANCH_PLUS_EDGE · **Explanation mode:** DISCONNECTED_COMPONENTS

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

A and Q belong to two separate groups of statements. Group containing A: C > P; A < C. Group containing Q: B ≥ Q. No comparison joins the groups, so the order of A and Q is not fixed. Because valid arrangements give different results, the relation between A and Q cannot be determined.

## 33. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 0

**Record:** INE-CP002-E45B3926 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** DIRECT_EQUALITY_ONE_BRANCH · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

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

Collapse the equality route first: C = Q. This places C and Q in the same equality group. The other comparisons leave that group but cannot separate its members, so C = Q. Therefore, C = Q is definitely established.

## 34. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 1

**Record:** INE-CP002-198E38E1 · **Difficulty:** EASY (SHORT_SINGLE_PATH) · **Release tier:** SSC_STANDARD_MOCK · **Topology:** EQUALITY_CHAIN_ONE_BRANCH · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

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

Collapse the equality route first: C = S and Q = S. This places C and Q in the same equality group. The other comparisons leave that group but cannot separate its members, so C = Q. Therefore, C = Q is definitely established.

## 35. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 2

**Record:** INE-CP002-A9612EA8 · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** EQUALITY_HUB_AND_BRANCHES · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

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

Collapse the equality route first: D = R and Q = D. This places R and Q in the same equality group. The other comparisons leave that group but cannot separate its members, so R = Q. Therefore, R = Q is definitely established.

## 36. PROPAGATE_EQUALITY_ACROSS_BRANCHES — seed 3

**Record:** INE-CP002-91AB42CB · **Difficulty:** MEDIUM (STANDARD_GRAPH_REASONING) · **Release tier:** BANKING_PRELIMS · **Topology:** LONG_EQUALITY_COMPONENT_SHARED_LOWER · **Explanation mode:** EQUALITY_SPANNING_BRANCHES

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

Collapse the equality route first: R = B and R = D. This places B and D in the same equality group. The other comparisons leave that group but cannot separate its members, so B = D. Therefore, B = D is definitely established.
