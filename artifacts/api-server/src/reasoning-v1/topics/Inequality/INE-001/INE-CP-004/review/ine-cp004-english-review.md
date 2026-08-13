# INE-CP-004 English Prototype Review Pack

This pack contains 12 questions for each provisional complementary/either-or authority. Every question has exactly four answer options. Permanent QLs remain unallocated, and Question Studio visibility remains disabled.

## 1. CLASSIFY_COMPLEMENTARY_PAIR — seed 0

**Record:** INE-CP004-A42CF22D · **Difficulty:** MEDIUM · **Profile:** GUIDED_CONCEPT · **Topology:** DIRECT_GTE_WITH_INDEPENDENT_STRICT

How should conclusions I and II be evaluated as a pair?

### Statements

- A ≥ C
- Q < S

### Conclusions

I. C = A
II. A > C

### Options

1. Valid either-or pair
2. Not either-or: some valid cases are left uncovered
3. Not either-or: the conclusions overlap
4. Cannot be determined from the statements

**Correct:** 1. Valid either-or pair

### Explanation

Use A ≥ C. So the relation can be C < A or C = A. Conclusion I matches C = A, while conclusion II matches C < A. Neither follows on its own, but exactly one of them must be true. Therefore, this is classified as “Valid either-or pair”.

## 2. CLASSIFY_COMPLEMENTARY_PAIR — seed 1

**Record:** INE-CP004-535B151A · **Difficulty:** MEDIUM · **Profile:** GUIDED_CONCEPT · **Topology:** DIRECT_LTE_WITH_STRICT_CHAIN

How should conclusions I and II be evaluated as a pair?

### Statements

- Q > P
- Q ≤ S
- R ≥ C

### Conclusions

I. R < C
II. C = R

### Options

1. Not either-or: the conclusions overlap
2. Cannot be determined from the statements
3. Valid either-or pair
4. Not either-or: some valid cases are left uncovered

**Correct:** 4. Not either-or: some valid cases are left uncovered

### Explanation

Use R ≥ C. The relation may be R = C or R > C. Conclusion I matches no valid case, while conclusion II matches R = C. At least one possible case is missed, so this is not an either-or pair. Therefore, this is classified as “Not either-or: some valid cases are left uncovered”.

## 3. CLASSIFY_COMPLEMENTARY_PAIR — seed 2

**Record:** INE-CP004-1FA0417F · **Difficulty:** MEDIUM · **Profile:** GUIDED_CONCEPT · **Topology:** SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS

How should conclusions I and II be evaluated as a pair?

### Statements

- P > R
- Q < P
- S < C

### Conclusions

I. R ≥ Q
II. R ≤ Q

### Options

1. Not either-or: some valid cases are left uncovered
2. Not either-or: the conclusions overlap
3. Cannot be determined from the statements
4. Valid either-or pair

**Correct:** 2. Not either-or: the conclusions overlap

### Explanation

No chain fixes the relation between R and Q. The relation may be R < Q, R = Q, or R > Q. Conclusion I matches R = Q or R > Q, while conclusion II matches R < Q or R = Q. The conclusions overlap because both can be true in the same case. Therefore, this is classified as “Not either-or: the conclusions overlap”.

## 4. CLASSIFY_COMPLEMENTARY_PAIR — seed 3

**Record:** INE-CP004-06770EB4 · **Difficulty:** MEDIUM · **Profile:** GUIDED_CONCEPT · **Topology:** SHARED_LOWER_BRANCH_WITH_EQUALITY_PROOF

How should conclusions I and II be evaluated as a pair?

### Statements

- C < S
- P = R
- R > B
- C < A

### Conclusions

I. S ≤ A
II. S > A

### Options

1. Cannot be determined from the statements
2. Not either-or: some valid cases are left uncovered
3. Valid either-or pair
4. Not either-or: the conclusions overlap

**Correct:** 3. Valid either-or pair

### Explanation

No chain fixes the relation between S and A. So the relation can be S < A, S = A, or S > A. Conclusion I matches S < A or S = A, while conclusion II matches S > A. Neither follows on its own, but exactly one of them must be true. Therefore, this is classified as “Valid either-or pair”.

## 5. CLASSIFY_COMPLEMENTARY_PAIR — seed 4

**Record:** INE-CP004-0B720DB9 · **Difficulty:** MEDIUM · **Profile:** GUIDED_CONCEPT · **Topology:** GTE_CHAIN_THROUGH_EQUALITY

How should conclusions I and II be evaluated as a pair?

### Statements

- R ≥ C
- D < P
- C = A

### Conclusions

I. A > R
II. R ≤ A

### Options

1. Not either-or: some valid cases are left uncovered
2. Cannot be determined from the statements
3. Valid either-or pair
4. Not either-or: the conclusions overlap

**Correct:** 1. Not either-or: some valid cases are left uncovered

### Explanation

