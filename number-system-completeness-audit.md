# Number System Completeness Audit

## Scope

This is a research-only completeness review of the current ExamTree Number System roadmap against representative SSC, Banking, Railway, CDS, NDA, CAPF, Punjab Government and State PCS number-system question families.

No runtime, libraries, generators, solvers, validators, reasoning graphs, pipelines, tests or implementation artifacts are created by this report.

## Sources Reviewed

Representative source coverage was checked from public syllabus, preparation and sample-question sources for SSC, Railway, Banking, Defence and PCS-style exams.

Key source signals:

- SSC CGL syllabus lists Number Systems as computation of whole numbers, decimals and fractions, and relationship between numbers; it also lists square roots and elementary surds as mathematics topics. Source: https://testbook.com/ssc-cgl-exam/syllabus
- SSC CGL number-system practice summaries repeatedly include number types, divisibility, factorization, HCF/LCM, remainders, unit digits and digit patterns. Source: https://www.oliveboard.in/blog/number-system-questions-for-ssc-cgl/
- RRB NTPC number-system guidance lists number types, divisibility rules, LCM/HCF, fractions and decimals, square/cube roots, BODMAS, indices and surds, remainders and factorization. Source: https://www.oliveboard.in/rrb-ntpc-number-system-questions/
- RRB NTPC question collections identify divisibility rules, remainder theorem, number of factors, LCM/HCF, simplification, surds and indices as number-system-relevant patterns. Source: https://www.sscadda.com/rrb-ntpc-number-system-questions/
- RRB NTPC / Group D syllabus analysis lists Number System, LCM/HCF, simplification, decimal/fraction and divisibility topics. Source: https://www.careerpower.in/rrb-ntpc-syllabus.html
- Banking syllabus references include Number System, simplification/approximation and number properties, with Banking quant usually placing pure number-system items inside simplification, divisibility, HCF/LCM, factors and number properties. Sources: https://www.geeksforgeeks.org/ibps-po-syllabus/ and https://www.ibpsprep.in/ibps-po/prelims/quant
- CDS and defence-oriented syllabus summaries include Number System, rational/real numbers, integers, HCF/LCM, remainder theorem, surds and indices/logarithms. Sources: https://testbook.com/cds/syllabus and https://www.studyiq.com/articles/cds-syllabus/
- State PCS / CSAT references include Number System, simplification, divisibility rules, surds and indices, LCM/HCF and decimals/fractions. Source: https://www.iaspcsprep.com/quantitative-aptitude/
- Punjab PCS-oriented material includes HCF/LCM of fractions, same-remainder divisor problems, bell problems, greatest divisible number and HCF-LCM relation questions. Source: https://punjab.pscnotes.com/mathematics-and-stastics/hcf-and-lcm/
- SSC CPO-style quantitative topic breakdowns explicitly include number classification, number properties, divisibility, unit digit/last two digits, remainder theorem, factors, HCF/LCM, fractions, decimals, recurring decimals, surds and indices. Source: https://prepmerit.site/exams/ssc-cpo/Quantitative-Aptitude

## Existing Archetypes Reviewed

- NS-PRM-001 Prime Numbers
- NS-PF-001 Prime Factorization
- NS-DIV-001 Divisibility
- NS-REM-001 Remainders
- NS-REM-002 Advanced Remainders / Division Reconstruction
- NS-FAC-001 Factors
- NS-HCF-001 HCF
- NS-LCM-001 LCM
- NS-HL-001 HCF-LCM Relationship
- NS-COP-001 Co-Prime Numbers
- NS-TRAIL-001 Trailing Zeros
- NS-LASTDIG-001 Last Digit
- NS-DIGIT-001 Number Of Digits

## Discovered Question Type Coverage Table

