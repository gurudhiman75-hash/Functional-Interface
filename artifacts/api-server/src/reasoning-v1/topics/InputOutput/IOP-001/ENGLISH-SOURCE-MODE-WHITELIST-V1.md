# IOP-001 — English Source-Mode Whitelist V1

Status: **production-authority whitelist for English review; product delivery remains locked**.

This file is narrower than executable discovery. A transformation is allowed here only when the learner-visible machine semantics are supported by an exam reconstruction or a stable banking-preparation family. The existence of an executable discovery prototype is not sufficient.

## Evidence classes

- `PYQ_RECONSTRUCTION`: memory-based reconstruction tied to a named examination/session.
- `BANKING_PREPARATION_SOURCE`: stable banking-oriented worked example or taxonomy.
- `REPRESENTATION_SUPPORT`: evidence that a topology/family exists; not enough by itself to authorize an arbitrary operation pipeline.
- `QUARANTINED_SYNTHESIS`: executable internal mode that is not authorized for English production.

## Permanent QL whitelist

### IOP-QL-001 — Single Select-and-Fix Rearrangement

Allowed V1 modes:

- alphabetical word selection, ascending or descending, one element fixed per step;
- numerical ascending/descending selection, one element fixed per step;
- word-length based selection when primary values are tie-free;
- digit-sum based numerical selection when primary values are tie-free.

Evidence:

- SATHEE/IIT Kanpur banking study material: alphabetical, numerical, word-length and reversal patterns;
- Careers360 Input-Output guide: shifting, operation, attribute and box families;
- legacy/current banking worked examples for one-sided shifting.

### IOP-QL-002 — Blocked Multi-Category Rearrangement

Allowed V1 modes:

- finish the number phase, then the word phase;
- finish the word phase, then the number phase;
- category direction/end may vary when the illustration uniquely identifies it.

Evidence:

- mixed word-number banking machine examples and standard single/double shifting taxonomies.

### IOP-QL-003 — Simultaneous Multi-Action Rearrangement

Allowed V1 modes:

- two independent selections placed in the same visible step;
- number-number or word-number pairings;
- no hidden ordering between simultaneous actions.

Evidence:

- SATHEE simultaneous-arrangement family;
- Testbook double-shifting taxonomy.

### IOP-QL-004 — Alternating / Interleaved Rearrangement

Allowed V1 modes:

- alternate number/word or opposite-end actions across visible steps;
- two-number/two-word alternate-step machines when the schedule is visible and inferable.

Evidence:

- RBI/banking worked examples of alternating number-word placement and preparation-source classifications.

### IOP-QL-005 — Numeric Transformation Pipeline

Allowed V1 production mode:

`NUM_PARITY_REVERSE_INCREMENT_TWO_ENDED`

Semantics:

1. choose the smallest remaining odd number;
2. reverse its digits and prepend the transformed value to the left fixed region;
3. choose the smallest remaining even number;
4. add 1 and append the transformed value to the right fixed region;
5. both actions occur in the same visible step and repeat until exhausted.

Evidence:

- BankersAdda, *Input Output for Bank Exams*: worked numeric machine where odd numbers are selected low-to-high, digit-reversed and built at the left, while even numbers are selected low-to-high, incremented by one and built at the right.

Explicitly not authorized in V1:

- arbitrary `REVERSE_DIGITS -> SORT -> ADD_DIGIT_SUM -> SORT` pipelines;
- arbitrary last-digit/reversal stage permutations;
- any CP006/CP008 discovery pipeline merely because it is executable.

### IOP-QL-006 — Text / Alphanumeric Transformation Pipeline

Allowed V1 production mode:

`TEXT_RBI_LASTLETTER_VOWELCOUNT_REMOVE_SORT_SHIFT`

Semantics normalized from the text component of the RBI Grade B preparation reconstruction:

1. arrange words by their last letter;
2. arrange words by vowel count;
3. remove vowels from every word;
4. arrange the remaining letters inside each word alphabetically;
5. replace each remaining letter by the second preceding alphabet letter.

Evidence:

- PracticeMock RBI Grade B reasoning reconstruction containing this full five-stage word transformation logic.

V1 restriction:

- production is **text-only** for this QL;
- alphanumeric token transformation remains allocated to the QL family but is not yet English-production-whitelisted;
- discovery-only word rotation, end-letter swapping and arbitrary reverse/sort pipelines remain quarantined.

### IOP-QL-007 — Mixed Word–Number Transformed-Pair Machine

Allowed V1 production mode:

`RBI2024_ASC_WORD_ASC_NUMBER_VOWELS_PLUS_ONE_DIGIT_SUM_PREPEND`

Semantics:

- select alphabetically first remaining word;
- select smallest remaining number;
- replace every vowel by the next alphabet letter;
- replace the number by its digit sum;
- place transformed number-word pair at the left;
- repeat.

Evidence:

- RBI Grade B Phase 1, 8 September 2024 Shift 1 memory-based/PYQ reconstruction.

This mode already has a dedicated independent executor, oracle and 144-rule identifiability grammar.

### IOP-QL-008 — Box / Table Arithmetic Machine

Allowed V1 production mode:

`BOX_CROSS_MULTIPLY_COMBINE_DIVIDE_DIFFERENCE`

Normalized topology:

1. six two-cell input boxes are paired symmetrically (1 with 4, 2 with 5, 3 with 6);
2. Step I forms cross-products for each paired-box group;
3. Step II derives one value per resulting group through a visible additive/subtractive digit rule;
4. Step III forms adjacent quotients;
5. Step IV takes the absolute difference of the two quotients.

Evidence:

- AffairsCloud Machine Input-Output New Pattern Set 37, whose worked solution explicitly shows cross multiplication, additive/subtractive digit processing, division and final subtraction across four stages.

Implementation restriction:

- generated values must avoid zero divisors;
- Step III quotients are rendered to two decimals only when required;
- final answer is recomputed from exact values before display rounding;
- arbitrary pair-swap/sum-difference/reversal discovery pipelines remain quarantined.

## CP010 solve-mode overlay

CP010 does not create additional machine QLs. English production may overlay these query forms on any machine whose trace supports them:

- `STEP_OUTPUT`
- `FINAL_OUTPUT`
- `ELEMENT_AT_POSITION`
- `POSITION_OF_ELEMENT`
- `STEP_NUMBER`
- `PREVIOUS_STEP`
- `MISSING_STEP`
- `REMAINING_STEP_COUNT`

`PREVIOUS_STEP` and `MISSING_STEP` must refer to printed neighbouring/target states; no hidden trace data may be required.

## Production gate

A caselet is English-review eligible only when all of the following are true:

```text
permanent QL allocated
source mode whitelisted
machine trace deterministic
independent oracle parity passes
rule-identifiability gate passes (where hidden-rule inference applies)
query answer independently recomputes
exactly four semantically unique options
exactly one correct option
customized explanation present
product lifecycle flags remain false
```

## Lifecycle

```text
sourceFamilySaturation:       PASS_V1
permanentQlCount:             8
English production authority: IN_IMPLEMENTATION
English freeze:               false
Question Studio:              false
Question Bank:                false
testEligible:                 false
publiclyPublishable:          false
Hindi/Punjabi:                NOT_STARTED
```
