# NS-EXP-001 Canonical Problems

## CP01: Same-Base Exponent Compression

Topology description:
Questions present a product, quotient, or nested power where every term already has the same base. The task is to reduce the expression by operating on exponents.

Representative examples:

- Simplify \(2^5 \times 2^3 \div 2^4\).
- Simplify \(\frac{3^7 \times 3^2}{3^5}\).
- Simplify \((5^2)^3 \div 5^4\).

Reasoning structure:

1. Notice that all terms have the same base.
2. Multiplication adds exponents.
3. Division subtracts exponents.
4. A power raised to another power multiplies exponents.
5. Reduce to one power or a final numeric value if the exponent is small.

Merged candidates:

- Product law only questions.
- Quotient law only questions.
- Power-of-power only questions.
- Expressions mixing product and quotient but already same-base.

Rejected candidates:

- Direct formula recall such as "state the law of exponents".
- Questions where bases must first be transformed; those belong to CP03.
- Questions with negative or fractional exponents as the main difficulty; those belong to CP04 or CP05.

## CP02: Same-Base Exponent Equation

Topology description:
Both sides already share the same base, and the unknown is in the exponent. The solution comes from equating exponents.

Representative examples:

- If \(2^x = 2^7\), find \(x\).
- If \(3^{x+2}=3^8\), find \(x\).
- If \(5^{2x-1}=5^9\), find \(x\).

Reasoning structure:

1. Notice that the bases are the same and positive.
2. Equal powers of the same base have equal exponents.
3. Equate the exponent expressions.
4. Solve the resulting linear equation.
5. Check by substituting the exponent back.

Merged candidates:

- Missing exponent forms.
- Linear exponent equations.
- One-side simplified same-base equations.

Rejected candidates:

- Equations needing base conversion first; those belong to CP03.
- Nonlinear exponent equations.
- Equations with multiple possible bases or logarithmic reasoning.

## CP03: Common-Base Transformation And Exponent Solving

Topology description:
Terms have different visible bases, but the bases are powers of a common smaller base. The question is solved by rewriting them under one base, then simplifying, comparing, or solving the exponent relation.

Representative examples:

- Simplify \(8^3 \div 2^5\).
- Simplify \(27^2 \div 3^4\).
- Compare \(4^5\) and \(2^{11}\).
- Compare \(8^4\) and \(16^3\).
- Find \(x\) if \(27^2 = 3^x\).
- Find \(x\) if \(4^x = 2^{10}\).
- Find \(x\) if \(9^{x+1}=3^8\).
- Find \(x\) if \(8^{2x}=2^{12}\).

Reasoning structure:

1. Recognize composite bases as powers of a smaller base.
2. Rewrite every term using the same base.
3. Use power-of-power multiplication during rewriting.
4. Continue with exponent simplification, exponent comparison, or exponent equation solving.
5. If an unknown exponent remains, equate the final exponent expressions and solve.

Merged candidates:

- \(4,8,16,32\) to base \(2\).
- \(9,27,81\) to base \(3\).
- \(25,125,625\) to base \(5\).
- Comparison, simplification, and missing exponent forms where the main step is common-base conversion.
- Equations such as \(4^x=2^{10}\), \(9^{x+1}=3^8\), \(8^{2x}=2^{12}\), and \(27^2=3^x\).

Rejected candidates:

- Already same-base problems; CP01 or CP02.
- Prime factorization across unrelated bases; outside Phase A unless a common base is obvious.
- Unit digit or cyclicity problems.
- Equations with addition of exponential terms.
- Equations needing logarithmic methods.

## CP04: Negative Exponent Normalization

Topology description:
The question contains negative exponents. The core step is converting them into reciprocals before simplifying.

Representative examples:

- Simplify \(2^{-3}\).
- Simplify \(\frac{3^{-2}}{3^{-5}}\).
- Simplify \(5^3 \times 5^{-1}\).

Reasoning structure:

1. Identify negative exponents.
2. Convert \(a^{-n}\) into \(\frac{1}{a^n}\) when needed.
3. If same-base terms remain, combine exponents carefully.
4. Avoid treating the negative exponent as a negative value.
5. Present the answer as a positive exponent, fraction, or clean integer.