| Topic | Representative Question | Existing Archetype | Existing CP | Covered? |
| --- | --- | --- | --- | --- |
| Prime identification | Is 97 prime? | NS-PRM-001 | Prime check CP | Yes |
| Prime count in range | Count primes between 20 and 50. | NS-PRM-001 | Prime counting CP | Yes |
| Next/previous prime | Find the next prime after 47. | NS-PRM-001 | Prime lookup CP | Yes |
| Composite identification | Identify whether 91 is composite. | NS-PRM-001 / NS-PF-001 | Prime/composite classification or factorization | Yes |
| Prime factorization | Express 360 as prime factors. | NS-PF-001 | CP-001 | Yes |
| Count prime factors with repetition | How many prime factors does 360 have including repetition? | NS-PF-001 | CP-002 | Yes |
| Count distinct prime factors | How many different prime factors does 360 have? | NS-PF-001 | CP-003 | Yes |
| Largest/smallest prime factor | Find the largest prime factor of 1001. | NS-PF-001 | CP-004 / CP-005 | Yes |
| Highest prime power in a number | Highest power of 2 dividing 360. | NS-PF-001 | CP-006 | Yes |
| Prime exponent lookup | Exponent of 3 in 360. | NS-PF-001 | CP-007 | Yes |
| Missing digit for divisibility | Find x if 45x2 is divisible by 9. | NS-DIV-001 | CP-001 | Yes |
| Largest/smallest valid digit for divisibility | Find largest x making 7x5 divisible by 3. | NS-DIV-001 | CP-002 / CP-003 | Yes |
| Count/sum valid digits for divisibility | Count digits x making 3x1 divisible by 5. | NS-DIV-001 | CP-004 / CP-005 | Yes |
| Form greatest/smallest valid divisible number | Replace x to form greatest number divisible by 8. | NS-DIV-001 | CP-006 / CP-007 | Yes |
| Missing digit for target remainder | Find x if 24x leaves remainder 2 when divided by 5. | NS-REM-001 | CP-001 | Yes |
| Smallest/greatest digit for target remainder | Find smallest x such that 7x2 leaves remainder 1 by 3. | NS-REM-001 | CP-002 / CP-003 | Yes |
| Count/sum valid values for target remainder | Count digits x that give a target remainder. | NS-REM-001 | CP-004 / CP-005 | Yes |
| Form valid number for target remainder | Replace x to form smallest/greatest number with target remainder. | NS-REM-001 | CP-006 / CP-007 | Yes |
| Dividend from divisor, quotient, remainder | Divisor 7, quotient 15, remainder 3; find dividend. | NS-REM-002 | CP-001 / CP-009 | Yes |
| Smallest/greatest number with remainder in range | Smallest number greater than 100 leaving remainder 3 by 7. | NS-REM-002 | CP-002 / CP-003 | Yes |
| Count/sum numbers satisfying remainder condition | Count numbers between 100 and 500 leaving remainder 3 by 7. | NS-REM-002 | CP-004 / CP-005 | Yes |
| Missing divisor/quotient/remainder | Find divisor when dividend, quotient and remainder are known. | NS-REM-002 | CP-006 / CP-007 / CP-008 | Yes |
| Total number of factors | Find total factors of 360. | NS-FAC-001 | CP-001 | Yes |
| Sum/product of factors | Find sum/product of factors of 72. | NS-FAC-001 | CP-002 / CP-003 | Yes |
| Odd/even factor count | Does a number have odd number of factors? | NS-FAC-001 | CP-004 | Yes |
| Greatest proper factor | Greatest proper factor of 91. | NS-FAC-001 | CP-005 | Yes |
| Count factors divisible/not divisible by k | Count factors of 360 divisible by 6. | NS-FAC-001 | CP-006 / CP-007 | Yes |
| kth smallest/largest factor | Find the 5th smallest factor of 120. | NS-FAC-001 | CP-008 / CP-009 | Yes |
| Direct HCF | Find HCF of 72 and 96. | NS-HCF-001 | CP-001 | Yes |
| HCF of two or three numbers | Find HCF of 18, 24 and 30. | NS-HCF-001 | CP-001 | Yes |
| Count common divisors | How many common factors do 36 and 60 have? | NS-HCF-001 | CP-002 | Yes |
| Missing operand using HCF | Number has HCF 12 with 72; find from options. | NS-HCF-001 | CP-003 | Yes |
| Equal grouping word problem | Pack fruits into greatest number of identical boxes. | NS-HCF-001 | CP-004 | Yes |
| Direct LCM | Find LCM of 12, 18 and 30. | NS-LCM-001 | CP-001 | Yes |
| Common cycle synchronization | Bells ring every 6, 8, 12 sec; when together again? | NS-LCM-001 | CP-002 | Yes |
| Missing number using LCM | LCM of 12 and x is 60; choose x from candidates. | NS-LCM-001 | CP-003 | Yes |
| Count common multiples in range | Count multiples common to 6 and 8 between 1 and 200. | NS-LCM-001 | CP-004 | Yes |
| Smallest common multiple above threshold | Smallest number divisible by 6 and 10 greater than 100. | NS-LCM-001 | CP-005 | Yes |
| HCF x LCM product relation | HCF and LCM of two numbers known; find missing number. | NS-HL-001 | Product/missing number CP | Yes |
| Find pair from HCF and LCM | Find possible numbers with given HCF and LCM. | NS-HL-001 | Pair reconstruction CP | Yes |
| Count possible pairs from HCF/LCM | Count possible pairs with HCF 6 and LCM 180. | NS-HL-001 | Pair count CP | Yes |
| Ratio plus HCF/LCM reconstruction | Numbers in ratio 3:4 and HCF 5; find numbers. | NS-HL-001 | Ratio reconstruction CP | Yes |
| Co-prime classification | Classify whether a pair is co-prime. | NS-COP-001 | CP-001 | Yes |
| Count co-primes from list | Count numbers co-prime to 12 in a list. | NS-COP-001 | CP-002 | Yes |
| Missing number for co-prime condition | Choose value co-prime with 18. | NS-COP-001 | CP-003 | Yes |
| Count co-prime pairs | Count relatively prime pairs in a set. | NS-COP-001 | CP-004 | Yes |
| Consecutive number co-prime property | HCF of 35 and 36. | NS-COP-001 | CP-005 | Yes |
| Ratio reduction to lowest form | Express 18:30 in lowest form. | NS-COP-001 | CP-006 | Yes |
| Trailing zeros in factorial | Number of zeros at end of 100!. | NS-TRAIL-001 | CP-001 | Yes |
| Trailing zeros in factorial expression | Zeros in 100!/25!. | NS-TRAIL-001 | CP-002 | Yes |
| Smallest n for given factorial zeros | Smallest n such that n! has 24 trailing zeros. | NS-TRAIL-001 | CP-003 | Yes |
| Trailing zeros in powers | Zeros at end of 40^12. | NS-TRAIL-001 | CP-004 | Yes |
| Trailing zeros after multiplication | Zeros at end of 32 x 625. | NS-TRAIL-001 | CP-005 | Yes |
| Last digit of power | Last digit of 7^123. | NS-LASTDIG-001 | CP-001 | Yes |
| Last digit of product of powers | Last digit of 2^15 x 3^17. | NS-LASTDIG-001 | CP-002 | Yes |
| Last digit of exponent tower | Last digit of 3^3^3. | NS-LASTDIG-001 | CP-003 | Yes |
| Identify unit digit cycle | Cycle of powers of 7. | NS-LASTDIG-001 | CP-004 | Yes |
| Missing exponent from last digit | 2^n ends in 8; find n from options. | NS-LASTDIG-001 | CP-005 | Yes |
| Number of digits in number | Digits in 100001. | NS-DIGIT-001 | CP-001 | Yes |
| Number of digits in power | Digits in 2^100. | NS-DIGIT-001 | CP-002 | Yes |
| Number of digits in product | Digits in product 12 x 345 x 99. | NS-DIGIT-001 | CP-003 | Yes |
| Smallest/largest n-digit number | Largest 7-digit number. | NS-DIGIT-001 | CP-004 | Yes |
| Missing exponent from digit count | 2^n has 4 digits; find n from options. | NS-DIGIT-001 | CP-005 | Yes |
| Number classification | Identify natural, whole, integer, rational, irrational, real. | None | None | No |
| Even/odd properties | Determine parity of a sum/product/power expression. | None | None | No |
| Consecutive integer properties beyond co-prime | Sum/product/divisibility/factor properties of consecutive integers. | Partial: NS-COP-001 | CP-005 only covers co-prime property | No |
| Fractions and rational operations | Simplify 3/4 + 5/6, compare fractions, mixed fractions. | Partial: NS-COP-001 ratio reduction only | CP-006 ratio reduction | No |
| Decimal fractions | Decimal operations, place value, decimal comparison. | None | None | No |
| Recurring decimals | Convert 0.3 recurring to fraction; identify recurring period. | None | None | No |
| Terminating decimal test | Whether p/q terminates; decimal length after simplification. | None | None | No |
| HCF/LCM of fractions | Find HCF or LCM of 2/3, 4/9, 8/15. | Partial: NS-HCF/NS-LCM integers only | No active fraction CP | No |
| Indices and exponent laws | Simplify a^m x a^n / a^p; negative/fractional indices. | Partial: powers used in last digit/digits/trailing zeros | No general exponent-law CP | No |
| Surds and rationalization | Simplify sqrt(72), rationalize 1/(sqrt5+sqrt3). | None | None | No |
| Square root / cube root extraction | Find sqrt(2025), cube root of 9261. | None | None | No |
| Perfect square / perfect cube classification | Is 2025 a perfect square? | Partial: NS-FAC-001 CP-004 factor parity | No direct square/cube CP | No |
| Sum of first n natural numbers | Find 1+2+...+n, sum of squares/cubes. | None | None | No |
| Number series as arithmetic number properties | Find missing number in property-based series. | None | None | No |
| Base-system conversion | Convert binary to decimal, decimal to binary. | None | None | No |
| Arithmetic in non-decimal bases | Add/subtract/multiply in base 2/8/16. | None | None | No |
| Roman numerals | 699 in Roman numerals. | None | None | No |
| Advanced cyclicity beyond last digit | Last two digits, last three digits, cyclic remainders of powers. | Partial: NS-LASTDIG-001 only last digit | No last-two/last-three CP | No |
| Digital root / digit sum properties | Digital root, casting out nines, repeated digit sum. | Partial: NS-DIV-001 uses divisibility rules | No direct digital property CP | No |
| Number line representation | Represent rational/irrational numbers or intervals on number line. | None | None | No |
| Perfect/deficient/abundant numbers | Classify by sum of proper divisors. | Partial: NS-FAC-001 sum of factors supports calculation | No classification CP | No |
| Miscellaneous number theory | Wilson/Euler/Fermat/CRT/modular inverse. | None or partial advanced remainders | No advanced theorem CP | No |

