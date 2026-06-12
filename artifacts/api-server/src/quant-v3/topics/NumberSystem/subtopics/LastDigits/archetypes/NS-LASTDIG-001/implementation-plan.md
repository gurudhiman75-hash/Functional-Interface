# Implementation Plan

## Scope

This file describes future runtime behavior. It does not implement runtime.

## Shared Abstraction

Future runtime should use a shared last-digit cycle abstraction:

- Reduce base to its last digit.
- Load the cycle for that digit.
- Convert exponent to a cycle position.
- Return the selected digit.

## CP-001: Last Digit Of A Power

**Educational objective:** Find the last digit of one power.  
**Inputs:** `base`, `exponent`  
**Output:** `lastDigit`  
**Solver topology:** Direct cycle lookup.  
**Future graph topology:** Base last digit -> cycle -> exponent position -> answer.  
**Validation requirements:** Positive integer base and exponent.  
**Coverage requirements:** Cycle length and exponent magnitude.  
**Audit requirements:** Cycle length, exponent band, QL ID, ES ID, MathJax usage.

## CP-002: Last Digit Of Product Of Powers

**Educational objective:** Combine last digits from multiple powers.  
**Inputs:** `powerTerms`  
**Output:** `lastDigit`  
**Solver topology:** Last digit of each term, then product last digit.  
**Future graph topology:** Each term cycle -> term last digit -> product last digit.  
**Validation requirements:** At least two power terms.  
**Coverage requirements:** Two powers, three powers, mixed cycles, same cycle family.  
**Audit requirements:** Term count, cycle mix, QL ID, ES ID, MathJax usage.

## CP-003: Last Digit Of Repeated Exponential Expression

**Educational objective:** Reduce an exponent tower for last-digit cyclicity.  
**Inputs:** `towerExpression`  
**Output:** `lastDigit`  
**Solver topology:** Determine effective exponent position, then apply base cycle.  
**Future graph topology:** Tower expression -> reduced exponent -> cycle position -> answer.  
**Validation requirements:** Approved tower forms only.  
**Coverage requirements:** Small, medium and large towers; tower reduction required.  
**Audit requirements:** Tower size, reduction status, QL ID, ES ID, MathJax usage.

## CP-004: Identify Cyclicity Pattern

**Educational objective:** State the repeating cycle for powers of a base.  
**Inputs:** `base`  
**Output:** `cyclePattern`  
**Solver topology:** Cycle identification by last digit.  
**Future graph topology:** Base last digit -> generated powers -> repeated cycle.  
**Validation requirements:** Positive integer base.  
**Coverage requirements:** Cycle length 1, 2 and 4; pattern recognition.  
**Audit requirements:** Cycle family, QL ID, ES ID, MathJax usage.

## CP-005: Missing Exponent Using Last Digit

**Educational objective:** Work backward from target last digit to a valid exponent.  
**Inputs:** `base`, `targetLastDigit`, `options`  
**Output:** `exponent`  
**Solver topology:** Reverse cycle-position lookup and option elimination.  
**Future graph topology:** Target digit -> valid cycle positions -> option check -> answer.  
**Validation requirements:** Exactly one valid option unless explicitly designed otherwise.  
**Coverage requirements:** Single valid exponent, distractors, cycle inference, option elimination.  
**Audit requirements:** Option count, valid-option count, QL ID, ES ID, MathJax usage.

## Reuse

Future implementation should reuse:

- Pattern System V2
- Traceability Framework
- Validation Framework
- Coverage Framework
- Human Review Framework
- Audit Framework

No runtime API or solver code is defined in this package.

