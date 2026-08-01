# SER-001 Natural Explanation Blueprint — V3

This authority applies to every existing and future checkpoint in `SER-001 — Series`.
It is a learner-presentation layer over the validated mathematical generators. It must not change sequence state, options, answers, fingerprints, ownership or lifecycle locks.

The executable interpretation of this blueprint is `ser-v3-natural-authority.ts`. The reusable engine/LLM instruction is recorded separately in `SER-V3-NATURAL-SYSTEM-PROMPT.md`.

## Required four-tier learner contract

Every explanation must contain exactly these visible tiers:

1. `📌 Core Pattern`
2. `📝 Step-by-Step Derivation`
3. `⚡ Exam Speed Shortcut`
4. `⚠️ Common Student Trap`

## Non-spoiling task routing

### Previous-term tasks

- Never begin with the unknown target or a transition starting from it.
- Establish the rule only from known displayed terms.
- State that moving backward requires the inverse of the forward operation.
- Derive the target only after the rule and inverse operation are clear.
- Verify the recovered term by moving forward into the known series.

### Wrong-term tasks

- Build the expected progression first.
- Identify the displayed anomaly only after the expected value is established.
- State both the incorrect displayed term and its exact replacement.

## Voice

Use a warm competitive-exam teacher voice with natural transitions such as:

- `Notice how...`
- `Let us check...`
- `The useful clue is...`
- `To recover the earlier term...`

Avoid mechanical logging language, taxonomy prose and repeated canned openings.

## Mathematical presentation

- Mathematical operations, shifts, equations and transitions use inline MathJax delimiters.
- Single-letter series show standard positions `A=1, B=2, ..., Z=26` beside relevant transitions.
- Every displayed transition that crosses `A/Z` includes the exact normalisation arithmetic, for example `$X(24) \\xrightarrow{+3} A(1)$` because `$24+3=27$` and `$27-26=1$`.
- Ordered vowel or consonant cycles calculate in subset indexes while retaining standard alphabet positions.
- Alternating and interleaved series separate lanes and verify only within the target lane.

## Trap ownership

Every item carries one task- and authority-specific learner warning with a stable public trap code, for example:

- `[DIRECTION_REVERSAL_ERROR]`
- `[EXPECTED_SEQUENCE_NOT_BUILT]`
- `[DIFFERENCE_ORDER_ERROR]`
- `[LANE_MIXING_ERROR]`
- `[VOWEL_CONSONANT_DOMAIN_CONFUSION]`

Wrong-option notes remain inside the Common Student Trap tier; they do not create a fifth explanation tier.

## Applicability

The contract is mandatory for:

- `SER-CP-001` uniform additive series;
- `SER-CP-002` multiplicative and affine series;
- `SER-CP-003` finite-difference series;
- `SER-CP-004` special-number and recurrence series;
- `SER-CP-005` alternating, interleaved and composite series;
- `SER-CP-006` single-letter alphabetic series;
- every later `SER-CP-*` checkpoint.

## Legacy migration safety

`tools/patch_series_explanations.py` is only for already-exported legacy Markdown. It may convert a complete source-shift-target expression such as `Q(17) (+2) S(19)`, but it must never replace an isolated `(+n)` or `(-n)` token because that token may be part of valid arithmetic such as `$5+(2)=7$`.

New outputs must be correct at source through the shared V3 authority layer; the patcher is not a substitute for runtime rendering.

## Review gate

A checkpoint review pack must use the shared V3 authority renderer. Approval remains checkpoint-by-checkpoint: completing this chapter-wide presentation standard does not authorise starting or approving the next checkpoint.
