# Reasoning Patterns

## RP-001: Direct Digit Count

Count digits directly or use the range \(10^{d-1}\) to \(10^d-1\).

Used by: CP-001.

## RP-002: Power Digit Formula

Use:

\[
\lfloor n\log_{10}a \rfloor+1
\]

Used by: CP-002.

## RP-003: Product Log Sum

Add logarithms of the factors, apply floor, then add 1.

Used by: CP-003.

## RP-004: N-Digit Boundary Construction

Use \(10^{n-1}\) for the smallest n-digit number and \(10^n-1\) for the largest.

Used by: CP-004.

## RP-005: Reverse Digit-Count Relation

Use digit-count bounds to solve for the missing exponent.

Used by: CP-005.

## Future MathJax Evidence

Future runtime should expose:

- `digitCountFormulaLatex`
- `logarithmExpansionLatex`
- `productDigitFormulaLatex`
- `nDigitNumberFormulaLatex`
- `exponentDigitFormulaLatex`

