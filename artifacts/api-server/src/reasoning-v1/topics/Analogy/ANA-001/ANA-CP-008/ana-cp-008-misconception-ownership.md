# ANA-CP-008 Misconception Ownership

Status: **PROVISIONAL EDITORIAL CONTRACT — NO PERMANENT QLS**

## 1. Purpose

This document assigns plausible student errors to the candidate ANA-CP-008 solve contracts.

A distractor is valid only when it represents a realistic nearby reasoning error and does not form any registered complete relation.

Misconception ownership must remain aligned with:

- the operation-by-task allocation matrix;
- typed token order;
- exact arithmetic domains;
- cross-topic ownership;
- the independent solver;
- student-facing explanations.

## 2. Global distractor rules

Every option set must satisfy:

1. four canonical unique options;
2. exactly one intended answer;
3. no distractor forms another registered CP-008 relation with the displayed evidence;
4. no distractor is correct under the intended context;
5. no random unrelated token is used while a plausible misconception is available;
6. token order is preserved unless token-order confusion is the named misconception;
7. signed numbers remain canonically rendered;
8. roots and rational operations remain exact;
9. at least two distinct misconception mechanisms should be represented where feasible;
10. the explanation should reject the nearest displayed misconception, not a generic wrong answer.

## 3. Cross-family global misconceptions

### `IGNORED_LETTER_COMPONENT`

Student applies only the numeric operation.

Allowed for mixed-token outputs when the wrong option preserves the intended numeric result but leaves the letter/cluster unchanged or applies no valid letter operation.

Forbidden when the input/output contract has no displayed numeric component.

### `IGNORED_NUMBER_COMPONENT`

Student applies only the letter operation.

Allowed for mixed-token outputs when the wrong option preserves the intended letter result but leaves the number unchanged.

### `TOKEN_ORDER_REVERSED`

Student renders a correct transformed value in the wrong token order:

```text
CLUSTER_NUMBER instead of NUMBER_CLUSTER
NUMBER_CLUSTER instead of CLUSTER_NUMBER
```

Use only when the answer renderer accepts both shapes as option payloads and the wrong shape cannot be parsed as the intended answer type.

### `APPLIED_SOURCE_VALUES_TO_TARGET`

Student repeats the source output or reuses the source arithmetic result instead of applying the rule to the target.

Use sparingly; it is a task-transfer error rather than an operation error.

### `USED_ONE_PAIR_ONLY`

Student chooses an option fitting one displayed pair but not all evidence.

Primarily owned by equivalent-pair and odd-pair tasks.

## 4. Ordinary-position sum to scalar

Candidate solve contract:

```text
LETTER_GROUP -> NUMBER
sum of ordinary positions
```

Owned misconceptions:

### `PRODUCT_INSTEAD_OF_SUM`

Multiply positions rather than add them.

### `ABSOLUTE_DIFFERENCE_INSTEAD_OF_SUM`

Use the absolute positional difference.

This is a distractor only; it does not admit a permanent difference authority.

### `COUNTED_ALPHABET_GAP`

Count letters between the two positions, creating an off-by-one or distance answer.

### `USED_REVERSE_POSITIONS`

Use reverse alphabet values instead of ordinary positions.

Allowed only when the resulting distractor is bounded and does not collide with another registered relation.

### `OFF_BY_ONE_POSITION_SUM`

Treat `A=0` or add/subtract one after a correct sum.

Nearest explanation note:

```text
Use ordinary positions with A=1, not A=0, and add the two values.
```

## 5. Ordinary-position product to scalar

Candidate solve contract:

```text
LETTER_GROUP -> NUMBER
product of ordinary positions
```

Owned misconceptions:

### `SUM_INSTEAD_OF_PRODUCT`

Add the two positions.

### `MULTIPLIED_ALPHABET_GAP`

Use a distance/gap value in place of one factor.

### `USED_REVERSE_POSITION_PRODUCT`

Multiply reverse positions.

### `MULTIPLIED_THEN_ADDED_ONE`

Apply an unsupported adjustment after the correct product.

### `USED_ONE_POSITION_ONLY`

Return one letter position and ignore the other.

Nearest explanation note:

```text
Both ordinary positions are factors; they are not added.
```

## 6. Position sum rendered as a letter

Candidate solve contract:

```text
LETTER_GROUP -> LETTER
sum positions, then map result to A-Z
```