## Gap Analysis

Only gaps with repeated real-exam relevance and no clean existing home are recommended as candidate archetypes. Several areas are intentionally not recommended as standalone archetypes because they are either rare, too advanced for the target exams, or better handled inside another future archetype.

## Candidate Archetype: NS-CLASS-001 Number Classification

**Description:** Classification of numbers as natural, whole, integer, rational, irrational, real, prime/composite, even/odd, positive/negative, and simple set-membership questions.

**Why existing archetypes do not cover it:** NS-PRM covers prime-specific classification, and NS-COP covers co-prime properties, but no archetype owns general number-set membership or rational/irrational classification. RRB and SSC sources explicitly list number types as exam subtopics.

### Candidate CPs

- CP-001 Identify Number Type: classify a number into natural, whole, integer, rational, irrational or real.
- CP-002 Count Numbers Of A Type From A List: count rational/irrational/integer values from a set.
- CP-003 Select Correct Classification Statement: choose the correct statement about a given number.
- CP-004 Even/Odd Classification Of Expression: determine parity of sum/product/power expressions.
- CP-005 Consecutive Integer Property: apply parity, divisibility or product properties of consecutive numbers beyond the co-prime property.

**Recommendation:** High priority. This covers Number Classification, Even/Odd Properties and Consecutive Numbers without creating three separate archetypes.