Use R ≥ C and C = A. The relation may be A < R or A = R. Conclusion I matches no valid case, while conclusion II matches A = R. At least one possible case is missed, so this is not an either-or pair. Therefore, this is classified as “Not either-or: some valid cases are left uncovered”.

## 6. CLASSIFY_COMPLEMENTARY_PAIR — seed 5

**Record:** INE-CP004-9A786F36 · **Difficulty:** MEDIUM · **Profile:** GUIDED_CONCEPT · **Topology:** LTE_CHAIN_THROUGH_EQUALITY

How should conclusions I and II be evaluated as a pair?

### Statements

- B ≥ D
- Q > C
- Q ≤ S
- R = B

### Conclusions

I. D < R
II. D ≤ R

### Options

1. Not either-or: some valid cases are left uncovered
2. Valid either-or pair
3. Not either-or: the conclusions overlap
4. Cannot be determined from the statements

**Correct:** 3. Not either-or: the conclusions overlap

### Explanation

Use B ≥ D and R = B. The relation may be D < R or D = R. Conclusion I matches D < R, while conclusion II matches D < R or D = R. The conclusions overlap because both can be true in the same case. Therefore, this is classified as “Not either-or: the conclusions overlap”.

## 7. CLASSIFY_COMPLEMENTARY_PAIR — seed 6

**Record:** INE-CP004-D327380B · **Difficulty:** MEDIUM · **Profile:** GUIDED_CONCEPT · **Topology:** INCLUSIVE_ARMS_TO_COMMON_LOWER_BOUND

How should conclusions I and II be evaluated as a pair?

### Statements

- B ≤ R
- D ≥ B
- A < S

### Conclusions

I. R > D
II. R ≤ D

### Options

1. Not either-or: some valid cases are left uncovered
2. Cannot be determined from the statements
3. Not either-or: the conclusions overlap
4. Valid either-or pair

**Correct:** 4. Valid either-or pair

### Explanation

No chain fixes the relation between R and D. So the relation can be R < D, R = D, or R > D. Conclusion I matches R > D, while conclusion II matches R < D or R = D. Neither follows on its own, but exactly one of them must be true. Therefore, this is classified as “Valid either-or pair”.

## 8. CLASSIFY_COMPLEMENTARY_PAIR — seed 7

**Record:** INE-CP004-C4474100 · **Difficulty:** MEDIUM · **Profile:** GUIDED_CONCEPT · **Topology:** TWO_EDGE_GTE_QUERY_CHAIN

How should conclusions I and II be evaluated as a pair?

### Statements

- C ≥ S
- S ≥ P
- B > D

### Conclusions

I. C = P
II. P > C

### Options

1. Not either-or: the conclusions overlap
2. Not either-or: some valid cases are left uncovered
3. Valid either-or pair
4. Cannot be determined from the statements

**Correct:** 2. Not either-or: some valid cases are left uncovered

### Explanation

Use C ≥ S and S ≥ P. The relation may be C = P or C > P. Conclusion I matches C = P, while conclusion II matches no valid case. At least one possible case is missed, so this is not an either-or pair. Therefore, this is classified as “Not either-or: some valid cases are left uncovered”.

## 9. CLASSIFY_COMPLEMENTARY_PAIR — seed 8

**Record:** INE-CP004-A2684605 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** THREE_EDGE_GTE_QUERY_WITH_LONG_STRICT_PROOF

How should conclusions I and II be evaluated as a pair?

### Statements

- P < A
- A ≤ S
- Q ≤ S
- R = S
- R ≤ D

### Conclusions

I. D ≥ Q
II. D ≤ Q

### Options

1. Not either-or: some valid cases are left uncovered
2. Valid either-or pair
3. Not either-or: the conclusions overlap
4. Cannot be determined from the statements

**Correct:** 3. Not either-or: the conclusions overlap

### Explanation

Use R ≤ D, Q ≤ S, and R = S. The relation may be D = Q or D > Q. Conclusion I matches D = Q or D > Q, while conclusion II matches D = Q. The conclusions overlap because both can be true in the same case. Therefore, this is classified as “Not either-or: the conclusions overlap”.

## 10. CLASSIFY_COMPLEMENTARY_PAIR — seed 9

**Record:** INE-CP004-8C0A0BD2 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** LONG_SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS

How should conclusions I and II be evaluated as a pair?

### Statements

- R > Q
- R > B
- A > D
- R = A
- A < P

### Conclusions

I. Q ≤ B
II. B < Q

### Options

1. Cannot be determined from the statements
2. Valid either-or pair
3. Not either-or: the conclusions overlap
4. Not either-or: some valid cases are left uncovered

**Correct:** 2. Valid either-or pair

### Explanation

No chain fixes the relation between Q and B. So the relation can be Q < B, Q = B, or Q > B. Conclusion I matches Q < B or Q = B, while conclusion II matches Q > B. Neither follows on its own, but exactly one of them must be true. Therefore, this is classified as “Valid either-or pair”.

