# NS-HL-001 Implementation Plan

## Phase Status

This is a design-only Phase A plan. It defines future implementation responsibilities but does not create runtime APIs, JSON libraries, generators, solvers, validators, reasoning graphs, pipelines, tests, or audits.

## Shared Future Abstractions

Future implementation should use:

- hcf
- lcm
- productOfNumbers
- knownNumber
- missingNumber
- ratio
- reducedRatio
- multiplier
- quotient = lcm / hcf
- factorPairs
- coprimeMultiplierPairs
- orderedPairPolicy
- unorderedPairPolicy
- validityDecision

## Reuse Requirements

Future implementation must reuse:

- NS-PRM-001 for prime and co-prime support where needed
- NS-PF-001 for factorization evidence where needed
- NS-FAC-001 for factor-pair and divisor-count logic where needed
- NS-HCF-001 for HCF verification
- NS-LCM-001 for LCM verification

Future implementation must not redesign:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Coverage Framework
- Audit Framework
- Human Review Framework

## CP-001 Direct Product Relation

Educational objective:

Use HCF x LCM = product of the two numbers to compute a requested relation value.

Inputs:

- hcf
- lcm
- optional productOfNumbers

Outputs:

- productOfNumbers or missingRelationValue

Solver topology:

- validate positive integer inputs
- apply product relation
- compute requested numeric output

Future graph topology:

- input capture
- product relation statement
- substitution
- arithmetic calculation
- answer extraction

Validation requirements:

- hcf and lcm must be positive integers
- product relation arithmetic must be exact
- if solving for HCF or LCM from product, divisibility must hold

Traceability requirements:

- canonicalProblemId
- questionLanguageId
- explanationStyleId
- hcf
- lcm
- productRelationLatex
- answer

Coverage requirements:

- small and large products
- missing product
- missing HCF or LCM variants only when mathematically exact
- difficulty band

Audit requirements:

- arithmetic correctness
- no direct HCF/LCM recomputation as the primary task
- rendered explanation must show product relation

## CP-002 HCF-LCM Validity Check

Educational objective:

Decide whether supplied HCF-LCM data can be true.

Inputs:

- hcf
- lcm
- optional numbers
- optional productOfNumbers

Outputs:

- isValid

Solver topology:

- check hcf divides lcm
- check product relation when numbers or product are supplied
- return validity decision and reason

Future graph topology:

- input capture
- divisibility check
- product relation check
- decision node
- answer extraction

Validation requirements:

- valid cases must satisfy all declared checks
- invalid cases must have a traceable failing condition
- generated prompts must avoid ambiguous "possible" wording without specifying supplied data

Traceability requirements:

- hcf
- lcm
- supplied numbers or product
- validityDecision
- rejectionReason if invalid

Coverage requirements:

- valid combinations
- hcf not dividing lcm
- product relation failure
- supplied-number consistency failure
- plausible invalid cases

Audit requirements:

- both true and false answers covered
- rejection reason exposed
- no hidden validation rule in student-facing language

## CP-003 Missing Number From HCF, LCM, And One Number

Educational objective:

Find the second number from HCF, LCM, and one known number.

Inputs:

- hcf
- lcm
- knownNumber

Outputs:

- missingNumber

Solver topology:

- compute product = hcf x lcm
- divide product by knownNumber
- verify integer result
- verify reconstructed pair has supplied HCF and LCM

Future graph topology:

- input capture
- product relation
- missing number formula
- division
- HCF verification
- LCM verification
- answer extraction

Validation requirements:

- product must be divisible by knownNumber
- missingNumber must be positive
- reconstructed pair must match supplied HCF and LCM

Traceability requirements:

- hcf
- lcm
- knownNumber
- productOfNumbers
- missingNumberFormulaLatex
- reconstructedPair
- answer

Coverage requirements:

- missing number smaller than known number
- missing number larger than known number
- equal-number cases where valid
- medium and large products
- invalid-generation rejection

