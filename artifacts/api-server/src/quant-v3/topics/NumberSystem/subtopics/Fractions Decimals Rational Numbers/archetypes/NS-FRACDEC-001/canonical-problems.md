# Canonical Problems

## Discovery Principle

The CP set is based on recurring exam topologies, not school-chapter labels. Equivalent variants are merged aggressively, but only when the learner task and reasoning topology are genuinely the same.

## Active CP List

| CP | Name | Output |
| --- | --- | --- |
| CP-001 | Simplify Fraction | simplifiedFraction |
| CP-002 | Convert Improper And Mixed Fractions | convertedFraction |
| CP-003 | Evaluate Fraction Or Decimal Arithmetic Expression | evaluatedRational |
| CP-004 | Compare Or Order Rational Values | comparisonOrOrder |
| CP-005 | Convert Fraction To Decimal | decimalRepresentation |
| CP-006 | Convert Decimal To Fraction | fractionRepresentation |
| CP-007 | Convert Recurring Decimal To Fraction | fractionRepresentation |
| CP-008 | Determine Terminating Or Recurring Decimal | decimalNature |
| CP-009 | HCF Or LCM Of Fractions | hcfOrLcmFraction |

Topology count: 9.

## CP-001: Simplify Fraction

**Topology description:** Reduce a proper or improper fraction to lowest terms using HCF reduction.

**Examples:**

- Simplify 36/48.
- Reduce 84/126 to lowest terms.
- Express 45/60 in simplest form.

**Reasoning:** Use HCF reduction only. Divide numerator and denominator by their HCF.

**Coverage:**

- proper fraction
- improper fraction
- reducible fraction
- already simplified fraction

**Why variants belong together:** Proper and improper fractions both use the same HCF-reduction topology when the output is a simplified fraction.

**Merged candidates:**

- Proper fraction simplification.
- Improper fraction simplification.
- Already simplified fraction recognition.

**Rejected candidates:** Mixed fraction conversion is removed from this CP because it uses quotient-remainder decomposition rather than HCF reduction.

## CP-002: Convert Improper And Mixed Fractions

**Topology description:** Convert between improper fractions and mixed fractions.

**Examples:**

- Convert 17/5 into a mixed fraction.
- Convert 3 2/5 into an improper fraction.
- Express 29/6 as a mixed fraction.

**Reasoning:** Use quotient-remainder decomposition for improper-to-mixed conversion and whole-part expansion for mixed-to-improper conversion.

**Coverage:**

- improper to mixed
- mixed to improper
- whole-number component present
- denominator variation

**Why variants belong together:** Both directions convert between the same two equivalent fraction forms and require tracking whole part, numerator and denominator.

**Merged candidates:**

- Improper fraction to mixed fraction.
- Mixed fraction to improper fraction.

**Rejected candidates:** Fraction simplification remains CP-001 because the reasoning is HCF reduction, not quotient-remainder decomposition.

## CP-003: Evaluate Fraction Or Decimal Arithmetic Expression

**Topology description:** Evaluate arithmetic expressions involving fractions, mixed fractions or decimals.

**Examples:**

- Evaluate 3/4 + 5/6.
- Simplify 2 1/3 - 1 5/6.
- Calculate 4.25 x 1.2.
- Evaluate 3/5 + 0.75.

**Why variants belong together:** Addition, subtraction, multiplication and division are all expression-evaluation tasks. The answer is a final rational value.

**Merged candidates:**

- Fraction addition and subtraction.
- Fraction multiplication and division.
- Mixed-fraction arithmetic.
- Decimal arithmetic.
- Mixed fraction-decimal arithmetic.

**Rejected candidates:** Separate CPs by operator are rejected because operator choice is a difficulty/coverage variable, not a distinct final topology.

## CP-004: Compare Or Order Rational Values

**Topology description:** Compare two or more rational values and identify the larger/smaller value or arrange values in order.

**Examples:**

- Which is greater: 5/7 or 7/10?
- Arrange 2/3, 0.7 and 5/8 in ascending order.
- Find the smallest among 3/5, 0.58 and 7/12.

**Why variants belong together:** Pairwise comparison and ordering both require converting rational values to a common basis.

**Merged candidates:**

- Compare two fractions.
- Compare decimals.
- Compare fraction and decimal.
- Arrange rational values in ascending or descending order.

**Rejected candidates:** Separate ascending and descending CPs are rejected because output ordering direction is a parameter.

## CP-005: Convert Fraction To Decimal

**Topology description:** Convert a fraction into its decimal representation.

**Examples:**

- Convert 3/8 into decimal form.
- Express 5/6 as a decimal.

**Why variants belong together:** Terminating and recurring outputs are both decimal representations of a fraction.

**Merged candidates:**

- Fraction to terminating decimal.
- Fraction to recurring decimal.