Owned misconceptions:

### `RETURNED_NUMERIC_SUM`

Stops after the arithmetic and fails to map the sum back to a letter.

Use only where the option answer type can represent the numeric distractor; otherwise model the error as a nearby wrong letter.

### `USED_DIFFERENCE_TO_LETTER`

Map the positional difference to a letter.

### `USED_MIDPOINT_TO_LETTER`

Map the midpoint/average to a letter.

### `USED_MODULO_WITHOUT_SOURCE_SUPPORT`

Reduce a sum greater than 26 cyclically even though the permanent domain prohibits modulo.

This should primarily appear as an excluded-generation trap, not a valid distractor in contexts where all accepted sums are within `1..26`.

### `OFF_BY_ONE_LETTER_MAPPING`

Maps value `n` to the predecessor/successor letter.

Nearest explanation note:

```text
After adding the ordinary positions, convert the exact result back to its alphabet letter.
```

## 7. Single-letter position square

Candidate solve contract:

```text
LETTER -> NUMBER
position(letter)^2
```

Owned misconceptions:

### `RETURNED_POSITION_NOT_SQUARE`

Returns the ordinary position only.

### `CUBED_POSITION`

Uses the third power.

### `SQUARED_REVERSE_POSITION`

Squares the reverse alphabet position.

### `DOUBLED_POSITION`

Multiplies by two instead of squaring.

### `OFF_BY_ONE_BEFORE_SQUARE`

Uses `A=0` or shifts the position before squaring.

Nearest explanation note:

```text
First find the ordinary position, then square that position.
```

## 8. Independent single-letter shift plus fixed number delta

Candidate solve contract:

```text
LETTER_NUMBER -> LETTER_NUMBER
independent fixed letter shift and fixed whole-number add/subtract
```

Owned misconceptions:

### `LETTER_SHIFT_CORRECT_NUMBER_UNCHANGED`

Applies the letter operation but ignores the number operation.

### `NUMBER_DELTA_CORRECT_LETTER_UNCHANGED`

Applies the number operation but ignores the letter operation.

### `REVERSED_LETTER_SHIFT_DIRECTION`

Uses the correct magnitude with opposite direction.

### `REVERSED_NUMBER_DELTA_DIRECTION`

Adds instead of subtracting or subtracts instead of adding.

### `SWAPPED_SHIFT_MAGNITUDES`

Uses the numeric delta as the letter shift or the letter-shift magnitude as the number delta.

### `APPLIED_NUMBER_DIGITWISE`

Splits the whole number into digits despite the whole-number contract.

Nearest explanation note:

```text
The letter and the whole number follow two separate fixed operations; apply both in the same directions as the source pair.
```

## 9. Shared delta across cluster and number

Candidate solve contract:

```text
CLUSTER_NUMBER -> CLUSTER_NUMBER
same signed delta on every letter and the whole number
```

Owned misconceptions:

### `TREATED_SHARED_DELTA_AS_INDEPENDENT`

Uses different shifts for letters and number.

### `SHIFTED_ONLY_FIRST_LETTER`

Applies the delta to one cluster position only.

### `SHIFTED_LETTERS_NUMBER_UNCHANGED`

Ignores the number component.

### `NUMBER_SHIFTED_LETTERS_UNCHANGED`

Ignores the cluster component.

### `REVERSED_SHARED_DELTA_DIRECTION`

Applies the same magnitude with the opposite sign to all components.

### `PROGRESSIVE_SHIFT_INSTEAD_OF_UNIFORM`

Uses increasing/decreasing letter shifts rather than one common amount.

Nearest explanation note:

```text
The same signed amount is applied to every letter and to the whole number.
```

## 10. Independent cluster vector plus fixed numeric delta

Candidate solve contract:

```text
CLUSTER_NUMBER -> CLUSTER_NUMBER
fixed positional letter vector plus separate fixed signed number delta
```

Owned misconceptions:

### `TREATED_VECTOR_AS_SHARED_DELTA`

Uses one common letter shift or applies the number delta to every letter.

### `SWAPPED_VECTOR_POSITIONS`

Applies the first letter shift to the second letter and vice versa.

### `REVERSED_ONE_VECTOR_SIGN`

Gets one position direction wrong.

### `REVERSED_NUMBER_DELTA_DIRECTION`

Uses the opposite numeric sign.

