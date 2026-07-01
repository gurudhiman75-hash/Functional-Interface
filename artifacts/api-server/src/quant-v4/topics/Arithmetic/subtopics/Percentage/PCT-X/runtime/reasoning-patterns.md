# PCT-002: Reasoning Patterns

This document details the internal mathematical abstractions required to solve the Canonical Problems defined in PCT-002.

## Pattern 1: Set Inclusion-Exclusion (PCT-CP-001)
- **Concept**: Resolving overlapping properties within a base of 100%.
- **Formula (2-Set)**: $n(A \cup B) = n(A) + n(B) - n(A \cap B)$.
- **Formula (3-Set)**: $n(A \cup B \cup C) = n(A) + n(B) + n(C) - n(AB) - n(BC) - n(AC) + n(ABC)$.
- **Reasoning**: To find the percentage belonging to *none* of the three categories, subtract the union from 100%. Conversely, if *none* is given, the union is $100 - None$.

## Pattern 2: Fractional Miscalculation (PCT-CP-002)
- **Concept**: Comparing the impact of a clerical error against the mathematical truth.
- **Formula**: $True = N \times CorrectFraction$, $False = N \times WrongFraction$.
- **Error Percentage**: $(|True - False| / True) \times 100$.
- **Reasoning**: The assumed number $N$ cancels out. It is often logically modeled as the LCM of the denominators of the two fractions to ensure clean integer calculations during step-by-step explanations.

## Pattern 3: Piecewise Threshold Functions (PCT-CP-003)
- **Concept**: Applying differing percentage multipliers across a partitioned single value.
- **Scenario (Multi-tier)**: Commission is $r_1\%$ up to $L_1$, $r_2\%$ from $L_1$ to $L_2$, and $r_3\%$ above $L_2$.
- **Forward Formula**: $Total = L_1(r_1/100) + (L_2 - L_1)(r_2/100) + (Sales - L_2)(r_3/100)$.
- **Reverse Formula**: To find Total Sales given Total Commission $C$:
    1. Check if $C \le L_1(r_1/100)$.
    2. Check if $C \le L_1(r_1/100) + (L_2-L_1)(r_2/100)$.
    3. Solve $C = \text{Slab}_1 + \text{Slab}_2 + (Sales - L_2) \times (r_3/100)$.

## Pattern 4: Hierarchical Weighting (PCT-CP-004)
- **Concept**: Finding a global percentage from sub-segmented populations.
- **Formula**: $Global\% = (Base_{Male} \times Rate_{MaleTrait}) + (Base_{Female} \times Rate_{FemaleTrait})$.
- **Reasoning**: If a population is 60% male and 40% female, and 20% of males are graduates while 30% of females are graduates, the overall graduate percentage is $(0.60 \times 0.20) + (0.40 \times 0.30) = 12\% + 12\% = 24\%$.

## Pattern 5: Iterative Replacement Substitution (PCT-CP-005)
- **Concept**: Calculating the amount of original pure liquid left after $n$ cycles of drawing out a volume and replacing it with water.
- **Formula (Uniform)**: $Final Volume = Initial Volume \times \left(1 - \frac{Replacement Volume}{Initial Volume}\right)^n$.
- **Formula (Variable)**: $Final Volume = Initial Volume \times \prod_{i=1}^n \left(1 - \frac{r_i}{100}\right)$.
- **Reasoning**: Each step reduces the concentration based on the current volume. Variable rates $r_i$ represent different replacement percentages in each step.

## Pattern 6: Shifting Denominator Attrition (PCT-CP-006)
- **Concept**: Elections where the valid base shrinks successively.
- **Reasoning Chain**: 
    1. Let Total = 100x.
    2. Cast Votes = $100x \times (1 - NonVoter\%)$.
    3. Valid Votes = $Cast - Invalid_{Abs}$ (or $Cast \times (1 - Invalid\%)$).
    4. Winner = $Valid \times Winner\%$. Loser = $Valid \times (1 - Winner\%)$.
    5. Margin = Winner - Loser.
- **Extraction**: Using the margin to solve for $x$ and projecting it back to the original 100x Total Voters.