## Candidate Archetype: NS-FRACDEC-001 Fractions, Decimals And Rational Numbers

**Description:** Fraction operations, decimal operations, fraction-decimal conversion, comparison, terminating/recurring behavior and rational number representation.

**Why existing archetypes do not cover it:** NS-COP reduces ratios but does not own arithmetic with fractions. NS-HCF/NS-LCM are integer-focused. SSC, Railway, Banking and PCS sources repeatedly list decimals and fractions as core Number System or simplification components.

### Candidate CPs

- CP-001 Simplify Fraction: reduce a fraction to lowest terms.
- CP-002 Fraction Arithmetic: add, subtract, multiply or divide fractions/mixed fractions.
- CP-003 Decimal Arithmetic: operate on decimal fractions.
- CP-004 Fraction To Decimal Conversion: convert p/q into decimal form.
- CP-005 Decimal To Fraction Conversion: convert terminating decimal to fraction.
- CP-006 Recurring Decimal To Fraction: convert recurring decimal to rational form.
- CP-007 Terminating Or Recurring Decimal Test: decide whether p/q terminates and identify decimal behavior.
- CP-008 Compare Fractions Or Decimals: order or compare rational values.
- CP-009 HCF/LCM Of Fractions: apply HCF numerator / LCM denominator and LCM numerator / HCF denominator rules.

