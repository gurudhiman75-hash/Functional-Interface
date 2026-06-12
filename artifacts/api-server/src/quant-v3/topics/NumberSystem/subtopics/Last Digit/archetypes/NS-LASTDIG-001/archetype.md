# NS-LASTDIG-001

## Archetype

**ID:** NS-LASTDIG-001  
**Name:** Last Digit / Unit Digit  
**Topic:** Number System  
**Subtopic:** Last Digit  
**Status:** Design and educational libraries only

## Educational Boundary

NS-LASTDIG-001 owns:

- Last digit of powers.
- Last digit of products of powers.
- Last digit of repeated exponential expressions.
- Unit digit cyclicity.
- Missing exponent questions using last-digit cycles.

NS-LASTDIG-001 does not own:

- General remainders.
- Modular arithmetic proofs.
- Divisibility.
- Factorials.
- Trailing zeros.

## Mathematical Foundation

Only the last digit of the base affects the last digit of a power. Powers of each last digit follow a repeating cycle.

Examples:

- Powers of 7 repeat as 7, 9, 3, 1.
- Powers of 4 repeat as 4, 6.
- Powers of 0, 1, 5 and 6 repeat with cycle length 1.

For a power \(a^n\), reduce the base to its last digit and use the exponent position in the cycle.

## Runtime Gate

This package defines design and educational libraries only. Runtime implementation may begin only after human review and approval.

