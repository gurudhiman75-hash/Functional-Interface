# NS-SURD-001 Canonical Problems

## CP01: Perfect-Power Extraction From A Surd

Topology description:
The expression contains a square root or cube root whose radicand has a removable perfect square or perfect cube factor. The task is to extract the perfect-power part and leave the remaining factor inside the radical.

Representative examples:

- Simplify \(\sqrt{72}\).
- Simplify \(\sqrt{200}\).
- Simplify \(\sqrt[3]{54}\).
- Simplify \(\sqrt[3]{250}\).

Reasoning structure:

1. Identify the root type.
2. Split the radicand into the largest extractable perfect power and the remaining factor.
3. Take the root of the perfect-power part.
4. Keep the remaining factor inside the radical.
5. Write the simplified surd.

Merged candidates:

- Square-root simplification.
- Cube-root simplification.
- Extraction of perfect squares.
- Extraction of perfect cubes.
- Forms such as \(\sqrt{a^2b}\) and \(\sqrt[3]{a^3b}\).

Rejected candidates:

- Pure arithmetic roots such as \(\sqrt{49}\) where no surd remains.
- Approximation of square roots.
- Nested radicals.

## CP02: Like-Surd Addition And Subtraction

Topology description:
The expression contains surd terms that become like surds either immediately or after simplification. The task is to combine their rational coefficients.

Representative examples:

- Simplify \(3\sqrt{2}+5\sqrt{2}\).
- Simplify \(7\sqrt{3}-2\sqrt{3}\).
- Simplify \(\sqrt{50}+2\sqrt{8}\).
- Simplify \(5\sqrt{12}-2\sqrt{27}\).

Reasoning structure:

1. Simplify each surd term first if needed.
2. Check which terms have the same radical part.
3. Add or subtract only the coefficients of like surds.
4. Leave unlike surds separate.
5. Write the final expression in simplified form.

Merged candidates:

- Addition of like surds.
- Subtraction of like surds.
- Like-surd combination after extraction.
- Expressions with one unlike term left over.

Rejected candidates:

- Multiplication of surds; CP03.
- Long algebraic expressions with variables.
- Questions where terms are unlike and no operation is possible except restating.

## CP03: Surd Multiplication And Division Simplification

Topology description:
The expression multiplies or divides surds, and the result can be simplified by combining radicands and extracting perfect powers.

Representative examples:

- Simplify \(\sqrt{3}\times\sqrt{12}\).
- Simplify \(\sqrt{18}\times\sqrt{8}\).
- Simplify \(\frac{\sqrt{75}}{\sqrt{3}}\).
- Simplify \(\frac{\sqrt[3]{128}}{\sqrt[3]{2}}\).

Reasoning structure:

1. Confirm that the radicals have compatible root types.
2. Multiply or divide the radicands.
3. Simplify the resulting radical.
4. Extract any perfect-power factor.
5. Write the clean final value or surd.

Merged candidates:

- Multiplication of square-root surds.
- Division of square-root surds.
- Multiplication or division of cube-root surds with the same root index.
- Product or quotient followed by extraction.

Rejected candidates:

- Addition or subtraction of surds; CP02.
- Division by a denominator requiring rationalization; CP06 or CP07.
- Mixed radical indices without an exam-level common conversion.

## CP04: Mixed Surd Expression Simplification

Topology description:
The expression combines more than one surd operation. It may require extraction, multiplication or division, and then addition or subtraction of like surds.

Representative examples:

- Simplify \(\sqrt{18}+2\sqrt{8}-\sqrt{50}\).
- Simplify \(3\sqrt{12}-\sqrt{27}+\sqrt{75}\).
- Simplify \(\sqrt{6}\times\sqrt{24}-2\sqrt{9}\).
- Simplify \(\frac{\sqrt{48}}{\sqrt{3}}+\sqrt{27}\).

Reasoning structure:

1. Simplify each radical or radical operation in the expression.
2. Convert products or quotients into simpler surds or integers.
3. Identify like radical parts.
4. Combine coefficients of like surds.
5. Keep unlike simplified surds separate.

Merged candidates:

- Multi-term simplification.
- Mixed arithmetic with surds.
- Simplification followed by like-surd collection.
- Expressions with both integer and surd outputs.

Rejected candidates:

- Single-operation questions that belong to CP01, CP02, or CP03.
- Rationalization-focused questions; CP06 or CP07.
- Long symbolic identities.

## CP05: Surd Comparison By Normalization

Topology description:
Two or more surd expressions must be compared or arranged. The repeated exam method is to normalize the expressions so their sizes can be compared safely.

