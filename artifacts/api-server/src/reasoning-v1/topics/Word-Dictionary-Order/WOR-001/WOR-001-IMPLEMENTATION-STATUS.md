# WOR-001 Implementation Status — Editorial Review V1

## Current implementation

- five-checkpoint, review-only runtime;
- **24 prototypes / 20 task kinds**;
- **8 recommended permanent QL roots**;
- **8 source-deferred contracts**;
- **8 instance variants**;
- **60 real-word families / 720 globally unique provisional words**;
- real-word split: **18 Easy / 20 Medium / 22 Hard**;
- **60 Banking cluster families / 720 globally unique three-letter clusters**;
- Banking split: **20 Easy / 20 Medium / 20 Hard**;
- classic four-option and Banking five-option profiles;
- independent classic and Banking verification;
- EN/HI/PA generation;
- student-facing Banking editorial layer in EN/HI/PA;
- Question Studio/public visibility disabled.

## Pool status

The pool-expansion checkpoint remains valid and was not reopened. The chapter retains 60 real-word families / 720 words and 60 Banking families / 720 clusters with the existing Easy/Medium/Hard saturation and uniqueness evidence.

The next problem was editorial quality, not object count.

## Editorial Review V1 result

The classic CP-001 to CP-004 review pack was inspected from the first question onward and across representative Easy/Medium/Hard families. No classic solver/distractor defect justified a logic rewrite.

CP-005 Banking required presentation remediation. The current branch now:

- removes `structuredPrompt.transformedWords` from student-facing Question Studio output;
- keeps full transformed-state evidence only in internal Banking metadata;
- prevents Banking review packs from exposing transformed groups before the answer;
- replaces mechanical English wording such as `character N from`, `move 1 places`, and numeric `alphabet offset` explanations;
- renders natural ordinal group/letter queries;
- remediates Hindi/Punjabi numeric-offset phrasing;
- uses direct/oblique ordinal forms where Hindi/Punjabi grammar requires them;
- protects these decisions with `wor-001-editorial.test.ts`.

Detailed evidence: `WOR-001-EDITORIAL-REVIEW-V1.md`.

## Automated evidence

### Classic runtime

- 6,840 localized generations;
- four answer positions: `[570, 570, 570, 570]`;
- **60/60 real-word families reached**;
- source/difficulty/independent-solver gates passed.

### Expanded real-word saturation

- 60 families / 720 words;
- tier counts: `{ EASY: 18, MEDIUM: 20, HARD: 22 }`;
- all family/token/ID uniqueness gates passed;
- all families reached in the 900-seed-per-tier audit;
- visible-set uniqueness >= 90% per tier;
- Easy shared-prefix question rate: **0.322**.

### Banking runtime and reservoir

- CP-005: 1,980 localized generations;
- answer positions: `[131, 134, 135, 126, 134]`;
- every Banking task and transformation covered;
- 60 families / 720 clusters;
- tier counts `{ EASY: 20, MEDIUM: 20, HARD: 20 }`;
- unique visible sets over 1,000 builds: Easy **974**, Medium **963**, Hard **975**;
- independent transform/sort/answer parity passed.

### Editorial/review validation

- 136-question classic English review pack retained;
- 33-question CP-005 review pack generated per locale;
- EN/HI/PA student-facing transformation-leak guard passed;
- EN wording and HI/PA ordinal/case grammar guards passed;
- full source/corpus/pool audits passed after editorial changes;
- API production build passed.

Last full green validation before status freeze: GitHub Actions run `31987601048` on 2026-08-17. Documentation-only commits after that do not alter runtime behavior.

## Current maturity

`ARCHITECTURE_COMPLETE_POOLS_SATURATED_EDITORIAL_REMEDIATED_REVIEW_ONLY`

## Release posture

Keep all public gates closed:

- permanent QL count: **0**;
- `questionStudioVisible: false`;
- `publicReleaseEnabled: false`;
- lifecycle: `REVIEW_ONLY`.

## Remaining gates

1. Final human English editorial sampling.
2. Native Hindi and Punjabi human sign-off.
3. Freeze the eight recommended permanent QL roots after acceptance.
4. Integrate/rebase this accepted checkpoint onto current `New-main` and rerun the full WOR validation there.
5. Only after those gates should Question Studio/public activation be considered.

The next substantive checkpoint is **native sign-off + QL freeze/integration**, not further raw pool expansion.
