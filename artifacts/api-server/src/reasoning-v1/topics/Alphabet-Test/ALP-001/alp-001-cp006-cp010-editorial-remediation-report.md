# ALP-001 CP-006–CP-010 Editorial Remediation Report

## Trigger

A senior editorial review found that the new completion checkpoints were mathematically sound and multilingual-seed aligned, but their learner-facing presentation exposed generator language:

- procedural `Given ... First ... then ...` stems;
- three repeated generic distractor sentences;
- compressed multi-stage working;
- literal engineering terminology in Hindi and Punjabi.

## Canonical scope correction

The review described `ALP-QL-001` through `ALP-QL-152` as the permanent inventory. The canonical repository inventory is:

- complete chapter: `ALP-QL-001` through `ALP-QL-156`;
- completion editorial boundary: `ALP-QL-105` through `ALP-QL-156`;
- completion QLs: 52;
- total chapter QLs: 156.

Therefore the remediation includes the four final CP-010 identities `ALP-QL-153` through `ALP-QL-156` rather than leaving them outside the audit.

## Changes

### Natural exam stems

Every CP-006 through CP-010 solve mode now has a learner-facing SSC/RRB/Bank-style question form. The renderer states the actual word, number, sequence, transformation, target position, direction and category without exposing internal operation codes.

### Worked solutions

Completion explanations now contain at least three instructional stages. Multi-stage letter transformations show:

1. the original word;
2. the row after the letter-class rule;
3. the row after sorting or reversal;
4. the requested result.

Pair and adjacency questions list the accepted pairs or neighbouring groups used in the final count.

### Option-specific trap analysis

Each wrong option is identified by visible option number and value. The explanation checks that concrete value against the relevant pair gap, final position, transformed sequence, unchanged-position set or adjacency set.

### Regional language cleanup

The learner-facing renderer uses natural exam vocabulary such as:

- Hindi: `श्रृंखला`, `स्थान`, `प्रतीक`, `साथ वाला युग्म`;
- Punjabi: `ਲੜੀ`, `ਥਾਂ`, `ਨਿਸ਼ਾਨ`, `ਨਾਲ ਵਾਲਾ ਜੋੜਾ`.

Raw terms such as `तत्त्व-पंक्ति`, `ਤੱਤ-ਕਤਾਰ` and literal `adjacent window` translations are rejected by regression tests.

### Answer-leak removal

`IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT` no longer exposes the correct option as its structured source word or source sequence. The correct word appears only after the option has been evaluated in the solution.

## Preservation boundary

The remediation does not change:

- QL IDs or checkpoint allocation;
- deterministic parameter generation;
- mathematical answers;
- option values or correct indices;
- English/Hindi/Punjabi seed parity;
- review-only lifecycle status.

## New hard gates

The completion audit now rejects:

- synthetic directive stems;
- generic completion trap boilerplate;
- engineering terminology in Hindi/Punjabi;
- stems that are not complete questions;
- traps without visible option labels;
- worked solutions with fewer than three stages;
- answer leakage in the word-selection family;
- any inventory other than 156 continuous QLs ending at `ALP-QL-156`.