Representative examples:

- Which is greater, \(\sqrt{45}\) or \(3\sqrt{5}\)?
- Compare \(2\sqrt{3}\) and \(3\sqrt{2}\).
- Arrange \(\sqrt{18}\), \(2\sqrt{5}\), and \(3\sqrt{2}\) in increasing order.
- Which is smaller, \(\sqrt[3]{54}\) or \(3\sqrt[3]{2}\)?

Reasoning structure:

1. Simplify the surds if possible.
2. If radical parts match, compare coefficients.
3. If radical parts differ, compare by squaring or cubing both positive expressions when safe.
4. Preserve the comparison direction because values are positive.
5. State the greater, smaller, or ordered result.

Merged candidates:

- Greater-than comparison.
- Smaller-than comparison.
- Increasing or decreasing order.
- Equality identification after simplification.

Rejected candidates:

- Decimal approximation-only comparison.
- Negative surd comparison requiring sign-case handling.
- Advanced inequality proof.

## CP06: Monomial Denominator Rationalization

Topology description:
The denominator is a single surd term. The task is to remove the radical from the denominator by multiplying by the needed radical factor.

Representative examples:

- Rationalize \(\frac{1}{\sqrt{2}}\).
- Rationalize \(\frac{5}{\sqrt{3}}\).
- Simplify \(\frac{6}{2\sqrt{5}}\).
- Rationalize \(\frac{4}{\sqrt[3]{2}}\).

Reasoning structure:

1. Identify the radical in the denominator.
2. Choose the factor that turns the denominator into a rational number.
3. Multiply numerator and denominator by that factor.
4. Simplify the denominator.
5. Reduce any rational coefficient if possible.

Merged candidates:

- Rationalization of \(1/\sqrt{a}\).
- Rationalization of \(k/\sqrt{a}\).
- Rationalization with a rational coefficient in the denominator.
- Simple cube-root monomial denominators.

Rejected candidates:

- Binomial denominators; CP07.
- Denominators already rational.
- Expressions where the task is only division of surds; CP03.

## CP07: Binomial Denominator Rationalization

Topology description:
The denominator has two terms, usually one rational term and one surd term or two surd terms. The task is to multiply by the conjugate so the denominator becomes rational.

Representative examples:

- Rationalize \(\frac{1}{2+\sqrt{3}}\).
- Rationalize \(\frac{5}{3-\sqrt{2}}\).
- Simplify \(\frac{2}{\sqrt{5}+\sqrt{3}}\).
- Rationalize \(\frac{1}{\sqrt{7}-2}\).

Reasoning structure:

1. Identify the binomial denominator.
2. Write its conjugate by changing the sign between the two terms.
3. Multiply numerator and denominator by the conjugate.
4. Use the difference-of-squares pattern in the denominator.
5. Simplify the final expression.

Merged candidates:

- Denominators of the form \(a+\sqrt{b}\).
- Denominators of the form \(a-\sqrt{b}\).
- Denominators of the form \(\sqrt{a}+\sqrt{b}\).
- Denominators of the form \(\sqrt{a}-\sqrt{b}\).

Rejected candidates:

- Monomial denominators; CP06.
- Three-term denominators.
- Advanced conjugate chains or nested radical denominators.

## CP08: Surd Identity Evaluation

Topology description:
The expression resembles a standard algebraic identity involving surds. The primary task is to recognize the identity before expanding or simplifying.

Representative examples:

- Simplify \((\sqrt{3}+\sqrt{2})^2\).
- Simplify \((\sqrt{7}-\sqrt{5})^2\).
- Evaluate \((\sqrt{11}+\sqrt{6})(\sqrt{11}-\sqrt{6})\).
- Simplify \((2+\sqrt{3})^2\).
- Evaluate \((3-\sqrt{5})(3+\sqrt{5})\).

Reasoning structure:

1. Identify whether the expression matches \((a+b)^2\), \((a-b)^2\), or \((a+b)(a-b)\).
2. Apply the identity directly.
3. Simplify square-root squares into rational numbers.
4. Simplify the middle surd term if present.
5. Combine rational terms and write the final expression.

Merged candidates:

- Square of a surd binomial.
- Product of conjugates.
- Identity-based simplification with one rational and one surd term.
- Evaluation where identity recognition is the main solving method.

Rejected candidates:

- General mixed surd arithmetic without identity recognition; CP04.
- Denominator rationalization using conjugates; CP07.
- Long algebraic expansions with variables.
- Three-term square identities.
