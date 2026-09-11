# ANA-001 Final Audit Status — 2026-09-11

Status: `REMEDIATION_VALIDATION_IN_PROGRESS`

This status note records executable evidence only. It does not promote provisional QLs, connect Question Studio, or enable publication.

## Closed remediation findings

- ANA-CP-001 semantic difficulty no longer derives from fact-array position.
- ANA-CP-003 difficulty is generated-instance/structural rather than QL-order based.
- ANA-CP-003 supports source-style multi-reference numeric analogy presentation without inventing a new solve contract.
- ANA-CP-003 runtime options contain zero generic arithmetic near-value fallbacks in the 2,400-question audit batch: all 7,200 wrong options are misconception-grounded.
- ANA-CP-004 difficulty is structural rather than seed-selected magnitude fitting.
- ANA-CP-010 source-gap prototypes cover 18 provisional QLs (`ANA-QL-251..268`) and pass independent-solver, uniqueness, answer-position, difficulty and EN/HI/PA parity gates.
- CP-009 remains quarantined with zero permanent QLs; `ANA-QL-269..274` remain unallocated.

## Current executable evidence

- CP001 answer positions: `900 / 900 / 900 / 900`.
- CP003: 2,400 generated questions; `600 / 600 / 600 / 600` answer positions; EASY/MEDIUM/HARD all reachable; 408 multi-reference items; 7,200 misconception distractors; 0 generic fallback distractors.
- CP004: 1,920 generated questions; `480 / 480 / 480 / 480` answer positions; all four layouts and all three missing positions reachable; EASY/MEDIUM/HARD all reachable.
- CP010 numeric/set source-gap proof: 18 provisional QLs; all nine numeric/set rule authorities observed; answer positions `240 / 240 / 240 / 240`.
- CP010 semantic source-gap proof: all nine governed semantic relation families observed; answer positions `90 / 90 / 90 / 90`.
- CP010 localization parity passes for `en-IN`, `hi-IN`, and `pa-IN`.

## Remaining release gates

1. large-batch structural/full-output diversity and fingerprint audit for the remediated authorities;
2. manual exam-realness review of generated stems/options/explanations, especially governed semantic facts and pair distractors;
3. source-to-runtime/compression final decision for provisional `ANA-QL-251..268`;
4. Reasoning-wide exam-profile presentation control remains a separate product release gate.

Until these gates close, PR #1576 remains draft and `ANA-QL-251..268` remain `PROVISIONAL_EXECUTABLE`.