**Recommendation:** Highest priority. This is the largest uncovered high-frequency area.

## Candidate Archetype: NS-EXP-001 Indices And Exponents

**Description:** General laws of indices: multiplication/division of same bases, power of power, zero index, negative index, fractional index and equations involving exponents.

**Why existing archetypes do not cover it:** Current archetypes use exponents only as supporting structures for last digit, digit count and trailing zeros. They do not cover exponent-law simplification, which appears in SSC/Railway/CDS/CAPF syllabi as indices.

### Candidate CPs

- CP-001 Simplify Product Of Powers With Same Base.
- CP-002 Simplify Quotient Of Powers With Same Base.
- CP-003 Simplify Power Of A Power.
- CP-004 Evaluate Negative Or Zero Exponent.
- CP-005 Evaluate Fractional Exponent.
- CP-006 Solve Missing Exponent In Equal Powers.
- CP-007 Compare Powers Without Full Expansion.

**Recommendation:** High priority. Pair with surds only if implementation scope is intentionally small; otherwise keep indices separate from surds.

## Candidate Archetype: NS-SURD-001 Surds And Rationalization

**Description:** Simplification of surds, operations on surds, comparison of surds and rationalization of denominators.

**Why existing archetypes do not cover it:** No existing archetype owns irrational radical expressions. SSC, CDS, CAPF, Railway and PCS sources list surds and indices as recurring quantitative topics.

### Candidate CPs

- CP-001 Simplify A Single Surd.
- CP-002 Add Or Subtract Like Surds.
- CP-003 Multiply Or Divide Surds.
- CP-004 Rationalize Monomial Surd Denominator.
- CP-005 Rationalize Binomial Surd Denominator.
- CP-006 Compare Surd Values.

**Recommendation:** High priority after fractions/decimals and indices.

## Candidate Archetype: NS-SQCB-001 Squares, Cubes, Roots And Perfect Powers

**Description:** Square/cube recognition, square root and cube root extraction, nearest square/cube, and perfect power classification.

**Why existing archetypes do not cover it:** NS-FAC CP-004 uses perfect-square factor parity but does not ask square/cube root or perfect-power questions. RRB/SSC sources list square roots and cube roots separately.

### Candidate CPs

- CP-001 Find Square Root Of A Perfect Square.
- CP-002 Find Cube Root Of A Perfect Cube.
- CP-003 Identify Perfect Square.
- CP-004 Identify Perfect Cube.
- CP-005 Nearest Perfect Square Or Cube.
- CP-006 Count Digits / Last Digit Clue For Square Or Cube Candidate.

**Recommendation:** Medium-high priority. Useful for RRB, SSC and banking simplification speed.

## Candidate Archetype: NS-BASE-001 Base Systems

**Description:** Conversion among decimal, binary, octal and hexadecimal; place value in non-decimal bases; basic arithmetic in alternate bases.

**Why existing archetypes do not cover it:** No current archetype owns base conversion or non-decimal representation. SSC CGL-style sources include number conversions, and RRB/technical-oriented sources sometimes include representation questions.

### Candidate CPs

- CP-001 Convert Decimal To Another Base.
- CP-002 Convert Another Base To Decimal.
- CP-003 Convert Between Non-Decimal Bases.
- CP-004 Add Or Subtract In A Given Base.
- CP-005 Identify Place Value In A Given Base.

