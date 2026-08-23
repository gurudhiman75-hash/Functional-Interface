# NUM-CP-010 — Wave 01 Discovery Record

**Package:** `NUM-002`  
**Checkpoint:** `NUM-CP-010`  
**Wave:** 01 foundation  
**Permanent QLs:** none  
**Discovery prototypes:** 8

## Purpose

Establish executable decimal digit-structure primitives before inverse/edge/representation expansion. Wave 01 is intentionally broad enough to test ownership and solver topology, but it does not claim source saturation.

## Executable prototypes

| Prototype | Contract | Primary route | Independent verifier |
|---|---|---|---|
| P001 | specified digit → place value | positional multiplier | reconstruct indexed decimal digit |
| P002 | digit-sum total → missing digit | subtract visible digit sum | enumerate x = 0..9 |
| P003 | two-digit reverse difference + digit sum → number | place-value equations | enumerate 11..99 |
| P004 | three-digit reverse difference + outer sum + middle digit → number | outer-digit place-value equations | enumerate 100..999 |
| P005 | column addition → missing units digit | units column + carry check | enumerate x = 0..9 in full equation |
| P006 | column subtraction with borrow → missing units digit | borrowed units column | enumerate x = 0..9 in full equation |
| P007 | palindrome symmetry + digit sum → number | `abba` symmetry | enumerate inner digit 0..9 |
| P008 | consecutive increasing digits + digit sum → number | relative digit equation | enumerate 100..999 |

## Coverage achieved

Wave 01 covers:

- direct place value;
- missing digit from decimal digit aggregate;
- two-digit reversal;
- three-digit reversal;
- carry-aware reconstruction;
- borrow-aware reconstruction;
- palindrome structure;
- relational/consecutive digit reconstruction;
- integer/digit answer semantics;
- ordinary prose, digit-pattern, reversal, column arithmetic and palindrome representations.

## Deliberate non-coverage / next-wave gaps

Wave 02 must investigate at least:

1. inverse place-value reconstruction where number/digit/position is hidden;
2. face value versus place value misconception states;
3. unknown tens/hundreds digit in column arithmetic, including chained carries/borrows;
4. multiplication/division column reconstruction where source-backed and not CP007-led;
5. five/six-digit palindrome and near-palindrome structures;
6. repeated-digit blocks and decimal concatenation when CP003 divisibility is not the governing engine;
7. bounded digit occurrence in intervals;
8. exact number-of-digits tasks without approximate logarithmic ambiguity;
9. one/multiple/no-solution digit equations;
10. least/greatest valid decimal numeral under digit relations;
11. complete valid digit set / number set;
12. statement and Data Sufficiency adapters only after ordinary authorities exist.

## Ownership holds

Do not add to CP010 without explicit audit:

- divisibility-led missing digits → CP003;
- terminal digits of powers → CP009;
- arrangement/formed-number counts → P&C;
- general algebra with incidental digits → Algebra;
- non-decimal bases → CP013;
- mixed digit + independent number-theory engine → CP014 candidate only after ablation.

## Explanation policy

Wave 01 already follows the learner-facing standard adopted after CP008 remediation:

- state the useful digit/place-value idea;
- say what relation will be used;
- show the actual arithmetic or candidate logic;
- end with the concrete answer;
- 2–4 worked steps;
- no generator/governance vocabulary in learner text.

## Gate to Wave 02

Wave 01 may proceed to Wave 02 only after:

- deterministic replay passes;
- independent verifier matches every generated answer;
- options are unique and correctly bound;
- explanations pass depth/length checks;
- all lifecycle gates remain closed;
- reviewer sampling finds no ownership or learner-language defect.

No permanent QL count is proposed at this stage.
