# NS-FAC-001 Design Review

## Review Status

Review Type: Pre-implementation design review

Runtime Implementation: NOT PERFORMED

Specification Files Modified: NO

Report Only: YES

## Summary Verdict

NS-FAC-001 is a strong design package, but several implementation-readiness risks should be resolved before runtime work begins.

Primary findings:

- CP-007 is best classified as a derived topology, because it is mathematically and solver-wise dependent on total factors minus CP-006.
- CP-008 and CP-009 need edge-position coverage beyond small/medium/large buckets.
- CP-003 has major answer-growth risk and should require BigInt or string serialization in future runtime.
- MathJax coverage is mostly present, but explanation placeholders do not yet explicitly consume the MathJax objects.
- Highly composite numbers are recommended as an explicit coverage category.

## Non-Redundancy Review

Focus:

- CP-006 Count Factors Divisible By K
- CP-007 Count Factors Not Divisible By K

Output: Derived Topology

### Mathematical Independence

CP-007 is not mathematically independent.

If:

- d(N) = total number of factors
- A = number of factors divisible by k

Then:

factors not divisible by k = d(N) - A

So CP-007 is mathematically the complement of CP-006 under the same input pair (number, k).

### Educational Independence

CP-007 has educational value because complement counting is a common exam reasoning pattern. Students often need to recognize when it is easier to count the excluded set and subtract from the total.

However, this is a derived educational topology, not a fully independent factor topology.

### Solver Independence

CP-007 should not require an independent solver.

Expected future solver model:

1. Compute factorCount.
2. Compute count divisible by k using CP-006 logic.
3. Subtract from factorCount.

This means CP-007 solver logic should reuse CP-006 and CP-001 abstractions.

### Reasoning Graph Independence

CP-007 should have its own reasoning graph surface because the learner-facing reasoning is different:

- total factors
- factors divisible by k
- complement count

But the graph should explicitly reference the derived relationship:

notDivisibleFactorCount = factorCount - divisibleFactorCount

### Recommendation

Keep CP-007 as an active CP only if it is labeled and implemented as a derived complement topology.

Do not treat CP-007 as solver-independent from CP-006.

## Position Coverage Review

Focus:

- CP-008 kth Smallest Factor
- CP-009 kth Largest Factor

Output: Coverage Gap Found

### Current Coverage

The package defines position buckets:

- small: 1-6
- medium: 7-24
- large: 25-120

The position policy correctly states:

position <= factorCount

### Coverage Strengths

The design can represent:

- small positions
- medium positions
- large positions
- increasing order
- decreasing order

### Coverage Gaps

The current buckets do not explicitly require edge-position cases:

- position = 1
- position = 2
- position near factorCount / 2
- position = factorCount - 1
- position = factorCount

These are educationally important because:

- position = 1 is always 1 for kth smallest.
- position = factorCount is always number for kth smallest.
- position = 1 is always number for kth largest.
- position = factorCount is always 1 for kth largest.
- middle positions test real ordered-factor reasoning.

The current small/medium/large buckets may include these positions accidentally, but do not guarantee them.

### Recommendation

Future design repair should add explicit position coverage categories:

- firstPositionCoverage
- secondPositionCoverage
- middlePositionCoverage
- penultimatePositionCoverage
- lastPositionCoverage

Future runtime should audit these separately from small/medium/large position buckets.

## Magnitude Review

Focus:

- CP-003 Product Of Factors

Formula:

Product of factors = N^(d(N)/2)

Output: Magnitude Risk Found

### Easy Estimate

Design range:

- number max: 300
- factorCount max: 12

Using the design cap:

300^(12/2) = 300^6 = 729,000,000,000,000

Approximate size:

- 15 digits
- fits inside JavaScript Number safe range only partially
- exceeds Number.MAX_SAFE_INTEGER, which is 9,007,199,254,740,991? No, 7.29e14 is below Number.MAX_SAFE_INTEGER, so Easy design max is safe for exact integer representation in Number.

Risk:

- Low under declared factorCount cap.
- If the generator uses number range only, values such as 240 have 20 factors, causing much larger products.

### Medium Estimate

Design range:

- number max: 10,000
- factorCount max: 48

Using the design cap:

10000^(48/2) = 10000^24 = 10^96

Approximate size:

- 97 characters as a full decimal integer.
- far above Number.MAX_SAFE_INTEGER.
- still serializable as a string.

Risk:

- High for numeric overflow if stored as number.
- Manageable if stored as BigInt or decimal string.

### Hard Estimate

Design range:

- number max: 200,000
- factorCount max: 120

Using the design cap:

200000^(120/2) = 200000^60

Approximate size:

- about 1.15 x 10^318
- about 319 decimal digits
- exceeds normal JavaScript Number finite range.

Risk:

- Very high for integer overflow.
- Very high for UI display length.
- High audit and CSV readability risk.
- Storage should not use numeric columns.

### Additional Concern

The number ranges may contain values whose actual factor count exceeds the declared band factorCountRange unless future generation explicitly enforces both constraints.

This is especially important for highly composite numbers.

### Recommendation

Future runtime should:

- Compute CP-003 with BigInt or exact decimal-string arithmetic.
- Store factorProduct as a string, not a number.
- Add productDigitCount to solver output, graph, validation, audit, and traceability.
- Add productMagnitudeCoverage buckets.
- Apply a display policy for very large products.
- Consider capping CP-003 generation by productDigitCount, not only number and factorCount.

## MathJax Review

Output: MathJax Gaps Found

### Present MathJax Objects

The design package references these MathJax objects:

- primeFactorizationLatex
- factorCountFormulaLatex
- factorSumFormulaLatex
- factorProductFormulaLatex

These appear in:

- archetype.md
- variable-ranges.library.json
- explanation.library.json mathJaxSupport
- implementation-plan.md shared abstraction

### Gaps

The explanation text entries do not explicitly include MathJax placeholders.

Examples:

- ES-001 says "Use the factor count formula" but does not include {factorCountFormulaLatex}.
- ES-002 says "Use the sum of factors formula" but does not include {factorSumFormulaLatex}.
- ES-003 uses plain text N^(factorCount/2), not {factorProductFormulaLatex}.

The current design says libraries support future MathJax rendering, but the explanation templates do not yet enforce visible MathJax evidence.

### Missing Or Weak MathJax Objects

Recommended future MathJax objects:

- factorListLatex
- factorsIncreasingLatex
- factorsDecreasingLatex
- kPrimeFactorizationLatex
- divisibleFactorConstraintLatex
- complementFormulaLatex
- selectedPositionFormulaLatex
- greatestProperFactorFormulaLatex
- perfectSquareRuleLatex

These are useful for CP-005 through CP-009, which are not fully covered by the four current MathJax objects.

### Recommendation

Before implementation, strengthen MathJax requirements for CP-005 through CP-009 and decide whether explanation templates must display MathJax placeholders directly.

## Highly Composite Coverage Review

Output: Recommended

### Rationale

Highly composite numbers are educationally meaningful in factor-count problems because they produce rich factor sets without requiring very large input values.

Examples:

- 60
- 120
- 180
- 240
- 360
- 720
- 840

### Why They Matter

For CP-001:

They stress-test factor count formula fluency.

For CP-002:

They produce non-trivial factor sums.

For CP-003:

They expose product magnitude growth early.

For CP-008 and CP-009:

They provide enough factors for meaningful middle, penultimate, and last-position coverage.

### Current Gap

The design tracks:

- prime inputs
- composite inputs
- prime-power numbers
- mixed-prime numbers
- perfect squares
- non-perfect squares
- factor count buckets

But it does not explicitly track highlyCompositeNumber.

Mixed-prime and large factor count coverage may catch some highly composite numbers, but not reliably.

### Recommendation

Add highlyCompositeNumber as a future coverage category.

Suggested future audit category:

- highlyCompositeCoverage

Suggested examples:

- 60
- 120
- 180
- 240
- 360
- 720
- 840

## Question Language Review

### Overall Assessment

The question language library is clear, self-contained, and exam-realistic.

All required variables are visible:

- CP-001 through CP-005 include {number}.
- CP-006 and CP-007 include {number} and {k}.
- CP-008 and CP-009 include {number} and {position}.

