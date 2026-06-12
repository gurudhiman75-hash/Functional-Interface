# NS-CLASS-001 Canonical Problems

## Discovery Summary

The retained CPs are based on recurring government-exam patterns where the learner must identify or apply a number property. The design merges aggressively where the same property engine and validation rules apply.

Active topology count: 6

## Special Review Decisions

### Even/Odd Determination vs Sign Determination

Decision: keep separate.

Even/odd determination uses parity rules:

- even plus even is even
- odd plus odd is even
- odd plus even is odd
- any product with an even factor is even
- powers preserve or repeat parity based on the base

Sign determination uses sign rules:

- product or quotient sign depends on count of negative factors
- addition and subtraction need magnitude comparison if signs differ
- zero must be handled separately

These have different reasoning paths, solvers and validators. Therefore parity and sign are separate CPs.

### Consecutive, Consecutive Even and Consecutive Odd Integers

Decision: merge into one CP.

All three forms use the same sequence-property topology:

- identify the step size
- express nearby terms
- apply the property requested
- extract the invariant or target value

The difference between consecutive integers, consecutive even integers and consecutive odd integers is a parameter:

- consecutive integers: step size 1
- consecutive even integers: step size 2 with even parity
- consecutive odd integers: step size 2 with odd parity

The reasoning and validator do not change enough to justify separate CPs.

## CP01: Parity Outcome Determination

Topology description:
Questions ask whether a number, expression or operation result is even or odd. The task is to apply parity rules without unnecessary full calculation.

Representative examples:

- Determine whether the sum of two odd numbers is even or odd.
- Find whether \(37 \times 42\) is even or odd.
- If \(n\) is odd, determine whether \(n^2+n\) is even or odd.
- What is the parity of the product of three consecutive integers?

Reasoning structure:

1. Identify the parity of each relevant number or variable.
2. Apply parity rules for addition, subtraction, multiplication or powers.
3. Reduce the expression to even or odd.
4. Return the parity result.

Merged candidates:

- Direct even/odd identification.
- Parity after addition or subtraction.
- Parity after multiplication.
- Parity of powers.
- Parity of simple algebraic expressions.

Rejected candidates:

- Divisibility by 2 digit replacement questions; owned by NS-DIV-001.
- Prime/composite classification; owned by NS-PRM-001.
- Last digit parity questions where the final task is unit digit; owned by NS-LASTDIG-001.

## CP02: Sign Outcome Determination

Topology description:
Questions ask whether the result of an integer expression is positive, negative or zero. The core task is sign reasoning.

Representative examples:

- Determine the sign of \((-3)\times 5\times (-2)\).
- Find whether \((-8)^3\) is positive or negative.
- If \(a<0\) and \(b>0\), determine the sign of \(ab\).
- Determine whether \((-5)^2-30\) is positive, negative or zero.

Reasoning structure:

1. Identify sign of each input or factor.
2. For products and quotients, count negative factors.
3. For powers, use exponent parity when the base is negative.
4. For sums and differences with unlike signs, compare magnitudes if required.
5. Return positive, negative or zero.

Merged candidates:

- Product sign questions.
- Quotient sign questions.
- Negative base with even/odd power.
- Simple expression sign questions.

Rejected candidates:

- Full integer arithmetic where no sign reasoning is required.
- Inequality solving; belongs outside this archetype.
- Exponent simplification; owned by NS-EXP-001.

## CP03: Consecutive Integer Property

Topology description:
Questions use consecutive integers, consecutive even integers or consecutive odd integers and ask for a property such as parity, divisibility, sum, product behavior or a missing term.

Representative examples:

- What is the HCF of two consecutive integers?
- The product of two consecutive integers is always divisible by which number?
- Three consecutive even integers have sum 42. Find the integers.
- Three consecutive odd integers have sum 45. Find the middle integer.

Reasoning structure:

1. Identify the sequence type: consecutive, consecutive even or consecutive odd.
2. Apply the correct step size.
3. Express the terms around a base value or middle value.
4. Apply the requested property.
5. Return the property, integer or classified result.

Merged candidates:

- Consecutive integer properties.
- Consecutive even integer properties.
- Consecutive odd integer properties.
- Sum of consecutive integer forms.
- Product divisibility of consecutive integers.

Rejected candidates:

- General arithmetic progression questions; belongs to sequences/progression domain.
- HCF/LCM computation as final answer; owned by NS-HCF-001 or NS-LCM-001 unless the property is the focus.
- Co-prime-only consecutive number questions already covered by NS-COP-001.

