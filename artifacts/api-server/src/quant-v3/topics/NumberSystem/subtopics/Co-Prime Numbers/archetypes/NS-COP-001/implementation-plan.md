# NS-COP-001 Implementation Plan

## Phase Status

This package is design and educational libraries only. It does not create runtime implementation.

## Reuse Requirements

Future implementation must reuse:

- NS-PRM-001
- NS-PF-001
- NS-HCF-001
- NS-LCM-001
- NS-HL-001

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Coverage Framework
- Audit Framework
- Human Review Framework

## Shared Future Abstractions

Future runtime should use:

- hcf
- isCoprime
- coprimeCheckLatex
- candidateEvaluationLatex
- pairEvaluationLatex
- consecutivePropertyLatex
- ratioReductionLatex
- list length buckets
- set size buckets
- ratio reduction buckets

Runtime may only load, validate, select, substitute, render, and audit approved educational language.

Runtime may not invent stems, explanations, or fallback wording.

## CP-001 Co-Prime Check

Educational objective:

Decide whether two numbers are co-prime.

Inputs:

- a
- b

Outputs:

- answer
- hcf
- decisionText

Future solver topology:

- compute HCF(a,b)
- compare with 1
- return yes/no answer

Future graph topology:

- input capture
- HCF computation
- HCF equals 1 decision
- answer extraction

Validation requirements:

- a and b must be positive integers
- answer must match HCF(a,b) = 1

Coverage requirements:

- coprime
- notCoprime
- primeAndPrime
- primeAndComposite
- compositeAndComposite

## CP-002 Count Co-Primes From A List

Educational objective:

Count list values co-prime with a target number.

Inputs:

- numberList
- targetNumber

Outputs:

- answer

Future solver topology:

- evaluate HCF(targetNumber, value) for each list entry
- count entries with HCF 1

Future graph topology:

- input capture
- repeated HCF checks
- count valid entries
- answer extraction

Validation requirements:

- list values and target number must be positive integers
- count must match evaluated entries

Coverage requirements:

- shortList
- mediumList
- longList

## CP-003 Missing Number For Co-Prime Condition

Educational objective:

Select the value that is co-prime with a given number.

Inputs:

- number
- candidate values supplied by future item form

Outputs:

- answer

Future solver topology:

- evaluate candidates
- keep candidates with HCF 1
- enforce single valid answer

Future graph topology:

- input capture
- candidate evaluation
- valid candidate selection
- answer extraction

Validation requirements:

- exactly one valid candidate unless future wording explicitly asks for multiple
- answer must have HCF 1 with the given number

Coverage requirements:

- singleValidCandidate
- multipleDistractors

## CP-004 Count Co-Prime Pairs

Educational objective:

Count co-prime pairs from a set.

Inputs:

- numberSet

Outputs:

- answer

Future solver topology:

- form unordered pairs
- evaluate HCF for each pair
- count pairs with HCF 1

Future graph topology:

- set capture
- pair formation
- pair evaluation
- count extraction

Validation requirements:

- set must contain positive integers
- answer must match evaluated pair count

Coverage requirements:

- smallSet
- mediumSet
- largeSet

## CP-005 Consecutive Number Co-Prime Property

Educational objective:

Apply the property that consecutive numbers are co-prime.

Inputs:

- number
- nextNumber

Outputs:

- answer

Future solver topology:

- verify nextNumber = number + 1
- apply HCF(n,n+1) = 1
- return co-prime decision or HCF as required by stem

Future graph topology:

- consecutive-number check
- property application
- answer extraction

Validation requirements:

- nextNumber must equal number + 1
- answer must follow the consecutive-number property

Coverage requirements:

- directConsecutiveRule
- hcfVerification

## CP-006 Ratio Reduction To Lowest Form

Educational objective:

Reduce a ratio by dividing both terms by their HCF.

Inputs:

- a
- b

Outputs:

- answer

Future solver topology:

- compute HCF(a,b)
- divide both terms by HCF
- return reduced ratio

Future graph topology:

- ratio capture
- HCF computation
- ratio reduction
- answer extraction

Validation requirements:

- a and b must be positive integers
- reduced ratio terms must be co-prime

Coverage requirements:

- alreadyReduced
- reducibleOnce
- reducibleMultipleFactors

## Educational Library Gate

All stems and explanations are explicitly stored in the approved libraries.

Future runtime must not generate educational sentences.
