# NS-HL-001 Canonical Problems

## Discovery Method

The candidate list was reviewed by mathematical topology rather than by textbook headings. A candidate is retained only when it changes the answer type, solver topology, or reasoning topology in a meaningful educational way.

Direct HCF and direct LCM computation are intentionally excluded. They belong to NS-HCF-001 and NS-LCM-001.

## Active CP List

NS-HL-001 retains 6 canonical problems.

## CP-001 Direct Product Relation

Name: Direct Product Relation

Inputs:

- hcf
- lcm
- optionally productOfNumbers when a missing relation value is requested

Outputs:

- productOfNumbers or missingRelationValue

Educational objective:

Use the identity HCF x LCM = product of two numbers.

Mathematical topology:

Direct substitution into:

HCF x LCM = a x b

Why distinct:

The answer is a numerical value from the relation itself, such as the product of the two numbers. No pair search, ratio method, or missing-number division by a known number is required.

Why not redundant:

It is the base relation topology used by the archetype, but its output is not the HCF, LCM, or a pair of numbers.

## CP-002 HCF-LCM Validity Check

Name: HCF-LCM Validity Check

Inputs:

- hcf
- lcm
- optional numbers or productOfNumbers

Outputs:

- isValid

Educational objective:

Decide whether a proposed HCF-LCM combination or full number set is mathematically possible.

Mathematical topology:

Check required consistency conditions:

- hcf divides lcm
- if numbers are supplied, HCF x LCM equals product of the numbers
- if product is supplied, product is divisible by HCF x LCM when the prompt requires equality

Why distinct:

The output is a validity decision rather than a computed missing number, product, pair, or count.

Why not redundant:

Although it uses the product relation, the educational act is detecting impossible or inconsistent data.

## CP-003 Missing Number From HCF, LCM, And One Number

Name: Missing Number From HCF, LCM, And One Number

Inputs:

- hcf
- lcm
- knownNumber

Outputs:

- missingNumber

Educational objective:

Find the other number when one number, the HCF, and the LCM are known.

Mathematical topology:

Use:

knownNumber x missingNumber = hcf x lcm

Therefore:

missingNumber = (hcf x lcm) / knownNumber

Why distinct:

The output is an original number, and the solver must verify divisibility and consistency with the given known number.

Why not redundant:

It is a direct reconstruction of one number, not a generic product calculation or a factor-pair search.

## CP-004 Number Pair Reconstruction From HCF And LCM

Name: Number Pair Reconstruction From HCF And LCM

Inputs:

- hcf
- lcm
- uniqueness condition such as sum, difference, range, candidate pair set, or ordered/unordered requirement

Outputs:

- numberPair

Educational objective:

Reconstruct a valid pair of numbers using the co-prime multiplier method.

Mathematical topology:

Let numbers be h x m and h x n, where h is the HCF.

Then:

m x n = lcm / h

and:

gcd(m,n) = 1

The final pair is:

(h x m, h x n)

Why distinct:

The solver must search or select a co-prime multiplier pair, not merely apply the product identity.

Why not redundant:

It produces an actual pair of numbers. CP-005 counts possible pairs instead of returning the pair.

## CP-005 Count Possible Number Pairs

Name: Count Possible Number Pairs

Inputs:

- hcf
- lcm
- orderedPairPolicy or unorderedPairPolicy

Outputs:

- pairCount

Educational objective:

Count how many number pairs can have the given HCF and LCM.

Mathematical topology:

Compute:

k = lcm / hcf

Count factor pairs (m,n) of k such that:

gcd(m,n) = 1

Then apply ordered or unordered pair policy.

Why distinct:

The answer is a count. The solver must enumerate or count co-prime factor pairs without selecting one final pair.

Why not redundant:

It is derived from CP-004's multiplier representation, but the output and reasoning endpoint differ.

## CP-006 Ratio-Based Number Reconstruction

Name: Ratio-Based Number Reconstruction

Inputs:

- ratio
- hcf or lcm, optionally both for consistency checking

Outputs:

- numberPair

Educational objective:

Find two numbers from their ratio and HCF and/or LCM.

Mathematical topology:

If the numbers are in the ratio p:q with gcd(p,q)=1:

numbers = kp and kq

If HCF is known:

k = hcf

If LCM is known:

lcm = k x p x q

so:

k = lcm / (p x q)

If both are known, both conditions must agree.

Why distinct:

The ratio supplies the co-prime multiplier pair directly. This is a different entry point from searching factor pairs from lcm / hcf.

Why not redundant:

It uses HCF-LCM structure, but the primary reasoning is ratio-to-multiplier reconstruction.

## Candidate Analysis

| Candidate | Decision | Justification |
| --- | --- | --- |
| 1. Verify HCF x LCM = Product of two numbers | Merged into CP-002 | Verification is a validity-check output. The same relation supports CP-001, but yes/no consistency belongs to CP-002. |
| 2. Find one missing number when HCF, LCM and one number are known | Retained as CP-003 | Distinct missing original-number output. |
| 3. Find a pair of numbers from HCF and LCM | Retained as CP-004 | Requires co-prime multiplier-pair search and reconstruction. |
| 4. Count possible pairs for a given HCF and LCM | Retained as CP-005 | Count output is distinct from returning a pair. |
| 5. Check validity of a given HCF-LCM combination | Retained as CP-002 | Boolean validity topology is distinct. |
| 6. Reconstruct numbers from ratio + HCF | Merged into CP-006 | Ratio-based reconstruction with HCF-known variant. |
| 7. Reconstruct numbers from ratio + LCM | Merged into CP-006 | Ratio-based reconstruction with LCM-known variant. |
| 8. Reconstruct numbers from ratio + HCF + LCM | Merged into CP-006 | Ratio-based reconstruction with consistency check. |
| 9. Word problems using HCF-LCM relation | Merged into relevant CPs | Context changes wording and translation, but not the mathematical topology unless a future review proves a new output. |
| 10. Product-of-numbers reconstruction | Merged into CP-001 | Direct numeric application of HCF x LCM = product. |
| 11. Co-prime multiplier method questions | Merged into CP-004 and CP-005 | It is a reasoning method, not a final-answer topology by itself. |

## Removed Candidates

No candidate is removed without absorption. All non-retained candidates are merged into an active CP as a method, wording form, or contextual variant.

## Topology Count

Distinct active topology count: 6