### `LETTER_VECTOR_CORRECT_NUMBER_UNCHANGED`

Ignores the number operation.

### `NUMBER_DELTA_CORRECT_VECTOR_WRONG`

Applies the number correctly but uses a nearby letter vector.

### `USED_PAIR_INDEX_PROGRESSION`

Invents changing vectors across evidence pairs; this misconception points toward CP-009 and should not create a valid alternative relation.

Nearest explanation note:

```text
Track each letter position separately, then apply the independent fixed change to the whole number.
```

## 11. Exact rational multiplier plus letter vector

Candidate solve contract:

```text
CLUSTER_NUMBER or NUMBER_CLUSTER -> same token order
fixed letter vector plus exact rational multiplier
```

Owned misconceptions:

### `ADDED_FACTOR_INSTEAD_OF_MULTIPLIED`

Adds the numerator/factor.

### `MULTIPLIED_BY_DENOMINATOR_ONLY`

Uses denominator or numerator alone incorrectly.

### `INVERTED_RATIONAL_FACTOR`

Uses `denominator/numerator`.

### `ROUNDED_NON_INTEGRAL_RESULT`

Rounds or truncates a non-integral product.

This should normally be rejected by eligibility before option creation; it may appear in explanations as a forbidden method.

### `MULTIPLIER_CORRECT_LETTER_VECTOR_WRONG`

Numeric result correct, cluster wrong.

### `LETTER_VECTOR_CORRECT_MULTIPLIER_WRONG`

Cluster correct, nearby multiplier error.

### `TOKEN_ORDER_REVERSED`

Correct components in the wrong order for number-first versus cluster-first forms.

Nearest explanation note:

```text
Apply the exact factor to the whole number; the division must be exact. Transform the letters independently and keep the original token order.
```

## 12. Direct cube plus letter vector

Candidate solve contract:

```text
CLUSTER_NUMBER -> CLUSTER_NUMBER
number^3 plus fixed letter vector
```

Owned misconceptions:

### `SQUARED_INSTEAD_OF_CUBED`

Uses `n²`.

### `MULTIPLIED_BY_THREE`

Uses `3n`.

### `CUBED_SUCCESSOR`

Uses `(n+1)³` without source support.

### `CUBE_CORRECT_VECTOR_WRONG`

Correct number, wrong letters.

### `VECTOR_CORRECT_CUBE_WRONG`

Correct letters, nearby numeric power error.

Nearest explanation note:

```text
Cube the displayed whole number directly; do not add one or take a root first.
```

## 13. Perfect-square-to-cube plus letter vector

Candidate solve contract:

```text
n = r^2 -> r^3
```

Owned misconceptions:

### `CUBED_DISPLAYED_NUMBER`

Uses `n³` instead of recovering the square root base.

### `RETURNED_SQUARE_ROOT_ONLY`

Stops at `r`.

### `SQUARED_ROOT_AGAIN`

Returns the original `n`.

### `MULTIPLIED_BY_ROOT`

This is mathematically the correct implementation `n*r`; do not use as a misconception when it gives the intended answer.

### `USED_NEAREST_SQUARE`

Approximates a non-square input; such input must be excluded entirely.

### `POWER_CORRECT_VECTOR_WRONG`

Correct numeric stage, wrong cluster vector.

Nearest explanation note:

```text
Recognize the displayed number as a perfect square, recover its base, and cube that base.
```

## 14. Exact cube root of successor plus letter vector

Candidate solve contract:

```text
cube_root(n+1)
```

Owned misconceptions:

### `OMITTED_PLUS_ONE_BEFORE_CUBE_ROOT`

Uses `cube_root(n)`.

### `USED_SQUARE_ROOT_INSTEAD_OF_CUBE_ROOT`

Uses the wrong root degree.

### `CUBED_INSTEAD_OF_ROOTED`

Applies the inverse operation incorrectly.

### `APPROXIMATED_NON_PERFECT_CUBE`

Rounds a cube root. Non-perfect domains must be excluded.

### `ROOT_CORRECT_VECTOR_WRONG`

Correct numeric result, wrong letters.

### `VECTOR_CORRECT_ROOT_WRONG`

Correct letters, wrong root calculation.

Nearest explanation note:

```text
Add one first, then verify that the result is a perfect cube and take its exact cube root.
```

## 15. Exact square root of successor plus letter vector

Candidate solve contract:

