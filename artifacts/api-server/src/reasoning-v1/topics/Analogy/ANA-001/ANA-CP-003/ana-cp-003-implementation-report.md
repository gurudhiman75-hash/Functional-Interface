# ANA-CP-003 Implementation Report

Status: English runtime implementation complete in source; checked-out execution and editorial review pending.

## Delivered

- 48 QLs: `ANA-QL-061` through `ANA-QL-108`
- 24 numeric rule families
- missing-fourth-term and equivalent-pair-selection modes
- deterministic seeded generation
- typed parameter domains
- safe integer and output bounds
- independent solver
- full eligible-rule matching
- ambiguity rejection against equal-or-simpler competing rules
- four unique options and one correct answer
- worked arithmetic explanations
- 2,400-question exhaustive contract audit (`48 × 50 seeds`)
- exact TypeScript runtime review exporter with 96 samples

## Rule coverage

### Whole-number transformations

- add/subtract/multiply/divide by constants
- multiply/divide followed by addition or subtraction
- square, square plus/minus a constant
- cube and cube plus a constant
- double then square
- halve then square
- multiply by successor or predecessor

### Digit-based transformations

- digit sum
- digit product
- absolute digit difference
- sum of digit squares
- digit product plus digit sum
- digit reversal
- position-sensitive digit operation

## Runtime contracts

Every generated instance must:

- be reproducible for the same QL and seed
- contain bounded positive integer outputs
- avoid non-integral division
- be solved independently by the registered rule
- reject equal-or-simpler alternative explanations
- contain exactly four distinct options
- contain exactly one correct option
- use false but numerically plausible distractors
- provide source and target substitution steps

## Commands

From the repository root:

```powershell
pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Analogy\ANA-001\ANA-CP-003\ana-cp-003.test.ts
pnpm dlx tsx .\artifacts\api-server\src\reasoning-v1\topics\Analogy\ANA-001\ANA-CP-003\export-review.ts
```

Expected review output:

`ANA-CP-003/ana-cp-003-runtime-review.md`

## Remaining before approval

- execute the audit in a checked-out workspace
- inspect any generator failures caused by strict ambiguity rejection
- review the 96 exact runtime samples
- tune weak distractors or overly mechanical stems
- add Hindi and Punjabi stems/explanations after English approval
- wire the checkpoint into the chapter/runtime discovery surface if the parent engine requires explicit registration