## 11. CLASSIFY_COMPLEMENTARY_PAIR — seed 10

**Record:** INE-CP004-40387D04 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** TWO_LONG_ARMS_WITH_FREE_ENDPOINTS

How should conclusions I and II be evaluated as a pair?

### Statements

- B ≥ Q
- C < S
- Q ≤ C
- B < R
- C = B

### Conclusions

I. R < S
II. R > S

### Options

1. Not either-or: some valid cases are left uncovered
2. Cannot be determined from the statements
3. Valid either-or pair
4. Not either-or: the conclusions overlap

**Correct:** 1. Not either-or: some valid cases are left uncovered

### Explanation

No chain fixes the relation between R and S. The relation may be R < S, R = S, or R > S. Conclusion I matches R < S, while conclusion II matches R > S. At least one possible case is missed, so this is not an either-or pair. Therefore, this is classified as “Not either-or: some valid cases are left uncovered”.

## 12. CLASSIFY_COMPLEMENTARY_PAIR — seed 11

**Record:** INE-CP004-C8B493CF · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** THREE_EDGE_LTE_QUERY_WITH_EQUALITY_PROOF

How should conclusions I and II be evaluated as a pair?

### Statements

- D = C
- D ≥ R
- C ≥ P
- S < P
- C ≤ B

### Conclusions

I. B > R
II. R ≤ B

### Options

1. Not either-or: some valid cases are left uncovered
2. Cannot be determined from the statements
3. Valid either-or pair
4. Not either-or: the conclusions overlap

**Correct:** 4. Not either-or: the conclusions overlap

### Explanation

Use C ≤ B, D ≥ R, and D = C. The relation may be B = R or B > R. Conclusion I matches B > R, while conclusion II matches B = R or B > R. The conclusions overlap because both can be true in the same case. Therefore, this is classified as “Not either-or: the conclusions overlap”.

## 13. IDENTIFY_COMPLEMENTARY_PAIR — seed 0

**Record:** INE-CP004-441C8CAB · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** DIRECT_GTE_WITH_INDEPENDENT_STRICT

Which option contains a valid either-or pair?

### Statements

- Q > R
- B ≤ C

### Options

1. I. B < C; II. B = C
2. I. C < B; II. B ≥ C
3. I. B ≤ C; II. B < C
4. I. B > C; II. B = C

**Correct:** 1. I. B < C; II. B = C

### Explanation

Option 1: Use B ≤ C. So the relation can be B < C or B = C. Conclusion I matches B < C, while conclusion II matches B = C. Neither follows on its own, but exactly one of them must be true. Therefore, option 1 is the valid either-or pair.

## 14. IDENTIFY_COMPLEMENTARY_PAIR — seed 1

**Record:** INE-CP004-FF790D20 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** DIRECT_LTE_WITH_STRICT_CHAIN

Which option contains a valid either-or pair?

### Statements

- A ≥ R
- B < R
- P ≤ D

### Options

1. I. D = P; II. D < P
2. I. D > P; II. D ≥ P
3. I. D = P; II. P < D
4. I. P > D; II. P < D

**Correct:** 3. I. D = P; II. P < D

### Explanation

Option 3: Use P ≤ D. So the relation can be D = P or D > P. Conclusion I matches D = P, while conclusion II matches D > P. Neither follows on its own, but exactly one of them must be true. Therefore, option 3 is the valid either-or pair.

## 15. IDENTIFY_COMPLEMENTARY_PAIR — seed 2

**Record:** INE-CP004-BF804ED9 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS

Which option contains a valid either-or pair?

### Statements

- R < S
- S > Q
- A > P

### Options

1. I. R > Q; II. Q = R
2. I. R ≥ Q; II. Q ≥ R
3. I. R > Q; II. R < Q
4. I. R < Q; II. R ≥ Q

**Correct:** 4. I. R < Q; II. R ≥ Q

### Explanation

Option 4: No chain fixes the relation between R and Q. So the relation can be R < Q, R = Q, or R > Q. Conclusion I matches R < Q, while conclusion II matches R = Q or R > Q. Neither follows on its own, but exactly one of them must be true. Therefore, option 4 is the valid either-or pair.

## 16. IDENTIFY_COMPLEMENTARY_PAIR — seed 3

**Record:** INE-CP004-062C1FD6 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** SHARED_LOWER_BRANCH_WITH_EQUALITY_PROOF

Which option contains a valid either-or pair?

### Statements

- D = R
- A > Q
- R > S
- Q < P

### Options

1. I. P ≥ A; II. A ≥ P
2. I. A < P; II. P ≤ A
3. I. A < P; II. P < A
4. I. A > P; II. A = P

**Correct:** 2. I. A < P; II. P ≤ A

### Explanation

