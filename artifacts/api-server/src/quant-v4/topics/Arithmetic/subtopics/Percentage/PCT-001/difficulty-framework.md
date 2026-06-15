# PCT-001: Difficulty Framework

This document defines the difficulty bands for Percentage problems based on complexity drivers.

## Difficulty Bands

| Band | Complexity Drivers | Example Scenario |
| --- | --- | --- |
| **Easy** | - Direct calculation.<br>- Clean integers (10%, 20%, 25%).<br>- Single step transformation.<br>- Direct wording. | Find 20% of 500. Or, if a number is increased by 10%, find the new number. |
| **Medium** | - Reverse reasoning (finding the original base).<br>- Fraction-heavy percentages (16.66%, 37.5%).<br>- Two-step successive changes.<br>- Comparison of two entities. | If A's income is 25% more than B, how much is B's income less than A? Or, finding original price after a 15% discount. |
| **Hard** | - Multi-step successive changes (3+ steps).<br>- Complex word interpretation (mixed "total" and "remaining" bases).<br>- Product variations where multiple factors change.<br>- Compositional changes with additions/removals. | A man spends 20% of his salary on food, 25% of the *remaining* on rent, and 10% of the *rest* on transport. If he saves Rs. 5400, find his salary. |

## Complexity Dimensions

### 1. Arithmetic Complexity
- **Low**: Multiples of 10 or 5.
- **High**: Non-standard fractions, recurring decimals (e.g., 14.28%, 11.11%).

### 2. Reasoning Direction
- **Forward**: `Base * Rate = Result` (Easier).
- **Backward**: `Result / Rate = Base` (Harder).

### 3. Step Count
- **Single**: One percentage application.
- **Multiple**: Sequential or simultaneous applications of multiple percentages.

### 4. Language/Logic Interpretation
- **Explicit**: Directly stated variables and goals.
- **Implicit**: Requiring the student to derive the relationship (e.g., "Expenditure remains constant" implies a product balance equation).
