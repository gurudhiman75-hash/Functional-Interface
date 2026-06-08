# NS-HL-001 Reasoning Patterns

## Pattern 1: Direct Product Relation

Applies to:

- CP-001
- supporting steps in CP-002 and CP-003

Steps:

1. Identify HCF and LCM.
2. Use HCF x LCM = product of the two numbers.
3. Substitute the known values.
4. Compute the requested missing relation value.

Required future graph evidence:

- hcf
- lcm
- productRelationLatex
- computedProduct or missingRelationValue

## Pattern 2: HCF-LCM Validity Check

Applies to:

- CP-002

Steps:

1. Check whether hcf divides lcm.
2. If numbers are supplied, check whether HCF x LCM equals product of the numbers.
3. If a product is supplied, check relation consistency.
4. Return valid or invalid with the failing condition.

Required future graph evidence:

- divisibilityCheckLatex
- productRelationCheckLatex
- validityDecision
- rejectionReason when invalid

## Pattern 3: Missing Number Reconstruction

Applies to:

- CP-003

Steps:

1. Use knownNumber x missingNumber = hcf x lcm.
2. Compute hcf x lcm.
3. Divide by knownNumber.
4. Verify the result is a positive integer.
5. Verify the resulting pair has the given HCF and LCM.

Required future graph evidence:

- productRelationLatex
- missingNumberFormulaLatex
- reconstructedPair
- hcfVerificationLatex
- lcmVerificationLatex

## Pattern 4: Co-Prime Multiplier Pair Reconstruction

Applies to:

- CP-004

Steps:

1. Check that hcf divides lcm.
2. Compute k = lcm / hcf.
3. List factor pairs (m,n) of k.
4. Keep only pairs where gcd(m,n)=1.
5. Apply the supplied uniqueness condition.
6. Multiply each retained multiplier by hcf.
7. Return the number pair.

Required future graph evidence:

- quotientLatex
- factorPairListLatex
- coprimePairFilterLatex
- conditionFilterLatex
- reconstructedPairLatex

## Pattern 5: Co-Prime Pair Counting

Applies to:

- CP-005

Steps:

1. Check that hcf divides lcm.
2. Compute k = lcm / hcf.
3. Count factor pairs of k.
4. Keep only co-prime multiplier pairs.
5. Apply ordered or unordered pair policy.
6. Return the pair count.

Required future graph evidence:

- quotientLatex
- factorPairCountLatex
- coprimePairFilterLatex
- orderedPairPolicyLatex or unorderedPairPolicyLatex
- pairCount

## Pattern 6: Ratio Multiplier Reconstruction

Applies to:

- CP-006

Steps:

1. Reduce the ratio p:q if needed.
2. Represent the numbers as kp and kq.
3. If HCF is supplied, set k equal to HCF.
4. If LCM is supplied, compute k = LCM / (p x q).
5. If both HCF and LCM are supplied, verify both agree.
6. Return kp and kq.

Required future graph evidence:

- ratioReductionLatex
- ratioMultiplierLatex
- hcfMultiplierLatex when HCF is supplied
- lcmMultiplierLatex when LCM is supplied
- consistencyCheckLatex when both are supplied
- reconstructedPairLatex

## Pattern 7: Context Translation

Applies to:

- contextual variants of CP-001 through CP-006

Steps:

1. Read the statement.
2. Identify whether the question asks for product, validity, missing number, pair, pair count, or ratio reconstruction.
3. Map the context to the appropriate CP.
4. Apply that CP's reasoning pattern.

Required future graph evidence:

- contextExtraction
- mappedCanonicalProblemId
- extractedVariables

Context translation is not a separate CP in Phase A because it does not create a new mathematical output.