Option 2: No chain fixes the relation between A and P. So the relation can be A < P, A = P, or A > P. Conclusion I matches A < P, while conclusion II matches A = P or A > P. Neither follows on its own, but exactly one of them must be true. Therefore, option 2 is the valid either-or pair.

## 17. IDENTIFY_COMPLEMENTARY_PAIR — seed 4

**Record:** INE-CP004-B69B2B9F · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** GTE_CHAIN_THROUGH_EQUALITY

Which option contains a valid either-or pair?

### Statements

- Q = P
- D > S
- B ≥ P

### Options

1. I. Q < B; II. B = Q
2. I. B = Q; II. Q ≤ B
3. I. Q > B; II. B ≤ Q
4. I. B < Q; II. B = Q

**Correct:** 1. I. Q < B; II. B = Q

### Explanation

Option 1: Use B ≥ P and Q = P. So the relation can be Q < B or Q = B. Conclusion I matches Q < B, while conclusion II matches Q = B. Neither follows on its own, but exactly one of them must be true. Therefore, option 1 is the valid either-or pair.

## 18. IDENTIFY_COMPLEMENTARY_PAIR — seed 5

**Record:** INE-CP004-BA8DCA54 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** LTE_CHAIN_THROUGH_EQUALITY

Which option contains a valid either-or pair?

### Statements

- P = A
- B > Q
- A ≥ D
- B ≤ R

### Options

1. I. D < P; II. P < D
2. I. D > P; II. D = P
3. I. D < P; II. P = D
4. I. D ≥ P; II. P ≥ D

**Correct:** 3. I. D < P; II. P = D

### Explanation

Option 3: Use A ≥ D and P = A. So the relation can be D < P or D = P. Conclusion I matches D < P, while conclusion II matches D = P. Neither follows on its own, but exactly one of them must be true. Therefore, option 3 is the valid either-or pair.

## 19. IDENTIFY_COMPLEMENTARY_PAIR — seed 6

**Record:** INE-CP004-32E4C8CD · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** INCLUSIVE_ARMS_TO_COMMON_LOWER_BOUND

Which option contains a valid either-or pair?

### Statements

- D ≥ A
- P > B
- Q ≥ A

### Options

1. I. Q = D; II. Q < D
2. I. Q ≤ D; II. D < Q
3. I. D > Q; II. Q > D
4. I. D ≤ Q; II. D ≥ Q

**Correct:** 2. I. Q ≤ D; II. D < Q

### Explanation

Option 2: No chain fixes the relation between Q and D. So the relation can be Q < D, Q = D, or Q > D. Conclusion I matches Q < D or Q = D, while conclusion II matches Q > D. Neither follows on its own, but exactly one of them must be true. Therefore, option 2 is the valid either-or pair.

## 20. IDENTIFY_COMPLEMENTARY_PAIR — seed 7

**Record:** INE-CP004-21F0783A · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** TWO_EDGE_GTE_QUERY_CHAIN

Which option contains a valid either-or pair?

### Statements

- P > S
- A ≤ C
- D ≥ C

### Options

1. I. A = D; II. D ≥ A
2. I. D > A; II. A > D
3. I. D < A; II. D ≤ A
4. I. A = D; II. A < D

**Correct:** 4. I. A = D; II. A < D

### Explanation

Option 4: Use D ≥ C and A ≤ C. So the relation can be A < D or A = D. Conclusion I matches A = D, while conclusion II matches A < D. Neither follows on its own, but exactly one of them must be true. Therefore, option 4 is the valid either-or pair.

## 21. IDENTIFY_COMPLEMENTARY_PAIR — seed 8

**Record:** INE-CP004-061430C3 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** THREE_EDGE_GTE_QUERY_WITH_LONG_STRICT_PROOF

Which option contains a valid either-or pair?

### Statements

- A ≥ B
- S = A
- Q ≥ S
- C ≤ A
- B > P

### Options

1. I. Q > C; II. Q = C
2. I. C ≥ Q; II. C > Q
3. I. C = Q; II. C > Q
4. I. C ≤ Q; II. Q = C

**Correct:** 1. I. Q > C; II. Q = C

### Explanation

Option 1: Use Q ≥ S, C ≤ A, and S = A. So the relation can be Q = C or Q > C. Conclusion I matches Q > C, while conclusion II matches Q = C. Neither follows on its own, but exactly one of them must be true. Therefore, option 1 is the valid either-or pair.

## 22. IDENTIFY_COMPLEMENTARY_PAIR — seed 9

**Record:** INE-CP004-8ADAE918 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** LONG_SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS

Which option contains a valid either-or pair?

### Statements

- C < P
- Q < R
- S < P
- Q = P
- B < Q

### Options

1. I. S ≥ C; II. S ≤ C
2. I. S = C; II. C > S
3. I. C > S; II. S = C
4. I. S ≥ C; II. S < C

**Correct:** 4. I. S ≥ C; II. S < C

### Explanation

