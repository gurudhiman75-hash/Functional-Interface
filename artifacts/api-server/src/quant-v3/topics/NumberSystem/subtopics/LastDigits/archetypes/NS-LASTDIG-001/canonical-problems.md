# Canonical Problems

## Active CP Set

NS-LASTDIG-001 uses exactly five canonical problems.

## CP-001: Last Digit Of A Power

**Inputs:** `base`, `exponent`  
**Output:** `lastDigit`

Find the last digit of a single power such as \(7^{123}\).

**Educational objective:** Use the last-digit cycle of the base and locate the exponent in that cycle.

**Why distinct:** The learner handles one base and one exponent, with the final answer being a single last digit.

## CP-002: Last Digit Of Product Of Powers

**Inputs:** `powerTerms`  
**Output:** `lastDigit`

Find the last digit of a product such as \(2^{15} \times 3^{17}\).

**Educational objective:** Find the last digit of each power and multiply only those last digits.

**Why distinct:** The answer depends on combining multiple cyclic results through multiplication.

## CP-003: Last Digit Of Repeated Exponential Expression

**Inputs:** `towerExpression`  
**Output:** `lastDigit`

Find the last digit of repeated exponential expressions such as \(3^{3^3}\).

**Educational objective:** Reduce the effective exponent before applying the last-digit cycle.

**Why distinct:** The learner must handle exponent towers rather than a directly given exponent.

## CP-004: Identify Cyclicity Pattern

**Inputs:** `base`  
**Output:** `cyclePattern`

Identify the repeating cycle followed by powers of a given last digit.

**Educational objective:** Recognize and state the cyclicity pattern itself.

**Why distinct:** The final answer is a cycle pattern, not a single last digit.

## CP-005: Missing Exponent Using Last Digit

**Inputs:** `base`, `targetLastDigit`, `options`  
**Output:** `exponent`

Find the exponent from options when a power ends in a given digit.

**Educational objective:** Use the cycle to eliminate wrong exponent choices.

**Why distinct:** The learner works backward from the last digit to a valid exponent.

## Topology Count

Distinct active topology count: 5.

