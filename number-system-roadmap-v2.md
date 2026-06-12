# Number System Roadmap V2

## Scope

This roadmap defines the Quant V3 Number System domain plan for ExamTree.

It covers:

- completed and freeze-review archetypes
- in-progress archetypes
- architecture-only and future archetypes
- dependencies
- recommended implementation order
- estimated syllabus coverage for SSC, Banking, Railway, CDS, NDA, CAPF, Punjab and State PCS exams

This document is roadmap-only. It does not define runtime, generators, solvers, validators, reasoning graphs, pipelines, tests or audits.

## Status Summary

| Status | Archetype Count | Archetypes |
| --- | ---: | --- |
| Completed / Freeze Review | 14 | NS-PRM-001, NS-PF-001, NS-DIV-001, NS-REM-001, NS-REM-002, NS-FAC-001, NS-HCF-001, NS-LCM-001, NS-HL-001, NS-COP-001, NS-TRAIL-001, NS-LASTDIG-001, NS-DIGIT-001, NS-FRACDEC-001 |
| In Progress | 1 | NS-EXP-001 |
| Future Candidates | 7 | NS-SURD-001, NS-CYC-001, NS-CLASS-001, NS-DIGPROP-001, NS-BASE-001, NS-NLINE-001, NS-MISCNT-001 |

## Completed / Freeze Review Archetypes

| Archetype | Name | Status | Coverage Role |
| --- | --- | --- | --- |
| NS-PRM-001 | Prime Numbers | Freeze Review / Completed | Prime identification, prime ranges, prime lookup and prime classification support. |
| NS-PF-001 | Prime Factorization | Freeze Review / Completed | Prime factorization, prime powers, distinct factors, exponent lookup and largest/smallest prime factor. |
| NS-DIV-001 | Divisibility | Freeze Review / Completed | Divisibility tests, missing digits and valid digit selection. |
| NS-REM-001 | Remainders | Freeze Review / Completed | Basic target-remainder digit and number-construction questions. |
| NS-REM-002 | Advanced Remainders | Freeze Review / Completed | Dividend/divisor/quotient/remainder reconstruction and range remainder questions. |
| NS-FAC-001 | Factors | Freeze Review / Completed | Factor count, sum, product, kth factor, divisible-factor counts and proper factor questions. |
| NS-HCF-001 | HCF | Freeze Review / Completed | Direct HCF, common divisor count, missing operand using HCF and equal-grouping applications. |
| NS-LCM-001 | LCM | Freeze Review / Completed | Direct LCM, common cycles, missing value using LCM, common multiples and threshold LCM questions. |
| NS-HL-001 | HCF-LCM Relationship | Freeze Review / Completed | Product relation, missing number, pair reconstruction, pair count and ratio-based reconstruction. |
| NS-COP-001 | Co-Prime Numbers | Freeze Review / Completed | Co-prime classification, co-prime counts, pair counts, consecutive-number HCF and ratio reduction. |
| NS-TRAIL-001 | Trailing Zeros | Freeze Review / Completed | Factorial zeros, expression zeros, smallest n, powers and product trailing-zero questions. |
| NS-LASTDIG-001 | Last Digit | Freeze Review / Completed | Unit digit of powers, products of powers, repeated exponentials, cycles and missing exponent from last digit. |
| NS-DIGIT-001 | Number Of Digits | Freeze Review / Completed | Digit count of numbers, powers, products, n-digit boundaries and missing exponent from digit count. |
| NS-FRACDEC-001 | Fractions Decimals Rational Numbers | Freeze Review / Completed | Fraction simplification, mixed/improper conversion, rational arithmetic, comparison, decimal conversion, recurring decimals, terminating tests and HCF/LCM of fractions. |

## In Progress

| Archetype | Name | Implementation Status | Coverage Role |
| --- | --- | --- | --- |
| NS-EXP-001 | Indices And Exponents | In Progress | General exponent-law simplification, zero/negative/fractional exponents, missing exponent questions and power comparison. |