Option 4: No chain fixes the relation between S and C. So the relation can be S < C, S = C, or S > C. Conclusion I matches S = C or S > C, while conclusion II matches S < C. Neither follows on its own, but exactly one of them must be true. Therefore, option 4 is the valid either-or pair.

## 23. IDENTIFY_COMPLEMENTARY_PAIR — seed 10

**Record:** INE-CP004-61C84136 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** TWO_LONG_ARMS_WITH_FREE_ENDPOINTS

Which option contains a valid either-or pair?

### Statements

- C ≤ B
- P > B
- A ≥ C
- R > A
- A = B

### Options

1. I. P = R; II. R > P
2. I. P < R; II. R < P
3. I. P ≥ R; II. P < R
4. I. P ≥ R; II. P ≤ R

**Correct:** 3. I. P ≥ R; II. P < R

### Explanation

Option 3: No chain fixes the relation between P and R. So the relation can be P < R, P = R, or P > R. Conclusion I matches P = R or P > R, while conclusion II matches P < R. Neither follows on its own, but exactly one of them must be true. Therefore, option 3 is the valid either-or pair.

## 24. IDENTIFY_COMPLEMENTARY_PAIR — seed 11

**Record:** INE-CP004-D2C1DFB9 · **Difficulty:** HARD · **Profile:** GUIDED_CONCEPT · **Topology:** THREE_EDGE_LTE_QUERY_WITH_EQUALITY_PROOF

Which option contains a valid either-or pair?

### Statements

- B ≤ S
- R ≤ Q
- P < C
- R ≥ C
- R = S

### Options

1. I. B ≥ Q; II. Q < B
2. I. Q > B; II. B = Q
3. I. Q < B; II. Q ≤ B
4. I. Q ≤ B; II. B ≤ Q

**Correct:** 2. I. Q > B; II. B = Q

### Explanation

Option 2: Use R ≤ Q, B ≤ S, and R = S. So the relation can be Q = B or Q > B. Conclusion I matches Q > B, while conclusion II matches Q = B. Neither follows on its own, but exactly one of them must be true. Therefore, option 2 is the valid either-or pair.

## 25. RESOLVE_EITHER_OR_CONCLUSIONS — seed 0

**Record:** INE-CP004-541FF268 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** DIRECT_GTE_WITH_INDEPENDENT_STRICT

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- B ≥ D
- Q > C

### Conclusions

I. B = D
II. D < B

### Options

1. Only conclusion II follows
2. Neither conclusion I nor conclusion II follows
3. Either conclusion I or conclusion II follows
4. Only conclusion I follows

**Correct:** 3. Either conclusion I or conclusion II follows

### Explanation

Use B ≥ D. So the relation can be B = D or B > D. Conclusion I matches B = D, while conclusion II matches B > D. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 26. RESOLVE_EITHER_OR_CONCLUSIONS — seed 1

**Record:** INE-CP004-EDAC50D3 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** DIRECT_LTE_WITH_STRICT_CHAIN

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- C ≤ A
- P ≤ D
- C > R

### Conclusions

I. P < D
II. P = D

### Options

1. Neither conclusion I nor conclusion II follows
2. Only conclusion I follows
3. Both conclusions I and II follow
4. Either conclusion I or conclusion II follows

**Correct:** 4. Either conclusion I or conclusion II follows

### Explanation

Use P ≤ D. So the relation can be P < D or P = D. Conclusion I matches P < D, while conclusion II matches P = D. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 27. RESOLVE_EITHER_OR_CONCLUSIONS — seed 2

**Record:** INE-CP004-5796AC9E · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- S < P
- P > R
- C > B

### Conclusions

I. R ≥ S
II. S > R

### Options

1. Only conclusion II follows
2. Either conclusion I or conclusion II follows
3. Only conclusion I follows
4. Both conclusions I and II follow

**Correct:** 2. Either conclusion I or conclusion II follows

### Explanation

No chain fixes the relation between R and S. So the relation can be R < S, R = S, or R > S. Conclusion I matches R = S or R > S, while conclusion II matches R < S. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 28. RESOLVE_EITHER_OR_CONCLUSIONS — seed 3

**Record:** INE-CP004-AFC740A1 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** SHARED_LOWER_BRANCH_WITH_EQUALITY_PROOF

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- Q < S
- B > Q
- C < D
- P = D

### Conclusions

I. S < B
II. S ≥ B

### Options

1. Either conclusion I or conclusion II follows
2. Both conclusions I and II follow
3. Only conclusion II follows
4. Neither conclusion I nor conclusion II follows

**Correct:** 1. Either conclusion I or conclusion II follows

### Explanation

No chain fixes the relation between S and B. So the relation can be S < B, S = B, or S > B. Conclusion I matches S < B, while conclusion II matches S = B or S > B. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 29. RESOLVE_EITHER_OR_CONCLUSIONS — seed 4

