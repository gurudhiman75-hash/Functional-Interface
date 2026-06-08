# NS-LCM-001 Canonical Problems

## Archetype

Archetype ID: NS-LCM-001

Name: Least Common Multiple

Status: PHASE A ARCHITECTURE DISCOVERY PACKAGE CREATED

Implementation Status: NOT IMPLEMENTED

Library Status: NOT CREATED

## Canonical Problem Discovery

Minimum non-redundant CP set:

- CP-001 through CP-005

Distinct topology count: 5

Mathematical topology analysis:

LCM problems are built around a shared object:

LCM(numbers) = product of every prime base appearing in any operand using the maximum exponent across all operands.

The retained CP set asks for distinct outputs or distinct educational tasks derived from this object:

- CP-001 asks for the LCM value directly.
- CP-002 asks the learner to recognize a recurring-together or synchronization setting as an LCM problem.
- CP-003 asks for a missing operand under a fixed LCM condition.
- CP-004 asks for the number of common multiples in a finite range.
- CP-005 asks for the smallest common multiple greater than a threshold.

The architecture avoids separate CPs for wording variations or method variations.

## Active Canonical Problems

Active CP range: CP-001 through CP-005 only.

### CP-001 Direct LCM Computation

Find the least common multiple of two, three, or more positive integers.

Inputs:

- numbers

Output:

- lcm

Educational objective:

Compute the least positive integer divisible by every given number exactly.

Mathematical topology:

Direct LCM Computation.

The learner identifies all prime factors appearing in any operand and keeps the maximum exponent for each prime factor.

Why it is distinct:

The final output is the LCM value itself.

Why it is not redundant:

Two-number LCM, three-number LCM, multi-number LCM, smallest number divisible by all given numbers, LCM using prime factorization, and LCM using division method are all variations of this same topology.

Operand count and solution method are difficulty and explanation dimensions, not separate canonical problems.

Example:

12 = 2^2 x 3

18 = 2 x 3^2

LCM = 2^2 x 3^2 = 36

### CP-002 Common Cycle Synchronization

Find when repeated events occur together again.

Inputs:

- cycle lengths

Output:

- firstCommonTime

Educational objective:

Recognize that recurring-together events meet again after the LCM of their cycle lengths.

Mathematical topology:

Synchronization Through LCM.

The cycle lengths are translated into an LCM computation.

Why it is distinct:

The educational task includes recognizing the LCM structure from a time, cycle, bell, clock, runner, or recurring-event context.

Why it is not redundant:

The numerical computation becomes CP-001 after translation, but the problem topology includes semantic recognition of synchronized recurrence.

Examples:

- Bells ringing together again.
- Runners meeting again at the starting point.
- Lights blinking together again.
- Clocks or alarms recurring together.

### CP-003 Missing Number Using LCM

Find a missing number when the LCM condition and enough constraints are given.

Inputs:

- known operands
- targetLcm
- uniqueness condition

Output:

- missingNumber

Educational objective:

Use the structure of LCM to find a missing operand that satisfies a fixed LCM condition.

Mathematical topology:

Missing-Value Under Target LCM.

The missing number must contribute only prime powers compatible with the target LCM, and the full operand set must have exactly targetLcm as its LCM.

Why it is distinct:

The output is a reconstructed operand, not the LCM value.

Why it is not redundant:

Direct computation is not enough. The learner must reason backward from an LCM constraint.

Uniqueness requirement:

Future generation must guarantee a unique answer by providing a range, candidate list, divisibility condition, arithmetic condition, or equivalent visible constraint.

Underdetermined prompts are not allowed.

Example boundary:

If LCM(12, x) = 60, several values of x are possible.

This is not valid unless the prompt includes enough information to make x unique.

### CP-004 Count Common Multiples In A Range

Count the positive integers in a given range that are common multiples of all given numbers.

Inputs:

- numbers
- lowerBound
- upperBound

Output:

- commonMultipleCount

Educational objective:

Recognize that common multiples of the given numbers are exactly multiples of their LCM, then count those multiples in a finite range.

Mathematical topology:

Range Count Of Multiples Of LCM.

Compute LCM(numbers), then count multiples of that LCM between lowerBound and upperBound.

Why it is distinct:

The answer is a count, not the LCM value.

Why it is not redundant:

The learner must apply a range-counting step after the LCM is known.

Derived topology status:

CP-004 is derived from CP-001 plus range-based multiple counting, but remains active because the output and reasoning path are educationally distinct.

### CP-005 Smallest Common Multiple Greater Than A Threshold

Find the least common multiple of the given numbers that is greater than a specified threshold.

Inputs:

- numbers
- threshold

Output:

- smallestCommonMultipleAboveThreshold

Educational objective:

Recognize that all common multiples are multiples of the LCM, then select the first such multiple greater than the threshold.

Mathematical topology:

Threshold-Based Multiple Selection.

Compute LCM(numbers), then find the smallest multiple of that LCM greater than threshold.

Why it is distinct:

The answer is a selected common multiple under an inequality condition, not the base LCM value and not a count.

Why it is not redundant:

The learner must perform a ceiling-style multiple selection after computing or recognizing the LCM.

## Candidate Evaluation

| Candidate | Decision | Reason |
| --- | --- | --- |
| Two-number LCM | Merged into CP-001 | Operand count is a difficulty and coverage dimension. |
| Three-number LCM | Merged into CP-001 | Same output and solver topology as direct LCM. |
| Multi-number LCM | Merged into CP-001 | Same direct LCM topology with larger operand count. |
| Smallest number divisible by all given numbers | Merged into CP-001 | Wording synonym for direct LCM. |
| Common cycle synchronization | Retained as CP-002 | Requires contextual recognition of recurring-together structure. |
| Bells/runners/clocks recurring together | Merged into CP-002 | Context families within synchronization topology. |
| Missing number using LCM | Retained as CP-003 | Reverse reasoning with missing operand output. |
| Count common multiples in a range | Retained as CP-004 | Range-count output is distinct from LCM value. |
| Smallest common multiple greater than a threshold | Retained as CP-005 | Inequality-based selected multiple is distinct from count and base LCM. |
| LCM via prime factorization wording | Merged into CP-001 | Reasoning method, not a separate CP. |
| LCM via division method wording | Merged into CP-001 | Reasoning method, not a separate CP. |

## Non-Redundancy Summary

The retained CPs are distinct because each has a different educational output or recognition task:

- CP-001 outputs the LCM value.
- CP-002 outputs the first common recurrence time after contextual translation.
- CP-003 outputs a missing operand.
- CP-004 outputs a count of common multiples in a range.
- CP-005 outputs a selected common multiple above a threshold.

CP-002, CP-004, and CP-005 are intentionally dependent on LCM computation, but they are retained because their educational surfaces are not simple wording variants of CP-001.

## Removed Candidate CPs

### Two-Number LCM

Removed as a standalone CP.

Reason:

It is absorbed into CP-001 as the base operand-count case.

### Three-Number LCM

Removed as a standalone CP.

Reason:

It is absorbed into CP-001 as an operand-count variation and difficulty driver.

### Multi-Number LCM

Removed as a standalone CP.

Reason:

It is absorbed into CP-001. Operand count affects complexity but not topology.

### Smallest Number Divisible By All Given Numbers

Removed as a standalone CP.

Reason:

It is a wording form of direct LCM.

### Bells/Runners/Clocks Recurring Together

Merged into CP-002.

Reason:

These are context families of common cycle synchronization.

### LCM Via Prime Factorization

Removed as a standalone CP.

Reason:

It is a reasoning method for CP-001, not a distinct output topology.

### LCM Via Division Method

Removed as a standalone CP.

Reason:

It is a reasoning method for CP-001, not a distinct output topology.

## Phase A Boundary

No question language, explanation language, variable ranges, coverage targets, distribution targets, tests, audits, or runtime implementation are authorized by this document.