Merged candidates:

- Single negative exponent.
- Same-base operations with negative exponents.
- Reciprocal forms such as \(\frac{1}{2^n}\).

Rejected candidates:

- Negative bases with odd/even exponent sign behavior; that is a separate signed-number topology.
- Decimal reciprocal drills with no exponent reasoning.

## CP05: Fractional Exponent To Root

Topology description:
The question contains fractional exponents that represent roots, or roots that can be converted into fractional exponents.

Representative examples:

- Simplify \(16^{1/2}\).
- Simplify \(27^{1/3}\).
- Simplify \(81^{3/4}\).

Reasoning structure:

1. Read the denominator of the exponent as the root.
2. Read the numerator as the power.
3. Take the root first when it keeps numbers small.
4. Raise the simplified root to the numerator power.
5. Verify the final value by reversing the operation mentally.

Merged candidates:

- Square-root exponent forms.
- Cube-root exponent forms.
- Root followed by power forms such as \(a^{m/n}\).
- Radical notation that converts directly to fractional exponent notation.

Rejected candidates:

- Advanced surd rationalization.
- Irrational final values.
- Fractional exponent equations requiring logarithms.

## CP06: Mixed Exponent Expression Simplification

Topology description:
The expression combines several exponent laws: base conversion, product/quotient, negative exponents, and sometimes fractional exponents. The task is not one law but sequencing the laws correctly.

Representative examples:

- Simplify \(\frac{8^2 \times 2^{-3}}{4}\).
- Simplify \((9^{1/2})^3 \div 3^2\).
- Simplify \(\frac{16^{3/4}}{2^{-1}}\).

Reasoning structure:

1. Convert visible bases into convenient common bases or root forms.
2. Normalize negative or fractional exponents.
3. Combine same-base powers.
4. Reduce to the cleanest exact value.
5. Check the sign and reciprocal position.

Merged candidates:

- Multi-law simplification without an equation.
- Expressions with one common base plus negative exponents.
- Expressions with one root conversion plus same-base compression.

Rejected candidates:

- Long algebraic symbolic simplifications.
- Expressions whose difficulty is arithmetic bulk rather than exponent reasoning.
- Problems requiring logarithms or approximation.

## CP07: Exponential Comparison By Base Alignment

Topology description:
Two or more exponential expressions must be compared. The repeated exam pattern is to rewrite bases or exponents so the comparison is direct.

Representative examples:

- Which is greater: \(2^{10}\) or \(4^5\)?
- Arrange \(3^4, 9^2, 27^1\) in increasing order.
- Compare \(8^4\) and \(16^3\).

Reasoning structure:

1. Look for a common base among the expressions.
2. Rewrite composite bases as powers of that base.
3. Compare exponents when bases match.
4. If exponents match instead, compare bases.
5. State the ordering or greater expression.

Merged candidates:

- Greater-than comparison.
- Increasing/decreasing order.
- Equal-value identification.

Rejected candidates:

- Unit digit comparison.
- Approximation-heavy comparison.
- Exponential inequalities with variables.

## CP09: Value Substitution Using A Given Power Relation

Topology description:
The question gives one exponential value or relation and asks for another expression that can be rewritten in terms of the given value.

Representative examples:

- If \(2^x=8\), find \(2^{x+2}\).
- If \(3^a=9\), find \(3^{a-1}\).
- If \(5^x=25\), find \(5^{2x}\).

Reasoning structure:

1. Use the given power relation as an anchor.
2. Rewrite the asked expression using that anchor.
3. For added exponents, multiply by the extra power of the base.
4. For subtracted exponents, divide by the missing power of the base.
5. For multiplied exponents, raise the given value to the required power.

Merged candidates:

- \(a^{x+k}\), \(a^{x-k}\), and \(a^{mx}\) from a known \(a^x\).
- Simple substitution where no logarithm is needed.
- Value transformation without solving for \(x\) explicitly.

Rejected candidates:

- Directly asking for \(x\) when the value already reveals it; CP02 or CP03.
- Word problems where the exponent relation is incidental.
- Compound interest or growth contexts.