**Record:** INE-CP004-884B31FC · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** GTE_CHAIN_THROUGH_EQUALITY

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- S ≥ D
- A = D
- C < R

### Conclusions

I. A = S
II. S > A

### Options

1. Neither conclusion I nor conclusion II follows
2. Only conclusion II follows
3. Either conclusion I or conclusion II follows
4. Both conclusions I and II follow

**Correct:** 3. Either conclusion I or conclusion II follows

### Explanation

Use S ≥ D and A = D. So the relation can be A < S or A = S. Conclusion I matches A = S, while conclusion II matches A < S. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 30. RESOLVE_EITHER_OR_CONCLUSIONS — seed 5

**Record:** INE-CP004-DB331C47 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** LTE_CHAIN_THROUGH_EQUALITY

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- C = R
- R ≥ P
- A > D
- Q ≥ A

### Conclusions

I. P < C
II. P = C

### Options

1. Either conclusion I or conclusion II follows
2. Only conclusion II follows
3. Both conclusions I and II follow
4. Only conclusion I follows

**Correct:** 1. Either conclusion I or conclusion II follows

### Explanation

Use R ≥ P and C = R. So the relation can be P < C or P = C. Conclusion I matches P < C, while conclusion II matches P = C. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 31. RESOLVE_EITHER_OR_CONCLUSIONS — seed 6

**Record:** INE-CP004-0ECF7542 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** INCLUSIVE_ARMS_TO_COMMON_LOWER_BOUND

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- S ≤ P
- S ≤ Q
- R > C

### Conclusions

I. P ≥ Q
II. P < Q

### Options

1. Only conclusion I follows
2. Either conclusion I or conclusion II follows
3. Only conclusion II follows
4. Neither conclusion I nor conclusion II follows

**Correct:** 2. Either conclusion I or conclusion II follows

### Explanation

No chain fixes the relation between P and Q. So the relation can be P < Q, P = Q, or P > Q. Conclusion I matches P = Q or P > Q, while conclusion II matches P < Q. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 32. RESOLVE_EITHER_OR_CONCLUSIONS — seed 7

**Record:** INE-CP004-B714E435 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** TWO_EDGE_GTE_QUERY_CHAIN

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- R ≤ Q
- Q ≤ C
- A > B

### Conclusions

I. R = C
II. C > R

### Options

1. Neither conclusion I nor conclusion II follows
2. Only conclusion I follows
3. Both conclusions I and II follow
4. Either conclusion I or conclusion II follows

**Correct:** 4. Either conclusion I or conclusion II follows

### Explanation

Use Q ≤ C and R ≤ Q. So the relation can be R < C or R = C. Conclusion I matches R = C, while conclusion II matches R < C. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 33. RESOLVE_EITHER_OR_CONCLUSIONS — seed 8

**Record:** INE-CP004-61C2FD30 · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** THREE_EDGE_GTE_QUERY_WITH_LONG_STRICT_PROOF

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- D ≤ B
- Q = B
- D > C
- B ≥ R
- Q ≤ P

### Conclusions

I. P > R
II. P = R

### Options

1. Either conclusion I or conclusion II follows
2. Both conclusions I and II follow
3. Neither conclusion I nor conclusion II follows
4. Only conclusion II follows

**Correct:** 1. Either conclusion I or conclusion II follows

### Explanation

Use Q ≤ P, B ≥ R, and Q = B. So the relation can be P = R or P > R. Conclusion I matches P > R, while conclusion II matches P = R. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 34. RESOLVE_EITHER_OR_CONCLUSIONS — seed 9

**Record:** INE-CP004-72EAC4FB · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** LONG_SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- S > R
- P > S
- B > A
- B = S
- B > C

### Conclusions

I. A < C
II. A ≥ C

### Options

1. Only conclusion I follows
2. Either conclusion I or conclusion II follows
3. Both conclusions I and II follow
4. Only conclusion II follows

**Correct:** 2. Either conclusion I or conclusion II follows

### Explanation

No chain fixes the relation between A and C. So the relation can be A < C, A = C, or A > C. Conclusion I matches A < C, while conclusion II matches A = C or A > C. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 35. RESOLVE_EITHER_OR_CONCLUSIONS — seed 10

**Record:** INE-CP004-3CAE0447 · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** TWO_LONG_ARMS_WITH_FREE_ENDPOINTS

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- P < R
- P = S
- P ≥ B
- B ≤ S
- C > S

### Conclusions

I. R ≥ C
II. C > R

### Options

1. Neither conclusion I nor conclusion II follows
2. Both conclusions I and II follow
3. Only conclusion I follows
4. Either conclusion I or conclusion II follows

**Correct:** 4. Either conclusion I or conclusion II follows

### Explanation

No chain fixes the relation between R and C. So the relation can be R < C, R = C, or R > C. Conclusion I matches R = C or R > C, while conclusion II matches R < C. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 36. RESOLVE_EITHER_OR_CONCLUSIONS — seed 11

