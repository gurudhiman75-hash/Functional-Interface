# NS-COP-001 Reasoning Patterns

## Pattern 1: HCF Equals 1 Check

Applies to:

- CP-001
- supporting steps in CP-002, CP-003, and CP-004

Steps:

1. Find or verify the HCF of the two numbers.
2. If the HCF is 1, the numbers are co-prime.
3. If the HCF is greater than 1, the numbers are not co-prime.

Required future evidence:

- hcfLatex
- hcf
- decisionText
- answer

## Pattern 2: List Filtering By Co-Prime Condition

Applies to:

- CP-002

Steps:

1. Compare each list value with the target number.
2. Compute or verify HCF for each comparison.
3. Count the values whose HCF with the target number is 1.

Required future evidence:

- coprimeCheckLatex
- count of valid values
- answer

## Pattern 3: Candidate Evaluation

Applies to:

- CP-003

Steps:

1. Check each candidate against the given number.
2. Keep candidates whose HCF with the number is 1.
3. Select the required candidate.

Required future evidence:

- candidateEvaluationLatex
- selected candidate
- answer

## Pattern 4: Pair Counting

Applies to:

- CP-004

Steps:

1. Form all possible pairs from the set.
2. Evaluate the HCF of each pair.
3. Keep only pairs whose HCF is 1.
4. Count the kept pairs.

Required future evidence:

- pairEvaluationLatex
- co-prime pair count
- answer

## Pattern 5: Consecutive Number Property

Applies to:

- CP-005

Steps:

1. Recognize that the numbers are consecutive.
2. Use the property HCF(n,n+1) = 1.
3. Conclude that the numbers are co-prime.

Required future evidence:

- consecutivePropertyLatex
- answer

## Pattern 6: Ratio Reduction By HCF

Applies to:

- CP-006

Steps:

1. Find the HCF of the two ratio terms.
2. Divide both terms by the HCF.
3. Write the ratio in lowest form.
4. Verify that the reduced terms are co-prime.

Required future evidence:

- hcfLatex
- ratioReductionLatex
- answer