NS-EXP-001 is the next required foundation because it supports surds, simplification, algebraic manipulation and later power-based cyclicity.

## Candidate Future Archetypes

### NS-SURD-001 Surds And Rationalization

**Description:** Simplification of surds, operations on surds, comparison of radical values and rationalization of denominators.

**Estimated exam frequency:** High for SSC, Railway, CDS, NDA, CAPF and State PCS; medium for Banking.

**Dependencies:**

- NS-EXP-001 for exponent and root laws.
- NS-FRACDEC-001 for rational denominators and fraction simplification.
- NS-HCF-001 / NS-PF-001 for extracting square factors from radicands.

**Priority:** P0 = Essential.

**Justification:** Surds and rationalization are repeatedly listed with indices and roots in government-exam quant syllabi. This is a high-frequency gap after indices.

### NS-CYC-001 Advanced Cyclicity

**Description:** Last two digits, last three digits, cyclic remainders of powers and modular power cycles beyond unit digit.

**Estimated exam frequency:** Medium-high for SSC CGL/CPO, Railway and defence exams; low-medium for Banking.

**Dependencies:**

- NS-LASTDIG-001 for unit digit cycle foundation.
- NS-REM-001 and NS-REM-002 for remainder framing.
- NS-EXP-001 for exponent handling.

**Priority:** P1 = High Value.

**Justification:** Unit digit is already covered. Advanced cyclicity appears often enough in SSC/Railway-style sets to justify a separate archetype, but it should follow exponent laws.

### NS-CLASS-001 Number Classification

**Description:** Natural, whole, integer, rational, irrational, real, even/odd, positive/negative and property-based number classification.

**Estimated exam frequency:** Medium-high for SSC, Railway, NDA, CAPF and State PCS; medium for Banking.

**Dependencies:**

- NS-PRM-001 for prime/composite boundaries.
- NS-FRACDEC-001 for rational representation.
- NS-SURD-001 for irrational surd recognition.

**Priority:** P1 = High Value.

**Justification:** Classification is a recurring syllabus item, but it becomes stronger after rational numbers and surds are already available.

### NS-DIGPROP-001 Digital Properties

**Description:** Digit sum, digital root, product of digits, repeated digit sum, reverse-number properties and digit-based construction not owned by divisibility.

**Estimated exam frequency:** Medium for SSC/Railway and State PCS; low-medium for Banking and defence.

**Dependencies:**

- NS-DIV-001 for divisibility-rule context.
- NS-REM-001 for digit/remainder linkages.

**Priority:** P2 = Medium Value.

**Justification:** Useful and visible in exams, but many high-frequency digit tasks are already covered by divisibility, remainder and last-digit archetypes.

### NS-BASE-001 Number Systems And Bases

**Description:** Binary, octal, decimal and hexadecimal conversion; place value in alternate bases; basic arithmetic in non-decimal bases.

**Estimated exam frequency:** Medium for technical/Railway and some SSC contexts; low for Banking and general PCS.

**Dependencies:**

- NS-DIGIT-001 for place-value and representation length.
- NS-DIV-001 for divisibility and base-place reasoning support.

**Priority:** P2 = Medium Value.

**Justification:** Important for completeness, but less central than surds, exponents, classification and advanced cyclicity.

### NS-NLINE-001 Number Line And Representation

**Description:** Placement of integers, fractions, decimals, rational and irrational numbers on a number line; interval representation and ordering support.

**Estimated exam frequency:** Low-medium for school-foundation and PCS-style reasoning; low for SSC/Banking/Railway pure quant.

**Dependencies:**

- NS-FRACDEC-001 for rational values.
- NS-SURD-001 for irrational values.
- NS-CLASS-001 for number-type recognition.

**Priority:** P3 = Low Value.

**Justification:** Useful educationally, but standalone exam frequency is lower than arithmetic, exponent, surd and classification questions. It can be deferred.

