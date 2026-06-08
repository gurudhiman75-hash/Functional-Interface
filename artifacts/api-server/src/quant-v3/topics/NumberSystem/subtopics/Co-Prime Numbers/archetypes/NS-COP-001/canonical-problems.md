# NS-COP-001 Canonical Problems

## Active CP List

Use only the following canonical problems:

- CP-001 Co-Prime Check
- CP-002 Count Co-Primes From A List
- CP-003 Missing Number For Co-Prime Condition
- CP-004 Count Co-Prime Pairs
- CP-005 Consecutive Number Co-Prime Property
- CP-006 Ratio Reduction To Lowest Form

Active topology count: 6

## CP-001 Co-Prime Check

Inputs:

- a
- b

Outputs:

- answer
- hcf
- decisionText

Educational objective:

Determine whether two numbers are co-prime by checking whether their HCF is 1.

Mathematical topology:

Compute or verify HCF(a,b). If HCF(a,b) = 1, the numbers are co-prime. Otherwise, they are not co-prime.

Why distinct:

The answer is a yes/no co-prime decision for one pair of numbers.

## CP-002 Count Co-Primes From A List

Inputs:

- numberList
- targetNumber

Outputs:

- answer

Educational objective:

Count how many numbers in a list are co-prime with a target number.

Mathematical topology:

Check HCF(targetNumber, x) for each list value x and count values where the HCF is 1.

Why distinct:

The learner filters a list and returns a count, not a single decision.

## CP-003 Missing Number For Co-Prime Condition

Inputs:

- number
- candidate values supplied by the future item form

Outputs:

- answer

Educational objective:

Select the value that forms a co-prime pair with the given number.

Mathematical topology:

Evaluate each candidate with the given number and choose the candidate whose HCF is 1.

Why distinct:

The task is candidate selection under a co-prime condition.

## CP-004 Count Co-Prime Pairs

Inputs:

- numberSet

Outputs:

- answer

Educational objective:

Count all pairs in a set whose HCF is 1.

Mathematical topology:

Form all unordered pairs from the set, evaluate HCF for each pair, and count the co-prime pairs.

Why distinct:

The learner forms pair combinations and counts successful pairs.

## CP-005 Consecutive Number Co-Prime Property

Inputs:

- number
- nextNumber

Outputs:

- answer

Educational objective:

Apply the property that consecutive numbers are always co-prime.

Mathematical topology:

For consecutive integers n and n+1, HCF(n,n+1) = 1.

Why distinct:

The reasoning is property-based rather than list filtering or candidate evaluation.

## CP-006 Ratio Reduction To Lowest Form

Inputs:

- a
- b

Outputs:

- answer

Educational objective:

Reduce a ratio to lowest form by dividing both terms by their HCF.

Mathematical topology:

Find HCF(a,b), then compute:

a:b = (a / HCF):(b / HCF)

Why distinct:

The output is a reduced ratio whose terms are co-prime.

## Removed Or Merged Candidates

No additional CPs are retained.

Direct HCF computation is reused as supporting evidence but belongs to NS-HCF-001 when it is the final answer.

Prime factorization may support explanation evidence but belongs to NS-PF-001 when it is the final answer.

LCM and HCF-LCM relationship questions are outside this archetype unless the final educational goal is co-prime identification or ratio reduction.
