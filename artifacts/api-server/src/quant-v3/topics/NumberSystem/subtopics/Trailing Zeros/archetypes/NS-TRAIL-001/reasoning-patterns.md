# NS-TRAIL-001 Reasoning Patterns

## Pattern 1: Factorial Factor-Of-5 Count

Applies to:

- CP-001

Steps:

1. Recognize that each trailing zero needs one factor 10.
2. Use 10 = 2 x 5.
3. In n!, count factors of 5.
4. Add floor(n / 5), floor(n / 25), floor(n / 125), and so on.
5. Return the total.

Required future evidence:

- factorFiveCountLatex
- answer

## Pattern 2: Factorial Expression Contribution

Applies to:

- CP-002

Steps:

1. Break the expression into factorial terms.
2. Count factor-of-5 contribution from each numerator factorial.
3. Subtract factor-of-5 contribution from denominator factorials.
4. Account for cancellation.
5. Return the trailing-zero count.

Required future evidence:

- factorialExpressionLatex
- answer

## Pattern 3: Reverse Factorial Zero Search

Applies to:

- CP-003

Steps:

1. Use the factorial trailing-zero formula.
2. Check values around multiples of 5.
3. Find the smallest n whose zero count matches the target.
4. If future runtime supports impossible cases, distinguish nearest below and nearest above.

Required future evidence:

- searchProcessLatex
- zeroCount
- answer

## Pattern 4: Power Factor Pair Count

Applies to:

- CP-004

Steps:

1. Prime-factorize the base.
2. Multiply prime exponents by the given exponent.
3. Count total factors of 2 and 5.
4. The trailing-zero count is the smaller count.

Required future evidence:

- powerFactorizationLatex
- answer

## Pattern 5: Product Factor Pair Count

Applies to:

- CP-005

Steps:

1. Prime-factorize numberA and numberB.
2. Add their counts of factors 2 and 5.
3. Count complete pairs of 2 and 5.
4. The smaller total determines the number of trailing zeros.

Required future evidence:

- productFactorizationLatex
- answer