**Recommendation:** Medium priority. Include Roman numerals only if source frequency justifies it; otherwise keep Roman numerals as a low-priority misc representation CP.

## Candidate Archetype: NS-CYC-ADV-001 Advanced Cyclicity

**Description:** Last two digits, last three digits, cyclic remainders of powers, and recurring cycles beyond unit digit.

**Why existing archetypes do not cover it:** NS-LASTDIG covers only the last digit. NS-REM-001/002 handle candidate/reconstruction remainder topologies, not high-power cyclic remainders. SSC/CPO/Railway sources mention unit digit, last two digits and advanced remainder theorem patterns.

### Candidate CPs

- CP-001 Last Two Digits Of A Power.
- CP-002 Last Two Digits Of Product Of Powers.
- CP-003 Remainder Of Large Power By Small Divisor.
- CP-004 Cyclicity Length Of A Base Modulo n.
- CP-005 Missing Exponent From Last Two Digits Or Remainder.

**Recommendation:** Medium priority. Do not merge into NS-LASTDIG unless that archetype is renamed and broadened.

## Candidate Archetype: NS-DIGPROP-001 Digital Properties

**Description:** Digit sum, digital root, casting out nines, digit-product/sum properties, reversing digits and digit-based number construction where divisibility is not the main task.

**Why existing archetypes do not cover it:** NS-DIV uses digit sums only as divisibility evidence. It does not own questions where the final answer is digit sum, digital root or digit-expression value.

### Candidate CPs

- CP-001 Sum Of Digits.
- CP-002 Product Of Digits.
- CP-003 Digital Root.
- CP-004 Repeated Digit Sum.
- CP-005 Number From Digit Sum And Conditions.
- CP-006 Reversed Number Difference Or Sum.

**Recommendation:** Medium priority. Useful for SSC/Railway digit-property questions and supports future divisibility explanations.

## Candidate Archetype: NS-SERIES-001 Formula Sums Of Natural Numbers, Squares And Cubes

**Description:** Sum of first n natural numbers, odd/even numbers, squares and cubes; simple formula applications.

**Why existing archetypes do not cover it:** No current archetype owns sequence-sum formula questions. SSC CPO-style topic lists include sum of first n natural numbers, squares and cubes under Number System.

### Candidate CPs

- CP-001 Sum Of First n Natural Numbers.
- CP-002 Sum Of First n Even Or Odd Numbers.
- CP-003 Sum Of Squares.
- CP-004 Sum Of Cubes.
- CP-005 Missing n From A Given Sum.

**Recommendation:** Medium priority. Keep separate from pattern-based number series.

## Candidate Archetype: NS-MISCNT-001 Miscellaneous Number Theory

**Description:** Low-frequency theorem or special-number families: perfect/deficient/abundant numbers, Wilson-style factorial congruences, Euler/Fermat theorem, CRT, modular inverse and specialized olympiad-style facts.

**Why existing archetypes do not cover it:** Existing remainder and cyclicity archetypes are exam-basic. Advanced theorem-based questions require different mathematical tools.

### Candidate CPs

- CP-001 Perfect / Deficient / Abundant Classification.
- CP-002 Wilson-Theorem Remainder.
- CP-003 Euler/Fermat Power Remainder.
- CP-004 Chinese Remainder Theorem System.
- CP-005 Modular Inverse.

**Recommendation:** Low priority for SSC/Banking/Railway core. Create only after evidence from actual target exams shows sufficient frequency. For now, do not implement.

## Special Attention Area Decisions

