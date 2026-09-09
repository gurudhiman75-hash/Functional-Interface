# Quant V4 Empirical Difficulty Calibration — P2

**Authority:** `QUANT-V4-EMPIRICAL-DIFFICULTY-CALIBRATION-P2`  
**Status:** calibration mechanism implemented; production exam-profile thresholds **not yet adopted**  
**Mutation policy:** advisory only; no automatic Question Bank difficulty rewrite

## Why this checkpoint exists

`Easy`, `Medium` and `Hard` must eventually describe how real learners experience a question in the target exam context, not only how an author or generator expected the item to behave.

Quant V4 therefore needs a second difficulty layer:

1. **authored difficulty** — the pre-publication design intent used while the engine is being built;
2. **empirical difficulty candidate** — a post-attempt signal supported by enough real learner evidence.

The empirical layer does not erase the authored label automatically. A change remains a reviewable content decision.

## Canonical telemetry already exists

No new learner-tracking schema is required for the first calibration authority.

The published test runner currently persists, for each evaluated question response:

- `learning.attempt_responses.question_version_id`;
- `learning.attempt_responses.is_correct`;
- `learning.attempt_responses.time_spent_seconds`;
- attempt identity.

The parent `learning.attempts` record provides the immutable evaluated attempt and its publication/test context. The published test is linked through the assessment/catalog hierarchy to the exam family/version.

This means the calibration pipeline can operate from canonical scored-test evidence instead of generator guesses.

## Evidence inclusion rules

For one question version + one target exam profile:

- include only evaluated **REAL** attempts;
- exclude PRACTICE attempts;
- exclude unanswered/invalid response rows from the accuracy denominator;
- count at most the learner's first eligible observation for that question/profile, so repeated attempts do not overweight one learner;
- accept question timing only inside the adopted policy's sane timing window;
- require a profile-level median question-time baseline before using the time signal.

The first implementation keeps all thresholds configurable by an explicit `EmpiricalDifficultyPolicy`.

## Signals

### Accuracy

The authority records:

- eligible attempts;
- unique learners;
- proportion correct;
- Wilson confidence interval for proportion correct.

The confidence interval—not the point estimate alone—is used for candidate classification. This avoids relabeling a question because of a small or noisy sample.

### Time

The authority records the question's median valid response time and divides it by the adopted profile median question time.

This makes timing relative to the target exam rather than imposing one universal seconds threshold across SSC, Banking and Punjab exams.

### Discrimination

When attempt-level score/ability context is available, the authority reports a high-vs-low ability discrimination index. A materially negative index is treated as a data/content-quality warning because it can indicate a bad key, ambiguity or a distorted sample.

Missing discrimination data is diagnostic; it does not fabricate a result.

## Candidate classification rule

A production policy must explicitly supply:

- minimum attempts;
- minimum unique learners;
- minimum timing coverage;
- sane timing range;
- Easy accuracy floor;
- Hard accuracy ceiling;
- Easy time-ratio ceiling;
- Hard time-ratio floor;
- discrimination evidence policy.

Given an adopted policy:

- **Easy candidate** requires the lower confidence bound to clear the Easy accuracy floor **and** median time to remain at/below the Easy time ratio;
- **Hard candidate** requires the upper confidence bound to remain at/below the Hard accuracy ceiling **and** median time to remain at/above the Hard time ratio;
- **Medium candidate** requires the entire accuracy confidence interval to sit between the Hard and Easy bands and timing to sit between the corresponding time bands;
- conflicting signals remain `AMBIGUOUS_EMPIRICAL_SIGNAL`.

No forced 30/40/30 or one-third distribution is used.

## Fail-closed states

The authority returns one of:

- `INSUFFICIENT_EMPIRICAL_EVIDENCE`;
- `AMBIGUOUS_EMPIRICAL_SIGNAL`;
- `DATA_QUALITY_REVIEW_REQUIRED`;
- `EMPIRICAL_DIFFICULTY_CANDIDATE`.

Common blockers include:

- too few real attempts;
- too few unique learners;
- inadequate timing coverage;
- missing profile timing baseline;
- suspect negative discrimination;
- conflicting accuracy/time evidence.

## Important exam-profile rule

Difficulty is contextual. The same mathematical question may calibrate differently in an SSC Tier-I section and in a Banking Mains section because the learner pool, pacing and paper context differ.

Therefore evidence must remain scoped by **question version + exam profile**. A future global Question Bank label may use these profile-specific candidates as review evidence, but this P2 authority does not collapse them prematurely.

## Production threshold policy

This PR intentionally does **not** publish arbitrary production thresholds. The test suite uses a named synthetic policy only to prove Easy/Medium/Hard, sparse-evidence, ambiguous-signal, repeat-learner and missing-baseline behavior.

A real profile becomes calibration-enabled only after ExamTree explicitly adopts thresholds based on sufficient production attempt evidence.

## Relationship to the Real Exam Simulation and PYQ weighting gates

The three authorities answer different questions:

- Real Exam Simulation: *does a complete section structurally resemble the target exam?*
- PYQ Frequency Evidence: *is the topic/representation mix supported by countable exam evidence?*
- Empirical Difficulty Calibration: *do real learners experience each published question at the intended difficulty?*

All three should be measured independently. Passing one must never silently satisfy another.