### NS-MISCNT-001 Miscellaneous Number Theory

**Description:** Perfect/deficient/abundant numbers, Wilson/Euler/Fermat-style questions, CRT, modular inverse and other low-frequency number theory patterns.

**Estimated exam frequency:** Low for core SSC/Banking/Railway/NDA/CDS/CAPF/PCS; occasional in harder or specialized sets.

**Dependencies:**

- NS-FAC-001 for factor-sum and factor-count evidence.
- NS-REM-002 for advanced remainder handling.
- NS-CYC-001 for modular power cycles.

**Priority:** P3 = Low Value.

**Justification:** Do not implement until real exam evidence shows repeated demand. This is an evidence-gated bucket, not a near-term build target.

## Priority Classification

| Archetype | Priority | Rationale |
| --- | --- | --- |
| NS-EXP-001 | P0 = Essential | Already in progress; required for indices, surds, simplification, power comparison and advanced cyclicity. |
| NS-SURD-001 | P0 = Essential | High-frequency government-exam topic and direct dependent of exponent laws. |
| NS-CYC-001 | P1 = High Value | Extends last digit into last two/three digits and modular power cycles; common in SSC/Railway harder sets. |
| NS-CLASS-001 | P1 = High Value | Covers number classification, rational/irrational recognition, parity and consecutive-number properties. |
| NS-DIGPROP-001 | P2 = Medium Value | Adds digit sum/root/reverse-number families; useful but partly supported by divisibility/remainder archetypes. |
| NS-BASE-001 | P2 = Medium Value | Important for representation completeness; exam frequency varies by exam type. |
| NS-NLINE-001 | P3 = Low Value | Low standalone frequency; best deferred until classification and surds are complete. |
| NS-MISCNT-001 | P3 = Low Value | Advanced theorem and special-number bucket; evidence-gated. |

## Dependency Graph

```text
NS-PRM-001
  ↓
NS-PF-001
  ↓
NS-FAC-001
  ↓
NS-HCF-001 ───────────────┐
  ↓                       │
NS-LCM-001                │
  ↓                       │
NS-HL-001                 │
                          │
NS-FRACDEC-001 ◄──────────┘
  ↓
NS-EXP-001
  ↓
NS-SURD-001
  ↓
Simplification
  ↓
Algebra
```

```text
NS-DIV-001
  ↓
NS-REM-001
  ↓
NS-REM-002
  ↓
NS-CYC-001
```

```text
NS-LASTDIG-001
  ↓
NS-CYC-001
  ↓
Advanced Modular Power Questions
```

```text
NS-FRACDEC-001
  ↓
NS-CLASS-001
  ↓
NS-NLINE-001
```

```text
NS-DIV-001 + NS-REM-001
  ↓
NS-DIGPROP-001
```

```text
NS-DIGIT-001
  ↓
NS-BASE-001
```

```text
NS-FAC-001 + NS-REM-002 + NS-CYC-001
  ↓
NS-MISCNT-001
```

## Coverage Estimate

| Milestone | Estimated Coverage | Notes |
| --- | ---: | --- |
| Current coverage, including NS-FRACDEC-001 | 82% | Integer number theory core is strong; fractions/decimals/rational numbers are now covered. |
| After NS-EXP-001 | 87% | Adds indices/exponents, a high-frequency gap and required foundation for surds. |
| After NS-SURD-001 | 91% | Covers surds, rationalization and root-expression simplification. |
| After all high-priority archetypes | 95% | Includes NS-CYC-001 and NS-CLASS-001. |
| After full roadmap | 98% | Adds digital properties, bases, number line and miscellaneous evidence-gated number theory. |

Coverage estimates are exam-syllabus estimates, not runtime coverage percentages.

## Gap Analysis

### High-Frequency Gaps