```text
sqrt(n+1)
```

Owned misconceptions:

### `OMITTED_PLUS_ONE_BEFORE_SQUARE_ROOT`

Uses `sqrt(n)`.

### `USED_CUBE_ROOT_INSTEAD_OF_SQUARE_ROOT`

Uses the wrong root degree.

### `SQUARED_INSTEAD_OF_ROOTED`

Applies the inverse operation incorrectly.

### `APPROXIMATED_NON_PERFECT_SQUARE`

Rounds a square root. Non-perfect domains must be excluded.

### `ROOT_CORRECT_VECTOR_WRONG`

Correct number, wrong letters.

### `TOKEN_ORDER_REVERSED`

Correct components rendered cluster-first instead of number-first.

Nearest explanation note:

```text
Add one first, take the exact square root, transform the letters, and keep the number-first order.
```

## 16. Digit-sum-square successor invariant

Candidate solve contract:

```text
NUMBER_LETTER -> NUMBER_LETTER
number + 1; letter = square(digit sum of number) mapped to A-Z
```

Owned misconceptions:

### `TREATED_LETTER_AS_FIXED_SHIFT`

Infers a direct letter shift rather than recomputing from the new number.

### `DID_NOT_INCREMENT_NUMBER`

Recomputes or preserves the letter using the original number.

### `SQUARED_NUMBER_INSTEAD_OF_DIGIT_SUM`

Uses `number²`.

### `USED_DIGIT_SUM_WITHOUT_SQUARE`

Maps the digit sum directly to a letter.

### `SQUARED_DIGITS_SEPARATELY`

Squares each digit and combines them.

### `OFF_BY_ONE_LETTER_MAPPING`

Computes the correct square but maps to the wrong neighboring letter.

### `NUMBER_CORRECT_REUSED_INPUT_LETTER`

Increments the number but leaves the attached letter unchanged.

Nearest explanation note:

```text
The letter is not shifted independently. Recompute it from the digit sum of the new number.
```

## 17. Pair-selection task misconceptions

### Equivalent-pair selection

Owned task-level errors:

- `MATCHED_ONLY_LETTER_COMPONENT`;
- `MATCHED_ONLY_NUMBER_COMPONENT`;
- `MATCHED_ONE_REFERENCE_PAIR_ONLY`;
- `USED_WRONG_TOKEN_ORDER`;
- `USED_NEARBY_REGISTERED_OPERATION`.

Permanent ownership remains pending an exact official mixed fixture.

### Odd/incorrect-pair selection

Owned task-level errors:

- selecting a valid pair because its values look unusual;
- checking only one component;
- applying different rules to different options;
- using one pair as the reference instead of the shared relation across three valid pairs.

The explanation must identify the common relation across the three valid options and state exactly how the odd option breaks it.

## 18. Forbidden distractor practices

Do not use:

- arbitrary random letters/numbers;
- malformed tokens;
- duplicate options with different spacing/case;
- approximate roots;
- decimal outputs where the contract requires integers;
- unregistered reverse-position formulas;
- a valid CP-005/006/numeric relation as an accidental second answer;
- a CP-009 progressive vector as a pair-local distractor;
- meaningful-word rules in generic cluster questions;
- coding-decoding grammar as a distractor explanation;
- internal rule IDs in student-facing text.

## 19. Analytics and explanation use

Each generated distractor should carry:

```ts
interface MixedMisconceptionTag {
  code: string;
  solveContract: string;
  stage: "LETTER" | "NUMBER" | "DEPENDENCY" | "RENDERING" | "TASK";
  explanationKey: string;
}
```

The student-facing explanation should not expose the code. It should use natural wording tied to the generated values.

Example internal-to-student mapping:

```text
OMITTED_PLUS_ONE_BEFORE_SQUARE_ROOT
-> "The rule uses the square root after adding 1; taking the root of the original number gives the wrong value."
```

## 20. Remaining work

Before permanent QL allocation:

1. turn these ownership groups into bounded candidate generators;
2. prove at least three safe distractors for every proposed permanent task unit;
3. audit misconception label diversity across seeds;
4. prototype value-specific English rejection notes;
5. verify Hindi and Punjabi explanation parity;
6. run cross-topic matchers against every distractor;
7. remove any label that cannot produce enough realistic safe instances;
8. split a solve contract if one template requires incompatible misconception sets.