**Record:** INE-CP004-E9C619FC · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** THREE_EDGE_LTE_QUERY_WITH_EQUALITY_PROOF

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- C ≤ A
- S > B
- P ≤ R
- A = P
- P ≥ S

### Conclusions

I. C = R
II. C < R

### Options

1. Only conclusion I follows
2. Neither conclusion I nor conclusion II follows
3. Either conclusion I or conclusion II follows
4. Only conclusion II follows

**Correct:** 3. Either conclusion I or conclusion II follows

### Explanation

Use P ≤ R, C ≤ A, and A = P. So the relation can be C < R or C = R. Conclusion I matches C = R, while conclusion II matches C < R. Neither follows on its own, but exactly one of them must be true. Hence, either conclusion I or conclusion II follows.

## 37. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 0

**Record:** INE-CP004-C5FB47D6 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** DIRECT_GTE_WITH_INDEPENDENT_STRICT

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- B < R
- C ≤ S

### Conclusions

I. R > B
II. C < S
III. C = S

### Options

1. None of the conclusions follows
2. Only conclusion I follows
3. Either conclusion II or conclusion III follows
4. Conclusion I and either conclusion II or conclusion III follow

**Correct:** 4. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use B < R. This proves conclusion I: R > B. For conclusions II and III: Use C ≤ S. So the relation can be C < S or C = S. Conclusion II matches C < S, while conclusion III matches C = S. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 38. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 1

**Record:** INE-CP004-7F4F76D9 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** DIRECT_LTE_WITH_STRICT_CHAIN

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- B ≥ C
- D ≥ P
- C > Q

### Conclusions

I. B > Q
II. D = P
III. P < D

### Options

1. Only conclusion I follows
2. None of the conclusions follows
3. Conclusion I and either conclusion II or conclusion III follow
4. Either conclusion II or conclusion III follows

**Correct:** 3. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use B ≥ C and C > Q. This proves conclusion I: B > Q. For conclusions II and III: Use D ≥ P. So the relation can be D = P or D > P. Conclusion II matches D = P, while conclusion III matches D > P. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 39. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 2

**Record:** INE-CP004-BF483520 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- C > B
- Q < A
- R < A

### Conclusions

I. C > B
II. R ≤ Q
III. R > Q

### Options

1. Only conclusion I follows
2. Conclusion I and either conclusion II or conclusion III follow
3. Either conclusion II or conclusion III follows
4. None of the conclusions follows

**Correct:** 2. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use C > B. This proves conclusion I: C > B. For conclusions II and III: No chain fixes the relation between R and Q. So the relation can be R < Q, R = Q, or R > Q. Conclusion II matches R < Q or R = Q, while conclusion III matches R > Q. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 40. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 3

**Record:** INE-CP004-03EBB4AB · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** SHARED_LOWER_BRANCH_WITH_EQUALITY_PROOF

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- A > D
- S > Q
- C > Q
- B = A

### Conclusions

I. D < B
II. C < S
III. S ≤ C

### Options

1. Conclusion I and either conclusion II or conclusion III follow
2. None of the conclusions follows
3. Only conclusion I follows
4. Either conclusion II or conclusion III follows

**Correct:** 1. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use A > D and B = A. This proves conclusion I: D < B. For conclusions II and III: No chain fixes the relation between C and S. So the relation can be C < S, C = S, or C > S. Conclusion II matches C < S, while conclusion III matches C = S or C > S. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 41. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 4

**Record:** INE-CP004-E1BFA03A · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** GTE_CHAIN_THROUGH_EQUALITY

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- C = R
- C ≤ Q
- S > P

### Conclusions

I. P < S
II. Q > R
III. Q = R

### Options

1. Conclusion I and either conclusion II or conclusion III follow
2. None of the conclusions follows
3. Either conclusion II or conclusion III follows
4. Only conclusion I follows

**Correct:** 1. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use S > P. This proves conclusion I: P < S. For conclusions II and III: Use C ≤ Q and C = R. So the relation can be Q = R or Q > R. Conclusion II matches Q > R, while conclusion III matches Q = R. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 42. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 5

**Record:** INE-CP004-F2B3F0CD · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** LTE_CHAIN_THROUGH_EQUALITY

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- R ≤ S
- P ≥ D
- C = P
- R > Q

### Conclusions

I. Q < S
II. D = C
III. D < C

### Options

1. None of the conclusions follows
2. Either conclusion II or conclusion III follows
3. Conclusion I and either conclusion II or conclusion III follow
4. Only conclusion I follows

**Correct:** 3. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use R ≤ S and R > Q. This proves conclusion I: Q < S. For conclusions II and III: Use P ≥ D and C = P. So the relation can be D < C or D = C. Conclusion II matches D = C, while conclusion III matches D < C. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 43. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 6