**Rejected candidates:** A separate recurring-output conversion CP is rejected because the input-output direction remains fraction to decimal. Recurring behavior is coverage.

## CP-006: Convert Decimal To Fraction

**Topology description:** Convert a terminating decimal into a fraction in simplest form.

**Examples:**

- Convert 0.75 into a fraction.
- Express 2.125 as a fraction.

**Why variants belong together:** Whole-number plus decimal, decimal less than 1, and multi-place decimals all convert by place value and simplification.

**Merged candidates:**

- One-place decimal to fraction.
- Multi-place decimal to fraction.
- Decimal greater than 1 to fraction.

**Rejected candidates:** Separate CPs by decimal-place count are rejected because decimal-place count is a difficulty variable.

## CP-007: Convert Recurring Decimal To Fraction

**Topology description:** Convert pure or mixed recurring decimals into fractions.

**Examples:**

- Convert 0.333... into a fraction.
- Convert 0.1 recurring 6 into a fraction.
- Convert 2.47 recurring into a fraction.

**Why variants belong together:** Pure recurring and mixed recurring decimals use the same equation-shift topology: eliminate the recurring block and solve for the fraction.

**Merged candidates:**

- Pure recurring decimal to fraction.
- Mixed recurring decimal to fraction.
- Recurring decimal greater than 1 to fraction.

**Rejected candidates:** This is not merged into CP-006 because terminating decimal conversion uses place value only, while recurring conversion requires recurrence elimination.

## CP-008: Determine Terminating Or Recurring Decimal

**Topology description:** Determine whether the decimal expansion of a fraction terminates or recurs.

**Examples:**

- Does 7/20 have a terminating decimal?
- Determine whether 5/12 is terminating or recurring.
- Find whether 13/125 terminates.

**Why variants belong together:** All variants reduce the denominator and inspect prime factors.

**Merged candidates:**

- Terminating decimal test.
- Recurring decimal test.
- Number of terminating decimal places as an extension.

**Rejected candidates:** Converting the fraction into decimal is CP-005. This CP asks for the nature of the decimal, not the decimal value.

## CP-009: HCF Or LCM Of Fractions

**Topology description:** Compute HCF or LCM of fractional numbers using numerator and denominator HCF/LCM relationships.

**Examples:**

- Find the HCF of 2/3, 4/9 and 8/15.
- Find the LCM of 3/5, 6/25 and 9/10.

**Why variants belong together:** HCF and LCM of fractions are paired operations using the same rational-number decomposition.

**Merged candidates:**

- HCF of fractions.
- LCM of fractions.
- HCF/LCM of mixed fractions after conversion.

**Rejected candidates:** Integer HCF and LCM remain owned by NS-HCF-001 and NS-LCM-001. This CP is retained only because fractional HCF/LCM uses a distinct formula and appears in exam materials.

## Removed Topology

### Classify Rational Number

Status: Removed.

Reason: Classification ownership belongs to future NS-CLASS-001. NS-FRACDEC-001 may manipulate rational forms, but it does not own rational vs irrational, natural, whole, integer or real-number classification as a final task.

## Merged Candidates

| Candidate | Resolution |
| --- | --- |
| Proper fraction simplification | Merged into CP-001. |
| Improper fraction simplification | Merged into CP-001. |
| Improper fraction to mixed fraction | Merged into CP-002. |
| Mixed fraction to improper fraction | Merged into CP-002. |
| Fraction addition | Merged into CP-003. |
| Fraction subtraction | Merged into CP-003. |
| Fraction multiplication | Merged into CP-003. |
| Fraction division | Merged into CP-003. |
| Decimal arithmetic | Merged into CP-003. |
| Compare two fractions | Merged into CP-004. |
| Arrange rational numbers | Merged into CP-004. |
| Fraction to terminating decimal | Merged into CP-005. |
| Fraction to recurring decimal | Merged into CP-005. |
| One-place decimal to fraction | Merged into CP-006. |
| Multi-place decimal to fraction | Merged into CP-006. |
| Pure recurring decimal to fraction | Merged into CP-007. |
| Mixed recurring decimal to fraction | Merged into CP-007. |
| HCF of fractions | Merged into CP-009. |
| LCM of fractions | Merged into CP-009. |

## Rejected Candidates

| Candidate | Reason |
| --- | --- |
| Percentage conversion | Belongs to percentage or ratio-percentage archetypes. |
| Ratio and proportion word problems | Belongs to ratio/proportion, not rational-number form handling. |
| Integer HCF/LCM | Already covered by NS-HCF-001 and NS-LCM-001. |
| Prime factorization as final answer | Already covered by NS-PF-001. |
| Rational vs irrational classification | Belongs to future NS-CLASS-001. |
| Natural, whole, integer or real-number classification | Belongs to future NS-CLASS-001. |
| Algebraic rational expressions | Algebra domain, not Number System rational-number arithmetic. |

