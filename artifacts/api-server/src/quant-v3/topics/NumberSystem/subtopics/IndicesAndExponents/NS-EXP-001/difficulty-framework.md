# NS-EXP-001 Difficulty Framework

## Difficulty Principle

Difficulty is based on recognition burden and reasoning sequence length, not on formula count. A question is harder when the student must decide which exponent form to use before doing the calculation.

## Easy

Expected reasoning length: 1-2 meaningful transformations.

Allowed CPs:

- CP01 Same-base exponent compression
- CP02 Same-base exponent equation
- CP04 Negative exponent normalization
- CP05 Fractional exponent to root

Typical triggers:

- Same base is visible.
- Only one exponent law is needed.
- Numbers are small.
- Final value is integer or simple fraction.

Representative examples:

- \(2^3 \times 2^4\)
- \(5^{x}=5^6\)
- \(3^{-2}\)
- \(25^{1/2}\)

Reject as too trivial:

- Questions that only ask the name of a law.
- Direct evaluation of \(2^3\), \(3^2\), or similar memory-only powers.
- Any question solved by reading the answer without transformation.

## Moderate

Expected reasoning length: 2-4 meaningful transformations.

Allowed CPs:

- CP03 Common-base transformation and exponent solving
- CP06 Mixed exponent expression simplification
- CP07 Exponential comparison by base alignment
- CP09 Value substitution using a given power relation

Typical triggers:

- Visible bases differ but share a common base.
- Negative or fractional exponents appear with multiplication or division.
- Equation requires transforming one side before comparing exponents.
- Comparison requires rewriting at least one expression.

Representative examples:

- \(8^2 \div 2^3\)
- \(4^x=2^{12}\)
- compare \(8^4\) and \(16^3\)
- if \(2^x=16\), find \(2^{x+3}\)

Reject as too mechanical:

- Same example with only larger numbers and no new reasoning.
- Problems where base conversion is printed inside the question as a hint.

## Hard

Expected reasoning length: 4-6 meaningful transformations.

Allowed CPs:

- CP06 Mixed exponent expression simplification
- CP07 Exponential comparison by base alignment
- CP09 Value substitution using a given power relation

Typical triggers:

- Multiple laws must be sequenced.
- Root conversion and base conversion both appear.
- The expression contains reciprocal movement due to negative exponents.
- The unknown appears inside a transformed composite-base exponent.

Representative examples:

- \(\frac{16^{3/4}}{2^{-1}}\)
- \((9^{1/2})^3 \div 3^2\)
- \(8^{2x-1}=2^{15}\)
- if \(3^a=27\), find \(3^{2a-1}\)

Reject as out of Phase A:

- Logarithmic solving.
- Irrational approximation.
- Exponential equations with summed terms such as \(2^x+2^{x+1}=24\).

## Exam Profile Fit

SSC:

- Strong fit: CP03, CP06, CP07.
- SSC questions often reward fast rewriting into common bases.

Banking:

- Strong fit: CP01, CP03, CP07, CP09.
- Banking variants should be quick, arithmetic-light, and pattern-based.

Railway:

- Strong fit: CP01, CP03, CP04, CP05.
- Prefer direct but not formula-drill expressions.

CDS / NDA / CAPF:

- Strong fit: CP03, CP06, CP07.
- Can include slightly denser expressions if exact values remain clean.

Punjab / State PCS:

- Strong fit: CP01, CP03, CP04, CP05.
- Prefer traditional exponent-law questions with clear numeric bases.