## CP04: Count Integers Satisfying A Property

Topology description:
Questions ask for the number of integers in a range or list satisfying a property such as even, odd, positive, negative, non-negative, divisible by a simple condition, or integer class.

Representative examples:

- How many odd integers lie between 20 and 50?
- Count the positive integers in the list \(-3, 0, 4, 7, -8\).
- How many even numbers are there from 1 to 100?
- Count integers between \(-10\) and 10 that are non-negative.

Reasoning structure:

1. Identify the property to be counted.
2. Identify whether the input is a range or list.
3. Apply range counting or direct filtering.
4. Return the count.

Merged candidates:

- Count even numbers in a range.
- Count odd numbers in a range.
- Count positive or negative integers in a list.
- Count integers satisfying simple classification conditions.

Rejected candidates:

- Count multiples using LCM; owned by NS-LCM-001 when common multiples are involved.
- Count factors; owned by NS-FAC-001.
- Count prime numbers; owned by NS-PRM-001.

## CP05: Integer Classification From Conditions

Topology description:
Questions provide conditions and ask which integer classification must apply. The final answer is a class or category, not a computed arithmetic value.

Representative examples:

- If an integer is divisible by 2, which type of integer is it?
- If \(n^2\) is odd, what can be said about \(n\)?
- If an integer is less than zero, how is it classified?
- If a number is divisible by 2 and greater than zero, identify its class.

Reasoning structure:

1. Read the given conditions.
2. Match each condition to a property.
3. Combine properties when more than one condition is given.
4. Return the most specific valid classification.

Merged candidates:

- Even/odd classification from condition.
- Positive/negative classification from condition.
- Integer class recognition from simple properties.
- Classification based on square or power parity.

Rejected candidates:

- Rational/irrational classification; owned by future classification extension only if surds are involved.
- Prime/composite classification; owned by NS-PRM-001.
- Fraction/decimal conversion; owned by NS-FRACDEC-001.

## CP06: Missing Number From Property Conditions

Topology description:
Questions ask for a missing integer that satisfies one or more property conditions such as parity, sign, consecutive structure or classification.

Representative examples:

- Find the missing number if three consecutive integers are 12, x, 14.
- Choose the value of x so that \(x+5\) is even.
- Find x if x is a negative integer and \(|x|=7\).
- Find the missing odd integer between 23 and 27.

Reasoning structure:

1. Identify all property conditions.
2. Generate or infer possible integer values.
3. Eliminate values that do not satisfy the conditions.
4. Return the unique missing number.

Merged candidates:

- Missing parity value.
- Missing sign value.
- Missing consecutive integer.
- Missing number from a small candidate set.
- Missing integer from combined property clues.

Rejected candidates:

- Missing digit for divisibility; owned by NS-DIV-001.
- Missing number using HCF or LCM; owned by NS-HCF-001, NS-LCM-001 or NS-HL-001.
- Algebraic equation solving with no property reasoning.

## Merged Candidates Summary

- Even/odd direct checks, parity after operations and parity expressions merge into CP01.
- Product sign, quotient sign, negative power sign and zero-result sign questions merge into CP02.
- Consecutive integers, consecutive even integers and consecutive odd integers merge into CP03.
- Range counts and list counts for simple integer properties merge into CP04.
- Property recognition and condition-based integer classification merge into CP05.
- Missing-number questions based on parity, sign, consecutive structure or simple classification merge into CP06.

## Rejected Candidates Summary

- Prime/composite classification: NS-PRM-001.
- Divisibility digit replacement: NS-DIV-001.
- Remainder conditions: NS-REM-001 and NS-REM-002.
- Factor counts and factor properties: NS-FAC-001.
- HCF/LCM calculation: NS-HCF-001 and NS-LCM-001.
- Fraction/decimal/rational conversion: NS-FRACDEC-001.
- Exponent-law simplification: NS-EXP-001.
- General arithmetic progression: future sequence/progression domain.

## Active CP List

1. CP01 Parity Outcome Determination
2. CP02 Sign Outcome Determination
3. CP03 Consecutive Integer Property
4. CP04 Count Integers Satisfying A Property
5. CP05 Integer Classification From Conditions
6. CP06 Missing Number From Property Conditions

Topology count: 6

Recommended next step: human review of the CP set before educational library drafting.