- **Indices and Exponents:** Not fully owned by current completed archetypes. Power expressions currently appear inside last digit, digit count and trailing zeros, but general exponent laws remain uncovered.
- **Surds and Rationalization:** High-frequency in SSC, Railway, CDS, NDA, CAPF and State PCS. Requires NS-EXP-001 first.

### Medium-Frequency Gaps

- **Advanced Cyclicity:** Last two digits, last three digits and cyclic remainders are not owned by NS-LASTDIG-001.
- **Number Classification:** Natural/whole/integer/rational/irrational/real classification and parity properties need explicit ownership.
- **Digital Properties:** Digit sum, digital root and reverse-number properties are only partially adjacent to divisibility.
- **Base Systems:** Binary/octal/hex conversion appears in some exam families but is not universal.

### Low-Frequency Gaps

- **Number Line Representation:** Useful for foundation and rational/irrational ordering, but low standalone frequency in target quant sections.
- **Miscellaneous Number Theory:** Perfect/deficient/abundant numbers and theorem-based modular arithmetic should remain deferred until evidence justifies them.

## Recommended Implementation Order

1. **NS-EXP-001 Indices And Exponents**
   - In progress.
   - Required before surds and useful for advanced cyclicity.

2. **NS-SURD-001 Surds And Rationalization**
   - Highest-value next archetype after exponents.
   - Directly unlocks surd simplification and rationalization.

3. **NS-CLASS-001 Number Classification**
   - Should follow FRACDEC and SURD so rational/irrational classification is clean.
   - Also absorbs even/odd and consecutive-number properties.

4. **NS-CYC-001 Advanced Cyclicity**
   - Builds on LASTDIG, REM and EXP.
   - Covers last two/three digit and modular power cycle questions.

5. **NS-DIGPROP-001 Digital Properties**
   - Adds digit sum/root and reverse-number families.
   - Useful support for divisibility and mental-number questions.

6. **NS-BASE-001 Number Systems And Bases**
   - Representation and conversion family.
   - Medium priority because exam frequency varies.

7. **NS-NLINE-001 Number Line And Representation**
   - Low priority standalone archetype.
   - Implement only after classification/surds if roadmap needs representation completeness.

8. **NS-MISCNT-001 Miscellaneous Number Theory**
   - Evidence-gated.
   - Keep last unless actual exam data requires earlier work.

## Recommended Next Archetype After NS-EXP-001

**NS-SURD-001 Surds And Rationalization**

Rationale:

- Depends naturally on exponent/root laws.
- High exam frequency across SSC, Railway, CDS, NDA, CAPF and State PCS.
- Does not duplicate existing fraction, HCF/LCM, factor or exponent archetypes.
- Supports later simplification and algebra modules.

## Number System Completion Forecast

| Forecast Item | Estimate |
| --- | ---: |
| Remaining active/in-progress archetypes | 1 |
| Remaining future archetypes | 7 |
| Recommended near-term archetypes | 4 |
| Full remaining archetype count | 8 |
| Remaining implementation effort | Medium-high |
| Estimated final coverage after full roadmap | 98% |

The domain is now past the integer-number-theory core. The remaining work is mostly expression systems, classification/representation and lower-frequency advanced properties.

## Roadmap Summary

- Completed / freeze-review coverage is strong for primes, factors, divisibility, remainders, HCF, LCM, co-prime logic, trailing zeros, last digit, digit count and fractions/decimals.
- NS-EXP-001 is the current in-progress priority.
- NS-SURD-001 should follow NS-EXP-001.
- NS-CLASS-001 and NS-CYC-001 are the highest-value future archetypes after surds.
- NS-DIGPROP-001 and NS-BASE-001 are medium-value completeness additions.
- NS-NLINE-001 and NS-MISCNT-001 should be deferred unless future exam evidence raises their priority.

## Verification

- File created: number-system-roadmap-v2.md
- JSON libraries created: none
- Runtime files created: none
- Generators created: none
- Solvers created: none
- Validators created: none
- Reasoning graphs created: none
- Pipelines created: none
- Tests created: none
- Audits created: none