### Strong Entries

- QL-001: Clear and standard.
- QL-004: Clear and exam-realistic.
- QL-010: Directly asks the parity concept.
- QL-013: Clarifies that the number itself is excluded.
- QL-014 and QL-016: Self-contained and unambiguous.
- QL-019 and QL-021: Good because they state increasing/decreasing order.

### Weak Entries

QL-003:

"Count the factors of {number}."

This is acceptable, but slightly less precise than QL-001 because it does not say "total number." Still self-contained.

QL-006:

"Add all factors of {number}."

This is simple, but less standard than "Find the sum." It is acceptable for government-exam style.

QL-009:

"Multiply all factors of {number}."

This is understandable, but may feel less formal than "Find the product of all factors."

QL-018 and QL-020:

"{position}th" can render awkwardly for values like 1, 2, and 3: 1th, 2th, 3th.

Future runtime should either:

- provide ordinal rendering, or
- constrain the rendered text format to avoid malformed ordinals.

### Duplicate Wording

No harmful duplication found.

The QL sets are intentionally close variants, which is appropriate for uniform language rotation.

### Runtime Risks

The main runtime risk is ordinal formatting for CP-008 and CP-009.

## Explanation Language Review

### Overall Assessment

The explanation library is simple and aligned with the requested style, but it is too thin for implementation readiness.

Output: Weak Explanation Families Found

### Strengths

- Explanations are short.
- They avoid over-complex wording.
- Every family maps cleanly to one CP.
- Required CP-specific variables appear where needed: {k} for CP-006/CP-007 and {position} for CP-008/CP-009.

### Weaknesses

ES-001:

Mentions prime factorization and factor count formula but does not display the factorization or formula.

ES-002:

Mentions the sum formula but does not display formula evidence.

ES-003:

Uses plain text N^(factorCount/2) but does not display actual factorCount or MathJax form.

ES-004:

States the rule but does not display whether the given number is a perfect square.

ES-005:

Says "List the factors" but does not display factors or the proper-factor exclusion evidence.

ES-006:

Says "List the factors divisible by {k}" but does not display the list or a constraint formula.

ES-007:

Says "List the factors not divisible by {k}" but does not display the list or complement reasoning.

ES-008 and ES-009:

Say to arrange factors but do not display the ordered factor list.

### Traceability Concerns

The explanation templates currently rely on hidden runtime reasoning. They give instructions but not evidence.

Future graph-to-explanation rendering would need extra inserted data not represented in the human-owned text, which may conflict with the "runtime may not invent educational wording" rule.

### Graph Compatibility

The explanations can be supported by a reasoning graph, but they do not yet require graph evidence to be visible.

Recommended future placeholders:

- {primeFactorization}
- {primeFactorizationLatex}
- {factorCountFormulaLatex}
- {factorSumFormulaLatex}
- {factorProductFormulaLatex}
- {factorList}
- {factorsIncreasing}
- {factorsDecreasing}
- {divisibleFactors}
- {notDivisibleFactors}
- {factorCount}

### MathJax Compatibility

The library declares MathJax support but explanation entries do not consume MathJax placeholders directly.

This is the largest explanation-language gap.

## Final Findings

| Review Area | Output |
| --- | --- |
| CP Non-Redundancy Review | Derived Topology |
| Position Coverage Review | Coverage Gap Found |
| CP-003 Magnitude Review | Magnitude Risk Found |
| MathJax Coverage Review | MathJax Gaps Found |
| Highly Composite Coverage Review | Recommended |
| Question Language Review | Mostly adequate; ordinal runtime risk |
| Explanation Language Review | Weak explanation families found |

## Pre-Implementation Recommendation

Do not begin runtime implementation until the design owner decides whether to repair:

- CP-007 classification as derived topology.
- Explicit edge-position coverage for CP-008 and CP-009.
- CP-003 product magnitude limits and serialization policy.
- MathJax placeholders for explanation evidence.
- highlyCompositeNumber coverage.
- ordinal rendering policy for {position}th stems.
- explanation evidence placeholders for factor lists, formulas, and graph traceability.
