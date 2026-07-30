# NUM-CP-004 Wave 02 — Direct and Inverse Expansion

**Lifecycle:** executable discovery only  
**Permanent QLs:** none  
**Frozen solve modes:** none  
**Production exposure:** disabled

## Purpose

Wave 1 proved the prime/factorisation foundation. Wave 2 expands the still-open direct, inverse and optimisation surface without converting temporary contracts into permanent QLs.

## Temporary contracts

| Prototype | Learner task | Primary engine |
|---|---|---|
| `NUM-CP004-PROT-009` | find the next prime after a given integer | bounded primality search |
| `NUM-CP004-PROT-010` | find the previous prime before a given integer | reverse bounded primality search |
| `NUM-CP004-PROT-011` | identify the least prime divisor of a composite integer | trial division up to square root |
| `NUM-CP004-PROT-012` | reconstruct the unique prime pair with a stated sum | prime-pair enumeration |
| `NUM-CP004-PROT-013` | reconstruct the unique prime pair with a stated difference and bound | constrained prime-pair enumeration |
| `NUM-CP004-PROT-014` | reconstruct a constrained increasing prime triple | bounded triple enumeration |
| `NUM-CP004-PROT-015` | select every listed integer co-prime to a given base | complete candidate-set classification |
| `NUM-CP004-PROT-016` | find the minimum signed adjustment required to reach a prime | two-sided prime-distance optimisation |

## Ownership boundaries

- divisor counts, sums, products and divisor subsets remain in `NUM-CP-005`;
- HCF/LCM target computation remains in `NUM-CP-006`;
- perfect-power completion remains in `NUM-CP-012`;
- arranging or selecting primes as combinatorial objects remains in P&C;
- Euler-totient formula questions remain on advanced-enrichment hold;
- prototype 015 owns explicit bounded candidate-set classification, not formula-led counting over a full interval.

## Required proof

- 8 temporary prototypes;
- 100 deterministic packages per prototype;
- 800 exact packages total;
- independent canonical and verifier calculations;
- all four answer positions per prototype;
- Easy, Medium and Hard coverage per prototype;
- unique four-option MCQs with misconception ancestry;
- complete-set correctness for prototype 015;
- tie-safe optimisation for prototype 016;
- structural and lifecycle audit;
- 24-question English review export.

## Explicitly still open after Wave 2

- statement and claim evaluation;
- data sufficiency;
- factor-tree, table and diagram representations;
- source-saturation gap pass;
- merge/split audit across all temporary contracts;
- permanent QL and solve-mode allocation;
- Hindi and Punjabi localisation;
- Question Studio, Question Bank, test and public activation.
