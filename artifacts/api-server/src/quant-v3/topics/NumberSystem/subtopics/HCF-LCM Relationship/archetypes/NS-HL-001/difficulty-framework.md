# NS-HL-001 Difficulty Framework

## Difficulty Drivers

Difficulty is controlled by:

- size of hcf and lcm
- size of lcm / hcf
- whether hcf divides lcm cleanly
- number of factor pairs of lcm / hcf
- whether co-prime multiplier filtering is needed
- whether ordered and unordered pair policy is involved
- ratio complexity
- whether the problem includes consistency checking
- whether a contextual word statement must be translated into the relation

## Easy

Expected features:

- hcf and lcm are small
- lcm / hcf is small and has few factor pairs
- direct product relation values stay small
- missing number divides cleanly
- ratio terms are already co-prime and small
- pair reconstruction has one obvious co-prime multiplier pair
- validity checks use obvious failures such as hcf not dividing lcm

Typical educational load:

- recall HCF x LCM = product
- substitute values
- perform one multiplication or division
- recognize simple impossible data

Example structures:

- hcf = 6, lcm = 60
- knownNumber = 12
- ratio = 2:3 with HCF = 5

## Medium

Expected features:

- hcf and lcm are moderate
- lcm / hcf has multiple factor pairs
- some factor pairs must be rejected because the multipliers are not co-prime
- ratio reconstruction may use LCM instead of HCF
- pair reconstruction may include a sum, difference, or range condition
- validity checks may require both divisibility and product relation checks

Typical educational load:

- compute lcm / hcf
- enumerate factor pairs
- apply gcd(m,n)=1
- apply one additional selection condition
- distinguish product relation from direct HCF or direct LCM computation

Example structures:

- hcf = 8, lcm = 240
- lcm / hcf = 30
- ratio = 3:4 with LCM = 60

## Hard

Expected features:

- hcf and lcm may be larger
- lcm / hcf has many factor pairs
- several co-prime multiplier pairs exist
- ordered versus unordered pair policy affects the answer
- ratio + HCF + LCM prompts include consistency checking
- validity cases may be plausible but impossible after full relation checks
- word problems may hide the relation behind product, pair, or ratio language

Typical educational load:

- organize factor-pair search
- apply co-prime filtering accurately
- handle multiple candidate pairs
- avoid invalid combinations where hcf does not divide lcm
- apply ratio and LCM constraints together

Example structures:

- hcf = 12, lcm = 1260
- lcm / hcf = 105
- ratio = 5:7 with HCF and LCM both supplied

## CP-Specific Difficulty Notes

CP-001 Direct Product Relation:

- Easy: compute hcf x lcm.
- Medium: one missing relation component.
- Hard: larger products or trap wording that distinguishes product of numbers from sum of numbers.

CP-002 HCF-LCM Validity Check:

- Easy: hcf does not divide lcm.
- Medium: hcf divides lcm but product relation fails.
- Hard: all values look plausible and require multiple checks.

CP-003 Missing Number From HCF, LCM, And One Number:

- Easy: product divides cleanly and values are small.
- Medium: larger product and known number requires careful division.
- Hard: plausible invalid prompts must be rejected by future validation.

CP-004 Number Pair Reconstruction:

- Easy: lcm / hcf has one simple co-prime factor pair.
- Medium: several factor pairs, one condition selects the answer.
- Hard: multiple co-prime factor pairs and a non-obvious uniqueness condition.

CP-005 Count Possible Number Pairs:

- Easy: one unordered pair.
- Medium: several co-prime factor pairs.
- Hard: ordered versus unordered policy and high factor-pair count.

CP-006 Ratio-Based Number Reconstruction:

- Easy: small co-prime ratio and HCF supplied.
- Medium: LCM supplied, requiring k = lcm / (p x q).
- Hard: HCF and LCM both supplied with a consistency check.