**Record:** INE-CP004-7A5CF254 · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** INCLUSIVE_ARMS_TO_COMMON_LOWER_BOUND

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- A ≤ S
- A ≤ D
- B < C

### Conclusions

I. C > B
II. D > S
III. S ≥ D

### Options

1. Either conclusion II or conclusion III follows
2. Conclusion I and either conclusion II or conclusion III follow
3. None of the conclusions follows
4. Only conclusion I follows

**Correct:** 2. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use B < C. This proves conclusion I: C > B. For conclusions II and III: No chain fixes the relation between D and S. So the relation can be D < S, D = S, or D > S. Conclusion II matches D > S, while conclusion III matches D < S or D = S. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 44. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 7

**Record:** INE-CP004-766A539F · **Difficulty:** MEDIUM · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** TWO_EDGE_GTE_QUERY_CHAIN

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- Q ≥ S
- S ≥ B
- D < C

### Conclusions

I. C > D
II. Q > B
III. B = Q

### Options

1. Either conclusion II or conclusion III follows
2. None of the conclusions follows
3. Only conclusion I follows
4. Conclusion I and either conclusion II or conclusion III follow

**Correct:** 4. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use D < C. This proves conclusion I: C > D. For conclusions II and III: Use Q ≥ S and S ≥ B. So the relation can be Q = B or Q > B. Conclusion II matches Q > B, while conclusion III matches Q = B. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 45. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 8

**Record:** INE-CP004-C0FCAD0E · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** THREE_EDGE_GTE_QUERY_WITH_LONG_STRICT_PROOF

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- R ≤ S
- D ≤ Q
- B < D
- Q = R
- Q ≥ C

### Conclusions

I. R > B
II. S > C
III. S = C

### Options

1. None of the conclusions follows
2. Conclusion I and either conclusion II or conclusion III follow
3. Only conclusion I follows
4. Either conclusion II or conclusion III follows

**Correct:** 2. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use D ≤ Q, B < D, and Q = R. This proves conclusion I: R > B. For conclusions II and III: Use R ≤ S, Q ≥ C, and Q = R. So the relation can be S = C or S > C. Conclusion II matches S > C, while conclusion III matches S = C. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 46. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 9

**Record:** INE-CP004-E6689211 · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** LONG_SHARED_UPPER_BRANCH_WITH_FREE_ENDPOINTS

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- S < A
- B > D
- P > B
- A = B
- C < A

### Conclusions

I. C < P
II. S > C
III. S ≤ C

### Options

1. None of the conclusions follows
2. Either conclusion II or conclusion III follows
3. Only conclusion I follows
4. Conclusion I and either conclusion II or conclusion III follow

**Correct:** 4. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use P > B, C < A, and A = B. This proves conclusion I: C < P. For conclusions II and III: No chain fixes the relation between S and C. So the relation can be S < C, S = C, or S > C. Conclusion II matches S > C, while conclusion III matches S < C or S = C. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 47. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 10

**Record:** INE-CP004-895203A1 · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** TWO_LONG_ARMS_WITH_FREE_ENDPOINTS

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- C ≥ B
- C < S
- B ≤ P
- C = P
- P < R

### Conclusions

I. R > B
II. S > R
III. S ≤ R

### Options

1. Conclusion I and either conclusion II or conclusion III follow
2. None of the conclusions follows
3. Either conclusion II or conclusion III follows
4. Only conclusion I follows

**Correct:** 1. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use P < R, B ≤ P, C ≥ B, and C = P. This proves conclusion I: R > B. For conclusions II and III: No chain fixes the relation between S and R. So the relation can be S < R, S = R, or S > R. Conclusion II matches S > R, while conclusion III matches S < R or S = R. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.

## 48. RESOLVE_DEFINITE_PLUS_EITHER_OR — seed 11

**Record:** INE-CP004-31216F9E · **Difficulty:** HARD · **Profile:** BANKING_MOCK_PROTOTYPE · **Topology:** THREE_EDGE_LTE_QUERY_WITH_EQUALITY_PROOF

Assuming the following statements to be true, which conclusion or conclusions definitely follow?

### Statements

- S ≤ R
- C < Q
- A = S
- S ≥ Q
- D ≤ A

### Conclusions

I. C < A
II. D < R
III. R = D

### Options

1. Only conclusion I follows
2. Either conclusion II or conclusion III follows
3. Conclusion I and either conclusion II or conclusion III follow
4. None of the conclusions follows

**Correct:** 3. Conclusion I and either conclusion II or conclusion III follow

### Explanation

Use S ≥ Q, C < Q, and A = S. This proves conclusion I: C < A. For conclusions II and III: Use S ≤ R, D ≤ A, and A = S. So the relation can be D < R or D = R. Conclusion II matches D < R, while conclusion III matches D = R. Neither follows on its own, but exactly one of them must be true. Therefore, conclusion I and either conclusion II or conclusion III follow.
