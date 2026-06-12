# Implementation Plan

## Scope

This file defines future implementation requirements only. No runtime is authorized in Phase A.

## Shared Abstractions

Future runtime should use shared rational-number utilities:

- Parse proper fractions, improper fractions, mixed fractions, terminating decimals and recurring decimals.
- Normalize values to numerator/denominator form.
- Reduce fractions using integer HCF.
- Convert between rational and decimal forms when required.
- Preserve exact arithmetic where possible.

## CP-001: Simplify Fraction

**Inputs:** `fraction`  
**Outputs:** `simplifiedFraction`  
**Solver topology:** Compute HCF of numerator and denominator, divide both by HCF.  
**Future graph topology:** capture fraction -> compute HCF -> divide numerator and denominator -> answer.  
**Validation requirements:** Equivalent value and lowest terms.  
**Coverage requirements:** proper fraction, improper fraction, reducible fraction, already simplified fraction.

## CP-002: Convert Improper And Mixed Fractions

**Inputs:** `fractionForm`, `conversionDirection`  
**Outputs:** `convertedFraction`  
**Solver topology:** Use quotient-remainder decomposition or whole-number expansion.  
**Future graph topology:** capture fraction -> identify direction -> apply conversion rule -> answer.  
**Validation requirements:** Converted form must be equivalent to the input value.  
**Coverage requirements:** improper to mixed, mixed to improper, whole-number component present, denominator variation.

## CP-003: Evaluate Fraction Or Decimal Arithmetic Expression

**Inputs:** `expression`  
**Outputs:** `evaluatedRational`  
**Solver topology:** Parse expression, convert operands to exact rational form, evaluate, reduce.  
**Future graph topology:** parse expression -> normalize operands -> apply operations -> reduce -> answer.  
**Validation requirements:** Independent exact rational recomputation.  
**Coverage requirements:** operator type, operand count, mixed fraction, decimal, fraction-decimal mixed.

## CP-004: Compare Or Order Rational Values

**Inputs:** `values`, `orderType` or comparison task  
**Outputs:** `comparisonOrOrder`  
**Solver topology:** Normalize values and compare by cross-multiplication or common denominator.  
**Future graph topology:** capture values -> normalize -> compare -> answer.  
**Validation requirements:** Exact pairwise comparison.  
**Coverage requirements:** fraction-only, decimal-only, mixed rational forms, close comparisons.

## CP-005: Convert Fraction To Decimal

**Inputs:** `fraction`  
**Outputs:** `decimalRepresentation`  
**Solver topology:** Reduce fraction, divide numerator by denominator, identify terminating or recurring representation.  
**Future graph topology:** reduce fraction -> divide -> classify decimal form -> answer.  
**Validation requirements:** Decimal representation must match exact fraction.  
**Coverage requirements:** terminating, recurring, numerator greater than denominator, negative values if later approved.

## CP-006: Convert Decimal To Fraction

**Inputs:** `terminatingDecimal`  
**Outputs:** `fractionRepresentation`  
**Solver topology:** Use place value denominator, reduce fraction.  
**Future graph topology:** capture decimal -> place value denominator -> reduce -> answer.  
**Validation requirements:** Fraction value equals decimal and is simplest.  
**Coverage requirements:** one decimal place, multiple decimal places, decimal greater than 1.

## CP-007: Convert Recurring Decimal To Fraction

**Inputs:** `recurringDecimal`  
**Outputs:** `fractionRepresentation`  
**Solver topology:** Equation shift and subtraction to eliminate recurring part.  
**Future graph topology:** define x -> shift recurring block -> subtract -> solve -> reduce.  
**Validation requirements:** Fraction re-expands to the recurring decimal.  
**Coverage requirements:** pure recurring, mixed recurring, multi-digit repetend, value greater than 1.

## CP-008: Determine Terminating Or Recurring Decimal

**Inputs:** `fraction`  
**Outputs:** `decimalNature`  
**Solver topology:** Reduce denominator and inspect prime factors.  
**Future graph topology:** reduce fraction -> factor denominator -> classify -> answer.  
**Validation requirements:** Denominator factorization independently confirms classification.  
**Coverage requirements:** terminating, recurring, denominator initially unreduced, powers of 2/5.

## CP-009: HCF Or LCM Of Fractions

**Inputs:** `fractions`, `operationType`  
**Outputs:** `hcfOrLcmFraction`  
**Solver topology:** Normalize fractions, apply numerator/denominator HCF-LCM formula.  
**Future graph topology:** reduce fractions -> numerator operation -> denominator operation -> assemble result.  
**Validation requirements:** Result must satisfy fractional HCF/LCM definition and formula.  
**Coverage requirements:** HCF, LCM, two fractions, three fractions, mixed fractions.

## Removed From Scope

Rational number classification is removed from NS-FRACDEC-001 and belongs to future NS-CLASS-001.

## Reuse Requirements

Future implementation should reuse:

- Integer HCF/LCM utilities from NS-HCF-001 and NS-LCM-001 where applicable.
- Prime factorization support from NS-PF-001 for denominator tests.
- Validation, traceability, audit, coverage and human review frameworks already used in Quant V3.

## Phase B Recommendation

Next step: human review of the repaired CP architecture. After approval, create educational libraries with fully human-authored SSC/Banking/Railway-style stems and explanations.

