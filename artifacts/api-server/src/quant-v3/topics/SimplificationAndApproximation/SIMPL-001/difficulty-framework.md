# SIMPL-001 Difficulty Framework

## Difficulty Philosophy

Difficulty is driven by expression structure, number size, operation count, conversion burden, and approximation ambiguity. A CP does not become a new topology merely because the numbers are larger.

## Easy

Typical features:

- One or two operations
- Small integers
- Simple fractions with common denominators
- Terminating decimals with one decimal place
- Perfect square roots and cube roots
- Small powers
- Approximation to nearest ten or hundred
- Clearly separated answer options

Expected learner burden:
Basic operation order and direct computation.

## Medium

Typical features:

- Three or four operations
- Brackets or nested arithmetic
- Fractions with unlike denominators
- Decimal multiplication or division
- Mixed fraction and decimal conversion
- Root and power combinations
- Approximation with two or more rounded values
- Close but still distinguishable options

Expected learner burden:
Controlled multi-step simplification with conversion or rounding.

## Hard

Typical features:

- Multiple operations with brackets
- Mixed rational formats
- Fraction division or compound fraction expressions
- Decimal expressions with division and multiplication
- Several roots or powers in one expression
- Approximation with percentages, products, or quotients
- Options close enough to require careful estimation

Expected learner burden:
Accurate sequencing, form conversion, and careful option comparison.

## CP Difficulty Drivers

| CP | Easy | Medium | Hard |
| --- | --- | --- | --- |
| CP-001 BODMAS Exact Simplification | Small expressions, no brackets | Brackets, three or four operations | Nested brackets, several operations |
| CP-002 Fraction Expression Simplification | Same denominator or single operation | Unlike denominators, multiplication | Division, compound operations |
| CP-003 Decimal Expression Simplification | One-decimal addition or subtraction | Decimal multiplication or division | Multi-step decimal BODMAS |
| CP-004 Mixed Fraction And Decimal Simplification | One conversion and one operation | Multiple conversions | Mixed-number, fraction, and decimal BODMAS |
| CP-005 Root And Power Expression Simplification | Direct roots or small powers | Root-power combinations | Multi-step root-power arithmetic |
| CP-006 Approximation By Rounding | One rounded value | Two rounded values | Percent, product, quotient, or multi-rounding |
| CP-007 Closest Or Nearest Value Selection | Options far apart | Options moderately close | Close options requiring careful estimation |

## Global Difficulty Coverage Requirements

Future libraries should cover:

- exact simplification
- approximate simplification
- integers
- fractions
- decimals
- mixed rational expressions
- roots
- powers
- option-based nearest values

Each CP should support Easy, Medium, and Hard unless human review later narrows a CP for exam realism.