Audit requirements:

- exact division verified
- HCF and LCM of reconstructed pair verified
- explanation displays product relation

## CP-004 Number Pair Reconstruction From HCF And LCM

Educational objective:

Find a number pair from HCF and LCM using co-prime multipliers.

Inputs:

- hcf
- lcm
- uniqueness condition such as sum, difference, range, candidate pair set, or order policy

Outputs:

- numberPair

Solver topology:

- validate hcf divides lcm
- compute quotient = lcm / hcf
- enumerate factor pairs of quotient
- keep co-prime multiplier pairs
- apply uniqueness condition
- multiply by hcf

Future graph topology:

- input capture
- quotient calculation
- factor-pair enumeration
- co-prime filtering
- uniqueness-condition filtering
- pair reconstruction
- answer extraction

Validation requirements:

- future generation must guarantee a unique answer unless the prompt explicitly requests all valid pairs
- every returned pair must have the supplied HCF and LCM
- no underdetermined prompt may be emitted

Traceability requirements:

- quotient
- factorPairs
- coprimeMultiplierPairs
- selectedMultiplierPair
- reconstructedPair
- uniqueness condition

Coverage requirements:

- single co-prime pair
- multiple co-prime pairs
- sum condition
- difference condition
- range condition
- candidate pair condition

Audit requirements:

- uniqueness proof visible
- rejected factor pairs visible
- selected pair verified against HCF and LCM

## CP-005 Count Possible Number Pairs

Educational objective:

Count possible number pairs for a given HCF and LCM.

Inputs:

- hcf
- lcm
- orderedPairPolicy or unorderedPairPolicy

Outputs:

- pairCount

Solver topology:

- validate hcf divides lcm
- compute quotient = lcm / hcf
- enumerate or count factor pairs
- retain co-prime multiplier pairs
- apply ordered/unordered policy

Future graph topology:

- input capture
- quotient calculation
- factor-pair count
- co-prime filter
- pair policy adjustment
- answer extraction

Validation requirements:

- ordered/unordered policy must be explicit
- count must align with the stated policy
- hcf and lcm must be compatible

Traceability requirements:

- quotient
- factorPairs or factorPairCount
- coprimePairCount
- pair policy
- answer

Coverage requirements:

- zero invalid-generation cases rejected
- one-pair cases
- multiple-pair cases
- ordered pair doubling where applicable
- square quotient cases

Audit requirements:

- policy coverage
- co-prime filtering coverage
- factor-pair count evidence

## CP-006 Ratio-Based Number Reconstruction

Educational objective:

Find two numbers from their ratio and supplied HCF and/or LCM information.

Inputs:

- ratio
- hcf and/or lcm

Outputs:

- numberPair

Solver topology:

- reduce ratio
- represent numbers as kp and kq
- derive k from HCF or LCM
- if both are supplied, check consistency
- compute final numbers

Future graph topology:

- ratio capture
- ratio reduction
- multiplier derivation
- consistency check if needed
- pair reconstruction
- answer extraction

Validation requirements:

- ratio must contain positive integers
- LCM-based multiplier must divide exactly
- if HCF and LCM are both supplied, both must produce the same multiplier
- generated prompts must avoid impossible ratio-LCM combinations unless the CP asks for validity

Traceability requirements:

- original ratio
- reduced ratio
- multiplier
- hcf or lcm source
- consistency check
- reconstructedPair

Coverage requirements:

- ratio + HCF
- ratio + LCM
- ratio + HCF + LCM
- already reduced ratios
- reducible ratios
- consistency-valid cases

Audit requirements:

- ratio reduction evidence
- multiplier derivation evidence
- HCF/LCM verification for reconstructed pair

## Educational Library Gate

Question language and explanation language are not part of Phase A. Phase B must manually define every approved question stem and every approved explanation template before runtime implementation begins.
