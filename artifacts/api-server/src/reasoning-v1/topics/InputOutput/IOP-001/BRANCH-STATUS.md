# IOP-001 Branch Status

## Current stage

`QUESTION_STUDIO_REVIEW_ONLY / BANKING_EXAM_READY`

IOP-001 — Machine Input–Output & Sequential Rearrangement is connected to the real Question Studio review workflow on branch `feat/iop-001-question-studio-v1`.

English, Hindi and Punjabi learner authorities remain content-addressed and frozen. Question Studio may generate review items. Question Bank storage, test/mock eligibility and public delivery remain disabled.

## Exam-readiness scope

The chapter is currently validated for the **Banking** exam profile only.

The Question Studio runtime and dedicated admin panel fail closed for explicit SSC, Railway or Punjab State exam tags. Those surfaces require a separate source/pattern audit before they can inherit IOP-001 coverage.

The Banking profile is deliberately generic rather than hard-coded to a single stage because current preparation patterns vary by banking exam/stage, while Machine Input–Output remains fundamentally a Banking reasoning family.

## Permanent authority

- Permanent QLs: 8
- Frozen source modes: 19
- Solve/query modes: 8
- Languages: English, Hindi, Punjabi
- Question Studio: enabled for review generation
- Question Bank: OFF
- test/mock eligibility: OFF
- public publication: OFF

## Difficulty routing

QL001 is mixed at source-mode level:

Easy:
- `QL001_WORD_ALPHA_ASC_LEFT`
- `QL001_WORD_ALPHA_DESC_RIGHT`
- `QL001_NUMBER_ASC_LEFT`

Medium:
- `QL001_WORD_LENGTH_ASC_LEFT`
- `QL001_NUMBER_DIGIT_SUM_ASC_LEFT`
- `QL001_WORD_LENGTH_DESC_RIGHT`

QL002–QL004 are Medium.
QL005–QL008 are Hard.

Question Studio filters the actual source modes by requested difficulty. Dedicated regression proof confirms no Easy/Medium cross-contamination.

## Question Studio vocabulary safety

QL006 word-transformation generation keeps the frozen learner authority intact but resamples caselets containing raw vocabulary that is unsuitable for competitive-exam presentation.

Current Question Studio-only blocked tokens:

- `sphynx`
- `gypsy`
- `syzygy`
- `myrrh`
- `psych`
- `spryly`
- `tryst`
- `trysts`
- `slyly`

Vocabulary safety proof generated 720 QL006 questions across English/Hindi/Punjabi from 180 safe caselets with zero blocked-token leakage.

## Fresh exam-readiness pass

The final Banking-profile audit covers:

- 684 generated questions
- 19 source modes
- 8 solve/query modes
- English/Hindi/Punjabi
- stem length 32–189 characters
- explanation length 168–1149 characters
- answer-position distribution 169 / 145 / 178 / 192

The audit checks direct exam-style wording, four distinct non-empty options, exactly one correct option, answer ancestry, absence of engineering leakage, explanation substance, native localized script, demonstration/new-input separation, bounded presentation length, duplicate protection, answer-position spread, and explicit Banking exam-profile approval.

Separate scale proof remains green for 456 unique questions across all 19 source modes, 8 solve modes and 3 languages.

## Frozen hashes

English learner-content SHA256:

`58a91a0dd0b5faeb0e601e8d5b587a0f7768a65c246530f5bb316b73b9232413`

Hindi/Punjabi localized learner-content SHA256:

`5636b216409fa487a3cbdd41f79bdc3606c411298b266b717d51aeba3fbf2213`

Both hashes remain unchanged by Question Studio exam-profile and vocabulary-selection hardening.

## Validation authority

Runtime/content head validated before the final metadata pin:

`31d1c1b62a57b3c15bfd0c7eec6c99d37308a6d9`

Runtime/content validation run:

`32112415757 — SUCCESS`

Metadata status head:

`9ff194263118e4b424aa4ff7e7321af2b88aaabe`

Metadata validation run:

`32112827782 — SUCCESS`

This current file content is unchanged in substance from that validated metadata status; learner content and runtime behavior remain unchanged.

## Non-blocking future V2 editorial opportunities

These are not blockers for the current Banking Question Studio review stage and were intentionally not changed because the learner wording is frozen:

- vary positional questions between left and right reference directions;
- smooth a few reverse/missing-step English sentences for more natural Testbook-style phrasing;
- make some numeric/step distractors more deliberately near-miss.

Any such learner-facing change belongs in a separately reviewed English V2 followed by Hindi/Punjabi parity review.