| Area | Separate Archetype Needed? | Decision |
| --- | --- | --- |
| Recurring Decimals | Yes, but inside Fractions/Decimals | Include under NS-FRACDEC-001, not standalone. |
| Decimal Fractions | Yes, but inside Fractions/Decimals | Include under NS-FRACDEC-001. |
| Fractions & Rational Numbers | Yes | NS-FRACDEC-001 should own this whole family. |
| Indices & Exponents | Yes | NS-EXP-001 should own exponent-law questions. |
| Surds & Rationalization | Yes | NS-SURD-001 should own radical expressions. |
| Even/Odd Properties | Yes, but not standalone | Include under NS-CLASS-001 number properties. |
| Consecutive Numbers | Yes, but not standalone | Include under NS-CLASS-001 unless HCF/LCM-specific. |
| Number Classification | Yes | NS-CLASS-001. |
| Perfect / Deficient / Abundant Numbers | Not yet | Low-frequency; defer to NS-MISCNT-001 only if needed. |
| Base Systems | Yes | NS-BASE-001. |
| Advanced Cyclicity | Yes | NS-CYC-ADV-001. |
| Number Line Representation | Not as core Number System for current roadmap | Could be part of future Fractions/Decimals or Algebra/Coordinate foundation. Low priority. |
| Digital Properties | Yes | NS-DIGPROP-001. |
| Miscellaneous Number Theory | Not immediately | Defer; avoid unnecessary archetype until source frequency justifies. |

## Recommended Priority Order

1. NS-FRACDEC-001 Fractions, Decimals And Rational Numbers
2. NS-EXP-001 Indices And Exponents
3. NS-SURD-001 Surds And Rationalization
4. NS-CLASS-001 Number Classification And Integer Properties
5. NS-SQCB-001 Squares, Cubes, Roots And Perfect Powers
6. NS-CYC-ADV-001 Advanced Cyclicity
7. NS-DIGPROP-001 Digital Properties
8. NS-BASE-001 Base Systems
9. NS-SERIES-001 Formula Sums Of Natural Numbers, Squares And Cubes
10. NS-MISCNT-001 Miscellaneous Number Theory, only if later evidence justifies it

## Number System Coverage Summary

### Implemented Archetypes

- NS-PRM-001 Prime Numbers
- NS-PF-001 Prime Factorization
- NS-DIV-001 Divisibility
- NS-REM-001 Remainders
- NS-REM-002 Advanced Remainders / Division Reconstruction
- NS-FAC-001 Factors
- NS-HCF-001 HCF
- NS-LCM-001 LCM
- NS-HL-001 HCF-LCM Relationship
- NS-COP-001 Co-Prime Numbers
- NS-TRAIL-001 Trailing Zeros
- NS-LASTDIG-001 Last Digit
- NS-DIGIT-001 Number Of Digits

### Missing Archetypes

Recommended:

- NS-FRACDEC-001 Fractions, Decimals And Rational Numbers
- NS-EXP-001 Indices And Exponents
- NS-SURD-001 Surds And Rationalization
- NS-CLASS-001 Number Classification And Integer Properties
- NS-SQCB-001 Squares, Cubes, Roots And Perfect Powers
- NS-CYC-ADV-001 Advanced Cyclicity
- NS-DIGPROP-001 Digital Properties
- NS-BASE-001 Base Systems
- NS-SERIES-001 Formula Sums Of Natural Numbers, Squares And Cubes

Deferred / evidence-gated:

- NS-MISCNT-001 Miscellaneous Number Theory

### Coverage Estimate

Estimated coverage of major SSC, Banking, Railway, CDS, NDA, CAPF, Punjab and State PCS Number System question types:

**Current coverage: 72%**

**Missing coverage: 28%**

Rationale:

- The current roadmap is strong for integer divisibility, remainders, prime factorization, factors, HCF/LCM, co-prime logic, trailing zeros, last digit and digit count.
- The largest real exam gaps are fractions/decimals, indices, surds, number classification/properties and square/cube/root questions.
- Banking exams weight pure number-system questions less than SSC/Railway/Defence, but simplification and approximation often depend on fractions, decimals, roots and indices, so those gaps matter for shared quant infrastructure.
- Advanced theorem-based modular arithmetic and miscellaneous number theory should not be implemented yet unless more target-exam evidence appears.

## Final Recommendation

The existing Number System roadmap covers the integer-number-theory core well. It is not yet complete for the broader government-exam Number System syllabus because decimals/fractions, indices, surds, classifications, roots/perfect powers, advanced cyclicity and digital properties remain uncovered.

The next archetype should be:

**NS-FRACDEC-001 Fractions, Decimals And Rational Numbers**

This has the highest cross-exam frequency and supports SSC, Railway, Banking, CDS, CAPF, Punjab and State PCS preparation without duplicating any existing archetype.
